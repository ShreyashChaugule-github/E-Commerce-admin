"use client"

import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useOrigin } from "@/hooks/use-origin"
import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface SettingsPageProps {
    initialData: Store
}

const formSchema = z.object({
    name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;


export const SettingsForm: React.FC<SettingsPageProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: initialData.name }
    })

    const onSubmit = async (data: SettingsFormValues) => {
        try{
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();
            toast.success("Store updated")
        } catch (error) {
            console.error("Error updating store:", error); 
            toast.error("something went wrong.");
        } finally {
            setLoading(false)
        }
    };

    const onDelete = async () => {
        try{
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh();
            router.push("/")
            toast.success("Store deleted.")
        } catch (error) {
            console.error("Error deleting store:", error); 
            toast.error("Make sure you removed all the products and categories first.");
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                />
            <div className="flex items-center justify-between">
                <Heading 
                    title="Settings"
                    description="Manage store preferences"
                />
                <Button 
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>
            <Separator />
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Store name" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}>
                        </FormField>
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        Save changes
                    </Button>
                </form>
            </FormProvider>
            <Separator />
            <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public"/>
        </>
    )
}