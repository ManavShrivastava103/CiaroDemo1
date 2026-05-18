const mongoose = require("mongoose");
const Project = require("../models/projectsModel");
const User = require("../models/usersModel");


const getProjectDashboard = async (org_id) => {

    const objectOrgId = new mongoose.Types.ObjectId(org_id);

    // 1. STATUS WISE COUNT
    const statusFacet = await Project.aggregate([
        {
            $match: { org_id: objectOrgId }
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    // 2. ASSIGNED VS UNASSIGNED
    const assignmentFacet = await Project.aggregate([
        {
            $match: { org_id: objectOrgId }
        },
        {
            $project: {
                isAssigned: {
                    $gt: [{ $size: "$assigned_emp" }, 0]
                }
            }
        },
        {
            $group: {
                _id: "$isAssigned",
                count: { $sum: 1 }
            }
        }
    ]);

    // 3. EMPLOYEE WISE PROJECT COUNT
    const employeeFacet = await Project.aggregate([
        {
            $match: { org_id: objectOrgId }
        },
        {
            $unwind: "$assigned_emp"
        },
        {
            $group: {
                _id: "$assigned_emp",
                projectCount: { $sum: 1 }
            }
        }
    ]);

    // populate employee details
    const employeeData = await User.populate(employeeFacet, {
        path: "_id",
        select: "name email"
    });

    // FORMAT STATUS RESULT
    const statusMap = {
        "Not Started": 0,
        "In Progress": 0,
        "Completed": 0
    };

    statusFacet.forEach(item => {
        statusMap[item._id] = item.count;
    });

    // FORMAT ASSIGNMENT RESULT
    let assigned = 0;
    let unassigned = 0;

    assignmentFacet.forEach(item => {
        if (item._id === true) assigned = item.count;
        else unassigned = item.count;
    });

    // FORMAT EMPLOYEE RESULT
    const employeeWise = employeeData.map(item => ({
        employee: item._id.name,
        email: item._id.email,
        projectCount: item.projectCount
    }));

    return {
        totalProjects: assigned + unassigned,
        status: statusMap,
        assignment: {
            assigned,
            unassigned
        },
        employeeWise
    };
};

module.exports = { getProjectDashboard };