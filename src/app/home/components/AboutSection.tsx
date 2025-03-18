'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-medium">About The Event</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold">
              Welcome to Sangrila 2K25
            </h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl overflow-hidden shadow-lg relative group">
              <Image
                src="/sangrila.jpg"
                alt="Sangrila Event"
                layout="responsive"
                width={1074}
                height={720}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <h3 className="text-white font-heading text-2xl font-bold">
                  Creating Memorable Experiences
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-xl font-bold text-gray-700">
            🎉 Sangrila 2K25 – The Ultimate Fest Experience! 🎉
            </p>
            <p className="text-lg text-gray-700">Get ready for the most electrifying event of the year! Sangrila 2K25 is back, bigger and better than ever. Brace yourself for an unforgettable night as we bring you the sensational Astha Gill, the voice behind chart-topping hits like DJ Wale Babu, Buzz, and Proper Patola!</p>
            <ul>
              <li>🔥 Live Performance by Astha Gill</li>
              <li>🎶 Unstoppable Music & Vibes</li>
              <li>🎭 Exciting Cultural & Fun Activities</li>
              <li>🎊 A Night to Remember!</li>
            </ul>
            <p className="text-lg text-gray-700">
            Mark your calendars and get set to groove to the beats of Sangrila 2K25! Stay tuned for more updates and book your passes soon.
            </p>
            <ul>
              <li>📍 Venue: Geeta University</li>
              <li>📅 Date: 21st - 22nd March</li>
            </ul>
            <p className="text-gray-700 text-lg">Lets make memories that last a lifetime!</p>
            <p className="text-gray-700 text-lg">🚀✨ #Sangrila2K25 #AsthaGillLive #FestVibes</p>

            {/* Event Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {[
                { icon: <Calendar className="text-blue-600 h-6 w-6" />, label: "March 21-22, 2025" },
                { icon: <MapPin className="text-blue-600 h-6 w-6" />, label: "Main Ground" },
                { icon: <Users className="text-blue-600 h-6 w-6" />, label: "2500+ Attendees" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-white shadow-md rounded-xl">
                  <div className="w-12 h-12 bg-sangrila-100 rounded-full flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <h4 className="font-medium text-center">{item.label}</h4>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
