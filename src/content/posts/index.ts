import { analiseNeoidPtzMini } from "./analise-neoid-ptz-controller-mini";
import { proPresenterParaSPresenter } from "./propresenter-para-spresenter";
import { volumeNaIgreja } from "./volume-na-igreja";
import { GUIDE_POSTS } from "./guias-2026-11";

export { GUIDE_POSTS };

/** Artigos do blog incluídos no projeto (usados pelo seed e como conteúdo padrão sem banco). */
export const SEED_POSTS = [proPresenterParaSPresenter, analiseNeoidPtzMini, volumeNaIgreja, ...GUIDE_POSTS];
