'use client';

export const dynamic = 'force-dynamic';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/shadcn/button';
import { Card } from '../../../components/ui/shadcn/card';
import { Badge } from '../../../components/ui/shadcn/badge';
import { GURU_SERVICES, GURU_UPI_ID, ServiceItem } from '../../../lib/services';
import {
  Sparkles,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Check,
  Globe,
  Copy,
} from 'lucide-react';

export default function DedicatedPayPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const service = GURU_SERVICES.find((s) => s.id === resolvedParams.serviceId) || GURU_SERVICES[1];

  const upiLink = `upi://pay?pa=${GURU_UPI_ID}&pn=AstroSeva&am=${service.price}&tn=AstroSeva-${encodeURIComponent(
    service.id
  )}&cu=INR`;

  const copyUpi = () => {
    navigator.clipboard.writeText(GURU_UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceedToIntake = () => {
    router.push(`/intake/${service.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1E1B] font-sans selection:bg-amber-100 antialiased flex flex-col justify-between">
      
      {/* Header */}
      <header className="w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/50 sticky top-0 z-30 px-6 sm:px-12 py-4 flex justify-between items-center">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-stone-600 hover:text-[#1F1E1B] text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-[#A14E15]">
            <Sparkles className="w-4 h-4 stroke-[1.75]" />
          </div>
          <span className="text-[16px] font-bold tracking-tight text-[#1F1E1B]">Astro-Seva</span>
        </div>
      </header>

      {/* Main Payment Section */}
      <main className="max-w-xl mx-auto py-12 px-4 sm:px-6 w-full space-y-8 my-auto">
        
        {/* Step Header */}
        <div className="text-center space-y-2">
          <Badge variant="default" className="mx-auto bg-amber-100/90 text-[#A14E15] border-amber-300 px-3.5 py-1 text-[12px] font-semibold">
            Step 1 of 2 • Dakshina Offering
          </Badge>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[#1F1E1B] tracking-tight">
            Offer Sacred Dakshina
          </h2>
          <p className="text-[14px] text-stone-500 font-normal max-w-sm mx-auto">
            Scan QR code or click UPI button to pay securely via GPay, PhonePe, or Paytm.
          </p>
        </div>

        {/* Selected Service Summary Card */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs space-y-4 text-left">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[12px] font-semibold text-[#A14E15] font-mono uppercase tracking-wider">Selected Consultation</span>
              <h3 className="text-[20px] font-bold text-[#1F1E1B] mt-0.5">{service.titleEN}</h3>
            </div>
            <span className="text-[26px] font-bold text-[#A14E15] font-mono shrink-0">
              ₹{service.price}
            </span>
          </div>

          <p className="text-[14px] text-stone-600 leading-relaxed font-normal">
            {service.descEN}
          </p>

          <ul className="space-y-1.5 pt-3 border-t border-stone-100">
            {service.featuresEN.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-[13px] text-stone-600 font-normal">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2] shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dedicated QR Code Payment Card */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-center">
          
          {/* Mobile UPI Intent Button */}
          <div className="block sm:hidden">
            <a
              href={upiLink}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#A14E15] text-white font-semibold py-4 px-6 rounded-2xl text-base shadow-md hover:bg-[#883E0F] transition-all"
            >
              <CreditCard className="w-5 h-5 stroke-[1.75]" />
              <span>Pay ₹{service.price} via UPI App</span>
            </a>
          </div>

          {/* Desktop QR Code */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-[14px] text-stone-600 font-medium sm:block hidden">
              Scan with GPay / PhonePe / Paytm / BHIM:
            </p>
            <div className="border-4 border-amber-200 rounded-3xl p-3 bg-white shadow-xs">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  upiLink
                )}`}
                alt="UPI QR Code"
                className="w-48 h-48 sm:w-52 sm:h-52"
              />
            </div>
            
            <button
              onClick={copyUpi}
              className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-4 py-2 rounded-2xl text-[13px] font-mono text-stone-800 transition-colors cursor-pointer"
            >
              <span>UPI ID: <strong>{GURU_UPI_ID}</strong></span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
            </button>
          </div>

          <div className="pt-2">
            <Button onClick={handleProceedToIntake} className="w-full text-base">
              <span>I Have Completed Payment</span>
              <ArrowRight className="w-5 h-5 stroke-[1.75]" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[12px] text-stone-500 font-normal">
            <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[1.75]" />
            <span>Secure 256-bit Encrypted Transaction</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-[12px] text-stone-500 border-t border-stone-200/60">
        © {new Date().getFullYear()} Astro-Seva. All rights reserved.
      </footer>
    </div>
  );
}
