import {get,post} from "@/lib/api";
import type {BookDTO,GenreDTO,BookReviewDTO} from "@/types/domain";
import type {PageResponse} from "@/types/api";
export interface BookFilters {searchTerm?:string;genreId?:number;availableOnly?:boolean;page?:number;pageSize?:number;sortBy?:string;sortDirection?:string}
export const booksApi={
 list:(filters:BookFilters)=>post<PageResponse<BookDTO>>("/api/books/search",{page:0,pageSize:12,availableOnly:false,sortBy:"createdAt",sortDirection:"DESC",...filters}),
 detail:(id:number)=>get<BookDTO>("/api/books/"+id),
 genres:()=>get<GenreDTO[]>("/api/genres"),
 reviews:(id:number,page=0)=>get<PageResponse<BookReviewDTO>>("/api/reviews/book/"+id,{page,size:10}),
 featured:()=>get<BookDTO[]>("/api/books/featured",{limit:6}),
 popular:()=>get<BookDTO[]>("/api/books/popular",{limit:6}),
 popularGenres:()=>get<GenreDTO[]>("/api/genres/popular",{limit:6})
};
