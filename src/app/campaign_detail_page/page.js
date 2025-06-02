import { Suspense } from "react";
import ClientCampaignPage from "../../components/ClientCampaignPage";

export default function CampaignDetailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientCampaignPage />
    </Suspense>
  );
}
