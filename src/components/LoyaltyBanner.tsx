import React from 'react';
import { Award, Sparkles, Gift, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';

export const LoyaltyBanner: React.FC = () => {
  return (
    <section id="fidelidade" className="py-12 bg-[#0F0F12] border-y border-[#D4AF37]/20 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-[#1A1813] via-[#141416] to-[#0D0D0E] border-2 border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(212,175,55,0.12)]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-md border border-[#D4AF37]/30">
                <Award className="w-4 h-4" />
                <span>Cartão da Casa · Programa Exclusivo</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                "Conheça e faça parte da nossa comunidade fiel"
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                No <strong className="text-white">Estúdio Dija Tranças</strong>, valorizamos a sua preferência e fidelidade. Criamos o <strong>Cartão da Casa</strong> para retribuir a confiança das nossas clientes com economia real e vantagens exclusivas ao longo do ano.
              </p>

              {/* Big Highlight Box */}
              <div className="bg-[#18181D] border border-[#D4AF37]/40 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B89225] text-black font-extrabold flex flex-col items-center justify-center shrink-0 shadow-md">
                  <span className="text-lg leading-none">50%</span>
                  <span className="text-[10px] uppercase tracking-tighter font-black">OFF</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">6º Procedimento pela Metade do Preço</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    A cada 5 procedimentos realizados no estúdio, o 6º tem 50% de desconto garantido!
                  </p>
                </div>
              </div>
            </div>

            {/* Right Explanation Column: Benefits & How It Works */}
            <div className="lg:col-span-6">
              <div className="bg-[#0D0D10] border border-[#D4AF37]/40 rounded-xl p-5 sm:p-6 shadow-inner space-y-4">
                
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Vantagens e Benefícios do Cartão da Casa
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Entenda como funciona e aproveite cada atendimento no Bairro Damas:
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Benefit 1 */}
                  <div className="flex items-start gap-3 bg-[#131317] border border-zinc-800 p-3 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-[#F3D079] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Economia Real e Contínua</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Perfeito para quem mantém a rotina de tranças afros, manutenções, trocas de visual e lavagens com frequência.
                      </p>
                    </div>
                  </div>

                  {/* Benefit 2 */}
                  <div className="flex items-start gap-3 bg-[#131317] border border-zinc-800 p-3 rounded-lg">
                    <Tag className="w-5 h-5 text-[#F3D079] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Acompanhamento Fácil a Cada Visita</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Não deixe de trazer seu cartão a cada atendimento no estúdio para preencher tudo certinho e registrar cada procedimento feito.
                      </p>
                    </div>
                  </div>

                  {/* Benefit 3 */}
                  <div className="flex items-start gap-3 bg-[#131317] border border-zinc-800 p-3 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-[#F3D079] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Regulamento Claro e Transparente</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Válido apenas para o mesmo cliente cadastrado. O desconto é aplicado no 6º procedimento e não é cumulativo com outras promoções.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-[#F3D079] font-medium">
                    Peça o seu Cartão da Casa gratuitamente na recepção do Estúdio Dija Tranças!
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
