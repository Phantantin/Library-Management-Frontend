import {BookDetail} from "@/features/books/detail";
import {backendUrl} from "@/lib/auth";
import {notFound} from "next/navigation";
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;try{const r=await fetch(backendUrl("/api/books/"+id),{next:{revalidate:60}});if(!r.ok)return {title:"Book details"};const b=await r.json();return {title:String(b.title),description:String(b.description??"Explore this book in the Folio Library catalog.").slice(0,160)};}catch{return {title:"Book details"};}}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!/^\d+$/.test(id))notFound();return <BookDetail id={Number(id)}/>;}
