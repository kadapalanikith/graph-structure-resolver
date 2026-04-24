const hierarchyService = require('../services/hierarchyService');

const processHierarchies = (req, res, next) => {
    try {
        const { data } = req.body;
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid input. 'data' must be an array of strings." });
        }

        const result = hierarchyService.processData(data);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    processHierarchies
};
