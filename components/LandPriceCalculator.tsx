
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BangGiaDat } from '../types';
import { getPriceList } from '../services/storage';
import { 
  Calculator, Info, MapPin, DollarSign, 
  Printer, Copy, Search, RefreshCw, FileDown,
  CheckCircle2, AlertTriangle, ArrowRight, Table, Layers, Check, X
} from 'lucide-react';
import * as XLSX from 'xlsx';

// --- CẤU HÌNH NGHIỆP VỤ (RESOLUTION 28/2025/NQ-HĐND) ---
const RULES = {
  // Đất Nông Nghiệp (Điều 5)
  AGRI: {
    VT1_RANGE_1: { max: 100, factor: 1.0, label: "Phạm vi ≤ 100m" },
    VT1_RANGE_2: { max: 200, factor: 0.8, label: "Phạm vi 100-200m" },
    VT1_RANGE_3: { max: 99999, factor: 0.6, label: "Phạm vi > 200m" },
    VT2_FACTOR: 0.3, // 30% giá VT1 phạm vi 1
  },
  // Đất Phi Nông Nghiệp (Điều 6)
  NON_AGRI: {
    VT1_RANGE_1: { max: 50, factor: 1.0, label: "Phạm vi ≤ 50m" },
    VT1_RANGE_2: { max: 100, factor: 0.8, label: "Phạm vi 50-100m" },
    VT1_RANGE_3: { max: 99999, factor: 0.6, label: "Phạm vi > 100m" },
    VT2_NEAR: { max: 50, factor: 0.15, label: "VT2, Phạm vi ≤ 50m" }, // 15%
    VT2_FAR: { max: 99999, factor: 0.10, label: "VT2, Phạm vi > 50m" }, // 10%
  },
  // Hệ số điều chỉnh (Điều 8)
  MODIFIERS: {
    TWO_FRONT_MAIN: { val: 1.2, label: "Giáp 2 đường PLVII trở lên (x1.2)" },
    TWO_FRONT_SUB: { val: 1.1, label: "Giáp 1 đường PLVII + đường khác (x1.1)" },
    BAD_ROAD: { val: 0.8, label: "Đường đất/đá/cấp phối hoặc chênh cao độ (x0.8)" },
    CANAL_PLVII: { val: 0.4, label: "Qua kênh rạch ra đường PLVII (x0.4)" },
    CANAL_OTHER: { val: 0.5, label: "Qua kênh rạch ra đường khác (x0.5)" },
    INTERNAL_ROAD: { val: 0.5, label: "Đường nội bộ KDC (x0.5)" }
  }
};

type LandGroup = 'ODT' | 'TMDV' | 'SXPNN' | 'CLN' | 'CHN' | 'NTS';

interface CalculationStep {
  id: string;
  label: string;
  formula: string;
  value: number;
  note?: string;
  isWarn?: boolean;
}

// Interface trả về cho Form cha (Đã cập nhật)
export interface CalculationResult {
  price: number;          // Giá đất đã tính (thường là Đất ở)
  agriPrice: number;      // Giá đất nông nghiệp (CLN) gốc của đoạn đường
  roadName: string;
  segment: string;
  positionCode: string;   // VD: Vị trí 1, Vị trí 2
  positionDesc: string;   // VD: Cách HLATĐB 50m
}

// Thêm Props để hỗ trợ chế độ Modal và Callback
interface Props {
  isModal?: boolean;
  initialArea?: number; // Nhận diện tích từ form cha
  onApply?: (result: CalculationResult) => void;
  onClose?: () => void;
}

