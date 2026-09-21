import { Hero } from "@/components/sections/Hero";
import { MaterialesTicker } from "@/components/sections/MaterialesTicker";
import { Problema } from "@/components/sections/Problema";
import { ComoFunciona } from "@/components/sections/ComoFunciona";
import { Diferenciador } from "@/components/sections/Diferenciador";
import { ParaQuienEs } from "@/components/sections/ParaQuienEs";
import { Formulario } from "@/components/sections/Formulario";
import { SeccionOnda } from "@/components/ui/SeccionOnda";
import { COLORES } from "@/lib/colores";

export default function Home() {
  return (
    <>
      <Hero />
      <MaterialesTicker />
      <SeccionOnda fondo={COLORES.blanco} color={COLORES.grisSeccion} />
      <Problema />
      <SeccionOnda fondo={COLORES.grisSeccion} color={COLORES.blanco} />
      <ComoFunciona />
      <SeccionOnda fondo={COLORES.blanco} color={COLORES.grisSeccion} />
      <Diferenciador />
      <SeccionOnda fondo={COLORES.grisSeccion} color={COLORES.blanco} />
      <ParaQuienEs />
      <SeccionOnda fondo={COLORES.blanco} color={COLORES.marino900} />
      <Formulario />
      <SeccionOnda fondo={COLORES.marino900} color={COLORES.grisSeccion} />
    </>
  );
}
