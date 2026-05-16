const Organisation = require("../models/organizationsModel");
const Role = require("../models/rolesModel");
const { system_roles } = require("../platformConstants");

const create_system_roles = async (organisation_id) => {
    const New_System_Roles = [];

    for (const [role_name, role_permissions] of Object.entries(system_roles)) {
        New_System_Roles.push(new Role({
                org_id : organisation_id,
                role_name : role_name,
                permissions : role_permissions,
                is_system_role : true
            })
        );
    }
    await Role.insertMany(New_System_Roles);
};

module.exports = create_system_roles;