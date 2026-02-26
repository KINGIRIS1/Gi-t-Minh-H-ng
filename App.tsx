
import React, { useState, useEffect } from 'react';
import { HoSoDat, ViewState, User } from './types';
import { getRecords, saveRecord, deleteRecord, importRecords } from './services/storage';
import RecordForm from './components/RecordForm';
import RecordList from './components/RecordList';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import PriceList from './components/PriceList';
import LandPriceCalculator from './components/LandPriceCalculator';
import Settings from './components/Settings'; // Component mới
import { LayoutDashboard, PlusCircle, List, UserCircle, Building2, ChevronRight, LogOut, Loader2, Users, Banknote, Calculator, Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [records, setRecords] = useState<HoSoDat[]>([]);
  const [editingRecord, setEditingRecord] = useState<HoSoDat | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Khôi phục session từ localStorage (giả lập)
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setView(ViewState.DASHBOARD);
    }
  }, []);

  // Hàm tải dữ liệu từ Supabase
  const loadData = async () => {
    setIsLoading(true);
    const data = await getRecords();
    setRecords(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    if(window.confirm('Bạn có chắc muốn đăng xuất?')) {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      setView(ViewState.LOGIN);
    }
  };

  const handleSave = async (record: HoSoDat) => {
    setIsLoading(true);
    const success = await saveRecord(record);
    if (success) {
      await loadData();
      setView(ViewState.LIST);
      setEditingRecord(undefined);
    }
    setIsLoading(false);
  };

  const handleImportRecords = async (newRecords: HoSoDat[]) => {
    setIsLoading(true);
    const success = await importRecords(newRecords);
    if (success) {
      await loadData();
      alert(`Đã nhập thành công ${newRecords.length} hồ sơ!`);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const success = await deleteRecord(id);
    if (success) {
      await loadData();
    }
    setIsLoading(false);
  };

  const handleEdit = (record: HoSoDat) => {
    setEditingRecord(record);
    setView(ViewState.EDIT);
  };

  // NẾU CHƯA ĐĂNG NHẬP -> HIỆN LOGIN
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all border-l-4 ${
        active 
          ? 'bg-blue-800 border-white text-white shadow-inner' 
          : 'border-transparent text-blue-100 hover:bg-blue-800 hover:text-white hover:border-blue-400'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span>{label}</span>
      </div>
      {active && <ChevronRight size={16} />}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gov-bg font-sans">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <Loader2 className="animate-spin text-gov-primary" size={24} />
            <span className="text-gray-700 font-medium">Đang xử lý dữ liệu...</span>
          </div>
        </div>
      )}

      {/* Sidebar - Official Dark Blue */}
      <aside className="w-full md:w-64 bg-gov-primary text-white flex-shrink-0 flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center px-6 bg-blue-900 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded shadow">
              <Building2 className="text-gov-primary" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight uppercase tracking-wide">UBND P. Minh Hưng</h1>
              <p className="text-[10px] text-blue-200 font-light tracking-wider">HỆ THỐNG QUẢN LÝ ĐẤT ĐAI</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="text-xs font-bold text-blue-300 uppercase mb-2 tracking-wider">Danh mục quản lý</div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem 
            icon={LayoutDashboard} 
            label="Tổng Quan Báo Cáo" 
            active={view === ViewState.DASHBOARD} 
            onClick={() => setView(ViewState.DASHBOARD)} 
          />
          <NavItem 
            icon={List} 
            label="Danh sách hồ sơ" 
            active={view === ViewState.LIST} 
            onClick={() => setView(ViewState.LIST)} 
          />
          <NavItem 
            icon={PlusCircle} 
            label="Tiếp Nhận Hồ Sơ" 
            active={view === ViewState.ADD || view === ViewState.EDIT} 
            onClick={() => {
              setEditingRecord(undefined);
              setView(ViewState.ADD);
            }} 
          />
          <NavItem 
            icon={Banknote} 
            label="Bảng Giá Đất 2026" 
            active={view === ViewState.PRICE_LIST} 
            onClick={() => setView(ViewState.PRICE_LIST)} 
          />
          
          <div className="px-6 py-4">
             <div className="text-xs font-bold text-blue-300 uppercase mb-2 tracking-wider">Tiện ích</div>
          </div>
          <NavItem 
            icon={Calculator} 
            label="Tính Giá Đất Đồng Nai" 
            active={view === ViewState.CALCULATOR} 
            onClick={() => setView(ViewState.CALCULATOR)} 
          />
          
          {/* Menu Cấu Hình */}
          <NavItem 
            icon={SettingsIcon} 
            label="Cấu Hình Hệ Thống" 
            active={view === ViewState.SETTINGS} 
            onClick={() => setView(ViewState.SETTINGS)} 
          />

          {/* CHỈ ADMIN MỚI THẤY MENU NÀY */}
          {currentUser.role === 'ADMIN' && (
            <>
              <div className="px-6 py-4">
                <div className="text-xs font-bold text-blue-300 uppercase mb-2 tracking-wider">Hệ thống</div>
              </div>
              <NavItem 
                icon={Users} 
                label="Quản lý tài khoản" 
                active={view === ViewState.USERS} 
                onClick={() => setView(ViewState.USERS)} 
              />
            </>
          )}
        </nav>

        <div className="p-4 bg-blue-900 border-t border-blue-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-700 p-2 rounded-full">
               <UserCircle size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser.fullName}</p>
              <p className="text-[10px] text-blue-300 truncate uppercase">{currentUser.role === 'ADMIN' ? 'Quản trị viên' : 'Cán bộ'}</p>
            </div>
            <button onClick={handleLogout} className="text-blue-300 hover:text-white" title="Đăng xuất">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 bg-white shadow-sm border-b flex items-center justify-between px-6 z-10 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gov-primary flex items-center gap-2">
              <span className="text-gray-400 font-normal">Hệ thống /</span> 
              {view === ViewState.DASHBOARD && 'Bảng Thống Kê Số Liệu'}
              {view === ViewState.LIST && 'Danh Sách Hồ Sơ Chuyển Mục Đích'}
              {(view === ViewState.ADD || view === ViewState.EDIT) && 'Xử Lý Hồ Sơ Chi Tiết'}
              {view === ViewState.PRICE_LIST && 'Tra Cứu Bảng Giá Đất'}
              {view === ViewState.CALCULATOR && 'Công Cụ Tính Giá Đất (Nghị quyết 28/2025)'}
              {view === ViewState.SETTINGS && 'Cài Đặt & Liên Kết'}
              {view === ViewState.USERS && 'Phân Quyền Hệ Thống'}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="text-right hidden md:block">
              <div className="font-medium">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="text-xs text-gray-400">Phiên làm việc: #SESSION-2024</div>
            </div>
          </div>
        </header>

        {/* Content Scrollable Area */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-gov-bg">
          <div className="max-w-7xl mx-auto space-y-6 pb-10 h-full">
            {view === ViewState.DASHBOARD && <Dashboard records={records} />}
            
            {view === ViewState.LIST && (
              <RecordList 
                records={records} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                onImport={handleImportRecords}
                userRole={currentUser.role} // Truyền role xuống để ẩn hiện nút
              />
            )}

            {(view === ViewState.ADD || view === ViewState.EDIT) && (
              <RecordForm 
                initialData={editingRecord} 
                onSave={handleSave} 
                onCancel={() => setView(ViewState.LIST)} 
              />
            )}
            
            {view === ViewState.PRICE_LIST && (
              <PriceList userRole={currentUser.role} />
            )}
            
            {view === ViewState.CALCULATOR && (
              <LandPriceCalculator />
            )}
            
            {view === ViewState.SETTINGS && (
              <Settings />
            )}

            {/* Chỉ hiện nếu là Admin */}
            {view === ViewState.USERS && currentUser.role === 'ADMIN' && (
              <UserManagement />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
