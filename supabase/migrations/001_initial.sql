-- Create requests table
CREATE TABLE requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  service_type  text NOT NULL,
  status        text NOT NULL DEFAULT 'new',
  name          text NOT NULL,
  messenger_type text NOT NULL,
  messenger_contact text NOT NULL,
  city          text NOT NULL,
  description   text NOT NULL,
  extra_fields  jsonb,
  file_urls     text[],
  notes         text,
  lang          text NOT NULL DEFAULT 'ru'
);

-- Create index for faster queries
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX idx_requests_service_type ON requests(service_type);

-- Enable RLS (Row Level Security)
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (for anonymous submissions)
CREATE POLICY "Anyone can insert" ON requests
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admin) can read
CREATE POLICY "Admin can read" ON requests
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated users (admin) can update
CREATE POLICY "Admin can update" ON requests
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create storage bucket for files
INSERT INTO storage.buckets (id, name, public)
VALUES ('request-files', 'request-files', false)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'request-files');

CREATE POLICY "Admin can read files" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'request-files' AND auth.role() = 'authenticated');
