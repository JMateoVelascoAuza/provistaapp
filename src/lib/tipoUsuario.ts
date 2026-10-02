export type TipoUsuario = "obra" | "proveedor";

const EVENTO = "entreobra:tipo-usuario";

/**
 * Los CTA de "Dos lados" ("Sin costo · Empezar" / "Entrar como
 * fundador") llevan al formulario con el tipo de usuario ya elegido.
 * Un evento de ventana alcanza: el formulario es una sola instancia en
 * la misma página, no hace falta un contexto de React para esto.
 */
export function elegirTipoUsuario(tipo: TipoUsuario) {
  window.dispatchEvent(new CustomEvent<TipoUsuario>(EVENTO, { detail: tipo }));
}

export function escucharTipoUsuario(callback: (tipo: TipoUsuario) => void) {
  const handler = (evento: Event) => callback((evento as CustomEvent<TipoUsuario>).detail);
  window.addEventListener(EVENTO, handler);
  return () => window.removeEventListener(EVENTO, handler);
}
