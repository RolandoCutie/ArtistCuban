'use client'

type NarrativeTheme =
  | 'editorial'
  | 'cinematic'
  | 'modern'
  | 'organic'
  | 'luxury'
  | 'brutal'
  | 'museum'
  | 'glass'
  | 'minimal'
  | 'emerald'

type StoryStage = 'act2' | 'act3'

interface StoryChapter {
  label: string
  title: string
  cue: string
}

interface StoryLead {
  kicker: string
  title: string
  description: string
}

interface StoryThemeConfig {
  tag: string
  gradient: string
  chapters: StoryChapter[]
  leads: Record<StoryStage, StoryLead>
}

const STORY_CONFIG: Record<NarrativeTheme, StoryThemeConfig> = {
  editorial: {
    tag: 'Edicion Curatorial',
    gradient:
      'radial-gradient(circle at 10% 0%, rgba(222,198,166,0.32), transparent 45%), radial-gradient(circle at 95% 10%, rgba(90,122,163,0.25), transparent 42%)',
    chapters: [
      { label: 'Acto 01', title: 'Portada', cue: 'Identidad y atmosfera inicial' },
      { label: 'Acto 02', title: 'Manifiesto', cue: 'Voz y posicionamiento del artista' },
      { label: 'Acto 03', title: 'Contexto', cue: 'Trayectoria, influencias y metodo' },
      { label: 'Acto 04', title: 'Coleccion', cue: 'Obras ancla y ritmo visual' },
      { label: 'Acto 05', title: 'Conexion', cue: 'Contacto y accion de coleccionista' },
    ],
    leads: {
      act2: {
        kicker: 'Acto 02',
        title: 'Manifiesto de autor',
        description: 'Transformamos el perfil en relato editorial: primero conviccion, luego datos, y despues obra para elevar valor percibido.',
      },
      act3: {
        kicker: 'Acto 04',
        title: 'Coleccion destacada',
        description: 'Las piezas aparecen como climax narrativo, no como listado plano. Esto mejora retencion y deseo de exploracion.',
      },
    },
  },
  cinematic: {
    tag: 'Narrativa de Escena',
    gradient:
      'radial-gradient(circle at 12% 10%, rgba(240,108,52,0.3), transparent 46%), radial-gradient(circle at 86% 15%, rgba(35,62,108,0.32), transparent 44%)',
    chapters: [
      { label: 'Acto I', title: 'Apertura', cue: 'Impacto emocional y ritmo de trailer' },
      { label: 'Acto II', title: 'Conflicto', cue: 'Idea central y tension del lenguaje' },
      { label: 'Acto III', title: 'Biografia', cue: 'Origen, metodo y contexto' },
      { label: 'Acto IV', title: 'Secuencia', cue: 'Portafolio como montaje' },
      { label: 'Acto V', title: 'Cierre', cue: 'Llamado a colaboracion o compra' },
    ],
    leads: {
      act2: {
        kicker: 'Acto II',
        title: 'El motivo central',
        description: 'El discurso aparece antes de la ficha tecnica para generar una lectura mas cinematografica y memorable.',
      },
      act3: {
        kicker: 'Acto IV',
        title: 'Montaje de obra',
        description: 'El portfolio se compone como secuencia visual para sostener tension y llevar a una decision de contacto.',
      },
    },
  },
  modern: {
    tag: 'Sistema Modular',
    gradient:
      'radial-gradient(circle at 8% 8%, rgba(90,132,255,0.28), transparent 44%), radial-gradient(circle at 90% 0%, rgba(45,203,168,0.26), transparent 42%)',
    chapters: [
      { label: 'Modulo 01', title: 'Hook', cue: 'Valor del artista en 8 segundos' },
      { label: 'Modulo 02', title: 'Narrativa', cue: 'Contexto de trabajo y propuesta' },
      { label: 'Modulo 03', title: 'Evidence', cue: 'Datos y legitimidad profesional' },
      { label: 'Modulo 04', title: 'Portfolio', cue: 'Prueba visual de nivel' },
      { label: 'Modulo 05', title: 'Action', cue: 'Camino directo a contacto' },
    ],
    leads: {
      act2: {
        kicker: 'Modulo 02',
        title: 'Narrativa de propuesta',
        description: 'La composicion moderniza el flujo: promesa, contexto y validacion antes de presentar la coleccion completa.',
      },
      act3: {
        kicker: 'Modulo 04',
        title: 'Portfolio como evidencia',
        description: 'Cada bloque de obra funciona como prueba de posicionamiento para reducir friccion en decisiones de compra.',
      },
    },
  },
  organic: {
    tag: 'Relato Sensorial',
    gradient:
      'radial-gradient(circle at 5% 5%, rgba(226,134,82,0.3), transparent 48%), radial-gradient(circle at 95% 10%, rgba(109,171,126,0.3), transparent 46%)',
    chapters: [
      { label: 'Pulso 01', title: 'Presencia', cue: 'Humanidad y primera impresion' },
      { label: 'Pulso 02', title: 'Intencion', cue: 'Mensaje personal del artista' },
      { label: 'Pulso 03', title: 'Raices', cue: 'Historia, influencias y oficio' },
      { label: 'Pulso 04', title: 'Materia', cue: 'Obras y lenguaje visual' },
      { label: 'Pulso 05', title: 'Encuentro', cue: 'Dialogo y contacto' },
    ],
    leads: {
      act2: {
        kicker: 'Pulso 02',
        title: 'Intencion y cercania',
        description: 'La estructura pone la voz del artista al centro para crear confianza antes de detallar el curriculum.',
      },
      act3: {
        kicker: 'Pulso 04',
        title: 'Materia en escena',
        description: 'Las obras aparecen como continuidad natural del relato personal, reforzando coherencia e identidad.',
      },
    },
  },
  luxury: {
    tag: 'Coleccion Privada',
    gradient:
      'radial-gradient(circle at 12% 0%, rgba(205,171,116,0.25), transparent 46%), radial-gradient(circle at 86% 8%, rgba(92,76,52,0.28), transparent 44%)',
    chapters: [
      { label: 'Salon I', title: 'Apertura', cue: 'Impresion de exclusividad' },
      { label: 'Salon II', title: 'Declaracion', cue: 'Marco conceptual de coleccionista' },
      { label: 'Salon III', title: 'Dossier', cue: 'Credenciales y trayectoria' },
      { label: 'Salon IV', title: 'Piezas', cue: 'Obra seleccionada en secuencia' },
      { label: 'Salon V', title: 'Acceso', cue: 'Contacto premium' },
    ],
    leads: {
      act2: {
        kicker: 'Salon II',
        title: 'Declaracion de valor',
        description: 'Primero se construye deseo y narrativa de marca, despues se profundiza en datos y legitimidad.',
      },
      act3: {
        kicker: 'Salon IV',
        title: 'Piezas de coleccion',
        description: 'La obra se presenta como una secuencia de adquisicion, pensada para compradores de alto valor.',
      },
    },
  },
  brutal: {
    tag: 'Guion de Impacto',
    gradient:
      'radial-gradient(circle at 8% 5%, rgba(239,142,44,0.3), transparent 46%), radial-gradient(circle at 94% 10%, rgba(58,91,255,0.3), transparent 44%)',
    chapters: [
      { label: 'Golpe 01', title: 'Shock', cue: 'Entrada directa y sin filtros' },
      { label: 'Golpe 02', title: 'Postura', cue: 'Manifiesto frontal del artista' },
      { label: 'Golpe 03', title: 'Ficha', cue: 'Datos contundentes y claros' },
      { label: 'Golpe 04', title: 'Obra', cue: 'Prueba visual de fuerza' },
      { label: 'Golpe 05', title: 'Accion', cue: 'CTA visible y rapido' },
    ],
    leads: {
      act2: {
        kicker: 'Golpe 02',
        title: 'Postura sin suavizar',
        description: 'La composicion prioriza opinion y caracter para captar perfiles disruptivos desde el primer scroll.',
      },
      act3: {
        kicker: 'Golpe 04',
        title: 'Obra como evidencia',
        description: 'Cada pieza refuerza la postura del artista y cierra la narrativa con potencia visual inmediata.',
      },
    },
  },
  museum: {
    tag: 'Ruta Curatorial',
    gradient:
      'radial-gradient(circle at 6% 0%, rgba(183,166,131,0.26), transparent 44%), radial-gradient(circle at 94% 8%, rgba(109,97,78,0.24), transparent 42%)',
    chapters: [
      { label: 'Sala 01', title: 'Ingreso', cue: 'Presentacion institucional' },
      { label: 'Sala 02', title: 'Manifiesto', cue: 'Lectura conceptual' },
      { label: 'Sala 03', title: 'Dossier', cue: 'Contexto historico del autor' },
      { label: 'Sala 04', title: 'Coleccion', cue: 'Obra en recorrido guiado' },
      { label: 'Sala 05', title: 'Archivo', cue: 'Servicios y contacto' },
    ],
    leads: {
      act2: {
        kicker: 'Sala 02',
        title: 'Lectura de sala',
        description: 'Se introduce una transicion museografica para explicar la obra antes de entrar en detalle biografico.',
      },
      act3: {
        kicker: 'Sala 04',
        title: 'Recorrido de coleccion',
        description: 'La obra se vive como visita guiada, elevando contexto y tiempo de permanencia en el perfil.',
      },
    },
  },
  glass: {
    tag: 'Circuito Inmersivo',
    gradient:
      'radial-gradient(circle at 8% 6%, rgba(89,133,255,0.28), transparent 42%), radial-gradient(circle at 92% 8%, rgba(123,202,255,0.25), transparent 44%)',
    chapters: [
      { label: 'Frame 01', title: 'Aura', cue: 'Primera sensacion de marca' },
      { label: 'Frame 02', title: 'Manifiesto', cue: 'Direccion artistica y promesa' },
      { label: 'Frame 03', title: 'Perfil', cue: 'Biografia y datos clave' },
      { label: 'Frame 04', title: 'Coleccion', cue: 'Galeria protagonista' },
      { label: 'Frame 05', title: 'Conexion', cue: 'Contacto y conversion' },
    ],
    leads: {
      act2: {
        kicker: 'Frame 02',
        title: 'Direccion de marca',
        description: 'La narrativa pasa de aura visual a contenido de valor para sostener interes y credibilidad.',
      },
      act3: {
        kicker: 'Frame 04',
        title: 'Coleccion inmersiva',
        description: 'Las obras se muestran como el punto alto del recorrido, con prioridad a impacto y claridad de decision.',
      },
    },
  },
  minimal: {
    tag: 'Secuencia Esencial',
    gradient:
      'radial-gradient(circle at 8% 0%, rgba(98,98,98,0.18), transparent 46%), radial-gradient(circle at 90% 8%, rgba(160,160,160,0.12), transparent 40%)',
    chapters: [
      { label: 'Paso 01', title: 'Identidad', cue: 'Nombre y foco sin ruido' },
      { label: 'Paso 02', title: 'Idea', cue: 'Manifiesto conciso' },
      { label: 'Paso 03', title: 'Contexto', cue: 'Ficha y trayectoria' },
      { label: 'Paso 04', title: 'Obra', cue: 'Portafolio limpio' },
      { label: 'Paso 05', title: 'Contacto', cue: 'Cierre funcional' },
    ],
    leads: {
      act2: {
        kicker: 'Paso 02',
        title: 'Idea sin ruido',
        description: 'La composicion minimal dirige la atencion: mensaje principal primero, informacion de soporte despues.',
      },
      act3: {
        kicker: 'Paso 04',
        title: 'Portafolio esencial',
        description: 'La obra aparece en un bloque de lectura clara para comparar piezas rapidamente y actuar sin friccion.',
      },
    },
  },
  emerald: {
    tag: 'Arco de Coleccion',
    gradient:
      'radial-gradient(circle at 8% 5%, rgba(42,173,105,0.28), transparent 45%), radial-gradient(circle at 92% 8%, rgba(94,230,184,0.2), transparent 44%)',
    chapters: [
      { label: 'Arco 01', title: 'Inmersion', cue: 'Entrada de alto contraste' },
      { label: 'Arco 02', title: 'Manifiesto', cue: 'Deseo y narrativa de autor' },
      { label: 'Arco 03', title: 'Trayectoria', cue: 'Solidez profesional' },
      { label: 'Arco 04', title: 'Jardin', cue: 'Portafolio protagonista' },
      { label: 'Arco 05', title: 'Acceso', cue: 'Canales de contacto' },
    ],
    leads: {
      act2: {
        kicker: 'Arco 02',
        title: 'Narrativa de deseo',
        description: 'La estructura pone primero el mundo conceptual para elevar exclusividad antes de mostrar credenciales.',
      },
      act3: {
        kicker: 'Arco 04',
        title: 'Jardin de obras',
        description: 'El portfolio toma el centro de la escena como culminacion del recorrido para convertir interes en accion.',
      },
    },
  },
}

