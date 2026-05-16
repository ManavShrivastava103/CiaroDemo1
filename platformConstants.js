const system_roles = ["Admin", "Viewer", "Contributer"];

const system_permissions = [
    "CREATE-USERS", "VIEW-USERS", "UPDATE-USERS", "DELETE-USERS",
    "CREATE-ROLES", "VIEW-ROLES", "UPDATE-ROLES", "DELETE-ROLES",
    "CREATE-PROJECTS", "VIEW-PROJECTS", "UPDATE-PROJECTS", "DELETE-PROJECTS", 
    "CREATE-ALL-PROJECTS", "VIEW-ALL-PROJECTS", "UPDATE-ALL-PROJECTS", "DELETE-ALL-PROJECTS",
    "ASSIGN-USER-TO-PROJECT", "UNASSIGN-USER-TO-PROJECT",
    "VIEW-PROJECT-ANALYTICS"
];

const viewer_permissions = ["VIEW-USERS", "VIEW-ALL-PROJECTS", "VIEW-PROJECT-ANALYTICS"];
const contributer_permissions = ["VIEW-USERS", "VIEW-ALL-PROJECTS", "UPDATE-PROJECTS"]

module.exports = {system_roles, system_permissions, viewer_permissions, contributer_permissions};