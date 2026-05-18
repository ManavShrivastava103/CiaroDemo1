// PERMISSION MANAGEMENT SECTION
const system_permissions = [
    "CREATE-USERS", "VIEW-USERS", "UPDATE-USERS", "DELETE-USERS",
    "CREATE-ROLES", "VIEW-ROLES", "UPDATE-ROLES", "DELETE-ROLES",
    "CREATE-PROJECTS", "VIEW-PROJECTS", "UPDATE-PROJECTS", "DELETE-PROJECTS", 
    "VIEW-ALL-PROJECTS", "UPDATE-ALL-PROJECTS", "DELETE-ALL-PROJECTS",
    "ASSIGN-USER-TO-PROJECT", "UNASSIGN-USER-TO-PROJECT",
    "VIEW-PROJECT-ANALYTICS"
];

const viewer_permissions = ["VIEW-USERS", "VIEW-ALL-PROJECTS", "VIEW-PROJECT-ANALYTICS"];
const contributer_permissions = ["VIEW-USERS", "VIEW-ALL-PROJECTS", "UPDATE-PROJECTS"]

const system_roles = {"Admin": system_permissions, "Viewer" : viewer_permissions, "Contributer" : contributer_permissions};

// FILE UPLOAD SECTION : Defining the file size
const file_upload_size =  10 * 1024 * 1024      // 10MB as of now
const file_upload_allowed_types = ["jpg", "jpeg", "png", "pdf", "docx"];


module.exports = {system_roles, system_permissions, viewer_permissions, contributer_permissions, file_upload_size, file_upload_allowed_types};