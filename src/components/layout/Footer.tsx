import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-heading font-bold mb-6">Sangrila 2k25</h3>
            <p className=" mb-6 max-w-xs">
              Join us for the most exciting cultural event of the year. Connect with alumni,
              enjoy performances, and celebrate together.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Registration</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/register/alumni" className="hover:underline hover:text-blue-500">
                  Alumni Registration
                </Link>
              </li>
              <li>
                <Link href="/register/guest" className="hover:underline hover:text-blue-500">
                  Guest Registration
                </Link>
              </li>
              <li>
                <Link href="/register/school" className="hover:underline hover:text-blue-500">
                  Principal / School Coordinator Registration
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-blue-500 shrink-0 mt-1" />
                <span>
                GEETA UNIVERSITY, NAULTHA, PANIPAT
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-blue-500" />
                <span>+91 98968 03571</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-blue-500" />
                <span>ghub@geeta.edu.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© {currentYear} Sangrila 2k25. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
