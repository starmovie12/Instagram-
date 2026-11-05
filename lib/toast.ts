"use client";
/**
 * Tiny toast / snackbar bus (PRD M12, §12 Undo). Rendered once by <Toaster/>.
 * Auto-dismiss 4 000 ms, 6 000 ms when there is an action (Undo).
 */
export type ToastTone = "neutral" | "success" | "info" | "error";
export type ToastInput = { message: string; tone?: ToastTone; action?: { label: string; run: () => void }; duration?: number };
export type ToastItem = ToastInput & { id: number };

type Listener = (t: ToastItem | null) => void;
const listeners = new Set<Listener>();
let seq = 0;

export function toast(input: ToastInput): number {
  const item: ToastItem = { ...input, id: ++seq };
  listeners.forEach((l) => l(item));
  return item.id;
}
export function dismissToast() { listeners.forEach((l) => l(null)); }
export function onToast(l: Listener): () => void {
  listeners.add(l);
  return () => { listeners.delete(l); };
}
