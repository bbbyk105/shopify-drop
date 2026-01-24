"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const [currentVideo, setCurrentVideo] = useState(0); // 0: top.webm, 1: top3.webm, 2: top4.webm
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const video3Ref = useRef<HTMLVideoElement>(null);
  const hasSwitchedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 最初の動画を5秒後に切り替え
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (!hasSwitchedRef.current) {
        setCurrentVideo(1);
        hasSwitchedRef.current = true;
      }
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // 動画1が終了したら動画2に切り替え
  const handleVideo1Ended = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!hasSwitchedRef.current) {
      setCurrentVideo(1);
      hasSwitchedRef.current = true;
    }
  };

  // 動画2が終了したら動画3に切り替え
  const handleVideo2Ended = () => {
    setCurrentVideo(2);
  };

  // 動画3が終了したら動画1に切り替え
  const handleVideo3Ended = () => {
    setCurrentVideo(0);
  };

  // 動画の切り替え時に再生を確実にする
  useEffect(() => {
    // 表示されていない動画を停止
    if (currentVideo !== 0 && video1Ref.current) {
      video1Ref.current.pause();
    }
    if (currentVideo !== 1 && video2Ref.current) {
      video2Ref.current.pause();
    }
    if (currentVideo !== 2 && video3Ref.current) {
      video3Ref.current.pause();
    }

    // 表示されている動画を再生
    if (currentVideo === 0 && video1Ref.current) {
      // 動画1に戻ったときのみリセット（ループ時）
      if (video1Ref.current.ended) {
        video1Ref.current.currentTime = 0;
      }
      video1Ref.current.play().catch(console.error);
    } else if (currentVideo === 1 && video2Ref.current) {
      video2Ref.current.currentTime = 0;
      video2Ref.current.play().catch(console.error);
    } else if (currentVideo === 2 && video3Ref.current) {
      video3Ref.current.currentTime = 0;
      video3Ref.current.play().catch(console.error);
    }
  }, [currentVideo]);

  return (
    <section className="relative w-full overflow-hidden min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
      {/* 背景メディア */}
      <div className="absolute inset-0">
        {/* 最初の動画 */}
        <video
          ref={video1Ref}
          autoPlay
          muted
          playsInline
          onEnded={handleVideo1Ended}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[3000ms] ease-in-out ${
            currentVideo === 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src="/videos/top.webm" type="video/webm" />
        </video>
        {/* 2つ目の動画 */}
        <video
          ref={video2Ref}
          autoPlay
          muted
          playsInline
          onEnded={handleVideo2Ended}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[3000ms] ease-in-out ${
            currentVideo === 1 ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src="/videos/top3.webm" type="video/webm" />
        </video>
        {/* 3つ目の動画 */}
        <video
          ref={video3Ref}
          autoPlay
          muted
          playsInline
          onEnded={handleVideo3Ended}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[3000ms] ease-in-out ${
            currentVideo === 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src="/videos/top4.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r" />
      </div>

      {/* テキストブロック（PC: 左寄り、SP: 中央） */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-start">
        <div className="mx-auto md:mx-0 w-full max-w-4xl px-6 md:pl-12 lg:pl-16 xl:pl-24 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.1] drop-shadow-[0_4px_20px_rgba(0,0,0,1),0_2px_8px_rgba(0,0,0,0.9)]">
            Create your perfect space.
          </h1>
          <p className="mt-6 md:mt-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-white drop-shadow-[0_2px_12px_rgba(0,0,0,1),0_1px_4px_rgba(0,0,0,0.9)] max-w-2xl md:max-w-xl">
            Discover timeless designs that transform your home into a sanctuary
            of style and comfort.
          </p>
          <div className="mt-10 md:mt-12">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-[#8B6F47] hover:bg-[#7A5F3A] text-white rounded-full px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-semibold transition-colors"
              >
                SHOP ALL PRODUCTS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
