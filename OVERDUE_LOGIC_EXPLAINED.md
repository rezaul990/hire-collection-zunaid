# Current Overdue and Previous Overdue Logic - UPDATED

## Overview

The system processes **three Excel files** to calculate and track overdue amounts:

1. **Target/Collection File** - Main data with account details
2. **Current Overdue File** - Latest overdue amounts
3. **Previous Overdue File** - Previous period's overdue amounts

---

## Updated Matching Logic (v3.1)

### Priority 1: Match by Invoice Number
- Most accurate and unique identifier
- Direct one-to-one match

### Priority 2: Match by Plaza + Account Number + Customer Name (Composite Key)
- Used when Invoice Number doesn't match
- More accurate than Account Number alone
- Prevents mismatches across different plazas
- Ensures customer identity verification

### If no match: Overdue = 0

---

## Why the Change?

### Old Logic Problem:
```javascript
// OLD: Only matched by Account Number
const cur = current.byAccount.get(r['Account No.']);
```

**Issues:**
- ❌ Same account number might exist in different plazas
- ❌ Account numbers might be reused
- ❌ No customer verification
- ❌ Could match wrong customer's overdue

### New Logic Solution:
```javascript
// NEW: Match by Plaza + Account + Customer
const compositeKey = `${plaza}|${account}|${customer}`.toLowerCase();
const cur = current.byComposite.get(compositeKey);
```

**Benefits:**
- ✅ Unique identification across plazas
- ✅ Verifies customer identity
- ✅ Prevents cross-plaza mismatches
- ✅ More accurate overdue tracking

---

## Data Flow

```
┌─────────────────────┐
│  Target File        │
│  (Main Data)        │
│  - Account No.      │
│  - Invoice No.      │
│  - Customer Info    │
│  - Collection Data  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐      ┌─────────────────────┐
│  Current Overdue    │      │  Previous Overdue   │
│  File               │      │  File               │
│  - Account No.      │      │  - Account No.      │
│  - Invoice No.      │      │  - Invoice No.      │
│  - Overdue Amount   │      │  - Overdue Amount   │
└──────────┬──────────┘      └──────────┬──────────┘
           │                             │
           └──────────┬──────────────────┘
                      ▼
           ┌─────────────────────┐
           │   Merge Logic       │
           │   (Match by         │
           │   Invoice/Account)  │
           └──────────┬──────────┘
                      ▼
           ┌─────────────────────┐
           │  Final Data         │
           │  - Current Overdue  │
           │  - Previous Overdue │
           │  - Overdue Change   │
           └─────────────────────┘
```

---

## Step-by-Step Logic

### Step 1: Parse Target File

**Function**: `parseTarget(workbook)`

**What it does:**
- Reads the main collection/target Excel file
- Extracts account information, invoice details, collection targets
- **Sets initial overdue values to 0**

**Key fields extracted:**
```javascript
{
  'Account No.': '12345',
  'Invoice No.': 'INV-001',
  'Customer Name': 'John Doe',
  'Collection Target': 5000,
  'Collection Achieve': 3000,
  'Current Overdue': 0,      // Initially 0
  'Previous Overdue': 0,     // Initially 0
  'Overdue Change': 0        // Initially 0
}
```

---

### Step 2: Parse Current Overdue File

**Function**: `parseOverdue(workbook)`

**What it does:**
- Reads the Current Overdue Excel file
- Extracts overdue amounts for each account/invoice
- Creates two lookup maps for matching:
  - `byInvoice` - Map by Invoice Number (Priority 1)
  - `byComposite` - Map by Plaza + Account + Customer (Priority 2)
- Extracts "As on Date" from the file

**Data structure:**
```javascript
{
  asOn: "31-Dec-24",           // Date from file
  byInvoice: Map {
    'INV-001' => {
      invoice: 'INV-001',
      account: '12345',
      plaza: 'Walton Plaza',
      customer: 'John Doe',
      overdue: 2000,           // Current overdue amount
      // ... other fields
    }
  },
  byComposite: Map {
    'walton plaza|12345|john doe' => {
      account: '12345',
      plaza: 'Walton Plaza',
      customer: 'John Doe',
      overdue: 2000,
      // ... other fields
    }
  }
}
```

**Composite Key Format:**
```javascript
const compositeKey = `${plaza}|${account}|${customer}`.toLowerCase();
// Example: "walton plaza|12345|john doe"
```

---

### Step 3: Parse Previous Overdue File

**Function**: `parseOverdue(workbook)`

**Same logic as Current Overdue**, but for the previous period:

