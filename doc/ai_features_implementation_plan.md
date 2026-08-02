# Kế hoạch triển khai AI Chatbot cho BoardGameOS

## 1. Mục tiêu MVP

Triển khai một AI chatbot xuất hiện trên tất cả các trang `/app/*`, giúp nhân viên:

- Tra cứu thông tin từ toàn bộ mock data của BoardGameOS.
- Tóm tắt tình hình vận hành và các việc cần ưu tiên.
- Hỏi về kho game, bàn chơi, nhân viên, giao nhận, cảnh báo và báo cáo.
- Nhận gợi ý board game phù hợp cho khách bằng câu hỏi tự nhiên.

MVP chỉ có **một tính năng AI là chatbot**. Trang `Tư vấn game` tiếp tục sử dụng bộ lọc frontend có sẵn và không gọi Gemini.

## 2. Phạm vi chức năng

### Chatbot AI

Chatbot nhận câu hỏi tự do, lịch sử hội thoại gần nhất, đường dẫn trang hiện tại và snapshot toàn bộ dữ liệu trong store. Gemini trả lời bằng tiếng Việt dựa trên dữ liệu được cung cấp.

Ví dụ câu hỏi vận hành:

- "Tóm tắt tình hình quán hiện tại."
- "Ba việc nào cần ưu tiên xử lý?"
- "Bàn nào đang cần hỗ trợ?"
- "Game nào đang bảo trì hoặc thiếu linh kiện?"
- "Bàn 02 đang chơi game gì và ai phụ trách?"

Ví dụ câu hỏi tư vấn game:

- "Gợi ý 3 game cho 6 người, mới chơi, tương tác cao và dưới 30 phút."
- "Có game hợp tác nào đang sẵn sàng cho nhóm 4 người không?"
- "Nhóm có trẻ 10 tuổi nên chơi game nào?"

### Trang Tư vấn game

Trang `src/routes/app.advisor.tsx` giữ chức năng ban đầu:

- Lọc theo số người, thời lượng, độ khó, thể loại và độ tuổi.
- Lọc theo mức tương tác, kiểu chơi và mức thân thiện với người mới.
- Hiển thị kết quả ngay từ dữ liệu frontend.
- Cho phép gán game cho bàn bằng store hiện có.
- Không có nút AI, loading AI hoặc server function riêng.

## 3. Kiến trúc

```text
Trình duyệt
  -> AiChatWidget
  -> TanStack Start server function
  -> Gemini API
  -> JSON có cấu trúc
  -> Chatbot hiển thị câu trả lời
```

API key chỉ được đọc ở server function. Frontend gửi snapshot dữ liệu từ store nhưng không nhận hoặc nhìn thấy API key.

## 4. Dữ liệu gửi cho chatbot

Snapshot dùng toàn bộ các nhóm dữ liệu nghiệp vụ đang có:

```ts
interface AiDataSnapshot {
  games: Game[];
  tables: PlayTable[];
  staff: Staff[];
  transactions: Transaction[];
  activities: ActivityItem[];
  notifications: AppNotification[];
  reports: ReportDay[];
  settings: StoreSettings;
}
```

Snapshot được tạo ở thời điểm gửi câu hỏi nên phản ánh state và dữ liệu `localStorage` hiện tại của phiên demo.

## 5. Hợp đồng chatbot

### Request

```ts
interface OperationsChatRequest {
  question: string;
  currentPath: string;
  history: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  data: AiDataSnapshot;
}
```

Chỉ gửi tối đa 6 tin nhắn gần nhất để giữ ngữ cảnh hội thoại.

### Response

```ts
interface OperationsChatResponse {
  answer: string;
  suggestedQuestions: string[];
}
```

Gemini trả tối đa 3 câu hỏi gợi ý tiếp theo. Server kiểm tra response bằng Zod trước khi trả về frontend.

## 6. Quy tắc prompt

Chatbot phải:

- Chỉ trả lời từ snapshot dữ liệu được cung cấp.
- Không tự tạo tên game, nhân viên, bàn, giao dịch, số liệu hoặc sự cố.
- Nói rõ khi dữ liệu hiện tại chưa đủ để xác định.
- Trả lời bằng tiếng Việt, ngắn gọn và ưu tiên thông tin có thể hành động.
- Chỉ đọc dữ liệu, không tuyên bố đã thay đổi state hoặc hoàn thành thao tác.

Khi tư vấn game, chatbot phải:

- Có thể hỏi lại nếu thiếu tiêu chí quan trọng như số người hoặc độ tuổi.
- Chỉ gợi ý game tồn tại trong kho và có trạng thái `available`.
- Không gợi ý game bảo trì, thiếu linh kiện hoặc chờ kiểm tra.
- Kiểm tra số người và độ tuổi trước khi đề xuất.
- Ưu tiên thời lượng, kinh nghiệm, thể loại, độ khó, kiểu chơi và tương tác.
- Trả tối đa 5 game và giải thích ngắn gọn lý do cho từng game.

