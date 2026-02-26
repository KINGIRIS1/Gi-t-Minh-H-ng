
import React, { useState, useEffect, useRef } from 'react';
import { Save, FileText, Code, RotateCcw, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, ScrollText } from 'lucide-react';
import { getSettings, saveSettings, DEFAULT_HTML_TEMPLATE, DEFAULT_DECISION_TEMPLATE } from '../services/storage';

const Settings: React.FC = () => {
  const [docUrl, setDocUrl] = useState('');
  const [docName, setDocName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<'PROPOSAL' | 'DECISION'>('PROPOSAL');
  
  // Ref cho trình soạn thảo
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTemplate(activeTemplate);
  }, [activeTemplate]);

  const loadTemplate = (type: 'PROPOSAL' | 'DECISION') => {
    const settings = getSettings();
    setDocUrl(settings.googleDocUrl);
    setDocName(settings.googleDocName);
    
    if (editorRef.current) {
       if (type === 'DECISION') {
         editorRef.current.innerHTML = settings.decisionTemplate || DEFAULT_DECISION_TEMPLATE;
       } else {
         editorRef.current.innerHTML = settings.htmlTemplate || DEFAULT_HTML_TEMPLATE;
       }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const settings = getSettings();
    const htmlContent = editorRef.current?.innerHTML || '';

    if (activeTemplate === 'DECISION') {
       saveSettings({
        ...settings,
        googleDocUrl: docUrl,
        googleDocName: docName,
        decisionTemplate: htmlContent
       });
    } else {
       saveSettings({
        ...settings,
        googleDocUrl: docUrl,
        googleDocName: docName,
        htmlTemplate: htmlContent
       });
    }
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetTemplate = () => {
    if (window.confirm(`Bạn có chắc muốn khôi phục mẫu ${activeTemplate === 'PROPOSAL' ? 'TỜ TRÌNH' : 'QUYẾT ĐỊNH'} về mặc định?`)) {
      if (editorRef.current) {
        if (activeTemplate === 'DECISION') {
           editorRef.current.innerHTML = DEFAULT_DECISION_TEMPLATE;
        } else {
           editorRef.current.innerHTML = DEFAULT_HTML_TEMPLATE;
        }
      }
    }
  };

  // Hàm thực thi lệnh định dạng văn bản
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const PLACEHOLDERS = [
    { key: '«Chu_su_dung»', label: 'Tên chủ đất' },
    { key: '«cccd»', label: 'Số CCCD' },
    { key: '«Hộ_Khẩu»', label: 'Địa chỉ thường trú' },
    { key: '«thua_so»', label: 'Số thửa' },
    { key: '«to_so»', label: 'Số tờ' },
    { key: '«diaChiThua»', label: 'Địa chỉ đất' },
    { key: '«DT_GCN_nhap»', label: 'Diện tích tổng' },
    { key: '«xin_CMD_mm»', label: 'DT xin chuyển mục đích' },
    { key: '«CLN_tren_GCN»', label: 'DT Nông nghiệp' },
    { key: '«ap__KP»', label: 'Ấp/Khu phố' },
    { key: '«key»', label: 'Tên đường' },
    { key: '«QHSDD»', label: 'Quy hoạch SDĐ' },
    { key: '«Phan_Khu»', label: 'Phân khu' },
    { key: '«Trong_ngoài»', label: 'Trong/Ngoài KDC' },
    { key: '«So_tric_do_nhap»', label: 'Số trích đo' },
    { key: '«ngay_trich_luc_nhap»', label: 'Ngày trích đo' },
    { key: '«Ngay_xac_minh_nhap»', label: 'Ngày xác minh' },
    { key: '«GIA_ODT»', label: 'Giá đất ở' },
    { key: '«GIA_CLN»', label: 'Giá cây lâu năm' },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-down pb-20 h-full flex flex-col">
      
      {/* HEADER */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden shrink-0 mb-6">
        <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-full">
               {activeTemplate === 'PROPOSAL' ? <FileText size={20} /> : <ScrollText size={20} />}
             </div>
             <div>
               <h2 className="text-lg font-bold uppercase tracking-wider">Soạn Thảo Mẫu: {activeTemplate === 'PROPOSAL' ? 'TỜ TRÌNH' : 'QUYẾT ĐỊNH'}</h2>
               <p className="text-xs text-gray-400">Chỉnh sửa nội dung & Bố cục văn bản gốc</p>
             </div>
           </div>
           
           <div className="flex gap-3">
             <button 
               type="button" 
               onClick={handleResetTemplate}
               className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white text-sm transition-colors border border-gray-600 rounded hover:bg-gray-700"
             >
               <RotateCcw size={16}/> Khôi phục Mặc định
             </button>
             <button 
               onClick={handleSave} 
               className="flex items-center gap-2 px-6 py-2 bg-gov-primary hover:bg-blue-600 text-white rounded shadow font-bold transition-all border border-blue-500"
             >
               <Save size={18} /> Lưu Mẫu
             </button>
           </div>
        </div>
        
        {/* TAB CHUYỂN ĐỔI MẪU */}
        <div className="flex border-b border-gray-200 bg-gray-50">
           <button 
             onClick={() => setActiveTemplate('PROPOSAL')}
             className={`flex-1 py-3 text-sm font-bold flex justify-center items-center gap-2 transition-colors ${activeTemplate === 'PROPOSAL' ? 'bg-white text-gov-primary border-t-2 border-t-gov-primary' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             <FileText size={16}/> Mẫu Tờ Trình
           </button>
           <button 
             onClick={() => setActiveTemplate('DECISION')}
             className={`flex-1 py-3 text-sm font-bold flex justify-center items-center gap-2 transition-colors ${activeTemplate === 'DECISION' ? 'bg-white text-purple-700 border-t-2 border-t-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             <ScrollText size={16}/> Mẫu Quyết Định
           </button>
        </div>
        
        {isSaved && (
          <div className="bg-green-100 text-green-800 px-4 py-2 text-sm text-center font-medium animate-pulse border-b border-green-200">
            Đã lưu mẫu {activeTemplate === 'PROPOSAL' ? 'Tờ trình' : 'Quyết định'} thành công!
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-grow overflow-hidden">
        
        {/* LEFT: EDITOR */}
        <div className="flex-grow flex flex-col h-full bg-gray-100 rounded-lg border border-gray-300 overflow-hidden shadow-inner">
           
           {/* TOOLBAR */}
           <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-2 items-center shrink-0">
              <div className="flex bg-white rounded border border-gray-300 p-0.5 shadow-sm">
                <button onClick={() => execCmd('bold')} className="p-1.5 hover:bg-gray-100 rounded" title="In đậm"><Bold size={16}/></button>
                <button onClick={() => execCmd('italic')} className="p-1.5 hover:bg-gray-100 rounded" title="In nghiêng"><Italic size={16}/></button>
                <button onClick={() => execCmd('underline')} className="p-1.5 hover:bg-gray-100 rounded" title="Gạch chân"><Underline size={16}/></button>
              </div>
              
              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              <div className="flex bg-white rounded border border-gray-300 p-0.5 shadow-sm">
                <button onClick={() => execCmd('justifyLeft')} className="p-1.5 hover:bg-gray-100 rounded" title="Căn trái"><AlignLeft size={16}/></button>
                <button onClick={() => execCmd('justifyCenter')} className="p-1.5 hover:bg-gray-100 rounded" title="Căn giữa"><AlignCenter size={16}/></button>
                <button onClick={() => execCmd('justifyRight')} className="p-1.5 hover:bg-gray-100 rounded" title="Căn phải"><AlignRight size={16}/></button>
                <button onClick={() => execCmd('justifyFull')} className="p-1.5 hover:bg-gray-100 rounded" title="Căn đều"><AlignJustify size={16}/></button>
              </div>

               <div className="w-px h-6 bg-gray-300 mx-1"></div>
               
               <div className="text-xs text-gray-500 italic ml-auto mr-2">
                 Font: Times New Roman, 14pt (Chuẩn)
               </div>
           </div>

           {/* EDITABLE AREA */}
           <div className="flex-grow overflow-y-auto p-8 flex justify-center bg-gray-200/50">
              <div 
                ref={editorRef}
                contentEditable={true}
                spellCheck={false}
                className="bg-white shadow-lg w-[210mm] min-h-[297mm] p-[20mm_15mm_20mm_30mm] outline-none focus:ring-2 focus:ring-blue-300 transition-shadow"
                style={{ 
                  fontFamily: '"Times New Roman", serif', 
                  fontSize: '14pt', 
                  lineHeight: '1.5',
                  color: '#000'
                }}
              />
           </div>
        </div>

        {/* RIGHT: SIDEBAR (Variables) */}
        <div className="w-full lg:w-80 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col shrink-0 h-full overflow-hidden">
           <div className="p-4 bg-blue-50 border-b border-blue-100">
             <h3 className="font-bold text-blue-900 text-sm uppercase flex items-center gap-2">
               <Code size={16}/> Từ khóa dữ liệu
             </h3>
             <p className="text-xs text-blue-700 mt-1">Copy & Dán vào văn bản bên trái</p>
           </div>
           
           <div className="flex-grow overflow-y-auto p-2 space-y-1">
             {PLACEHOLDERS.map((item) => (
               <div 
                 key={item.key} 
                 className="group flex flex-col p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 cursor-pointer transition-all"
                 onClick={() => {
                    navigator.clipboard.writeText(item.key);
                    const el = document.getElementById(`badge-${item.key}`);
                    if(el) {
                        const originalText = el.innerText;
                        el.innerText = 'Đã Copy!';
                        el.classList.add('bg-green-100', 'text-green-800');
                        setTimeout(() => {
                            el.innerText = originalText;
                            el.classList.remove('bg-green-100', 'text-green-800');
                        }, 1000);
                    }
                 }}
               >
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-700">{item.label}</span>
                    <span id={`badge-${item.key}`} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                       Copy
                    </span>
                 </div>
                 <code className="text-xs text-red-600 font-mono bg-red-50 p-1 rounded block text-center select-all">
                   {item.key}
                 </code>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
