// Después de `npm run build:hosting`. Con trailingSlash, Next 16 exporta los
// datos de cada segmento en carpetas ("demo/__next.demo/__PAGE__.txt") pero
// el navegador los pide con punto ("demo/__next.demo.__PAGE__.txt") y recibe
// 404. Se deja una copia con el nombre que se pide.
import fs from "node:fs";
import path from "node:path";

const out = path.resolve("out");
let copias = 0;
function recorrer(dir) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, entrada.name);
    if (!entrada.isDirectory() || entrada.name === "_next") continue;
    if (entrada.name.startsWith("__next.")) {
      for (const archivo of fs.readdirSync(ruta, { withFileTypes: true })) {
        if (!archivo.isFile()) continue;
        fs.copyFileSync(path.join(ruta, archivo.name), path.join(dir, `${entrada.name}.${archivo.name}`));
        copias++;
      }
    } else {
      recorrer(ruta);
    }
  }
}
recorrer(out);
console.log(`[export] ${copias} archivos de segmento con nombre compatible.`);
