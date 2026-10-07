export type DocumentoLegal = "privacidad" | "terminos" | "cookies" | "reembolsos";

export type Seccion = { titulo: string; parrafos?: string[]; lista?: string[] };

export type Documento = {
  titulo: string;
  tituloPestana: string;
  bajada: string;
  secciones: Seccion[];
};

type TextosLegales = {
  etiqueta: string;
  navDocumentos: string;
  actualizado: string;
  fecha: string;
  responsable: string;
  razonSocial: string;
  nit: string;
  matricula: string;
  direccion: string;
  contacto: string;
  enlaces: Record<DocumentoLegal, string>;
  documentos: Record<DocumentoLegal, Documento>;
};

const es: TextosLegales = {
  etiqueta: "Legal",
  navDocumentos: "Documentos legales",
  actualizado: "Última actualización",
  fecha: "4 de octubre de 2026",
  responsable: "Responsable",
  razonSocial: "Razón social",
  nit: "NIT",
  matricula: "Matrícula de comercio",
  direccion: "Dirección",
  contacto: "Contacto",
  enlaces: {
    privacidad: "Privacidad",
    terminos: "Términos",
    cookies: "Cookies",
    reembolsos: "Reembolsos",
  },
  documentos: {
    privacidad: {
      titulo: "Política de privacidad",
      tituloPestana: "Política de privacidad — Entreobra",
      bajada:
        "Qué datos recogemos en este sitio, para qué los usamos, con quién se comparten y cómo puedes pedir que los corrijamos o los borremos.",
      secciones: [
        {
          titulo: "1. Quién recoge tus datos",
          parrafos: [
            "Entreobra es responsable de los datos que nos dejas en este sitio. Abajo están nuestros datos de contacto; por ahí puedes hacernos cualquier consulta sobre tu información.",
          ],
        },
        {
          titulo: "2. Qué datos recogemos y para qué",
          lista: [
            "Formulario de acceso anticipado: tu nombre, tu número de WhatsApp y si estás en obra o vendes materiales. Los usamos solo para avisarte cuando la plataforma abra y para escribirte sobre tu acceso.",
            "Registro de productos, para ferreterías: nombre de la ferretería, persona de contacto, WhatsApp, zona, correo (opcional) y la lista de productos con categoría, medida, marca, unidad, precio, stock y entrega a obra. Los usamos para preparar el catálogo de tu ferretería en Entreobra y para contactarte sobre él.",
            "Mensajes que nos mandes por WhatsApp o correo: los usamos para responderte.",
          ],
          parrafos: [
            "No pedimos ni guardamos datos de pago, documentos de identidad, tu ubicación ni datos sensibles. Este sitio no usa herramientas de analítica, píxeles de publicidad ni cookies (ver la {cookies}).",
          ],
        },
        {
          titulo: "3. Tu consentimiento",
          parrafos: [
            "Solo guardamos tus datos si marcas la casilla de aceptación del formulario. Puedes retirar ese consentimiento cuando quieras escribiéndonos: borramos tus datos y no volvemos a contactarte.",
          ],
        },
        {
          titulo: "4. Qué se muestra públicamente",
          parrafos: [
            "Los datos del formulario de acceso anticipado no se publican. En el registro de productos, cuando la plataforma esté abierta, podrán mostrarse a quienes buscan materiales los productos, precios, stock, el nombre de la ferretería y su zona. Tu nombre, tu WhatsApp y tu correo no se publican.",
          ],
        },
        {
          titulo: "5. Con quién se comparten",
          parrafos: [
            "No vendemos tus datos ni los cedemos a nadie para publicidad. Para que el sitio funcione usamos estos servicios, que procesan datos por cuenta nuestra y pueden tener servidores fuera de Bolivia:",
          ],
          lista: [
            "Google (Google Sheets y Apps Script): guarda lo que envías por los formularios en una hoja privada de Entreobra.",
            "WhatsApp (Meta): solo si eliges escribirnos o enviar tu registro por WhatsApp. En ese caso aplica también la política de privacidad de WhatsApp.",
            "Namecheap: aloja este sitio. Como cualquier servidor web, puede registrar datos técnicos de cada visita (dirección IP, navegador, fecha y hora) por seguridad.",
          ],
        },
        {
          titulo: "6. Cuánto tiempo los guardamos",
          lista: [
            "Acceso anticipado: hasta que la plataforma abra y te hayamos avisado, o hasta que nos pidas borrarlos. Como máximo, 24 meses desde que te registraste.",
            "Registro de productos: mientras tu ferretería esté en Entreobra o hasta que nos pidas retirarla.",
          ],
        },
        {
          titulo: "7. Tus derechos",
          parrafos: [
            "Puedes pedirnos en cualquier momento ver qué datos tenemos tuyos, corregirlos, actualizarlos o borrarlos, y retirar tu consentimiento. Escríbenos {contacto}; te respondemos en un plazo máximo de 10 días hábiles.",
            "Estos derechos están reconocidos en la Constitución Política del Estado (artículos 21 y 130) y en el Decreto Supremo 1793 (artículo 56).",
          ],
        },
        {
          titulo: "8. Seguridad",
          parrafos: [
            "El sitio funciona solo con conexión cifrada (HTTPS). La hoja donde se guardan los formularios es privada: solo acceden las personas de Entreobra que la necesitan para su trabajo.",
          ],
        },
        {
          titulo: "9. Menores de edad",
          parrafos: ["Entreobra está pensada para personas mayores de 18 años y negocios. No recogemos a sabiendas datos de menores."],
        },
        {
          titulo: "10. Cambios",
          parrafos: [
            "Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha. Si el cambio afecta cómo usamos datos que ya nos diste, te pediremos tu consentimiento otra vez.",
          ],
        },
      ],
    },
    terminos: {
      titulo: "Términos y condiciones",
      tituloPestana: "Términos y condiciones — Entreobra",
      bajada: "Las reglas para usar este sitio, el acceso anticipado y el registro de productos de Entreobra.",
      secciones: [
        {
          titulo: "1. Aceptación",
          parrafos: [
            "Al usar este sitio aceptas estos términos. Si no estás de acuerdo, por favor no lo uses. Para el tratamiento de tus datos aplica además la {privacidad}.",
          ],
        },
        {
          titulo: "2. Qué es Entreobra hoy",
          parrafos: [
            "Entreobra es una plataforma en desarrollo para comparar precios y stock de materiales de construcción en Cochabamba. Por ahora este sitio es informativo: presenta el proyecto, recibe registros de acceso anticipado y recibe catálogos de ferreterías. En este sitio no se venden materiales, no se toman pedidos y no se cobra nada.",
          ],
        },
        {
          titulo: "3. Ejemplos y demostración",
          parrafos: [
            "Los nombres de ferreterías, precios, calificaciones, tiempos de entrega, montos de ahorro, obras y pedidos que aparecen en este sitio y en la demo son ejemplos para mostrar cómo funcionará la plataforma. No corresponden a empresas, ofertas ni precios reales, y las funciones mostradas pueden cambiar antes del lanzamiento.",
          ],
        },
        {
          titulo: "4. Acceso anticipado",
          parrafos: [
            "Registrarte es gratis y no te obliga a nada. No garantiza una fecha de apertura ni condiciones especiales. Si en el futuro algún servicio tiene costo, te informaremos las condiciones por escrito antes de cualquier cobro, y solo se aplicarán si las aceptas.",
          ],
        },
        {
          titulo: "5. Registro de productos (ferreterías)",
          parrafos: ["Si envías la lista de productos de una ferretería:"],
          lista: [
            "Declaras que trabajas en esa ferretería o que tienes su autorización para enviar sus datos.",
            "Te comprometes a que la información sea verdadera y a avisarnos cuando cambie. Los precios que envías son referenciales hasta que los confirmes en la plataforma.",
            "Autorizas a Entreobra, sin costo y sin exclusividad, a guardar, ordenar y mostrar esa información en la plataforma. Puedes pedir que la retiremos cuando quieras.",
            "Entreobra puede rechazar o retirar información que sea incorrecta, engañosa o que no corresponda a materiales de construcción.",
          ],
        },
        {
          titulo: "6. Uso permitido",
          parrafos: [
            "No está permitido enviar datos falsos o de otras personas sin su permiso, enviar formularios de forma automatizada, intentar acceder a sistemas o información que no te corresponden, ni usar el sitio para fines ilegales.",
          ],
        },
        {
          titulo: "7. Propiedad intelectual",
          parrafos: [
            "La marca Entreobra, su logo, el diseño, los textos y el código de este sitio pertenecen a Entreobra o a sus licenciantes y están protegidos por la Ley 1322 de Derecho de Autor y la Decisión 486 de la Comunidad Andina. No puedes copiarlos ni usarlos con fines comerciales sin autorización escrita. Las marcas de materiales y de terceros que se mencionan pertenecen a sus dueños.",
          ],
        },
        {
          titulo: "8. Enlaces a otros servicios",
          parrafos: [
            "El sitio tiene enlaces a WhatsApp, redes sociales y otros servicios que no controlamos. Cada uno tiene sus propios términos y políticas.",
          ],
        },
        {
          titulo: "9. Responsabilidad",
          parrafos: [
            "Hacemos lo posible para que el sitio funcione y su información sea correcta, pero puede tener interrupciones o errores. Nada de lo que dicen estos términos limita los derechos que te reconoce la Ley 453 General de los Derechos de las Usuarias y los Usuarios y de las Consumidoras y los Consumidores.",
          ],
        },
        {
          titulo: "10. Cambios",
          parrafos: ["Podemos actualizar estos términos. La versión vigente es siempre la publicada en esta página, con su fecha."],
        },
        {
          titulo: "11. Ley aplicable",
          parrafos: [
            "Estos términos se rigen por las leyes del Estado Plurinacional de Bolivia. Cualquier diferencia se intentará resolver primero conversando; si no, la resolverán los tribunales de Cochabamba, sin perjuicio de tu derecho a reclamar ante las autoridades de defensa del consumidor.",
          ],
        },
      ],
    },
    cookies: {
      titulo: "Política de cookies",
      tituloPestana: "Política de cookies — Entreobra",
      bajada: "Este sitio no usa cookies. Aquí explicamos qué guarda en tu navegador y por qué no te pedimos un aviso de cookies.",
      secciones: [
        {
          titulo: "1. No usamos cookies",
          parrafos: [
            "Este sitio no instala cookies propias ni de terceros. No usa herramientas de analítica, de publicidad ni de seguimiento, y no comparte tu navegación con nadie.",
          ],
        },
        {
          titulo: "2. Lo que sí se guarda en tu navegador",
          parrafos: ["Para que el sitio recuerde lo que tú eliges, guarda unos pocos datos en el almacenamiento local de tu navegador (localStorage). Nunca salen de tu dispositivo:"],
          lista: [
            "entreobra-idioma: el idioma que elegiste (español o inglés).",
            "entreobra-tema: el tema que elegiste (claro u oscuro).",
            "entreobra_registro_v2: solo en el registro de productos, un borrador de tu lista para que no la pierdas si cierras la página. Los productos se borran al enviarlos; los datos de la ferretería quedan para la próxima vez.",
          ],
        },
        {
          titulo: "3. Caché de la aplicación",
          parrafos: [
            "El sitio puede instalarse como aplicación. Para eso guarda en tu navegador una copia de sus propios archivos (páginas, estilos e íconos), para cargar más rápido. Esa copia no contiene datos personales.",
          ],
        },
        {
          titulo: "4. ¿Hace falta un aviso de cookies?",
          parrafos: [
            "No. Lo que se guarda solo sirve para cumplir lo que tú pides (tu idioma, tu tema, tu borrador), no te identifica y no se envía a nadie. Por eso no mostramos un aviso de cookies. Si algún día agregamos herramientas de analítica o publicidad, te pediremos permiso antes de activarlas.",
          ],
        },
        {
          titulo: "5. Cómo borrarlo",
          parrafos: [
            "Puedes borrar todo esto cuando quieras desde la configuración de tu navegador, en la opción de borrar los datos de los sitios. El sitio seguirá funcionando; solo volverá al idioma y al tema por defecto.",
          ],
        },
        {
          titulo: "6. Servicios de terceros",
          parrafos: [
            "Si sigues un enlace a WhatsApp o a nuestras redes sociales, esos servicios pueden usar sus propias cookies según sus políticas.",
          ],
        },
      ],
    },
    reembolsos: {
      titulo: "Política de reembolsos",
      tituloPestana: "Política de reembolsos — Entreobra",
      bajada: "Hoy Entreobra no cobra nada. Esto es lo que pasa con los pagos ahora y lo que pasará cuando haya servicios con costo.",
      secciones: [
        {
          titulo: "1. Hoy no hay cobros",
          parrafos: [
            "El acceso anticipado y el registro de productos son gratis. En este sitio no se procesan pagos ni se venden materiales, así que no hay nada que reembolsar.",
          ],
        },
        {
          titulo: "2. Cuando haya servicios con costo",
          parrafos: [
            "Si Entreobra empieza a cobrar algún servicio (por ejemplo, la cuota para proveedores), antes de cobrar publicaremos en esta página las condiciones de pago, cancelación y reembolso, y se las enviaremos por escrito a quien contrate. Ningún cobro se hará sin que aceptes esas condiciones.",
          ],
        },
        {
          titulo: "3. Si alguien te cobra a nombre de Entreobra",
          parrafos: [
            "Hoy no pedimos pagos por ningún medio. Si alguien te pide dinero a nombre de Entreobra, no pagues y avísanos {contacto}.",
          ],
        },
        {
          titulo: "4. Tus derechos",
          parrafos: [
            "Esta política no limita los derechos que te reconoce la Ley 453 General de los Derechos de las Usuarias y los Usuarios y de las Consumidoras y los Consumidores.",
          ],
        },
      ],
    },
  },
};

