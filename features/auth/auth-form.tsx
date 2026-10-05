"use client";
import Link from "next/link";
import {useSearchParams,useRouter} from "next/navigation";
import {useState} from "react";
import {useForm,type Resolver} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema,registerSchema,forgotSchema,resetSchema} from "@/schemas/auth";
import {post} from "@/lib/api";
import {Button} from "@/components/ui/button";
import {Brand} from "@/components/layout/navigation";
import type {UserDTO} from "@/types/domain";
import {useI18n} from "@/providers/i18n-provider";
type Mode="login"|"register"|"forgot-password"|"reset-password";
const titles:Record<Mode,string>={login:"Welcome back",register:"Start your next chapter","forgot-password":"Forgot your password?","reset-password":"Choose a new password"};
export function AuthForm({mode}:{mode:Mode}){
 const router=useRouter(),search=useSearchParams();const [error,setError]=useState(""),[success,setSuccess]=useState("");const{t}=useI18n();
 const schema=mode==="login"?loginSchema:mode==="register"?registerSchema:mode==="forgot-password"?forgotSchema:resetSchema;
 const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<Record<string,string>>({resolver:zodResolver(schema) as unknown as Resolver<Record<string,string>>,defaultValues:{token:search.get("token")??""}});
 const fields=mode==="register"?["fullName","email","phone","password"]:mode==="login"?["email","password"]:mode==="forgot-password"?["email"]:["password"];
 async function submit(data:Record<string,string>){setError("");try{const result=await post<{user?:UserDTO}>("/auth/"+(mode==="register"?"signup":mode),data);
 if(result.user){const returnTo=search.get("returnTo");const safeReturnTo=returnTo?.startsWith("/")&&!returnTo.startsWith("//")&&!returnTo.includes("\\")?returnTo:null;router.replace(safeReturnTo??(result.user.role==="ROLE_ADMIN"?"/admin":"/dashboard"));router.refresh();}
 else setSuccess(t(mode==="forgot-password"?"If an account exists, a reset link has been sent to your email. The link expires in five minutes.":"Your password has been reset. You can now sign in."));
 }catch(e){setError(t(e instanceof Error?e.message:"Unable to continue"));}}
 return <div className="w-full max-w-md"><Brand/><div className="panel mt-8 p-7 sm:p-9"><p className="eyebrow mb-3">{t("Folio membership")}</p><h1 className="heading text-3xl">{t(titles[mode])}</h1><p className="text-muted-foreground mt-3 mb-7">{t("Your books, your reading journey, all in one place.")}</p>{success?<div role="status"><p>{success}</p><Link className="text-primary underline block mt-4" href="/login">{t("Back to sign in")}</Link></div>:<form onSubmit={handleSubmit(submit)} className="space-y-5">{fields.map(name=>{const fieldLabel=name==="fullName"?"Full name":name[0].toUpperCase()+name.slice(1);return <div key={name}><label htmlFor={name}>{t(fieldLabel)}</label><input id={name} type={name==="password"?"password":name==="email"?"email":"text"} autoComplete={name==="password"?(mode==="login"?"current-password":"new-password"):name==="fullName"?"name":name==="phone"?"tel":"email"} {...register(name)} aria-invalid={!!errors[name]} aria-describedby={errors[name]?name+"-error":undefined}/>{errors[name]&&<p id={name+"-error"} className="text-destructive text-sm mt-1">{t(String(errors[name]?.message))}</p>}</div>})}{mode==="reset-password"&&<input type="hidden" {...register("token")}/>} {errors.token&&<p role="alert" className="text-destructive">{t(String(errors.token.message))}</p>}{error&&<p role="alert" className="text-destructive text-sm">{error}</p>}<Button className="w-full" disabled={isSubmitting}>{t(isSubmitting?"Please wait...":mode==="login"?"Sign in":mode==="register"?"Create account":"Continue")}</Button></form>}<div className="border-t mt-6 pt-5 flex justify-between gap-3 text-sm"><Link href={mode==="login"?"/register":"/login"} className="text-primary">{t(mode==="login"?"Create an account":"Sign in")}</Link><Link href="/forgot-password" className="text-muted-foreground">{t("Reset password")}</Link></div></div><Link className="block mt-5 text-sm text-muted-foreground" href="/books">{t("Back to the catalog")}</Link></div>;
}
