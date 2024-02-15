const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sakshisharma@amplework.com',
        pass: 'ixua eklz bexa qkvj'
    }
});

const sendEmail = async(recieptsEmail, username) => {
    try{
        const info = await transporter.sendMail({
            from: 'sakshisharma@amplework.com',
            to: recieptsEmail,
            subject: 'test email',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                /* Your CSS styles here */
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <img class="logo" src="C:\Users\dell\Downloads\instalogo.jpg" alt="Instagram Logo">
                  <h1>Welcome to InstaClone!</h1>
                </div>
                <div class="content">
                  <p>Hi ${username},</p>
                  <p>Thank you for joining InstaClone! We're excited to have you as part of our community.</p>
                  <p>Start sharing your moments, connect with friends, and explore the amazing content on InstaClone.</p>
                  <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                  <p>Happy sharing!</p>
                </div>
              </div>
            </body>
            </html>
        `
        });

        console.log('Email send.')
    }catch(error){
        console.log(error);
    }
}

const sendResetPassEmail = async(recieptsEmail, name, otp, expiresAt) => {
    try{
        const info = await transporter.sendMail({
            from: 'sakshisharma@amplework.com',
            to: recieptsEmail,
            subject: 'test email',
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
            
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
            
                    .header {
                        text-align: center;
                    }
            
                    .logo {
                        max-width: 100px;
                        height: auto;
                    }
            
                    .content {
                        margin-top: 20px;
                        line-height: 1.6;
                    }
            
                    .otp {
                        font-size: 24px;
                        font-weight: bold;
                        color: #007bff; /* Customize the color */
                    }
            
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        color: #888;
                    }
                </style>
            </head>
            
            <body>
            
                <div class="container">
                    <div class="header">
                        <img class="logo" src="https://example.com/logo.png" alt="InstaClone">
                        <h1>Password Reset</h1>
                    </div>
            
                    <div class="content">
                        <p>Hello ${name},</p>
                        <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
                        <p>Your one-time password (OTP) is: <span class="otp">${otp}</span></p>
                        <p>This OTP is valid for ${expiresAt}.</p>
                        <p>If you have any questions or concerns, please contact our support team.</p>
                        <p>Thank you,</p>
                        <p>InstaClone Name</p>
                    </div>
            
                    <div class="footer">
                        &copy; 2023 InstaClone. All rights reserved.
                    </div>
                </div>
            
            </body>
            
            </html>
            `

        });
    }catch(error){
        console.log(error);
    }
}

module.exports = {sendEmail, sendResetPassEmail};