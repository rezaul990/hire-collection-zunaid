/**
 * Hire Collection Dashboard - Supabase Edition
 * 
 * A dynamic web application for analyzing hire purchase collection data
 * with cloud database storage using Supabase.
 * 
 * @author Zunaid Nomani
 * @copyright All Rights Reserved By Zunaid Nomani
 * @version 3.0.0
 * @description Three-tier admin system with multi-area support
 */

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let DATA = [];
let vis = [];
let cardFilter = null;
let currentUser = null;
let currentBatchId = null;
let isAdmin = false;
let isSuperAdmin = false;
let userRole = 'user'; // 'user', 'area_admin', 'super_admin'
let userArea = null;
let meta = { currentDate: 'Current Overdue', previousDate: 'Previous Overdue', loadedAt: '' };

const TODAY_MS = new Date(new Date().setHours(0,0,0,0)).getTime();
const MONTH_MAP = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const fmt = n => Number(n||0).toLocaleString('en-BD');
const $ = id => document.getElementById(id);

// Authentication state management
let isSignUp = false;
let availablePlazas = [];

// Load available plazas on page load
async function loadAvailablePlazas() {
  try {
    const { data, error } = await supabaseClient.rpc('get_available_plazas');
    if (error) throw error;
    availablePlazas = data.map(item => item.plaza);
    populatePlazaDropdown();
  } catch (error) {
    console.error('Error loading plazas:', error);
  }
}

function populatePlazaDropdown() {
  const select = $('authPlaza');
  select.innerHTML = '<option value="">Select Your Plaza</option>';
  availablePlazas.forEach(plaza => {
    const option = document.createElement('option');
    option.value = plaza;
    option.textContent = plaza;
    select.appendChild(option);
  });
}

// Load plazas when page loads
loadAvailablePlazas();

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session) {
    currentUser = session.user;
    showApp();
    loadUserBatches();
  } else {
    currentUser = null;
    showAuth();
  }
});

// Check initial auth state
supabaseClient.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    currentUser = session.user;
    showApp();
    loadUserBatches();
  } else {
    showAuth();
  }
});

function showAuth() {
  $('authContainer').classList.remove('hidden');
  $('appContainer').classList.add('hidden');
}

function showApp() {
  $('authContainer').classList.add('hidden');
  $('appContainer').classList.remove('hidden');
  $('userEmail').textContent = currentUser.email;
  
  // Check if user is admin and load appropriate data
  checkIfAdmin();
}

