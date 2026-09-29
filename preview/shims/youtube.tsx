import YouTubeView from "../../src/components/sections/youtube/YouTubeView";
// Prévia fora do Next.js: o feed é buscado no servidor, então aqui mostramos o estado sem vídeos.
export default function YouTube() {
  return <YouTubeView videos={[]} />;
}
