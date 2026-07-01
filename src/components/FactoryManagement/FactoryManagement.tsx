import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { initialFactories, initialFactoryData } from '../../data/mockData';
import { DataTable } from '../Common/DataTable';
import {
  Factory,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  Building,
  Users,
  Settings,
  BarChart,
  TrendingUp
} from 'lucide-react';

export const FactoryManagement: React.FC = () => {
  const [factories, setFactories] = useLocalStorage('factories', initialFactories);
  const [factoryData] = useLocalStorage('factoryData', initialFactoryData);
  const [activeTab, setActiveTab] = useState<'list' | 'details'>('list');
  const [showForm, setShowForm] = useState(false);
  const [selectedFactory, setSelectedFactory] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // CRUD Factory
  const handleAddFactory = () => {
    setSelectedFactory(null);
    setFormData({
      code: `NM${String(factories.length + 1).padStart(3, '0')}`,
      name: '',
      nameEn: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
      status: 'active',
      productionLines: [],
      departments: []
    });
    setShowForm(true);
  };

  const handleEditFactory = (item: any) => {
    setSelectedFactory(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const saveFactory = () => {
    if (!formData.name || !formData.address) {
      alert('Vui lòng nhập tên nhà máy và địa chỉ!');
      return;
    }

    if (selectedFactory) {
      setFactories(factories.map(f => f.id === selectedFactory.id ? { ...formData, id: selectedFactory.id, updatedAt: new Date().toISOString() } : f));
    } else {
      setFactories([...factories, { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelectedFactory(null);
  };

  const handleDeleteFactory = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa nhà máy này?')) {
      setFactories(factories.filter(f => f.id !== id));
    }
  };

  const columns = [
    { key: 'code', header: 'Mã NM' },
    { key: 'name', header: 'Tên nhà máy' },
    { key: 'address', header: 'Địa chỉ' },
    { key: 'phone', header: 'Điện thoại' },
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
          <button
            onClick={() => {
              setSelectedFactory(item);
              setActiveTab('details');
            }}
            className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => handleEditFactory(item)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteFactory(item.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
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
          <h2 className="text-2xl font-bold text-gray-800">Quản lý đa nhà máy</h2>
        </div>
        <button
          onClick={handleAddFactory}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Thêm nhà máy
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-lg px-4">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === 'list'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Building className="w-4 h-4" />
          Danh sách nhà máy
        </button>
        {selectedFactory && (
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            Chi tiết: {selectedFactory.name}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {activeTab === 'list' && <DataTable columns={columns} data={factories} />}
        
        {activeTab === 'details' && selectedFactory && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600">Tên nhà máy</p>
                <p className="text-lg font-bold text-blue-800">{selectedFactory.name}</p>
                {selectedFactory.nameEn && <p className="text-sm text-gray-500">{selectedFactory.nameEn}</p>}
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600">Địa chỉ</p>
                <p className="font-medium">{selectedFactory.address}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-600">Quản lý</p>
                <p className="font-medium">{selectedFactory.manager}</p>
              </div>
            </div>

            {/* Production Lines */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                Dây chuyền sản xuất
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Mã</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Tên</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Công suất</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Giám sát</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedFactory.productionLines.map((line: any) => (
                      <tr key={line.id}>
                        <td className="px-3 py-2 text-sm">{line.code}</td>
                        <td className="px-3 py-2 text-sm">{line.name}</td>
                        <td className="px-3 py-2 text-sm">{line.capacity} {line.unit}</td>
                        <td className="px-3 py-2 text-sm">{line.supervisor}</td>
                        <td className="px-3 py-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            line.status === 'active' ? 'bg-green-100 text-green-800' :
                            line.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {line.status === 'active' ? 'Đang chạy' :
                             line.status === 'maintenance' ? 'Bảo trì' :
                             'Ngừng'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Departments */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                Phòng ban
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Mã</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Tên phòng ban</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Trưởng phòng</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Số nhân viên</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedFactory.departments.map((dept: any) => (
                      <tr key={dept.id}>
                        <td className="px-3 py-2 text-sm">{dept.code}</td>
                        <td className="px-3 py-2 text-sm">{dept.name}</td>
                        <td className="px-3 py-2 text-sm">{dept.manager}</td>
                        <td className="px-3 py-2 text-sm">{dept.employeeCount}</td>
                        <td className="px-3 py-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            dept.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {dept.status === 'active' ? 'Đang hoạt động' : 'Ngừng'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Factory Data */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-purple-600" />
                Dữ liệu sản xuất
              </h4>
              {factoryData.filter(d => d.factoryId === selectedFactory.id).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {factoryData.filter(d => d.factoryId === selectedFactory.id).map((data, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500">{new Date(data.date).toLocaleDateString('vi-VN')}</p>
                      <p className="text-lg font-bold text-blue-600">{data.productionQuantity} {data.unit}</p>
                      <div className="flex justify-between text-sm mt-2">
                        <span>Hiệu suất: <span className="font-medium">{data.efficiency}%</span></span>
                        <span>OEE: <span className="font-medium">{data.oee}%</span></span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Downtime: {data.downtime}ph</span>
                        <span>Lỗi: {data.defects}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Chưa có dữ liệu sản xuất</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedFactory ? 'Chỉnh sửa' : 'Thêm mới'} Nhà máy
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã nhà máy</label>
                  <input type="text" value={formData.code} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhà máy *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên tiếng Anh</label>
                  <input type="text" value={formData.nameEn || ''} onChange={(e) => setFormData({...formData, nameEn: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ *</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                  <input type="text" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quản lý</label>
                  <input type="text" value={formData.manager || ''} onChange={(e) => setFormData({...formData, manager: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Hủy
                </button>
                <button onClick={saveFactory} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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