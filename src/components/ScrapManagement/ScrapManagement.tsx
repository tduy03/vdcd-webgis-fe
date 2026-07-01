import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  initialScrapMaterials,
  initialDismantleOrders,
  initialScrapTrackings,
  initialProducts,
  initialMaterials
} from '../../data/mockData';
import { DataTable } from '../Common/DataTable';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertTriangle,
  Eye,
  Wrench
} from 'lucide-react';

export const ScrapManagement: React.FC = () => {
  const [scrapMaterials, setScrapMaterials] = useLocalStorage('scrapMaterials', initialScrapMaterials);
  const [dismantleOrders, setDismantleOrders] = useLocalStorage('dismantleOrders', initialDismantleOrders);
  const [scrapTrackings, setScrapTrackings] = useLocalStorage('scrapTrackings', initialScrapTrackings);
  const [products] = useLocalStorage('products', initialProducts);
  const [materials] = useLocalStorage('materials', initialMaterials);

  const [activeTab, setActiveTab] = useState<'scrap' | 'dismantle' | 'tracking'>('scrap');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [formType, setFormType] = useState<string>('scrap');

  // ===== CRUD: PHẾ LIỆU =====
  const handleAddScrap = () => {
    setFormType('scrap');
    setSelectedItem(null);
    setFormData({
      code: `PL${String(scrapMaterials.length + 1).padStart(3, '0')}`,
      orderId: '',
      materialId: '',
      quantity: 0,
      unit: 'tấn',
      type: 'scrap',
      reason: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditScrap = (item: any) => {
    setFormType('scrap');
    setSelectedItem(item);
    setFormData({
      ...item,
      date: item.date.split('T')[0]
    });
    setShowForm(true);
  };

  const saveScrap = () => {
    if (!formData.materialId || !formData.quantity) {
      alert('Vui lòng chọn nguyên liệu và nhập số lượng!');
      return;
    }

    if (selectedItem) {
      setScrapMaterials(scrapMaterials.map(s => s.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : s));
    } else {
      setScrapMaterials([...scrapMaterials, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteScrap = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa phế liệu này?')) {
      setScrapMaterials(scrapMaterials.filter(s => s.id !== id));
    }
  };

  const updateScrapStatus = (id: string, status: string) => {
    setScrapMaterials(scrapMaterials.map(s => 
      s.id === id ? { ...s, status: status as any, updatedAt: new Date().toISOString() } : s
    ));
  };

  // ===== CRUD: LỆNH THÁO DỠ =====
  const handleAddDismantle = () => {
    setFormType('dismantle');
    setSelectedItem(null);
    setFormData({
      code: `TD${String(dismantleOrders.length + 1).padStart(3, '0')}`,
      productId: '',
      quantity: 0,
      unit: 'tấn',
      reason: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      materials: [],
      notes: '',
      newMaterialId: '',
      newMaterialQuantity: '',
      newMaterialRecoveryRate: '80',
      newMaterialCondition: 'good'
    });
    setShowForm(true);
  };

  const handleEditDismantle = (item: any) => {
    setFormType('dismantle');
    setSelectedItem(item);
    setFormData({
      ...item,
      date: item.date.split('T')[0],
      newMaterialId: '',
      newMaterialQuantity: '',
      newMaterialRecoveryRate: '80',
      newMaterialCondition: 'good'
    });
    setShowForm(true);
  };

  const saveDismantle = () => {
    if (!formData.productId || !formData.quantity) {
      alert('Vui lòng chọn sản phẩm và nhập số lượng!');
      return;
    }

    if (selectedItem) {
      setDismantleOrders(dismantleOrders.map(d => d.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : d));
    } else {
      setDismantleOrders([...dismantleOrders, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteDismantle = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa lệnh tháo dỡ này?')) {
      setDismantleOrders(dismantleOrders.filter(d => d.id !== id));
    }
  };

  const addDismantleMaterial = () => {
    if (!formData.newMaterialId || !formData.newMaterialQuantity) {
      alert('Vui lòng chọn nguyên liệu và nhập số lượng!');
      return;
    }
    const material = materials.find(m => m.id === formData.newMaterialId);
    const newMaterial = {
      materialId: formData.newMaterialId,
      materialName: material?.name || '',
      quantity: parseFloat(formData.newMaterialQuantity),
      unit: material?.unit || 'tấn',
      recoveryRate: parseFloat(formData.newMaterialRecoveryRate || '80'),
      condition: formData.newMaterialCondition || 'good'
    };
    setFormData({
      ...formData,
      materials: [...(formData.materials || []), newMaterial],
      newMaterialId: '',
      newMaterialQuantity: '',
      newMaterialRecoveryRate: '80',
      newMaterialCondition: 'good'
    });
  };

  const removeDismantleMaterial = (index: number) => {
    const newMaterials = formData.materials.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, materials: newMaterials });
  };

  const updateDismantleStatus = (id: string, status: string) => {
    setDismantleOrders(dismantleOrders.map(d => 
      d.id === id ? { ...d, status: status as any, updatedAt: new Date().toISOString() } : d
    ));
  };

  // ===== CRUD: TRUY VẾT PHẾ LIỆU =====
  const handleAddTracking = () => {
    setFormType('tracking');
    setSelectedItem(null);
    setFormData({
      code: `TV${String(scrapTrackings.length + 1).padStart(3, '0')}`,
      scrapId: '',
      fromStage: '',
      toStage: '',
      quantity: 0,
      unit: 'tấn',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditTracking = (item: any) => {
    setFormType('tracking');
    setSelectedItem(item);
    setFormData({
      ...item,
      date: item.date.split('T')[0]
    });
    setShowForm(true);
  };

  const saveTracking = () => {
    if (!formData.scrapId || !formData.quantity) {
      alert('Vui lòng chọn phế liệu và nhập số lượng!');
      return;
    }

    if (selectedItem) {
      setScrapTrackings(scrapTrackings.map(t => t.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : t));
    } else {
      setScrapTrackings([...scrapTrackings, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteTracking = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa truy vết này?')) {
      setScrapTrackings(scrapTrackings.filter(t => t.id !== id));
    }
  };

  const updateTrackingStatus = (id: string, status: string) => {
    setScrapTrackings(scrapTrackings.map(t => 
      t.id === id ? { ...t, status: status as any, updatedAt: new Date().toISOString() } : t
    ));
  };

  // ===== COLUMNS =====
  const scrapColumns = [
    { key: 'code', header: 'Mã PL' },
    {
      key: 'materialId',
      header: 'Nguyên liệu',
      render: (item: any) => {
        const material = materials.find(m => m.id === item.materialId);
        return material ? material.name : 'Không xác định';
      }
    },
    { key: 'quantity', header: 'Số lượng', render: (item: any) => `${item.quantity} ${item.unit}` },
    {
      key: 'type',
      header: 'Loại',
      render: (item: any) => {
        const types = {
          scrap: '🔄 Phế liệu',
          defect: '⚠️ Lỗi sản phẩm',
          waste: '🗑️ Chất thải'
        };
        return types[item.type as keyof typeof types] || item.type;
      }
    },
    { key: 'reason', header: 'Lý do' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800',
          processed: 'bg-blue-100 text-blue-800'
        };
        // const labels = {
        //   pending: 'Chờ duyệt',
        //   approved: 'Đã duyệt',
        //   rejected: 'Từ chối',
        //   processed: 'Đã xử lý'
        // };
        return (
          <select
            value={item.status}
            onChange={(e) => updateScrapStatus(item.id, e.target.value)}
            className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${colors[item.status as keyof typeof colors]}`}
          >
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="processed">Đã xử lý</option>
          </select>
        );
      }
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditScrap(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteScrap(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const dismantleColumns = [
    { key: 'code', header: 'Mã lệnh' },
    {
      key: 'productId',
      header: 'Sản phẩm',
      render: (item: any) => {
        const product = products.find(p => p.id === item.productId);
        return product ? product.name : 'Không xác định';
      }
    },
    { key: 'quantity', header: 'Số lượng', render: (item: any) => `${item.quantity} ${item.unit}` },
    { key: 'reason', header: 'Lý do' },
    {
      key: 'materials',
      header: 'Nguyên liệu thu hồi',
      render: (item: any) => (
        <div className="text-xs">
          {item.materials.map((m: any, idx: number) => (
            <div key={idx}>{m.materialName}: {m.quantity} {m.unit} ({m.recoveryRate}%)</div>
          ))}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          in_progress: 'bg-blue-100 text-blue-800',
          completed: 'bg-purple-100 text-purple-800',
          cancelled: 'bg-red-100 text-red-800'
        };
        // const labels = {
        //   pending: 'Chờ duyệt',
        //   approved: 'Đã duyệt',
        //   in_progress: 'Đang thực hiện',
        //   completed: 'Hoàn thành',
        //   cancelled: 'Đã hủy'
        // };
        return (
          <select
            value={item.status}
            onChange={(e) => updateDismantleStatus(item.id, e.target.value)}
            className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${colors[item.status as keyof typeof colors]}`}
          >
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="in_progress">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        );
      }
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditDismantle(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteDismantle(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const trackingColumns = [
    { key: 'code', header: 'Mã truy vết' },
    {
      key: 'scrapId',
      header: 'Phế liệu',
      render: (item: any) => {
        const scrap = scrapMaterials.find(s => s.id === item.scrapId);
        return scrap ? scrap.code : 'Không xác định';
      }
    },
    { key: 'fromStage', header: 'Từ công đoạn' },
    { key: 'toStage', header: 'Đến công đoạn' },
    { key: 'quantity', header: 'Số lượng', render: (item: any) => `${item.quantity} ${item.unit}` },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          in_transit: 'bg-blue-100 text-blue-800',
          completed: 'bg-green-100 text-green-800'
        };
        // const labels = {
        //   pending: 'Chờ vận chuyển',
        //   in_transit: 'Đang vận chuyển',
        //   completed: 'Đã hoàn thành'
        // };
        return (
          <select
            value={item.status}
            onChange={(e) => updateTrackingStatus(item.id, e.target.value)}
            className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${colors[item.status as keyof typeof colors]}`}
          >
            <option value="pending">Chờ vận chuyển</option>
            <option value="in_transit">Đang vận chuyển</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
        );
      }
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditTracking(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteTracking(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Stats
  // const totalScrap = scrapMaterials.length;
  // const pendingScrap = scrapMaterials.filter(s => s.status === 'pending').length;
  // const approvedScrap = scrapMaterials.filter(s => s.status === 'approved').length;
  // const totalDismantle = dismantleOrders.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý phế liệu</h2>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'scrap') handleAddScrap();
            else if (activeTab === 'dismantle') handleAddDismantle();
            else handleAddTracking();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'scrap' ? 'Thêm phế liệu' :
           activeTab === 'dismantle' ? 'Tạo lệnh tháo dỡ' :
           'Tạo truy vết'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-lg px-4 overflow-x-auto">
        <button onClick={() => setActiveTab('scrap')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'scrap' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <AlertTriangle className="w-4 h-4" />
          Phế liệu ({scrapMaterials.length})
        </button>
        <button onClick={() => setActiveTab('dismantle')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'dismantle' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Wrench className="w-4 h-4" />
          Lệnh tháo dỡ ({dismantleOrders.length})
        </button>
        <button onClick={() => setActiveTab('tracking')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'tracking' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Eye className="w-4 h-4" />
          Truy vết ({scrapTrackings.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {activeTab === 'scrap' && <DataTable columns={scrapColumns} data={scrapMaterials} />}
        {activeTab === 'dismantle' && <DataTable columns={dismantleColumns} data={dismantleOrders} />}
        {activeTab === 'tracking' && <DataTable columns={trackingColumns} data={scrapTrackings} />}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedItem ? 'Chỉnh sửa' : 'Thêm mới'}
                {formType === 'scrap' ? ' Phế liệu' :
                 formType === 'dismantle' ? ' Lệnh tháo dỡ' :
                 ' Truy vết phế liệu'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Form Phế liệu */}
              {formType === 'scrap' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã PL</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nguyên liệu *</label>
                    <select value={formData.materialId} onChange={(e) => setFormData({...formData, materialId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn nguyên liệu</option>
                      {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="scrap">Phế liệu</option>
                      <option value="defect">Lỗi sản phẩm</option>
                      <option value="waste">Chất thải</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lý do *</label>
                    <input type="text" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Lý do phát sinh phế liệu" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Ghi chú..." />
                  </div>
                </div>
              )}

              {/* Form Lệnh tháo dỡ */}
              {formType === 'dismantle' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mã lệnh</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                      <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lý do *</label>
                      <input type="text" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Lý do tháo dỡ" />
                    </div>
                  </div>

                  {/* Nguyên liệu thu hồi */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3">Nguyên liệu thu hồi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Nguyên liệu</label>
                        <select
                          value={formData.newMaterialId || ''}
                          onChange={(e) => setFormData({...formData, newMaterialId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Chọn NVL</option>
                          {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Số lượng</label>
                        <input
                          type="number"
                          value={formData.newMaterialQuantity || ''}
                          onChange={(e) => setFormData({...formData, newMaterialQuantity: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Tỷ lệ thu hồi (%)</label>
                        <input
                          type="number"
                          value={formData.newMaterialRecoveryRate || '80'}
                          onChange={(e) => setFormData({...formData, newMaterialRecoveryRate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={addDismantleMaterial}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Thêm
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {formData.materials?.map((m: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{m.materialName}</span>
                          <span className="text-sm">{m.quantity} {m.unit}</span>
                          <span className="text-sm">Thu hồi: {m.recoveryRate}%</span>
                          <span className="text-sm">Tình trạng: {m.condition === 'good' ? 'Tốt' : m.condition === 'fair' ? 'Trung bình' : 'Kém'}</span>
                          <button onClick={() => removeDismantleMaterial(i)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Ghi chú..." />
                  </div>
                </div>
              )}

              {/* Form Truy vết */}
              {formType === 'tracking' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã truy vết</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phế liệu *</label>
                    <select value={formData.scrapId} onChange={(e) => setFormData({...formData, scrapId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn phế liệu</option>
                      {scrapMaterials.map(s => <option key={s.id} value={s.id}>{s.code}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ công đoạn</label>
                    <input type="text" value={formData.fromStage} onChange={(e) => setFormData({...formData, fromStage: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="VD: Pha chế" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến công đoạn</label>
                    <input type="text" value={formData.toStage} onChange={(e) => setFormData({...formData, toStage: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="VD: Kho phế liệu" />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
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
                    if (formType === 'scrap') saveScrap();
                    else if (formType === 'dismantle') saveDismantle();
                    else saveTracking();
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