import {ReactNode} from 'react';import Navbar from './Navbar';import Footer from './Footer';
export default function Layout({children}:{children:ReactNode}){return <div className="min-h-screen bg-[#07090f] text-white flex flex-col"><Navbar/><main className="flex-1 page-transition">{children}</main><Footer/></div>}
