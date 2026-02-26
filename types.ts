
export interface HoSoDat {
  id: string; // ID duy nhất để quản lý trong code
  maHS: string;
  ngayNhanHS: string;
  chuSuDung: string;
  diaChiChu: string;
  mst: string;
  cccd: string;
  soGCN: string;
  ngayCap: string;
  thua: string;
  to: string;
  diaChiThua: string;
  dienTichTong: number;
  dienTichDatO: number;
  dienTichNN: number; // Tự động tính
  ghiChu?: string;

  // --- MỞ RỘNG CÁC TRƯỜNG CHI TIẾT CHO IN ẤN ---
  // 1. Kỹ thuật & Đo đạc
  soTrichDo?: string;          // «So_tric_do_nhap»
  tyLeBanDo?: string;          // «ty_le_ban_do»
  ngayTrichLuc?: string;       // «ngay_trich_luc_nhap»
  ngayPhieuXN?: string;        // «Ngay_phieu_XN_nhap»
  ngayXacMinh?: string;        // «Ngay_xac_minh_nhap»

  // 2. Quy hoạch & Vị trí
  phanKhu?: string;            // «Phan_Khu»
  quyHoachSDD?: string;        // «QHSDD»
  trongNgoaiKDC?: string;      // «Trong_ngoài»
  tenDuong?: string;           // «key» - Tên đường/đoạn đường
  apKhuPho?: string;           // «ap__KP» - Tách riêng để dễ xử lý

  // 3. Diện tích & Giá đất
  dienTichXinCMD?: number;     // «xin_CMD_mm»
  loaiDatGCN?: string;         // «Text_loai_dat_GCN_ONT» (VD: Đất trồng cây lâu năm)
  giaDatO?: number;            // «GIA_ODT»
  giaDatNN?: number;           // «GIA_CLN»
  viTriDatNN?: string;         // «Vị_trí_đất_NN» (VD: Vị trí 1)
  dienGiaiViTriNN?: string;    // «VT_dat_NN_text» (VD: Cách đường nhựa <100m)
}

export interface BangGiaDat {
  id: string;
  tenDuong: string;
  diemDau: string;
  diemCuoi: string;
  
  // Đất phi nông nghiệp
  giaDatO: number;      // Đất ở
  giaTmDv: number;      // Thương mại dịch vụ
  giaSxPhiNn: number;   // SXKD Phi nông nghiệp
  
  // Đất nông nghiệp (Mới cập nhật)
  giaDatCLN: number;    // Đất trồng cây lâu năm (Thường dùng làm giá sàn)
  giaDatCHN: number;    // Đất trồng cây hằng năm
  giaDatNTS: number;    // Đất nuôi trồng thủy sản
  
  namApDung?: number;
}

export interface SystemSettings {
  googleDocUrl: string;
  googleDocName: string;
  htmlTemplate: string; // Mẫu Tờ Trình
  decisionTemplate?: string; // Mới: Mẫu Quyết Định
}

export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  username: string;
  password?: string; // Optional khi fetch về client để bảo mật
  fullName: string;
  role: UserRole;
}

export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  LIST = 'LIST',
  ADD = 'ADD',
  EDIT = 'EDIT',
  USERS = 'USERS', // Quản lý tài khoản
  PRICE_LIST = 'PRICE_LIST', // Bảng giá đất
  CALCULATOR = 'CALCULATOR', // Tính giá đất (Mới)
  SETTINGS = 'SETTINGS' // Cấu hình hệ thống
}