```javascript
{
  asOn: "30-Nov-24",           // Previous period date
  byInvoice: Map {
    'INV-001' => {
      invoice: 'INV-001',
      account: '12345',
      overdue: 1500,           // Previous overdue amount
      // ... other fields
    }
  },
  byAccount: Map { ... }
}
```

---

### Step 4: Merge Data

**Function**: `mergeData(targetRows, current, previous)`

**This is where the magic happens!**

For each row in the Target file:

1. **Try to find matching Current Overdue (Priority 1 - Invoice):**
   ```javascript
   let cur = current.byInvoice.get(r['Invoice No.']);
   ```
   - First tries to match by Invoice Number
   - Most accurate and direct match

2. **If not found, try Composite Key (Priority 2):**
   ```javascript
   if (!cur) {
     const compositeKey = `${r['Plaza']}|${r['Account No.']}|${r['Customer Name']}`.toLowerCase();
     cur = current.byComposite.get(compositeKey);
   }
   ```
   - Matches by Plaza + Account + Customer Name
   - Case-insensitive matching
   - More accurate than Account Number alone

3. **Same logic for Previous Overdue:**
   ```javascript
   let prev = previous.byInvoice.get(r['Invoice No.']);
   if (!prev) {
     const compositeKey = `${r['Plaza']}|${r['Account No.']}|${r['Customer Name']}`.toLowerCase();
     prev = previous.byComposite.get(compositeKey);
   }
   ```

4. **Extract overdue amounts:**
   ```javascript
   const co = cur ? cur.overdue : 0;    // Current Overdue
   const po = prev ? prev.overdue : 0;  // Previous Overdue
   ```
   - If match found, use the overdue amount
   - If no match found, use 0

5. **Calculate Overdue Change:**
   ```javascript
   'Overdue Change': co - po
   ```
   - Positive value = Overdue increased
   - Negative value = Overdue decreased
   - Zero = No change

---

## Matching Priority

The system uses a **two-level matching strategy**:

### Priority 1: Match by Invoice Number ✅
```javascript
current.byInvoice.get(r['Invoice No.'])
```
- Most accurate match
- Unique identifier for each transaction
- Direct one-to-one mapping

### Priority 2: Match by Composite Key (Plaza + Account + Customer) ✅
```javascript
const compositeKey = `${plaza}|${account}|${customer}`.toLowerCase();
current.byComposite.get(compositeKey)
```
- Used when Invoice Number doesn't match
- Combines three fields for unique identification:
  - **Plaza** - Ensures location-specific matching
  - **Account Number** - Customer's account
  - **Customer Name** - Verifies identity
- Case-insensitive matching
- Prevents cross-plaza mismatches

### Why Composite Key?

**Example Problem with Old Logic:**

```
Plaza A:
  Account: 12345, Customer: "John Doe", Overdue: 2000

Plaza B:
  Account: 12345, Customer: "Jane Smith", Overdue: 5000
```

**Old Logic (Account Only):**
- Would match BOTH to Account 12345
- Could assign wrong overdue amount
- ❌ Inaccurate data

**New Logic (Plaza + Account + Customer):**
- Plaza A|12345|john doe → 2000 ✅
- Plaza B|12345|jane smith → 5000 ✅
- Accurate matching per plaza
- ✅ Correct data

---

## Example Scenarios

### Scenario 1: Perfect Match

**Target File:**
```
Account: 12345
Invoice: INV-001
```

**Current Overdue File:**
```
Account: 12345
Invoice: INV-001
Overdue: 2000
```

**Previous Overdue File:**
```
Account: 12345
Invoice: INV-001
Overdue: 1500
```

**Result:**
```javascript
{
  'Current Overdue': 2000,
  'Previous Overdue': 1500,
  'Overdue Change': +500    // Increased by 500
}
```

---

### Scenario 2: Only Current Overdue Exists

**Target File:**
```
Account: 12345
Invoice: INV-002
```

**Current Overdue File:**
```
Account: 12345
Invoice: INV-002
Overdue: 3000
```

**Previous Overdue File:**
```
(No matching record)
```

**Result:**
```javascript
{
  'Current Overdue': 3000,
  'Previous Overdue': 0,
  'Overdue Change': +3000   // New overdue
}
```

---

### Scenario 3: Overdue Cleared

**Target File:**
```
Account: 12345
Invoice: INV-003
```

**Current Overdue File:**
```
(No matching record)
```

**Previous Overdue File:**
```
Account: 12345
Invoice: INV-003
Overdue: 2500
```

**Result:**
```javascript
{
  'Current Overdue': 0,
  'Previous Overdue': 2500,
  'Overdue Change': -2500   // Cleared/Reduced
}
```

