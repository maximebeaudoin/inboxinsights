<h1 align="center">📧 InboxInsights</h1>

<p align="center">
 AI-powered mood tracking through email analysis
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#database-setup"><strong>Database Setup</strong></a> ·
  <a href="#development"><strong>Development</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a>
</p>
<br/>

## Features

- **📧 Email Integration**: Analyze mood from email content using n8n workflows
- **📊 Mood Tracking**: Track mood, energy, and stress levels over time
- **🤖 AI Insights**: Get AI-powered insights and summaries from your mood data
- **📈 Analytics Dashboard**: Visualize mood trends and patterns
- **🔐 Secure Authentication**: User authentication with Supabase Auth
- **🎨 Modern UI**: Built with Next.js, Tailwind CSS, and shadcn/ui components
- **🗄️ Robust Database**: PostgreSQL with Supabase for data management
- **🚀 Local Development**: Full local development setup with Supabase CLI

## Quick Start

**Get up and running in 5 minutes:**

```bash
# 1. Start Supabase services
npm run db:start

# 2. Set up environment variables
cp .env.local.example .env.local

# 3. Start the development server
npm run dev
```

📖 **Detailed instructions**: See [SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md)

## Database Setup

InboxInsights uses Supabase for database management with a complete local development setup.

### 🗄️ Database Schema

- **mood_entries table**: Stores mood tracking data with constraints and indexes
- **Row Level Security**: Users can only access their own data
- **Sample data**: 11+ realistic mood entries for testing
- **Migrations**: Version-controlled database schema

### 📊 Sample Data Includes

- **Users**: `maxime.l.beaudoin@gmail.com`, `demo.user@example.com`
- **Data variety**: Mood scores (1-10), energy levels, stress levels
- **Time range**: Entries spanning 20+ days
- **Realistic content**: Email-style original text and notes

### 🛠️ Database Commands

```bash
npm run db:start          # Start Supabase services
npm run db:status         # Check service status
npm run db:reset          # Reset with fresh seed data
npm run db:stop           # Stop all services
```

📖 **Full database documentation**: See [supabase/README.md](./supabase/README.md)

## Development

### Prerequisites

- **Node.js** 18+ and npm
- **Docker** (for Supabase local development)
- **Supabase CLI** (automatically installed)

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/maximebeaudoin/inboxinsights.git
   cd inboxinsights
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start Supabase services**

   ```bash
   npm run db:start
   ```

4. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   # No changes needed for local development!
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Access the application**
   - **App**: http://localhost:3000
   - **Supabase Studio**: http://127.0.0.1:54323
   - **API**: http://127.0.0.1:54321

### Available Scripts

```bash
# Development
npm run dev               # Start Next.js dev server
npm run build             # Build for production
npm run start             # Start production server
npm run lint              # Run ESLint
npm run format            # Format code with Prettier

# Database
npm run db:start          # Start Supabase services
npm run db:stop           # Stop Supabase services
npm run db:status         # Check service status
npm run db:reset          # Reset database with seed data
npm run db:migrate        # Apply migrations only
```

## Deployment

### Production Setup

1. **Create a Supabase project**

   - Visit [database.new](https://database.new)
   - Create a new project

2. **Link your local project**

   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Deploy migrations**

   ```bash
   supabase db push
   ```

4. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables from your Supabase project
   - Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Project Structure

```
inboxinsights/
├── app/                          # Next.js App Router
├── components/                   # React components
├── lib/                         # Utilities and configurations
├── supabase/                    # Database setup
│   ├── migrations/              # Database migrations
│   ├── seed.sql                # Sample data
│   ├── database-utils.ts       # Database utilities
│   └── README.md               # Database documentation
├── SUPABASE_QUICKSTART.md      # Quick start guide
└── README.md                   # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
