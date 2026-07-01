import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  initialCostStandards,
  initialCostEstimates,
  initialPackagingItems,
  initialLabelManagements,
  initialProducts
} from '../../data/mockData';
import { DataTable } from '../Common/DataTable';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  Tag,
  FileText,
  Calculator
} from 'lucide-react';

export const CostManagement: React.FC = () => {
  const [costStandards, setCostStandards] = useLocalStorage('costStandards', initialCostStandards);
  const [costEstimates, setCostEstimates] = useLocalStorage('costEstimates', initialCostEstimates);
  const [packagingItems, setPackagingItems] = useLocalStorage('packagingItems', initialPackagingItems);
  const [labelManagements, setLabelManagements] = useLocalStorage('labelManagements', initialLabelManagements);
  const [products] = useLocalStorage('products', initialProducts);

  const [activeTab, setActiveTab] = useState<'standards' | 'estimates' | 'packaging' | 'labels'>('standards');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [formType, setFormType] = useState<string>('standard');

  // ===== CRUD: ĐỊNH MỨC CHI PHÍ =====
  const handleAddStandard = () => {
    setFormType('standard');
    setSelectedItem(null);
    setFormData({
      code: `DM${String(costStandards.length + 1).padStart(3, '0')}`,
      productId: '',
      materialCost: 0,
      laborCost: 0,
      overheadCost: 0,
      totalCost: 0,
      unit: 'tấn',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      status: 'active',
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditStandard = (item: any) => {
    setFormType('standard');
    setSelectedItem(item);
    setFormData({
      ...item,
      effectiveDate: item.effectiveDate.split('T')[0],
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const saveStandard = () => {
    if (!formData.productId) {
      alert('Vui lòng chọn sản phẩm!');
      return;
    }
    const total = formData.materialCost + formData.laborCost + formData.overheadCost;
    const dataToSave = { ...formData, totalCost: total };

    if (selectedItem) {
      setCostStandards(costStandards.map(s => s.id === selectedItem.id ? { ...dataToSave, id: selectedItem.id, updatedAt: new Date().toISOString() } : s));
    } else {
      setCostStandards([...costStandards, { ...dataToSave, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteStandard = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa định mức này?')) {
      setCostStandards(costStandards.filter(s => s.id !== id));
    }
  };

  // ===== CRUD: DỰ TOÁN CHI PHÍ =====
  const handleAddEstimate = () => {
    setFormType('estimate');
    setSelectedItem(null);
    setFormData({
      code: `DT${String(costEstimates.length + 1).padStart(3, '0')}`,
      orderId: '',
      planId: '',
      productId: '',
      quantity: 0,
      unit: 'tấn',
      estimatedMaterialCost: 0,
      estimatedLaborCost: 0,
      estimatedOverheadCost: 0,
      totalEstimatedCost: 0,
      status: 'draft',
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditEstimate = (item: any) => {
    setFormType('estimate');
    setSelectedItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const saveEstimate = () => {
    if (!formData.productId || !formData.quantity) {
      alert('Vui lòng chọn sản phẩm và nhập số lượng!');
      return;
    }
    const total = formData.estimatedMaterialCost + formData.estimatedLaborCost + formData.estimatedOverheadCost;
    const dataToSave = { ...formData, totalEstimatedCost: total };

    if (selectedItem) {
      setCostEstimates(costEstimates.map(e => e.id === selectedItem.id ? { ...dataToSave, id: selectedItem.id, updatedAt: new Date().toISOString() } : e));
    } else {
      setCostEstimates([...costEstimates, { ...dataToSave, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteEstimate = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa dự toán này?')) {
      setCostEstimates(costEstimates.filter(e => e.id !== id));
    }
  };

  // ===== CRUD: ĐÓNG GÓI =====
  const handleAddPackaging = () => {
    setFormType('packaging');
    setSelectedItem(null);
    setFormData({
      code: `DG${String(packagingItems.length + 1).padStart(3, '0')}`,
      name: '',
      type: 'box',
      unit: 'cái',
      price: 0,
      quantity: 0,
      minStock: 0,
      status: 'active',
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditPackaging = (item: any) => {
    setFormType('packaging');
    setSelectedItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const savePackaging = () => {
    if (!formData.name) {
      alert('Vui lòng nhập tên vật tư đóng gói!');
      return;
    }

    if (selectedItem) {
      setPackagingItems(packagingItems.map(p => p.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : p));
    } else {
      setPackagingItems([...packagingItems, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeletePackaging = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa vật tư đóng gói này?')) {
      setPackagingItems(packagingItems.filter(p => p.id !== id));
    }
  };

  // ===== CRUD: TEM NHÃN =====
  const handleAddLabel = () => {
    setFormType('label');
    setSelectedItem(null);
    setFormData({
      code: `TN${String(labelManagements.length + 1).padStart(3, '0')}`,
      productId: '',
      name: '',
      template: '',
      size: '',
      material: '',
      quantity: 0,
      unit: 'cái',
      status: 'active',
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditLabel = (item: any) => {
    setFormType('label');
    setSelectedItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const saveLabel = () => {
    if (!formData.name || !formData.productId) {
      alert('Vui lòng nhập tên và chọn sản phẩm!');
      return;
    }

    if (selectedItem) {
      setLabelManagements(labelManagements.map(l => l.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : l));
    } else {
      setLabelManagements([...labelManagements, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteLabel = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa tem nhãn này?')) {
      setLabelManagements(labelManagements.filter(l => l.id !== id));
    }
  };

  // ===== COLUMNS =====
  const standardColumns = [
    { key: 'code', header: 'Mã định mức' },
    {
      key: 'productId',
      header: 'Sản phẩm',
      render: (item: any) => {
        const product = products.find(p => p.id === item.productId);
        return product ? product.name : 'Không xác định';
      }
    },
    { key: 'materialCost', header: 'NVL', render: (item: any) => `${item.materialCost.toLocaleString()} VND` },
    { key: 'laborCost', header: 'Nhân công', render: (item: any) => `${item.laborCost.toLocaleString()} VND` },
    { key: 'overheadCost', header: 'SXC', render: (item: any) => `${item.overheadCost.toLocaleString()} VND` },
    { key: 'totalCost', header: 'Tổng', render: (item: any) => `${item.totalCost.toLocaleString()} VND` },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {item.status === 'active' ? 'Đang áp dụng' : 'Ngừng áp dụng'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditStandard(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteStandard(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const estimateColumns = [
    { key: 'code', header: 'Mã dự toán' },
    {
      key: 'productId',
      header: 'Sản phẩm',
      render: (item: any) => {
        const product = products.find(p => p.id === item.productId);
        return product ? product.name : 'Không xác định';
      }
    },
    { key: 'quantity', header: 'Số lượng', render: (item: any) => `${item.quantity} ${item.unit}` },
    { key: 'totalEstimatedCost', header: 'Dự kiến', render: (item: any) => `${item.totalEstimatedCost.toLocaleString()} VND` },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => {
        const colors = {
          draft: 'bg-gray-100 text-gray-800',
          approved: 'bg-green-100 text-green-800',
          in_progress: 'bg-yellow-100 text-yellow-800',
          completed: 'bg-blue-100 text-blue-800',
          cancelled: 'bg-red-100 text-red-800'
        };
        const labels = {
          draft: 'Nháp',
          approved: 'Đã duyệt',
          in_progress: 'Đang thực hiện',
          completed: 'Hoàn thành',
          cancelled: 'Đã hủy'
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.status as keyof typeof colors]}`}>{labels[item.status as keyof typeof labels]}</span>;
      }
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditEstimate(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteEstimate(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const packagingColumns = [
    { key: 'code', header: 'Mã' },
    { key: 'name', header: 'Tên vật tư' },
    {
      key: 'type',
      header: 'Loại',
      render: (item: any) => {
        const types = {
          box: '📦 Thùng',
          bag: '🛍️ Bao',
          pallet: '📋 Pallet',
          label: '🏷️ Nhãn',
          other: '📎 Khác'
        };
        return types[item.type as keyof typeof types] || item.type;
      }
    },
    { key: 'quantity', header: 'Tồn kho' },
    { key: 'unit', header: 'Đơn vị' },
    { key: 'price', header: 'Đơn giá', render: (item: any) => `${item.price.toLocaleString()} VND` },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {item.status === 'active' ? 'Đang dùng' : 'Ngừng dùng'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditPackaging(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeletePackaging(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const labelColumns = [
    { key: 'code', header: 'Mã' },
    { key: 'name', header: 'Tên tem nhãn' },
    {
      key: 'productId',
      header: 'Sản phẩm',
      render: (item: any) => {
        const product = products.find(p => p.id === item.productId);
        return product ? product.name : 'Không xác định';
      }
    },
    { key: 'size', header: 'Kích thước' },
    { key: 'material', header: 'Vật liệu' },
    { key: 'quantity', header: 'Số lượng' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {item.status === 'active' ? 'Đang dùng' : 'Ngừng dùng'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditLabel(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteLabel(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
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
          <h2 className="text-2xl font-bold text-gray-800">Chi phí sản xuất</h2>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'standards') handleAddStandard();
            else if (activeTab === 'estimates') handleAddEstimate();
            else if (activeTab === 'packaging') handleAddPackaging();
            else handleAddLabel();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'standards' ? 'Thêm định mức' :
           activeTab === 'estimates' ? 'Tạo dự toán' :
           activeTab === 'packaging' ? 'Thêm vật tư' :
           'Thêm tem nhãn'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-lg px-4 overflow-x-auto">
        <button onClick={() => setActiveTab('standards')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'standards' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Calculator className="w-4 h-4" />
          Định mức ({costStandards.length})
        </button>
        <button onClick={() => setActiveTab('estimates')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'estimates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <FileText className="w-4 h-4" />
          Dự toán ({costEstimates.length})
        </button>
        <button onClick={() => setActiveTab('packaging')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'packaging' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Package className="w-4 h-4" />
          Đóng gói ({packagingItems.length})
        </button>
        <button onClick={() => setActiveTab('labels')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'labels' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Tag className="w-4 h-4" />
          Tem nhãn ({labelManagements.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {activeTab === 'standards' && <DataTable columns={standardColumns} data={costStandards} />}
        {activeTab === 'estimates' && <DataTable columns={estimateColumns} data={costEstimates} />}
        {activeTab === 'packaging' && <DataTable columns={packagingColumns} data={packagingItems} />}
        {activeTab === 'labels' && <DataTable columns={labelColumns} data={labelManagements} />}
      </div>

      {/* Modal Form - Giữ nguyên cấu trúc tương tự */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedItem ? 'Chỉnh sửa' : 'Thêm mới'}
                {formType === 'standard' ? ' Định mức chi phí' :
                 formType === 'estimate' ? ' Dự toán chi phí' :
                 formType === 'packaging' ? ' Vật tư đóng gói' :
                 ' Tem nhãn'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Form Định mức */}
              {formType === 'standard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã định mức</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm *</label>
                    <select value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn sản phẩm</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chi phí NVL</label>
                    <input type="number" value={formData.materialCost} onChange={(e) => setFormData({...formData, materialCost: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chi phí nhân công</label>
                    <input type="number" value={formData.laborCost} onChange={(e) => setFormData({...formData, laborCost: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chi phí SXC</label>
                    <input type="number" value={formData.overheadCost} onChange={(e) => setFormData({...formData, overheadCost: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tổng chi phí</label>
                    <input type="text" value={(formData.materialCost + formData.laborCost + formData.overheadCost).toLocaleString()} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hiệu lực</label>
                    <input type="date" value={formData.effectiveDate} onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                    <input type="date" value={formData.expiryDate || ''} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Ghi chú..." />
                  </div>
                </div>
              )}

              {/* Form Dự toán */}
              {formType === 'estimate' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã dự toán</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm *</label>
                    <select value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn sản phẩm</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng *</label>
                    <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="0" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                    <input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chi phí NVL dự kiến</label>
                    <input type="number" value={formData.estimatedMaterialCost} onChange={(e) => setFormData({...formData, estimatedMaterialCost: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chi phí nhân công dự kiến</label>
                    <input type="number" value={formData.estimatedLaborCost} onChange={(e) => setFormData({...formData, estimatedLaborCost: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chi phí SXC dự kiến</label>
                    <input type="number" value={formData.estimatedOverheadCost} onChange={(e) => setFormData({...formData, estimatedOverheadCost: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tổng dự kiến</label>
                    <input type="text" value={(formData.estimatedMaterialCost + formData.estimatedLaborCost + formData.estimatedOverheadCost).toLocaleString()} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Ghi chú..." />
                  </div>
                </div>
              )}

              {/* Form Đóng gói */}
              {formType === 'packaging' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên vật tư *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="box">Thùng</option>
                      <option value="bag">Bao</option>
                      <option value="pallet">Pallet</option>
                      <option value="label">Nhãn</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                    <input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
                    <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tồn tối thiểu</label>
                    <input type="number" value={formData.minStock} onChange={(e) => setFormData({...formData, minStock: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Ghi chú..." />
                  </div>
                </div>
              )}

              {/* Form Tem nhãn */}
              {formType === 'label' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên tem nhãn *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm *</label>
                    <select value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn sản phẩm</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kích thước</label>
                    <input type="text" value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="VD: 100x150mm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vật liệu</label>
                    <input type="text" value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="VD: Giấy, nhựa..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                    <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                    <input type="text" value={formData.template || ''} onChange={(e) => setFormData({...formData, template: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="VD: Template mẫu..." />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Ghi chú..." />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Hủy
                </button>
                <button
                  onClick={() => {
                    if (formType === 'standard') saveStandard();
                    else if (formType === 'estimate') saveEstimate();
                    else if (formType === 'packaging') savePackaging();
                    else saveLabel();
                  }}
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