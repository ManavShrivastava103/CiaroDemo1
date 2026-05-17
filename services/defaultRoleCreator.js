const Role = require("../models/rolesModel");
const { system_roles } = require("../platformConstants");

const create_system_roles = async (organisation_id) => {
    try {
        const new_system_roles = [];
        for (const [role_name, role_permissions] of Object.entries(system_roles)) {
            new_system_roles.push({
                org_id: organisation_id,
                role_name,
                permissions: role_permissions,
                is_system_role: true
            });
        }
        await Role.insertMany(new_system_roles);
    } catch (err) {
        throw new Error(`Failed to create system roles : ${err.message}`);
    }
};

module.exports = create_system_roles;