import Joi from 'joi';

const functionSchema = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    input: Joi.alternatives().try(Joi.string(), Joi.number()),
    expectedOutcome: Joi.alternatives()
        .try(Joi.string(), Joi.number())
        .required(),
});

const componentSchema = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    hasButtons: Joi.string().valid('true', 'false'),
    canMount: Joi.string().valid('true', 'false'),
});

const configSchema = Joi.object({
    function: Joi.array().items(functionSchema),
    component: Joi.array().items(componentSchema),
});

export function validateConfig(config) {
    const { error } = configSchema.validate(config);
    if (error) {
        throw new Error(`Invalid configuration: ${error.details[0].message}`);
    }
}
