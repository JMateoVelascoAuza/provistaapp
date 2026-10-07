import { Hero } from "@/components/sections/Hero";
import { Materiales } from "@/components/sections/Materiales";
import { Problema } from "@/components/sections/Problema";
import { ComoFunciona } from "@/components/sections/ComoFunciona";
import { Comparador } from "@/components/sections/Comparador";
import { DosLados } from "@/components/sections/DosLados";
import { Formulario } from "@/components/sections/Formulario";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <main id="contenido">
        <Hero />
        <Materiales />
        <Problema />
        <ComoFunciona />
        <Comparador />
        <DosLados />
        <Formulario />
      </main>
      <Footer tono="claro" />
    </>
  );
}
