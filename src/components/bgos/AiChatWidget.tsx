import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Bot, LoaderCircle, MessageCircle, Send, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { createAiDataSnapshot } from "@/lib/ai/context";
import { askOperationsAssistant } from "@/lib/ai/operations-chat.functions";
import type { ChatMessage, OperationsChatRequest } from "@/lib/ai/types";
import { useStore } from "@/lib/bgos/store";
import { cn } from "@/lib/utils";

const INITIAL_QUESTIONS = [
  "Tóm tắt tình hình quán hiện tại",
  "Ba việc nào cần ưu tiên xử lý?",
  "Bàn nào đang cần hỗ trợ?",
  "Game nào đang sẵn sàng cho khách?",
];

export function AiChatWidget() {
  const store = useStore();
  const currentPath = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState(INITIAL_QUESTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isTakingLonger, setIsTakingLonger] = useState(false);
  const [error, setError] = useState("");
  const [failedRequest, setFailedRequest] = useState<OperationsChatRequest | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading) return;

    const timeoutId = window.setTimeout(() => setIsTakingLonger(true), 8_000);
    return () => window.clearTimeout(timeoutId);
  }, [isLoading]);

  async function runRequest(request: OperationsChatRequest, appendUserMessage: boolean) {
    if (isLoading) return;

    if (appendUserMessage) {
      setMessages((current) => [...current, { role: "user", content: request.question }]);
      setQuestion("");
    }
    setError("");
    setFailedRequest(null);
    setSuggestedQuestions([]);
    setIsTakingLonger(false);
    setIsLoading(true);

    try {
      const response = await askOperationsAssistant({ data: request });
      setMessages((current) => [...current, { role: "assistant", content: response.answer }]);
      setSuggestedQuestions(response.suggestedQuestions);
    } catch (requestError) {
      console.error(requestError);
      setError("AI đang tạm thời không phản hồi. Vui lòng thử lại.");
      setFailedRequest(request);
    } finally {
      setIsTakingLonger(false);
      setIsLoading(false);
    }
  }

  async function sendMessage(value = question) {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;

    await runRequest(
      {
        question: trimmed,
        currentPath,
        history: messages.slice(-6),
        data: createAiDataSnapshot(store),
      },
      true,
    );
  }

  function clearConversation() {
    if (isLoading) return;
    setMessages([]);
    setQuestion("");
    setError("");
    setFailedRequest(null);
    setSuggestedQuestions(INITIAL_QUESTIONS);
  }

  if (!open) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-20 right-4 z-40 h-12 w-12 rounded-2xl shadow-lift lg:bottom-6 lg:right-6"
            onClick={() => setOpen(true)}
            aria-label="Mở trợ lý AI"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Trợ lý AI BoardGameOS</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <section
      className="fixed bottom-20 right-4 z-40 flex h-[min(620px,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lift lg:bottom-6 lg:right-6"
      aria-label="Trợ lý AI BoardGameOS"
    >
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <Bot className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">Trợ lý vận hành AI</p>
          <p className="text-xs text-muted-foreground">Đọc dữ liệu BoardGameOS hiện tại</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearConversation}
              disabled={isLoading}
              aria-label="Xóa hội thoại"
            >
              <Trash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Xóa hội thoại</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Đóng trợ lý AI"
            >
              <X />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Đóng</TooltipContent>
        </Tooltip>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4" aria-live="polite">
          {messages.length === 0 ? (
            <div className="space-y-3 py-2">
              <div className="flex gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <Bot className="h-4 w-4" />
                </span>
                <p className="text-sm leading-6 text-muted-foreground">
                  Xin chào, tôi là trợ lý vận hành BoardGameOS. Bạn có thể hỏi về kho game, bàn
                  chơi, nhân viên, giao nhận, cảnh báo hoặc báo cáo.
                </p>
              </div>
            </div>
          ) : null}

          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={cn("flex gap-2.5", message.role === "user" && "justify-end")}
            >
              {message.role === "assistant" ? (
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <Bot className="h-4 w-4" />
                </span>
              ) : null}
              <p
                className={cn(
                  "min-w-0 whitespace-pre-wrap break-words rounded-xl px-3 py-2 text-sm leading-6",
                  message.role === "user"
                    ? "max-w-[82%] bg-primary text-primary-foreground"
                    : "flex-1 bg-muted text-foreground",
                )}
              >
                {message.content}
              </p>
            </div>
          ))}

          {isLoading ? (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <LoaderCircle className="h-4 w-4 animate-spin" />
              </span>
              {isTakingLonger
                ? "AI đang xử lý nhiều dữ liệu, vui lòng chờ..."
                : "Đang phân tích dữ liệu..."}
            </div>
          ) : null}

          {error && failedRequest ? (
            <div className="space-y-2 rounded-xl border border-destructive/30 bg-destructive/8 px-3 py-2 text-sm text-destructive">
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => void runRequest(failedRequest, false)}
              >
                Thử lại
              </Button>
            </div>
          ) : null}

          {!isLoading && suggestedQuestions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="h-auto whitespace-normal rounded-xl py-2 text-left"
                  onClick={() => void sendMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          ) : null}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      <div className="shrink-0 border-t border-border bg-background/70 p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendMessage();
              }
            }}
            placeholder="Hỏi về dữ liệu vận hành..."
            className="max-h-28 min-h-10 resize-none rounded-xl"
            rows={1}
            disabled={isLoading}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl"
                disabled={!question.trim() || isLoading}
                onClick={() => void sendMessage()}
                aria-label="Gửi câu hỏi"
              >
                {isLoading ? <LoaderCircle className="animate-spin" /> : <Send />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Gửi câu hỏi</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </section>
  );
}
