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
  bio: string;
  photo: string;
};

const LIST = [
  {
    id: "jonas-silva",
    name: "Jonas Silva",
    role: "Idealizador e professor",
    area: "Redes, automação e Companion",
    bio: "Especialista em tecnologia, com mais de 12 anos em TI e 15 anos servindo em equipes técnicas de igreja.",
    photo: "/images/jonas.silva.jpeg",
  },
  {
    id: "chico-ferreira",
    name: "Chico Ferreira",
    role: "Professor",
    area: "Áudio",
    bio: "Especialista em áudio, com mais de 30 anos de experiência em igrejas, grandes bandas e shows.",
    photo: "/images/chico-ferreira.jpg",
  },
  {
    id: "cesar-augusto",
    name: "Cesar Augusto",
    role: "Professor",
    area: "Iluminação",
    bio: "Especialista em iluminação, com grandes projetos para igrejas, shows em estádios e Lollapalooza.",
    photo: "/images/cesar-augusto.jpg",
  },
] as const satisfies readonly Instructor[];

/** ids válidos de professor (os mesmos do campo "Professor" no painel) */
export type InstructorId = (typeof LIST)[number]["id"];

export const INSTRUCTORS: readonly Instructor[] = LIST;

/** Card de vaga para o próximo professor (some quando for false). */
export const NEXT_INSTRUCTOR_SOON = true;

export const getInstructor = (id?: string) => INSTRUCTORS.find((i) => i.id === id);
