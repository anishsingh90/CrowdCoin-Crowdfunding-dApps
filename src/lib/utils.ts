import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEther(value: number): string {
  return `${value} ETH`;
}

export function timeLeft(deadline: number): string {
  const now = new Date().getTime();
  const deadlineDate = new Date(deadline * 1000);
  if (now > deadlineDate.getTime()) {
    return "Ended";
  }
  return formatDistanceToNow(deadlineDate, { addSuffix: true });
}
