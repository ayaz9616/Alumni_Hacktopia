import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

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
                <Link to="/resumate" onClick={scrollToTop} className="hover:text-white transition">
                  Resume Tools
                </Link>
              </li>
              <li>
                <Link to="/jobs" onClick={scrollToTop} className="hover:text-white transition">
                  Job Portal
                </Link>
              </li>
              <li>
                <Link to="/community" onClick={scrollToTop} className="hover:text-white transition">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link to="/alumni-directory" onClick={scrollToTop} className="hover:text-white transition">
                  Alumni Directory
                </Link>
              </li>
             
              <li>
                <Link to="/profile" onClick={scrollToTop} className="hover:text-white transition">
                  Profile
                </Link>
              </li>
             
              <li>
                <Link to="/profile" onClick={scrollToTop} className="hover:text-white transition">
                  Developer
                </Link>
              </li>
             
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-16 h-px bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Alumni Mentorship Platform. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-neutral-500">System online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
