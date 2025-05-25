# InboxInsights: AI-Powered Mood Tracking Through Email Analysis

This is a submission for the [Postmark Challenge: Inbox Innovators](https://dev.to/challenges/postmark).

_InboxInsights: Transform your emotional well-being through intelligent email-based mood tracking and AI-powered insights._

## 💡 What I Built

**InboxInsights** is an **AI-powered mood tracking platform** that revolutionizes personal wellness monitoring by leveraging **Postmark's inbound email parsing capabilities**. Users can track their emotional well-being simply by sending emails describing their day, mood, and activities to a dedicated email address.

The platform uses **n8n workflows** integrated with **Postmark's inbound webhooks** to automatically process incoming emails, extract mood data using **OpenAI's GPT-4**, and store structured insights in a **Supabase PostgreSQL database**. Users can then visualize their mood trends, energy levels, and stress patterns through an interactive **Next.js dashboard**.

Key features include:

- **📧 Email-Based Data Ingestion**: Send mood updates via email using Postmark's inbound parsing
- **🤖 AI-Powered Analysis**: GPT-4 extracts mood scores, energy levels, stress indicators, and activities
- **📊 Interactive Dashboard**: Real-time mood visualization with charts and trends
- **🛡️ Content Moderation**: Automated content filtering with violation detection and blocking
- **🔐 Secure Authentication**: User authentication and data privacy with Supabase Auth
- **📱 Responsive Design**: Modern UI built with Next.js, Tailwind CSS, and shadcn/ui

## 🎯 Use Case

Mental health and emotional well-being tracking is often cumbersome, requiring users to remember to log into apps or fill out forms. **InboxInsights** solves this by meeting users where they already are - their email inbox.

**Target Users:**

- **Individuals** seeking to track their emotional well-being without additional apps
- **Mental health professionals** who want clients to maintain mood journals
- **Wellness enthusiasts** interested in data-driven self-improvement
- **Busy professionals** who prefer email-based workflows over dedicated apps

**Problem Solved:**

- **Friction in mood tracking**: Traditional apps require remembering to log in and fill forms
- **Inconsistent data collection**: Users often forget to track their mood regularly
- **Limited context**: Simple mood ratings lack the rich context that natural language provides
- **Data silos**: Mood data trapped in proprietary apps without export capabilities

## 🧪 Demo

### Live Application

- **Dashboard**: [https://www.inboxinsights.me/](https://inboxinsights.vercel.app)
- **Demo Credentials**:
  - Email: `demo@inboxinsights.me`
  - Password: `asBuhn7YHzekK46!`

### Testing Instructions

**Option 1: Use Demo Account (Recommended for Quick Testing)**

1. **Sign in** using the demo credentials above to see pre-populated data
2. **View existing mood data** on the dashboard with interactive charts

**Option 2: Create Your Own Account**

1. **Sign up** with your own email address for a personalized experience
2. **Start with a clean slate** and build your own mood tracking history
3. **Important**: You must send mood emails from the same email address you used to sign up

**For Both Options:** 4. **Send a test email** to: `b82ba9d30ef2dd7cf65016dfe8c69b37@inbound.postmarkapp.com` 5. **Email content example**:

```
Subject: Daily Mood Update

Hi! Today was a pretty good day. I slept about 7 hours last night and woke up feeling refreshed.
My energy level is around 8/10 today. I went for a morning jog and had a productive work session.
Stress level is low, maybe 3/10. The weather is sunny and warm which always boosts my mood!

Activities: Morning jog, work meetings, lunch with friends
```

6. **Watch real-time updates** as your email gets processed and appears on the dashboard
7. **Explore features** like mood charts, timeline view, and AI-generated insights

### Content Moderation Demo

Try sending inappropriate content to see the automated blocking system in action - you'll receive an immediate violation notification email.

## 🧰 Code Repository

🔗 [**GitHub – InboxInsights**](https://github.com/maximebeaudoin/inboxinsights)

The complete source code is available on GitHub with comprehensive documentation, setup instructions, and deployment guides. The repository includes:

- Full Next.js application with TypeScript
- Supabase database schema and migrations
- n8n workflow configuration for email processing
- Docker setup for local development
- Comprehensive README and documentation

## ⚙️ How I Built It

### Architecture Overview

**InboxInsights** uses a modern, scalable architecture built around Postmark's inbound email processing:

1. **Email Ingestion Layer**: Postmark receives emails and triggers webhooks to n8n
2. **Processing Layer**: n8n workflows handle AI analysis and content moderation
3. **Data Storage Layer**: Supabase PostgreSQL stores structured mood data
4. **Presentation Layer**: Next.js dashboard provides real-time visualization

### Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time subscriptions)
- **Email Processing**: Postmark inbound webhooks + n8n automation
- **AI Integration**: OpenAI GPT-4 for mood analysis and content moderation
- **Deployment**: Vercel (frontend), Supabase Cloud (backend), self-hosted n8n

### Implementation Process

**1. 📬 Postmark Integration**

- Configured Postmark inbound server with webhook endpoint
- Set up dedicated email address: `b82ba9d30ef2dd7cf65016dfe8c69b37@inbound.postmarkapp.com`
- Implemented webhook payload processing in n8n

**2. 🔄 n8n Workflow Design**

- **Content Moderation**: First node classifies incoming emails for inappropriate content
- **Conditional Processing**: Blocks violating content and sends notification emails
- **AI Analysis**: GPT-4 extracts structured mood data from email content
- **Database Integration**: Stores processed data in Supabase with proper relationships

**3. 🤖 AI-Powered Analysis**
The AI agent extracts:

- **Mood Score** (1-10): Overall emotional state
- **Energy Level** (1-10): Physical and mental energy
- **Stress Level** (1-10): Stress and anxiety indicators
- **Sleep Hours**: Sleep duration and quality
- **Activities**: Daily activities and events
- **Weather**: Environmental factors affecting mood
- **Personalized Notes**: Encouraging AI-generated feedback

**4. 🗄️ Database Design**

- **mood_entries**: Core mood tracking data with email metadata
- **email_violations**: Content moderation results and flags
- **Row Level Security**: Users can only access their own data
- **Real-time subscriptions**: Live dashboard updates

**5. 🎨 Frontend Development**

- **Interactive Charts**: Recharts for mood trends and patterns
- **Real-time Updates**: Supabase real-time subscriptions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant with proper ARIA labels

### Postmark Features Utilized

**1. 🔗 Inbound Email Parsing**

- Configured inbound server to receive emails at custom domain
- Webhook integration delivers structured email data (sender, subject, body, metadata)
- Automatic parsing of email headers and content

**2. ⚡ Real-time Processing**

- Immediate webhook delivery enables real-time mood tracking
- No polling required - instant processing of incoming emails
- Reliable delivery with built-in retry mechanisms

**3. 🛡️ Content Filtering Integration**

- Email metadata used for sender verification and spam protection
- Integration with AI moderation for content policy enforcement
- Automated response emails for policy violations

**4. 📊 Analytics & Monitoring**

- Email processing metrics tracked in dashboard
- Delivery status monitoring for outbound notifications
- Error handling and logging for failed processing

## 🔄 Key Features & Innovations

### Email-First Approach

Unlike traditional mood tracking apps, InboxInsights meets users in their existing workflow - email. This reduces friction and increases consistency in mood tracking.

### AI-Powered Insights

The platform doesn't just store data - it provides intelligent analysis, extracting multiple dimensions of wellness from natural language descriptions.

### Content Moderation

Built-in AI content moderation ensures the platform maintains appropriate communication standards while protecting user experience.

### Real-time Dashboard

Live updates create an engaging experience where users can immediately see their mood data visualized after sending an email.

### Privacy-First Design

Row-level security ensures users only see their own data, while email content is processed securely and stored with proper encryption.

## 💡 Lessons Learned

- **Email as an Interface**: Email remains one of the most universal and accessible interfaces for data collection
- **AI Context Understanding**: GPT-4 excels at extracting structured data from unstructured natural language
- **Real-time User Experience**: Immediate feedback loops significantly improve user engagement
- **Content Moderation**: Automated content filtering is essential for user-generated content platforms
- **Workflow Automation**: n8n provides powerful visual workflow design for complex email processing pipelines

## 🚀 Future Possibilities & Enhancements

- **Multi-language Support**: Expand AI analysis to support multiple languages
- **Advanced Analytics**: Machine learning models for mood prediction and trend analysis
- **Integration Ecosystem**: Connect with fitness trackers, calendar apps, and other wellness tools
- **Team Features**: Shared mood tracking for families or therapy groups
- **Mobile App**: Native mobile app with email composition shortcuts

## ✉️ Contact

For questions, suggestions, or collaboration opportunities, please reach out via [**GitHub Issues**](https://github.com/maximebeaudoin/inboxinsights/issues) or connect with me on [**GitHub**](https://github.com/maximebeaudoin).

Thank you for exploring InboxInsights! 🌟
