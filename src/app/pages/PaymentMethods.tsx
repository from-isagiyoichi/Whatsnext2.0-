import { ArrowLeft, CreditCard, Plus, Smartphone, Trash2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

export function PaymentMethods() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("upi-1");

  const [savedMethods, setSavedMethods] = useState([
    {
      id: "upi-1",
      type: "upi",
      title: "Google Pay",
      identifier: "abhiram@oksbi",
      icon: Smartphone,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      id: "card-1",
      type: "card",
      title: "HDFC Bank Debit Card",
      identifier: "**** **** **** 4582",
      icon: CreditCard,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    }
  ]);

  const handleDelete = (id: string) => {
    setSavedMethods(savedMethods.filter(m => m.id !== id));
    toast.success("Payment method removed");
  };

  return (
    <div className="min-h-screen bg-black pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-red-600/10 rounded-full blur-[80px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-white/10">
        <div className="flex items-center gap-4 p-4 max-w-md mx-auto">
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-xl font-bold tracking-wide">Payment Methods</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-8">
        
        {/* UPI Section */}
        <section>
          <div className="flex items-center justify-between mb-4 pl-2">
            <h2 className="text-white font-bold text-lg">UPI Options</h2>
            <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md border border-yellow-500/20 font-medium">Recommended</span>
          </div>

          <div className="space-y-3">
            {savedMethods.filter(m => m.type === "upi").map((method) => (
              <div 
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`relative bg-white/5 rounded-2xl border p-4 transition-all active:scale-98 cursor-pointer ${
                  selectedMethod === method.id 
                    ? "border-yellow-500/50 bg-yellow-500/5" 
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${method.bg} ${method.border} border`}>
                    <method.icon className={`w-5 h-5 ${method.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{method.title}</p>
                    <p className="text-white/50 text-xs">{method.identifier}</p>
                  </div>
                  {selectedMethod === method.id && (
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                    </div>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(method.id);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/20 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all group">
              <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-3 h-3" />
              </div>
              <span className="font-medium text-sm">Add New UPI ID</span>
            </button>
          </div>
        </section>

        {/* Cards & Others */}
        <section>
          <div className="flex items-center gap-3 mb-4 pl-2">
            <h2 className="text-white font-bold text-lg">Credit & Debit Cards</h2>
          </div>

          <div className="space-y-3">
             {savedMethods.filter(m => m.type === "card").map((method) => (
              <div 
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`relative bg-white/5 rounded-2xl border p-4 transition-all active:scale-98 cursor-pointer ${
                  selectedMethod === method.id 
                    ? "border-yellow-500/50 bg-yellow-500/5" 
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${method.bg} ${method.border} border`}>
                    <method.icon className={`w-5 h-5 ${method.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{method.title}</p>
                    <p className="text-white/50 text-xs">{method.identifier}</p>
                  </div>
                  {selectedMethod === method.id && (
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                    </div>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(method.id);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/20 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all group">
              <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-3 h-3" />
              </div>
              <span className="font-medium text-sm">Add New Card</span>
            </button>
          </div>
        </section>

        {/* Info Box */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex gap-3">
          <div className="w-1.5 h-full bg-red-500 rounded-full shrink-0" />
          <p className="text-white/60 text-xs leading-relaxed">
            Your payment details are encrypted and secured. We do not store your CVV or PIN numbers.
          </p>
        </div>
      </div>
    </div>
  );
}