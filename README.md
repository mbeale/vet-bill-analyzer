# PetCare AI - Vet Bill Analyzer

[![GitHub](https://img.shields.io/badge/github-mbeale%2Fvet--bill--analyzer-blue)](https://github.com/mbeale/vet-bill-analyzer)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-black)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6)]()

A transparency platform that empowers pet owners to validate veterinary costs using crowdsourced regional data.

## 🚀 Quick Start

### GitHub Codespaces (Recommended - No Setup Needed)

1. Click **Code** → **Codespaces** → **Create codespace on main**
2. Wait 2-3 minutes for the container to initialize
3. In the terminal, run:
   ```bash
   npm run setup
   ```
4. Edit `.env.local` with your credentials
5. Run `npm run dev`

### Local Development

```bash
# Clone repository
git clone https://github.com/mbeale/vet-bill-analyzer.git
cd vet-bill-analyzer

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [GETTING_STARTED.md](./GETTING_STARTED.md) | **Start here**: Step-by-step setup guide with detailed credentials setup |
| [TESTING.md](./TESTING.md) | Testing procedures, sample data, and verification steps |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Development workflow, coding standards, and best practices |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design, technical stack, and data flow |
| [docs/PRD.md](./docs/PRD.md) | Product requirements, user personas, and feature specifications |
| [.devcontainer/SETUP.md](./.devcontainer/SETUP.md) | Codespaces-specific setup instructions |

## 🎯 What to Do Next

**First time?** Start with [GETTING_STARTED.md](./GETTING_STARTED.md)

**Ready to code?** Go to [DEVELOPMENT.md](./DEVELOPMENT.md)

**Need to verify setup?** Check [TESTING.md](./TESTING.md)

**Want to understand the system?** Read [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## 🛠 Development Commands

```bash
# Start development server with hot reload
npm run dev

# Type check without compiling
npm run type-check

# Build for production
npm run build

# Start production build locally
npm start

# Run linter
npm run lint

# Full setup (dependencies + type check)
npm run setup
```

## 🏗 Project Structure

```
vet-bill-analyzer/
├── .devcontainer/          # Codespaces configuration
│   ├── devcontainer.json   # Container setup
│   └── SETUP.md           # Codespaces guide
├── app/                    # Next.js App Router
│   ├── components/         # React components
│   │   ├── FileUpload.tsx
│   │   └── VerdictDisplay.tsx
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Styles
├── lib/                   # Utilities & integrations
│   ├── auth.ts            # Authentication
│   ├── supabase.ts        # Database client
│   ├── storage.ts         # File storage
│   ├── documentai.ts      # OCR
│   ├── gemini.ts          # AI
│   └── types.ts           # TypeScript types
├── supabase/              # Database
│   └── schema.sql         # Schema
├── scripts/               # Utilities
│   └── setup.sh          # Setup script
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md    # System design
│   └── PRD.md            # Requirements
├── GETTING_STARTED.md     # Setup guide
├── TESTING.md            # Testing guide
├── DEVELOPMENT.md        # Dev guide
└── package.json          # Dependencies
```

## 🔧 Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 15 (App Router) with TypeScript |
| **Database** | Supabase (PostgreSQL + PostGIS) |
| **Authentication** | Supabase Auth |
| **File Storage** | Supabase Storage (S3-compatible) |
| **OCR** | Google Document AI |
| **AI/ML** | Gemini 2.0 Flash |
| **Styling** | Tailwind CSS |
| **Deployment** | Vercel |
| **Dev Environment** | GitHub Codespaces / Dev Containers |

## ✨ Features

### Part A: AI Extraction Engine
- Multi-modal upload (JPG, PNG, PDF)
- OCR text extraction with Google Document AI
- Procedure normalization with Gemini 2.0 Flash
- Standardized procedure categorization

### Part B: Regional Pricing Engine
- Geospatial lookups using PostGIS
- Fallback logic (5-digit zip → 3-digit → state-wide)
- Statistical analysis (median, percentiles, z-scores)
- Species and weight-based adjustments

### Part C: Transparency UI
- Color-coded verdicts (Green/Yellow/Red)
- Line-item breakdown with regional comparisons
- Price distribution visualization
- Actionable negotiation recommendations

## 🔒 Security & Privacy

- **Row Level Security (RLS)**: Users see only their own data
- **PII Scrubbing**: Names and addresses removed before benchmarking
- **Encrypted Storage**: Sensitive data encrypted at rest
- **Audit Logging**: All changes tracked for compliance
- **No Secrets in Code**: All credentials in `.env.local` (git-ignored)

## 📋 Setup Checklist

Before starting development:

- [ ] Read [GETTING_STARTED.md](./GETTING_STARTED.md)
- [ ] Set up Supabase account and project
- [ ] Create Google Cloud project and enable APIs
- [ ] Get Gemini API key
- [ ] Create `.env.local` with all credentials
- [ ] Run `npm install`
- [ ] Run `npm run type-check` (should pass)
- [ ] Run `npm run dev` and verify `http://localhost:3000` loads
- [ ] Run through [TESTING.md](./TESTING.md) verification tests

## 🐛 Troubleshooting

### Development Server Won't Start

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run type-check
npm run dev
```

### Database Connection Errors

1. Verify `.env.local` has correct Supabase URL and keys
2. Check Supabase project is running
3. Go to Supabase Dashboard → Settings → API
4. Copy fresh credentials and update `.env.local`

### TypeScript Errors

```bash
npm run type-check

# Fix issues and try again
```

### Module Not Found

```bash
# Ensure dependencies are installed
npm install

# Check file names (case-sensitive on Linux/Mac)
```

See [GETTING_STARTED.md](./GETTING_STARTED.md#common-setup-issues) for more troubleshooting.

## 🚀 Development Workflow

1. **Create branch**: `git checkout -b feature/your-feature`
2. **Start dev server**: `npm run dev`
3. **Make changes**: Files auto-reload in browser
4. **Type check**: `npm run type-check` in another terminal
5. **Test**: Follow [TESTING.md](./TESTING.md)
6. **Commit**: `git commit -m "Your message"`
7. **Push**: `git push origin feature/your-feature`
8. **Create PR**: Link to GitHub repository

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed workflow.

## 🧪 Testing

Before submitting a PR:

```bash
# Run all checks
npm run type-check
npm run build
npm run dev

# Test manually in browser
# See TESTING.md for comprehensive testing guide
```

## 📖 User Personas

- **The Anxious Owner**: Just paid a big vet bill; needs validation
- **The Budgeter**: Shopping around for procedures like dentals
- **The Contributor**: Wants to help other pet owners by sharing data

## 🎯 Success Metrics

- **Extraction Accuracy**: >90% correct procedure mapping
- **Database Growth**: Unique zip codes with 5+ data points
- **User Conversion**: % of users who scan a second bill

## 🔄 Development Phases

- **Phase 1 (Seed)**: Manual data import from 10 major US cities
- **Phase 2 (Alpha)**: First 500 users with manual verification
- **Phase 3 (Beta)**: Automated aggregation and Stripe integration

## 📝 Coding Standards

- **Language**: TypeScript with strict mode
- **Formatting**: Prettier (auto on save)
- **Linting**: ESLint
- **Components**: Functional React with hooks
- **Naming**: camelCase (vars), PascalCase (components), UPPER_SNAKE_CASE (constants)

See [DEVELOPMENT.md](./DEVELOPMENT.md#coding-standards) for details.

## 🔐 Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY    # Supabase public key
SUPABASE_SERVICE_ROLE_KEY        # Supabase service role (secret)
GOOGLE_CLOUD_PROJECT_ID          # Google Cloud project ID
GOOGLE_CLOUD_PROCESSOR_ID        # Document AI processor ID
GOOGLE_CLOUD_LOCATION            # Google Cloud location (usually 'us')
GOOGLE_APPLICATION_CREDENTIALS   # Path to service account JSON
GOOGLE_API_KEY                   # Gemini API key
NEXT_PUBLIC_APP_URL              # Application base URL
```

**Never commit `.env.local`** - It's already in `.gitignore`

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GitHub Codespaces Guide](https://docs.github.com/en/codespaces)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run type-check && npm run build`
4. Write tests in [TESTING.md](./TESTING.md) format
5. Create a pull request
6. Link to any related issues

## 📞 Support

- **Setup Issues?** See [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Testing Questions?** See [TESTING.md](./TESTING.md)
- **Development Help?** See [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Architecture Questions?** See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## 📄 License

Proprietary - PetCare AI MVP

## 🎉 Getting Started

Ready to begin? Follow these steps:

1. **First Time?** → Read [GETTING_STARTED.md](./GETTING_STARTED.md)
2. **Set Up Environment** → Follow [GETTING_STARTED.md](./GETTING_STARTED.md#detailed-setup)
3. **Verify Setup** → Run tests from [TESTING.md](./TESTING.md)
4. **Start Developing** → Read [DEVELOPMENT.md](./DEVELOPMENT.md)
5. **Understand System** → Read [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

**Let's build something amazing for pet owners! 🐾**
