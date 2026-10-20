import { getPostById, getAllPosts } from "@/lib/server-utils";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  if (posts.length === 0) return [{ id: "none" }];
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let post;
  try {
    post = await getPostById(id);
  } catch {
    notFound();
  }
  if (!post) return notFound();

  return (
    <>
      <section className="border-b-4 border-black bg-[#FFE600] text-black [background-size:18px_18px] bg-[radial-gradient(rgba(0,0,0,0.14)_1.5px,transparent_1.5px)]">
        <div className="container mx-auto max-w-3xl px-4 py-10">
          <Button size="sm" asChild>
            <Link href="/news">
              <ArrowLeft className="h-4 w-4" />
              All updates
            </Link>
          </Button>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-3 flex items-center gap-2 font-mono text-sm font-bold uppercase">
            <Calendar className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
        </div>
      </section>
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <article
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </>
  );
}
