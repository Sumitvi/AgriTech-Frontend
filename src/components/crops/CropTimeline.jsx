import { Sprout, Activity, Shovel, CheckCircle2 } from "lucide-react";

const CropTimeline = ({ currentStage = "GROWING" }) => {
  // Logic to determine progress percentage and active states
  const stages = [
    { id: "SOWING", label: "Sowing", icon: Sprout, color: "bg-blue-500" },
    { id: "GROWING", label: "Growing", icon: Activity, color: "bg-emerald-500" },
    { id: "HARVEST", label: "Harvest", icon: Shovel, color: "bg-amber-500" },
  ];

  const currentIdx = stages.findIndex((s) => s.id === currentStage);
  const progressPercent = ((currentIdx + 0.5) / stages.length) * 100;

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-5">
         <Activity size={120} className="text-slate-900" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Seasonal Progress</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live lifecycle tracking</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
           <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-xs font-black text-emerald-700 font-mono">66% COMPLETE</span>
        </div>
      </div>

      {/* 🔹 Stepper Container */}
      <div className="relative pt-4 pb-8 px-2 z-10">
        {/* Gray Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
        
        {/* Animated Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Nodes */}
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const isCompleted = index < currentIdx;
            const isCurrent = index === currentIdx;
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="flex flex-col items-center group">
                <div className={`
                  relative z-20 h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4
                  ${isCurrent ? `${stage.color} text-white shadow-xl scale-125 border-white` : ''}
                  ${isCompleted ? 'bg-emerald-500 text-white border-white shadow-md' : ''}
                  ${!isCurrent && !isCompleted ? 'bg-white text-slate-300 border-slate-50' : ''}
                `}>
                  {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  
                  {/* Tooltip-style label */}
                  <div className={`
                    absolute -bottom-10 whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-colors
                    ${isCurrent ? 'text-slate-900' : 'text-slate-400'}
                  `}>
                    {stage.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic text-center">
          "Currently in the <span className="text-emerald-600 font-bold">Growing Phase</span>. 
          Expect harvest readiness in approximately <span className="text-slate-800 font-bold">45 days</span>."
        </p>
      </div>
    </div>
  );
};

export default CropTimeline;