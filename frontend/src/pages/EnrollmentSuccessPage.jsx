import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import React from "react";

const EnrollmentSuccessPage = ({ course }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const title = course?.title || location.state?.title || "Program";
  const duration = course?.duration || "Standard";
  const level = course?.level || "Professional";

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 lg:p-10 relative overflow-hidden">
      {/* Bg elements similar to other application pages */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative bg-white/80 backdrop-blur-2xl border border-slate-200 rounded-[2.5rem] shadow-2xl p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-8 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <CheckCircle size={40} />
        </div>

        <h1 className="text-3xl font-black mb-4 text-slate-900 uppercase tracking-tight">Application Confirmed!</h1>
        <p className="text-gray-400 mb-8 font-medium">Your request for the program below has been safely received.</p>

        <div className="text-left mb-10 space-y-4">
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black tracking-widest text-indigo-400 uppercase mb-1">Target Program</p>
            <p className="text-slate-900 font-bold">{title}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black tracking-widest text-indigo-400 uppercase mb-1">Duration</p>
              <p className="text-slate-900 font-bold text-sm">{duration}</p>
            </div>
            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black tracking-widest text-indigo-400 uppercase mb-1">Intensity</p>
              <p className="text-slate-900 font-bold text-sm">{level}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 active:scale-95"
        >
          Return to Command Center
        </button>
      </div>
    </div>
  );
};


export default EnrollmentSuccessPage;
