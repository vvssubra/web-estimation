import { CalculatorState, LeadFormData } from '../types';

/**
 * GOOGLE APPS SCRIPT INSTRUCTIONS:
 * 1. Create a Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Paste the provided doPost snippet.
 * 4. Deploy > New Deployment > Web App > Access: Anyone.
 * 5. Paste the URL below.
 */

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3SKYZTiasMbe1JHeQAAkiTjv0_66RLjFGvu1mGSuPWAuTnIC4XnazQ_6L-HIyMZtQig/exec';

export const submitLead = async (
  leadData: LeadFormData,
  calculatorState: CalculatorState,
  estimatedCost: number,
  aiAnalysis: string
): Promise<boolean> => {
  
  // Flatten data for Google Sheets compatibility
  const payload = {
    timestamp: new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
    name: leadData.name,
    email: leadData.email,
    whatsapp: leadData.whatsapp,
    notes: leadData.notes,
    design: String(calculatorState.design || 'Not selected'),
    services_count: Number(calculatorState.services_count || 0),
    // Join arrays into comma-separated strings
    pages: Array.isArray(calculatorState.pages) ? calculatorState.pages.join(', ') : '',
    features: Array.isArray(calculatorState.features) ? calculatorState.features.join(', ') : '',
    purpose: Array.isArray(calculatorState.purpose) ? calculatorState.purpose.join(', ') : '',
    estimatedCost: estimatedCost,
    aiAnalysis: aiAnalysis
  };

  if (!GOOGLE_SCRIPT_URL) {
    console.warn("GOOGLE_SCRIPT_URL is missing. Printing payload to console for testing:");
    console.table(payload);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Essential for Google Apps Script redirects
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error("Submission error:", error);
    return false;
  }
};