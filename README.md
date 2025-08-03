# Members API

A REST API for managing subscriptions and memberships. Built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Subscription plan management
- Payment processing (simulated)
- Role-based access control
- MongoDB database

## Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm

### Installation

1. Clone or download the project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp env.example .env
   ```

   Edit `.env` with your MongoDB connection string and JWT secrets.

4. Set up the database:

   ```bash
   npm run setup-db
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Plans

- `GET /api/plans` - Get all plans
- `GET /api/plans/:id` - Get plan by ID
- `POST /api/plans` - Create plan (admin only)
- `PUT /api/plans/:id` - Update plan (admin only)
- `DELETE /api/plans/:id` - Delete plan (admin only)

### Subscriptions

- `GET /api/subscriptions/my` - Get user subscriptions
- `GET /api/subscriptions/:id` - Get subscription by ID
- `POST /api/subscriptions` - Create subscription
- `POST /api/subscriptions/:id/cancel` - Cancel subscription
- `POST /api/subscriptions/:id/reactivate` - Reactivate subscription
- `GET /api/subscriptions/admin/all` - Get all subscriptions (admin only)

### Payments

- `GET /api/payments/my` - Get user payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Process payment
- `POST /api/payments/:id/refund` - Refund payment
- `GET /api/payments/admin/all` - Get all payments (admin only)

## Database Schema

### Users

- email, password, firstName, lastName
- role (user/admin), isActive
- createdAt, updatedAt

### Plans

- name, description, price, currency
- billingCycle, maxUsers, features
- trialDays, isActive, sortOrder

### Subscriptions

- user, plan, status, startDate, endDate
- nextBillingDate, amount, currency
- paymentMethod

### Payments

- user, subscription, amount, currency
- status, paymentMethod, description
- processedAt, paymentGatewayId

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/members-api
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
PAYMENT_GATEWAY_API_KEY=dummy-key
PAYMENT_GATEWAY_SECRET=dummy-secret
PAYMENT_GATEWAY_URL=https://api.dummy-payment.com
```

## Project Structure

```
members-api/
├── controllers/     # Business logic
├── models/         # Database schemas
├── routes/         # API endpoints
├── middleware/     # Auth & validation
├── scripts/        # Database setup
├── server.js       # Main server file
└── package.json    # Dependencies
```

## Test Data

The setup script creates sample data:

**Users:**

- admin@example.com / Admin123!
- user@example.com / User123!
- premium@example.com / Premium123!

**Plans:**

- Basic Plan ($9.99/month)
- Professional Plan ($29.99/month)
- Enterprise Plan ($99.99/month)

## Development

```bash
# Setup database
npm run setup-db

# Start development server
npm run dev

```

## License

MIT
