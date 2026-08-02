# Tổng kết thay đổi AI Chatbot trong BoardGameOS

## 1. Mục đích

Tài liệu này ghi lại những thay đổi đã thực hiện để bổ sung AI chatbot vào BoardGameOS.

Phạm vi hiện tại chỉ gồm **một tính năng AI là chatbot toàn ứng dụng**. Trang `Tư vấn game` vẫn sử dụng bộ lọc frontend ban đầu và không gọi Gemini. Khi cần gợi ý game bằng AI, nhân viên hỏi trực tiếp trong chatbot.

## 2. Chức năng đã hoàn thành

Chatbot hiện có thể:

- Xuất hiện trên tất cả các trang bên trong `/app/*`.
- Đọc snapshot toàn bộ dữ liệu nghiệp vụ hiện tại trong store.
- Trả lời câu hỏi về game, bàn chơi, nhân viên, giao nhận, hoạt động, thông báo, báo cáo và cài đặt.
- Tóm tắt tình hình quán và nêu các việc cần ưu tiên.
- Gợi ý tối đa 5 board game theo yêu cầu viết bằng ngôn ngữ tự nhiên.
- Giữ tối đa 6 tin nhắn gần nhất làm ngữ cảnh hội thoại.
- Đưa ra tối đa 3 câu hỏi gợi ý để người dùng hỏi tiếp.
- Hiển thị trạng thái loading, lỗi và cho phép xóa hội thoại.

Ví dụ:

> Gợi ý 3 game đang sẵn sàng cho 6 người, mới chơi, tương tác cao và dưới 30 phút.

> Bàn 02 đang chơi game gì và nhân viên nào phụ trách?

> Tóm tắt tình hình quán và cho tôi biết ba việc cần ưu tiên.

## 3. Luồng hoạt động

```text
Người dùng nhập câu hỏi
  -> AiChatWidget lấy state hiện tại từ store
  -> Tạo snapshot toàn bộ mock data
  -> Gọi TanStack Start server function
  -> Server function tạo prompt và gọi Gemini
  -> Gemini trả JSON có cấu trúc
  -> Server kiểm tra JSON bằng Zod
  -> Frontend hiển thị câu trả lời và câu hỏi gợi ý
```

API key chỉ được sử dụng ở phía server. Nó không được gửi đến component React và không xuất hiện trong request do trình duyệt gửi lên server function.

## 4. Các file được tạo

### `src/components/bgos/AiChatWidget.tsx`

Tạo giao diện chatbot nổi ở góc dưới bên phải:

- Nút mở và đóng chatbot.
- Danh sách tin nhắn người dùng và AI.
- Ô nhập câu hỏi và nút gửi.
- Enter để gửi, Shift+Enter để xuống dòng.
- Loading khi Gemini đang phân tích dữ liệu.
- Thông báo khi request thất bại.
- Nút xóa toàn bộ hội thoại.
- Các câu hỏi gợi ý ban đầu và câu hỏi tiếp theo do Gemini trả về.
- Tự cuộn xuống tin nhắn mới nhất.
- Vị trí responsive để không che thanh điều hướng mobile.

Hội thoại được lưu trong state của component. Khi reload trình duyệt, hội thoại bắt đầu lại từ đầu.

### `src/lib/ai/types.ts`

Khai báo các kiểu dữ liệu dùng giữa frontend và server:

- `AiDataSnapshot`: toàn bộ nhóm dữ liệu được gửi cho AI.
- `ChatMessage`: tin nhắn của người dùng hoặc trợ lý.
- `OperationsChatRequest`: câu hỏi, route hiện tại, lịch sử và snapshot dữ liệu.
- `OperationsChatResponse`: câu trả lời và các câu hỏi gợi ý.

### `src/lib/ai/context.ts`

Thêm hàm `createAiDataSnapshot()` để lấy dữ liệu hiện tại từ store, gồm:

- `games`
- `tables`
- `staff`
- `transactions`
- `activities`
- `notifications`
- `reports`
- `settings`

Snapshot được tạo mỗi lần gửi câu hỏi nên bao gồm các thay đổi đang được lưu trong state và `localStorage` của phiên demo.

### `src/lib/ai/prompts.ts`

Thêm system prompt và hàm tạo nội dung gửi Gemini.

Prompt yêu cầu chatbot:

- Chỉ sử dụng dữ liệu được cung cấp.
- Không tự tạo game, nhân viên, bàn, giao dịch, số liệu hoặc sự cố.
- Nói rõ khi dữ liệu không đủ để trả lời.
- Trả lời bằng tiếng Việt, ngắn gọn và có thể hành động.
- Chỉ đọc dữ liệu, không tuyên bố đã thay đổi state.
- Dùng thời gian hiện tại và route đang mở làm ngữ cảnh khi cần.

Đối với câu hỏi tư vấn game, prompt yêu cầu:

