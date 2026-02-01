import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const alumni = [
  {
    name: "Ayaz Khan",
    role: "Senior Software Engineer",
    company: "Google",
    batch: "2018 Batch",
    description:
      "Mentors students on backend engineering, system design, and scalable architectures. Known for structured guidance on interview preparation and translating academic projects into industry-ready systems.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
  },
  {
    name: "Ritik Gupta",
    role: "Product Designer II",
    company: "Amazon",
    batch: "2019 Batch",
    description:
      "Guides students through UX research, portfolio building, and product case studies. Provides actionable feedback on usability, visual hierarchy, and real-world design workflows.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
  },
  {
    name: "Neha Sharma",
    role: "Data Scientist",
    company: "Microsoft",
    batch: "2020 Batch",
    description:
      "Supports students interested in data science by mentoring on machine learning fundamentals, analytics projects, and practical applications in real-world business scenarios.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
  },
  {
    name: "Arjun Verma",
    role: "Senior DevOps Engineer",
    company: "Netflix",
    batch: "2017 Batch",
    description:
      "Mentors students on cloud infrastructure, CI/CD pipelines, and production reliability. Emphasizes best practices for scalable and secure systems.",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400",
  },
  {
    name: "Sneha Iyer",
    role: "Founder & CEO",
    company: "Early-stage Startup",
    batch: "2016 Batch",
    description:
      "Advises students on startup ideation, MVP validation, and early-stage product strategy, balancing technical execution with business fundamentals.",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400",
  },
];

const CARD_OFFSET = 32;
const SCALE_STEP = 0.05;
const SWIPE_THRESHOLD = 100;
const AUTO_SLIDE_DELAY = 6000;

const TopRatedAlumni = () => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const paginate = (dir) => {
    setIndex((prev) => (prev + dir + alumni.length) % alumni.length);
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => paginate(1), AUTO_SLIDE_DELAY);
    return () => clearInterval(interval);
  }, [index, isHovered]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <section className="bg-black text-white relative overflow-hidden">
      {/* Header */}
      <div className="text-center mt-12 ">
        <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">
          Community recognition
        </p>
        <h2 className="text-5xl md:text-7xl font-medium tracking-tighter">
          Top rated <span className="text-neutral-500 italic">alumni</span>
        </h2>
      </div>

      {/* Card Stack */}
      <div
        className="relative h-[520px] sm:h-[460px] lg:h-[420px] flex justify-center items-center px-4"
        style={{ perspective: 1200 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {[0, 1, 2].map((stackIndex) => {
          const person = alumni[(index + stackIndex) % alumni.length];

          return (
            <motion.div
              key={`${index}-${stackIndex}`}
              drag={stackIndex === 0 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(e, info) => {
                if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
                if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
              }}
              animate={{
                scale: 1 - stackIndex * SCALE_STEP,
                y: stackIndex * CARD_OFFSET,
                rotateY: stackIndex === 0 ? 0 : -6,
                opacity: stackIndex === 0 ? 1 : 0.6,
              }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="absolute w-full max-w-4xl cursor-grab active:cursor-grabbing will-change-transform"
              style={{ zIndex: 10 - stackIndex }}
            >
              <div
                className="flex flex-col md:flex-row gap-6 sm:gap-8 p-6 sm:p-8 rounded-2xl border border-white/10"
                style={{
                  background: "rgba(20,20,20,0.85)",
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                }}
              >
                {/* Image */}
                <div className="w-full md:w-1/3">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="rounded-xl object-cover w-full h-[220px] md:h-[260px]"
                    draggable={false}
                  />
                </div>

                {/* Content */}
                <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-semibold text-white">
                    {person.name}
                  </h3>
                  <p className="text-sm text-neutral-400 font-medium mb-4">
                    {person.role} · {person.company} · {person.batch}
                  </p>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {person.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation */}
      <button
        onClick={() => paginate(-1)}
        className="hidden sm:flex absolute left-6 top-[60%] -translate-y-1/2 z-50 w-12 h-12 items-center justify-center rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition"
      >
        ←
      </button>

      <button
        onClick={() => paginate(1)}
        className="hidden sm:flex absolute right-6 top-[60%] -translate-y-1/2 z-50 w-12 h-12 items-center justify-center rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition"
      >
        →
      </button>

      <div className="sm:hidden text-center mt-10 text-xs text-neutral-500 tracking-widest uppercase">
        — Swipe to navigate —
      </div>
    </section>
  );
};

export default TopRatedAlumni;
