"use client";

import { useEffect } from "react";

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
}

export function AdBanner({ 
  dataAdSlot, 
  dataAdFormat = "auto", 
  dataFullWidthResponsive = true 
}: AdBannerProps) {
  
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className="w-full my-8 flex justify-center items-center overflow-hidden bg-slate-900/20 rounded-xl min-h-[100px] relative border border-slate-700/30">
      {/* Fallback text when ad is blocked or not loaded yet */}
      <span className="absolute text-slate-500/50 text-xs select-none pointer-events-none">Advertisement</span>
      
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX"} // Placeholder ID
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
