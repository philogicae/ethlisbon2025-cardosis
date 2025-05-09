import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: string | number) {
  const amount = Number(value);

  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(2) + 'B'; 
  } else if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(2) + 'M';
  } else if (amount >= 1_000) {
    return (amount / 1_000).toFixed(2) + 'K';
  } else {
    return amount.toFixed(2).toString(); // Less than 1K
  }
}