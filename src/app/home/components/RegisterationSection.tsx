"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCog, Users, School } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

const registrationOptions = [
  {
    id: "alumni",
    title: "Alumni Registration",
    description: "For all our proud alumni who want to reconnect and celebrate.",
    icon: UserCog,
    link: "/register/alumni",
  },
  {
    id: "guest",
    title: "Guest Registration",
    description: "For friends, family, and guests who wish to join the celebration.",
    icon: Users,
    link: "/register/guest",
  },
  {
    id: "school",
    title: "Principal / School Registration",
    description: "For principals and school coordinators representing their institutions.",
    icon: School,
    link: "/register/school",
  },
];

export const RegisterSection = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleNavigate = (link: string, id: string) => {
    setLoading(id);
    setTimeout(() => {
      router.push(link);
    }, 1500); // Simulated delay before navigation
  };

  return (
    <section id="register" className="py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-medium">Join Us</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold">
              Registration Options
            </h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the registration type that best suits you. All registrations include 
              access to the event, materials, and refreshments.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {registrationOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "transition-all duration-300",
                  hoveredCard === option.id 
                    ? "shadow-xl translate-y-[-5px]" 
                    : "shadow-md hover:shadow-lg"
                )}
                onMouseEnter={() => setHoveredCard(option.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                    <option.icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-heading font-bold mt-4">
                    {option.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-gray-600">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                
                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => handleNavigate(option.link, option.id)}
                    disabled={loading !== null} // Disable all buttons while loading
                  >
                    {loading === option.id ? "Proceeding..." : "Register Now"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
