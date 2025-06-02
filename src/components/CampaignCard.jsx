import CampaignCard from "@/components/CampaignCard"; // Ensure this is the styled version shared earlier

const dummyCampaigns = [
  {
    _id: "1",
    name: "Welcome Campaign",
    createdAt: new Date().toISOString(),
    rules: [
      { field: "age", operator: ">", value: "25" },
      { field: "country", operator: "==", value: "USA" },
    ],
  },
  {
    _id: "2",
    name: "Re-engagement Campaign",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // yesterday
    rules: [
      { field: "lastLoginDays", operator: ">", value: "30" },
      { field: "subscribed", operator: "==", value: "true" },
    ],
  },
  {
    _id: "3",
    name: "Holiday Special",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // two days ago
    rules: [{ field: "location", operator: "==", value: "Canada" }],
  },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Campaign History
        </h1>

        {/* If no campaigns exist, show a friendly empty state */}
        {dummyCampaigns.length === 0 ? (
          <p className="text-center text-gray-600 mt-12">No campaigns found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyCampaigns.map((c) => (
              <CampaignCard key={c._id} campaign={c} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
