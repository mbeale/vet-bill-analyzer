# PetCare AI - Vet Bill Analyzer

A transparency platform that empowers pet owners to validate veterinary costs using crowdsourced regional data.

## Quick Start with GitHub Codespaces

This project is configured to run seamlessly in GitHub Codespaces.

### Option 1: Create a New Codespace

1. Click on the "Code" button in the GitHub repository
2. Select the "Codespaces" tab
3. Click "Create codespace on main" (or your desired branch)
4. Wait for the container to initialize (usually 2-3 minutes)

The environment will automatically:
- Install Node.js dependencies
- Run TypeScript type checking
- Set up VS Code extensions

### Option 2: Open in VS Code Locally with Dev Containers

If running locally with VS Code:

1. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open this folder in VS Code
3. Click "Reopen in Container" when prompted
4. VS Code will build and start the development container

## Environment Setup

### 1. Configure Environment Variables

Create a `.env.local` file in the root directory (based on `.env.example`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Document AI Configuration
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_PROCESSOR_ID=your_processor_id
GOOGLE_CLOUD_LOCATION=us
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Google Generative AI (Gemini)
GOOGLE_API_KEY=your_gemini_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Initialize Supabase Database

Once you have a Supabase project:

1. Connect to your Supabase database
2. Run the schema from `supabase/schema.sql`:
   ```bash
   psql -h your-db-host -U postgres -d postgres -f supabase/schema.sql
   ```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint code
npm run lint
```

The dev server will run on `http://localhost:3000` and is accessible from your browser in Codespaces.

## Project Structure

```
vet-bill-analyzer/
├── .devcontainer/          # Dev container configuration
│   ├── devcontainer.json   # Codespaces setup
│   └── Dockerfile          # Container customization
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/                   # Utility functions
│   ├── supabase.ts        # Supabase client
│   ├── auth.ts            # Authentication
│   ├── storage.ts         # File storage
│   ├── documentai.ts      # OCR integration
│   ├── gemini.ts          # AI normalization
│   └── types.ts           # TypeScript types
├── supabase/              # Database configuration
│   └── schema.sql         # Database schema
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md    # Technical architecture
│   └── PRD.md            # Product requirements
└── package.json          # Dependencies
```

## Technology Stack

- **Frontend**: Next.js 15 (App Router) with TypeScript
- **Database**: Supabase (PostgreSQL + PostGIS)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **OCR**: Google Document AI
- **AI/ML**: Gemini 2.0 Flash
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (ready for production)

## Features

### Part A: AI Extraction Engine
- Multi-modal upload (JPG, PNG, PDF)
- OCR text extraction with Google Document AI
- Line item parsing and normalization
- Procedure mapping to standardized categories

### Part B: Regional Pricing Engine
- Geospatial lookups using PostGIS
- Fallback logic (5-digit zip → 3-digit → state-wide)
- Statistical analysis (median, percentiles, z-scores)
- Species and weight-based adjustments

### Part C: Transparency UI
- Color-coded verdicts (Green/Yellow/Red)
- Line-item breakdown with pricing comparisons
- Beeswarm plots for regional price distribution
- Actionable negotiation scripts

## Security & Privacy

- **Row Level Security (RLS)**: Users can only access their own data
- **PII Scrubbing**: Owner names and addresses removed before benchmarking
- **Encrypted Storage**: Sensitive data encrypted at rest
- **Audit Logging**: All data changes tracked for compliance

## Debugging in Codespaces

### Port Forwarding

The dev server port (3000) is automatically forwarded and accessible in Codespaces. You'll see a notification when the server starts.

### VS Code Extensions

The following extensions are automatically installed:

- TypeScript
- ESLint
- Prettier
- Tailwind CSS
- GitLens
- GitHub Copilot

### Useful Keyboard Shortcuts

- `Ctrl+` ` ` - Open integrated terminal
- `Ctrl+P` - Quick file open
- `Ctrl+Shift+D` - Debug view
- `F1` - Command palette

## Common Issues

### Dependencies not installing

If npm install fails in the devcontainer:

```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

### Port already in use

If port 3000 is already in use:

```bash
npm run dev -- -p 3001
```

### Database connection errors

Verify your Supabase credentials in `.env.local`:

```bash
# Test the connection
npm run type-check
```

## Documentation

- [Architecture Documentation](./docs/ARCHITECTURE.md) - System design and technical decisions
- [Product Requirements](./docs/PRD.md) - Feature specifications and user personas

## Support

For issues or questions, refer to the documentation or create an issue in the repository.

## License

Proprietary - PetCare AI
