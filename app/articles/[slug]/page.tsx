import { notFound } from "next/navigation";
import { Shell } from "../../components";
import { getArticle } from "../../api";
export default async function ArticleDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  return <Shell><main className="article-detail"><section className="article-hero"><span className="article-hero-image" style={{backgroundImage:`url(${article.image})`}} /><div className="article-hero-content"><small>{article.category} · {article.date}</small><h1>{article.title}</h1><p>{article.excerpt}</p></div></section><article className="article-body" style={{whiteSpace:"pre-wrap"}}>{article.content}</article></main></Shell>;
}
