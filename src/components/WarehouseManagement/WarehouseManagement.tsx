import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  initialWarehouses,
  initialWarehouseItems,
  initialStockMovements,
  initialInventoryOpenings,
  initialInventoryCounts,
  initialInventoryAdjustments,
  initialMaterials,
  initialProducts
} from '../../data/mockData';
import { DataTable } from '../Common/DataTable';
import {
  Warehouse,
  Package,
  ArrowUpDown,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ClipboardList,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const WarehouseManagement: React.FC = () => {
  // ===== DỮ LIỆU =====
  const [warehouses, setWarehouses] = useLocalStorage('warehouses', initialWarehouses);
  const [warehouseItems, setWarehouseItems] = useLocalStorage('warehouseItems', initialWarehouseItems);
  const [stockMovements, setStockMovements] = useLocalStorage('stockMovements', initialStockMovements);
  const [inventoryOpenings, setInventoryOpenings] = useLocalStorage('inventoryOpenings', initialInventoryOpenings);
  const [inventoryCounts, setInventoryCounts] = useLocalStorage('inventoryCounts', initialInventoryCounts);
  const [inventoryAdjustments, setInventoryAdjustments] = useLocalStorage('inventoryAdjustments', initialInventoryAdjustments);
  const [materials] = useLocalStorage('materials', initialMaterials);
  const [products] = useLocalStorage('products', initialProducts);

  const [activeTab, setActiveTab] = useState<'warehouses' | 'items' | 'movements' | 'openings' | 'counts' | 'adjustments'>('warehouses');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [formType, setFormType] = useState<string>('warehouse');

  // ===== CRUD: KHO =====
  const handleAddWarehouse = () => {
    setFormType('warehouse');
    setSelectedItem(null);
    setFormData({
      code: `KHO${String(warehouses.length + 1).padStart(3, '0')}`,
      name: '',
      type: 'general',
      location: '',
      manager: '',
      status: 'active'
    });
    setShowForm(true);
  };

  const handleEditWarehouse = (item: any) => {
    setFormType('warehouse');
    setSelectedItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const saveWarehouse = () => {
    if (!formData.name || !formData.location) {
      alert('Vui lòng nhập tên kho và vị trí!');
      return;
    }

    if (selectedItem) {
      setWarehouses(warehouses.map(w => w.id === selectedItem.id ? { ...formData, id: selectedItem.id } : w));
    } else {
      setWarehouses([...warehouses, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteWarehouse = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa kho này?')) {
      setWarehouses(warehouses.filter(w => w.id !== id));
    }
  };

  // ===== CRUD: VẬT TƯ TỒN KHO =====
  const handleAddItem = () => {
    setFormType('item');
    setSelectedItem(null);
    setFormData({
      warehouseId: '',
      materialId: '',
      quantity: 0,
      unit: 'tấn',
      minStock: 0,
      maxStock: 0,
      batchNumber: '',
      location: ''
    });
    setShowForm(true);
  };

  const handleEditItem = (item: any) => {
    setFormType('item');
    setSelectedItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const saveItem = () => {
    if (!formData.warehouseId || !formData.materialId) {
      alert('Vui lòng chọn kho và vật tư!');
      return;
    }

    if (selectedItem) {
      setWarehouseItems(warehouseItems.map(item => 
        item.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : item
      ));
    } else {
      setWarehouseItems([...warehouseItems, { 
        ...formData, 
        id: Date.now().toString(), 
        updatedAt: new Date().toISOString() 
      }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa vật tư này?')) {
      setWarehouseItems(warehouseItems.filter(item => item.id !== id));
    }
  };

  // ===== CRUD: PHIẾU XUẤT/NHẬP =====
  const handleAddMovement = () => {
    setFormType('movement');
    setSelectedItem(null);
    setFormData({
      code: `PK${String(stockMovements.length + 1).padStart(3, '0')}`,
      warehouseId: '',
      materialId: '',
      type: 'import',
      quantity: 0,
      unit: 'tấn',
      fromWarehouseId: '',
      toWarehouseId: '',
      reason: '',
      createdBy: '',
      movementDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditMovement = (item: any) => {
    setFormType('movement');
    setSelectedItem(item);
    setFormData({
      ...item,
      movementDate: item.movementDate.split('T')[0]
    });
    setShowForm(true);
  };

  const saveMovement = () => {
    if (!formData.warehouseId || !formData.materialId || !formData.quantity) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (selectedItem) {
      setStockMovements(stockMovements.map(m => 
        m.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : m
      ));
    } else {
      setStockMovements([...stockMovements, { 
        ...formData, 
        id: Date.now().toString(), 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteMovement = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa phiếu này?')) {
      setStockMovements(stockMovements.filter(m => m.id !== id));
    }
  };

  const updateMovementStatus = (id: string, status: string) => {
    setStockMovements(stockMovements.map(m => 
      m.id === id ? { ...m, status: status as any, updatedAt: new Date().toISOString() } : m
    ));
  };

  // ===== CRUD: TỒN ĐẦU KỲ =====
  const handleAddOpening = () => {
    setFormType('opening');
    setSelectedItem(null);
    setFormData({
      warehouseId: '',
      materialId: '',
      quantity: 0,
      unit: 'tấn',
      batchNumber: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditOpening = (item: any) => {
    setFormType('opening');
    setSelectedItem(item);
    setFormData({
      ...item,
      date: item.date.split('T')[0]
    });
    setShowForm(true);
  };

  const saveOpening = () => {
    if (!formData.warehouseId || !formData.materialId || !formData.quantity) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (selectedItem) {
      setInventoryOpenings(inventoryOpenings.map(o => 
        o.id === selectedItem.id ? { ...formData, id: selectedItem.id } : o
      ));
    } else {
      setInventoryOpenings([...inventoryOpenings, { 
        ...formData, 
        id: Date.now().toString(), 
        createdAt: new Date().toISOString() 
      }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteOpening = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa tồn đầu kỳ này?')) {
      setInventoryOpenings(inventoryOpenings.filter(o => o.id !== id));
    }
  };

  // ===== CRUD: KIỂM KÊ =====
  const handleAddCount = () => {
    setFormType('count');
    setSelectedItem(null);
    setFormData({
      code: `KK${String(inventoryCounts.length + 1).padStart(3, '0')}`,
      warehouseId: '',
      materialId: '',
      systemQuantity: 0,
      actualQuantity: 0,
      unit: 'tấn',
      difference: 0,
      countedBy: '',
      countDate: new Date().toISOString().split('T')[0],
      notes: '',
      status: 'pending'
    });
    setShowForm(true);
  };

  const handleEditCount = (item: any) => {
    setFormType('count');
    setSelectedItem(item);
    setFormData({
      ...item,
      countDate: item.countDate.split('T')[0]
    });
    setShowForm(true);
  };

  const saveCount = () => {
    if (!formData.warehouseId || !formData.materialId) {
      alert('Vui lòng chọn kho và vật tư!');
      return;
    }

    // Tính chênh lệch
    const difference = formData.actualQuantity - formData.systemQuantity;
    formData.difference = Math.round(difference * 100) / 100;

    if (selectedItem) {
      setInventoryCounts(inventoryCounts.map(c => 
        c.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : c
      ));
    } else {
      setInventoryCounts([...inventoryCounts, { 
        ...formData, 
        id: Date.now().toString(), 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteCount = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa phiếu kiểm kê này?')) {
      setInventoryCounts(inventoryCounts.filter(c => c.id !== id));
    }
  };

  const updateCountStatus = (id: string, status: string) => {
    setInventoryCounts(inventoryCounts.map(c => 
      c.id === id ? { ...c, status: status as any, updatedAt: new Date().toISOString() } : c
    ));
  };

  // ===== CRUD: ĐIỀU CHỈNH TỒN KHO =====
  const handleAddAdjustment = () => {
    setFormType('adjustment');
    setSelectedItem(null);
    setFormData({
      code: `ĐC${String(inventoryAdjustments.length + 1).padStart(3, '0')}`,
      warehouseId: '',
      materialId: '',
      oldQuantity: 0,
      newQuantity: 0,
      difference: 0,
      unit: 'tấn',
      reason: '',
      adjustedBy: '',
      adjustmentDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditAdjustment = (item: any) => {
    setFormType('adjustment');
    setSelectedItem(item);
    setFormData({
      ...item,
      adjustmentDate: item.adjustmentDate.split('T')[0]
    });
    setShowForm(true);
  };

  const saveAdjustment = () => {
    if (!formData.warehouseId || !formData.materialId) {
      alert('Vui lòng chọn kho và vật tư!');
      return;
    }

    // Tính chênh lệch
    const difference = formData.newQuantity - formData.oldQuantity;
    formData.difference = Math.round(difference * 100) / 100;

    if (selectedItem) {
      setInventoryAdjustments(inventoryAdjustments.map(a => 
        a.id === selectedItem.id ? { ...formData, id: selectedItem.id, updatedAt: new Date().toISOString() } : a
      ));
    } else {
      setInventoryAdjustments([...inventoryAdjustments, { 
        ...formData, 
        id: Date.now().toString(), 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDeleteAdjustment = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa phiếu điều chỉnh này?')) {
      setInventoryAdjustments(inventoryAdjustments.filter(a => a.id !== id));
    }
  };

  const updateAdjustmentStatus = (id: string, status: string) => {
    setInventoryAdjustments(inventoryAdjustments.map(a => 
      a.id === id ? { ...a, status: status as any, updatedAt: new Date().toISOString() } : a
    ));
  };

  // ===== COLUMNS =====
  const warehouseColumns = [
    { key: 'code', header: 'Mã kho' },
    { key: 'name', header: 'Tên kho' },
    {
      key: 'type',
      header: 'Loại kho',
      render: (item: any) => {
        const labels = {
          raw: 'Nguyên liệu',
          semi: 'Bán thành phẩm',
          finished: 'Thành phẩm',
          general: 'Tổng hợp'
        };
        return labels[item.type as keyof typeof labels] || item.type;
      }
    },
    { key: 'location', header: 'Vị trí' },
    { key: 'manager', header: 'Quản lý' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {item.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditWarehouse(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteWarehouse(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const itemColumns = [
    {
      key: 'warehouseId',
      header: 'Kho',
      render: (item: any) => {
        const warehouse = warehouses.find(w => w.id === item.warehouseId);
        return warehouse ? warehouse.name : 'Không xác định';
      }
    },
    {
      key: 'materialId',
      header: 'Vật tư',
      render: (item: any) => {
        const material = materials.find(m => m.id === item.materialId);
        const product = products.find(p => p.id === item.materialId);
        return material ? material.name : product ? product.name : 'Không xác định';
      }
    },
    { key: 'quantity', header: 'Tồn kho', render: (item: any) => `${item.quantity} ${item.unit}` },
    { key: 'minStock', header: 'Tồn tối thiểu', render: (item: any) => `${item.minStock} ${item.unit}` },
    { key: 'maxStock', header: 'Tồn tối đa', render: (item: any) => `${item.maxStock} ${item.unit}` },
    { key: 'batchNumber', header: 'Số lô' },
    { key: 'location', header: 'Vị trí' },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditItem(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const movementColumns = [
    { key: 'code', header: 'Mã phiếu' },
    {
      key: 'type',
      header: 'Loại',
      render: (item: any) => {
        const labels = {
          import: '📥 Nhập kho',
          export: '📤 Xuất kho',
          transfer: '🔄 Điều chuyển'
        };
        return labels[item.type as keyof typeof labels] || item.type;
      }
    },
    {
      key: 'warehouseId',
      header: 'Kho',
      render: (item: any) => {
        const warehouse = warehouses.find(w => w.id === item.warehouseId);
        return warehouse ? warehouse.name : 'Không xác định';
      }
    },
    {
      key: 'materialId',
      header: 'Vật tư',
      render: (item: any) => {
        const material = materials.find(m => m.id === item.materialId);
        return material ? material.name : 'Không xác định';
      }
    },
    { key: 'quantity', header: 'Số lượng', render: (item: any) => `${item.quantity} ${item.unit}` },
    { key: 'reason', header: 'Lý do' },
    { key: 'createdBy', header: 'Người tạo' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => (
        <select
          value={item.status}
          onChange={(e) => updateMovementStatus(item.id, e.target.value)}
          className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${
            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            item.status === 'approved' ? 'bg-green-100 text-green-800' :
            item.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}
        >
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
          <option value="completed">Hoàn thành</option>
        </select>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditMovement(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteMovement(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const openingColumns = [
    {
      key: 'warehouseId',
      header: 'Kho',
      render: (item: any) => {
        const warehouse = warehouses.find(w => w.id === item.warehouseId);
        return warehouse ? warehouse.name : 'Không xác định';
      }
    },
    {
      key: 'materialId',
      header: 'Vật tư',
      render: (item: any) => {
        const material = materials.find(m => m.id === item.materialId);
        return material ? material.name : 'Không xác định';
      }
    },
    { key: 'quantity', header: 'Số lượng', render: (item: any) => `${item.quantity} ${item.unit}` },
    { key: 'unit', header: 'Đơn vị' },
    { key: 'batchNumber', header: 'Số lô' },
    {
      key: 'date',
      header: 'Ngày',
      render: (item: any) => new Date(item.date).toLocaleDateString('vi-VN')
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditOpening(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteOpening(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const countColumns = [
    { key: 'code', header: 'Mã phiếu' },
    {
      key: 'warehouseId',
      header: 'Kho',
      render: (item: any) => {
        const warehouse = warehouses.find(w => w.id === item.warehouseId);
        return warehouse ? warehouse.name : 'Không xác định';
      }
    },
    {
      key: 'materialId',
      header: 'Vật tư',
      render: (item: any) => {
        const material = materials.find(m => m.id === item.materialId);
        return material ? material.name : 'Không xác định';
      }
    },
    { key: 'systemQuantity', header: 'Hệ thống', render: (item: any) => `${item.systemQuantity} ${item.unit}` },
    { key: 'actualQuantity', header: 'Thực tế', render: (item: any) => `${item.actualQuantity} ${item.unit}` },
    {
      key: 'difference',
      header: 'Chênh lệch',
      render: (item: any) => (
        <span className={item.difference < 0 ? 'text-red-600 font-bold' : item.difference > 0 ? 'text-green-600 font-bold' : 'text-gray-500'}>
          {item.difference > 0 ? '+' : ''}{item.difference} {item.unit}
        </span>
      )
    },
    { key: 'countedBy', header: 'Người kiểm' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => (
        <select
          value={item.status}
          onChange={(e) => updateCountStatus(item.id, e.target.value)}
          className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${
            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            item.status === 'approved' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}
        >
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditCount(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteCount(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const adjustmentColumns = [
    { key: 'code', header: 'Mã phiếu' },
    {
      key: 'warehouseId',
      header: 'Kho',
      render: (item: any) => {
        const warehouse = warehouses.find(w => w.id === item.warehouseId);
        return warehouse ? warehouse.name : 'Không xác định';
      }
    },
    {
      key: 'materialId',
      header: 'Vật tư',
      render: (item: any) => {
        const material = materials.find(m => m.id === item.materialId);
        return material ? material.name : 'Không xác định';
      }
    },
    { key: 'oldQuantity', header: 'Cũ', render: (item: any) => `${item.oldQuantity} ${item.unit}` },
    { key: 'newQuantity', header: 'Mới', render: (item: any) => `${item.newQuantity} ${item.unit}` },
    {
      key: 'difference',
      header: 'Chênh lệch',
      render: (item: any) => (
        <span className={item.difference < 0 ? 'text-red-600 font-bold' : item.difference > 0 ? 'text-green-600 font-bold' : 'text-gray-500'}>
          {item.difference > 0 ? '+' : ''}{item.difference} {item.unit}
        </span>
      )
    },
    { key: 'reason', header: 'Lý do' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (item: any) => (
        <select
          value={item.status}
          onChange={(e) => updateAdjustmentStatus(item.id, e.target.value)}
          className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${
            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            item.status === 'approved' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}
        >
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
      )
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditAdjustment(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteAdjustment(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
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
          <h2 className="text-2xl font-bold text-gray-800">Kho sản xuất nhà máy</h2>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'warehouses') handleAddWarehouse();
            else if (activeTab === 'items') handleAddItem();
            else if (activeTab === 'movements') handleAddMovement();
            else if (activeTab === 'openings') handleAddOpening();
            else if (activeTab === 'counts') handleAddCount();
            else if (activeTab === 'adjustments') handleAddAdjustment();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'warehouses' ? 'Thêm kho' :
           activeTab === 'items' ? 'Thêm vật tư' :
           activeTab === 'movements' ? 'Tạo phiếu' :
           activeTab === 'openings' ? 'Thêm tồn đầu kỳ' :
           activeTab === 'counts' ? 'Tạo phiếu kiểm kê' :
           'Tạo phiếu điều chỉnh'}
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-lg px-4 overflow-x-auto">
        <button onClick={() => setActiveTab('warehouses')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'warehouses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Warehouse className="w-4 h-4" />
          Danh sách kho ({warehouses.length})
        </button>
        <button onClick={() => setActiveTab('items')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'items' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <Package className="w-4 h-4" />
          Vật tư tồn kho ({warehouseItems.length})
        </button>
        <button onClick={() => setActiveTab('movements')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'movements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <ArrowUpDown className="w-4 h-4" />
          Xuất/Nhập ({stockMovements.length})
        </button>
        <button onClick={() => setActiveTab('openings')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'openings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <ClipboardList className="w-4 h-4" />
          Tồn đầu kỳ ({inventoryOpenings.length})
        </button>
        <button onClick={() => setActiveTab('counts')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'counts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <CheckCircle className="w-4 h-4" />
          Kiểm kê ({inventoryCounts.length})
        </button>
        <button onClick={() => setActiveTab('adjustments')} className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${activeTab === 'adjustments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <AlertCircle className="w-4 h-4" />
          Điều chỉnh ({inventoryAdjustments.length})
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {activeTab === 'warehouses' && <DataTable columns={warehouseColumns} data={warehouses} />}
        {activeTab === 'items' && <DataTable columns={itemColumns} data={warehouseItems} />}
        {activeTab === 'movements' && <DataTable columns={movementColumns} data={stockMovements} />}
        {activeTab === 'openings' && <DataTable columns={openingColumns} data={inventoryOpenings} />}
        {activeTab === 'counts' && <DataTable columns={countColumns} data={inventoryCounts} />}
        {activeTab === 'adjustments' && <DataTable columns={adjustmentColumns} data={inventoryAdjustments} />}
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedItem ? 'Chỉnh sửa' : 'Thêm mới'} 
                {formType === 'warehouse' ? ' Kho' :
                 formType === 'item' ? ' Vật tư' :
                 formType === 'movement' ? ' Phiếu xuất/nhập' :
                 formType === 'opening' ? ' Tồn đầu kỳ' :
                 formType === 'count' ? ' Phiếu kiểm kê' :
                 ' Phiếu điều chỉnh'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* FORM KHO */}
              {formType === 'warehouse' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã kho</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên kho *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nhập tên kho" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại kho</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="raw">Nguyên liệu</option>
                      <option value="semi">Bán thành phẩm</option>
                      <option value="finished">Thành phẩm</option>
                      <option value="general">Tổng hợp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí *</label>
                    <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="VD: Khu A - Nhà kho 1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quản lý</label>
                    <input type="text" value={formData.manager} onChange={(e) => setFormData({...formData, manager: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Tên quản lý" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Ngừng hoạt động</option>
                    </select>
                  </div>
                </div>
              )}

              {/* FORM VẬT TƯ TỒN KHO */}
              {formType === 'item' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kho *</label>
                    <select value={formData.warehouseId} onChange={(e) => setFormData({...formData, warehouseId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn kho</option>
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vật tư *</label>
                    <select value={formData.materialId} onChange={(e) => setFormData({...formData, materialId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn vật tư</option>
                      {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                    <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="0" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                    <input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tồn tối thiểu</label>
                    <input type="number" value={formData.minStock} onChange={(e) => setFormData({...formData, minStock: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tồn tối đa</label>
                    <input type="number" value={formData.maxStock} onChange={(e) => setFormData({...formData, maxStock: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lô</label>
                    <input type="text" value={formData.batchNumber || ''} onChange={(e) => setFormData({...formData, batchNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="VD: LOT2026-001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label>
                    <input type="text" value={formData.location || ''} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="VD: Kệ A1" />
                  </div>
                </div>
              )}

              {/* FORM PHIẾU XUẤT/NHẬP */}
              {formType === 'movement' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã phiếu</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại phiếu *</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="import">Nhập kho</option>
                      <option value="export">Xuất kho</option>
                      <option value="transfer">Điều chuyển</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kho *</label>
                    <select value={formData.warehouseId} onChange={(e) => setFormData({...formData, warehouseId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn kho</option>
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vật tư *</label>
                    <select value={formData.materialId} onChange={(e) => setFormData({...formData, materialId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn vật tư</option>
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
                  {formData.type === 'transfer' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Từ kho</label>
                        <select value={formData.fromWarehouseId || ''} onChange={(e) => setFormData({...formData, fromWarehouseId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                          <option value="">Chọn kho</option>
                          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Đến kho</label>
                        <select value={formData.toWarehouseId || ''} onChange={(e) => setFormData({...formData, toWarehouseId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                          <option value="">Chọn kho</option>
                          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Người tạo</label>
                    <input type="text" value={formData.createdBy || ''} onChange={(e) => setFormData({...formData, createdBy: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                    <input type="date" value={formData.movementDate} onChange={(e) => setFormData({...formData, movementDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lý do</label>
                    <input type="text" value={formData.reason || ''} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Lý do xuất/nhập" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Ghi chú thêm..." />
                  </div>
                </div>
              )}

              {/* FORM TỒN ĐẦU KỲ */}
              {formType === 'opening' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kho *</label>
                    <select value={formData.warehouseId} onChange={(e) => setFormData({...formData, warehouseId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn kho</option>
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vật tư *</label>
                    <select value={formData.materialId} onChange={(e) => setFormData({...formData, materialId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn vật tư</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lô</label>
                    <input type="text" value={formData.batchNumber || ''} onChange={(e) => setFormData({...formData, batchNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày *</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Ghi chú..." />
                  </div>
                </div>
              )}

              {/* FORM KIỂM KÊ */}
              {formType === 'count' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã phiếu</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kho *</label>
                    <select value={formData.warehouseId} onChange={(e) => setFormData({...formData, warehouseId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn kho</option>
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vật tư *</label>
                    <select value={formData.materialId} onChange={(e) => setFormData({...formData, materialId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn vật tư</option>
                      {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                    <input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng hệ thống</label>
                    <input type="number" value={formData.systemQuantity} onChange={(e) => setFormData({...formData, systemQuantity: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="0" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng thực tế</label>
                    <input type="number" value={formData.actualQuantity} onChange={(e) => setFormData({...formData, actualQuantity: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="0" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Người kiểm</label>
                    <input type="text" value={formData.countedBy || ''} onChange={(e) => setFormData({...formData, countedBy: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kiểm</label>
                    <input type="date" value={formData.countDate} onChange={(e) => setFormData({...formData, countDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Ghi chú..." />
                  </div>
                  <div className="col-span-2">
                    <div className={`p-3 rounded-lg ${formData.actualQuantity - formData.systemQuantity !== 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
                      <p className="text-sm">
                        <strong>Chênh lệch:</strong>{' '}
                        <span className={formData.actualQuantity - formData.systemQuantity < 0 ? 'text-red-600' : formData.actualQuantity - formData.systemQuantity > 0 ? 'text-green-600' : 'text-gray-500'}>
                          {formData.actualQuantity - formData.systemQuantity > 0 ? '+' : ''}{Math.round((formData.actualQuantity - formData.systemQuantity) * 100) / 100} {formData.unit}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* FORM ĐIỀU CHỈNH */}
              {formType === 'adjustment' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã phiếu</label>
                    <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kho *</label>
                    <select value={formData.warehouseId} onChange={(e) => setFormData({...formData, warehouseId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn kho</option>
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vật tư *</label>
                    <select value={formData.materialId} onChange={(e) => setFormData({...formData, materialId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn vật tư</option>
                      {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                    <input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng cũ</label>
                    <input type="number" value={formData.oldQuantity} onChange={(e) => setFormData({...formData, oldQuantity: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="0" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng mới</label>
                    <input type="number" value={formData.newQuantity} onChange={(e) => setFormData({...formData, newQuantity: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min="0" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Người điều chỉnh</label>
                    <input type="text" value={formData.adjustedBy || ''} onChange={(e) => setFormData({...formData, adjustedBy: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày điều chỉnh</label>
                    <input type="date" value={formData.adjustmentDate} onChange={(e) => setFormData({...formData, adjustmentDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lý do *</label>
                    <input type="text" value={formData.reason || ''} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Lý do điều chỉnh" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Ghi chú..." />
                  </div>
                  <div className="col-span-2">
                    <div className={`p-3 rounded-lg ${formData.newQuantity - formData.oldQuantity !== 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
                      <p className="text-sm">
                        <strong>Chênh lệch:</strong>{' '}
                        <span className={formData.newQuantity - formData.oldQuantity < 0 ? 'text-red-600' : formData.newQuantity - formData.oldQuantity > 0 ? 'text-green-600' : 'text-gray-500'}>
                          {formData.newQuantity - formData.oldQuantity > 0 ? '+' : ''}{Math.round((formData.newQuantity - formData.oldQuantity) * 100) / 100} {formData.unit}
                        </span>
                      </p>
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
                    if (formType === 'warehouse') saveWarehouse();
                    else if (formType === 'item') saveItem();
                    else if (formType === 'movement') saveMovement();
                    else if (formType === 'opening') saveOpening();
                    else if (formType === 'count') saveCount();
                    else saveAdjustment();
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