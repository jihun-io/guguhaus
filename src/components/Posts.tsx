export default function PostArticle({ content }: { content: string }) {
  return (
    <article
      className={`
        prose 
        prose-p:whitespace-pre-line
        prose-strong:text-foreground 
        prose-li:text-foreground prose-li:marker:text-foreground
        prose-a:text-foreground
        prose-a:break-all
        prose-img:w-full
        text-justify
        `}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export function PostLimitedArticle({ content }: { content: string }) {
  return (
    <article
      className={`
        prose 
        prose-p:whitespace-pre-line
        prose-strong:text-foreground 
        prose-ul:mx-0 prose-ul:px-0 prose-ul:list-none
        prose-li:text-foreground prose-li:m-0 prose-li:p-0
        prose-a:text-foreground
        prose-a:break-all
        prose-img:w-full
        prose-h3:font-korail-condensed
        text-justify
        `}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
