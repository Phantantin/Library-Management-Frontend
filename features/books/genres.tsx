"use client";
import Link from "next/link";
import {ArrowUpRight,BookOpen} from "lucide-react";
import {booksApi} from "./api";
import {useResource} from "@/hooks/query";
import {Loading,ErrorState,Empty} from "@/components/ui/states";
import {useI18n} from "@/providers/i18n-provider";
export function Genres(){const{t}=useI18n();const query=useResource(["genres"],booksApi.genres);if(query.isPending)return <Loading/>;if(query.error)return <ErrorState error={query.error} retry={()=>void query.refetch()}/>;return query.data?.length?<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{query.data.filter(g=>g.active).map(g=><Link key={g.id} href={"/books?genre="+g.id} className="panel hover:border-primary"><div className="flex justify-between text-primary"><BookOpen/><ArrowUpRight size={20}/></div><h2 className="text-xl font-semibold mt-6">{g.name}</h2><p className="text-sm text-muted-foreground mt-2">{g.description||t("Explore titles in this collection.")}</p></Link>)}</div>:<Empty title="Collections are being prepared"/>;}
