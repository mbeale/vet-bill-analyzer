// User types
export interface User {
  id: string;
  email: string;
  display_name?: string;
  subscription_tier: 'free' | 'pro' | 'premium';
  scans_used: number;
  scans_limit: number;
  created_at: string;
  updated_at: string;
}

// Receipt types
export interface Receipt {
  id: string;
  user_id: string;
  clinic_name: string;
  clinic_zip?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  date_of_service?: string;
  species?: 'dog' | 'cat' | 'other';
  weight_lbs?: number;
  total_amount: number;
  raw_json?: Record<string, any>;
  extracted_data?: Record<string, any>;
  verdict_status: 'green' | 'yellow' | 'red' | 'processing' | 'error';
  verdict_score?: number;
  comparison_percentage?: number;
  z_score?: number;
  regional_median?: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Line item types
export interface LineItem {
  id: string;
  receipt_id: string;
  description: string;
  procedure_key?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  is_medical: boolean;
  item_status: 'green' | 'yellow' | 'red';
  created_at: string;
}

// Procedure benchmark types
export interface ProcedureBenchmark {
  id: string;
  procedure_key: string;
  procedure_name: string;
  zip_code?: string;
  zip3?: string;
  state?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  median_price?: number;
  p90_price?: number;
  p75_price?: number;
  min_price?: number;
  max_price?: number;
  sample_size: number;
  species: 'dog' | 'cat' | 'all';
  weight_category?: 'tiny' | 'small' | 'medium' | 'large' | 'giant' | 'all';
  last_updated: string;
  created_at: string;
}

// Regional aggregates
export interface RegionalAggregate {
  id: string;
  zip_code?: string;
  zip3?: string;
  state?: string;
  procedure_key: string;
  species: string;
  weight_category?: string;
  median_price?: number;
  std_dev?: number;
  sample_size: number;
  last_refreshed: string;
}

// Extraction result types
export interface ExtractionResult {
  clinic_name: string;
  clinic_zip?: string;
  date_of_service?: string;
  species?: 'dog' | 'cat' | 'other';
  weight_lbs?: number;
  total_amount: number;
  line_items: {
    description: string;
    unit_price: number;
    quantity: number;
    is_medical: boolean;
  }[];
  raw_ocr_text: string;
}

// Verdict types
export interface Verdict {
  receipt_id: string;
  clinic_name: string;
  total_amount: number;
  verdict_status: 'green' | 'yellow' | 'red';
  verdict_message: string;
  comparison_percentage: number;
  species: string;
  line_items: {
    description: string;
    price: number;
    median_price?: number;
    status: 'green' | 'yellow' | 'red';
  }[];
  regional_median: number;
  z_score: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
