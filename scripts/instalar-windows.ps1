#requires -Version 5.1
<#
  Entreobra — instala el entorno de trabajo completo en Windows 10/11.

  Qué hace (salta lo que ya esté instalado):
    1. Git, Node.js LTS, GitHub CLI y Visual Studio Code (con winget).
    2. Las extensiones de VS Code del proyecto.
    3. Coloca el proyecto: lo usa si este script ya está dentro de él, lo
       descomprime desde entreobra-proyecto.zip si está al lado, o lo clona
       de GitHub.
    4. Instala las dependencias (npm ci) y verifica que todo funcione.

  Uso: doble clic en INSTALAR.bat, o en PowerShell:
    powershell -ExecutionPolicy Bypass -File instalar-windows.ps1
  Opciones:
    -Destino "D:\Proyectos\provista-landing"   (carpeta del proyecto)
    -SinVSCode                                  (no instala VS Code)
    -SoloProyecto                               (salta las herramientas: solo proyecto y dependencias)
#>
param(
  [string]$Destino = (Join-Path $env:USERPROFILE "StudioProjects\provista-landing"),
  [switch]$SinVSCode,
  [switch]$SoloProyecto
)

$ErrorActionPreference = "Stop"
$REPO = "https://github.com/JMateoVelascoAuza/provistaapp.git"
$ZIP = Join-Path $PSScriptRoot "entreobra-proyecto.zip"

function Paso($texto) { Write-Host ""; Write-Host "==> $texto" -ForegroundColor Cyan }
function Ok($texto) { Write-Host "    OK  $texto" -ForegroundColor Green }
function Aviso($texto) { Write-Host "    !!  $texto" -ForegroundColor Yellow }
function Tiene($comando) { return [bool](Get-Command $comando -ErrorAction SilentlyContinue) }
function Recargar-Path {
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
  $local = Join-Path $env:USERPROFILE ".local\bin"
  if (Test-Path $local) { $env:Path = "$env:Path;$local" }
}

function Instalar-Winget($id, $nombre, $comando) {
  if (Tiene $comando) { Ok "$nombre ya está instalado"; return }
  Write-Host "    Instalando $nombre..."
  winget install --id $id -e --source winget --accept-package-agreements --accept-source-agreements --silent
  # -1978335189 y -1978335135: winget dice que ya estaba instalado / sin actualización.
  if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne -1978335189 -and $LASTEXITCODE -ne -1978335135) {
    throw "No se pudo instalar $nombre (winget devolvió $LASTEXITCODE)."
  }
  Recargar-Path
  if (Tiene $comando) { Ok "$nombre instalado" }
  else { Aviso "$nombre quedó instalado, pero esta ventana todavía no lo ve. Si algo falla más abajo, cierra y vuelve a abrir INSTALAR.bat." }
}

function Ejecutar($descripcion, [scriptblock]$bloque) {
  & $bloque
  if ($LASTEXITCODE -ne 0) { throw "$descripcion falló (código $LASTEXITCODE)." }
}

Write-Host ""
Write-Host "  ENTREOBRA · instalación del entorno de trabajo" -ForegroundColor White
Write-Host "  ---------------------------------------------" -ForegroundColor DarkGray

if (-not $SoloProyecto) {
# ---------------------------------------------------------------------------
Paso "1/5 Comprobando winget"
if (-not (Tiene "winget")) {
  Aviso "Falta winget (Instalador de aplicaciones de Microsoft)."
  Write-Host "    Ábrelo desde Microsoft Store, actualiza 'Instalador de aplicación' y vuelve a correr este script."
  Start-Process "ms-windows-store://pdp/?ProductId=9NBLGGH4NNS1"
  exit 1
}
Ok "winget disponible"

# ---------------------------------------------------------------------------
Paso "2/5 Herramientas"
Instalar-Winget "Git.Git" "Git" "git"
Instalar-Winget "OpenJS.NodeJS.LTS" "Node.js LTS" "node"
Instalar-Winget "GitHub.cli" "GitHub CLI" "gh"
if (-not $SinVSCode) { Instalar-Winget "Microsoft.VisualStudioCode" "Visual Studio Code" "code" }

$nodeMayor = [int]((& node -v).TrimStart("v").Split(".")[0])
if ($nodeMayor -lt 20) { throw "Node $(& node -v) es muy viejo: el proyecto necesita 20.9 o más. Actualízalo con: winget upgrade OpenJS.NodeJS.LTS" }
Ok "Node $(& node -v) · npm $(& npm.cmd -v) · $(& git --version)"

# Identidad de git (para que los commits salgan a tu nombre)
$nombreGit = (& git config --global user.name) 2>$null
if (-not $nombreGit) {
  $nombreGit = Read-Host "    Tu nombre para git (ej. Mateo Velasco)"
  if ($nombreGit) { & git config --global user.name "$nombreGit" }
}
$correoGit = (& git config --global user.email) 2>$null
if (-not $correoGit) {
  $correoGit = Read-Host "    Tu correo de GitHub"
  if ($correoGit) { & git config --global user.email "$correoGit" }
}
# Rutas de más de 260 caracteres (node_modules profundos) en Windows.
& git config --global core.longpaths true
Ok "git configurado como: $(& git config --global user.name) <$(& git config --global user.email)>"

# ---------------------------------------------------------------------------
if (Tiene "code") {
  foreach ($ext in @("dbaeumer.vscode-eslint", "bradlc.vscode-tailwindcss")) {
    & code --install-extension $ext --force | Out-Null
  }
  Ok "Extensiones de VS Code: ESLint, Tailwind CSS"
}

}

