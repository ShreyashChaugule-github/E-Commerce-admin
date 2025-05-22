import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./component/settings-form";


const SetttingsPage = async ({ params } : { params : Promise<{storeId: string}>}) => {
    const { storeId } = await params;
    const { userId } = await auth();

    if(!userId){
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: storeId,
            userId
        }
    });

    if(!store){
        redirect("/");
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store}/>
            </div>
        </div>
    )
}

export default SetttingsPage;