const LandPriceCalculator: React.FC<Props> = ({ isModal = false, initialArea = 100, onApply, onClose }) => {
  // --- STATE DỮ LIỆU ---
  const [roads, setRoads] = useState<BangGiaDat[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false); // State kiểm soát ẩn hiện dropdown
  const searchWrapperRef = useRef<HTMLDivElement>(null); // Ref để bắt sự kiện click ra ngoài
  
  // --- STATE FORM INPUT ---
  const [selectedRoad, setSelectedRoad] = useState<BangGiaDat | null>(null);
  const [landGroup, setLandGroup] = useState<LandGroup>('ODT');
  const [position, setPosition] = useState<'VT1' | 'VT2'>('VT1');
  const [distance, setDistance] = useState<number>(0); // Khoảng cách từ HLATĐB
  const [area, setArea] = useState<number>(initialArea); 
  
  // Modifiers
  const [modTwoFront, setModTwoFront] = useState<'NONE' | 'MAIN' | 'SUB'>('NONE');
  const [modCanal, setModCanal] = useState<'NONE' | 'PLVII' | 'OTHER'>('NONE');
  const [isBadRoad, setIsBadRoad] = useState(false);

  // --- INIT ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getPriceList();
      setRoads(data);
      setLoading(false);
    };
    fetchData();

    // Event listener click ra ngoài để đóng dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cập nhật area khi initialArea thay đổi (nếu form cha thay đổi)
  useEffect(() => {
    if (initialArea > 0) {
      setArea(initialArea);
    }
  }, [initialArea]);

  // --- COMPUTED: TÍNH TOÁN GIÁ ---
  const calculation = useMemo(() => {
    if (!selectedRoad || area <= 0) return null;

    const steps: CalculationStep[] = [];
    const isAgri = ['CLN', 'CHN', 'NTS'].includes(landGroup);
    
    // 1. Xác định giá chuẩn (Giá Vị trí 1, Phạm vi 1)
    let basePrice = 0;
    let basePriceName = '';
    switch(landGroup) {
      case 'ODT': basePrice = selectedRoad.giaDatO; basePriceName = 'Đất Ở'; break;
      case 'TMDV': basePrice = selectedRoad.giaTmDv || selectedRoad.giaDatO * 0.8; basePriceName = 'TMDV'; break; // Fallback logic nếu cần
      case 'SXPNN': basePrice = selectedRoad.giaSxPhiNn; basePriceName = 'SXKD PNN'; break;
      case 'CLN': basePrice = selectedRoad.giaDatCLN; basePriceName = 'Cây Lâu Năm'; break;
      case 'CHN': basePrice = selectedRoad.giaDatCHN; basePriceName = 'Cây Hằng Năm'; break;
      case 'NTS': basePrice = selectedRoad.giaDatNTS; basePriceName = 'Nuôi Trồng Thủy Sản'; break;
    }

    steps.push({
      id: 'BASE',
      label: `Giá chuẩn ${basePriceName} (VT1)`,
      formula: `${basePrice.toLocaleString('vi-VN')} đ/m²`,
      value: basePrice,
      note: `Theo đường: ${selectedRoad.tenDuong}`
    });

    // 2. Xác định giá SÀN (Giá CLN VT1 Phạm vi 1) - Chỉ dùng cho Phi NN
    const floorPrice = selectedRoad.giaDatCLN;
    
    // 3. Tính toán theo Vị trí & Phạm vi
    let rangeFactor = 1.0;
    let rangeDesc = '';
    let tempPrice = 0;

    if (isAgri) {
      // --- ĐẤT NÔNG NGHIỆP ---
      if (position === 'VT1') {
        if (distance <= RULES.AGRI.VT1_RANGE_1.max) {
          rangeFactor = RULES.AGRI.VT1_RANGE_1.factor;
          rangeDesc = RULES.AGRI.VT1_RANGE_1.label;
        } else if (distance <= RULES.AGRI.VT1_RANGE_2.max) {
          rangeFactor = RULES.AGRI.VT1_RANGE_2.factor;
          rangeDesc = RULES.AGRI.VT1_RANGE_2.label;
        } else {
          rangeFactor = RULES.AGRI.VT1_RANGE_3.factor;
          rangeDesc = RULES.AGRI.VT1_RANGE_3.label;
        }
        tempPrice = basePrice * rangeFactor;
      } else {
        // VT2
        rangeFactor = RULES.AGRI.VT2_FACTOR;
        rangeDesc = "Vị trí 2 (30%)";
        tempPrice = basePrice * rangeFactor;
      }
    } else {
      // --- ĐẤT PHI NÔNG NGHIỆP ---
      if (position === 'VT1') {
        if (distance <= RULES.NON_AGRI.VT1_RANGE_1.max) {
          rangeFactor = RULES.NON_AGRI.VT1_RANGE_1.factor;
          rangeDesc = RULES.NON_AGRI.VT1_RANGE_1.label;
        } else if (distance <= RULES.NON_AGRI.VT1_RANGE_2.max) {
          rangeFactor = RULES.NON_AGRI.VT1_RANGE_2.factor;
          rangeDesc = RULES.NON_AGRI.VT1_RANGE_2.label;
        } else {
          rangeFactor = RULES.NON_AGRI.VT1_RANGE_3.factor;
          rangeDesc = RULES.NON_AGRI.VT1_RANGE_3.label;
        }
      } else {
        // VT2
        if (distance <= RULES.NON_AGRI.VT2_NEAR.max) {
          rangeFactor = RULES.NON_AGRI.VT2_NEAR.factor;
          rangeDesc = RULES.NON_AGRI.VT2_NEAR.label;
        } else {
          rangeFactor = RULES.NON_AGRI.VT2_FAR.factor;
          rangeDesc = RULES.NON_AGRI.VT2_FAR.label;
        }
      }
      tempPrice = basePrice * rangeFactor;
    }

    steps.push({
      id: 'POS_RANGE',
      label: `Áp dụng Vị trí & Phạm vi`,
      formula: `${basePrice.toLocaleString()} x ${(rangeFactor * 100).toFixed(0)}%`,
      value: tempPrice,
      note: `${position === 'VT1' ? 'Vị trí 1' : 'Vị trí 2'} - ${rangeDesc}`
    });

    // 4. Kiểm tra GIÁ SÀN (Chỉ Phi nông nghiệp)
    // Nguyên tắc: Không được thấp hơn giá đất CLN cùng vị trí, cùng phạm vi
    if (!isAgri) {
      if (tempPrice < floorPrice) {
        steps.push({
          id: 'FLOOR_CHECK',
          label: 'Kiểm tra giá sàn (CLN)',
          formula: `${tempPrice.toLocaleString()} < ${floorPrice.toLocaleString()}`,
          value: floorPrice,
          note: 'Mức giá tính được thấp hơn giá CLN. Áp dụng giá sàn.',
          isWarn: true
        });
        tempPrice = floorPrice;
      } else {
        steps.push({
          id: 'FLOOR_CHECK',
          label: 'Kiểm tra giá sàn (CLN)',
          formula: `${tempPrice.toLocaleString()} ≥ ${floorPrice.toLocaleString()}`,
          value: tempPrice,
          note: 'Thỏa mãn điều kiện giá sàn.',
        });
      }
    }

    // 5. Hệ số điều chỉnh (Modifiers)
    let modifierFactor = 1.0;
    
    // 2 Mặt tiền
    if (modTwoFront === 'MAIN') {
      modifierFactor *= RULES.MODIFIERS.TWO_FRONT_MAIN.val;
      steps.push({ id: 'MOD_2FRONT', label: 'Hệ số: 2 Mặt tiền chính', formula: 'x 1.2', value: tempPrice * 1.2, note: 'Giáp 2 đường PLVII' });
    } else if (modTwoFront === 'SUB') {
      modifierFactor *= RULES.MODIFIERS.TWO_FRONT_SUB.val;
      steps.push({ id: 'MOD_2FRONT', label: 'Hệ số: 1 chính + 1 phụ', formula: 'x 1.1', value: tempPrice * 1.1, note: 'Giáp PLVII + đường khác' });
    }

    // Kênh rạch
    if (modCanal === 'PLVII') {
      modifierFactor *= RULES.MODIFIERS.CANAL_PLVII.val;
      steps.push({ id: 'MOD_CANAL', label: 'Hệ số: Qua kênh rạch', formula: 'x 0.4', value: 0, note: 'Ra đường PLVII' });
    } else if (modCanal === 'OTHER') {
      modifierFactor *= RULES.MODIFIERS.CANAL_OTHER.val;
      steps.push({ id: 'MOD_CANAL', label: 'Hệ số: Qua kênh rạch', formula: 'x 0.5', value: 0, note: 'Ra đường khác' });
    } else {
      // Chỉ xét đường xấu nếu không phải là trường hợp kênh rạch
      if (isBadRoad) {
        modifierFactor *= RULES.MODIFIERS.BAD_ROAD.val;
        steps.push({ id: 'MOD_BAD', label: 'Hệ số: Đường xấu/Hạn chế', formula: 'x 0.8', value: 0, note: 'Đường đất, đá, cấp phối...' });
      }
    }

    const unitPrice = tempPrice * modifierFactor;
    const totalPrice = unitPrice * area;

    return {
      basePrice,
      floorPrice,
      unitPrice,
      totalPrice,
      steps
    };
  }, [selectedRoad, landGroup, position, distance, area, modTwoFront, modCanal, isBadRoad]);

  // --- ACTIONS ---
  const handleApply = () => {
    if (onApply && calculation && selectedRoad) {
        // 1. Tách biệt Vị trí
        const posCode = position === 'VT1' ? 'Vị trí 1' : 'Vị trí 2';
        
        // 2. Tách biệt Diễn giải (Mô tả chi tiết)
        let desc = 'Mặt tiền đường';
        if (distance > 0) {
            desc = `Cách HLATĐB ${distance}m`;
        } else if (position === 'VT2') {
            desc = 'Đường nhánh / Hẻm';
        }

        // 3. Lấy giá đất NN (Cây lâu năm) từ bảng giá làm mặc định
        const agriPrice = selectedRoad.giaDatCLN || 0;

        onApply({
            price: calculation.unitPrice,
            agriPrice: agriPrice, // Trả về giá đất NN
            roadName: selectedRoad.tenDuong,
            segment: `${selectedRoad.diemDau} - ${selectedRoad.diemCuoi}`,
            positionCode: posCode,  // "Vị trí 1"
            positionDesc: desc      // "Cách HLATĐB..."
        });
    }
  };

  const handleExportExcel = () => {
    if (!calculation || !selectedRoad) return;
    
    const wb = XLSX.utils.book_new();
    const wsData = [
      ["BẢNG TÍNH GIÁ ĐẤT (NGHỊ QUYẾT 28/2025/NQ-HĐND)"],
      ["Thời điểm tính:", new Date().toLocaleString('vi-VN')],
      [],
      ["I. THÔNG TIN ĐẦU VÀO"],
      ["Tuyến đường:", selectedRoad.tenDuong],
      ["Đoạn:", `${selectedRoad.diemDau} - ${selectedRoad.diemCuoi}`],
      ["Loại đất:", landGroup],
      ["Vị trí:", position === 'VT1' ? 'Vị trí 1 (Mặt tiền)' : 'Vị trí 2 (Hẻm/Sau)'],
      ["Khoảng cách HLATĐB:", `${distance} m`],
      ["Diện tích:", `${area} m²`],
      [],
      ["II. KẾT QUẢ TÍNH TOÁN"],
      ["Diễn giải", "Công thức/Tham chiếu", "Giá trị (đ/m²)"],
      ...calculation.steps.map(s => [s.label, s.formula, s.value]),
      [],
      ["ĐƠN GIÁ CUỐI CÙNG:", "", calculation.unitPrice],
      ["TỔNG GIÁ TRỊ:", "", calculation.totalPrice]
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Format sơ bộ (độ rộng cột)
    ws['!cols'] = [{ wch: 30 }, { wch: 30 }, { wch: 20 }];
    
    XLSX.utils.book_append_sheet(wb, ws, "TinhGia");
    XLSX.writeFile(wb, `TinhGia_${selectedRoad.tenDuong}_${new Date().getTime()}.xlsx`);
  };

  const filteredRoads = useMemo(() => {
    if (!searchTerm) return roads.slice(0, 50); // Limit initial render
    return roads.filter(r => r.tenDuong.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [roads, searchTerm]);

  // Handle select road logic
  const handleSelectRoad = (r: BangGiaDat) => {
    setSelectedRoad(r);
    setSearchTerm(r.tenDuong);
    setShowDropdown(false); // Ẩn dropdown ngay sau khi chọn
  };

  return (
    <div className={`h-full flex flex-col font-sans text-gray-800 animate-fade-in-down ${isModal ? '' : 'pb-10'}`}>
      {/* HEADER: Ẩn nếu là Modal */}
      {!isModal && (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gov-primary uppercase tracking-wide flex items-center gap-2">
              <Calculator className="text-gov-accent" />
              Tính Giá Đất 2026 (Đồng Nai)
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Theo Nghị quyết 28/2025/NQ-HĐND & Quy định chi tiết.
            </p>
          </div>
        </div>
      )}

      {isModal && (
        <div className="bg-gov-primary px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Calculator size={20}/> TÍNH TOÁN GIÁ ĐẤT
          </h3>
          <button onClick={onClose} className="text-white hover:bg-white/10 p-1 rounded transition-colors">
            <X size={24}/>
          </button>
        </div>
      )}

      <div className={`flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 ${isModal ? 'p-6 bg-gray-100 overflow-y-auto' : ''}`}>
        
        {/* --- LEFT: INPUT WIZARD (7 Cột) --- */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. CHỌN ĐƯỜNG */}
          <div className="bg-white p-5 rounded shadow-sm border border-gray-200 relative z-20">
             <div className="flex items-center gap-2 mb-3 border-b pb-2">
               <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">BƯỚC 1</span>
               <h3 className="font-bold text-gray-700">Chọn tuyến đường (PLVII)</h3>
             </div>
             
             <div className="relative" ref={searchWrapperRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
                  <input 
                    type="text" 
                    placeholder="Nhập tên đường để tìm kiếm..." 
                    className="w-full pl-10 pr-4 py-2.5 border rounded focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                  />
                </div>
                
                {/* Dropdown kết quả - Chỉ hiện khi showDropdown = true */}
                {showDropdown && filteredRoads.length > 0 && (
                   <div className="mt-1 max-h-60 overflow-y-auto border rounded shadow-lg bg-white absolute w-full z-30">
                     {filteredRoads.map(r => (
                       <div 
                         key={r.id} 
                         onClick={() => handleSelectRoad(r)}
                         className={`p-3 cursor-pointer hover:bg-blue-50 border-b last:border-0 ${selectedRoad?.id === r.id ? 'bg-blue-100' : ''}`}
                       >
                         <div className="font-bold text-sm text-gov-primary">{r.tenDuong}</div>
                         <div className="text-xs text-gray-500">{r.diemDau} ➔ {r.diemCuoi}</div>
                       </div>
                     ))}
                   </div>
                )}
             </div>

             {selectedRoad && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm grid grid-cols-2 gap-y-2">
                   <div className="col-span-2 font-bold text-blue-800 border-b border-blue-200 pb-1 mb-1">
                      Giá đất chuẩn (VT1) - {selectedRoad.tenDuong}
                   </div>
                   <div><span className="text-gray-500">Đất Ở:</span> <span className="font-mono font-bold">{selectedRoad.giaDatO.toLocaleString()}</span></div>
                   <div><span className="text-gray-500">SXKD PNN:</span> <span className="font-mono font-bold">{selectedRoad.giaSxPhiNn.toLocaleString()}</span></div>
                   <div><span className="text-gray-500">TMDV:</span> <span className="font-mono font-bold">{selectedRoad.giaTmDv.toLocaleString()}</span></div>
                   <div><span className="text-gray-500">CLN (Sàn):</span> <span className="font-mono font-bold text-orange-700">{selectedRoad.giaDatCLN.toLocaleString()}</span></div>
                </div>
             )}
          </div>

          {/* 2. THÔNG SỐ THỬA ĐẤT */}
          <div className="bg-white p-5 rounded shadow-sm border border-gray-200 z-10">
             <div className="flex items-center gap-2 mb-3 border-b pb-2">
               <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">BƯỚC 2</span>
               <h3 className="font-bold text-gray-700">Thông tin thửa đất</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Loại đất */}
                <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loại đất cần định giá</label>
                   <div className="grid grid-cols-3 gap-2">
                      {['ODT', 'TMDV', 'SXPNN'].map((t) => (
                        <button key={t} onClick={() => setLandGroup(t as LandGroup)} className={`py-2 px-1 text-sm rounded border ${landGroup === t ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                          {t === 'ODT' ? 'Đất Ở' : t === 'TMDV' ? 'TM-DV' : 'SX PNN'}
                        </button>
                      ))}
                      {['CLN', 'CHN', 'NTS'].map((t) => (
                        <button key={t} onClick={() => setLandGroup(t as LandGroup)} className={`py-2 px-1 text-sm rounded border ${landGroup === t ? 'bg-green-600 text-white border-green-600 font-bold' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                          {t === 'CLN' ? 'Cây Lâu Năm' : t === 'CHN' ? 'Cây Hằng Năm' : 'Nuôi Trồng TS'}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Vị trí */}
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vị trí thửa đất</label>
                   <div className="flex rounded border overflow-hidden">
                      <button onClick={() => setPosition('VT1')} className={`flex-1 py-2 text-sm font-medium ${position === 'VT1' ? 'bg-blue-100 text-blue-800' : 'bg-white hover:bg-gray-50'}`}>Vị trí 1 (Mặt tiền)</button>
                      <div className="w-px bg-gray-300"></div>
                      <button onClick={() => setPosition('VT2')} className={`flex-1 py-2 text-sm font-medium ${position === 'VT2' ? 'bg-blue-100 text-blue-800' : 'bg-white hover:bg-gray-50'}`}>Vị trí 2 (Hẻm/Sau)</button>
                   </div>
                </div>

                {/* Khoảng cách */}
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Khoảng cách HLATĐB (m)</label>
                   <input 
                     type="number" min="0" 
                     className="w-full p-2 border rounded font-bold text-right focus:ring-blue-500 focus:border-blue-500"
                     value={distance}
                     onChange={e => setDistance(Number(e.target.value))}
                   />
                </div>

                {/* Diện tích */}
                {/* Ẩn nhập diện tích nếu đang ở mode Modal vì đã lấy từ form cha */}
                {!isModal && (
                  <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Diện tích tính toán (m²)</label>
                     <input 
                       type="number" min="0" 
                       className="w-full p-2 border rounded font-bold text-right text-lg text-blue-800 focus:ring-blue-500 focus:border-blue-500"
                       value={area}
                       onChange={e => setArea(Number(e.target.value))}
                       placeholder="Nhập diện tích..."
                     />
                  </div>
                )}
             </div>
          </div>

          {/* 3. YẾU TỐ ĐIỀU CHỈNH */}
          <div className="bg-white p-5 rounded shadow-sm border border-gray-200">
             <div className="flex items-center gap-2 mb-3 border-b pb-2">
               <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">BƯỚC 3</span>
               <h3 className="font-bold text-gray-700">Hệ số điều chỉnh (Nếu có)</h3>
             </div>
             
             <div className="space-y-3">
               {/* 2 Mặt tiền */}
               {!['CLN','CHN','NTS'].includes(landGroup) && (
                 <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <span className="text-sm font-medium">Yếu tố giáp nhiều mặt đường</span>
                    <select 
                      className="border rounded p-1 text-sm"
                      value={modTwoFront}
                      onChange={e => setModTwoFront(e.target.value as any)}
                    >
                      <option value="NONE">Không áp dụng</option>
                      <option value="MAIN">Giáp 2 đường PLVII (x1.2)</option>
                      <option value="SUB">Giáp 1 PLVII + 1 đường khác (x1.1)</option>
                    </select>
                 </div>
               )}

               {/* Kênh rạch */}
               <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                  <span className="text-sm font-medium">Lối đi qua kênh rạch</span>
                  <select 
                    className="border rounded p-1 text-sm"
                    value={modCanal}
                    onChange={e => setModCanal(e.target.value as any)}
                  >
                    <option value="NONE">Không áp dụng</option>
                    <option value="PLVII">Ra đường PLVII (x0.4)</option>
                    <option value="OTHER">Ra đường khác (x0.5)</option>
                  </select>
               </div>
               
               {/* Đường xấu */}
               <div className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer" onClick={() => setIsBadRoad(!isBadRoad)}>
                  <input type="checkbox" checked={isBadRoad} onChange={() => {}} className="w-5 h-5 text-blue-600" />
                  <div className="flex-grow">
                    <div className="text-sm font-medium">Đường xấu / Hạn chế quy hoạch</div>
                    <div className="text-xs text-gray-500">Đường đất, đá, cấp phối, chênh lệch cao độ... (x0.8)</div>
                  </div>
               </div>
             </div>
          </div>

        </div>

        {/* --- RIGHT: RESULT PANEL (5 Cột) --- */}
        <div className="lg:col-span-5">
           <div className="sticky top-6">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Header Kết Quả */}
                <div className="bg-gov-primary p-6 text-white text-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/5 skew-y-6 transform origin-bottom-left"></div>
                   <div className="relative z-10">
                      <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">ĐƠN GIÁ TÍNH ĐƯỢC</p>
                      {calculation ? (
                        <div className="text-4xl font-extrabold flex justify-center items-end gap-1">
                           {calculation.unitPrice.toLocaleString('vi-VN')}
                           <span className="text-sm font-normal mb-1.5 opacity-80">đ/m²</span>
                        </div>
                      ) : (
                        <div className="text-3xl font-bold opacity-30">---</div>
                      )}
                   </div>
                </div>

                {/* Chi Tiết Tính Toán */}
                <div className="p-5 bg-gray-50 min-h-[300px]">
                   {calculation ? (
                     <div className="space-y-4">
                        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                           <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 border-b pb-2 flex items-center gap-2">
                             <Layers size={14}/> Diễn giải chi tiết
                           </h4>
                           <div className="space-y-3">
                             {calculation.steps.map((step, idx) => (
                               <div key={idx} className={`relative pl-4 border-l-2 ${step.isWarn ? 'border-orange-400' : 'border-blue-400'}`}>
                                  <div className="flex justify-between items-start">
                                    <span className="text-sm font-bold text-gray-700">{step.label}</span>
                                    <span className={`text-sm font-mono font-bold ${step.isWarn ? 'text-orange-600' : 'text-blue-700'}`}>
                                      {step.value > 0 ? step.value.toLocaleString() : step.formula.startsWith('x') ? step.formula : ''}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">{step.note || step.formula}</div>
                               </div>
                             ))}
                           </div>
                        </div>
                        
                        {!isModal && (
                            <div className="bg-blue-50 p-4 rounded border border-blue-200">
                               <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-bold text-blue-800">TỔNG GIÁ TRỊ THỬA ĐẤT</span>
                                  <CheckCircle2 size={16} className="text-blue-600"/>
                               </div>
                               <div className="text-2xl font-bold text-blue-900 text-right">
                                  {calculation.totalPrice.toLocaleString('vi-VN')} <span className="text-sm text-blue-600">VNĐ</span>
                               </div>
                            </div>
                        )}
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                        <Info size={48} className="mb-3 opacity-20"/>
                        <p className="text-sm">Vui lòng chọn đường và nhập thông số<br/>để xem kết quả tính toán.</p>
                     </div>
                   )}
                </div>

                {/* Footer Actions */}
                <div className="bg-white p-4 border-t border-gray-200 flex flex-col gap-3">
                   {/* Nếu là Modal thì hiện nút Áp dụng, nếu không hiện nút Xuất/In */}
                   {isModal ? (
                       <div className="flex gap-3">
                           <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-bold">Hủy bỏ</button>
                           <button 
                             onClick={handleApply}
                             disabled={!calculation}
                             className="flex-[2] py-2.5 bg-gov-primary hover:bg-blue-800 text-white rounded font-bold shadow flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                             <Check size={18}/> Áp dụng giá này
                           </button>
                       </div>
                   ) : (
                       <div className="flex gap-3">
                           <button 
                             onClick={handleExportExcel}
                             disabled={!calculation}
                             className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded font-bold shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             <FileDown size={18}/> Xuất Excel
                           </button>
                           <button 
                             onClick={() => window.print()}
                             disabled={!calculation}
                             className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded font-bold shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             <Printer size={18}/> In Phiếu
                           </button>
                       </div>
                   )}
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* PRINT STYLES */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .lg\\:col-span-5, .lg\\:col-span-5 * { visibility: visible; }
          .lg\\:col-span-5 { position: absolute; left: 0; top: 0; width: 100%; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default LandPriceCalculator;
