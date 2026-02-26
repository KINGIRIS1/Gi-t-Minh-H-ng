
import { HoSoDat, User, BangGiaDat, SystemSettings } from '../types';
import { createClient } from '@supabase/supabase-js';

// Cấu hình Supabase
const SUPABASE_URL = 'https://dajjhubrhybodggbqapt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhampodWJyaHlib2RnZ2JxYXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzM3MDUsImV4cCI6MjA4MDM0OTcwNX0.Te4JGaR7DnSiejugyZHV0_uQSWsG_TS_xTmRgxgM5-4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const TABLE_HO_SO = 'ho_so_dat';
const TABLE_USERS = 'app_users'; 
const TABLE_GIA_DAT = 'bang_gia_dat'; 

const KEY_SETTINGS = 'app_settings';

// Mẫu HTML đầy đủ cho Tờ Trình (Cập nhật mới nhất)
export const DEFAULT_HTML_TEMPLATE = `
<div style="font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; color: #000;">
  <!-- HEADER 2 CỘT -->
  <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 25px;">
    <tr>
      <td style="width: 40%; text-align: center; vertical-align: top; font-size: 13pt;">
        UBND PHƯỜNG MINH HƯNG<br/>
        <span style="font-weight: bold; text-decoration: underline;">PHÒNG KINH TẾ, HẠ TẦNG VÀ ĐÔ THỊ</span>
        <br/><br/>
        <div style="font-size: 13pt;">Số: ........./TTr-PKTHTĐT</div>
      </td>
      <td style="width: 60%; text-align: center; vertical-align: top; font-size: 13pt;">
        <span style="font-weight: bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br/>
        <span style="font-weight: bold; text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span>
        <br/><br/>
        <span style="font-style: italic; font-size: 14pt;">Minh Hưng, ngày .... tháng .... năm 2025</span>
      </td>
    </tr>
  </table>

  <!-- TIÊU ĐỀ -->
  <div style="text-align: center; margin-bottom: 25px;">
      <p style="font-weight: bold; margin: 0; font-size: 15pt; line-height: 1.2;">TỜ TRÌNH</p>
      <p style="font-weight: bold; margin: 0; font-size: 14pt; line-height: 1.5;">Về việc cho chuyển mục đích sử dụng đất</p>
      <div style="width: 200px; border-top: 1px solid black; margin: 5px auto 0 auto;"></div>
  </div>

  <div style="text-align: center; margin-bottom: 20px; font-weight: bold;">
    Kính gửi: Chủ tịch UBND phường Minh Hưng.
  </div>

  <!-- PHẦN I: CĂN CỨ -->
  <p style="font-weight: bold; margin-bottom: 5px; text-transform: uppercase;">I. Căn cứ pháp lý:</p>
  <div style="text-align: justify;">
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Luật Đất đai số 31/2024/QH15 ngày 18/01/2024;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Luật số 43/2024/QH15 ngày 29/6/2024 sửa đổi, bổ sung một số điều của Luật Đất đai số 31/2024/QH15, Luật Nhà ở số 27/2023/QH15, Luật Kinh doanh bất động sản số 29/2023/QH15 và Luật Các tổ chức tín dụng số 32/2024/QH15;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ khoản 20 Điều 1 Luật Ban hành văn bản số 87/2025/QH15 ngày 25/6/2025 sửa đổi, bổ sung khoản 2 Điều 54 của Luật Ban hành văn bản quy phạm pháp luật số 64/2025/QH15 ngày 19 tháng 02 năm 2025;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Nghị định số 102/2024/NĐ-CP ngày 30/7/2024 của Chính phủ Quy định chi tiết thi hành một số điều của Luật Đất đai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Nghị định số 103/2024/NĐ-CP ngày 30/7/2024 của Chính phủ Quy định về tiền sử dụng đất, tiền thuê đất;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Nghị định số 151/2025/NĐ-CP ngày 12/6/2025 của Chính phủ Quy định về phân định thẩm quyền của chính quyền địa phương 02 cấp, phân quyền, phân cấp trong lĩnh vực đất đai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Nghị định số 118/2025/NĐ-CP ngày 09/6/2025 của Chính phủ Quy định về việc thực hiện thủ tục hành chính theo cơ chế một cửa, một cửa liên thông tại Bộ phận Một cửa và Cổng Dịch vụ công quốc gia;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Nghị định số 226/2025/NĐ-CP ngày 15/8/2025 của Chính phủ về sửa đổi, bổ sung một số điều của các nghị định quy định chi tiết thi hành luật Đất đai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Thông tư 10/2024/TT-BTNMT ngày 30/7/2024 của Bộ Tài nguyên và Môi trường quy định về hồ sơ địa chính, giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Thông tư 23/2025/TT-BTNMT ngày 20/6/2024 của Bộ Nông nghiệp và Môi trường quy định về phân cấp, phân định thẩm quyền quản lý nhà nước trong lĩnh vực đất đai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 2418/QĐ-BTNMT ngày 28/6/2025 của Bộ Nông nghiệp và Môi trường về việc đính chính Nghị định số 151/2025/NĐ-CP ngày 12/6/2025 của Chính phủ Quy định về phân định thẩm quyền của chính quyền địa phương 02 cấp, phân quyền, phân cấp trong lĩnh vực đất đai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 3380/QĐ-BTNMT ngày 25/8/2025 của Bộ trưởng Bộ Nông nghiệp và Môi trường về việc công bố thủ tục hành chính mới ban hành; được sửa đổi, bổ sung lĩnh vực đất đai thuộc phạm vi chức năng quản lý nhà nước của Bộ Nông nghiệp và Môi trường;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Công văn số 5786/BNNMT-QLĐĐ ngày 20/8/2025 của Bộ Nông nghiệp và Môi trường về việc hướng dẫn về căn cứ thu hồi đất, giao, cho thuê đất theo Luật Đất đai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 562/QĐ-UBND ngày 25/3/2022 của UBND tỉnh về việc phê duyệt Quy hoạch sử dụng đất đến năm 2030 huyện Chơn Thành, tỉnh Bình Phước; Căn cứ Quyết định số 1238/QĐ-UBND ngày 17/6/2025 của UBND tỉnh về việc phê duyệt Điều chỉnh Quy hoạch sử dụng đất đến năm 2030 thị xã Chơn Thành, tỉnh Bình Phước;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 2892/QĐ-UBND ngày 31/12/2019 của UBND tỉnh về việc phê duyệt Đồ án Quy hoạch chung xây dựng đô thị Chơn Thành tỉnh Bình Phước;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 424/QĐ-UBND ngày 26/02/2025 và 1574/QĐ-UBND ngày 29/6/2025 của UBND tỉnh Bình Phước về việc phê duyệt Đồ án điều chỉnh cục bộ Quy hoạch chung đô thị Chơn Thành tỉnh Bình Phước;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 286/QĐ-UBND ngày 18/02/2025 của UBND tỉnh về việc phê duyệt Kế hoạch sử dụng đất năm 2025 của thị xã Chơn Thành, tỉnh Bình Phước; Căn cứ Quyết định số 1448/QĐ-UBND ngày 27/6/2025 của UBND tỉnh Bình Phước về việc phê duyệt Điều chỉnh Kế hoạch sử dụng đất năm 2025 của thị xã Chơn Thành, tỉnh Bình Phước;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 2215/QĐ-UBND ngày 26/6/2025 của Chủ tịch UBND tỉnh Đồng Nai về việc Công khai Danh mục thủ tục hành chính được tiếp nhận và trả kết quả tại Trung tâm hành chính công tỉnh và Trung tâm phục vụ hành chính công cấp xã trên địa bàn tỉnh Đồng Nai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 1181/QĐ-UBND ngày 05/9/2025 của Chủ tịch UBND tỉnh Đồng Nai về việc Công bố Danh mục thủ tục hành chính mới ban hành; thủ tục hành chính được sửa đổi, bổ sung lĩnh vực Đất đai thuộc thẩm quyền giải quyết của ngành Nông nghiệp và Môi trường tỉnh Đồng Nai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 1319/QĐ-UBND ngày 16/9/2025 của UBND tỉnh Đồng Nai về việc phê duyệt quy trình nội bộ, quy trình điện tử giải quyết thủ tục hành chính mới ban hành, thay thế lĩnh vực Đất đai thuộc thẩm quyền giải quyết của nghành Nông nghiệp và Môi trường trên địa bàn tỉnh Đồng Nai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 2095/QĐ-UBND ngày 31/10/2025 của UBND tỉnh Đồng Nai về việc công bố Danh mục thủ tục hành chính ngành Nông nghiệp và Môi trường thực hiện không phụ thuộc vào địa giới hành chính trong phạm vi tỉnh Đồng Nai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quy hoạch phân khu tỷ lệ 1/2000 khu đô thị Minh Long, thị xã Chơn Thành, tỉnh Bình Phước đã được UBND thị xã phê duyệt tại Quyết định số 2101/QĐ-UBND ngày 18/9/2024;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 2100/QĐ-UBND ngày 18/9/2024 của UBND thị xã Chơn Thành về việc phê duyệt Quy hoạch phân khu tỷ lệ 1/2000 khu đô thị Minh Hưng, thị xã Chơn Thành, tỉnh Bình Phước;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Công văn số 483/SNNMT-QLĐĐ và Công văn số 491/SNNMT-QLĐĐ ngày 24/3/2025 của Sở Nông nghiệp và Môi trường tỉnh Bình Phước; Công văn số 2534/SNNMT-QLĐĐ ngày 16/6/2025 của Sở Nông nghiệp và Môi trường về việc triển khai thực hiện các quy định của pháp luật về đất đai tại thị xã Chơn Thành (cũ);</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Công văn số 1271/UBND-KTNS ngày 21/7/2025 của UBND tỉnh Đồng Nai về việc áp dụng Bảng giá đất kể từ ngày 01 tháng 7 năm 2025 trên địa bàn tỉnh Đồng Nai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Công văn số 3629/UBND-KTN ngày 21/8/2025 của UBND tỉnh Đồng Nai về việc phân bổ chỉ tiêu sử dụng đất đến năm 2030 cho 95 đơn vị hành chính cấp xã;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Xét hồ sơ xin chuyển mục đích sử dụng đất của <b>«Chu_su_dung»</b>.</p>
  </div>
  
  <!-- PHẦN II: NỘI DUNG -->
  <p style="font-weight: bold; margin: 15px 0 5px 0; text-transform: uppercase;">II. Phần nội dung:</p>
  <div style="text-align: justify;">
    <p style="font-weight: bold; margin: 5px 0; text-indent: 1.27cm;">1. Quá trình chuẩn bị, đánh giá hồ sơ chuyển mục đích sử dụng đất.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;"><b>«Chu_su_dung»</b> có đơn xin chuyển mục đích sử dụng đất ngày «Ngay_don_nhap» và nộp kèm đầy đủ các hồ sơ giấy tờ liên quan để thực hiện việc chuyển mục đích sử dụng đất theo quy định.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Trên cơ sở Tờ trích lục địa chính hoặc trích đo địa chính số <b>«So_tric_do_nhap»</b> tỷ lệ «ty_le_ban_do» ngày «ngay_trich_luc_nhap», Phiếu xác nhận thông tin ngày «Ngay_phieu_XN_nhap» của Văn phòng Đăng ký Đất đai tỉnh Đồng Nai - Chi nhánh Chơn Thành.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Phòng Kinh tế, Hạ tầng và Đô thị phường Minh Hưng đã phối hợp với <b>«Chu_su_dung»</b> tiến hành rà soát, kiểm tra hồ sơ, kiểm tra thực địa thửa đất xin chuyển mục đích sử dụng đất (ghi nhận bằng biên bản ngày «Ngay_xac_minh_nhap»).</p>
    
    <p style="font-weight: bold; margin: 10px 0 5px 0; text-indent: 1.27cm;">2. Kết quả đánh giá về hồ sơ chuyển mục đích sử dụng đất.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Qua kiểm tra diện tích, vị trí xin chuyển mục đích sử dụng đất theo hồ sơ của <b>«Chu_su_dung»</b> tại thửa đất số «thua_so» tờ bản đồ số «to_so», diện tích «DT_GCN_nhap»m2 (trong đó: «Text_loai_dat_GCN_ONT» «CLN_tren_GCN»m2 đất trồng cây lâu năm), Phòng Kinh tế, Hạ tầng và Đô thị nhận thấy:</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">- Theo Quy hoạch phân khu tỷ lệ 1/2000 khu đô thị Minh Long, thị xã Chơn Thành, tỉnh Bình Phước (đã được UBND thị xã phê duyệt tại Quyết định số 2101/QĐ-UBND ngày 18/9/2024), Theo Quy hoạch phân khu tỷ lệ 1/2000 khu đô thị Minh Hưng, thị xã Chơn Thành, tỉnh Bình Phước (cũ) (đã được UBND thị xã Chơn Thành phê duyệt tại Quyết định số 2100/QĐ-UBND ngày 18/9/2024): Thửa đất nằm «Trong_ngoài» phạm vi quy hoạch phân khu, vị trí xin chuyển mục đích thuộc quy hoạch «Phan_Khu».</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">- Theo Quy hoạch sử dụng đất đến năm 2030 của thị xã Chơn Thành (đã được UBND tỉnh phê duyệt tại Quyết định số 562/QĐ-UBND ngày 25/3/2022 và được điều chỉnh tại Quyết định số 1238/QĐ-UBND ngày 17/6/2025), vị trí xin chuyển mục đích thuộc quy hoạch «QHSDD».</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">- Theo Quy hoạch chung đô thị Chơn Thành (đã được UBND tỉnh phê duyệt Quyết định số 2892/QĐ-UBND ngày 31/12/2019 và được điều chỉnh cục bộ tại Quyết định số 424/QĐ-UBND ngày 26/02/2025), vị trí xin chuyển mục đích thuộc quy hoạch «QH_chung».</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">- Thửa đất không thuộc khu vực quy hoạch các công trình, dự án phải thu hồi đất, thực hiện chủ trương đầu tư theo Quy hoạch phân khu tỷ lệ 1/2000 khu đô thị Minh Hưng, Quy hoạch chung đô thị Chơn Thành và Quy hoạch sử dụng đất đến năm 2030 của thị xã Chơn Thành (cũ). Không thuộc danh mục các công trình dự án phải thu hồi đất của Kế hoạch sử dụng đất năm 2025 của thị xã Chơn Thành (cũ) (đã được UBND tỉnh phê duyệt tại Quyết định số 286/QĐ-UBND ngày 18/02/2025 và được điều chỉnh được điều chỉnh tại Quyết định số 1238/QĐ-UBND ngày 17/6/2025).</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">- Theo phân bổ chỉ tiêu sử dụng đất đến năm 2030 cho 95 đơn vị hành chính cấp xã tại Công văn số 3629/UBND-KTN ngày 21/8/2025 của UBND tỉnh Đồng Nai thì diện tích chỉ tiêu còn lại của phường Minh Hưng: 4.349.734,4m2.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Từ những nội dung đánh giá, xác định diện tích, vị trí xin chuyển mục đích phù hợp các quy hoạch trên đảm bảo điều kiện chuyển mục đích sử dụng đất từ đất trồng cây lâu năm sang đất ở theo quy định tại khoản 5 Điều 116, Điều 227 Luật Đất đai số 31/2024/QH15; điểm m khoản 1 Điều 5, khoản 2 Điều 22 và Mục I.1 Phần III Phụ Lục I Nghị định số 151/2025/NĐ-CP ngày 12/5/2025 của Chính Phủ quy định về phân định thẩm quyền của chính quyền địa phương 02 cấp, phân quyền, phân cấp trong lĩnh vực đất đai và theo hướng dẫn của Sở Nông nghiệp và Môi trường tỉnh Bình Phước (cũ) tại Công văn số 491/SNNMT-QLĐĐ ngày 24/3/2025.</p>

    <p style="font-weight: bold; margin: 10px 0 5px 0; text-indent: 1.27cm;">3. Nội dung đề nghị chuyển mục đích sử dụng đất.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Cho <b>«Chu_su_dung»</b> (Địa chỉ: «Hộ_Khẩu») được chuyển mục đích sử dụng <b>«xin_CMD_mm»</b>m2 đất và hình thức sử dụng đất sau khi chuyển mục đích sử dụng đất là giao đất có thu tiền sử dụng đất theo quy định tại khoản 1 Điều 119 Luật Đất đai năm 2024 tại thửa đất số «thua_so», tờ bản đồ số «to_so», thuộc «ap__KP», phường Minh Hưng, tỉnh Đồng Nai.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Mục đích sử dụng đất: Đất ở tại đô thị.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Thời hạn sử dụng đất: Ổn định lâu dài.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Vị trí, ranh giới, phạm vi, tên đường, đoạn đường đối với phần diện tích xin chuyển mục đích được xác định theo Tờ trích lục địa chính hoặc trích đo địa chính số <b>«So_tric_do_nhap»</b> tỷ lệ «ty_le_ban_do» ngày «ngay_trich_luc_nhap», Phiếu xác nhận thông tin ngày «Ngay_phieu_XN_nhap» của Văn phòng Đăng ký đất đai tỉnh Đồng Nai - Chi nhánh Chơn Thành.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Giá đất tính tiền sử dụng đất phải nộp (theo bảng giá đất tại Quyết định số 18/2020/QĐ-UBND ngày 12/8/2020 và Quyết định số 52/2024/QĐ-UBND ngày 27/12/2024 của UBND tỉnh Bình Phước):</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">(1) Giá đất trước khi chuyển mục đích:</p>
    <ul style="margin: 0; padding-left: 1.27cm; list-style-type: none;">
       <li>- Diện tích: «xin_CMD_mm»m2.</li>
       <li>- Mục đích sử dụng: Đất trồng cây lâu năm.</li>
       <li>- Khu vực 1, «Vị_trí_đất_NN»: «VT_dat_NN_text»;</li>
       <li>- «GIA_CLN»</li>
    </ul>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">(2) Giá đất sau khi chuyển mục đích:</p>
    <ul style="margin: 0; padding-left: 1.27cm; list-style-type: none;">
       <li>- Diện tích: «xin_CMD_mm»m2.</li>
       <li>- Mục đích sử dụng: Đất ở tại đô thị.</li>
       <li>- Khu vực 1, vị trí: Mặt tiền «key»;</li>
       <li>- «GIA_ODT»</li>
    </ul>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Hạn chế trong việc sử dụng đất sau khi chuyển mục đích sử dụng đất: Không có.</p>

    <p style="font-weight: bold; margin: 10px 0 5px 0; text-indent: 1.27cm;">4. Kính đề nghị Chủ tịch Ủy ban nhân dân phường Minh Hưng giao trách nhiệm cho các cơ quan, tổ chức, cá nhân liên quan:</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">- Thuế cơ sở 7 tỉnh Đồng Nai có trách nhiệm xác định tiền sử dụng đất phải nộp và nộp bổ sung, hoàn trả (nếu có); hướng dẫn thực hiện giảm tiền sử dụng đất, khoản được trừ vào tiền sử dụng đất, chậm nộp, ghi nợ tiền sử dụng đất/tiền thuê đất, tiền thuê đất đối với trường hợp miễn một số năm, theo dõi trường hợp miễn tiền sử dụng đất/tiền thuê đất, phí, lệ phí... (nếu có); thông báo cho người được giao đất nộp tiền sử dụng đất và phí, lệ phí (nếu có).</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">- Người sử dụng đất chịu trách nhiệm nộp tiền sử dụng đất, phí, lệ phí (nếu có).</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">- Phòng Giao dịch số 8 thuộc Kho bạc Nhà nước khu vực XVII có trách nhiệm thu tiền sử dụng đất phải nộp, thu phí, lệ phí (nếu có).</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">- Văn phòng Đăng ký đất đai tỉnh Đồng Nai - Chi nhánh Chơn Thành có trách nhiệm chỉnh lý hồ sơ địa chính, cơ sở dữ liệu đất đai.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">- Trung tâm phục vụ hành chính công phường Minh Hưng có trách nhiệm trao Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất cho người sử dụng đất đã hoàn thành nghĩa vụ tài chính theo quy định.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">- Nội dung khác (nếu có): Không.</p>
    
    <p style="margin: 10px 0 6px 0; text-indent: 1.27cm;">Kính đề nghị Chủ tịch UBND phường xem xét./.</p>
  </div>
  <br/>
  
  <!-- FOOTER -->
  <table style="width: 100%; border: none; margin-top: 20px;">
    <tr>
      <td style="width: 50%; vertical-align: top; font-size: 12pt;">
        <b><i>Nơi nhận:</i></b><br/>
        - Chủ tịch UBND phường;<br/>
        - TP, PTP;<br/>
        - CV: ĐĐ;<br/>
        - Lưu: VT.
      </td>
      <td style="width: 50%; text-align: center; vertical-align: top;">
         <b>TRƯỞNG PHÒNG</b><br/><br/><br/><br/><br/>
         <b>Nguyễn Văn Chinh</b>
      </td>
    </tr>
  </table>
</div>
`;

