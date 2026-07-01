import type { 
  Material, 
  Product, 
  ProductionPlan, 
  Machine, 
  WorkShift, 
  User,
  ProductionOrder,
  WorkAssignment,
  Employee,
  WorkShiftReal,
  QualityControl,
  MaterialRequest,
  ProductionTransfer,
  OEEIndicator,
  ProductionStatistic,
  QualityCheckRequest,
  MaterialDisposal,
  QualityStandard,
  QualityCriterion,
  DefectType,
  QualityCheckRecord,
  QualityDefect,
  ProductDisposal,
  Warehouse,
  WarehouseItem,
  StockMovement,
  InventoryOpening,
  InventoryCount,
  InventoryAdjustment,
  TraceabilityBatch,
  Factory,
  ProductionLine,
  Department,
  FactoryData,
  Translation,
  LanguageConfig,
  CostStandard,
  CostEstimate,
  PackagingItem,
  LabelManagement,
  Subcontractor,
  OutsourcingOrder,
  InternalProcessing,
  ScrapMaterial,
  DismantleOrder,
  ScrapTracking,
  ProductionReport,
  MaterialConsumptionReport,
  QualityReport,
  InventoryReport,
  CostReport,
  DashboardConfig,
  DashboardWidget
} from '../types';

export const initialMaterials: Material[] = [
  { id: '1', code: 'NVL001', name: 'Quặng Apatit', type: 'raw', unit: 'tấn', quantity: 1000, minStock: 200, maxStock: 2000, price: 1500000, createdAt: new Date().toISOString() },
  { id: '2', code: 'NVL002', name: 'Than cốc', type: 'raw', unit: 'tấn', quantity: 800, minStock: 150, maxStock: 1500, price: 1200000, createdAt: new Date().toISOString() },
  { id: '3', code: 'NVL003', name: 'Khí thiên nhiên', type: 'raw', unit: 'm³', quantity: 500000, minStock: 100000, maxStock: 1000000, price: 8000, createdAt: new Date().toISOString() },
  { id: '4', code: 'BTP001', name: 'Amoniac', type: 'semi', unit: 'tấn', quantity: 400, minStock: 50, maxStock: 600, price: 5000000, createdAt: new Date().toISOString() },
  { id: '5', code: 'BTP002', name: 'Ure nóng chảy', type: 'semi', unit: 'tấn', quantity: 350, minStock: 50, maxStock: 500, price: 6000000, createdAt: new Date().toISOString() },
  { id: '6', code: 'BTP003', name: 'Ammonium Nitrat', type: 'semi', unit: 'tấn', quantity: 200, minStock: 30, maxStock: 400, price: 5500000, createdAt: new Date().toISOString() },
  { id: '7', code: 'TP001', name: 'Phân Ure', type: 'finished', unit: 'tấn', quantity: 500, minStock: 100, maxStock: 1000, price: 8000000, createdAt: new Date().toISOString() },
  { id: '8', code: 'TP002', name: 'Phân DAP', type: 'finished', unit: 'tấn', quantity: 300, minStock: 50, maxStock: 800, price: 9000000, createdAt: new Date().toISOString() },
];

