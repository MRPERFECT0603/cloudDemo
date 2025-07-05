const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

const sns = new AWS.SNS();

exports.publishLoginNotification = async (user) => {
  const params = {
    Message: `Hi ${user.username}, you just logged in at ${new Date().toISOString()}`,
    Subject: 'Login Alert',
    // For Email via Topic:
    TopicArn: process.env.SNS_TOPIC_ARN,
    
    // For SMS directly:
    // PhoneNumber: user.phone,
  };

  return sns.publish(params).promise();
};