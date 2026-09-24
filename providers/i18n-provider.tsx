"use client";

import {createContext,useCallback,useContext,useMemo,useState} from "react";
import {localeCookie,translate,type Locale} from "@/lib/i18n";
import {date as formatDate,money as formatMoney} from "@/lib/utils";

type I18nContextValue={
  locale:Locale;
  setLocale:(locale:Locale)=>void;
  t:(key:string,values?:Record<string,string|number>)=>string;
  date:(value:string|null|undefined)=>string;
  money:(amount:number|null|undefined,currency?:string)=>string;
};

const I18nContext=createContext<I18nContextValue|null>(null);

export function I18nProvider({children,initialLocale}:{children:React.ReactNode;initialLocale:Locale}){
  const[locale,setLocaleState]=useState<Locale>(initialLocale);
  const setLocale=useCallback((next:Locale)=>{
    document.cookie=`${localeCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.lang=next;
    setLocaleState(next);
  },[]);
  const t=useCallback((key:string,values?:Record<string,string|number>)=>translate(locale,key,values),[locale]);
  const date=useCallback((value:string|null|undefined)=>formatDate(value,locale==="vi"?"vi-VN":"en-US"),[locale]);
  const money=useCallback((amount:number|null|undefined,currency="VND")=>formatMoney(amount,currency,locale==="vi"?"vi-VN":"en-US"),[locale]);
  const value=useMemo(()=>({locale,setLocale,t,date,money}),[locale,setLocale,t,date,money]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(){
  const context=useContext(I18nContext);
  if(!context)throw new Error("useI18n must be used within I18nProvider");
  return context;
}

export function T({children,values}:{children:string;values?:Record<string,string|number>}){
  const{t}=useI18n();
  return <>{t(children,values)}</>;
}
