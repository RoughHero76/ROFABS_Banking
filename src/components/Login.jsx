import React, { useState } from "react";
import SBILogo from '../utils/image/sbi.jpg';
import YonoSBILogo from '../utils/image/SBI_YONO_Logo.svg';
import RofabsLogo from '../utils/image/ROFABS.png';
import axios from 'axios';

function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [showOTPField, setShowOTPField] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const sendOTP = async () => {
    if (phoneNumber.trim() === '') {
      setMessage('Please enter a phone number');
      return;
    }

    try {
      setSendOtpLoading(true);
      const response = await axios.get(`https://rofabsbanking-backend.onrender.com/api/v1/auth/sendOtp?phoneNumber=${phoneNumber}`);
      setMessage(response.data.message);
      setShowOTPField(true);
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while sending the OTP');
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.trim() === '') {
      setMessage('Please enter the OTP');
      return;
    }

    try {
      console.log('URL: ', `https://rofabsbanking-backend.onrender.com/api/v1/auth/verifyOtp?phoneNumber=${phoneNumber}&otp=${otp}`);
      setVerifyOtpLoading(true);
      const response = await axios.post(`https://rofabsbanking-backend.onrender.com/api/v1/auth/verifyOtp?phoneNumber=${phoneNumber}&otp=${otp}`);
      setMessage(response.data.Message);
      setToken(response.data.Token);
      localStorage.setItem('token', response.data.Token);

      console.log(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while verifying the OTP');
    } finally {
      setVerifyOtpLoading(false);
    }
  };

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
              Please enter your phone number and OTP
            </p>
          </div>

          <div className="w-full flex flex-col items-center lg:items-start">
            <form onSubmit={handleSubmit} className="flex flex-col w-full items-center lg:items-start">
              <div className="w-full relative mt-2 lg:mt-0">
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="outline-none w-full mb-5 lg:w-[45vw] border-b-2 font-display focus:outline-none focus:border-primarycolor transition-all duration-500 capitalize text-3xl"
                  disabled={otpSent}
                />

                <button
                  className="text-xl text-[#0095DA] hover:text-[#D5EEF9] rounded-md px-[3vw] bg-[#E5F6FD] hover:bg-[#0095DA] py-2 border-2 border-blue-300 mt-4"
                  type="button"
                  onClick={sendOTP}
                  disabled={otpSent}
                >
                  {sendOtpLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
              {showOTPField && (
                <div className="relative mt-8 w-full">
                  <input
                    type="text"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    className="outline-none mb-5 w-full lg:w-[45vw] border-b-2 font-display focus:outline-none focus:border-primarycolor transition-all duration-500 capitalize text-3xl"
                  />

                  <button
                    className="text-xl text-[#0095DA] hover:text-[#D5EEF9] rounded-md px-[3vw] bg-[#E5F6FD] hover:bg-[#0095DA] py-2 border-2 border-blue-300 mt-4"
                    type="submit"
                    disabled={verifyOtpLoading}
                  >
                    {verifyOtpLoading ? 'Verifying OTP...' : 'Verify OTP'}
                  </button>
                </div>
              )}
              {message && (
                <p className="text-center text-green-500 mt-4">{message}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;