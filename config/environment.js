const fs= require('fs');
const rfs= require('rotating-file-stream');
const path= require('path');

const logDirectory= path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream= rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});


const development = {
    name: 'development',
    asset_path: './assests',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'metaverse.projectmanagement@gmail.com',
            pass: 'rqstgjjvfkrcjfwj'
        }
    },
    google_client_id: "302831689996-vt97p2957ffd0k6d9jua9m32bh64f3nh.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production =  {
    name: 'production',
    asset_path: process.env.ASSET_PATH,
    session_cookie_key: process.env.SESSION_COOKIE_KEY,
    db:  process.env.DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}



module.exports = eval(process.env.ENVIRONMENT) == undefined ? development : eval(process.env.ENVIRONMENT);