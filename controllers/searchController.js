import Drug from "../models/drugModel.js";

export const getDrugs = async (req, res) => {
  const query = req.query.query; // Get the query parameter from the request

  try {
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Invalid search query" });
    }
    console.log("Search Query:", query); // Log the query
    const drugs = await Drug.find({
      name: { $regex: query, $options: "i" }, // Case-insensitive match
    });

    res.json(drugs); // Return the found drugs
  } catch (error) {
    console.error("Error in search API:", error); // Log any server errors
    res.status(500).json({ message: "Error occurred during search" });
  }
};
