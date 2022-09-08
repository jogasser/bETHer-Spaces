'use strict';

/**
 * space controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::space.space', ({ strapi }) => ({
    async find(ctx) {
        // the big boy version of getting stuff from the API:
        //https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/query-engine-api.html
        return strapi.db.query('api::space.space').findMany({
            populate: {
                measurements: true,
                polygons: true,
                img: true
            }
        });
    },

    async findOne(ctx) {
        const { id } = ctx.params;
        const { query } = ctx;

        const entity = await strapi.service('api::space.space').findOne(id, query);
        return await this.sanitizeOutput(entity, ctx);
    }
}));