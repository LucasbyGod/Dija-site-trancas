import React, { useState, useMemo } from 'react';
import { 
  Search, Sparkles, ChevronRight, Scissors, ChevronDown, ChevronUp, 
  Layers, Check, ChevronsUpDown 
} from 'lucide-react';
import { ServiceCategory, ServiceItem, ServiceOption } from '../types';
import { CATEGORIES_CONFIG, SERVICES_CATALOG } from '../data/services';

interface ServicesCatalogProps {
  onSelectService: (service: ServiceItem, selectedOption?: ServiceOption) => void;
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({ onSelectService }) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Track catalog expanded or collapsed state
  const [isCatalogExpanded, setIsCatalogExpanded] = useState<boolean>(false);

  // Track which service card has its variation accordion open
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  // Track selected option per service (e.g. 1 pacote vs 2 pacotes)
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, ServiceOption>>({});

  const toggleAccordion = (serviceId: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const handleOptionChange = (serviceId: string, option: ServiceOption) => {
    setSelectedOptionsMap((prev) => ({
      ...prev,
      [serviceId]: option,
    }));
  };

  // Filtered services list
  const filteredServices = useMemo(() => {
    return SERVICES_CATALOG.filter((item) => {
      const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
      const matchesSearch =
        searchTerm.trim() === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  // If in 'todos' without search and not expanded, show initial 6 curated services
  const INITIAL_CARD_LIMIT = 6;
  const shouldLimit = activeCategory === 'todos' && searchTerm.trim() === '' && !isCatalogExpanded;
  const displayedServices = shouldLimit
    ? filteredServices.slice(0, INITIAL_CARD_LIMIT)
    : filteredServices;

  return (
    <section id="servicos" className="py-14 sm:py-20 bg-[#09090B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase bg-[#18181B] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30">
            <Scissors className="w-3.5 h-3.5" />
            <span>Catálogo Completo de Procedimentos</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Escolha seu Estilo com Preços Transparentes
          </h2>

          <p className="text-sm sm:text-base text-zinc-400">
            Trabalhamos com fibras de alta qualidade, acabamento detalhista e respeito total à saúde do seu couro cabeludo. Selecione o serviço desejado para iniciar seu agendamento.
          </p>
        </div>

        {/* Search Bar & Instant Filter */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar trança, entrelace, cachos, nagô..."
              className="w-full bg-[#121215] border border-zinc-700/80 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-all outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs (Interactive Segmented Buttons) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORIES_CONFIG.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  // When switching categories, reset to view matching items
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                    : 'bg-[#151518] text-zinc-300 hover:text-white hover:bg-[#1E1E24] border border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Service Cards Grid */}
        {displayedServices.length === 0 ? (
          <div className="text-center py-12 bg-[#121215] rounded-2xl border border-zinc-800 p-8">
            <p className="text-zinc-400 text-sm">Nenhum procedimento encontrado com o termo "{searchTerm}".</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('todos'); }}
              className="mt-4 text-xs text-[#D4AF37] underline hover:text-white cursor-pointer"
            >
              Ver todos os serviços
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {displayedServices.map((service) => {
              const activeOption = selectedOptionsMap[service.id] || (service.options ? service.options[0] : undefined);
              const currentPrice = activeOption ? activeOption.price : service.basePrice;
              const hasOptions = !!(service.options && service.options.length > 0);
              const isAccordionOpen = !!openAccordions[service.id];

              return (
                <div
                  key={service.id}
                  className="bg-[#121216] border border-zinc-800/90 hover:border-[#D4AF37]/50 rounded-2xl p-6 flex flex-col justify-between transition-all group shadow-sm hover:shadow-[0_4px_25px_rgba(212,175,55,0.08)] min-h-[310px]"
                >
                  {/* Top Details Container */}
                  <div className="space-y-3.5 flex-1">
                    
                    {/* Header of Card with uniform height baseline */}
                    <div className="flex items-start justify-between gap-3 min-h-[52px]">
                      <div>
                        {service.featured && (
                          <span className="text-[10px] font-bold tracking-wider uppercase text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 inline-block mb-1">
                            Mais Pedido
                          </span>
                        )}
                        <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-[#F3D079] transition-colors leading-snug">
                          {service.name}
                        </h3>
                      </div>

                      {/* Prominent Price */}
                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-zinc-400 block">
                          {hasOptions ? 'A partir de' : 'Valor'}
                        </span>
                        <span className="text-lg sm:text-xl font-bold text-[#F3D079] tabular-nums font-display whitespace-nowrap">
                          R$ {currentPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    {/* Description with fixed 3-line measure for visual symmetry */}
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3 min-h-[3.6rem]">
                      {service.description}
                    </p>

                    {/* Harmonious Collapsible Accordion for Variations */}
                    {hasOptions ? (
                      <div className="pt-2 border-t border-zinc-800/80">
                        <button
                          type="button"
                          onClick={() => toggleAccordion(service.id)}
                          className="w-full flex items-center justify-between p-2 rounded-xl bg-[#16161B] border border-zinc-800 hover:border-[#D4AF37]/60 text-xs transition-all cursor-pointer group/acc"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <Layers className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                            <span className="text-zinc-300 truncate">
                              Pacote: <strong className="text-white">{activeOption?.label || 'Opções'}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 text-[#F3D079]">
                            <span className="text-[11px] font-semibold underline underline-offset-2">
                              {isAccordionOpen ? 'Fechar' : 'Variações'}
                            </span>
                            {isAccordionOpen ? (
                              <ChevronUp className="w-3.5 h-3.5 transition-transform" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 transition-transform" />
                            )}
                          </div>
                        </button>

                        {/* Accordion Expansion Drawer */}
                        {isAccordionOpen && (
                          <div className="mt-2 space-y-1.5 p-2 bg-[#0E0E11] rounded-xl border border-zinc-800/90 animate-fadeIn">
                            {service.options!.map((opt) => {
                              const isSelected = activeOption?.id === opt.id;
                              return (
                                <button
                                  type="button"
                                  key={opt.id}
                                  onClick={() => handleOptionChange(service.id, opt)}
                                  className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white font-medium'
                                      : 'bg-[#151518] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 truncate pr-2">
                                    {isSelected && <Check className="w-3 h-3 text-[#F3D079] shrink-0" />}
                                    <span className="truncate">{opt.label}</span>
                                  </div>
                                  <span className="text-[#F3D079] font-bold tabular-nums shrink-0">
                                    R$ {opt.price.toFixed(2).replace('.', ',')}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Placeholder spacing to keep uniform card layout alignment */
                      <div className="pt-2 border-t border-transparent min-h-[41px]" />
                    )}

                  </div>

                  {/* Card Action Button - always pinned to the bottom of the card */}
                  <div className="pt-4 mt-4 border-t border-zinc-800/60">
                    <button
                      onClick={() => onSelectService(service, activeOption)}
                      className="w-full gold-gradient-btn py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow group/btn"
                    >
                      <span>Selecionar para Agendar</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Expand / Collapse Catalog Control Button */}
        {activeCategory === 'todos' && searchTerm.trim() === '' && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setIsCatalogExpanded(!isCatalogExpanded)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[#18181D] hover:bg-[#222228] text-white border border-[#D4AF37]/40 hover:border-[#D4AF37] shadow-lg transition-all cursor-pointer group"
            >
              {isCatalogExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 text-[#D4AF37] transition-transform group-hover:-translate-y-0.5" />
                  <span>Comprimir Catálogo (Mostrar Menos)</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-[#D4AF37] transition-transform group-hover:translate-y-0.5" />
                  <span>Expandir Catálogo Completo (Ver todos os {SERVICES_CATALOG.length} procedimentos)</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-zinc-500 mt-2">
              {isCatalogExpanded 
                ? 'Exibindo o catálogo completo do Estúdio Dija Tranças.'
                : `Exibindo os ${INITIAL_CARD_LIMIT} mais procurados. Clique para abrir todos os ${SERVICES_CATALOG.length} serviços.`}
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
