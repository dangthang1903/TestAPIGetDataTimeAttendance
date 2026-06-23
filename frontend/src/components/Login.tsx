import React, { useState } from 'react';
import type { DeviceConfig } from '../App';
import { Server, KeyRound, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';

type LoginProps = {
  onConnect: (device: DeviceConfig) => void;
};

export default function Login({ onConnect }: LoginProps) {
  const [ip, setIp] = useState('192.168.1.200');
  const [commKey, setCommKey] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ip) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Test connection by fetching users list page 1
      await axios.get('/attendance/users', {
        params: { ip, commKey, page: 1, limit: 1 }
      });
      
      onConnect({ ip, commKey });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể kết nối đến thiết bị. Vui lòng kiểm tra lại IP hoặc CommKey.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Server className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Kết nối Máy Chấm Công</h2>
            <p className="text-slate-500 mt-2 text-sm">Nhập thông số thiết bị ZKTeco để đồng bộ dữ liệu</p>
          </div>

          <form onSubmit={handleConnect} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Địa chỉ IP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Server className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                  placeholder="Ví dụ: 192.168.1.200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Comm Key (Mật mã kết nối)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={commKey}
                  onChange={(e) => setCommKey(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                  placeholder="Thường là 0"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang kết nối...
                </>
              ) : (
                <>
                  Kết Nối Thiết Bị
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-sm text-slate-400 mt-6">
          Phần mềm quản lý nhân sự chuyên nghiệp
        </p>
      </div>
    </div>
  );
}
