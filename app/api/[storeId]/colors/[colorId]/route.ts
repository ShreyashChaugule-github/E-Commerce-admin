import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: {  colorId: string }}
) {
    try{
        if(!params.colorId) {
            return new NextResponse("Color id is required", { status: 400})
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        });
        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_GET]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; colorId: string } }
  ) {
    try {
      const { userId } = await auth();
      console.log("Authenticated user ID:", userId); 
      
      const body = await req.json();
      const { name, value } = body;
  
      // Await params if needed
      const { storeId, colorId } = params;
  
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
      const existingColor = await prismadb.color.findUnique({
        where: { id: colorId, storeId },
      });
  
      if (!existingColor) {
        return new NextResponse("Color not found", { status: 404 });
      }
  
      // Update the Billboard
      const updatedColor = await prismadb.color.update({
        where: { id: colorId, storeId: storeId },
        data: { name, value },
      });
  
      return NextResponse.json(updatedColor);
    } catch (error) {
      console.error("[COLOR_PATCH_ERROR]", error);
      return new NextResponse("Internal server error", { status: 500 });
    }
  }

export async function DELETE (
    req: Request,
    context: { params: { storeId: string, colorId: string }}
) {
    try{
        const { userId } = await auth();

        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }

        const { storeId, colorId } = await context.params;

        if(!colorId) {
            return new NextResponse("Color id is required", { status: 400})
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

        const color = await prismadb.color.deleteMany({
            where: {
                id: colorId,
            }
        });
        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("Internal error", { status: 500})
    }
}