import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/bgos/AppLayout";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});
