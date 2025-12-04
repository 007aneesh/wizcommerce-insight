# WizCommerce Insight

An AI-powered sales platform for managing buyers, campaigns, abandoned carts, and notifications all in one place.

## Features

### 📊 Dashboard
- Real-time statistics overview
- Active buyers count
- Active campaigns tracking
- Abandoned carts monitoring
- Notifications sent metrics
- Recent collections display
- Quick actions for common tasks

### 👥 Buyer Management
- Search and filter buyers by name
- View detailed buyer insights including:
  - Order history (quotes, orders, drafts)
  - Location and contact information
  - Order details with pagination
  - Buyer preferences
- Infinite scroll for efficient data loading
- Real-time buyer data synchronization

### 🎯 Campaign Management
Create and manage multiple types of AI-powered email marketing campaigns:
- **Collection Launch Campaigns** - Notify buyers when new collections are launched
- **Scheduled Email Campaigns** - Regular interval emails to active buyers
- **Event-Based Campaigns** - Personalized emails based on specific buyer events
- **Abandoned Cart Reminders** - Alert buyers when items in their cart are low stock
- **Product Update Notifications** - Notify buyers when watched products are updated

Features:
- Campaign status management (active/inactive)
- Campaign performance tracking
- Email count monitoring
- Last triggered timestamps
- Campaign configuration modal

### 🛒 Abandoned Carts
- View all abandoned carts with detailed information
- Search carts by customer name
- View cart details including:
  - Customer information
  - Cart total and item counts
  - Product details with stock levels
  - Cart status tracking
- Infinite scroll for large datasets

### 📈 Analytics
- Comprehensive analytics dashboard
- Performance metrics and insights
- Data visualization

### 🔔 Notifications
- Notification management system
- Track notification history
- Monitor delivery status

### 🔐 Authentication & Security
- Secure authentication system
- Protected routes
- User session management

### 📦 Catalog & Collections
- Multi-catalog support
- Collection browsing and management
- Product catalog integration

## Tech Stack

This project is built with modern web technologies:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library
- **React Router** - Client-side routing
- **shadcn-ui** - Beautiful UI components built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Recharts** - Chart library for analytics
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or bun

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd wizcommerce-insight
```

2. Install dependencies:
```sh
npm install
# or
bun install
```

3. Start the development server:
```sh
npm run dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```sh
npm run build
# or
bun run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```sh
npm run preview
# or
bun run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn-ui components
│   └── ...             # Custom components
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Buyers.tsx
│   ├── Campaigns.tsx
│   ├── AbandonedCarts.tsx
│   ├── Analytics.tsx
│   ├── Notifications.tsx
│   └── Auth.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API client
│   ├── api.ts         # API client configuration
│   ├── types.ts       # TypeScript type definitions
│   └── utils.ts       # Utility functions
├── store/              # State management (Zustand)
└── App.tsx             # Main application component
```

## Development

### Code Style

The project uses ESLint for code linting. Run the linter:

```sh
npm run lint
```

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
VITE_API_BASE_URL=your_api_url_here
```

## Deployment

### Vercel

The project includes a `vercel.json` configuration file. Deploy to Vercel:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

The project can be deployed to any platform that supports static site hosting:
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any Node.js hosting service

Build the project and serve the `dist` directory.

## API Integration

This application integrates with a backend API. Ensure your backend implements the following endpoints:

- **Buyers**: `/api/buyers` - Search and fetch buyer data
- **Orders**: `/api/orders` - Fetch order history
- **Abandoned Carts**: `/api/carts/abandoned` - Fetch abandoned cart data
- **Collections**: `/api/collections` - Fetch collection data
- **Campaigns**: `/api/campaigns` - Campaign management
- **Notifications**: `/api/notifications` - Notification management

See `src/lib/types.ts` for detailed API type definitions and integration points.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Add your license information here]
