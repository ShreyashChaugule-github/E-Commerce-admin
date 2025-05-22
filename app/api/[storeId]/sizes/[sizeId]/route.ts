import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: Promise<{  sizeId: string }>}
) {
    try{
        const { sizeId } = await params;
        if(!sizeId) {
            return new NextResponse("Size id is required", { status: 400})
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: sizeId,
            }
        });
        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZE_GET]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ storeId: string; sizeId: string }> }
  ) {
    try {
      const { userId } = await auth();
      console.log("Authenticated user ID:", userId); 
      
      const body = await req.json();
      const { name, value } = body;
  
      // Await params if needed
      const { storeId, sizeId } = await params;
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      if (!name) {
        return new NextResponse("name is required", { status: 400 });
      }
  
      if (!value) {
        return new NextResponse("value is required", { status: 400 });
      }
  
      // Ensure the Billboard exists
      const existingSize = await prismadb.size.findUnique({
        where: { id: sizeId, storeId },
      });
  
      if (!existingSize) {
        return new NextResponse("Size not found", { status: 404 });
      }
  
      // Update the Billboard
      const updatedSize = await prismadb.size.update({
        where: { id: sizeId, storeId: storeId },
        data: { name, value },
      });
  
      return NextResponse.json(updatedSize);
    } catch (error) {
      console.error("[SIZE_PATCH_ERROR]", error);
      return new NextResponse("Internal server error", { status: 500 });
    }
  }

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, sizeId: string }>}
) {
    try{
        const { userId } = await auth();
        const { storeId, sizeId } = await params;

        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }
        if(!sizeId) {
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

        const size = await prismadb.size.deleteMany({
            where: {
                id: sizeId,
            }
        });
        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZE_DELETE]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}