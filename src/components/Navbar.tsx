import React, { useState } from 'react';
import { Calendar, Menu, X, Phone, Instagram, MapPin } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Fidelidade', href: '#fidelidade' },
    { label: 'Como Cuidar', href: '#cuidados' },
    { label: 'Galeria', href: '#galeria' },
    { label: 'Avaliações', href: '#avaliacoes' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#09090B]/90 backdrop-blur-md border-b border-[#D4AF37]/20 transition-all">
      {/* Top Bar Contract: Zone 1 (Brand) - Zone 2 (4-5 Nav Links) - Zone 3 (1 Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand & Logo */}
        <a href="#inicio" className="flex items-center gap-3.5 group whitespace-nowrap shrink-0">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] bg-black flex items-center justify-center p-0.5 transition-transform group-hover:scale-105">
            <img
              src="/assets/aistudio/Dija_Tran_as_Logo_acda334d.jpeg"
              alt="Logo Estúdio Dija Tranças"
              className="w-full h-full object-cover rounded-full filter contrast-110 brightness-105"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-[#F3D079] transition-colors">
              Estúdio Dija Tranças
            </span>
            <span className="text-[11px] text-[#D4AF37] tracking-wider uppercase font-medium">
              Fortaleza · Bairro Damas
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-zinc-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#E5C158] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary CTA Action */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <a
            href="https://wa.me/558591002233"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            title="Fale no WhatsApp"
          >
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="tabular-nums">(85) 9100-2233</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="gold-gradient-btn px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer shadow-md whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Horário</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={onOpenBooking}
            className="gold-gradient-btn px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agendar</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white focus:outline-none"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#121214] border-b border-[#D4AF37]/30 px-6 py-5 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-200 hover:text-[#D4AF37] py-1 border-b border-zinc-800/60"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>Rua Desembargador Praxedes 171, Damas</span>
            </div>
            <a
              href="https://wa.me/558591002233"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>(85) 9100-2233</span>
            </a>
            <a
              href="https://instagram.com/dijatrancas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-300 flex items-center gap-2"
            >
              <Instagram className="w-4 h-4 text-[#D4AF37]" />
              <span>@dijatrancas</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
