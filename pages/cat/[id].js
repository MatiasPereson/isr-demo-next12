import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function CatPage({ cat }) {
  console.log("Rendering CatPage component with cat:", cat);

  if (!cat) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-700 mb-8 inline-block"
        >
          ← Back to Gallery
        </Link>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const breed = cat.breeds?.[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{breed ? `${breed.name} Cat` : "Cat Details"}</title>
        <meta
          name="description"
          content={breed?.description || `Details for cat ${cat.id}`}
        />
      </Head>

      <Link
        href="/"
        className="text-blue-500 hover:text-blue-700 mb-8 inline-block"
      >
        ← Back to Gallery
      </Link>

      <div className="max-w-4xl mx-auto text-gray-700">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-center">
          <Image
            src={cat.url}
            alt={breed?.name || `Cat ${cat.id}`}
            width={500}
            height={500}
            className="w-full h-full object-contain"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">
              {breed ? breed.name : `Beautiful Cat #${cat.id}`}
            </h1>

            {breed ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    About this Breed
                  </h2>
                  <p className="text-gray-700">{breed.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Characteristics
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <strong>Temperament:</strong> {breed.temperament}
                      </li>
                      <li>
                        <strong>Origin:</strong> {breed.origin}
                      </li>
                      <li>
                        <strong>Life Span:</strong> {breed.life_span} years
                      </li>
                      <li>
                        <strong>Weight:</strong> {breed.weight.metric} kg (
                        {breed.weight.imperial} lbs)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Ratings (1-5)
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <strong>Adaptability:</strong>{" "}
                        {"⭐".repeat(breed.adaptability)}
                      </li>
                      <li>
                        <strong>Affection Level:</strong>{" "}
                        {"⭐".repeat(breed.affection_level)}
                      </li>
                      <li>
                        <strong>Child Friendly:</strong>{" "}
                        {"⭐".repeat(breed.child_friendly)}
                      </li>
                      <li>
                        <strong>Energy Level:</strong>{" "}
                        {"⭐".repeat(breed.energy_level)}
                      </li>
                      <li>
                        <strong>Intelligence:</strong>{" "}
                        {"⭐".repeat(breed.intelligence)}
                      </li>
                    </ul>
                  </div>
                </div>

                {breed.wikipedia_url && (
                  <div>
                    <a
                      href={breed.wikipedia_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Learn more on Wikipedia →
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-gray-600">
                  <strong>Image dimensions:</strong> {cat.width}px ×{" "}
                  {cat.height}px
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  console.log("Executing getStaticPaths");

  return {
    paths: [], // Don't pre-render any paths
    fallback: true, // Enable ISR
  };
}

export async function getStaticProps({ params }) {
  console.log("Executing getStaticProps with params:", params);

  try {
    const apiUrl = `https://api.thecatapi.com/v1/images/${params.id}`;
    console.log("Fetching from URL:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        "x-api-key": process.env.CAT_API_KEY,
      },
    });

    if (!response.ok) {
      console.log("API Error:", response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cat = await response.json();

    return {
      props: {
        cat,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      notFound: true,
    };
  }
}
