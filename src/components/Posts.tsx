export default function PostArticle({ content }: { content: string }) {
  return (
    <article
      className={`
        prose 
        prose-p:whitespace-pre-wrap
        prose-strong:text-foreground 
        prose-li:text-foreground prose-li:marker:text-foreground
        prose-a:text-foreground
        prose-img:w-full
        text-justify
        `}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
