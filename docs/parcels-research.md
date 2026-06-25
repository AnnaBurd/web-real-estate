# Hồ sơ nghiên cứu nội dung lô đất (verified facts)

> Tài liệu nền cho phần nội dung `province / urgency / pricePerSqm / infrastructure / thesis / risks / legalNotes`
> của 8 lô đất trong `src/content/parcels/`. Mọi số liệu đều kèm nguồn để chủ đất/biên tập **tự kiểm chứng
> trước khi công bố**. Các phát biểu về pháp lý là **thông tin chung theo luật**, không phải khẳng định riêng
> về tình trạng sổ của từng lô (phần đó do chủ đất xác nhận và cung cấp qua Zalo).
>
> Cập nhật: 2026-06 · "current date" của dự án.

---

## 1. Sáp nhập đơn vị hành chính cấp tỉnh (hiệu lực 01/7/2025)

Theo Nghị quyết 60 (Quốc hội thông qua 12/6/2025), cả nước còn **34 tỉnh/thành**. Các tỉnh liên quan đến danh mục lô đất:

| Địa danh trên lô | Tỉnh/thành cũ | **Tỉnh/thành mới (sau 01/7/2025)** | Giá trị `province` dùng trong file |
|---|---|---|---|
| Hòa Long, Suối Rao, Long Tân, Bình Trung (Châu Đức) | Bà Rịa – Vũng Tàu | **TP.HCM** (hợp nhất TP.HCM + Bình Dương + BR–VT) | `TP.HCM (Bà Rịa – Vũng Tàu cũ)` |
| Di Linh | Lâm Đồng | **Lâm Đồng** (hợp nhất Lâm Đồng + Bình Thuận + Đắk Nông) | `Lâm Đồng` |
| Sông Phan | Bình Thuận | **Lâm Đồng** | `Lâm Đồng (Bình Thuận cũ)` |
| Sông Cầu (vịnh Xuân Đài) | Phú Yên | **Đắk Lắk** (hợp nhất Đắk Lắk + Phú Yên) | `Đắk Lắk (Phú Yên cũ)` |

> ⚠️ Lưu ý quan trọng: lô "Phú Yên 58 ha" — sau sáp nhập, Sông Cầu thuộc **tỉnh Đắk Lắk**, không còn là tỉnh Phú Yên.
> Tên "Phú Yên/Sông Cầu" vẫn dùng làm địa danh nhận diện, nhưng `province` để đúng là Đắk Lắk (Phú Yên cũ).

