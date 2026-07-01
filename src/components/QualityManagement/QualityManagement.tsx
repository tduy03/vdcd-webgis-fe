import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  initialQualityStandards,
  initialDefectTypes,
  initialQualityCheckRecords,
  initialProductDisposals,
  initialProducts,
  initialProductionOrders
} from '../../data/mockData';
import { DataTable } from '../Common/DataTable';
import {
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ClipboardCheck,
  List,
  Award
} from 'lucide-react';

export const QualityManagement: React.FC = () => {
  const [standards, setStandards] = useLocalStorage('qualityStandards', initialQualityStandards);
  const [defectTypes, setDefectTypes] = useLocalStorage('defectTypes', initialDefectTypes);
  const [checkRecords, setCheckRecords] = useLocalStorage('qualityCheckRecords', initialQualityCheckRecords);
  const [disposals, setDisposals] = useLocalStorage('productDisposals', initialProductDisposals);
  const [products] = useLocalStorage('products', initialProducts);
  const [orders] = useLocalStorage('productionOrders', initialProductionOrders);

  const [activeTab, setActiveTab] = useState<'standards' | 'defects' | 'checks' | 'disposals'>('standards');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [formType, setFormType] = useState<string>('standard');

  // ===== CRUD: TIÊU CHUẨN CHẤT LƯỢNG =====
  const handleAddStandard = () => {
    setFormType('standard');
    setSelectedItem(null);
    setFormData({
      code: `TC${String(standards.length + 1).padStart(3, '0')}`,
      name: '',
      productId: '',
      samplingMethod: 'random',
      sampleSize: 10,
      criteria: [],
      status: 'active'
    });
    setShowForm(true);
  };

  const handleEditStandard = (item: any) => {
    setFormType('standard');
    setSelectedItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const saveStandard = () => {
    if (!formData.name || !formData.productId) {
      alert('Vui lòng nhập tên và chọn sản phẩm!');
      return;
    }

    if (selectedItem) {
      setStandards(standards.map(s => s.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : s));
    } else {
      setStandards([...standards, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteStandard = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa tiêu chuẩn này?')) {
      setStandards(standards.filter(s => s.id !== id));
    }
  };

  // ===== CRUD: ĐỊNH NGHĨA LỖI =====
  const handleAddDefect = () => {
    setFormType('defect');
    setSelectedItem(null);
    setFormData({
      code: `L${String(defectTypes.length + 1).padStart(3, '0')}`,
      name: '',
      category: 'major',
      description: '',
      severity: 3
    });
    setShowForm(true);
  };

  const handleEditDefect = (item: any) => {
    setFormType('defect');
    setSelectedItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const saveDefect = () => {
    if (!formData.name || !formData.description) {
      alert('Vui lòng nhập tên và mô tả lỗi!');
      return;
    }

    if (selectedItem) {
      setDefectTypes(defectTypes.map(d => d.id === selectedItem.id ? { ...formData, id: selectedItem.id } : d));
    } else {
      setDefectTypes([...defectTypes, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteDefect = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa định nghĩa lỗi này?')) {
      setDefectTypes(defectTypes.filter(d => d.id !== id));
    }
  };

  // ===== CRUD: PHIẾU KIỂM TRA =====
  const handleAddCheck = () => {
    setFormType('check');
    setSelectedItem(null);
    setFormData({
      code: `QC${String(checkRecords.length + 1).padStart(3, '0')}`,
      orderId: '',
      stage: '',
      inspector: '',
      checkDate: new Date().toISOString().split('T')[0],
      sampleSize: 0,
      defects: [],
      result: 'pending',
      notes: '',
      status: 'draft'
    });
    setShowForm(true);
  };

  const handleEditCheck = (item: any) => {
    setFormType('check');
    setSelectedItem(item);
    setFormData({
      ...item,
      checkDate: item.checkDate.split('T')[0]
    });
    setShowForm(true);
  };

  const saveCheck = () => {
    if (!formData.orderId || !formData.stage) {
      alert('Vui lòng chọn lệnh sản xuất và công đoạn!');
      return;
    }

    if (selectedItem) {
      setCheckRecords(checkRecords.map(c => c.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : c));
    } else {
      setCheckRecords([...checkRecords, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteCheck = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa phiếu kiểm tra này?')) {
      setCheckRecords(checkRecords.filter(c => c.id !== id));
    }
  };

  // ===== CRUD: HỦY SẢN PHẨM =====
  const handleAddDisposal = () => {
    setFormType('disposal');
    setSelectedItem(null);
    setFormData({
      code: `HH${String(disposals.length + 1).padStart(3, '0')}`,
      orderId: '',
      productId: '',
      quantity: 0,
      unit: 'tấn',
      reason: '',
      defectTypeId: '',
      disposalType: 'scrap',
      status: 'pending',
      disposalDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditDisposal = (item: any) => {
    setFormType('disposal');
    setSelectedItem(item);
    setFormData({
      ...item,
      disposalDate: item.disposalDate.split('T')[0]
    });
    setShowForm(true);
  };

  const saveDisposal = () => {
    if (!formData.orderId || !formData.productId || !formData.quantity) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (selectedItem) {
      setDisposals(disposals.map(d => d.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : d));
    } else {
      setDisposals([...disposals, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteDisposal = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa biên bản hủy này?')) {
      setDisposals(disposals.filter(d => d.id !== id));
    }
  };

  // ===== COLUMNS: TIÊU CHUẨN =====
  const standardColumns = [
    { key: 'code', header: 'Mã tiêu chuẩn' },
    { key: 'name', header: 'Tên tiêu chuẩn' },
    {
      key: 'productId',
      header: 'Sản phẩm',
      render: (item: any) => {
        const product = products.find(p => p.id === item.productId);
        return product ? product.name : 'Không xác định';
      }
    },
    // {
    //   key: 'samplingMethod',
    //   header: 'Phương pháp',
    //   render: (item: any) => ({
    //     random: 'Ngẫu nhiên',
    //     systematic: 'Hệ thống',
    //     stratified: 'Phân tầng'
    //   }[item.samplingMethod] || item.samplingMethod)
    // },
    { key: 'sampleSize', header: 'Cỡ mẫu' },
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

  // ===== COLUMNS: ĐỊNH NGHĨA LỖI =====
  const defectColumns = [
    { key: 'code', header: 'Mã lỗi' },
    { key: 'name', header: 'Tên lỗi' },
    {
      key: 'category',
      header: 'Phân loại',
      render: (item: any) => {
        const colors = {
          critical: 'bg-red-100 text-red-800',
          major: 'bg-yellow-100 text-yellow-800',
          minor: 'bg-blue-100 text-blue-800'
        };
        const labels = {
          critical: 'Nghiêm trọng',
          major: 'Chính',
          minor: 'Phụ'
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.category as keyof typeof colors]}`}>{labels[item.category as keyof typeof labels]}</span>;
      }
    },
    { key: 'description', header: 'Mô tả' },
    {
      key: 'severity',
      header: 'Mức độ',
      render: (item: any) => (
        <span className="font-medium">
          {Array.from({ length: item.severity }, () => '⭐').join('')}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditDefect(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteDefect(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // ===== COLUMNS: PHIẾU KIỂM TRA =====
  const checkColumns = [
    { key: 'code', header: 'Mã phiếu' },
    {
      key: 'orderId',
      header: 'Lệnh SX',
      render: (item: any) => {
        const order = orders.find(o => o.id === item.orderId);
        return order ? order.code : 'Không xác định';
      }
    },
    { key: 'stage', header: 'Công đoạn' },
    { key: 'inspector', header: 'Người kiểm tra' },
    { key: 'sampleSize', header: 'Cỡ mẫu' },
    {
      key: 'result',
      header: 'Kết quả',
      render: (item: any) => {
        const colors = {
          passed: 'bg-green-100 text-green-800',
          failed: 'bg-red-100 text-red-800',
          conditional: 'bg-yellow-100 text-yellow-800'
        };
        const labels = {
          passed: '✅ Đạt',
          failed: '❌ Không đạt',
          conditional: '⚠️ Có điều kiện'
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.result as keyof typeof colors] || 'bg-gray-100'}`}>
          {labels[item.result as keyof typeof labels] || item.result}
        </span>;
      }
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => {
        const colors = {
          draft: 'bg-gray-100 text-gray-800',
          submitted: 'bg-blue-100 text-blue-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800'
        };
        const labels = {
          draft: 'Nháp',
          submitted: 'Đã nộp',
          approved: 'Đã duyệt',
          rejected: 'Từ chối'
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.status as keyof typeof colors]}`}>{labels[item.status as keyof typeof labels]}</span>;
      }
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditCheck(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteCheck(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // ===== COLUMNS: HỦY SẢN PHẨM =====
  const disposalColumns = [
    { key: 'code', header: 'Mã biên bản' },
    {
      key: 'productId',
      header: 'Sản phẩm',
      render: (item: any) => {
        const product = products.find(p => p.id === item.productId);
        return product ? product.name : 'Không xác định';
      }
    },
    { key: 'quantity', header: 'Số lượng', render: (item: any) => `${item.quantity} ${item.unit}` },
    {
      key: 'disposalType',
      header: 'Hình thức',
      render: (item: any) => {
        const labels = {
          scrap: 'Hủy bỏ',
          rework: 'Làm lại',
          downgrade: 'Hạ cấp',
          return: 'Trả lại'
        };
        return labels[item.disposalType as keyof typeof labels] || item.disposalType;
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
          completed: 'bg-blue-100 text-blue-800'
        };
        const labels = {
          pending: 'Chờ duyệt',
          approved: 'Đã duyệt',
          rejected: 'Từ chối',
          completed: 'Hoàn thành'
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.status as keyof typeof colors]}`}>{labels[item.status as keyof typeof labels]}</span>;
      }
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditDisposal(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteDisposal(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý chất lượng</h2>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'standards') handleAddStandard();
            else if (activeTab === 'defects') handleAddDefect();
            else if (activeTab === 'checks') handleAddCheck();
            else handleAddDisposal();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'standards' ? 'Thêm tiêu chuẩn' :
           activeTab === 'defects' ? 'Thêm định nghĩa lỗi' :
           activeTab === 'checks' ? 'Tạo phiếu kiểm tra' :
           'Tạo biên bản hủy'}
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-lg px-4 overflow-x-auto">
        <button onClick={() => setActiveTab('standards')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'standards' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Award className="w-4 h-4" />
          Tiêu chuẩn ({standards.length})
        </button>
        <button onClick={() => setActiveTab('defects')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'defects' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <List className="w-4 h-4" />
          Định nghĩa lỗi ({defectTypes.length})
        </button>
        <button onClick={() => setActiveTab('checks')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'checks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <ClipboardCheck className="w-4 h-4" />
          Phiếu kiểm tra ({checkRecords.length})
        </button>
        <button onClick={() => setActiveTab('disposals')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'disposals' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <AlertTriangle className="w-4 h-4" />
          Biên bản hủy ({disposals.length})
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {activeTab === 'standards' && <DataTable columns={standardColumns} data={standards} />}
        {activeTab === 'defects' && <DataTable columns={defectColumns} data={defectTypes} />}
        {activeTab === 'checks' && <DataTable columns={checkColumns} data={checkRecords} />}
        {activeTab === 'disposals' && <DataTable columns={disposalColumns} data={disposals} />}
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedItem ? 'Chỉnh sửa' : 'Thêm mới'} 
                {formType === 'standard' ? ' Tiêu chuẩn chất lượng' :
                 formType === 'defect' ? ' Định nghĩa lỗi' :
                 formType === 'check' ? ' Phiếu kiểm tra' :
                 ' Biên bản hủy sản phẩm'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* FORM TIÊU CHUẨN */}
              {formType === 'standard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã tiêu chuẩn</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên tiêu chuẩn *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nhập tên tiêu chuẩn" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm *</label>
                    <select value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn sản phẩm</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phương pháp lấy mẫu</label>
                    <select value={formData.samplingMethod} onChange={(e) => setFormData({...formData, samplingMethod: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="random">Ngẫu nhiên</option>
                      <option value="systematic">Hệ thống</option>
                      <option value="stratified">Phân tầng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cỡ mẫu</label>
                    <input type="number" value={formData.sampleSize} onChange={(e) => setFormData({...formData, sampleSize: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="active">Đang áp dụng</option>
                      <option value="inactive">Ngừng áp dụng</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu chí (mỗi dòng 1 tiêu chí)</label>
                    <textarea
                      value={formData.criteria.map((c: any) => `${c.name}: ${c.minValue}-${c.maxValue} ${c.unit || ''}`).join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n').filter(l => l.trim());
                        const newCriteria = lines.map((line, idx) => {
                          const parts = line.split(':');
                          const name = parts[0].trim();
                          const range = parts[1]?.trim() || '';
                          return {
                            id: `c${Date.now()}-${idx}`,
                            name: name,
                            type: 'numerical',
                            minValue: parseFloat(range.split('-')[0]) || 0,
                            maxValue: parseFloat(range.split('-')[1]?.split(' ')[0]) || 0,
                            unit: range.split(' ').pop() || ''
                          };
                        });
                        setFormData({...formData, criteria: newCriteria});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={5}
                      placeholder="Ví dụ:&#10;Hàm lượng Nito: 46-46.5 %&#10;Độ ẩm: 0-0.5 %"
                    />
                  </div>
                </div>
              )}

              {/* FORM ĐỊNH NGHĨA LỖI */}
              {formType === 'defect' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã lỗi</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên lỗi *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nhập tên lỗi" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phân loại</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="critical">Nghiêm trọng</option>
                      <option value="major">Chính</option>
                      <option value="minor">Phụ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ (1-5)</label>
                    <input type="number" value={formData.severity} onChange={(e) => setFormData({...formData, severity: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="1" max="5" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả *</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Mô tả chi tiết về lỗi" />
                  </div>
                </div>
              )}

              {/* FORM PHIẾU KIỂM TRA */}
              {formType === 'check' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã phiếu</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lệnh sản xuất *</label>
                    <select value={formData.orderId} onChange={(e) => setFormData({...formData, orderId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn lệnh</option>
                      {orders.map(o => <option key={o.id} value={o.id}>{o.code}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Công đoạn *</label>
                    <input type="text" value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nhập công đoạn kiểm tra" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Người kiểm tra</label>
                    <input type="text" value={formData.inspector} onChange={(e) => setFormData({...formData, inspector: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Tên người kiểm tra" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kiểm tra</label>
                    <input type="date" value={formData.checkDate} onChange={(e) => setFormData({...formData, checkDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cỡ mẫu</label>
                    <input type="number" value={formData.sampleSize} onChange={(e) => setFormData({...formData, sampleSize: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kết quả</label>
                    <select value={formData.result} onChange={(e) => setFormData({...formData, result: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="passed">Đạt</option>
                      <option value="failed">Không đạt</option>
                      <option value="conditional">Có điều kiện</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="draft">Nháp</option>
                      <option value="submitted">Đã nộp</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="rejected">Từ chối</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Ghi chú thêm..." />
                  </div>
                </div>
              )}

              {/* FORM BIÊN BẢN HỦY */}
              {formType === 'disposal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã biên bản</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lệnh sản xuất *</label>
                    <select value={formData.orderId} onChange={(e) => setFormData({...formData, orderId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn lệnh</option>
                      {orders.map(o => <option key={o.id} value={o.id}>{o.code}</option>)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức hủy</label>
                    <select value={formData.disposalType} onChange={(e) => setFormData({...formData, disposalType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="scrap">Hủy bỏ</option>
                      <option value="rework">Làm lại</option>
                      <option value="downgrade">Hạ cấp</option>
                      <option value="return">Trả lại</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại lỗi</label>
                    <select value={formData.defectTypeId || ''} onChange={(e) => setFormData({...formData, defectTypeId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn loại lỗi</option>
                      {defectTypes.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hủy</label>
                    <input type="date" value={formData.disposalDate} onChange={(e) => setFormData({...formData, disposalDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="pending">Chờ duyệt</option>
                      <option value="approved">Đã duyệt</option>
                      <option value="rejected">Từ chối</option>
                      <option value="completed">Hoàn thành</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lý do *</label>
                    <textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Lý do hủy sản phẩm" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Ghi chú thêm..." />
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
                    else if (formType === 'defect') saveDefect();
                    else if (formType === 'check') saveCheck();
                    else saveDisposal();
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