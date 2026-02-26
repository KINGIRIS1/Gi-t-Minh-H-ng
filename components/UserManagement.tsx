import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getUsers, saveUser, deleteUser } from '../services/storage';
import { Trash2, UserPlus, Save, X, Shield, ShieldAlert, Check } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleCreate = () => {
    setCurrentUser({
      role: 'USER',
      username: '',
      password: '',
      fullName: ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string, username: string) => {
    if (username === 'admin') {
      alert("Không thể xóa tài khoản Admin mặc định!");
      return;
    }
    if (window.confirm(`Xóa tài khoản ${username}?`)) {
      await deleteUser(id);
      loadUsers();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.username || !currentUser.password || !currentUser.fullName) return;

    await saveUser(currentUser as User);
    setIsEditing(false);
    loadUsers();
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded shadow-sm border border-gray-200">
        <div>
           <h3 className="font-bold text-gray-800 uppercase text-sm">Quản lý người dùng</h3>
           <p className="text-xs text-gray-500">Cấp quyền truy cập hệ thống</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-gov-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          <UserPlus size={16} /> Thêm tài khoản
        </button>
      </div>

      {isEditing && (
         <div className="bg-blue-50 p-6 rounded border border-blue-200 shadow-sm animate-fade-in-down">
           <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
             <UserPlus size={18}/> {currentUser.id ? 'Cập nhật tài khoản' : 'Tạo tài khoản mới'}
           </h4>
           <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Tên đăng nhập *</label>
                <input required type="text" className="w-full border rounded px-3 py-2 text-sm" 
                  value={currentUser.username} 
                  onChange={e => setCurrentUser({...currentUser, username: e.target.value})}
                  disabled={!!currentUser.id} // Không sửa username khi edit
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Họ và tên cán bộ *</label>
                <input required type="text" className="w-full border rounded px-3 py-2 text-sm" 
                  value={currentUser.fullName} 
                  onChange={e => setCurrentUser({...currentUser, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Mật khẩu *</label>
                <input required type="text" className="w-full border rounded px-3 py-2 text-sm font-mono" 
                  value={currentUser.password} 
                  onChange={e => setCurrentUser({...currentUser, password: e.target.value})}
                  placeholder="Nhập mật khẩu..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Phân quyền</label>
                <select className="w-full border rounded px-3 py-2 text-sm"
                  value={currentUser.role}
                  onChange={e => setCurrentUser({...currentUser, role: e.target.value as any})}
                >
                  <option value="USER">USER (Cán bộ - Chỉ nhập liệu)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên - Toàn quyền)</option>
                </select>
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                 <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 text-sm hover:bg-gray-50">Hủy</button>
                 <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-2">
                   <Save size={16} /> Lưu thông tin
                 </button>
              </div>
           </form>
         </div>
      )}

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tài khoản</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Họ và tên</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Vai trò</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Mật khẩu</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.role === 'ADMIN' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <ShieldAlert size={12} className="mr-1"/> ADMIN
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Shield size={12} className="mr-1"/> USER
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-mono text-gray-400">******</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => { setCurrentUser(user); setIsEditing(true); }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id, user.username)}
                    className="text-red-600 hover:text-red-900 disabled:opacity-30"
                    disabled={user.username === 'admin'}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;