import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { initialMaterials, initialProducts } from '../../data/mockData';
import { DataTable } from '../Common/DataTable';
import { Plus, Edit, Trash2, Package, Box, X, Save } from 'lucide-react';
import type { MaterialRequirement } from '../../types';

export const ProductionCatalog: React.FC = () => {
  const [materials, setMaterials] = useLocalStorage('materials', initialMaterials);
  const [products, setProducts] = useLocalStorage('products', initialProducts);
  const [activeTab, setActiveTab] = useState<'materials' | 'products'>('materials');
  
  // State cho form
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    code: '',
    name: '',
    type: 'raw',
    unit: '',
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    price: 0,
  });

  // State cho sản phẩm
  const [productFormData, setProductFormData] = useState<any>({
    code: '',
    name: '',
    type: 'finished',
    unit: '',
    variants: { color: [], size: [] },
    bom: [] as MaterialRequirement[],
  });
  const [newBomItem, setNewBomItem] = useState({ materialId: '', quantity: 0, wastageRate: 0 });

  // Mở form thêm mới
  const handleAdd = () => {
    setEditingItem(null);
    if (activeTab === 'materials') {
      setFormData({
        id: Date.now().toString(),
        code: '',
        name: '',
        type: 'raw',
        unit: '',
        quantity: 0,
        minStock: 0,
        maxStock: 0,
        price: 0,
        createdAt: new Date().toISOString()
      });
    } else {
      setProductFormData({
        id: Date.now().toString(),
        code: '',
        name: '',
        type: 'finished',
        unit: '',
        variants: { color: [], size: [] },
        bom: [],
        createdAt: new Date().toISOString()
      });
      setNewBomItem({ materialId: '', quantity: 0, wastageRate: 0 });
    }
    setShowForm(true);
  };

  // Mở form sửa
  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'materials') {
      setFormData({ ...item });
    } else {
      setProductFormData({ ...item });
    }
    setShowForm(true);
  };

  // Xóa item
  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa item này?')) {
      if (activeTab === 'materials') {
        setMaterials(materials.filter(m => m.id !== id));
      } else {
        setProducts(products.filter(p => p.id !== id));
      }
    }
  };

  // Lưu material
  const saveMaterial = () => {
    if (!formData.code || !formData.name) {
      alert('Vui lòng nhập mã và tên!');
      return;
    }

    if (editingItem) {
      // Cập nhật
      setMaterials(materials.map(m => m.id === editingItem.id ? formData : m));
    } else {
      // Thêm mới
      setMaterials([...materials, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  // Lưu product
  const saveProduct = () => {
    if (!productFormData.code || !productFormData.name) {
      alert('Vui lòng nhập mã và tên!');
      return;
    }

    if (editingItem) {
      setProducts(products.map(p => p.id === editingItem.id ? productFormData : p));
    } else {
      setProducts([...products, { ...productFormData, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  // Thêm BOM item
  const addBomItem = () => {
    if (!newBomItem.materialId || newBomItem.quantity <= 0) {
      alert('Vui lòng chọn nguyên liệu và nhập số lượng!');
      return;
    }
    setProductFormData({
      ...productFormData,
      bom: [...productFormData.bom, { ...newBomItem }]
    });
    setNewBomItem({ materialId: '', quantity: 0, wastageRate: 0 });
  };

  // Xóa BOM item
  const removeBomItem = (index: number) => {
    const newBom = productFormData.bom.filter((_: any, i: number) => i !== index);
    setProductFormData({ ...productFormData, bom: newBom });
  };

  // Thêm variant
  const addVariant = (type: 'color' | 'size', value: string) => {
    if (!value.trim()) return;
    const variants = { ...productFormData.variants };
    variants[type] = [...(variants[type] || []), value.trim()];
    setProductFormData({ ...productFormData, variants });
  };

  // Xóa variant
  const removeVariant = (type: 'color' | 'size', index: number) => {
    const variants = { ...productFormData.variants };
    variants[type] = variants[type].filter((_: any, i: number) => i !== index);
    setProductFormData({ ...productFormData, variants });
  };

  const materialColumns = [
    { key: 'code', header: 'Mã số' },
    { key: 'name', header: 'Tên vật liệu' },
    { 
      key: 'type', 
      header: 'Loại',
      render: (item: any) => {
        const types = { raw: 'Nguyên liệu', semi: 'Bán thành phẩm', finished: 'Thành phẩm' };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.type === 'raw' ? 'bg-blue-100 text-blue-800' :
          item.type === 'semi' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>{types[item.type as keyof typeof types]}</span>;
      }
    },
    { key: 'quantity', header: 'Tồn kho', render: (item: any) => `${item.quantity.toLocaleString()} ${item.unit}` },
    { key: 'unit', header: 'Đơn vị' },
    { key: 'price', header: 'Đơn giá', render: (item: any) => `${item.price.toLocaleString()} VND` },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(item)}
            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(item.id)}
            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const productColumns = [
    { key: 'code', header: 'Mã số' },
    { key: 'name', header: 'Tên sản phẩm' },
    { 
      key: 'type', 
      header: 'Loại',
      render: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.type === 'finished' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {item.type === 'finished' ? 'Thành phẩm' : 'Bán thành phẩm'}
        </span>
      )
    },
    { key: 'unit', header: 'Đơn vị' },
    {
      key: 'variants',
      header: 'Biến thể',
      render: (item: any) => (
        <div className="text-xs space-y-1">
          {item.variants?.color && item.variants.color.length > 0 && (
            <div><span className="font-medium">Màu:</span> {item.variants.color.join(', ')}</div>
          )}
          {item.variants?.size && item.variants.size.length > 0 && (
            <div><span className="font-medium">Size:</span> {item.variants.size.join(', ')}</div>
          )}
        </div>
      )
    },
    {
      key: 'bom',
      header: 'Định mức NVL',
      render: (item: any) => (
        <div className="text-xs space-y-1">
          {item.bom.map((b: any, idx: number) => {
            const material = materials.find(m => m.id === b.materialId);
            return material ? (
              <div key={idx} className="flex items-center gap-1">
                <span>{material.name}:</span>
                <span className="font-medium">{b.quantity} {material.unit}</span>
                <span className="text-gray-400">(hao hụt {b.wastageRate}%)</span>
              </div>
            ) : null;
          })}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(item)}
            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(item.id)}
            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Danh mục sản xuất</h2>
          {/* <p className="text-gray-600">Quản lý thành phẩm, bán thành phẩm và nguyên vật liệu</p> */}
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Thêm mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-lg px-4">
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'materials'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Nguyên vật liệu ({materials.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'products'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4" />
            Sản phẩm ({products.length})
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {activeTab === 'materials' ? (
          <DataTable columns={materialColumns} data={materials} />
        ) : (
          <DataTable columns={productColumns} data={products} />
        )}
      </div>

      {/* Quick Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Nguyên liệu thô</p>
          <p className="text-2xl font-bold text-blue-800">{materials.filter(m => m.type === 'raw').length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-600 font-medium">Bán thành phẩm</p>
          <p className="text-2xl font-bold text-yellow-800">{materials.filter(m => m.type === 'semi').length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">Thành phẩm</p>
          <p className="text-2xl font-bold text-green-800">{products.filter(p => p.type === 'finished').length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Tổng định mức</p>
          <p className="text-2xl font-bold text-purple-800">
            {products.reduce((sum, p) => sum + p.bom.length, 0)}
          </p>
        </div>
      </div> */}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {editingItem ? 'Chỉnh sửa' : 'Thêm mới'} {activeTab === 'materials' ? 'Nguyên vật liệu' : 'Sản phẩm'}
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'materials' ? (
                // Form Material
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã số *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mã số"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên vật liệu *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên vật liệu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="raw">Nguyên liệu</option>
                      <option value="semi">Bán thành phẩm</option>
                      <option value="finished">Thành phẩm</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="VD: tấn, kg, m³"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VND)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho tối thiểu</label>
                    <input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho tối đa</label>
                    <input
                      type="number"
                      value={formData.maxStock}
                      onChange={(e) => setFormData({...formData, maxStock: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                // Form Product
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mã số *</label>
                      <input
                        type="text"
                        value={productFormData.code}
                        onChange={(e) => setProductFormData({...productFormData, code: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập mã số"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                      <input
                        type="text"
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập tên sản phẩm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                      <select
                        value={productFormData.type}
                        onChange={(e) => setProductFormData({...productFormData, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="finished">Thành phẩm</option>
                        <option value="semi">Bán thành phẩm</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                      <input
                        type="text"
                        value={productFormData.unit}
                        onChange={(e) => setProductFormData({...productFormData, unit: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="VD: tấn, kg"
                      />
                    </div>
                  </div>

                  {/* Variants */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3">Biến thể sản phẩm</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Màu sắc</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="colorInput"
                            placeholder="Nhập màu"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addVariant('color', (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById('colorInput') as HTMLInputElement;
                              if (input) {
                                addVariant('color', input.value);
                                input.value = '';
                              }
                            }}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Thêm
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {productFormData.variants?.color?.map((c: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1">
                              {c}
                              <button onClick={() => removeVariant('color', i)} className="hover:text-red-600">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Kích thước</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="sizeInput"
                            placeholder="Nhập kích thước"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addVariant('size', (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById('sizeInput') as HTMLInputElement;
                              if (input) {
                                addVariant('size', input.value);
                                input.value = '';
                              }
                            }}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Thêm
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {productFormData.variants?.size?.map((s: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center gap-1">
                              {s}
                              <button onClick={() => removeVariant('size', i)} className="hover:text-red-600">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOM */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3">Định mức nguyên vật liệu (BOM)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Nguyên liệu</label>
                        <select
                          value={newBomItem.materialId}
                          onChange={(e) => setNewBomItem({...newBomItem, materialId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Chọn nguyên liệu</option>
                          {materials.map(m => (
                            <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Số lượng</label>
                        <input
                          type="number"
                          value={newBomItem.quantity}
                          onChange={(e) => setNewBomItem({...newBomItem, quantity: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Hao hụt (%)</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={newBomItem.wastageRate}
                            onChange={(e) => setNewBomItem({...newBomItem, wastageRate: parseFloat(e.target.value)})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                          />
                          <button
                            onClick={addBomItem}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {productFormData.bom.map((b: any, i: number) => {
                        const material = materials.find(m => m.id === b.materialId);
                        return material ? (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{material.name}</span>
                            <span className="text-sm">{b.quantity} {material.unit}</span>
                            <span className="text-sm text-gray-500">Hao hụt: {b.wastageRate}%</span>
                            <button onClick={() => removeBomItem(i)} className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : null;
                      })}
                      {productFormData.bom.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-2">Chưa có nguyên liệu nào</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={activeTab === 'materials' ? saveMaterial : saveProduct}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};