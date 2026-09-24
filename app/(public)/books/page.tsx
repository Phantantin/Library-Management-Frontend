import {Catalog} from "@/features/books/catalog";
import {PublicIntro} from "@/components/layout/public-intro";
export const metadata={title:"Explore books",description:"Browse our library catalog, search by author or title, and find available books."};
export default async function Page({searchParams}:{searchParams:Promise<{genre?:string;search?:string}>}){const query=await searchParams;return <><PublicIntro eyebrow="The collection" title="Find your next read" description="A whole world of stories, ideas and new perspectives."/><Catalog initialGenre={Number(query.genre)||undefined} initialSearch={query.search}/></>;}
