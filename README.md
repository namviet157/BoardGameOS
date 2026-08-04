<div align="center">
  <img src="public/favicon.ico" alt="BoardGameOS logo" width="80" height="80" />
  <h1>BoardGameOS</h1>
  <p><strong>Nền tảng quản lý vận hành dành cho quán board game cafe</strong></p>
  <p>
    Quản lý kho game, linh kiện, bàn chơi, giao nhận, nhân viên và báo cáo<br />
    trong một giao diện thống nhất, tích hợp trợ lý vận hành Gemini.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Status-MVP-D97745?style=flat-square" alt="Project status: MVP" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=20232A" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5.8" />
    <img src="https://img.shields.io/badge/AI-Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white" alt="Google Gemini" />
    <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
  </p>
</div>

---

BoardGameOS là website demo MVP phục vụ Đồ án môn Khởi nghiệp. Hệ thống mô phỏng quy trình vận hành của một quán board game cafe và hỗ trợ hỏi đáp dữ liệu bằng chatbot AI.

Dữ liệu nghiệp vụ được lưu trên trình duyệt bằng `localStorage`. Project chưa sử dụng database hoặc hệ thống xác thực backend thật; TanStack Start server function được dùng để bảo vệ Gemini API key.

<a id="muc-luc"></a>

## 📑 Mục lục

