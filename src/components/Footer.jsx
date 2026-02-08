import React from "react";
import { Link } from "react-router-dom";
import { LogoWhite } from "./Logo";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiSend,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800 relative z-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <LogoWhite className="h-10 w-auto" textClassName="text-2xl" />
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering students with expert guidance and quality education.
              Join Samarth Institute to achieve your academic goals and build a
              successful career.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-samarth-blue-700 hover:text-white transition-all"
              >
                <FiFacebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-samarth-blue-700 hover:text-white transition-all"
              >
                <FiTwitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-samarth-blue-700 hover:text-white transition-all"
              >
                <FiLinkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-samarth-blue-700 hover:text-white transition-all"
              >
                <FiInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="text-lg font-bold mb-6 text-white border-b-2 border-samarth-blue-700 inline-block pb-1">
              Quick Links
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  to="/courses"
                  className="hover:text-samarth-blue-400 transition-colors flex items-center"
                >
                  <span className="mr-2">›</span> All Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/faculties"
                  className="hover:text-samarth-blue-400 transition-colors flex items-center"
                >
                  <span className="mr-2">›</span> Our Faculties
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-samarth-blue-400 transition-colors flex items-center"
                >
                  <span className="mr-2">›</span> About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-samarth-blue-400 transition-colors flex items-center"
                >
                  <span className="mr-2">›</span> Latest Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-samarth-blue-400 transition-colors flex items-center"
                >
                  <span className="mr-2">›</span> Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Waghodia */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b-2 border-samarth-blue-700 inline-block pb-1">
              Waghodia Branch
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <FiMapPin className="mt-1 mr-3 text-samarth-blue-500 flex-shrink-0" />
                <span>
                  3rd floor, Sharnam complex I/F of Savita hospital, Pariwar
                  Cross road, Waghodia Road, Vadodara - 390025
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-3 text-samarth-blue-500 flex-shrink-0" />
                <span>+91 9624225939</span>
              </li>
            </ul>
          </div>

          {/* Contact Info - Harni */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b-2 border-samarth-blue-700 inline-block pb-1">
              Harni Branch
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <FiMapPin className="mt-1 mr-3 text-samarth-blue-500 flex-shrink-0" />
                <span>
                  42, 4th floor siddheshwar Paradise, Near Gada circle, Harni-
                  Sama link road, Harni, Vadodara - 390022
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-3 text-samarth-blue-500 flex-shrink-0" />
                <span>+91 9624225737</span>
              </li>
              <li className="flex items-center mt-6 pt-4 border-t border-gray-800">
                <FiMail className="mr-3 text-samarth-blue-500 flex-shrink-0" />
                <span>hello@samarthclasses.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Samarth Institute. All rights
            reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
