import React from 'react';
import { 
  Target, 
  Search, 
  Calendar, 
  Shield, 
  Briefcase, 
  BookOpen, 
  ShoppingCart, 
  MessageSquare,
  FileText,
  Layout,
  Star,
  Zap,
  Phone,
  Globe,
  Camera,
  Wrench,
  Link,
  Users,
  Bot,
  Cpu
} from 'lucide-react';
import { Question } from './types';

/**
 * PRICING CONFIGURATION
 * Change these values to update the calculator logic.
 */
export const SERVICE_PAGE_PRICE = 250; // Price per additional service page

export const QUESTIONS: Question[] = [
  {
    id: 'purpose',
    title: "What's your main goal?",
    subtitle: "Select all that apply. We'll recommend the perfect features for you!",
    type: 'multiple',
    options: [
      { id: 'leads', label: 'Get More Enquiries / Leads', priceEffect: 0, icon: <Target className="w-5 h-5" /> },
      { id: 'google', label: 'Show up in Google', priceEffect: 300, icon: <Search className="w-5 h-5" /> },
      { id: 'appointments', label: 'Take Appointments', priceEffect: 800, icon: <Calendar className="w-5 h-5" /> },
      { id: 'trust', label: 'Build Trust with Customers', priceEffect: 0, icon: <Shield className="w-5 h-5" /> },
      { id: 'showcase', label: 'Showcase My Services', priceEffect: 0, icon: <Briefcase className="w-5 h-5" /> },
      { id: 'educate', label: 'Educate & Support Clients', priceEffect: 0, icon: <BookOpen className="w-5 h-5" /> },
      { id: 'ecommerce', label: 'Sell Product Online (eCommerce)', priceEffect: 2500, icon: <ShoppingCart className="w-5 h-5" /> },
      { id: 'testimonials', label: 'Share Testimonials / Case Studies', priceEffect: 0, icon: <MessageSquare className="w-5 h-5" /> }
    ]
  },
  {
    id: 'pages',
    title: "What pages do you need?",
    subtitle: "We've pre-selected the essentials. Add more as needed!",
    type: 'multiple',
    options: [
      // Essential Pages (RM 1900 each)
      { id: 'home', label: 'Home', priceEffect: 1900, icon: <Layout className="w-5 h-5" /> },
      { id: 'about', label: 'About', priceEffect: 1900, icon: <Users className="w-5 h-5" /> },
      { id: 'services', label: 'Services', priceEffect: 1900, icon: <Briefcase className="w-5 h-5" /> },
      { id: 'contact', label: 'Contact', priceEffect: 1900, icon: <Phone className="w-5 h-5" /> },
      // Optional Pages (RM 500 each, Blog RM 800)
      { id: 'gallery', label: 'Gallery', priceEffect: 500, icon: <Camera className="w-5 h-5" /> },
      { id: 'blog', label: 'Blog', priceEffect: 800, icon: <FileText className="w-5 h-5" /> },
      { id: 'events', label: 'Events', priceEffect: 500, icon: <Calendar className="w-5 h-5" /> },
      { id: 'team', label: 'Team', priceEffect: 500, icon: <Users className="w-5 h-5" /> },
      { id: 'testi', label: 'Testimonials', priceEffect: 500, icon: <Star className="w-5 h-5" /> },
      { id: 'faq', label: 'FAQ', priceEffect: 500, icon: <MessageSquare className="w-5 h-5" /> }
    ]
  },
  {
    id: 'design',
    title: "Choose your design level",
    subtitle: "Select the tier that matches your brand ambitions.",
    type: 'single',
    options: [
      {
        id: 'basic',
        label: 'Basic',
        description: 'Ideal for establishing a solid digital footprint with essential features.',
        priceEffect: 1500,
        multiplier: 1, // Multiplies the total of all selected options
        icon: <Layout className="w-6 h-6" />
      },
      {
        id: 'pro',
        label: 'Professional',
        description: 'Perfect for growing businesses seeking credibility and impact.',
        priceEffect: 4000,
        multiplier: 1.3, // 30% increase on top of base selections
        icon: <Star className="w-6 h-6" />
      },
      {
        id: 'premium',
        label: 'Premium',
        description: 'For brands wanting a bold, high-budget digital showcase.',
        priceEffect: 8000,
        multiplier: 1.6, // 60% increase on top of base selections
        icon: <Zap className="w-6 h-6" />
      }
    ]
  },
  {
    id: 'features',
    title: "Supercharge your website",
    subtitle: "Add powerful features to make your website work harder for you.",
    type: 'multiple',
    options: [
      { id: 'bot', label: 'WhatsApp Chatbot', description: '24/7 AI-powered customer support on WhatsApp', priceEffect: 500, icon: <MessageSquare className="w-5 h-5" /> },
      { id: 'auto', label: 'AI Automation', description: 'Streamline lead capturing & workflow automation', priceEffect: 500, icon: <Cpu className="w-5 h-5" /> },
      { id: 'agent', label: 'AI Agent', description: 'Dedicated AI to handle bookings & complex tasks', priceEffect: 500, icon: <Bot className="w-5 h-5" /> },
      { id: 'seo', label: 'SEO Optimization', description: 'Get found on Google with professional SEO', priceEffect: 500, icon: <Search className="w-5 h-5" /> },
      { id: 'appoint', label: 'Appointment System', description: 'Let customers book appointments online', priceEffect: 500, icon: <Calendar className="w-5 h-5" /> },
      { id: 'ecom', label: 'E-commerce', description: 'Sell products online with shopping cart', priceEffect: 500, icon: <ShoppingCart className="w-5 h-5" /> },
      { id: 'wa', label: 'WhatsApp Integration', description: 'Direct WhatsApp chat button', priceEffect: 500, icon: <MessageSquare className="w-5 h-5" /> },
      { id: 'copy', label: 'Professional Copywriting', description: 'Compelling content written by experts', priceEffect: 500, icon: <FileText className="w-5 h-5" /> },
      { id: 'images', label: 'Commercial Images', description: 'Professional stock photos', priceEffect: 500, icon: <Camera className="w-5 h-5" /> },
      { id: 'domain', label: 'Domain & Hosting', description: 'Custom .com.my domain + annual hosting', priceEffect: 500, icon: <Globe className="w-5 h-5" /> }
    ]
  }
];

export const APP_NAME = "VVS DIGITAL SOLUTIONS";
