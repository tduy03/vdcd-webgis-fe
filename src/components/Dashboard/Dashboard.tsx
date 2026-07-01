import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { initialMaterials, initialProducts, initialProductionPlans, initialMachines } from '../../data/mockData';
import { Package, TrendingUp, AlertTriangle, Factory, DollarSign, Clock, CheckCircle  } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [materials] = useLocalStorage('materials', initialMaterials);
  const [products] = useLocalStorage('products', initialProducts);
  const [plans] = useLocalStorage('productionPlans', initialProductionPlans);
  const [machines] = useLocalStorage('machines', initialMachines);

  const stats = [
    {
      title: 'Tổng nguyên vật liệu',
      value: materials.length,
      icon: Package,
      color: 'bg-blue-500',
      sub: `${materials.filter(m => m.type === 'raw').length} loại nguyên liệu`
    },
    {
      title: 'Thành phẩm',
      value: products.filter(p => p.type === 'finished').length,
      icon: TrendingUp,
      color: 'bg-green-500',
      sub: `${products.filter(p => p.type === 'semi').length} bán thành phẩm`
    },
    {
      title: 'Kế hoạch đang thực hiện',
      value: plans.filter(p => p.status === 'in_progress' || p.status === 'approved').length,
      icon: Factory,
      color: 'bg-yellow-500',
      sub: `${plans.filter(p => p.status === 'completed').length} đã hoàn thành`
    },
    {
      title: 'Máy móc hoạt động',
      value: machines.filter(m => m.status === 'active').length,
      icon: AlertTriangle,
      color: 'bg-purple-500',
      sub: `${machines.filter(m => m.status === 'maintenance').length} đang bảo trì`
    }
  ];

  // Tính tổng tồn kho
  const totalStock = materials.reduce((sum, m) => sum + m.quantity, 0);
  const totalValue = materials.reduce((sum, m) => sum + m.quantity * m.price, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Tổng quan nhà máy</h2>
        <p className="text-gray-600">Cập nhật dữ liệu sản xuất mới nhất</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Tồn kho & Giá trị
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Tổng số lượng tồn kho</span>
              <span className="font-bold text-blue-600">{totalStock.toLocaleString()} tấn</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Tổng giá trị tồn kho</span>
              <span className="font-bold text-green-600">{totalValue.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số loại nguyên liệu</span>
              <span className="font-bold text-purple-600">{materials.filter(m => m.type === 'raw').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Cảnh báo tồn kho thấp
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {materials.filter(m => m.quantity < m.minStock).length > 0 ? (
              materials.filter(m => m.quantity < m.minStock).map(m => (
                <div key={m.id} className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200">
                  <div>
                    <span className="text-sm font-medium text-red-700">{m.name}</span>
                    <span className="text-xs text-red-500 block">{m.code}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-red-600">{m.quantity} {m.unit}</span>
                    <span className="text-xs text-red-400 block">Tối thiểu: {m.minStock} {m.unit}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span>Tất cả nguyên liệu đều đạt mức tồn kho tối thiểu</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};