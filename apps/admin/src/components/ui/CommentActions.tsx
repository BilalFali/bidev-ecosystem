"use client";

import { useState } from "react";
import { Check, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  approved: boolean;
}

export function CommentActions({ id, approved }: Props) {
  const [loading, setLoading] = useState<"approve" | "delete" | null>(null);
  const router = useRouter();

  async function doAction(action: "approve" | "delete") {
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: action === "delete" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        ...(action === "approve" ? { body: JSON.stringify({ approved: true }) } : {}),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {!approved && (
        <button
          onClick={() => doAction("approve")}
          disabled={!!loading}
          title="Approve"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
        >
          {loading === "approve" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Check className="w-3 h-3" />
          )}
          Approve
        </button>
      )}
      <button
        onClick={() => doAction("delete")}
        disabled={!!loading}
        title="Delete"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
      >
        {loading === "delete" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Trash2 className="w-3 h-3" />
        )}
        Delete
      </button>
    </div>
  );
}
