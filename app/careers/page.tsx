'use client';

import toast, { Toaster } from 'react-hot-toast';
import CareerNode from '@/components/CareerNode';
import { uploaderOptions } from '@/lib/utils';
import { UrlBuilder } from '@bytescale/sdk';
import { UploadDropzone } from '@bytescale/upload-widget-react';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Added this
import ReactFlow, {
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { Node, NodeTypes } from 'reactflow';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import LoadingDots from '@/components/ui/loadingdots';
import { finalCareerInfo } from '@/lib/types';

const nodeTypes = {
  careerNode: CareerNode,
} satisfies NodeTypes;

const initialNodes = [
  {
    id: '1',
    position: { x: 650, y: 450 },
    data: { label: 'Careers' },
    // Styled the center node to look more modern
    style: { 
        background: '#000', 
        color: '#fff', 
        fontSize: '14px', 
        fontWeight: 'bold', 
        borderRadius: '12px', 
        padding: '10px',
        border: 'none',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
  },
  {
    id: '2',
    type: 'careerNode',
    position: { x: 50, y: 550 },
    data: {
      jobTitle: 'SEO Specialist',
      jobDescription: `Uses research to improve a website's ranking in search engine results`,
      timeline: '2-3 months',
      salary: '$59k - $77k',
      difficulty: 'Low',
      connectPosition: 'top',
    },
  },
  {
    id: '3',
    type: 'careerNode',
    position: { x: 1050, y: 550 },
    data: {
      jobTitle: 'UX Designer',
      jobDescription:
        'Creates user-centered design solutions to improve product usability and user experience.',
      timeline: '3-6 months',
      salary: '$85k - $110k',
      difficulty: 'Medium',
      connectPosition: 'top',
    },
  },
  {
    id: '4',
    type: 'careerNode',
    position: { x: 50, y: 150 },
    data: {
      jobTitle: 'Digital Marketing Specialist',
      jobDescription:
        'Develops online marketing campaigns to drive business growth.',
      timeline: '2-4 months',
      salary: '$50k - $70k',
      difficulty: 'Low',
      connectPosition: 'bottom',
    },
  },
  {
    id: '5',
    type: 'careerNode',
    position: { x: 1050, y: 150 },
    data: {
      jobTitle: 'Software Engineer',
      jobDescription:
        'Designs, develops, and tests software applications to meet business needs.',
      timeline: '6-12 months',
      salary: '$100k - $140k',
      difficulty: 'High',
      connectPosition: 'bottom',
    },
  },
  {
    id: '6',
    type: 'careerNode',
    position: { x: 550, y: 700 },
    data: {
      jobTitle: 'Cybersecurity Specialist',
      jobDescription:
        'Protects computer systems and networks from cyber threats by developing and implementing security protocols.',
      timeline: '6-12 months',
      salary: '$80k - $120k',
      difficulty: 'High',
      connectPosition: 'top',
    },
  },
  {
    id: '7',
    type: 'careerNode',
    position: { x: 550, y: 0 },
    data: {
      jobTitle: 'Business Analyst',
      jobDescription:
        'Analyzes business needs and develops solutions to improve operations and processes.',
      timeline: '3-6 months',
      salary: '$65k - $90k',
      difficulty: 'Medium',
      connectPosition: 'bottom',
    },
  },
] satisfies Node[];

// Updated edges to be blue/animated by default
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e1-4', source: '1', target: '4', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e1-5', source: '1', target: '5', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e1-6', source: '1', target: '6', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e1-7', source: '1', target: '7', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
];

export default function Start() {
  const [_, setName] = useState('');
  const [url, setUrl] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [careerInfo, setCareerInfo] = useState<finalCareerInfo[]>([]);
  const [additionalContext, setAdditionalContext] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === '1') {
          node.data = { label: 'Careers' };
        } else {
          let realdata = careerInfo[Number(node.id) - 2];
          if (realdata) {
             node.data = { ...realdata, connectPosition: (node.id === '2' || node.id === '3' || node.id === '6') ? 'top' : 'bottom' };
          }
        }
        return node;
      })
    );
  }, [careerInfo, setNodes]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const notify = () => toast.error('Failed to generate, please try again.');

  async function parsePdf() {
    setLoading(true);
    try {
        let response = await fetch('/api/parsePdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeUrl: url }),
          });
          let data = await response.json();
      
          let response2 = await fetch('/api/getCareers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resumeInfo: data,
              context: additionalContext,
            }),
          });
      
          if (!response2.ok) throw new Error();
      
          let data2 = await response2.json();
          setCareerInfo(data2);
    } catch (e) {
        notify();
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {careerInfo.length !== 0 ? (
        <div className='w-screen h-screen mx-auto relative overflow-hidden'> 
          {/* Dashboard Sidebar Overlay */}
          <div className="absolute top-24 left-10 z-10 w-72 space-y-4 pointer-events-none">
            <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="p-6 bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2rem] border border-white/50 pointer-events-auto"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Intelligence Active</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-black text-gray-900 tracking-tighter italic">06</div>
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Strategic Paths mapped</div>
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[85%] rounded-full" />
                </div>
                <p className="text-[11px] leading-relaxed text-gray-600 font-medium italic">
                  "Analysis complete. Your experience suggests a 92% match for technical leadership and product strategy roles."
                </p>
              </div>
            </motion.div>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            {/* Modern Radial Background */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </ReactFlow>
        </div>
      ) : (
        <div className='relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-white'>
            {/* Mesh Background */}
            <div className="absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 [background:radial-gradient(60%_50%_at_50%_0%,#f8f8f8_0%,white_100%)]"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='max-w-4xl w-full space-y-10 py-10'
            >
                <div className='text-center space-y-4'>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]"
                    >
                        Phase 01: Data Input
                    </motion.div>
                    
                    <h1 className='text-6xl sm:text-8xl font-black text-gray-900 tracking-tighter italic uppercase leading-[0.8]'>
                        Upload your <span className="text-blue-600 text-stroke-white">Resume</span>
                    </h1>
                    
                    <p className='text-gray-400 font-medium max-w-xl mx-auto text-sm leading-relaxed'>
                        Our AI agents require your professional history to map your future growth. 
                        PDF resumes yield the highest accuracy.
                    </p>
                </div>

                <div className='bg-white/70 backdrop-blur-2xl border border-white shadow-[0_30px_60px_rgba(0,0,0,0.06)] rounded-[3rem] p-4 sm:p-10 space-y-8'>
                    <div className="overflow-hidden rounded-[2rem] border-2 border-dashed border-gray-100 hover:border-blue-200 transition-all duration-500 bg-gray-50/30">
                        <UploadDropzone
                            options={uploaderOptions}
                            onUpdate={({ uploadedFiles }) => {
                                if (uploadedFiles.length !== 0) {
                                    const file = uploadedFiles[0];
                                    setUrl(UrlBuilder.url({ accountId: file.accountId, filePath: file.filePath }));
                                    setName(file.originalFile.file.name);
                                }
                            }}
                            width='100%'
                            height='280px'
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-4">
                            Specific Interests
                        </label>
                        <Textarea
                            placeholder="Industries, company types, or specific passions..."
                            value={additionalContext}
                            onChange={(e) => setAdditionalContext(e.target.value)}
                            className='min-h-[120px] rounded-[2rem] border-gray-100 bg-white/40 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-base p-6 shadow-none'
                        />
                    </div>

                    <div className="flex justify-center">
                        <Button
                            onClick={parsePdf}
                            className={`
                                relative overflow-hidden group py-8 px-16 rounded-2xl text-lg font-bold transition-all duration-500
                                ${url 
                                    ? 'bg-black text-white hover:scale-105 shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95' 
                                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'}
                            `}
                            disabled={!url || loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-4">
                                    <LoadingDots style='big' color='white' />
                                    <span className="animate-pulse text-xs uppercase tracking-widest font-black">Analyzing...</span>
                                </div>
                            ) : (
                                "Generate Roadmap"
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
      )}
      <Toaster />
    </div>
  );
}