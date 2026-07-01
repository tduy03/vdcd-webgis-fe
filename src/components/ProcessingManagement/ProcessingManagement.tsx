import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  initialSubcontractors,
  initialOutsourcingOrders,
  initialInternalProcessings,
  initialProducts
} from '../../data/mockData';
import { DataTable } from '../Common/DataTable';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Building,
  Package,
  Users
} from 'lucide-react';

export const ProcessingManagement: React.FC = () => {
  const [subcontractors, setSubcontractors] = useLocalStorage('subcontractors', initialSubcontractors);
  const [outsourcingOrders, setOutsourcingOrders] = useLocalStorage('outsourcingOrders', initialOutsourcingOrders);
  const [internalProcessings, setInternalProcessings] = useLocalStorage('internalProcessings', initialInternalProcessings);
  const [products] = useLocalStorage('products', initialProducts);

  const [activeTab, setActiveTab] = useState<'subcontractors' | 'outsourcing' | 'internal'>('subcontractors');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [formType, setFormType] = useState<string>('subcontractor');

  // ===== CRUD: NHÀ THẦU PHỤ =====
  const handleAddSubcontractor = () => {
    setFormType('subcontractor');
    setSelectedItem(null);
    setFormData({
      code: `NCC${String(subcontractors.length + 1).padStart(3, '0')}`,
      name: '',
      address: '',
      phone: '',
      email: '',
      taxCode: '',
      status: 'active',
      rating: 3,
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditSubcontractor = (item: any) => {
    setFormType('subcontractor');
    setSelectedItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const saveSubcontractor = () => {
    if (!formData.name || !formData.address) {
      alert('Vui lòng nhập tên và địa chỉ!');
      return;
    }

    if (selectedItem) {
      setSubcontractors(subcontractors.map(s => s.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : s));
    } else {
      setSubcontractors([...subcontractors, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteSubcontractor = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa nhà thầu phụ này?')) {
      setSubcontractors(subcontractors.filter(s => s.id !== id));
    }
  };

  // ===== CRUD: ĐƠN HÀNG THUÊ NGOÀI =====
  const handleAddOutsourcing = () => {
    setFormType('outsourcing');
    setSelectedItem(null);
    setFormData({
      code: `GC${String(outsourcingOrders.length + 1).padStart(3, '0')}`,
      subcontractorId: '',
      productId: '',
      quantity: 0,
      unit: 'tấn',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      cost: 0,
      currency: 'VND',
      deliveryAddress: '',
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditOutsourcing = (item: any) => {
    setFormType('outsourcing');
    setSelectedItem(item);
    setFormData({
      ...item,
      startDate: item.startDate.split('T')[0],
      endDate: item.endDate.split('T')[0]
    });
    setShowForm(true);
  };

  const saveOutsourcing = () => {
    if (!formData.subcontractorId || !formData.productId || !formData.quantity) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (selectedItem) {
      setOutsourcingOrders(outsourcingOrders.map(o => o.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : o));
    } else {
      setOutsourcingOrders([...outsourcingOrders, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteOutsourcing = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa đơn hàng thuê ngoài này?')) {
      setOutsourcingOrders(outsourcingOrders.filter(o => o.id !== id));
    }
  };

  const updateOutsourcingStatus = (id: string, status: string) => {
    setOutsourcingOrders(outsourcingOrders.map(o => 
      o.id === id ? { ...o, status: status as any, updatedAt: new Date().toISOString() } : o
    ));
  };

  // ===== CRUD: GIA CÔNG NỘI BỘ =====
  const handleAddInternal = () => {
    setFormType('internal');
    setSelectedItem(null);
    setFormData({
      code: `NB${String(internalProcessings.length + 1).padStart(3, '0')}`,
      orderId: '',
      stage: '',
      assignedTeam: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      quantity: 0,
      unit: 'tấn',
      cost: 0,
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditInternal = (item: any) => {
    setFormType('internal');
    setSelectedItem(item);
    setFormData({
      ...item,
      startDate: item.startDate.split('T')[0],
      endDate: item.endDate.split('T')[0]
    });
    setShowForm(true);
  };

  const saveInternal = () => {
    if (!formData.orderId || !formData.stage || !formData.quantity) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (selectedItem) {
      setInternalProcessings(internalProcessings.map(i => i.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : i));
    } else {
      setInternalProcessings([...internalProcessings, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteInternal = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa gia công nội bộ này?')) {
      setInternalProcessings(internalProcessings.filter(i => i.id !== id));
    }
  };

  const updateInternalStatus = (id: string, status: string) => {
    setInternalProcessings(internalProcessings.map(i => 
      i.id === id ? { ...i, status: status as any, updatedAt: new Date().toISOString() } : i
    ));
  };

  // ===== COLUMNS =====
  const subcontractorColumns = [
    { key: 'code', header: 'Mã NCC' },
    { key: 'name', header: 'Tên nhà thầu' },
    { key: 'address', header: 'Địa chỉ' },
    { key: 'phone', header: 'Điện thoại' },
    { key: 'email', header: 'Email' },
    {
      key: 'rating',
      header: 'Đánh giá',
      render: (item: any) => (
        <span className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
          ))}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {item.status === 'active' ? 'Đang hợp tác' : 'Ngừng hợp tác'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditSubcontractor(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteSubcontractor(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const outsourcingColumns = [
    { key: 'code', header: 'Mã đơn' },
    {
      key: 'subcontractorId',
      header: 'Nhà thầu',
      render: (item: any) => {
        const sub = subcontractors.find(s => s.id === item.subcontractorId);
        return sub ? sub.name : 'Không xác định';
      }
    },
    {
      key: 'productId',
      header: 'Sản phẩm',
      render: (item: any) => {
        const product = products.find(p => p.id === item.productId);
        return product ? product.name : 'Không xác định';
      }
    },
    { key: 'quantity', header: 'Số lượng', render: (item: any) => `${item.quantity} ${item.unit}` },
    { key: 'cost', header: 'Chi phí', render: (item: any) => `${item.cost.toLocaleString()} ${item.currency}` },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          in_progress: 'bg-blue-100 text-blue-800',
          completed: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800'
        };
        // const labels = {
        //   pending: 'Chờ xử lý',
        //   in_progress: 'Đang gia công',
        //   completed: 'Hoàn thành',
        //   cancelled: 'Đã hủy'
        // };
        return (
          <select
            value={item.status}
            onChange={(e) => updateOutsourcingStatus(item.id, e.target.value)}
            className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${colors[item.status as keyof typeof colors]}`}
          >
            <option value="pending">Chờ xử lý</option>
            <option value="in_progress">Đang gia công</option>
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
          <button onClick={() => handleEditOutsourcing(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteOutsourcing(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const internalColumns = [
    { key: 'code', header: 'Mã' },
    {
      key: 'orderId',
      header: 'Đơn hàng',
      render: (item: any) => {
        const order = outsourcingOrders.find(o => o.id === item.orderId);
        return order ? order.code : 'Không xác định';
      }
    },
    { key: 'stage', header: 'Công đoạn' },
    { key: 'assignedTeam', header: 'Tổ đội' },
    { key: 'quantity', header: 'Số lượng', render: (item: any) => `${item.quantity} ${item.unit}` },
    { key: 'cost', header: 'Chi phí', render: (item: any) => `${item.cost.toLocaleString()} VND` },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          in_progress: 'bg-blue-100 text-blue-800',
          completed: 'bg-green-100 text-green-800'
        };
        // const labels = {
        //   pending: 'Chờ thực hiện',
        //   in_progress: 'Đang thực hiện',
        //   completed: 'Hoàn thành'
        // };
        return (
          <select
            value={item.status}
            onChange={(e) => updateInternalStatus(item.id, e.target.value)}
            className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${colors[item.status as keyof typeof colors]}`}
          >
            <option value="pending">Chờ thực hiện</option>
            <option value="in_progress">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
          </select>
        );
      }
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditInternal(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteInternal(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Stats
  // const totalSubcontractors = subcontractors.length;
  // const activeSubcontractors = subcontractors.filter(s => s.status === 'active').length;
  // const totalOutsourcing = outsourcingOrders.length;
  // const totalInternal = internalProcessings.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gia công</h2>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'subcontractors') handleAddSubcontractor();
            else if (activeTab === 'outsourcing') handleAddOutsourcing();
            else handleAddInternal();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'subcontractors' ? 'Thêm nhà thầu' :
           activeTab === 'outsourcing' ? 'Tạo đơn hàng' :
           'Thêm gia công nội bộ'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-lg px-4 overflow-x-auto">
        <button onClick={() => setActiveTab('subcontractors')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'subcontractors' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Building className="w-4 h-4" />
          Nhà thầu phụ ({subcontractors.length})
        </button>
        <button onClick={() => setActiveTab('outsourcing')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'outsourcing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Package className="w-4 h-4" />
          Thuê ngoài ({outsourcingOrders.length})
        </button>
        <button onClick={() => setActiveTab('internal')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'internal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Users className="w-4 h-4" />
          Nội bộ ({internalProcessings.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {activeTab === 'subcontractors' && <DataTable columns={subcontractorColumns} data={subcontractors} />}
        {activeTab === 'outsourcing' && <DataTable columns={outsourcingColumns} data={outsourcingOrders} />}
        {activeTab === 'internal' && <DataTable columns={internalColumns} data={internalProcessings} />}
      </div>

      {/* Modal Form - Giữ nguyên cấu trúc */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedItem ? 'Chỉnh sửa' : 'Thêm mới'}
                {formType === 'subcontractor' ? ' Nhà thầu phụ' :
                 formType === 'outsourcing' ? ' Đơn hàng thuê ngoài' :
                 ' Gia công nội bộ'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Form Nhà thầu phụ */}
              {formType === 'subcontractor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã NCC</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhà thầu *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ *</label>
                    <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã số thuế</label>
                    <input type="text" value={formData.taxCode} onChange={(e) => setFormData({...formData, taxCode: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá</label>
                    <select value={formData.rating} onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="1">⭐</option>
                      <option value="2">⭐⭐</option>
                      <option value="3">⭐⭐⭐</option>
                      <option value="4">⭐⭐⭐⭐</option>
                      <option value="5">⭐⭐⭐⭐⭐</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="active">Đang hợp tác</option>
                      <option value="inactive">Ngừng hợp tác</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Ghi chú..." />
                  </div>
                </div>
              )}

              {/* Form Đơn hàng thuê ngoài */}
              {formType === 'outsourcing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã đơn</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhà thầu *</label>
                    <select value={formData.subcontractorId} onChange={(e) => setFormData({...formData, subcontractorId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn nhà thầu</option>
                      {subcontractors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chi phí</label>
                    <input type="number" value={formData.cost} onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng</label>
                    <input type="text" value={formData.deliveryAddress} onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Ghi chú..." />
                  </div>
                </div>
              )}

              {/* Form Gia công nội bộ */}
              {formType === 'internal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn hàng *</label>
                    <select value={formData.orderId} onChange={(e) => setFormData({...formData, orderId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn đơn hàng</option>
                      {outsourcingOrders.map(o => <option key={o.id} value={o.id}>{o.code}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Công đoạn *</label>
                    <input type="text" value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="VD: Pha chế" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tổ đội</label>
                    <input type="text" value={formData.assignedTeam} onChange={(e) => setFormData({...formData, assignedTeam: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="VD: Tổ 1" />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chi phí</label>
                    <input type="number" value={formData.cost} onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
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
                    if (formType === 'subcontractor') saveSubcontractor();
                    else if (formType === 'outsourcing') saveOutsourcing();
                    else saveInternal();
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