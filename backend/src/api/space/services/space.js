'use strict';

/**
 * space service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::space.space');
