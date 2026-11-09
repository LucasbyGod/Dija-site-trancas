import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, Sparkles, Clock, MapPin } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExploreCatalog }) => {
  return (
    <section id="inicio" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Background radial gold glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D4AF37]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline / Subtitle trust marker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase bg-[#18181B] border border-[#D4AF37]/30 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Estúdio Especialista em Tranças Afros · Fortaleza</span>
            </div>

            {/* Impactful Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] text-balance">
              A Arte, Beleza e Força das <span className="gold-gradient-text">Tranças Afros</span> no Bairro Damas
            </h1>

            {/* Practical Subtitle */}
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
              Agende seu horário com total praticidade e sem espera. Consulte preços reais, métodos de aplicação, pacotes e garanta sua vaga exclusiva pelo site com confirmação direta no WhatsApp.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="gold-gradient-btn px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 cursor-pointer shadow-lg group whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Horário Online</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreCatalog}
                className="px-6 py-3.5 rounded-xl text-sm font-medium text-zinc-200 bg-[#16161A] hover:bg-[#202025] border border-zinc-700/60 hover:border-[#D4AF37]/40 transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>Ver Catálogo Completo</span>
              </button>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Rua Desembargador Praxedes 171, Damas</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Atendimento pontual com hora marcada</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Sinal de R$ 50 para reserva garantida</span>
              </div>
            </div>

          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow Border Box */}
              <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_10px_40px_rgba(212,175,55,0.15)] bg-[#121214]">
                <img
                  src="/assets/aistudio/image_85edcd4e.png"
                  alt="Dija Tranças - Especialista em Tranças Afro no Bairro Damas"
                  className="w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] object-cover object-top filter contrast-[1.03]"
                  referrerPolicy="no-referrer"
                />

                {/* Bottom Overlay card */}
                <div className="p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">Seu estilo, nossa arte</p>
                      <p className="text-xs text-zinc-400">Especialista em tranças afros e acabamento premium</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider block">Estúdio Dija</span>
                      <span className="text-[11px] text-zinc-400">Fortaleza - CE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
