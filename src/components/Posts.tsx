export default function PostArticle({ content }: { content: string }) {
  return (
    <article
      className={`
        prose 
        prose-strong:text-foreground 
        prose-li:text-foreground prose-li:marker:text-foreground
        prose-a:text-foreground
        `}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
