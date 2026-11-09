import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Droplets, Sun, Moon, Sparkles, Clock, ShieldAlert } from 'lucide-react';
import { CARE_TIPS } from '../data/careGuide';

export const CareGuide: React.FC = () => {
  const [openId, setOpenId] = useState<string>(CARE_TIPS[0].id);

  const toggleTip = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  const getTipIcon = (id: string) => {
    switch (id) {
      case 'lavagem':
        return <Droplets className="w-4 h-4 text-[#D4AF37]" />;
      case 'secagem':
        return <Sun className="w-4 h-4 text-[#D4AF37]" />;
      case 'noite':
        return <Moon className="w-4 h-4 text-[#D4AF37]" />;
      case 'durabilidade':
        return <Clock className="w-4 h-4 text-[#D4AF37]" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  return (
    <section id="cuidados" className="py-16 sm:py-24 bg-[#0D0D10] border-t border-zinc-800/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase bg-[#18181B] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guia Prático e Didático</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Como Cuidar das Suas Tranças
          </h2>

          <p className="text-sm sm:text-base text-zinc-400">
            Tire suas dúvidas antes e depois do procedimento. Siga estas orientações simples para manter suas tranças sempre impecáveis, cheirosas e com durabilidade máxima.
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#141418] border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37]">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Xampu Diluído</h4>
              <p className="text-xs text-zinc-400 mt-1">Lave apenas o couro cabeludo pela manhã com xampu diluído em borrifador.</p>
            </div>
          </div>

          <div className="bg-[#141418] border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37]">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Touca de Cetim</h4>
              <p className="text-xs text-zinc-400 mt-1">Durma sempre de touca ou fronha de cetim para evitar atrito e frizz precoce.</p>
            </div>
          </div>

          <div className="bg-[#141418] border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tempo Recomendado</h4>
              <p className="text-xs text-zinc-400 mt-1">Respeite o prazo de 2 a 3 meses para proteger a saúde e o crescimento dos fios.</p>
            </div>
          </div>
        </div>

        {/* Accordion FAQ */}
        <div className="space-y-3">
          {CARE_TIPS.map((tip) => {
            const isOpen = openId === tip.id;
            return (
              <div
                key={tip.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-[#141419] border-[#D4AF37]/50 shadow-md'
                    : 'bg-[#121215] border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <button
                  onClick={() => toggleTip(tip.id)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left cursor-pointer gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-[#1D1D24] shrink-0">
                      {getTipIcon(tip.id)}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider block">
                        {tip.title}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-white">
                        {tip.question}
                      </h3>
                    </div>
                  </div>
                  <div className="text-zinc-400">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#D4AF37]" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 space-y-3 border-t border-zinc-800/60 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    <p>{tip.answer}</p>
                    <div className="p-3 bg-[#1B1914] border border-[#D4AF37]/30 rounded-xl flex items-start gap-2 text-xs text-[#F3D079]">
                      <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#D4AF37]" />
                      <span><strong>Dica de Ouro da Dija:</strong> {tip.tip}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
