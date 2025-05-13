// CRUD Operations Service
export const create = async ({ model, data = {} } = {}) => {
    return await model.create(data);
};

// Find Operations
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

export const updateOne = async ({
    model,
    filter = {},
    data = {},
    options = {}
} = {}) => {
    return await model.updateOne(filter, data, options);
};

export const updateMany = async ({
    model,
    filter = {},
    data = {},
    options = {}
} = {}) => {
    return await model.updateMany(filter, data, options);
};

// Delete Operations
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

export const deleteOne = async ({
    model,
    filter = {},
    options = {}
} = {}) => {
    return await model.deleteOne(filter, options);
};

export const deleteMany = async ({
    model,
    filter = {},
    options = {}
} = {}) => {
    return await model.deleteMany(filter, options);
};