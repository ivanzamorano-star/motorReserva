"use client";

import * as React from "react";

// Multi-idioma reactivo (ES/EN) para el sitio público. Cambia al instante vía
// contexto. Se traduce por pantalla; las claves sin traducir caen al español.
export type Idioma = "es" | "en";

const DICT: Record<Idioma, Record<string, string>> = {
  es: {
    // Header
    "nav.hotel": "El hotel",
    "nav.rooms": "Habitaciones",
    "nav.restaurant": "Restaurant",
    "nav.bar": "Bar",
    "nav.contact": "Contacto",
    "nav.panel": "Panel del hotel",
    // Hero
    "hero.overline": "Punta Arenas · Patagonia Chilena",
    "hero.title": "Tradición y calidez en el corazón de Punta Arenas",
    "hero.subtitle":
      "Un edificio histórico frente a la Plaza de Armas, a pasos del Estrecho de Magallanes.",
    "hero.support":
      "Reserve en línea con disponibilidad real y confirmación inmediata — directo con el hotel, sin intermediarios.",
    "hero.discover": "Descubre",
    // Buscador
    "sb.checkin": "Check-in",
    "sb.checkout": "Check-out",
    "sb.guests": "Huéspedes",
    "sb.search": "Buscar disponibilidad",
    "sb.viewRooms": "Ver habitaciones",
    "sb.searching": "Buscando…",
    "sb.emailToggle":
      "¿Ya te hospedaste con nosotros? Ingresa tu correo para tu tarifa exclusiva",
    "sb.emailLabel": "Tu descuento exclusivo de cliente",
    "sb.emailPlaceholder":
      "Ingresa tu correo y reconoceremos tu nivel al instante…",
    "sb.recognizedNew":
      "¡Hola {nombre}! Reserva directa al mejor precio garantizado.",
    "sb.notFound":
      "No encontramos ese correo, pero puedes reservar igual al mejor precio directo.",
    // Home · Nuestro hotel
    "home.hotel.eyebrow": "Nuestro hotel",
    "home.hotel.title": "Un clásico de Punta Arenas",
    "home.hotel.subtitle":
      "El Hotel Cabo Froward forma parte de la identidad histórica de la ciudad. Una estadía cálida y cercana, en una ubicación privilegiada para descubrir la Patagonia chilena.",
    "home.hotel.c1.title": "Ubicación privilegiada",
    "home.hotel.c1.text":
      "Frente a la Plaza de Armas y a pasos de restaurantes, cafeterías, museos y los principales atractivos de Punta Arenas.",
    "home.hotel.c2.title": "Puerta de entrada a la Patagonia",
    "home.hotel.c2.text":
      "El punto de partida ideal para descubrir Torres del Paine, el Estrecho de Magallanes y las grandes aventuras del sur de Chile.",
    "home.hotel.c3.title": "Tradición y calidez austral",
    "home.hotel.c3.text":
      "Un hotel con identidad histórica, espacios acogedores y la hospitalidad característica del extremo sur del mundo.",
    // Home · Habitaciones (showcase)
    "home.rooms.eyebrow": "Alojamiento",
    "home.rooms.title": "Nuestras habitaciones",
    "home.rooms.subtitle":
      "Espacios cálidos y cuidados en un edificio de época, con detalles clásicos, ropa de cama impecable y el silencio del extremo sur. Elija la suya y reserve con tarifa directa.",
    "home.rooms.badge": "Más exclusiva",
    "home.rooms.upTo": "Hasta {n} huéspedes",
    "home.rooms.from": "Desde",
    "home.rooms.perNight": "/ noche",
    "home.rooms.book": "Reservar",
    "home.rooms.viewAll": "Ver todas las habitaciones y disponibilidad",
    // Home · Gastronomía
    "home.food.eyebrow": "Gastronomía",
    "home.food.title": "Dos comedores, una misma tradición",
    "home.food.room1.eyebrow": "Ambiente 01",
    "home.food.room1.title": "Comedor Nao Victoria",
    "home.food.room1.text":
      "Bautizado en honor al buque de alto bordo Nao Victoria, este salón rinde homenaje al esplendor neoclásico traído por los pioneros y estancieros patagónicos a fines del siglo XIX. Entre molduras doradas y líneas clásicas, revive la misma elegancia europea que definió los palacios históricos de Punta Arenas.",
    "home.food.room2.eyebrow": "Ambiente 02",
    "home.food.room2.title": "Comedor Charles Darwin",
    "home.food.room2.text":
      "Un comedor vidriado en homenaje a Charles Darwin, quien cruzó el Estrecho de Magallanes a bordo del HMS Beagle y encontró en esta tierra austral un laboratorio natural que marcaría para siempre la historia de la ciencia. Entre plantas nativas y luz natural, el espacio invita a observar la Patagonia con la misma curiosidad del naturalista.",
    "home.food.subtitle":
      "Del salón dorado de gala al comedor vidriado con vista a la ciudad: dos escenarios para disfrutar la cocina de Hotel Cabo Froward.",
    "home.bar.eyebrow": "Bar",
    "home.bar.tag": "Cócteles de autor",
    "home.bar.title": "Bar Luis Pardo",
    "home.bar.subtitle":
      "Un salón de líneas neoclásicas, maderas cálidas y luz de araña, bautizado en homenaje al marino Luis Pardo Villalón, quien zarpó desde Punta Arenas al mando del Yelcho y rescató, en pleno invierno antártico de 1916, a los 22 hombres de la expedición de Ernest Shackleton. Hoy es el lugar donde nuestros huéspedes se reúnen a conversar, disfrutar un cóctel de autor y sentirse en casa, cómodos, en el confín de la Patagonia.",
    "home.food.c1.title": "Hecho en casa",
    "home.food.c1.text": "Queques y panes recién horneados cada mañana.",
    "home.food.c2.title": "Comedor histórico",
    "home.food.c2.text": "Mesas vestidas en un salón de época.",
    "home.food.c3.title": "Café de la casa",
    "home.food.c3.text": "Para comenzar el día antes de salir a explorar.",
    // Home · Franja aspiracional
    "home.cta.eyebrow": "Su base en el fin del mundo",
    "home.cta.title":
      "Duerma en el corazón de Punta Arenas, despierte en la Patagonia",
    "home.cta.subtitle":
      "Torres del Paine, el Estrecho de Magallanes y los pingüinos de Magdalena, a un paso de su habitación.",
    "home.cta.button": "Reserve su estadía",
    // Footer
    "footer.address": "Plaza de Armas, Punta Arenas",
    "footer.region": "Región de Magallanes, Chile",
    "footer.contact": "Contacto",
    "footer.engine": "Motor de reservas",
    "footer.engineText":
      "Demo comercial construida por ia works spa — desarrollo de software a medida en Magallanes.",
    "footer.legal":
      "© 2026 Hotel Cabo Froward · Prototipo de demostración, no procesa pagos reales",
    // Resultados / disponibilidad
    "res.title": "Disponibilidad para su estadía",
    "res.night": "noche",
    "res.nights": "noches",
    "res.guests": "huésped(es)",
    "res.vs.eyebrow": "Reservando directo con nosotros",
    "res.vs.bestPrice": "Mejor precio garantizado",
    "res.vs.flexCancel": "Cancelación flexible",
    "res.vs.noFees": "Sin cargos de gestión",
    "res.vs.directCare": "Atención directa y personal",
    "res.vip.title":
      "Tu descuento exclusivo de cliente {nivel} de −{pct}% ya está aplicado",
    "res.vip.subtitle":
      "Los precios de abajo ya incluyen tu beneficio. Elige tu habitación para comenzar la reserva.",
    "res.soldOut.title": "No quedan habitaciones para estas fechas.",
    "res.soldOut.subtitle":
      "Puede intentar con otras fechas u otro número de huéspedes.",
    // RoomCard
    "rc.lastRoom": "Última habitación disponible",
    "rc.only2": "Solo quedan 2 disponibles",
    "rc.noVacancy": "Sin cupo",
    "rc.upTo": "Hasta {n} huéspedes",
    "rc.nightsTotal": "{n} {label} · total",
    "rc.perNightTaxes": "{precio} / noche · impuestos incluidos",
    "rc.savings": "Ahorras {monto} con tu tarifa exclusiva",
    "rc.soldOutDates": "Agotado para estas fechas",
    "rc.book": "Reservar",
    // Checkout — encabezado de la página de reserva
    "co.eyebrow": "Reserva directa",
    "co.title": "Complete su reserva",
    "co.subtitle":
      "A pasos de confirmar su estadía en el corazón histórico de Punta Arenas.",
    // Servicios adicionales (paso 1)
    "as.step": "Paso 1 de 3",
    "as.title": "Personaliza tu estancia",
    "as.subtitle":
      "Añade servicios para hacer tu estadía aún más especial. Este paso es opcional.",
    "as.courtesy": "Cortesía",
    "as.totalExtra": "Total extra",
    "as.continue": "Continuar con mis datos",
    "as.svc.traslado-vip.name": "Traslado VIP al Aeropuerto",
    "as.svc.traslado-vip.desc":
      "Traslado privado desde y hacia el aeropuerto de Punta Arenas.",
    "as.svc.lavanderia.name": "Lavandería y Tintorería Express",
    "as.svc.lavanderia.desc": "Lavado y planchado con entrega el mismo día.",
    "as.svc.minibar-premium.name": "Minibar Premium",
    "as.svc.minibar-premium.desc":
      "Minibar pre-abastecido con una selección de licores y destilados.",
    "as.svc.conectividad.name": "Kit de Conectividad",
    "as.svc.conectividad.desc":
      "Adaptadores internacionales y cargadores para todos sus dispositivos.",
    "as.svc.cuna-bebe.name": "Cuna para bebé",
    "as.svc.cuna-bebe.desc": "Cuna equipada instalada en su habitación, sin costo.",
    "as.svc.in-room-dining.name": "Experiencia In-Room Dining",
    "as.svc.in-room-dining.desc":
      "Desayuno servido en la cama para comenzar el día con calma.",
    // Formulario de checkout (datos, pago, resumen)
    "cf.guestData": "Datos del huésped",
    "cf.fullName": "Nombre completo",
    "cf.fullNamePh": "Nombre y apellido",
    "cf.email": "Correo electrónico",
    "cf.emailPh": "nombre@correo.com",
    "cf.phone": "Teléfono",
    "cf.phonePh": "+56 9 1234 5678",
    "cf.back": "Volver",
    "cf.continuePay": "Continuar al pago",
    "cf.payTitle": "Pago",
    "cf.cardNumber": "Número de tarjeta",
    "cf.expiry": "Vencimiento",
    "cf.cvv": "CVV",
    "cf.demoNote":
      "Ambiente de demostración — no se procesa ningún cobro real.",
    "cf.pay": "Pagar {monto}",
    "cf.processing": "Confirmando disponibilidad y procesando el pago…",
    "cf.processingNote":
      "Estamos bloqueando la habitación y validando el pago con Transbank en tiempo real.",
    "cf.summary": "Resumen de reserva",
    "cf.extraServices": "Servicios adicionales",
    "cf.courtesy": "Cortesía",
    "cf.totalFinal": "Total final",
    "cf.taxNote": "Impuestos incluidos · sin cargos adicionales al pagar",
    "cf.holdNote": "Bloqueo de disponibilidad activo por 15 min",
    "cf.freeCancel": "Cancelación gratuita hasta 48 h antes del check-in",
    "cf.securePay": "Pago seguro con Webpay · Transbank",
    "cf.rating": "4,8",
    "cf.reviewsSuffix": "· 312 reseñas de huéspedes",
    // Documento tributario
    "tds.title": "Documento tributario",
    "tds.subtitle": "¿Cómo desea recibir su documento de pago?",
    "tds.boleta.title": "Boleta Electrónica",
    "tds.boleta.sub": "Para personas naturales",
    "tds.factura.title": "Factura de Empresa",
    "tds.factura.sub": "Con datos tributarios",
    "tds.boletaNote":
      "Su boleta electrónica será enviada automáticamente al correo principal de la reserva.",
    "tds.razonSocial": "Razón Social",
    "tds.rut": "RUT Empresa",
    "tds.giro": "Giro Comercial",
    "tds.direccion": "Dirección Comercial",
    "tds.emailDTE": "Correo de Facturación (DTE)",
    "tds.giroPh": "Servicios de turismo",
    "tds.emailDTEph":
      "dte@suempresa.cl — donde recibe sus documentos tributarios",
    // Confirmación
    "ca.eyebrow": "Reserva confirmada",
    "ca.title": "¡Le esperamos en Punta Arenas!",
    "ca.bodyPre": "Su reserva en ",
    "ca.bodyPost": " quedó confirmada. Recibirá el detalle en su correo.",
    "ca.code": "Código de reserva",
    "ca.emailSent": "Confirmación enviada automáticamente por correo",
    "ca.changeTitle": "¿Necesitas cambiar o cancelar?",
    "ca.changePre": "Escríbenos con tu código ",
    "ca.changePost": " y recepción te ayuda al instante.",
    "ca.call": "Llamar",
    "ca.email": "Correo",
    "ca.freeCancel": "Cancelación gratuita hasta 48 h antes del check-in.",
    "ca.backHome": "Volver al inicio",
    // Prueba social + urgencia (A3)
    "rc.rating": "4,8",
    "rc.reviewsCount": "{n} reseñas",
    "rc.viewing": "{n} viendo ahora",
    "rc.bookedAgo": "Reservada hace {n} h",
    // Portal del huésped (nav + página)
    "nav.account": "Mi cuenta",
    "mc.eyebrow": "Portal del huésped",
    "mc.title": "Mi cuenta",
    "mc.subtitle":
      "Ingresa tu correo para ver tu nivel de fidelización, tu beneficio de tarifa y tus reservas.",
    "mc.emailLabel": "Correo electrónico",
    "mc.emailPh": "tu@correo.com",
    "mc.enter": "Ingresar",
    "mc.searching": "Buscando…",
    "mc.demoHint":
      "Demo: prueba con marcela.ortuzar@example.com (VIP) o j.whitfield@example.com (Frecuente).",
    "mc.notFound.title": "No encontramos ese correo",
    "mc.notFound.body":
      "Revisa que esté bien escrito, o reserva directo para comenzar a acumular beneficios.",
    "mc.greeting": "Hola, {nombre}",
    "mc.tier.title": "Tu nivel de fidelización",
    "mc.tier.benefit": "−{pct}% en tu tarifa exclusiva",
    "mc.tier.appliedNote":
      "Se aplica automáticamente al reservar directo con este correo.",
    "mc.tier.newBenefit": "Reserva directo para desbloquear tarifas exclusivas",
    "mc.tier.newNote":
      "Aún no tienes beneficio de nivel. Con tu próxima estadía directa comienzas a acumular.",
    "mc.level.nuevo": "Nuevo",
    "mc.level.frecuente": "Frecuente",
    "mc.level.vip": "VIP",
    "mc.history.title": "Tus reservas",
    "mc.history.empty":
      "Aún no tienes reservas registradas con este correo.",
    "mc.manage": "Gestionar",
    "mc.logout": "Usar otro correo",
    "mc.estado.pendiente_pago": "Pago pendiente",
    "mc.estado.confirmada": "Confirmada",
    "mc.estado.expirada": "Expirada",
    "mc.estado.cancelada_huesped": "Cancelada",
    "mc.estado.cancelada_hotel": "Cancelada por el hotel",
    "mc.estado.no_show": "No-show",
    "mc.estado.reembolsada": "Reembolsada",
    "mc.detail.title": "Detalle de la reserva",
    "mc.detail.code": "Código",
    "mc.detail.room": "Habitación",
    "mc.detail.dates": "Fechas",
    "mc.detail.guests": "Huéspedes",
    "mc.detail.total": "Total",
    "mc.detail.status": "Estado",
    "mc.detail.help": "¿Necesitas cambiar o cancelar?",
    "mc.detail.helpBody":
      "Escríbenos con tu código y recepción te ayuda al instante.",
    "mc.detail.call": "Llamar",
    "mc.detail.email": "Correo",
    // B2 — progreso de fidelización
    "mc.tier.stays": "{n} estadías directas con nosotros",
    "mc.tier.toNext": "Te faltan {n} para el nivel {nivel}",
    "mc.tier.top": "Ya estás en el nivel máximo. ¡Gracias por tu preferencia!",
    // A4 — nuevos servicios (upsell en el flujo)
    "as.svc.late-checkout.name": "Late check-out (hasta 14:00)",
    "as.svc.late-checkout.desc": "Disfruta la mañana sin apuros y sal más tarde.",
    "as.svc.early-checkin.name": "Early check-in (desde 10:00)",
    "as.svc.early-checkin.desc": "Entra antes a tu habitación tras un viaje largo.",
    // A2 — métodos de pago
    "pm.title": "Método de pago",
    "pm.card": "Tarjeta (Webpay)",
    "pm.card.desc": "Pago inmediato y seguro con Transbank.",
    "pm.hotel": "Pagar en el hotel",
    "pm.hotel.desc": "Reserva ahora y paga al llegar en recepción.",
    "pm.hotelNote":
      "No se te cobra ahora. Solicitamos una tarjeta solo para garantizar la reserva; el pago total se realiza en el hotel.",
    "pm.deposit": "Depósito / seña",
    "pm.deposit.desc": "Paga una parte ahora y el resto al llegar.",
    "pm.depositNote": "Pagas {sena} ahora ({pct}%) y {resto} al llegar al hotel.",
    "pm.confirmHotel": "Confirmar reserva",
    "pm.payDeposit": "Pagar seña {monto}",
    // C3 — retomar búsqueda por correo
    "ss.title": "¿Aún lo estás pensando?",
    "ss.body": "Te enviamos esta búsqueda por correo para que la retomes cuando quieras, al mejor precio directo.",
    "ss.placeholder": "tu@correo.com",
    "ss.button": "Enviarme la búsqueda",
    "ss.done": "¡Listo! Te enviamos tu búsqueda a {email}.",
  },
  en: {
    // Header
    "nav.hotel": "The hotel",
    "nav.rooms": "Rooms",
    "nav.restaurant": "Restaurant",
    "nav.bar": "Bar",
    "nav.contact": "Contact",
    "nav.panel": "Hotel panel",
    // Hero
    "hero.overline": "Punta Arenas · Chilean Patagonia",
    "hero.title": "Tradition and warmth in the heart of Punta Arenas",
    "hero.subtitle":
      "A historic building facing the Plaza de Armas, steps from the Strait of Magellan.",
    "hero.support":
      "Book online with real-time availability and instant confirmation — directly with the hotel, no intermediaries.",
    "hero.discover": "Discover",
    // Search bar
    "sb.checkin": "Check-in",
    "sb.checkout": "Check-out",
    "sb.guests": "Guests",
    "sb.search": "Search availability",
    "sb.viewRooms": "View rooms",
    "sb.searching": "Searching…",
    "sb.emailToggle":
      "Stayed with us before? Enter your email for your exclusive rate",
    "sb.emailLabel": "Your exclusive guest discount",
    "sb.emailPlaceholder":
      "Enter your email and we'll recognize your tier instantly…",
    "sb.recognizedNew": "Hi {nombre}! Book direct for the best guaranteed price.",
    "sb.notFound":
      "We couldn't find that email, but you can still book at the best direct price.",
    // Home · Our hotel
    "home.hotel.eyebrow": "Our hotel",
    "home.hotel.title": "A Punta Arenas classic",
    "home.hotel.subtitle":
      "The Hotel Cabo Froward is part of the city's historic identity. A warm, welcoming stay in a privileged location to explore Chilean Patagonia.",
    "home.hotel.c1.title": "Prime location",
    "home.hotel.c1.text":
      "Facing the Plaza de Armas and steps from restaurants, cafés, museums and the main attractions of Punta Arenas.",
    "home.hotel.c2.title": "Gateway to Patagonia",
    "home.hotel.c2.text":
      "The ideal starting point to discover Torres del Paine, the Strait of Magellan and the great adventures of southern Chile.",
    "home.hotel.c3.title": "Southern tradition and warmth",
    "home.hotel.c3.text":
      "A hotel with historic character, cozy spaces and the hospitality typical of the world's far south.",
    // Home · Rooms (showcase)
    "home.rooms.eyebrow": "Accommodation",
    "home.rooms.title": "Our rooms",
    "home.rooms.subtitle":
      "Warm, well-kept spaces in a period building, with classic details, impeccable linens and the silence of the far south. Choose yours and book at the direct rate.",
    "home.rooms.badge": "Most exclusive",
    "home.rooms.upTo": "Up to {n} guests",
    "home.rooms.from": "From",
    "home.rooms.perNight": "/ night",
    "home.rooms.book": "Book",
    "home.rooms.viewAll": "View all rooms and availability",
    // Home · Dining
    "home.food.eyebrow": "Dining",
    "home.food.title": "Two dining rooms, one tradition",
    "home.food.room1.eyebrow": "Setting 01",
    "home.food.room1.title": "Nao Victoria Dining Room",
    "home.food.room1.text":
      "Named after the tall ship Nao Victoria, this hall pays tribute to the neoclassical splendor brought by Patagonia's pioneers and sheep barons in the late 19th century. Amid gilded moldings and classical lines, it revives the same European elegance that defined Punta Arenas' historic mansions.",
    "home.food.room2.eyebrow": "Setting 02",
    "home.food.room2.title": "Charles Darwin Dining Room",
    "home.food.room2.text":
      "A glass-walled dining room paying tribute to Charles Darwin, who crossed the Strait of Magellan aboard the HMS Beagle and found in this southern land a natural laboratory that would forever change the history of science. Amid native plants and natural light, the space invites you to observe Patagonia with the same curiosity as the naturalist.",
    "home.food.subtitle":
      "From the gilded grand salon to the glass-walled dining room overlooking the city — two settings to enjoy the cuisine of Hotel Cabo Froward.",
    "home.bar.eyebrow": "Bar",
    "home.bar.tag": "Signature Cocktails",
    "home.bar.title": "Luis Pardo Bar",
    "home.bar.subtitle":
      "A neoclassical lounge of warm woods and chandelier light, named in honor of Chilean sailor Luis Pardo Villalón, who set sail from Punta Arenas aboard the Yelcho and rescued, in the depths of the 1916 Antarctic winter, the 22 men of Ernest Shackleton's stranded expedition. Today it's where our guests gather to talk, enjoy a signature cocktail, and feel completely at home at the edge of Patagonia.",
    "home.food.c1.title": "Homemade",
    "home.food.c1.text": "Cakes and breads freshly baked every morning.",
    "home.food.c2.title": "Historic dining room",
    "home.food.c2.text": "Dressed tables in a period hall.",
    "home.food.c3.title": "House coffee",
    "home.food.c3.text": "To start the day before heading out to explore.",
    // Home · Aspirational band
    "home.cta.eyebrow": "Your base at the end of the world",
    "home.cta.title":
      "Sleep in the heart of Punta Arenas, wake up in Patagonia",
    "home.cta.subtitle":
      "Torres del Paine, the Strait of Magellan and the Magdalena penguins, just steps from your room.",
    "home.cta.button": "Book your stay",
    // Footer
    "footer.address": "Plaza de Armas, Punta Arenas",
    "footer.region": "Magallanes Region, Chile",
    "footer.contact": "Contact",
    "footer.engine": "Booking engine",
    "footer.engineText":
      "Commercial demo built by ia works spa — custom software development in Magallanes.",
    "footer.legal":
      "© 2026 Hotel Cabo Froward · Demonstration prototype, does not process real payments",
    // Results / availability
    "res.title": "Availability for your stay",
    "res.night": "night",
    "res.nights": "nights",
    "res.guests": "guest(s)",
    "res.vs.eyebrow": "Booking direct with us",
    "res.vs.bestPrice": "Best price guaranteed",
    "res.vs.flexCancel": "Flexible cancellation",
    "res.vs.noFees": "No booking fees",
    "res.vs.directCare": "Direct, personal service",
    "res.vip.title":
      "Your exclusive {nivel} customer discount of −{pct}% is already applied",
    "res.vip.subtitle":
      "The prices below already include your benefit. Choose your room to start the reservation.",
    "res.soldOut.title": "No rooms left for these dates.",
    "res.soldOut.subtitle":
      "You can try other dates or a different number of guests.",
    // RoomCard
    "rc.lastRoom": "Last room available",
    "rc.only2": "Only 2 left",
    "rc.noVacancy": "Sold out",
    "rc.upTo": "Up to {n} guests",
    "rc.nightsTotal": "{n} {label} · total",
    "rc.perNightTaxes": "{precio} / night · taxes included",
    "rc.savings": "You save {monto} with your exclusive rate",
    "rc.soldOutDates": "Sold out for these dates",
    "rc.book": "Book",
    // Checkout — booking page header
    "co.eyebrow": "Direct booking",
    "co.title": "Complete your booking",
    "co.subtitle":
      "Just steps from confirming your stay in the historic heart of Punta Arenas.",
    // Additional services (step 1)
    "as.step": "Step 1 of 3",
    "as.title": "Customize your stay",
    "as.subtitle":
      "Add services to make your stay even more special. This step is optional.",
    "as.courtesy": "Complimentary",
    "as.totalExtra": "Extras total",
    "as.continue": "Continue to my details",
    "as.svc.traslado-vip.name": "VIP Airport Transfer",
    "as.svc.traslado-vip.desc":
      "Private transfer to and from Punta Arenas airport.",
    "as.svc.lavanderia.name": "Express Laundry & Dry Cleaning",
    "as.svc.lavanderia.desc": "Wash and press with same-day delivery.",
    "as.svc.minibar-premium.name": "Premium Minibar",
    "as.svc.minibar-premium.desc":
      "Minibar pre-stocked with a selection of spirits and liquors.",
    "as.svc.conectividad.name": "Connectivity Kit",
    "as.svc.conectividad.desc":
      "International adapters and chargers for all your devices.",
    "as.svc.cuna-bebe.name": "Baby Crib",
    "as.svc.cuna-bebe.desc": "A fully equipped crib set up in your room, at no cost.",
    "as.svc.in-room-dining.name": "In-Room Dining Experience",
    "as.svc.in-room-dining.desc":
      "Breakfast served in bed to start the day calmly.",
    // Checkout form (details, payment, summary)
    "cf.guestData": "Guest details",
    "cf.fullName": "Full name",
    "cf.fullNamePh": "First and last name",
    "cf.email": "Email",
    "cf.emailPh": "name@email.com",
    "cf.phone": "Phone",
    "cf.phonePh": "+56 9 1234 5678",
    "cf.back": "Back",
    "cf.continuePay": "Continue to payment",
    "cf.payTitle": "Payment",
    "cf.cardNumber": "Card number",
    "cf.expiry": "Expiry",
    "cf.cvv": "CVV",
    "cf.demoNote":
      "Demo environment — no real charge is processed.",
    "cf.pay": "Pay {monto}",
    "cf.processing": "Confirming availability and processing payment…",
    "cf.processingNote":
      "We're holding the room and validating the payment with Transbank in real time.",
    "cf.summary": "Booking summary",
    "cf.extraServices": "Additional services",
    "cf.courtesy": "Complimentary",
    "cf.totalFinal": "Final total",
    "cf.taxNote": "Taxes included · no extra charges at payment",
    "cf.holdNote": "Availability held for 15 min",
    "cf.freeCancel": "Free cancellation up to 48h before check-in",
    "cf.securePay": "Secure payment with Webpay · Transbank",
    "cf.rating": "4.8",
    "cf.reviewsSuffix": "· 312 guest reviews",
    // Tax document
    "tds.title": "Tax document",
    "tds.subtitle": "How would you like to receive your payment document?",
    "tds.boleta.title": "Electronic Receipt",
    "tds.boleta.sub": "For individuals",
    "tds.factura.title": "Company Invoice",
    "tds.factura.sub": "With tax details",
    "tds.boletaNote":
      "Your electronic receipt will be sent automatically to the booking's main email.",
    "tds.razonSocial": "Company Name",
    "tds.rut": "Company Tax ID (RUT)",
    "tds.giro": "Business Activity",
    "tds.direccion": "Business Address",
    "tds.emailDTE": "Billing Email (DTE)",
    "tds.giroPh": "Tourism services",
    "tds.emailDTEph":
      "dte@yourcompany.cl — where you receive your tax documents",
    // Confirmation
    "ca.eyebrow": "Booking confirmed",
    "ca.title": "We look forward to seeing you in Punta Arenas!",
    "ca.bodyPre": "Your booking for ",
    "ca.bodyPost": " is confirmed. You'll receive the details by email.",
    "ca.code": "Booking code",
    "ca.emailSent": "Confirmation sent automatically by email",
    "ca.changeTitle": "Need to change or cancel?",
    "ca.changePre": "Message us with your code ",
    "ca.changePost": " and reception will help you right away.",
    "ca.call": "Call",
    "ca.email": "Email",
    "ca.freeCancel": "Free cancellation up to 48h before check-in.",
    "ca.backHome": "Back to home",
    // Social proof + urgency (A3)
    "rc.rating": "4.8",
    "rc.reviewsCount": "{n} reviews",
    "rc.viewing": "{n} viewing now",
    "rc.bookedAgo": "Booked {n}h ago",
    // Guest portal (nav + page)
    "nav.account": "My account",
    "mc.eyebrow": "Guest portal",
    "mc.title": "My account",
    "mc.subtitle":
      "Enter your email to see your loyalty tier, your rate benefit and your bookings.",
    "mc.emailLabel": "Email",
    "mc.emailPh": "you@email.com",
    "mc.enter": "Continue",
    "mc.searching": "Searching…",
    "mc.demoHint":
      "Demo: try marcela.ortuzar@example.com (VIP) or j.whitfield@example.com (Frequent).",
    "mc.notFound.title": "We couldn't find that email",
    "mc.notFound.body":
      "Check the spelling, or book direct to start earning benefits.",
    "mc.greeting": "Hi, {nombre}",
    "mc.tier.title": "Your loyalty tier",
    "mc.tier.benefit": "−{pct}% on your exclusive rate",
    "mc.tier.appliedNote":
      "Applied automatically when you book direct with this email.",
    "mc.tier.newBenefit": "Book direct to unlock exclusive rates",
    "mc.tier.newNote":
      "You don't have a tier benefit yet. Your next direct stay starts earning it.",
    "mc.level.nuevo": "New",
    "mc.level.frecuente": "Frequent",
    "mc.level.vip": "VIP",
    "mc.history.title": "Your bookings",
    "mc.history.empty": "You don't have any bookings under this email yet.",
    "mc.manage": "Manage",
    "mc.logout": "Use another email",
    "mc.estado.pendiente_pago": "Payment pending",
    "mc.estado.confirmada": "Confirmed",
    "mc.estado.expirada": "Expired",
    "mc.estado.cancelada_huesped": "Cancelled",
    "mc.estado.cancelada_hotel": "Cancelled by hotel",
    "mc.estado.no_show": "No-show",
    "mc.estado.reembolsada": "Refunded",
    "mc.detail.title": "Booking details",
    "mc.detail.code": "Code",
    "mc.detail.room": "Room",
    "mc.detail.dates": "Dates",
    "mc.detail.guests": "Guests",
    "mc.detail.total": "Total",
    "mc.detail.status": "Status",
    "mc.detail.help": "Need to change or cancel?",
    "mc.detail.helpBody":
      "Message us with your code and reception will help right away.",
    "mc.detail.call": "Call",
    "mc.detail.email": "Email",
    // B2 — loyalty progress
    "mc.tier.stays": "{n} direct stays with us",
    "mc.tier.toNext": "{n} more to reach {nivel} tier",
    "mc.tier.top": "You're already at the top tier. Thank you for your loyalty!",
    // A4 — new services (in-flow upsell)
    "as.svc.late-checkout.name": "Late check-out (until 2:00 PM)",
    "as.svc.late-checkout.desc": "Enjoy a relaxed morning and leave later.",
    "as.svc.early-checkin.name": "Early check-in (from 10:00 AM)",
    "as.svc.early-checkin.desc": "Get into your room earlier after a long trip.",
    // A2 — payment methods
    "pm.title": "Payment method",
    "pm.card": "Card (Webpay)",
    "pm.card.desc": "Instant, secure payment with Transbank.",
    "pm.hotel": "Pay at the hotel",
    "pm.hotel.desc": "Book now and pay at reception on arrival.",
    "pm.hotelNote":
      "You won't be charged now. We request a card only to guarantee the booking; full payment is made at the hotel.",
    "pm.deposit": "Deposit",
    "pm.deposit.desc": "Pay part now and the rest on arrival.",
    "pm.depositNote": "You pay {sena} now ({pct}%) and {resto} on arrival.",
    "pm.confirmHotel": "Confirm booking",
    "pm.payDeposit": "Pay deposit {monto}",
    // C3 — resume search by email
    "ss.title": "Still thinking it over?",
    "ss.body": "We'll email you this search so you can pick it up anytime, at the best direct price.",
    "ss.placeholder": "you@email.com",
    "ss.button": "Email me the search",
    "ss.done": "Done! We sent your search to {email}.",
  },
};

