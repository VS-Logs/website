import React from "react";
import readingTime from "reading-time";
import mdxPrism from "mdx-prism";
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import { ArticleJsonLd, NextSeo } from "next-seo";

import Layout from "src/components/Layout/Layout";

import MDXComponents from "src/components/MDXComponents/MDXComponents";

import Article from "src/modules/Article/Article";

import { api } from "src/lib/lib";
import { BlogArticleType } from "src/types";

interface Props {
  readingTime: {
    text: string;
  };
  frontMatter: {
    title: string;
    description: string;
    date: string;
    content: string;
    author: {
      name: string;
      picture: string;
    };
    ogImage: {
      url: string;
    };
  };
  slug: string;
  source: any;
  tags: Array<string>;
}

const Index = ({ readingTime, frontMatter, slug, source }: Props) => {
  const content = hydrate(source, {
    components: MDXComponents,
  });

  return (
    <Layout>
      <NextSeo
        title={frontMatter.title}
        description={frontMatter.description}
        canonical={`https://leonardomso.com/blog/${slug}`}
        openGraph={{
          url: `https://leonardomso.com/blog/${slug}`,
          title: frontMatter.title,
          description: frontMatter.description,
          images: [
            {
              url: `/images/articles/${slug}.jpeg`,
            },
          ],
          site_name: frontMatter.title,
        }}
      />
      <ArticleJsonLd
        url={`https://leonardomso.com/blog/${slug}`}
        title={frontMatter.title}
        images={[frontMatter.ogImage.url]}
        datePublished={frontMatter.date}
        authorName="Leonardo Maldonado"
        publisherName="Podhouse"
        publisherLogo="/images/logo/icon-1200x630.jpg"
        description={frontMatter.description}
      />

      <Article
        readingTime={readingTime}
        title={frontMatter.title}
        description={frontMatter.description}
        date={frontMatter.date}
        content={content}
        author={frontMatter.author}
        ogImage={frontMatter.ogImage}
        slug={slug}
      />
    </Layout>
  );
};

export default Index;

type Params = {
  params: {
    slug: string;
    timeReading: {
      text: string;
    };
  };
};

export async function getStaticProps({ params }: Params) {
  const { content, data } = api.getRawArticleBySlug(params.slug);

  const mdxSource = await renderToString(content, {
    components: MDXComponents,
    mdxOptions: {
      remarkPlugins: [
        require("remark-autolink-headings"),
        require("remark-slug"),
        require("remark-code-titles"),
        require("remark-autolink-headings"),
        require("remark-capitalize"),
        require("remark-code-titles"),
        require("remark-emoji"),
        require("remark-external-links"),
        require("remark-images"),
        require("remark-slug"),
      ],
      rehypePlugins: [mdxPrism],
    },
  });

  const tags = data.tags ?? [];

  return {
    props: {
      slug: params.slug,
      readingTime: readingTime(content),
      source: mdxSource,
      frontMatter: data,
      tags,
    },
  };
}

export async function getStaticPaths() {
  const articles: Array<BlogArticleType> = api.getAllArticles(["slug"]);

  return {
    paths: articles.map((articles) => {
      return {
        params: {
          slug: articles.slug,
        },
      };
    }),
    fallback: false,
  };
}
