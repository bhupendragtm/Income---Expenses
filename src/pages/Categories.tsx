import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import Table from '../components/Table';
import FormModal from '../components/FormModal';

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function Categories() {
  const {
    data: categories,
    loading,
    fetchAll,
    create,
    update,
    delete: deleteCategory,
  } = useCrud('categories');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (confirm(`Delete category "${category.name}"?`)) {
      try {
        await deleteCategory(category.id);
        alert('Category deleted successfully');
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingCategory) {
        await update(editingCategory.id, data);
        alert('Category updated successfully');
      } else {
        await create(data);
        alert('Category created successfully');
      }
      setIsFormOpen(false);
      setEditingCategory(null);
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  const fields = [
    { name: 'name', label: 'Category Name', required: true, value: editingCategory?.name },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      value: editingCategory?.description,
    },
  ];

  const columns = [
    { key: 'name' as const, label: 'Category Name' },
    { key: 'description' as const, label: 'Description' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          + Add Category
        </button>
      </div>

      <Table
        data={categories as Category[]}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isFormOpen}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => setIsFormOpen(false)}
      />
    </div>
  );
}