// Mẫu HTML mặc định cho QUYẾT ĐỊNH
export const DEFAULT_DECISION_TEMPLATE = `
<div style="font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; color: #000;">
  <!-- HEADER -->
  <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 25px;">
    <tr>
      <td style="width: 40%; text-align: center; vertical-align: top; font-size: 13pt;">
        ỦY BAN NHÂN DÂN<br/>
        <span style="font-weight: bold; text-decoration: underline;">PHƯỜNG MINH HƯNG</span>
        <br/><br/>
        <div style="font-size: 13pt;">Số: ........./QĐ-UBND</div>
      </td>
      <td style="width: 60%; text-align: center; vertical-align: top; font-size: 13pt;">
        <span style="font-weight: bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br/>
        <span style="font-weight: bold; text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span>
        <br/><br/>
        <span style="font-style: italic; font-size: 14pt;">Minh Hưng, ngày .... tháng .... năm 2025</span>
      </td>
    </tr>
  </table>

  <!-- TIÊU ĐỀ -->
  <div style="text-align: center; margin-bottom: 25px;">
      <p style="font-weight: bold; margin: 0; font-size: 15pt; line-height: 1.2;">QUYẾT ĐỊNH</p>
      <p style="font-weight: bold; margin: 0; font-size: 14pt; line-height: 1.5;">Về việc cho chuyển mục đích sử dụng đất</p>
      <div style="width: 200px; border-top: 1px solid black; margin: 5px auto 0 auto;"></div>
  </div>

  <div style="text-align: center; margin-bottom: 20px; font-weight: bold;">
    CHỦ TỊCH ỦY BAN NHÂN DÂN PHƯỜNG MINH HƯNG
  </div>

  <!-- CĂN CỨ -->
  <div style="text-align: justify;">
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Luật Tổ chức chính quyền địa phương ngày 16/6/2025;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Luật Đất đai số 31/2024/QH15 ngày 18/01/2024;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Luật số 43/2024/QH15 ngày 29/6/2024 sửa đổi, bổ sung một số điều của Luật Đất đai số 31/2024/QH15, Luật Nhà ở số 27/2023/QH15, Luật Kinh doanh bất động sản số 29/2023/QH15 và Luật Các tổ chức tín dụng số 32/2024/QH15;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ khoản 20 Điều 1 Luật Ban hành văn bản số 87/2025/QH15 ngày 25/6/2025 sửa đổi, bổ sung khoản 2 Điều 54 của Luật Ban hành văn bản quy phạm pháp luật số 64/2025/QH15 ngày 19 tháng 02 năm 2025;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Nghị định số 102/2024/NĐ-CP ngày 30/7/2024 của Chính phủ Quy định chi tiết thi hành một số điều của Luật Đất đai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Nghị định số 103/2024/NĐ-CP ngày 30/7/2024 của Chính phủ Quy định về tiền sử dụng đất, tiền thuê đất;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Nghị định số 151/2025/NĐ-CP ngày 12/6/2025 của Chính phủ Quy định về phân định thẩm quyền của chính quyền địa phương 02 cấp, phân quyền, phân cấp trong lĩnh vực đất đai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Nghị định số 118/2025/NĐ-CP ngày 09/6/2025 của Chính phủ Quy định về việc thực hiện thủ tục hành chính theo cơ chế một cửa, một cửa liên thông tại Bộ phận Một cửa và Cổng Dịch vụ công quốc gia;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Nghị định số 226/2025/NĐ-CP ngày 15/8/2025 của Chính phủ về sửa đổi, bổ sung một số điều của các nghị định quy định chi tiết thi hành luật Đất đai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Thông tư 10/2024/TT-BTNMT ngày 30/7/2024 của Bộ Tài nguyên và Môi trường quy định về hồ sơ địa chính, giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Thông tư 23/2025/TT-BTNMT ngày 20/6/2024 của Bộ Nông nghiệp và Môi trường quy định về phân cấp, phân định thẩm quyền quản lý nhà nước trong lĩnh vực đất đai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 2418/QĐ-BTNMT ngày 28/6/2025 của Bộ Nông nghiệp và Môi trường về việc đính chính Nghị định số 151/2025/NĐ-CP ngày 12/6/2025 của Chính phủ Quy định về phân định thẩm quyền của chính quyền địa phương 02 cấp, phân quyền, phân cấp trong lĩnh vực đất đai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 3380/QĐ-BTNMT ngày 25/8/2025 của Bộ trưởng Bộ Nông nghiệp và Môi trường về việc công bố thủ tục hành chính mới ban hành; được sửa đổi, bổ sung lĩnh vực đất đai thuộc phạm vi chức năng quản lý nhà nước của Bộ Nông nghiệp và Môi trường;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Công văn số 5786/BNNMT-QLĐĐ ngày 20/8/2025 của Bộ Nông nghiệp và Môi trường về việc hướng dẫn về căn cứ thu hồi đất, giao, cho thuê đất theo Luật Đất đai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 562/QĐ-UBND ngày 25/3/2022 của UBND tỉnh về việc phê duyệt Quy hoạch sử dụng đất đến năm 2030 huyện Chơn Thành, tỉnh Bình Phước; Căn cứ Quyết định số 1238/QĐ-UBND ngày 17/6/2025 của UBND tỉnh về việc phê duyệt Điều chỉnh Quy hoạch sử dụng đất đến năm 2030 thị xã Chơn Thành, tỉnh Bình Phước;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 2892/QĐ-UBND ngày 31/12/2019 của UBND tỉnh về việc phê duyệt Đồ án Quy hoạch chung xây dựng đô thị Chơn Thành tỉnh Bình Phước;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 424/QĐ-UBND ngày 26/02/2025 và 1574/QĐ-UBND ngày 29/6/2025 của UBND tỉnh Bình Phước về việc phê duyệt Đồ án điều chỉnh cục bộ Quy hoạch chung đô thị Chơn Thành tỉnh Bình Phước;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 286/QĐ-UBND ngày 18/02/2025 của UBND tỉnh về việc phê duyệt Kế hoạch sử dụng đất năm 2025 của thị xã Chơn Thành, tỉnh Bình Phước; Căn cứ Quyết định số 1448/QĐ-UBND ngày 27/6/2025 của UBND tỉnh Bình Phước về việc phê duyệt Điều chỉnh Kế hoạch sử dụng đất năm 2025 của thị xã Chơn Thành, tỉnh Bình Phước;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 2215/QĐ-UBND ngày 26/6/2025 của Chủ tịch UBND tỉnh Đồng Nai về việc Công khai Danh mục thủ tục hành chính được tiếp nhận và trả kết quả tại Trung tâm hành chính công tỉnh và Trung tâm phục vụ hành chính công cấp xã trên địa bàn tỉnh Đồng Nai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 1181/QĐ-UBND ngày 05/9/2025 của Chủ tịch UBND tỉnh Đồng Nai về việc Công bố Danh mục thủ tục hành chính mới ban hành; thủ tục hành chính được sửa đổi, bổ sung lĩnh vực Đất đai thuộc thẩm quyền giải quyết của ngành Nông nghiệp và Môi trường tỉnh Đồng Nai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 1319/QĐ-UBND ngày 16/9/2025 của UBND tỉnh Đồng Nai về việc phê duyệt quy trình nội bộ, quy trình điện tử giải quyết thủ tục hành chính mới ban hành, thay thế lĩnh vực Đất đai thuộc thẩm quyền giải quyết của nghành Nông nghiệp và Môi trường trên địa bàn tỉnh Đồng Nai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 2095/QĐ-UBND ngày 31/10/2025 của UBND tỉnh Đồng Nai về việc công bố Danh mục thủ tục hành chính ngành Nông nghiệp và Môi trường thực hiện không phụ thuộc vào địa giới hành chính trong phạm vi tỉnh Đồng Nai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quy hoạch phân khu tỷ lệ 1/2000 khu đô thị Minh Long, thị xã Chơn Thành, tỉnh Bình Phước đã được UBND thị xã phê duyệt tại Quyết định số 2101/QĐ-UBND ngày 18/9/2024;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Quyết định số 2100/QĐ-UBND ngày 18/9/2024 của UBND thị xã Chơn Thành về việc phê duyệt Quy hoạch phân khu tỷ lệ 1/2000 khu đô thị Minh Hưng, thị xã Chơn Thành, tỉnh Bình Phước;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Công văn số 483/SNNMT-QLĐĐ và Công văn số 491/SNNMT-QLĐĐ ngày 24/3/2025 của Sở Nông nghiệp và Môi trường tỉnh Bình Phước; Công văn số 2534/SNNMT-QLĐĐ ngày 16/6/2025 của Sở Nông nghiệp và Môi trường về việc triển khai thực hiện các quy định của pháp luật về đất đai tại thị xã Chơn Thành (cũ);</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Công văn số 1271/UBND-KTNS ngày 21/7/2025 của UBND tỉnh Đồng Nai về việc áp dụng Bảng giá đất kể từ ngày 01 tháng 7 năm 2025 trên địa bàn tỉnh Đồng Nai;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Căn cứ Công văn số 3629/UBND-KTN ngày 21/8/2025 của UBND tỉnh Đồng Nai về việc phân bổ chỉ tiêu sử dụng đất đến năm 2030 cho 95 đơn vị hành chính cấp xã;</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Xét đề nghị của phòng Kinh tế, Hạ tầng và Đô thị tại Tờ trình số       ……./TTr-PKTHTĐT ngày «Ngay_xac_minh_nhap».</p>
  </div>

  <div style="text-align: center; margin-top: 20px; font-weight: bold;">QUYẾT ĐỊNH:</div>

  <div style="text-align: justify;">
    <p style="margin: 10px 0 6px 0; text-indent: 1.27cm;"><span style="font-weight: bold;">Điều 1.</span> Cho <b>«Chu_su_dung»</b> (Địa chỉ: «Hộ_Khẩu») được chuyển mục đích sử dụng <b>«xin_CMD_mm»</b>m2 đất và hình thức sử dụng đất sau khi chuyển mục đích sử dụng đất là giao đất có thu tiền sử dụng đất theo quy định tại khoản 1 Điều 119 Luật Đất đai năm 2024 tại thửa đất số «thua_so», tờ bản đồ số «to_so», thuộc «ap__KP», phường Minh Hưng, tỉnh Đồng Nai.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Mục đích sử dụng đất: Đất ở tại đô thị.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Thời hạn sử dụng đất: Ổn định lâu dài.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Vị trí, ranh giới, phạm vi, tên đường, đoạn đường đối với phần diện tích xin chuyển mục đích được xác định theo Tờ trích lục địa chính hoặc trích đo địa chính số <b>«So_tric_do_nhap»</b> tỷ lệ «ty_le_ban_do» ngày «ngay_trich_luc_nhap», Phiếu xác nhận thông tin ngày «Ngay_phieu_XN_nhap» của Văn phòng Đăng ký đất đai tỉnh Đồng Nai - Chi nhánh Chơn Thành.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Giá đất tính tiền sử dụng đất phải nộp (theo bảng giá đất tại Quyết định số 18/2020/QĐ-UBND ngày 12/8/2020 và Quyết định số 52/2024/QĐ-UBND ngày 27/12/2024 của UBND tỉnh Bình Phước):</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">(1) Giá đất trước khi chuyển mục đích:</p>
    <ul style="margin: 0; padding-left: 1.27cm; list-style-type: none;">
       <li>- Diện tích: «xin_CMD_mm»m2.</li>
       <li>- Mục đích sử dụng: Đất trồng cây lâu năm.</li>
       <li>- Khu vực 1, «Vị_trí_đất_NN»: «VT_dat_NN_text»;</li>
       <li>- «GIA_CLN»</li>
    </ul>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">(2) Giá đất sau khi chuyển mục đích:</p>
    <ul style="margin: 0; padding-left: 1.27cm; list-style-type: none;">
       <li>- Diện tích: «xin_CMD_mm»m2.</li>
       <li>- Mục đích sử dụng: Đất ở tại đô thị.</li>
       <li>- Khu vực 1, vị trí: Mặt tiền «key»;</li>
       <li>- «GIA_ODT»</li>
    </ul>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Hạn chế trong việc sử dụng đất sau khi chuyển mục đích sử dụng đất: Không có.</p>

    <p style="margin: 10px 0 6px 0; text-indent: 1.27cm;"><span style="font-weight: bold;">Điều 2.</span> Tổ chức thực hiện:</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">1. Thuế cơ sở 7 tỉnh Đồng Nai có trách nhiệm xác định tiền sử dụng đất phải nộp và nộp bổ sung, hoàn trả (nếu có); hướng dẫn thực hiện giảm tiền sử dụng đất, khoản được trừ vào tiền sử dụng đất, chậm nộp, ghi nợ tiền sử dụng đất/tiền thuê đất, tiền thuê đất đối với trường hợp miễn một số năm, theo dõi trường hợp miễn tiền sử dụng đất/tiền thuê đất, phí, lệ phí... (nếu có); thông báo cho người được giao đất nộp tiền sử dụng đất và phí, lệ phí (nếu có).</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">2. Người sử dụng đất chịu trách nhiệm nộp tiền sử dụng đất, phí, lệ phí (nếu có).</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">3. Phòng Giao dịch số 8 thuộc Kho bạc Nhà nước khu vực XVII có trách nhiệm thu tiền sử dụng đất phải nộp, thu phí, lệ phí (nếu có).</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">4. Văn phòng Đăng ký đất đai tỉnh Đồng Nai - Chi nhánh Chơn Thành có trách nhiệm chỉnh lý hồ sơ địa chính, cơ sở dữ liệu đất đai.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">5. Trung tâm phục vụ hành chính công phường Minh Hưng có trách nhiệm trao Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất cho người sử dụng đất đã hoàn thành nghĩa vụ tài chính theo quy định.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">6. Nội dung khác (nếu có): Không.</p>

    <p style="margin: 10px 0 6px 0; text-indent: 1.27cm;"><span style="font-weight: bold;">Điều 3.</span> Quyết định này có hiệu lực kể từ ngày ký.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Chánh Văn phòng HĐND và UBND phường Minh Hưng, Trưởng phòng Kinh tế, Hạ tầng và Đô thị, Thủ trưởng Thuế cơ sở 7 tỉnh Đồng Nai, Trưởng phòng Phòng Giao dịch số 8 - Kho bạc Nhà nước khu vực XVII, Giám đốc Văn phòng Đăng ký đất đai tỉnh Đồng Nai - Chi nhánh Chơn Thành, Giám đốc Trung tâm Phục vụ Hành chính công phường Minh Hưng, Thủ trưởng các cơ quan có liên quan và người được cho chuyển mục đích sử dụng đất có tên tại Điều 1 chịu trách nhiệm thi hành Quyết định này.</p>
    <p style="margin: 0 0 6px 0; text-indent: 1.27cm;">Văn phòng HĐND và UBND phường chịu trách nhiệm đăng tải Quyết định này trên Trang thông tin điện tử của UBND phường Minh Hưng./.</p>
  </div>

  <table style="width: 100%; border: none; margin-top: 30px;">
    <tr>
      <td style="width: 50%; vertical-align: top; font-size: 11pt;">
        <b><i>Nơi nhận:</i></b><br/>
        - CT, các PCT.UBND phường;<br/>
        - Như Điều 3;<br/>
        - LĐVP, CV: KTN, CNTT;<br/>
        - Trang thông tin điện tử phường<br/>
        (CV CNTT đăng Website);<br/>
        - Lưu: VT (NKL).
      </td>
      <td style="width: 50%; text-align: center; vertical-align: top; font-size: 13pt;">
         <b>CHỦ TỊCH</b><br/><br/><br/><br/><br/><br/>
         <b>Lê Khắc Đồng</b>
      </td>
    </tr>
  </table>
</div>
`;

