import { TimeOfDay, MessageStyle, CardConfig, GeneratedMessage } from './types';

export interface MomentDetails {
  key: TimeOfDay;
  name: string;
  hourRange: string;
  gradientClass: string;
  iconName: 'Sunrise' | 'Sun' | 'Coffee' | 'Compass' | 'Sunset' | 'Moon' | 'Sparkles' | 'Clock';
  description: string;
  fallbackMessages: Record<MessageStyle, string>;
  cardConfig: CardConfig;
}

export const MOMENTS_OF_DAY: MomentDetails[] = [
  {
    key: 'dawn',
    name: 'Amanecer',
    hourRange: '5:00 - 8:00',
    gradientClass: 'from-[#FFF8F2] via-[#FCEADE] to-[#E3E8FC]',
    iconName: 'Sunrise',
    description: 'Tonos crema, dorado suave y destellos frescos de rocío mañanera.',
    cardConfig: {
      bgColor: 'bg-white/70 backdrop-blur-md border border-amber-200/30 shadow-2xl shadow-amber-900/5',
      textColor: 'text-amber-950',
      accentColor: 'bg-amber-400',
      glassStyles: 'backdrop-blur-xl bg-white/40 border border-white/50 shadow-[0_8px_32px_0_rgba(254,243,199,0.3)]',
      overlayOpacity: 0.15,
      atmosphere: 'un amanecer de niebla dorada y taza tibia',
      effectType: 'rays'
    },
    fallbackMessages: {
      sweet: 'Hay mañanas en las que el aire viene más limpio, como si nos invitara a dejar que las cosas sucedan despacio.',
      nostalgic: 'La luz de esta hora me recuerda que los mejores comienzos ocurren siempre en el más absoluto de los silencios.',
      elegant: 'El amanecer tiene una discreción única; no necesita anunciarse para cambiar por completo el tono del día.',
      mysterious: 'Antes de que el ruido lo ocupe todo, queda un breve instante en el que los pensamientos le pertenecen a una sola persona.',
      calming: 'Que encuentres hoy una pequeña pausa que te recuerde lo bien que se siente respirar sin prisa.',
      emotional: 'Hay presencias que no requieren palabras para sentirse tibias, igual que el primer reflejo de sol sobre la mesa.',
      inspiring: 'El día apenas dibuja sus primeras líneas. Ojalá las tuyas lleven hoy la calma de este primer café.',
      indirect: 'Saber que compartimos el mismo cielo al despertar es, a su manera, una hermosa forma de coincidencia.',
      soft_romantic: 'A veces, la mañana no empieza cuando sale el sol, sino cuando un pensamiento silencioso se acomoda en la memoria.',
      deep: 'La luz tenue nos devuelve la lucidez necesaria para valorar lo que permanece cálido en medio de cualquier invierno.'
    }
  },
  {
    key: 'morning',
    name: 'Buenos días',
    hourRange: '8:00 - 11:00',
    gradientClass: 'from-[#FFFDF9] via-[#FAF3EC] to-[#E5EFF8]',
    iconName: 'Sun',
    description: 'Luz limpia de mañana, café fresco humeante y aromas reconfortantes.',
    cardConfig: {
      bgColor: 'bg-white/80 backdrop-blur-md border border-orange-200/25 shadow-2xl shadow-orange-950/5',
      textColor: 'text-stone-800',
      accentColor: 'bg-orange-400',
      glassStyles: 'backdrop-blur-xl bg-white/45 border border-white/60 shadow-[0_8px_32px_0_rgba(253,243,235,0.35)]',
      overlayOpacity: 0.1,
      atmosphere: 'luz filtrada por lino blanco y porcelana templada',
      effectType: 'lens_flare'
    },
    fallbackMessages: {
      sweet: 'Las mejores horas son aquellas que traen la suavidad del lino recién lavado y el sutil olor a café caliente.',
      nostalgic: 'Es curioso cómo un aroma por la mañana puede traernos de vuelta las mentes tranquilas del pasado.',
      elegant: 'Hay una elegancia natural en el inicio del día, antes de que el afán cotidiano reclame nuestra atención.',
      mysterious: 'Incluso en medio de la gente, persiste un hilo invisible que conecta la mente con un rincón mucho más tranquilo.',
      calming: 'No dejes que las horas vayan más rápido que tú hoy. Que tu café permanezca caliente y tu mente serena.',
      emotional: 'Tu calidez tiene una forma silenciosa de quedarse en mi rutina, dándole un brillo distinto a las primeras horas.',
      inspiring: 'Las cosas verdaderamente importantes nunca hacen ruido al llegar; se parecen más al sol que entibia la habitación.',
      indirect: 'Existen personas que, sin saberlo, terminan convirtiéndose en la parte más bonita de las mañanas de alguien más.',
      soft_romantic: 'Un instante de silencio antes de comenzar es suficiente para recordar que hay detalles que cambian el rumbo del día.',
      deep: 'La frescura del día nos recuerda que la atención sincera es el regalo más luminoso que se puede ofrecer.'
    }
  },
  {
    key: 'midmorning',
    name: 'Media mañana',
    hourRange: '11:00 - 13:00',
    gradientClass: 'from-[#FAF9F5] via-[#FFF] to-[#E2ECEF]',
    iconName: 'Coffee',
    description: 'Brillo apacible filtrado, sombras delicadas de plantas y lino.',
    cardConfig: {
      bgColor: 'bg-white/85 backdrop-blur-md border border-slate-200/30 shadow-2xl shadow-slate-900/5',
      textColor: 'text-slate-800',
      accentColor: 'bg-emerald-400',
      glassStyles: 'backdrop-blur-xl bg-white/50 border border-white/70 shadow-[0_8px_32px_0_rgba(226,236,239,0.4)]',
      overlayOpacity: 0.08,
      atmosphere: 'hojas de eucalipto balanceándose bajo un sol que asciende',
      effectType: 'shadows'
    },
    fallbackMessages: {
      sweet: 'Espero que en tu jornada aparezca un destello breve que te robe una sonrisa sin razón aparente.',
      nostalgic: 'A veces, la media mañana tiene un perfume de quietud que nos hace buscar con la mirada un rincón familiar.',
      elegant: 'La brisa fina que entra por la ventana lleva consigo la ligereza que a veces hace falta en los días.',
      mysterious: 'La complicidad sutil ocurre cuando dos personas coinciden en el pensamiento justo en el momento más inesperado.',
      calming: 'Si te sientes con prisas, detente un segundo. Mira hacia afuera. El mundo sigue girando a su ritmo, déjate llevar.',
      emotional: 'Hay coincidencias que no se planean, pero que al recordarlas nos devuelven un refugio de calma.',
      inspiring: 'La claridad del mediodía te acompañe hoy, haciéndote ver lo valioso de todo lo que siembras con discreción.',
      indirect: 'Algunas presencias no ocupan espacio físico, pero su recuerdo tiene un peso inmenso y tierno sobre las horas.',
      soft_romantic: 'Pensar en la calma que transmites es el mejor remedio para los minutos congestionados del día.',
      deep: 'Lo efímero de las horas nos enseña a valorar la belleza de los detalles que no se pueden poseer, solo sentir.'
    }
  },
  {
    key: 'midday',
    name: 'Mediodía',
    hourRange: '13:00 - 15:00',
    gradientClass: 'from-[#FFFFFF] via-[#F3F5F0] to-[#E7EFF3]',
    iconName: 'Compass',
    description: 'Sol cenital y despejado, brisa tibia pura y espacios abiertos.',
    cardConfig: {
      bgColor: 'bg-white/90 backdrop-blur-md border border-neutral-200/30 shadow-2xl shadow-neutral-950/5',
      textColor: 'text-neutral-800',
      accentColor: 'bg-sky-400',
      glassStyles: 'backdrop-blur-xl bg-white/55 border border-white/80 shadow-[0_8px_32px_0_rgba(231,239,243,0.4)]',
      overlayOpacity: 0.05,
      atmosphere: 'horizonte diáfano y el crujido de maderas bajo la luz solar',
      effectType: 'none'
    },
    fallbackMessages: {
      sweet: 'Que la calidez de esta hora te abrace con la misma suavidad con la que el sol acaricia las terrazas.',
      nostalgic: 'El cielo abierto a esta hora me hace pensar en los días en que el tiempo lucía sencillamente infinito.',
      elegant: 'La belleza impecable reside en la sencillez. Nada más elegante que la claridad que disipa cualquier sombra.',
      mysterious: 'Hay una sutil diferencia entre estar ausente y habitar discretamente en los pensamientos de otra persona.',
      calming: 'Que en este mediodía encuentres un espacio de silencio que te regrese la ligereza que mereces.',
      emotional: 'Nuestras charlas silenciosas en la distancia son, sin duda, mi refugio favorito en las horas densas.',
      inspiring: 'Mantén esa mirada atenta a lo bello. Las cosas grandes se construyen con la calidez de detalles sencillos.',
      indirect: 'Es reconfortante saber que, en algún punto, tu día marcha en paralelo con el mío, compartiendo la misma luz.',
      soft_romantic: 'Hay miradas que, aunque no se crucen en este instante, han dejado una huella indeleble que se activa con la luz.',
      deep: 'El punto más alto del sol nos demuestra que para iluminar otros caminos, primero debemos cobijar nuestro propio centro.'
    }
  },
  {
    key: 'afternoon',
    name: 'Media tarde',
    hourRange: '15:00 - 18:00',
    gradientClass: 'from-[#FDF2E6] via-[#FCE4CD] to-[#EAD2D7]',
    iconName: 'Clock',
    description: 'Luz dorada oblicua, partículas doradas flotantes y lánguida calma.',
    cardConfig: {
      bgColor: 'bg-[#FFF9F2]/80 backdrop-blur-md border border-orange-200/30 shadow-2xl shadow-amber-950/5',
      textColor: 'text-stone-850',
      accentColor: 'bg-[#D97706]',
      glassStyles: 'backdrop-blur-xl bg-white/40 border border-[#FBE3CC]/60 shadow-[0_8px_32px_0_rgba(252,228,205,0.4)]',
      overlayOpacity: 0.18,
      atmosphere: 'destellos ambarinos cruzando diagonalmente el salón',
      effectType: 'dust'
    },
    fallbackMessages: {
      sweet: 'La tarde declina despacio, igual que esos pensamientos amables que insisten en volver sin motivo aparente.',
      nostalgic: 'Los tonos cobres de la tarde tienen la peculiar virtud de evocar una nostalgia sumamente pacífica.',
      elegant: 'Hay momentos que merecen ser enmarcados: como la luz que se rinde lentamente sobre el borde de un libro.',
      mysterious: 'Justo a esta hora, la mente suele buscar un destino secreto. Curiosamente, siempre suele ser el mismo.',
      calming: 'Un té tibio y la tranquilidad de haber hecho las cosas con el corazón. Deja ir lo que ya no sume hoy.',
      emotional: 'Tu risa, incluso la que imagino a lo lejos, es lo que mejor sabe disolver la melancolía de estas horas.',
      inspiring: 'Cada rayo de sol que retrocede nos invita a agradecer la fragilidad de lo hermoso y lo efímero.',
      indirect: 'Qué buena costumbre esa de recordar tu serenidad cuando la tarde parece volverse demasiado larga.',
      soft_romantic: 'Existen personas que tienen el don de convertir la media tarde más ordinaria en algo digno de escribirse.',
      deep: 'Al final de la tarde, comprendemos que lo verdaderamente valioso es aquello que conserva su calidez aun cuando el sol se oculta.'
    }
  },
  {
    key: 'sunset',
    name: 'Atardecer',
    hourRange: '18:00 - 20:00',
    gradientClass: 'from-[#FCE2D6] via-[#EBC1C5] to-[#CAC2DC]',
    iconName: 'Sunset',
    description: 'Bello degradado lila, rosa quemado y nostalgia transitoria.',
    cardConfig: {
      bgColor: 'bg-[#FCF5F3]/75 backdrop-blur-md border border-purple-200/30 shadow-2xl shadow-purple-950/5',
      textColor: 'text-slate-900',
      accentColor: 'bg-purple-500',
      glassStyles: 'backdrop-blur-xl bg-white/35 border border-[#EBC1C5]/50 shadow-[0_8px_32px_0_rgba(235,193,197,0.45)]',
      overlayOpacity: 0.22,
      atmosphere: 'degradado místico pintando las nubes efímeras',
      effectType: 'sunset_glow'
    },
    fallbackMessages: {
      sweet: 'El cielo de hoy parece pintado para alguien que aprecia los detalles silenciosos y los colores amables.',
      nostalgic: 'Hay atardeceres que duelen un poco, no por tristes, sino porque traen consigo una belleza que dura demasiado poco.',
      elegant: 'La luz cae con una gracia impecable, despidiéndose como quien sabe que ha hecho del mundo un lugar más hermoso.',
      mysterious: 'En ese instante exacto donde el sol se esconde, es imposible no preguntarse si estamos mirando hacia la misma dirección.',
      calming: 'La llanura lila del firmamento te traiga un respiro hondo. Todo llega y todo pasa, descansa en ello.',
      emotional: 'Mirando los colores de hoy, me acordé de tu calidez. Hay personas que se sienten justo como un abrigo al atardecer.',
      inspiring: 'La belleza efímera del cielo nos demuestra que para brillar intensamente no hace falta durar para siempre.',
      indirect: 'Es increíble cómo un simple recuerdo sutil puede templar el aire frío del final de la tarde.',
      soft_romantic: 'Ojalá la calma de este cielo te devuelva el abrazo que la distancia hoy mantiene en suspenso.',
      deep: 'El ocaso es la maravillosa prueba de que las despedidas también pueden ser hermosas si se sabe partir con delicadeza.'
    }
  },
  {
    key: 'night',
    name: 'Noche',
    hourRange: '20:00 - 0:00',
    gradientClass: 'from-[#0B1528] via-[#111827] to-[#141235]',
    iconName: 'Moon',
    description: 'Azul noche místico, ventanas empañadas con lluvia y luces cálidas.',
    cardConfig: {
      bgColor: 'bg-[#1E293B]/60 backdrop-blur-lg border border-slate-705/10 shadow-2xl shadow-black/40',
      textColor: 'text-slate-200',
      accentColor: 'bg-indigo-400',
      glassStyles: 'backdrop-blur-2xl bg-slate-950/40 border border-slate-800/60 shadow-[0_8px_32px_0_rgba(15,23,42,0.6)]',
      overlayOpacity: 0.4,
      atmosphere: 'gotas de lluvia descendiendo por el panel del cristal',
      effectType: 'stars'
    },
    fallbackMessages: {
      sweet: 'La quietud de la noche tiene esa forma limpia de envolver las cosas para que descansen del ruido del día.',
      nostalgic: 'Cuando el día se apaga del todo, quedan los ecos más bonitos de las conversaciones compartidas a media voz.',
      elegant: 'La noche es un lienzo sobrio en el que solo los sentimientos más sinceros conservan su luz propia.',
      mysterious: 'Hay pensamientos que no se atreven a salir a la luz, pero que brillan con una fuerza asombrosa en la penumbra.',
      calming: 'Abandona los pendientes en el perchero. Te mereces una almohada libre de dudas y una mente en paz.',
      emotional: 'A veces, a esta hora, me doy cuenta de que hay memorias que nos sostienen con una fuerza sutil e inquebrantable.',
      inspiring: 'Incluso en la noche más cerrada, siempre hay una luz tenue encendida para guiar a los espíritus libres.',
      indirect: 'Es reconfortante saber que algunas personas habitan de forma tan dulce e involuntaria en nuestra mente.',
      soft_romantic: 'Tu presencia es ese faro de calma que disuelve los nudos del día y hace ligera cualquier distancia.',
      deep: 'La quietud nocturna desnuda nuestras verdades, mostrándonos que la cercanía es un asunto puramente mental.'
    }
  },
  {
    key: 'sleeping',
    name: 'Hora de dormir',
    hourRange: '0:00 - 5:00',
    gradientClass: 'from-[#040810] via-[#080B14] to-[#0A0D1A]',
    iconName: 'Sparkles',
    description: 'Silencio sagrado del sueño, luna difuminada y quietud mística.',
    cardConfig: {
      bgColor: 'bg-[#0F172A]/50 backdrop-blur-xl border border-blue-900/20 shadow-2xl shadow-black/60',
      textColor: 'text-slate-300',
      accentColor: 'bg-sky-500',
      glassStyles: 'backdrop-blur-3xl bg-slate-950/60 border border-slate-900/70 shadow-[0_8px_32px_0_rgba(2,6,23,0.8)]',
      overlayOpacity: 0.5,
      atmosphere: 'luz de luna proyectada sobre la densa calma del descanso',
      effectType: 'moonlight'
    },
    fallbackMessages: {
      sweet: 'Que tus sueños te lleven a ese lugar donde el viento es tibio y no existe la prisa. Duerme en paz.',
      nostalgic: 'La quietud más honda de la medianoche guarda siempre las palabras más sinceras que no llegamos a decir.',
      elegant: 'El silencio absoluto de esta hora es un santuario. Un espacio sagrado donde la memoria descansa.',
      mysterious: 'En el reino de los sueños convergen todas las distancias, como si las almas supieran dónde encontrarse.',
      calming: 'Suelta por fin el peso del día. Cierra los ojos con la certeza de que has hecho suficiente.',
      emotional: 'Hay hilos sutiles que la distancia no puede cortar, especialmente cuando la noche es así de serena.',
      inspiring: 'Cada descanso profundo es una promesa tácita de renovar el asombro cuando vuelva el amanecer.',
      indirect: 'Es muy pacífico cerrar el día sabiendo que hay una mente tan hermosa habitando este mismo plano.',
      soft_romantic: 'Te dejas abrazar por la serenidad. Que sientas mi atención abrigando tu descanso desde lejos.',
      deep: 'Al final, durmientes y vigías compartimos un mismo misterio: el anhelo de despertar sintiéndonos cobijados.'
    }
  }
];

