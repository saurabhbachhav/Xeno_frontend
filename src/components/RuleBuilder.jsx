"use client";
import { useState } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";

export default function RuleBuilder({ onChange }) {
  const [rules, setRules] = useState([{ field: "", operator: "", value: "" }]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false); // 🆕

  const handleChange = (index, key, value) => {
    const updatedRules = [...rules];
    updatedRules[index][key] = value;
    setRules(updatedRules);
    onChange?.(updatedRules);
  };

  const addRule = () => {
    setRules((prev) => [...prev, { field: "", operator: "", value: "" }]);
  };

  const removeRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
    onChange?.(updatedRules);
  };

  const generateRulesWithAI = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setAiSuccess(false); // 🆕 hide old success message
    try {
      const res = await fetch(
        "https://xeno-backend-cfod.onrender.com/api/nl-to-rule",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: prompt }),
        }
      );

      const data = await res.json();

      if (Array.isArray(data.rules)) {
        setRules(data.rules);
        setAiSuccess(true); // 🆕 show success
        onChange?.(data.rules);
      } else {
        console.error("Invalid response from AI:", data);
        alert("AI didn't return a valid rule list.");
      }
    } catch (err) {
      console.error("AI rule generation failed", err);
      alert("AI rule generation failed.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Prompt input with AI trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
        <textarea
          className="w-full sm:w-auto flex-grow p-3 border border-gray-300 rounded-lg text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          rows={2}
          placeholder='e.g. "Customers who haven’t purchased in 3 months and spent over ₹5K"'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={generateRulesWithAI}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md shadow hover:bg-indigo-700 transition disabled:opacity-60"
        >
          <Sparkles size={16} />
          {loading ? "Generating..." : "AI Convert"}
        </button>
      </div>

      {/* 🆕 AI success message */}
      {aiSuccess && (
        <div className="text-green-600 text-sm font-medium">
          ✅ Rules generated from AI
        </div>
      )}

      {/* Rules list */}
      {rules.map((rule, i) => (
        <div
          key={i}
          className="flex flex-wrap items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-md"
        >
          <select
            className="min-w-[130px] px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={rule.field}
            onChange={(e) => handleChange(i, "field", e.target.value)}
          >
            <option value="">Select Field</option>
            <option value="spend">Spend</option>
            <option value="visits">Visits</option>
            <option value="inactiveDays">Inactive Days</option>
            <option value="lastPurchaseDate">Last Purchase Date</option>
            <option value="totalSpent">Total Spent</option>
          </select>

          <select
            className="min-w-[120px] px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={rule.operator}
            onChange={(e) => handleChange(i, "operator", e.target.value)}
          >
            <option value="">Operator</option>
            <option value=">">Greater Than</option>
            <option value="<">Less Than</option>
            <option value="=">Equals</option>
            <option value="older_than">Older Than</option>
            <option value="greater_than">Greater Than</option>
          </select>

          <input
            className="w-28 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Value"
            value={rule.value}
            onChange={(e) => handleChange(i, "value", e.target.value)}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => removeRule(i)}
              className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
            >
              <Trash2 size={16} />
              Remove
            </button>

            {i === rules.length - 1 && (
              <button
                type="button"
                onClick={addRule}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
              >
                <Plus size={16} />
                Add Rule
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
