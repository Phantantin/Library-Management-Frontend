import {Genres} from "@/features/books/genres";
import {PublicIntro} from "@/components/layout/public-intro";
export const metadata={title:"Browse genres"};
export default function Page(){return <><PublicIntro eyebrow="Follow your curiosity" title="Explore the collections" description="Discover books around the subjects you love."/><Genres/></>;}
