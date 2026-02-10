'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, MapPin, Phone } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(data: ContactFormValues) {
    console.log('Contact form submitted:', data);
    toast({
      title: 'Message Sent!',
      description: "Thanks for reaching out. We'll get back to you shortly.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We'd love to hear from you. Whether you have a question, feedback, or just want to say hello, please don't hesitate to reach out.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 mt-16">
        <div className="space-y-8">
           <div className="flex items-start gap-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Our Address</h3>
              <p className="text-muted-foreground">123 Fashion Avenue, Suite 404<br />New York, NY 10001</p>
            </div>
          </div>
           <div className="flex items-start gap-4">
             <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Email Us</h3>
              <p className="text-muted-foreground">hello@perrystore.com</p>
            </div>
          </div>
           <div className="flex items-start gap-4">
             <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Call Us</h3>
              <p className="text-muted-foreground">(555) 123-4567</p>
            </div>
          </div>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8 border rounded-lg bg-card">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your message here..." {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
