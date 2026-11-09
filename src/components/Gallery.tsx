import React, { useState, useEffect } from 'react';
import { 
  Camera, Eye, X, Calendar, Sparkles, ChevronDown, ChevronUp, 
  Plus, Edit3, Trash2, ShieldCheck, RefreshCw, Layers
} from 'lucide-react';
import { GalleryPhoto, GalleryCategoryTag } from '../types';
import { 
  getGalleryPhotos, 
  saveGalleryPhoto, 
  deleteGalleryPhoto, 
  resetGalleryToDefaults 
} from '../utils/galleryStorage';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminPhotoModal } from './AdminPhotoModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export type GalleryFilterCategory = 
  | 'todos' 
  | 'Fulany Braids' 
  | 'Box Braids' 
  | 'Nagô & Tiaras' 
  | 'Crochet & Cachos' 
  | 'Linha Masculina';

interface GalleryProps {
  onScheduleStyle: (styleName: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onScheduleStyle }) => {
  const { isAuthenticated, adminUser } = useAdminAuth();

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<GalleryPhoto | null>(null);
  const [activeFilter, setActiveFilter] = useState<GalleryFilterCategory>('todos');
  const [isGalleryExpanded, setIsGalleryExpanded] = useState<boolean>(false);

  // Admin CRUD state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [photoToEdit, setPhotoToEdit] = useState<GalleryPhoto | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<GalleryPhoto | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Load photos from storage on mount
  const loadPhotos = async () => {
    setIsLoading(true);
    try {
      const data = await getGalleryPhotos();
      setPhotos(data);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Admin Actions
  const handleOpenAddPhoto = () => {
    setPhotoToEdit(null);
    setIsPhotoModalOpen(true);
  };

  const handleOpenEditPhoto = (photo: GalleryPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoToEdit(photo);
    setIsPhotoModalOpen(true);
  };

  const handleOpenDeleteConfirm = (photo: GalleryPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoToDelete(photo);
  };

  const handleSavePhoto = async (savedPhoto: GalleryPhoto) => {
    await saveGalleryPhoto(savedPhoto);
    await loadPhotos();
    showFeedback(
      photoToEdit
        ? `Foto "${savedPhoto.title}" atualizada com sucesso!`
        : `Nova foto "${savedPhoto.title}" publicada na galeria!`
    );
  };

  const handleConfirmDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteGalleryPhoto(id);
      await loadPhotos();
      setPhotoToDelete(null);
      showFeedback('Foto excluída da galeria com sucesso.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Deseja restaurar as 23 fotos originais padrão do estúdio?')) {
      const defaults = await resetGalleryToDefaults();
      setPhotos(defaults);
      showFeedback('Galeria restaurada para o catálogo padrão do estúdio.');
    }
  };

  // Filter categories calculation
  const filterCategories: { id: GalleryFilterCategory; label: string; count: number }[] = [
    { id: 'todos', label: 'Todas as Fotos Reais', count: photos.length },
    { id: 'Fulany Braids', label: 'Fulany Braids', count: photos.filter(i => i.category === 'Fulany Braids').length },
    { id: 'Box Braids', label: 'Box Braids & Cachos', count: photos.filter(i => i.category === 'Box Braids').length },
    { id: 'Nagô & Tiaras', label: 'Nagô & Tiaras', count: photos.filter(i => i.category === 'Nagô & Tiaras').length },
    { id: 'Crochet & Cachos', label: 'Crochet & Cachos', count: photos.filter(i => i.category === 'Crochet & Cachos').length },
    { id: 'Linha Masculina', label: 'Linha Masculina', count: photos.filter(i => i.category === 'Linha Masculina').length },
  ];

  const filteredItems = photos.filter(
    (item) => activeFilter === 'todos' || item.category === activeFilter
  );

  const INITIAL_GALLERY_LIMIT = 8;
  const shouldLimitGallery = activeFilter === 'todos' && !isGalleryExpanded;
  const displayedItems = shouldLimitGallery
    ? filteredItems.slice(0, INITIAL_GALLERY_LIMIT)
    : filteredItems;

  return (
    <section id="galeria" className="py-14 sm:py-20 bg-[#09090B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase bg-[#18181B] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30">
            <Camera className="w-3.5 h-3.5" />
            <span>Portfólio com {photos.length} Fotos Reais do Estúdio</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Galeria Oficial do Estúdio Dija Tranças
          </h2>

          <p className="text-sm sm:text-base text-zinc-400">
            Trabalhos 100% reais realizados no nosso espaço no Bairro Damas em Fortaleza. Veja cada detalhe de simetria, acabamento nas pontas, nagô artística e caimento de cachos.
          </p>
        </div>

        {/* Feedback Alert for Admin operations */}
        {actionFeedback && (
          <div className="max-w-md mx-auto mb-6 p-3 bg-emerald-950/80 border border-emerald-500/70 rounded-xl text-emerald-200 text-xs text-center shadow-lg animate-in fade-in duration-200 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Admin Management Toolbar (Visible ONLY to authenticated owner) */}
        {isAuthenticated && (
          <div className="mb-8 p-4 bg-gradient-to-r from-[#1E1B13] via-[#16161A] to-[#1E1B13] border-2 border-[#D4AF37] rounded-2xl shadow-[0_8px_30px_rgba(212,175,55,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-black font-bold flex items-center justify-center shrink-0 shadow-md">
                👑
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Modo Proprietária Ativo</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-medium">
                    Autenticado ({adminUser?.name || 'Dija'})
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Você tem controle total: adicione novas fotos, edite títulos/categorias ou exclua fotos da galeria.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={handleResetDefaults}
                title="Restaurar catálogo inicial"
                className="px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-[#18181D] hover:bg-zinc-800 border border-zinc-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden md:inline">Restaurar Padrão</span>
              </button>

              <button
                onClick={handleOpenAddPhoto}
                className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:scale-102 active:scale-98 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Adicionar Nova Foto</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {filterCategories.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveFilter(cat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#D4AF37] text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                    : 'bg-[#151518] text-zinc-300 hover:text-white hover:bg-[#1E1E24] border border-zinc-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
                  isActive ? 'bg-black/20 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Header bar above the scrollbox when expanded (stays at the beginning and never floats over photos) */}
        {isGalleryExpanded && !isLoading && (
          <div className="mb-3 px-3.5 py-2.5 bg-[#141418] border border-[#D4AF37]/40 rounded-xl flex items-center justify-between text-xs text-zinc-300 shadow-sm animate-in fade-in duration-200">
            <span className="flex items-center gap-2 text-[#F3D079] font-semibold">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              <span>Álbum Completo</span>
            </span>
            <span className="text-[11px] text-zinc-400">
              {filteredItems.length} fotos disponíveis · Navegue pela rolagem
            </span>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-zinc-900/60 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : (
          /* GALLERY CONTAINER:
             - When collapsed: standard inline grid
             - When expanded: Scrollbox with fixed max-height (650px / 75vh) and internal vertical scrollbar! */
          <div
            className={`transition-all duration-300 ${
              isGalleryExpanded
                ? 'max-h-[650px] overflow-y-auto pr-2 gold-scrollbar rounded-2xl border-2 border-[#D4AF37]/30 bg-[#0C0C0F]/60 p-3 sm:p-4 shadow-inner'
                : ''
            }`}
          >
            {/* Gallery Grid (Balanced 4 columns on desktop, 2 on mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-5">
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="group relative rounded-2xl overflow-hidden bg-[#141418] border border-zinc-800 hover:border-[#D4AF37]/60 transition-all cursor-pointer shadow-md hover:shadow-[0_8px_30px_rgba(212,175,55,0.2)] flex flex-col"
                >
                  {/* Image Frame with portrait ratio */}
                  <div className="aspect-[3/4] w-full overflow-hidden bg-black relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106 filter contrast-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    {/* Real Photo Badge */}
                    <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-[10px] font-semibold text-[#F3D079] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                      Foto Real
                    </span>

                    {/* ADMIN FLOATING ACTION BUTTONS (When authenticated as owner) */}
                    {isAuthenticated && (
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10 animate-in fade-in duration-200">
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditPhoto(item, e)}
                          title="Editar Foto"
                          className="p-1.5 bg-black/85 hover:bg-[#D4AF37] text-white hover:text-black border border-[#D4AF37]/60 rounded-lg shadow-md transition-all cursor-pointer group/btn"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDeleteConfirm(item, e)}
                          title="Excluir Foto"
                          className="p-1.5 bg-black/85 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/60 rounded-lg shadow-md transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bottom Scrim Info */}
                  <div className="p-3 bg-[#121216] border-t border-zinc-800/80 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-0.5">
                        {item.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#F3D079] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 text-[#F3D079]">
                        <Eye className="w-3 h-3" />
                        <span>Ampliar</span>
                      </span>
                      <span className="text-zinc-500">Estúdio Dija</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Expand / Collapse Gallery Control Button */}
        {activeFilter === 'todos' && !isLoading && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[#18181D] hover:bg-[#222228] text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] shadow-lg transition-all cursor-pointer group"
            >
              {isGalleryExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 text-[#D4AF37] transition-transform group-hover:-translate-y-0.5" />
                  <span>Recolher Galeria (Mostrar Menos)</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-[#D4AF37] transition-transform group-hover:translate-y-0.5" />
                  <span>Ver Todas as Fotos (+{photos.length - INITIAL_GALLERY_LIMIT} fotos reais)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Lightbox / Zoom Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative max-w-lg w-full bg-[#141418] border border-[#D4AF37]/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
              
              <div className="relative aspect-[3/4] max-h-[60vh] bg-black overflow-hidden">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain bg-black"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:text-[#D4AF37] border border-white/20 transition-colors cursor-pointer"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-3 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                      {selectedImage.category} · Procedimento Real
                    </span>
                    <h3 className="text-lg font-bold text-white font-display">
                      {selectedImage.title}
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-400">Damas · Fortaleza</span>
                </div>

                {selectedImage.description && (
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {selectedImage.description}
                  </p>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-end">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 cursor-pointer"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      const service = selectedImage.serviceTarget || selectedImage.title;
                      setSelectedImage(null);
                      onScheduleStyle(service);
                    }}
                    className="gold-gradient-btn px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar Este Procedimento</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Modal for Creating / Editing Photo */}
        <AdminPhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => {
            setIsPhotoModalOpen(false);
            setPhotoToEdit(null);
          }}
          photoToEdit={photoToEdit}
          onSavePhoto={handleSavePhoto}
        />

        {/* Modal for Confirming Deletion */}
        <DeleteConfirmModal
          isOpen={!!photoToDelete}
          onClose={() => setPhotoToDelete(null)}
          photo={photoToDelete}
          onConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />

      </div>
    </section>
  );
};
