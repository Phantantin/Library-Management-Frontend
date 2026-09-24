import { get, post, put, remove } from "@/lib/api";
import type { PageResponse, SpringPage, QueryParams } from "@/types/api";
import type { BookDTO, BookLoanDTO, BookReviewDTO, FineDTO, GenreDTO, PaymentDTO, ReservationDTO, SubscriptionDTO, SubscriptionPlanDTO, UserDTO } from "@/types/domain";
interface CountPoint { name:string;count:number }
export interface AdminStats {
 totalActiveBooks:number;totalAvailableBooks:number;users:number;loans:number;overdue:number;reservations:number;payments:number;activeSubscriptions:number;
 loanStatuses:CountPoint[];popularBooks:CountPoint[];popularGenres:CountPoint[];
 operationsTrend:{date:string;loans:number;returns:number;newUsers:number}[];
 revenueTrend:{date:string;currency:string;amount:number}[];
 revenueTotals:{currency:string;amount:number}[];
}
export const adminApi={
 stats:()=>get<AdminStats>("/api/admin/statistics"),
 books:(params:QueryParams)=>post<PageResponse<BookDTO>>("/api/admin/books/search",{page:0,pageSize:20,availableOnly:false,sortBy:"createdAt",sortDirection:"DESC",...params}),
 book:(id:number)=>get<BookDTO>("/api/admin/books/"+id),createBook:(v:Partial<BookDTO>)=>post<BookDTO>("/api/admin/books",v),updateBook:(id:number,v:Partial<BookDTO>)=>put<BookDTO>("/api/books/"+id,v),deleteBook:(id:number,hard=false)=>remove("/api/books/"+id+(hard?"/permanent":"")),
 genres:()=>get<GenreDTO[]>("/api/admin/genres"),createGenre:(v:Partial<GenreDTO>)=>post<GenreDTO>("/api/genres/create",v),updateGenre:(id:number,v:Partial<GenreDTO>)=>put<GenreDTO>("/api/genres/"+id,v),deleteGenre:(id:number,hard=false)=>remove("/api/genres/"+id+(hard?"/hard":"")),
 users:(params:QueryParams)=>get<SpringPage<UserDTO>>("/api/admin/users",params),user:(id:number)=>get<UserDTO>("/api/admin/users/"+id),
 loans:(data:QueryParams)=>post<PageResponse<BookLoanDTO>>("/api/book-loans/search",data),checkin:(id:number)=>post<BookLoanDTO>("/api/book-loans/checkin",{bookLoanId:id,condition:"RETURNED"}),checkout:(userId:number,bookId:number,days:number)=>post<BookLoanDTO>(`/api/book-loans/checkout/user/${userId}`,{bookId,checkoutDays:days}),updateOverdue:()=>post("/api/book-loans/admin/update-overdue"),
 reservations:(params:QueryParams)=>get<PageResponse<ReservationDTO>>("/api/reservations",params),fulfill:(id:number)=>post<ReservationDTO>(`/api/reservations/${id}/fulfill`),cancelReservation:(id:number)=>remove<ReservationDTO>("/api/reservations/"+id),
 reviews:(params:QueryParams)=>get<SpringPage<BookReviewDTO>>("/api/admin/reviews",params),deleteReview:(id:number)=>remove("/api/reviews/"+id),
 fines:(params:QueryParams)=>get<PageResponse<FineDTO>>("/api/fines",params),createFine:(bookLoanId:number,type:string,amount:number,reason:string)=>post<FineDTO>("/api/fines",{bookLoanId,type,amount,reason}),waiveFine:(fineId:number,reason:string)=>post<FineDTO>("/api/fines/waive",{fineId,reason}),
 payments:(params:QueryParams)=>get<SpringPage<PaymentDTO>>("/api/payments",params),
 subscriptions:()=>get<SubscriptionDTO[]>("/api/subscriptions/admin"),expireSubscriptions:()=>post("/api/subscriptions/admin/deactivate-expired"),plans:()=>get<SubscriptionPlanDTO[]>("/api/subscription-plans"),createPlan:(v:Partial<SubscriptionPlanDTO>)=>post<SubscriptionPlanDTO>("/api/subscription-plans/admin/create",v),updatePlan:(id:number,v:Partial<SubscriptionPlanDTO>)=>put<SubscriptionPlanDTO>(`/api/subscription-plans/admin/${id}`,v),deletePlan:(id:number)=>remove(`/api/subscription-plans/admin/${id}`),
};