export const getSettings = (): SystemSettings => {
  const data = localStorage.getItem(KEY_SETTINGS);
  if (data) {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      htmlTemplate: parsed.htmlTemplate || DEFAULT_HTML_TEMPLATE,
      decisionTemplate: parsed.decisionTemplate || DEFAULT_DECISION_TEMPLATE // Load template quyết định
    };
  }
  return {
    googleDocUrl: '',
    googleDocName: 'Mẫu Tờ Trình CMD 2025',
    htmlTemplate: DEFAULT_HTML_TEMPLATE,
    decisionTemplate: DEFAULT_DECISION_TEMPLATE
  };
};

export const saveSettings = (settings: SystemSettings): boolean => {
  try {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};


// --- QUẢN LÝ NGƯỜI DÙNG & ĐĂNG NHẬP ---

export const loginUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_USERS)
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) return null;
    return data as User;
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    return null;
  }
};

export const getUsers = async (): Promise<User[]> => {
  const { data } = await supabase.from(TABLE_USERS).select('*').order('username');
  return (data as User[]) || [];
};

export const saveUser = async (user: User): Promise<boolean> => {
  const { id, ...userData } = user;
  const payload = user.id ? user : userData; 

  const { error } = await supabase.from(TABLE_USERS).upsert(payload);
  if (error) {
    alert("Lỗi lưu người dùng: " + error.message);
    return false;
  }
  return true;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from(TABLE_USERS).delete().eq('id', id);
  return !error;
};

