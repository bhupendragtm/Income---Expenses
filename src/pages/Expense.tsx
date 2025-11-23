import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import Table from '../components/Table';
import FormModal from '../components/FormModal';
import apiClient from '../api/client';

interface Expense {
  id: string;
  storeId: string;
  amount: number;
  category?: string;
  description?: string;
  createdAt?: string;
}

export default function Expense() {
  const { data: expenses, loading, fetchAll, create, update, delete: deleteExpense } = useCrud('expenses');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
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
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = async (expense: Expense) => {
    if (confirm(`Delete expense #${expense.id.slice(0, 8)}?`)) {
      try {
        await deleteExpense(expense.id);
        alert('Expense deleted successfully');
      } catch (err) {
        alert('Failed to delete expense');
      }
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingExpense) {
        await update(editingExpense.id, data);
        alert('Expense updated successfully');
      } else {
        await create(data);
        alert('Expense created successfully');
      }
      setIsFormOpen(false);
      setEditingExpense(null);
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save expense');
    }
  };

  const fields = [
    {
      name: 'storeId',
      label: 'Store',
      type: 'select' as const,
      required: true,
      options: stores.map((s) => ({ value: s.id, label: s.name })),
      value: editingExpense?.storeId,
    },
    { name: 'amount', label: 'Amount', type: 'number' as const, required: true, value: editingExpense?.amount },
    { name: 'category', label: 'Category', value: editingExpense?.category },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      value: editingExpense?.description,
    },
  ];

  const columns = [
    { key: 'storeId' as const, label: 'Store' },
    { key: 'amount' as const, label: 'Amount', render: (val: number) => `$${val.toFixed(2)}` },
    { key: 'category' as const, label: 'Category' },
    { key: 'createdAt' as const, label: 'Date', render: (val: string) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          + Add Expense
        </button>
      </div>

      <Table
        data={expenses as Expense[]}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isFormOpen}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => setIsFormOpen(false)}
      />
    </div>
  );
}
