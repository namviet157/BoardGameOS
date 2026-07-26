# BoardGameOS

BoardGameOS là bản demo MVP cho bảng điều khiển vận hành quán board game cafe. Ứng dụng tập trung dữ liệu kho game, linh kiện, bàn chơi, giao nhận, nhân viên, thông báo và báo cáo vào một giao diện quản trị duy nhất.

## Tính năng chính

- Landing page giới thiệu sản phẩm và form đăng ký demo.
- Đăng nhập demo theo tài khoản nhân viên đã seed sẵn.
- Dashboard tổng quan trạng thái game, bàn chơi, sự cố và hoạt động gần đây.
- Kho game với tìm kiếm, bộ lọc, thêm game mới, cập nhật trạng thái và mã QR mô phỏng.
- Trang chi tiết từng bộ game: thông tin, checklist linh kiện, lịch sử giao nhận, sự cố và ghi chú.
- Sơ đồ bàn chơi để cập nhật trạng thái, gán game, tạo hoặc kết thúc phiên chơi.
- Quy trình giao nhận game theo bước, có dialog quét QR mô phỏng.
- Checklist linh kiện khi nhận game về kho, ghi nhận thiếu/hỏng và phát sinh cảnh báo.
- Tư vấn game cho khách theo số người, thời lượng, độ khó, thể loại, độ tuổi, mức tương tác và kiểu chơi.
- Quản lý nhân viên, vai trò, ca làm, quyền thao tác và trạng thái khóa tài khoản.
- Trung tâm thông báo với trạng thái đã đọc/đã xử lý.
- Báo cáo vận hành bằng biểu đồ lượt chơi, tỉ lệ sử dụng bàn, cơ cấu thể loại và top game.
- Cài đặt thông tin quán, chi nhánh, tùy chọn thông báo và khôi phục dữ liệu mẫu.

## Công nghệ

- TanStack Start, TanStack Router và TanStack Query
- React 19 và TypeScript
- Vite với `@lovable.dev/vite-tanstack-config`
- Tailwind CSS v4
- Radix UI / shadcn-style components
- lucide-react cho icon
- Recharts cho biểu đồ
- Sonner cho toast notification
- Dữ liệu demo lưu bằng `localStorage`

## Chạy local

Yêu cầu khuyến nghị:

- Node.js 20+
- npm

```sh
git clone <repository-url>
cd boardgame-ops-hub
npm install
npm run dev
```

Sau khi server dev chạy, mở URL Vite hiển thị trong terminal, thường là:

```txt
http://localhost:5173
```

## Tài khoản demo

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Chủ quán | `owner@boardgameos.vn` | `demo1234` |
| Nhân viên | `staff@boardgameos.vn` | `demo1234` |

Lưu ý: đây là cơ chế đăng nhập demo ở client. Mật khẩu chỉ phục vụ trải nghiệm giao diện, chưa có xác thực backend thật.

## Scripts

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy dev server bằng Vite |
| `npm run build` | Build bản production |
| `npm run build:dev` | Build ở mode development |
| `npm run preview` | Preview bản build |
| `npm run lint` | Kiểm tra ESLint |
| `npm run format` | Format toàn bộ project bằng Prettier |

## Cấu trúc thư mục

```txt
src/
  assets/             Ảnh và tài nguyên tĩnh dùng trong app
  components/
    bgos/             Component nghiệp vụ của BoardGameOS
    ui/               Component UI nền tảng
  hooks/              React hooks dùng chung
  lib/
    bgos/             Mock data, store, type và helper nghiệp vụ
    error-*.ts        Error boundary/reporting cho SSR và Lovable
  routes/             File-based routes của TanStack Start
  router.tsx          Khởi tạo TanStack Router
  server.ts           Wrapper SSR server entry
  start.ts            Entry point client/server của TanStack Start
  styles.css          Tailwind theme và style toàn cục
```

## Dữ liệu demo

- Dữ liệu seed nằm ở `src/lib/bgos/mock.ts`.
- Type nghiệp vụ nằm ở `src/lib/bgos/types.ts`.
- Store client-side nằm ở `src/lib/bgos/store.tsx`.
- Trạng thái được lưu vào `localStorage` với key `boardgameos-state-v1`.
- Session demo được lưu vào `localStorage` với key `boardgameos-session-v1`.
- Có thể khôi phục dữ liệu mẫu trong màn hình `Cài đặt > Dữ liệu`.

## Routing

Project dùng file-based routing của TanStack Start. Các màn hình chính:

| File | URL |
| --- | --- |
| `src/routes/index.tsx` | `/` |
| `src/routes/login.tsx` | `/login` |
| `src/routes/app.index.tsx` | `/app` |
| `src/routes/app.games.index.tsx` | `/app/games` |
| `src/routes/app.games.$gameId.tsx` | `/app/games/:gameId` |
| `src/routes/app.tables.tsx` | `/app/tables` |
| `src/routes/app.handover.tsx` | `/app/handover` |
| `src/routes/app.checklist.tsx` | `/app/checklist` |
| `src/routes/app.advisor.tsx` | `/app/advisor` |
| `src/routes/app.staff.tsx` | `/app/staff` |
| `src/routes/app.reports.tsx` | `/app/reports` |
| `src/routes/app.notifications.tsx` | `/app/notifications` |
| `src/routes/app.settings.tsx` | `/app/settings` |

`src/routeTree.gen.ts` được sinh tự động, không chỉnh sửa thủ công.

## Ghi chú phát triển

- QR scan hiện là mô phỏng để demo quy trình, chưa tích hợp camera hoặc thiết bị quét thật.
- App chưa có backend, database hoặc phân quyền server-side.
- Khi thêm route mới, tạo file trong `src/routes/` theo quy ước TanStack Start.
- Khi thêm nghiệp vụ mới, ưu tiên mở rộng type/helper/store trong `src/lib/bgos/` trước khi nối vào UI.
- Project có cấu hình Lovable; tránh rewrite history của branch đã publish.
