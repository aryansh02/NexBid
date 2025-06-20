"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendProjectCompletedEmail = exports.sendBidAcceptedEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Email transporter configuration
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};
// Email templates
const bidAcceptedTemplate = (buyerName, sellerName, projectTitle, bidAmount, frontendUrl, projectId) => {
    return {
        subject: `🎉 Your bid has been accepted for "${projectTitle}"`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Congratulations! Your bid has been accepted</h2>
        
        <p>Hi ${sellerName},</p>
        
        <p>Great news! ${buyerName} has accepted your bid for the project "<strong>${projectTitle}</strong>".</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Project Details:</h3>
          <p><strong>Project:</strong> ${projectTitle}</p>
          <p><strong>Accepted Bid:</strong> $${bidAmount}</p>
          <p><strong>Status:</strong> In Progress</p>
        </div>
        
        <p>You can now start working on this project. Please log in to your dashboard to view the full project details and communicate with the buyer.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${frontendUrl}/project/${projectId}" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Project Details
          </a>
        </div>
        
        <p>Best regards,<br>The NexBid Team</p>
      </div>
    `,
    };
};
const projectCompletedTemplate = (buyerName, sellerName, projectTitle, deliverableUrl, frontendUrl, projectId) => {
    return {
        subject: `✅ Project "${projectTitle}" has been completed`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Project Completed Successfully!</h2>
        
        <p>Hi ${buyerName},</p>
        
        <p>${sellerName} has marked the project "<strong>${projectTitle}</strong>" as completed and uploaded the deliverable.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Project Summary:</h3>
          <p><strong>Project:</strong> ${projectTitle}</p>
          <p><strong>Seller:</strong> ${sellerName}</p>
          <p><strong>Status:</strong> Completed</p>
          <p><strong>Deliverable:</strong> <a href="${deliverableUrl}" target="_blank">Download File</a></p>
        </div>
        
        <p>Please review the deliverable and consider leaving a review for the seller to help other buyers make informed decisions.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${frontendUrl}/project/${projectId}" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Project & Leave Review
          </a>
        </div>
        
        <p>Thank you for using NexBid!</p>
        
        <p>Best regards,<br>The NexBid Team</p>
      </div>
    `,
    };
};
// Email service functions
const sendBidAcceptedEmail = async (seller, buyer, project, bid) => {
    try {
        const transporter = createTransporter();
        const template = bidAcceptedTemplate(buyer.name, seller.name, project.title, bid.amount, process.env.FRONTEND_URL || 'http://localhost:3000', project.id);
        await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: seller.email,
            subject: template.subject,
            html: template.html,
        });
        console.log(`✅ Bid accepted email sent to ${seller.email}`);
    }
    catch (error) {
        console.error('❌ Failed to send bid accepted email:', error);
        throw error;
    }
};
exports.sendBidAcceptedEmail = sendBidAcceptedEmail;
const sendProjectCompletedEmail = async (buyer, seller, project) => {
    try {
        const transporter = createTransporter();
        const deliverableUrl = `${process.env.FRONTEND_URL}/uploads/${project.deliverable}`;
        const template = projectCompletedTemplate(buyer.name, seller.name, project.title, deliverableUrl, process.env.FRONTEND_URL || 'http://localhost:3000', project.id);
        await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: buyer.email,
            subject: template.subject,
            html: template.html,
        });
        console.log(`✅ Project completed email sent to ${buyer.email}`);
    }
    catch (error) {
        console.error('❌ Failed to send project completed email:', error);
        throw error;
    }
};
exports.sendProjectCompletedEmail = sendProjectCompletedEmail;
//# sourceMappingURL=mailer.js.map