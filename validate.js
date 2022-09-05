const Joi = require('joi');

function validate(item){
    const schema = {
        name : Joi.string().min(3).required(),
        id: Joi.required()
    }
    
   return Joi.validate(item,schema); 
}
    module.exports = validate;
