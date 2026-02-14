import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';

type CareerNodeProps = {
  jobTitle?: string;
  jobDescription?: string;
  timeline?: string;
  salary?: string;
  difficulty?: string;
  connectPosition?: string;
  label?: string;
  workRequired?: string;
  aboutTheRole?: string;
  whyItsagoodfit?: string[];
  roadmap?: { [key: string]: string }[];
};

function CareerNode({ data }: NodeProps<CareerNodeProps>) {
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
        <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
          <div className="relative p-6 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-w-[320px] overflow-hidden">
            {/* Subtle Gradient Accent */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${currentDiff === 'high' ? 'bg-rose-400' : currentDiff === 'low' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            
            <Handle type="target" position={position} className="!bg-gray-300 !border-none !w-2 !h-2" />
            
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight uppercase italic">{jobTitle}</h1>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border uppercase tracking-wider ${diffStyles[currentDiff]}`}>
                {difficulty}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-6 line-clamp-2 font-medium">
              {jobDescription}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Timeline</p>
                <p className="text-sm font-bold text-gray-800">{timeline}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Salary</p>
                <p className="text-sm font-bold text-gray-800">{salary}</p>
              </div>
            </div>

            <Handle type="source" position={position === Position.Top ? Position.Bottom : Position.Top} className="!bg-gray-300 !border-none !w-2 !h-2" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl rounded-[3rem] p-10">
        <DialogHeader>
          <DialogTitle className='flex justify-between'>
            <div className='flex items-center gap-3'>
              <span className='text-2xl'>{jobTitle ?? 'SEO Specialist'}</span>
              <span className='border rounded-3xl border-gray-200 px-3 py-1 text-sm'>
                {timeline}
              </span>
              <span className='border rounded-3xl border-gray-200 px-3 py-1 text-sm'>
                {salary}
              </span>
              <span
                className={`border rounded-3xl border-gray-200 px-3 py-1 text-sm font-semibold ${
                  difficulty?.toLowerCase() == 'low'
                    ? 'text-green-600'
                    : difficulty?.toLowerCase() == 'high'
                    ? 'text-red-600'
                    : 'text-orange-600'
                } text-lg`}
              >
                {difficulty}
              </span>
            </div>
            <div className='flex items-center gap-3 mr-5'>
              <div className='font-bold'>Work Required:</div>
              <span className='border rounded-3xl border-gray-200 px-3 py-1 text-sm'>
                {workRequired ?? '10-20 hrs/week'}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className='flex gap-7 border-t border-black pt-6'>
          <div className='flex flex-col gap-4 w-2/5'>
            <div>
              <h2 className='text-lg font-semibold mb-2'>
                What's a {jobTitle}?
              </h2>
              <p>
                {aboutTheRole ??
                  `SEO Specialists optimize websites to rank higher in search
                engine results, aiming to increase online visibility, drive
                organic traffic, and improve user engagement. They conduct
                keyword research, analyze competitors, and implement SEO
                strategies that include on-page optimization, link building, and
                content creation.`}
              </p>
            </div>
            <div>
              <h2 className='text-lg font-semibold mb-2 mt-6'>
                Why it's a good fit
              </h2>
              <ul className='list-disc ml-4'>
                {whyItsagoodfit?.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className='w-3/5'>
            <h2 className='text-lg font-semibold mb-2'>Roadmap</h2>
            <div className='flex flex-col gap-2'>
              {roadmap?.map((step, index) => (
                <div key={index} className='flex gap-3'>
                  <div className='font-light min-w-28'>
                    {Object.keys(step)[0]}:
                  </div>
                  <div>{Object.values(step)[0]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CareerNode);
