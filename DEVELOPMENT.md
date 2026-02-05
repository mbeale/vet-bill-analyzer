# Development Guide for PetCare AI

This guide covers development workflow, architecture decisions, coding standards, and best practices.

## Table of Contents

1. [Development Workflow](#development-workflow)
2. [Project Structure](#project-structure)
3. [Coding Standards](#coding-standards)
4. [Key Concepts](#key-concepts)
5. [Adding Features](#adding-features)
6. [Debugging](#debugging)
7. [Performance](#performance)
8. [Security](#security)

## Development Workflow

### Daily Setup

1. **Start Dev Server**
   ```bash
   npm run dev
   ```
   This runs Next.js in watch mode. Changes auto-reload in browser.

2. **Open in Browser**
   - Local: `http://localhost:3000`
   - Codespaces: Port auto-forwards in notification

3. **Start Type Checking**
   In a separate terminal:
   ```bash
   npx tsc --noEmit --watch
   ```
   This catches type errors immediately.

4. **Open VS Code**
   - Extensions auto-load (Prettier, ESLint, TypeScript)
   - Format on save is enabled

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make code changes**
   - Auto-format on save (via Prettier)
   - Type-check in real-time (via TypeScript)
   - Dev server hot-reloads changes

3. **Test your changes**
   - Open DevTools (F12) to check for console errors
   - Test responsive design (resize browser)
   - Follow manual testing procedures in [TESTING.md](./TESTING.md)

4. **Commit frequently**
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Fill in description
   - Wait for CI checks
   - Request review if needed

## Project Structure

```
vet-bill-analyzer/
├── .devcontainer/           # Codespaces configuration
├── app/                     # Next.js App Router
│   ├── components/          # React components
│   │   ├── FileUpload.tsx  # Upload component
│   │   └── VerdictDisplay.tsx # Results component
│   ├── api/                 # API routes (TBD)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── lib/                    # Shared utilities
│   ├── auth.ts             # Auth functions
│   ├── supabase.ts         # DB client setup
│   ├── storage.ts          # File storage
│   ├── documentai.ts       # OCR integration
│   ├── gemini.ts           # AI integration
│   └── types.ts            # TypeScript types
├── supabase/
│   └── schema.sql          # Database schema
├── scripts/
│   └── setup.sh            # Setup automation
├── docs/
│   ├── ARCHITECTURE.md     # System design
│   └── PRD.md             # Requirements
├── package.json            # Dependencies
├── tsconfig.json          # TypeScript config
├── next.config.js         # Next.js config
└── tailwind.config.ts     # Tailwind CSS config
```

### Adding a New Component

Example: Adding an authentication page

```
1. Create file: app/auth/page.tsx
2. Create component: app/components/AuthForm.tsx
3. Add types: lib/types.ts
4. Add utilities: lib/auth.ts
5. Import and use in page
6. Test in browser
7. Commit: git commit -m "Add authentication page"
```

### Adding a New API Route

Example: Adding `/api/extract` for receipt processing

```
1. Create file: app/api/extract/route.ts
2. Implement POST handler
3. Add validation with Zod
4. Call utilities (documentai, gemini, supabase)
5. Return JSON response
6. Test with curl or Postman
7. Commit: git commit -m "Add extraction API endpoint"
```

## Coding Standards

### TypeScript

- **Strict Mode**: Enabled in `tsconfig.json`
- **No `any`**: Always provide explicit types
- **Interfaces for Data**: Use for all API responses and DB models

Example:
```typescript
// ✓ Good
interface User {
  id: string;
  email: string;
  created_at: string;
}

// ✗ Avoid
const user: any = { ... };
```

### React/Components

- **Functional Components**: Only use functional components
- **Hooks Only**: Use only React hooks (no class components)
- **File Naming**: PascalCase for component files

Example:
```typescript
// ✓ Good - app/components/FileUpload.tsx
'use client';

export default function FileUpload({ onUpload }: Props) {
  return <div>...</div>;
}

// ✗ Avoid - class components
class FileUpload extends React.Component { ... }
```

### Naming Conventions

```
Variables/Functions:   camelCase
Components:           PascalCase
Constants:            UPPER_SNAKE_CASE
Files (components):   PascalCase.tsx
Files (utilities):    camelCase.ts
Database columns:     snake_case
API routes:           /api/kebab-case
```

### Formatting

All formatting is automated via Prettier:
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Max 100 character lines
- Trailing commas in multi-line objects

Files auto-format on save in VS Code.

### Comments

- **Use sparingly**: Code should be self-documenting
- **Why, not what**: Explain reasoning, not obvious details
- **JSDoc for functions**: Document complex functions

Example:
```typescript
// ✓ Good - explains why
// Use geospatial index for sub-millisecond queries across large datasets
const query = `
  SELECT * FROM procedure_benchmarks
  WHERE ST_DWithin(location, $1, 40233)
`;

// ✗ Avoid - just restates code
const x = a + b; // add a and b
```

## Key Concepts

### Three-Part Architecture

**Part A: Extraction Engine**
- User uploads receipt → stored in Supabase Storage
- Google Document AI extracts text
- Gemini 2.0 Flash maps to standardized procedures
- Result: structured `line_items` in database

**Part B: Regional Pricing Engine**
- Query `procedure_benchmarks` table
- Use geospatial queries (PostGIS) for nearest zip code
- Calculate median, percentiles, z-score
- Result: pricing statistics

**Part C: Transparency UI**
- Display color-coded verdict (Green/Yellow/Red)
- Show line-item breakdown
- Render price comparison chart
- Suggest actions (negotiation script)

### Data Flow

```
User Upload
    ↓
Supabase Storage (file.pdf)
    ↓
Google Document AI (OCR text)
    ↓
Gemini 2.0 Flash (normalize procedures)
    ↓
Database (store extracted data)
    ↓
PostGIS (find regional prices)
    ↓
Verdict Algorithm (calculate scores)
    ↓
Frontend (display results)
```

### Database Schema

**Key Tables**:

- `receipts`: One per user upload
- `line_items`: Individual charges from receipt
- `procedure_benchmarks`: Pricing data by zip/procedure
- `users`: User profiles and subscription

**Key Relationships**:
```
users (1) ← → (many) receipts ← (many) line_items
                          ↓
                procedure_benchmarks (for comparison)
```

### Authentication

- Supabase Auth handles user login/signup
- JWTs stored in browser cookies
- RLS policies enforce per-user data access
- Service role key used for admin operations only

## Adding Features

### Example: Add New Verdict Color

Suppose we want to add "Orange" verdict between Yellow and Red.

**Step 1**: Update types
```typescript
// lib/types.ts
export type VerdictStatus = 'green' | 'yellow' | 'orange' | 'red';
```

**Step 2**: Update verdict algorithm
```typescript
// lib/verdict.ts (new file)
function calculateVerdict(zScore: number): VerdictStatus {
  if (zScore <= 1) return 'green';
  if (zScore <= 1.5) return 'yellow';
  if (zScore <= 2) return 'orange';  // NEW
  return 'red';
}
```

**Step 3**: Update UI component
```typescript
// app/components/VerdictDisplay.tsx
const statusConfig = {
  // ... existing configs
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-800',
    title: 'Higher Than Regional Average',
    icon: '⚠',
  },
};
```

**Step 4**: Update Tailwind colors if needed
```typescript
// tailwind.config.ts
// Already has orange colors defined
```

**Step 5**: Test
```bash
npm run type-check
npm run dev
# Test with various prices to trigger orange verdict
```

**Step 6**: Commit
```bash
git add lib/types.ts lib/verdict.ts app/components/VerdictDisplay.tsx
git commit -m "Add orange verdict level between yellow and red"
```

### Example: Add Database Migration

If you need to modify the schema:

1. **Create migration file**
   ```bash
   touch supabase/migrations/001_add_new_column.sql
   ```

2. **Write SQL**
   ```sql
   ALTER TABLE receipts
   ADD COLUMN confidence_score DECIMAL DEFAULT 0.0;
   ```

3. **Run in Supabase**
   - Go to SQL Editor
   - Paste migration
   - Execute

4. **Update schema.sql** for future setups
   ```bash
   cat supabase/schema.sql supabase/migrations/001_*.sql > supabase/schema-full.sql
   ```

5. **Commit**
   ```bash
   git add supabase/
   git commit -m "Add confidence score to receipts table"
   ```

## Debugging

### Browser DevTools

Press `F12` to open Chrome DevTools:

- **Console**: View console logs and errors
- **Network**: Check API requests to Supabase, Google APIs
- **Application**: View cookies, local storage, session storage
- **Sources**: Set breakpoints and debug JavaScript

### VS Code Debugger

1. Set breakpoint (click line number)
2. Press F5 to start debugger
3. App stops at breakpoint
4. Inspect variables in sidebar
5. Use console at bottom

### Useful Console Commands

```javascript
// Check auth status
localStorage.getItem('supabase.auth.token')

// View environment variables
fetch('/api/env').then(r => r.json()).then(console.log)

// Test fetch to Supabase
fetch('https://your-project.supabase.co/rest/v1/users', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
}).then(r => r.json()).then(console.log)
```

### Common Issues

**Black screen after upload**
- Check browser console for errors
- Verify API credentials in .env.local
- Ensure Supabase tables were created

**"Cannot find module" error**
- Run `npm install`
- Check file paths (imports are case-sensitive on Linux)

**Slow performance**
- Check Network tab for slow requests
- Look for unused dependencies in package.json
- Profile with Chrome DevTools Performance tab

## Performance

### Key Metrics

- **Lighthouse Score**: Aim for >90 on all categories
- **First Paint**: < 2 seconds
- **Interaction**: < 100ms
- **Bundle Size**: Keep under 200KB (gzip)

### Optimization Tips

1. **Code Splitting**: Next.js does this automatically
2. **Image Optimization**: Use Next.js Image component (future feature)
3. **Lazy Loading**: Use React.lazy() for components
4. **Bundle Analysis**: Run `npm run analyze` (if available)

```bash
# Check build output
npm run build

# Look for warnings about large chunks
```

### Monitoring

After deployment to Vercel, check:
- Vercel Analytics Dashboard
- Web Vitals
- Error rates

## Security

### Critical Rules

1. **Never commit `.env.local`**
   - It's in `.gitignore`
   - Contains API keys and secrets

2. **Use HTTPS only**
   - Never send credentials over HTTP
   - Vercel handles this automatically

3. **Validate all inputs**
   ```typescript
   // Use Zod for validation
   const schema = z.object({
     email: z.string().email(),
     password: z.string().min(8),
   });

   const result = schema.safeParse(input);
   if (!result.success) {
     throw new Error('Invalid input');
   }
   ```

4. **Protect sensitive endpoints**
   ```typescript
   // Check authentication before processing
   const user = await getCurrentUser();
   if (!user) {
     return Response.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

5. **RLS for database access**
   - All user data protected by RLS policies
   - Never query with service role key from browser

6. **Scrub PII before aggregating**
   - Remove user names and specific addresses
   - Keep only zip code and clinic name
   - Implement in `gemini.ts` before storing

### Dependency Updates

Keep dependencies updated:

```bash
# Check for updates
npm outdated

# Update minor/patch versions
npm update

# Update major versions (careful!)
npm install package@latest
```

Always test after updates:
```bash
npm run type-check
npm run build
npm run dev
```

## Useful Commands Reference

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run type-check       # Check TypeScript without compiling
npm run lint             # Run ESLint

# Building
npm run build            # Production build
npm start                # Run production build locally

# Setup
npm run setup            # Initialize project (installs deps, etc)

# Maintenance
npm cache clean --force  # Clear npm cache
npm update               # Update dependencies
npm audit                # Check for security issues
```

## File Naming Conventions

```
app/                          # App Router pages and layouts
  ├── components/             # Reusable UI components (PascalCase)
  │   ├── FileUpload.tsx
  │   ├── VerdictDisplay.tsx
  │   └── Chart.tsx
  ├── api/                    # API routes
  │   ├── extract/
  │   │   └── route.ts        # /api/extract
  │   └── verdict/
  │       └── route.ts        # /api/verdict
  ├── layout.tsx              # Root layout
  ├── page.tsx                # Home page
  └── globals.css

lib/                          # Utilities and helpers (camelCase)
  ├── auth.ts                 # Authentication helpers
  ├── supabase.ts             # Supabase client
  ├── documentai.ts           # OCR integration
  ├── gemini.ts               # AI integration
  ├── types.ts                # TypeScript interfaces
  └── utils.ts                # General utilities
```

## Next Steps

1. **Pick a feature** from [PRD.md](./docs/PRD.md)
2. **Create a branch** for your feature
3. **Implement** following the standards above
4. **Test** using [TESTING.md](./TESTING.md)
5. **Commit** with clear messages
6. **Push** and create a pull request

## Questions?

- Check [GETTING_STARTED.md](./GETTING_STARTED.md) for setup help
- Review [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design
- Look at existing code for examples
- Check VS Code IntelliSense for API docs

Happy coding! 🚀