// --- CÁC HÀM TƯƠNG TÁC DỮ LIỆU HỒ SƠ ---

export const getRecords = async (): Promise<HoSoDat[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_HO_SO)
      .select('*')
      .order('ngayNhanHS', { ascending: false });

    if (error) {
      console.error("Lỗi lấy dữ liệu Supabase:", error);
      return [];
    }
    return data as HoSoDat[] || [];
  } catch (err) {
    console.error("Lỗi kết nối:", err);
    return [];
  }
};

export const saveRecord = async (record: HoSoDat): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLE_HO_SO)
      .upsert(record);

    if (error) {
      console.error("Lỗi lưu dữ liệu:", error);
      alert("Lỗi lưu dữ liệu: " + error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Lỗi hệ thống:", err);
    return false;
  }
};

export const importRecords = async (newRecords: HoSoDat[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLE_HO_SO)
      .insert(newRecords);

    if (error) {
      console.error("Lỗi import:", error);
      alert("Lỗi import: " + error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Lỗi hệ thống:", err);
    return false;
  }
};

export const deleteRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLE_HO_SO)
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Lỗi xóa:", error);
      alert("Lỗi xóa: " + error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Lỗi hệ thống:", err);
    return false;
  }
};

// --- CÁC HÀM BẢNG GIÁ ĐẤT ---

