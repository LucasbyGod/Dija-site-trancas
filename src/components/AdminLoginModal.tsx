import React, { useState } from 'react';
import { Lock, Mail, KeyRound, X, AlertCircle, Sparkles, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('dijatrancas@gmail.com');
  const [password, setPassword] = useState('dija2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      setIsLoading(false);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          if (onLoginSuccess) onLoginSuccess();
        }, 1200);
      } else {
        setError(result.error || 'Credenciais inválidas.');
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setEmail('dijatrancas@gmail.com');
    setPassword('dija2026');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121216] border-2 border-[#D4AF37]/50 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.85)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#18181D] px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#F3D079]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">
                Acesso Restrito · Área da Proprietária
              </h3>
              <p className="text-[11px] text-zinc-400">Estúdio Dija Tranças · Painel de Gestão</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-400 animate-in zoom-in-75 duration-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-display text-lg font-bold text-white">Sessão Autenticada com Sucesso!</h4>
              <p className="text-xs text-zinc-400">
                Bem-vinda, Dija. Os botões de gerenciamento da galeria foram desbloqueados.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Security Banner */}
              <div className="p-3 bg-[#1A1813] border border-[#D4AF37]/30 rounded-xl text-xs text-zinc-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-white">Autenticação de Segurança</p>
                  <p className="text-[11px] text-zinc-400">
                    Apenas a proprietária pode publicar, editar fotos e excluir itens do portfólio.
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-xl text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  E-mail Administrativo
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dijatrancas@gmail.com"
                  className="w-full bg-[#18181D] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#D4AF37] outline-none transition-colors"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Senha de Acesso
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Ocultar' : 'Mostrar'}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#18181D] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#D4AF37] outline-none transition-colors"
                  required
                />
              </div>

              {/* Quick Fill / Helper Tip for Owner */}
              <div className="p-2.5 bg-[#151519] border border-zinc-800 rounded-lg flex items-center justify-between text-[11px]">
                <div className="text-zinc-400">
                  <span>Credenciais padrão: </span>
                  <strong className="text-zinc-200">dijatrancas@gmail.com</strong>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[#F3D079] hover:underline cursor-pointer font-medium ml-2"
                >
                  Preencher
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-[#18181D] hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 gold-gradient-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-105 active:scale-98 transition-all disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>Entrando...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Acessar Painel</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
