
import React, { useState, useEffect } from 'react';
import { HoSoDat } from '../types';
import { Save, X, User, MapPin, FileText, CheckCircle2, Ruler, DollarSign, BookOpen, Calculator } from 'lucide-react';
import LandPriceCalculator, { CalculationResult } from './LandPriceCalculator';

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 mt-6 first:mt-0">
    <div className="p-1.5 bg-blue-50 text-gov-primary rounded">
      <Icon size={18} />
    </div>
    <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wide">{title}</h3>
  </div>
);

const InputGroup = ({ label, required = false, children }: any) => (
  <div className="mb-3">
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {children}
  </div>
);

interface Props {
  initialData?: HoSoDat;
  onSave: (data: HoSoDat) => void;
  onCancel: () => void;
}

const RecordForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [formData, setFormData] = useState<any>(() => {
    if (initialData) return { ...initialData };
    return {
      id: crypto.randomUUID(),
      maHS: '',
      ngayNhanHS: new Date().toISOString().slice(0, 10),
      chuSuDung: '',
      diaChiChu: '',
      mst: '',
      cccd: '',
      soGCN: '',
      ngayCap: '',
      thua: '',
      to: '',
      diaChiThua: '',
      dienTichTong: '',
      dienTichDatO: '',
      dienTichNN: 0,
      
      // Defaults cho các trường mới
      soTrichDo: '',
      tyLeBanDo: '1/1000',
      ngayTrichLuc: '',
      ngayPhieuXN: '',
      ngayXacMinh: new Date().toISOString().slice(0, 10),
      
      phanKhu: '',
      quyHoachSDD: 'Đất ở tại nông thôn (ONT)',
      trongNgoaiKDC: 'Trong khu dân cư',
      tenDuong: '',
      apKhuPho: '',
      
      dienTichXinCMD: '',
      loaiDatGCN: 'Đất trồng cây lâu năm',
      giaDatO: '',
      giaDatNN: '',
      viTriDatNN: 'Vị trí 1',
      dienGiaiViTriNN: 'Cách đường PLVII dưới 100m'
    };
  });

  // Tự động tính diện tích nông nghiệp & Mặc định diện tích xin CMD = Tổng diện tích
  useEffect(() => {
    const valTong = formData.dienTichTong === '' ? 0 : parseFloat(formData.dienTichTong);
    const valDatO = formData.dienTichDatO === '' ? 0 : parseFloat(formData.dienTichDatO);
    
    const dtTong = isNaN(valTong) ? 0 : valTong;
    const dtO = isNaN(valDatO) ? 0 : valDatO;
    const dtNN = Math.max(0, dtTong - dtO);
    
    if (parseFloat(dtNN.toFixed(2)) !== formData.dienTichNN) {
      setFormData((prev: any) => ({ ...prev, dienTichNN: parseFloat(dtNN.toFixed(2)) }));
    }

    // Nếu diện tích xin CMD chưa nhập, tự động lấy bằng Diện tích tổng
    if (!formData.dienTichXinCMD && valTong > 0) {
       setFormData((prev: any) => ({ ...prev, dienTichXinCMD: valTong }));
    }
  }, [formData.dienTichTong, formData.dienTichDatO]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData: HoSoDat = {
      ...formData,
      dienTichTong: formData.dienTichTong === '' ? 0 : parseFloat(formData.dienTichTong),
      dienTichDatO: formData.dienTichDatO === '' ? 0 : parseFloat(formData.dienTichDatO),
      dienTichNN:  formData.dienTichNN,
      dienTichXinCMD: formData.dienTichXinCMD === '' ? 0 : parseFloat(formData.dienTichXinCMD),
      giaDatO: formData.giaDatO === '' ? 0 : parseFloat(formData.giaDatO),
      giaDatNN: formData.giaDatNN === '' ? 0 : parseFloat(formData.giaDatNN),
    };
    onSave(finalData);
  };

  // Cập nhật dữ liệu từ Calculator
  const handleApplyPrice = (result: CalculationResult) => {
    setFormData((prev: any) => ({
       ...prev,
       giaDatO: result.price,           // Cập nhật giá Đất Ở
       giaDatNN: result.agriPrice,      // Cập nhật giá Đất Nông nghiệp (CLN)
       tenDuong: `${result.roadName} (${result.segment})`, // Cập nhật Tên đường + Đoạn
       viTriDatNN: result.positionCode, // Vị trí 1 hoặc 2
       dienGiaiViTriNN: result.positionDesc // Diễn giải: Cách đường...
    }));
    setShowCalculator(false);
  };

  const inputClass = "block w-full rounded border-gray-300 shadow-sm border px-3 py-2 text-sm focus:ring-1 focus:ring-gov-primary focus:border-gov-primary transition-colors placeholder-gray-400 bg-white text-black";

  // Lấy diện tích xin CMD để truyền vào Calculator
  const calcArea = formData.dienTichXinCMD ? parseFloat(formData.dienTichXinCMD) : 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* MODAL TÍNH GIÁ ĐẤT */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] h-[95vh] overflow-hidden flex flex-col">
              <LandPriceCalculator 
                 isModal={true}
                 initialArea={calcArea} // Truyền diện tích xin CMD
                 onClose={() => setShowCalculator(false)}
                 onApply={handleApplyPrice}
              />
           </div>
        </div>
      )}

      <div className="bg-white rounded shadow-md border border-gray-200 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gov-primary text-white px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-md">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider">
              {initialData ? 'Cập nhật thông tin hồ sơ' : 'Tiếp nhận hồ sơ mới'}
            </h2>
            <p className="text-xs text-blue-200 opacity-80 mt-1">Nhập đầy đủ thông tin để xuất Tờ trình & Quyết định chính xác</p>
          </div>
          <div className="flex gap-2">
             <button type="button" onClick={onCancel} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm text-white border border-white/20">Hủy</button>
             <button onClick={handleSubmit} className="px-6 py-2 bg-white text-gov-primary hover:bg-gray-100 rounded text-sm font-bold shadow-lg flex items-center gap-2">
               <Save size={16}/> LƯU HỒ SƠ
             </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-gray-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* CỘT TRÁI: THÔNG TIN CƠ BẢN (5 phần) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Box 1: Chủ sử dụng */}
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                <SectionHeader icon={User} title="I. Thông tin Chủ sử dụng" />
                <div className="grid grid-cols-1 gap-3">
                    <InputGroup label="Họ và tên chủ sử dụng" required>
                      <input required type="text" name="chuSuDung" value={formData.chuSuDung} onChange={handleChange} className={`${inputClass} uppercase font-bold text-gov-primary`} placeholder="NGUYỄN VĂN A..." />
                    </InputGroup>
                    <div className="grid grid-cols-2 gap-3">
                      <InputGroup label="Số CCCD / CMND">
                        <input type="text" name="cccd" value={formData.cccd} onChange={handleChange} className={inputClass} placeholder="070..." />
                      </InputGroup>
                      <InputGroup label="Mã số thuế">
                        <input type="text" name="mst" value={formData.mst} onChange={handleChange} className={inputClass} placeholder="Mã số thuế..." />
                      </InputGroup>
                    </div>
                    <InputGroup label="Địa chỉ thường trú (HKTT)">
                      <input type="text" name="diaChiChu" value={formData.diaChiChu} onChange={handleChange} className={inputClass} placeholder="Số nhà, đường, ấp..." />
                    </InputGroup>
                </div>
              </div>

              {/* Box 2: Thông tin thửa đất */}
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                <SectionHeader icon={MapPin} title="II. Thông tin Thửa đất" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputGroup label="Số GCN (Sổ đỏ)">
                      <input type="text" name="soGCN" value={formData.soGCN} onChange={handleChange} className={inputClass} placeholder="CS..." />
                    </InputGroup>
                    <InputGroup label="Ngày cấp GCN">
                      <input type="date" name="ngayCap" value={formData.ngayCap} onChange={handleChange} className={inputClass} />
                    </InputGroup>
                    <InputGroup label="Số Tờ bản đồ">
                      <input type="text" name="to" value={formData.to} onChange={handleChange} className={`${inputClass} text-center font-bold`} />
                    </InputGroup>
                    <InputGroup label="Số Thửa đất">
                      <input type="text" name="thua" value={formData.thua} onChange={handleChange} className={`${inputClass} text-center font-bold`} />
                    </InputGroup>
                    <div className="md:col-span-2">
                       <InputGroup label="Địa chỉ thửa đất (Chi tiết)">
                         <input type="text" name="diaChiThua" value={formData.diaChiThua} onChange={handleChange} className={inputClass} placeholder="Ấp/Khu phố, Phường Minh Hưng..." />
                       </InputGroup>
                    </div>
                    <div className="md:col-span-2">
                       <InputGroup label="Ấp / Khu phố (Hiển thị văn bản)">
                         <input type="text" name="apKhuPho" value={formData.apKhuPho || (formData.diaChiThua.split(',')[0] || '')} onChange={handleChange} className={inputClass} placeholder="Khu phố 1..." />
                       </InputGroup>
                    </div>
                </div>
              </div>

              {/* Box 3: Diện tích */}
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                 <SectionHeader icon={CheckCircle2} title="III. Diện tích (m²)" />
                 <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded border border-blue-100">
                      <InputGroup label="Tổng diện tích đất">
                        <input type="number" step="0.1" name="dienTichTong" value={formData.dienTichTong} onChange={handleChange} className="block w-full text-right bg-white rounded border border-blue-300 font-bold text-blue-900 px-2 py-1" />
                      </InputGroup>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <InputGroup label="Đất ở đã có (ONT)">
                         <input type="number" step="0.1" name="dienTichDatO" value={formData.dienTichDatO} onChange={handleChange} className={inputClass} />
                       </InputGroup>
                       <InputGroup label="Đất NN còn lại">
                         <input disabled type="number" value={formData.dienTichNN} className={`${inputClass} bg-gray-100 text-gray-500`} />
                       </InputGroup>
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <InputGroup label="Diện tích XIN Chuyển mục đích">
                        <input type="number" step="0.1" name="dienTichXinCMD" value={formData.dienTichXinCMD} onChange={handleChange} className="block w-full text-right bg-white rounded border border-green-500 font-bold text-green-900 text-lg px-2 py-1" />
                      </InputGroup>
                    </div>
                 </div>
              </div>

            </div>

            {/* CỘT PHẢI: THÔNG TIN CHI TIẾT (7 phần) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Box 4: Kỹ thuật trích đo */}
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                <SectionHeader icon={Ruler} title="IV. Thông tin Đo đạc & Kỹ thuật" />
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                   <InputGroup label="Số Trích đo / Trích lục">
                     <input type="text" name="soTrichDo" value={formData.soTrichDo} onChange={handleChange} className={inputClass} placeholder="123/TĐ-2025..." />
                   </InputGroup>
                   <InputGroup label="Tỷ lệ bản đồ">
                     <input type="text" name="tyLeBanDo" value={formData.tyLeBanDo} onChange={handleChange} className={inputClass} />
                   </InputGroup>
                   <InputGroup label="Ngày ký Trích đo">
                     <input type="date" name="ngayTrichLuc" value={formData.ngayTrichLuc} onChange={handleChange} className={inputClass} />
                   </InputGroup>
                   <InputGroup label="Ngày Phiếu xác nhận TT">
                     <input type="date" name="ngayPhieuXN" value={formData.ngayPhieuXN} onChange={handleChange} className={inputClass} />
                   </InputGroup>
                   <InputGroup label="Ngày Xác minh thực địa">
                     <input type="date" name="ngayXacMinh" value={formData.ngayXacMinh} onChange={handleChange} className={inputClass} />
                   </InputGroup>
                   <InputGroup label="Loại đất trên GCN (Text)">
                     <input type="text" name="loaiDatGCN" value={formData.loaiDatGCN} onChange={handleChange} className={inputClass} />
                   </InputGroup>
                </div>
              </div>

              {/* Box 5: Quy hoạch */}
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                <SectionHeader icon={BookOpen} title="V. Quy hoạch & Hiện trạng" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <div className="md:col-span-2">
                     <InputGroup label="Tên đường / Đoạn đường (Mặt tiền)">
                       <input type="text" name="tenDuong" value={formData.tenDuong} onChange={handleChange} className={inputClass} placeholder="Đường QL13 (Đoạn từ A đến B)..." />
                     </InputGroup>
                   </div>
                   <InputGroup label="Phân khu chức năng">
                     <input type="text" name="phanKhu" value={formData.phanKhu} onChange={handleChange} className={inputClass} placeholder="Khu dân cư..." />
                   </InputGroup>
                   <InputGroup label="Quy hoạch sử dụng đất (QHSDD)">
                     <input type="text" name="quyHoachSDD" value={formData.quyHoachSDD} onChange={handleChange} className={inputClass} />
                   </InputGroup>
                   <InputGroup label="Vị trí (Trong/Ngoài KDC)">
                     <select name="trongNgoaiKDC" value={formData.trongNgoaiKDC} onChange={handleChange} className={inputClass}>
                       <option value="Trong khu dân cư">Trong khu dân cư</option>
                       <option value="Ngoài khu dân cư">Ngoài khu dân cư</option>
                     </select>
                   </InputGroup>
                </div>
              </div>

              {/* Box 6: Giá đất */}
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                <SectionHeader icon={DollarSign} title="VI. Thông tin Giá đất (Tính thuế)" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <div className="p-3 bg-green-50 rounded border border-green-100">
                      <h4 className="text-xs font-bold text-green-800 uppercase mb-2">Đất Nông Nghiệp (Trước CMD)</h4>
                      <InputGroup label="Giá đất NN (VNĐ/m²)">
                        <input type="number" name="giaDatNN" value={formData.giaDatNN} onChange={handleChange} className={inputClass} />
                      </InputGroup>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <InputGroup label="Vị trí">
                           <input type="text" name="viTriDatNN" value={formData.viTriDatNN} onChange={handleChange} className={inputClass} placeholder="Vị trí 1" />
                        </InputGroup>
                        <InputGroup label="Diễn giải vị trí">
                           <input type="text" name="dienGiaiViTriNN" value={formData.dienGiaiViTriNN} onChange={handleChange} className={inputClass} placeholder="Cách đường..." />
                        </InputGroup>
                      </div>
                   </div>

                   <div className="p-3 bg-blue-50 rounded border border-blue-100">
                      <div className="flex justify-between items-center mb-2">
                         <h4 className="text-xs font-bold text-blue-800 uppercase">Đất Ở (Sau CMD)</h4>
                         <button 
                           type="button" 
                           onClick={() => setShowCalculator(true)}
                           className="text-xs flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 transition-colors shadow-sm"
                         >
                           <Calculator size={12}/> Tính giá tự động
                         </button>
                      </div>
                      <InputGroup label="Giá đất Ở (VNĐ/m²)">
                        <input type="number" name="giaDatO" value={formData.giaDatO} onChange={handleChange} className="block w-full rounded border-blue-300 shadow-sm border px-3 py-2 text-sm font-bold text-blue-900 bg-white" />
                      </InputGroup>
                      <div className="mt-2 text-xs text-gray-500 italic">
                         * Giá đất ở được áp dụng theo Bảng giá đất hoặc Hệ số điều chỉnh giá đất hiện hành tại vị trí thửa đất.
                      </div>
                   </div>
                </div>
              </div>

              {/* Box 7: Quản lý */}
              <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                <SectionHeader icon={FileText} title="VII. Thông tin Quản lý hồ sơ" />
                <div className="grid grid-cols-2 gap-3">
                   <InputGroup label="Mã hồ sơ lưu trữ" required>
                     <input required type="text" name="maHS" value={formData.maHS} onChange={handleChange} className={`${inputClass} font-bold text-red-700 bg-red-50 border-red-200`} />
                   </InputGroup>
                   <InputGroup label="Ngày nhận hồ sơ">
                     <input type="date" name="ngayNhanHS" value={formData.ngayNhanHS} onChange={handleChange} className={inputClass} />
                   </InputGroup>
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;