- Hỏi lại tiêu chí quan trọng nếu thông tin chưa đủ.
- Chỉ gợi ý game có thật trong dữ liệu và có trạng thái `available`.
- Không gợi ý game thiếu linh kiện, bảo trì hoặc chờ kiểm tra.
- Kiểm tra số người và độ tuổi.
- Ưu tiên thời lượng, kinh nghiệm, thể loại, độ khó, kiểu chơi và mức tương tác.
- Nêu lý do cụ thể cho từng game và trả tối đa 5 game.

### `src/lib/ai/gemini.server.ts`

Tạo lớp dùng chung để gọi Gemini ở phía server:

- Đọc `GEMINI_API_KEY` từ biến môi trường.
- Đọc model từ `GEMINI_MODEL`.
- Dùng `gemini-3.6-flash` làm model mặc định.
- Tự chuyển cấu hình cũ `gemini-2.5-flash` sang `gemini-3.6-flash`.
- Yêu cầu Gemini trả về `application/json` theo JSON Schema.
- Parse JSON và báo lỗi rõ ràng khi Gemini không trả nội dung hợp lệ.

File này không được import trực tiếp trong component React.

### `src/lib/ai/operations-chat.functions.ts`

Tạo TanStack Start server function `askOperationsAssistant`:

- Nhận request từ chatbot bằng phương thức POST.
- Loại khoảng trắng ở đầu và cuối câu hỏi.
- Chỉ giữ 6 tin nhắn gần nhất.
- Không chấp nhận câu hỏi rỗng.
- Gọi helper Gemini ở phía server.
- Kiểm tra response bằng Zod.
- Giới hạn tối đa 3 câu hỏi gợi ý.

### `.env.example`

Thêm cấu hình mẫu không chứa key thật:

```env
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-3.6-flash
```

## 5. Các file được chỉnh sửa

### `src/components/bgos/AppLayout.tsx`

Mount `AiChatWidget` trong layout chính. Nhờ vậy chatbot:

- Có mặt trên tất cả route `/app/*`.
- Không bị tạo lại khi người dùng chuyển giữa các trang con.
- Giữ được lịch sử hội thoại trong phiên điều hướng hiện tại.

### `package.json` và `package-lock.json`

Thêm Google GenAI SDK chính thức:

```json
"@google/genai": "^2.15.0"
```

SDK chỉ được gọi từ code chạy phía server.

### `vite.config.ts`

Thêm Nitro preset dành cho Vercel:

```ts
nitro: {
  preset: "vercel",
}
```

Cấu hình này giúp production build tạo server function phù hợp để frontend và backend AI được deploy trong cùng một Vercel project.

### `.gitignore`

Thêm `.vercel` để bỏ qua thư mục output và cấu hình local do Vercel/Nitro tạo ra. Các file có đuôi `.local`, bao gồm `.env.local`, đã được ignore nên API key local không được commit.

### `src/routes/app.advisor.tsx`

Trang Tư vấn game đã được đưa về chức năng lọc frontend:

- Không gọi Gemini.
- Không còn nút "AI gợi ý game".
- Không còn loading hoặc kết quả riêng từ AI.
- Vẫn giữ các bộ lọc và chức năng gán game cho bàn.

Module server function chuyên gợi ý game đã được xóa. Khả năng gợi ý game bằng AI hiện nằm hoàn toàn trong chatbot.

## 6. Cấu hình bảo mật API key

Khi chạy local, key thật nằm trong `.env.local`:

```env
GEMINI_API_KEY=your-real-gemini-api-key
GEMINI_MODEL=gemini-3.6-flash
```

Không sử dụng tên `VITE_GEMINI_API_KEY`, vì biến có tiền tố `VITE_` có thể được đưa vào frontend bundle.

Khi deploy Vercel, cần tạo lại hai biến `GEMINI_API_KEY` và `GEMINI_MODEL` tại `Settings > Environment Variables`, sau đó redeploy. File `.env.local` trên máy không tự động được gửi lên Vercel.

## 7. Chạy ở local

```bash
npm install
npm run dev
```

Sau khi thay đổi `.env.local`, cần dừng và chạy lại dev server. Máy phải có Internet và API key Gemini còn quota.

## 8. Kiểm tra đã thực hiện

Sau khi hoàn tất và thu gọn về chatbot-only, các kiểm tra sau đã chạy thành công:

- TypeScript: `npx tsc --noEmit`.
- ESLint trên các file AI và trang Tư vấn.
- Production build: `npm run build`.
- Build Nitro sử dụng preset Vercel và tạo server function thành công.
- Không còn import hoặc code gọi server function AI riêng tại trang Tư vấn.

## 9. Giới hạn hiện tại của MVP

- Chatbot chỉ đọc dữ liệu, không tự thay đổi store.
- Hội thoại không được lưu sau khi reload.
- Câu trả lời không streaming theo từng token.
- Không có database, RAG, embeddings hoặc upload tài liệu.
- Chưa có rate limiting, phân quyền server function hoặc dashboard chi phí.
- Chất lượng câu trả lời phụ thuộc vào mock data, prompt, model và quota Gemini.

Các giới hạn này phù hợp với mục tiêu demo MVP hiện tại và có thể được mở rộng nếu dự án tiếp tục phát triển.
