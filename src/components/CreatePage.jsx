"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import RuleBuilder from "@/components/RuleBuilder"; // (not used here, but assumed for consistency)

export default function CreateCampaign() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const API_BASE =
  "https://xeno-backend-cfod.onrender.com/" || "http://localhost:5000";

  // Campaign state
  const [segmentsList, setSegmentsList] = useState([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [goal, setGoal] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  // const [imageUrl, setImageUrl] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("https://xeno-backend-cfod.onrender.com/api/auth/signin");
    }
  }, [status, router]);

  // Fetch saved segments on mount
  useEffect(() => {
    if (session) {
      fetchSegments();
    }
  }, [session]);

  const fetchSegments = async () => {
    try {
      const res = await fetch(
        `https://xeno-backend-cfod.onrender.com/api/segments`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setSegmentsList(data.segments || []);
        // Preselect the newest segment if none selected
        if (data.segments.length && !selectedSegmentId) {
          setSelectedSegmentId(data.segments[0]._id);
        }
      } else {
        console.error("Error fetching segments:", data.error || res.statusText);
      }
    } catch (err) {
      console.error("Network error fetching segments:", err);
    }
  };

  // AI suggestions when goal changes
  useEffect(() => {
    if (!goal.trim()) {
      setSuggestions([]);
      // setImageUrl("");
      return;
    }
    const timer = setTimeout(() => {
      fetchSuggestions();
      // fetchImage();
    }, 800);
    return () => clearTimeout(timer);
  }, [goal]);

  const fetchSuggestions = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch(
        `https://xeno-backend-cfod.onrender.com/api/ai/suggest-messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ goal }),
        }
      );
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

  // const fetchImage = async () => {
  //   try {
  //     const res = await fetch(`${API_BASE}/api/ai/suggest-image`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${session.accessToken}`,
  //       },
  //       body: JSON.stringify({ goal }),
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       setImageUrl(data.url);
  //     } else {
  //       throw new Error(data.error || "Image generation failed");
  //     }
  //   } catch (err) {
  //     console.error("Image Error:", err);
  //     setImageUrl("");
  //   }
  // };

  // Handle campaign save
  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    if (!selectedSegmentId) {
      alert("Please select a segment.");
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
      };
      const res = await fetch(
        `https://xeno-backend-cfod.onrender.com/api/campaigns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Campaign created!");
        // Redirect to campaign history or clear form
        router.push("history");
      } else {
        throw new Error(data.error || "Error saving campaign");
      }
    } catch (err) {
      alert("Failed to save campaign: " + err.message);
      console.error(err);
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
          📢 Create New Campaign
        </h1>

        <form onSubmit={handleSaveCampaign} className="space-y-8">
          {/* Select Existing Segment */}
          <div>
            <label
              htmlFor="segmentSelect"
              className="block text-lg font-semibold mb-2 text-gray-700"
            >
              Choose Audience Segment
            </label>
            <select
              id="segmentSelect"
              className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={selectedSegmentId}
              onChange={(e) => setSelectedSegmentId(e.target.value)}
            >
              <option value="" disabled>
                -- select a segment --
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

          {/* Suggested Image
          {imageUrl && (
            <div className="mt-6 text-center">
              <p className="text-md font-semibold text-teal-600 mb-3">
                🖼️ Suggested Image:
              </p>
              <img
                src={imageUrl}
                alt="Suggested Graphic"
                className="inline-block max-w-xs rounded-2xl border border-gray-300 shadow-md"
              />
            </div>
          )} */}

          {/* Save Campaign */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-4 rounded-3xl font-bold text-lg shadow-lg transition-transform active:scale-95"
          >
            ✅ Save Campaign
          </button>
        </form>
      </div>
    </div>
  );
}
