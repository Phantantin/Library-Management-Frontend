"use client";
import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {useI18n} from "@/providers/i18n-provider";
export function useResource<T>(key:readonly unknown[],fetcher:()=>Promise<T>){return useQuery({queryKey:key,queryFn:fetcher});}
export function useAction<T,V=void>(fn:(value:V)=>Promise<T>,success="Changes saved") {const client=useQueryClient();const{t}=useI18n();return useMutation({mutationFn:fn,onSuccess:()=>{void client.invalidateQueries();if(success)toast.success(t(success));},onError:(e:Error)=>toast.error(t(e.message))});}
