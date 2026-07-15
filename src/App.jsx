import React, { useMemo, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import {
  DollarSign, ShoppingCart, Users, Percent, ArrowUpRight, ArrowDownRight,
  Radar, Calendar,
} from "lucide-react";

// ------------------------------------------------------------------
// Design tokens (Sales Radar concept: deep navy "radar screen",
// amber sweep accent, teal secondary series, mono figures)
// ------------------------------------------------------------------
const C = {
  bg: "#0B1220",
  panel: "#101827",
  panelSoft: "#0E1626",
  border: "#1E293B",
  text: "#E8ECF4",
  muted: "#7C889C",
  amber: "#F2A93B",
  teal: "#2DD4BF",
  green: "#34D399",
  red: "#F87171",
};

// ------------------------------------------------------------------
// Mock data
// ------------------------------------------------------------------
const revenueTrend = [
  { day: "28 يونيو", revenue: 41200, target: 40000 },
  { day: "29 يونيو", revenue: 38900, target: 40000 },
  { day: "30 يونيو", revenue: 45600, target: 41000 },
  { day: "1 يوليو", revenue: 47100, target: 41000 },
  { day: "2 يوليو", revenue: 43800, target: 42000 },
  { day: "3 يوليو", revenue: 52300, target: 42000 },
  { day: "4 يوليو", revenue: 58900, target: 43000 },
  { day: "5 يوليو", revenue: 55200, target: 43000 },
  { day: "6 يوليو", revenue: 49700, target: 44000 },
  { day: "7 يوليو", revenue: 61400, target: 44000 },
  { day: "8 يوليو", revenue: 64200, target: 45000 },
  { day: "9 يوليو", revenue: 59800, target: 45000 },
  { day: "10 يوليو", revenue: 67300, target: 46000 },
  { day: "11 يوليو", revenue: 71500, target: 46000 },
];

const categories = [
  { name: "إلكترونيات", value: 284000 },
  { name: "أزياء", value: 198500 },
  { name: "منزل ومطبخ", value: 156200 },
  { name: "جمال وعناية", value: 121800 },
  { name: "رياضة", value: 94300 },
];

const regions = [
  { name: "الرياض", value: 34, color: C.amber },
  { name: "جدة", value: 26, color: C.teal },
  { name: "الدمام", value: 18, color: "#5B7FDE" },
  { name: "المدينة", value: 13, color: "#8B5CF6" },
  { name: "أخرى", value: 9, color: "#3A4658" },
];

const topProducts = [
  { name: "سماعة لاسلكية X200", sales: 1284, revenue: 192600, trend: 12.4 },
  { name: "ساعة ذكية Pulse", sales: 967, revenue: 174060, trend: 8.1 },
  { name: "حقيبة ظهر أوربان", sales: 1502, revenue: 135180, trend: -3.2 },
  { name: "عطر نوار الليل", sales: 743, revenue: 111450, trend: 21.7 },
  { name: "طقم مقالي مطبخ", sales: 512, revenue: 87040, trend: 5.6 },
];

const kpis = [
  {
    label: "إجمالي الإيرادات",
    value: "761,300",
    prefix: "ر.س ",
    delta: 14.2,
    icon: DollarSign,
    spark: [40, 44, 42, 48, 52, 50, 58, 61, 67],
  },
  {
    label: "عدد الطلبات",
    value: "6,842",
    prefix: "",
    delta: 9.8,
    icon: ShoppingCart,
    spark: [30, 32, 31, 35, 34, 39, 41, 40, 45],
  },
  {
    label: "معدل التحويل",
    value: "3.8",
    prefix: "",
    suffix: "%",
    delta: -1.1,
    icon: Percent,
    spark: [4.2, 4.0, 4.1, 3.9, 4.0, 3.8, 3.7, 3.9, 3.8],
  },
  {
    label: "عملاء جدد",
    value: "1,206",
    prefix: "",
    delta: 22.5,
    icon: Users,
    spark: [12, 14, 13, 18, 20, 19, 24, 26, 30],
  },
];

const tickerItems = [
  "طلب جديد #48213 بقيمة ر.س 1,240 من الرياض",
  "إيرادات اليوم تجاوزت الهدف بنسبة 18%",
  "منتج «عطر نوار الليل» يسجل أعلى نمو أسبوعي +21.7%",
  "طلب جديد #48214 بقيمة ر.س 890 من جدة",
  "معدل الإرجاع انخفض إلى 1.4% هذا الأسبوع",
  "طلب جديد #48215 بقيمة ر.س 3,120 من الدمام",
];

function fmt(n) {
  return new Intl.NumberFormat("ar-SA").format(n);
}

function Sparkline({ data, positive }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={points} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={positive ? C.green : C.red}
          strokeWidth={1.75}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function KpiCard({ kpi }) {
  const Icon = kpi.icon;
  const positive = kpi.delta >= 0;
  return (
    <div
      className="rounded-2xl p-5 flex flex-col justify-between"
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "#1A2333", color: C.amber }}
        >
          <Icon size={17} strokeWidth={1.75} />
        </div>
        <div
          className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full"
          style={{
            color: positive ? C.green : C.red,
            background: positive ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
          }}
        >
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(kpi.delta)}%
        </div>
      </div>
      <div>
        <p className="text-xs mb-1" style={{ color: C.muted }}>{kpi.label}</p>
        <p className="font-serif text-2xl" style={{ color: C.text }}>
          <span className="text-sm align-top ml-1" style={{ color: C.muted }}>{kpi.prefix}</span>
          {kpi.value}
          {kpi.suffix && <span className="text-lg" style={{ color: C.muted }}>{kpi.suffix}</span>}
        </p>
      </div>
      <div className="mt-3">
        <Sparkline data={kpi.spark} positive={positive} />
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs font-mono"
      style={{ background: "#0A1120", border: `1px solid ${C.border}`, color: C.text }}
    >
      <p style={{ color: C.muted }} className="mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: ر.س {fmt(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function SalesDashboard() {
  const [range, setRange] = useState("14d");
  const totalCategory = useMemo(
    () => categories.reduce((s, c) => s + c.value, 0),
    []
  );
  const maxCategory = Math.max(...categories.map((c) => c.value));

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full font-sans"
      style={{ background: C.bg, color: C.text }}
    >
      <style>{`
        @keyframes sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes marquee { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
        .sweep-el { animation: sweep 10s linear infinite; }
        .marquee-el { animation: marquee 32s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sweep-el, .marquee-el { animation: none !important; }
        }
        .font-serif { font-family: Georgia, 'Times New Roman', serif; }
        .font-mono { font-family: 'SF Mono', 'Courier New', monospace; }
      `}</style>

      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{ background: "#151F33" }}
          >
            <Radar size={18} color={C.amber} strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="font-serif text-lg leading-none" style={{ color: C.text }}>
              رادار المبيعات
            </h1>
            <p className="text-xs mt-1" style={{ color: C.muted }}>لوحة تحكم التحليلات · تحديث مباشر</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-mono"
            style={{ color: C.muted, border: `1px solid ${C.border}` }}
          >
            <Calendar size={13} />
            11 يوليو 2026
          </div>
          {["7d", "14d", "30d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="text-xs px-3 py-1.5 rounded-lg font-mono transition-colors"
              style={{
                background: range === r ? C.amber : "transparent",
                color: range === r ? "#12100C" : C.muted,
                border: `1px solid ${range === r ? C.amber : C.border}`,
              }}
            >
              {r === "7d" ? "٧ أيام" : r === "14d" ? "١٤ يوم" : "٣٠ يوم"}
            </button>
          ))}
        </div>
      </header>

      {/* Ticker */}
      <div
        className="overflow-hidden py-2 px-4"
        style={{ background: C.panelSoft, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="whitespace-nowrap marquee-el inline-block text-xs font-mono" style={{ color: C.muted }}>
          {tickerItems.map((t, i) => (
            <span key={i} className="mx-6">
              <span style={{ color: C.amber }}>●</span> {t}
            </span>
          ))}
        </div>
      </div>

      <main className="p-6 space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <KpiCard key={k.label} kpi={k} />
          ))}
        </div>

        {/* Revenue trend + radar signature */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: C.panel, border: `1px solid ${C.border}` }}
        >
          <div
            className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 opacity-[0.06] sweep-el"
            style={{
              background: `conic-gradient(from 0deg, ${C.amber}, transparent 30%)`,
              borderRadius: "9999px",
            }}
          />
          <div className="flex items-center justify-between mb-4 relative">
            <div>
              <h2 className="font-serif text-lg" style={{ color: C.text }}>اتجاه الإيرادات</h2>
              <p className="text-xs mt-1" style={{ color: C.muted }}>الإيراد الفعلي مقابل الهدف اليومي</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5" style={{ color: C.muted }}>
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: C.amber }} /> فعلي
              </span>
              <span className="flex items-center gap-1.5" style={{ color: C.muted }}>
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: C.teal }} /> الهدف
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.amber} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke={C.muted} tick={{ fontSize: 11, fontFamily: "monospace" }} />
              <YAxis stroke={C.muted} tick={{ fontSize: 11, fontFamily: "monospace" }} tickFormatter={(v) => `${v / 1000}ك`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="target" stroke={C.teal} strokeWidth={1.5} strokeDasharray="4 4" fill="none" name="الهدف" isAnimationActive={false} />
              <Area type="monotone" dataKey="revenue" stroke={C.amber} strokeWidth={2} fill="url(#rev)" name="فعلي" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category + Region + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Category bar */}
          <div
            className="rounded-2xl p-5 lg:col-span-1"
            style={{ background: C.panel, border: `1px solid ${C.border}` }}
          >
            <h3 className="font-serif text-base mb-4" style={{ color: C.text }}>المبيعات حسب الفئة</h3>
            <div className="space-y-3">
              {categories.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span style={{ color: C.text }}>{c.name}</span>
                    <span style={{ color: C.muted }}>ر.س {fmt(c.value)}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1A2333" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(c.value / maxCategory) * 100}%`,
                        background: `linear-gradient(90deg, ${C.amber}, ${C.teal})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Region donut */}
          <div
            className="rounded-2xl p-5 lg:col-span-1 flex flex-col items-center"
            style={{ background: C.panel, border: `1px solid ${C.border}` }}
          >
            <h3 className="font-serif text-base mb-2 self-start" style={{ color: C.text }}>التوزيع الجغرافي</h3>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={regions}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  isAnimationActive={false}
                >
                  {regions.map((r, i) => (
                    <Cell key={i} fill={r.color} stroke={C.panel} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, n) => [`${v}%`, n]}
                  contentStyle={{ background: "#0A1120", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontFamily: "monospace" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-2">
              {regions.map((r) => (
                <div key={r.name} className="flex items-center gap-1.5 text-xs font-mono" style={{ color: C.muted }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: r.color }} />
                  {r.name} · {r.value}%
                </div>
              ))}
            </div>
          </div>

          {/* Top products */}
          <div
            className="rounded-2xl p-5 lg:col-span-1"
            style={{ background: C.panel, border: `1px solid ${C.border}` }}
          >
            <h3 className="font-serif text-base mb-4" style={{ color: C.text }}>الأكثر مبيعًا</h3>
            <div className="space-y-3">
              {topProducts.map((p, i) => {
                const positive = p.trend >= 0;
                return (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono shrink-0"
                        style={{ background: "#1A2333", color: C.amber }}
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm truncate" style={{ color: C.text }}>{p.name}</p>
                        <p className="text-[11px] font-mono" style={{ color: C.muted }}>{fmt(p.sales)} قطعة</p>
                      </div>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="text-xs font-mono" style={{ color: C.text }}>ر.س {fmt(p.revenue)}</p>
                      <p
                        className="text-[11px] font-mono flex items-center gap-0.5 justify-end"
                        style={{ color: positive ? C.green : C.red }}
                      >
                        {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {Math.abs(p.trend)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
