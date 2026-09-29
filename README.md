# HƯỚNG DẪN QUẢN TRỊ & NÂNG CẤP WEBSITE HOÀNG HÔN TATTOO

Website tĩnh HTML5 / CSS3 / JavaScript thuần cho **Hoàng Hôn Tattoo** theo ngôn ngữ thiết kế **Apple iOS 26 Liquid Glass** sang trọng, tối ưu SEO, hỗ trợ Responsive hoàn hảo trên điện thoại và máy tính.

---

## 1. CẤU TRÚC THƯ MỤC & CÁC TRANG WEB

```text
TIEMXAM_HOANGHON/
├── index.html            # Trang chủ: Banner Hero, Giới thiệu ngắn, 3 Thẻ dịch vụ, 6 Tác phẩm nổi bật
├── gioi-thieu.html       # Trang Giới thiệu: Câu chuyện 7 năm nghề, Ảnh Master Artist, 4 Bước quy trình & Cam kết
├── dich-vu.html          # Trang Dịch vụ (Gộp 3 dịch vụ: Xăm hình + Xỏ khuyên + Vô bi trên MỘT trang)
├── tac-pham.html         # Trang Tác phẩm: Toàn bộ bộ sưu tập hình xăm + Lọc phong cách + Lightbox lớn
├── bang-gia.html         # Trang Bảng giá: Bảng giá Xăm hình, Xỏ khuyên, Vô bi & Các chính sách tiệm
├── dat-lich.html         # Trang Đặt lịch: Form đặt hẹn tự động gửi về Google Sheet (Tích hợp tham số URL)
├── lien-he.html          # Trang Liên hệ: Địa chỉ, SĐT/Zalo, Mạng xã hội & Bản đồ Google Maps nhúng thật
├── css/
│   └── style.css         # Style sheet Liquid Glass style, hiệu ứng quệt sáng, sóng nước cuộn & responsive
├── js/
│   ├── config.js         # File cấu hình thông tin tiệm (SĐT, Zalo, địa chỉ, Google Maps link, Google Sheet endpoint)
│   ├── artworks.js       # Danh sách bộ sưu tập hình xăm nghệ thuật
│   └── main.js           # Xử lý chính: Dynamic nav indicator, Lightbox, Dynamic Form (?dichvu=), ScrollReveal
└── assets/
    ├── images/           # Ảnh thương hiệu, ảnh Master Artist, ảnh banner và các folder phong cách xăm
    └── services/         # Đồ họa minh họa vector SVG chuẩn cho dịch vụ Xỏ khuyên & Vô bi (không ảnh nhạy cảm)
```

---

## 2. HƯỚNG DẪN THÊM TÁC PHẨM XĂM MỚI

Để thêm hình xăm mới vào trang **Tác phẩm** (`tac-pham.html`):

1. Copy file ảnh tác phẩm mới vào thư mục tương ứng trong `assets/images/<tên-phong-cách>/`.
   * Ví dụ: ảnh xăm Blackwork bỏ vào `assets/images/blackwork/hinh-xam-moi.jpg`
2. Mở file `js/artworks.js` và thêm 1 phần tử mới vào mảng `ARTWORKS`:

```javascript
{
  id: 9,
  title: "Tên Tác Phẩm Mới",
  category: "Blackwork", // Chọn 1 trong: Blackwork, Lettering, Japanese, Minimalist, Realism, Dotwork
  details: "Vị trí · Thời gian thực hiện (Ví dụ: Cẳng tay · 4 giờ)",
  image: "assets/images/blackwork/hinh-xam-moi.jpg",
  description: "Mô tả ý tưởng, ý nghĩa hoặc thông điệp của hình xăm."
},
```

---

## 3. HƯỚNG DẪN SỬA THÔNG TIN TIỆM & GOOGLE SHEET

Tất cả thông tin liên hệ chính của tiệm được quản lý tập trung tại file `js/config.js`:

```javascript
const OWNER = {
  name: "HOÀNG HÔN TATTOO",
  artistName: "Hoàng Hôn",
  yearsExp: "7",
  
  // Thông tin liên hệ
  zalo: "0868660061",
  phone: "0868660061",
  formattedPhone: "086.866.0061",
  email: "hoanghontattoo@gmail.com",
  
  // Địa chỉ tiệm
  address: "ĐH401 Tổ 4, kp mỹ hiệp, phường, Tân Đông Hiệp, Hồ Chí Minh 75416, Việt Nam",
  
  // Google Maps link & embed
  mapUrl: "https://maps.app.goo.gl/9ahAakVNGp5mGhJJ8",
  mapEmbedUrl: "https://maps.google.com/maps?q=Ti%E1%BB%87m+x%C4%83m+Ho%C3%A0ng+H%C3%B4n+Tattoo&t=&z=16&ie=UTF8&iwloc=&output=embed",
  
  // Web App Script Endpoint Google Sheet
  endpoint: "https://script.google.com/macros/s/AKfycbz14UP1-xMcI2Rumbf8JSMkZwnxlM8ppaU47ixgWYTN1dhLzQI-mbOhurq_YzXhURbi/exec"
};
```

---

## 4. HƯỚNG DẪN SỬA NỘI DUNG DỊCH VỤ & BẢNG GIÁ

* **Nội dung Dịch vụ**: Chỉnh sửa tại `dich-vu.html`. Trang gộp 3 khối `Xăm hình nghệ thuật` (`#xam-hinh`), `Xỏ khuyên` (`#xo-khuyen`) và `Vô bi` (`#vo-bi`). Khối Vô bi được thiết kế riêng tư dành cho khách từ 18 tuổi trở lên với hình họa vector trừu tượng chuẩn mực.
* **Bảng giá & Chính sách**: Chỉnh sửa trực tiếp tại `bang-gia.html` trong các thẻ `.price-card`.
* **Form đặt lịch**: Form tại `dat-lich.html` tự động nhận tham số URL `?dichvu=xam-hinh`, `?dichvu=xo-khuyen`, `?dichvu=vo-bi` để ẩn/hiện trường thông tin phù hợp và kích hoạt kiểm tra độ tuổi (18+) cho dịch vụ Vô bi.

---

## 5. HƯỚNG DẪN CHẠY THỬ CỤC BỘ & DƯA LÊN HOSTING

### Chạy thử trên máy tính (Local)
* Mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Chrome, Edge, Safari, Firefox).
* Hoặc sử dụng extension **Live Server** trên VS Code để chạy với địa chỉ local `http://127.0.0.1:5500`.

### Đưa lên Hosting / Server
* Vì đây là mã nguồn tĩnh thuần HTML/CSS/JS, bạn có thể upload toàn bộ thư mục dự án lên bất kỳ web hosting nào (cPanel, DirectAdmin, Vercel, Netlify, GitHub Pages, Cloudflare Pages).
* Trỏ tên miền chính thức của tiệm về hosting là website sẵn sàng hoạt động 24/7.
