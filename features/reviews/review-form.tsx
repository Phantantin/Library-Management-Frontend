"use client";
import {useForm,useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Star} from "lucide-react";
import {useAction} from "@/hooks/query";
import {post,put} from "@/lib/api";
import {Button} from "@/components/ui/button";
import type {BookReviewDTO} from "@/types/domain";
import {reviewSchema,type ReviewValues as Values} from "@/schemas/review";
import {useI18n} from "@/providers/i18n-provider";
export function ReviewForm({bookId,review,onSaved}:{bookId:number;review?:BookReviewDTO;onSaved?:()=>void}){
 const{t}=useI18n();
 const {register,handleSubmit,control,setValue,formState:{errors}}=useForm<Values>({resolver:zodResolver(reviewSchema),defaultValues:{title:review?.title??"",rating:review?.rating??5,reviewText:review?.reviewText??""}});
 const mutation=useAction((v:Values)=>review?put("/api/reviews/"+review.id,v):post("/api/reviews",{...v,bookId}),t("Review saved"));
 const rating=useWatch({control,name:"rating"});
 return <form className="space-y-4" onSubmit={handleSubmit(v=>mutation.mutate(v,{onSuccess:onSaved}))}><div role="group" aria-label={t("Rating")} className="flex gap-2">{[1,2,3,4,5].map(n=><button key={n} type="button" aria-label={t("{rating} stars",{rating:n})} aria-pressed={rating===n} onClick={()=>setValue("rating",n)} className="p-2 text-warning"><Star fill={n<=rating?"currentColor":"none"} size={24}/></button>)}</div><label>{t("Title")}<input {...register("title")}/>{errors.title&&<span className="text-destructive">{t(String(errors.title.message))}</span>}</label><label>{t("Your review")}<textarea {...register("reviewText")} aria-invalid={!!errors.reviewText}/>{errors.reviewText&&<span className="text-destructive">{t(String(errors.reviewText.message))}</span>}</label><p className="text-xs text-muted-foreground">{t("You can review a book after returning it. One review per member and book.")}</p>{mutation.error&&<p role="alert" className="text-destructive">{t(mutation.error.message)}</p>}<Button disabled={mutation.isPending}>{t(mutation.isPending?"Saving...":"Save review")}</Button></form>;
}
