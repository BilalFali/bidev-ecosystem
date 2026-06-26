"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Github, Download, BookOpen } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import type { OrderWithProduct, OrderStatus, DeliveryType } from "@/lib/types/database";

const STATUS_VARIANT: Record<OrderStatus, "success" | "warning" | "muted"> = {
  completed: "success",
  pending:   "warning",
  refunded:  "muted",
};

const DELIVERY_ICON: Record<DeliveryType, React.ReactNode> = {
  zip:    <Download className="w-3.5 h-3.5" />,
  github: <Github className="w-3.5 h-3.5" />,
  pdf:    <BookOpen className="w-3.5 h-3.5" />,
};

const DELIVERY_LABEL: Record<DeliveryType, string> = {
  zip:    "ZIP Download",
  github: "GitHub Access",
  pdf:    "PDF Download",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader
        title="Orders"
        description={`${orders.length} order${orders.length !== 1 ? "s" : ""}`}
      />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center">
          <ShoppingBag className="w-8 h-8 text-ink-faint mx-auto mb-3" />
          <p className="text-sm text-ink-muted">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Product</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Delivery</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-bg-card/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-ink">{order.customer_email}</p>
                    {order.customer_name && (
                      <p className="text-xs text-ink-muted mt-0.5">{order.customer_name}</p>
                    )}
                    {order.github_username && (
                      <p className="text-xs text-ink-faint mt-0.5 font-mono">@{order.github_username}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-ink-muted">
                      {order.product_title ?? order.product_id.slice(0, 8) + "…"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="flex items-center gap-1.5 text-xs text-ink-muted">
                      {DELIVERY_ICON[order.delivery_type]}
                      {DELIVERY_LABEL[order.delivery_type]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-sm font-medium text-ink">${Number(order.amount).toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={STATUS_VARIANT[order.status]} dot>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-ink-muted">{formatDate(order.created_at)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
