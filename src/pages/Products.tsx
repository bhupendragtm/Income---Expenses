import { useState, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import Table from '../components/Table';
import FormModal from '../components/FormModal';
import apiClient from '../api/client';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId?: string;
  brandId?: string;
  storeId?: string;
}

export default function Products() {
  const { data: products, loading, fetchAll, create, update, delete: deleteProduct } = useCrud('products');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchAll();
    loadRelatedData();
  }, []);

  const loadRelatedData = async () => {
    try {
      const [storesRes, brandsRes, categoriesRes] = await Promise.all([
        apiClient.getStores(),
        apiClient.getBrands(),
        apiClient.getCategories(),
      ]);
      setStores(storesRes.data || storesRes);
      setBrands(brandsRes.data || brandsRes);
      setCategories(categoriesRes.data || categoriesRes);
    } catch (err) {
      console.error('Failed to load related data:', err);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`Delete product "${product.name}"?`)) {
      try {
        await deleteProduct(product.id);
        alert('Product deleted successfully');
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingProduct) {
        await update(editingProduct.id, data);
        alert('Product updated successfully');
      } else {
        await create(data);
        alert('Product created successfully');
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const fields = [
    { name: 'name', label: 'Product Name', required: true, value: editingProduct?.name },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      value: editingProduct?.description,
    },
    { name: 'price', label: 'Price', type: 'number' as const, required: true, value: editingProduct?.price },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number' as const,
      required: true,
      value: editingProduct?.quantity,
    },
    {
      name: 'storeId',
      label: 'Store',
      type: 'select' as const,
      options: stores.map((s) => ({ value: s.id, label: s.name })),
      value: editingProduct?.storeId,
    },
    {
      name: 'brandId',
      label: 'Brand',
      type: 'select' as const,
      options: brands.map((b) => ({ value: b.id, label: b.name })),
      value: editingProduct?.brandId,
    },
    {
      name: 'categoryId',
      label: 'Category',
      type: 'select' as const,
      options: categories.map((c) => ({ value: c.id, label: c.name })),
      value: editingProduct?.categoryId,
    },
  ];

  const columns = [
    { key: 'name' as const, label: 'Product Name' },
    { key: 'price' as const, label: 'Price', render: (val: number) => `$${val.toFixed(2)}` },
    { key: 'quantity' as const, label: 'Quantity' },
    { key: 'description' as const, label: 'Description' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          + Add Product
        </button>
      </div>

      <Table
        data={products as Product[]}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isFormOpen}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => setIsFormOpen(false)}
      />
    </div>
  );
}
