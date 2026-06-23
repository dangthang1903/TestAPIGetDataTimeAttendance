import { useState } from 'react';
import type { DeviceConfig } from '../App';
import { Users, CalendarDays } from 'lucide-react';
import UsersList from './UsersList';
import AttendanceLogs from './AttendanceLogs';

type DashboardProps = {
  device: DeviceConfig;
};

export default function Dashboard({ device }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');

  return (
    <div className="flex-1 min-h-0 flex flex-col max-w-7xl w-full mx-auto p-6">
      
      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200/60">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'users' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Danh Sách Nhân Viên
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'logs' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Dữ Liệu Chấm Công
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {activeTab === 'users' ? (
          <UsersList device={device} />
        ) : (
          <AttendanceLogs device={device} />
        )}
      </div>

    </div>
  );
}
