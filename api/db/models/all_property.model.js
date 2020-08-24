const mongoose = require('mongoose');

const AllPropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
        minlength: 1,
     
    },

    city: {
        type: String,
        required: false,
    },
  
    street:{
        type: String,
        required: false,
        minlength: 4
    },
    
    neighbourhood:{
      type: String    
    },
    
    latitude:{
        type: Number    
      },
    
    longitude:{
      type: Number    
    }
})

const AllProperty = mongoose.model('prop', AllPropertySchema);

module.exports = { AllProperty }