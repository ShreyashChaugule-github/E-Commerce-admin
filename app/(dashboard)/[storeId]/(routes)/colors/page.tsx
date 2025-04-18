import prismadb from '@/lib/prismadb'
import { ColorClient } from './components/client'
import { ColorColumn } from './components/columns';
import { format } from "date-fns";


const ColorPage = async({
  params
}: {
  params: Promise<{ storeId: string }>
}) => {
  const { storeId } = await params;
  const colors = await prismadb.color.findMany({
    where: {
      storeId: storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });


  const formattedColor: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <ColorClient data={formattedColor}/>
        </div>
    </div>
  )
}

export default ColorPage;