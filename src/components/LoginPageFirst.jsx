import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SBILogo from "../utils/image/sbi.jpg";
import YonoSBILogo from "../utils/image/SBI_YONO_Logo.svg";
import RofabsLogo from "../utils/image/ROFABS.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { API_URL } from "../../secrets";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function LoginPageFirst() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaResponse, setCaptchaResponse] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setCaptchaError("");

    if (emailOrUsername.trim() === "") {
      setErrorMessage("Please enter an email or username.");
    } else if (password.trim() === "") {
      setErrorMessage("Please enter a password.");
    } else if (captchaResponse.trim() === "") {
      setCaptchaError("Please complete the captcha.");
    } else {
      try {
        const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
          emailOrUsername,
          password,
        });

        console.log("Login response:", response.data);
        if (response.data.message === "Login successful") {
          localStorage.setItem("emailLogin", response.data.token);
          navigate("/login");
        } else {
          setErrorMessage("Invalid email, username, or password.");
        }
      } catch (error) {
        console.error("Login error:", error);
        if (error.response && error.response.data && error.response.data.Error) {
          setErrorMessage(error.response.data.Error);
        } else {
          setErrorMessage("An error occurred during login.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCaptchaLoad = () => {
    console.log("Captcha loaded");
  };

  const handleCaptchaVerification = (response) => {
    setCaptchaResponse(response);
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
            className="absolute inset-0 h-full w-full object-fit"
            src={SBILogo}
            alt="Banking Image"
          />
        </div>

        {/* Right Side */}
        <div className="h-[90vh] w-[90vw] sm:h-[95vh] p-6 flex flex-col items-center lg:items-center overflowhidden">
          <img
            className="w-[50%] lg:w-[18vw] mt-4 lg:mt-0"
            src={YonoSBILogo}
            alt="YONO Logo"
          />
          <div className="w-[90%] lg:w-[80%] items-center justify-center mt-5 flex flex-col lg:text-center">
            <p className="text-[#280071] font-bold leading-tight text-lg sm:text-md md:text-xl lg:text-xl">
              Please use your existing user ID and password (credentials) of
              Corporate Internet Banking, eTrade, Supply Chain Finance or Cash
              Management product to login to yono business, an integrated
              platform for Business
            </p>
          </div>

          <div className="w-full flex flex-col mt-5 lg:mt-[15%] items-center lg:items-center justify-center">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full items-center lg:items-center justify-between"
            >
              <div className="w-full relative mt-2 lg:mt-0 flex flex-col items-center justify-center">
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="outline-none w-[80%] lg:w-[45vw] mb-5 border-b-2 font-display focus:outline-none focus:border-primarycolor transition-all duration-500 text-lg lg:text-3xl"
                />
                <div className="relative w-[80%] lg:w-[45vw] mt-8 mb-5">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="outline-none w-full border-b-2 font-display focus:outline-none focus:border-primarycolor transition-all duration-500 text-lg lg:text-3xl"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute text-lg lg:text-2xl right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-red-500 mb-2">{errorMessage}</p>
                )}
                <ReCAPTCHA
                  className="mt-2 mb-2"
                  sitekey="6Lc8ZvIpAAAAAMVwMiiwmYIi57smSue2qqSd3L-O"
                  render="explicit"
                  asyncScriptOnLoad={handleCaptchaLoad}
                  onChange={handleCaptchaVerification}
                />
                {captchaError && (
                  <p className="text-red-500 mb-2">{captchaError}</p>
                )}
                <button
                  className="text-lg lg:text-xl text-[#0095DA] hover:text-[#D5EEF9] rounded-md px-[3vw] bg-[#E5F6FD] hover:bg-[#0095DA] py-2 border-2 border-blue-300 mt-4 flex items-center justify-center"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ClipLoader size={20} color="#ffffff" />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default LoginPageFirst;