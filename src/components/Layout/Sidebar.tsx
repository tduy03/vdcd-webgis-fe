import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Settings,
  Factory,
  Users,
  Truck,
  PlayCircle,
  Shield,
  Warehouse,
  GitBranch,
  DollarSign,
  Recycle,
  Wrench,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'reports', label: 'Báo cáo & Dashboard', icon: BarChart3 },
    { id: 'catalog', label: 'Danh mục sản xuất', icon: Package },
    { id: 'plan', label: 'Kế hoạch sản xuất', icon: ClipboardList },
    { id: 'execution', label: 'Thực thi sản xuất', icon: PlayCircle },
    { id: 'quality', label: 'Quản lý chất lượng', icon: Shield },
    { id: 'warehouse', label: 'Quản lý kho', icon: Warehouse },
    { id: 'traceability', label: 'Truy xuất nguồn gốc', icon: GitBranch },
    { id: 'factories', label: 'Quản lý nhà máy', icon: Factory },
    { id: 'cost', label: 'Chi phí sản xuất', icon: DollarSign },
    { id: 'scrap', label: 'Quản lý phế liệu', icon: Recycle },
    { id: 'processing', label: 'Gia công', icon: Wrench },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose}></div>
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gray-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-screen lg:h-auto
        flex flex-col
      `}>
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-blue-400">Điều khiển sản xuất</h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-colors duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-8 bg-white rounded-full flex-shrink-0"></span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};