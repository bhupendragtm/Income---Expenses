# Income & Expenses Frontend

A modern React + TypeScript frontend for the Income & Expenses Management API (LoopBack 4 + MongoDB).

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend running on http://localhost:3001

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts          # Axios API client with all endpoints
│   ├── context/
│   │   └── AuthContext.tsx    # Auth state management
│   ├── hooks/
│   │   └── useCrud.ts         # Reusable CRUD hook
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── OtpLogin.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Products/
│   │   ├── Orders/
│   │   ├── Brands/
│   │   ├── Categories/
│   │   ├── Stores/
│   │   ├── Transactions/
│   │   │   ├── Income.tsx
│   │   │   ├── Expense.tsx
│   │   │   ├── Sales.tsx
│   │   │   └── Purchases.tsx
│   │   └── FileUpload.tsx
│   ├── components/
│   │   ├── ProtectedRoute.tsx
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   └── FormModal.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

## Environment Variables

Create a `.env.local` file:

```
VITE_API_URL=http://localhost:3001
```

## Features

✅ Authentication (Login, Register, OTP)  
✅ CRUD Operations for all resources  
✅ Product & Inventory Management  
✅ Order Management with cart/order/cancelled states  
✅ Brand & Category Management  
✅ Store Management  
✅ Transaction Tracking (Income, Expense, Sales, Purchases)  
✅ File Upload  
✅ Responsive UI with Tailwind CSS  
✅ Token-based Authorization  

## API Endpoints Covered

- **Auth**: /login, /register, /login-otp, /request-otp, /logout, /refresh-token
- **Stores**: /stores (CRUD), /account/stores
- **Products**: /products (CRUD), /stores/{storeId}/products
- **Brands**: /brands (CRUD), /brands/store/{storeId}
- **Categories**: /categories (CRUD), /categories/store/{storeId}
- **Orders**: /orders (CRUD), /stores/{storeId}/orders
- **Transactions**: /incomes, /expenses, /sales, /purchases (all CRUD)
- **Files**: /upload

## Usage Examples

### Login
```typescript
const { login } = useAuth();
await login(email, password);
```

### CRUD Operations
```typescript
const products = useCrud('products');
await products.fetchAll();
await products.create({ name: 'Product 1', price: 100 });
await products.update(id, { price: 150 });
await products.delete(id);
```

### With Store Context
```typescript
const [storeId, setStoreId] = useState('...');
await apiClient.getStoreProducts(storeId);
```

## Technologies Used

- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 3
- Axios
- React Router v6

## License

MIT
# Income---Expenses
