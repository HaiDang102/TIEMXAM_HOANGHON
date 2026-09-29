/**
 * DANH SÁCH TÁC PHẨM XĂM (ARTWORKS)
 * -----------------------------------------------------------------------------
 * HƯỚNG DẪN THÊM ẢNH MỚI:
 * 1. Bỏ file ảnh mới vào thư mục tương ứng trong assets/images/<tên-phong-cách>/
 *    Ví dụ: ảnh xăm Blackwork bỏ vào assets/images/blackwork/hinh-xam-moi.jpg
 * 2. Thêm 1 dòng vào danh sách ARTWORKS bên dưới theo cấu trúc:
 *    {
 *      title: "Tên tác phẩm",
 *      category: "Blackwork", // Nhập đúng 1 trong các phong cách: Blackwork, Lettering, Japanese, Minimalist, Realism, Dotwork
 *      details: "Vị trí · Thời gian thực hiện",
 *      image: "assets/images/blackwork/hinh-xam-moi.jpg",
 *      description: "Mô tả ý tưởng hoặc thông điệp của hình xăm."
 *    },
 * -----------------------------------------------------------------------------
 */

const ARTWORKS = [
  {
    id: 1,
    title: "Rắn quấn hoa hồng",
    category: "Blackwork",
    details: "Cẳng tay · 6 giờ",
    image: "assets/images/blackwork/ran-quan-hoa-hong.svg",
    description: "Phong cách Blackwork mảng tối tương phản cao, nét tả thực tỉ mỉ từng cánh hoa và vảy rắn."
  },
  {
    id: 2,
    title: "Chữ ký tay Calligraphy",
    category: "Lettering",
    details: "Cổ tay · 1 giờ",
    image: "assets/images/lettering/chu-ky-tay.svg",
    description: "Nét chữ Calligraphy nghệ thuật uốn lượn tự nhiên theo trục xương cổ tay."
  },
  {
    id: 3,
    title: "Sóng Nhật cổ (Irezumi)",
    category: "Japanese",
    details: "Bắp tay · 2 buổi",
    image: "assets/images/japanese/song-nhat.svg",
    description: "Họa tiết sóng cuộn truyền thống Nhật Bản kết hợp đánh bóng mờ chuyển độ xám mượt mà."
  },
  {
    id: 4,
    title: "Nhành lá tối giản",
    category: "Minimalist",
    details: "Mắt cá · 45 phút",
    image: "assets/images/minimalist/nhanh-la-nho.svg",
    description: "Đường nét Fine-Line siêu mảnh, tạo cảm giác nhẹ nhàng và thanh lịch trên cổ chân."
  },
  {
    id: 5,
    title: "Chân dung tả thực",
    category: "Realism",
    details: "Bắp chân · 8 giờ",
    image: "assets/images/realism/chan-dung.svg",
    description: "Tả thực mảng khối chiều sâu thần thái khuôn mặt với kỹ thuật đánh bóng chuyên sâu."
  },
  {
    id: 6,
    title: "Mandala kỹ thuật chấm",
    category: "Dotwork",
    details: "Lưng · 5 giờ",
    image: "assets/images/dotwork/mandala-cham.svg",
    description: "Họa tiết hình học linh thánh được kiến tạo từ hàng vạn mũi chấm Dotwork chính xác."
  },
  {
    id: 7,
    title: "Trăng khuyết & Chòm sao",
    category: "Minimalist",
    details: "Xương quai xanh · 1 giờ",
    image: "assets/images/minimalist/trang-va-sao.svg",
    description: "Vầng trăng nghệ thuật kết hợp các vì sao mảnh dẻ kiều diễm cho nữ."
  },
  {
    id: 8,
    title: "Rồng cuộn uy nghi",
    category: "Japanese",
    details: "Vai & Ngực · Nhiều buổi",
    image: "assets/images/japanese/rong-cuon.svg",
    description: "Hình tượng rồng Á Đông cuộn sóng bám dọc vai ngực thể hiện bản lĩnh và uy lực."
  }
];
