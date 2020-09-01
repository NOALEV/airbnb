const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
        minlength: 1,
     
    },
    desc: {
        type: String,
        required: false,
        minlength: 1,  
    },
    accommodates:{
        type:Number,
        required:false,
        minlength: 1,  

    },
    
    cancellationPolicy: {
        type: String,
        required: false,
         
    },
    
  
    propertyType: {
        type: String,
        required: false,
        minlength: 1,  
    },
    bedType: {
        type: String,
        required: false,
        minlength: 1,  
    },
    gallery: {
        type: Buffer,
        required: false,
       
    },
    location: {
        type: String,
        required: false,
    },
    lat:{
        type:Number,
    },
    lng:{
        type:Number,

    },
  
    city: {
        type: String,
        required: false,
    },
    neighborhood: {
        type: String,
        required: false,
    },
    
    roomType: {
        type: String,
        required: false,
    },
  
    street:{
        type: String,
        required: false,
    },
    bedrooms:{
        type: Number,
        required: false,
        
    },
    bathrooms:{
        type: Number,
        required: false,
       
    },
 
    yearBuilt:{
        type:Number,
        required:false,
    },
    coffeeMaker:{
        type:Boolean,
        required:false,
    },
    dishWasher:{
        type:Boolean,
        required:false, 
    },
    dryer:{
        type:Boolean,
        required:false, 
    },
    microwave:{
        type:Boolean,
        required:false, 
    },
    refrigerator:{
        type:Boolean,
        required:false, 
    },
    hairDryer:
    {
        type:Boolean,
        required:false, 
    },

    tv:{
        type:Boolean,
        required:false, 
    },
    wifi:{
        type:Boolean,
        required:false, 
    },
    suitableForFamilies :{
        type:Boolean,
        required:false, 
    },
    linen:{
        type:Boolean,
        required:false, 
    },

    shampoo :{
        type:Boolean,
        required:false, 
    },
    stoveTop :{
        type:Boolean,
        required:false, 
    },
    hangers :{
        type:Boolean,
        required:false, 
      },
    hotWater :{
        type:Boolean,
        required:false, 
    },
    comfortableWorkplaceForLaptop :{
        type:Boolean,
        required:false, 
    },
    dishesAndSilverware :{
        type:Boolean,
        required:false, 
    },
    patioOrBalcony :{
        type:Boolean,
        required:false, 
    },
    oven :{
        type:Boolean,
        required:false, 
    },
    bathTub:{
        type:Boolean,
        required:false,
    },
    washer:{
        type:Boolean,
        required:false, 
    },
    cookingBasics :{
        type:Boolean,
        required:false, 
    },
    parking :{
        type:Boolean,
        required:false, 
    },
    elevators :{
        type:Boolean,
        required:false, 
    },
    iron :{
        type:Boolean,
        required:false, 
    },
    heating :{
        type:Boolean,
        required:false, 
    },
    kitchen :{
        type:Boolean,
        required:false, 
    },
    
    
    

    // with auth
    _userId: {
        type:String,
        required: true
    },
    
    timestamp: 
    { 
        type: Date,
         default: Date.now
        },
   
    images:[ {
        data: String,
    
    }]


})

const Property = mongoose.model('Property', PropertySchema);

module.exports = { Property }