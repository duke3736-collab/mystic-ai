"use client";

import { useEffect } from "react";

interface AdSenseProps {
  className?: string;
}

export default function AdSense({ className = "" }: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense error", err);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-6635245275061755"
        data-ad-slot="4923567926"
      />
    </div>
  );
}