Nguồn: [Nghị quyết 60 – hợp nhất TP.HCM/BR-VT/Bình Dương (thuvienphapluat)](https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/chinh-sach-moi/82492/nghi-quyet-60-thong-tin-sap-nhap-tinh-ve-hop-nhat-tphcm-ba-ria-vung-tau-va-binh-duong) · [34 ĐVHC cấp tỉnh (Cổng TTĐT Chính phủ)](https://xaydungchinhsach.chinhphu.vn/chi-tiet-34-don-vi-hanh-chinh-cap-tinh-tu-12-6-2025-119250612141845533.htm) · [Hợp nhất Lâm Đồng–Bình Thuận–Đắk Nông (Lao Động)](https://laodong.vn/thoi-su/sap-nhap-3-tinh-lam-dong-dak-nong-binh-thuan-thanh-tinh-moi-dan-dat-ca-vung-1520818.ldo) · [Sông Cầu thuộc tỉnh Đắk Lắk mới (thuvienphapluat)](https://thuvienphapluat.vn/phap-luat/5-phuong-xa-moi-cua-thi-xa-song-cau-cu-thuoc-tinh-dak-lak-gom-nhung-phuong-xa-nao-sau-sap-xep-585316-225581.html)

---

## 2. Hạ tầng trọng điểm

### Cao tốc Biên Hòa – Vũng Tàu (ảnh hưởng các lô BR–VT / Châu Đức)
- Dài 53,7 km (Đồng Nai 34,2 km; BR–VT 19,5 km), thiết kế 100 km/h, tổng vốn ~18.000 tỷ.
- Thông xe kỹ thuật đoạn BR–VT (19,8 km) ngày 19/4/2025; toàn tuyến đưa vào khai thác 2026.
- Rút ngắn TP.HCM – Vũng Tàu còn **~70 phút** (trước đây ~150 phút).
- Nguồn: [NLĐ](https://nld.com.vn/cao-toc-bien-hoa-vung-tau-chinh-thuc-khai-thac-vao-thang-12-2025-196250812094640387.htm) · [VnExpress](https://vnexpress.net/thong-xe-toan-tuyen-cao-toc-bien-hoa-vung-tau-truoc-ngay-18-5-5071092.html)

### Sân bay quốc tế Long Thành
- **Dự kiến khai thác thương mại cuối năm 2026 (Q4/2026)** — đây là mốc chính thức mới nhất (Thủ tướng chỉ đạo hoàn thành xây dựng Q3/2026, khai thác Q4/2026). Chuyến bay thương mại đầu tiên hạ cánh tượng trưng 19/12/2025; chuyển các chuyến quốc tế từ Tân Sơn Nhất bắt đầu 01/12/2026.
- ⚠️ **Đính chính**: nội dung cũ ghi "khai thác 6/2026". Đã sửa thành "cuối năm 2026" cho khớp mốc mới nhất.
- Nguồn: [VnExpress](https://vnexpress.net/thu-tuong-san-bay-long-thanh-khai-thac-thuong-mai-cuoi-nam-2026-5056192.html) · [Báo Chính phủ](https://baochinhphu.vn/quyet-tam-dua-cang-hang-khong-quoc-te-long-thanh-giai-doan-1-vao-khai-thac-trong-nam-2026-102260421162430314.htm) · [CafeF (mốc 6/2026 đã cũ)](https://cafef.vn/san-bay-long-thanh-du-kien-khai-thac-6-2026-ha-tang-co-ket-noi-dong-bo-188260303134356375.chn)

### KCN – Đô thị – Sân golf Châu Đức (Sonadezi)
- Quy mô ~2.287 ha (1.556 ha công nghiệp, 579 ha đô thị – dịch vụ, 152 ha sân golf 36 lỗ), bám trục **Quốc lộ 56**. Một trong những KCN lớn/hiện đại nhất phía Nam → tạo cầu nhà ở/dịch vụ cho vùng Châu Đức.
- Nguồn: [BQL KCN BR–VT](https://bqlkcn.baria-vungtau.gov.vn/cac-khu-cong-nghiep/khu-cong-nghiep-chau-duc/)

### Cao tốc Dầu Giây – Liên Khương (Đà Lạt) — lô Di Linh
- 4 đoạn khởi công 2025, hoàn thành **dự kiến 2027**: Dầu Giây–Tân Phú (19/8/2025), Tân Phú–Bảo Lộc (19/12/2025), Bảo Lộc–Liên Khương (29/6/2025).
- Đoạn **Bảo Lộc–Liên Khương chạy song song QL20 và đi qua huyện Di Linh**; khi hoàn thiện, TP.HCM tới ranh Di Linh còn **~2,5 giờ**.
- Di Linh được định vị là điểm đầu tư mới chu kỳ 2025–2030 (quỹ đất nông nghiệp lớn, giá thấp hơn Bảo Lộc/Đà Lạt — Bảo Lộc trung tâm ~6–12 triệu/m²).
- Nguồn: [Lao Động – Lâm Đồng khởi công 2 cao tốc](https://laodong.vn/xa-hoi/lam-dong-chot-thoi-gian-khoi-cong-2-cao-toc-1459585.ldo) · [Cổng TTĐT Lâm Đồng](https://lamdong.gov.vn/sites/ductrong/tintucsukien/SitePages/Cao-toc-Dau-Giay---Lien-Khuong-Tao-dot-pha-phat-trien-kinh-te---xa-hoi-tinh-Lam-Dong-trong-tuong-lai.aspx)

### Cao tốc Phan Thiết – Dầu Giây + nút giao Sông Phan — lô Sông Phan
- Dài 99 km (Bình Thuận 47,5 km; Đồng Nai 51,5 km), khai thác **29/4/2023**.
- **Nút giao Sông Phan** giao **Quốc lộ 55** tại xã Sông Phan, Hàm Tân — một trong các nút giao chính, là cửa ngõ ra/vào cao tốc của khu vực.
- TP.HCM → Phan Thiết nay còn **~2–2,5 giờ** (trước ~4–5 giờ qua QL1).
- ⚠️ **Đính chính**: nội dung cũ ghi "~1 giờ 40 phút (về Phan Thiết)" — chưa chính xác; sửa thành "~2–2,5 giờ".
- Nguồn: [NLĐ – HCM–Phan Thiết 2,5 giờ](https://nld.com.vn/thoi-su/tu-tp-hcm-di-tp-phan-thiet-chi-mat-25-gio-nho-tuyen-cao-toc-99-km-20230429105058167.htm) · [Wikipedia – cao tốc Phan Thiết–Dầu Giây](https://vi.wikipedia.org/wiki/%C4%90%C6%B0%E1%BB%9Dng_cao_t%E1%BB%91c_Phan_Thi%E1%BA%BFt_%E2%80%93_D%E1%BA%A7u_Gi%C3%A2y)

### Vịnh Xuân Đài / Sông Cầu — lô Phú Yên 58 ha
- Vịnh Xuân Đài: **Khu du lịch quốc gia** (quy hoạch tổng thể đến 2030), ~13.000 ha mặt nước, bờ vịnh >50 km, thuộc Sông Cầu + Tuy An. Định hướng resort 4–5 sao tại Nam Từ Nham, bãi Ôm, bãi Bàng.
- Gần QL1; sân bay Tuy Hòa (đề xuất nâng cấp, mở thêm đường bay); cao tốc Bắc–Nam và đường sắt tốc độ cao Bắc–Nam quy hoạch đi qua Phú Yên.
- Nguồn: [Quy hoạch KDL quốc gia vịnh Xuân Đài (Bộ VHTTDL)](https://bvhttdl.gov.vn/quy-hoach-tong-the-phat-trien-khu-du-lich-quoc-gia-vinh-xuan-dai-tinh-phu-yen-den-nam-2030-620238.htm) · [Quy hoạch tỉnh Phú Yên (Cổng TTĐT Chính phủ)](https://xaydungchinhsach.chinhphu.vn/quy-hoach-tinh-phu-yen-cac-du-an-giao-thong-do-thi-cong-nghiep-uu-tien-thuc-hien-119240107125331014.htm)

---

## 3. Pháp lý đất đai (Luật Đất đai 2024, hiệu lực 01/8/2024) — nền cho `risks` / `legalNotes`

- **Chuyển mục đích sử dụng đất** (nông nghiệp → đất ở/thổ cư): căn cứ là **quy hoạch sử dụng đất** đã được duyệt (Điều 116), phải được cơ quan nhà nước có thẩm quyền cho phép và **nộp tiền sử dụng đất** (chênh lệch giá đất) — chi phí có thể lớn.
- **Tách thửa / phân lô**: phải đáp ứng **diện tích tối thiểu** và điều kiện do **UBND cấp tỉnh** quy định + phù hợp quy hoạch. Lâm Đồng từng siết tách thửa/phân lô đất nông nghiệp.
- **Thuế & phí khi sang tên**: lệ phí trước bạ **0,5%** (thường bên mua nộp); thuế TNCN **2%** giá trị chuyển nhượng (thường bên bán nộp). Cả hai có thể thỏa thuận lại trong hợp đồng.
- **Đất đồng sở hữu / sổ chung** (lô "Đồng sở hữu Hòa Long"): mọi chuyển nhượng/thế chấp cần **đồng thuận của tất cả đồng sở hữu**; ngân hàng thường không nhận sổ chung làm tài sản thế chấp; thanh khoản thấp hơn sổ riêng; giao dịch phải **công chứng/chứng thực** mới có hiệu lực. Cần xác minh rõ là sổ riêng từng thửa hay sổ chung.
- Nguồn: [Điều kiện chuyển NN→thổ cư (thuvienphapluat)](https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/ho-tro-phap-luat/bat-dong-san/72889/dieu-kien-chuyen-dat-nong-nghiep-sang-dat-tho-cu-tu-01-8-2024) · [Trình tự chuyển mục đích (Cổng TTĐT Chính phủ)](https://xaydungchinhsach.chinhphu.vn/luat-dat-dai-2024-trinh-tu-thu-tuc-cho-phep-chuyen-muc-dich-su-dung-dat-119240229152515189.htm) · [Thuế/phí sang tên (LuatVietnam)](https://luatvietnam.vn/thue-phi-le-phi/phi-sang-ten-truoc-ba-nha-dat-565-25438-article.html) · [Rủi ro đất sổ chung (LuatVietnam)](https://luatvietnam.vn/dat-dai-nha-o/rui-ro-khi-mua-chung-dat-567-89762-article.html)

---

## 4. `pricePerSqm` — suất đầu tư/m² (tính từ giá ÷ diện tích, làm tròn)

| Lô | Giá | Diện tích | đ/m² | Hiển thị |
|---|---|---|---|---|
| 3,3 Sào Hòa Long | 8 tỷ | 3.362 m² | 2.379.536 | `≈ 2,4 triệu đ/m²` |
| Vườn Bưởi Suối Rao | 25 tỷ | 27.000 m² | 925.926 | `≈ 925 nghìn đ/m²` |
| Long Tân 3,5 ha | 35 tỷ | 35.000 m² | 1.000.000 | `≈ 1 triệu đ/m²` |
| Bình Trung 1,5 ha | 12 tỷ | 15.000 m² | 800.000 | `≈ 800 nghìn đ/m²` |
| Phú Yên 58 ha | 9,5 tỷ | 580.000 m² | 16.379 | `≈ 16 nghìn đ/m²` |
| Di Linh 5 sào | 12 tỷ | 5.000 m² | 2.400.000 | `≈ 2,4 triệu đ/m²` |
| Sông Phan 2,9 ha | 22 tỷ | 29.000 m² | 758.621 | `≈ 760 nghìn đ/m²` |
| Đồng sở hữu Hòa Long | 600 triệu | 200 m² | 3.000.000 | `≈ 3 triệu đ/m²` |
