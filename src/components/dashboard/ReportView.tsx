import React, { useState, useMemo } from "react";
import { 
  getBegrData, 
  getPengaturanData, 
  formatScore,
  getCmlCategory,
  getCmlColor,
  BegrRecord
} from "../../data/dataUtils";
import { 
  Award, 
  TrendingUp, 
  Target, 
  Users, 
  Zap, 
  Heart, 
  Building,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
  FileText
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell,
  ReferenceLine
} from "recharts";
import { CustomTooltip } from "../ui/custom-tooltip";
import { motion } from 'motion/react';

export function ReportView() {
  const begrRecords = useMemo(() => getBegrData(), []);
  const { targetMaturity } = useMemo(() => getPengaturanData(), []);

  // Filter Scope: BI Wide, Kantor Pusat (KP), Kantor Perwakilan (KPw)
  const [selectedScope, setSelectedScope] = useState<"BI Wide" | "KP" | "KPw">("BI Wide");

  // Filter Dimensi Strategis: "Semua" | "EVP" | "Pilar"
  const [selectedDimensionType, setSelectedDimensionType] = useState<"Semua" | "EVP" | "Pilar">("Semua");

  // Filtered records based on active scope
  const scopedRecords = useMemo(() => {
    if (selectedScope === "KP") {
      return begrRecords.filter(r => r.jenis.toUpperCase() === "KP");
    } else if (selectedScope === "KPw") {
      return begrRecords.filter(r => r.jenis.toUpperCase() !== "KP");
    }
    return begrRecords;
  }, [begrRecords, selectedScope]);

  // Calculations for general report KPIs
  const reportStats = useMemo(() => {
    if (scopedRecords.length === 0) {
      return {
        avgCml: 0,
        complianceRate: 0,
        avgEngagement: 0,
        avgNnsImpact: 0,
        totalCount: 0,
        passCount: 0,
        failCount: 0,
        alignedCount: 0,
        engagedCount: 0,
        enableCount: 0,
        empowerCount: 0
      };
    }

    const totalCml = scopedRecords.reduce((sum, r) => sum + r.cultureMaturityLevel, 0);
    const avgCml = totalCml / scopedRecords.length;

    const passCount = scopedRecords.filter(r => r.cultureMaturityLevel >= targetMaturity).length;
    const complianceRate = (passCount / scopedRecords.length) * 100;

    const avgEngagement = scopedRecords.reduce((sum, r) => sum + r.averageKeterlibatan, 0) / scopedRecords.length;
    const avgNnsImpact = scopedRecords.reduce((sum, r) => sum + r.averageDampakNns, 0) / scopedRecords.length;

    let alignedCount = 0;
    let engagedCount = 0;
    let enableCount = 0;
    let empowerCount = 0;

    scopedRecords.forEach(r => {
      const cat = getCmlCategory(r.cultureMaturityLevel);
      if (cat === "Aligned") alignedCount++;
      else if (cat === "Engaged") engagedCount++;
      else if (cat === "Enable") enableCount++;
      else if (cat === "Empower") empowerCount++;
    });

    return {
      avgCml,
      complianceRate,
      avgEngagement,
      avgNnsImpact,
      totalCount: scopedRecords.length,
      passCount,
      failCount: scopedRecords.length - passCount,
      alignedCount,
      engagedCount,
      enableCount,
      empowerCount
    };
  }, [scopedRecords, targetMaturity]);

  // Dimension Performance: EVP and BI Pillars average scores
  const dimensionData = useMemo(() => {
    if (scopedRecords.length === 0) return [];

    const counts = scopedRecords.length;
    
    // EVPs
    const evpKep = scopedRecords.reduce((sum, r) => sum + r.evpKepemimpinan, 0) / counts;
    const evpKel = scopedRecords.reduce((sum, r) => sum + r.evpKeluarga, 0) / counts;
    const evpKes = scopedRecords.reduce((sum, r) => sum + r.evpKesejahteraan, 0) / counts;

    // BI Pillars
    const pilPrestasi = scopedRecords.reduce((sum, r) => sum + r.biPrestasi, 0) / counts;
    const pilDigital = scopedRecords.reduce((sum, r) => sum + r.biDigital, 0) / counts;
    const pilInovasi = scopedRecords.reduce((sum, r) => sum + r.biInovasi, 0) / counts;
    const pilSpiritual = scopedRecords.reduce((sum, r) => sum + r.biSpiritual, 0) / counts;

    return [
      { name: "EVP Kepemimpinan", score: evpKep, type: "EVP", fill: "#f59e0b" },
      { name: "EVP Keluarga", score: evpKel, type: "EVP", fill: "#f59e0b" },
      { name: "EVP Kesejahteraan", score: evpKes, type: "EVP", fill: "#f59e0b" },
      { name: "BI Prestasi", score: pilPrestasi, type: "Pilar", fill: "#3b82f6" },
      { name: "BI Digital", score: pilDigital, type: "Pilar", fill: "#3b82f6" },
      { name: "BI Inovasi", score: pilInovasi, type: "Pilar", fill: "#3b82f6" },
      { name: "BI Spiritual", score: pilSpiritual, type: "Pilar", fill: "#3b82f6" }
    ];
  }, [scopedRecords]);

  // Filtered Dimension Data based on type selection
  const filteredDimensionData = useMemo(() => {
    if (selectedDimensionType === "Semua") return dimensionData;
    return dimensionData.filter(d => d.type === selectedDimensionType);
  }, [dimensionData, selectedDimensionType]);

  // Dimension Performance Insights
  const dimensionInsights = useMemo(() => {
    if (dimensionData.length === 0) return null;
    
    // Highest Dimension
    const sorted = [...dimensionData].sort((a, b) => b.score - a.score);
    const highest = sorted[0];
    
    // Lowest Dimension
    const lowest = sorted[sorted.length - 1];
    
    // Average score of all dimensions
    const avgScore = dimensionData.reduce((sum, d) => sum + d.score, 0) / dimensionData.length;
    const gapToTarget = avgScore - targetMaturity;

    return {
      highest,
      lowest,
      avgScore,
      gapToTarget
    };
  }, [dimensionData, targetMaturity]);

  // Top 3 and Bottom 3 Satker Performers by CML Score
  const performanceHighlights = useMemo(() => {
    if (scopedRecords.length === 0) return { top: [], bottom: [] };

    const sorted = [...scopedRecords].sort((a, b) => b.cultureMaturityLevel - a.cultureMaturityLevel);
    const top = sorted.slice(0, 3);
    const bottom = sorted.length > 3 ? sorted.slice(sorted.length - 3).reverse() : [...sorted].reverse();

    return { top, bottom };
  }, [scopedRecords]);

  // Program-Specific Performance Metrics
  const programMetrics = useMemo(() => {
    if (scopedRecords.length === 0) return [];

    const calculateProgramAvg = (
      scoreKey: keyof BegrRecord, 
      engageKey: keyof BegrRecord, 
      name: string,
      color: string
    ) => {
      const validRecords = scopedRecords.filter(r => typeof r[scoreKey] === "number" && r[scoreKey] as number > 0);
      const count = validRecords.length || 1;
      
      const avgScore = validRecords.reduce((sum, r) => sum + (r[scoreKey] as number), 0) / count;
      const avgEngage = validRecords.reduce((sum, r) => sum + (r[engageKey] as number), 0) / count;

      return {
        name,
        averageScore: avgScore,
        averageEngagement: avgEngage,
        activeSatkers: validRecords.length,
        color
      };
    };

    return [
      calculateProgramAvg("skorAkhirSespiok", "keterlibatanSespiok", "SESPIOK X KPPTOP", "#6366f1"),
      calculateProgramAvg("skorAkhirAkukeren", "keterlibatanAkukeren", "AKUKEREN X BTSYUK", "#10b981"),
      calculateProgramAvg("skorAkhirObf", "keterlibatanObf", "OBF (Our Beliefs)", "#f43f5e"),
      calculateProgramAvg("skorAkhir3h", "keterlibatan3h", "3H X KEJORA", "#eab308"),
      calculateProgramAvg("skorAkhirPinter", "keterlibatanPinter", "PINTER X PASKEUN", "#06b6d4")
    ];
  }, [scopedRecords]);

  // CML Category mapping with colors & descriptions
  const categoriesMap = [
    { name: "Aligned", count: reportStats.alignedCount, range: "< 3.00", color: "#f43f5e", desc: "Membentuk keselarasan dasar budaya kerja" },
    { name: "Engaged", count: reportStats.engagedCount, range: "3.00 - 3.74", color: "#fbbf24", desc: "Keterlibatan aktif dalam implementasi program" },
    { name: "Enable", count: reportStats.enableCount, range: "3.75 - 4.29", color: "#22c55e", desc: "Berdaya mandiri melaksanakan nilai-nilai luhur" },
    { name: "Empower", count: reportStats.empowerCount, range: ">= 4.30", color: "#3b82f6", desc: "Tingkat kemandirian budaya yang lestari & optimal" }
  ];

  // Bento Grid KPI Laporan Utama (Menggunakan desain KPI yang ada di halaman overview)
  const kpiData = useMemo(() => {
    const cmlDiff = reportStats.avgCml - targetMaturity;

    return [
      {
        name: "Average Maturity Level (CML)",
        stat: formatScore(reportStats.avgCml),
        compareLabel: "skala 5.00",
        change: `${cmlDiff >= 0 ? "+" : ""}${cmlDiff.toFixed(2)}`,
        changeType: cmlDiff >= 0 ? "positive" : "negative",
        comparisonLabel: `vs target acuan (${formatScore(targetMaturity)})`,
        subtext: reportStats.avgCml >= targetMaturity ? "Melampaui Target Acuan" : "Di Bawah Target Acuan",
        icon: Award,
        colorClass: "amber"
      },
      {
        name: "Compliance Rate (% Target)",
        stat: `${reportStats.complianceRate.toFixed(1)}%`,
        compareLabel: "lulus target",
        change: `${reportStats.passCount} Satker`,
        changeType: "neutral",
        comparisonLabel: "memenuhi target CML",
        subtext: `${reportStats.passCount} dari ${reportStats.totalCount} satker lolos`,
        icon: Target,
        colorClass: "indigo"
      },
      {
        name: "Average Engagement Score",
        stat: formatScore(reportStats.avgEngagement),
        compareLabel: "skala 5.00",
        change: "AKTIF",
        changeType: "positive",
        comparisonLabel: "partisipasi program",
        subtext: "Keterlibatan Program Kebudayaan",
        icon: Users,
        colorClass: "emerald"
      },
      {
        name: "Average NNS Impact",
        stat: formatScore(reportStats.avgNnsImpact),
        compareLabel: "skala 5.00",
        change: "DAMPAK",
        changeType: "positive",
        comparisonLabel: "kontribusi korporasi",
        subtext: "Dampak Nilai-Nilai Strategis",
        icon: Zap,
        colorClass: "violet"
      }
    ];
  }, [reportStats, targetMaturity]);

  const iconColors: Record<string, string> = {
    amber: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
    indigo: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400",
    emerald: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
    violet: "bg-violet-500/10 text-violet-500 dark:text-violet-400"
  };

  const borderColors: Record<string, string> = {
    amber: "border-l-4 border-l-amber-500",
    indigo: "border-l-4 border-l-indigo-500",
    emerald: "border-l-4 border-l-emerald-500",
    violet: "border-l-4 border-l-violet-500"
  };

  return (
    <div className="space-y-6">
      {/* Scope Controls / Slicer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-xs select-none print:hidden">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-100 tracking-tight">Filter Cakupan Laporan</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Saring data agregasi untuk memfokuskan ringkasan laporan eksekutif</p>
          </div>
        </div>

        <div className="relative flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-center border border-slate-200/50 dark:border-slate-700/50">
          {(["BI Wide", "KP", "KPw"] as const).map((scope) => {
            const isActive = selectedScope === scope;
            return (
              <button
                key={scope}
                onClick={() => setSelectedScope(scope)}
                className={`relative px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap z-10 ${
                  isActive
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeScopeReport"
                    className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-sm -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {scope === "BI Wide" ? "BI Wide" : scope === "KP" ? "Kantor Pusat" : "Kantor Perwakilan"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Grid KPI Laporan Utama */}
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((item) => {
          return (
            <div 
              key={item.name} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-4 px-4.5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <dt className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {item.name}
                  </dt>
                </div>
                <dd className="mt-1 flex items-baseline space-x-2">
                  <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-sans">
                    {item.stat}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {item.compareLabel}
                  </p>
                </dd>
              </div>
              <dd className="mt-3 flex flex-col gap-1 pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center space-x-1.5">
                  <p className="flex items-center">
                    {item.changeType === 'positive' ? (
                      <svg className="size-4 shrink-0 text-emerald-600 dark:text-emerald-500 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 8l6 6H6z" />
                      </svg>
                    ) : item.changeType === 'negative' ? (
                      <svg className="size-4 shrink-0 text-rose-600 dark:text-rose-500 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 16l-6-6h12z" />
                      </svg>
                    ) : (
                      <span className="size-4 flex items-center justify-center text-violet-600 dark:text-violet-400">
                        <Target className="w-3 h-3" />
                      </span>
                    )}
                    <span
                      className={`text-xs font-bold font-sans ${
                        item.changeType === 'positive'
                          ? 'text-emerald-600 dark:text-emerald-500'
                          : item.changeType === 'negative'
                          ? 'text-rose-600 dark:text-rose-500'
                          : 'text-violet-600 dark:text-violet-400'
                      }`}
                    >
                      {item.change}
                    </span>
                  </p>
                  <p className="text-[13px] text-slate-400 dark:text-slate-550 font-medium">
                    {item.comparisonLabel}
                  </p>
                </div>
                <div className="text-[11.5px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider">
                  {item.subtext}
                </div>
              </dd>
            </div>
          );
        })}
      </dl>

      {/* Bar Chart: EVP vs Pilar BI Comparison - REDESIGNED PREMIUM */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-[24px] p-6 shadow-xs transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-100 tracking-tight">Matriks Dimensi Strategis: EVP vs Pilar Budaya</h3>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Analisis perbandingan skor rata-rata pilar kebudayaan internal dan kesejahteraan pegawai</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:self-center">
            {/* Filter Dimensi Segmented Buttons */}
            <div className="relative flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-250/30 dark:border-slate-700/50">
              {(["Semua", "EVP", "Pilar"] as const).map((type) => {
                const isActive = selectedDimensionType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedDimensionType(type)}
                    className={`relative px-3 py-1 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer whitespace-nowrap z-10 ${
                      isActive
                        ? "text-amber-500 dark:text-amber-400"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeDimensionReport"
                        className="absolute inset-0 bg-white dark:bg-slate-900 rounded-lg shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {type === "Semua" ? "Semua Dimensi" : type === "EVP" ? "Hanya EVP" : "Hanya Pilar"}
                  </button>
                );
              })}
            </div>

            {/* Custom Premium Legend */}
            <div className="flex items-center gap-4 text-[9px] font-extrabold border-l border-slate-200 dark:border-slate-800 pl-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-xs bg-gradient-to-tr from-amber-600 to-amber-400"></div>
                <span className="text-slate-600 dark:text-slate-400">EVP Pegawai</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-xs bg-gradient-to-tr from-blue-600 to-blue-400"></div>
                <span className="text-slate-600 dark:text-slate-400">Pilar Budaya BI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredDimensionData} margin={{ top: 25, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="evpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="pilarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 9, fontWeight: "bold" }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                domain={[dataMin => Math.max(0, parseFloat((dataMin - 0.2).toFixed(2))), dataMax => Math.min(5, parseFloat((dataMax + 0.2).toFixed(2)))]}
                tick={{ fill: "#64748b", fontSize: 9, fontWeight: "bold" }}
                tickFormatter={(v) => typeof v === "number" ? parseFloat(v.toFixed(2)).toString() : v}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.08)", radius: [8, 8, 0, 0] }} />
              <ReferenceLine 
                y={targetMaturity} 
                stroke="#f43f5e" 
                strokeDasharray="4 4" 
                strokeWidth={1.5}
                label={{ 
                  value: `Batas Kelulusan (${formatScore(targetMaturity)})`, 
                  fill: "#f43f5e", 
                  fontSize: 8.5, 
                  fontWeight: "black", 
                  position: "top",
                  offset: 8
                }} 
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={45}>
                {filteredDimensionData.map((entry, index) => {
                  const barFill = entry.type === "EVP" ? "url(#evpGrad)" : "url(#pilarGrad)";
                  return <Cell key={`cell-${index}`} fill={barFill} className="transition-all duration-300 hover:opacity-90" />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Strategic Analysis Sidebar/Widgets below the Chart */}
        {dimensionInsights && (
          <div className="mt-6 pt-5 border-t border-slate-150 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Insight 1: Highest */}
            <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 p-3.5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Dimensi Terkuat (Aset Utama)</span>
                </div>
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-2 truncate">
                  {dimensionInsights.highest?.name}
                </h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Memiliki tingkat kematangan kebudayaan paling optimal di Bank Indonesia</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold">Skor Rata-Rata</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black font-sans rounded-md">
                  {formatScore(dimensionInsights.highest?.score)}
                </span>
              </div>
            </div>

            {/* Insight 2: Lowest (Needs Support) */}
            <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 p-3.5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">Area Prioritas Pendampingan</span>
                </div>
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-2 truncate">
                  {dimensionInsights.lowest?.name}
                </h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Memerlukan intervensi strategis dan penguatan implementasi lapangan</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold">Skor Rata-Rata</span>
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black font-sans rounded-md">
                  {formatScore(dimensionInsights.lowest?.score)}
                </span>
              </div>
            </div>

            {/* Insight 3: Deviasi Target */}
            <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 p-3.5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Deviasi Rata-Rata Dimensi</span>
                </div>
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-2">
                  Deviasi vs Target ({formatScore(targetMaturity)})
                </h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Suku kematangan rata-rata dari seluruh pilar strategis yang ditargetkan</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold">Selisih Target</span>
                <span className={`px-2 py-0.5 text-xs font-black font-sans rounded-md ${
                  dimensionInsights.gapToTarget >= 0 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}>
                  {dimensionInsights.gapToTarget >= 0 ? "+" : ""}{dimensionInsights.gapToTarget.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Kematangan & Championship Program */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kematangan Category Shares */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-[24px] p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-5 flex-1 flex flex-col justify-center">
            {categoriesMap.map((cat) => {
              const percentage = reportStats.totalCount > 0 ? (cat.count / reportStats.totalCount) * 100 : 0;
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-extrabold text-slate-850 dark:text-slate-100">{cat.name} <span className="text-slate-400 font-semibold">({cat.range})</span></span>
                    </div>
                    <span className="font-black text-slate-800 dark:text-slate-100 font-sans">{cat.count} Satker ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: cat.color, width: `${percentage}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Championship Program Matrix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-[24px] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-100 tracking-tight">Performa Championship Program</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Ringkasan skor pencapaian dan rasio partisipasi program kebudayaan aktif</p>
          </div>

          <div className="mt-4 space-y-4 flex-1 flex flex-col justify-center">
            {programMetrics.map((prog) => (
              <div key={prog.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/25 border border-slate-150/55 dark:border-slate-800 rounded-xl gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{prog.name}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{prog.activeSatkers} Satuan Kerja Aktif</p>
                </div>
                
                <div className="flex items-center gap-6 shrink-0 text-right">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-extrabold uppercase text-slate-400 tracking-wider">Skor Rata2</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100 font-sans mt-0.5">{formatScore(prog.averageScore)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-extrabold uppercase text-slate-400 tracking-wider">Partisipasi</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100 font-sans mt-0.5">{formatScore(prog.averageEngagement)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlight Pemeringkatan: Top 3 & Bottom 3 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-[24px] p-6 shadow-xs">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
            <Building className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-sans text-slate-800 dark:text-slate-100 tracking-tight">Sorotan Eksekutif Kinerja Satuan Kerja</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Analisis unit kerja berkinerja tertinggi dan prioritas pendampingan budaya</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top 3 Performers */}
          <div className="space-y-3">
            <div className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-sans text-[10px] tracking-tight rounded-lg flex items-center gap-1.5">
              <ArrowUpRight className="w-4.5 h-4.5" />
              Top 3 Satker Terbaik (Culture Champions)
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-150 dark:border-slate-800 rounded-xl overflow-hidden">
              {performanceHighlights.top.map((satker, idx) => {
                const cat = getCmlCategory(satker.cultureMaturityLevel);
                const color = getCmlColor(cat);
                return (
                  <div key={satker.no} className="p-3 bg-slate-50/20 dark:bg-slate-900/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 bg-emerald-500 text-white rounded-lg flex items-center justify-center shrink-0 font-extrabold text-xs">
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{satker.satkerLengkap}</p>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{satker.kelompokBudker} • Rubrik {satker.rubrik}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end">
                      <span className="text-xs font-extrabold text-slate-850 dark:text-slate-100 font-sans">{formatScore(satker.cultureMaturityLevel)}</span>
                      <span className="text-[8px] font-extrabold uppercase mt-0.5 px-1.5 py-0.5 rounded-md" style={{ color, backgroundColor: `${color}15` }}>{cat}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom 3 Performers */}
          <div className="space-y-3">
            <div className="px-3.5 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold font-sans text-[10px] tracking-tight rounded-lg flex items-center gap-1.5">
              <ArrowDownRight className="w-4.5 h-4.5" />
              Prioritas Pendampingan (Below Benchmark)
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-150 dark:border-slate-800 rounded-xl overflow-hidden">
              {performanceHighlights.bottom.map((satker, idx) => {
                const cat = getCmlCategory(satker.cultureMaturityLevel);
                const color = getCmlColor(cat);
                return (
                  <div key={satker.no} className="p-3 bg-slate-50/20 dark:bg-slate-900/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 bg-rose-500 text-white rounded-lg flex items-center justify-center shrink-0 font-extrabold text-xs">
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{satker.satkerLengkap}</p>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{satker.kelompokBudker} • Rubrik {satker.rubrik}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end">
                      <span className="text-xs font-extrabold text-slate-850 dark:text-slate-100 font-sans">{formatScore(satker.cultureMaturityLevel)}</span>
                      <span className="text-[8px] font-extrabold uppercase mt-0.5 px-1.5 py-0.5 rounded-md" style={{ color, backgroundColor: `${color}15` }}>{cat}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
