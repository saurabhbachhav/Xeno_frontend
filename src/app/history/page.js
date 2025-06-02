"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ── CampaignCard ──
function CampaignCard({ campaign }) {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState(null);
  console.log(campaign);
 const router = useRouter();
  useEffect(() => {
    // Only fetch stats if user is authenticated
    if (status === "authenticated") {
      fetch(`http://localhost:5000/api/campaigns/${campaign._id}/stats`)
        .then((res) => res.json())
        .then(setStats)
        .catch((err) => {
          console.error("Failed to fetch stats:", err);
          setStats(null);
        });
    }
  }, [campaign._id, status]);

  const handleOnClick=() => {
    router.push(`/campaign_detail_page?id=${campaign._id}`);
  }
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-gray-500">Loading stats...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div
        className="flex items-center justify-center h-32">
        <p className="text-red-500">Access Denied. Please sign in.</p>
      </div>
    );
  }

  return (
    <li
      onClick={handleOnClick}
      className="relative bg-white border-l-4 border-teal-600 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 overflow-hidden"
    >
      {/* Left Accent Bar */}
      <div className="absolute inset-y-0 left-0 w-1 bg-teal-600" />

      <div className="p-6 flex flex-col h-full ml-2">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {campaign.name}
          </h2>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {new Date(campaign.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Rules */}
        <div className="mt-4 flex-1">
          <p className="text-sm font-medium text-gray-700 mb-2">Rules:</p>
          <div className="flex flex-wrap gap-2">
            {campaign.rules.map((r, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-800 text-xs font-medium rounded-full"
              >
                <span className="font-semibold">{r.field}</span>
                <span className="mx-1">{r.operator}</span>
                <span>{r.value}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Delivery Stats:
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <p className="text-xs text-gray-600">Sent / Total</p>
                  <p className="font-semibold text-gray-900">
                    {stats.sent} / {stats.total}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
                <div>
                  <p className="text-xs text-gray-600">Failed</p>
                  <p className="font-semibold text-gray-900">{stats.failed}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

// ── CampaignHistoryPage ──
export default function CampaignHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);

  // Redirect unauthenticated users to the sign-in page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/api/auth/signin");
    }
  }, [status, router]);

  // Fetch campaigns after confirming the user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetch("http://localhost:5000/api/campaigns")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCampaigns(data);
          } else if (Array.isArray(data.campaigns)) {
            setCampaigns(data.campaigns);
          } else {
            console.error("Invalid response format:", data);
            setCampaigns([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch campaigns:", err);
          setCampaigns([]);
        });
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  // If no session, render nothing (redirect is already happening)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-teal-800 mb-10 text-center">
          Campaign History
        </h1>

        {campaigns.length === 0 ? (
          <p className="text-center text-gray-600 mt-12">No campaigns found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((c) => (
              <CampaignCard key={c._id} campaign={c} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
