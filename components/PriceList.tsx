
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BangGiaDat, UserRole } from '../types';
import { getPriceList, savePrice, deletePrice, importPrices } from '../services/storage';
import { Search, Upload, Plus, Trash2, Edit2, Save, X, Banknote, RefreshCw, Sprout, Trees, Fish, Factory, HelpCircle, FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Props {
  userRole: UserRole;
}

const PriceList: React.FC<Props> = ({ userRole }) => {
  const [prices, setPrices] = useState<BangGiaDat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState<BangGiaDat | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getPriceList();
    setPrices(data);
    setLoading(false);
  };

  const filteredPrices = useMemo(() => {
    return prices.filter(p => 
      (p.tenDuong || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.diemDau || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.diemCuoi || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [prices, searchTerm]);

  const parseExcelNumber = (val: any): number => {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return val;
    // Xử lý chuỗi: xóa dấu chấm phân cách ngàn, giữ lại số
    const str = val.toString().replace(/\./g, '').replace(/,/g, '').replace(/[^0-9]/g, ''); 
    const num = Number(str);
    return isNaN(num) ? 0 : num;
  };

  // Logic chuẩn hóa giá trị: LUÔN NHÂN 1000 theo yêu cầu "đơn vị nghìn đồng/m2"
  const normalizePrice = (val: number): number => {
    if (val > 0) {
      return val * 1000;
    }
    return 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        
        if (!rawData || rawData.length === 0) {
           alert("File Excel trống!");
           return;
        }

        // --- TỰ ĐỘNG DÒ TÌM CỘT (HEADER MAPPING) ---
        let headerRowIndex = -1;
        const colMap: Record<string, number> = {};

        // Quét 10 dòng đầu tiên để tìm Header
        for (let i = 0; i < Math.min(rawData.length, 10); i++) {
            const rowStr = rawData[i].map(c => c?.toString().toLowerCase() || '').join(' ');
            if (rowStr.includes('tên đường') || rowStr.includes('giá đất ở')) {
                headerRowIndex = i;
                rawData[i].forEach((cell: any, idx: number) => {
                    const txt = cell?.toString().toLowerCase().trim() || '';
                    if (txt.includes('tên đường')) colMap['tenDuong'] = idx;
                    else if (txt.includes('điểm đầu')) colMap['diemDau'] = idx;
                    else if (txt.includes('điểm cuối')) colMap['diemCuoi'] = idx;
                    else if (txt.includes('đất ở') || txt === 'odt') colMap['giaDatO'] = idx;
                    else if (txt.includes('tmdv') || txt.includes('thương mại')) colMap['giaTmDv'] = idx;
                    else if (txt.includes('sxkd') || txt.includes('phi nông nghiệp') || txt.includes('pnn')) colMap['giaSxPhiNn'] = idx;
                    else if (txt.includes('cln') || txt.includes('lâu năm')) colMap['giaDatCLN'] = idx;
                    else if (txt.includes('chn') || txt.includes('hằng năm')) colMap['giaDatCHN'] = idx;
                    else if (txt.includes('nts') || txt.includes('thủy sản') || txt.includes('nuôi trồng')) colMap['giaDatNTS'] = idx;
                });
                break;
            }
        }

        const getCell = (row: any[], key: string, fallbackIdx: number) => {
            const idx = colMap[key] !== undefined ? colMap[key] : fallbackIdx;
            return row[idx];
        };

        const dataRows = headerRowIndex !== -1 ? rawData.slice(headerRowIndex + 1) : rawData;

        const mappedData: BangGiaDat[] = dataRows.map((row: any[]) => {
            const valTenDuong = getCell(row, 'tenDuong', 0);
            const tenDuongStr = valTenDuong ? valTenDuong.toString().trim() : '';
            
            if (!tenDuongStr || tenDuongStr.toLowerCase().includes('tên đường') || tenDuongStr === 'stt') return null;

            // Đọc giá trị thô và nhân 1000
            const rawO = parseExcelNumber(getCell(row, 'giaDatO', 3));
            const rawTmDv = parseExcelNumber(getCell(row, 'giaTmDv', 4));
            const rawSxPnn = parseExcelNumber(getCell(row, 'giaSxPhiNn', 5));
            const rawCLN = parseExcelNumber(getCell(row, 'giaDatCLN', 6));
            const rawCHN = parseExcelNumber(getCell(row, 'giaDatCHN', 7));
            const rawNTS = parseExcelNumber(getCell(row, 'giaDatNTS', 8));

            return {
                id: crypto.randomUUID(),
                tenDuong: tenDuongStr,                                
                diemDau: getCell(row, 'diemDau', 1)?.toString().trim() || '',   
                diemCuoi: getCell(row, 'diemCuoi', 2)?.toString().trim() || '',  
                
                giaDatO: normalizePrice(rawO),                 
                giaTmDv: normalizePrice(rawTmDv),                 
                giaSxPhiNn: normalizePrice(rawSxPnn), 
                
                giaDatCLN: normalizePrice(rawCLN),  
                giaDatCHN: normalizePrice(rawCHN),  
                giaDatNTS: normalizePrice(rawNTS),  
                
                namApDung: 2026
            };
        }).filter(item => item !== null) as BangGiaDat[];

        if (mappedData.length > 0) {
          let msg = `✅ Tìm thấy ${mappedData.length} dòng dữ liệu hợp lệ.\n`;
          msg += `(Đã tự động nhân 1.000 cho các đơn giá theo đơn vị nghìn đồng/m²)\n\n`;
          
          const preview = mappedData.slice(0, 3).map(d => `- ${d.tenDuong}: ${new Intl.NumberFormat('vi-VN').format(d.giaDatO)} đ/m²`).join('\n');
          msg += `Xem trước 3 dòng đầu:\n${preview}\n...`;

          if(window.confirm(`${msg}\n\nBạn có muốn lưu vào hệ thống không?`)) {
             setLoading(true);
             const success = await importPrices(mappedData);
             if (success) {
               alert("Đã nhập dữ liệu thành công!");
               await loadData();
             }
             setLoading(false);
          }
        } else {
          alert(`Không tìm thấy dữ liệu hợp lệ! Vui lòng kiểm tra file Excel.`);
        }
      } catch (error) {
        console.error(error);
        alert("Lỗi đọc file Excel: " + error);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const headers = [
      ["Tên đường", "Điểm đầu", "Điểm cuối", "Giá Đất Ở", "Giá TMDV", "Giá SXKD PNN", "Giá CLN", "Giá CHN", "Giá đất nuôi trồng thủy sản"],
      ["Đường số 1 (Nhập 5000 = 5tr)", "Ngã 3 A", "Ngã 4 B", 5000, 3000, 2000, 500, 400, 200]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MauNhapLieu");
    XLSX.writeFile(wb, "Mau_Bang_Gia_Dat_2026.xlsx");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    if (!isEditing.tenDuong) {
        alert("Vui lòng nhập tên đường");
        return;
    }
    setLoading(true);
    const success = await savePrice(isEditing);
    if (success) {
        setIsEditing(null);
        await loadData();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Xóa dòng giá này?")) {
      setLoading(true);
      await deletePrice(id);
      await loadData();
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(val);

  const handleCreateNew = () => {
      setIsEditing({ 
          id: '', tenDuong: '', diemDau: '', diemCuoi: '', 
          giaDatO: 0, giaTmDv: 0, giaSxPhiNn: 0,
          giaDatCLN: 0, giaDatCHN: 0, giaDatNTS: 0,
          namApDung: 2026 
      } as BangGiaDat);
  };

  return (
    <div className="space-y-4 fade-in h-full flex flex-col">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx,.xls" className="hidden" />

      {/* Toolbar */}
      <div className="bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
           <div className="bg-amber-600 text-white p-2 rounded">
             <Banknote size={18}/>
           </div>
           <div>
             <h3 className="font-bold text-gray-700 uppercase text-sm">Bảng Giá Đất 2026</h3>
             <p className="text-xs text-gray-500">Quản lý giá đất Phi Nông Nghiệp & Nông Nghiệp</p>
           </div>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-grow md:flex-grow-0">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm tên đường..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded text-sm w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-gov-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button onClick={loadData} className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded border border-gray-300" title="Tải lại dữ liệu">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          {isAdmin && (
            <>
              <button onClick={handleCreateNew} className="flex items-center gap-2 bg-gov-primary text-white px-3 py-2 rounded text-sm hover:bg-blue-800">
                <Plus size={16} /> <span className="hidden sm:inline">Thêm mới</span>
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-green-700 text-white px-3 py-2 rounded-l text-sm hover:bg-green-800">
                  <Upload size={16} /> <span className="hidden sm:inline">Nhập Excel</span>
                </button>
                <button onClick={downloadTemplate} className="bg-green-800 text-white px-3 py-2 rounded-r text-sm hover:bg-green-900 border-l border-green-700" title="Tải file Excel mẫu">
                  <FileDown size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden animate-fade-in-down max-h-[90vh] overflow-y-auto">
            <div className="bg-gov-primary px-6 py-4 flex justify-between items-center sticky top-0 z-20">
              <h3 className="text-white font-bold uppercase">{isEditing.id ? 'Cập nhật giá đất' : 'Thêm giá đất mới'}</h3>
              <button onClick={() => setIsEditing(null)} className="text-white hover:text-red-200"><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Tên đường giao thông <span className="text-red-500">*</span></label>
                <input required className="w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-gov-primary" 
                  value={isEditing.tenDuong || ''} 
                  onChange={e => setIsEditing(prev => prev ? {...prev, tenDuong: e.target.value} : null)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Điểm đầu</label>
                <input className="w-full border rounded px-3 py-2 text-sm" 
                  value={isEditing.diemDau || ''} 
                  onChange={e => setIsEditing(prev => prev ? {...prev, diemDau: e.target.value} : null)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Điểm cuối</label>
                <input className="w-full border rounded px-3 py-2 text-sm" 
                  value={isEditing.diemCuoi || ''} 
                  onChange={e => setIsEditing(prev => prev ? {...prev, diemCuoi: e.target.value} : null)}
                />
              </div>
              
              <div className="border-t md:col-span-2 my-2 bg-blue-50 -mx-6 px-6 py-2">
                 <span className="text-xs font-bold text-blue-800 uppercase">1. Đất Phi Nông Nghiệp (VNĐ/m²)</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-blue-800 mb-1">Giá đất ở (ODT/ONT)</label>
                <input type="number" className="w-full border border-blue-300 bg-blue-50 rounded px-3 py-2 text-sm font-bold text-right" 
                  value={isEditing.giaDatO} 
                  onChange={e => setIsEditing(prev => prev ? {...prev, giaDatO: Number(e.target.value)} : null)} 
                />
              </div>
               <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Giá TM-DV (Nếu có)</label>
                <input type="number" className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-right" 
                  value={isEditing.giaTmDv} 
                  onChange={e => setIsEditing(prev => prev ? {...prev, giaTmDv: Number(e.target.value)} : null)} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-purple-800 mb-1 flex items-center gap-1">
                   <Factory size={12}/> Giá SXKD Phi Nông nghiệp
                </label>
                <input type="number" className="w-full border border-purple-300 bg-purple-50 rounded px-3 py-2 text-sm font-bold text-right" 
                  value={isEditing.giaSxPhiNn} 
                  onChange={e => setIsEditing(prev => prev ? {...prev, giaSxPhiNn: Number(e.target.value)} : null)} 
                />
              </div>

              <div className="border-t md:col-span-2 my-2 bg-green-50 -mx-6 px-6 py-2">
                 <span className="text-xs font-bold text-green-800 uppercase">2. Đất Nông Nghiệp (VNĐ/m²)</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-green-700 mb-1 flex items-center gap-1">
                   <Trees size={12}/> Cây lâu năm (CLN)
                </label>
                <input type="number" className="w-full border border-green-200 bg-green-50 rounded px-3 py-2 text-sm text-right font-medium text-green-800" 
                  value={isEditing.giaDatCLN || 0} 
                  onChange={e => setIsEditing(prev => prev ? {...prev, giaDatCLN: Number(e.target.value)} : null)} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-green-600 mb-1 flex items-center gap-1">
                   <Sprout size={12}/> Cây hằng năm (CHN)
                </label>
                <input type="number" className="w-full border border-green-200 bg-green-50 rounded px-3 py-2 text-sm text-right font-medium text-green-800" 
                  value={isEditing.giaDatCHN || 0} 
                  onChange={e => setIsEditing(prev => prev ? {...prev, giaDatCHN: Number(e.target.value)} : null)} 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-teal-700 mb-1 flex items-center gap-1">
                   <Fish size={12}/> Nuôi trồng thủy sản (NTS)
                </label>
                <input type="number" className="w-full border border-teal-300 bg-teal-50 rounded px-3 py-2 text-sm text-right font-bold text-teal-800 focus:ring-1 focus:ring-teal-500" 
                  value={isEditing.giaDatNTS || 0} 
                  onChange={e => setIsEditing(prev => prev ? {...prev, giaDatNTS: Number(e.target.value)} : null)} 
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsEditing(null)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Hủy bỏ</button>
                <button type="submit" className="px-6 py-2 bg-gov-primary text-white rounded hover:bg-blue-800 font-bold flex items-center gap-2">
                    {loading ? <RefreshCw className="animate-spin" size={16}/> : <Save size={16}/>} 
                    Lưu dữ liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden flex-grow flex flex-col">
        <div className="overflow-auto flex-grow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th rowSpan={2} className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase border-r border-b w-64">Tên đường</th>
                <th colSpan={2} className="px-4 py-2 text-center text-xs font-bold text-gray-700 uppercase border-b">Phạm vi</th>
                
                {/* NHÓM PHI NÔNG NGHIỆP */}
                <th colSpan={3} className="px-4 py-2 text-center text-xs font-bold text-blue-800 uppercase border-b border-r bg-blue-50/30">Phi Nông Nghiệp</th>
                
                {/* NHÓM NÔNG NGHIỆP */}
                <th colSpan={3} className="px-4 py-2 text-center text-xs font-bold text-green-800 uppercase border-b bg-green-50/30">Nông Nghiệp</th>
                
                {isAdmin && <th rowSpan={2} className="px-4 py-3 text-center text-xs font-bold text-gray-700 border-l border-b w-24">Tác vụ</th>}
              </tr>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 border-b border-r bg-gray-50">Đầu</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 border-b border-r bg-gray-50">Cuối</th>
                
                {/* 1. Đất Ở */}
                <th className="px-2 py-2 text-right text-xs font-bold text-blue-700 border-b border-r bg-blue-50/30">Đất Ở</th>
                {/* 2. TM-DV */}
                <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 border-b border-r bg-gray-50/30">TM-DV</th>
                {/* 3. SXKD Phi Nông Nghiệp */}
                <th className="px-2 py-2 text-right text-xs font-bold text-purple-700 border-b border-r bg-purple-50/30" title="SXKD Phi Nông Nghiệp">SXKD PNN</th>

                {/* 4. Cây Lâu Năm */}
                <th className="px-2 py-2 text-right text-xs font-bold text-green-700 border-b border-r bg-green-50/30" title="Cây lâu năm">CLN</th>
                {/* 5. Cây Hằng Năm */}
                <th className="px-2 py-2 text-right text-xs font-medium text-green-600 border-b border-r bg-green-50/30" title="Cây hằng năm">CHN</th>
                {/* 6. Thủy Sản - CHUẨN HEADER: NTS */}
                <th className="px-2 py-2 text-right text-xs font-bold text-teal-700 border-b bg-teal-50/30" title="Đất Nuôi Trồng Thủy Sản">NTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading && filteredPrices.length === 0 ? (
                 <tr><td colSpan={10} className="text-center py-10 text-gray-500"><RefreshCw className="inline animate-spin mr-2"/>Đang tải dữ liệu...</td></tr>
              ) : filteredPrices.length === 0 ? (
                 <tr><td colSpan={10} className="text-center py-10 text-gray-500 italic">Không tìm thấy dữ liệu phù hợp</td></tr>
              ) : (
                filteredPrices.map((p, idx) => (
                  <tr key={p.id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-gray-800 border-r align-top">{p.tenDuong}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 border-r align-top">{p.diemDau}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 border-r align-top">{p.diemCuoi}</td>
                    
                    <td className="px-2 py-3 text-sm text-right font-bold text-blue-700 border-r bg-blue-50/30">{formatCurrency(p.giaDatO)}</td>
                    <td className="px-2 py-3 text-sm text-right font-medium text-gray-500 border-r bg-gray-50/30">{formatCurrency(p.giaTmDv)}</td>
                    <td className="px-2 py-3 text-sm text-right font-medium text-purple-700 border-r bg-purple-50/30">{formatCurrency(p.giaSxPhiNn)}</td>
                    
                    <td className="px-2 py-3 text-sm text-right font-bold text-green-700 border-r bg-green-50/30">{p.giaDatCLN ? formatCurrency(p.giaDatCLN) : '-'}</td>
                    <td className="px-2 py-3 text-sm text-right font-medium text-green-600 border-r bg-green-50/30">{p.giaDatCHN ? formatCurrency(p.giaDatCHN) : '-'}</td>
                    <td className="px-2 py-3 text-sm text-right font-bold text-teal-700 bg-teal-50/30">{p.giaDatNTS ? formatCurrency(p.giaDatNTS) : '-'}</td>

                    {isAdmin && (
                      <td className="px-4 py-3 text-center border-l align-middle">
                         <div className="flex justify-center gap-2">
                           <button onClick={() => setIsEditing(p)} className="text-blue-600 hover:text-blue-800" title="Sửa"><Edit2 size={16}/></button>
                           <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800" title="Xóa"><Trash2 size={16}/></button>
                         </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriceList;
