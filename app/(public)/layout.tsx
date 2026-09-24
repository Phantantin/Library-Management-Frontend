import {Header,Footer} from "@/components/layout/navigation";
export default function Layout({children}:{children:React.ReactNode}){return <><Header/><main id="main" className="max-w-7xl mx-auto px-5 lg:px-8 py-9">{children}</main><Footer/></>;}