# ---------------------------------------------------------------------------
Paso "3/5 Proyecto"
$padre = Split-Path $PSScriptRoot -Parent
if (Test-Path (Join-Path $padre "package.json")) {
  $Proyecto = $padre
  Ok "Uso el proyecto donde está este script: $Proyecto"
}
elseif (Test-Path (Join-Path $Destino "package.json")) {
  $Proyecto = $Destino
  Ok "El proyecto ya existe en $Proyecto (no lo sobrescribo)"
}
elseif (Test-Path $ZIP) {
  Write-Host "    Descomprimiendo entreobra-proyecto.zip en $Destino ..."
  New-Item -ItemType Directory -Force -Path $Destino | Out-Null
  Expand-Archive -Path $ZIP -DestinationPath $Destino -Force
  $Proyecto = $Destino
  Ok "Proyecto descomprimido (incluye historial de git, cambios sin commitear y archivos .env)"
}
else {
  Write-Host "    No encontré el zip: clono el repositorio de GitHub en $Destino ..."
  New-Item -ItemType Directory -Force -Path (Split-Path $Destino -Parent) | Out-Null
  Ejecutar "git clone" { & git clone $REPO $Destino }
  $Proyecto = $Destino
  Aviso "Clonado de GitHub: solo trae lo que esté subido (los .env no viajan por git)."
}
Set-Location $Proyecto
Ok "Rama actual: $(& git branch --show-current)"

# ---------------------------------------------------------------------------
Paso "4/5 Dependencias del proyecto (npm ci)"
Ejecutar "npm ci" { & npm.cmd ci --no-audit --no-fund }
Ok "Dependencias instaladas"

$envProd = Join-Path $Proyecto ".env.production.local"
if (-not (Test-Path $envProd)) {
  Aviso "Falta .env.production.local (URL del Apps Script para la versión publicada)."
  $url = Read-Host "    Pega la URL que termina en /exec (o Enter para dejarlo para después)"
  if ($url -match '^https://script\.google\.com/macros/s/[\w-]+/exec$') {
    Set-Content -Path $envProd -Value "NEXT_PUBLIC_APPS_SCRIPT_URL=$url" -Encoding ascii
    Ok ".env.production.local creado"
  }
  elseif ($url) { Aviso "Esa URL no parece de Apps Script; no la guardé." }
}
else { Ok ".env.production.local presente" }

# ---------------------------------------------------------------------------
Paso "5/5 Verificación"
# En PowerShell 5.1, redirigir la salida de error de npm con "Stop" corta el
# script aunque la prueba pase: aquí solo importa el código de salida.
$ErrorActionPreference = "Continue"
$fallos = 0
foreach ($p in @(@("Prueba del Apps Script", "prueba:script"), @("Tipos (TypeScript)", "typecheck"), @("Lint", "lint"))) {
  & npm.cmd run $p[1] --silent *> $null
  if ($LASTEXITCODE -eq 0) { Ok $p[0] } else { Aviso "$($p[0]) falló: corre 'npm run $($p[1])' para ver el detalle"; $fallos++ }
}

Write-Host ""
if ($fallos -eq 0) { Write-Host "  Todo listo." -ForegroundColor Green } else { Write-Host "  Instalado, con $fallos verificación(es) para revisar." -ForegroundColor Yellow }
Write-Host ""
Write-Host "  Proyecto: $Proyecto" -ForegroundColor White
Write-Host "  Próximos pasos (en una terminal nueva, dentro de esa carpeta):"
Write-Host "    code .                  abre el proyecto en VS Code"
Write-Host "    npm run dev             sitio local en http://localhost:3000"
Write-Host "    npm run banco           hoja de prueba en http://localhost:5050/hoja"
Write-Host "    npm run dev:banco       sitio local enviando a la hoja de prueba"
Write-Host "    npm run build:hosting   versión para Namecheap (carpeta out/)"
Write-Host "    gh auth login           conectar GitHub para poder hacer push"
Write-Host ""