## 7. Giao diện chatbot

`AiChatWidget.tsx` được mount trong `AppLayout` để xuất hiện trên tất cả trang con và giữ hội thoại khi chuyển trang.

Các trạng thái cần có:

- Thu gọn thành nút nổi có icon hội thoại.
- Panel mở ở góc dưới bên phải.
- Lời chào và các câu hỏi gợi ý khi chưa có hội thoại.
- Loading khi Gemini đang xử lý.
- Thông báo thân thiện khi có lỗi và cho phép thử lại.
- Nút đóng, xóa hội thoại và gửi câu hỏi.
- Enter để gửi, Shift+Enter để xuống dòng.
- Không che bottom navigation trên mobile.

Hội thoại chỉ lưu trong state của widget; reload trang sẽ bắt đầu lại.

## 8. Các file chính

```text
src/components/bgos/AiChatWidget.tsx
src/components/bgos/AppLayout.tsx
src/lib/ai/context.ts
src/lib/ai/gemini.server.ts
src/lib/ai/operations-chat.functions.ts
src/lib/ai/prompts.ts
src/lib/ai/types.ts
src/routes/app.advisor.tsx
.env.example
```

Không cần `recommend-games.functions.ts` vì mọi câu hỏi gợi ý game đều đi qua chatbot.

## 9. Gemini và biến môi trường

SDK:

```bash
npm install @google/genai
```

File `.env.local` dùng khi chạy local:

```env
GEMINI_API_KEY=your-real-gemini-api-key
GEMINI_MODEL=gemini-3.6-flash
```

Quy tắc:

- Không dùng tiền tố `VITE_` cho API key.
- Chỉ đọc key bằng `process.env.GEMINI_API_KEY` trong code server.
- Không commit `.env.local`.
- Khi deploy, tạo hai biến trên trong Vercel Environment Variables và redeploy.

## 10. Chạy và kiểm thử local

Không cần deploy mới kiểm thử được AI:

```bash
npm install
npm run dev
```

Máy cần có Internet, API key hợp lệ và quota Gemini còn khả dụng. Sau khi sửa `.env.local`, phải khởi động lại dev server.

## 11. Xử lý lỗi tối thiểu

- Câu hỏi trống: không gửi request.
- Thiếu API key: báo chưa cấu hình dịch vụ AI.
- Gemini lỗi hoặc timeout: báo AI tạm thời không phản hồi.
- JSON sai cấu trúc: báo không đọc được kết quả AI.
- Không có game thỏa điều kiện: nói rõ không tìm thấy, không bịa thêm game.

Không hiển thị API key, raw response hoặc stack trace trên giao diện.

## 12. Kịch bản demo

### Tư vấn game qua chatbot

Hỏi:

> Gợi ý 3 game đang sẵn sàng cho 6 người, mới chơi, tương tác cao và dưới 30 phút.

Kết quả mong đợi: chỉ nêu game hợp lệ trong kho, phù hợp số người và có lý do cụ thể.

### Tổng hợp vận hành

Hỏi:

> Tóm tắt tình hình quán và cho tôi biết ba việc cần ưu tiên.

Kết quả mong đợi: liên kết đúng bàn, cảnh báo và trạng thái game từ mock data.

### Dữ liệu liên kết

Hỏi:

> Bàn 02 đang chơi game gì và nhân viên nào phụ trách?

Kết quả mong đợi: liên kết đúng `table.gameId` và `table.staffId`.

### Dữ liệu không tồn tại

Hỏi một thông tin không có trong snapshot. Chatbot phải nói dữ liệu chưa đủ thay vì tạo câu trả lời.

### Điều hướng

Mở chatbot, hỏi một câu rồi chuyển sang trang khác trong `/app/*`. Hội thoại vẫn còn trong phiên điều hướng hiện tại.

## 13. Tiêu chí hoàn thành

- Chatbot xuất hiện trên tất cả trang `/app/*`.
- Chatbot trả lời được từ mọi nhóm mock data.
- Chatbot có thể tư vấn game theo câu hỏi tự nhiên và tuân thủ điều kiện kho.
- Trang Tư vấn chỉ dùng bộ lọc frontend, không gọi AI.
- API key không xuất hiện trong client bundle.
- Có loading, error và empty state cơ bản.
- TypeScript, lint mục tiêu và production build chạy thành công.
- Luồng chính hoạt động trên desktop và mobile.

## 14. Ngoài phạm vi MVP

- AI riêng trong trang Tư vấn game.
- Database thật hoặc lưu lịch sử chatbot lâu dài.
- Streaming theo token, voice chat hoặc upload tài liệu.
- AI tự cập nhật store hay thực hiện thao tác vận hành.
- Authentication riêng cho server function, rate limiting hoặc dashboard chi phí.
- Vector database, embeddings, RAG hoặc huấn luyện model riêng.
