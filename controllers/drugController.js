import Drug from "../models/drugModel.js";

// Get all drugs
export const getDrugs = async (req, res) => {
  try {
    const { query } = req.query; // Get search term from request

    let drugs;
    if (query) {
      // If there's a search query, filter drugs by name (case-insensitive)
      drugs = await Drug.find({ name: { $regex: query, $options: "i" } });
    } else {
      // If no search query, return all drugs
      drugs = await Drug.find();
    }

    res.status(200).json(drugs); // Send drugs as an array
  } catch (error) {
    res.status(500).json({ message: "Error fetching drugs" });
  }
};

// Get a single drug by ID
export const getDrugById = async (req, res) => {
  try {
    const drug = await Drug.findById(req.params.id);
    if (!drug) return res.status(404).json({ message: "Drug not found" });
    res.status(200).json(drug);
  } catch (error) {
    res.status(500).json({ message: "Error fetching drug" });
  }
};

// Backend code to handle multiple drugs
export const addDrugs = async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body.name || !req.body.quantity || !req.body.price) {
      return res.status(400).send({
        message: "Send all required fields",
      });
    }
    const newDrug = {
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
    };
    const drug = await Drug.create(newDrug);
    return res.status(201).send(drug);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// Update drug details
export const updateDrug = async (req, res) => {
  try {
    if (!req.body.name || !req.body.quantity || !req.body.price) {
      return res.status(400).send({
        message: "Send All Requerd Fields",
      });
    }

    const { id } = req.params; // get the drug id from the URL
    const drug = await Drug.findById(id);
    if (!drug) {
      return res.status(404).json({ message: "Drug not found" });
    }

    const { name, quantity, price } = req.body;

    const updatedDrug = await Drug.findByIdAndUpdate(
      id,
      { name, quantity, price },
      {
        new: true, //return the updated documnet
      }
    );
    return res.status(200).send({
      message: "Drug updated successfully",
      data: updatedDrug,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error updating drug" });
  }
};

// Delete a drug
export const deleteDrug = async (req, res) => {
  try {
    const { id } = req.params;

    const drug = await Drug.findById(id);
    if (!drug) {
      return res.status(404).json({ message: "Drug not found" });
    }
    await Drug.findByIdAndDelete(id);
    return res.status(200).json({ message: "Drug deleted successfully" });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ message: error.message });
  }
};
