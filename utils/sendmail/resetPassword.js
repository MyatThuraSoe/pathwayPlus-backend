var ejs = require("ejs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLEINT_SECRET = process.env.CLEINT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

exports.sendResetCode = (reciveremail, code) => {
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  async function sendMail() {
    try {
      const accessToken = await oAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "pathway@gmail.com",
          clientId: CLIENT_ID,
          clientSecret: CLEINT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
      let htmlstr;
      ejs.renderFile(
        "./views" + "/resetPassword.ejs",
        {
          email: reciveremail,
          code: code,
        },
        function (err, str) {
          htmlstr = str;
        }
      );
      const mailOptions = {
        from: '"Pathway Plus" pathway@gmail.com',
        to: reciveremail,
        subject: "6-digits code to reset password",
        html: htmlstr,
      };

      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }

  sendMail().catch((error) => console.log(error.message));
};
