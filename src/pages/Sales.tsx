import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import Table from '../components/Table';
import FormModal from '../components/FormModal';
import apiClient from '../api/client';

interface Sale {
  id: string;
  storeId: string;
  amount: number;
  productId?: string;
  quantity?: number;
  createdAt?: string;
}

export default function Sales() {
  const { data: sales, loading, fetchAll, create, update, delete: deleteSale } = useCrud('sales');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
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
    setEditingSale(null);
    setIsFormOpen(true);
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setIsFormOpen(true);
  };

  const handleDelete = async (sale: Sale) => {
    if (confirm(`Delete sale #${sale.id.slice(0, 8)}?`)) {
      try {
        await deleteSale(sale.id);
        alert('Sale deleted successfully');
      } catch (err) {
        alert('Failed to delete sale');
      }
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingSale) {
        await update(editingSale.id, data);
        alert('Sale updated successfully');
      } else {
        await create(data);
        alert('Sale created successfully');
      }
      setIsFormOpen(false);
      setEditingSale(null);
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save sale');
    }
  };

  const fields = [
    {
      name: 'storeId',
      label: 'Store',
      type: 'select' as const,
      required: true,
      options: stores.map((s) => ({ value: s.id, label: s.name })),
      value: editingSale?.storeId,
    },
    { name: 'amount', label: 'Amount', type: 'number' as const, required: true, value: editingSale?.amount },
    { name: 'quantity', label: 'Quantity', type: 'number' as const, value: editingSale?.quantity },
  ];

  const columns = [
    { key: 'id' as const, label: 'Sale ID', render: (val: string) => val.slice(0, 8) + '...' },
    { key: 'storeId' as const, label: 'Store' },
    { key: 'amount' as const, label: 'Amount', render: (val: number) => `$${val.toFixed(2)}` },
    { key: 'quantity' as const, label: 'Quantity' },
    { key: 'createdAt' as const, label: 'Date', render: (val: string) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Sales</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          + Add Sale
        </button>
      </div>

      <Table
        data={sales as Sale[]}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isFormOpen}
        title={editingSale ? 'Edit Sale' : 'Add New Sale'}
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => setIsFormOpen(false)}
      />
    </div>
  );
}
