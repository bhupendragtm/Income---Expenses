import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import Table from '../components/Table';
import FormModal from '../components/FormModal';
import apiClient from '../api/client';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  storeId: string;
  status: 'cart' | 'completed' | 'cancelled';
  items?: OrderItem[];
  total?: number;
  createdAt?: string;
}

export default function Orders() {
  const { data: orders, loading, fetchAll, create, update, delete: deleteOrder } = useCrud('orders');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    fetchAll();
    loadRelatedData();
  }, []);

  const loadRelatedData = async () => {
    try {
      const storesRes = await apiClient.getStores();
      setStores(storesRes.data || storesRes);
    } catch (err) {
      console.error('Failed to load related data:', err);
    }
  };

  const handleAddNew = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleDelete = async (order: Order) => {
    if (confirm(`Delete order #${order.id}?`)) {
      try {
        await deleteOrder(order.id);
        alert('Order deleted successfully');
      } catch (err) {
        alert('Failed to delete order');
      }
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingOrder) {
        await update(editingOrder.id, data);
        alert('Order updated successfully');
      } else {
        await create(data);
        alert('Order created successfully');
      }
      setIsFormOpen(false);
      setEditingOrder(null);
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save order');
    }
  };

  const fields = [
    {
      name: 'storeId',
      label: 'Store',
      type: 'select' as const,
      required: true,
      options: stores.map((s) => ({ value: s.id, label: s.name })),
      value: editingOrder?.storeId,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'cart', label: 'Cart' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
      value: editingOrder?.status,
    },
  ];

  const columns = [
    { key: 'id' as const, label: 'Order ID', render: (val: string) => val.slice(0, 8) + '...' },
    { key: 'storeId' as const, label: 'Store ID' },
    { key: 'status' as const, label: 'Status', render: (val: string) => <span className="font-semibold">{val}</span> },
    { key: 'createdAt' as const, label: 'Created', render: (val: string) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          + New Order
        </button>
      </div>

      <Table
        data={orders as Order[]}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isFormOpen}
        title={editingOrder ? 'Edit Order' : 'Create New Order'}
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => setIsFormOpen(false)}
      />
    </div>
  );
}
