
import nodeMailer from 'nodemailer';

const sendEmail = async(options)=>{    
  const transporter = nodeMailer.createTransport({   
    service:"gmail",
    auth:{
        user:"jyotisolankics29@gmail.com",
        pass:"upztcqcyklbtskyg"
    }
  });
  const mailOptions = {
     from:"jyotisolankics29@gmail.com",
     to:options.email,
     subject:options.subject,
     text:options.message
  };
  await transporter.sendMail(mailOptions);
 };
export default sendEmail;