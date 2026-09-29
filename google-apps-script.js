// =============================================================================
// MÃ NGUỒN GOOGLE APPS SCRIPT (CODE.GS) - HOÀNG HÔN TATTOO (CHUẨN 13 CỘT)
// =============================================================================
// Cấu trúc cột Google Sheet (13 Cột - Đã bỏ Ngày Sinh, giữ Xác nhận 18+):
// A: Thời gian gửi (dd/MM/yyyy HH:mm:ss)
// B: Trạng thái (Chờ xác nhận / Đã xác nhận)
// C: Họ tên
// D: SĐT/Zalo
// E: Email
// F: Dịch vụ
// G: Xác nhận 18+ (Đã xác nhận 18+ / -)
// H: Ngày hẹn (dd/MM/yyyy)
// I: Khung giờ
// J: Phong cách
// K: Vị trí
// L: Ý tưởng / Ghi chú
// M: Sức khỏe
// =============================================================================

var EMAIL_NHAN = 'haidang23102003@gmail.com'; // Email nhận thông báo của Chủ tiệm
var TEN_SHEET  = 'LichHen';                  // Tên tab chứa lịch hẹn trong Google Sheet

// 1. TẠO MENU TỰ ĐỘNG TRÊN GOOGLE SHEETS
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('⚡ Hoàng Hôn Tattoo')
    .addItem('✅ 1. Xác nhận lịch dòng đang chọn (Gửi Mail cho khách)', 'xacNhanLichHenSelected')
    .addItem('💬 2. Mở Zalo nhắn tin cho khách dòng đang chọn', 'moZaloKhachSelected')
    .addToUi();
}

// 2. XỬ LÝ NHẬN DỮ LIỆU ĐẶT LỊCH TỪ WEBSITE (POST)
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return responseJSON_({ status: 'error' });
    var d = JSON.parse(e.postData.contents);
    if (d.website) return responseJSON_({ status: 'success' }); // Chống spam

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(TEN_SHEET) || ss.insertSheet(TEN_SHEET);

    // Tạo dòng Tiêu đề chuẩn 13 Cột
    if (sh.getLastRow() === 0) {
      var headers = [
        'Thời gian gửi', 'Trạng thái', 'Họ tên', 'SĐT/Zalo', 'Email',
        'Dịch vụ', 'Xác nhận 18+', 'Ngày hẹn', 'Khung giờ', 'Phong cách', 
        'Vị trí', 'Ý tưởng / Ghi chú', 'Sức khỏe'
      ];
      sh.appendRow(headers);
      
      var headerRange = sh.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold')
                 .setBackground('#1A1A1A')
                 .setFontColor('#FFFFFF')
                 .setHeight(32);
      sh.setFrozenRows(1);
    }

    // Thời gian gửi chuẩn dd/MM/yyyy HH:mm:ss theo GMT+7
    var timeStamp = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");

    var name    = d.name || '-';
    var phone   = d.phone ? "'" + d.phone : '-'; // Thêm dấu ' để giữ nguyên số 0 đầu SĐT
    var rawPhone= d.phone || '-';
    var email   = d.email || '-';
    var type    = d.type || '-';
    var age18   = (d.chkAge18 || d.type === 'Vô bi' || d.type === 'Xỏ khuyên') ? 'Đã xác nhận 18+' : '-';
    var date    = formatDateVN_(d.date) || '-'; // Định dạng dd/MM/yyyy
    var time    = d.time || '-';
    var style   = d.style || '-';
    var place   = d.place || '-';
    var idea    = d.idea || '-';
    var health  = d.health || '-';

    // Thêm dòng dữ liệu chuẩn vào Google Sheet (13 Cột)
    sh.appendRow([
      timeStamp, 'Chờ xác nhận', name, phone, email,
      type, age18, date, time, style, place, idea, health
    ]);

    // Tô màu ô "Chờ xác nhận" màu vàng nhạt
    var lastRow = sh.getLastRow();
    sh.getRange(lastRow, 2).setBackground('#FFF3CD').setFontColor('#856404').setFontWeight('bold');

    try { sh.autoResizeColumns(1, 13); } catch (errRes) {}

    // GỬI EMAIL THÔNG BÁO CHO CHỦ TIỆM
    var subject = '[LỊCH HẸN MỚI] ' + name + ' - ' + type + ' (' + date + ')';
    
    var plainBody =
      '===== LỊCH HẸN MỚI - HOÀNG HÔN TATTOO =====\n\n' +
      '• Họ tên: ' + name + '\n' +
      '• SĐT/Zalo: ' + rawPhone + '\n' +
      '• Email: ' + email + '\n' +
      '• Dịch vụ: ' + type + '\n' +
      '• Xác nhận 18+: ' + age18 + '\n' +
      '• Ngày hẹn: ' + date + ' (' + time + ')\n' +
      '• Phong cách: ' + style + '\n' +
      '• Vị trí: ' + place + '\n' +
      '• Ý tưởng / Ghi chú: ' + idea + '\n' +
      '• Lưu ý sức khỏe: ' + health + '\n\n' +
      '-----------------------------------\n' +
      'Mở Google Sheets để xem và xác nhận: ' + ss.getUrl();

    var htmlBody =
      '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">' +
        '<div style="background-color: #111111; color: #f5e2b5; padding: 20px; text-align: center;">' +
          '<h2 style="margin: 0; text-transform: uppercase;">Hoàng Hôn Tattoo</h2>' +
          '<p style="margin: 5px 0 0 0; font-size: 13px; color: #ffc107; font-weight:bold;">⚡ CÓ LỊCH HẸN MỚI - CHỜ XÁC NHẬN</p>' +
        '</div>' +
        '<div style="padding: 24px; color: #333; line-height: 1.6;">' +
          '<table style="width: 100%; border-collapse: collapse;">' +
            '<tr><td style="padding: 6px 0; font-weight: bold; width: 140px; color: #555;">Họ tên:</td><td style="font-weight: bold; color: #000;">' + name + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold; color: #555;">SĐT / Zalo:</td><td style="color: #d9534f; font-weight: bold;"><a href="https://zalo.me/' + rawPhone + '" target="_blank" style="color:#d9534f;">' + rawPhone + ' (Nhấn Zalo)</a></td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Email:</td><td>' + email + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Dịch vụ:</td><td><b style="color:#d9534f;">' + type + '</b> (' + age18 + ')</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Ngày hẹn:</td><td style="font-weight: bold; color:#27ae60;">' + date + ' (' + time + ')</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Phong cách:</td><td>' + style + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Vị trí:</td><td>' + place + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Ý tưởng / Mô tả:</td><td style="background-color: #f9f9f9; padding: 8px; border-radius: 4px;">' + idea + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Lưu ý sức khỏe:</td><td style="color: #c0392b;">' + health + '</td></tr>' +
          '</table>' +
          '<div style="margin-top: 24px; text-align: center;">' +
            '<a href="' + ss.getUrl() + '" style="background-color: #111111; color: #f5e2b5; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Mở Google Sheet Để Xác Nhận Lịch</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    if (EMAIL_NHAN) {
      MailApp.sendEmail({ to: EMAIL_NHAN, subject: subject, body: plainBody, htmlBody: htmlBody });
    }

    return responseJSON_({ status: 'success', message: 'Đặt lịch thành công' });

  } catch (err) {
    return responseJSON_({ status: 'error', message: err.toString() });
  }
}

