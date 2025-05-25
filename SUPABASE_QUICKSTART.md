# 🚀 Supabase Quick Start Guide

This guide will get you up and running with the InboxInsights Supabase database in under 5 minutes.

## ✅ Prerequisites

- [x] **Supabase CLI** installed (v2.23.4+)
- [x] **Docker** running on your system
- [x] **Node.js** and **npm** installed

## 🏃‍♂️ Quick Start (5 minutes)

### 1. Start Supabase Services

```bash
# Start all Supabase services (database, API, Studio, etc.)
npm run db:start
```

This will:

- Start PostgreSQL database on port 54322
- Start Supabase API on port 54321
- Start Supabase Studio on port 54323
- Apply migrations and seed data automatically

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.local.example .env.local

# The file already contains the correct local development values
# No changes needed for local development!
```

### 3. Verify Everything is Working

```bash
# Check Supabase status
npm run db:status

# You should see all services running with green status
```

### 4. Access Your Database

- **Supabase Studio**: http://127.0.0.1:54323
- **API Endpoint**: http://127.0.0.1:54321
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres

### 5. Test API Access

```bash
# Test API with curl (should return mood entries)
curl "http://127.0.0.1:54321/rest/v1/mood_entries?select=id,mood_score,from&limit=3" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
```

### 6. Start Your Next.js App

```bash
# Start the development server
npm run dev

# Visit http://localhost:3000
# Your app should now connect to the local Supabase instance
```

## 📊 What You Get

### Sample Data

- **11 mood entries** with realistic data
- **2 demo users**:
  - `maxime.l.beaudoin@gmail.com` (7+ entries)
  - `demo.user@example.com` (2+ entries)
- **Varied data**: Different mood scores, energy levels, stress levels
- **Time range**: Entries spanning the last 20 days

### Database Schema

- **mood_entries table** with proper constraints
- **Indexes** for performance
- **Comments** for documentation
- **Permissions** properly configured

## 🛠️ Available Commands

```bash
# Database Management
npm run db:start          # Start Supabase services
npm run db:stop           # Stop Supabase services
npm run db:status         # Check service status
npm run db:reset          # Reset database with fresh data
npm run db:migrate        # Apply migrations only

# Development
npm run dev               # Start Next.js development server
npm run build             # Build for production
npm run start             # Start production server
```

## 🔧 Troubleshooting

### Common Issues

**Port conflicts:**

```bash
# Check what's using the ports
lsof -i :54321 -i :54322 -i :54323

# Stop Supabase and restart
npm run db:stop
npm run db:start
```

**Docker not running:**

```bash
# Start Docker Desktop
# Then restart Supabase
npm run db:start
```

**Database connection issues:**

```bash
# Reset everything
npm run db:stop
npm run db:start
```

### Getting Help

- **Supabase Docs**: https://supabase.com/docs
- **CLI Reference**: https://supabase.com/docs/reference/cli
- **Local Development**: https://supabase.com/docs/guides/local-development

## 🎯 Next Steps

1. **Explore Supabase Studio**: Visit http://127.0.0.1:54323 to browse your data
2. **Test your app**: Make sure your Next.js app connects properly
3. **Add features**: Start building your mood tracking features
4. **Deploy**: When ready, set up production Supabase project

## ✨ Success Indicators

You'll know everything is working when:

- ✅ `npm run db:status` shows all services running
- ✅ Supabase Studio loads at http://127.0.0.1:54323
- ✅ You can see the `mood_entries` table with 11 sample entries
- ✅ API calls return data successfully
- ✅ Your Next.js app connects without errors

**You're all set! Happy coding! 🎉**
