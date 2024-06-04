import React from "react";
import SBILogo from '../utils/image/sbi.jpg';
import YonoSBILogo from '../utils/image/SBI_YONO_Logo.svg';
import RofabsLogo from '../utils/image/ROFABS.png';

function Login() {
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
              Please use your existing user ID and password (credentials) of
              Corporate
            </p>
            <p className="text-[#280071] text-xl lg:text-2xl font-bold mt-2">
              Internet Banking, eTrade, eForex, Supply Chain Finance or Cash
              Management
            </p>
            <p className="text-[#280071] text-xl lg:text-2xl mb-5 lg:mb-[20%] font-bold mt-2">
              product to login to yono business, an integrated platform for
              Business
            </p>
          </div>

          <div className="w-full flex flex-col items-center lg:items-start">
            <form className="flex flex-col w-full items-center lg:items-start">
              <div className="w-full relative mt-2 lg:mt-0">
                <input
                  type="text"
                  placeholder="UserID"
                  className="outline-none w-full mb-5 lg:w-[45vw] border-b-2 font-display focus:outline-none focus:border-primarycolor transition-all duration-500 capitalize text-3xl"
                />
              </div>
              <div className="relative mt-8 w-full">
                <input
                  type="password"
                  placeholder="password"
                  className="outline-none mb-5 w-full lg:w-[45vw] border-b-2 font-display focus:outline-none focus:border-primarycolor transition-all duration-500 capitalize text-3xl"
                />
              </div>
              <p className="self-start mt-6 text-gray-600 font-bold flex items-center text-xl">
                <input type="checkbox" className="h-[2vh] w-[2vw] mr-2" />
                Enable virtual keyboard
              </p>
              <button
                className="text-xl text-[#0095DA] hover:text-[#D5EEF9] rounded-md px-[3vw] bg-[#E5F6FD] hover:bg-[#0095DA] py-2 border-2 border-blue-300 mt-4"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;