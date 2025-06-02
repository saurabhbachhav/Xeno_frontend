"use client";

import React from "react";
import CampaignLogs from "@/components/CampaignLogs";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const ClientCampaignPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-700">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin w-5 h-5 text-teal-600" />
          <span>Loading campaign...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-800 mb-6">
          📊 Campaign Delivery Details
        </h1>
        <CampaignLogs campaignId={id} />
      </div>
    </div>
  );
};

export default ClientCampaignPage;
