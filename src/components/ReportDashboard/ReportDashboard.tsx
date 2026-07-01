import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  initialProductionReports,
  initialMaterialConsumptionReports,
  initialQualityReports,
  initialInventoryReports,
  initialCostReports,
  initialOEEIndicators,
  initialProducts,
  initialMaterials,
  initialMachines
} from '../../data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Scatter
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Eye
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const ReportDashboard: React.FC = () => {
  const [productionReports] = useLocalStorage('productionReports', initialProductionReports);
  const [materialReports] = useLocalStorage('materialConsumptionReports', initialMaterialConsumptionReports);
  const [qualityReports] = useLocalStorage('qualityReports', initialQualityReports);
  const [inventoryReports] = useLocalStorage('inventoryReports', initialInventoryReports);
  const [costReports] = useLocalStorage('costReports', initialCostReports);
  const [oeeIndicators] = useLocalStorage('oeeIndicators', initialOEEIndicators);
  const [products] = useLocalStorage('products', initialProducts);
  const [materials] = useLocalStorage('materials', initialMaterials);
  const [machines] = useLocalStorage('machines', initialMachines);

  const [activeTab, setActiveTab] = useState<'overview' | 'production' | 'material' | 'quality' | 'inventory' | 'cost' | 'oee'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '30days' | '90days'>('30days');

  // Tính toán dữ liệu cho các chỉ số
  const getFilteredData = (data: any[], days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return data.filter(item => new Date(item.date) >= cutoff);
  };

  const getPeriodData = (data: any[]) => {
    return getFilteredData(data, selectedPeriod === '7days' ? 7 : selectedPeriod === '30days' ? 30 : 90);
  };

  // Dữ liệu sản xuất
  const productionData = getPeriodData(productionReports);
  const totalPlanned = productionData.reduce((sum, d) => sum + d.plannedQuantity, 0);
  const totalActual = productionData.reduce((sum, d) => sum + d.actualQuantity, 0);
  const avgCompletion = productionData.length > 0 
    ? productionData.reduce((sum, d) => sum + d.completionRate, 0) / productionData.length 
    : 0;

  // Dữ liệu chất lượng
  const qualityData = getPeriodData(qualityReports);
  const avgDefectRate = qualityData.length > 0
    ? qualityData.reduce((sum, d) => sum + d.defectRate, 0) / qualityData.length
    : 0;
  const avgPassRate = qualityData.length > 0
    ? qualityData.reduce((sum, d) => sum + d.passRate, 0) / qualityData.length
    : 0;

  // Dữ liệu OEE
  const oeeData = getPeriodData(oeeIndicators);
  const avgOEE = oeeData.length > 0
    ? oeeData.reduce((sum, d) => sum + d.oee, 0) / oeeData.length
    : 0;

  // Dữ liệu chi phí
  const costData = getPeriodData(costReports);
  const totalCost = costData.reduce((sum, d) => sum + d.totalCost, 0);

  // Biểu đồ sản xuất theo ngày
  const productionByDate = productionData.reduce((acc: any, item) => {
    const date = new Date(item.date).toLocaleDateString('vi-VN');
    if (!acc[date]) acc[date] = { date, planned: 0, actual: 0 };
    acc[date].planned += item.plannedQuantity;
    acc[date].actual += item.actualQuantity;
    return acc;
  }, {});

  const productionChartData = Object.values(productionByDate);

  // Biểu đồ chất lượng
  const qualityChartData = qualityData.map(item => ({
    date: new Date(item.date).toLocaleDateString('vi-VN'),
    defectRate: item.defectRate,
    passRate: item.passRate
  }));

  // Biểu đồ OEE
  const oeeChartData = oeeData.map(item => ({
    date: new Date(item.date).toLocaleDateString('vi-VN'),
    oee: item.oee,
    availability: item.availability,
    performance: item.performance,
    quality: item.quality
  }));

  // Biểu đồ tiêu hao vật tư
  const materialChartData = getPeriodData(materialReports).map(item => {
    const material = materials.find(m => m.id === item.materialId);
    return {
      name: material?.name || 'Không xác định',
      planned: item.plannedQuantity,
      actual: item.actualQuantity,
      wastage: item.wastage
    };
  });

  // Thống kê lỗi
  const defectStats = qualityData.reduce((acc: any, item) => {
    item.defectTypes?.forEach((d: any) => {
      const defect = initialQualityReports[0]?.defectTypes.find((dt: any) => dt.defectTypeId === d.defectTypeId);
      if (!acc[d.defectTypeId]) acc[d.defectTypeId] = { name: defect?.defectTypeId || 'Khác', count: 0 };
      acc[d.defectTypeId].count += d.count;
    });
    return acc;
  }, {});

  const defectChartData = Object.values(defectStats);

  // KPI Cards
  const KPICards = [
    {
      title: 'Tỷ lệ hoàn thành KH',
      value: `${Math.round(avgCompletion)}%`,
      change: productionData.length > 0 ? Math.round((totalActual / totalPlanned) * 100 - 100) : 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Sản lượng thực tế',
      value: `${Math.round(totalActual)} tấn`,
      change: 5.2,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'OEE trung bình',
      value: `${Math.round(avgOEE)}%`,
      change: 2.1,
      icon: Activity,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Tỷ lệ đạt chất lượng',
      value: `${Math.round(avgPassRate)}%`,
      change: 0.8,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Tỷ lệ lỗi',
      value: `${avgDefectRate.toFixed(1)}%`,
      change: -0.3,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      title: 'Tổng chi phí SX',
      value: `${(totalCost / 1000000).toFixed(1)} triệu`,
      change: 3.5,
      icon: DollarSign,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hệ thống Báo cáo & Dashboard</h2>
          <p className="text-gray-600">Theo dõi toàn diện hiệu suất sản xuất theo thời gian thực</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">7 ngày</option>
            <option value="30days">30 ngày</option>
            <option value="90days">90 ngày</option>
          </select>
          <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPICards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">{card.title}</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">{card.value}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs ${card.change >= 0 ? 'text-green-600' : 'text-red-600'} font-medium flex items-center`}>
                      {card.change >= 0 ? '↑' : '↓'} {Math.abs(card.change)}%
                    </span>
                    <span className="text-xs text-gray-400 ml-1">so với kỳ trước</span>
                  </div>
                </div>
                <div className={`${card.bg} p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-lg px-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Tổng quan
        </button>
        <button
          onClick={() => setActiveTab('production')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'production'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Sản xuất
        </button>
        <button
          onClick={() => setActiveTab('material')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'material'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package className="w-4 h-4" />
          Tiêu hao NVL
        </button>
        {/* <button
          onClick={() => setActiveTab('quality')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'quality'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Chất lượng
        </button> */}
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package className="w-4 h-4" />
          Tồn kho
        </button>
        {/* <button
          onClick={() => setActiveTab('cost')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'cost'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Chi phí
        </button> */}
        {/* <button
          onClick={() => setActiveTab('oee')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'oee'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Activity className="w-4 h-4" />
          OEE
        </button> */}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Tab: Tổng quan */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Biểu đồ sản xuất */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Kế hoạch vs Thực tế
              </h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionChartData.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="planned" fill="#0088FE" name="Kế hoạch" />
                    <Bar dataKey="actual" fill="#00C49F" name="Thực tế" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ OEE */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                OEE theo ngày
              </h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={oeeChartData.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="oee" stroke="#8884d8" name="OEE" strokeWidth={2} />
                    <Line type="monotone" dataKey="availability" stroke="#82ca9d" name="Availability" />
                    <Line type="monotone" dataKey="performance" stroke="#ffc658" name="Performance" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ chất lượng */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Chất lượng sản phẩm
              </h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={qualityChartData.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[85, 100]} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="passRate" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Đạt" />
                    <Area type="monotone" dataKey="defectRate" stackId="1" stroke="#ff8042" fill="#ff8042" name="Lỗi" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ chi phí */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                Chi phí sản xuất
              </h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={costData.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="totalCost" fill="#8884d8" name="Tổng chi phí" />
                    <Line yAxisId="right" type="monotone" dataKey="variance" stroke="#ff7300" name="Chênh lệch" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Sản xuất */}
        {activeTab === 'production' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4">Tiến độ sản xuất theo ngày</h4>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="planned" fill="#0088FE" name="Kế hoạch" />
                    <Bar dataKey="actual" fill="#00C49F" name="Thực tế" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">Tỷ lệ hoàn thành KH</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="10%" 
                      outerRadius="80%" 
                      data={[{ name: 'Hoàn thành', value: avgCompletion }]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar
                        minAngle={15}
                        background
                        clockWise
                        dataKey="value"
                        fill="#00C49F"
                        label={{ position: 'center', formatter: () => `${Math.round(avgCompletion)}%` }}
                      />
                      <Legend />
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">Thống kê sản xuất</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Tổng kế hoạch</span>
                    <span className="font-bold text-blue-600">{Math.round(totalPlanned)} tấn</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Tổng thực tế</span>
                    <span className="font-bold text-green-600">{Math.round(totalActual)} tấn</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Chênh lệch</span>
                    <span className={`font-bold ${totalActual - totalPlanned >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalActual - totalPlanned >= 0 ? '+' : ''}{Math.round(totalActual - totalPlanned)} tấn
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Tỷ lệ hoàn thành</span>
                    <span className="font-bold text-blue-600">{Math.round(avgCompletion)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Tiêu hao NVL */}
        {activeTab === 'material' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4">Tiêu hao nguyên vật liệu</h4>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={materialChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="planned" fill="#0088FE" name="Định mức" />
                    <Bar dataKey="actual" fill="#FF8042" name="Thực tế" />
                    <Bar dataKey="wastage" fill="#FFBB28" name="Hao hụt" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">Tỷ lệ tiêu hao</h4>
                <div className="space-y-3">
                  {materialChartData.slice(0, 5).map((item: any, index: number) => {
                    const rate = item.actual > 0 ? (item.actual / item.planned) * 100 : 0;
                    return (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{item.name}</span>
                          <span className="font-medium">{Math.round(rate)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${rate <= 100 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(rate, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">Thống kê hao hụt</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Tổng hao hụt</span>
                    <span className="font-bold text-red-600">
                      {materialChartData.reduce((sum: number, item: any) => sum + item.wastage, 0).toFixed(1)} tấn
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Tỷ lệ hao hụt trung bình</span>
                    <span className="font-bold text-yellow-600">
                      {materialChartData.length > 0 
                        ? (materialChartData.reduce((sum: number, item: any) => sum + (item.wastage / item.planned) * 100, 0) / materialChartData.length).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Vật tư tiết kiệm</span>
                    <span className="font-bold text-green-600">
                      {materialChartData.reduce((sum: number, item: any) => sum + (item.planned - item.actual), 0).toFixed(1)} tấn
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Chất lượng */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">Tỷ lệ đạt/không đạt</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Đạt', value: avgPassRate },
                          { name: 'Không đạt', value: 100 - avgPassRate }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#00C49F" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">Thống kê lỗi</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={defectChartData.length > 0 ? defectChartData : [{ name: 'Chưa có dữ liệu', count: 1 }]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {defectChartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4">Xu hướng chất lượng</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={qualityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[85, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="passRate" stroke="#00C49F" name="Tỷ lệ đạt" strokeWidth={2} />
                    <Line type="monotone" dataKey="defectRate" stroke="#FF8042" name="Tỷ lệ lỗi" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Tồn kho */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Tồn kho đầu kỳ</p>
                <p className="text-2xl font-bold text-blue-600">
                  {inventoryReports.reduce((sum, r) => sum + r.openingQuantity, 0).toFixed(1)} tấn
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Nhập kho</p>
                <p className="text-2xl font-bold text-green-600">
                  {inventoryReports.reduce((sum, r) => sum + r.importedQuantity, 0).toFixed(1)} tấn
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Xuất kho</p>
                <p className="text-2xl font-bold text-orange-600">
                  {inventoryReports.reduce((sum, r) => sum + r.exportedQuantity, 0).toFixed(1)} tấn
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4">Biến động tồn kho</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={inventoryReports}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="closingQuantity" stackId="1" stroke="#8884d8" fill="#8884d8" name="Tồn cuối kỳ" />
                    <Area type="monotone" dataKey="openingQuantity" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Tồn đầu kỳ" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Chi phí */}
        {activeTab === 'cost' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Chi phí NVL</p>
                <p className="text-xl font-bold text-blue-600">
                  {(costData.reduce((sum, r) => sum + r.actualMaterialCost, 0) / 1000000).toFixed(1)} triệu
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Chi phí nhân công</p>
                <p className="text-xl font-bold text-green-600">
                  {(costData.reduce((sum, r) => sum + r.actualLaborCost, 0) / 1000000).toFixed(1)} triệu
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Chi phí SXC</p>
                <p className="text-xl font-bold text-orange-600">
                  {(costData.reduce((sum, r) => sum + r.actualOverheadCost, 0) / 1000000).toFixed(1)} triệu
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4">Phân bổ chi phí</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actualMaterialCost" stackId="a" fill="#0088FE" name="NVL" />
                    <Bar dataKey="actualLaborCost" stackId="a" fill="#00C49F" name="Nhân công" />
                    <Bar dataKey="actualOverheadCost" stackId="a" fill="#FFBB28" name="SXC" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tab: OEE */}
        {activeTab === 'oee' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <p className="text-sm text-gray-500">OEE trung bình</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round(avgOEE)}%</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Availability</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(oeeData.reduce((sum, r) => sum + r.availability, 0) / (oeeData.length || 1))}%
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Performance</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(oeeData.reduce((sum, r) => sum + r.performance, 0) / (oeeData.length || 1))}%
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Quality</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(oeeData.reduce((sum, r) => sum + r.quality, 0) / (oeeData.length || 1))}%
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4">OEE theo thiết bị</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={oeeData.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="oee" fill="#8884d8" name="OEE" />
                    <Bar dataKey="availability" fill="#82ca9d" name="Availability" />
                    <Bar dataKey="performance" fill="#ffc658" name="Performance" />
                    <Bar dataKey="quality" fill="#ff8042" name="Quality" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">MTBF & MTTR</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">MTBF trung bình</span>
                    <span className="font-bold text-blue-600">
                      {Math.round(oeeData.reduce((sum, r) => sum + (r.mtbf || 0), 0) / (oeeData.length || 1))} phút
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">MTTR trung bình</span>
                    <span className="font-bold text-orange-600">
                      {Math.round(oeeData.reduce((sum, r) => sum + (r.mttr || 0), 0) / (oeeData.length || 1))} phút
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Tổng downtime</span>
                    <span className="font-bold text-red-600">
                      {Math.round(oeeData.reduce((sum, r) => sum + r.downtime, 0))} phút
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">Phân bố downtime</h4>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Bảo trì', value: oeeData.reduce((sum, r) => sum + (r.downtime || 0) * 0.4, 0) },
                          { name: 'Lỗi máy', value: oeeData.reduce((sum, r) => sum + (r.downtime || 0) * 0.35, 0) },
                          { name: 'Chờ nguyên liệu', value: oeeData.reduce((sum, r) => sum + (r.downtime || 0) * 0.25, 0) }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#FF8042" />
                        <Cell fill="#FFBB28" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};