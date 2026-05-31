import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  onDismiss?: () => void;
}

const config: Record<AlertType, { icon: typeof Info; classes: string }> = {
  success: { icon: CheckCircle, classes: "bg-green-500/10 border-green-500/20 text-green-400" },
  error:   { icon: XCircle,     classes: "bg-red-500/10 border-red-500/20 text-red-400"     },
  warning: { icon: AlertCircle, classes: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
  info:    { icon: Info,        classes: "bg-blue-500/10 border-blue-500/20 text-blue-400"   },
};

export function Alert({ type = "info", title, message, onDismiss }: AlertProps) {
  const { icon: Icon, classes } = config[type];
  return (
    <div className={cn("flex gap-3 rounded-lg border px-4 py-3", classes)}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
