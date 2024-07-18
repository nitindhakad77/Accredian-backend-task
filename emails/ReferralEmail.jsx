// emails/ReferralEmail.jsx
import React from 'react';

const ReferralEmail = ({ referrer, referee }) => (
  <div>
    <h1>Thank you for the referral!</h1>
    <p>{referrer} has referred {referee}.</p>
  </div>
);

export default ReferralEmail;
