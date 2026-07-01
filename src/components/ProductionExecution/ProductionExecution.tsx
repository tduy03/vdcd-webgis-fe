import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { 
  initialProductionOrders, 
  initialWorkAssignments,
  initialEmployees,
  initialWorkShiftsReal,
  initialQualityControls,
  initialProducts,
  initialMaterials,
  initialMachines,
  initialMaterialRequests,
  initialTransfers,
  initialOEEIndicators,
  initialQualityCheckRequests,
  initialMaterialDisposals,
  initialProductionStatistics
} from '../../data/mockData';
import { DataTable } from '../Common/DataTable';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText, 
  Users, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  FileCheck,
  AlertTriangle,
  UserCheck,
  ClipboardList,
  Package,
  TrendingUp,
  ArrowRight,
  CheckSquare,
  BarChart,
  RefreshCw,
  Truck,
  FileBarChart,
  FlaskConical
} from 'lucide-react';

export const ProductionExecution: React.FC = () => {
  // ===== DỮ LIỆU =====
  const [orders, setOrders] = useLocalStorage('productionOrders', initialProductionOrders);
  const [assignments, setAssignments] = useLocalStorage('workAssignments', initialWorkAssignments);
  const [employees] = useLocalStorage('employees', initialEmployees);
  const [shifts] = useLocalStorage('workShifts', initialWorkShiftsReal);
  const [qualityControls] = useLocalStorage('qualityControls', initialQualityControls);
  const [products] = useLocalStorage('products', initialProducts);
  const [materials] = useLocalStorage('materials', initialMaterials);
  const [machines] = useLocalStorage('machines', initialMachines);
  
  // ===== MODULE 3.2: GIÁM SÁT & ĐO LƯỜNG =====
  const [materialRequests, setMaterialRequests] = useLocalStorage('materialRequests', initialMaterialRequests);
  const [transfers, setTransfers] = useLocalStorage('transfers', initialTransfers);
  const [oeeIndicators, setOeeIndicators] = useLocalStorage('oeeIndicators', initialOEEIndicators);
  const [qualityChecks, setQualityChecks] = useLocalStorage('qualityChecks', initialQualityCheckRequests);
  const [disposals, setDisposals] = useLocalStorage('disposals', initialMaterialDisposals);
  const [statistics] = useLocalStorage('statistics', initialProductionStatistics);
  
  // ===== STATE =====
  const [activeTab, setActiveTab] = useState<'orders' | 'assignments' | 'monitoring' | 'materials' | 'oee'>('orders');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [formType, setFormType] = useState<'material' | 'transfer' | 'oee' | 'order'>('order');

  // ===== UTILITY FUNCTIONS =====
  const getOrderStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      approved: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getOrderStatusLabel = (status: string) => {
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      in_progress: 'Đang thực hiện',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-600 bg-red-50',
      medium: 'text-yellow-600 bg-yellow-50',
      low: 'text-blue-600 bg-blue-50'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: 'Cao',
      medium: 'Trung bình',
      low: 'Thấp'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  // ===== CRUD: LỆNH SẢN XUẤT =====
  const handleAddOrder = () => {
    setFormType('order');
    setSelectedItem(null);
    setFormData({
      code: `LSX${String(orders.length + 1).padStart(3, '0')}`,
      productId: '',
      quantity: 0,
      unit: 'tấn',
      priority: 'medium',
      status: 'pending',
      source: 'manual',
      assignedTeam: '',
      assignedLine: '',
      supervisor: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditOrder = (order: any) => {
    setFormType('order');
    setSelectedItem(order);
    setFormData({
      ...order,
      startDate: order.startDate.split('T')[0],
      endDate: order.endDate.split('T')[0],
    });
    setShowForm(true);
  };

  const saveOrder = () => {
    if (!formData.productId || !formData.quantity) {
      alert('Vui lòng chọn sản phẩm và nhập số lượng!');
      return;
    }

    if (selectedItem) {
      setOrders(orders.map(o => o.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : o));
    } else {
      setOrders([...orders, { 
        ...formData, 
        id: Date.now().toString(), 
        orderDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa lệnh sản xuất này?')) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(orders.map(o => 
      o.id === id ? { ...o, status: status as any, updatedAt: new Date().toISOString() } : o
    ));
  };

  const updateAssignmentStatus = (id: string, status: string, completedQty?: number) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { 
        ...a, 
        status: status as any, 
        completedQuantity: completedQty || a.completedQuantity,
        updatedAt: new Date().toISOString() 
      } : a
    ));
  };

  // ===== CRUD: YÊU CẦU VẬT TƯ =====
  const handleAddMaterialRequest = () => {
    setFormType('material');
    setSelectedItem(null);
    setFormData({
      code: `VT${String(materialRequests.length + 1).padStart(3, '0')}`,
      orderId: '',
      materialId: '',
      quantity: 0,
      unit: 'tấn',
      purpose: '',
      status: 'pending',
      requestedBy: '',
      requestDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditMaterialRequest = (item: any) => {
    setFormType('material');
    setSelectedItem(item);
    setFormData({
      ...item,
      requestDate: item.requestDate.split('T')[0],
    });
    setShowForm(true);
  };

  const saveMaterialRequest = () => {
    if (!formData.materialId || !formData.quantity || !formData.orderId) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (selectedItem) {
      setMaterialRequests(materialRequests.map(m => 
        m.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : m
      ));
    } else {
      setMaterialRequests([...materialRequests, { 
        ...formData, 
        id: Date.now().toString(), 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteMaterialRequest = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa yêu cầu vật tư này?')) {
      setMaterialRequests(materialRequests.filter(m => m.id !== id));
    }
  };

  const updateMaterialRequest = (id: string, status: string) => {
    setMaterialRequests(materialRequests.map(req => 
      req.id === id ? { ...req, status: status as any, updatedAt: new Date().toISOString() } : req
    ));
  };

  // ===== CRUD: LUÂN CHUYỂN =====
  const handleAddTransfer = () => {
    setFormType('transfer');
    setSelectedItem(null);
    setFormData({
      code: `BC${String(transfers.length + 1).padStart(3, '0')}`,
      fromOrderId: '',
      toOrderId: '',
      productId: '',
      quantity: 0,
      unit: 'tấn',
      fromStage: '',
      toStage: '',
      fromTeam: '',
      toTeam: '',
      transferDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      note: ''
    });
    setShowForm(true);
  };

  const handleEditTransfer = (item: any) => {
    setFormType('transfer');
    setSelectedItem(item);
    setFormData({
      ...item,
      transferDate: item.transferDate.split('T')[0],
    });
    setShowForm(true);
  };

  const saveTransfer = () => {
    if (!formData.fromOrderId || !formData.toOrderId || !formData.quantity) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (selectedItem) {
      setTransfers(transfers.map(t => 
        t.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : t
      ));
    } else {
      setTransfers([...transfers, { 
        ...formData, 
        id: Date.now().toString(), 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteTransfer = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bàn giao này?')) {
      setTransfers(transfers.filter(t => t.id !== id));
    }
  };

  const updateTransferStatus = (id: string, status: string) => {
    setTransfers(transfers.map(t => 
      t.id === id ? { ...t, status: status as any, updatedAt: new Date().toISOString() } : t
    ));
  };

  // ===== CRUD: OEE =====
  const handleAddOEE = () => {
    setFormType('oee');
    setSelectedItem(null);
    setFormData({
      machineId: '',
      date: new Date().toISOString().split('T')[0],
      shift: 'morning',
      availability: 0,
      performance: 0,
      quality: 0,
      oee: 0,
      totalTime: 480,
      operatingTime: 0,
      downtime: 0,
      defects: 0
    });
    setShowForm(true);
  };

  const handleEditOEE = (item: any) => {
    setFormType('oee');
    setSelectedItem(item);
    setFormData({
      ...item,
      date: item.date.split('T')[0],
    });
    setShowForm(true);
  };

  const saveOEE = () => {
    if (!formData.machineId) {
      alert('Vui lòng chọn máy móc!');
      return;
    }

    // Tự động tính OEE
    const availability = formData.availability || 0;
    const performance = formData.performance || 0;
    const quality = formData.quality || 0;
    const oee = Math.round((availability * performance * quality) / 100);

    const dataToSave = {
      ...formData,
      oee,
      operatingTime: formData.totalTime - formData.downtime
    };

    if (selectedItem) {
      setOeeIndicators(oeeIndicators.map(o => 
        o.id === selectedItem.id ? { ...dataToSave, id: selectedItem.id, updatedAt: new Date().toISOString() } : o
      ));
    } else {
      setOeeIndicators([...oeeIndicators, { 
        ...dataToSave, 
        id: Date.now().toString(), 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteOEE = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa chỉ số OEE này?')) {
      setOeeIndicators(oeeIndicators.filter(o => o.id !== id));
    }
  };

  // ===== COLUMNS: LỆNH SẢN XUẤT =====
  const orderColumns = [
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
    {
      key: 'priority',
      header: 'Ưu tiên',
      render: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
          {getPriorityLabel(item.priority)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => (
        <select
          value={item.status}
          onChange={(e) => updateOrderStatus(item.id, e.target.value)}
          className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getOrderStatusColor(item.status)}`}
        >
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="in_progress">Đang thực hiện</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      )
    },
    { key: 'assignedTeam', header: 'Tổ đội' },
    { key: 'supervisor', header: 'Giám sát' },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditOrder(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteOrder(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={() => { setSelectedItem(item); setActiveTab('assignments'); }} className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // ===== COLUMNS: PHÂN CÔNG =====
  const assignmentColumns = [
    { key: 'stage', header: 'Công đoạn' },
    { key: 'stageOrder', header: 'Thứ tự' },
    { key: 'assignedTo', header: 'Người thực hiện' },
    { key: 'team', header: 'Tổ đội' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => {
        const colors = {
          pending: 'bg-gray-100 text-gray-800',
          in_progress: 'bg-yellow-100 text-yellow-800',
          completed: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800'
        };
        const labels = {
          pending: 'Chờ thực hiện',
          in_progress: 'Đang thực hiện',
          completed: 'Hoàn thành',
          rejected: 'Từ chối'
        };
        return (
          <select
            value={item.status}
            onChange={(e) => updateAssignmentStatus(item.id, e.target.value)}
            className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${colors[item.status as keyof typeof colors]}`}
          >
            <option value="pending">Chờ thực hiện</option>
            <option value="in_progress">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
            <option value="rejected">Từ chối</option>
          </select>
        );
      }
    },
    {
      key: 'completedQuantity',
      header: 'SL hoàn thành',
      render: (item: any) => `${item.completedQuantity} tấn`
    },
    {
      key: 'qualityCheck',
      header: 'Kiểm tra chất lượng',
      render: (item: any) => {
        const colors = {
          pending: 'bg-gray-100 text-gray-800',
          passed: 'bg-green-100 text-green-800',
          failed: 'bg-red-100 text-red-800'
        };
        const labels = {
          pending: 'Chờ kiểm tra',
          passed: 'Đạt',
          failed: 'Không đạt'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.qualityCheck as keyof typeof colors]}`}>
            {labels[item.qualityCheck as keyof typeof labels]}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Hướng dẫn',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => alert(`SOP: ${item.sop || 'Chưa có'}\nBOM: ${item.bom || 'Chưa có'}`)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors">
            <FileText className="w-4 h-4" />
          </button>
          {item.instruction && (
            <button onClick={() => alert(`Hướng dẫn:\n${item.instruction}`)} className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded transition-colors">
              <FileCheck className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  // ===== COLUMNS: CA LÀM VIỆC =====
  const shiftColumns = [
    { key: 'date', header: 'Ngày', render: (item: any) => new Date(item.date).toLocaleDateString('vi-VN') },
    {
      key: 'shift',
      header: 'Ca',
      render: (item: any) => {
        const labels = {
          morning: 'Ca sáng (06:00-14:00)',
          afternoon: 'Ca chiều (14:00-22:00)',
          night: 'Ca đêm (22:00-06:00)'
        };
        return labels[item.shift as keyof typeof labels] || item.shift;
      }
    },
    { key: 'team', header: 'Tổ đội' },
    {
      key: 'employees',
      header: 'Nhân viên',
      render: (item: any) => (
        <div className="flex flex-wrap gap-1">
          {item.employees.map((empId: string) => {
            const emp = employees.find(e => e.id === empId);
            return emp ? <span key={empId} className="text-xs bg-gray-100 px-2 py-1 rounded">{emp.name}</span> : null;
          })}
        </div>
      )
    },
    {
      key: 'orders',
      header: 'Lệnh SX',
      render: (item: any) => (
        <div className="flex flex-wrap gap-1">
          {item.orders.map((orderId: string) => {
            const order = orders.find(o => o.id === orderId);
            return order ? <span key={orderId} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{order.code}</span> : null;
          })}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => {
        const colors = {
          scheduled: 'bg-blue-100 text-blue-800',
          in_progress: 'bg-yellow-100 text-yellow-800',
          completed: 'bg-green-100 text-green-800'
        };
        const labels = {
          scheduled: 'Đã lên lịch',
          in_progress: 'Đang thực hiện',
          completed: 'Hoàn thành'
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[item.status as keyof typeof colors]}`}>{labels[item.status as keyof typeof labels]}</span>;
      }
    }
  ];

  // ===== COLUMNS: VẬT TƯ =====
  const materialRequestColumns = [
    { key: 'code', header: 'Mã yêu cầu' },
    {
      key: 'orderId',
      header: 'Lệnh SX',
      render: (item: any) => {
        const order = orders.find(o => o.id === item.orderId);
        return order ? order.code : 'Không xác định';
      }
    },
    {
      key: 'materialId',
      header: 'Nguyên vật liệu',
      render: (item: any) => {
        const material = materials.find(m => m.id === item.materialId);
        return material ? material.name : 'Không xác định';
      }
    },
    { key: 'quantity', header: 'Số lượng', render: (item: any) => `${item.quantity} ${item.unit}` },
    { key: 'purpose', header: 'Mục đích' },
    { key: 'requestedBy', header: 'Người yêu cầu' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800',
          issued: 'bg-blue-100 text-blue-800'
        };
        const labels = {
          pending: 'Chờ duyệt',
          approved: 'Đã duyệt',
          rejected: 'Từ chối',
          issued: 'Đã xuất'
        };
        return (
          <select
            value={item.status}
            onChange={(e) => updateMaterialRequest(item.id, e.target.value)}
            className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${colors[item.status as keyof typeof colors]}`}
          >
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="issued">Đã xuất</option>
          </select>
        );
      }
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditMaterialRequest(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteMaterialRequest(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // ===== COLUMNS: LUÂN CHUYỂN =====
  const transferColumns = [
    { key: 'code', header: 'Mã bàn giao' },
    {
      key: 'fromOrderId',
      header: 'Từ lệnh',
      render: (item: any) => {
        const order = orders.find(o => o.id === item.fromOrderId);
        return order ? order.code : 'Không xác định';
      }
    },
    {
      key: 'toOrderId',
      header: 'Đến lệnh',
      render: (item: any) => {
        const order = orders.find(o => o.id === item.toOrderId);
        return order ? order.code : 'Không xác định';
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
    { key: 'fromStage', header: 'Từ công đoạn' },
    { key: 'toStage', header: 'Đến công đoạn' },
    { key: 'fromTeam', header: 'Từ tổ' },
    { key: 'toTeam', header: 'Đến tổ' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => {
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          completed: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800'
        };
        const labels = {
          pending: 'Chờ bàn giao',
          completed: 'Đã bàn giao',
          cancelled: 'Đã hủy'
        };
        return (
          <select
            value={item.status}
            onChange={(e) => updateTransferStatus(item.id, e.target.value)}
            className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${colors[item.status as keyof typeof colors]}`}
          >
            <option value="pending">Chờ bàn giao</option>
            <option value="completed">Đã bàn giao</option>
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
          <button onClick={() => handleEditTransfer(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteTransfer(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // ===== COLUMNS: OEE =====
  const oeeColumns = [
    {
      key: 'machineId',
      header: 'Máy móc',
      render: (item: any) => {
        const machine = machines.find(m => m.id === item.machineId);
        return machine ? machine.name : 'Không xác định';
      }
    },
    { key: 'date', header: 'Ngày', render: (item: any) => new Date(item.date).toLocaleDateString('vi-VN') },
    {
      key: 'shift',
      header: 'Ca',
      render: (item: any) => ({
        morning: 'Ca sáng',
        afternoon: 'Ca chiều',
        night: 'Ca đêm'
      }[item.shift] || item.shift)
    },
    {
      key: 'oee',
      header: 'OEE',
      render: (item: any) => {
        const color = item.oee >= 85 ? 'text-green-600' : item.oee >= 60 ? 'text-yellow-600' : 'text-red-600';
        return <span className={`font-bold ${color}`}>{item.oee}%</span>;
      }
    },
    { key: 'availability', header: 'Availability', render: (item: any) => `${item.availability}%` },
    { key: 'performance', header: 'Performance', render: (item: any) => `${item.performance}%` },
    { key: 'quality', header: 'Quality', render: (item: any) => `${item.quality}%` },
    { key: 'downtime', header: 'Downtime (phút)' },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditOEE(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteOEE(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // ===== STATS =====
  const totalOrders = orders.length;
  const inProgressOrders = orders.filter(o => o.status === 'in_progress').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const avgOEE = oeeIndicators.length > 0 
    ? Math.round(oeeIndicators.reduce((sum, o) => sum + o.oee, 0) / oeeIndicators.length) 
    : 0;
  const avgAvailability = oeeIndicators.length > 0 
    ? Math.round(oeeIndicators.reduce((sum, o) => sum + o.availability, 0) / oeeIndicators.length) 
    : 0;
  const avgPerformance = oeeIndicators.length > 0 
    ? Math.round(oeeIndicators.reduce((sum, o) => sum + o.performance, 0) / oeeIndicators.length) 
    : 0;
  const avgQuality = oeeIndicators.length > 0 
    ? Math.round(oeeIndicators.reduce((sum, o) => sum + o.quality, 0) / oeeIndicators.length) 
    : 0;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Thực thi sản xuất</h2>
          {/* <p className="text-gray-600">Quản lý lệnh sản xuất, phân công và điều hành hiện trường</p> */}
        </div>
        <button 
          onClick={() => {
            if (activeTab === 'orders') handleAddOrder();
            else if (activeTab === 'materials') handleAddMaterialRequest();
            else if (activeTab === 'oee') handleAddOEE();
            else handleAddTransfer();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'orders' ? 'Tạo lệnh SX' : 
           activeTab === 'materials' ? 'Yêu cầu vật tư' :
           activeTab === 'oee' ? 'Thêm OEE' :
           activeTab === 'transfers' ? 'Tạo bàn giao' : 'Thêm mới'}
        </button>
      </div>

      {/* STATS */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Tổng lệnh sản xuất</p>
          <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Đang thực hiện</p>
          <p className="text-2xl font-bold text-yellow-600">{inProgressOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Hoàn thành</p>
          <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-500">
          <p className="text-sm text-gray-500">Chờ duyệt</p>
          <p className="text-2xl font-bold text-gray-600">{pendingOrders}</p>
        </div>
      </div> */}

      {/* TABS */}
      <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-lg px-4 overflow-x-auto">
         <button onClick={() => setActiveTab('monitoring')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'monitoring' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Eye className="w-4 h-4" />
          Giám sát
        </button>
        <button onClick={() => setActiveTab('orders')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <ClipboardList className="w-4 h-4" />
          Lệnh SX ({orders.length})
        </button>
        <button onClick={() => setActiveTab('assignments')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'assignments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <UserCheck className="w-4 h-4" />
            Phân công & Ca làm việc ({assignments.length + shifts.length})
        </button>
       
        <button onClick={() => setActiveTab('materials')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'materials' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Package className="w-4 h-4" />
          Vật tư ({materialRequests.length + transfers.length})
        </button>
        <button onClick={() => setActiveTab('oee')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'oee' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <BarChart className="w-4 h-4" />
          OEE ({oeeIndicators.length})
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {activeTab === 'orders' && <DataTable columns={orderColumns} data={orders} />}
        {activeTab === 'assignments' && (
            <div className="p-4">
            {/* Phân công công việc */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Phân công công việc
                </h4>
                <DataTable 
                columns={assignmentColumns} 
                data={selectedItem ? assignments.filter(a => a.orderId === selectedItem.id) : assignments} 
                />
            </div>
            
            {/* Ca làm việc */}
            <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Ca làm việc
                </h4>
                <DataTable columns={shiftColumns} data={shifts} />
            </div>
            </div>
        )}
        
        {activeTab === 'monitoring' && (
          <div className="p-4">
            {/* <h4 className="font-semibold text-gray-800 mb-4">📊 Giám sát công đoạn sản xuất</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600">🟢 Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-800">{orders.filter(o => o.status === 'in_progress').length}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-600">🟡 Chờ duyệt</p>
                <p className="text-2xl font-bold text-yellow-800">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600">🔵 Hoàn thành</p>
                <p className="text-2xl font-bold text-blue-800">{orders.filter(o => o.status === 'completed').length}</p>
              </div>
            </div> */}
            
            <div className="space-y-4">
              {orders.filter(o => o.status === 'in_progress' || o.status === 'pending').map(order => {
                const orderAssignments = assignments.filter(a => a.orderId === order.id);
                return (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-800">{order.code} - {products.find(p => p.id === order.productId)?.name}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {orderAssignments.map((assignment, idx) => (
                        <div key={assignment.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium w-8">{idx + 1}</span>
                          <span className="text-sm flex-1">{assignment.stage}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            assignment.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {assignment.status === 'completed' ? '✅ Hoàn thành' :
                             assignment.status === 'in_progress' ? '⏳ Đang thực hiện' :
                             '⏸ Chờ'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {assignment.completedQuantity} / {orders.find(o => o.id === assignment.orderId)?.quantity} tấn
                          </span>
                          {assignment.qualityCheck === 'passed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {assignment.qualityCheck === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {orders.filter(o => o.status === 'in_progress' || o.status === 'pending').length === 0 && (
                <p className="text-gray-500 text-center py-4">Không có lệnh sản xuất đang thực hiện</p>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'materials' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">📦 Quản lý vật tư sản xuất</h4>
            </div>
            
            <div className="mb-6">
              <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Yêu cầu vật tư
              </h5>
              <DataTable columns={materialRequestColumns} data={materialRequests} />
            </div>
            
            <div>
              <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-600" />
                Luân chuyển bán thành phẩm
              </h5>
              <DataTable columns={transferColumns} data={transfers} />
            </div>
          </div>
        )}
        
        {activeTab === 'oee' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">📈 Chỉ số OEE - Hiệu suất máy móc</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600">OEE trung bình</p>
                <p className="text-2xl font-bold text-blue-800">{avgOEE}%</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600">Availability</p>
                <p className="text-2xl font-bold text-green-800">{avgAvailability}%</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-600">Performance</p>
                <p className="text-2xl font-bold text-purple-800">{avgPerformance}%</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-600">Quality</p>
                <p className="text-2xl font-bold text-orange-800">{avgQuality}%</p>
              </div>
            </div>
            
            <DataTable columns={oeeColumns} data={oeeIndicators} />
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedItem ? 'Chỉnh sửa' : 'Tạo mới'} 
                {formType === 'order' ? ' Lệnh sản xuất' :
                 formType === 'material' ? ' Yêu cầu vật tư' :
                 formType === 'transfer' ? ' Bàn giao' :
                 ' OEE'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* FORM LỆNH SẢN XUẤT */}
              {formType === 'order' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã lệnh</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm *</label>
                    <select value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Chọn sản phẩm</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng *</label>
                    <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                    <input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ưu tiên</label>
                    <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="high">Cao</option>
                      <option value="medium">Trung bình</option>
                      <option value="low">Thấp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nguồn</label>
                    <select value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="plan">Từ kế hoạch</option>
                      <option value="order">Từ đơn hàng</option>
                      <option value="manual">Thủ công</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tổ đội</label>
                    <select value={formData.assignedTeam} onChange={(e) => setFormData({...formData, assignedTeam: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Chọn tổ đội</option>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(i => <option key={i} value={`Tổ ${i}`}>Tổ {i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giám sát</label>
                    <input type="text" value={formData.supervisor} onChange={(e) => setFormData({...formData, supervisor: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Tên giám sát" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dây chuyền</label>
                    <input type="text" value={formData.assignedLine} onChange={(e) => setFormData({...formData, assignedLine: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="VD: Dây chuyền 1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Ghi chú thêm..." />
                  </div>
                </div>
              )}

              {/* FORM YÊU CẦU VẬT TƯ */}
              {formType === 'material' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã yêu cầu</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lệnh sản xuất *</label>
                    <select value={formData.orderId} onChange={(e) => setFormData({...formData, orderId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Chọn lệnh</option>
                      {orders.map(o => <option key={o.id} value={o.id}>{o.code} - {products.find(p => p.id === o.productId)?.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nguyên vật liệu *</label>
                    <select value={formData.materialId} onChange={(e) => setFormData({...formData, materialId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Chọn NVL</option>
                      {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.code})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng *</label>
                    <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                    <input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Người yêu cầu</label>
                    <input type="text" value={formData.requestedBy} onChange={(e) => setFormData({...formData, requestedBy: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mục đích sử dụng</label>
                    <input type="text" value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Mục đích sử dụng" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Ghi chú thêm..." />
                  </div>
                </div>
              )}

              {/* FORM BÀN GIAO */}
              {formType === 'transfer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã bàn giao</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm *</label>
                    <select value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Chọn sản phẩm</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ lệnh SX *</label>
                    <select value={formData.fromOrderId} onChange={(e) => setFormData({...formData, fromOrderId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Chọn lệnh</option>
                      {orders.map(o => <option key={o.id} value={o.id}>{o.code}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến lệnh SX *</label>
                    <select value={formData.toOrderId} onChange={(e) => setFormData({...formData, toOrderId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Chọn lệnh</option>
                      {orders.map(o => <option key={o.id} value={o.id}>{o.code}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng *</label>
                    <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                    <input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ công đoạn</label>
                    <input type="text" value={formData.fromStage} onChange={(e) => setFormData({...formData, fromStage: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến công đoạn</label>
                    <input type="text" value={formData.toStage} onChange={(e) => setFormData({...formData, toStage: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ tổ</label>
                    <input type="text" value={formData.fromTeam} onChange={(e) => setFormData({...formData, fromTeam: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến tổ</label>
                    <input type="text" value={formData.toTeam} onChange={(e) => setFormData({...formData, toTeam: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.note || ''} onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Ghi chú..." />
                  </div>
                </div>
              )}

              {/* FORM OEE */}
              {formType === 'oee' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Máy móc *</label>
                    <select value={formData.machineId} onChange={(e) => setFormData({...formData, machineId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Chọn máy</option>
                      {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ca</label>
                    <select value={formData.shift} onChange={(e) => setFormData({...formData, shift: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="morning">Ca sáng</option>
                      <option value="afternoon">Ca chiều</option>
                      <option value="night">Ca đêm</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability (%)</label>
                    <input type="number" value={formData.availability} onChange={(e) => setFormData({...formData, availability: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" max="100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Performance (%)</label>
                    <input type="number" value={formData.performance} onChange={(e) => setFormData({...formData, performance: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" max="100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quality (%)</label>
                    <input type="number" value={formData.quality} onChange={(e) => setFormData({...formData, quality: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" max="100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tổng thời gian (phút)</label>
                    <input type="number" value={formData.totalTime} onChange={(e) => setFormData({...formData, totalTime: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Downtime (phút)</label>
                    <input type="number" value={formData.downtime} onChange={(e) => setFormData({...formData, downtime: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lỗi</label>
                    <input type="number" value={formData.defects} onChange={(e) => setFormData({...formData, defects: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" />
                  </div>
                  <div className="col-span-2">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">OEE sẽ được tự động tính toán: <strong>{Math.round((formData.availability * formData.performance * formData.quality) / 100)}%</strong></p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    if (formType === 'order') saveOrder();
                    else if (formType === 'material') saveMaterialRequest();
                    else if (formType === 'transfer') saveTransfer();
                    else saveOEE();
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