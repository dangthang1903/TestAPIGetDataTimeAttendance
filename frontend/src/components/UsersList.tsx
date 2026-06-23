import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, UserCircle, Loader2 } from 'lucide-react';
import type { DeviceConfig } from '../App';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

type UserData = {
  uid: number;
  userId: string;
  name: string;
  role: number;
};

export default function UsersList({ device }: { device: DeviceConfig }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchName, setSearchName] = useState('');

  // Fetch ALL users once (limit 10000)
  const { data, isLoading } = useSWR(
    `/attendance/users?ip=${device.ip}&commKey=${device.commKey}&page=1&limit=10000`,
    fetcher,
    { 
      revalidateOnFocus: false,
      keepPreviousData: true 
    }
  );

  const allUsers: UserData[] = data?.data || [];

  // Client-side Filter
  const filteredUsers = allUsers.filter(u => {
    if (!searchName) return true;
    const s = searchName.toLowerCase();
    return (u.name?.toLowerCase().includes(s) || u.userId?.includes(s));
  });

  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit) || 1;
  
  // Client-side Pagination
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  // If page exceeds total pages after filtering, reset to 1
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalPages, page]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header & Search */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <UserCircle className="w-5 h-5 mr-2 text-slate-400" />
          Nhân Sự ({total})
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên..."
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setPage(1);
            }}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider sticky top-0">
              <th className="px-6 py-4">Mã NV</th>
              <th className="px-6 py-4">Họ và Tên</th>
              <th className="px-6 py-4">Phân quyền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Đang đồng bộ dữ liệu từ máy chấm công...</p>
                  </div>
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-slate-400">Không tìm thấy nhân viên nào</td>
              </tr>
            ) : (
              paginatedUsers.map(u => (
                <tr key={u.uid} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{u.userId}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-800">{u.name || '(Chưa cập nhật tên)'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 14 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {u.role === 14 ? 'Quản trị viên' : 'Nhân viên'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Limit */}
      <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            Hiển thị trang <span className="font-semibold text-slate-700">{page}</span> / <span className="font-semibold text-slate-700">{totalPages || 1}</span>
          </span>
          <div className="flex items-center text-sm text-slate-500">
            <span className="mr-2">Số dòng:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1); // Reset to page 1 when changing limit
              }}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
