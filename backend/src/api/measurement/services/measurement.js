'use strict';

/**
 * measurement service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::measurement.measurement');
