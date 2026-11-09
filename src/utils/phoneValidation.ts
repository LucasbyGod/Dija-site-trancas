/**
 * Brazilian Phone validation and formatting utilities
 * Requirements:
 * 1. Must contain 2-digit DDD followed by 8 or 9 digits (total 10 or 11 digits).
 * 2. Ignore spaces, parentheses, dashes, or '+' in digit count.
 * 3. Reject invalid, incomplete, fake or <10 digit entries with a clear, polite explanation.
 * 4. Format valid numbers into standard (XX) 9XXXX-XXXX or (XX) XXXX-XXXX.
 */

export const extractPhoneDigits = (raw: string): string => {
  if (!raw) return '';
  let digits = raw.replace(/\D/g, '');
  
  // If user entered country code (+55 / 55) resulting in 12 or 13 digits, trim the leading 55
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    digits = digits.slice(2);
  }
  return digits;
};

export const formatToStandardPattern = (raw: string): string => {
  const digits = extractPhoneDigits(raw);
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return raw;
};

export const formatPhoneLive = (val: string): string => {
  if (!val) return '';
  let digits = val.replace(/\D/g, '');
  
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    digits = digits.slice(2);
  }
  
  // Limit to max 11 digits (DDD + 9 digits)
  digits = digits.slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export interface PhoneValidationResult {
  isValid: boolean;
  error: string | null;
  formatted: string;
  digits: string;
}

export const validateBrazilianPhone = (raw: string): PhoneValidationResult => {
  if (!raw || !raw.trim()) {
    return {
      isValid: false,
      error: 'Por favor, informe seu número de telefone ou WhatsApp com DDD.',
      formatted: '',
      digits: '',
    };
  }

  // Check if user typed invalid non-numeric symbols or letters
  const hasLetters = /[a-zA-Z]/.test(raw);
  if (hasLetters) {
    return {
      isValid: false,
      error: 'O número não pode conter letras. Por favor, digite apenas números com o DDD (ex: 85998765432 ou (85) 99876-5432).',
      formatted: raw,
      digits: '',
    };
  }

  const digits = extractPhoneDigits(raw);

  // Check length: must be exactly 10 or 11 digits
  if (digits.length < 10) {
    return {
      isValid: false,
      error: `Número incompleto (${digits.length} dígitos informados). É necessário fornecer o DDD (2 dígitos) seguido pelo número (8 ou 9 dígitos), totalizando 10 ou 11 dígitos numéricos (ex: (85) 99876-5432).`,
      formatted: formatPhoneLive(raw),
      digits,
    };
  }

  if (digits.length > 11) {
    return {
      isValid: false,
      error: `Número com excesso de dígitos (${digits.length} dígitos encontrados). Digite apenas o DDD com 2 dígitos e o número com 8 ou 9 dígitos.`,
      formatted: formatPhoneLive(raw),
      digits,
    };
  }

  // Validate Brazilian DDD range (11 to 99, DDDs do not start with 0)
  const dddNum = parseInt(digits.slice(0, 2), 10);
  if (dddNum < 11 || dddNum > 99) {
    return {
      isValid: false,
      error: `O DDD informado (${digits.slice(0, 2)}) não é válido no Brasil. Digite um DDD válido (ex: 85 para Fortaleza/CE).`,
      formatted: formatPhoneLive(raw),
      digits,
    };
  }

  // Validate fake/repetitive numbers (e.g. 0000000000, 11111111111, 99999999999)
  if (/^(\d)\1+$/.test(digits)) {
    return {
      isValid: false,
      error: 'Número repetido ou inválido detectado. Por favor, forneça um número de telefone real com DDD para que possamos confirmar seu agendamento.',
      formatted: formatPhoneLive(raw),
      digits,
    };
  }

  const formatted = formatToStandardPattern(digits);

  return {
    isValid: true,
    error: null,
    formatted,
    digits,
  };
};
