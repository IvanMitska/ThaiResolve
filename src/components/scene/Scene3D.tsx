import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer } from '@react-three/drei';
import { mergeVertices, mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as THREE from 'three';

const MODEL_URL = '/models/hands.glb';
useGLTF.preload(MODEL_URL);

/** Pointer position in normalized [-1, 1] space, shared across frames. */
const pointer = { x: 0, y: 0 };
/**
 * Scroll state shared across frames.
 *  p       — whole-page progress 0 → 1 (drives the gradient saturation)
 *  connect — hero-range progress 0 → 1 (drives the hands coming together)
 */
const scrollState = { p: 0, connect: 0 };

// Shared glass material settings. resolution is kept modest because the two
// arms each carry a transmission material (two buffer passes per frame).
const GLASS = {
  transmission: 1,
  thickness: 1.1,
  roughness: 0.1,
  ior: 1.5,
  chromaticAberration: 0.05,
  anisotropy: 0.1,
  distortion: 0.18,
  distortionScale: 0.4,
  temporalDistortion: 0.04,
  clearcoat: 0.5,
  clearcoatRoughness: 0.2,
  attenuationColor: '#eafff4',
  attenuationDistance: 8,
  color: '#ffffff',
  resolution: 512,
  samples: 6,
} as const;

// Gradient backdrop seen through the glass. Each stop interpolates between a
// muted "top of page" tone and a vivid "scrolled" tone, so the gradient grows
// more saturated as the visitor scrolls down.
type Stop = [number, [number, number, number], [number, number, number]];
const GRADIENT_STOPS: Stop[] = [
  // offset,  muted (top)        vivid (scrolled)
  [0.0, [0xf2, 0xf1, 0xec], [0xd6, 0xff, 0xe8]],
  [0.22, [0xdc, 0xec, 0xe2], [0x2d, 0xf5, 0x9b]],
  [0.5, [0xc7, 0xe6, 0xd7], [0x00, 0xd9, 0x8c]],
  [0.75, [0xb6, 0xdc, 0xd2], [0x06, 0xb6, 0xab]],
  [1.0, [0xa6, 0xce, 0xc6], [0x05, 0x4a, 0x52]],
];

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

/** Redraw the gradient canvas at saturation level t (0 muted → 1 vivid). */
function drawGradient(ctx: CanvasRenderingContext2D, t: number) {
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  for (const [offset, muted, vivid] of GRADIENT_STOPS) {
    const r = lerp(muted[0], vivid[0], t);
    const gr = lerp(muted[1], vivid[1], t);
    const b = lerp(muted[2], vivid[2], t);
    g.addColorStop(offset, `rgb(${r}, ${gr}, ${b})`);
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 16, 256);
}

/**
 * Split a welded, indexed geometry into its connected components (the two
 * separate arms of the print model) using union-find over shared vertices.
 * Returns one smooth-shaded geometry per component, largest first, with small
 * stray fragments dropped.
 */
function splitConnectedComponents(geo: THREE.BufferGeometry): THREE.BufferGeometry[] {
  const index = geo.getIndex();
  const pos = geo.getAttribute('position');
  if (!index) return [geo];
  const idx = index.array;
  const n = pos.count;

  const parent = new Uint32Array(n);
  for (let i = 0; i < n; i++) parent[i] = i;
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const union = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };
  for (let i = 0; i < idx.length; i += 3) {
    union(idx[i], idx[i + 1]);
    union(idx[i + 1], idx[i + 2]);
  }

  const buckets = new Map<number, number[]>();
  for (let i = 0; i < idx.length; i += 3) {
    const root = find(idx[i]);
    let arr = buckets.get(root);
    if (!arr) {
      arr = [];
      buckets.set(root, arr);
    }
    arr.push(idx[i], idx[i + 1], idx[i + 2]);
  }

  const out: THREE.BufferGeometry[] = [];
  for (const tris of buckets.values()) {
    if (tris.length < 600) continue; // drop stray fragments (< 200 triangles)
    const remap = new Map<number, number>();
    const positions: number[] = [];
    const newIndex: number[] = [];
    for (const vi of tris) {
      let ni = remap.get(vi);
      if (ni === undefined) {
        ni = positions.length / 3;
        remap.set(vi, ni);
        positions.push(pos.getX(vi), pos.getY(vi), pos.getZ(vi));
      }
      newIndex.push(ni);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(newIndex);
    g.computeVertexNormals();
    g.computeBoundingBox();
    out.push(g);
  }
  out.sort((a, b) => (b.getIndex()?.count || 0) - (a.getIndex()?.count || 0));
  return out;
}

function Hands() {
  const { scene } = useGLTF(MODEL_URL);
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const armHigh = useRef<THREE.Group>(null);
  const armLow = useRef<THREE.Group>(null);
  const connectEased = useRef(0); // eased hero-scroll progress

  // Canvas-backed gradient texture that we repaint as scroll progress changes.
  const grad = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    drawGradient(ctx, 0.25);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return { ctx, texture };
  }, []);
  const sat = useRef(0.25);
  const lastDrawn = useRef(0.25);

  // Build the welded mesh, split it into the two arms, and work out the
  // centering/orientation transform and the separation axis used to animate
  // the hands together.
  const model = useMemo(() => {
    const raw: THREE.BufferGeometry[] = [];
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const g = mesh.geometry.clone();
        g.deleteAttribute('normal');
        g.deleteAttribute('uv');
        raw.push(g);
      }
    });

    let merged = raw.length > 1 ? mergeGeometries(raw, false) ?? raw[0] : raw[0];
    try {
      merged = mergeVertices(merged);
    } catch {
      /* keep as-is */
    }

    const components = splitConnectedComponents(merged);

    // Overall bounds → center, scale, and which axis the forearms run along.
    const box = new THREE.Box3().setFromBufferAttribute(
      merged.getAttribute('position') as THREE.BufferAttribute
    );
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    const axes = [size.x, size.y, size.z];
    const longest = axes.indexOf(Math.max(...axes));
    const axis = new THREE.Vector3(longest === 0 ? 1 : 0, longest === 1 ? 1 : 0, longest === 2 ? 1 : 0);
    const rotation: [number, number, number] =
      longest === 0 ? [0, 0, Math.PI / 2] : longest === 2 ? [Math.PI / 2, 0, 0] : [0, 0, 0];

    // Group components into "high" / "low" along the long axis = the two arms.
    const axisVal = (g: THREE.BufferGeometry) => {
      const b = g.boundingBox!;
      return (b.min.getComponent(longest) + b.max.getComponent(longest)) / 2;
    };
    const mid = center.getComponent(longest);
    const highParts = components.filter((g) => axisVal(g) >= mid);
    const lowParts = components.filter((g) => axisVal(g) < mid);

    let split = false;
    let high: THREE.BufferGeometry | null = null;
    let low: THREE.BufferGeometry | null = null;
    if (highParts.length && lowParts.length) {
      high = highParts.length > 1 ? mergeGeometries(highParts, false) : highParts[0];
      low = lowParts.length > 1 ? mergeGeometries(lowParts, false) : lowParts[0];
      split = !!(high && low);
    }

    merged.computeVertexNormals();

    return {
      split,
      high,
      low,
      full: merged,
      center,
      scale: 6.8 / maxDim,
      rotation,
      axis,
      sepDist: size.getComponent(longest) * 0.3,
    };
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Scroll-driven reach: hands sit apart at the top and pull together as the
    // visitor scrolls through the hero. Eased with a slight lag so it feels
    // physical, and reversible when scrolling back up.
    connectEased.current += (scrollState.connect - connectEased.current) * 0.08;
    const c = connectEased.current;
    if (model.split) {
      const sep = model.sepDist * (1 - c);
      armHigh.current?.position.copy(model.axis).multiplyScalar(sep);
      armLow.current?.position.copy(model.axis).multiplyScalar(-sep);
    }
    const connectScale = 0.92 + 0.08 * c; // gentle approach as they meet

    if (inner.current) {
      inner.current.rotation.y = Math.sin(t * 0.18) * 0.22;
      inner.current.rotation.x = Math.cos(t * 0.14) * 0.06;
      inner.current.scale.setScalar(connectScale);
    }
    if (outer.current) {
      outer.current.rotation.y += (pointer.x * 0.25 - outer.current.rotation.y) * 0.04;
      outer.current.rotation.x += (-pointer.y * 0.16 - outer.current.rotation.x) * 0.04;
    }

    // Grow gradient saturation with scroll: muted near the top, ramping hard to
    // vivid by ~55% scroll, with a snappy ease.
    const target = Math.min(1, scrollState.p * 1.8);
    sat.current += (target - sat.current) * 0.16;
    if (Math.abs(sat.current - lastDrawn.current) > 0.003) {
      drawGradient(grad.ctx, sat.current);
      grad.texture.needsUpdate = true;
      lastDrawn.current = sat.current;
    }
  });

  const Glass = () => <MeshTransmissionMaterial {...GLASS} background={grad.texture} />;

  return (
    <group ref={outer}>
      <group ref={inner}>
        <group rotation={model.rotation} scale={model.scale}>
          <group position={[-model.center.x, -model.center.y, -model.center.z]}>
            {model.split ? (
              <>
                <group ref={armHigh}>
                  <mesh geometry={model.high!}>
                    <Glass />
                  </mesh>
                </group>
                <group ref={armLow}>
                  <mesh geometry={model.low!}>
                    <Glass />
                  </mesh>
                </group>
              </>
            ) : (
              <mesh geometry={model.full}>
                <Glass />
              </mesh>
            )}
          </group>
        </group>
      </group>
    </group>
  );
}

