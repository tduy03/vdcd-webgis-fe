export interface Material {
  id: string;
  code: string;
  name: string;
  type: 'raw' | 'semi' | 'finished';
  unit: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  price: number;
  createdAt: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  type: 'finished' | 'semi';
  unit: string;
  variants?: {
    color?: string[];
    size?: string[];
  };
  bom: MaterialRequirement[];
  createdAt: string;
}

export interface MaterialRequirement {
  materialId: string;
  quantity: number;
  wastageRate: number; // tỷ lệ hao hụt %
}

export interface ProductionPlan {
  id: string;
  code: string;
  productId: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  shift: 'morning' | 'afternoon' | 'night';
  line: string;
  team: string;
  materialsAllocated: MaterialAllocation[];
  createdAt: string;
}

export interface MaterialAllocation {
  materialId: string;
  required: number;
  allocated: number;
  unit: string;
}

export interface Machine {
  id: string;
  code: string;
  name: string;
  capacity: number;
  unit: string;
  status: 'active' | 'maintenance' | 'idle';
  team: string;
}

export interface WorkShift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  team: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager' | 'operator';
  email: string;
}

export interface ProductionOrder {
  id: string;
  code: string;
  planId?: string; // ID của kế hoạch sản xuất (nếu có)
  productId: string;
  quantity: number;
  unit: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  source: 'plan' | 'order' | 'manual'; // Nguồn tạo
  orderDate: string;
  startDate: string;
  endDate: string;
  assignedTeam: string;
  assignedLine: string;
  supervisor: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkAssignment {
  id: string;
  orderId: string;
  stage: string; // Tên công đoạn
  stageOrder: number; // Thứ tự công đoạn
  assignedTo: string; // ID nhân viên hoặc tên
  team: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  instruction: string; // Hướng dẫn thao tác
  sop?: string; // Link đến SOP
  bom?: string; // Link đến BOM
  completedQuantity: number;
  qualityCheck: 'pending' | 'passed' | 'failed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  code: string;
  name: string;
  position: string;
  department: string;
  team: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  skills: string[];
  createdAt: string;
}

export interface WorkShiftReal {
  id: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  team: string;
  employees: string[]; // IDs nhân viên
  orders: string[]; // IDs lệnh sản xuất
  status: 'scheduled' | 'in_progress' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface QualityControl {
  id: string;
  orderId: string;
  stage: string;
  checkTime: string;
  inspector: string;
  sampleSize: number;
  defects: number;
  status: 'passed' | 'failed' | 'pending';
  notes: string;
  createdAt: string;
}

export interface MaterialRequest {
  id: string;
  code: string;
  orderId: string;
  materialId: string;
  quantity: number;
  unit: string;
  purpose: string; // Mục đích sử dụng
  status: 'pending' | 'approved' | 'rejected' | 'issued';
  requestedBy: string;
  approvedBy?: string;
  requestDate: string;
  approvalDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionTransfer {
  id: string;
  code: string;
  fromOrderId: string;
  toOrderId: string;
  productId: string;
  quantity: number;
  unit: string;
  fromStage: string;
  toStage: string;
  fromTeam: string;
  toTeam: string;
  transferDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OEEIndicator {
  id: string;
  machineId: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  availability: number; // % thời gian hoạt động
  performance: number; // % hiệu suất
  quality: number; // % chất lượng
  oee: number; // % OEE tổng thể
  totalTime: number; // Tổng thời gian (phút)
  operatingTime: number; // Thời gian hoạt động (phút)
  downtime: number; // Thời gian ngừng (phút)
  defects: number; // Số lỗi
  createdAt: string;
  updatedAt: string;
}

export interface ProductionStatistic {
  id: string;
  orderId: string;
  date: string;
  employeeId: string;
  machineId: string;
  quantity: number;
  unit: string;
  materialConsumption: {
    materialId: string;
    planned: number;
    actual: number;
    unit: string;
  }[];
  defectQuantity: number;
  operatingTime: number;
  createdAt: string;
}

export interface QualityCheckRequest {
  id: string;
  code: string;
  orderId: string;
  stage: string;
  sampleSize: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string;
  checkDate: string;
  result?: {
    passed: number;
    failed: number;
    defects: string[];
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialDisposal {
  id: string;
  orderId: string;
  materialId: string;
  quantity: number;
  unit: string;
  type: 'waste' | 'defect' | 'expired';
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  notes?: string;
  createdAt: string;
}

// ============ MODULE 4: QUẢN LÝ CHẤT LƯỢNG (QC) ============
export interface QualityStandard {
  id: string;
  code: string;
  name: string;
  productId: string;
  samplingMethod: 'random' | 'systematic' | 'stratified';
  sampleSize: number;
  criteria: QualityCriterion[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface QualityCriterion {
  id: string;
  name: string;
  type: 'numerical' | 'boolean' | 'text';
  minValue?: number;
  maxValue?: number;
  unit?: string;
  description?: string;
}

export interface DefectType {
  id: string;
  code: string;
  name: string;
  category: 'critical' | 'major' | 'minor';
  description: string;
  severity: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
}

export interface QualityCheckRecord {
  id: string;
  code: string;
  orderId: string;
  stage: string;
  inspector: string;
  checkDate: string;
  sampleSize: number;
  defects: QualityDefect[];
  result: 'passed' | 'failed' | 'conditional';
  notes?: string;
  attachments?: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface QualityDefect {
  defectTypeId: string;
  quantity: number;
  severity: 1 | 2 | 3 | 4 | 5;
  description?: string;
}

export interface ProductDisposal {
  id: string;
  code: string;
  orderId: string;
  productId: string;
  quantity: number;
  unit: string;
  reason: string;
  defectTypeId?: string;
  disposalType: 'scrap' | 'rework' | 'downgrade' | 'return';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvedBy?: string;
  disposalDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ MODULE 5: KHO SẢN XUẤT ============
export interface Warehouse {
  id: string;
  code: string;
  name: string;
  type: 'raw' | 'semi' | 'finished' | 'general';
  location: string;
  manager: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface WarehouseItem {
  id: string;
  warehouseId: string;
  materialId: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  batchNumber?: string;
  expiryDate?: string;
  location?: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  code: string;
  warehouseId: string;
  materialId: string;
  type: 'import' | 'export' | 'transfer';
  quantity: number;
  unit: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  orderId?: string;
  reason: string;
  createdBy: string;
  approvedBy?: string;
  movementDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryOpening {
  id: string;
  warehouseId: string;
  materialId: string;
  quantity: number;
  unit: string;
  batchNumber?: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryCount {
  id: string;
  code: string;
  warehouseId: string;
  materialId: string;
  systemQuantity: number;
  actualQuantity: number;
  unit: string;
  difference: number;
  countedBy: string;
  countDate: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryAdjustment {
  id: string;
  code: string;
  warehouseId: string;
  materialId: string;
  oldQuantity: number;
  newQuantity: number;
  difference: number;
  unit: string;
  reason: string;
  adjustedBy: string;
  approvedBy?: string;
  adjustmentDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ MODULE 6: TRUY XUẤT NGUỒN GỐC ============
export interface TraceabilityBatch {
  id: string;
  code: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  productionDate: string;
  expiryDate?: string;
  batchNumber: string;
  status: 'in_production' | 'completed' | 'shipped' | 'qc_passed' | 'qc_failed';
  materials: TraceabilityMaterial[];
  stages: TraceabilityStage[];
  qcResults: TraceabilityQC[];
  shippingInfo?: TraceabilityShipping;
  createdAt: string;
  updatedAt: string;
}

export interface TraceabilityMaterial {
  materialId: string;
  materialName: string;
  batchNumber: string;
  supplier: string;
  quantity: number;
  unit: string;
  receiptDate: string;
  qcStatus: 'passed' | 'failed' | 'pending';
}

export interface TraceabilityStage {
  stageName: string;
  startTime: string;
  endTime: string;
  operator: string;
  machine: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
}

export interface TraceabilityQC {
  stage: string;
  checkTime: string;
  inspector: string;
  result: 'passed' | 'failed' | 'conditional';
  defects?: string[];
  notes?: string;
}

export interface TraceabilityShipping {
  orderNumber: string;
  customer: string;
  shippingDate: string;
  quantity: number;
  unit: string;
  destination: string;
  status: 'pending' | 'shipped' | 'delivered';
  trackingNumber?: string;
}

// ============ MODULE 7: QUẢN LÝ ĐA NHÀ MÁY ============
export interface Factory {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: 'active' | 'inactive';
  productionLines: ProductionLine[];
  departments: Department[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductionLine {
  id: string;
  code: string;
  name: string;
  capacity: number;
  unit: string;
  status: 'active' | 'maintenance' | 'inactive';
  supervisor: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  manager: string;
  employeeCount: number;
  status: 'active' | 'inactive';
}

export interface FactoryData {
  id: string;
  factoryId: string;
  date: string;
  productionQuantity: number;
  unit: string;
  efficiency: number; // %
  downtime: number; // phút
  defects: number;
  oee: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ MODULE 12: ĐA NGÔN NGỮ ============
export type Language = 'vi' | 'en' | 'ja' | 'ko';

export interface Translation {
  id: string;
  key: string;
  vi: string;
  en: string;
  ja: string;
  ko: string;
  module: string;
  createdAt: string;
  updatedAt: string;
}

export interface LanguageConfig {
  currentLanguage: Language;
  languages: {
    code: Language;
    name: string;
    flag: string;
    active: boolean;
  }[];
}

// ============ MODULE 8: GIA CÔNG ============
export interface Subcontractor {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  taxCode: string;
  status: 'active' | 'inactive';
  rating: number; // 1-5
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutsourcingOrder {
  id: string;
  code: string;
  subcontractorId: string;
  productId: string;
  quantity: number;
  unit: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  cost: number;
  currency: string;
  deliveryAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InternalProcessing {
  id: string;
  code: string;
  orderId: string;
  stage: string;
  assignedTeam: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  quantity: number;
  unit: string;
  cost: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ MODULE 9: QUẢN LÝ PHẾ LIỆU ============
export interface ScrapMaterial {
  id: string;
  code: string;
  orderId: string;
  materialId: string;
  quantity: number;
  unit: string;
  type: 'scrap' | 'defect' | 'waste';
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  approvedBy?: string;
  processedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DismantleOrder {
  id: string;
  code: string;
  productId: string;
  quantity: number;
  unit: string;
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  materials: DismantleMaterial[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DismantleMaterial {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  recoveryRate: number; // %
  condition: 'good' | 'fair' | 'poor';
}

export interface ScrapTracking {
  id: string;
  code: string;
  scrapId: string;
  fromStage: string;
  toStage: string;
  quantity: number;
  unit: string;
  date: string;
  status: 'pending' | 'in_transit' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ MODULE 10: CHI PHÍ SẢN XUẤT ============
export interface CostStandard {
  id: string;
  code: string;
  productId: string;
  materialCost: number; // Chi phí nguyên vật liệu
  laborCost: number; // Chi phí nhân công
  overheadCost: number; // Chi phí sản xuất chung
  totalCost: number; // Tổng chi phí
  unit: string;
  effectiveDate: string;
  expiryDate?: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CostEstimate {
  id: string;
  code: string;
  orderId: string;
  planId?: string;
  productId: string;
  quantity: number;
  unit: string;
  estimatedMaterialCost: number;
  estimatedLaborCost: number;
  estimatedOverheadCost: number;
  totalEstimatedCost: number;
  actualMaterialCost?: number;
  actualLaborCost?: number;
  actualOverheadCost?: number;
  totalActualCost?: number;
  status: 'draft' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackagingItem {
  id: string;
  code: string;
  name: string;
  type: 'box' | 'bag' | 'pallet' | 'label' | 'other';
  unit: string;
  price: number;
  quantity: number;
  minStock: number;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabelManagement {
  id: string;
  code: string;
  productId: string;
  name: string;
  template: string;
  size: string;
  material: string;
  quantity: number;
  unit: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ MODULE 13 & 14: BÁO CÁO & DASHBOARD ============
export interface ProductionReport {
  id: string;
  date: string;
  planId?: string;
  orderId?: string;
  productId: string;
  plannedQuantity: number;
  actualQuantity: number;
  unit: string;
  completionRate: number; // %
  status: 'on_track' | 'delayed' | 'ahead';
  notes?: string;
  createdAt: string;
}

export interface MaterialConsumptionReport {
  id: string;
  date: string;
  orderId: string;
  materialId: string;
  plannedQuantity: number;
  actualQuantity: number;
  unit: string;
  consumptionRate: number; // %
  wastage: number;
  notes?: string;
  createdAt: string;
}

export interface QualityReport {
  id: string;
  date: string;
  orderId: string;
  productId: string;
  totalQuantity: number;
  defectQuantity: number;
  defectRate: number; // %
  defectTypes: {
    defectTypeId: string;
    count: number;
  }[];
  passRate: number; // %
  notes?: string;
  createdAt: string;
}

export interface InventoryReport {
  id: string;
  date: string;
  warehouseId: string;
  materialId: string;
  openingQuantity: number;
  importedQuantity: number;
  exportedQuantity: number;
  closingQuantity: number;
  unit: string;
  turnoverRate: number;
  notes?: string;
  createdAt: string;
}

export interface CostReport {
  id: string;
  date: string;
  orderId?: string;
  productId: string;
  actualMaterialCost: number;
  actualLaborCost: number;
  actualOverheadCost: number;
  totalCost: number;
  unit: string;
  variance: number; // Chênh lệch so với định mức
  notes?: string;
  createdAt: string;
}

export interface OEEIndicator {
  id: string;
  machineId: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  totalTime: number;
  operatingTime: number;
  downtime: number;
  defects: number;
  mtbf?: number; // Mean Time Between Failures
  mttr?: number; // Mean Time To Repair
  createdAt: string;
  updatedAt: string;
}

export interface DashboardConfig {
  id: string;
  userId: string;
  role: string;
  widgets: DashboardWidget[];
  layout: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'gauge';
  title: string;
  dataSource: string;
  config: any;
  position: { x: number; y: number; width: number; height: number };
}