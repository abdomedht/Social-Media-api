import { roles } from "../../DB/model/User.model.js"
export const endpoint={
    create:[roles.user],
    updateComment:[roles.user],
    freeze:[roles.admin,roles.user],
    unfreeze:[roles.admin,roles.user],
    like:[roles.user]
}