type Traducir = (key: string, vars?: Record<string, string | number>) => string;

interface IdiomaCtx {
  idioma: Idioma;
  setIdioma: (i: Idioma) => void;
  t: Traducir;
}

const Ctx = React.createContext<IdiomaCtx | null>(null);

function interpolar(texto: string, vars?: Record<string, string | number>) {
  if (!vars) return texto;
  return texto.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function IdiomaProvider({ children }: { children: React.ReactNode }) {
  const [idioma, setIdiomaState] = React.useState<Idioma>("es");

  React.useEffect(() => {
    const g = localStorage.getItem("idioma");
    if (g === "en" || g === "es") setIdiomaState(g);
  }, []);

  const setIdioma = React.useCallback((i: Idioma) => {
    setIdiomaState(i);
    try {
      localStorage.setItem("idioma", i);
    } catch {
      /* sin storage */
    }
  }, []);

  const t = React.useCallback<Traducir>(
    (key, vars) => interpolar(DICT[idioma]?.[key] ?? DICT.es[key] ?? key, vars),
    [idioma]
  );

  return <Ctx.Provider value={{ idioma, setIdioma, t }}>{children}</Ctx.Provider>;
}

export function useIdioma(): IdiomaCtx {
  const ctx = React.useContext(Ctx);
  if (!ctx) {
    // Fallback: español, sin reactividad (ej. fuera del provider).
    return {
      idioma: "es",
      setIdioma: () => {},
      t: (key, vars) => interpolar(DICT.es[key] ?? key, vars),
    };
  }
  return ctx;
}

// Componente de texto traducible, usable dentro de Server Components.
export function T({ k, vars }: { k: string; vars?: Record<string, string | number> }) {
  const { t } = useIdioma();
  return <>{t(k, vars)}</>;
}

export function IdiomaSwitch() {
  const { idioma, setIdioma } = useIdioma();
  return (
    <div className="inline-flex items-center rounded-full border border-border p-0.5 text-[0.68rem] font-medium">
      {(["es", "en"] as Idioma[]).map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => setIdioma(i)}
          className={
            "rounded-full px-2.5 py-1 uppercase transition-colors " +
            (idioma === i
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          {i}
        </button>
      ))}
    </div>
  );
}
