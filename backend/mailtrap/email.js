import { VERIFICATION_EMAIL_TEMPLATE } from "./EmailTemplate.js"
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