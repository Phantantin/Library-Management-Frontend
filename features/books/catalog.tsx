"use client";
import {useState} from "react";
import {useResource} from "@/hooks/query";
import {booksApi,type BookFilters} from "./api";
import {BookCard} from "@/components/books/book-card";
import {Loading,ErrorState,Empty,Pagination} from "@/components/ui/states";
import {Button} from "@/components/ui/button";
import {useI18n} from "@/providers/i18n-provider";
export function Catalog({compact=false,initialGenre,initialSearch}:{compact?:boolean;initialGenre?:number;initialSearch?:string}){
 const{t}=useI18n();
 const [filters,setFilters]=useState<BookFilters>({page:0,genreId:initialGenre,searchTerm:initialSearch}),[search,setSearch]=useState(initialSearch??"");
 const books=useResource(["books",filters,compact],()=>booksApi.list({...filters,pageSize:compact?6:12}));
 const genres=useResource(["genres"],booksApi.genres);
 const change=(next:BookFilters)=>setFilters({...filters,...next,page:0});
 return <section aria-label={t("Book catalog")}>{!compact&&<form className="panel mb-7 grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto]" onSubmit={e=>{e.preventDefault();change({searchTerm:search});}}><div><label htmlFor="search">{t("Search the shelves")}</label><input id="search" placeholder={t("Title, author or ISBN")} value={search} onChange={e=>setSearch(e.target.value)}/></div><div><label htmlFor="genre">{t("Genre")}</label><select id="genre" value={filters.genreId??""} onChange={e=>change({genreId:Number(e.target.value)||undefined})}><option value="">{t("All genres")}</option>{genres.data?.filter(g=>g.active).map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></div><div><label htmlFor="sort">{t("Sort by")}</label><select id="sort" onChange={e=>change({sortBy:e.target.value,sortDirection:e.target.value==="title"?"ASC":"DESC"})}><option value="createdAt">{t("Recently added")}</option><option value="title">{t("Title A-Z")}</option><option value="publicationDate">{t("Publication date")}</option></select></div><Button className="self-end">{t("Search")}</Button><label className="flex gap-2 items-center md:col-span-4"><input type="checkbox" checked={filters.availableOnly??false} onChange={e=>change({availableOnly:e.target.checked})}/>{t("Available books only")}</label></form>}
 {books.isPending?<Loading/>:books.error?<ErrorState error={books.error} retry={()=>void books.refetch()}/>:books.data?.content.length?<><div className={"grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 "+(compact?"xl:grid-cols-6":"xl:grid-cols-4")}>{books.data.content.map(book=><BookCard key={book.id} book={book}/>)}</div>{!compact&&<Pagination page={filters.page??0} total={books.data.totalPages} onChange={page=>setFilters({...filters,page})}/>}</>:<Empty title="No books found" text="Try another search or explore a different genre."/>}</section>;
}
