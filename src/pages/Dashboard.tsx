import { useEffect, useState } from 'react';
import apiClient from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    brands: 0,
    categories: 0,
    stores: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, orders, brands, categories, stores] = await Promise.all([
          apiClient.getProducts(),
          apiClient.getOrders(),
          apiClient.getBrands(),
          apiClient.getCategories(),
          apiClient.getStores(),
        ]);

        setStats({
          products: products.data.length,
          orders: orders.data.length,
          brands: brands.data.length,
          categories: categories.data.length,
          stores: stores.data.length,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Products" value={stats.products} />
        <StatCard title="Orders" value={stats.orders} />
        <StatCard title="Brands" value={stats.brands} />
        <StatCard title="Categories" value={stats.categories} />
        <StatCard title="Stores" value={stats.stores} />
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickLink href="/products" label="Manage Products" />
          <QuickLink href="/orders" label="View Orders" />
          <QuickLink href="/stores" label="Manage Stores" />
          <QuickLink href="/transactions/income" label="Income Transactions" />
          <QuickLink href="/transactions/expense" label="Expense Transactions" />
          <QuickLink href="/upload" label="Upload Files" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <p className="text-gray-600 mb-2">{title}</p>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 text-center font-medium transition"
    >
      {label}
    </a>
  );
}
