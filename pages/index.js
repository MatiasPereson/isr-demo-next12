import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";

// Number of items per page
const LIMIT = 10;

export default function Home({ initialCats }) {
  console.log("Initial cats in Home component:", initialCats);

  const [cats, setCats] = useState(initialCats);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreCats = async () => {
    try {
      const res = await fetch(`/api/cats?page=${page + 1}`);
      const newCats = await res.json();

      if (newCats.length < LIMIT) {
        setHasMore(false);
      }

      setCats((prevCats) => [...prevCats, ...newCats]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching more cats:", error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Cat Gallery</title>
        <meta name="description" content="A beautiful gallery of cats" />
      </Head>

      <h1 className="text-4xl font-bold text-center my-8">Cat Gallery</h1>

      <InfiniteScroll
        dataLength={cats.length}
        next={fetchMoreCats}
        hasMore={hasMore}
        loader={<h4 className="text-center my-4">Loading...</h4>}
        endMessage={<p className="text-center my-4">No more cats to load!</p>}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cats.map((cat) => {
          console.log("Rendering cat with ID:", cat.id);
          return (
            <Link
              href={`/cat/${cat.reference_image_id || cat.id}`}
              key={cat.id}
              className="block border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <a>
                <div className="aspect-w-16 aspect-h-9 relative">
                  <Image
                    src={cat.url}
                    alt={`Cat ${cat.id}`}
                    width={500}
                    height={500}
                    objectFit="cover"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">
                    {cat.breeds && cat.breeds[0]
                      ? cat.breeds[0].name
                      : `Cat #${cat.id.substring(0, 8)}`}
                  </h2>
                </div>
              </a>
            </Link>
          );
        })}
      </InfiniteScroll>
    </div>
  );
}

export async function getStaticProps() {
  console.log("Executing getStaticProps in index.js");

  try {
    const res = await fetch(
      "https://api.thecatapi.com/v1/images/search?limit=10",
      {
        headers: {
          "x-api-key": process.env.CAT_API_KEY,
        },
      }
    );
    const initialCats = await res.json();

    return {
      props: {
        initialCats,
      },
      revalidate: 60, // Revalidate every minute
    };
  } catch (error) {
    console.error("Error fetching initial cats:", error);
    return {
      props: {
        initialCats: [],
      },
    };
  }
}
