// Tiny event bus so any screen can open the global Alua Guide chat widget,
// which is mounted once in the root layout.
type Listener = () => void;

const listeners = new Set<Listener>();

export function onOpenChat(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function openChat(): void {
  listeners.forEach((l) => l());
}
