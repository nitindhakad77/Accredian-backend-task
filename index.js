const express = require('express');
const cors = require('cors')
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const { render } = require('@react-email/render');
const { MailerSend, EmailParams } = require('mailersend');
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
});
const ReferralEmail = require('./emails/ReferralEmail.jsx').default;

const app = express();
app.use(cors());
const prisma = new PrismaClient();

app.use(bodyParser.json());
const mailerSend = new MailerSend({
  apiKey: 'process.env.MAILERSEND_API_KEY',
});
const sendReferralEmail = async (referrer, referee, email) => {
  const emailContent = render(ReferralEmail, (referrer={referrer},referee={referee}));
  const emailParams = new EmailParams()
    .setFrom('nitindhakad77@gmail.com')
    .setTo([email])
    .setSubject('Thank you for the referral!')
    .setHtml(emailContent);

  await mailerSend.email.send(emailParams);
};


app.post('/api/referrals', async (req, res) => {
    const { referrer, referee, email } = req.body;
  
    console.log('Received data:', { referrer, referee, email}); // Log received data
  
    try {
      const referral = await prisma.referral.create({
        data: {
          referrer,
          referee,
          email,
          
        },
      });
      console.log('Referral created:', referral);
      await sendReferralEmail(referrer, referee, email); 
      res.status(201).json(referral);
    } catch (error) {
      console.error('Error creating referral:', error);
      res.status(500).json({ error: 'An error occurred while creating the referral.' });
    }
  });

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
