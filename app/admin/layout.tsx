import {requireUser} from "@/lib/auth";
import {PortalNav} from "@/components/layout/navigation";
export const metadata={title:"Administration",robots:{index:false,follow:false}};
export default async function Layout({children}:{children:React.ReactNode}){const user=await requireUser(true);return <div className="lg:pl-60"><PortalNav user={user} admin/><main id="main" className="max-w-7xl mx-auto p-5 lg:p-9">{children}</main></div>;}
