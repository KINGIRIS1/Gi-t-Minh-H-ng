import React from 'react';
import { HoSoDat } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { FileText, LandPlot, Ruler, TrendingUp } from 'lucide-react';

interface Props {
  records: HoSoDat[];
}

const StatCard = ({ title, value, unit, icon: Icon, colorClass, bgClass }: any) => (
  <div className="bg-white p-5 rounded border border-gray-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">
        {value} <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
      </h3>
    </div>
    <div className={`p-3 rounded-md ${bgClass} ${colorClass}`}>
      <Icon size={22} />
    </div>
  </div>
);

const Dashboard: React.FC<Props> = ({ records }) => {
  const totalArea = records.reduce((sum, r) => sum + (r.dienTichTong || 0), 0);
  const totalResidential = records.reduce((sum, r) => sum + (r.dienTichDatO || 0), 0);
  
  const chartData = [...records]
    .sort((a, b) => b.dienTichTong - a.dienTichTong)
    .slice(0, 5)
    .map(r => ({
      name: r.chuSuDung.length > 15 ? r.chuSuDung.substring(0, 15) + '...' : r.chuSuDung,
      full: r.chuSuDung,
      dt: r.dienTichTong
    }));

  return (
    <div className="space-y-6 fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Tổng số hồ sơ" 
          value={records.length} 
          unit="HS" 
          icon={FileText} 
          colorClass="text-blue-700" 
          bgClass="bg-blue-50" 
        />
        <StatCard 
          title="Tổng diện tích đất" 
          value={totalArea.toLocaleString('vi-VN')} 
          unit="m²" 
          icon={LandPlot} 
          colorClass="text-green-700" 
          bgClass="bg-green-50" 
        />
        <StatCard 
          title="Tổng DT đất ở" 
          value={totalResidential.toLocaleString('vi-VN')} 
          unit="m²" 
          icon={Ruler} 
          colorClass="text-orange-700" 
          bgClass="bg-orange-50" 
        />
        <StatCard 
          title="Tỉ lệ xử lý" 
          value="100" 
          unit="%" 
          icon={TrendingUp} 
          colorClass="text-purple-700" 
          bgClass="bg-purple-50" 
        />
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-5 rounded border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h3 className="font-bold text-gov-primary uppercase text-sm tracking-wide">Biểu đồ diện tích (Top 5)</h3>
            </div>
            <div className="h-72 w-full">
              {records.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      tick={{fontSize: 12, fill: '#6b7280'}} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{fontSize: 12, fill: '#6b7280'}} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      cursor={{fill: 'transparent'}}
                    />
                    <Bar dataKey="dt" radius={[4, 4, 0, 0]} barSize={40}>
                       {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#003366" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 italic bg-gray-50 rounded border border-dashed border-gray-300">
                  <LandPlot size={40} className="mb-2 opacity-50"/>
                  Chưa có dữ liệu để hiển thị
                </div>
              )}
            </div>
         </div>

         <div className="bg-white p-0 rounded border border-gray-200 shadow-sm flex flex-col">
            <div className="p-4 bg-yellow-50 border-b border-yellow-100 rounded-t">
              <h3 className="font-bold text-yellow-800 uppercase text-sm tracking-wide flex items-center gap-2">
                Thông tin lưu ý
              </h3>
            </div>
            <div className="p-4 text-sm text-gray-700 flex-grow">
              <ul className="space-y-3 pl-4 list-disc marker:text-yellow-600">
                <li>
                  <span className="font-semibold text-gray-900">Sao lưu dữ liệu:</span> 
                  <p className="text-gray-500 text-xs mt-1">Dữ liệu được lưu trên trình duyệt này. Vui lòng xuất Excel định kỳ để tránh mất mát khi xóa cache.</p>
                </li>
                <li>
                  <span className="font-semibold text-gray-900">Quy tắc nhập liệu:</span>
                  <p className="text-gray-500 text-xs mt-1">Mã hồ sơ là duy nhất. Diện tích nông nghiệp sẽ được tính tự động.</p>
                </li>
                <li>
                   <span className="font-semibold text-gray-900">Hỗ trợ kỹ thuật:</span>
                   <p className="text-gray-500 text-xs mt-1">Liên hệ Phòng CNTT UBND Phường Minh Hưng (0251.xxx.xxx)</p>
                </li>
              </ul>
            </div>
            <div className="p-3 bg-gray-50 border-t text-xs text-center text-gray-500">
              Phiên bản phần mềm 1.0.2
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;