const Queue = require('bee-queue');
const sgMail = require('@sendgrid/mail');
const adminEmail = process.env.ADMIN_EMAIL;

module.exports = function({ from = adminEmail, to, subject, body }) {
  const queue = new Queue('sendMailQueue');
  const mailData = {from: from, to: to, subject: subject, body: body };
  const job = queue.createJob(mailData)
  job.save();
  job.on('succeeded', (result) => {
    console.log(`Received result for job ${job.id}: ${result}`);
  });

  queue.process(function (job, done) {
    console.log(`Processing job ${job.id}`);
    msg = {
      to: to,
      from: from,
      subject: subject,
      html: body
    };
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log(msg);
    sgMail
      .send(msg)
      .then(() => {}, error => {
        console.error(error);
        if (error.response) {
          console.error(error.response.body)
        }
      });
    return done(null, job.data.to);
  });
};

