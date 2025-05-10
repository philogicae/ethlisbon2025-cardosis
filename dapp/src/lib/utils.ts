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

export function humanReadableDate(date: string | number | Date) {
  const now = new Date();
  const inputDate = new Date(date);
  const diff = now.getTime() - inputDate.getTime();
  const diffDays = Math.floor(diff / (1000 * 3600 * 24));

  if (diffDays === 0) {
    return `today ${inputDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return "yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return inputDate.toLocaleDateString(); // Or format as desired
  }
}