export const getPriceList = async (): Promise<BangGiaDat[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_GIA_DAT)
      .select('*')
      .order('tenDuong', { ascending: true });
      
    if (error) {
      console.error("Lỗi lấy bảng giá:", error);
      return [];
    }
    return data as BangGiaDat[];
  } catch (err) {
    console.error("Lỗi mạng/hệ thống:", err);
    return [];
  }
};

export const savePrice = async (price: BangGiaDat): Promise<boolean> => {
  try {
    const { id, ...data } = price;
    const payload = id ? price : data;

    const { error } = await supabase.from(TABLE_GIA_DAT).upsert(payload);
    
    if (error) {
      console.error("Chi tiết lỗi Supabase:", error);
      alert(`Lỗi lưu giá đất: ${error.message}\n(Code: ${error.code})`);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Lỗi hệ thống:", e);
    alert("Có lỗi xảy ra khi kết nối đến máy chủ.");
    return false;
  }
};

export const deletePrice = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from(TABLE_GIA_DAT).delete().eq('id', id);
  if (error) {
      alert("Lỗi xóa giá đất: " + error.message);
      return false;
  }
  return true;
};

export const importPrices = async (prices: BangGiaDat[]): Promise<boolean> => {
  try {
    const cleanedPrices = prices.map(({ id, ...rest }) => rest);
    
    const { error } = await supabase.from(TABLE_GIA_DAT).insert(cleanedPrices);
    if (error) {
        console.error("Lỗi import:", error);
        alert("Lỗi import giá đất: " + error.message);
        return false;
    }
    return true;
  } catch (e) {
      console.error(e);
      alert("Lỗi hệ thống khi import.");
      return false;
  }
};


