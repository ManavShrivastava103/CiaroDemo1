const OTP = require("../models/otpModel");
const nodemailer = require("nodemailer");

// Function to create OTP 
const OTP_Generator = () => {
    const otp_length = 6;
    const min = Math.pow(10, otp_length - 1);
    const max = Math.pow(10, otp_length) - 1;
    return Math.floor( min + Math.random() * (max - min + 1)).toString();
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_KA_USERNAME,
        pass: process.env.EMAIL_KA_PASSWORD
    }
});

// Function to send OTP to mail and also store it into the OTP collection
const send_otp_email = async (uemail, otp_purpose) => {
    try {
        const otp_to_send = OTP_Generator();
        const mail_options = {
            from: process.env.EMAIL_USER,
            to : uemail,
            subject : "CIARO-DEMO-PRACTICE OTP VERIFICATION",
            text : "Your OTP for verification of "+otp_purpose+" request is "+otp_to_send+". \nThe OTP will expire automatically in 5 minutes.\nDo not share it at any un-authenticated platform."

        };

        const email_result = await transporter.sendMail(mail_options);
        if (email_result.accepted.length > 0) {

            await OTP.deleteMany({email : uemail, purpose : otp_purpose});

            const create_otp_entry = await OTP.create({
                email : uemail,
                otp : otp_to_send,
                purpose : otp_purpose,
                attempts: 0,
                expires_at: new Date(Date.now() + 5 * 60 * 1000)
            });

            if(!create_otp_entry){
                throw new Error("Failed to create OTP entry");
            }

            return {
                success : true,
                message : "OTP Sent Successfully!!!"
            };
        }

        else{
            throw new Error("Email was not accepted");
        }

    } catch (err) {
        throw new Error(`Email sending failed : ${err.message}`);
    }
};


// OTP checker function 
 const check_otp = async(entered_otp, uemail, the_purpose) => {
    try {

        const otp_entry = await OTP.findOne({purpose:the_purpose, email:uemail});

        if(!otp_entry) {
            return {
                success : false,
                message : "OTP not found. Verification Failed!!!"
            };
        }

        if(otp_entry.expires_at.getTime() < Date.now()) {
            return {
                success : false,
                message : "OTP Expired. Verification Failed!!!"
            };
        }

        if(otp_entry.attempts >= 5) {
            return {
                success : false,
                message : "Maximum OTP attempts exceeded!!!"
            };
        }

        if(otp_entry.otp === entered_otp && otp_entry.expires_at.getTime() > Date.now() && otp_entry.attempts < 5) {

            await OTP.findOneAndDelete({_id : otp_entry._id});
            
            return {
                success : true,
                message : "OTP Verified!!!"
            };
        }

        if(otp_entry.otp !== entered_otp && otp_entry.expires_at.getTime() > Date.now() && otp_entry.attempts < 5) {
            await OTP.findOneAndUpdate({_id : otp_entry._id}, {$inc:{attempts:1}});
            return {
                success : false,
                message : "Wrong OTP. Verification Failed!!!"
            };
        }

    } catch(err) {
        throw new Error(`OTP Verification Failed : ${err.message}`);
    }
};


module.exports = {send_otp_email, check_otp};