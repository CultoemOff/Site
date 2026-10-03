/**
 * Professores da Escola Culto em Off.
 * `id` é usado no campo "Professor" de cada formação (config e admin).
 * Para incluir um novo professor: adicione aqui (com foto em /public/images) e troque o card "em breve".
 */

export type Instructor = {
  id: string;
  name: string;
  /** papel curto, ex.: "Idealizador e professor" */
  role: string;
  /** especialidade exibida ao lado da foto */
  area: string;
  /** texto curto: aparece nos cards das formações */
  bio: string;
  photo: string;
  /** texto completo: aparece no card grande da seção "Quem está por trás" (se vazio, usa `bio`) */
  details?: string;
  /** números em destaque, ex.: { value: "30+", label: "anos de experiência" } */
  stats?: readonly { value: string; label: string }[];
  /** título e itens das etiquetas (marcas, áreas, especialidades) */
  tagsLabel?: string;
  tags?: readonly string[];
};

const LIST = [
  {
    id: "jonas-silva",
    name: "Jonas Silva",
    role: "Idealizador e professor",
    area: "Redes, automação e Companion",
    bio: "Especialista em tecnologia, com mais de 12 anos em TI e 15 anos servindo em equipes técnicas de igreja.",
    photo: "/images/jonas-silva.jpg",
    details:
      "Especialista em tecnologia. Profissionalmente, atua com infraestrutura, cloud, cibersegurança e automação. Na igreja, vive na prática os desafios das equipes técnicas e dos voluntários.",
    stats: [
      { value: "12+", label: "anos de experiência profissional em TI" },
      { value: "15+", label: "anos servindo em igrejas" },
    ],
    tagsLabel: "Áreas de atuação",
    tags: ["Infraestrutura", "Cloud", "Cibersegurança", "Automação"],
  },
  {
    id: "chico-ferreira",
    name: "Chico Ferreira",
    role: "Professor",
    area: "Áudio · Músico",
    bio: "Especialista em áudio e músico, com mais de 30 anos de experiência em igrejas, grandes bandas e shows.",
    photo: "/images/chico-ferreira.jpg",
    details:
      "Especialista em áudio e músico, com mais de 30 anos de experiência em igrejas, grandes bandas e shows. Conhece na prática as mesas das principais marcas do mercado.",
    stats: [{ value: "30+", label: "anos de experiência em áudio" }],
    tagsLabel: "Mesas de som",
    // Yamaha e Behringer informadas pelo Jonas; as outras três foram sugeridas e precisam ser confirmadas com o Chico
    tags: ["Yamaha", "Behringer", "Allen & Heath", "Soundcraft", "Midas"],
  },
  {
    id: "cesar-augusto",
    name: "Cesar Augusto",
    role: "Professor",
    area: "Iluminação",
    bio: "Especialista em iluminação, com grandes projetos para igrejas, shows em estádios e Lollapalooza.",
    photo: "/images/cesar-augusto.jpg",
    details:
      "Especialista em iluminação, com grandes projetos para igrejas, shows em estádios e Lollapalooza. Programa em grandMA2 e grandMA3, com Art-Net e projetos em 3D.",
    tagsLabel: "Especialidades",
    tags: ["grandMA2", "grandMA3", "Art-Net", "3D", "Igrejas", "Shows"],
  },
] as const satisfies readonly Instructor[];

/** ids válidos de professor (os mesmos do campo "Professor" no painel) */
export type InstructorId = (typeof LIST)[number]["id"];

export const INSTRUCTORS: readonly Instructor[] = LIST;

/** Card de vaga para o próximo professor (some quando for false). */
export const NEXT_INSTRUCTOR_SOON = true;

export const getInstructor = (id?: string) => INSTRUCTORS.find((i) => i.id === id);
