import type { NextConfig } from "next";
const config: NextConfig = { poweredByHeader:false, images:{remotePatterns:[{protocol:"https",hostname:"covers.openlibrary.org"},{protocol:"https",hostname:"images.unsplash.com"},{protocol:"https",hostname:"i80zf4n4z0.ufs.sh",pathname:"/f/**"}]}, async headers(){return [{source:"/(.*)",headers:[{key:"X-Content-Type-Options",value:"nosniff"},{key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},{key:"X-Frame-Options",value:"DENY"}]}];}};
export default config;
