import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Income & Expenses</h2>
        <nav className="space-y-4">
          <a href="/" className="block px-4 py-2 rounded hover:bg-gray-800">
            Dashboard
          </a>
          <a href="/products" className="block px-4 py-2 rounded hover:bg-gray-800">
            Products
          </a>
          <a href="/orders" className="block px-4 py-2 rounded hover:bg-gray-800">
            Orders
          </a>
          <a href="/brands" className="block px-4 py-2 rounded hover:bg-gray-800">
            Brands
          </a>
          <a href="/categories" className="block px-4 py-2 rounded hover:bg-gray-800">
            Categories
          </a>
          <a href="/stores" className="block px-4 py-2 rounded hover:bg-gray-800">
            Stores
          </a>
          <div className="my-4 border-t border-gray-700" />
          <a href="/transactions/income" className="block px-4 py-2 rounded hover:bg-gray-800">
            Income
          </a>
          <a href="/transactions/expense" className="block px-4 py-2 rounded hover:bg-gray-800">
            Expenses
          </a>
          <a href="/transactions/sales" className="block px-4 py-2 rounded hover:bg-gray-800">
            Sales
          </a>
          <a href="/transactions/purchases" className="block px-4 py-2 rounded hover:bg-gray-800">
            Purchases
          </a>
          <div className="my-4 border-t border-gray-700" />
          <a href="/upload" className="block px-4 py-2 rounded hover:bg-gray-800">
            File Upload
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-md px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