export const MESSAGE_STYLES: { key: MessageStyle; name: string; description: string }[] = [
  { key: 'soft_romantic', name: 'Romántico suave', description: 'Atención sutil, susurro delicado y complicidad poética.' },
  { key: 'elegant', name: 'Elegante', description: 'Vocabulario impecable, asombro silencioso y delicadeza estética.' },
  { key: 'mysterious', name: 'Misterioso', description: 'Palabras sugerentes, verdades veladas y secretos compartidos.' },
  { key: 'deep', name: 'Profundo', description: 'Trascendencia filosófica, conexión de alma y reflexiones íntimas.' },
  { key: 'sweet', name: 'Dulce', description: 'Calidez tierna, consuelo afable y gestos reconfortantes.' },
  { key: 'nostalgic', name: 'Nostálgico', description: 'La dulce melancolía de recordar instantes bellos del ayer.' },
  { key: 'calming', name: 'Calmante', description: 'Paz absoluta para el cansancio mental, un bálsamo de respiración.' },
  { key: 'emotional', name: 'Emocional', description: 'Sentimiento sincero y palpitante expresado con prudencia extrema.' },
  { key: 'inspiring', name: 'Inspirador', description: 'Iluminación sutil y aliento discreto para la jornada.' },
  { key: 'indirect', name: 'Conexión indirecta', description: 'Sincronía del destino, mentes sintonizadas a la distancia.' }
];

export function getMomentDetails(key: TimeOfDay): MomentDetails {
  return MOMENTS_OF_DAY.find(m => m.key === key) || MOMENTS_OF_DAY[0];
}

export function detectTimeOfDay(hour?: number): TimeOfDay {
  const currentHour = hour !== undefined ? hour : new Date().getHours();
  if (currentHour >= 5 && currentHour < 8) return 'dawn';
  if (currentHour >= 8 && currentHour < 11) return 'morning';
  if (currentHour >= 11 && currentHour < 13) return 'midmorning';
  if (currentHour >= 13 && currentHour < 15) return 'midday';
  if (currentHour >= 15 && currentHour < 18) return 'afternoon';
  if (currentHour >= 18 && currentHour < 20) return 'sunset';
  if (currentHour >= 20 || currentHour < 0) return 'night';
  return 'sleeping'; // from 0 to 5 AM
}
