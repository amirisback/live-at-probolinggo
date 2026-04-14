-- ============================================================
-- SUPABASE MIGRATION: Services & Testimonials
-- Jalankan SQL ini di Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Tabel Kategori Layanan
CREATE TABLE service_categories (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '💼',
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Kontak Penyedia Jasa
CREATE TABLE service_contacts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Testimoni
CREATE TABLE testimonials (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo TEXT DEFAULT '/images/testimonials/placeholder.png',
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  service_used TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access (semua orang bisa melihat)
CREATE POLICY "Allow public read" ON service_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON service_contacts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON testimonials FOR SELECT USING (true);

-- Public insert access (semua orang bisa menambahkan)
CREATE POLICY "Allow public insert" ON service_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON service_contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON testimonials FOR INSERT WITH CHECK (true);

-- Public update access (untuk admin CMS dan upsert kategori)
CREATE POLICY "Allow public update" ON service_categories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update" ON service_contacts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update" ON testimonials FOR UPDATE USING (true) WITH CHECK (true);

-- Public delete access (untuk admin CMS)
CREATE POLICY "Allow public delete" ON service_categories FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON service_contacts FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON testimonials FOR DELETE USING (true);

-- ============================================================
-- SEED DATA (dari services.json yang sudah ada)
-- ============================================================

INSERT INTO service_categories (id, category, icon, description) VALUES
  ('tukang-bangunan', 'Tukang Bangunan', '🏗️', 'Jasa konstruksi dan renovasi rumah'),
  ('pengangkut-air', 'Pengangkut Air', '💧', 'Layanan pengiriman air bersih ke rumah Anda'),
  ('terapis-pijat', 'Terapis Pijat', '💆', 'Pijat tradisional dan refleksi profesional'),
  ('tukang-ledeng', 'Tukang Ledeng', '🔧', 'Perbaikan dan instalasi saluran air'),
  ('jasa-kebersihan', 'Jasa Kebersihan', '🧹', 'Layanan kebersihan rumah dan kantor'),
  ('bengkel-motor', 'Bengkel Motor', '🏍️', 'Service dan perbaikan sepeda motor'),
  ('tukang-ayam', 'Tukang Ayam', '🐔', 'Jualan Ayam Delivery');

INSERT INTO service_contacts (category_id, name, phone, address) VALUES
  ('tukang-ledeng', 'PUJI Sumur Bor Air Tanah', '0852-3283-3925', 'Gg. IV No.129, Kebonsari Kulon, Kec. Kanigaran, Kota Probolinggo, Jawa Timur 67214');
