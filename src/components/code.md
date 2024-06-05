##############frontend

import React, { useState, useEffect } from "react";
import SBILogo from "../utils/image/sbi.jpg";
import YonoSBILogo from "../utils/image/SBI_YONO_Logo.svg";
import RofabsLogo from "../utils/image/ROFABS.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOTP] = useState("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(60);
  const [token, setToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isOTPSent && otpResendTimer > 0) {
      timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [isOTPSent, otpResendTimer]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      const { exp, uid } = JSON.parse(atob(savedToken.split(".")[1]));
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("token");
        setToken(null);
        setUid(null);
        navigate("/login");
      } else {
        setToken(savedToken);
        setUid(uid);
      }
    }
  }, [navigate]);

  const sendOTP = async () => {
    if (isPhoneNumberValid) {
      try {
        const response = await axios.get(
          `https://rofabsbanking-backend.onrender.com/api/v1/auth/sendOtp?phoneNumber=${phoneNumber}`
        );
        console.log(response.data); // Handle the response data as needed
        setIsOTPSent(true);
        setOtpResendTimer(60);
        setErrorMessage(""); // Clear any previous error message
      } catch (error) {
        console.error(error); // Handle errors
        setErrorMessage("Failed to send OTP. Please try again.");
      }
    }
  };

  const verifyOTP = async () => {
    if (otp.length === 6) {
      try {
        const response = await axios.post(
          `https://rofabsbanking-backend.onrender.com/api/v1/auth/verifyOtp?phoneNumber=${phoneNumber}&otp=${otp}`
        );
        const { token, uid } = response.data;
        localStorage.setItem("token", token);
        setToken(token);
        setUid(uid);
        setErrorMessage("");
        navigate("/dashboard");
      } catch (error) {
        console.error("OTP verification failed", error);
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } else {
      setErrorMessage("Please enter a valid 6-digit OTP.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOTPSent) {
      verifyOTP();
    } else {
      sendOTP();
    }
  };

  const handlePhoneNumberChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    const isValid = /^[0-9]{10}$/.test(inputValue);
    setIsPhoneNumberValid(isValid);
    setPhoneNumber(inputValue);
  };

  if (token && uid) {
    navigate("/dashboard");
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-pink-600">
      <div className="rounded-2xl flex flex-col lg:flex-row h-auto lg:h-[95vh] w-[90vw] bg-white">
        {/* Left Side */}
        <div className="relative object-cover overflow-hidden rounded-2xl h-[30vh] lg:h-full w-full lg:w-[45vw]">
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <h5 className="absolute text-4xl font-semibold text-white left-[14%] mt-4 z-10 top-1">
              ROFABS BANKING
            </h5>
            <img
              className="w-[50%] lg:w-[18vw]"
              src={RofabsLogo}
              alt="ROFABS Logo"
            />
          </div>
          <img
            className="absolute inset-0 h-full w-full object-fill"
            src={SBILogo}
            alt="Banking Image"
          />
        </div>

        {/* Right Side */}
        <div className="h-full p-6 flex flex-col items-center lg:items-center">
          <img
            className="w-[50%] lg:w-[18vw] mt-4 lg:mt-0"
            src={YonoSBILogo}
            alt="YONO Logo"
          />
          <div className="w-full items-center justify-center mt-5 flex flex-col lg:text-center">
            <p className="text-[#280071] text-xl lg:text-2xl font-bold">
              Please enter your 10-digit mobile number
            </p>
          </div>

          <div className="w-full flex flex-col items-center lg:items-start">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full items-center lg:items-start"
            >
              <div className="w-full relative mt-2 lg:mt-0">
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className={`outline-none w-full mb-5 lg:w-[45vw] border-b-2 font-display focus:outline-none transition-all duration-500 capitalize text-3xl ${
                    isPhoneNumberValid
                      ? "focus:border-primarycolor"
                      : "focus:border-red-500"
                  }`}
                />
                {!isPhoneNumberValid && phoneNumber.length > 0 && (
                  <p className="text-red-500 text-sm">
                    Please enter a valid 10-digit mobile number
                  </p>
                )}
              </div>

              {isOTPSent && (
                <div className="relative mt-8 w-full">
                  <input
                    type="text"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    className="outline-none mb-5 w-full lg:w-[45vw] border-b-2 font-display focus:outline-none focus:border-primarycolor transition-all duration-500 capitalize text-3xl"
                  />
                  {otpResendTimer > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend OTP in {otpResendTimer} seconds
                    </p>
                  ) : (
                    <button
                      className="text-sm text-blue-500 underline"
                      onClick={sendOTP}
                      disabled={otpResendTimer > 0}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}

              <button
                className={`text-xl text-[#0095DA] hover:text-[#D5EEF9] rounded-md px-[3vw] bg-[#E5F6FD] hover:bg-[#0095DA] py-2 border-2 border-blue-300 mt-4 ${
                  !isPhoneNumberValid || (isOTPSent && otpResendTimer > 0)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                type="submit"
                disabled={
                  !isPhoneNumberValid || (isOTPSent && otpResendTimer > 0)
                }
              >
                {isOTPSent ? "Verify OTP" : "Send OTP"}
              </button>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

*********************************************************************************
import React from 'react'
import Login from './components/Login'

const App = () => {
  return (
    <div>
      <Login />
    </div>
  )
}

export default App

*********************************************************************************

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
 
    <App />
  ,
)

*********************************************************************************

################backend#####################

// src/controllers/adminController.js
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const { generateUID } = require('../helpers/utilsHelper');

exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({ status: 'failure', message: 'Name is required' });
        }
        if (!email) {
            return res.status(400).json({ status: 'failure', message: 'Email is required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: 'failure', message: 'Invalid email format' });
        }
        if (!phoneNumber) {
            return res.status(400).json({ status: 'failure', message: 'Phone number is required' });
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ status: 'failure', message: 'Phone number must be 10 digits' });
        }
        if (!password) {
            return res.status(400).json({ status: 'failure', message: 'Password is required' });
        }

        // Check if the user exists
        const checkAdmin = await Admin.findOne({ phoneNumber: `+91${phoneNumber}` });
        if (checkAdmin) {
            return res.status(400).json({ status: 'failure', message: 'Admin already exists' });
        }

        const uid = await generateUID();
        const admin = new Admin({
            uid: uid,
            name: name,
            email: email,
            phoneNumber: `91${phoneNumber}`,
            password: password,
        });
        await admin.save();
        res.status(201).json({ status: 'success', uid: uid, message: 'Admin registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failure', message: 'Internal Server Error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({ status: 'failure', message: 'Name is required' });
        }
        if (!email) {
            return res.status(400).json({ status: 'failure', message: 'Email is required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: 'failure', message: 'Invalid email format' });
        }
        if (!phoneNumber) {
            return res.status(400).json({ status: 'failure', message: 'Phone number is required' });
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ status: 'failure', message: 'Phone number must be 10 digits' });
        }
        if (!password) {
            return res.status(400).json({ status: 'failure', message: 'Password is required' });
        }

        // Check if the user exists
        const checkUser = await User.findOne({ phoneNumber: `+91${phoneNumber}` });
        if (checkUser) {
            return res.status(400).json({ status: 'failure', message: 'User already exists' });
        }

        const uid = await generateUID();
        const user = new User({
            uid: uid,
            name: name,
            email: email,
            phoneNumber: `91${phoneNumber}`,
            password: password,
        });
        await user.save();
        res.status(201).json({ status: 'success', uid: uid, message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failure', message: 'Internal Server Error' });
    }
};

***********************************************************************************

// src/controllers/otpSending.js
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const { generateOtp, sendOtp, verifyOtp, generateAdminToken, } = require('../helpers/utilsHelper');

exports.sendOtp = async (req, res) => {
    try {
        let { phoneNumber } = req.query;

        if (!phoneNumber || phoneNumber.length !== 10) {
            return res.status(400).json({ Error: 'Invalid phone number' });
        }

        const formattedPhoneNumber = `91${phoneNumber}`;

        // Check if the user exists
        const user = await User.findOne({ phoneNumber: formattedPhoneNumber });

        if (!user) {
            const admin = await Admin.findOne({ phoneNumber: formattedPhoneNumber });
            if (!admin) {
                return res.status(404).json({ Error: 'User not found' });
            }
        }

        // Generate and send OTP
        const otp = generateOtp();
        const result = await sendOtp(formattedPhoneNumber, otp);

        res.json({ MessageID: result.MessageID, OTP: result.OTP });
    } catch (err) {
        console.error(err);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};


exports.verifyOtp = async (req, res) => {
    try {
        let { phoneNumber, otp } = req.query;

        if (!phoneNumber || phoneNumber.length !== 10) {
            return res.status(400).json({ Error: 'Invalid phone number' });
        }

        const formattedPhoneNumber = `91${phoneNumber}`;

        if (!otp) {
            return res.status(400).json({ Error: 'OTP is required' });
        }
        if (otp.length !== 6) {
            return res.status(400).json({ Error: 'Invalid OTP' });
        }

        // Verify OTP
        const isValid = await verifyOtp(formattedPhoneNumber, otp);

        if (isValid) {
            //Get UID of User or Admin
            const user = await User.findOne({ phoneNumber: formattedPhoneNumber }) || await Admin.findOne({ phoneNumber: formattedPhoneNumber });
            if (!user) {
                const Admin = await Admin.findOne({ phoneNumber: formattedPhoneNumber });
                if (!Admin) {
                    return res.status(404).json({ Error: 'User not found' });
                }
            }
            const token = generateAdminToken(user);

            res.json({ Message: 'OTP verified successfully', Token: token });

        } else {
            res.status(400).json({ Error: 'Invalid OTP or OTP not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
};

*********************************************************************************

//src/database/databaseConfig.js
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;

***********************************************************************************

// src/helpers/utilsHelper.js


/*OLD Import const AWS = require('aws-sdk'); */

const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const OTPModel = require('../models/otpModel');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


async function sendOtp(phoneNumber, otp) {
    try {
        const subject = "OTP";

        const params = {
            Message: `\n Your OTP For Logging in to SBI-CINB is ${otp}`,
            PhoneNumber: `+${phoneNumber}`,
            MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                    DataType: 'String',
                    StringValue: subject,
                },
            },
        };

        const snsClient = new SNSClient();
        const publishCommand = new PublishCommand(params);
        const data = await snsClient.send(publishCommand);

        // Upsert the OTP in the database (update if exists, insert if not)
        await OTPModel.findOneAndUpdate(
            { phoneNumber },
            { otp, phoneNumber },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return { MessageID: data.MessageId, OTP: otp };
    } catch (err) {
        throw err;
    }
}


/* 
#OLD FUNCTION IS BELOW TO SEND OTP
*/
/* async function sendOtp(phoneNumber, otp) {
    try {
        const subject = "OTP";

        const params = {
            Message: `\n Your OTP For Logging in to SBI-CINB is ${otp}`,
            PhoneNumber: `+${phoneNumber}`,
            MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                    DataType: 'String',
                    StringValue: subject,
                },
            },
        };

        const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
        const data = await publishTextPromise;

        // Upsert the OTP in the database (update if exists, insert if not)
        await OTPModel.findOneAndUpdate(
            { phoneNumber },
            { otp, phoneNumber },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return { MessageID: data.MessageId, OTP: otp };
    } catch (err) {
        throw err;
    }
}
 */

async function verifyOtp(phoneNumber, otp) {
    try {
        const otpModel = await OTPModel.findOne({ phoneNumber });
        if (!otpModel) {
            return false; // OTP not found
        }
        if (otpModel.otp !== otp) {
            return false; // Invalid OTP
        }
        return true; // OTP is valid
    } catch (err) {
        throw err; // Propagate the error to be handled by the caller
    }
}

async function generateUID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = '';
    for (let i = 0; i < 10; i++) {
        uid += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    try {
        const user = await User.findOne({ uid: uid });
        if (user) {
            return generateUID();
        }
        const admin = await Admin.findOne({ uid: uid });
        if (admin) {
            return generateUID();
        }
        return uid;
    } catch (err) {
        throw err;
    }
}
function generateAdminToken(user) {
    const token = jwt.sign(
        { uid: user.uid },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: process.env.JWT_SECRET_TOKEN_EXPIRY }
    );
    return token;
}

function verifyAdminToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid token format' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.error('Token expired:', err);
                return res.status(401).json({ message: 'Token expired' });
            } else if (err.name === 'JsonWebTokenError') {
                console.error('Invalid token:', err);
                return res.status(401).json({ message: 'Invalid token' });
            } else {
                console.error('Token verification error:', err);
                return res.status(401).json({ message: 'Invalid token' });
            }
        }

        req.userId = decoded.uid;
        req.userRole = decoded.role;
        next();
    });
}



module.exports = {
    generateOtp,
    sendOtp,
    generateUID,
    verifyOtp,
    generateAdminToken,
    verifyAdminToken,
};

**********************************************************************************

// src/models/adminModel.js

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Admin', adminSchema);

************************************************************************

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // 5 minutes
    },
});

module.exports = mongoose.model('OTP', otpSchema);

*********************************************************************************

// src/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    designation: {
        type: String,
        enum: ['Director', 'CEO', 'CFO', 'Auditor', 'Accountant'],
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date, default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

**********************************************************************************

// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdminToken } = require('../helpers/utilsHelper');

router.post('/registerAdmin', adminController.registerAdmin);
router.post('/createUser', verifyAdminToken, adminController.createUser);


module.exports = router;

*********************************************************************************

// src/routes/loginRoutes.js
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/sendOtp', loginController.sendOtp);
router.post('/verifyOtp', loginController.verifyOtp);

module.exports = router;

**********************************************************************************

// Server.js

const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');

//Login Routes
const loginRoutes = require('./src/routes/loginRoutes');

//Admin Routes
const adminRoutes = require('./src/routes/adminRoutes');

const dotenv = require('dotenv');
const connectDB = require('./src/database/databaseConfig');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

app.use('/api/v1/auth', loginRoutes);
app.use('/api/v1/admin', adminRoutes);

// New route for testing
app.post('/api/v1/test', (req, res) => {
    const { message } = req.body;
    console.log('Received message:', message);
    res.status(200).json({ status: 'success', data: { message } });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});