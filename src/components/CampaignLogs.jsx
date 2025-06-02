"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react"; // Optional: install lucide-react

function CampaignLogs({ campaignId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `https://xeno-backend-cfod.onrender.com/api/campaigns/${campaignId}/logs`
        );
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [campaignId]);

  const renderStatus = (status) => {
    const base =
      "px-2 py-1 rounded-full text-xs font-medium inline-flex items-center";
    switch (status) {
      case "SENT":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>✅ SENT</span>
        );
      case "FAILED":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>❌ FAILED</span>
        );
      default:
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            ⏳ PENDING
          </span>
        );
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-6 text-teal-800 flex items-center gap-2">
        📬 Delivery Logs
      </h2>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500 flex justify-center items-center gap-2">
            <Loader2 className="animate-spin w-5 h-5" /> Loading logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No communication logs found for this campaign.
          </div>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead className="bg-teal-100 text-teal-800 text-left text-sm">
              <tr>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 text-gray-700">{log.customerId}</td>
                  <td className="px-6 py-3 text-gray-600">{log.message}</td>
                  <td className="px-6 py-3">{renderStatus(log.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CampaignLogs;
