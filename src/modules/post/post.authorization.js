import { roles } from "../../DB/model/User.model.js"
export const endpoint ={
    create: [ roles.user],
    freeze: [roles.admin,roles.user],
    update: [roles.admin, roles.user],
    unfreeze:[roles.user,roles.admin],
    like:[roles.user,roles.admin],
    getPost:[roles.user,roles.admin]
}
