import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, RefreshCcw, TrendingUp } from "lucide-react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Badge, Card, StatCard } from "../components/ui-kit";
import { transactions } from "../data/dummy";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments · Admin · ParkPilot" }, { name: "description", content: "Transactions, revenue and refunds." }] }),
  component: AdminPayments,
});

function AdminPayments() {
  return (
    <AdminLayout title="Payments">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard label="Revenue (Today)" value="$4,820" delta="+12%" icon={<DollarSign className="h-5 w-5" />} tone="success" />
        <StatCard label="Refunds" value="$180" icon={<RefreshCcw className="h-5 w-5" />} tone="warning" />
        <StatCard label="Net Growth" value="+18%" icon={<TrendingUp className="h-5 w-5" />} tone="info" />
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
              {[...transactions, ...transactions].map((t, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{t.id}</td>
                  <td className="px-4 py-3">{t.user}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.method}</td>
                  <td className="px-4 py-3 font-semibold">${t.amount}</td>
                  <td className="px-4 py-3"><Badge variant={t.status === "Success" ? "success" : "warning"}>{t.status}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}