// 3. TỰ ĐỘNG GỬI MAIL CHO KHÁCH KHI SỬA CỘT B THÀNH "ĐÃ XÁC NHẬN"
function onEdit(e) {
  try {
    var range = e.range;
    var sh = range.getSheet();
    if (sh.getName() !== TEN_SHEET || range.getColumn() !== 2 || range.getRow() <= 1) return;

    var val = range.getValue().toString().trim();
    if (val === 'Đã xác nhận') {
      range.setBackground('#D4EDDA').setFontColor('#155724').setFontWeight('bold');
      var rowData = sh.getRange(range.getRow(), 1, 1, 13).getValues()[0];
      var name  = rowData[2];
      var phone = rowData[3].toString().replace("'", "");
      var email = rowData[4];
      var type  = rowData[5];
      var date  = rowData[7]; // Cột H: Ngày hẹn
      var time  = rowData[8]; // Cột I: Khung giờ
      var place = rowData[10];// Cột K: Vị trí
      var idea  = rowData[11];// Cột L: Ý tưởng

      if (email && email !== '-' && email.indexOf('@') !== -1) {
        guiEmailXacNhanChoKhach_(email, name, type, date, time, place, idea);
      }
    }
  } catch (err) {}
}

// 4. HÀM XÁC NHẬN QUA MENU "⚡ HOÀNG HÔN TATTOO"
function xacNhanLichHenSelected() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(TEN_SHEET);
  if (!sh) return;
  var row = sh.getActiveCell().getRow();
  if (row <= 1) return SpreadsheetApp.getUi().alert('⚠️ Vui lòng nhấp chọn 1 dòng lịch hẹn!');

  var rowData = sh.getRange(row, 1, 1, 13).getValues()[0];
  var name  = rowData[2];
  var phone = rowData[3].toString().replace("'", "");
  var email = rowData[4];
  var type  = rowData[5];
  var date  = rowData[7]; // Cột H
  var time  = rowData[8]; // Cột I
  var place = rowData[10];// Cột K
  var idea  = rowData[11];// Cột L

  sh.getRange(row, 2).setValue('Đã xác nhận').setBackground('#D4EDDA').setFontColor('#155724').setFontWeight('bold');

  if (email && email !== '-' && email.indexOf('@') !== -1) {
    guiEmailXacNhanChoKhach_(email, name, type, date, time, place, idea);
    SpreadsheetApp.getUi().alert('✅ Đã xác nhận & GỬI EMAIL XÁC NHẬN cho khách ' + name + ' (' + email + ')!');
  } else {
    SpreadsheetApp.getUi().alert('✅ Đã xác nhận cho khách ' + name + '!\n(Khách không điền Email. Bấm menu 2 để nhắn Zalo số ' + phone + ')');
  }
}

