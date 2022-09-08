'use strict';

/**
 * space controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::rating.rating', ({ strapi }) => ({
    async find(ctx) {
        // the big boy version of getting stuff from the API:
        //https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/query-engine-api.html
        return strapi.db.query('api::rating.rating').findMany();
    },

    async findOne(ctx) {
        const { id } = ctx.params;
        const { query } = ctx;

        const entity = await strapi.service('api::rating.rating').findOne(id, query);
        return await this.sanitizeOutput(entity, ctx);
    }
}));