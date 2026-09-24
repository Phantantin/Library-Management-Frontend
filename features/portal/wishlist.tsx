"use client";
import { useState } from "react";
import Link from "next/link";
import { useResource } from "@/hooks/query";
import { portalApi } from "./api";
import { PageHeader } from "@/components/ui/page-header";
import { Loading, ErrorState, Empty, Pagination } from "@/components/ui/states";
import { BookCard } from "@/components/books/book-card";
import { ActionDialog } from "@/components/ui/action-dialog";
import {useI18n} from "@/providers/i18n-provider";
export function WishlistPage(){const{t}=useI18n();const[page,setPage]=useState(0);const q=useResource(["wishlist",page],()=>portalApi.wishlist({page,size:12}));return <><PageHeader eyebrow="Saved for later" title="Wishlist" description="Keep a short list of books you want to return to."/>{q.isPending?<Loading/>:q.error?<ErrorState error={q.error} retry={()=>void q.refetch()}/>:q.data?.content.length?<><div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">{q.data.content.map(item=><div key={item.id}><BookCard book={item.book}/><div className="mt-2"><ActionDialog danger label="Remove" description={t("Remove {title} from your wishlist?",{title:item.book.title})} action={()=>portalApi.removeWishlist(item.book.id)}/></div></div>)}</div><Pagination page={page} total={q.data.totalPages} onChange={setPage}/></>:<Empty title="Your wishlist is empty" text="Save books while browsing to build your reading list."><Link href="/books" className="text-primary">{t("Explore the catalog")} →</Link></Empty>}</>}
