import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Utensils, 
  Settings, LogOut, ChevronRight, Menu, X 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardLayout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const firstName = localStorage.getItem('userFirstName') || 'Manager';

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'employees', label: 'Manage Employees', icon: <Users size={20} /> },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsSidebarOpen(false); // Close sidebar on mobile after clicking
  };

  return (
    <div className="flex min-h-screen bg-emerald-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-emerald-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-emerald-100 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-emerald-700 tracking-tight">MEAL MS</h1>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Manager Portal</p>
          </div>
          <button className="lg:hidden p-2 text-emerald-600" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {activeTab === item.id && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-50">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold text-sm"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-emerald-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="capitalize font-bold text-emerald-800 text-lg hidden sm:block">
              {activeTab}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-emerald-700 hidden sm:block">
              {firstName}
            </span>
            <div className="w-9 h-9 bg-emerald-100 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold shadow-sm">
              {firstName[0]}
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;