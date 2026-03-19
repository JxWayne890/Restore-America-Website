import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Users, TrendingUp, Calendar, AlertTriangle, Star,
  Phone, Mail, MapPin, Clock, CheckCircle, XCircle,
  Flame, Droplets, Wind, Shield, ChevronDown, ChevronRight,
  Plus, Edit, Zap, BarChart3, MessageSquare, Home
} from "lucide-react";

const STAGE_COLORS: Record<string, string> = {
  new: "#6B7280",
  contacted: "#3B82F6",
  inspection_scheduled: "#8B5CF6",
  inspection_done: "#F59E0B",
  estimate_sent: "#EC4899",
  claim_filed: "#06B6D4",
  approved: "#10B981",
  in_progress: "#F97316",
  completed: "#22C55E",
  lost: "#EF4444",
};

const STAGE_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  inspection_scheduled: "Inspection Scheduled",
  inspection_done: "Inspection Done",
  estimate_sent: "Estimate Sent",
  claim_filed: "Claim Filed",
  approved: "Approved",
  in_progress: "In Progress",
  completed: "Completed",
  lost: "Lost",
};

const DAMAGE_ICONS: Record<string, string> = {
  hail: "🌨️", wind: "💨", fire: "🔥", flood: "💧", tree: "🌳", roof: "🏠", other: "⚡"
};

