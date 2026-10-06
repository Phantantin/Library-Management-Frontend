import { get, post, put, remove } from "@/lib/api";
import type { PageResponse, SpringPage, QueryParams } from "@/types/api";
import type { BookLoanDTO, ReservationDTO, WishlistDTO, BookReviewDTO, FineDTO, PaymentDTO, SubscriptionDTO, SubscriptionPlanDTO, UserDTO } from "@/types/domain";

export const portalApi = {
  loans: (params?: QueryParams) => get<PageResponse<BookLoanDTO>>("/api/book-loans/my", params),
  renew: (bookLoanId: number, extensionDays: number) => post<BookLoanDTO>("/api/book-loans/renew", { bookLoanId, extensionDays }),
  checkin: (bookLoanId: number) => post<BookLoanDTO>("/api/book-loans/checkin", { bookLoanId, condition: "RETURNED" }),
  reservations: (params?: QueryParams) => get<PageResponse<ReservationDTO>>("/api/reservations/my", params),
  cancelReservation: (id: number) => remove<ReservationDTO>("/api/reservations/" + id),
  wishlist: (params?: QueryParams) => get<PageResponse<WishlistDTO>>("/api/wishlist/my-wishlist", params),
  removeWishlist: (bookId: number) => remove("/api/wishlist/remove/" + bookId),
  reviews: (params?: QueryParams) => get<SpringPage<BookReviewDTO>>("/api/reviews/my", params),
  deleteReview: (id: number) => remove("/api/reviews/" + id),
  fines: (params?: QueryParams) => get<FineDTO[]>("/api/fines/my", params),
  payFine: (id: number, paymentMethod: "ALL" | "QR") => post<{ paymentId: number; checkoutUrl: string }>(`/api/fines/${id}/pay`, undefined, { paymentMethod }),
  payments: (params?: QueryParams) => get<SpringPage<PaymentDTO>>("/api/payments/my", params),
  subscriptions: (params?: QueryParams) => get<SpringPage<SubscriptionDTO>>("/api/subscriptions/my", params),
  activeSubscription: () => get<SubscriptionDTO>("/api/subscriptions/user/active"),
  plans: () => get<SubscriptionPlanDTO[]>("/api/subscription-plans"),
  subscribe: (planId: number, paymentMethod: "ALL" | "QR") => post<{ paymentId: number; checkoutUrl: string }>("/api/subscriptions/subscribe", { planId, paymentMethod }),
  cancelSubscription: (id: number, reason: string) => post<SubscriptionDTO>(`/api/subscriptions/cancel/${id}`, undefined, { reason }),
  profile: () => get<UserDTO>("/api/users/profile"),
  updateProfile: (data: { fullName: string; phone?: string }) => put<UserDTO>("/api/users/profile", data),
};
