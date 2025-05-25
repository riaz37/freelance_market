import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      requireTLS: true,
    });
  }

  async sendVerificationEmail(email: string, firstName: string, verificationCode: string) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject: 'Verify Your Email - FreelanceMarket',
      html: this.getVerificationEmailTemplate(firstName, verificationCode),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject: 'Welcome to FreelanceMarket!',
      html: this.getWelcomeEmailTemplate(firstName),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  async sendPasswordResetEmail(email: string, firstName: string, resetCode: string) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject: 'Reset Your Password - FreelanceMarket',
      html: this.getPasswordResetEmailTemplate(firstName, resetCode),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  private getVerificationEmailTemplate(firstName: string, verificationCode: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .verification-code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 FreelanceMarket</h1>
            <p>Verify Your Email Address</p>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Welcome to FreelanceMarket! To complete your registration and start connecting with amazing freelancers and clients, please verify your email address.</p>

            <div class="verification-code">
              <p><strong>Your Verification Code:</strong></p>
              <div class="code">${verificationCode}</div>
              <p><small>This code expires in 15 minutes</small></p>
            </div>

            <p>Enter this code in the verification form to activate your account.</p>

            <p>If you didn't create an account with FreelanceMarket, please ignore this email.</p>

            <div class="footer">
              <p>© 2024 FreelanceMarket. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to FreelanceMarket</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to FreelanceMarket!</h1>
            <p>Your account has been verified successfully</p>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Congratulations! Your email has been verified and your FreelanceMarket account is now active.</p>

            <div class="feature">
              <h3>🔍 Discover Opportunities</h3>
              <p>Browse thousands of projects and find the perfect match for your skills.</p>
            </div>

            <div class="feature">
              <h3>💼 Build Your Profile</h3>
              <p>Create a compelling profile to showcase your expertise and attract clients.</p>
            </div>

            <div class="feature">
              <h3>💰 Secure Payments</h3>
              <p>Get paid safely and securely for your work through our platform.</p>
            </div>

            <p>Ready to get started? Log in to your account and explore what FreelanceMarket has to offer!</p>

            <div class="footer">
              <p>© 2024 FreelanceMarket. All rights reserved.</p>
              <p>Need help? Contact our support team anytime.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPasswordResetEmailTemplate(firstName: string, resetCode: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .reset-code { background: #fff; border: 2px dashed #dc3545; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .code { font-size: 32px; font-weight: bold; color: #dc3545; letter-spacing: 5px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 FreelanceMarket</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>We received a request to reset your password for your FreelanceMarket account.</p>

            <div class="reset-code">
              <p><strong>Your Reset Code:</strong></p>
              <div class="code">${resetCode}</div>
              <p><small>This code expires in 15 minutes</small></p>
            </div>

            <div class="warning">
              <p><strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
            </div>

            <p>Enter this code in the password reset form to create a new password.</p>

            <div class="footer">
              <p>© 2024 FreelanceMarket. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
