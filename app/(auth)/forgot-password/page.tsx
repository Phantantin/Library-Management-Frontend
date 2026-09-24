import {Suspense} from "react";
import {AuthForm} from "@/features/auth/auth-form";
export const metadata={title:"forgot password",robots:{index:false}};
export default function Page(){return <main id="main" className="min-h-dvh flex justify-center items-center p-5 py-12"><Suspense><AuthForm mode="forgot-password"/></Suspense></main>;}
