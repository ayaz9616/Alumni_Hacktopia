import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-medium text-white mb-4">
              Alumni Mentorship Platform
            </h3>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              A structured, data-driven platform designed to strengthen
              alumni–student engagement through intelligent matching,
              scheduled mentorship, and measurable outcomes.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <a href="#features" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition">
                  How it works
                </a>
              </li>
              <li>
                <a href="#modules" className="hover:text-white transition">
                  Modules
                </a>
              </li>
              <li>
                <a href="/signup" className="hover:text-white transition">
                  Get started
                </a>
              </li>
            </ul>
          </div>

          {/* Institution */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4">
              Institution
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <a href="#about" className="hover:text-white transition">
                  About
                </a>
              </li>
              <li>
                <a href="#outcomes" className="hover:text-white transition">
                  Outcomes
                </a>
              </li>
              <li>
                <a href="#admin" className="hover:text-white transition">
                  Admin dashboard
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-16 h-px bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Alumni–Student Mentorship Platform.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <a href="/privacy" className="hover:text-white transition">
              Privacy policy
            </a>
            <a href="/terms" className="hover:text-white transition">
              Terms of use
            </a>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
