import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ArrowUpRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function CareerNode({ data }: any) {
  const {
    jobTitle,
    jobDescription,
    timeline,
    salary,
    difficulty,
    connectPosition,
    workRequired,
    aboutTheRole,
    whyItsagoodfit,
    roadmap,
  } = data;

  const position = connectPosition === 'top' ? Position.Top : Position.Bottom;

  const diffStyles: any = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    medium: 'bg-amber-50 text-amber-700 border-amber-100',
    high: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  const currentDiff = difficulty?.toLowerCase() || 'medium';

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* FIXED SIZE CARD: 400px by 190px */}
        <div className="relative w-[400px] h-[190px] p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all cursor-pointer overflow-hidden flex flex-col justify-between group">
          <div className={`absolute top-0 left-0 w-full h-1.5 ${currentDiff === 'high' ? 'bg-rose-400' : currentDiff === 'low' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <Handle type="target" position={position} className="!bg-blue-400 !border-none !w-2 !h-2" />
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest ${diffStyles[currentDiff]}`}>{difficulty}</span>
            <div className="p-1.5 rounded-full bg-black text-white group-hover:bg-blue-600 transition-colors">
              <ArrowUpRight size={14} />
            </div>
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter leading-[0.9] uppercase italic mb-2">{jobTitle}</h1>
          <p className="text-[10px] text-gray-400 font-medium leading-tight line-clamp-2 italic mb-4">{jobDescription}</p>
          <div className="flex justify-between items-end pt-3 border-t border-gray-50 mt-auto">
            <div><p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Timeline</p><p className="text-[11px] font-black text-gray-800 italic uppercase leading-none">{timeline}</p></div>
            <div className="text-right"><p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Est. Salary</p><p className="text-[11px] font-black text-blue-600 italic uppercase leading-none">{salary}</p></div>
          </div>
          <Handle type="source" position={position === Position.Top ? Position.Bottom : Position.Top} className="!bg-blue-400 !border-none !w-2 !h-2" />
        </div>
      </DialogTrigger>

      {/* --- RE-STYLED DIALOG CONTENT --- */}
      <DialogContent className="sm:max-w-[1100px] w-11/12 h-[90vh] rounded-[3.5rem] p-0 overflow-hidden border-none shadow-2xl bg-[#F8F9FA] flex flex-col">
        
        {/* FIXED HEADER: Separates Title from Commitment clearly */}
        <div className="p-12 pb-8 bg-white border-b border-gray-100 shrink-0">
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-8 space-y-4">
              <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none text-gray-900 break-words">
                {jobTitle}
              </h1>
              <div className="flex gap-2">
                <span className="bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{timeline}</span>
                <span className="bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{salary}</span>
                <span className={`${diffStyles[currentDiff]} border rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest`}>{difficulty}</span>
              </div>
            </div>
            <div className="col-span-4 text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1 leading-none">Weekly Commitment</p>
              <h2 className="text-xl font-black italic text-gray-800 leading-tight">
                {workRequired || "High Demand & Scaling"}
              </h2>
            </div>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-12 pt-8 custom-scrollbar">
          <div className="grid grid-cols-12 gap-10">
            {/* Left Column: Role Info */}
            <div className="col-span-4 space-y-10">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4 font-bold">Role Overview</h2>
                <p className="text-gray-600 text-sm leading-relaxed font-medium italic">
                  {aboutTheRole || jobDescription}
                </p>
              </div>

              <div className="px-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 font-bold">Why it fits you</h2>
                <ul className="space-y-4">
                  {(whyItsagoodfit || ["High market demand", "Utilizes your current skills", "Long-term stability"])?.map((reason: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-sm font-bold text-gray-700 italic">
                      <span className="text-blue-500 mt-0.5">→</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Roadmap */}
            <div className="col-span-8 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-10 flex items-center gap-4">
                Execution Roadmap <div className="h-px flex-grow bg-gray-100" />
              </h2>
              
              <div className="space-y-10">
                {roadmap?.map((step: any, index: number) => {
                  const weekRange = Object.keys(step)[0];
                  const task = Object.values(step)[0] as string;
                  return (
                    <div key={index} className="flex gap-8 group">
                      <div className="min-w-[140px] text-blue-600 font-black italic uppercase text-sm tracking-tighter pt-0.5 transition-transform group-hover:translate-x-1">
                        {weekRange}
                      </div>
                      <div className="text-gray-600 text-[15px] leading-relaxed font-medium border-l-2 border-gray-100 pl-8 pb-1">
                        {task}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CareerNode);