interface NarrativeRibbonProps {
  theme: NarrativeTheme
  artistName: string
}

export function NarrativeRibbon({ theme, artistName }: NarrativeRibbonProps) {
  const config = STORY_CONFIG[theme]

  return (
    <section className="relative overflow-hidden border-y border-border/50 py-10 lg:py-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-90" style={{ background: config.gradient }} />
      <div className="relative mx-auto max-w-[1700px] px-6 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-foreground/45">{config.tag}</p>
            <h2 className="mt-3 font-heading text-3xl font-light leading-tight text-foreground/85 md:text-4xl">
              Ruta narrativa de {artistName}
            </h2>
          </div>
          <p className="max-w-md text-sm text-foreground/55">
            Esta plantilla ahora cuenta una historia en actos: identidad, voz, contexto, obra y conversion.
          </p>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-5">
          {config.chapters.map((chapter) => (
            <article
              key={chapter.label}
              className="rounded-2xl border border-foreground/15 bg-background/65 px-4 py-4 backdrop-blur-sm"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-foreground/40">{chapter.label}</p>
              <h3 className="mt-2 font-heading text-xl leading-tight text-foreground/85">{chapter.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-foreground/55">{chapter.cue}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

interface NarrativeLeadProps {
  theme: NarrativeTheme
  stage: StoryStage
}

export function NarrativeLead({ theme, stage }: NarrativeLeadProps) {
  const lead = STORY_CONFIG[theme].leads[stage]

  return (
    <section className="border-t border-border/60 py-12 lg:py-16">
      <div className="mx-auto grid max-w-[1700px] gap-5 px-6 lg:grid-cols-[220px_1fr] lg:px-16">
        <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/35">{lead.kicker}</p>
        <div>
          <h3 className="font-heading text-3xl font-light leading-tight text-foreground/85 md:text-4xl">
            {lead.title}
          </h3>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/55 md:text-base">
            {lead.description}
          </p>
        </div>
      </div>
    </section>
  )
}
