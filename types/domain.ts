// Source-backed transport types. Optional backend fields retain null.
export type AuthProvider = "LOCAL" | "GOOGLE";
export type BookLoanStatus = "CHECKED_OUT" | "RETURNED" | "OVERDUE" | "LOST" | "DAMAGED";
export type BookLoanType = "CHECKOUT" | "RENEWAL" | "RETURN";
export type FineStatus = "PENDING" | "PARTIALLY_PAID" | "PAID" | "WAIVED";
export type FineType = "OVERDUE" | "DAMAGE" | "LOSS" | "PROCESSING";
export type PaymentGateway = "RAZORPAY" | "STRIPE" | "VNPAY";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED" | "PROCESSING";
export type PaymentType = "FINE" | "MEMBERSHIP" | "LOST_BOOK_PENALTY" | "DAMAGED_BOOK_PENALTY" | "REFUND";
export type ReservationStatus = "PENDING" | "AVAILABLE" | "FULFILLED" | "CANCELLED" | "EXPIRED";
export type UserRole = "ROLE_USER" | "ROLE_ADMIN";
export interface BookDTO {
  id: number;
  isbn: string;
  title: string;
  author: string;
  genreId: number;
  genreName: string | null;
  genreCode: string | null;
  publisher: string | null;
  publicationDate: string | null;
  language: string | null;
  pages: number | null;
  description: string | null;
  totalCopies: number;
  availableCopies: number;
  price: number;
  coverImageUrl: string | null;
  alreadyHaveLoan: boolean | null;
  alreadyHaveReservation: boolean | null;
  active: boolean;
  featured: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}
export interface BookLoanDTO {
  id: number;
  userId: number;
  userName: string;
  userEmail: string | null;
  bookId: number;
  bookTitle: string;
  bookIsbn: string | null;
  bookAuthor: string | null;
  bookCoverImage: string | null;
  bookLoanType: BookLoanType | null;
  bookLoanStatus: BookLoanStatus;
  checkoutDate: string | null;
  dueDate: string | null;
  remainingDays: number | null;
  returnDate: string | null;
  renewalCount: number | null;
  maxRenewals: number | null;
  finePaid: number | null;
  notes: string | null;
  isOverdue: boolean | null;
  overdueDays: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}
export interface BookReviewDTO {
  id: number;
  userId: number;
  userName: string;
  bookId: number;
  bookTitle: string;
  rating: number;
  reviewText: string;
  title: string;
  createdAt: string | null;
  updatedAt: string | null;
}
export interface FineDTO {
  id: number;
  bookLoanId: number;
  bookTitle: string;
  bookIsbn: string | null;
  userId: number;
  userName: string;
  userEmail: string | null;
  type: FineType;
  amount: number;
  amountPaid: number | null;
  amountOutstanding: number | null;
  status: FineStatus;
  reason: string | null;
  notes: string | null;
  waivedByUserId: number | null;
  waivedByUserName: string | null;
  waivedAt: string | null;
  waiverReason: string | null;
  paidAt: string | null;
  processedByUserId: number | null;
  processedByUserName: string | null;
  transactionId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
export interface GenreDTO {
  id: number;
  code: string | null;
  name: string;
  description: string | null;
  displayOrder: number | null;
  active: boolean;
  parentGenreId: number | null;
  parentGenreName: string | null;
  subGenre: GenreDTO[] | null;
  bookCount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}
export interface PaymentDTO {
  id: number;
  userId: number;
  userName: string;
  userEmail: string | null;
  bookLoanId: number;
  subscriptionId: number | null;
  paymentType: PaymentType;
  status: PaymentStatus;
  gateway: PaymentGateway;
  amount: number;
  currency: string | null;
  fineId: number | null;
  transactionId: string | null;
  gatewayPaymentId: string | null;
  gatewayOrderId: string | null;
  gatewaySignature: string | null;
  description: string | null;
  failureReason: string | null;
  retryCount: number | null;
  initiatedAt: string | null;
  completedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
export interface ReservationDTO {
  id: number;
  userId: number;
  userName: string;
  userEmail: string | null;
  bookId: number;
  bookTitle: string;
  bookIsbn: string | null;
  bookAuthor: string | null;
  isBookAvailable: boolean | null;
  status: ReservationStatus;
  reservedAt: string | null;
  availableAt: string | null;
  availableUntil: string | null;
  fulfilledAt: string | null;
  cancelledAt: string | null;
  queuePosition: number | null;
  notificationSent: boolean | null;
  notes: string | null;
  content: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  expired: boolean;
  canBeCancelled: boolean;
  hoursUntilExpiry: number | null;
}
export interface SubscriptionDTO {
  id: number;
  userId: number;
  userName: string;
  userEmail: string | null;
  planId: number;
  planName: string | null;
  planCode: string;
  price: number;
  currency: string | null;
  startDate: string | null;
  endDate: string | null;
  maxBooksAllowed: number;
  maxDaysPerBook: number;
  autoRenew: boolean | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  notes: string | null;
  daysRemaining: number | null;
  isActive: boolean;
  isValid: boolean | null;
  isExpired: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
}
export interface SubscriptionPlanDTO {
  id: number;
  planCode: string;
  name: string;
  description: string | null;
  durationDays: number;
  price: number;
  currency: string | null;
  maxBooksAllowed: number;
  maxDaysPerBook: number;
  displayOrder: number | null;
  isActive: boolean;
  isFeatured: boolean | null;
  badgeText: string | null;
  adminNotes: string | null;
  priceInMajorUnits: number | null;
  monthlyEquivalentPrice: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
}
export interface UserDTO {
  id: number;
  email: string;
  fullName: string;
  userName: string;
  role: UserRole;
  phone: string | null;
  lastLogin: string | null;
}
export interface WishlistDTO {
  id: number;
  userId: number;
  userFullName: string | null;
  book: BookDTO;
  addedAt: string | null;
  notes: string | null;
}
export interface AuthResponse {
  jwt: string | null;
  message: string | null;
  title: string;
  user: UserDTO | null;
}
export interface PaymentInitiateResponse {
  paymentId: number | null;
  gateway: PaymentGateway;
  transactionId: string | null;
  gatewayOrderId: string | null;
  amount: number;
  description: string | null;
  checkoutUrl: string | null;
  message: string | null;
  success: boolean | null;
}
