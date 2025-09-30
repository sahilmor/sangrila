"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";

const info = [
  { icon: Calendar, label: "4th Oct, 2025" },
  { icon: MapPin, label: "Main Ground" },
  { icon: Users, label: "7000+ Attendees" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-6 md:px-12 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* heading */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-orange-600 font-semibold">About The Event</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-heading font-extrabold bg-gradient-to-r from-orange-500 to-blue-600 text-transparent bg-clip-text">
              Welcome to Agaaz 2K25
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto mt-4 rounded-full" />
          </motion.div>
        </div>

        {/* content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <Image
                src="/akhil2k25.jpeg"
                alt="Agaaz Event"
                width={1074}
                height={720}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-white font-heading text-2xl font-bold">
                  Creating Memorable Experiences
                </h3>
              </div>
            </div>
          </motion.div>

          {/* text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-5"
          >
            <p className="text-xl font-bold text-gray-800">
              🎉 Agaaz 2K25 – The Ultimate Fest Experience!
            </p>
            <p className="text-gray-700 leading-relaxed">
              Get ready for the most electrifying event of the year! Agaaz 2K25 is back,
              bigger and better than ever. Brace yourself for an unforgettable night with
              chart-topping hits and unstoppable vibes!
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 text-gray-700">
              <li>🔥 Live Performance by Akhil</li>
              <li>🎶 Unstoppable Music & Vibes</li>
              <li>🎭 Cultural & Fun Activities</li>
              <li>🎊 A Night to Remember!</li>
            </ul>
            <p className="text-gray-700">
              Mark your calendars and get set to groove to the beats of Agaaz 2K25! Stay
              tuned for more updates and book your passes soon.
            </p>
            <ul className="text-gray-700">
              <li>📍 Venue: Geeta University</li>
              <li>📅 Date: 4th Oct 2025</li>
            </ul>
            <p className="text-gray-700">Let’s make memories that last a lifetime!</p>
            <p className="text-gray-700">🚀✨ #Agaaz2K25 #AkhilLive #FresherVibes</p>

            {/* info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              {info.map(({ icon: Icon, label }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md border border-orange-100 hover:shadow-lg transition"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center mb-3">
                    <Icon className="text-white h-6 w-6" />
                  </div>
                  <h4 className="font-medium text-center text-gray-800">{label}</h4>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
