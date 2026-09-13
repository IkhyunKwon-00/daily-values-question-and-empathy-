import { notFound } from "next/navigation";
import ThoughtProfile from "@/components/profile/ThoughtProfile";
import { getMockAuthor } from "@/lib/mock-people";

export default function ThoughtProfilePage({ params }: { params: { authorId: string } }) {
  const author = getMockAuthor(params.authorId);
  if (!author) notFound();

  return <ThoughtProfile authorId={author.id} gender={author.gender} thoughts={author.thoughts} />;
}