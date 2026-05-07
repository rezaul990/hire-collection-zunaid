# Data Replacement Feature

## Overview

When admin uploads new Excel files, **ALL old data is deleted** and replaced with the new data. This ensures the database always contains only the latest information.

## How It Works

### Upload Process:

1. **Admin clicks "Upload & Save to Database"**
2. **Confirmation dialog appears**: "This will REPLACE all existing data in the database. Are you sure?"
3. **Admin clicks OK**
4. **System deletes all old data**:
   - All records from `hire_collection_data` table
   - All records from `uploads` table
5. **System uploads new data**:
   - Processes the 3 Excel files
   - Saves new records to database
6. **Users see only the new data**

## Why Replace Instead of Append?

### Advantages:
✅ **Always current** - Database has only the latest data
✅ **No duplicates** - Old records don't accumulate
✅ **Clean data** - No confusion about which data is current
✅ **Simple** - One source of truth
✅ **Storage efficient** - Doesn't grow indefinitely

### Use Case:
This is perfect for **periodic reports** where:
- You upload new data weekly/monthly
- Old data becomes obsolete
- You want users to see only current information

## What Gets Deleted

### When Admin Uploads:
❌ **All hire_collection_data records** - Deleted
❌ **All upload batch records** - Deleted
✅ **User accounts** - Preserved
✅ **User profiles** - Preserved
✅ **Admin list** - Preserved

## Safety Features

### 1. Confirmation Dialog
Before deleting anything, admin must confirm:
```
"This will REPLACE all existing data in the database. 
Are you sure you want to continue?"
```

### 2. Admin-Only Access
- Only admins can upload/replace data
- Regular users cannot delete data
- Enforced at database level with RLS

### 3. Atomic Operation
- Delete and insert happen in one transaction
- If upload fails, old data remains
- No partial states

## User Experience

### For Admin:
1. Click "Upload New Data"
2. Select 3 Excel files
3. Click "Upload & Save to Database"
4. See confirmation: "This will REPLACE all existing data..."
5. Click OK
6. Wait for processing (shows progress)
7. See success message
8. New data automatically loaded

### For Regular Users:
- They see the data disappear briefly
- Then new data appears
- Filtered to their Plaza as usual
- No action needed on their part

## Example Scenario

### Current State:
```
Database has:
- 5,659 records from last week
- Upload date: May 1, 2026
```

### Admin Uploads New Data:
```
Admin uploads:
- 6,200 new records
- Upload date: May 7, 2026
```

### Result:
```
Database now has:
- 6,200 records (new data)
- Old 5,659 records: DELETED
- Users see only the 6,200 new records
```

## Technical Details

### Delete Query:
```javascript
// Delete all hire_collection_data
await supabaseClient
  .from('hire_collection_data')
  .delete()
  .neq('id', '00000000-0000-0000-0000-000000000000');

// Delete all uploads
await supabaseClient
  .from('uploads')
  .delete()
  .neq('id', '00000000-0000-0000-0000-000000000000');
```

### RLS Policy:
```sql
-- Only admins can delete
CREATE POLICY "Admins can delete all data" ON hire_collection_data
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );
```

## Progress Indicators

During upload, admin sees:
1. "Reading Excel files..."
2. "Processing data..."
3. "Deleting old data..."
4. "Saving new data to database..."
5. "Saving 500 of 6200 records..."
6. "Saving 1000 of 6200 records..."
7. "Successfully saved 6200 records to database!"

## Error Handling

### If Delete Fails:
- Upload stops
- Old data remains
- Error message shown
- Admin can try again

### If Upload Fails:
- Old data already deleted
- Database is empty
- Admin must upload again
- Error message shown

### Recovery:
- Admin can immediately upload again
- No permanent data loss if admin has Excel files
- System returns to normal after successful upload

## Alternative: Keep History (Future Enhancement)

If you want to keep historical data instead:

### Option 1: Archive Table
```sql
-- Move old data to archive before deleting
INSERT INTO hire_collection_data_archive 
SELECT * FROM hire_collection_data;
```

### Option 2: Soft Delete
```sql
-- Add deleted_at column
ALTER TABLE hire_collection_data 
ADD COLUMN deleted_at TIMESTAMPTZ;

-- Mark as deleted instead of deleting
UPDATE hire_collection_data 
SET deleted_at = NOW();
```

### Option 3: Version Control
```sql
-- Add version column
ALTER TABLE hire_collection_data 
ADD COLUMN version INTEGER;

-- Keep all versions, show only latest
SELECT * FROM hire_collection_data 
WHERE version = (SELECT MAX(version) FROM hire_collection_data);
```

But for now, **simple replacement** is implemented.

## Testing

### Test Replacement:
1. **Upload initial data** (e.g., 100 records)
2. **Verify data appears** in dashboard
3. **Upload new data** (e.g., 150 records)
4. **Confirm replacement** in dialog
5. **Verify**:
   - Old 100 records are gone
   - New 150 records appear
   - Batch dropdown shows only new upload
   - All users see new data

## Monitoring

### Check Current Data:
```sql
-- Count total records
SELECT COUNT(*) FROM hire_collection_data;

-- Check upload date
SELECT file_name, upload_date, row_count 
FROM uploads 
ORDER BY upload_date DESC 
LIMIT 1;
```

### Check Last Upload:
```sql
-- See latest upload info
SELECT * FROM uploads 
ORDER BY upload_date DESC 
LIMIT 1;
```

## Best Practices

### For Admin:
1. **Keep Excel files backed up** - In case you need to re-upload
2. **Verify data before uploading** - Check Excel files are correct
3. **Upload during off-hours** - Minimize user disruption
4. **Notify users** - Let them know new data is coming
5. **Test with small file first** - Verify process works

### For Users:
1. **Export important data** - Before admin uploads new data
2. **Refresh page** - After admin uploads to see new data
3. **Clear filters** - Old filter values may not exist in new data

## Summary

✅ **Feature**: Data replacement on upload
✅ **Trigger**: Admin uploads new Excel files
✅ **Action**: Delete all old data, insert new data
✅ **Safety**: Confirmation dialog required
✅ **Access**: Admin-only
✅ **Result**: Database always has latest data only

**This ensures your dashboard always shows current, up-to-date information!** 🎉
