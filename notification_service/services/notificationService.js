const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');

class NotificationService {

  async sendSyncNotification(notification) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: notification.recipients.join(','),
        subject: notification.message.subject,
        text: notification.message.body,
      };

      const info = await transporter.sendMail(mailOptions);
      notification.state = 'sent';
      notification.sentAt = new Date();

      await notification.save();
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      notification.state = 'failed';
      await notification.save();
      throw error;
    }
  }

  async sendAsyncNotification(notification) {
    setTimeout(async () => {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: notification.recipients.join(','),
          subject: notification.message.subject,
          text: notification.message.body,
        };

        await transporter.sendMail(mailOptions);
        notification.state = 'sent';
        notification.sentAt = new Date();

        await notification.save();
      } catch (error) {
        console.error('Error sending email:', error);
        notification.state = 'failed';
        await notification.save();
      }
    }, 0);
  }

}

module.exports = new NotificationService();
