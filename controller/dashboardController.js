const { getProjectDashboard } = require("../services/dashboardService");
const asyncHandler = require('express-async-handler');


const projectDashboard = asyncHandler(async (req, res) => {

    const org_id = req.user.org_id;

    const data = await getProjectDashboard(org_id);

    return res.status(200).json({
        success: true,
        data
    });
});

module.exports = projectDashboard