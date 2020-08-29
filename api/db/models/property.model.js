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
    airConditioning:{
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
    tv:{
        type:Boolean,
        required:false, 
    },
    wifi:{
        type:Boolean,
        required:false, 
    },
    SuitableForFamilies :{
        type:Boolean,
        required:false, 
    },
    Shampoo :{
        type:Boolean,
        required:false, 
    },
    StoveTop :{
        type:Boolean,
        required:false, 
    },
    Hangers :{
        type:Boolean,
        required:false, 
      },
    HotWater :{
        type:Boolean,
        required:false, 
    },
    ComfortableWorkplaceForLaptop :{
        type:Boolean,
        required:false, 
    },
    kitchenUtensils :{
        type:Boolean,
        required:false, 
    },
    Terrace :{
        type:Boolean,
        required:false, 
    },
    Linen :{
        type:Boolean,
        required:false, 
    },
    Parking :{
        type:Boolean,
        required:false, 
    },
    Elevators :{
        type:Boolean,
        required:false, 
    },
    Iron :{
        type:Boolean,
        required:false, 
    },
    Heating :{
        type:Boolean,
        required:false, 
    },
    Kitchen :{
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