"use client";
import {useI18n} from "@/providers/i18n-provider";

export function PublicIntro({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){
  const{t}=useI18n();
  return <><p className="eyebrow mb-3">{t(eyebrow)}</p><h1 className="heading mb-3">{t(title)}</h1><p className="text-muted-foreground mb-8">{t(description)}</p></>;
}
