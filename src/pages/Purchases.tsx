import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import Table from '../components/Table';
import FormModal from '../components/FormModal';
import apiClient from '../api/client';

interface Purchase {
  id: string;
  storeId: string;
  amount: number;
  vendor?: string;
  quantity?: number;
  createdAt?: string;
}

export default function Purchases() {
  const { data: purchases, loading, fetchAll, create, update, delete: deletePurchase } = useCrud('purchases');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    fetchAll();
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const res = await apiClient.getStores();
      setStores(res.data || res);
    } catch (err) {
      console.error('Failed to load stores:', err);
    }
  };

  const handleAddNew = () => {
    setEditingPurchase(null);
    setIsFormOpen(true);
  };

  const handleEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setIsFormOpen(true);
  };

  const handleDelete = async (purchase: Purchase) => {
    if (confirm(`Delete purchase #${purchase.id.slice(0, 8)}?`)) {
      try {
        await deletePurchase(purchase.id);
        alert('Purchase deleted successfully');
      } catch (err) {
        alert('Failed to delete purchase');
      }
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingPurchase) {
        await update(editingPurchase.id, data);
        alert('Purchase updated successfully');
      } else {
        await create(data);
        alert('Purchase created successfully');
      }
      setIsFormOpen(false);
      setEditingPurchase(null);
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save purchase');
    }
  };

  const fields = [
    {
      name: 'storeId',
      label: 'Store',
      type: 'select' as const,
      required: true,
      options: stores.map((s) => ({ value: s.id, label: s.name })),
      value: editingPurchase?.storeId,
    },
    { name: 'amount', label: 'Amount', type: 'number' as const, required: true, value: editingPurchase?.amount },
    { name: 'vendor', label: 'Vendor', value: editingPurchase?.vendor },
    { name: 'quantity', label: 'Quantity', type: 'number' as const, value: editingPurchase?.quantity },
  ];

  const columns = [
    { key: 'id' as const, label: 'Purchase ID', render: (val: string) => val.slice(0, 8) + '...' },
    { key: 'storeId' as const, label: 'Store' },
    { key: 'amount' as const, label: 'Amount', render: (val: number) => `$${val.toFixed(2)}` },
    { key: 'vendor' as const, label: 'Vendor' },
    { key: 'quantity' as const, label: 'Quantity' },
    { key: 'createdAt' as const, label: 'Date', render: (val: string) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Purchases</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          + Add Purchase
        </button>
      </div>

      <Table
        data={purchases as Purchase[]}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isFormOpen}
        title={editingPurchase ? 'Edit Purchase' : 'Add New Purchase'}
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => setIsFormOpen(false)}
      />
    </div>
  );
}
