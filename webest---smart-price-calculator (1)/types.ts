import React from 'react';

export type QuestionType = 'single' | 'range' | 'multiple';

export interface Option {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode; // We will use Lucide icons dynamically or pass them
  priceEffect: number; // Flat fee addition
  multiplier?: number; // Multiplies the RUNNING total or base
}

export interface Question {
  id: string;
  title: string;
  subtitle?: string;
  type: QuestionType;
  options?: Option[];
  min?: number;
  max?: number;
  step?: number;
  unitPrice?: number; // For range types
}

export interface CalculatorState {
  [key: string]: string | number | string[];
}

export interface PricingBreakdown {
  subtotal: number;
  total: number;
  items: { label: string; amount: number }[];
}

export interface LeadFormData {
  name: string;
  email: string;
  whatsapp: string;
  notes: string;
}