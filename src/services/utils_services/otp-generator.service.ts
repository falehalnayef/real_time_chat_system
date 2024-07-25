export function generateOTP() {

const code = Math.floor(100000 + Math.random() * 900000).toString().substring(0, 6);

 const otpExpiresIn = new Date(Date.now() + 6 * 60 * 1000);

 return {code, otpExpiresIn};
}
