export default async function handler(req, res) {
  const { page = 1 } = req.query;
  const limit = 10;

  try {
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?limit=${limit}&page=${page}`,
      {
        headers: {
          "x-api-key": process.env.CAT_API_KEY,
        },
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching cats:", error);
    res.status(500).json({ error: "Error fetching cats" });
  }
}
