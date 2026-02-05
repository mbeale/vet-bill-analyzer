# Codespaces Development Setup

This file provides quick setup instructions for GitHub Codespaces.

## Automatic Setup

When you create a Codespace, the following happens automatically:

1. **Container Creation**: A development container is built with:
   - Node.js 20 and npm
   - Git and GitHub CLI
   - TypeScript, ESLint, Prettier pre-configured
   - VS Code extensions for development

2. **Dependency Installation**: `npm install` runs automatically

3. **Type Checking**: TypeScript validation runs

## First Run Setup

Once the container finishes initializing (check the terminal for completion):

### 1. Configure Environment Variables

The container initializes with environment variables from your Codespaces secrets. You can also:

```bash
# Copy the example to create .env.local
cp .env.example .env.local

# Edit to add your actual credentials
# (Use the built-in VS Code editor to edit .env.local)
```

### 2. Start Development Server

```bash
npm run dev
```

You'll see output like:
```
> next dev
  ▲ Next.js 15.0.0
  - Local: http://localhost:3000
```

### 3. Access the Application

- **In Codespaces**: A notification will appear with a link to open the app
- **In the Ports tab**: Right-click port 3000 and "Open in Browser"
- **Direct URL**: https://YOUR-USERNAME-codespace-XXXXX.preview.app:3000/

## Available Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Production server
npm start

# Type checking
npm run type-check

# ESLint
npm run lint

# Full setup with dependencies
npm run setup
```

## Database Setup

To set up your Supabase database:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or use existing
3. Get your connection details
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```
5. Run the schema:
   ```bash
   # From SQL Editor in Supabase Dashboard, paste contents of supabase/schema.sql
   ```

## File Structure in Codespaces

Your project has these key directories:

```
/workspaces/vet-bill-analyzer/
├── app/               # Next.js application code
├── lib/               # Utility functions and integrations
├── supabase/          # Database schema
├── .devcontainer/     # Codespaces config (this directory)
└── docs/              # Documentation
```

## Debugging

### Port Access Issues

If you can't access the application:

1. Ensure `npm run dev` is running
2. Check the "Ports" tab in Codespaces
3. Make sure port 3000 is visible and marked as "Open"
4. Try clicking the globe icon to open in browser

### VS Code Extensions Not Loading

All extensions should install automatically. If missing:

1. Open Extensions (Ctrl+Shift+X)
2. Search for "PetCare AI" or specific extensions
3. Click "Install in Dev Container"

### Memory Issues

If you run into memory issues:

```bash
# Clear npm cache
npm cache clean --force

# Rebuild node_modules
rm -rf node_modules package-lock.json
npm install
```

## Tips & Tricks

### Keyboard Shortcuts in Codespaces

- `Ctrl+` ` ` - Toggle integrated terminal
- `Ctrl+P` - Quick file open
- `Ctrl+Shift+D` - Debug sidebar
- `F1` - Command palette
- `Ctrl+J` - Toggle bottom panel

### Keep Codespace Running

By default, Codespaces will suspend after 30 minutes of inactivity. To keep it active:

- In VS Code, press any key or make edits
- Or change the timeout in Codespaces settings

### Rebuild Container

If you need to rebuild the container:

1. Open Command Palette (F1)
2. Type "Rebuild Container"
3. Select the option

## Troubleshooting

### npm install fails

```bash
npm cache clean --force
npm install
```

### Module not found errors

```bash
npm run type-check
npm install
```

### Port 3000 already in use

```bash
# Run on different port
npm run dev -- -p 3001
```

### Git configuration issues

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Next Steps

1. Start the dev server: `npm run dev`
2. Open the application in your browser
3. Begin development!

For more information, see the main [README.md](../README.md) and [ARCHITECTURE.md](../docs/ARCHITECTURE.md).
