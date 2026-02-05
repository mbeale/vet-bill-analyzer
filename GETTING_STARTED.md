# Getting Started with PetCare AI

This guide provides step-by-step instructions to set up and run PetCare AI locally or in GitHub Codespaces.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (5 minutes)](#quick-start-5-minutes)
3. [Detailed Setup](#detailed-setup)
4. [Verifying Your Setup](#verifying-your-setup)
5. [Running the Application](#running-the-application)
6. [Next Steps](#next-steps)

## Prerequisites

### Required

- **Node.js 18+** and npm 9+ (installed and in PATH)
- **Git** (for cloning and version control)
- A **Supabase account** (free tier is fine)
- A **Google Cloud Project** with Document AI and Generative AI APIs enabled
- A **Gemini API key** from Google AI Studio

### Optional (Recommended)

- **VS Code** with Dev Containers extension (for local development)
- **Docker Desktop** (if running locally with containers)
- **GitHub CLI** (for Codespaces)

## Quick Start (5 minutes)

### Option 1: GitHub Codespaces (Easiest)

```bash
# 1. Click "Code" → "Codespaces" → "Create codespace on main"
# 2. Wait for container to initialize (2-3 minutes)
# 3. In the terminal:

npm run setup

# 4. Edit .env.local with your credentials (see step-by-step below)
# 5. Run:

npm run dev
```

### Option 2: Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/mbeale/vet-bill-analyzer.git
cd vet-bill-analyzer

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Add your credentials to .env.local (see below)

# 5. Run development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Detailed Setup

### Step 1: Set Up Supabase

Supabase provides the database and authentication for PetCare AI.

#### 1.1 Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: `vet-bill-analyzer` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to you
4. Click "Create new project" and wait (2-3 minutes)

#### 1.2 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** (public) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

#### 1.3 Initialize Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Open `supabase/schema.sql` from this repository in a text editor
4. Copy the entire contents
5. Paste into Supabase SQL Editor
6. Click **Run** (execute button)
7. Wait for completion (should see green checkmarks)

**Status Check**: Go to **Table Editor** and verify these tables exist:
- `users`
- `receipts`
- `line_items`
- `procedure_benchmarks`
- `regional_aggregates`

### Step 2: Set Up Google Cloud

Google Cloud provides OCR and AI capabilities.

#### 2.1 Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click project dropdown → **New Project**
3. Name it `PetCare AI`
4. Click **Create** and wait

#### 2.2 Enable Required APIs

1. Go to **APIs & Services** → **Library**
2. Search and enable these APIs:
   - **Document AI API**
   - **Cloud Vision API**
   - **Generative Language API**

3. For each API:
   - Click the API name
   - Click **Enable** button
   - Wait for confirmation

#### 2.3 Create a Service Account (for Document AI)

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **Service Account**
3. Fill in:
   - **Service account name**: `vet-bill-analyzer`
   - **Service account ID**: auto-generated
   - **Description**: PetCare AI OCR processor
4. Click **Create and continue**
5. Click **Continue** twice (skip optional steps)
6. Click **Done**

#### 2.4 Get Service Account Key

1. In **Credentials**, under **Service Accounts**, click the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key** → **JSON**
4. A JSON file downloads
5. **IMPORTANT**: Move this file to a secure location, NOT in your git repository
6. Update `.env.local`:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account-key.json
   ```

#### 2.5 Create a Document AI Processor

1. Go to **Document AI** → **Processors**
2. Click **Create Processor**
3. Name: `Vet Receipt Processor`
4. Select **Expense Processor** (matches vet receipts well)
5. Region: Same as your project
6. Click **Create**
7. Copy the **Processor ID** and **Project Number** (shown on the detail page)
8. Update `.env.local`:
   ```
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_PROCESSOR_ID=your-processor-id
   GOOGLE_CLOUD_LOCATION=us
   ```

### Step 3: Get Gemini API Key

Gemini powers the procedure normalization.

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** in the top bar
3. Click **Create API key in new project**
4. Copy the generated key
5. Update `.env.local`:
   ```
   GOOGLE_API_KEY=your-gemini-api-key
   ```

### Step 4: Create .env.local

Create a `.env.local` file in the project root with:

```bash
# Supabase (from Step 1.2)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Cloud (from Step 2)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_PROCESSOR_ID=your-processor-id
GOOGLE_CLOUD_LOCATION=us
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Gemini (from Step 3)
GOOGLE_API_KEY=your-gemini-api-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Security Note**: Never commit `.env.local` to git. It's already in `.gitignore`.

## Verifying Your Setup

Run these commands to verify everything is configured correctly:

```bash
# 1. Type check
npm run type-check

# This should complete without errors

# 2. Check environment variables
node -e "console.log('✓ All required env vars present')" || echo "✗ Missing env vars"

# 3. Try building
npm run build

# This validates your entire setup
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Output should show:
```
> next dev
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

**Access the app**:
- **Local**: Open `http://localhost:3000` in browser
- **Codespaces**: Click the notification or use the Ports tab

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Production Deployment

PetCare AI is ready for Vercel:

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## Common Setup Issues

### "Module not found" errors

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run type-check
```

### "Cannot find Supabase URL" or auth errors

Verify `.env.local` has correct values:
```bash
# Check if values are loaded
npm run dev

# Should connect without errors
```

### "Google Cloud credentials not found"

```bash
# Verify file exists
ls -la /path/to/service-account-key.json

# Check env var is set correctly
echo $GOOGLE_APPLICATION_CREDENTIALS
```

### "Cannot connect to database"

1. Verify Supabase project is running
2. Check network connectivity
3. Verify credentials are correct:
   - Go to Supabase Dashboard
   - Settings → API
   - Copy fresh credentials to `.env.local`

### Port 3000 already in use

```bash
# Use different port
npm run dev -- -p 3001

# Then visit http://localhost:3001
```

## Next Steps

After successful setup:

1. **Read the Architecture**: [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
2. **Understand the Features**: [PRD.md](./docs/PRD.md)
3. **Learn Development**: [DEVELOPMENT.md](./docs/DEVELOPMENT.md)
4. **Run Tests**: [TESTING.md](./TESTING.md)
5. **Start Coding!**

## File Structure

```
vet-bill-analyzer/
├── .devcontainer/        # Codespaces configuration
├── .env.example          # Template for environment variables
├── .env.local            # Your actual credentials (never commit!)
├── app/                  # Next.js application
│   ├── components/       # React components
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/                  # Utilities and integrations
│   ├── supabase.ts       # Database client
│   ├── auth.ts           # Authentication
│   ├── documentai.ts     # OCR integration
│   ├── gemini.ts         # AI integration
│   └── types.ts          # TypeScript types
├── supabase/
│   └── schema.sql        # Database schema
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md   # System design
│   └── PRD.md           # Requirements
├── package.json          # Dependencies
└── README.md            # Main documentation
```

## Troubleshooting Checklist

Before asking for help, verify:

- [ ] Node.js 18+ installed: `node --version`
- [ ] npm 9+ installed: `npm --version`
- [ ] Dependencies installed: `npm install`
- [ ] `.env.local` exists with all values filled
- [ ] Supabase database tables created
- [ ] Google Cloud APIs enabled
- [ ] Google credentials file exists and path is correct
- [ ] Development server starts: `npm run dev`
- [ ] No TypeScript errors: `npm run type-check`

## Getting Help

1. Check the [README.md](./README.md) main documentation
2. See [DEVELOPMENT.md](./DEVELOPMENT.md) for dev workflow
3. Check error messages carefully - they're usually descriptive
4. Try the Troubleshooting Checklist above
5. Create an issue in the GitHub repository with:
   - What you were trying to do
   - The exact error message
   - Your Node.js and npm versions
   - Your OS

## Success!

Once you see the Next.js dev server running and can access `http://localhost:3000`, you're all set! 🎉

Proceed to [DEVELOPMENT.md](./DEVELOPMENT.md) to start building features.
