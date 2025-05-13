import { EventEmitter } from 'node:events'
import { sendEmail } from '../email/send.email.js'
import { customAlphabet } from 'nanoid'
import { emailOtpTemplate } from '../templates/email.template.js'
import { userModel } from '../../DB/model/User.model.js'
import { generateHash } from '../security/hash.security.js'
export const emailEvent = new EventEmitter()
const sendCode =async ({data,subject="confirm-email"}={}) => {
    const { email } = data
    const emailOtp = customAlphabet('0123456789', 5)()
    const html = emailOtpTemplate(emailOtp)
    const hash = generateHash({planText:`${emailOtp}`})
    const updatedData = subject==="confirm-email"? { emailOtp: hash }:{ fogetPasswordOtp:hash }
    await updateOne({ model: userModel, filter: { email }, data: { updatedData } })
    await sendEmail({ to: email, subject, html });

}

emailEvent.on("sendEmail", async (data) => {
   await sendCode({data,subject:"confirm-email"})

})
emailEvent.on("sendEmailForgetPassword", async (data) => {
    await sendCode({data,subject:"reset-password"})
})