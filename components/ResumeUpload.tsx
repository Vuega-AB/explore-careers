"use client";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Plus, FileCheck } from "lucide-react";
import { useState } from "react";

export default function ResumeUpload({ onUploadComplete }: any) {
  const [isFinished, setIsFinished] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <UploadButton<OurFileRouter>
        endpoint="resumeUploader"
        onClientUploadComplete={(res) => {
          if (res) {
            onUploadComplete(res[0].url);
            setIsFinished(true);
          }
        }}
        appearance={{
          button: `
            ut-ready:bg-black dark:ut-ready:bg-white 
            bg-black dark:bg-white text-white dark:text-black 
            font-black uppercase italic tracking-widest 
            px-10 py-7 rounded-full text-[10px] 
            transition-all hover:scale-105 active:scale-95
            shadow-[0_20px_40px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_40px_rgba(255,255,255,0.1)]
            border-none
          `,
          allowedContent: "hidden",
        }}
        content={{
          button({ ready, isUploading }) {
            if (isUploading) return "Uploading Strategy...";
            if (isFinished) return (
                <div className="flex items-center gap-2">
                    <FileCheck size={14} strokeWidth={3} className="text-emerald-500" />
                    <span>Resume Ready</span>
                </div>
            );
            return (
              <div className="flex items-center gap-2">
                <Plus size={14} strokeWidth={3} />
                <span>Select Blueprint (PDF)</span>
              </div>
            );
          },
        }}
      />
    </div>
  );
}