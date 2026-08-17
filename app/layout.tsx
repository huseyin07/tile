import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'TILE — 1111 pieces. One bigger picture.',description:'TILE is a 1,111-piece collection built for the road to GIWA.',openGraph:{title:'TILE',description:'1111 pieces. One bigger picture.',type:'website',images:[{url:'/og-placeholder.svg',width:1200,height:630}]},icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
