"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function PrivacyModal() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="underline-offset-2 hover:text-marino-900 hover:underline"
      >
        Aviso de privacidad
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-marino-950/50" onClick={() => setAbierto(false)} />
          <div className="animate-fade-up relative w-full max-w-md rounded-2xl bg-white p-6 text-left shadow-xl">
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 text-marino-400 hover:text-marino-900"
            >
              <X size={18} />
            </button>
            <h3 className="mb-3 pr-6 text-base font-semibold text-marino-900">Aviso de privacidad</h3>
            <p className="text-sm leading-relaxed text-marino-600">
              Los datos que nos dejas (nombre y WhatsApp) los usamos únicamente
              para avisarte cuando Provista esté disponible en Cochabamba. No
              los compartimos ni vendemos a terceros. Si quieres que los
              eliminemos, escríbenos y lo hacemos.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
