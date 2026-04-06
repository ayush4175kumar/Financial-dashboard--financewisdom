const Joi = require('joi');

// Validation schema for user registration
const registerSchema = Joi.object({
	username: Joi.string().min(3).max(30).required(),
	password: Joi.string().min(6).required(),
	role: Joi.string().valid('viewer', 'analyst', 'admin').optional()
});

// Validation schema for financial record creation
const recordSchema = Joi.object({
	amount: Joi.number().required(),
	type: Joi.string().valid('income', 'expense').required(),
	category: Joi.string().required(),
	date: Joi.date().required(),
	notes: Joi.string().allow('').optional()
});

module.exports = {
	registerSchema,
	recordSchema
};
