/* Utility: cn
   Small helper to merge Tailwind class names using clsx + twMerge.
*/
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Merge and dedupe className inputs for Tailwind-compatible output
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
