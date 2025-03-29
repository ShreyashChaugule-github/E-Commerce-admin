import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


interface DashboardLayoutProps{
    children: React.ReactNode;
    params: Promise<{ storeId: string}>;
}

export default async function DashboardLayout({ children, params}: DashboardLayoutProps)
{
    const { userId } = await auth();

    if(!userId) {
        redirect('/sign-in');
    }

    const { storeId } = await params;

    if (!storeId) {
        redirect('/');
    }

    const store = await prismadb.store.findFirst({
        where:{
            id: storeId,
            userId
        }
    });

    if(!store) {
        redirect('/')
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}