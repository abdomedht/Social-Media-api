/**
 * CRUD and query services for Mongoose models.
 * @module DB/dbService
 */
// CRUD Operations Service
/**
 * Creates a new document.
 * @param {Object} options
 * @param {mongoose.Model} options.model - The Mongoose model.
 * @param {Object} [options.data={}] - The data to create.
 * @returns {Promise<Object>} The created document.
 */
export const create = async ({ model, data = {} } = {}) => {
    return await model.create(data);
};

// Find Operations
/**
 * Finds all documents matching the filter.
 * @param {Object} options
 * @param {mongoose.Model} options.model
 * @param {Object} [options.filter={}]
 * @param {string} [options.select=""]
 * @param {Array} [options.populate=[]]
 * @param {number} [options.skip=0]
 * @param {number} [options.limit=100]
 * @param {Object} [options.sort={}]
 * @returns {Promise<Array>} Array of documents.
 */
export const findAll = async ({
    model,
    filter = {},
    select = "",
    populate = [],
    skip = 0,
    limit = 100,
    sort = {}
} = {}) => {
    return await model.find(filter)
        .select(select)
        .populate(populate)
        .skip(skip)
        .limit(limit)
        .sort(sort);
};

/**
 * Finds one document matching the filter.
 * @param {Object} options
 * @param {mongoose.Model} options.model
 * @param {Object} [options.filter={}]
 * @param {string} [options.select=""]
 * @param {Array} [options.populate=[]]
 * @returns {Promise<Object|null>} The found document or null.
 */
export const findOne = async ({
    model,
    filter = {},
    select = "",
    populate = []
} = {}) => {
    return await model.findOne(filter)
        .select(select)
        .populate(populate);
};

/**
 * Finds a document by its ID.
 * @param {Object} options
 * @param {mongoose.Model} options.model
 * @param {string} options.id
 * @param {string} [options.select='']
 * @param {Array} [options.populate=[]]
 * @returns {Promise<Object|null>} The found document or null.
 */
export const findById = async ({
    model,
    id,
    select = '',
    populate = []
} = {}) => {
    return await model.findById(id)
        .select(select)
        .populate(populate);
};

// Update Operations
/**
 * Finds one document and updates it.
 * @param {Object} options
 * @param {mongoose.Model} options.model
 * @param {Object} [options.filter={}]
 * @param {Object} [options.data={}]
 * @param {Object} [options.options={ new: true }]
 * @param {string} [options.select=""]
 * @param {Array} [options.populate=[]]
 * @returns {Promise<Object|null>} The updated document or null.
 */
export const findOneAndUpdate = async ({
    model,
    filter = {},
    data = {},
    options = { new: true },
    select = "",
    populate = []
} = {}) => {
    return await model.findOneAndUpdate(filter, data, options)
        .select(select)
        .populate(populate);
};

/**
 * Finds a document by ID and updates it.
 * @param {Object} options
 * @param {mongoose.Model} options.model
 * @param {string} options.id
 * @param {Object} [options.data={}]
 * @param {Object} [options.options={ new: true }]
 * @param {string} [options.select=""]
 * @param {Array} [options.populate=[]]
 * @returns {Promise<Object|null>} The updated document or null.
 */
export const findByIdAndUpdate = async ({
    model,
    id,
    data = {},
    options = { new: true },
    select = "",
    populate = []
} = {}) => {
    return await model.findByIdAndUpdate(id, data, options)
        .select(select)
        .populate(populate);
};

/**
 * Updates one document matching the filter.
 * @param {Object} options
 * @param {mongoose.Model} options.model
 * @param {Object} [options.filter={}]
 * @param {Object} [options.data={}]
 * @param {Object} [options.options={}]
 * @returns {Promise<Object>} The update result.
 */
export const updateOne = async ({
    model,
    filter = {},
    data = {},
    options = {}
} = {}) => {
    return await model.updateOne(filter, data, options);
};

/**
 * Updates many documents matching the filter.
 * @param {Object} options
 * @param {mongoose.Model} options.model
 * @param {Object} [options.filter={}]
 * @param {Object} [options.data={}]
 * @param {Object} [options.options={}]
 * @returns {Promise<Object>} The update result.
 */
export const updateMany = async ({
    model,
    filter = {},
    data = {},
    options = {}
} = {}) => {
    return await model.updateMany(filter, data, options);
};

// Delete Operations
/**
 * Finds one document and deletes it.
 * @param {Object} options
 * @param {mongoose.Model} options.model
 * @param {Object} [options.filter={}]
 * @param {Object} [options.options={}]
 * @param {string} [options.select=""]
 * @param {Array} [options.populate=[]]
 * @returns {Promise<Object|null>} The deleted document or null.
 */
export const findOneAndDelete = async ({
    model,
    filter = {},
    options = {},
    select = "",
    populate = []
} = {}) => {
    return await model.findOneAndDelete(filter, options)
        .select(select)
        .populate(populate);
};

/**
 * Finds a document by ID and deletes it.
 * @param {Object} options
 * @param {mongoose.Model} options.model
 * @param {string} options.id
 * @param {Object} [options.options={}]
 * @param {string} [options.select=""]
 * @param {Array} [options.populate=[]]
 * @returns {Promise<Object|null>} The deleted document or null.
 */
export const findByIdAndDelete = async ({
    model,
    id,
    options = {},
    select = "",
    populate = []
} = {}) => {
    return await model.findByIdAndDelete(id, options)
        .select(select)
        .populate(populate);
};

/**
 * Deletes one document matching the filter.
 * @param {Object} options
 * @param {mongoose.Model} options.model
 * @param {Object} [options.filter={}]
 * @param {Object} [options.options={}]
 * @returns {Promise<Object>} The delete result.
 */
export const deleteOne = async ({
    model,
    filter = {},
    options = {}
} = {}) => {
    return await model.deleteOne(filter, options);
};

/**
 * Deletes many documents matching the filter.
 * @param {Object} options
 * @param {mongoose.Model} options.model
 * @param {Object} [options.filter={}]
 * @param {Object} [options.options={}]
 * @returns {Promise<Object>} The delete result.
 */
export const deleteMany = async ({
    model,
    filter = {},
    options = {}
} = {}) => {
    return await model.deleteMany(filter, options);
};