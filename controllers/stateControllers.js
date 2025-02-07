const State = require('../models/stateSchema');
const Country = require('../models/countrySchema');

const createState = async (req, res) => {
  try {
    const { stateName, countryName } = req.body;

    const country = await Country.findOne({ countryName });

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    
    const state = new State({
      stateName,
      country: country._id, 
    });

    await state.save();

    res.status(201).json({
      message: "State created successfully",  
      state: state,  
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

  
  

const getAllStates = async (req, res) => {
  try {
    const states = await State.find()
      .populate('country', 'countryName');

      const transformedStates = states.map(state => {
        const countryName = state.country ? state.country.countryName : null;
  
        return {
          ...state.toObject(),
          country: countryName 
        };
      });

    res.status(200).json(transformedStates);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const getStateById = async (req, res) => {
  try {
    const { id } = req.params; 

    const state = await State.findById(id).populate('country', 'countryName');

    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    const transformedState = {
      ...state.toObject(),
      country: state.country ? state.country.countryName : null,
    };

    res.status(200).json(transformedState); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const getStatesByCountry = async (req, res) => {
  try {
    const states = await State.find({ country: req.params.countryId })
    .populate('country', 'countryName');

    const transformedStates = states.map(state => {
      const countryName = state.country ? state.country.countryName : null;

      return {
        ...state.toObject(),
        country: countryName 
      };
    });
    res.status(200).json(transformedStates);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateState = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedState = await State.findByIdAndUpdate(id, req.body, { new: true });
      
      if (!updatedState) {
        return res.status(404).json({ message: "State not found" });
      }
  
      res.status(200).json({ message: "State Updated" ,updatedState});
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
 
  const deleteState = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedState = await State.findByIdAndDelete(id);
  
      if (!deletedState) {
        return res.status(404).json({ message: "State not found" });
      }
  
      res.status(200).json({ message: "State deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
module.exports = { createState, getAllStates,getStateById, getStatesByCountry, updateState, deleteState};