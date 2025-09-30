"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef, useState } from "react";

const MapEmbed = dynamic(() => import("@/components/ui/MapEmbed"), { ssr: false });

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const formData = {
      name: (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value,
      email: (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value,
      subject: (e.currentTarget.elements.namedItem("subject") as HTMLInputElement).value,
      message: (e.currentTarget.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setAlert({ type: "success", msg: "Message sent successfully!" });
      formRef.current?.reset();
    } catch {
      setAlert({ type: "error", msg: "Failed to send message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 md:px-12 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* heading */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-orange-600 font-semibold">Get In Touch</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-heading font-extrabold bg-gradient-to-r from-orange-500 to-blue-600 text-transparent bg-clip-text">
              Contact Us
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto mt-4 rounded-full" />
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about Agaaz 2K25? Reach out using the form or contact us directly.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border border-orange-100/70 shadow-md backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                      <Input id="name" placeholder="Enter your name" className="mt-2 focus-visible:ring-orange-400" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <Input id="email" type="email" placeholder="Enter your email" className="mt-2 focus-visible:ring-orange-400" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input id="subject" placeholder="What is this regarding?" className="mt-2 focus-visible:ring-orange-400" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea id="message" placeholder="Type your message here..." className="mt-2 min-h-[120px] focus-visible:ring-orange-400" required />
                  </div>

                  {alert && (
                    <div
                      className={`text-sm rounded-md px-3 py-2 ${
                        alert.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {alert.msg}
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* info + map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <Card className="mb-6 border border-blue-100/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <span className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <Phone className="w-5 h-5 text-orange-600" />
                    </span>
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="text-gray-600 mt-1">+91 98968 03571</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </span>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-gray-600 mt-1">ghub@geeta.edu.in</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </span>
                    <div>
                      <h4 className="font-medium">Address</h4>
                      <p className="text-gray-600 mt-1">GEETA UNIVERSITY, NAULTHA, PANIPAT</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <MapEmbed />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
