import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SBILogo from "../utils/image/sbi.jpg";
import YonoSBILogo from "../utils/image/SBI_YONO_Logo.svg";
import RofabsLogo from "../utils/image/ROFABS.png";
import axios from "axios";
import { API_URL } from "../../secrets";
import { jwtDecode } from "jwt-decode";

function Login() {


  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOTP] = useState("");
  const [showOTPField, setShowOTPField] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const emailToken = localStorage.getItem("emailLogin");
    const phoneToken = localStorage.getItem("token");

    if (emailToken && phoneToken) {
      navigate("/dashboard");
    } else if (!emailToken) {
      navigate("/");
    }
  }, [navigate]);

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };


  const sendOTP = async () => {
    if (phoneNumber.trim() === "") {
      setMessage("Please enter a phone number");
      return;
    }

    try {
      setSendOtpLoading(true);
      const response = await axios.get(
        `${API_URL}/api/v1/auth/sendOtp?phoneNumber=${phoneNumber}`
      );
      setMessage(response.data.message);
      setShowOTPField(true);
      setOtpSent(true);
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
      setToken(response.data.Token);
      localStorage.setItem("token", response.data.Token);
      localStorage.setItem("designation", response.data.Designation);
      localStorage.setItem("name", response.data.Name);
      console.log(response.data);

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
      <div className="rounded-2xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[95vh] w-[95%] lg:w-[95vw] bg-white justify-center items-center">
        {/* Left Side */}
        <div className="hidden lg:flex relative object-cover overflow-hidden rounded-2xl h-[30vh] lg:h-full w-[60vw] lg:w-[45vw] justify-center items-center">
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
        <div className="h-[90vh] w-[90vw] sm:h-[95vh] p-6 flex flex-col items-center lg:items-center overflowhidden ">
          <img
            className="w-[50%] lg:w-[18vw] mt-4 lg:mt-0"
            src={YonoSBILogo}
            alt="YONO Logo"
          />
          <div className="w-[90%] lg:w-[80%] items-center justify-center mt-5 flex flex-col lg:text-center">
            <p className="text-[#280071] font-bold leading-tight text-lg sm:text-md md:text-xl lg:text-xl">
              Please use your existing user ID and password (credentials) of
              Corporate Internet Banking, eTrade, eForex, Supply Chain Finance
              or Cash Management product to login to yono business, an
              integrated platform for Business
            </p>
          </div>

          <div className="w-full flex flex-col mt-5 lg:mt-[15%] items-center  lg:items-center justify-center">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full items-center lg:items-center justify-center"
            >
              <div className="w-full relative mt-[20%] lg:mt-0 flex flex-col items-center justify-center">
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
                  {sendOtpLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
              {showOTPField && (
                <div className="relative w-full flex flex-col items-center justify-center mt-5">
                  <input
                    type="text"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    className="outline-none mb-5 w-full lg:w-[45vw] border-b-2 font-display focus:outline-none focus:border-primarycolor transition-all duration-500 capitalize text-3xl"
                    inputMode="numeric"
                  />

                  <button
                    className="text-xl text-[#0095DA] hover:text-[#D5EEF9] rounded-md px-[3vw] bg-[#E5F6FD] hover:bg-[#0095DA] py-2 border-2 border-blue-300 mt-4"
                    type="submit"
                    disabled={verifyOtpLoading}
                  >
                    {verifyOtpLoading ? "Verifying OTP..." : "Verify OTP"}
                  </button>
                </div>
              )}
              {message && (
                <p className="text-center text-green-500 mt-4">{message}</p>
              )}
            </form>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
