import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { loginUser } from '../services/storage';
import { Building2, KeyRound, User as UserIcon, Loader2 } from 'lucide-react';

interface Props {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<Props> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const user = await loginUser(username, password);
    setIsLoading(false);

    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div className="min-h-screen bg-gov-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-gov-primary p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Building2 className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">UBND P. Minh Hưng</h1>
          <p className="text-blue-200 text-sm mt-1">Hệ thống Quản lý Đất đai</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 block w-full rounded border-gray-300 shadow-sm focus:ring-gov-primary focus:border-gov-primary sm:text-sm py-2 border"
                  placeholder="Nhập tài khoản cán bộ"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="text-gray-400" size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full rounded border-gray-300 shadow-sm focus:ring-gov-primary focus:border-gov-primary sm:text-sm py-2 border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-gov-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-primary transition-colors disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'ĐĂNG NHẬP HỆ THỐNG'}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Hệ thống dành riêng cho cán bộ UBND Phường Minh Hưng.<br/>
            Vui lòng không chia sẻ tài khoản.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;