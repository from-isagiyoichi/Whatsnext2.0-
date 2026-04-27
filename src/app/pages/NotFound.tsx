import { useNavigate } from "react-router";
import { Home } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-red-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="text-center relative z-10">
        <h1 className="text-white text-8xl font-bold mb-4 tracking-wider">404</h1>
        <p className="text-white/60 text-xl mb-8">Page not found</p>
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-500 text-black px-8 py-3 rounded-full flex items-center gap-3 mx-auto font-bold hover:bg-yellow-400 transition-colors active:scale-95 shadow-lg shadow-yellow-500/20"
        >
          <Home className="w-5 h-5" />
          Go Home
        </button>
      </div>
    </div>
  );
}