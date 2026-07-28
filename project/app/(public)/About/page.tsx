"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Compass, Target, ShieldAlert, Zap, Sparkles, ChevronRight } from "lucide-react";

export function About() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: "story",
      title: "Brand Story",
      quote: "Projectnify is built for modern teams who want a clean, collaborative workspace...",
      tag: "Origins",
      icon: Compass,
      gradient: "from-teal-500 via-cyan-500 to-blue-500",
      accentBg: "bg-cyan-50 border-cyan-200 text-cyan-600",
      glowColor: "bg-cyan-400/20",
    },
    {
      id: "mission",
      title: "Our Mission",
      quote: "Make project management effortless with powerful visual tools, intuitive workflows, and real-time collaboration.",
      tag: "Purpose",
      icon: Target,
      gradient: "from-blue-600 via-indigo-500 to-purple-500",
      accentBg: "bg-indigo-50 border-indigo-200 text-indigo-600",
      glowColor: "bg-indigo-400/20",
    },
    {
      id: "problems",
      title: "Problems We Solve",
      quote: "Eliminate scattered tasks, unclear priorities, and friction-filled team communication.",
      tag: "Solution",
      icon: ShieldAlert,
      gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
      accentBg: "bg-purple-50 border-purple-200 text-purple-600",
      glowColor: "bg-purple-400/20",
    },
    {
      id: "value",
      title: "Our Value",
      quote: "Fast setup, flexible boards, and a polished interface that makes work feel truly effortless.",
      tag: "Advantage",
      icon: Zap,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      accentBg: "bg-emerald-50 border-emerald-200 text-emerald-600",
      glowColor: "bg-emerald-400/20",
    },
  ];

  // Auto-rotate tabs every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % features.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [features.length]);

  const activeFeature = features[activeTab];
  const ActiveIcon = activeFeature.icon;

  return (
    <section className="relative px-4 sm:px-8 lg:px-12 py-12 sm:py-20 bg-slate-50 text-slate-900 font-sans overflow-hidden border-t border-slate-200/80">

      {/* Animated Light Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle SVG Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(23, 113, 240, 0.25) 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Floating Pastel Gradient Blobs */}
        <div className="absolute top-10 left-1/4 w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] bg-cyan-200/40 blur-[80px] sm:blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] bg-purple-200/40 blur-[80px] sm:blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200 shadow-sm backdrop-blur-md">
            <div className="relative w-4 h-4 sm:w-5 sm:h-5 overflow-hidden rounded-md bg-slate-100 flex items-center justify-center shrink-0">
              <Image
                src="/icon.png"
                alt="Projectnify Logo"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              About Projectnify
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Built for the Future of{" "}
            <span className={`bg-gradient-to-r ${activeFeature.gradient} bg-clip-text text-transparent transition-all duration-700`}>
              Team Collaboration
            </span>
          </h2>

          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed font-normal">
            Discover what drives our platform and how we are transforming the way modern teams organize, build, and deliver projects.
          </p>
        </div>

        {/* Interactive Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

          {/* Navigation Tabs */}
          <div className="lg:col-span-5 space-y-2.5 sm:space-y-3">
            {features.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === index;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(index)}
                  className={`w-full text-left p-3.5 sm:p-5 rounded-2xl transition-all duration-300 border flex items-center justify-between group ${isActive
                    ? "bg-white border-slate-300 shadow-xl shadow-slate-200/60 scale-[1.01] sm:scale-[1.02]"
                    : "bg-white/50 hover:bg-white/80 border-transparent hover:border-slate-200"
                    }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${isActive ? item.accentBg : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      }`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-sm sm:text-base font-bold transition-colors truncate ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                        {item.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">
                        {item.tag}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 transition-all shrink-0 ${isActive ? "text-slate-800 translate-x-1" : "text-slate-400 opacity-0 group-hover:opacity-100"
                    }`} />
                </button>
              );
            })}
          </div>

          {/* Hero Glass Display Card */}
          <div className="lg:col-span-7">
            <div className="relative bg-white/80 border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl shadow-slate-200/80 backdrop-blur-2xl overflow-hidden transition-all duration-500">

              <div className={`absolute -top-12 -right-12 w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl ${activeFeature.glowColor} transition-all duration-700 pointer-events-none`} />

              <div className="relative z-10 space-y-4 sm:space-y-6">
                {/* Card Icon Header */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center ${activeFeature.accentBg} shadow-sm transition-all duration-500`}>
                  <ActiveIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                {/* Card Content */}
                <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {activeFeature.title}
                </h3>

                <p className="text-base sm:text-xl text-slate-700 leading-relaxed italic font-light">
                  &ldquo;{activeFeature.quote}&rdquo;
                </p>

                {/* Progress bar indicator */}
                <div className="pt-4 sm:pt-6 border-t border-slate-100 flex items-center gap-2">
                  {features.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveTab(idx)}
                      className={`h-1.5 rounded-full cursor-pointer transition-all duration-500 ${idx === activeTab ? `w-8 bg-gradient-to-r ${activeFeature.gradient}` : "w-3 bg-slate-200 hover:bg-slate-300"
                        }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default About;