// Auth form handling
$('authForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('authEmail').value;
  const password = $('authPassword').value;
  const plaza = $('authPlaza').value;
  const btn = $('authSubmitBtn');
  
  btn.disabled = true;
  btn.textContent = isSignUp ? 'Signing up...' : 'Signing in...';
  $('authMessage').innerHTML = '';
  
  try {
    if (isSignUp) {
      // Validate plaza selection
      if (!plaza) {
        throw new Error('Please select your Plaza');
      }
      
      // Sign up without email confirmation
      const { data, error } = await supabaseClient.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            plaza: plaza
          }
        }
      });
      
      if (error) {
        // If email rate limit exceeded, show helpful message
        if (error.message.includes('email rate limit exceeded') || error.message.includes('Email rate limit exceeded')) {
          throw new Error('Too many signup attempts. Please wait a few minutes and try again, or contact your administrator to disable email confirmation in Supabase.');
        }
        throw error;
      }
      
      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabaseClient
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: email,
            plaza: plaza || null  // Allow null for admins
          });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw error here, user is already created
        }
        
        // Note: Super admin (rezaul990drive@gmail.com) must be added manually via SQL
        // See SETUP_SUPERADMIN.sql for instructions
      }
      
      $('authMessage').innerHTML = '<div class="success-msg">Account created successfully! Signing you in...</div>';
      
      // Auto sign in after signup
      setTimeout(async () => {
        const { error: signInError } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (signInError) {
          $('authMessage').innerHTML = '<div class="error-msg">Account created but sign in failed. Please try signing in manually.</div>';
          setTimeout(() => toggleAuthMode(), 2000);
        }
      }, 1000);
      
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
  } catch (error) {
    $('authMessage').innerHTML = `<div class="error-msg">${error.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = isSignUp ? 'Sign Up' : 'Sign In';
  }
});

$('authToggleLink').addEventListener('click', toggleAuthMode);

function toggleAuthMode() {
  isSignUp = !isSignUp;
  const plazaSelect = $('authPlaza');
  
  if (isSignUp) {
    plazaSelect.style.display = 'block';
    plazaSelect.required = true;
  } else {
    plazaSelect.style.display = 'none';
    plazaSelect.required = false;
  }
  
  $('authSubmitBtn').textContent = isSignUp ? 'Sign Up' : 'Sign In';
  $('authToggleText').innerHTML = isSignUp 
    ? 'Already have an account? <a id="authToggleLink">Sign In</a>'
    : 'Don\'t have an account? <a id="authToggleLink">Sign Up</a>';
  $('authToggleLink').addEventListener('click', toggleAuthMode);
  $('authMessage').innerHTML = '';
}

async function signOut() {
  await supabaseClient.auth.signOut();
  DATA = [];
  vis = [];
  currentBatchId = null;
  showAuth();
}

// Check if user is admin
async function checkIfAdmin() {
  try {
    // Check if super admin
    const { data: superAdminData } = await supabaseClient
      .from('superadmin_users')
      .select('email')
      .eq('id', currentUser.id)
      .single();
    
    if (superAdminData) {
      isSuperAdmin = true;
      isAdmin = true;
      userRole = 'super_admin';
      $('userEmail').textContent = `${currentUser.email} (Super Admin)`;
      $('adminPanelBtn').style.display = 'inline-block';
      $('uploadNewDataBtn').style.display = 'inline-block';
      loadUserBatches();
      return;
    }
    
    // Check if area admin
    const { data: areaAdminData } = await supabaseClient
      .from('admin_users')
      .select('email, area, role')
      .eq('id', currentUser.id)
      .single();
    
    if (areaAdminData && areaAdminData.area) {
      isAdmin = true;
      isSuperAdmin = false;
      userRole = 'area_admin';
      userArea = areaAdminData.area;
      $('userEmail').textContent = `${currentUser.email} (${areaAdminData.area} Admin)`;
      $('uploadNewDataBtn').style.display = 'inline-block';
      loadUserBatches();
      return;
    }
    
    // Regular user
    isAdmin = false;
    isSuperAdmin = false;
    userRole = 'user';
    await loadUserPlaza();
    loadUserBatches();
    
  } catch (error) {
    console.error('Error checking admin status:', error);
    isAdmin = false;
    isSuperAdmin = false;
    userRole = 'user';
    await loadUserPlaza();
    loadUserBatches();
  }
}

// Load user's plaza from profile
async function loadUserPlaza() {
  try {
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .select('plaza')
      .eq('id', currentUser.id)
      .single();
    
    if (error) throw error;
    
    if (data && data.plaza) {
      $('userEmail').textContent = `${currentUser.email} (${data.plaza})`;
    }
  } catch (error) {
    console.error('Error loading user plaza:', error);
  }
}

// Load user's uploaded batches
async function loadUserBatches() {
  try {
    const { data, error } = await supabaseClient
      .from('uploads')
      .select('id, file_name, upload_date, as_on_date, row_count')
      .eq('file_type', 'target')
      .order('upload_date', { ascending: false });
    
    if (error) throw error;
    
    const select = $('batchSelect');
    select.innerHTML = '<option value="">-- Select a batch --</option>';
    
    data.forEach(batch => {
      const option = document.createElement('option');
      option.value = batch.id;
      const date = new Date(batch.upload_date).toLocaleString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
      option.textContent = `${batch.file_name} - ${date} (${batch.row_count || 0} records)`;
      select.appendChild(option);
    });
    
    if (data.length > 0) {
      select.value = data[0].id;
      loadBatchData();
    }
  } catch (error) {
    console.error('Error loading batches:', error);
    $('uploadStatus').textContent = 'Error loading batches: ' + error.message;
  }
}

// Load data for selected batch
async function loadBatchData() {
  const batchId = $('batchSelect').value;
  if (!batchId) {
    DATA = [];
    vis = [];
    renderTable();
    return;
  }
  
  currentBatchId = batchId;
  $('uploadStatus').innerHTML = '<span class="loader"></span> Loading data...';
  
  try {
    // Fetch all records using pagination
    let allData = [];
    let from = 0;
    const pageSize = 1000;
    let hasMore = true;
    
    while (hasMore) {
      const { data, error, count } = await supabaseClient
        .from('hire_collection_data')
        .select('*', { count: 'exact' })
        .eq('upload_batch_id', batchId)
        .order('serial_number', { ascending: true })
        .range(from, from + pageSize - 1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        allData = allData.concat(data);
        from += pageSize;
        $('uploadStatus').innerHTML = `<span class="loader"></span> Loading ${allData.length} of ${count || '?'} records...`;
        
        // Check if we have more data
        hasMore = data.length === pageSize;
      } else {
        hasMore = false;
      }
    }
    
    // Transform database records to match original format
    DATA = allData.map(row => ({
      'S / N': row.serial_number,
      'Division': row.division || '',
      'Area': row.area || '',
      'Plaza': row.plaza || '',
      'Account No.': row.account_no || '',
      'Customer Name': row.customer_name || '',
      'Mobile No.': row.mobile_no || '',
      'Product Category': row.product_category || '',
      'Assign Person ID': row.assign_person_id || '',
      'Invoice No.': row.invoice_no || '',
      'Invoice Date': row.invoice_date || '',
      'Matured Date': row.matured_date || '',
      'Per Month Ins. Schedule  Amt.': Number(row.monthly_installment) || 0,
      'Collection Target': Number(row.collection_target) || 0,
      'Collection Achieve': Number(row.collection_achieve) || 0,
      'Current Overdue': Number(row.current_overdue) || 0,
      'Previous Overdue': Number(row.previous_overdue) || 0,
      'Overdue Change': Number(row.overdue_change) || 0,
      'Inv Day': row.inv_day || 0,
      'Inv Month': row.inv_month || 0,
      'Inv Year': row.inv_year || 0,
    }));
    
    vis = [...DATA];
    hydrateFilters();
    updateHeadings();
    renderTable();
    
    $('exportFilteredBtn').disabled = $('exportAllBtn').disabled = DATA.length === 0;
    $('uploadStatus').textContent = `Loaded ${DATA.length} records from database.`;
  } catch (error) {
    console.error('Error loading batch data:', error);
    $('uploadStatus').textContent = 'Error loading data: ' + error.message;
  }
}

function showUploadPanel() {
  $('uploadPanel').classList.remove('hidden');
}

function hideUploadPanel() {
  $('uploadPanel').classList.add('hidden');
  $('targetFile').value = '';
  $('currentFile').value = '';
  $('previousFile').value = '';
  $('uploadStatus').textContent = 'Select files to upload.';
}

// Excel processing functions (from original code)
function cleanText(v) {
  return v === undefined || v === null ? '' : String(v).replace(/\s+/g,' ').trim();
}

function normalizeHeader(v) {
  return cleanText(v).toLowerCase().replace(/[^a-z0-9]+/g,'');
}

function toNum(v) {
  if(v === undefined || v === null || v === '') return 0;
  if(typeof v === 'number') return Number.isFinite(v) ? v : 0;
  const n = Number(String(v).replace(/[,\s৳]/g,''));
  return Number.isFinite(n) ? n : 0;
}

function excelDateToText(v) {
  if(!v) return '';
  if(v instanceof Date && !isNaN(v)) return formatDate(v);
  if(typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    if(d) return formatDate(new Date(d.y, d.m-1, d.d));
  }
  return cleanText(v);
}

function formatDate(d) {
  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
  return String(d.getDate()).padStart(2,'0') + '-' + mon + '-' + String(d.getFullYear()).slice(-2);
}

function parseDateText(s) {
  if(!s) return null;
  if(s instanceof Date && !isNaN(s)) return s;
  const text = cleanText(s);
  const m = text.match(/(\d{1,2})[-/ ]([A-Za-z]{3,9}|\d{1,2})[-/ ](\d{2,4})/);
  if(!m) return null;
  let day = Number(m[1]);
  let mon = /^\d+$/.test(m[2]) ? Number(m[2])-1 : MONTH_MAP[m[2].slice(0,3).toLowerCase()];
  let yr = Number(m[3]);
  if(yr < 100) yr += yr >= 50 ? 1900 : 2000;
  if(!day || mon === undefined || !yr) return null;
  const d = new Date(yr, mon, day);
  return isNaN(d) ? null : d;
}

function parseMaturedDate(s) {
  const d = parseDateText(s);
  if(!d) return null;
  d.setHours(0,0,0,0);
  return d.getTime();
}

async function readWorkbook(file) {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type:'array', cellDates:true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header:1, raw:false, defval:'' });
  return { fileName:file.name, sheetName:wb.SheetNames[0], rows };
}

function findHeaderRow(rows, required) {
  for(let i=0;i<Math.min(rows.length,40);i++) {
    const headers = rows[i].map(normalizeHeader);
    if(required.every(req => headers.some(h => req.includes(h)))) return i;
  }
  return -1;
}

function mapHeaders(row) {
  const map = {};
  row.forEach((h,i) => {
    const key = normalizeHeader(h);
    if(key && map[key] === undefined) map[key] = i;
  });
  return map;
}

function getByAliases(row, map, aliases) {
  for(const alias of aliases) {
    const idx = map[normalizeHeader(alias)];
    if(idx !== undefined) return row[idx];
  }
  return '';
}

function isRepeatedHeader(row) {
  return row.some(v => normalizeHeader(v) === 'division') && row.some(v => normalizeHeader(v) === 'area');
}

function extractAsOnDate(rows) {
  for(let r=0;r<Math.min(rows.length,8);r++) {
    for(const cell of rows[r]) {
      const text = cleanText(cell);
      const m = text.match(/As on Date\s+(.+)/i);
      if(m) return cleanText(m[1]);
      const date = text.match(/\d{1,2}[-/ ][A-Za-z]{3,9}[-/ ]\d{2,4}/);
      if(/May|Apr|Jan|Feb|Mar|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i.test(text) && date) return date[0];
    }
  }
  return '';
}

function parseTarget(workbook) {
  const headerIndex = findHeaderRow(workbook.rows, [['s/n','sn'], ['division'], ['area'], ['accountno'], ['invoiceno']]);
  if(headerIndex < 0) throw new Error('Target file header row was not found.');
  const map = mapHeaders(workbook.rows[headerIndex]);
  const out = [];
  workbook.rows.slice(headerIndex+1).forEach(row => {
    if(!row || isRepeatedHeader(row)) return;
    const invoice = cleanText(getByAliases(row,map,['Invoice No.']));
    const account = cleanText(getByAliases(row,map,['Account No.']));
    const division = cleanText(getByAliases(row,map,['Division']));
    const area = cleanText(getByAliases(row,map,['Area']));
    if(!invoice || !account || !division || area.toLowerCase() === 'area') return;
    const invDate = excelDateToText(getByAliases(row,map,['Invoice Date']));
    const invD = parseDateText(invDate);
    out.push({
      'S / N': out.length + 1,
      'Division': division,
      'Area': area,
      'Plaza': cleanText(getByAliases(row,map,['Plaza'])),
      'Account No.': account,
      'Customer Name': cleanText(getByAliases(row,map,['Customer Name'])),
      'Mobile No.': '',
      'Product Category': cleanText(getByAliases(row,map,['Product Category','Iteem Category','Item Category'])),
      'Assign Person ID': cleanText(getByAliases(row,map,['Assign Person ID'])),
      'Invoice No.': invoice,
      'Invoice Date': invDate,
      'Matured Date': excelDateToText(getByAliases(row,map,['Matured Date'])),
      'Per Month Ins. Schedule  Amt.': toNum(getByAliases(row,map,['Per Month Ins. Schedule Amt.','Per Month Ins. Schedule  Amt.'])),
      'Collection Target': toNum(getByAliases(row,map,['Collection Target'])),
      'Collection Achieve': toNum(getByAliases(row,map,['Collection Achieve'])),
      'Current Overdue': 0,
      'Previous Overdue': 0,
      'Overdue Change': 0,
      'Inv Day': invD ? invD.getDate() : 0,
      'Inv Month': invD ? invD.getMonth()+1 : 0,
      'Inv Year': invD ? invD.getFullYear() : 0,
    });
  });
  return out;
}

function parseOverdue(workbook) {
  const headerIndex = findHeaderRow(workbook.rows, [['division'], ['area'], ['accountno'], ['overdue']]);
  if(headerIndex < 0) throw new Error(workbook.fileName + ' header row was not found.');
  const map = mapHeaders(workbook.rows[headerIndex]);
  const asOn = extractAsOnDate(workbook.rows);
  const byInvoice = new Map();
  const byComposite = new Map(); // Plaza + Account + Customer composite key
  workbook.rows.slice(headerIndex+1).forEach(row => {
    if(!row || isRepeatedHeader(row)) return;
    const invoice = cleanText(getByAliases(row,map,['Sale Invoice','Invoice No.']));
    const account = cleanText(getByAliases(row,map,['Account No.']));
    const division = cleanText(getByAliases(row,map,['Division']));
    const area = cleanText(getByAliases(row,map,['Area']));
    if(!account || !division || area.toLowerCase() === 'area') return;
    const plaza = cleanText(getByAliases(row,map,['Plaza']));
    const customer = cleanText(getByAliases(row,map,['Customer Name']));
    const rec = {
      invoice,
      account,
      division,
      area,
      plaza,
      saleDate: excelDateToText(getByAliases(row,map,['Sale Date','Invoice Date'])),
      product: cleanText(getByAliases(row,map,['Product Category','Iteem Category','Item Category'])),
      customer,
      mobile: cleanText(getByAliases(row,map,['Mobile No.'])),
      person: cleanText(getByAliases(row,map,['Assign Person ID'])),
      overdue: toNum(getByAliases(row,map,['Overdue'])),
    };
    // Primary key: Invoice Number
    if(invoice) byInvoice.set(invoice, rec);
    // Composite key: Plaza + Account + Customer (fallback matching)
    const compositeKey = `${plaza}|${account}|${customer}`.toLowerCase();
    byComposite.set(compositeKey, rec);
  });
  return { asOn, byInvoice, byComposite, count: byComposite.size };
}

function mergeData(targetRows, current, previous) {
  return targetRows.map((r, idx) => {
    // STRICT MATCHING: Only match by Invoice Number
    // NO composite key fallback to prevent incorrect matches
    const invoiceNo = cleanText(r['Invoice No.']);
    
    let cur = null;
    let prev = null;
    
    // Only match if invoice number exists and is not empty
    if (invoiceNo) {
      cur = current.byInvoice.get(invoiceNo);
      prev = previous.byInvoice.get(invoiceNo);
    }
    
    // If no match found by invoice, overdue = 0
    // This ensures we don't pick up wrong overdue amounts
    const co = cur ? cur.overdue : 0;
    const po = prev ? prev.overdue : 0;
    
    return {
      ...r,
      'S / N': idx + 1,
      'Mobile No.': cleanText(r['Mobile No.']) || (cur && cur.mobile) || (prev && prev.mobile) || '',
      'Current Overdue': co,
      'Previous Overdue': po,
      'Overdue Change': co - po,
    };
  });
}

// Upload and save data to Supabase
async function uploadAndSaveData() {
  const target = $('targetFile').files[0];
  const current = $('currentFile').files[0];
  const previous = $('previousFile').files[0];
  
  if(!target || !current || !previous) {
    $('uploadStatus').textContent = 'Please select all three Excel files.';
    return;
  }
  
  // Confirm replacement
  const confirmMessage = isSuperAdmin 
    ? 'This will REPLACE ALL data in the database. Are you sure?' 
    : `This will REPLACE all data for ${userArea} area. Are you sure?`;
    
  if (!confirm(confirmMessage)) {
    return;
  }
  
  $('uploadBtn').disabled = true;
  $('uploadStatus').innerHTML = '<span class="loader"></span> Reading Excel files...';
  
  try {
    // Read Excel files
    const [targetWb, currentWb, previousWb] = await Promise.all([
      readWorkbook(target), 
      readWorkbook(current), 
      readWorkbook(previous)
    ]);
    
    $('uploadStatus').innerHTML = '<span class="loader"></span> Processing data...';
    
    const targetRows = parseTarget(targetWb);
    const currentRows = parseOverdue(currentWb);
    const previousRows = parseOverdue(previousWb);
    const mergedData = mergeData(targetRows, currentRows, previousRows);
    
    // Step 1: Delete old data based on role
    $('uploadStatus').innerHTML = '<span class="loader"></span> Deleting old data...';
    
    if (isSuperAdmin) {
      // Super admin deletes ALL data
      const { error: deleteDataError } = await supabaseClient
        .from('hire_collection_data')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (deleteDataError) throw deleteDataError;
      
      const { error: deleteUploadsError } = await supabaseClient
        .from('uploads')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (deleteUploadsError) throw deleteUploadsError;
    } else if (userRole === 'area_admin' && userArea) {
      // Area admin deletes only their area's data
      const { error: deleteDataError } = await supabaseClient
        .from('hire_collection_data')
        .delete()
        .eq('area', userArea);
      
      if (deleteDataError) throw deleteDataError;
      
      // Delete uploads for this area
      const { data: areaUploads } = await supabaseClient
        .from('hire_collection_data')
        .select('upload_batch_id')
        .eq('area', userArea);
      
      if (areaUploads && areaUploads.length > 0) {
        const batchIds = [...new Set(areaUploads.map(r => r.upload_batch_id))];
        const { error: deleteUploadsError } = await supabaseClient
          .from('uploads')
          .delete()
          .in('id', batchIds);
        
        if (deleteUploadsError) throw deleteUploadsError;
      }
    }
    
    // Step 2: Insert new data
    $('uploadStatus').innerHTML = '<span class="loader"></span> Saving new data to database...';
    
    // Create upload batch ID
    const batchId = crypto.randomUUID();
    
    // Save upload metadata
    const uploadRecords = [
      {
        id: batchId,
        file_name: target.name,
        file_type: 'target',
        uploaded_by: currentUser.id,
        row_count: mergedData.length,
        as_on_date: null
      },
      {
        id: crypto.randomUUID(),
        file_name: current.name,
        file_type: 'current_overdue',
        uploaded_by: currentUser.id,
        as_on_date: currentRows.asOn
      },
      {
        id: crypto.randomUUID(),
        file_name: previous.name,
        file_type: 'previous_overdue',
        uploaded_by: currentUser.id,
        as_on_date: previousRows.asOn
      }
    ];
    
    const { error: uploadError } = await supabaseClient
      .from('uploads')
      .insert(uploadRecords);
    
    if (uploadError) throw uploadError;
    
    // Transform and save data records in batches
    const dataRecords = mergedData.map(row => ({
      upload_batch_id: batchId,
      serial_number: row['S / N'],
      division: row['Division'],
      area: row['Area'],
      plaza: row['Plaza'],
      account_no: row['Account No.'],
      customer_name: row['Customer Name'],
      mobile_no: row['Mobile No.'],
      product_category: row['Product Category'],
      assign_person_id: row['Assign Person ID'],
      invoice_no: row['Invoice No.'],
      invoice_date: row['Invoice Date'],
      matured_date: row['Matured Date'],
      monthly_installment: row['Per Month Ins. Schedule  Amt.'],
      collection_target: row['Collection Target'],
      collection_achieve: row['Collection Achieve'],
      current_overdue: row['Current Overdue'],
      previous_overdue: row['Previous Overdue'],
      overdue_change: row['Overdue Change'],
      inv_day: row['Inv Day'],
      inv_month: row['Inv Month'],
      inv_year: row['Inv Year']
    }));
    
    // Insert in batches of 500 records
    const batchSize = 500;
    for (let i = 0; i < dataRecords.length; i += batchSize) {
      const batch = dataRecords.slice(i, i + batchSize);
      const { error: dataError } = await supabaseClient
        .from('hire_collection_data')
        .insert(batch);
      
      if (dataError) throw dataError;
      
      $('uploadStatus').innerHTML = `<span class="loader"></span> Saving ${Math.min(i + batchSize, dataRecords.length)} of ${dataRecords.length} records...`;
    }
    
    meta = {
      currentDate: currentRows.asOn || 'Current Overdue',
      previousDate: previousRows.asOn || 'Previous Overdue',
      loadedAt: new Date().toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }),
    };
    
    $('uploadStatus').innerHTML = '<div class="success-msg">Successfully saved ' + mergedData.length + ' records to database!</div>';
    
    // Reload batches and select the new one
    await loadUserBatches();
    $('batchSelect').value = batchId;
    await loadBatchData();
    
    hideUploadPanel();
    
  } catch(e) {
    console.error(e);
    $('uploadStatus').innerHTML = '<div class="error-msg">Error: ' + e.message + '</div>';
  } finally {
    $('uploadBtn').disabled = false;
  }
}

// UI Functions
function updateHeadings() {
  const areas = unique(DATA.map(r => r['Area']));
  const divs = unique(DATA.map(r => r['Division']));
  const areaText = areas.length === 1 ? areas[0] : `${areas.length} areas`;
  const divText = divs.length === 1 ? divs[0] : `${divs.length} divisions`;
  $('subtitle').textContent = `Invoice-wise Overdue Analysis | ${divText} | ${areaText} | Current: ${meta.currentDate} | Previous: ${meta.previousDate}`;
  $('curOvHdr').textContent = `Current Overdue ${meta.currentDate}`;
  $('prevOvHdr').textContent = `Previous Overdue ${meta.previousDate}`;
}

function unique(values) {
  return [...new Set(values.map(cleanText).filter(Boolean))].sort((a,b) => a.localeCompare(b, undefined, {numeric:true}));
}

function setOptions(id, values, firstLabel) {
  const sel = $(id);
  const cur = sel.value;
  sel.innerHTML = `<option value="">${firstLabel}</option>`;
  values.forEach(v => {
    const o = document.createElement('option');
    o.value = o.textContent = v;
    if(v === cur) o.selected = true;
    sel.appendChild(o);
  });
}

function hydrateFilters() {
  setOptions('divSel', unique(DATA.map(r => r['Division'])), 'All');
  setOptions('areaSel', unique(DATA.map(r => r['Area'])), 'All Areas');
  setOptions('plazaSel', unique(DATA.map(r => r['Plaza'])), 'All Plazas');
  setOptions('prodSel', unique(DATA.map(r => r['Product Category'])), 'All');
  setOptions('personSel', unique(DATA.map(r => r['Assign Person ID'])), 'All Persons');
  setOptions('yearSel', unique(DATA.map(r => r['Inv Year']).filter(Boolean)).map(String), 'All');
  const months = unique(DATA.map(r => r['Inv Month']).filter(Boolean)).map(n => ({value:String(n), label:MONTH_NAMES[n-1]}));
  const sel = $('monthSel');
  sel.innerHTML = '<option value="">All</option>';
  months.forEach(m => {
    const o = document.createElement('option');
    o.value = m.value;
    o.textContent = m.label;
    sel.appendChild(o);
  });
}

function calcStats(rows) {
  const sum = k => rows.reduce((a,r) => a+(Number(r[k])||0), 0);
  const totalAC = rows.length;
  const collectedAC = rows.filter(r => (r['Collection Achieve']||0) > 0).length;
  const collPct = totalAC > 0 ? ((collectedAC/totalAC)*100).toFixed(1) : '0.0';
  const ovCount = rows.filter(r => (r['Current Overdue']||0) > 0).length;
  const tgt = sum('Collection Target'), ach = sum('Collection Achieve');
  const amtPct = tgt > 0 ? ((ach/tgt)*100).toFixed(1) : '0.0';
  const belowTgt = rows.filter(r => { const ac=r['Collection Achieve']||0,tg=r['Collection Target']||0; return ac>0&&ac<tg; }).length;
  const belowOv = rows.filter(r => { const ac=r['Collection Achieve']||0,co=r['Current Overdue']||0; return ac>0&&ac<co; }).length;
  const maturedRows = rows.filter(r => {
    const ms = parseMaturedDate(r['Matured Date']);
    return ms !== null && ms < TODAY_MS;
  });
  const maturedAC = maturedRows.length;
  const maturedOv = maturedRows.reduce((a,r) => a+(r['Current Overdue']||0), 0);
  const uncollectedAC = rows.filter(r => (r['Collection Achieve']||0) === 0).length;
  return { totalAC, collectedAC, collPct, ovCount, belowTgt, belowOv, amtPct,
    maturedAC, maturedOv, uncollectedAC,
    mi: sum('Per Month Ins. Schedule  Amt.'), tgt, ach,
    co: sum('Current Overdue'), po: sum('Previous Overdue'),
    ch: sum('Overdue Change') };
}

function renderCards(s) {
  const mk = (cls,val,lbl,hint='',cid=null) => {
    const active = cardFilter===cid ? 'active-filter':'';
    const attrs = cid
      ? `class="card ${cls} clickable ${active}" onclick="toggleCardFilter('${cid}')"`
      : `class="card ${cls}"`;
    return `<div ${attrs}><div class="val">${val}</div><div class="lbl">${lbl}</div>${hint?`<div class="hint">${hint}</div>`:''}</div>`;
  };
  $('summaryGrid').innerHTML =
    mk('', fmt(s.totalAC), 'Total Running A/C Qty.') +
    mk('red', fmt(s.ovCount), 'Overdue A/C Qty.') +
    mk('purple', 'BDT '+fmt(s.mi), 'Total Monthly Installment') +
    mk('', 'BDT '+fmt(s.tgt), 'Collectible Amount Target') +
    mk('green', 'BDT '+fmt(s.ach), 'Collectible Amount Achv') +
    mk('teal', s.amtPct+'%', 'Collectible Amount Achv %') +
    mk('teal', fmt(s.collectedAC), 'Number of A/C Collected') +
    mk('teal', s.collPct+'%', 'Collection Qty. Achv %') +
    mk('red', 'BDT '+fmt(s.co), 'Current Overdue') +
    mk('orange', 'BDT '+fmt(s.po), 'Previous Overdue') +
    mk(s.ch>=0?'red':'green', (s.ch>=0?'+':'')+fmt(s.ch), 'Overdue Change') +
    mk('maroon', fmt(s.maturedAC), 'Matured A/C Qty.', 'click to filter', 'matured') +
    mk('amber', 'BDT '+fmt(s.maturedOv), 'Matured Overdue Amount') +
    mk('pink', fmt(s.belowTgt), 'Collection Below Collectible Amount', 'click to filter', 'belowTgt') +
    mk('pink', fmt(s.belowOv), 'Collection Below Overdue Amount', 'click to filter', 'belowOv') +
    mk('red', fmt(s.uncollectedAC), 'Uncollected A/C Qty.', 'click to filter', 'uncollected');
}

function toggleCardFilter(type) {
  cardFilter = cardFilter===type ? null : type;
  $('belowTgtChk').checked = cardFilter==='belowTgt';
  $('belowOvChk').checked = cardFilter==='belowOv';
  $('uncollectedChk').checked = cardFilter==='uncollected';
  $('maturedChk').checked = cardFilter==='matured';
  doFilter();
}

function renderTable() {
  const rows = vis;
  $('tbody').innerHTML = rows.length ? rows.map(r => {
    const co=r['Current Overdue']||0, po=r['Previous Overdue']||0;
    const ch=r['Overdue Change']||0, ac=r['Collection Achieve']||0, tg=r['Collection Target']||0;
    const isBT=ac>0&&ac<tg, isBO=ac>0&&ac<co;
    const rowCls=isBT&&isBO?'row-below-both':isBT?'row-below-tgt':isBO?'row-below-ov':'';
    return `<tr class="${rowCls}">
    <td class="c">${r['S / N']||''}</td>
    <td>${r['Division']||''}</td><td>${r['Area']||''}</td><td>${r['Plaza']||''}</td>
    <td>${r['Account No.']||''}</td><td>${r['Customer Name']||''}</td>
    <td>${r['Mobile No.']||''}</td>
    <td>${r['Product Category']||''}</td><td>${r['Assign Person ID']||''}</td>
    <td>${r['Invoice No.']||''}</td>
    <td>${r['Invoice Date']||''}</td><td>${r['Matured Date']||''}</td>
    <td class="num">${fmt(r['Per Month Ins. Schedule  Amt.']||0)}</td>
    <td class="num">${fmt(tg)}</td>
    <td class="num">${fmt(ac)}</td>
    <td class="num${co>0?' ov-cell':''}">${co>0?fmt(co):'-'}</td>
    <td class="num${po>0?' pv-cell':''}">${po>0?fmt(po):'-'}</td>
    <td class="num ${ch>0?'red-chg':ch<0?'grn-chg':''}">${ch!==0?(ch>0?'+':'')+fmt(ch):'-'}</td>
    </tr>`;
  }).join('') : '<tr><td colspan="18" class="no-data">No records found. Upload files or change filters.</td></tr>';

  const s = calcStats(vis);
  $('fMI').textContent=fmt(s.mi); $('fTG').textContent=fmt(s.tgt); $('fAC').textContent=fmt(s.ach);
  $('fCO').textContent=fmt(s.co); $('fPO').textContent=fmt(s.po); $('fCH').textContent=fmt(s.ch);
  renderCards(s);
  $('dlNote').textContent=`Filtered: ${vis.length} rows | Total: ${DATA.length} rows`;
  $('rowCount').textContent=`Showing ${vis.length} of ${DATA.length} records`;
}

function onPlazaChange() {
  const plaza=$('plazaSel').value;
  const pool = plaza ? DATA.filter(r => r['Plaza'] === plaza) : DATA;
  setOptions('personSel', unique(pool.map(r => r['Assign Person ID'])), 'All Persons');
  doFilter();
}

function doFilter() {
  const q=$('searchBox').value.toLowerCase();
  const div=$('divSel').value, area=$('areaSel').value, pla=$('plazaSel').value, prd=$('prodSel').value;
  const per=$('personSel').value, yr=$('yearSel').value, mo=$('monthSel').value;
  const ovOnly=$('ovChk').checked, btChk=$('belowTgtChk').checked, boChk=$('belowOvChk').checked;
  const dayFrom=parseInt($('dayFrom').value)||0;
  const dayTo=parseInt($('dayTo').value)||32;
  const matChk=$('maturedChk').checked, uncolChk=$('uncollectedChk').checked;
  if(btChk&&!boChk&&!matChk&&!uncolChk) cardFilter='belowTgt';
  else if(boChk&&!btChk&&!matChk&&!uncolChk) cardFilter='belowOv';
  else if(matChk&&!btChk&&!boChk&&!uncolChk) cardFilter='matured';
  else if(uncolChk&&!btChk&&!boChk&&!matChk) cardFilter='uncollected';
  else if(!btChk&&!boChk&&!matChk&&!uncolChk) cardFilter=null;

  vis=DATA.filter(r=>{
    if(q&&!['Account No.','Customer Name','Invoice No.','Plaza','Area','Product Category','Assign Person ID','Mobile No.']
      .some(k=>(r[k]||'').toString().toLowerCase().includes(q))) return false;
    if(div&&r['Division']!==div) return false;
    if(area&&r['Area']!==area) return false;
    if(pla&&r['Plaza']!==pla) return false;
    if(prd&&r['Product Category']!==prd) return false;
    if(per&&r['Assign Person ID']!==per) return false;
    if(yr&&r['Inv Year']!==Number(yr)) return false;
    if(mo&&r['Inv Month']!==Number(mo)) return false;
    if(($('dayFrom').value||$('dayTo').value) && r['Inv Day']>0) {
      if(r['Inv Day']<dayFrom || r['Inv Day']>dayTo) return false;
    }
    if(ovOnly&&!((r['Current Overdue']||0)>0)) return false;
    if(cardFilter==='belowTgt'||btChk){const ac=r['Collection Achieve']||0,tg=r['Collection Target']||0;if(!(ac>0&&ac<tg))return false;}
    if(cardFilter==='belowOv'||boChk){const ac=r['Collection Achieve']||0,co=r['Current Overdue']||0;if(!(ac>0&&ac<co))return false;}
    if(cardFilter==='matured'||matChk){const ms=parseMaturedDate(r['Matured Date']);if(!(ms!==null&&ms<TODAY_MS))return false;}
    if(cardFilter==='uncollected'||uncolChk){if((r['Collection Achieve']||0)!==0)return false;}
    return true;
  });
  renderTable();
}

function clearAll() {
  $('searchBox').value='';
  ['divSel','areaSel','plazaSel','prodSel','personSel','yearSel','monthSel'].forEach(id=>$(id).value='');
  $('ovChk').checked=$('belowTgtChk').checked=$('belowOvChk').checked=false;
  $('maturedChk').checked=$('uncollectedChk').checked=false;
  $('dayFrom').value=''; $('dayTo').value='';
  cardFilter=null;
  if(DATA.length > 0) hydrateFilters();
  vis=[...DATA];
  renderTable();
}

const EXPORT_COLS = [
  ['S / N','S/N'],['Division','Division'],['Area','Area'],['Plaza','Plaza'],
  ['Account No.','Account No.'],['Customer Name','Customer Name'],['Mobile No.','Mobile No.'],
  ['Product Category','Product Category'],['Assign Person ID','Person ID'],
  ['Invoice No.','Invoice No.'],['Invoice Date','Invoice Date'],['Matured Date','Matured Date'],
  ['Per Month Ins. Schedule  Amt.','Monthly Inst. (BDT)'],
  ['Collection Target','Collectible Amt. Target (BDT)'],
  ['Collection Achieve','Collectible Amt. Achv (BDT)'],
  ['Current Overdue','Current Overdue'],
  ['Previous Overdue','Previous Overdue'],
  ['Overdue Change','Overdue Change'],
];

function exportExcel(allData) {
  const src=allData?DATA:vis;
  const keys=EXPORT_COLS.map(c=>c[0]), hdrs=EXPORT_COLS.map(c=>c[1]);
  hdrs[15] = `Current Overdue ${meta.currentDate}`;
  hdrs[16] = `Previous Overdue ${meta.previousDate}`;
  const numKeys=new Set(['Per Month Ins. Schedule  Amt.','Collection Target','Collection Achieve',
    'Current Overdue','Previous Overdue','Overdue Change']);
  const wsData=[hdrs,...src.map(r=>keys.map(k=>{
    const v=r[k]; return numKeys.has(k)?Number(v)||0:(v===undefined||v===null?'':String(v));
  }))];
  const ws=XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols']=[5,12,14,26,18,22,14,14,14,22,12,12,16,16,16,18,18,14].map(w=>({wch:w}));
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Hire Collection');
  const s=calcStats(src);
  const sumData=[
    ['Hire Collection Overview'],
    [`Current: ${meta.currentDate}`],
    [`Previous: ${meta.previousDate}`],
    [`Last Updated: ${meta.loadedAt}`],[''],
    ['Metric','Value'],
    ['Total Running A/C Qty.',s.totalAC],
    ['Overdue A/C Qty.',s.ovCount],
    ['Total Monthly Installment (BDT)',s.mi],
    ['Collectible Amount Target (BDT)',s.tgt],
    ['Collectible Amount Achv (BDT)',s.ach],
    ['Collectible Amount Achv %',s.amtPct+'%'],
    ['Number of A/C Collected',s.collectedAC],
    ['Collection Qty. Achv %',s.collPct+'%'],
    ['Current Overdue (BDT)',s.co],
    ['Previous Overdue (BDT)',s.po],
    ['Overdue Change (BDT)',s.ch],
    ['Matured A/C Qty.',s.maturedAC],
    ['Matured Overdue Amount (BDT)',s.maturedOv],
    ['Collection Below Collectible Amount (Qty.)',s.belowTgt],
    ['Collection Below Overdue Amount (Qty.)',s.belowOv],
  ];
  const ws2=XLSX.utils.aoa_to_sheet(sumData);
  ws2['!cols']=[{wch:36},{wch:20}];
  XLSX.utils.book_append_sheet(wb,ws2,'Summary');
  const fname=allData?'HireCollection_AllData.xlsx':'HireCollection_Filtered.xlsx';
  XLSX.writeFile(wb,fname);
  $('dlNote').textContent='Downloaded: '+src.length+' rows -> '+fname;
  setTimeout(()=>$('dlNote').textContent='Filtered: '+vis.length+' rows | Total: '+DATA.length+' rows',3000);
}


// Expose functions to global scope for inline event handlers
window.doFilter = doFilter;
window.clearAll = clearAll;
window.onPlazaChange = onPlazaChange;
window.toggleCardFilter = toggleCardFilter;
window.exportExcel = exportExcel;
window.signOut = signOut;
window.uploadAndSaveData = uploadAndSaveData;
window.showUploadPanel = showUploadPanel;
window.hideUploadPanel = hideUploadPanel;
window.loadBatchData = loadBatchData;


// Admin management functions
async function showAdminPanel() {
  if (!isSuperAdmin) return;
  
  $('adminModal').style.display = 'block';
  $('modalOverlay').style.display = 'block';
  
  // Load available areas
  const { data: areasData } = await supabaseClient.rpc('get_available_areas');
  if (areasData) {
    const areaSelect = $('newAdminArea');
    areaSelect.innerHTML = '<option value="">Select Area</option>';
    areasData.forEach(item => {
      const option = document.createElement('option');
      option.value = item.area;
      option.textContent = item.area;
      areaSelect.appendChild(option);
    });
  }
  
  // Load current area admins
  const { data, error } = await supabaseClient
    .from('admin_users')
    .select('email, area, role, created_at')
    .order('created_at', { ascending: true });
  
  if (data) {
    $('adminList').innerHTML = data.map(admin => 
      `<div style="padding:8px; border-bottom:1px solid #eee; display:flex; justify-content:space-between;">
        <span><strong>${admin.email}</strong> - ${admin.area || 'All Areas'}</span>
        <button class="btn btn-grey" style="padding:2px 8px; font-size:0.7rem;" onclick="removeAdmin('${admin.email}')">Remove</button>
      </div>`
    ).join('') || '<div>No area admins found</div>';
  }
}

function closeAdminPanel() {
  $('adminModal').style.display = 'none';
  $('modalOverlay').style.display = 'none';
  $('adminMessage').innerHTML = '';
  $('newAdminEmail').value = '';
  $('newAdminArea').value = '';
}

async function addNewAdmin() {
  const email = $('newAdminEmail').value.trim();
  const area = $('newAdminArea').value;
  
  if (!email) {
    $('adminMessage').innerHTML = '<div class="error-msg">Please enter an email address</div>';
    return;
  }
  
  if (!area) {
    $('adminMessage').innerHTML = '<div class="error-msg">Please select an area</div>';
    return;
  }
  
  try {
    // Get user ID from auth.users
    const { data: users } = await supabaseClient.auth.admin.listUsers();
    const user = users?.users?.find(u => u.email === email);
    
    if (!user) {
      $('adminMessage').innerHTML = '<div class="error-msg">User not found. They must sign up first.</div>';
      return;
    }
    
    // Add to admin_users
    const { error: adminError } = await supabaseClient
      .from('admin_users')
      .insert({ 
        id: user.id, 
        email: email,
        area: area,
        role: 'area_admin'
      });
    
    if (adminError) {
      if (adminError.code === '23505') {
        $('adminMessage').innerHTML = '<div class="error-msg">This user is already an admin</div>';
      } else {
        throw adminError;
      }
      return;
    }
    
    // Update user profile with area
    await supabaseClient
      .from('user_profiles')
      .update({ plaza: null })
      .eq('id', user.id);
    
    $('adminMessage').innerHTML = '<div class="success-msg">Area admin added successfully!</div>';
    $('newAdminEmail').value = '';
    $('newAdminArea').value = '';
    
    // Refresh admin list
    setTimeout(() => showAdminPanel(), 1000);
    
  } catch (error) {
    console.error('Error adding admin:', error);
    $('adminMessage').innerHTML = '<div class="error-msg">Error: ' + error.message + '</div>';
  }
}

async function removeAdmin(email) {
  if (!confirm(`Remove ${email} as admin?`)) return;
  
  try {
    const { error } = await supabaseClient
      .from('admin_users')
      .delete()
      .eq('email', email);
    
    if (error) throw error;
    
    $('adminMessage').innerHTML = '<div class="success-msg">Admin removed successfully!</div>';
    setTimeout(() => showAdminPanel(), 1000);
  } catch (error) {
    $('adminMessage').innerHTML = '<div class="error-msg">Error: ' + error.message + '</div>';
  }
}

// Expose admin functions to window
window.showAdminPanel = showAdminPanel;
window.closeAdminPanel = closeAdminPanel;
window.addNewAdmin = addNewAdmin;
window.removeAdmin = removeAdmin;
