'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import NavLink from './NavLink';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-white flex items-center justify-center">
      {/* Background Mesh Gradient - The "Surprise" UI touch */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 [background:radial-gradient(60%_50%_at_50%_0%,#f0f0f0_0%,white_100%)]"></div>
      
      <div className='custom-screen text-gray-600'>
        <div className='space-y-8 max-w-4xl mx-auto text-center'>
          
          {/* Animated Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-500 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Next-Gen Career Analysis
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='text-5xl text-gray-900 font-black tracking-tight sm:text-7xl italic uppercase'
          >
            Design your <span className="text-blue-600">future</span> <br /> with Llama 3.3
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='max-w-xl mx-auto text-lg leading-relaxed'
          >
            Stop guessing. Upload your resume and let our AI agents map out your next high-growth career move in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='flex items-center justify-center gap-x-4'
          >
            <NavLink
              href='/careers'
              className='text-white bg-black hover:bg-gray-800 px-8 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 font-bold'
            >
              Get Started Now
            </NavLink>
            {/* <NavLink
              href='https://github.com/Nutlope/explorecareers'
              className='text-gray-900 border border-gray-200 bg-white hover:bg-gray-50 px-8 py-4 rounded-2xl shadow-sm transition-all font-bold'
            >
              View Project
            </NavLink> */}
          </motion.div>
        </div>

        {/* Improved Image Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className='mt-20 relative'
        >
          {/* <div className="absolute inset-0 bg-blue-500/10 blur-[120px] -z-10 rounded-full"></div> */}
          {/* <Image
            src='/careers-screenshot.png'
            className='rounded-[2.5rem] border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
            alt='App Preview'
            width={1200}
            height={800}
            priority
          /> */}
        </motion.div>
      </div>
    </section>
  );
}