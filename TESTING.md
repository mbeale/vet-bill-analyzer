# Testing Guide for PetCare AI

This guide covers testing procedures, sample data, and validation steps for PetCare AI.

## Table of Contents

1. [Setup Verification Tests](#setup-verification-tests)
2. [Manual Testing](#manual-testing)
3. [API Testing](#api-testing)
4. [Database Testing](#database-testing)
5. [Sample Data](#sample-data)
6. [Troubleshooting Tests](#troubleshooting-tests)

## Setup Verification Tests

Run these to verify your environment is correctly configured.

### Test 1: Environment Variables

```bash
# Verify all required environment variables are set
node -e "
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'GOOGLE_CLOUD_PROJECT_ID',
  'GOOGLE_CLOUD_PROCESSOR_ID',
  'GOOGLE_API_KEY'
];

const missing = required.filter(key => !process.env[key]);

if (missing.length === 0) {
  console.log('✓ All required environment variables are set');
} else {
  console.log('✗ Missing environment variables:');
  missing.forEach(key => console.log('  -', key));
  process.exit(1);
}
"
```

**Expected Output**: `✓ All required environment variables are set`

### Test 2: TypeScript Compilation

```bash
npm run type-check
```

**Expected Output**: Should complete without errors or type warnings

### Test 3: Application Build

```bash
npm run build
```

**Expected Output**: Should complete successfully with no errors

```
> next build
...
✓ Compiled successfully
```

### Test 4: Development Server Startup

```bash
npm run dev
```

**Expected Output**:
```
> next dev
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

  ✓ Ready in 1.2s
```

Press `Ctrl+C` to stop.

### Test 5: Application Accessibility

With the dev server running in another terminal:

```bash
curl http://localhost:3000
```

**Expected Output**: HTML response (200 OK) with page content

## Manual Testing

### Test 1: Home Page Load

1. Start dev server: `npm run dev`
2. Open `http://localhost:3000` in browser
3. Verify:
   - [ ] Page title shows "PetCare AI - Vet Bill Analyzer"
   - [ ] Upload area is visible with drag-and-drop support
   - [ ] File input accepts JPG, PNG, PDF
   - [ ] No console errors (check browser DevTools)

### Test 2: File Upload UI

1. In browser, hover over the upload area
2. Verify:
   - [ ] Border color changes to blue
   - [ ] Cursor changes to pointer
   - [ ] Helpful text is visible

3. Try dragging a file:
   - [ ] Drag a valid receipt image
   - [ ] Upload area highlights
   - [ ] File processes (shows spinner)

### Test 3: Invalid File Rejection

1. Try uploading an invalid file type:
   - Upload a `.txt` or `.xlsx` file
   - Verify: [ ] Alert appears: "Please upload a JPG, PNG, or PDF file"

2. Try uploading a large file:
   - Create a 15MB file
   - Try to upload
   - Verify: [ ] Alert appears: "File size must be less than 10MB"

### Test 4: Responsive Design

1. Open `http://localhost:3000`
2. Open DevTools (F12)
3. Test on different screen sizes:

```
Device           Width    Expected
Mobile           375px    Single column, stacked layout
Tablet           768px    Optimized for tablet
Desktop          1920px   Full layout
```

All layouts should be usable and not show horizontal scroll.

## API Testing

### Test 1: Health Check

Create a test file `test-api.sh`:

```bash
#!/bin/bash

# Test if dev server is running
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
  echo "✓ Dev server is running"
else
  echo "✗ Dev server is not running"
  echo "  Start with: npm run dev"
  exit 1
fi
```

Run it:
```bash
bash test-api.sh
```

### Test 2: Type Checking All Files

```bash
npm run type-check

# Or with watch mode for development
npx tsc --noEmit --watch
```

Should have zero errors.

### Test 3: Linting

```bash
npm run lint
```

Should complete with no errors (warnings are okay for now).

## Database Testing

### Test 1: Supabase Connection

```bash
# Create test-db.js
cat > test-db.js << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('✗ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
try {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (error) throw error;

  console.log('✓ Successfully connected to Supabase');
  console.log('  Query returned:', data?.length || 0, 'rows');
} catch (error) {
  console.error('✗ Failed to connect to Supabase');
  console.error('  Error:', error.message);
  process.exit(1);
}
EOF

# Run test
node test-db.js
```

**Expected Output**: `✓ Successfully connected to Supabase`

### Test 2: Schema Verification

In Supabase Dashboard, go to SQL Editor and run:

```sql
-- List all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected Output**: Should show these tables:
- `users`
- `receipts`
- `line_items`
- `procedure_benchmarks`
- `regional_aggregates`
- `audit_log`

### Test 3: RLS Policies

In Supabase SQL Editor, run:

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'receipts', 'line_items', 'audit_log');
```

**Expected Output**: All tables should have `rowsecurity` = `true`

### Test 4: Insert Test Data

```sql
-- Test insert (will fail if RLS isn't working correctly)
INSERT INTO public.procedure_benchmarks (
  procedure_key,
  procedure_name,
  zip_code,
  median_price,
  sample_size,
  species
) VALUES (
  'test_procedure',
  'Test Procedure',
  '78701',
  150.00,
  5,
  'dog'
);

-- Verify insert
SELECT * FROM public.procedure_benchmarks
WHERE procedure_key = 'test_procedure';

-- Clean up
DELETE FROM public.procedure_benchmarks
WHERE procedure_key = 'test_procedure';
```

## Sample Data

### Sample Receipt Data

If you want to test the extraction pipeline, use these example formats:

#### Example 1: Simple Receipt Format

```
HAPPY PAWS VETERINARY CLINIC
123 Main Street
Austin, TX 78701
(512) 555-0123

Date of Service: 2024-02-15
Patient: Max
Species: Dog
Weight: 45 lbs

ITEMIZED CHARGES:
Office Visit (30 min)           $75.00
Distemper/Parvovirus Vaccine   $45.00
Rabies Vaccine                 $35.00
Physical Exam                  $0.00 (included)
Heartworm Test                 $30.00

SUBTOTAL:                      $185.00
TAX (8.25%):                   $15.26
TOTAL DUE:                     $200.26

Payment Method: Credit Card
Status: PAID
```

#### Example 2: Dental Procedure

```
VET DENTAL SPECIALISTS
456 Oak Avenue
San Francisco, CA 94105

Date: 2024-02-20
Pet: Bella
Type: Cat
Weight: 8 lbs

SERVICE DESCRIPTION:              AMOUNT
Dental Cleaning (Level 2)         $250.00
Pre-operative Labs                $85.00
Anesthesia (feline)              $120.00
Post-operative Pain Management   $45.00

Total Charges:                   $500.00
Insurance Deductible:            -$50.00
Patient Responsibility:          $450.00
```

### Procedure Benchmark Sample Data

To seed the database with sample benchmarks:

```sql
INSERT INTO public.procedure_benchmarks (
  procedure_key, procedure_name, zip_code, location,
  median_price, p90_price, sample_size, species
) VALUES
  ('office_exam', 'Office Visit', '78701',
   ST_GeomFromText('POINT(-97.7431 30.2672)', 4326),
   75.00, 95.00, 42, 'dog'),

  ('vaccine_dhpp', 'DHPP Vaccine', '78701',
   ST_GeomFromText('POINT(-97.7431 30.2672)', 4326),
   45.00, 55.00, 38, 'dog'),

  ('dental_cleaning_level_1', 'Dental Cleaning', '78701',
   ST_GeomFromText('POINT(-97.7431 30.2672)', 4326),
   180.00, 250.00, 25, 'dog'),

  ('office_exam', 'Office Visit', '78701',
   ST_GeomFromText('POINT(-97.7431 30.2672)', 4326),
   55.00, 75.00, 35, 'cat');
```

## Troubleshooting Tests

### Test 1: Clear All State

If tests are failing, try resetting:

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Run type check
npm run type-check
```

### Test 2: Check Console for Errors

1. Start dev server: `npm run dev`
2. Open browser DevTools: `F12`
3. Check Console tab for errors
4. Try uploading a test file
5. Watch for error messages

### Test 3: Verify Credentials

```bash
# Check Supabase URL format
node -e "
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (url && url.includes('.supabase.co')) {
  console.log('✓ Supabase URL looks valid:', url);
} else {
  console.log('✗ Invalid Supabase URL:', url);
}
"

# Check Google API key format
node -e "
const key = process.env.GOOGLE_API_KEY;
if (key && key.length > 20) {
  console.log('✓ Google API key looks valid');
} else {
  console.log('✗ Google API key seems invalid');
}
"
```

### Test 4: Check Network Connectivity

```bash
# Test Supabase connectivity
curl -s https://$(echo $NEXT_PUBLIC_SUPABASE_URL | cut -d'/' -f3 | cut -d'.' -f1).supabase.co/rest/v1/users -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" | head -c 100

# If you get a response, Supabase is reachable
```

### Test 5: Verify File Permissions

```bash
# Check if .env.local is readable
test -r .env.local && echo "✓ .env.local is readable" || echo "✗ .env.local is not readable"

# Check if service account key is readable
test -r "$GOOGLE_APPLICATION_CREDENTIALS" && echo "✓ Google credentials file is readable" || echo "✗ Google credentials file is not readable"
```

## Testing Checklist

Before deploying, verify:

- [ ] All setup verification tests pass
- [ ] `npm run type-check` completes with 0 errors
- [ ] `npm run build` completes successfully
- [ ] `npm run dev` starts without errors
- [ ] Home page loads and is responsive
- [ ] File upload accepts valid files and rejects invalid ones
- [ ] Supabase connection works
- [ ] All database tables exist
- [ ] RLS policies are enabled
- [ ] No console errors in browser

## Continuous Testing

For development, keep these running in separate terminals:

**Terminal 1: Type Checking**
```bash
npx tsc --noEmit --watch
```

**Terminal 2: Dev Server**
```bash
npm run dev
```

**Terminal 3: Linting (optional)**
```bash
npm run lint
```

This way you get immediate feedback as you code.

## Next Steps

Once all tests pass:

1. Read [DEVELOPMENT.md](./DEVELOPMENT.md) to start coding
2. Review [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design
3. Check [PRD.md](./docs/PRD.md) for feature requirements
4. Start implementing features from the PRD!

## Getting Help

If tests fail:

1. Check the error message carefully
2. Run the test again to confirm
3. Check [GETTING_STARTED.md](./GETTING_STARTED.md) for setup help
4. Review the troubleshooting section above
5. Create an issue with the exact error and which test failed
