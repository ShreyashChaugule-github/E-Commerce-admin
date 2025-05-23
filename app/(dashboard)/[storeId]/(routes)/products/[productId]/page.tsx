import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/products-form";

const ProductPage = async ({ 
    params 
}: { params: Promise<{ productId: string, storeId: string }> 
}) => {
    const { productId } = await params; // ✅ Await params before accessing its properties
    const { storeId } = await params;
    
    const product = await prismadb.product.findUnique({
        where: { id: productId, storeId},
        include: {images: true}
    });

    const categories = await prismadb.category.findMany({
        where: {
            storeId: (await params).storeId,
        }
    });

    const sizes = await prismadb.size.findMany({
        where:{
            storeId: (await params).storeId,
        }
    });
    const colors = await prismadb.color.findMany({
        where:{
            storeId: (await params).storeId,
        }
    });


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm 
                    categories={categories}
                    colors={colors}
                    sizes={sizes} 
                    initialData={product}
                />
            </div>
        </div>
    );
};

export default ProductPage;