---

### Scenario 4: Invoice Match Fails, Composite Key Succeeds

**Target File:**
```
Plaza: Walton Plaza
Account: 12345
Customer: John Doe
Invoice: INV-004
```

**Current Overdue File:**
```
Plaza: Walton Plaza
Account: 12345
Customer: John Doe
Invoice: INV-999  (different invoice)
Overdue: 1800
```

**Matching Process:**
```javascript
// Step 1: Try Invoice match
cur = current.byInvoice.get('INV-004')  // ❌ Not found

// Step 2: Try Composite Key
compositeKey = 'walton plaza|12345|john doe'
cur = current.byComposite.get(compositeKey)  // ✅ Found!
```

**Result:**
```javascript
{
  'Current Overdue': 1800,  // Matched by Composite Key
  'Previous Overdue': ...,
  'Overdue Change': ...
}
```

---

### Scenario 5: Same Account, Different Plaza (NEW)

**Target File - Plaza A:**
```
Plaza: Walton Plaza
Account: 12345
Customer: John Doe
Invoice: INV-005
```

**Target File - Plaza B:**
```
Plaza: Mirpur Plaza
Account: 12345
Customer: Jane Smith
Invoice: INV-006
```

**Current Overdue File:**
```
Plaza: Walton Plaza, Account: 12345, Customer: John Doe, Overdue: 2000
Plaza: Mirpur Plaza, Account: 12345, Customer: Jane Smith, Overdue: 5000
```

**Matching Process:**
```javascript
// For Plaza A record:
compositeKey = 'walton plaza|12345|john doe'
cur = current.byComposite.get(compositeKey)  // ✅ Gets 2000

// For Plaza B record:
compositeKey = 'mirpur plaza|12345|jane smith'
cur = current.byComposite.get(compositeKey)  // ✅ Gets 5000
```

**Result:**
- Plaza A gets correct overdue: **2000 BDT** ✅
- Plaza B gets correct overdue: **5000 BDT** ✅
- No cross-plaza confusion! ✅

---

## Key Points

### 1. Matching Logic
- ✅ **Invoice Number** is the primary key
- ✅ **Account Number** is the fallback key
- ✅ If neither matches, overdue = 0

### 2. Overdue Change Calculation
```javascript
Overdue Change = Current Overdue - Previous Overdue
```
- **Positive** (+) = Overdue increased (bad)
- **Negative** (-) = Overdue decreased (good)
- **Zero** (0) = No change

### 3. Data Integrity
- Missing records are treated as 0 overdue
- System handles partial data gracefully
- No errors if records don't match

### 4. "As on Date" Extraction
```javascript
function extractAsOnDate(rows) {
  // Searches first 8 rows for date patterns
  // Looks for "As on Date" text
  // Extracts date in format: DD-MMM-YY
}
```

---

## Visual Representation

### Color Coding in UI

**Current Overdue Column:**
```css
.ov-cell {
  color: #c0392b;           /* Red text */
  font-weight: 700;         /* Bold */
  background: #fff0f0;      /* Light red background */
}
```

**Previous Overdue Column:**
```css
.pv-cell {
  color: #7b5a00;           /* Brown text */
  background: #fffbeb;      /* Light yellow background */
}
```

**Overdue Change:**
```css
.red-chg {                  /* Increased */
  color: #c0392b;
  font-weight: 700;
}

.grn-chg {                  /* Decreased */
  color: #276749;
  font-weight: 700;
}
```

---

## Database Storage

After merging, data is stored in `hire_collection_data` table:

```sql
CREATE TABLE hire_collection_data (
  ...
  current_overdue NUMERIC,      -- From Current Overdue file
  previous_overdue NUMERIC,     -- From Previous Overdue file
  overdue_change NUMERIC,       -- Calculated: current - previous
  ...
);
```

---

## Summary

### Input Files
1. **Target File** - Base data with account/invoice info
2. **Current Overdue File** - Latest overdue amounts
3. **Previous Overdue File** - Previous period overdue amounts

### Processing
1. Parse all three files
2. Create lookup maps (by Invoice and Account)
3. Match records using Invoice No. → Account No. priority
4. Calculate overdue change

### Output
- **Current Overdue**: Latest overdue amount
- **Previous Overdue**: Previous period overdue amount
- **Overdue Change**: Difference (current - previous)

### Business Logic
- **Positive change** = Customer's overdue increased (needs attention)
- **Negative change** = Customer paid down overdue (good progress)
- **Zero change** = No change in overdue status

---

**© All Rights Reserved By Zunaid Nomani**
