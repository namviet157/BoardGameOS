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
- [💾 Dữ liệu và localStorage](#du-lieu-localstorage)
- [🧠 Kiến trúc chatbot AI](#kien-truc-chatbot)
- [✅ Build và kiểm tra](#build-kiem-tra)
- [🚀 Deploy lên Vercel](#deploy-vercel)
- [📁 Cấu trúc thư mục](#cau-truc-thu-muc)
- [🧭 Các route chính](#cac-route-chinh)
- [🔧 Xử lý lỗi thường gặp](#xu-ly-loi)
- [⚠️ Giới hạn của MVP](#gioi-han-mvp)
- [🧑‍💻 Ghi chú phát triển](#ghi-chu-phat-trien)

<a id="tinh-nang-chinh"></a>

## ✨ Tính năng chính

- Dashboard tổng quan game, bàn chơi, sự cố và hoạt động gần đây.
- Kho game: tìm kiếm, lọc, thêm game, xem chi tiết, cập nhật trạng thái và QR mô phỏng.
- Quản lý checklist linh kiện, lịch sử giao nhận, sự cố và ghi chú của từng game.
- Quản lý bàn: trạng thái, số khách, game đang chơi, nhân viên phụ trách và thời gian phiên.
- Quy trình giao game, nhận lại game và chuyển game sang bảo trì.
- Bộ lọc tư vấn game theo số người, thời lượng, thể loại, độ tuổi, độ khó, kiểu chơi và mức tương tác.
- Tìm kiếm toàn hệ thống theo game, bàn và nhân viên; hỗ trợ tìm tiếng Việt không dấu.
- Chatbot Gemini hỏi đáp về toàn bộ snapshot dữ liệu BoardGameOS và gợi ý game đang sẵn sàng.
- Quản lý nhân viên, vai trò, quyền hiển thị và khóa/mở khóa tài khoản.
- Trung tâm thông báo với trạng thái đã đọc và đã xử lý.
- Báo cáo hoạt động theo 7, 14 hoặc 30 ngày bằng Recharts.
- Cài đặt thông tin quán, tùy chọn thông báo và khôi phục dữ liệu mẫu.
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
```

- `GEMINI_API_KEY`: API key lấy từ Google AI Studio.
- `GEMINI_MODEL`: model Gemini muốn sử dụng. Nếu bỏ trống, code mặc định dùng `gemini-3.6-flash`.
- Nếu model trên không khả dụng với tài khoản Google hiện tại, thay bằng model được Google AI Studio cung cấp cho API key đó.

Lưu ý bảo mật:

- Không commit `.env.local` lên Git.
- Không đặt key trong biến bắt đầu bằng `VITE_`, vì biến đó có thể được đóng gói vào frontend.
- `.gitignore` đã loại trừ các file có đuôi `.local`.
- Sau khi thay đổi biến môi trường, cần khởi động lại dev server.

<a id="chay-thu-local"></a>

## ▶️ Chạy thử ở local

Khởi động development server:

```bash
npm run dev
```

Mở URL được in trong terminal, thường là một trong các địa chỉ:

```text
http://localhost:3000
http://localhost:5173
```

Để chỉ định rõ host và port:

```bash
npm run dev -- --host 127.0.0.1 --port 3000
```

Sau đó truy cập:

```text
http://127.0.0.1:3000
```

<a id="tai-khoan-demo"></a>

## 👥 Tài khoản demo

| Vai trò | Email | Mật khẩu demo |
| --- | --- | --- |
| Chủ quán | `owner@boardgameos.vn` | `demo1234` |
| Nhân viên | `staff@boardgameos.vn` | `demo1234` |

Có thể bấm trực tiếp vào tài khoản mẫu ở cuối trang đăng nhập để điền nhanh thông tin.

Đăng nhập hiện là mô phỏng phục vụ MVP: hệ thống kiểm tra email có trong danh sách nhân viên và tài khoản không bị khóa. Mật khẩu chưa được xác thực bằng backend thật.

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
- Thông báo.
- Cài đặt.

### Nhân viên

Nhân viên sử dụng các chức năng vận hành:

- Tổng quan.
- Kho game.
- Bàn chơi.
- Giao nhận game.
- Kiểm tra linh kiện.
- Tư vấn game.
- Chatbot AI.

Nhân viên không thấy và không truy cập được `Báo cáo`, `Thông báo`, `Nhân viên` và `Cài đặt`. Nếu nhập trực tiếp URL của các trang này, hệ thống chuyển về Dashboard và hiển thị cảnh báo.

Đây là phân quyền giao diện dành cho MVP, chưa phải cơ chế authorization backend.

<a id="huong-dan-su-dung"></a>

## 📖 Hướng dẫn sử dụng

### 1. Đăng nhập và xem tổng quan

1. Mở `/login`.
2. Chọn tài khoản Chủ quán hoặc Nhân viên.
3. Bấm **Đăng nhập**.
4. Dashboard hiển thị tổng số game, bàn đang hoạt động, game chờ kiểm tra, sự cố và hoạt động gần đây.

### 2. Tìm kiếm toàn hệ thống

1. Bấm thanh tìm kiếm trên header hoặc biểu tượng tìm kiếm trên mobile.
2. Nhập tên/mã game, tên bàn, trạng thái, tên/email/vai trò nhân viên.
3. Có thể nhập tiếng Việt có dấu hoặc không dấu.
4. Chọn kết quả để chuyển đến màn hình tương ứng.

Kết quả nhân viên chỉ hiển thị với tài khoản Chủ quán. Có thể mở tìm kiếm nhanh bằng `Ctrl + K` trên Windows/Linux hoặc `Cmd + K` trên macOS.

### 3. Quản lý kho game

1. Mở **Kho game**.
2. Tìm kiếm hoặc lọc theo thể loại, trạng thái và số người chơi.
3. Bấm **Thêm game mới** để tạo một game trong dữ liệu demo.
4. Bấm **Chi tiết** để xem checklist, lịch sử, sự cố và ghi chú.
5. Dùng nút bảo trì để chuyển game sang bảo trì sau khi xác nhận.

### 4. Quản lý bàn và phiên chơi

1. Mở **Bàn chơi**.
2. Chọn trạng thái bàn hoặc gán một game đang có sẵn.
3. Với bàn trống, bấm **Tạo phiên chơi**.
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
2. Kiểm tra từng linh kiện.
3. Hoàn tất nhận game hoặc chuyển sang xử lý sự cố/bảo trì.

QR scanner hiện là mô phỏng: chọn một game trong dialog thay vì sử dụng camera thật.

### 6. Kiểm tra linh kiện

1. Mở **Kiểm tra linh kiện**.
2. Chọn game.
3. Đánh dấu linh kiện đầy đủ hoặc thiếu.
4. Có thể chọn mức độ sự cố, thêm ghi chú và ảnh minh chứng mô phỏng.
5. Bấm hoàn tất để cập nhật trạng thái game và lịch sử hoạt động.

### 7. Tư vấn game cho khách

1. Mở **Tư vấn game**.
2. Chọn số người, thời lượng, thể loại, độ khó, độ tuổi, mức tương tác và kiểu chơi.
3. Trang lọc các game phù hợp từ dữ liệu hiện tại.
4. Chọn bàn và gán game nếu cần.

Trang này sử dụng bộ lọc frontend, không gọi Gemini. Có thể dùng chatbot nếu cần tư vấn bằng ngôn ngữ tự nhiên.

### 8. Sử dụng chatbot AI

1. Bấm biểu tượng chat ở góc dưới bên phải.
2. Chọn một câu hỏi gợi ý hoặc nhập câu hỏi mới.
3. Nhấn Enter hoặc nút gửi.
4. Chatbot trả lời dựa trên snapshot hiện tại gồm game, bàn, nhân viên, giao dịch, hoạt động, thông báo, báo cáo và cài đặt.

Ví dụ câu hỏi:

- `Tóm tắt tình hình quán hiện tại.`
- `Bàn nào đang cần hỗ trợ?`
- `Game nào đang chờ kiểm tra linh kiện?`
- `Gợi ý game có sẵn cho 6 người, dưới 30 phút và dễ học.`
- `Ba việc nào cần ưu tiên xử lý?`

Chatbot chỉ đọc dữ liệu, không trực tiếp thay đổi store. Hội thoại được giữ khi chuyển trang nhưng sẽ mất khi reload trình duyệt.

### 9. Quản lý nhân viên

Chức năng chỉ dành cho Chủ quán:

- Thêm nhân viên mới.
- Đổi vai trò giữa Quản lý, Thu ngân, Nhân viên phục vụ và Nhân viên kho.
- Cập nhật badge quyền tương ứng với vai trò.
- Khóa tài khoản sau khi xác nhận hoặc mở khóa tài khoản.
- Không thể thay đổi role hoặc khóa tài khoản Chủ quán đang đăng nhập.

Role mới có hiệu lực với tài khoản nhân viên trong lần đăng nhập tiếp theo.

### 10. Xem thông báo và báo cáo

Trong **Thông báo**, Chủ quán có thể:

- Lọc thông báo theo nhóm.
- Đánh dấu đã đọc.
- Đánh dấu đã xử lý.

Trong **Báo cáo**, Chủ quán có thể:

- Chọn khoảng 7, 14 hoặc 30 ngày.
- Xem tổng lượt chơi, tỉ lệ dùng bàn, thời lượng trung bình và sự cố.
- Xem biểu đồ lượt chơi và tỉ lệ sử dụng bàn.
- Xem cơ cấu thể loại và top game trong 30 ngày.

### 11. Cài đặt và khôi phục dữ liệu

Trong **Cài đặt**, Chủ quán có thể:

- Chỉnh thông tin quán và bấm **Lưu thay đổi**.
- Bật/tắt các tùy chọn thông báo trong giao diện demo.
- Chọn **Dữ liệu > Khôi phục dữ liệu mẫu** để đưa dữ liệu nghiệp vụ về trạng thái ban đầu.

Khôi phục dữ liệu cần xác nhận và không làm mất session đăng nhập hiện tại.

<a id="du-lieu-localstorage"></a>

## 💾 Dữ liệu và localStorage

| Nội dung | Storage key |
| --- | --- |
| Dữ liệu nghiệp vụ | `boardgameos-state-v2` |
| Session đăng nhập | `boardgameos-session-v1` |

- Mock data nằm tại `src/lib/bgos/mock.ts`.
- Kiểu dữ liệu nằm tại `src/lib/bgos/types.ts`.
- Store và các thao tác nghiệp vụ nằm tại `src/lib/bgos/store.tsx`.
- Sau hydration, mọi thay đổi nghiệp vụ được ghi lại vào `localStorage`.
- Reload trang không làm mất dữ liệu đã thao tác.
- Xóa dữ liệu website trong trình duyệt hoặc dùng chức năng khôi phục sẽ đưa ứng dụng về mock data.
- Dữ liệu chỉ tồn tại trên trình duyệt và thiết bị hiện tại, không đồng bộ giữa các máy.

<a id="kien-truc-chatbot"></a>

## 🧠 Kiến trúc chatbot AI

Luồng xử lý:

```text
AiChatWidget
  -> tạo snapshot dữ liệu hiện tại
  -> gọi TanStack Start server function
  -> server đọc GEMINI_API_KEY
  -> Google Gemini trả JSON
  -> Zod kiểm tra kết quả
  -> frontend hiển thị câu trả lời và câu hỏi gợi ý
```

Các file chính:

```text
src/components/bgos/AiChatWidget.tsx
src/lib/ai/context.ts
src/lib/ai/operations-chat.functions.ts
src/lib/ai/gemini.server.ts
src/lib/ai/prompts.ts
src/lib/ai/types.ts
```

Server function giới hạn lịch sử gửi lên ở 6 tin nhắn gần nhất. Prompt cung cấp thời gian UTC, thời gian Việt Nam `Asia/Ho_Chi_Minh` và toàn bộ snapshot nghiệp vụ hiện tại.

<a id="build-kiem-tra"></a>

## ✅ Build và kiểm tra

Kiểm tra TypeScript:

```bash
npx tsc --noEmit
```

Chạy ESLint:

```bash
npm run lint
```

Build production:

```bash
npm run build
```

Preview bản build:

```bash
npm run preview
```

Các script có sẵn:

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy development server |
| `npm run build` | Build production bằng Vite và Nitro |
| `npm run build:dev` | Build với development mode |
| `npm run preview` | Preview bản build |
| `npm run lint` | Kiểm tra ESLint |
| `npm run format` | Format source bằng Prettier |

<a id="deploy-vercel"></a>

## 🚀 Deploy lên Vercel

Project đã cấu hình Nitro preset `vercel` trong `vite.config.ts`, nên frontend và TanStack server function được deploy cùng một project.

1. Push source code lên GitHub.
2. Import repository vào Vercel.
3. Trong **Project Settings > Environment Variables**, thêm:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL`
4. Chọn environment cần dùng: Production, Preview và Development.
5. Deploy hoặc Redeploy project.

Không upload `.env.local` lên Vercel. Vercel đọc biến môi trường được khai báo trong Project Settings và tạo serverless function từ output Nitro khi build.

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
| `/app/notifications` | Trung tâm thông báo | Chủ quán |
| `/app/settings` | Cài đặt | Chủ quán |

<a id="xu-ly-loi"></a>

## 🔧 Xử lý lỗi thường gặp

### Chatbot báo không phản hồi

Kiểm tra:

- `.env.local` đã tồn tại ở thư mục gốc.
- `GEMINI_API_KEY` đúng và còn hoạt động.
- Dev server đã được khởi động lại sau khi sửa `.env.local`.
- Model trong `GEMINI_MODEL` đang khả dụng với API key.

### Gemini trả lỗi model không tồn tại hoặc không khả dụng

Thay `GEMINI_MODEL` trong `.env.local` bằng model được Google AI Studio cung cấp cho tài khoản, sau đó khởi động lại server.

### Cổng local đang được sử dụng

Chạy project ở cổng khác:

```bash
npm run dev -- --port 3001
```

### Muốn đưa dữ liệu demo về ban đầu

Đăng nhập bằng tài khoản Chủ quán, mở **Cài đặt > Dữ liệu > Khôi phục dữ liệu mẫu**.

<a id="gioi-han-mvp"></a>

## ⚠️ Giới hạn của MVP

- Không có database và không đồng bộ dữ liệu giữa nhiều trình duyệt/thiết bị.
- Đăng nhập và phân quyền chỉ phục vụ demo giao diện, chưa bảo mật bằng backend.
- QR scanner, tải ảnh minh chứng và in QR là mô phỏng.
- Các công tắc cấu hình thông báo hiện là phần giao diện định hướng cho phiên bản tương lai.
- Dữ liệu báo cáo là mock data 30 ngày; bộ lọc 7/14 ngày áp dụng cho KPI và biểu đồ theo ngày.
- Top game và cơ cấu thể loại luôn dùng số liệu 30 ngày.
- Chatbot cần internet, Gemini API key hợp lệ và không lưu hội thoại sau khi reload.
- Chatbot chỉ đọc snapshot và không thực hiện thao tác thay đổi dữ liệu.
- Chưa có sao lưu/khôi phục bằng file hoặc cloud; chỉ có khôi phục mock data.

<a id="ghi-chu-phat-trien"></a>

## 🧑‍💻 Ghi chú phát triển

- Project được kết nối với Lovable thông qua `@lovable.dev/vite-tanstack-config`.
- Không force push, rebase hoặc rewrite lịch sử commit đã được publish vì có thể làm mất lịch sử đồng bộ trên Lovable.
- Khi mở rộng sang sản phẩm thật, cần bổ sung database, xác thực backend, authorization theo API và lưu lịch sử nghiệp vụ trên server.