type Tab = "pipeline" | "leads" | "appointments" | "storm" | "analytics";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const loginUrl = getLoginUrl();
  const [activeTab, setActiveTab] = useState<Tab>("pipeline");
  const [selectedLead, setSelectedLead] = useState<number | null>(null);
  const [stormForm, setStormForm] = useState({ title: "", message: "", affectedAreas: "", severity: "warning" as any });
  const [noteForm, setNoteForm] = useState({ type: "note" as any, content: "" });
  const [stageFilter, setStageFilter] = useState<string>("");

  // Queries
  const { data: stats, refetch: refetchStats } = trpc.leads.stats.useQuery();
  const completedCount = stats?.byStage?.find((s) => s.stage === "completed")?.count ?? 0;
  const lostCount = stats?.byStage?.find((s) => s.stage === "lost")?.count ?? 0;
  const inProgressCount = stats?.byStage?.find((s) => s.stage === "in_progress")?.count ?? 0;
  const newTodayCount = stats?.byStage?.find((s) => s.stage === "new")?.count ?? 0;
  const { data: leads, refetch: refetchLeads } = trpc.leads.list.useQuery(
    stageFilter ? { stage: stageFilter } : undefined
  );
  const { data: leadDetail, refetch: refetchDetail } = trpc.leads.get.useQuery(
    { id: selectedLead! },
    { enabled: !!selectedLead }
  );
  const { data: appointments } = trpc.appointments.list.useQuery();
  const { data: stormAlerts, refetch: refetchAlerts } = trpc.stormAlerts.list.useQuery();

  // Mutations
  const updateLead = trpc.leads.update.useMutation({ onSuccess: () => { refetchLeads(); refetchDetail(); refetchStats(); } });
  const addNote = trpc.leads.addNote.useMutation({ onSuccess: () => { refetchDetail(); setNoteForm({ type: "note", content: "" }); } });
  const createAlert = trpc.stormAlerts.create.useMutation({ onSuccess: () => { refetchAlerts(); setStormForm({ title: "", message: "", affectedAreas: "", severity: "warning" }); } });
  const deactivateAlert = trpc.stormAlerts.deactivate.useMutation({ onSuccess: () => refetchAlerts() });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D1F3C" }}>
      <div className="text-white text-center">
        <Shield className="w-12 h-12 mx-auto mb-4 animate-pulse" style={{ color: "#CC2222" }} />
        <p style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}>LOADING...</p>
      </div>
    </div>
  );

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D1F3C" }}>
        <div className="text-center text-white p-8">
          <Shield className="w-16 h-16 mx-auto mb-4" style={{ color: "#CC2222" }} />
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: "Oswald, sans-serif" }}>ADMIN ACCESS REQUIRED</h1>
          <p className="text-white/60 mb-6">You must be logged in as an admin to view this page.</p>
          {loginUrl ? (
            <a
              href={loginUrl}
              className="inline-block px-8 py-3 font-bold text-white"
              style={{ background: "#CC2222", fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}
            >
              LOGIN
            </a>
          ) : (
            <span
              className="inline-block px-8 py-3 font-bold text-white/50"
              style={{ background: "#64748B", fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}
            >
              LOGIN NOT CONFIGURED
            </span>
          )}
        </div>
      </div>
    );
  }

  const TABS = [
    { id: "pipeline" as Tab, label: "Pipeline", icon: TrendingUp },
    { id: "leads" as Tab, label: "Leads", icon: Users },
    { id: "appointments" as Tab, label: "Appointments", icon: Calendar },
    { id: "storm" as Tab, label: "Storm Alerts", icon: AlertTriangle },
    { id: "analytics" as Tab, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F1F5F9" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1B3A6B, #0f2447)" }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" style={{ color: "#CC2222" }} />
            <div>
              <h1 className="text-white font-black text-lg" style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}>
                RESTORE AMERICA — COMMAND CENTER
              </h1>
              <p className="text-white/50 text-xs">Welcome back, {user?.name}</p>
            </div>
          </div>
          <a href="/" className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
            <Home className="w-4 h-4" />
            View Site
          </a>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto pb-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${
                activeTab === id ? "text-white border-red-500" : "text-white/50 border-transparent hover:text-white/80"
              }`}
              style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ─── PIPELINE TAB ─── */}
        {activeTab === "pipeline" && (
          <div>
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Leads", value: stats?.total ?? 0, icon: Users, color: "#1B3A6B" },
                { label: "New", value: newTodayCount, icon: Plus, color: "#CC2222" },
                { label: "In Progress", value: inProgressCount, icon: TrendingUp, color: "#F59E0B" },
                { label: "Completed", value: completedCount, icon: CheckCircle, color: "#22C55E" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{s.label}</p>
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <p className="text-3xl font-black" style={{ color: s.color, fontFamily: "Oswald, sans-serif" }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Kanban-style pipeline */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(STAGE_LABELS).slice(0, 10).map(([stage, label]) => {
                const stageLeads = leads?.filter((l) => l.stage === stage) ?? [];
                return (
                  <div key={stage} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div
                      className="px-3 py-2 flex items-center justify-between"
                      style={{ background: STAGE_COLORS[stage] + "20", borderBottom: `2px solid ${STAGE_COLORS[stage]}` }}
                    >
                      <span className="text-xs font-bold" style={{ color: STAGE_COLORS[stage], fontFamily: "Oswald, sans-serif" }}>
                        {label.toUpperCase()}
                      </span>
                      <span
                        className="text-xs font-black px-2 py-0.5 rounded-full text-white"
                        style={{ background: STAGE_COLORS[stage] }}
                      >
                        {stageLeads.length}
                      </span>
                    </div>
                    <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
                      {stageLeads.map((lead) => (
                        <button
                          key={lead.id}
                          onClick={() => { setSelectedLead(lead.id); setActiveTab("leads"); }}
                          className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm">{DAMAGE_ICONS[lead.damageType ?? "other"]}</span>
                            <span className="text-xs font-semibold text-gray-800 truncate">{lead.name}</span>
                            {lead.isHot && <span className="text-red-500 text-xs">🔥</span>}
                          </div>
                          <p className="text-gray-400 text-xs">{lead.phone}</p>
                        </button>
                      ))}
                      {stageLeads.length === 0 && (
                        <p className="text-gray-300 text-xs text-center py-3">Empty</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── LEADS TAB ─── */}
        {activeTab === "leads" && (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Lead List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-800" style={{ fontFamily: "Oswald, sans-serif" }}>ALL LEADS</h2>
                  <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value="">All Stages</option>
                    {Object.entries(STAGE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                  {(leads ?? []).map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLead(lead.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${selectedLead === lead.id ? "bg-blue-50 border-l-2 border-blue-600" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{DAMAGE_ICONS[lead.damageType ?? "other"]}</span>
                            <span className="font-semibold text-gray-800 text-sm truncate">{lead.name}</span>
                            {lead.isHot && <Flame className="w-3 h-3 text-red-500 flex-shrink-0" />}
                          </div>
                          <p className="text-gray-500 text-xs mt-0.5">{lead.phone}</p>
                          <p className="text-gray-400 text-xs">{lead.city ?? lead.address ?? "No address"}</p>
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                          style={{
                            background: (STAGE_COLORS[lead.stage ?? "new"] ?? "#6B7280") + "20",
                            color: STAGE_COLORS[lead.stage ?? "new"] ?? "#6B7280",
                          }}
                        >
                          {STAGE_LABELS[lead.stage ?? "new"] ?? lead.stage}
                        </span>
                      </div>
                    </button>
                  ))}
                  {(!leads || leads.length === 0) && (
                    <div className="px-4 py-12 text-center text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No leads yet. They'll appear here when the form is submitted.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lead Detail */}
            <div className="lg:col-span-3">
              {leadDetail ? (
                <div className="space-y-4">
                  {/* Lead Header */}
                  <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{DAMAGE_ICONS[leadDetail.lead.damageType ?? "other"]}</span>
                          <h2 className="text-xl font-black text-gray-800" style={{ fontFamily: "Oswald, sans-serif" }}>
                            {leadDetail.lead.name}
                          </h2>
                          {leadDetail.lead.isHot && <Flame className="w-5 h-5 text-red-500" />}
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{leadDetail.lead.phone}</span>
                          {leadDetail.lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{leadDetail.lead.email}</span>}
                          {leadDetail.lead.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{leadDetail.lead.address}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => updateLead.mutate({ id: leadDetail.lead.id, isHot: !leadDetail.lead.isHot })}
                        className={`p-2 rounded-lg transition-colors ${leadDetail.lead.isHot ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400 hover:bg-red-50"}`}
                        title="Toggle hot lead"
                      >
                        <Flame className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stage Selector */}
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Pipeline Stage</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(STAGE_LABELS).map(([stage, label]) => (
                          <button
                            key={stage}
                            onClick={() => updateLead.mutate({ id: leadDetail.lead.id, stage: stage as any })}
                            className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                            style={{
                              background: leadDetail.lead.stage === stage ? STAGE_COLORS[stage] : STAGE_COLORS[stage] + "20",
                              color: leadDetail.lead.stage === stage ? "white" : STAGE_COLORS[stage],
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Lead Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Damage Type</p>
                        <p className="font-semibold text-gray-800 capitalize">{leadDetail.lead.damageType}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Claim Status</p>
                        <p className="font-semibold text-gray-800 capitalize">{(leadDetail.lead.claimStatus ?? "not_filed").replace("_", " ")}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Property Owner</p>
                        <p className="font-semibold text-gray-800">{leadDetail.lead.isOwner ? "Yes" : "No"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs mb-1">Source</p>
                        <p className="font-semibold text-gray-800 capitalize">{leadDetail.lead.source ?? "website"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Activity Log */}
                  <div className="bg-white rounded-xl shadow-sm p-5">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: "Oswald, sans-serif" }}>
                      <Clock className="w-4 h-4" style={{ color: "#1B3A6B" }} />
                      ACTIVITY LOG
                    </h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                      {leadDetail.activities.map((act) => (
                        <div key={act.id} className="flex gap-3">
                          <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: "#1B3A6B" }} />
                          <div>
                            <p className="text-sm text-gray-700">{act.content}</p>
                            <p className="text-xs text-gray-400">{act.createdBy} · {new Date(act.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                      {leadDetail.activities.length === 0 && (
                        <p className="text-gray-400 text-sm">No activity yet.</p>
                      )}
                    </div>

                    {/* Add Note */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex gap-2 mb-2">
                        {["note", "call", "sms", "email", "inspection", "estimate"].map((t) => (
                          <button
                            key={t}
                            onClick={() => setNoteForm((p) => ({ ...p, type: t as any }))}
                            className="text-xs px-2 py-1 rounded-full capitalize transition-colors"
                            style={{
                              background: noteForm.type === t ? "#1B3A6B" : "#F1F5F9",
                              color: noteForm.type === t ? "white" : "#6B7280",
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={noteForm.content}
                          onChange={(e) => setNoteForm((p) => ({ ...p, content: e.target.value }))}
                          placeholder={`Add ${noteForm.type} note...`}
                          className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && noteForm.content.trim()) {
                              addNote.mutate({ leadId: leadDetail.lead.id, type: noteForm.type, content: noteForm.content });
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (noteForm.content.trim()) {
                              addNote.mutate({ leadId: leadDetail.lead.id, type: noteForm.type, content: noteForm.content });
                            }
                          }}
                          className="px-3 py-2 rounded-lg text-white text-sm font-semibold"
                          style={{ background: "#1B3A6B" }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Select a lead to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── APPOINTMENTS TAB ─── */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-lg" style={{ fontFamily: "Oswald, sans-serif" }}>SCHEDULED APPOINTMENTS</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {(appointments ?? []).map((appt) => (
                <div key={appt.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "#EFF6FF" }}
                    >
                      <Calendar className="w-5 h-5" style={{ color: "#1B3A6B" }} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{appt.title}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(appt.scheduledAt).toLocaleDateString()} at {new Date(appt.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {appt.assignedTo && ` · ${appt.assignedTo}`}
                      </p>
                      {appt.address && <p className="text-gray-400 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{appt.address}</p>}
                    </div>
                  </div>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium capitalize"
                    style={{
                      background: appt.status === "completed" ? "#DCFCE7" : appt.status === "cancelled" ? "#FEE2E2" : "#EFF6FF",
                      color: appt.status === "completed" ? "#166534" : appt.status === "cancelled" ? "#991B1B" : "#1B3A6B",
                    }}
                  >
                    {appt.status ?? "scheduled"}
                  </span>
                </div>
              ))}
              {(!appointments || appointments.length === 0) && (
                <div className="px-6 py-12 text-center text-gray-400">
                  <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No appointments scheduled yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── STORM ALERTS TAB ─── */}
        {activeTab === "storm" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Create Alert */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "Oswald, sans-serif" }}>
                <Zap className="w-5 h-5 text-yellow-500" />
                CREATE STORM ALERT
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Alert title (e.g., Hail Storm — Metro Atlanta)"
                  value={stormForm.title}
                  onChange={(e) => setStormForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                />
                <input
                  type="text"
                  placeholder="Affected areas (e.g., Gwinnett, Fulton, DeKalb)"
                  value={stormForm.affectedAreas}
                  onChange={(e) => setStormForm((p) => ({ ...p, affectedAreas: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                />
                <textarea
                  placeholder="Alert message for visitors..."
                  value={stormForm.message}
                  onChange={(e) => setStormForm((p) => ({ ...p, message: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 resize-none"
                />
                <select
                  value={stormForm.severity}
                  onChange={(e) => setStormForm((p) => ({ ...p, severity: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="watch">Watch (Yellow)</option>
                  <option value="warning">Warning (Red)</option>
                  <option value="emergency">Emergency (Dark Red)</option>
                </select>
                <button
                  onClick={() => {
                    if (stormForm.title && stormForm.affectedAreas && stormForm.message) {
                      createAlert.mutate(stormForm);
                    }
                  }}
                  disabled={!stormForm.title || !stormForm.affectedAreas || !stormForm.message || createAlert.isPending}
                  className="w-full py-3 rounded-xl text-white font-bold disabled:opacity-50"
                  style={{ background: "#CC2222", fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}
                >
                  {createAlert.isPending ? "ACTIVATING..." : "ACTIVATE STORM ALERT"}
                </button>
                <p className="text-gray-400 text-xs text-center">
                  This banner will appear on the website immediately for all visitors.
                </p>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "Oswald, sans-serif" }}>
                <AlertTriangle className="w-5 h-5 text-red-500" />
                ALERT HISTORY
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(stormAlerts ?? []).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-xl border-2"
                    style={{
                      borderColor: alert.isActive ? "#CC2222" : "#E5E7EB",
                      background: alert.isActive ? "#FEF2F2" : "#F9FAFB",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {alert.isActive && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                          <p className="font-bold text-gray-800 text-sm">{alert.title}</p>
                        </div>
                        <p className="text-gray-500 text-xs">{alert.affectedAreas}</p>
                        <p className="text-gray-400 text-xs mt-1">{new Date(alert.createdAt).toLocaleString()}</p>
                      </div>
                      {alert.isActive && (
                        <button
                          onClick={() => deactivateAlert.mutate({ id: alert.id })}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors flex-shrink-0"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {(!stormAlerts || stormAlerts.length === 0) && (
                  <p className="text-gray-400 text-sm text-center py-8">No alerts created yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── ANALYTICS TAB ─── */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Leads", value: stats?.total ?? 0, color: "#1B3A6B", sub: "All time" },
                { label: "Completed Jobs", value: completedCount, color: "#22C55E", sub: "Revenue generating" },
                { label: "Lost Leads", value: lostCount, color: "#EF4444", sub: "Needs follow-up" },
                { label: "Conversion Rate", value: stats?.total ? `${Math.round((completedCount / stats.total) * 100)}%` : "0%", color: "#F59E0B", sub: "Closed/total" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">{s.label}</p>
                  <p className="text-3xl font-black mb-1" style={{ color: s.color, fontFamily: "Oswald, sans-serif" }}>{s.value}</p>
                  <p className="text-gray-400 text-xs">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Damage Type Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4" style={{ fontFamily: "Oswald, sans-serif" }}>LEADS BY DAMAGE TYPE</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {Object.entries(DAMAGE_ICONS).map(([type, icon]) => {
                  const count = leads?.filter((l) => l.damageType === type).length ?? 0;
                  const total = leads?.length ?? 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={type} className="text-center p-3 rounded-xl bg-gray-50">
                      <span className="text-2xl block mb-1">{icon}</span>
                      <p className="text-xs font-semibold text-gray-600 capitalize">{type}</p>
                      <p className="text-lg font-black" style={{ color: "#1B3A6B", fontFamily: "Oswald, sans-serif" }}>{count}</p>
                      <p className="text-gray-400 text-xs">{pct}%</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Automation Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: "Oswald, sans-serif" }}>
                <Zap className="w-5 h-5 text-yellow-500" />
                AI AUTOMATION STATUS
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { name: "AI Chat Widget", status: "active", desc: "Live on website — qualifying leads 24/7" },
                  { name: "Lead Notifications", status: "active", desc: "Owner notified instantly on new submissions" },
                  { name: "Storm Alert System", status: "active", desc: "Banner activates on demand from this dashboard" },
                  { name: "CRM Pipeline", status: "active", desc: "All leads tracked with full activity history" },
                  { name: "SMS/Email Sequences", status: "pending", desc: "Connect Twilio + SendGrid to activate" },
                  { name: "GoHighLevel Sync", status: "pending", desc: "Add GHL API key to enable CRM sync" },
                ].map((item) => (
                  <div key={item.name} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.status === "active" ? "bg-green-500" : "bg-yellow-400"}`}
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-gray-400 text-xs">{item.desc}</p>
                    </div>
                    <span
                      className="ml-auto text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: item.status === "active" ? "#DCFCE7" : "#FEF9C3",
                        color: item.status === "active" ? "#166534" : "#854D0E",
                      }}
                    >
                      {item.status === "active" ? "Active" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
