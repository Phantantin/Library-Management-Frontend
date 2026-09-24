import {Suspense} from "react";
import {AuthForm} from "@/features/auth/auth-form";
export const metadata={title:"login",robots:{index:false}};
export default function Page(){return <main id="main" className="min-h-dvh flex justify-center items-center p-5 py-12"><Suspense><AuthForm mode="login"/></Suspense></main>;}
