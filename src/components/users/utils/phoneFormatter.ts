
export const formatInitialPhoneNumber = (phone: string | undefined) => {
  if (!phone) return "";
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return cleaned;
};

export const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 11);
  
  let formatted = limited;
  if (limited.length > 0) {
    if (limited.length <= 2) {
      formatted = `(${limited}`;
    } else if (limited.length <= 3) {
      formatted = `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else if (limited.length <= 7) {
      formatted = `(${limited.slice(0, 2)}) ${limited.slice(2, 3)} ${limited.slice(3)}`;
    } else if (limited.length <= 11) {
      if (limited.length === 10) {
        formatted = `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
      } else {
        formatted = `(${limited.slice(0, 2)}) ${limited.slice(2, 3)} ${limited.slice(3, 7)}-${limited.slice(7)}`;
      }
    }
  }
  return formatted;
};
