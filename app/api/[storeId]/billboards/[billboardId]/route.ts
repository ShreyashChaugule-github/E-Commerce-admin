import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: Promise<{ billboardId: string }>}
) {
    try{
        const { billboardId } = await params;

        if(!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400})
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: billboardId,
            }
        });
        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ storeId: string; billboardId: string }>}
  ) {
    try {
      const { userId } = await auth();
      console.log("Authenticated user ID:", userId); 
      
      const body = await req.json();
      const { label, imageUrl } = body;
  
      // Await params if needed
      const { storeId, billboardId } = await params;
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      if (!label) {
        return new NextResponse("Label is required", { status: 400 });
      }
  
      if (!imageUrl) {
        return new NextResponse("Image URL is required", { status: 400 });
      }
  
      // Ensure the Billboard exists
      const existingBillboard = await prismadb.billboard.findUnique({
        where: { id: billboardId, storeId },
      });
  
      if (!existingBillboard) {
        return new NextResponse("Billboard not found", { status: 404 });
      }
  
      // Update the Billboard
      const updatedBillboard = await prismadb.billboard.update({
        where: { id: billboardId, storeId: storeId },
        data: { label, imageUrl },
      });
  
      return NextResponse.json(updatedBillboard);
    } catch (error) {
      console.error("[BILLBOARD_PATCH_ERROR]", error);
      return new NextResponse("Internal server error", { status: 500 });
    }
  }

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, billboardId: string }>}
) {
    try{
      const { billboardId, storeId} = await params;
        const { userId } = await auth();

        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }
        if(!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        });
    
        if(!storeByUserId){
            return new NextResponse("Unauthorized", { status: 403});
        }

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id:billboardId,
            }
        });
        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}