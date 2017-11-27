# Load the Rails application.
require File.expand_path('../application', __FILE__)

ActionMailer::Base.smtp_settings = {
  address: 'email-smtp.us-east-1.amazonaws.com',
  port: '587',
  authentication: :login,
  user_name: ENV["SES_SMTP_USERNAME"],
  password: ENV["SES_SMTP_PASSWORD"],
  enable_starttls_auto: true
}

# Initialize the Rails application.
Rails.application.initialize!
