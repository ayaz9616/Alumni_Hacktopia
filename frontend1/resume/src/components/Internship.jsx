import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const alumni = [
  {
    name: "Akash Bajpai",
    role: "Associate Consultant ",
    company: "Trinity Life Sciences",
    batch: "2018 Batch",
    description:
      "Hi, my name is Akash Bajpai, from the 2018-22 (ECE) batch of IIIT Bhagalpur. When I joined the institute, it was still new, with little to no student-attraction events or established clubs. This gave me both the opportunity and the responsibility to actively contribute to shaping the cultural and technical fabric of our campus. From participating in various events to personally establishing multiple clubs in 2019 and 2020, I worked to create platforms that, along with other student-led initiatives, have now become an integral part of campus life",
    image:
      "https://ik.imagekit.io/6p6e7glhp/Akash_Bajpai.jpg?updatedAt=1757748975778",
  },
  {
    name: "Rajan Sandilya",
    role: "R&D Engineer",
    company: "Synopsys Inc",
    batch: "2018 Batch",
    description:
      "Hi, my name is Rajan, from the 2018 batch of the ECE department. My journey at IIIT Bhagalpur was filled with challenges, learnings, and memories that continue to stay with me. Serving as the Vice President of the Student Gymkhana Council was one of the most defining phases of my college life. It gave me the chance to build bridges between students and administration, and to ensure that student voices were heard in shaping our campus culture.",
      image:
      "https://ik.imagekit.io/6p6e7glhp/Rajan_Sandilya.jpg?updatedAt=1757622430363",
  },
  {
    name: "Mehul Tyagi",
    role: "Software Engineer 2",
    company: "Practo",
    batch: "2017 Batch",
    description:
      "Supports students interested in data science by mentoring on machine learning fundamentals, analytics projects, and practical applications in real-world business scenarios.",
    image:
      "https://ik.imagekit.io/6p6e7glhp/Mehul_Tyagi.jpg?updatedAt=1757748729625",
  },
  {
    name: "Gourav Pareek",
    role: "Specialist Programmer",
    company: "Infosys",
    batch: "2019 Batch",
    description:
      "Hey, I’m Gourav Pareek, from the 2019–23 batch, Mechatronics and Automation Engineering (MAE). My IIIT Bhagalpur journey was full of vibes and memories. I had the chance to serve as the Vice President of the Student Gymkhana Council, and leading the team to pull off the first-ever offline techno-cultural fest, Enyugma, was truly next level. From planning to execution, it was a ride that taught me teamwork and leadership like nothing else.",
        image:
      "https://ik.imagekit.io/6p6e7glhp/gaurav%20pareek.jpg?updatedAt=1757441875324",
  },
  {
    name: "Devyanshu Singha",
    role: "Founder & CEO",
    company: "Early-stage Startup",
    batch: "2020 Batch",
    description:
      "Hi, my name is Devyanshu Singhal from the 2020-24 batch, Computer Science and Engineering department at IIIT Bhagalpur. One of my best memories is working tirelessly as Fest Manager for Enyugma, our first offline Techno-Cultural Fest. Bringing the event to life was both challenging and incredibly rewarding, bringing together students, faculty, and a true spirit of collaboration." ,
     image:
      "https://ik.imagekit.io/6p6e7glhp/Divyanshu_Singal.jpg?updatedAt=1757620345294",
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
