import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { initialProductionPlans, initialProducts, initialMaterials } from '../../data/mockData';
import { DataTable } from '../Common/DataTable';
import { CheckCircle, XCircle, FileEdit, TrendingUp, Plus, Trash2, Save, X } from 'lucide-react';
import type { MaterialAllocation, ProductionPlan as ProductionPlanType } from '../../types';

export const ProductionPlan: React.FC = () => {
  const [plans, setPlans] = useLocalStorage('productionPlans', initialProductionPlans);
  const [products] = useLocalStorage('products', initialProducts);
  const [materials] = useLocalStorage('materials', initialMaterials);
  
  // State cho form
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ProductionPlanType | null>(null);
  const [formData, setFormData] = useState<any>({
    code: '',
    productId: '',
    quantity: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    shift: 'morning',
    line: '',
    team: '',
    materialsAllocated: [] as MaterialAllocation[],
  });

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      approved: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // const getStatusLabel = (status: string) => {
  //   const labels = {
  //     draft: 'Nháp',
  //     approved: 'Đã duyệt',
  //     in_progress: 'Đang thực hiện',
  //     completed: 'Hoàn thành',
  //     cancelled: 'Đã hủy'
  //   };
  //   return labels[status as keyof typeof labels] || status;
  // };

  // Mở form thêm mới
  const handleAdd = () => {
    setEditingPlan(null);
    setFormData({
      id: Date.now().toString(),
      code: `KH${String(plans.length + 1).padStart(3, '0')}`,
      productId: '',
      quantity: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      shift: 'morning',
      line: '',
      team: '',
      materialsAllocated: [],
      createdAt: new Date().toISOString()
    });
    setShowForm(true);
  };

  // Mở form sửa
  const handleEdit = (plan: ProductionPlanType) => {
    setEditingPlan(plan);
    setFormData({
      ...plan,
      startDate: plan.startDate.split('T')[0],
      endDate: plan.endDate.split('T')[0],
    });
    setShowForm(true);
  };

  // Xóa kế hoạch
  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa kế hoạch này?')) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  // Cập nhật trạng thái
  const handleStatusChange = (id: string, newStatus: string) => {
    setPlans(plans.map(p => 
      p.id === id ? { ...p, status: newStatus as any } : p
    ));
  };

  // Lưu kế hoạch
  const savePlan = () => {
    if (!formData.productId || !formData.quantity || formData.quantity <= 0) {
      alert('Vui lòng chọn sản phẩm và nhập số lượng hợp lệ!');
      return;
    }

    // Tự động phân bổ nguyên vật liệu từ BOM của sản phẩm
    const product = products.find(p => p.id === formData.productId);
    if (product) {
      const materialsAllocated = product.bom.map(bom => {
        const material = materials.find(m => m.id === bom.materialId);
        const required = (formData.quantity / 1) * bom.quantity; // Giả định 1 tấn sản phẩm cần bom.quantity NVL
        return {
          materialId: bom.materialId,
          required: Math.round(required * 100) / 100,
          allocated: 0,
          unit: material?.unit || '',
        };
      });
      formData.materialsAllocated = materialsAllocated;
    }

    if (editingPlan) {
      // Cập nhật
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...formData, id: editingPlan.id } : p));
    } else {
      // Thêm mới
      setPlans([...plans, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setEditingPlan(null);
  };

  // Cập nhật phân bổ NVL
  const updateAllocation = (index: number, allocated: number) => {
    const newAllocations = [...formData.materialsAllocated];
    newAllocations[index].allocated = allocated;
    setFormData({ ...formData, materialsAllocated: newAllocations });
  };

  const columns = [
    { key: 'code', header: 'Mã kế hoạch' },
    {
      key: 'productId',
      header: 'Sản phẩm',
      render: (item: any) => {
        const product = products.find(p => p.id === item.productId);
        return product ? product.name : 'Không xác định';
      }
    },
    { key: 'quantity', header: 'Số lượng', render: (item: any) => `${item.quantity} tấn` },
    {
      key: 'startDate',
      header: 'Ngày bắt đầu',
      render: (item: any) => new Date(item.startDate).toLocaleDateString('vi-VN')
    },
    {
      key: 'endDate',
      header: 'Ngày kết thúc',
      render: (item: any) => new Date(item.endDate).toLocaleDateString('vi-VN')
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => (
        <select
          value={item.status}
          onChange={(e) => handleStatusChange(item.id, e.target.value)}
          className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(item.status)}`}
        >
          <option value="draft">Nháp</option>
          <option value="approved">Đã duyệt</option>
          <option value="in_progress">Đang thực hiện</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      )
    },
    { key: 'team', header: 'Tổ đội' },
    { key: 'line', header: 'Dây chuyền' },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(item)}
            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
          >
            <FileEdit className="w-4 h-4" />
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

  // Tính toán thống kê
  const totalPlans = plans.length;
  const completedPlans = plans.filter(p => p.status === 'completed').length;
  const inProgressPlans = plans.filter(p => p.status === 'in_progress' || p.status === 'approved').length;
  const draftPlans = plans.filter(p => p.status === 'draft').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kế hoạch sản xuất</h2>
          <p className="text-gray-600">Lập và điều chỉnh kế hoạch sản xuất chi tiết</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Tạo kế hoạch
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Tổng kế hoạch</p>
          <p className="text-2xl font-bold text-gray-800">{totalPlans}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Đang thực hiện</p>
          <p className="text-2xl font-bold text-yellow-600">{inProgressPlans}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Hoàn thành</p>
          <p className="text-2xl font-bold text-green-600">{completedPlans}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-500 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Nháp</p>
          <p className="text-2xl font-bold text-gray-600">{draftPlans}</p>
        </div>
      </div>

      {/* Material Allocation Check */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Kiểm tra đáp ứng nguyên vật liệu
        </h3>
        <div className="space-y-2">
          {plans.filter(p => p.status !== 'completed' && p.status !== 'cancelled').map(plan => {
            const allAllocated = plan.materialsAllocated.every(m => m.allocated >= m.required);
            const product = products.find(p => p.id === plan.productId);
            return (
              <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm text-gray-700">{plan.code}</span>
                  <span className="text-sm text-gray-500">-</span>
                  <span className="text-sm text-gray-600">{product?.name || 'Không xác định'}</span>
                </div>
                <div className="flex items-center gap-3">
                  {allAllocated ? (
                    <span className="text-sm text-green-600 flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4" /> Đủ NVL
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full">
                      <XCircle className="w-4 h-4" /> Thiếu NVL
                    </span>
                  )}
                  <button 
                    onClick={() => handleEdit(plan)}
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                  >
                    <FileEdit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {plans.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length === 0 && (
            <p className="text-gray-500 text-center py-4">Không có kế hoạch đang thực hiện</p>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <DataTable columns={columns} data={plans} />
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {editingPlan ? 'Chỉnh sửa' : 'Tạo mới'} Kế hoạch sản xuất
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã kế hoạch</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm *</label>
                  <select
                    value={formData.productId}
                    onChange={(e) => {
                      setFormData({...formData, productId: e.target.value});
                      // Tự động thêm BOM khi chọn sản phẩm
                      const product = products.find(p => p.id === e.target.value);
                      if (product) {
                        const materialsAllocated = product.bom.map(bom => {
                          const material = materials.find(m => m.id === bom.materialId);
                          return {
                            materialId: bom.materialId,
                            required: 0,
                            allocated: 0,
                            unit: material?.unit || '',
                          };
                        });
                        setFormData((prev: any) => ({ ...prev, materialsAllocated }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng (tấn) *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => {
                      const quantity = parseFloat(e.target.value);
                      setFormData({...formData, quantity});
                      // Cập nhật required quantity cho BOM
                      const product = products.find(p => p.id === formData.productId);
                      if (product && quantity > 0) {
                        const newAllocations = formData.materialsAllocated.map((item: any, index: number) => {
                          const bom = product.bom[index];
                          return {
                            ...item,
                            required: Math.round((quantity / 1) * bom.quantity * 100) / 100,
                          };
                        });
                        setFormData((prev: any) => ({ ...prev, materialsAllocated: newAllocations }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Nháp</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="in_progress">Đang thực hiện</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ca làm việc</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({...formData, shift: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="morning">Ca sáng (06:00 - 14:00)</option>
                    <option value="afternoon">Ca chiều (14:00 - 22:00)</option>
                    <option value="night">Ca đêm (22:00 - 06:00)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tổ đội</label>
                  <select
                    value={formData.team}
                    onChange={(e) => setFormData({...formData, team: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn tổ đội</option>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(i => (
                      <option key={i} value={`Tổ ${i}`}>Tổ {i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dây chuyền</label>
                  <input
                    type="text"
                    value={formData.line}
                    onChange={(e) => setFormData({...formData, line: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Dây chuyền 1"
                  />
                </div>
              </div>

              {/* Material Allocation */}
              {formData.materialsAllocated.length > 0 && (
                <div className="mt-6 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Phân bổ nguyên vật liệu</h4>
                  <div className="space-y-2">
                    {formData.materialsAllocated.map((item: any, index: number) => {
                      const material = materials.find(m => m.id === item.materialId);
                      return material ? (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{material.name}</span>
                          <span className="text-sm">Cần: {item.required} {item.unit}</span>
                          <div>
                            <label className="text-xs text-gray-500">Đã phân bổ</label>
                            <input
                              type="number"
                              value={item.allocated}
                              onChange={(e) => updateAllocation(index, parseFloat(e.target.value))}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <span className={`text-sm font-medium ${item.allocated >= item.required ? 'text-green-600' : 'text-red-600'}`}>
                            {item.allocated >= item.required ? '✅ Đủ' : '❌ Thiếu'}
                          </span>
                        </div>
                      ) : null;
                    })}
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
                  onClick={savePlan}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Lưu kế hoạch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};