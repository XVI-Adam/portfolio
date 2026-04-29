import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function TipsPage() {
  const [customAmount, setCustomAmount] = useState("10.00");
  const [userId] = useState(`user_${Math.random().toString(36).slice(2, 9)}`);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tips, setTips] = useState({ recent_tips: [], top_tippers: [], total_tipped_usd: "0.00" });

  useEffect(() => {
    fetch("/api/tip-history?limit=20")
      .then(r => r.json())
      .then(setTips)
      .catch(console.error);
  }, []);

  const handleTip = async () => {
    const amount = Math.round(parseFloat(customAmount) * 100);
    if (amount < 100) {
      setMessage("Minimum tip is $1.00");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "tip", amount, user_id: userId }),
      });

      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setMessage("Failed to create checkout");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-red-900 to-orange-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-5xl font-bold mb-2">Support Us</h1>
          <p className="text-xl text-gray-300">Your support means the world to us 💝</p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-8 mb-12">
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Tip Amount (USD)</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-3 text-xl">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1.00"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded px-4 py-3 pl-8 text-white placeholder-gray-300 focus:outline-none focus:border-red-400"
                  placeholder="10.00"
                />
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">Minimum: $1.00</p>
          </div>

          {message && (
            <div className="bg-red-500/20 border border-red-500/50 rounded p-3 mb-4 text-sm">
              {message}
            </div>
          )}
          <button
            onClick={handleTip}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded py-3 font-bold text-lg transition flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            {loading ? "Processing..." : `Send Tip $${customAmount}`}
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-12">
          <p className="text-gray-300 text-sm">Total Support Received</p>
          <p className="text-4xl font-bold">${tips.total_tipped_usd}</p>
          <p className="text-gray-400 text-sm mt-2">From {tips.recent_tips.length} generous supporters</p>
        </div>

        {tips.top_tippers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Top Supporters</h2>
            <div className="bg-white/10 backdrop-blur rounded-lg divide-y divide-white/10">
              {tips.top_tippers.map((tipper, i) => (
                <div key={i} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">#{i + 1}</p>
                    <p className="text-sm text-gray-400">{tipper.user_id}</p>
                  </div>
                  <p className="text-2xl font-bold">${tipper.total_usd}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tips.recent_tips.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Tips</h2>
            <div className="bg-white/10 backdrop-blur rounded-lg divide-y divide-white/10 max-h-96 overflow-y-auto">
              {tips.recent_tips.slice(0, 15).map((tip, i) => (
                <div key={i} className="p-4 flex justify-between items-center text-sm">
                  <span className="text-gray-400">{tip.user_id}</span>
                  <span className="font-bold">${tip.amount_usd}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}