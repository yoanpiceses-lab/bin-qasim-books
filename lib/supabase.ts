import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing from .env");
}

if (!supabaseKey) {
  throw new Error("SUPABASE_SECRET_KEY is missing from .env");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseSecretKey) {
  throw new Error("SUPABASE_SECRET_KEY is missing from .env");
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseSecretKey
);