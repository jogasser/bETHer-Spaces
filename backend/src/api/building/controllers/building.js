'use strict';

/**
 * building controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::building.building', ({ strapi }) => ({
    async find(ctx) {
        // the big boy version of getting stuff from the API:
        //https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/query-engine-api.html
        return strapi.db.query('api::building.building').findMany({
            populate: {
                spaces: {
                    populate: {
                        measurements: true,
                    }
                },
            },
        });
    },

    async findOne(ctx) {
        const { id } = ctx.params;
        const { query } = ctx;

        const entity = await strapi.service('api::building.building').findOne(id, query);
        return await this.sanitizeOutput(entity, ctx);
    }
}));