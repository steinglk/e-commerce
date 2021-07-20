const nodemailer = require('nodemailer');

const transportador = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    auth: {
        user: "postmaster@sandbox551b4f828ae94cdda40d5f146031260a.mailgun.org",
        pass: "d03d0822b1c33e21f5ce00f432dc6063-c485922e-1a10eba8"
    }
});

module.exports = transportador;