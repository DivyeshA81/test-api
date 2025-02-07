const City = require("../models/citySchema");
const State =require("../models/stateSchema");

const createCity = async (req, res) => {
  try {
    const { cityName, stateName } = req.body;
    const state = await State.findOne({ stateName });

    if (!state) {
      return res.status(400).json({ message: "State not found" });
    }
    const city = new City({
      cityName,
      state: state._id,
      country: state.country._id,
    });
    await city.save();
    
    res.status(201).json({
      message: "City created successfully",  
      city: city,  
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllCities = async (req, res) => {
    try {
      const cities = await City.find()
      .populate('country', 'countryName')  
      .populate('state', 'stateName');   

    const transformedCities = cities.map(city => ({
      ...city.toObject(),
      country: city.country ? city.country.countryName : null,  
      state: city.state ? city.state.stateName : null         
    }));

      res.status(200).json(transformedCities);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  const getCityById = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const city = await City.findById(id)
        .populate('country', 'countryName')
        .populate('state', 'stateName');
  
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
  
      const transformedCity = {
        ...city.toObject(),
        country: city.country ? city.country.countryName : null,
        state: city.state ? city.state.stateName : null,
      };
  
      res.status(200).json(transformedCity);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
const getCitiesByState = async (req, res) => {
  try {
    const cities = await City.find({ state: req.params.stateId })
    .populate('country', 'countryName ') 
    .populate('state', 'stateName ');   

  const transformedCities = cities.map(city => ({
    ...city.toObject(),
    country: city.country ? city.country.countryName : null,  
    state: city.state ? city.state.stateName : null         
  }));
    res.status(200).json(transformedCities);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateCity = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCity = await City.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedCity) {
        return res.status(404).json({ message: "City not found" });
      }
  
      res.status(200).json({ message: "City Updated" ,updatedCity});
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const deleteCity = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCity = await City.findByIdAndDelete(id);
  
      if (!deletedCity) {
        return res.status(404).json({ message: "City not found" });
      }
  
      res.status(200).json({ message: "City deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

module.exports = { createCity, getAllCities,getCityById, getCitiesByState, updateCity, deleteCity };