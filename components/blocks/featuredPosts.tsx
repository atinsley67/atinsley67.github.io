import { Actions } from "../util/actions";
import { Section } from "../util/section";
import { client } from "../../.tina/__generated__/client";
import { Container } from "../util/container";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import React, { useState, useEffect } from 'react';


export const FeaturedPost = ({ data, tinaField }) => {

  if (!data || !data.data.post) {
    return <div>{JSON.stringify(data)}</div>;
  }

  return (
    <div
      data-tinafield={tinaField}
      className="rounded-xl overflow-hidden shadow-lg"
    >
      <img className="w-full" src={data.data.post.heroImg} alt={data.data.post.title}/>
      <div className="px-6 pt-4 pb-2">
        {data.data.post.title && (
          <h3
            data-tinafield={`${tinaField}.title`}
            className="text-2xl font-semibold title-font"
          >
            {data.data.post.title}
          </h3>
        )}
        {data.data.post.excerpt && (
          <p
            data-tinafield={`${tinaField}.text`}
            className="text-base opacity-80 leading-relaxed"
          >
            <TinaMarkdown content={data.data.post.excerpt} />
          </p>
        )}
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{data.data.post.category}</span>
      </div>
    </div>
  );
};

export const FeaturedPosts = ({ data, parentField }) => {
  const [featureData, setFeatureData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (data && data.items) {
        const promises = data.items.map((block) =>
          getFeaturePostData({ postLocation: block.postLocation })
        );
        const results = await Promise.all(promises);
        setFeatureData(results.map((result) => result.props));
      }
    };
    fetchData();
  }, [data]);

  if (!featureData || featureData.length === 0) {
    return <div>No post found.</div>;
  }

  return (
    <Section color={data.color}>
      <Container
        className="text-center justify-center"
        size="small"
      >
        <div>
          <h2 className="text-xl font-bold">{data.title}</h2>
        </div>
        <div className="mx-auto p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 max-w-[500px] md:max-w-[800px] lg:max-w-[1200px] ">
        {featureData.map((data, i) => (
          <FeaturedPost
            tinaField={`${parentField}.items.${i}`}
            key={i}
            data={data}
          />
        ))}
        </div>
      </Container>
    </Section>
  );
};


export const getFeaturePostData = async ({ postLocation }) => {
  console.log("ALEX- " + postLocation);
  try {
    const tinaProps = await client.queries.blogPostCardQuery({
      relativePath: `${postLocation}.mdx`,
    });
    return {
      props: {
        ...tinaProps,
      },
    }; 
  } catch (error) {
    return { 
      props: {
        data: {
          post: {
            title: "No Post",
            excerpt: `There was no post matching "${postLocation}"`
          }
        }
      }
    }
  }
};



export const featuredPostsBlockSchema = {
  name: "featuredPosts",
  label: "Featured Posts",
  ui: {
    previewSrc: "",
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "object",
      label: "Featured Posts",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item?.postLocation,
          };
        },
      },
      fields: [
        {
          type: "string",
          label: "Post Location",
          name: "postLocation",
        },
      ],
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" },
      ],
    },
  ],
};
