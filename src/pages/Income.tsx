import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import Table from '../components/Table';
import FormModal from '../components/FormModal';
import apiClient from '../api/client';

interface Income {
  id: string;
  storeId: string;
  amount: number;
  description?: string;
  source?: string;
  createdAt?: string;
}

export default function Income() {
  const { data: incomes, loading, fetchAll, create, update, delete: deleteIncome } = useCrud('incomes');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
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
    setEditingIncome(null);
    setIsFormOpen(true);
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setIsFormOpen(true);
  };

  const handleDelete = async (income: Income) => {
    if (confirm(`Delete income transaction #${income.id.slice(0, 8)}?`)) {
      try {
        await deleteIncome(income.id);
        alert('Income deleted successfully');
      } catch (err) {
        alert('Failed to delete income');
      }
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingIncome) {
        await update(editingIncome.id, data);
        alert('Income updated successfully');
      } else {
        await create(data);
        alert('Income created successfully');
      }
      setIsFormOpen(false);
      setEditingIncome(null);
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save income');
    }
  };

  const fields = [
    {
      name: 'storeId',
      label: 'Store',
      type: 'select' as const,
      required: true,
      options: stores.map((s) => ({ value: s.id, label: s.name })),
      value: editingIncome?.storeId,
    },
    { name: 'amount', label: 'Amount', type: 'number' as const, required: true, value: editingIncome?.amount },
    { name: 'source', label: 'Source', value: editingIncome?.source },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      value: editingIncome?.description,
    },
  ];

  const columns = [
    { key: 'storeId' as const, label: 'Store' },
    { key: 'amount' as const, label: 'Amount', render: (val: number) => `$${val.toFixed(2)}` },
    { key: 'source' as const, label: 'Source' },
    { key: 'createdAt' as const, label: 'Date', render: (val: string) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Income</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          + Add Income
        </button>
      </div>

      <Table
        data={incomes as Income[]}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isFormOpen}
        title={editingIncome ? 'Edit Income' : 'Add New Income'}
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => setIsFormOpen(false)}
      />
    </div>
  );
}
