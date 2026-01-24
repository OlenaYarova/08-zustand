import { QueryClient } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { dehydrate,HydrationBoundary} from "@tanstack/react-query";
import { Metadata } from 'next';

type NoteDetailsProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
    const note = await fetchNoteById(id);
  return {
    title:`Note ${ note.title}`,
      description: `Note ${ note.title}`,
     openGraph: {
      title: `Note ${ note.title}`,
         description: `Note ${ note.title}`,
      url: `https://notehub.app/notes/"${id}"`,
      images: [
        {
          url: `https://ac.goit.global/fullstack/react/notehub-og-meta.jpg`,
        },
      ],
    },
  };
};
 

const NoteDetails = async ({ params }: NoteDetailsProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });


    return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
    
    
};

export default NoteDetails;
