import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import Table from '../components/Table';
import FormModal from '../components/FormModal';
import { useAuth } from '../context/AuthContext';

interface Store {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export default function Stores() {
  const { data: stores, loading, fetchAll, create, update, delete: deleteStore } = useCrud('stores');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddNew = () => {
    setEditingStore(null);
    setIsFormOpen(true);
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setIsFormOpen(true);
  };

  const handleDelete = async (store: Store) => {
    if (confirm(`Delete store "${store.name}"?`)) {
      try {
        await deleteStore(store.id);
        alert('Store deleted successfully');
      } catch (err) {
        alert('Failed to delete store');
      }
    }
  };

  const { user, setDefaultStore } = useAuth();

  const handleSetDefault = async (store: Store) => {
    if (!user) return alert('You must be logged in');
    if (!confirm(`Set "${store.name}" as your default store?`)) return;
    try {
      await setDefaultStore(user.id, store.id);
      alert('Default store updated');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to set default store');
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingStore) {
        await update(editingStore.id, data);
        alert('Store updated successfully');
      } else {
        await create(data);
        alert('Store created successfully');
      }
      setIsFormOpen(false);
      setEditingStore(null);
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save store');
    }
  };

  const fields = [
    { name: 'name', label: 'Store Name', required: true, value: editingStore?.name },
    { name: 'address', label: 'Address', value: editingStore?.address },
    { name: 'phone', label: 'Phone', value: editingStore?.phone },
    { name: 'email', label: 'Email', type: 'email' as const, value: editingStore?.email },
  ];

  const columns = [
    { key: 'name' as const, label: 'Store Name' },
    { key: 'address' as const, label: 'Address' },
    { key: 'phone' as const, label: 'Phone' },
    { key: 'email' as const, label: 'Email' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Stores</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          + Add Store
        </button>
      </div>

      <Table
        data={stores as Store[]}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        extraAction={(row) => (
          <button
            onClick={() => handleSetDefault(row)}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
          >
            Set as default
          </button>
        )}
      />

      <FormModal
        isOpen={isFormOpen}
        title={editingStore ? 'Edit Store' : 'Add New Store'}
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => setIsFormOpen(false)}
      />
    </div>
  );
}
