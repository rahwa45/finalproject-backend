import Drug from "../models/drugModel.js";

// Get all drugs
export const getDrugs = async (req, res) => {
  try {
    const drugs = await Drug.find();
    res.status(200).json(drugs);
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

// Add a new drug
export const addDrug = async (req, res) => {
  const { name, quantity, price } = req.body;

  try {
    const drug = await Drug.create({ name, quantity, price });
    res.status(201).json(drug);
  } catch (error) {
    res.status(500).json({ message: "Error adding drug" });
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
