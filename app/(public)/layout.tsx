import {Header,Footer} from "@/components/layout/navigation";
import {session} from "@/lib/auth";
export default async function Layout({children}:{children:React.ReactNode}){
 let user=null;
 try { user=await session(); } catch { /* Keep public pages usable when the API is temporarily unavailable. */ }
 return <><Header user={user ? {fullName:user.fullName,userName:user.userName,email:user.email,role:user.role}:null}/><main id="main" className="max-w-7xl mx-auto px-5 lg:px-8 py-9">{children}</main><Footer/></>;
}
