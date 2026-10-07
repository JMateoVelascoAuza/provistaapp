export type TipoUsuario = "obra" | "proveedor";

const EVENTO = "entreobra:tipo-usuario";

export function elegirTipoUsuario(tipo: TipoUsuario) {
  window.dispatchEvent(new CustomEvent<TipoUsuario>(EVENTO, { detail: tipo }));
}

export function escucharTipoUsuario(callback: (tipo: TipoUsuario) => void) {
  const handler = (evento: Event) => callback((evento as CustomEvent<TipoUsuario>).detail);
  window.addEventListener(EVENTO, handler);
  return () => window.removeEventListener(EVENTO, handler);
}
