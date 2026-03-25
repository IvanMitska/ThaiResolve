import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, FileText, Image } from 'lucide-react';
import { MAX_FILE_SIZE, MAX_FILES, ALLOWED_FILE_TYPES } from '../../config/constants';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
}

export function FileUpload({ files, onFilesChange, error }: FileUploadProps) {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;
      const validFiles: File[] = [];
      Array.from(newFiles).forEach((file) => {
        if (files.length + validFiles.length >= MAX_FILES) return;
        if (!ALLOWED_FILE_TYPES.includes(file.type)) return;
        if (file.size > MAX_FILE_SIZE) return;
        validFiles.push(file);
      });
      if (validFiles.length > 0) {
        onFilesChange([...files, ...validFiles]);
      }
    },
    [files, onFilesChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label style={{ fontSize: '13px', fontWeight: 500, color: '#5C524A' }}>
        {t('form.fields.files')}
      </label>

      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          padding: '28px',
          border: dragActive
            ? '1px dashed #C4654A'
            : '1px dashed #E0DAD2',
          borderRadius: '10px',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          background: dragActive ? 'rgba(196, 101, 74, 0.02)' : 'transparent',
        }}
      >
        <input
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
          disabled={files.length >= MAX_FILES}
        />
        <Upload
          size={24}
          style={{ margin: '0 auto 8px', color: '#8C8078' }}
        />
        <p style={{ fontSize: '14px', color: '#8C8078' }}>
          {t('form.fields.filesHint')}
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {files.map((file, index) => {
            const Icon = getFileIcon(file.type);
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: '#F5F2ED',
                  border: '1px solid #E0DAD2',
                  borderRadius: '8px',
                }}
              >
                <Icon size={18} style={{ color: '#C4654A', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#2C2420',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {file.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#8C8078' }}>
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  style={{
                    padding: '4px',
                    color: '#8C8078',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C4544A')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8C8078')}
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {error && <p style={{ fontSize: '13px', color: '#C4544A' }}>{error}</p>}
    </div>
  );
}
