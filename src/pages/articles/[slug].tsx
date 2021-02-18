import React from "react";
import readingTime from "reading-time";
import mdxPrism from "mdx-prism";
import renderToString from "next-mdx-remote/render-to-string";
import externalLinks from "remark-external-links";
import hydrate from "next-mdx-remote/hydrate";
import Head from "next/head";
import { Text } from "@chakra-ui/react";

import Layout from "src/components/Layout/Layout";
import Article from "src/modules/Article/Article";

import { api } from "src/lib/lib";
import { BlogArticleType } from "src/types";

const components = { Text };

interface Props {
  readingTime: {
    text: string;
  };
  frontMatter: {
    title: string;
    date: string;
    content: string;
  };
  slug: string;
  source: any;
  tags: Array<string>;
}

const Index = ({ readingTime, frontMatter, source }: Props) => {
  const content = hydrate(source, { components });

  return (
    <div className="container">
      <Head>
        <title>Leonardo Maldonado</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Article
          title={frontMatter.title}
          date={frontMatter.date}
          timeReading={readingTime}
          content={content}
        />
      </Layout>
    </div>
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
    mdxOptions: {
      remarkPlugins: [externalLinks],
      rehypePlugins: [mdxPrism],
    },
    scope: data,
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
