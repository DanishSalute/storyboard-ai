import React, { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResult(data.storyboard || "No response");
    } catch (err) {
      setResult("Error connecting to backend.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center p-6 min-h-screen items-start">
      <div className="w-full max-w-3xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 mt-12">

        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">
          Storyboard AI
        </h1>

        <textarea
          placeholder="Describe your scene or storyline…"
          className="w-full h-40 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 outline-none resize-none focus:border-purple-400 transition"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={generate}
          className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition font-semibold flex justify-center items-center"
        >
          {loading ? (
            <div className="flex gap-2">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-150">●</span>
              <span className="animate-pulse delay-300">●</span>
            </div>
          ) : (
            "Generate"
          )}
        </button>

        {result && (
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-gray-200 whitespace-pre-line shadow-lg">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
