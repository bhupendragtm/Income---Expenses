import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import Table from '../components/Table';
import FormModal from '../components/FormModal';

interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
}

export default function Brands() {
  const { data: brands, loading, fetchAll, create, update, delete: deleteBrand } = useCrud('brands');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddNew = () => {
    setEditingBrand(null);
    setIsFormOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsFormOpen(true);
  };

  const handleDelete = async (brand: Brand) => {
    if (confirm(`Delete brand "${brand.name}"?`)) {
      try {
        await deleteBrand(brand.id);
        alert('Brand deleted successfully');
      } catch (err) {
        alert('Failed to delete brand');
      }
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingBrand) {
        await update(editingBrand.id, data);
        alert('Brand updated successfully');
      } else {
        await create(data);
        alert('Brand created successfully');
      }
      setIsFormOpen(false);
      setEditingBrand(null);
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save brand');
    }
  };

  const fields = [
    { name: 'name', label: 'Brand Name', required: true, value: editingBrand?.name },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      value: editingBrand?.description,
    },
  ];

  const columns = [
    { key: 'name' as const, label: 'Brand Name' },
    { key: 'description' as const, label: 'Description' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Brands</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          + Add Brand
        </button>
      </div>

      <Table
        data={brands as Brand[]}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isFormOpen}
        title={editingBrand ? 'Edit Brand' : 'Add New Brand'}
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => setIsFormOpen(false)}
      />
    </div>
  );
}
