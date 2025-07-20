export const getInitials = (name?: string | null): string => {
    if (!name || typeof name !== "string") return "";
  
    const parts = name
      .trim()
      .split(/\s+/)
      .filter((part) => /^[a-zA-Z]/.test(part));
  
    if (parts.length === 0) return "";
  
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
  
    const firstInitial = parts[0][0].toUpperCase();
    const lastInitial = parts[parts.length - 1][0].toUpperCase();
  
    return firstInitial + lastInitial;
  }
  