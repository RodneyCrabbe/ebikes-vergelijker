# E-Bike Vergelijkingsplatform

A modern Dutch e-bike comparison platform with CPL (Cost Per Lead) business model, AI-powered pricing optimization, and comprehensive user features.

## Features

### Phase 1 (MVP) - Implemented
- ✅ Vue.js 3 + TypeScript + Vite setup
- ✅ Tailwind CSS with custom Dutch color palette
- ✅ Supabase integration for backend
- ✅ Basic e-bike listing and details
- ✅ Comparison feature (up to 4 e-bikes)
- ✅ Affiliate link tracking
- ✅ User authentication (login/register)
- ✅ Pinia state management
- ✅ Responsive design (mobile-first)

### Phase 2 (In Progress)
- 🚧 Appointment booking system
- 🚧 Review system with ratings
- 🚧 Saved comparisons
- 🚧 User dashboard
- 🚧 Newsletter integration

### Phase 3 (Planned)
- 📋 AI-powered CPL optimization (service created, needs integration)
- 📋 Advanced filtering
- 📋 Personalized recommendations
- 📋 Analytics dashboard

## Tech Stack

### Frontend
- Vue.js 3 (Composition API)
- TypeScript
- Tailwind CSS
- Vite
- Vue Router
- Pinia (state management)

### Backend
- Supabase (PostgreSQL, Auth, Real-time)
- Node.js/Express (optional API middleware)

### AI/ML
- Anthropic Claude 4.5 API
- Real-time market analysis
- NLP for review sentiment analysis
- Agentic workflow for lead optimization

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase CLI (optional for local development)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Update `.env.local` with your values:
```env
VITE_SUPABASE_URL=http://localhost:54323
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

3. **Set up Supabase (Local):**
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Start local Supabase instance
supabase start

# Run migrations
supabase db push
```

4. **Run development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
ebike-platform/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components (Header, Footer)
│   │   ├── ebike/           # E-bike specific components
│   │   ├── comparison/      # Comparison feature components
│   │   └── ...
│   ├── views/               # Page components
│   ├── stores/              # Pinia stores
│   ├── router/              # Vue Router configuration
│   ├── services/            # API and AI services
│   ├── types/               # TypeScript type definitions
│   ├── lib/                 # Library configurations (Supabase)
│   └── config/              # App configuration
├── supabase/
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

## Database Schema

The platform uses Supabase (PostgreSQL) with the following main tables:
- `ebikes` - E-bike inventory
- `users` - User accounts
- `reviews` - User reviews and ratings
- `appointments` - Booking system
- `saved_comparisons` - Saved e-bike comparisons
- `leads` - CPL tracking
- `newsletter_subscribers` - Newsletter subscriptions

See `supabase/migrations/001_initial_schema.sql` for full schema.

## Key Features

### Comparison Feature
- Side-by-side comparison of up to 4 e-bikes
- Visual indicators for best specifications
- Persistent state using Pinia
- Shareable comparison URLs (planned)

### AI-Powered CPL Optimization
The platform uses Claude 4.5 to dynamically optimize CPL rates based on:
- Competitor pricing
- Market trends
- Seasonal demand
- Brand popularity
- Historical conversion rates

```typescript
import { CPLOptimizationAgent } from './services/ai'

const agent = new CPLOptimizationAgent(ebikes)
await agent.analyzeMarket()
```

## Color Palette

- **Primary**: #FF6B00 (Dutch Orange)
- **Secondary**: #2C5F2D (Cycling Green)
- **Accent**: #0066CC (Trust Blue)
- **Background**: #F8F9FA
- **Text**: #2D3748

## Routes

- `/` - Homepage
- `/e-bikes` - Browse all e-bikes
- `/e-bikes/:id` - E-bike detail page
- `/vergelijk` - Comparison tool
- `/afspraak` - Appointment booking
- `/reviews` - All reviews
- `/login` - User login
- `/registreer` - User registration
- `/dashboard` - User dashboard
- `/nieuwsbrief` - Newsletter signup
- `/over-ons` - About page
- `/contact` - Contact page

## Security & Compliance

- ✅ GDPR compliant data handling
- ✅ Secure password hashing (Supabase Auth)
- ✅ JWT tokens for authentication
- 🚧 Rate limiting (planned)
- 🚧 Cookie consent banner (planned)

## License

Proprietary - All rights reserved

---

Built with ❤️ for Dutch e-bike enthusiasts
