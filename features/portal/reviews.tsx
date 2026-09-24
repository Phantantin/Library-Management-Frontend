"use client";
import { useState } from "react";
import Link from "next/link";
import { useResource } from "@/hooks/query";
import { portalApi } from "./api";
import { PageHeader } from "@/components/ui/page-header";
import { Loading, ErrorState, Empty, Pagination } from "@/components/ui/states";
import { ActionDialog } from "@/components/ui/action-dialog";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "@/features/reviews/review-form";

import type { BookReviewDTO } from "@/types/domain";
import {useI18n} from "@/providers/i18n-provider";

export function ReviewsPage() {
  const{t,date}=useI18n();
  const [page, setPage] = useState(0), [edit, setEdit] = useState<BookReviewDTO | null>(null);
  const q = useResource(["my-reviews", page], () => portalApi.reviews({ page, size: 10 }));
  return <><PageHeader eyebrow="Your perspective" title="My reviews" description="Revisit the notes and ratings you shared after returning a book." />
    {q.isPending ? <Loading /> : q.error ? <ErrorState error={q.error} retry={() => void q.refetch()} /> : q.data?.content.length ? <><div className="space-y-4">{q.data.content.map(review => <article className="panel" key={review.id}><div className="flex flex-wrap justify-between gap-3"><div><Link href={`/books/${review.bookId}`} className="text-lg font-semibold hover:text-primary">{review.bookTitle}</Link><p className="text-warning mt-1" aria-label={t("{rating} stars",{rating:review.rating})}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => setEdit(review)}>{t("Edit")}</Button><ActionDialog danger label="Delete" description="This review will be removed permanently." action={() => portalApi.deleteReview(review.id)} /></div></div><h2 className="font-medium mt-5">{review.title}</h2><p className="text-muted-foreground whitespace-pre-wrap mt-2">{review.reviewText}</p><time className="block text-xs text-muted-foreground mt-4">{date(review.createdAt)}</time></article>)}</div><Pagination page={page} total={q.data.totalPages} onChange={setPage} /></> : <Empty title="No reviews yet" text="After returning a book, share what stayed with you." />}
    <Modal open={!!edit} onOpenChange={open => !open && setEdit(null)} title="Edit review" description="Update your rating or thoughts.">{edit && <ReviewForm bookId={edit.bookId} review={edit} onSaved={() => setEdit(null)} />}</Modal></>;
}
