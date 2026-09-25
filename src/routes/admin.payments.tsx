import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee, RefreshCcw, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Badge, Card, StatCard } from "../components/ui-kit";
import { api, CURRENCY } from "../lib/api";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments · Admin · ParkPilot" }, { name: "description", content: "Transactions, revenue and refunds." }] }),
  component: AdminPayments,
});

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
}

function AdminPayments() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-payments"], queryFn: api.adminPayments });
  const txns = data?.transactions ?? [];

  return (
    <AdminLayout title="Payments">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard label="Revenue (Total)" value={`${CURRENCY}${data?.revenueToday ?? 0}`} icon={<IndianRupee className="h-5 w-5" />} tone="success" />
        <StatCard label="Refunds" value={`${CURRENCY}${data?.refunds ?? 0}`} icon={<RefreshCcw className="h-5 w-5" />} tone="warning" />
        <StatCard label="Transactions" value={String(txns.length)} icon={<TrendingUp className="h-5 w-5" />} tone="info" />
      </div>
      <Card className="mt-6 !p-0 overflow-hidden">
        <div className="border-b border-border p-4"><h2 className="font-semibold">Transactions</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Tx ID</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Method</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{t.reference}</td>
                  <td className="px-4 py-3">{t.user}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.method}</td>
                  <td className="px-4 py-3 font-semibold">{CURRENCY}{t.amount}</td>
                  <td className="px-4 py-3"><Badge variant={t.status === "Success" ? "success" : t.status === "Refunded" ? "warning" : "info"}>{t.status}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(t.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isLoading && <p className="p-4 text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && txns.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No transactions yet.</p>}
      </Card>
    </AdminLayout>
  );
}
