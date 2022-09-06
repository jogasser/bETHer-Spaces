'use strict';

/**
 * measurement controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::measurement.measurement');
