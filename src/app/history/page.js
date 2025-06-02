import { Suspense } from "react";
import CampaignHistoryPage from "@/components/CampaignHistoryPage";

export default function CampaignHistory() {
  return <Suspense>
    <CampaignHistoryPage/>
  </Suspense>
}