// Mở Zalo nhắn tin cho khách dòng đang chọn
function moZaloKhachSelected() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(TEN_SHEET);
  if (!sh) return;
  var row = sh.getActiveCell().getRow();
  if (row <= 1) return SpreadsheetApp.getUi().alert('⚠️ Vui lòng nhấp chọn 1 dòng lịch hẹn!');

  var rowData = sh.getRange(row, 1, 1, 13).getValues()[0];
  var name  = rowData[2];
  var phone = rowData[3].toString().replace("'", "").trim();
  if (!phone || phone === '-') return SpreadsheetApp.getUi().alert('❌ Không có số điện thoại.');

  var htmlOutput = HtmlService.createHtmlOutput('<script>window.open("https://zalo.me/' + phone + '", "_blank");google.script.host.close();</script>').setWidth(300).setHeight(100);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Đang mở Zalo của ' + name + '...');
}

// Gửi Email Xác Nhận Cho Khách hàng
function guiEmailXacNhanChoKhach_(email, name, type, date, time, place, idea) {
  var subject = '[Hoàng Hôn Tattoo] ✔ DỰ XÁC NHẬN LỊCH HẸN: ' + type + ' (' + date + ')';
  var htmlContent = 
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">' +
      '<div style="background-color: #111; color: #f5e2b5; padding: 20px; text-align: center;">' +
        '<h2 style="margin: 0; text-transform: uppercase;">Hoàng Hôn Tattoo</h2>' +
        '<p style="margin: 5px 0 0 0; color: #2ecc71; font-weight: bold;">✔ THÔNG BÁO XÁC NHẬN LỊCH HẸN</p>' +
      '</div>' +
      '<div style="padding: 24px; color: #333; line-height: 1.6;">' +
        '<p>Chào <b>' + name + '</b>,</p>' +
        '<p>Tiệm xăm <b>Hoàng Hôn Tattoo</b> xin thông báo lịch hẹn tư vấn/thực hiện của bạn đã được <b>XÁC NHẬN THÀNH CÔNG</b>!</p>' +
        '<div style="background-color: #f8f9fa; border-left: 4px solid #2ecc71; padding: 16px; margin: 18px 0;">' +
          '• <b>Dịch vụ:</b> ' + type + '<br>' +
          '• <b>Thời gian hẹn:</b> ' + date + ' (' + time + ')<br>' +
          '• <b>Vị trí:</b> ' + (place || '-') + '<br>' +
          '• <b>Ý tưởng:</b> ' + (idea || '-') + '' +
        '</div>' +
        '<p>📍 <b>Địa chỉ:</b> ĐH401 Tổ 4, KP. Mỹ Hiệp, P. Tân Đông Hiệp, Dĩ An, Bình Dương.</p>' +
        '<p>📞 <b>Hotline/Zalo:</b> 086.866.0061 (Hoàng Hôn)</p>' +
        '<p>Hẹn gặp bạn đúng giờ tại tiệm nhé!</p>' +
      '</div>' +
    '</div>';

  MailApp.sendEmail({ to: email, subject: subject, htmlBody: htmlContent });
}

function doGet(e) { return responseJSON_({ status: 'success' }); }
function responseJSON_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }

// Hàm quy đổi YYYY-MM-DD -> DD/MM/YYYY
function formatDateVN_(dateStr) {
  if (!dateStr) return '-';
  var parts = dateStr.split('-');
  return parts.length === 3 ? parts[2] + '/' + parts[1] + '/' + parts[0] : dateStr;
}
