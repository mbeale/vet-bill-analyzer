-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  display_name text,
  subscription_tier varchar(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  scans_used integer DEFAULT 0,
  scans_limit integer DEFAULT 5,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Receipts table for storing user uploads
CREATE TABLE IF NOT EXISTS receipts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clinic_name text NOT NULL,
  clinic_zip varchar(5),
  location geography(point),
  date_of_service date,
  species varchar(20) CHECK (species IN ('dog', 'cat', 'other')),
  weight_lbs decimal,
  total_amount decimal NOT NULL,
  raw_json jsonb,
  extracted_data jsonb,
  verdict_status varchar(10) CHECK (verdict_status IN ('green', 'yellow', 'red', 'processing', 'error')),
  verdict_score decimal,
  comparison_percentage decimal,
  z_score decimal,
  regional_median decimal,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Line items table
CREATE TABLE IF NOT EXISTS line_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id uuid NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  description text NOT NULL,
  procedure_key varchar(255),
  unit_price decimal NOT NULL,
  quantity integer DEFAULT 1,
  total_price decimal NOT NULL,
  is_medical boolean DEFAULT true,
  item_status varchar(10) CHECK (item_status IN ('green', 'yellow', 'red')),
  created_at timestamp with time zone DEFAULT now()
);

-- Procedure benchmarks table
CREATE TABLE IF NOT EXISTS procedure_benchmarks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  procedure_key varchar(255) NOT NULL,
  procedure_name text NOT NULL,
  zip_code varchar(5),
  zip3 varchar(3),
  state varchar(2),
  location geography(point),
  median_price decimal,
  p90_price decimal,
  p75_price decimal,
  min_price decimal,
  max_price decimal,
  sample_size integer DEFAULT 0,
  species varchar(20) CHECK (species IN ('dog', 'cat', 'all')),
  weight_category varchar(20) CHECK (weight_category IN ('tiny', 'small', 'medium', 'large', 'giant', 'all')),
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(procedure_key, zip_code, species, weight_category)
);

-- Regional aggregates materialized view (for fast queries)
CREATE TABLE IF NOT EXISTS regional_aggregates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  zip_code varchar(5),
  zip3 varchar(3),
  state varchar(2),
  procedure_key varchar(255),
  species varchar(20),
  weight_category varchar(20),
  median_price decimal,
  std_dev decimal,
  sample_size integer,
  last_refreshed timestamp with time zone DEFAULT now()
);

-- Audit log for tracking procedure changes
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id uuid REFERENCES receipts(id) ON DELETE CASCADE,
  action varchar(100) NOT NULL,
  old_data jsonb,
  new_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_clinic_zip ON receipts(clinic_zip);
CREATE INDEX IF NOT EXISTS idx_receipts_location ON receipts USING gist(location);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON receipts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_line_items_receipt_id ON line_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_line_items_procedure_key ON line_items(procedure_key);
CREATE INDEX IF NOT EXISTS idx_procedure_benchmarks_key ON procedure_benchmarks(procedure_key);
CREATE INDEX IF NOT EXISTS idx_procedure_benchmarks_zip ON procedure_benchmarks(zip_code);
CREATE INDEX IF NOT EXISTS idx_procedure_benchmarks_location ON procedure_benchmarks USING gist(location);
CREATE INDEX IF NOT EXISTS idx_regional_aggregates_key ON regional_aggregates(procedure_key, zip_code, species);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for receipts table
CREATE POLICY "Users can view their own receipts"
  ON receipts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own receipts"
  ON receipts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receipts"
  ON receipts FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for line_items table
CREATE POLICY "Users can view line items from their receipts"
  ON line_items FOR SELECT
  USING (
    receipt_id IN (
      SELECT id FROM receipts WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for audit_log table
CREATE POLICY "Users can view audit logs for their receipts"
  ON audit_log FOR SELECT
  USING (
    receipt_id IN (
      SELECT id FROM receipts WHERE user_id = auth.uid()
    )
  );

-- Public read-only access to anonymized benchmarks
CREATE POLICY "Anyone can view procedure benchmarks"
  ON procedure_benchmarks FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view regional aggregates"
  ON regional_aggregates FOR SELECT
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at BEFORE UPDATE ON receipts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