/**
 * Full-viewport 3D background — a glass handshake. Fixed behind all content,
 * transparent so the paper surface shows through. The two hands animate
 * together on load; a baked Lightformer environment gives the glass its sheen
 * and a scroll-driven gradient backdrop tints the body. Rendering pauses while
 * the tab is hidden.
 */
export function Scene3D() {
  const [active, setActive] = useState(true);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const onVisibility = () => setActive(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    const onMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const onScroll = () => {
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      scrollState.p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      // Hands reach toward each other across the whole upper page and finish
      // connecting right as the request form comes into view.
      const form = document.getElementById('form');
      let connectEnd = vh * 4;
      if (form) {
        const formTop = form.getBoundingClientRect().top + window.scrollY;
        connectEnd = Math.max(vh, formTop - vh * 0.45);
      }
      scrollState.connect = Math.min(1, Math.max(0, window.scrollY / connectEnd));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 34 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        frameloop={active && !reduced ? 'always' : 'demand'}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[5, 8, 6]} intensity={1.0} />
        <directionalLight position={[-4, -2, 3]} intensity={0.5} />

        {/* Soft gradient studio — reflections that read as glass sheen. */}
        <Environment resolution={256} frames={1} background={false}>
          <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 4, 3]} scale={[10, 8, 1]} />
          <Lightformer form="rect" intensity={1.6} color="#15A865" position={[-5, -3, 2]} scale={[7, 12, 1]} />
          <Lightformer form="circle" intensity={2.2} color="#e8f3ec" position={[5, 2, 3]} scale={6} />
          <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[0, -5, -2]} scale={[10, 6, 1]} />
        </Environment>

        <Suspense fallback={null}>
          <Hands />
        </Suspense>
      </Canvas>
    </div>
  );
}
