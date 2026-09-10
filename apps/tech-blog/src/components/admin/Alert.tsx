import { AlertCircle, CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "success" | "error" | "warning";

const config: Record<AlertType, { icon: typeof AlertCircle; classes: string }> = {
  success: { icon: CheckCircle, classes: "bg-green-50 border-green-200 text-green-800" },
  error:   { icon: XCircle,     classes: "bg-red-50 border-red-200 text-red-800" },
  warning: { icon: AlertCircle, classes: "bg-yellow-50 border-yellow-200 text-yellow-800" },
};

export function Alert({ type = "error", message, onDismiss }: { type?: AlertType; message: string; onDismiss?: () => void }) {
  const { icon: Icon, classes } = config[type];
  return (
    <div className={cn("flex gap-3 border px-4 py-3", classes)}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <p className="text-sm flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
