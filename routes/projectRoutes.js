const express = require("express");
const project_router = express.Router();
const validate_token = require("../middleware/validateTokenHandler");
const verify_permission = require("../middleware/permissionVerifier");
const verify_project_access = require("../middleware/projectAccessVerifier");

const {
    create_project,
    update_project,
    delete_project,
    delete_multiple_projects,
    view_project,
    view_all_projects,
    edit_project_status,
    update_assigned_employees,
    view_assigned_projects
} = require("../controller/projectController");

const project_file_router = require("./projfileRoutes");

// Adding Routes for Project File Upload
project_router.use("/project_files", validate_token, verify_project_access("UPDATE-PROJECTS"), project_file_router);

// Create Project
project_router.post("/", validate_token, verify_permission("CREATE-PROJECTS"), create_project);

// View All Projects -  Of Organisation Only
project_router.get("/", validate_token, verify_permission("VIEW-ALL-PROJECTS"), view_all_projects);

// View Assigned Projects
project_router.get("/assigned", validate_token, verify_permission("VIEW-PROJECTS"), view_assigned_projects);

// View Single Project
project_router.get("/:project_id", validate_token, verify_project_access("VIEW-PROJECTS"), view_project);

// Update Project
project_router.put("/:project_id", validate_token, verify_project_access("UPDATE-PROJECTS"), update_project);

// Update Project Status
project_router.put("/update-status/:project_id", validate_token, verify_project_access("UPDATE-PROJECTS"), edit_project_status);

// Update Assigned Employees
project_router.put("/update-employees/:project_id", validate_token, verify_project_access("UPDATE-PROJECTS"), update_assigned_employees );

// Delete Single Project
project_router.delete("/:project_id", validate_token, verify_project_access("DELETE-PROJECTS"), delete_project);

// Delete Multiple Projects
project_router.delete("/delete-multiple", validate_token, verify_permission("DELETE-ALL-PROJECTS"), delete_multiple_projects);


module.exports = project_router;