// --- HÀM TIỆN ÍCH ---

export const exportToCSV = (records: HoSoDat[]) => {
  const BOM = "\uFEFF"; 
  const headers = [
    "STT", "Mã HS", "Ngày nhận", "Chủ sử dụng", "Địa chỉ chủ", 
    "MST", "CCCD", "Số GCN", "Ngày cấp", "Thửa", "Tờ", 
    "Địa chỉ thửa", "DT Tổng", "DT Đất ở", "DT Nông nghiệp"
  ];

  const csvContent = [
    headers.join(","),
    ...records.map((r, index) => [
      index + 1,
      `"${r.maHS || ''}"`,
      `"${r.ngayNhanHS || ''}"`,
      `"${r.chuSuDung || ''}"`,
      `"${r.diaChiChu || ''}"`,
      `"${r.mst || ''}"`,
      `"${r.cccd || ''}"`,
      `"${r.soGCN || ''}"`,
      `"${r.ngayCap || ''}"`,
      `"${r.thua || ''}"`,
      `"${r.to || ''}"`,
      `"${r.diaChiThua || ''}"`,
      r.dienTichTong || 0,
      r.dienTichDatO || 0,
      r.dienTichNN || 0
    ].join(","))
  ].join("\n");

  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Danh_Sach_Ho_So_Minh_Hung_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
