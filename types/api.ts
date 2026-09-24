export interface PageResponse<T> {content:T[];pageNumber:number;pageSize:number;totalElements:number;totalPages:number;first:boolean;last:boolean;empty:boolean}
export interface SpringPage<T> {content:T[];number:number;size:number;totalElements:number;totalPages:number;first:boolean;last:boolean;empty:boolean}
export interface ApiResponse<T=never> {message:string;status:boolean;data?:T}
export interface PaginationParams {page?:number;size?:number}
export interface SortParams {sortBy?:string;sortDirection?:"ASC"|"DESC"}
export class ApiError extends Error {constructor(message:string,public status:number=0){super(message);this.name="ApiError";}}
export type QueryParams=Record<string,string|number|boolean|undefined>;
