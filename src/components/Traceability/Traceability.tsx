import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { initialTraceabilityBatches, initialProducts, initialMaterials } from '../../data/mockData';
import { DataTable } from '../Common/DataTable';
import { 
  Eye,
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Users,
  Settings,
  AlertTriangle
} from 'lucide-react';

export const Traceability: React.FC = () => {
  const [batches, setBatches] = useLocalStorage('traceabilityBatches', initialTraceabilityBatches);
  const [products] = useLocalStorage('products', initialProducts);
  const [materials] = useLocalStorage('materials', initialMaterials);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // ===== CRUD FUNCTIONS =====
  const handleAddBatch = () => {
    setEditingBatch(null);
    setFormData({
      code: `LX${String(batches.length + 1).padStart(3, '0')}`,
      productId: '',
      productName: '',
      quantity: 0,
      unit: 'tấn',
      productionDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      batchNumber: `BATCH-${String(batches.length + 1).padStart(4, '0')}`,
      status: 'in_production',
      materials: [],
      stages: [],
      qcResults: [],
      shippingInfo: null,
      newMaterialId: '',
      newMaterialQuantity: '',
      newSupplier: '',
      newStageName: '',
      newOperator: '',
      newMachine: '',
      newStageNotes: '',
      newQCStage: '',
      newQCResult: '',
      newQCInspector: '',
      newQCDefects: '',
      newQCNotes: '',
      shippingOrderNumber: '',
      shippingCustomer: '',
      shippingDestination: '',
      shippingDate: '',
      shippingTracking: ''
    });
    setShowForm(true);
  };

  const handleEditBatch = (batch: any) => {
    setEditingBatch(batch);
    setFormData({
      ...batch,
      productionDate: batch.productionDate.split('T')[0],
      expiryDate: batch.expiryDate ? batch.expiryDate.split('T')[0] : '',
      newMaterialId: '',
      newMaterialQuantity: '',
      newSupplier: '',
      newStageName: '',
      newOperator: '',
      newMachine: '',
      newStageNotes: '',
      newQCStage: '',
      newQCResult: '',
      newQCInspector: '',
      newQCDefects: '',
      newQCNotes: '',
      shippingOrderNumber: batch.shippingInfo?.orderNumber || '',
      shippingCustomer: batch.shippingInfo?.customer || '',
      shippingDestination: batch.shippingInfo?.destination || '',
      shippingDate: batch.shippingInfo?.shippingDate?.split('T')[0] || '',
      shippingTracking: batch.shippingInfo?.trackingNumber || ''
    });
    setShowForm(true);
  };

  const handleDeleteBatch = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa lô hàng này?')) {
      setBatches(batches.filter(b => b.id !== id));
    }
  };

  const saveBatch = () => {
    if (!formData.productId || !formData.quantity) {
      alert('Vui lòng chọn sản phẩm và nhập số lượng!');
      return;
    }

    const product = products.find(p => p.id === formData.productId);
    const batchData = {
      ...formData,
      productName: product ? product.name : '',
      materials: formData.materials || [],
      stages: formData.stages || [],
      qcResults: formData.qcResults || [],
      shippingInfo: formData.shippingInfo || null
    };

    // Xóa các field tạm
    delete batchData.newMaterialId;
    delete batchData.newMaterialQuantity;
    delete batchData.newSupplier;
    delete batchData.newStageName;
    delete batchData.newOperator;
    delete batchData.newMachine;
    delete batchData.newStageNotes;
    delete batchData.newQCStage;
    delete batchData.newQCResult;
    delete batchData.newQCInspector;
    delete batchData.newQCDefects;
    delete batchData.newQCNotes;
    delete batchData.shippingOrderNumber;
    delete batchData.shippingCustomer;
    delete batchData.shippingDestination;
    delete batchData.shippingDate;
    delete batchData.shippingTracking;

    if (editingBatch) {
      setBatches(batches.map(b => b.id === editingBatch.id ? { ...batchData, id: editingBatch.id, updatedAt: new Date().toISOString() } : b));
    } else {
      setBatches([...batches, { ...batchData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setEditingBatch(null);
  };

  // ===== THÊM MATERIAL VÀO LÔ =====
  const addMaterialToBatch = () => {
    if (!formData.newMaterialId || !formData.newMaterialQuantity) {
      alert('Vui lòng chọn nguyên liệu và nhập số lượng!');
      return;
    }
    const material = materials.find(m => m.id === formData.newMaterialId);
    const newMaterial = {
      materialId: material?.id || '',
      materialName: material?.name || '',
      batchNumber: `MAT-${String((formData.materials?.length || 0) + 1).padStart(4, '0')}`,
      supplier: formData.newSupplier || '',
      quantity: parseFloat(formData.newMaterialQuantity),
      unit: material?.unit || 'tấn',
      receiptDate: new Date().toISOString(),
      qcStatus: 'pending'
    };
    setFormData({
      ...formData,
      materials: [...(formData.materials || []), newMaterial],
      newMaterialId: '',
      newMaterialQuantity: '',
      newSupplier: ''
    });
  };

  const removeMaterialFromBatch = (index: number) => {
    const newMaterials = formData.materials.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, materials: newMaterials });
  };

  // ===== THÊM STAGE VÀO LÔ =====
  const addStageToBatch = () => {
    if (!formData.newStageName) {
      alert('Vui lòng nhập tên công đoạn!');
      return;
    }
    const newStage = {
      stageName: formData.newStageName,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      operator: formData.newOperator || '',
      machine: formData.newMachine || '',
      status: 'pending',
      notes: formData.newStageNotes || ''
    };
    setFormData({
      ...formData,
      stages: [...(formData.stages || []), newStage],
      newStageName: '',
      newOperator: '',
      newMachine: '',
      newStageNotes: ''
    });
  };

  const removeStageFromBatch = (index: number) => {
    const newStages = formData.stages.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, stages: newStages });
  };

  // ===== THÊM QC RESULT =====
  const addQCResult = () => {
    if (!formData.newQCStage || !formData.newQCResult) {
      alert('Vui lòng nhập công đoạn và kết quả!');
      return;
    }
    const newQC = {
      stage: formData.newQCStage,
      checkTime: new Date().toISOString(),
      inspector: formData.newQCInspector || '',
      result: formData.newQCResult,
      defects: formData.newQCDefects ? formData.newQCDefects.split(',').map((d: string) => d.trim()) : [],
      notes: formData.newQCNotes || ''
    };
    setFormData({
      ...formData,
      qcResults: [...(formData.qcResults || []), newQC],
      newQCStage: '',
      newQCResult: '',
      newQCInspector: '',
      newQCDefects: '',
      newQCNotes: ''
    });
  };

  const removeQCResult = (index: number) => {
    const newQCResults = formData.qcResults.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, qcResults: newQCResults });
  };

  // ===== UPDATE SHIPPING INFO =====
  const updateShippingInfo = () => {
    if (!formData.shippingOrderNumber) {
      alert('Vui lòng nhập số đơn hàng!');
      return;
    }
    setFormData({
      ...formData,
      shippingInfo: {
        orderNumber: formData.shippingOrderNumber,
        customer: formData.shippingCustomer || '',
        shippingDate: formData.shippingDate || new Date().toISOString().split('T')[0],
        quantity: formData.quantity,
        unit: formData.unit,
        destination: formData.shippingDestination || '',
        status: 'pending',
        trackingNumber: formData.shippingTracking || ''
      }
    });
    alert('Đã cập nhật thông tin xuất kho!');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      in_production: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      qc_passed: 'bg-green-100 text-green-800',
      qc_failed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      in_production: 'Đang sản xuất',
      completed: 'Hoàn thành',
      shipped: 'Đã xuất kho',
      qc_passed: 'Đạt QC',
      qc_failed: 'Không đạt QC'
    };
    return labels[status as keyof typeof labels] || status;
  };

  // ===== COLUMNS =====
  const columns = [
    { key: 'code', header: 'Mã lô' },
    { key: 'productName', header: 'Sản phẩm' },
    { key: 'batchNumber', header: 'Số lô' },
    { key: 'quantity', header: 'Số lượng', render: (item: any) => `${item.quantity} ${item.unit}` },
    {
      key: 'productionDate',
      header: 'Ngày sản xuất',
      render: (item: any) => new Date(item.productionDate).toLocaleDateString('vi-VN')
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
          {getStatusLabel(item.status)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedBatch(item);
              setShowDetail(true);
            }}
            className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEditBatch(item)}
            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
            title="Sửa"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteBatch(item.id)}
            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Stats
  const totalBatches = batches.length;
  const completedBatches = batches.filter(b => b.status === 'completed' || b.status === 'shipped').length;
  const inProductionBatches = batches.filter(b => b.status === 'in_production').length;
  const qcFailedBatches = batches.filter(b => b.status === 'qc_failed').length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Truy xuất nguồn gốc</h2>
        </div>
        <button
          onClick={handleAddBatch}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Tạo lô mới
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <DataTable columns={columns} data={batches} />
      </div>

      {/* DETAIL MODAL */}
      {showDetail && selectedBatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Chi tiết lô hàng: {selectedBatch.code}
              </h3>
              <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Sản phẩm</p>
                  <p className="font-medium">{selectedBatch.productName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Số lô</p>
                  <p className="font-medium">{selectedBatch.batchNumber}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Số lượng</p>
                  <p className="font-medium">{selectedBatch.quantity} {selectedBatch.unit}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Ngày sản xuất</p>
                  <p className="font-medium">{new Date(selectedBatch.productionDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Hạn sử dụng</p>
                  <p className="font-medium">{selectedBatch.expiryDate ? new Date(selectedBatch.expiryDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Trạng thái</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBatch.status)}`}>
                    {getStatusLabel(selectedBatch.status)}
                  </span>
                </div>
              </div>

              {/* Nguyên vật liệu */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  Nguyên vật liệu đầu vào
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Tên NVL</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Số lô</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nhà cung cấp</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Số lượng</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">QC</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedBatch.materials.map((m: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 text-sm">{m.materialName}</td>
                          <td className="px-3 py-2 text-sm">{m.batchNumber}</td>
                          <td className="px-3 py-2 text-sm">{m.supplier}</td>
                          <td className="px-3 py-2 text-sm">{m.quantity} {m.unit}</td>
                          <td className="px-3 py-2 text-sm">
                            {m.qcStatus === 'passed' ? (
                              <span className="text-green-600">✅ Đạt</span>
                            ) : m.qcStatus === 'failed' ? (
                              <span className="text-red-600">❌ Không đạt</span>
                            ) : (
                              <span className="text-yellow-600">⏳ Chờ</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quy trình sản xuất */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Quy trình sản xuất
                </h4>
                <div className="space-y-2">
                  {selectedBatch.stages.map((stage: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium w-8">{idx + 1}</span>
                      <span className="text-sm flex-1">{stage.stageName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(stage.startTime).toLocaleTimeString('vi-VN')} - {new Date(stage.endTime).toLocaleTimeString('vi-VN')}
                      </span>
                      <span className="text-xs">{stage.operator}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                        stage.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {stage.status === 'completed' ? '✅ Hoàn thành' :
                         stage.status === 'in_progress' ? '⏳ Đang thực hiện' :
                         '⏸ Chờ'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kết quả QC */}
              {selectedBatch.qcResults && selectedBatch.qcResults.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    Kết quả kiểm tra chất lượng
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Công đoạn</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Người kiểm</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Kết quả</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedBatch.qcResults.map((qc: any, idx: number) => (
                          <tr key={idx}>
                            <td className="px-3 py-2 text-sm">{qc.stage}</td>
                            <td className="px-3 py-2 text-sm">{qc.inspector}</td>
                            <td className="px-3 py-2 text-sm">
                              {qc.result === 'passed' ? (
                                <span className="text-green-600">✅ Đạt</span>
                              ) : qc.result === 'failed' ? (
                                <span className="text-red-600">❌ Không đạt</span>
                              ) : (
                                <span className="text-yellow-600">⚠️ Có điều kiện</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-sm">{qc.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Thông tin xuất kho */}
              {selectedBatch.shippingInfo && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-600" />
                    Thông tin xuất kho
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Đơn hàng</p>
                      <p className="font-medium">{selectedBatch.shippingInfo.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Khách hàng</p>
                      <p className="font-medium">{selectedBatch.shippingInfo.customer}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Điểm đến</p>
                      <p className="font-medium">{selectedBatch.shippingInfo.destination}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Số lượng</p>
                      <p className="font-medium">{selectedBatch.shippingInfo.quantity} {selectedBatch.shippingInfo.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Trạng thái</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedBatch.shippingInfo.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        selectedBatch.shippingInfo.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedBatch.shippingInfo.status === 'shipped' ? 'Đã xuất' :
                         selectedBatch.shippingInfo.status === 'delivered' ? 'Đã giao' :
                         'Chờ xuất'}
                      </span>
                    </div>
                    {selectedBatch.shippingInfo.trackingNumber && (
                      <div>
                        <p className="text-xs text-gray-500">Mã vận đơn</p>
                        <p className="font-medium">{selectedBatch.shippingInfo.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {editingBatch ? 'Chỉnh sửa lô hàng' : 'Tạo lô hàng mới'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã lô</label>
                  <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm *</label>
                  <select
                    value={formData.productId}
                    onChange={(e) => {
                      const product = products.find(p => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        productId: e.target.value,
                        productName: product?.name || ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lô</label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="tấn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="in_production">Đang sản xuất</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="qc_passed">Đạt QC</option>
                    <option value="qc_failed">Không đạt QC</option>
                    <option value="shipped">Đã xuất kho</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sản xuất</label>
                  <input
                    type="date"
                    value={formData.productionDate}
                    onChange={(e) => setFormData({...formData, productionDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hạn sử dụng</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Nguyên vật liệu */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  Nguyên vật liệu đầu vào
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nguyên liệu</label>
                    <select
                      value={formData.newMaterialId || ''}
                      onChange={(e) => setFormData({...formData, newMaterialId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn NVL</option>
                      {materials.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
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
                    <label className="block text-sm text-gray-600 mb-1">Nhà cung cấp</label>
                    <input
                      type="text"
                      value={formData.newSupplier || ''}
                      onChange={(e) => setFormData({...formData, newSupplier: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tên nhà cung cấp"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addMaterialToBatch}
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
                      <span className="text-sm text-gray-500">{m.supplier}</span>
                      <button onClick={() => removeMaterialFromBatch(i)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Công đoạn sản xuất */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-green-600" />
                  Công đoạn sản xuất
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tên công đoạn</label>
                    <input
                      type="text"
                      value={formData.newStageName || ''}
                      onChange={(e) => setFormData({...formData, newStageName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: Pha chế"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Người thực hiện</label>
                    <input
                      type="text"
                      value={formData.newOperator || ''}
                      onChange={(e) => setFormData({...formData, newOperator: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tên người thực hiện"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Máy móc</label>
                    <input
                      type="text"
                      value={formData.newMachine || ''}
                      onChange={(e) => setFormData({...formData, newMachine: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tên máy"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addStageToBatch}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {formData.stages?.map((s: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{i + 1}</span>
                      <span className="text-sm flex-1 ml-2">{s.stageName}</span>
                      <span className="text-sm text-gray-500">{s.operator}</span>
                      <span className="text-sm text-gray-500">{s.machine}</span>
                      <button onClick={() => removeStageFromBatch(i)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* QC Results */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  Kết quả kiểm tra QC
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Công đoạn</label>
                    <input
                      type="text"
                      value={formData.newQCStage || ''}
                      onChange={(e) => setFormData({...formData, newQCStage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tên công đoạn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Kết quả</label>
                    <select
                      value={formData.newQCResult || ''}
                      onChange={(e) => setFormData({...formData, newQCResult: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn kết quả</option>
                      <option value="passed">✅ Đạt</option>
                      <option value="failed">❌ Không đạt</option>
                      <option value="conditional">⚠️ Có điều kiện</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Người kiểm</label>
                    <input
                      type="text"
                      value={formData.newQCInspector || ''}
                      onChange={(e) => setFormData({...formData, newQCInspector: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tên người kiểm"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addQCResult}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {formData.qcResults?.map((qc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{qc.stage}</span>
                      <span className={`text-sm font-medium ${
                        qc.result === 'passed' ? 'text-green-600' :
                        qc.result === 'failed' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {qc.result === 'passed' ? '✅ Đạt' :
                         qc.result === 'failed' ? '❌ Không đạt' :
                         '⚠️ Có điều kiện'}
                      </span>
                      <span className="text-sm text-gray-500">{qc.inspector}</span>
                      <button onClick={() => removeQCResult(i)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thông tin xuất kho */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-600" />
                  Thông tin xuất kho
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Số đơn hàng *</label>
                    <input
                      type="text"
                      value={formData.shippingOrderNumber || ''}
                      onChange={(e) => setFormData({...formData, shippingOrderNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: DH2026-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Khách hàng</label>
                    <input
                      type="text"
                      value={formData.shippingCustomer || ''}
                      onChange={(e) => setFormData({...formData, shippingCustomer: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tên khách hàng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Điểm đến</label>
                    <input
                      type="text"
                      value={formData.shippingDestination || ''}
                      onChange={(e) => setFormData({...formData, shippingDestination: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Địa điểm giao hàng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Ngày xuất</label>
                    <input
                      type="date"
                      value={formData.shippingDate || ''}
                      onChange={(e) => setFormData({...formData, shippingDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mã vận đơn</label>
                    <input
                      type="text"
                      value={formData.shippingTracking || ''}
                      onChange={(e) => setFormData({...formData, shippingTracking: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Mã vận đơn"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={updateShippingInfo}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>
                {formData.shippingInfo && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-600">
                      ✅ Đã cập nhật thông tin xuất kho
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Hủy
                </button>
                <button onClick={saveBatch} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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