import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import SBILogo from "../utils/image/sbi.jpg";
import YonoSBILogo from "../utils/image/SBI_YONO_Logo.svg";
import RofabsLogo from "../assets/Images/dimg.png";
import RofabsLogo2 from "../assets/Images/mapp.png";
import axios from "axios";
import { API_URL } from "../../secrets";
import { ClipLoader } from "react-spinners";

function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOTP] = useState("");
  const [showOTPField, setShowOTPField] = useState(false);
  const [message, setMessage] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [canResendOTP, setCanResendOTP] = useState(false);

  useEffect(() => {
    const emailToken = localStorage.getItem("emailLogin");
    const phoneToken = localStorage.getItem("token");
    const storedPhoneNumber = localStorage.getItem("userPhoneNumber");

    if (emailToken && phoneToken) {
      navigate("/dashboard");
    } else if (!emailToken) {
      navigate("/");
    } else if (storedPhoneNumber) {
      try {
        const formattedPhone = storedPhoneNumber.replace(/^91/, '');
        setPhoneNumber(formattedPhone);
        sendOTP(formattedPhone);

        setCountdown(120);
        const countdownInterval = setInterval(() => {
          setCountdown((prevCount) => {
            if (prevCount <= 1) {
              clearInterval(countdownInterval);
              setCanResendOTP(true);
              return 0;
            }
            return prevCount - 1;
          });
        }, 1000);

        return () => {
          clearInterval(countdownInterval);
        };
      } catch (error) {
        console.error('Error processing phone number:', error);
        setMessage("Error processing phone number. Please try logging in again.");
      }
    } else {
      console.error('Phone number not found in storage');
      setMessage("Error: Phone number not found. Please log in again.");
    }
  }, [navigate]);

  const sendOTP = async (phone) => {
    if (!phone || phone.trim() === "" || !/^\d{10}$/.test(phone.trim())) {
      setMessage("Invalid phone number");
      return;
    }

    try {
      setSendOtpLoading(true);
      const response = await axios.get(
        `${API_URL}/api/v1/auth/sendOtp?phoneNumber=${phone}`
      );
      setMessage(response.data.message);
      setShowOTPField(true);
      setOtpSent(true);
      setCanResendOTP(false);
      setCountdown(120);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while sending the OTP");
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.trim() === "") {
      setMessage("Please enter the OTP");
      return;
    }

    try {
      setVerifyOtpLoading(true);
      const response = await axios.post(
        `${API_URL}/api/v1/auth/verifyOtp?phoneNumber=${phoneNumber}&otp=${otp}`
      );
      setMessage(response.data.Message);
      localStorage.setItem("token", response.data.Token);
      localStorage.setItem("designation", response.data.Designation);
      localStorage.setItem("name", response.data.Name);
      localStorage.removeItem("userPhoneNumber");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while verifying the OTP");
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-pink-600">
      <div className="rounded-2xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[95vh] w-[95%] lg:w-[78vw] bg-white justify-center items-center">
        {/* Left Side */}
        <div className="hidden lg:flex relative object-cover overflow-hidden rounded-2xl h-[30vh] lg:h-full w-[60vw] lg:w-[50vw] justify-center items-center">
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <h5 className="absolute p-[1px] text-xl border-b-[0.2vw] border-[#76648F] font-semibold text-white left-[30%] mt-4 z-10 top-1">
              YONO BUSINESS FOR
              <br />
              ALL BUSINESS USERS
            </h5>
            <h1 className="text-[#00A9D8] left-[30%] mt-4 z-10 top-16 text-sm absolute font-[700] tracking-tighter">
              (PROPRIETORS TO CORPORATES)
            </h1>
            <div className="flex items-center mt-[-6%] gap-1 flex-col">
              <img
                className="w-[50%] lg:w-[10vw]"
                src={RofabsLogo}
                alt="ROFABS Logo"
              />
              <h1 className="text-[#00A9D8] font-[700] tracking-tighter">
                Desktop / Web
              </h1>
              <h3 className="text-white text-sm">(https://yonobusiness.sbi)</h3>
              <h4 className="border-dotted mb-3 rounded-full text-center p-1 flex w-[76%] text-white text-[0.8vw] border-white border-2">
                One stop solution for Payments, e-Trade, e-Forex Cash Management
                Product and Supply Chain Finance
              </h4>
              <img
                className="w-[50%] lg:w-[10vw]"
                src={RofabsLogo2}
                alt="ROFABS Logo"
              />
              <h1 className="text-[#00A9D8] font-[700] tracking-tighter">
                Yono Business App
              </h1>
              <h3 className="text-white text-sm">
                Can be used on mobiles, tablets and phablets
              </h3>
              <h4 className="border-dotted rounded-full text-center py-2 px-4 flex text-white text-[0.8vw] border-white border-2">
                Payments and Cash Management Product
              </h4>
            </div>
            <div className="absolute left-[42%] top-[91%] w-[13vw]">
              <p className="text-[0.6vw] text-center text-white flex">
                Security Tip - Never share your credentials like OTP / User ID /
                Password etc. with anyone or bank. Also please don't click any
                link received from unknown person by SMS or e-mail.
              </p>
            </div>
          </div>
          <img
            className="absolute inset-0 h-full w-full object-fit"
            src={SBILogo}
            alt="Banking Image"
          />
        </div>

        {/* Right Side */}
        <div className="h-full w-full lg:w-[50vw] p-4 sm:p-6 flex flex-col items-center">
          <img
            className="w-[50%] sm:w-[40%] lg:w-[12vw] mt-4 lg:mt-0"
            src={YonoSBILogo}
            alt="YONO Logo"
          />
          <div className="w-full sm:w-[90%] lg:w-[80%] items-center justify-center mt-5 flex flex-col text-center">
            <p className="text-[#280071] leading-tight text-sm sm:text-base lg:text-sm">
              Please use your <b>existing phone number</b> to login to yono business,
              an integrated platform for Business
            </p>
          </div>

          <div className="w-full flex flex-col mt-5 lg:mt-[12%] items-center justify-center">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full items-center justify-between"
            >
              <div className="w-full sm:w-[90%] lg:w-[80%] gap-6 sm:gap-8 relative mt-2 lg:mt-0 flex flex-col items-center justify-start">
                {showOTPField && (
                  <TextField
                    variant="outlined"
                    label="OTP"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    className="w-full"
                    fullWidth
                    InputLabelProps={{
                      required: false,
                      sx: {
                        fontSize: { xs: '1rem', sm: '1.1rem', lg: '1.2rem' },
                        color: "#506070",
                        "&.Mui-focused": {
                          color: "#506070",
                        },
                        "&::after": {
                          content: '" *"',
                          color: "red",
                        },
                      },
                    }}
                    InputProps={{
                      sx: {
                        fontSize: { xs: '1.2rem', sm: '1.3rem', lg: '1.4rem' },
                      },
                    }}
                    required
                  />
                )}
                {message && (
                  <p className={`mb-2 text-center text-base sm:text-lg ${message.toLowerCase().includes('error') ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                  </p>
                )}
                {otpSent && countdown > 0 && (
                  <p className="text-gray-500 text-sm mt-2">
                    Resend OTP in {countdown} seconds
                  </p>
                )}

                {canResendOTP && (
                  <button
                    className="text-base sm:text-lg lg:text-xl text-[#0095DA] hover:text-[#D5EEF9] rounded-md px-6 sm:px-8 bg-[#E5F6FD] hover:bg-[#0095DA] py-3 border-2 border-blue-300 mt-4 flex items-center justify-center w-full"
                    type="button"
                    onClick={() => sendOTP(phoneNumber)}
                    disabled={sendOtpLoading}
                  >
                    {sendOtpLoading ? (
                      <ClipLoader size={24} color="#ffffff" />
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                )}

                {showOTPField && (
                  <button
                    className="text-base sm:text-lg lg:text-xl text-[#0095DA] hover:text-[#D5EEF9] rounded-md px-6 sm:px-8 bg-[#E5F6FD] hover:bg-[#0095DA] py-3 border-2 border-blue-300 mt-4 flex items-center justify-center w-full"
                    type="submit"
                    disabled={verifyOtpLoading}
                  >
                    {verifyOtpLoading ? (
                      <ClipLoader size={24} color="#ffffff" />
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;