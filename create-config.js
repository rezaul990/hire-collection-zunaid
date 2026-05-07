/**
 * Create config.js from environment variables for Vercel deployment
 * This script runs during build time to generate config.js
 */

const fs = require('fs');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('ERROR: Missing required environment variables!');
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel');
  process.exit(1);
}

const configContent = `/**
 * Supabase Configuration
 * Generated from environment variables
 * DO NOT COMMIT THIS FILE
 */

const SUPABASE_URL = '${SUPABASE_URL}';
const SUPABASE_ANON_KEY = '${SUPABASE_ANON_KEY}';
`;

fs.writeFileSync('config.js', configContent);
console.log('✅ config.js created successfully from environment variables');
