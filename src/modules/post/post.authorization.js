import { roles } from "../../DB/model/User.model.js"

export const endpoint ={
    create: [roles.admin, roles.user],
    delete: [roles.admin],
    update: [roles.admin, roles.user]
}
