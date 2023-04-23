import nodemailer from "nodemailer";

export const sendConfirmationEmail = (toUser: any, type: string) => {
  // Return promise in order to use async/await or "then"
  return new Promise((res, rej) => {
    // Create transporter object with gmail service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      // provide your gmail email: e.g -> test@gmail.com
      // provide your gmail password
      // you can create .env file for this, see the instructions below
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASSWORD,
      },
    });

    // Create a message you want to send to a user
    const message = {
      from: process.env.GOOGLE_USER,
      // to: toUser.email // in production uncomment this
      // While we are testing we want to send a message to our selfs
      to: process.env.GOOGLE_USER,
      subject: "Bonnie Flair - Activate Your Account",
      html:
        type === "confirmation"
          ? `
          <h3> Hello ${toUser?.firstName} </h3>
          <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
          <p>To activate your account please follow this link: <a target="_" href="${process.env.DOMAIN}/api/accounts/activate?email=${toUser?.email}">${process.env.DOMAIN}/activate </a></p>
          <p>Cheers</p>
          <p>Your Application Team</p>
        `
          : ` <h3> Hello ${toUser?.firstName} </h3>
        <p>Your account has successfully been activated</p>
        <p>To login your account please follow this link: <a target="_" href="${process.env.DOMAIN}/login">Login Here </a></p>
        <p>Cheers</p>              
        <p>Your Application Team</p>`,
    };

    // send an email
    transporter.sendMail(message, function (err, info) {
      if (err) {
        rej(err);
      } else {
        res(info);
      }
    });
  });
};
