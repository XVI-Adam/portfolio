import { useState, useEffect } from "react";
import { Zap, Heart } from "lucide-react";

export default function GemShop() {
  const [userGems, setUserGems] = useState(0);
  const [userId] = useState(`user_${Math.random().toString(36).slice(2, 9)}`);
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState({ recent_tips: [], top_tippers: [] });

  useEffect(() => {
    fetch(`/api/user-gems/${userId}`)
      .then(r => r.json())
      .then(data => setUserGems(data.total_gems))
      .catch(console.error);

    fetch("/api/tip-history?limit=10")
      .then(r => r.json())
      .then(setTips)
      .catch(console.error);
  }, [userId]);

  const handleCheckout = async (type: "gems" | "tip", packageName?: string, amount?: number) => {
    setLoading(true);
    try {
      const payload =
        type === "gems"
          ? { type: "gems", package: packageName, user_id: userId }
          : { type: "tip", amount, user_id: userId };

      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert("Failed to create checkout. See console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2">💎 Gem Shop</h1>
          <p className="text-xl text-gray-300">Support the platform & collect gems</p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8 text-center">
          <div className="text-6xl mb-2">💎</div>
          <p className="text-gray-300 mb-2">Your Gems</p>
          <p className="text-4xl font-bold">{userGems.toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-2">ID: {userId}</p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Gem Packages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "starter", gems: 100, price: "$4.99", icon: "✨" },
              { name: "power", gems: 250, price: "$9.99", icon: "⚡" },
              { name: "legendary", gems: 750, price: "$24.99", icon: "👑" },
            ].map((pkg) => (
              <div
                key={pkg.name}
                className="bg-white/10 backdrop-blur rounded-lg p-6 hover:bg-white/20 transition"
              >
                <p className="text-4xl mb-2">{pkg.icon}</p>
                <p className="text-2xl font-bold mb-1">{pkg.gems}</p>
                <p className="text-gray-300 mb-4">gems</p>
                <p className="text-3xl font-bold mb-6">{pkg.price}</p>
                <button
                  onClick={() => handleCheckout("gems", pkg.name as any)}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded py-2 font-semibold transition"
                >
                  {loading ? "Processing..." : "Buy Now"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500" /> Support with Tips
          </h2>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <p className="text-gray-300 mb-4">Send a custom tip to support the platform</p>
            <div className="flex gap-3 flex-wrap">
              {[100, 500, 1000, 2500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleCheckout("tip", undefined, amount)}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded font-semibold transition"
                >
                  ${(amount / 100).toFixed(2)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {tips.top_tippers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Top Supporters</h2>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="space-y-2">
                {tips.top_tippers.map((tipper, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                    <span className="text-gray-300">#{i + 1} {tipper.user_id}</span>
                    <span className="font-bold">${tipper.total_usd}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center text-gray-400 text-sm">
          <p>✅ Webhook configured: https://verticalsushi.zo.space/api/stripe-webhook</p>
        </div>
      </div>
    </div>
  );
}