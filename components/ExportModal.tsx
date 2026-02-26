
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HoSoDat } from '../types';
import { getSettings, DEFAULT_HTML_TEMPLATE, DEFAULT_DECISION_TEMPLATE } from '../services/storage';
import { X, ExternalLink, Copy, FileText, Download, Edit3, Check, RotateCcw, Bold, Italic, Underline } from 'lucide-react';

interface Props {
  record: HoSoDat;
  type?: 'PROPOSAL' | 'DECISION'; // Loại văn bản: Tờ trình (Mặc định) hoặc Quyết định
  onClose: () => void;
}

// Chuyển sang Named Export để tránh lỗi import
export const ExportModal: React.FC<Props> = ({ record, type = 'PROPOSAL', onClose }) => {
  const settings = getSettings();
  const [isEditable, setIsEditable] = useState(false);
  
  // Ref để truy cập nội dung HTML thực tế (đã chỉnh sửa) trong DOM
  const previewContentRef = useRef<HTMLDivElement>(null);

  // State lưu trữ nội dung HTML ban đầu được tạo từ Template
  const [generatedHtml, setGeneratedHtml] = useState('');

  // 1. Tạo Data Mapping từ record (Lấy trực tiếp dữ liệu đã lưu)
  const mappingData = useMemo(() => {
    // Xử lý các trường có thể null/undefined
    const soTrichDo = record.soTrichDo || '.....';
    const tyLe = record.tyLeBanDo || '1/1000';
    const ngayTrichLuc = record.ngayTrichLuc ? new Date(record.ngayTrichLuc).toLocaleDateString('vi-VN') : '.....';
    const ngayPhieuXN = record.ngayPhieuXN ? new Date(record.ngayPhieuXN).toLocaleDateString('vi-VN') : '.....';
    const ngayXacMinh = record.ngayXacMinh ? new Date(record.ngayXacMinh).toLocaleDateString('vi-VN') : '.....';
    const tenDuong = record.tenDuong || '....................';
    const phanKhu = record.phanKhu || '....................';
    const quyHoach = record.quyHoachSDD || 'Đất ở tại nông thôn (ONT)';
    const quyHoachChung = 'Đất ở'; // Mặc định hoặc lấy từ config
    const viTriNN = record.viTriDatNN || 'Vị trí 1';
    const dienGiaiViTri = record.dienGiaiViTriNN || 'Cách đường PLVII dưới 100m';
    
    // Cập nhật định dạng giá: Thêm " đồng/m²" vào sau số tiền
    const giaO = record.giaDatO ? `${record.giaDatO.toLocaleString('vi-VN')} đồng/m²` : '...';
    const giaNN = record.giaDatNN ? `${record.giaDatNN.toLocaleString('vi-VN')} đồng/m²` : '...';
    
    const loaiDatGCN = record.loaiDatGCN || 'Đất trồng cây lâu năm';
    const apKhuPho = record.apKhuPho || (record.diaChiThua.split(',')[0] || '');
    // Ưu tiên lấy diện tích xin CMD, nếu không có thì lấy tổng diện tích
    const dienTichXin = record.dienTichXinCMD ? record.dienTichXinCMD : record.dienTichTong;

    return {
      '«Chu_su_dung»': record.chuSuDung.toUpperCase(),
      '«Ngay_don_nhap»': new Date(record.ngayNhanHS).toLocaleDateString('vi-VN'),
      '«So_tric_do_nhap»': soTrichDo,
      '«ty_le_ban_do»': tyLe,
      '«ngay_trich_luc_nhap»': ngayTrichLuc,
      '«Ngay_phieu_XN_nhap»': ngayPhieuXN,
      '«Ngay_xac_minh_nhap»': ngayXacMinh,
      '«thua_so»': record.thua,
      '«to_so»': record.to,
      '«DT_GCN_nhap»': record.dienTichTong,
      '«Text_loai_dat_GCN_ONT»': loaiDatGCN,
      '«CLN_tren_GCN»': record.dienTichNN,
      '«Trong_ngoài»': record.trongNgoaiKDC || 'Trong khu dân cư',
      '«Phan_Khu»': phanKhu,
      '«QHSDD»': quyHoach,
      '«QH_chung»': quyHoachChung,
      '«Hộ_Khẩu»': record.diaChiChu,
      '«xin_CMD_mm»': dienTichXin,
      '«ap__KP»': apKhuPho,
      '«Vị_trí_đất_NN»': viTriNN,
      '«VT_dat_NN_text»': dienGiaiViTri,
      '«GIA_CLN»': giaNN,
      '«key»': tenDuong,
      '«GIA_ODT»': giaO,
    };
  }, [record]);

  // 2. Hàm sinh nội dung HTML từ Template + Data
  const generateHTML = () => {
    // Lấy template tương ứng dựa vào prop type
    let content = '';
    if (type === 'DECISION') {
       content = settings.decisionTemplate || DEFAULT_DECISION_TEMPLATE;
    } else {
       content = settings.htmlTemplate || DEFAULT_HTML_TEMPLATE;
    }

    Object.entries(mappingData).forEach(([key, value]) => {
      // Replace all occurrences using split/join for better performance/safety than regex
      content = content.split(key).join(String(value));
    });
    return content;
  };

  // Khởi tạo HTML khi mount hoặc khi template/data thay đổi
  useEffect(() => {
    if (!isEditable) {
        const html = generateHTML();
        setGeneratedHtml(html);
        if (previewContentRef.current) {
            previewContentRef.current.innerHTML = html;
        }
    }
  }, [mappingData, settings.htmlTemplate, settings.decisionTemplate, type]);

  const handleCopy = () => {
    // Copy text thuần từ dữ liệu mapping
    const textToCopy = Object.entries(mappingData).map(([key, val]) => `${key}: ${val}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Đã copy dữ liệu thô vào bộ nhớ tạm!');
  };

  const handleOpenDoc = () => {
    if (settings.googleDocUrl) {
      window.open(settings.googleDocUrl, '_blank');
    } else {
      alert('Vui lòng vào Cấu hình để cài đặt link Google Docs mẫu trước.');
    }
  };

  const handleDownloadWord = () => {
    // QUAN TRỌNG: Lấy nội dung HTML từ chính DOM node (để bao gồm cả những sửa đổi thủ công của người dùng)
    const currentContent = previewContentRef.current ? previewContentRef.current.innerHTML : generatedHtml;
    const fileNamePrefix = type === 'DECISION' ? 'QuyetDinh' : 'ToTrinh';

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${type === 'DECISION' ? 'Quyết định' : 'Tờ trình'}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 14pt; }
        p { margin: 0 0 6pt 0; }
        table { border-collapse: collapse; }
      </style>
      </head>
      <body>${currentContent}</body>
      </html>
    `;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(content);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${fileNamePrefix}_${record.chuSuDung}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const toggleEditMode = () => {
      setIsEditable(!isEditable);
  };

  const handleResetContent = () => {
      if(window.confirm("Hủy bỏ các chỉnh sửa thủ công và quay lại dữ liệu gốc?")) {
          const html = generateHTML();
          setGeneratedHtml(html);
          if (previewContentRef.current) previewContentRef.current.innerHTML = html;
          setIsEditable(false);
      }
  };

  // Simple formatting commands for editor
  const execCmd = (command: string) => {
    document.execCommand(command, false);
    if (previewContentRef.current) previewContentRef.current.focus();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] h-[95vh] overflow-hidden flex flex-col animate-fade-in-down">
        
        {/* Header */}
        <div className="bg-gov-primary px-6 py-4 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-white font-bold text-lg uppercase flex items-center gap-2">
               <FileText size={20}/> {type === 'DECISION' ? 'Xuất Quyết Định' : 'Xuất Tờ Trình CMD'}
            </h3>
            <p className="text-blue-200 text-xs mt-1">Dữ liệu đã được điền tự động từ hồ sơ chi tiết</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/10 p-1 rounded transition-colors">
            <X size={24}/>
          </button>
        </div>

        {/* Toolbar */}
        <div className="h-14 bg-gray-100 border-b flex items-center justify-between px-6 shadow-sm shrink-0">
           <div className="flex items-center gap-3">
              <button 
                onClick={toggleEditMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all shadow-sm ${isEditable ? 'bg-amber-100 text-amber-800 border border-amber-300 ring-2 ring-amber-200' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
              >
                 {isEditable ? <><Check size={16}/> Hoàn Tất Sửa</> : <><Edit3 size={16}/> Sửa Văn Bản</>}
              </button>

              {isEditable && (
                <>
                  <div className="h-6 w-px bg-gray-300 mx-2"></div>
                  <div className="flex bg-white rounded border border-gray-300 p-0.5 shadow-sm">
                    <button onClick={() => execCmd('bold')} className="p-1.5 hover:bg-gray-100 rounded" title="In đậm"><Bold size={16}/></button>
                    <button onClick={() => execCmd('italic')} className="p-1.5 hover:bg-gray-100 rounded" title="In nghiêng"><Italic size={16}/></button>
                    <button onClick={() => execCmd('underline')} className="p-1.5 hover:bg-gray-100 rounded" title="Gạch chân"><Underline size={16}/></button>
                  </div>
                  <button onClick={handleResetContent} className="text-red-500 hover:text-red-700 px-3 py-1.5 text-xs font-medium bg-red-50 rounded border border-red-200 ml-2" title="Reset về mặc định">
                     <span className="flex items-center gap-1"><RotateCcw size={14}/> Khôi phục gốc</span>
                  </button>
                </>
              )}
           </div>
           
           <div className="text-xs text-gray-500 italic hidden md:block">
              {isEditable ? 'Đang ở chế độ chỉnh sửa trực tiếp...' : 'Kiểm tra kỹ nội dung trước khi in/xuất file.'}
           </div>
        </div>

        {/* Body: Full Screen Preview */}
        <div className="flex-grow overflow-hidden bg-gray-200 relative">
           <div className="absolute inset-0 overflow-y-auto p-8 flex justify-center">
               <div 
                  ref={previewContentRef}
                  contentEditable={isEditable}
                  suppressContentEditableWarning={true}
                  className={`
                    bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[20mm_15mm_20mm_30mm] transition-all duration-200
                    ${isEditable ? 'outline-2 outline-dashed outline-amber-400 cursor-text ring-4 ring-amber-50' : ''}
                  `}
                  // Initial Content (chỉ dùng lần đầu, sau đó ref quản lý)
                  dangerouslySetInnerHTML={{ __html: generatedHtml }}
               />
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center gap-4 shrink-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <button 
             onClick={handleCopy} 
             className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 font-medium transition-colors"
           >
             <Copy size={18}/> <span className="hidden sm:inline">Copy Data Thô</span>
           </button>

           <div className="flex gap-3">
              <button 
                onClick={handleOpenDoc} 
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded font-bold shadow transition-colors"
              >
                <ExternalLink size={18}/> Mở Google Docs
              </button>

              <button 
                onClick={handleDownloadWord} 
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-lg transition-colors ring-2 ring-blue-200 ring-offset-1"
              >
                <Download size={20}/> Tải Về File Word (.doc)
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