- [✨ Tính năng chính](#tinh-nang-chinh)
- [🧰 Công nghệ sử dụng](#cong-nghe-su-dung)
- [🛠️ Yêu cầu môi trường](#yeu-cau-moi-truong)
- [📦 Cài đặt project](#cai-dat-project)
- [🤖 Cấu hình Gemini](#cau-hinh-gemini)
- [▶️ Chạy thử ở local](#chay-thu-local)
- [👥 Tài khoản demo](#tai-khoan-demo)
- [🔐 Phân quyền giao diện](#phan-quyen-giao-dien)
- [📖 Hướng dẫn sử dụng](#huong-dan-su-dung)
- [📁 Cấu trúc thư mục](#cau-truc-thu-muc)
- [🧭 Các route chính](#cac-route-chinh)

<a id="tinh-nang-chinh"></a>

## ✨ Tính năng chính

- Dashboard tổng quan game, bàn chơi, sự cố, cảnh báo cần xử lý và hoạt động gần đây.
- Kho game: tìm kiếm, lọc, thêm game, xem chi tiết, ảnh bìa trực quan, cập nhật trạng thái, tạo và tải mã QR thật.
- Khai báo và chỉnh sửa danh sách linh kiện chuẩn; kiểm tra trạng thái đầy đủ, thiếu hoặc hư hỏng khi nhận lại game.
- Quản lý bàn: trạng thái, số khách, game đang chơi, nhân viên phụ trách và thời gian phiên.
- Quy trình giao game, nhận lại game và chuyển game sang bảo trì.
- Bộ lọc tư vấn game theo số người, thời lượng, thể loại, độ tuổi, độ khó, kiểu chơi và mức tương tác.
- Tìm kiếm toàn hệ thống theo game, bàn và nhân viên; hỗ trợ tìm tiếng Việt không dấu.
- Chatbot Gemini hỏi đáp toàn bộ snapshot dữ liệu BoardGameOS, hướng dẫn luật cơ bản của 12 game mẫu và gợi ý game đang sẵn sàng.
- Quản lý nhân viên, vai trò, quyền hiển thị và khóa/mở khóa tài khoản.
- Báo cáo hoạt động theo 7, 14 hoặc 30 ngày bằng Recharts.
- Cài đặt thông tin quán, công tắc mô phỏng tính năng tương lai và khôi phục dữ liệu mẫu.
- Giao diện responsive cho desktop, tablet và mobile.

<a id="cong-nghe-su-dung"></a>

## 🧰 Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
| --- | --- | --- |
| ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) | 19 | Xây dựng giao diện component |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | 5.8 | Kiểm tra kiểu dữ liệu và giảm lỗi khi phát triển |
| ![TanStack](https://img.shields.io/badge/TanStack_Start-FF4154?style=flat-square&logo=reactquery&logoColor=white) | 1.168 | Framework ứng dụng và server function cho Gemini |
| ![TanStack Router](https://img.shields.io/badge/TanStack_Router-FF4154?style=flat-square&logo=reactquery&logoColor=white) | 1.170 | File-based routing và điều hướng không tải lại trang |
| ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white) | 5.101 | Hạ tầng dữ liệu bất đồng bộ, sẵn sàng cho API về sau |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | 8 | Development server và build production |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | 4 | Theme và thiết kế responsive |
| ![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat-square&logo=radixui&logoColor=white) | 1.x | Hành vi và accessibility cho UI component |
| ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white) | Source-based | Các component giao diện dùng chung |
| ![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white) | GenAI SDK 2.15 | Chatbot hỏi đáp dữ liệu vận hành |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) | 3.24 | Kiểm tra JSON do Gemini trả về |
| ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square&logo=chartdotjs&logoColor=white) | 2.15 | Biểu đồ báo cáo 7, 14 và 30 ngày |
| ![Lucide](https://img.shields.io/badge/Lucide-111827?style=flat-square&logo=lucide&logoColor=F56565) | 0.575 | Icon trong giao diện |
| ![Sonner](https://img.shields.io/badge/Sonner-111827?style=flat-square) | 2.0 | Toast phản hồi sau thao tác |
| QRCode React | 4.2 | Tạo mã QR game trên frontend |
| ![Web Storage](https://img.shields.io/badge/localStorage-E34F26?style=flat-square&logo=html5&logoColor=white) | Browser API | Lưu dữ liệu và session demo trên trình duyệt |

<a id="yeu-cau-moi-truong"></a>

## 🛠️ Yêu cầu môi trường

- Git.
- Node.js `20.19.0` trở lên hoặc `22.12.0` trở lên; khuyến nghị dùng Node.js 22 LTS.
- npm 10 trở lên.
- Gemini API key nếu cần chạy chatbot AI. Các chức năng còn lại vẫn dùng được khi chưa cấu hình key.

Kiểm tra phiên bản đã cài:

```bash
node --version
npm --version
git --version
```

<a id="cai-dat-project"></a>

## 📦 Cài đặt project

### 1. Tải source code

```bash
git clone <repository-url>
cd BoardGameOS
```

Nếu đã có source code trên máy, chỉ cần mở terminal tại thư mục chứa `package.json`.

### 2. Cài dependency

```bash
npm install
```

Project có cả `package-lock.json` và `bun.lock`, nhưng tài liệu này sử dụng npm để thống nhất cách chạy.

<a id="cau-hinh-gemini"></a>

## 🤖 Cấu hình Gemini

Chatbot gọi Gemini thông qua TanStack Start server function. API key chỉ được đọc ở phía server và không được đưa trực tiếp vào source frontend.

### 1. Tạo file môi trường local

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Command Prompt hoặc Git Bash:

```bash
cp .env.example .env.local
```

Nếu lệnh sao chép không phù hợp với hệ điều hành, có thể tự tạo file `.env.local` tại thư mục gốc project.

### 2. Khai báo biến môi trường

```env
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-3.6-flash
VITE_PUBLIC_APP_URL=https://board-game-os.vercel.app
```

- `GEMINI_API_KEY`: API key lấy từ Google AI Studio.
- `GEMINI_MODEL`: model Gemini muốn sử dụng. Nếu bỏ trống, code mặc định dùng `gemini-3.6-flash`.
- `VITE_PUBLIC_APP_URL`: URL công khai dùng trong mã QR game. Có thể bỏ trống để dùng domain đang mở; biến này không phải secret.
- Nếu model trên không khả dụng với tài khoản Google hiện tại, thay bằng model được Google AI Studio cung cấp cho API key đó.

<a id="chay-thu-local"></a>

## ▶️ Chạy thử ở local

Khởi động development server:

```bash
npm run dev
```

Mở URL được in trong terminal:

```text
http://localhost:8080/
```

<a id="tai-khoan-demo"></a>

## 👥 Tài khoản demo

| Vai trò | Email | Mật khẩu demo |
| --- | --- | --- |
| Chủ quán | `owner@boardgameos.vn` | `demo1234` |
| Nhân viên | `staff@boardgameos.vn` | `demo1234` |

Đăng nhập hiện là mô phỏng phục vụ MVP. Tài khoản chưa được xác thực bằng backend thật.

<a id="phan-quyen-giao-dien"></a>

## 🔐 Phân quyền giao diện

### Chủ quán

Chủ quán truy cập được toàn bộ chức năng:

- Tổng quan.
- Kho game.
- Bàn chơi.
- Giao nhận game.
- Kiểm tra linh kiện.
- Tư vấn game.
- Nhân viên.
- Báo cáo.
- Cài đặt.
- Chatbot AI.

### Nhân viên

Nhân viên sử dụng các chức năng vận hành:

- Tổng quan.
- Kho game.
- Bàn chơi.
- Giao nhận game.
- Kiểm tra linh kiện.
- Tư vấn game.
- Chatbot AI.

<a id="huong-dan-su-dung"></a>

## 📖 Hướng dẫn sử dụng

### 1. Đăng nhập và xem tổng quan

1. Mở `/login`.
2. Chọn tài khoản Chủ quán hoặc Nhân viên.
3. Bấm **Đăng nhập**.
4. Dashboard hiển thị tổng số game, bàn đang hoạt động, game chờ kiểm tra, sự cố, cảnh báo cần xử lý và hoạt động gần đây.

### 2. Tìm kiếm toàn hệ thống

1. Bấm thanh tìm kiếm trên header hoặc biểu tượng tìm kiếm trên mobile.
2. Nhập tên/mã game, tên bàn, trạng thái, tên/email/vai trò nhân viên.
3. Có thể nhập tiếng Việt có dấu hoặc không dấu.
4. Chọn kết quả để chuyển đến màn hình tương ứng.

### 3. Quản lý kho game

1. Mở **Kho game**.
2. Tìm kiếm hoặc lọc theo thể loại, trạng thái và số người chơi.
3. Bấm **Thêm game mới** để tạo game, chọn ảnh bìa và khai báo checklist linh kiện nếu đã có.
4. Nếu bỏ trống checklist, xác nhận lưu và bổ sung sau tại trang chi tiết game.
5. Bấm **Chi tiết** để tạo/chỉnh sửa danh sách linh kiện chuẩn, xem lịch sử, sự cố, ghi chú hoặc thay/xóa ảnh bìa.
6. Dùng nút bảo trì để chuyển game sang bảo trì sau khi xác nhận.

Mười hai game mẫu có ảnh bìa WebP cục bộ để bản demo không phụ thuộc mạng. Ảnh người dùng tải lên được ưu tiên, tiếp tục lưu trong `localStorage`; nguồn ảnh mẫu được ghi tại [`doc/game_cover_sources.md`](doc/game_cover_sources.md).

### 4. Quản lý bàn và phiên chơi

1. Mở **Bàn chơi**.
2. Chọn trạng thái bàn hoặc gán một game đang có sẵn.
3. Với bàn trống, bấm **Gán game cho bàn --> Tạo phiên chơi**.
4. Với bàn đang hoạt động, bấm **Kết thúc phiên** và xác nhận.
5. Có thể đánh dấu bàn **Cần hỗ trợ** để phản ánh tình huống vận hành.

Thời gian bắt đầu phiên được lưu theo UTC ISO và hiển thị dưới dạng số phút đã trôi qua.

### 5. Giao và nhận game

Tab **Giao game**:

1. Chọn hoặc quét QR game đang có sẵn.
2. Chọn bàn.
3. Chọn nhân viên giao.
4. Bấm **Xác nhận giao game**.

Tab **Nhận lại game**:

1. Chọn game cần nhận lại.
2. Chọn trạng thái **Đầy đủ**, **Thiếu** hoặc **Hư hỏng** cho từng linh kiện.
3. Nhập chính xác số lượng thiếu hoặc mô tả tình trạng hư hỏng.
4. Hoàn tất nhận game hoặc chuyển sang xử lý sự cố/bảo trì.

Mỗi game có mã QR thật dẫn đến trang chi tiết và có thể tải xuống dạng PNG. QR scanner trong ứng dụng vẫn mô phỏng bằng cách chọn game trong dialog để buổi demo không phụ thuộc camera.

QR tạo ở localhost sẽ chứa URL localhost và điện thoại khác không truy cập được. Để quét bằng điện thoại, sử dụng bản Vercel hoặc cấu hình `VITE_PUBLIC_APP_URL` thành một địa chỉ có thể truy cập trong mạng nội bộ.

### 6. Kiểm tra linh kiện

Danh sách linh kiện chuẩn được cấu hình khi thêm game hoặc tại trang chi tiết. Trang kiểm tra linh kiện chỉ dùng để đối chiếu tình trạng thực tế.

1. Mở **Kiểm tra linh kiện**.
2. Chọn game.
3. Chọn trạng thái đầy đủ, thiếu hoặc hư hỏng cho từng linh kiện.
4. Nhập số lượng thiếu hoặc mô tả hư hỏng theo tình trạng thực tế.
5. Chọn mức độ, thêm ghi chú chung nếu có và bấm hoàn tất để cập nhật trạng thái game.

**Chỉnh sửa checklist** dùng để cấu hình tên và số lượng chuẩn. **Kiểm tra linh kiện** dùng để đối chiếu bộ game thực tế, tạo hoặc đóng sự cố và cập nhật trạng thái kho.

### 7. Tư vấn game cho khách

1. Mở **Tư vấn game**.
2. Chọn số người, thời lượng, thể loại, độ khó, độ tuổi, mức tương tác và kiểu chơi.
3. Trang lọc các game phù hợp từ dữ liệu hiện tại.
4. Chọn bàn và gán game nếu cần.

### 8. Sử dụng chatbot AI

1. Bấm biểu tượng chat ở góc dưới bên phải.
2. Chọn một câu hỏi gợi ý hoặc nhập câu hỏi mới.
3. Nhấn Enter hoặc nút gửi.
4. Chatbot trả lời dựa trên snapshot hiện tại gồm game, luật cơ bản của game mẫu, bàn, nhân viên, giao dịch, hoạt động, cảnh báo vận hành, báo cáo và cài đặt.
5. Các câu trả lời có nhiều đối tượng được tách thành từng dòng hoặc nhóm để dễ theo dõi trên desktop và mobile.

Ví dụ câu hỏi:

- `Tóm tắt tình hình quán hiện tại.`
- `Bàn nào đang cần hỗ trợ?`
- `Game nào đang chờ kiểm tra linh kiện?`
- `Cách chơi Dixit như thế nào?`
- `Hãy nêu trạng thái của từng game.`
- `Gợi ý game có sẵn cho 6 người, dưới 30 phút và dễ học.`
- `Ba việc nào cần ưu tiên xử lý?`

### 9. Quản lý nhân viên

Chức năng chỉ dành cho Chủ quán:

- Thêm nhân viên mới.
- Đổi vai trò giữa Quản lý, Thu ngân, Nhân viên phục vụ và Nhân viên kho.
- Cập nhật badge quyền tương ứng với vai trò.
- Khóa tài khoản sau khi xác nhận hoặc mở khóa tài khoản.
- Không thể thay đổi role hoặc khóa tài khoản Chủ quán đang đăng nhập.

### 10. Xem báo cáo

Trong **Báo cáo**, Chủ quán có thể:

- Chọn khoảng 7, 14 hoặc 30 ngày.
- Xem tổng lượt chơi, tỉ lệ dùng bàn, thời lượng trung bình và sự cố.
- Xem biểu đồ lượt chơi và tỉ lệ sử dụng bàn.
- Xem cơ cấu thể loại và top game trong 30 ngày.

### 11. Cài đặt và khôi phục dữ liệu

Trong **Cài đặt**, Chủ quán có thể:

- Chỉnh thông tin quán và bấm **Lưu thay đổi**.
- Xem các công tắc thông báo mô phỏng định hướng phát triển trong tương lai.
- Chọn **Dữ liệu > Khôi phục dữ liệu mẫu** để đưa dữ liệu nghiệp vụ về trạng thái ban đầu.

Khôi phục dữ liệu cần xác nhận và không làm mất session đăng nhập hiện tại.

<a id="cau-truc-thu-muc"></a>

## 📁 Cấu trúc thư mục

```text
BoardGameOS/
├── doc/                         Tài liệu prompt và kế hoạch AI
├── public/                      Tài nguyên public
├── src/
│   ├── assets/                  Ảnh sử dụng trong website
│   ├── components/
│   │   ├── bgos/                Component nghiệp vụ BoardGameOS
│   │   └── ui/                  Radix/shadcn-style UI components
│   ├── hooks/                   Hook dùng chung
│   ├── lib/
│   │   ├── ai/                  Snapshot, prompt và server function Gemini
│   │   └── bgos/                Mock data, type, helper và store nghiệp vụ
│   ├── routes/                  File-based routes
│   ├── routeTree.gen.ts         Route tree sinh tự động
│   ├── router.tsx               Khởi tạo router
│   ├── server.ts                SSR server entry
│   ├── start.ts                 TanStack Start entry
│   └── styles.css               Theme và style toàn cục
├── .env.example                 Mẫu biến môi trường
├── package.json                 Dependency và scripts
├── tsconfig.json                Cấu hình TypeScript
└── vite.config.ts               Cấu hình Vite, TanStack Start và Nitro
```

Không chỉnh sửa thủ công `src/routeTree.gen.ts` vì file này được TanStack Router tự động sinh.

<a id="cac-route-chinh"></a>

## 🧭 Các route chính

| URL | Chức năng | Quyền truy cập |
| --- | --- | --- |
| `/` | Trang giới thiệu | Công khai |
| `/login` | Đăng nhập demo | Công khai |
| `/app` | Dashboard | Tất cả tài khoản |
| `/app/games` | Kho game | Tất cả tài khoản |
| `/app/games/:gameId` | Chi tiết game | Tất cả tài khoản |
| `/app/tables` | Bàn chơi | Tất cả tài khoản |
| `/app/handover` | Giao nhận game | Tất cả tài khoản |
| `/app/checklist` | Kiểm tra linh kiện | Tất cả tài khoản |
| `/app/advisor` | Tư vấn game bằng bộ lọc | Tất cả tài khoản |
| `/app/staff` | Quản lý nhân viên | Chủ quán |
| `/app/reports` | Báo cáo | Chủ quán |
| `/app/settings` | Cài đặt | Chủ quán |
