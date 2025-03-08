'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRef, useState } from 'react';

const MapEmbed = dynamic(() => import('@/components/ui/MapEmbed'), { ssr: false });

const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    console.log(message);
    

    const formData = {
      name: (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value,
      email: (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value,
      subject: (e.currentTarget.elements.namedItem('subject') as HTMLInputElement).value,
      message: (e.currentTarget.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setMessage('Message sent successfully!');
      formRef.current?.reset();
      e.currentTarget.reset(); // Reset form after success
    } catch {
      setMessage('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-medium">Get In Touch</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold">Contact Us</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about Sangrila 2k25? We&apos;re here to help. Reach out to us using the form below or contact us directly.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                      <Input id="name" placeholder="Enter your name" required className='mt-2'/>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <Input id="email" type="email" placeholder="Enter your email" required className='mt-2'/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input id="subject" placeholder="What is this regarding?" required className='mt-2'/>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea id="message" placeholder="Type your message here..." className="min-h-[120px] mt-2" required/>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Send Message"}
                    </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="h-full flex flex-col">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <h4 className="font-medium">Phone</h4>
                        <p className="text-gray-600 mt-1">+91 98765 43210</p>
                        <p className="text-gray-600">+91 87654 32109</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <p className="text-gray-600 mt-1">info@sangrila2k25.com</p>
                        <p className="text-gray-600">support@sangrila2k25.com</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <h4 className="font-medium">Address</h4>
                        <p className="text-gray-600 mt-1">70 Milestone, NH-1, Samalkha, Panipat, Haryana 132102</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <MapEmbed />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
