import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    id: "01",
    question: "How does mentor matching work?",
    answer:
      "The platform uses structured profile data, stated goals, domains of interest, and past engagement patterns to recommend high-potential mentor–mentee matches.",
  },
  {
    id: "02",
    question: "Can students schedule sessions with alumni?",
    answer:
      "Yes. Students can request one-on-one or group mentorship sessions based on alumni availability using time-slot based scheduling with confirmations and reminders.",
  },
  {
    id: "03",
    question: "Is mentorship limited to a specific domain?",
    answer:
      "No. Mentorship spans technical, design, analytics, research, and career guidance domains depending on alumni expertise and preferences.",
  },
  {
    id: "04",
    question: "How is mentorship quality evaluated?",
    answer:
      "After each session, structured feedback is collected from both participants. This feedback is used to improve match quality and generate institutional insights.",
  },
  {
    id: "05",
    question: "Who can access the admin dashboard?",
    answer:
      "Authorized faculty members or institute coordinators can access the admin dashboard to monitor participation, engagement trends, and mentorship outcomes.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  return (
    <section className="bg-black py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20 text-center">
          <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">
            Support
          </p>
          <h2 className="text-5xl md:text-7xl font-medium text-white tracking-tighter">
            Frequently asked{" "}
            <span className="text-neutral-500 italic">questions</span>
          </h2>
        </div>

        {/* FAQ List */}
        <div className="divide-y divide-white/10 border-t border-white/10">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div key={faq.id} className="py-8">
                {/* Question */}
                <button
                  onClick={() =>
                    setOpenId(isOpen ? null : faq.id)
                  }
                  className="
                    w-full flex items-center justify-between
                    text-left focus:outline-none
                  "
                >
                  <div className="flex items-center gap-8">
                    <span className="text-xs text-neutral-600">
                      {faq.id}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-light text-neutral-300">
                      {faq.question}
                    </h3>
                  </div>

                  <span
                    className={`text-xl text-neutral-500 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-6 ml-[3.25rem] max-w-3xl text-sm leading-relaxed text-neutral-400">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
