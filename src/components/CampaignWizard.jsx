// components/CampaignWizard.jsx
"use client";

import { useState, useEffect } from "react";
import RuleBuilder from "./RuleBuilder";

export default function CampaignWizard() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ── Segment State ───────────────────────
  const [segmentName, setSegmentName] = useState("");
  const [segmentRules, setSegmentRules] = useState([]);
  const [savedSegment, setSavedSegment] = useState(null); // holds the newly created segment
  const [segmentsList, setSegmentsList] = useState([]); // all saved segments
  const [audienceSize, setAudienceSize] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingSegmentSave, setLoadingSegmentSave] = useState(false);

  // ── Campaign State ──────────────────────
  const [selectedSegmentId, setSelectedSegmentId] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [goal, setGoal] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // ── Load all segments on mount ──────────
  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/segments`);
      const data = await res.json();
      if (res.ok) {
        setSegmentsList(data.segments || []);
      } else {
        console.error("Error fetching segments:", data.error || res.statusText);
      }
    } catch (err) {
      console.error("Network error fetching segments:", err);
    }
  };

  // ── Preview Audience Size ───────────────
  const handlePreviewAudience = async () => {
    setLoadingPreview(true);
    try {
      const res = await fetch(`${API_BASE}/api/segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: segmentRules }),
      });
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

  // ── Save a New Segment ──────────────────
  const handleSaveSegment = async (e) => {
    e.preventDefault();
    if (!segmentName.trim()) {
      alert("Please enter a segment name.");
      return;
    }
    setLoadingSegmentSave(true);
    try {
      const res = await fetch(`${API_BASE}/api/segments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: segmentName.trim(),
          rules: segmentRules,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const { segment } = data;
        setSavedSegment(segment);
        setSelectedSegmentId(segment._id);
        await fetchSegments(); // reload so dropdown updates
        alert(`Segment "${segment.name}" saved!`);
      } else {
        throw new Error(data.error || "Failed to save segment");
      }
    } catch (err) {
      alert("Error saving segment: " + err.message);
      console.error(err);
    } finally {
      setLoadingSegmentSave(false);
    }
  };

  // If user picks a different segment, clear the “just created” flag
  useEffect(() => {
    if (
      selectedSegmentId &&
      savedSegment &&
      savedSegment._id !== selectedSegmentId
    ) {
      setSavedSegment(null);
    }
  }, [selectedSegmentId, savedSegment]);

  // ── AI Suggestions on Goal Change (debounced) ─────────
  useEffect(() => {
    if (!goal.trim()) {
      setSuggestions([]);
      setImageUrl("");
      return;
    }
    const timer = setTimeout(() => {
      fetchSuggestions();
      fetchImage();
    }, 800);
    return () => clearTimeout(timer);
  }, [goal]);

  const fetchSuggestions = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/suggest-messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuggestions(data.messages || []);
        setSelectedMessage(data.messages?.[0] || "");
      } else {
        throw new Error(data.error || "Failed to fetch suggestions");
      }
    } catch (err) {
      console.error("AI Error:", err);
      setSuggestions([]);
    } finally {
      setLoadingAI(false);
    }
  };

  const fetchImage = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ai/suggest-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.url);
      } else {
        throw new Error(data.error || "Image generation failed");
      }
    } catch (err) {
      console.error("Image Error:", err);
      setImageUrl("");
    }
  };

  // ── Save a New Campaign ───────────────────────
  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    if (!selectedSegmentId) {
      alert("Please select a segment first.");
      return;
    }
    if (!campaignName.trim()) {
      alert("Please enter a campaign name.");
      return;
    }
    try {
      const payload = {
        name: campaignName.trim(),
        segmentId: selectedSegmentId,
        message: selectedMessage,
        imageUrl,
      };
      const res = await fetch(`${API_BASE}/api/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Campaign created!");
        console.log("Saved Campaign:", data.campaign);
        // Optionally clear form or redirect to /campaign-history
      } else {
        throw new Error(data.error || "Error saving campaign");
      }
    } catch (err) {
      alert("Failed to save campaign: " + err.message);
      console.error(err);
    }
  };

  // ── RENDER: Show Step 1 if no segment selected; otherwise Step 2 ──
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-3xl mx-auto bg-gray-50 border border-teal-200 rounded-3xl shadow-xl p-10 sm:p-12">
        <h1 className="text-4xl font-extrabold text-teal-600 mb-6 text-center">
          🎯 Campaign Wizard
        </h1>

        {/* ── STEP 1: Create Audience Segment ── */}
        {!selectedSegmentId && (
          <form onSubmit={handleSaveSegment} className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Step 1: Create Audience Segment
            </h2>

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
                🧩 Define Rules
              </label>
              <RuleBuilder onChange={setSegmentRules} />
            </div>

            {/* Preview Audience Size */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handlePreviewAudience}
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
              disabled={loadingSegmentSave}
            >
              {loadingSegmentSave ? "Saving Segment..." : "✅ Save Segment"}
            </button>
          </form>
        )}

        {/* ── STEP 2: Create Campaign ── */}
        {selectedSegmentId && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Step 2: Create Campaign
            </h2>

            {/* Choose Segment */}
            <div>
              <label
                htmlFor="segmentSelect"
                className="block text-lg font-semibold mb-2 text-gray-700"
              >
                Select Audience Segment
              </label>
              <select
                id="segmentSelect"
                className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={selectedSegmentId}
                onChange={(e) => setSelectedSegmentId(e.target.value)}
              >
                <option value="" disabled>
                  -- choose a segment --
                </option>
                {segmentsList.map((seg) => (
                  <option key={seg._id} value={seg._id}>
                    {seg.name}{" "}
                    {seg.audienceSize !== null
                      ? `(${seg.audienceSize} users)`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Campaign Form */}
            <form onSubmit={handleSaveCampaign} className="space-y-6">
              {/* Campaign Name */}
              <div>
                <label
                  htmlFor="campaignName"
                  className="block text-lg font-semibold mb-2 text-gray-700"
                >
                  Campaign Name
                </label>
                <input
                  id="campaignName"
                  type="text"
                  className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign title..."
                  required
                />
              </div>

              {/* Campaign Goal */}
              <div>
                <label
                  htmlFor="goal"
                  className="block text-lg font-semibold mb-2 text-gray-700"
                >
                  Campaign Goal (for AI)
                </label>
                <input
                  id="goal"
                  type="text"
                  className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="e.g. Re-engage inactive users"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />

                {loadingAI && (
                  <p className="mt-2 text-sm text-teal-600 italic font-medium">
                    Generating suggestions...
                  </p>
                )}

                {suggestions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-md font-semibold text-teal-600 mb-2">
                      💡 Suggested Messages:
                    </p>
                    <ul className="space-y-3 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-gray-100 border border-teal-200 rounded-lg p-3 bg-white">
                      {suggestions.map((msg, idx) => (
                        <li
                          key={idx}
                          onClick={() => setSelectedMessage(msg)}
                          className={`cursor-pointer px-4 py-2 rounded-lg border transition ${
                            selectedMessage === msg
                              ? "bg-teal-500 text-white font-semibold shadow-md"
                              : "bg-gray-100 hover:bg-teal-100 text-gray-800"
                          }`}
                        >
                          {msg}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Suggested Image */}
              {imageUrl && (
                <div className="mt-6 text-center">
                  <p className="text-md font-semibold text-teal-600 mb-3">
                    🖼️ Suggested Image:
                  </p>
                  <img
                    src={imageUrl}
                    alt="Suggested"
                    className="inline-block max-w-xs rounded-2xl border border-gray-300 shadow-md"
                  />
                </div>
              )}

              {/* Save Campaign */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-4 rounded-3xl font-bold text-lg shadow-lg transition-transform active:scale-95"
              >
                ✅ Save Campaign
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
