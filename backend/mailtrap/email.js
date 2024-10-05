import { response } from "express";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./EmailTemplate.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async(email, verificationToken) => {
    const recipient = [
        {
          email: "digpalsingh9240@gmail.com",
        }
      ];
    try {
        const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification",
		});

        console.log("Email sent successfully", response);
        
    } catch (error) {
        console.error("Error sending email", error);
        throw new Error(`Error sending email: ${error}`);
    }
}

export const sendWelcomeEmail = async(email, name) => {
    const recipient = [
        {
          email: "digpalsingh9240@gmail.com",
        }
      ];

    try {
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "bb1a42f9-7684-4152-9d40-d2911d6e9483",
            template_variables:{
                "company_info_name": "Authentication App",
                "name": name,
            },
        });
        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.log("Error sending welcome email", error);

        throw new Error(`Error sending welcome email: ${error}`);
    }
} 

export const sendPasswordResetEmail = async(email, resetURL) => {
    const recipient = [
        {
          email: "digpalsingh9240@gmail.com",
        }
    ];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
           subject: "Reset your password",
           html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
           category: "Password Reset",
        })
    } catch (error) {
        console.log("Error sending password reset email", error);
        throw new Error(`Error sending password reset email: ${error}`);
    }
}

export const sendPasswordResetSuccessEmail = async(email) => {
    const recipient = [
        {
          email: "digpalsingh9240@gmail.com",
        }
    ];

    try {
    const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Password reset successfull",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        category: "Password Reset",
    });
    } catch (error) {
        console.log("Error sending password reset success email", error);
        throw new Error(`Error sending password reset success email: ${error}`);
    }

}