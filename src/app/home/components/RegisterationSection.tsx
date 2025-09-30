"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

const registrationOptions = [
  {
    id: "guest",
    title: "Guest Registration",
    description: "For friends, family, and guests who wish to join the celebration.",
    icon: Users,
    link: "/register/guest",
  },
];

export function RegisterSection() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const go = (link: string, id: string) => {
    setLoading(id);
    setTimeout(() => router.push(link), 900);
  };

  return (
    <section id="register" className="py-20 px-6 md:px-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* heading */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-orange-600 font-semibold">Join Us</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-heading font-extrabold bg-gradient-to-r from-orange-500 to-blue-600 text-transparent bg-clip-text">
              Registration Options
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto mt-4 rounded-full" />
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the registration type that suits you. All registrations include entry and activities.
            </p>
          </motion.div>
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {registrationOptions.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div className="p-[1.5px] rounded-2xl bg-gradient-to-r from-orange-500 to-blue-600">
                <Card
                  className={cn(
                    "rounded-2xl bg-white hover:shadow-xl transition-all duration-300",
                    hovered === o.id ? "scale-[1.01]" : "hover:-translate-y-1"
                  )}
                  onMouseEnter={() => setHovered(o.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center shadow-md">
                      <o.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-heading font-bold mt-6">{o.title}</CardTitle>
                    <CardDescription className="mt-2 text-gray-600">{o.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      onClick={() => go(o.link, o.id)}
                      disabled={loading !== null}
                      className="w-full py-3 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                    >
                      {loading === o.id ? "Proceeding..." : "Register Now"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
