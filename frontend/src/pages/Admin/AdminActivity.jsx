import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Download, RefreshCcw, Shield, Wrench } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const AdminActivity = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [entity, setEntity] = useState("");
  const [action, setAction] = useState("");

  const [bulkEntity, setBulkEntity] = useState("internships");
  const [bulkAction, setBulkAction] = useState("close");
  const [bulkIds, setBulkIds] = useState("");

  const fetchLogs = async (targetPage = page) => {
    setLoading(true);
    try {
      const { data } = await api.get("/audit-logs", {
        params: {
          page: targetPage,
          limit: 20,
          entity: entity || undefined,
          action: action || undefined
        }
      });
      setLogs(data.items || []);
      setPages(data.pagination?.pages || 1);
      setPage(data.pagination?.page || targetPage);
    } catch (error) {
      toast.error("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [entity, action]);

  const handleExport = async (target) => {
    try {
      const { data } = await api.get(`/admin-tools/export/${target}`, { responseType: "blob" });
      const file = new Blob([data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${target}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`${target} exported`);
    } catch (error) {
      toast.error(`Failed to export ${target}`);
    }
  };

  const runBulkAction = async () => {
    const ids = bulkIds
      .split(/[\n,\s]+/)
      .map((x) => x.trim())
      .filter(Boolean);

    if (!ids.length) {
      toast.error("Add at least one ID");
      return;
    }

    try {
      const { data } = await api.post("/admin-tools/bulk", {
        entity: bulkEntity,
        action: bulkAction,
        ids
      });
      toast.success(`Bulk action completed (${data.modifiedCount || 0})`);
      setBulkIds("");
      fetchLogs(1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Bulk action failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0b1120]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="text-cyan-400" size={22} />
          <h2 className="text-2xl font-black text-white">Admin Activity</h2>
        </div>
        <p className="text-xs text-slate-400">Audit trail, exports, and bulk admin operations.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[#0b1120]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5">
          <div className="flex flex-wrap gap-3 mb-4">
            <select value={entity} onChange={(e) => setEntity(e.target.value)} className="bg-[#1e293b] border border-white/10 rounded-xl p-3 text-sm text-white">
              <option value="">All entities</option>
              <option value="courses">courses</option>
              <option value="internships">internships</option>
              <option value="users">users</option>
              <option value="certificates">certificates</option>
              <option value="admin-tools">admin-tools</option>
            </select>
            <select value={action} onChange={(e) => setAction(e.target.value)} className="bg-[#1e293b] border border-white/10 rounded-xl p-3 text-sm text-white">
              <option value="">All actions</option>
              <option value="create">create</option>
              <option value="update">update</option>
              <option value="delete">delete</option>
              <option value="bulk">bulk</option>
              <option value="export">export</option>
            </select>
            <button onClick={() => fetchLogs(page)} className="px-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <RefreshCcw size={14} /> Refresh
            </button>
          </div>

          <div className="overflow-auto max-h-[560px] rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1e293b] text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Entity</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Path</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {!loading && logs.map((log) => (
                  <tr key={log._id} className="border-t border-white/5 text-slate-200">
                    <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-3">{log.actor?.name || log.actorEmail || "-"}</td>
                    <td className="p-3">{log.entity || "-"}</td>
                    <td className="p-3">{log.action || "-"}</td>
                    <td className="p-3">{log.path}</td>
                    <td className="p-3">{log.statusCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && logs.length === 0 && (
              <div className="p-6 text-center text-slate-500">No logs found.</div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <button disabled={page <= 1} onClick={() => fetchLogs(page - 1)} className="px-3 py-2 rounded-lg border border-white/10 text-slate-300 disabled:opacity-40">Prev</button>
            <span className="text-xs text-slate-400">Page {page} / {pages}</span>
            <button disabled={page >= pages} onClick={() => fetchLogs(page + 1)} className="px-3 py-2 rounded-lg border border-white/10 text-slate-300 disabled:opacity-40">Next</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0b1120]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5">
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <Download size={14} className="text-emerald-400" /> CSV Export
            </h3>
            <div className="space-y-3">
              <button onClick={() => handleExport("users")} className="w-full rounded-xl p-3 bg-[#1e293b] text-slate-200 text-xs font-bold uppercase tracking-widest">Export Users</button>
              <button onClick={() => handleExport("enrollments")} className="w-full rounded-xl p-3 bg-[#1e293b] text-slate-200 text-xs font-bold uppercase tracking-widest">Export Enrollments</button>
              <button onClick={() => handleExport("certificates")} className="w-full rounded-xl p-3 bg-[#1e293b] text-slate-200 text-xs font-bold uppercase tracking-widest">Export Certificates</button>
            </div>
          </div>

          <div className="bg-[#0b1120]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5">
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <Wrench size={14} className="text-amber-400" /> Bulk Action
            </h3>
            <div className="space-y-3">
              <select value={bulkEntity} onChange={(e) => setBulkEntity(e.target.value)} className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 text-sm text-white">
                <option value="internships">internships</option>
                <option value="courses">courses</option>
                <option value="users">users</option>
                <option value="certificates">certificates</option>
              </select>
              <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 text-sm text-white">
                <option value="delete">delete</option>
                <option value="activate">activate (internships)</option>
                <option value="close">close (internships)</option>
                <option value="revoke">revoke (certificates)</option>
              </select>
              <textarea
                value={bulkIds}
                onChange={(e) => setBulkIds(e.target.value)}
                rows={6}
                placeholder="Paste IDs separated by comma/new line"
                className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 text-xs text-white"
              />
              <button onClick={runBulkAction} className="w-full rounded-xl p-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-widest">
                Run Bulk Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActivity;
