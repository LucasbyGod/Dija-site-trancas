import React from 'react';
import { Phone, Instagram, Mail, MapPin, Clock, Calendar, ExternalLink, Lock, Unlock, LogOut, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenAdminLogin }) => {
  const { isAuthenticated, adminUser, logout } = useAdminAuth();

  return (
    <footer className="bg-[#070709] border-t border-[#D4AF37]/20 pt-16 pb-12 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-800/80">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)] bg-black p-0.5">
                <img
                  src="/assets/aistudio/Dija_Tran_as_Logo_acda334d.jpeg"
                  alt="Estúdio Dija Tranças"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-display font-bold text-white text-base block">Estúdio Dija Tranças</span>
                <span className="text-[11px] text-[#D4AF37] tracking-wider uppercase font-medium">Bairro Damas · Fortaleza CE</span>
              </div>
            </div>

            <p className="text-zinc-400 leading-relaxed">
              Especialistas em tranças afros, entrelace, nagô e cuidados capilares. Beleza, técnica e valorização da sua identidade com conforto e pontualidade.
            </p>

            <button
              onClick={onOpenBooking}
              className="gold-gradient-btn px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar Minha Vaga</span>
            </button>
          </div>

          {/* Col 2: Localização & Rota */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Endereço do Estúdio</h4>
            
            <div className="space-y-2 text-zinc-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Rua Desembargador Praxedes, 171</p>
                  <p className="text-zinc-400">Bairro Damas</p>
                  <p className="text-zinc-400">Fortaleza - CE</p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Rua+Desembargador+Praxedes+171+Damas+Fortaleza+CE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#F3D079] hover:underline pt-1"
              >
                <span>Ver rota no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 3: Horários de Atendimento */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Horários de Atendimento</h4>
            
            <div className="space-y-2 text-zinc-300">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p><strong className="text-white">Segunda a Domingo:</strong> 08:00 às 22:00</p>
                  <p className="text-zinc-400">Atendimento ampliado todos os dias da semana</p>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 pt-1">
                * Atendimento exclusivo mediante reserva com sinal de R$ 50,00.
              </p>
            </div>
          </div>

          {/* Col 4: Contatos Oficiais */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Canais de Contato</h4>

            <div className="space-y-2.5">
              <a
                href="https://wa.me/558591002233"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-300 hover:text-[#D4AF37] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span className="tabular-nums">(85) 9100-2233</span>
              </a>

              <a
                href="https://instagram.com/dijatrancas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-300 hover:text-[#D4AF37] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#D4AF37]" />
                <span>@dijatrancas</span>
              </a>

              <a
                href="mailto:dijatrancascadidabo@gmail.com"
                className="flex items-center gap-2 text-zinc-300 hover:text-[#D4AF37] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span className="break-all">dijatrancascadidabo@gmail.com</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Legal bar + Discreet Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} Estúdio Dija Tranças. Todos os direitos reservados. Fortaleza - CE.</p>
          
          <div className="flex flex-wrap items-center gap-4">
            <span>Rua Desembargador Praxedes 171</span>
            <span>·</span>
            <span>Bairro Damas</span>
            <span>·</span>
            <span className="text-[#D4AF37]">Tranças com Amor e Ancestralidade</span>
            <span>·</span>

            {/* Discreet Admin Lock Button / Status */}
            {isAuthenticated ? (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#18181D] border border-[#D4AF37]/50 text-[#F3D079]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Proprietária: <strong>{adminUser?.name || 'Dija'}</strong></span>
                <button
                  onClick={logout}
                  title="Encerrar Sessão de Administração"
                  className="ml-1 text-zinc-400 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                title="Acesso exclusivo da proprietária para gerenciar fotos"
                className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-[#D4AF37] transition-colors cursor-pointer group"
              >
                <Lock className="w-3.5 h-3.5 group-hover:text-[#D4AF37]" />
                <span>Área da Proprietária</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};

