import { motion } from "framer-motion";
import * as React from "react";
import app_preview from "@/assets/user/app-preview.png";
import google_play from "@/assets/user/google-play-button.webp";
import app_store from "@/assets/user/app-store-button.webp";

const DownloadApp: React.FC = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="py-16 bg-white text-center"
  >
    <div className="flex items-center justify-evenly">
      <div className="flex flex-col items-start">
        <button className="text-blue-600 px-4 py-2 rounded-full mb-8">
          Download TalkPal App
        </button>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          LEARN ANYWHERE ANYTIME
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-start">
          Talkpal is an AI-powered language tutor. It&apos;s the most efficient
          way to learn a language. Chat about an unlimited amount of interesting
          topics either by writing or speaking while receiving messages with
          realistic voice.
        </p>
        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 p-4 rounded-lg">
            <span role="img" aria-label="qr-code">
              📲
            </span>
            <p className="text-sm text-gray-600">
              Scan with your device to download on iOS or Android
            </p>
          </div>
        </div>
        <div className="flex justify-center space-x-4 mb-8">
          <div className="w-[170px] h-[48px] rounded-xl overflow-hidden">
            <img
              src={google_play}
              alt="google_play"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-[170px] h-[48px] rounded-xl overflow-hidden">
            <img
              src={app_store}
              alt="app_store"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-[461px] h-[461px]  rounded-lg flex items-center justify-center text-white text-2xl"
      >
        <img src={app_preview} alt="app_preview" className="w-full h-full" />
      </motion.div>
    </div>
  </motion.section>
);

export default DownloadApp;
