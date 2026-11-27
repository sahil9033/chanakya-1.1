import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '../../components/Footer'
import Reveal from '../../components/Reveal'
import { IconArrowRight } from '../../components/Icons'
import { LEARN_ARTICLES, getArticle, type LearnBlock } from '../../../lib/learn'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vedhh-ai.vercel.app'
).replace(/\/$/, '')

export function generateStaticParams() {
  return LEARN_ARTICLES.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug)
  if (!article) return { title: 'Guide not found' }

  const url = `${SITE_URL}/learn/${article.slug}`
  return {
    title: article.metaTitle,
    description: article.description,
    alternates: { canonical: `/learn/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.metaTitle,
      description: article.description,
      url,
      publishedTime: article.updated,
      modifiedTime: article.updated,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle,
      description: article.description,
      images: ['/opengraph-image'],
    },
  }
}

function BlockRenderer({ block }: { block: LearnBlock }) {
  if (block.kind === 'list') {
    return (
      <ul className="mt-4 space-y-2.5">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span className="text-pretty text-[15px] leading-relaxed text-ink-soft">{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (block.kind === 'quote') {
    return (
      <figure className="mt-5 rounded-2xl border-l-2 border-accent/40 bg-cream px-5 py-4">
        <blockquote className="font-serif text-lg italic leading-relaxed text-ink">
          &ldquo;{block.text}&rdquo;
        </blockquote>
        {block.cite && (
          <figcaption className="mt-2 text-[12px] uppercase tracking-[0.12em] text-ink-faint">
            {block.cite}
          </figcaption>
        )}
      </figure>
    )
  }

  return (
    <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-soft">{block.text}</p>
  )
}

export default function LearnArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)
  if (!article) notFound()

  const url = `${SITE_URL}/learn/${article.slug}`
  const related = article.related
    .map((slug) => getArticle(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))

  const JSON_LD = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}/#article`,
        headline: article.title,
        description: article.description,
        url,
        datePublished: article.updated,
        dateModified: article.updated,
        inLanguage: 'en',
        author: {
          '@type': 'Person',
          name: 'Sahil Dadaso Patil',
          url: 'https://www.linkedin.com/in/sahil-dadaso-patil/',
        },
        publisher: { '@type': 'Organization', name: 'Vedhh AI', url: SITE_URL },
        isPartOf: { '@type': 'WebSite', name: 'Vedhh AI', url: SITE_URL },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}/#faq`,
        mainEntity: article.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Learn', item: `${SITE_URL}/learn` },
          { '@type': 'ListItem', position: 3, name: article.title, item: url },
        ],
      },
    ],
  }

  return (
    <div className="relative flex flex-1 flex-col bg-canvas text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Header */}
      <section className="relative isolate overflow-hidden border-b border-ink-line">
        <div className="mesh" aria-hidden="true">
          <span className="mesh-layer mesh-c" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:py-20">
          <Reveal>
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[12px] text-ink-faint">
              <Link href="/learn" className="transition-colors hover:text-ink">
                Learn
              </Link>
              <span aria-hidden="true">/</span>
              <span className="eyebrow">{article.kicker}</span>
            </nav>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 text-balance font-serif text-4xl leading-[1.08] tracking-tightest text-ink sm:text-5xl">
              {article.title}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[12px] text-ink-faint">
              <span>{article.readMinutes} min read</span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.updated}>
                Updated{' '}
                {new Date(article.updated).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-ink-soft">
              {article.intro}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        {article.sections.map((section, i) => (
          <Reveal key={i} className={i === article.sections.length - 1 ? '' : 'mb-10'}>
            <section>
              <h2 className="font-serif text-2xl leading-tight tracking-tight text-ink sm:text-[28px]">
                {section.heading}
              </h2>
              {section.blocks.map((block, j) => (
                <BlockRenderer key={j} block={block} />
              ))}
            </section>
          </Reveal>
        ))}

        {/* FAQ */}
        <Reveal className="mt-14">
          <section className="rounded-3xl border border-ink-line bg-cream p-6 sm:p-8">
            <h2 className="font-serif text-2xl leading-tight tracking-tight text-ink">
              Frequently asked questions
            </h2>
            <dl className="mt-6 space-y-6">
              {article.faq.map((f, i) => (
                <div key={i}>
                  <dt className="text-[15px] font-semibold text-ink">{f.q}</dt>
                  <dd className="mt-2 text-pretty text-[15px] leading-relaxed text-ink-soft">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </Reveal>

        {/* CTA */}
        <Reveal className="mt-8">
          <div className="spot rounded-3xl border border-ink-line bg-canvas p-6 shadow-soft sm:p-8">
            <p className="text-pretty text-[15px] leading-relaxed text-ink-soft">{article.cta.blurb}</p>
            <Link
              href={article.cta.href}
              className="group mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-canvas shadow-sm transition-all duration-300 hover:shadow-lift"
            >
              {article.cta.label}
              <IconArrowRight
                width={15}
                height={15}
                className="text-accent transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>

        {/* Related */}
        {related.length > 0 && (
          <Reveal className="mt-14">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
              Keep reading
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/learn/${r.slug}`}
                  className="spot group flex h-full flex-col rounded-2xl border border-ink-line bg-canvas p-5 transition-all duration-500 ease-expo hover:border-accent/25 hover:shadow-soft"
                >
                  <span className="eyebrow">{r.kicker}</span>
                  <span className="mt-3 font-serif text-lg leading-tight tracking-tight text-ink">
                    {r.title}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-accent-deep">
                    Read
                    <IconArrowRight
                      width={14}
                      height={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal className="mt-12">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <IconArrowRight width={14} height={14} className="rotate-180" />
            All guides
          </Link>
        </Reveal>
      </article>

      <Footer />
    </div>
  )
}
