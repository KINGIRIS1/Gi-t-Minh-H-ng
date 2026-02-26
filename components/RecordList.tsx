
import React, { useState, useMemo, useRef } from 'react';
import { HoSoDat, UserRole } from '../types';
import { Edit, Trash2, Search, FileDown, Upload, Filter, FileText, ScrollText } from 'lucide-react';
import { exportToCSV } from '../services/storage';
import * as XLSX from 'xlsx';
// Dùng Named Import cho ExportModal
import { ExportModal } from './ExportModal';

interface RecordListProps {
  records: HoSoDat[];
  onEdit: (record: HoSoDat) => void;
  onDelete: (id: string) => void;
  onImport: (records: HoSoDat[]) => void;
  userRole?: UserRole;
}

const RecordList: React.FC<RecordListProps> = ({ records, onEdit, onDelete, onImport, userRole = 'USER' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exportRecord, setExportRecord] = useState<HoSoDat | null>(null); // State cho modal export
  const [exportType, setExportType] = useState<'PROPOSAL' | 'DECISION'>('PROPOSAL');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = userRole === 'ADMIN';

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.chuSuDung.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.maHS.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.soGCN.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.diaChiThua.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`XÁC NHẬN XÓA HỒ SƠ?\n\nChủ sử dụng: ${name}\n\nHành động này không thể hoàn tác.`)) {
      onDelete(id);
    }
  };

  const handleOpenExport = (record: HoSoDat, type: 'PROPOSAL' | 'DECISION') => {
    setExportRecord(record);
    setExportType(type);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const mappedData: HoSoDat[] = data.map((row: any) => {
          const dtTong = Number(row['DT Tổng']) || 0;
          const dtO = Number(row['DT Đất ở']) || 0;
          
          return {
            id: crypto.randomUUID(),
            maHS: row['Mã HS']?.toString() || '',
            ngayNhanHS: row['Ngày nhận'] || new Date().toISOString().slice(0, 10),
            chuSuDung: row['Chủ sử dụng'] || 'Chưa xác định',
            diaChiChu: row['Địa chỉ chủ'] || '',
            mst: row['MST']?.toString() || '',
            cccd: row['CCCD']?.toString() || '',
            soGCN: row['Số GCN']?.toString() || '',
            ngayCap: row['Ngày cấp'] || '',
            thua: row['Thửa']?.toString() || '',
            to: row['Tờ']?.toString() || '',
            diaChiThua: row['Địa chỉ thửa'] || '',
            dienTichTong: dtTong,
            dienTichDatO: dtO,
            dienTichNN: Math.max(0, parseFloat((dtTong - dtO).toFixed(2))), 
            ghiChu: ''
          };
        }).filter((r: HoSoDat) => r.maHS !== '' && r.chuSuDung !== 'Chưa xác định'); 

        if (mappedData.length > 0) {
          onImport(mappedData);
        } else {
          alert('Không tìm thấy dữ liệu hợp lệ trong file Excel.\nVui lòng kiểm tra lại tên cột.');
        }

      } catch (error) {
        console.error("Import lỗi:", error);
        alert('Có lỗi xảy ra khi đọc file. Vui lòng thử lại.');
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const formatCurrency = (val?: number) => val ? val.toLocaleString('vi-VN') : '-';

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Modal Xuất Dữ Liệu - Sẽ hiển thị khi exportRecord khác null */}
      {exportRecord && (
        <ExportModal 
          record={exportRecord}
          type={exportType}
          onClose={() => setExportRecord(null)} 
        />
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".xlsx, .xls, .csv" 
        className="hidden" 
      />

      <div className="bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
           <div className="bg-gov-primary text-white p-2 rounded">
             <Filter size={18}/>
           </div>
           <h3 className="font-bold text-gray-700 uppercase text-sm">Bộ lọc dữ liệu</h3>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-grow md:flex-grow-0 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 group-focus-within:text-gov-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm hồ sơ..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded text-sm w-full md:w-80 focus:outline-none focus:ring-1 focus:ring-gov-primary bg-white text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isAdmin && (
            <button 
              onClick={triggerFileUpload}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-colors"
            >
              <Upload size={16} /> <span className="hidden md:inline">Nhập Excel</span>
            </button>
          )}

          <button 
            onClick={() => exportToCSV(filteredRecords)}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-colors"
          >
            <FileDown size={16} /> <span className="hidden md:inline">Xuất Excel</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden flex-grow flex flex-col">
        <div className="overflow-auto flex-grow">
          {/* BẢNG DỮ LIỆU CÓ SCROLL NGANG */}
          <table className="min-w-max divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th rowSpan={2} className="sticky left-0 top-0 bg-gray-100 px-4 py-3 text-center text-xs font-bold uppercase border-b border-r w-12 z-10">STT</th>
                <th rowSpan={2} className="sticky left-12 top-0 bg-gray-100 px-4 py-3 text-left text-xs font-bold uppercase border-b border-r z-10 w-48">Chủ sử dụng & Mã HS</th>
                
                {/* NHÓM THỬA ĐẤT */}
                <th colSpan={4} className="px-4 py-2 text-center text-xs font-bold uppercase border-b border-r bg-blue-50/50">Thông tin thửa đất</th>
                
                {/* NHÓM DIỆN TÍCH */}
                <th colSpan={2} className="px-4 py-2 text-center text-xs font-bold uppercase border-b border-r bg-green-50/50">Diện tích (m²)</th>

                {/* NHÓM KỸ THUẬT (Mới) */}
                <th colSpan={3} className="px-4 py-2 text-center text-xs font-bold uppercase border-b border-r bg-yellow-50/50">Kỹ thuật & Trích đo</th>

                {/* NHÓM GIÁ (Mới) */}
                <th colSpan={2} className="px-4 py-2 text-center text-xs font-bold uppercase border-b border-r bg-purple-50/50">Đơn giá (VNĐ)</th>

                <th rowSpan={2} className="sticky right-0 top-0 bg-gray-100 px-4 py-3 text-center text-xs font-bold uppercase border-b border-l w-48 z-10">Tác vụ</th>
              </tr>
              <tr>
                {/* Sub-header Thửa đất */}
                <th className="px-2 py-2 text-center text-xs font-medium border-b border-r">Số GCN</th>
                <th className="px-2 py-2 text-center text-xs font-medium border-b border-r">Tờ/Thửa</th>
                <th className="px-2 py-2 text-left text-xs font-medium border-b border-r min-w-[150px]">Địa chỉ đất</th>
                <th className="px-2 py-2 text-left text-xs font-medium border-b border-r min-w-[150px]">Tên đường</th>

                {/* Sub-header Diện tích */}
                <th className="px-2 py-2 text-right text-xs font-medium border-b border-r">Tổng DT</th>
                <th className="px-2 py-2 text-right text-xs font-bold text-green-700 border-b border-r">Xin CMD</th>

                {/* Sub-header Kỹ thuật */}
                <th className="px-2 py-2 text-center text-xs font-medium border-b border-r">Số Trích đo</th>
                <th className="px-2 py-2 text-center text-xs font-medium border-b border-r">Ngày XN</th>
                <th className="px-2 py-2 text-left text-xs font-medium border-b border-r min-w-[120px]">Quy hoạch</th>

                {/* Sub-header Giá */}
                <th className="px-2 py-2 text-right text-xs font-medium border-b border-r text-green-700">Giá NN</th>
                <th className="px-2 py-2 text-right text-xs font-medium border-b border-r text-blue-700">Giá Đất ở</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <tr key={record.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500 bg-gray-50/50 sticky left-0 z-0">{index + 1}</td>
                    
                    <td className="px-4 py-3 sticky left-12 bg-white z-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="text-sm font-bold text-gray-800 uppercase">{record.chuSuDung}</div>
                      <div className="text-xs text-gov-primary font-mono mt-0.5">{record.maHS}</div>
                      <div className="text-[10px] text-gray-500">{record.ngayNhanHS}</div>
                    </td>
                    
                    {/* Thửa đất */}
                    <td className="px-2 py-3 text-center text-sm">{record.soGCN || '-'}</td>
                    <td className="px-2 py-3 text-center text-sm bg-blue-50/30">
                       <div className="font-medium text-blue-800">{record.to} / {record.thua}</div>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-600 truncate max-w-[150px]" title={record.diaChiThua}>{record.diaChiThua}</td>
                    <td className="px-2 py-3 text-sm text-gray-600 truncate max-w-[150px]" title={record.tenDuong}>{record.tenDuong || '-'}</td>

                    {/* Diện tích */}
                    <td className="px-2 py-3 text-right text-sm font-medium">{record.dienTichTong}</td>
                    <td className="px-2 py-3 text-right text-sm font-bold text-green-700 bg-green-50/30">{record.dienTichXinCMD || record.dienTichTong}</td>

                    {/* Kỹ thuật */}
                    <td className="px-2 py-3 text-center text-sm text-gray-600">{record.soTrichDo || '-'}</td>
                    <td className="px-2 py-3 text-center text-sm text-gray-600">{record.ngayPhieuXN ? new Date(record.ngayPhieuXN).toLocaleDateString('vi-VN') : '-'}</td>
                    <td className="px-2 py-3 text-sm text-gray-600 truncate max-w-[120px]" title={record.quyHoachSDD}>{record.quyHoachSDD || '-'}</td>

                    {/* Giá */}
                    <td className="px-2 py-3 text-right text-sm text-green-700">{formatCurrency(record.giaDatNN)}</td>
                    <td className="px-2 py-3 text-right text-sm text-blue-700 font-bold bg-blue-50/30">{formatCurrency(record.giaDatO)}</td>

                    {/* Tác vụ */}
                    <td className="px-4 py-3 whitespace-nowrap text-center sticky right-0 bg-white z-0 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex justify-center gap-1.5">
                        <button 
                          onClick={() => handleOpenExport(record, 'PROPOSAL')}
                          className="p-1.5 bg-amber-100 text-amber-800 border border-amber-300 rounded hover:bg-amber-200" 
                          title="Xuất Tờ Trình"
                        >
                          <FileText size={14} />
                        </button>
                        
                        <button 
                          onClick={() => handleOpenExport(record, 'DECISION')}
                          className="p-1.5 bg-purple-100 text-purple-800 border border-purple-300 rounded hover:bg-purple-200" 
                          title="Xuất Quyết định"
                        >
                          <ScrollText size={14} />
                        </button>

                         <div className="w-px h-5 bg-gray-300 mx-1 self-center"></div>

                        <button onClick={() => onEdit(record)} className="p-1.5 bg-blue-100 text-blue-800 border border-blue-300 rounded hover:bg-blue-200">
                          <Edit size={14} />
                        </button>
                        
                        {isAdmin && (
                          <button onClick={() => handleDelete(record.id, record.chuSuDung)} className="p-1.5 bg-red-100 text-red-800 border border-red-300 rounded hover:bg-red-200">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={15} className="px-6 py-16 text-center text-gray-500">
                      Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
           <span className="text-xs text-gray-500">Hiển thị {filteredRecords.length} hồ sơ</span>
           <div className="flex gap-1">
             <button className="px-2 py-1 border rounded text-xs bg-white text-gray-600 disabled:opacity-50" disabled>Trước</button>
             <button className="px-2 py-1 border rounded text-xs bg-gov-primary text-white">1</button>
             <button className="px-2 py-1 border rounded text-xs bg-white text-gray-600 disabled:opacity-50" disabled>Sau</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RecordList;
