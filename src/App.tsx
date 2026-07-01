import { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { ProductionCatalog } from './components/ProductionCatalog/ProductionCatalog';
import { ProductionPlan } from './components/ProductionPlan/ProductionPlan';
import { ProductionExecution } from './components/ProductionExecution/ProductionExecution';
import { QualityManagement } from './components/QualityManagement/QualityManagement';
import { WarehouseManagement } from './components/WarehouseManagement/WarehouseManagement';
import { Traceability } from './components/Traceability/Traceability';
import { FactoryManagement } from './components/FactoryManagement/FactoryManagement';
import { CostManagement } from './components/CostManagement/CostManagement';
import { ScrapManagement } from './components/ScrapManagement/ScrapManagement';
import { ProcessingManagement } from './components/ProcessingManagement/ProcessingManagement';
import { ReportDashboard } from './components/ReportDashboard/ReportDashboard';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Lấy trang đã lưu từ localStorage, nếu không có thì mặc định là 'reports'
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage || 'reports';
  });

  // Lưu trang hiện tại vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'reports':
        return <ReportDashboard />;
      case 'catalog':
        return <ProductionCatalog />;
      case 'plan':
        return <ProductionPlan />;
      case 'execution':
        return <ProductionExecution />;
      case 'quality':
        return <QualityManagement />;
      case 'warehouse':
        return <WarehouseManagement />;
      case 'traceability':
        return <Traceability />;
      case 'factories':
        return <FactoryManagement />;
      case 'cost':
        return <CostManagement />;
      case 'scrap':
        return <ScrapManagement />;
      case 'processing':
        return <ProcessingManagement />;
      default:
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-600">Đang phát triển</h2>
            <p className="text-gray-500 mt-2">Trang {currentPage} đang được xây dựng</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;