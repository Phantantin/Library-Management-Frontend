"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResource, useAction } from "@/hooks/query";
import { portalApi } from "./api";
import { PageHeader } from "@/components/ui/page-header";
import { Loading, ErrorState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import {useI18n} from "@/providers/i18n-provider";
const schema=z.object({fullName:z.string().trim().min(1).max(100),phone:z.string().max(30).optional()});type Values=z.infer<typeof schema>;
export function ProfilePage(){const{t}=useI18n();const q=useResource(["profile"],portalApi.profile);const{register,handleSubmit,reset,formState:{errors}}=useForm<Values>({resolver:zodResolver(schema)});useEffect(()=>{if(q.data)reset({fullName:q.data.fullName,phone:q.data.phone??""})},[q.data,reset]);const save=useAction(portalApi.updateProfile,t("Profile updated"));return <><PageHeader eyebrow="Your account" title="Profile" description="Keep your contact details current. Your email and role are managed by the library."/>{q.isPending?<Loading/>:q.error?<ErrorState error={q.error} retry={()=>void q.refetch()}/>:<form className="panel max-w-2xl space-y-5" onSubmit={handleSubmit(v=>save.mutate(v))}><label>{t("Email")}<input disabled value={q.data?.email??""}/></label><label>{t("Full name")}<input {...register("fullName")} aria-invalid={!!errors.fullName}/>{errors.fullName&&<span className="text-destructive text-sm">{t(String(errors.fullName.message))}</span>}</label><label>{t("Phone")}<input type="tel" {...register("phone")}/></label><label>{t("Role")}<input disabled value={t(q.data?.role==="ROLE_ADMIN"?"Administrator":"Member")}/></label>{save.error&&<p role="alert" className="text-destructive">{t(save.error.message)}</p>}<Button disabled={save.isPending}>{t(save.isPending?"Saving…":"Save profile")}</Button><p className="text-xs text-muted-foreground">{t("Password changes are available through the secure reset password flow.")}</p></form>}</>}
