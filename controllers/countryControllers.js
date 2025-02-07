const Country = require('../models/countrySchema')

const createCountry = async (req, res) => {
  try {
    const country = new Country(req.body);
    await country.save();
    res.status(201).json({
      message: "Country created successfully",  
      country: country,  
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.status(200).json(countries);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const getCountryById = async (req, res) => {
  try {
    const { id } = req.params; 
    const country = await Country.findById(id); 

    if (!country) {
      return res.status(404).json({ message: "Country not found" }); 
    }

    res.status(200).json(country);
  } catch (err) {
    res.status(400).json({ message: err.message }); 
  }
};
const updateCountry = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCountry = await Country.findByIdAndUpdate(id, req.body, { new: true });
      
      if (!updatedCountry) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.status(200).json({ message: "Country Updated" ,updatedCountry});
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  const deleteCountry = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCountry = await Country.findByIdAndDelete(id);
      
      if (!deletedCountry) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      res.status(200).json({ message: "Country deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

module.exports = { createCountry, getAllCountries,getCountryById , updateCountry, deleteCountry };