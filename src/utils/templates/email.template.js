export const emailOtpTemplate=(emailOtp)=>{
    return  `
    <div style="text-align: center; font-family: Arial, sans-serif;">
        <h2>Welcome to Our Platform</h2>
        <p>Please confirm your email by clicking the link below:</p>
        <h2 style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">${emailOtp}</h2>
    </div>
`;
}