const en: TextosLegales = {
  etiqueta: "Legal",
  navDocumentos: "Legal documents",
  actualizado: "Last updated",
  fecha: "October 4, 2026",
  responsable: "Data controller",
  razonSocial: "Legal name",
  nit: "Tax ID (NIT)",
  matricula: "Commercial registration",
  direccion: "Address",
  contacto: "Contact",
  enlaces: {
    privacidad: "Privacy",
    terminos: "Terms",
    cookies: "Cookies",
    reembolsos: "Refunds",
  },
  documentos: {
    privacidad: {
      titulo: "Privacy policy",
      tituloPestana: "Privacy policy — Entreobra",
      bajada:
        "What data we collect on this site, what we use it for, who it is shared with and how you can ask us to correct or delete it.",
      secciones: [
        {
          titulo: "1. Who collects your data",
          parrafos: [
            "Entreobra is responsible for the data you leave on this site. Our contact details are below; you can use them for any question about your information.",
          ],
        },
        {
          titulo: "2. What we collect and why",
          lista: [
            "Early access form: your name, your WhatsApp number and whether you work on a job site or sell materials. We only use them to let you know when the platform opens and to write to you about your access.",
            "Product registration, for hardware stores: store name, contact person, WhatsApp, area, email (optional) and the product list with category, size, brand, unit, price, stock and site delivery. We use them to prepare your store's catalog on Entreobra and to contact you about it.",
            "Messages you send us by WhatsApp or email: we use them to reply to you.",
          ],
          parrafos: [
            "We don't ask for or store payment details, ID documents, your location or sensitive data. This site doesn't use analytics, advertising pixels or cookies (see the {cookies}).",
          ],
        },
        {
          titulo: "3. Your consent",
          parrafos: [
            "We only store your data if you tick the consent box on the form. You can withdraw that consent at any time by writing to us: we delete your data and won't contact you again.",
          ],
        },
        {
          titulo: "4. What is shown publicly",
          parrafos: [
            "Early access data is never published. For product registration, once the platform is open, the products, prices, stock, store name and area may be shown to people looking for materials. Your name, WhatsApp and email are not published.",
          ],
        },
        {
          titulo: "5. Who it is shared with",
          parrafos: [
            "We don't sell your data or give it to anyone for advertising. To run the site we use these services, which process data on our behalf and may have servers outside Bolivia:",
          ],
          lista: [
            "Google (Google Sheets and Apps Script): stores what you send through the forms in a private Entreobra spreadsheet.",
            "WhatsApp (Meta): only if you choose to message us or send your sign-up via WhatsApp. WhatsApp's privacy policy also applies in that case.",
            "Namecheap: hosts this site. Like any web server, it may log technical data for each visit (IP address, browser, date and time) for security.",
          ],
        },
        {
          titulo: "6. How long we keep it",
          lista: [
            "Early access: until the platform opens and we have let you know, or until you ask us to delete it. At most, 24 months from when you signed up.",
            "Product registration: while your store is on Entreobra or until you ask us to remove it.",
          ],
        },
        {
          titulo: "7. Your rights",
          parrafos: [
            "You can ask us at any time to see what data we hold about you, correct it, update it or delete it, and withdraw your consent. Write to us {contacto}; we reply within 10 business days at most.",
            "These rights are recognized in Bolivia's Political Constitution (articles 21 and 130) and in Supreme Decree 1793 (article 56).",
          ],
        },
        {
          titulo: "8. Security",
          parrafos: [
            "The site only works over an encrypted connection (HTTPS). The spreadsheet where forms are stored is private: only the Entreobra team members who need it for their work can access it.",
          ],
        },
        {
          titulo: "9. Minors",
          parrafos: ["Entreobra is meant for people over 18 and for businesses. We don't knowingly collect data from minors."],
        },
        {
          titulo: "10. Changes",
          parrafos: [
            "If we change this policy, we'll publish the new version on this page with its date. If the change affects how we use data you already gave us, we'll ask for your consent again.",
          ],
        },
      ],
    },
    terminos: {
      titulo: "Terms and conditions",
      tituloPestana: "Terms and conditions — Entreobra",
      bajada: "The rules for using this site, early access and Entreobra's product registration.",
      secciones: [
        {
          titulo: "1. Acceptance",
          parrafos: [
            "By using this site you accept these terms. If you don't agree, please don't use it. The {privacidad} also applies to how your data is handled.",
          ],
        },
        {
          titulo: "2. What Entreobra is today",
          parrafos: [
            "Entreobra is a platform in development for comparing prices and stock of construction materials in Cochabamba. For now this site is informational: it presents the project, receives early access sign-ups and receives hardware store catalogs. No materials are sold, no orders are taken and nothing is charged on this site.",
          ],
        },
        {
          titulo: "3. Examples and demo",
          parrafos: [
            "The store names, prices, ratings, delivery times, savings amounts, job sites and orders shown on this site and in the demo are examples of how the platform will work. They don't correspond to real companies, offers or prices, and the features shown may change before launch.",
          ],
        },
        {
          titulo: "4. Early access",
          parrafos: [
            "Signing up is free and doesn't commit you to anything. It doesn't guarantee an opening date or special conditions. If any service has a cost in the future, we'll give you the conditions in writing before any charge, and they'll only apply if you accept them.",
          ],
        },
        {
          titulo: "5. Product registration (hardware stores)",
          parrafos: ["If you send a hardware store's product list:"],
          lista: [
            "You confirm that you work at that store or are authorized by it to send its data.",
            "You agree that the information is true and to let us know when it changes. The prices you send are for reference until you confirm them on the platform.",
            "You authorize Entreobra, free of charge and non-exclusively, to store, organize and show that information on the platform. You can ask us to remove it at any time.",
            "Entreobra may reject or remove information that is incorrect, misleading or not related to construction materials.",
          ],
        },
        {
          titulo: "6. Acceptable use",
          parrafos: [
            "You may not send false data or other people's data without their permission, submit forms automatically, try to access systems or information that aren't yours, or use the site for illegal purposes.",
          ],
        },
        {
          titulo: "7. Intellectual property",
          parrafos: [
            "The Entreobra brand, its logo, design, texts and the code of this site belong to Entreobra or its licensors and are protected by Bolivian Copyright Law 1322 and Andean Community Decision 486. You may not copy them or use them commercially without written permission. Material and third-party brands mentioned belong to their owners.",
          ],
        },
        {
          titulo: "8. Links to other services",
          parrafos: [
            "The site links to WhatsApp, social networks and other services we don't control. Each has its own terms and policies.",
          ],
        },
        {
          titulo: "9. Liability",
          parrafos: [
            "We do our best to keep the site working and its information correct, but it may have interruptions or errors. Nothing in these terms limits your rights under Bolivia's Law 453 on the Rights of Users and Consumers.",
          ],
        },
        {
          titulo: "10. Changes",
          parrafos: ["We may update these terms. The current version is always the one published on this page, with its date."],
        },
        {
          titulo: "11. Governing law",
          parrafos: [
            "These terms are governed by the laws of the Plurinational State of Bolivia. We'll first try to resolve any disagreement by talking; otherwise, the courts of Cochabamba will decide, without prejudice to your right to file a claim with the consumer protection authorities.",
          ],
        },
      ],
    },
    cookies: {
      titulo: "Cookie policy",
      tituloPestana: "Cookie policy — Entreobra",
      bajada: "This site doesn't use cookies. Here's what it stores in your browser and why we don't show a cookie banner.",
      secciones: [
        {
          titulo: "1. We don't use cookies",
          parrafos: [
            "This site doesn't set its own or third-party cookies. It doesn't use analytics, advertising or tracking tools, and doesn't share your browsing with anyone.",
          ],
        },
        {
          titulo: "2. What is stored in your browser",
          parrafos: ["To remember your choices, the site keeps a few items in your browser's local storage (localStorage). They never leave your device:"],
          lista: [
            "entreobra-idioma: the language you chose (Spanish or English).",
            "entreobra-tema: the theme you chose (light or dark).",
            "entreobra_registro_v2: only on the product registration page, a draft of your list so you don't lose it if you close the page. Products are cleared when you send them; store details are kept for next time.",
          ],
        },
        {
          titulo: "3. App cache",
          parrafos: [
            "The site can be installed as an app. For that it keeps a copy of its own files (pages, styles and icons) in your browser so it loads faster. That copy contains no personal data.",
          ],
        },
        {
          titulo: "4. Is a cookie banner needed?",
          parrafos: [
            "No. What is stored only serves what you ask for (your language, your theme, your draft), doesn't identify you and isn't sent to anyone. That's why we don't show a cookie banner. If we ever add analytics or advertising tools, we'll ask for your permission before turning them on.",
          ],
        },
        {
          titulo: "5. How to delete it",
          parrafos: [
            "You can delete all of this at any time from your browser settings, using the option to clear site data. The site will keep working; it will just return to the default language and theme.",
          ],
        },
        {
          titulo: "6. Third-party services",
          parrafos: ["If you follow a link to WhatsApp or our social networks, those services may use their own cookies under their policies."],
        },
      ],
    },
    reembolsos: {
      titulo: "Refund policy",
      tituloPestana: "Refund policy — Entreobra",
      bajada: "Entreobra doesn't charge anything today. This is what happens with payments now, and what will happen when there are paid services.",
      secciones: [
        {
          titulo: "1. No charges today",
          parrafos: [
            "Early access and product registration are free. No payments are processed and no materials are sold on this site, so there is nothing to refund.",
          ],
        },
        {
          titulo: "2. When there are paid services",
          parrafos: [
            "If Entreobra starts charging for a service (for example, the supplier fee), before charging we'll publish the payment, cancellation and refund conditions on this page and send them in writing to whoever signs up. No charge will be made unless you accept those conditions.",
          ],
        },
        {
          titulo: "3. If someone charges you in Entreobra's name",
          parrafos: [
            "We don't request payments through any channel today. If someone asks you for money in Entreobra's name, don't pay and let us know {contacto}.",
          ],
        },
        {
          titulo: "4. Your rights",
          parrafos: ["This policy doesn't limit your rights under Bolivia's Law 453 on the Rights of Users and Consumers."],
        },
      ],
    },
  },
};

export const LEGAL = { es, en };

export const RUTAS_LEGALES: Record<DocumentoLegal, string> = {
  privacidad: "/privacidad",
  terminos: "/terminos",
  cookies: "/cookies",
  reembolsos: "/reembolsos",
};
