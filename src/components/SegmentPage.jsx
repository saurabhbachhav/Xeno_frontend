"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RuleBuilder from "@/components/RuleBuilder";

export default function CreateSegment() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const API_BASE =
  "https://xeno-backend-cfod.onrender.com/" || "http://localhost:5000";

  // Segment state
  const [segmentName, setSegmentName] = useState("");
  const [segmentRules, setSegmentRules] = useState([]);
  const [audienceSize, setAudienceSize] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("https://xeno-backend-cfod.onrender.com/api/auth/signin");
    }
  }, [status, router]);

  // Preview audience based on rules
  const handlePreview = async () => {
    setLoadingPreview(true);
    try {
      const res = await fetch(
        `https://xeno-backend-cfod.onrender.com/api/segments/preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ rules: segmentRules }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAudienceSize(data.audienceSize);
      } else {
        throw new Error(data.error || "Failed to preview audience");
      }
    } catch (err) {
      console.error("Preview Error:", err);
      setAudienceSize(null);
    } finally {
      setLoadingPreview(false);
    }
  };

  // Save segment
  const handleSaveSegment = async (e) => {
    e.preventDefault();
    if (!segmentName.trim()) {
      alert("Please enter a segment name.");
      return;
    }
    setLoadingSave(true);
    try {
      const res = await fetch(
        `https://xeno-backend-cfod.onrender.com/api/segments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            name: segmentName.trim(),
            rules: segmentRules,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert(`Segment "${data.segment.name}" saved!`);
        // Redirect to campaign creation page after saving
        router.push("/create");
      } else {
        throw new Error(data.error || "Failed to save segment");
      }
    } catch (err) {
      alert("Error saving segment: " + err.message);
      console.error(err);
    } finally {
      setLoadingSave(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-teal-600">
        <p className="text-lg">Checking authentication...</p>
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-3xl mx-auto bg-gray-50 border border-teal-200 rounded-3xl shadow-xl p-10 sm:p-12">
        <h1 className="text-4xl font-extrabold text-teal-600 mb-6 text-center">
          🧩 Create New Segment
        </h1>

        <form onSubmit={handleSaveSegment} className="space-y-8">
          {/* Segment Name */}
          <div>
            <label
              htmlFor="segmentName"
              className="block text-lg font-semibold mb-2 text-gray-700"
            >
              Segment Name
            </label>
            <input
              id="segmentName"
              type="text"
              className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              placeholder="e.g. Big Spenders, Inactive 90 Days"
              required
            />
          </div>

          {/* Rule Builder */}
          <div className="bg-white border border-teal-300 rounded-2xl p-6 shadow-sm">
            <label className="block text-md font-semibold text-teal-600 mb-3">
              📝 Define Rules
            </label>
            <RuleBuilder onChange={setSegmentRules} />
          </div>

          {/* Preview Audience Size */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handlePreview}
              className="px-5 py-3 bg-white border border-teal-500 text-teal-600 font-medium rounded-xl shadow hover:bg-teal-50 transition"
              disabled={loadingPreview || segmentRules.length === 0}
            >
              {loadingPreview ? "Calculating..." : "Preview Audience Size"}
            </button>
            {audienceSize !== null && (
              <span className="text-lg font-semibold text-teal-600">
                {audienceSize} users
              </span>
            )}
          </div>

          {/* Save Segment */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-4 rounded-3xl font-bold text-lg shadow-lg transition-transform active:scale-95"
            disabled={loadingSave}
          >
            {loadingSave ? "Saving Segment..." : "✅ Save Segment"}
          </button>
        </form>
      </div>
    </div>
  );
}