export const initialProducts: Product[] = [
  {
    id: '1',
    code: 'SP001',
    name: 'Phân Ure',
    type: 'finished',
    unit: 'tấn',
    variants: {
      color: ['Trắng', 'Vàng'],
      size: ['1mm', '2mm', '3mm']
    },
    bom: [
      { materialId: '4', quantity: 0.6, wastageRate: 2 },
      { materialId: '5', quantity: 0.4, wastageRate: 1.5 },
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    code: 'SP002',
    name: 'Phân DAP',
    type: 'finished',
    unit: 'tấn',
    variants: {
      color: ['Xám', 'Nâu'],
      size: ['2mm', '4mm']
    },
    bom: [
      { materialId: '4', quantity: 0.5, wastageRate: 2.5 },
      { materialId: '6', quantity: 0.5, wastageRate: 2 },
    ],
    createdAt: new Date().toISOString()
  },
];

export const initialMachines: Machine[] = [
  { id: '1', code: 'M001', name: 'Lò phản ứng Amoniac', capacity: 100, unit: 'tấn/ngày', status: 'active', team: 'Tổ 1' },
  { id: '2', code: 'M002', name: 'Hệ thống tổng hợp Ure', capacity: 80, unit: 'tấn/ngày', status: 'active', team: 'Tổ 1' },
  { id: '3', code: 'M003', name: 'Máy tạo hạt', capacity: 60, unit: 'tấn/ngày', status: 'active', team: 'Tổ 2' },
  { id: '4', code: 'M004', name: 'Hệ thống sấy', capacity: 50, unit: 'tấn/ngày', status: 'maintenance', team: 'Tổ 2' },
];

export const initialWorkShifts: WorkShift[] = [
  { id: '1', name: 'Ca 1', startTime: '06:00', endTime: '14:00', team: 'Tổ 1' },
  { id: '2', name: 'Ca 2', startTime: '14:00', endTime: '22:00', team: 'Tổ 2' },
  { id: '3', name: 'Ca 3', startTime: '22:00', endTime: '06:00', team: 'Tổ 3' },
];

export const initialUsers: User[] = [
  { id: '1', username: 'admin', role: 'admin', email: 'admin@nhamaydam.com' },
  { id: '2', username: 'manager', role: 'manager', email: 'manager@nhamaydam.com' },
  { id: '3', username: 'operator', role: 'operator', email: 'operator@nhamaydam.com' },
];

export const initialProductionPlans: ProductionPlan[] = [
  {
    id: '1',
    code: 'KH001',
    productId: '1',
    quantity: 200,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'approved',
    shift: 'morning',
    line: 'Dây chuyền 1',
    team: 'Tổ 1',
    materialsAllocated: [
      { materialId: '4', required: 120, allocated: 120, unit: 'tấn' },
      { materialId: '5', required: 80, allocated: 80, unit: 'tấn' },
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    code: 'KH002',
    productId: '2',
    quantity: 150,
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'draft',
    shift: 'afternoon',
    line: 'Dây chuyền 2',
    team: 'Tổ 2',
    materialsAllocated: [
      { materialId: '4', required: 75, allocated: 0, unit: 'tấn' },
      { materialId: '6', required: 75, allocated: 0, unit: 'tấn' },
    ],
    createdAt: new Date().toISOString()
  },
];

export const initialEmployees: Employee[] = [
  { id: '1', code: 'NV001', name: 'Nguyễn Văn An', position: 'Tổ trưởng', department: 'Sản xuất', team: 'Tổ 1', phone: '0901111111', email: 'an.nguyen@nhamay.com', status: 'active', skills: ['Vận hành lò', 'Kiểm soát chất lượng'], createdAt: new Date().toISOString() },
  { id: '2', code: 'NV002', name: 'Trần Thị Bình', position: 'Công nhân', department: 'Sản xuất', team: 'Tổ 1', phone: '0902222222', email: 'binh.tran@nhamay.com', status: 'active', skills: ['Pha chế', 'Đóng gói'], createdAt: new Date().toISOString() },
  { id: '3', code: 'NV003', name: 'Lê Văn Cường', position: 'Công nhân', department: 'Sản xuất', team: 'Tổ 2', phone: '0903333333', email: 'cuong.le@nhamay.com', status: 'active', skills: ['Vận hành máy tạo hạt'], createdAt: new Date().toISOString() },
  { id: '4', code: 'NV004', name: 'Phạm Thị Dung', position: 'Kiểm soát chất lượng', department: 'QA/QC', team: 'Tổ 1', phone: '0904444444', email: 'dung.pham@nhamay.com', status: 'active', skills: ['Kiểm tra chất lượng', 'Phân tích mẫu'], createdAt: new Date().toISOString() },
  { id: '5', code: 'NV005', name: 'Hoàng Văn Em', position: 'Công nhân', department: 'Sản xuất', team: 'Tổ 3', phone: '0905555555', email: 'em.hoang@nhamay.com', status: 'active', skills: ['Bảo trì', 'Sửa chữa'], createdAt: new Date().toISOString() },
];

export const initialProductionOrders: ProductionOrder[] = [
  {
    id: '1',
    code: 'LSX001',
    planId: '1',
    productId: '1',
    quantity: 50,
    unit: 'tấn',
    priority: 'high',
    status: 'in_progress',
    source: 'plan',
    orderDate: new Date().toISOString(),
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTeam: 'Tổ 1',
    assignedLine: 'Dây chuyền 1',
    supervisor: 'Nguyễn Văn An',
    notes: 'Sản xuất theo kế hoạch KH001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    code: 'LSX002',
    planId: '2',
    productId: '2',
    quantity: 30,
    unit: 'tấn',
    priority: 'medium',
    status: 'pending',
    source: 'plan',
    orderDate: new Date().toISOString(),
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTeam: 'Tổ 2',
    assignedLine: 'Dây chuyền 2',
    supervisor: 'Lê Văn Cường',
    notes: 'Sản xuất theo kế hoạch KH002',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    code: 'LSX003',
    productId: '1',
    quantity: 20,
    unit: 'tấn',
    priority: 'low',
    status: 'pending',
    source: 'manual',
    orderDate: new Date().toISOString(),
    startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTeam: 'Tổ 3',
    assignedLine: 'Dây chuyền 1',
    supervisor: 'Hoàng Văn Em',
    notes: 'Lệnh sản xuất bổ sung',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

export const initialWorkAssignments: WorkAssignment[] = [
  {
    id: '1',
    orderId: '1',
    stage: 'Pha chế nguyên liệu',
    stageOrder: 1,
    assignedTo: 'Trần Thị Bình',
    team: 'Tổ 1',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    instruction: 'Pha chế hỗn hợp theo tỷ lệ 1:0.6:0.4',
    sop: '/sop/pha-che-ure.pdf',
    bom: '/bom/ure-bom.pdf',
    completedQuantity: 30,
    qualityCheck: 'pending',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    orderId: '1',
    stage: 'Tạo hạt',
    stageOrder: 2,
    assignedTo: 'Nguyễn Văn An',
    team: 'Tổ 1',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    instruction: 'Tạo hạt với kích thước 2-4mm',
    sop: '/sop/tao-hat-ure.pdf',
    bom: '/bom/ure-bom.pdf',
    completedQuantity: 0,
    qualityCheck: 'pending',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    orderId: '1',
    stage: 'Sấy và đóng gói',
    stageOrder: 3,
    assignedTo: 'Trần Thị Bình',
    team: 'Tổ 1',
    startTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    instruction: 'Sấy ở nhiệt độ 60°C, đóng bao 50kg',
    sop: '/sop/say-dong-goi.pdf',
    bom: '/bom/ure-bom.pdf',
    completedQuantity: 0,
    qualityCheck: 'pending',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

export const initialWorkShiftsReal: WorkShiftReal[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    shift: 'morning',
    team: 'Tổ 1',
    employees: ['1', '2', '4'],
    orders: ['1'],
    status: 'in_progress',
    notes: 'Ca sáng sản xuất Phân Ure',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    date: new Date().toISOString().split('T')[0],
    shift: 'afternoon',
    team: 'Tổ 2',
    employees: ['3'],
    orders: ['2'],
    status: 'scheduled',
    notes: 'Ca chiều sản xuất Phân DAP',
    createdAt: new Date().toISOString()
  },
];

export const initialQualityControls: QualityControl[] = [
  {
    id: '1',
    orderId: '1',
    stage: 'Pha chế nguyên liệu',
    checkTime: new Date().toISOString(),
    inspector: 'Phạm Thị Dung',
    sampleSize: 5,
    defects: 0,
    status: 'passed',
    notes: 'Đạt yêu cầu chất lượng',
    createdAt: new Date().toISOString()
  },
];

export const initialMaterialRequests: MaterialRequest[] = [
  {
    id: '1',
    code: 'VT001',
    orderId: '1',
    materialId: '4',
    quantity: 30,
    unit: 'tấn',
    purpose: 'Sản xuất Phân Ure theo lệnh LSX001',
    status: 'approved',
    requestedBy: 'Nguyễn Văn An',
    approvedBy: 'Trần Văn Đức',
    requestDate: new Date().toISOString(),
    approvalDate: new Date().toISOString(),
    notes: 'Đã kiểm tra tồn kho đủ',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    code: 'VT002',
    orderId: '2',
    materialId: '5',
    quantity: 20,
    unit: 'tấn',
    purpose: 'Sản xuất Phân DAP theo lệnh LSX002',
    status: 'pending',
    requestedBy: 'Lê Văn Cường',
    requestDate: new Date().toISOString(),
    notes: 'Cần bổ sung thêm 10 tấn từ kho dự trữ',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialTransfers: ProductionTransfer[] = [
  {
    id: '1',
    code: 'BC001',
    fromOrderId: '1',
    toOrderId: '2',
    productId: '4',
    quantity: 10,
    unit: 'tấn',
    fromStage: 'Pha chế nguyên liệu',
    toStage: 'Tạo hạt',
    fromTeam: 'Tổ 1',
    toTeam: 'Tổ 2',
    transferDate: new Date().toISOString(),
    status: 'completed',
    note: 'Bàn giao bán thành phẩm Amoniac',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];


export const initialQualityCheckRequests: QualityCheckRequest[] = [
  {
    id: '1',
    code: 'QC001',
    orderId: '1',
    stage: 'Tạo hạt',
    sampleSize: 10,
    status: 'pending',
    assignedTo: 'Phạm Thị Dung',
    checkDate: new Date().toISOString(),
    notes: 'Kiểm tra chất lượng hạt Ure',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialMaterialDisposals: MaterialDisposal[] = [
  {
    id: '1',
    orderId: '1',
    materialId: '4',
    quantity: 0.5,
    unit: 'tấn',
    type: 'waste',
    reason: 'Hao hụt trong quá trình sản xuất',
    date: new Date().toISOString(),
    status: 'approved',
    approvedBy: 'Trần Văn Đức',
    notes: 'Trong định mức cho phép',
    createdAt: new Date().toISOString()
  }
];

export const initialProductionStatistics: ProductionStatistic[] = [
  {
    id: '1',
    orderId: '1',
    date: new Date().toISOString().split('T')[0],
    employeeId: '1',
    machineId: '1',
    quantity: 15,
    unit: 'tấn',
    materialConsumption: [
      { materialId: '4', planned: 18, actual: 17.5, unit: 'tấn' }
    ],
    defectQuantity: 0.2,
    operatingTime: 360,
    createdAt: new Date().toISOString()
  }
];

export const initialQualityStandards: QualityStandard[] = [
  {
    id: '1',
    code: 'TC001',
    name: 'Tiêu chuẩn Phân Ure',
    productId: '1',
    samplingMethod: 'random',
    sampleSize: 10,
    criteria: [
      { id: 'c1', name: 'Hàm lượng Nito', type: 'numerical', minValue: 46, maxValue: 46.5, unit: '%' },
      { id: 'c2', name: 'Độ ẩm', type: 'numerical', minValue: 0, maxValue: 0.5, unit: '%' },
      { id: 'c3', name: 'Kích thước hạt', type: 'numerical', minValue: 1, maxValue: 3, unit: 'mm' },
      { id: 'c4', name: 'Màu sắc', type: 'text', description: 'Trắng hoặc vàng nhạt' }
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    code: 'TC002',
    name: 'Tiêu chuẩn Phân DAP',
    productId: '2',
    samplingMethod: 'systematic',
    sampleSize: 8,
    criteria: [
      { id: 'c5', name: 'Hàm lượng P2O5', type: 'numerical', minValue: 46, maxValue: 47, unit: '%' },
      { id: 'c6', name: 'Độ ẩm', type: 'numerical', minValue: 0, maxValue: 0.5, unit: '%' },
      { id: 'c7', name: 'Kích thước hạt', type: 'numerical', minValue: 2, maxValue: 4, unit: 'mm' }
    ],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialDefectTypes: DefectType[] = [
  { id: '1', code: 'L001', name: 'Hạt vỡ', category: 'major', description: 'Hạt bị vỡ, không đạt kích thước yêu cầu', severity: 3, createdAt: new Date().toISOString() },
  { id: '2', code: 'L002', name: 'Độ ẩm cao', category: 'major', description: 'Độ ẩm vượt ngưỡng cho phép', severity: 4, createdAt: new Date().toISOString() },
  { id: '3', code: 'L003', name: 'Hàm lượng thấp', category: 'critical', description: 'Hàm lượng dinh dưỡng thấp hơn tiêu chuẩn', severity: 5, createdAt: new Date().toISOString() },
  { id: '4', code: 'L004', name: 'Bị ẩm mốc', category: 'critical', description: 'Sản phẩm bị ẩm mốc, không sử dụng được', severity: 5, createdAt: new Date().toISOString() },
  { id: '5', code: 'L005', name: 'Màu sắc không đạt', category: 'minor', description: 'Màu sắc không đồng đều, khác mẫu', severity: 2, createdAt: new Date().toISOString() }
];

export const initialQualityCheckRecords: QualityCheckRecord[] = [
  {
    id: '1',
    code: 'QC001',
    orderId: '1',
    stage: 'Tạo hạt',
    inspector: 'Phạm Thị Dung',
    checkDate: new Date().toISOString(),
    sampleSize: 10,
    defects: [
      { defectTypeId: '1', quantity: 1, severity: 3, description: '1 hạt bị vỡ' }
    ],
    result: 'passed',
    notes: 'Chất lượng đạt yêu cầu',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialProductDisposals: ProductDisposal[] = [
  {
    id: '1',
    code: 'HH001',
    orderId: '1',
    productId: '1',
    quantity: 0.5,
    unit: 'tấn',
    reason: 'Độ ẩm cao vượt tiêu chuẩn',
    defectTypeId: '2',
    disposalType: 'scrap',
    status: 'approved',
    approvedBy: 'Trần Văn Đức',
    disposalDate: new Date().toISOString(),
    notes: 'Hủy do chất lượng không đạt',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ============ MODULE 5: KHO SẢN XUẤT ============
export const initialWarehouses: Warehouse[] = [
  { id: '1', code: 'KHO001', name: 'Kho Nguyên liệu', type: 'raw', location: 'Khu A - Nhà kho 1', manager: 'Nguyễn Văn Hùng', status: 'active', createdAt: new Date().toISOString() },
  { id: '2', code: 'KHO002', name: 'Kho Bán thành phẩm', type: 'semi', location: 'Khu B - Nhà kho 2', manager: 'Trần Thị Lan', status: 'active', createdAt: new Date().toISOString() },
  { id: '3', code: 'KHO003', name: 'Kho Thành phẩm', type: 'finished', location: 'Khu C - Nhà kho 3', manager: 'Lê Văn Minh', status: 'active', createdAt: new Date().toISOString() }
];

export const initialWarehouseItems: WarehouseItem[] = [
  { id: '1', warehouseId: '1', materialId: '1', quantity: 500, unit: 'tấn', minStock: 100, maxStock: 1000, batchNumber: 'LOT2026-001', location: 'Kệ A1', updatedAt: new Date().toISOString() },
  { id: '2', warehouseId: '1', materialId: '2', quantity: 300, unit: 'tấn', minStock: 50, maxStock: 800, batchNumber: 'LOT2026-002', location: 'Kệ A2', updatedAt: new Date().toISOString() },
  { id: '3', warehouseId: '2', materialId: '4', quantity: 200, unit: 'tấn', minStock: 30, maxStock: 500, batchNumber: 'LOT2026-003', location: 'Kệ B1', updatedAt: new Date().toISOString() },
  { id: '4', warehouseId: '3', materialId: '7', quantity: 400, unit: 'tấn', minStock: 50, maxStock: 800, batchNumber: 'LOT2026-004', location: 'Kệ C1', updatedAt: new Date().toISOString() }
];

export const initialStockMovements: StockMovement[] = [
  {
    id: '1',
    code: 'NK001',
    warehouseId: '1',
    materialId: '1',
    type: 'import',
    quantity: 100,
    unit: 'tấn',
    orderId: '1',
    reason: 'Nhập nguyên liệu phục vụ sản xuất',
    createdBy: 'Nguyễn Văn Hùng',
    approvedBy: 'Trần Văn Đức',
    movementDate: new Date().toISOString(),
    status: 'completed',
    notes: 'Nhập kho từ nhà cung cấp A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    code: 'XK001',
    warehouseId: '1',
    materialId: '1',
    type: 'export',
    quantity: 50,
    unit: 'tấn',
    orderId: '1',
    reason: 'Xuất kho sản xuất lệnh LSX001',
    createdBy: 'Nguyễn Văn Hùng',
    approvedBy: 'Trần Văn Đức',
    movementDate: new Date().toISOString(),
    status: 'completed',
    notes: 'Xuất cho sản xuất',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialInventoryOpenings: InventoryOpening[] = [
  {
    id: '1',
    warehouseId: '1',
    materialId: '1',
    quantity: 500,
    unit: 'tấn',
    batchNumber: 'LOT2026-001',
    date: new Date().toISOString().split('T')[0],
    notes: 'Tồn kho đầu kỳ tháng 6/2026',
    createdAt: new Date().toISOString()
  }
];

export const initialInventoryCounts: InventoryCount[] = [
  {
    id: '1',
    code: 'KK001',
    warehouseId: '1',
    materialId: '1',
    systemQuantity: 500,
    actualQuantity: 498,
    unit: 'tấn',
    difference: -2,
    countedBy: 'Nguyễn Văn Hùng',
    countDate: new Date().toISOString().split('T')[0],
    notes: 'Chênh lệch do hao hụt',
    status: 'approved',
    approvedBy: 'Trần Văn Đức',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialInventoryAdjustments: InventoryAdjustment[] = [
  {
    id: '1',
    code: 'ĐC001',
    warehouseId: '1',
    materialId: '1',
    oldQuantity: 500,
    newQuantity: 498,
    difference: -2,
    unit: 'tấn',
    reason: 'Điều chỉnh theo kiểm kê',
    adjustedBy: 'Nguyễn Văn Hùng',
    approvedBy: 'Trần Văn Đức',
    adjustmentDate: new Date().toISOString().split('T')[0],
    status: 'approved',
    notes: 'Điều chỉnh chênh lệch tồn kho',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialTraceabilityBatches: TraceabilityBatch[] = [
  {
    id: '1',
    code: 'LX001',
    productId: '1',
    productName: 'Phân Ure',
    quantity: 50,
    unit: 'tấn',
    productionDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    batchNumber: 'URE-2026-001',
    status: 'completed',
    materials: [
      {
        materialId: '1',
        materialName: 'Quặng Apatit',
        batchNumber: 'AP-2026-001',
        supplier: 'Công ty Khoáng sản A',
        quantity: 30,
        unit: 'tấn',
        receiptDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        qcStatus: 'passed'
      },
      {
        materialId: '2',
        materialName: 'Than cốc',
        batchNumber: 'TC-2026-002',
        supplier: 'Công ty Than B',
        quantity: 20,
        unit: 'tấn',
        receiptDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        qcStatus: 'passed'
      }
    ],
    stages: [
      {
        stageName: 'Pha chế nguyên liệu',
        startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
        operator: 'Nguyễn Văn An',
        machine: 'Máy trộn 01',
        status: 'completed',
        notes: 'Pha chế đạt yêu cầu'
      },
      {
        stageName: 'Tạo hạt',
        startTime: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        operator: 'Trần Thị Bình',
        machine: 'Máy tạo hạt 01',
        status: 'completed'
      },
      {
        stageName: 'Sấy và đóng gói',
        startTime: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        operator: 'Lê Văn Cường',
        machine: 'Máy sấy 01',
        status: 'completed'
      }
    ],
    qcResults: [
      {
        stage: 'Tạo hạt',
        checkTime: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        inspector: 'Phạm Thị Dung',
        result: 'passed',
        notes: 'Chất lượng đạt tiêu chuẩn'
      }
    ],
    shippingInfo: {
      orderNumber: 'DH2026-001',
      customer: 'Công ty Phân bón X',
      shippingDate: new Date().toISOString(),
      quantity: 50,
      unit: 'tấn',
      destination: 'Hải Phòng',
      status: 'shipped',
      trackingNumber: 'VNK-2026-001'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ============ MODULE 7: QUẢN LÝ ĐA NHÀ MÁY ============
export const initialFactories: Factory[] = [
  {
    id: '1',
    code: 'NM001',
    name: 'Nhà máy Đạm Hà Bắc',
    nameEn: 'Ha Bac Fertilizer Plant',
    address: 'Khu công nghiệp Hà Bắc, Việt Yên, Bắc Giang',
    phone: '0204 123 456',
    email: 'habac@nhamaydam.com',
    manager: 'Nguyễn Văn Đức',
    status: 'active',
    productionLines: [
      { id: '1', code: 'DL001', name: 'Dây chuyền sản xuất Ure 1', capacity: 100, unit: 'tấn/ngày', status: 'active', supervisor: 'Trần Văn Hùng' },
      { id: '2', code: 'DL002', name: 'Dây chuyền sản xuất Ure 2', capacity: 80, unit: 'tấn/ngày', status: 'maintenance', supervisor: 'Lê Thị Mai' }
    ],
    departments: [
      { id: '1', code: 'PB001', name: 'Phòng Sản xuất', manager: 'Nguyễn Văn Đức', employeeCount: 50, status: 'active' },
      { id: '2', code: 'PB002', name: 'Phòng Kỹ thuật', manager: 'Trần Văn Hùng', employeeCount: 30, status: 'active' },
      { id: '3', code: 'PB003', name: 'Phòng QC', manager: 'Phạm Thị Lan', employeeCount: 20, status: 'active' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    code: 'NM002',
    name: 'Nhà máy Đạm Ninh Bình',
    nameEn: 'Ninh Binh Fertilizer Plant',
    address: 'Khu công nghiệp Ninh Bình, Ninh Bình',
    phone: '0229 456 789',
    email: 'ninhbinh@nhamaydam.com',
    manager: 'Lê Văn Thành',
    status: 'active',
    productionLines: [
      { id: '3', code: 'DL003', name: 'Dây chuyền sản xuất DAP', capacity: 60, unit: 'tấn/ngày', status: 'active', supervisor: 'Nguyễn Văn An' }
    ],
    departments: [
      { id: '4', code: 'PB004', name: 'Phòng Sản xuất', manager: 'Lê Văn Thành', employeeCount: 40, status: 'active' },
      { id: '5', code: 'PB005', name: 'Phòng Kỹ thuật', manager: 'Nguyễn Văn An', employeeCount: 25, status: 'active' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialFactoryData: FactoryData[] = [
  {
    id: '1',
    factoryId: '1',
    date: new Date().toISOString().split('T')[0],
    productionQuantity: 85,
    unit: 'tấn',
    efficiency: 85,
    downtime: 45,
    defects: 3,
    oee: 72.25,
    notes: 'Sản xuất ổn định',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    factoryId: '2',
    date: new Date().toISOString().split('T')[0],
    productionQuantity: 50,
    unit: 'tấn',
    efficiency: 83.3,
    downtime: 30,
    defects: 2,
    oee: 70.8,
    notes: 'Hiệu suất tốt',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ============ MODULE 12: ĐA NGÔN NGỮ ============
export const initialTranslations: Translation[] = [
  // Common
  { id: '1', key: 'dashboard', vi: 'Tổng quan', en: 'Dashboard', ja: 'ダッシュボード', ko: '대시보드', module: 'common', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', key: 'catalog', vi: 'Danh mục sản xuất', en: 'Production Catalog', ja: '生産カタログ', ko: '생산 카탈로그', module: 'common', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', key: 'plan', vi: 'Kế hoạch sản xuất', en: 'Production Plan', ja: '生産計画', ko: '생산 계획', module: 'common', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', key: 'execution', vi: 'Thực thi sản xuất', en: 'Production Execution', ja: '生産実行', ko: '생산 실행', module: 'common', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', key: 'quality', vi: 'Quản lý chất lượng', en: 'Quality Management', ja: '品質管理', ko: '품질 관리', module: 'common', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', key: 'warehouse', vi: 'Quản lý kho', en: 'Warehouse Management', ja: '倉庫管理', ko: '창고 관리', module: 'common', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '7', key: 'traceability', vi: 'Truy xuất nguồn gốc', en: 'Traceability', ja: 'トレーサビリティ', ko: '추적성', module: 'common', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '8', key: 'factories', vi: 'Quản lý nhà máy', en: 'Factory Management', ja: '工場管理', ko: '공장 관리', module: 'common', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '9', key: 'settings', vi: 'Cài đặt', en: 'Settings', ja: '設定', ko: '설정', module: 'common', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '10', key: 'machines', vi: 'Quản lý máy móc', en: 'Machine Management', ja: '機械管理', ko: '기계 관리', module: 'common', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '11', key: 'teams', vi: 'Quản lý tổ đội', en: 'Team Management', ja: 'チーム管理', ko: '팀 관리', module: 'common', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '12', key: 'supply', vi: 'Quản lý cung ứng', en: 'Supply Management', ja: '供給管理', ko: '공급 관리', module: 'common', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // Dashboard
  { id: '13', key: 'overview', vi: 'Tổng quan nhà máy', en: 'Factory Overview', ja: '工場概要', ko: '공장 개요', module: 'dashboard', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '14', key: 'total_materials', vi: 'Tổng nguyên vật liệu', en: 'Total Materials', ja: '総材料', ko: '총 자재', module: 'dashboard', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '15', key: 'finished_products', vi: 'Thành phẩm', en: 'Finished Products', ja: '完成品', ko: '완제품', module: 'dashboard', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '16', key: 'in_progress', vi: 'Đang thực hiện', en: 'In Progress', ja: '実行中', ko: '진행 중', module: 'dashboard', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '17', key: 'completed', vi: 'Hoàn thành', en: 'Completed', ja: '完了', ko: '완료', module: 'dashboard', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '18', key: 'pending', vi: 'Chờ duyệt', en: 'Pending', ja: '保留中', ko: '보류 중', module: 'dashboard', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '19', key: 'inventory', vi: 'Tồn kho & Giá trị', en: 'Inventory & Value', ja: '在庫と価値', ko: '재고 및 가치', module: 'dashboard', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '20', key: 'low_stock_warning', vi: 'Cảnh báo tồn kho thấp', en: 'Low Stock Warning', ja: '低在庫警告', ko: '재고 부족 경고', module: 'dashboard', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '21', key: 'total_quantity', vi: 'Tổng số lượng tồn kho', en: 'Total Stock Quantity', ja: '総在庫量', ko: '총 재고 수량', module: 'dashboard', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '22', key: 'total_value', vi: 'Tổng giá trị tồn kho', en: 'Total Stock Value', ja: '総在庫価値', ko: '총 재고 가치', module: 'dashboard', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '23', key: 'material_types', vi: 'Số loại nguyên liệu', en: 'Material Types', ja: '材料タイプ', ko: '자재 유형', module: 'dashboard', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '24', key: 'all_materials_ok', vi: 'Tất cả nguyên liệu đều đạt mức tồn kho tối thiểu', en: 'All materials meet minimum stock level', ja: 'すべての材料が最小在庫レベルを満たしています', ko: '모든 자재가 최소 재고 수준을 충족합니다', module: 'dashboard', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // Catalog
  { id: '25', key: 'catalog_description', vi: 'Quản lý thành phẩm, bán thành phẩm và nguyên vật liệu', en: 'Manage finished products, semi-finished products and raw materials', ja: '完成品、半製品、原材料の管理', ko: '완제품, 반제품 및 원자재 관리', module: 'catalog', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '26', key: 'add_new', vi: 'Thêm mới', en: 'Add New', ja: '新規追加', ko: '새로 추가', module: 'catalog', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '27', key: 'materials', vi: 'Nguyên vật liệu', en: 'Materials', ja: '材料', ko: '자재', module: 'catalog', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '28', key: 'products', vi: 'Sản phẩm', en: 'Products', ja: '製品', ko: '제품', module: 'catalog', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '29', key: 'raw_materials', vi: 'Nguyên liệu thô', en: 'Raw Materials', ja: '原材料', ko: '원자재', module: 'catalog', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '30', key: 'semi_finished', vi: 'Bán thành phẩm', en: 'Semi-finished', ja: '半製品', ko: '반제품', module: 'catalog', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '31', key: 'total_bom', vi: 'Tổng định mức', en: 'Total BOM', ja: '総BOM', ko: '총 BOM', module: 'catalog', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  
  // Plan
  { id: '32', key: 'plan_description', vi: 'Lập và điều chỉnh kế hoạch sản xuất chi tiết', en: 'Create and adjust detailed production plans', ja: '詳細な生産計画の作成と調整', ko: '상세 생산 계획 수립 및 조정', module: 'plan', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '33', key: 'create_plan', vi: 'Tạo kế hoạch', en: 'Create Plan', ja: '計画作成', ko: '계획 생성', module: 'plan', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '34', key: 'total_plans', vi: 'Tổng kế hoạch', en: 'Total Plans', ja: '総計画', ko: '총 계획', module: 'plan', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '35', key: 'draft', vi: 'Nháp', en: 'Draft', ja: '下書き', ko: '초안', module: 'plan', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '36', key: 'material_check', vi: 'Kiểm tra đáp ứng nguyên vật liệu', en: 'Material Availability Check', ja: '材料可用性チェック', ko: '자재 가용성 확인', module: 'plan', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const initialLanguageConfig: LanguageConfig = {
  currentLanguage: 'vi',
  languages: [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', active: true },
    { code: 'en', name: 'English', flag: '🇬🇧', active: true },
    { code: 'ja', name: '日本語', flag: '🇯🇵', active: true },
    { code: 'ko', name: '한국어', flag: '🇰🇷', active: true }
  ]
};

// ============ MODULE 10: CHI PHÍ SẢN XUẤT ============
export const initialCostStandards: CostStandard[] = [
  { 
    id: '1', 
    code: 'DM001', 
    productId: '1', 
    materialCost: 3000000, 
    laborCost: 1000000, 
    overheadCost: 500000, 
    totalCost: 4500000, 
    unit: 'tấn', 
    effectiveDate: new Date().toISOString(), 
    status: 'active', 
    notes: 'Định mức chuẩn', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  }
];

export const initialCostEstimates: CostEstimate[] = [
  { 
    id: '1', 
    code: 'DT001', 
    orderId: '1', 
    planId: '1', 
    productId: '1', 
    quantity: 50, 
    unit: 'tấn', 
    estimatedMaterialCost: 3000000, 
    estimatedLaborCost: 1000000, 
    estimatedOverheadCost: 500000, 
    totalEstimatedCost: 4500000, 
    status: 'approved', 
    notes: 'Dự toán cho kế hoạch KH001', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  }
];

export const initialPackagingItems: PackagingItem[] = [
  { 
    id: '1', 
    code: 'DG001', 
    name: 'Thùng carton 50kg', 
    type: 'box', 
    unit: 'cái', 
    price: 20000, 
    quantity: 500, 
    minStock: 100, 
    status: 'active', 
    notes: 'Đóng bao 50kg', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: '2', 
    code: 'DG002', 
    name: 'Bao PP 50kg', 
    type: 'bag', 
    unit: 'cái', 
    price: 15000, 
    quantity: 1000, 
    minStock: 200, 
    status: 'active', 
    notes: 'Bao đựng phân bón', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  }
];

export const initialLabelManagements: LabelManagement[] = [
  { 
    id: '1', 
    code: 'TN001', 
    productId: '1', 
    name: 'Nhãn Phân Ure', 
    template: 'Mẫu 01', 
    size: '100x150mm', 
    material: 'Giấy decal', 
    quantity: 2000, 
    unit: 'cái', 
    status: 'active', 
    notes: 'Nhãn sản phẩm chuẩn', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  }
];

// ============ MODULE 8: GIA CÔNG ============
export const initialSubcontractors: Subcontractor[] = [
  { 
    id: '1', 
    code: 'GC001', 
    name: 'Công ty Gia công ABC', 
    address: 'KCN Hà Nội, Quận Cầu Giấy, Hà Nội', 
    phone: '024 123 4567', 
    email: 'abc@giaocong.com', 
    taxCode: '1234567890', 
    status: 'active', 
    rating: 4, 
    notes: 'Đối tác lâu năm, uy tín', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: '2', 
    code: 'GC002', 
    name: 'Công ty Gia công XYZ', 
    address: 'KCN Bình Dương, TP. Thủ Dầu Một, Bình Dương', 
    phone: '065 789 0123', 
    email: 'xyz@giaocong.com', 
    taxCode: '9876543210', 
    status: 'active', 
    rating: 3, 
    notes: 'Đối tác mới, giá cả cạnh tranh', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  }
];

export const initialOutsourcingOrders: OutsourcingOrder[] = [
  {
    id: '1', 
    code: 'GC001', 
    subcontractorId: '1', 
    productId: '1', 
    quantity: 50, 
    unit: 'tấn',
    startDate: new Date().toISOString(), 
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress', 
    cost: 50000000, 
    currency: 'VND', 
    deliveryAddress: 'KCN Hà Nội, Quận Cầu Giấy, Hà Nội',
    notes: 'Gia công Phân Ure theo đơn hàng DH001', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString()
  }
];

export const initialInternalProcessings: InternalProcessing[] = [
  {
    id: '1',
    code: 'NB001',
    orderId: '1',
    stage: 'Pha chế nguyên liệu',
    assignedTeam: 'Tổ 1',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    quantity: 50,
    unit: 'tấn',
    cost: 10000000,
    notes: 'Đang pha chế nguyên liệu',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    code: 'NB002',
    orderId: '1',
    stage: 'Tạo hạt',
    assignedTeam: 'Tổ 2',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    quantity: 48,
    unit: 'tấn',
    cost: 8000000,
    notes: 'Chờ nguyên liệu từ công đoạn trước',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ============ MODULE 9: QUẢN LÝ PHẾ LIỆU ============
export const initialScrapMaterials: ScrapMaterial[] = [
  { 
    id: '1', 
    code: 'PL001', 
    orderId: '1', 
    materialId: '4', 
    quantity: 0.5, 
    unit: 'tấn', 
    type: 'scrap', 
    reason: 'Hao hụt trong quá trình pha chế', 
    date: new Date().toISOString(), 
    status: 'approved', 
    approvedBy: 'Trần Văn Đức', 
    notes: 'Trong định mức cho phép', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: '2', 
    code: 'PL002', 
    orderId: '1', 
    materialId: '5', 
    quantity: 0.3, 
    unit: 'tấn', 
    type: 'defect', 
    reason: 'Sản phẩm không đạt chất lượng', 
    date: new Date().toISOString(), 
    status: 'pending', 
    notes: 'Chờ xử lý', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  }
];

export const initialDismantleOrders: DismantleOrder[] = [
  {
    id: '1', 
    code: 'TD001', 
    productId: '1', 
    quantity: 2, 
    unit: 'tấn', 
    reason: 'Sản phẩm lỗi kỹ thuật', 
    date: new Date().toISOString(),
    status: 'approved', 
    materials: [
      { 
        materialId: '4', 
        materialName: 'Amoniac', 
        quantity: 0.8, 
        unit: 'tấn', 
        recoveryRate: 80, 
        condition: 'good' 
      },
      { 
        materialId: '5', 
        materialName: 'Ure nóng chảy', 
        quantity: 0.6, 
        unit: 'tấn', 
        recoveryRate: 75, 
        condition: 'fair' 
      }
    ],
    notes: 'Tháo dỡ để tái sử dụng nguyên liệu', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  }
];

export const initialScrapTrackings: ScrapTracking[] = [
  { 
    id: '1', 
    code: 'TV001', 
    scrapId: '1', 
    fromStage: 'Pha chế nguyên liệu', 
    toStage: 'Kho phế liệu', 
    quantity: 0.5, 
    unit: 'tấn', 
    date: new Date().toISOString(), 
    status: 'completed', 
    notes: 'Đã chuyển về kho phế liệu', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  }
];

export const initialProductionReports: ProductionReport[] = Array.from({ length: 30 }, (_, i) => ({
  id: `PR${String(i + 1).padStart(3, '0')}`,
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
  planId: i % 2 === 0 ? '1' : '2',
  productId: i % 2 === 0 ? '1' : '2',
  plannedQuantity: 50 + Math.random() * 30,
  actualQuantity: 45 + Math.random() * 35,
  unit: 'tấn',
  completionRate: 85 + Math.random() * 15,
  status: Math.random() > 0.7 ? 'delayed' : Math.random() > 0.4 ? 'on_track' : 'ahead',
  createdAt: new Date().toISOString()
}));

export const initialMaterialConsumptionReports: MaterialConsumptionReport[] = Array.from({ length: 20 }, (_, i) => ({
  id: `MCR${String(i + 1).padStart(3, '0')}`,
  date: new Date(Date.now() - (19 - i) * 24 * 60 * 60 * 1000).toISOString(),
  orderId: '1',
  materialId: String((i % 4) + 1),
  plannedQuantity: 10 + Math.random() * 20,
  actualQuantity: 9 + Math.random() * 21,
  unit: 'tấn',
  consumptionRate: 85 + Math.random() * 15,
  wastage: 0.2 + Math.random() * 0.8,
  createdAt: new Date().toISOString()
}));

export const initialQualityReports: QualityReport[] = Array.from({ length: 20 }, (_, i) => ({
  id: `QR${String(i + 1).padStart(3, '0')}`,
  date: new Date(Date.now() - (19 - i) * 24 * 60 * 60 * 1000).toISOString(),
  orderId: '1',
  productId: i % 2 === 0 ? '1' : '2',
  totalQuantity: 80 + Math.random() * 40,
  defectQuantity: Math.floor(Math.random() * 5),
  defectRate: Math.random() * 5,
  defectTypes: [
    { defectTypeId: '1', count: Math.floor(Math.random() * 3) },
    { defectTypeId: '2', count: Math.floor(Math.random() * 2) }
  ],
  passRate: 95 + Math.random() * 5,
  createdAt: new Date().toISOString()
}));

export const initialInventoryReports: InventoryReport[] = Array.from({ length: 15 }, (_, i) => ({
  id: `IR${String(i + 1).padStart(3, '0')}`,
  date: new Date(Date.now() - (14 - i) * 24 * 60 * 60 * 1000).toISOString(),
  warehouseId: '1',
  materialId: String((i % 4) + 1),
  openingQuantity: 100 + Math.random() * 200,
  importedQuantity: 20 + Math.random() * 50,
  exportedQuantity: 15 + Math.random() * 45,
  closingQuantity: 80 + Math.random() * 180,
  unit: 'tấn',
  turnoverRate: 5 + Math.random() * 10,
  createdAt: new Date().toISOString()
}));

export const initialCostReports: CostReport[] = Array.from({ length: 15 }, (_, i) => ({
  id: `CR${String(i + 1).padStart(3, '0')}`,
  date: new Date(Date.now() - (14 - i) * 24 * 60 * 60 * 1000).toISOString(),
  productId: i % 2 === 0 ? '1' : '2',
  actualMaterialCost: 3000000 + Math.random() * 1000000,
  actualLaborCost: 1000000 + Math.random() * 500000,
  actualOverheadCost: 500000 + Math.random() * 300000,
  totalCost: 4500000 + Math.random() * 1800000,
  unit: 'tấn',
  variance: -5 + Math.random() * 10,
  createdAt: new Date().toISOString()
}));

export const initialOEEIndicators: OEEIndicator[] = Array.from({ length: 30 }, (_, i) => {
  const availability = 80 + Math.random() * 15;
  const performance = 75 + Math.random() * 20;
  const quality = 90 + Math.random() * 8;
  return {
    id: `OEE${String(i + 1).padStart(3, '0')}`,
    machineId: String((i % 4) + 1),
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    shift: ['morning', 'afternoon', 'night'][i % 3] as any,
    availability: availability,
    performance: performance,
    quality: quality,
    oee: Math.round((availability * performance * quality) / 100),
    totalTime: 480,
    operatingTime: 380 + Math.random() * 80,
    downtime: 20 + Math.random() * 60,
    defects: Math.floor(Math.random() * 10),
    mtbf: 120 + Math.random() * 180,
    mttr: 15 + Math.random() * 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
});