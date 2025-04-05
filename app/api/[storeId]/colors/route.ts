import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  context : { params: Promise<{storeId: string }>}
) {
  try {
    // Correctly await the auth object
    const { userId } = await auth();
    const body = await req.json();

    const { name, value } = body;
    const { storeId } = await context.params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!value) {
        return new NextResponse("Value is required", { status: 400 });
    }

    if (!storeId) {
        return new NextResponse("Store id is required", { status: 400 });
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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: storeId
      }
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function GET(
    req: Request,
    { params }: { params: {storeId: string }}
  ) {
    try {
      if (!params.storeId) {
          return new NextResponse("Store id is required", { status: 400 });
      }
  
      const color = await prismadb.color.findMany({
        where: {
            storeId: params.storeId,
        }
      });
  
      return NextResponse.json(color);
    } catch (error) {
      console.log('[COLOR_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }