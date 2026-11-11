import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US').format(val);
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

// Pseudo-random generator with fixed seed for deterministic reproducibility
export class SeededRandom {
  private m = 0x80000000; // 2**31
  private a = 1103515245;
  private c = 12345;
  private state: number;

  constructor(seed: number = 42) {
    this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
  }

  nextInt(): number {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }

  nextFloat(): number {
    // returns in [0, 1)
    return this.nextInt() / (this.m - 1);
  }

  nextRange(min: number, max: number): number {
    return min + this.nextFloat() * (max - min);
  }
}

