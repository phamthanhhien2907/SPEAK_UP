import { apiGetVocabularyByLessonId } from "@/services/vocabulary.services";
import { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FaVolumeUp, FaMicrophone } from "react-icons/fa";
import { apiUpdateLessonProgressByLessonId } from "@/services/lesson-progress.services";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import ASR_bad from "@/assets/audio/ASR_bad.wav";
import ASR_good from "@/assets/audio/ASR_good.wav";
import ASR_okay from "@/assets/audio/ASR_okay.wav";

const Vocabulary = () => {
  const [vocabulary, setVocabulary] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [phonemeScore, setPhonemeScore] = useState(0);
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const { lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const lesson = location.state?.lesson;
  const { userData } = useSelector((state: RootState) => state.user);
  const {
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const getVocabularyByLessonId = async (lessonId) => {
    try {
      const response = await apiGetVocabularyByLessonId(lessonId);
      if (response?.data) {
        setVocabulary(response.data);
      }
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    }
  };

  useEffect(() => {
    getVocabularyByLessonId(lessonId);
  }, [lessonId]);

  const handlePlayAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  const playFeedbackAudio = (score) => {
    let audioSrc;
    if (score < 40) {
      audioSrc = ASR_bad;
    } else if (score <= 60) {
      audioSrc = ASR_okay;
    } else {
      audioSrc = ASR_good;
    }
    const audio = new Audio(audioSrc);
    audio
      .play()
      .catch((error) => console.error("Error playing feedback audio:", error));
  };

  const startMediaRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recordedChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const base64Audio = await convertAudioToBase64(blob);
        await evaluateSpeechWithPython(base64Audio);
      };
    } catch (error) {
      console.error("Media device error:", error);
    }
  };

  const convertAudioToBase64 = (audioBlob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result?.toString().split(",")[1];
        resolve(base64Audio);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const evaluateSpeechWithPython = async (base64Audio) => {
    const currentVocab = vocabulary[currentIndex];

    try {
      const response = await fetch(
        "http://127.0.0.1:3000/GetAccuracyFromRecordedAudio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": "rll5QsTiv83nti99BW6uCmvs9BDVxSB39SVFceYb",
          },
          body: JSON.stringify({
            recorded_audio: base64Audio,
            word: currentVocab.word,
          }),
        }
      );

      const data = await response.json();
      const phonemeScore = data.accuracy || 0;
      setPhonemeScore(phonemeScore);

      setIsCorrect(
        phonemeScore > 60
          ? "correct"
          : phonemeScore >= 40
          ? "nearly"
          : "incorrect"
      );
      setIsChecked(true);
      setTotalCount((prev) => prev + 1);

      if (phonemeScore > 60) {
        setCorrectCount((prev) => prev + 1);
      }

      playFeedbackAudio(phonemeScore);

      await apiUpdateLessonProgressByLessonId(lessonId, {
        userId: userData?._id,
        score: Math.round(phonemeScore),
        isCompleted: false,
      });
    } catch (error) {
      console.error("Error sending audio to Python server:", error);
    }
  };

  const handleStartSpeaking = async () => {
    if (
      browserSupportsSpeechRecognition &&
      isMicrophoneAvailable &&
      !listening
    ) {
      resetTranscript();
      setIsChecked(false);
      setIsCorrect(null);
      setPhonemeScore(0);
      await startMediaRecorder();
      SpeechRecognition.startListening({
        continuous: false,
        language: "en-US",
      });
      mediaRecorderRef.current?.start();
      setTimeout(() => {
        mediaRecorderRef.current?.stop();
        SpeechRecognition.stopListening();
      }, 3000); // Record for 3 seconds
    }
  };

  useEffect(() => {
    if (!listening && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  }, [listening]);

  const handleNext = async () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsCorrect(null);
      setIsChecked(false);
      setPhonemeScore(0);
      resetTranscript();
    } else {
      setIsCompleted(true);
      await apiUpdateLessonProgressByLessonId(lessonId, {
        userId: userData?._id,
        score: Math.round(
          totalCount > 0 ? (correctCount / totalCount) * 100 : 0
        ),
        isCompleted: true,
      });
    }
  };

  const handleRetry = () => {
    setIsCorrect(null);
    setIsChecked(false);
    setPhonemeScore(0);
    resetTranscript();
  };

  const handleRetryLesson = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setIsCorrect(null);
    setIsChecked(false);
    setPhonemeScore(0);
    resetTranscript();
    setCorrectCount(0);
    setTotalCount(0);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (vocabulary.length === 0) {
    return (
      <div className="text-center mt-20 text-lg text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!browserSupportsSpeechRecognition || !isMicrophoneAvailable) {
    return (
      <div className="text-center mt-20 text-lg text-red-500">
        Trình duyệt của bạn không hỗ trợ hoặc microphone không khả dụng để nhận
        diện giọng nói. Vui lòng kiểm tra cài đặt.
      </div>
    );
  }

  const currentVocab = vocabulary[currentIndex];

  if (isCompleted) {
    const score = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
    return (
      <div className="w-full h-full p-4 flex flex-col items-center justify-center">
        {score >= 60 ? (
          <>
            <h2 className="text-3xl font-bold text-green-600">Hoàn thành!</h2>
            <p className="text-lg mt-4">
              Bạn đã hoàn thành tất cả từ vựng trong bài học với{" "}
              {Math.round(score)}% đúng.
            </p>
            <button
              onClick={handleBack}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Quay về trang chủ
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-red-600">
              Bài tập chưa hoàn thành
            </h2>
            <p className="text-lg mt-4">
              Bạn chỉ đạt {Math.round(score)}% đúng. Điểm tối thiểu để hoàn
              thành là 60%.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleBack}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Quay về trang chủ
              </button>
              <button
                onClick={handleRetryLesson}
                className="mt-6 px-4 py-2 bg-yellow-500 text-white rounded-lg"
              >
                Làm lại bài tập
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-start p-6 bg-gray-100">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-black text-2xl font-bold"
          >
            ✕
          </button>
          <div className="flex gap-2">
            <button className="px-4 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
              Regular
            </button>
            <button className="px-4 py-1 bg-green-500 text-white rounded-full hover:bg-green-600">
              Advanced
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePlayAudio(currentVocab.audioUrl)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow"
          >
            <FaVolumeUp />
            Nghe
          </button>
          <p className="text-lg text-gray-700">Nghe và nói từ hiển thị.</p>
        </div>

        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-full max-w-3xl text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">
            {currentVocab.word}
          </h2>
          <p className="text-blue-600 text-xl">
            {currentVocab.phonetic || "N/A"}
          </p>
        </div>

        {!isChecked && (
          <div className="w-full max-w-3xl flex justify-center">
            <button
              onClick={handleStartSpeaking}
              className={`flex items-center gap-2 px-6 py-3 rounded-full shadow ${
                listening
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              <FaMicrophone />
              {listening ? "Đang nghe..." : "Nói"}
            </button>
          </div>
        )}

        {isChecked && (
          <div className="w-full max-w-3xl flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">
                {phonemeScore > 60 ? "😊" : phonemeScore >= 40 ? "😐" : "😞"}
              </span>
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {phonemeScore > 60
                    ? "Excellent!"
                    : phonemeScore >= 40
                    ? "Good!"
                    : "Try Again!"}
                </p>
                <p className="text-lg text-gray-600">
                  You sound {Math.max(0, Math.round(phonemeScore))}% like a
                  native speaker!
                </p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="text-green-500"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={`${phonemeScore}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {Math.round(phonemeScore)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
              >
                Làm lại
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-3xl flex justify-center">
          <button
            onClick={() => setShowExtraInfo(!showExtraInfo)}
            className="text-blue-600 hover:underline"
          >
            {showExtraInfo ? "Ẩn thông tin bổ sung" : "Thông tin bổ sung"}
          </button>
        </div>

        {showExtraInfo && (
          <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-full max-w-3xl text-center space-y-2">
            <p className="text-gray-700">{currentVocab.meaning}</p>
            <p className="italic text-gray-500">
              {currentVocab.exampleSentence}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vocabulary;

// import { apiGetVocabularyByLessonId } from "@/services/vocabulary.services";
// import { useEffect, useState, useCallback, useRef } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import { FaVolumeUp, FaMicrophone } from "react-icons/fa";
// import { apiUpdateLessonProgressByLessonId } from "@/services/lesson-progress.services";
// import { RootState } from "@/store";
// import { useSelector } from "react-redux";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";

// const Vocabulary = () => {
//   const [vocabulary, setVocabulary] = useState([]);
//   const [currentPairIndex, setCurrentPairIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [isChecked, setIsChecked] = useState(false);
//   const [isCompleted, setIsCompleted] = useState(false);
//   const [correctCount, setCorrectCount] = useState(0);
//   const [totalCount, setTotalCount] = useState(0);
//   const [shuffledOptions, setShuffledOptions] = useState([]);
//   const [phonemeScore, setPhonemeScore] = useState(0);
//   const [showExtraInfo, setShowExtraInfo] = useState(false);
//   const { lessonId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const lesson = location.state?.lesson;
//   const lessonIndex = location.state?.lessonIndex;
//   const { userData } = useSelector((state: RootState) => state.user);
//   const isSpeakingLesson = lessonIndex % 2 === 0;
//   const {
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//     isMicrophoneAvailable,
//   } = useSpeechRecognition();
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const recordedChunksRef = useRef<Blob[]>([]);

//   const getVocabularyByLessonId = async (lessonId) => {
//     try {
//       const response = await apiGetVocabularyByLessonId(lessonId);
//       if (response?.data) {
//         setVocabulary(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching vocabulary:", error);
//     }
//   };

//   const shuffleOptions = useCallback(
//     (currentIdx) => {
//       const options = [];
//       const correctIdx = currentIdx % 2 === 0 ? currentIdx : currentIdx - 1;
//       const wrongIdx = correctIdx + 1;

//       const correctVocab = vocabulary[correctIdx];
//       const wrongVocab = vocabulary[wrongIdx];

//       options.push({ ...correctVocab, isCorrect: true });
//       options.push({ ...wrongVocab, isCorrect: false });

//       return options.sort(() => 0.5 - Math.random());
//     },
//     [vocabulary]
//   );

//   useEffect(() => {
//     getVocabularyByLessonId(lessonId);
//   }, [lessonId]);

//   useEffect(() => {
//     if (vocabulary.length > 0 && isSpeakingLesson) {
//       const evenIndex = currentPairIndex * 2;
//       setShuffledOptions(shuffleOptions(evenIndex));
//     }
//   }, [vocabulary, currentPairIndex, isSpeakingLesson, shuffleOptions]);

//   const handlePlayAudio = (audioUrl) => {
//     const audio = new Audio(audioUrl);
//     audio.play().catch((error) => console.error("Error playing audio:", error));
//   };

//   const startMediaRecorder = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = recorder;

//       recordedChunksRef.current = [];
//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) recordedChunksRef.current.push(event.data);
//       };

//       recorder.onstop = async () => {
//         const blob = new Blob(recordedChunksRef.current, {
//           type: "audio/webm",
//         });
//         const base64Audio = await convertAudioToBase64(blob);
//         await evaluateSpeechWithPython(base64Audio);
//       };
//     } catch (error) {
//       console.error("Media device error:", error);
//     }
//   };

//   const convertAudioToBase64 = (audioBlob) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(audioBlob);
//       reader.onloadend = () => {
//         const base64Audio = reader.result?.toString().split(",")[1];
//         resolve(base64Audio);
//       };
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const evaluateSpeechWithPython = async (base64Audio) => {
//     const baseIndex = currentPairIndex * 2;
//     const currentVocab = vocabulary[baseIndex];

//     try {
//       const response = await fetch(
//         "http://127.0.0.1:3000/GetAccuracyFromRecordedAudio",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "X-API-Key": "rll5QsTiv83nti99BW6uCmvs9BDVxSB39SVFceYb",
//           },
//           body: JSON.stringify({
//             recorded_audio: base64Audio,
//             word: currentVocab.word,
//           }),
//         }
//       );

//       const data = await response.json();
//       const phonemeScore = data.accuracy || 0;
//       setPhonemeScore(phonemeScore);

//       setIsCorrect(
//         phonemeScore >= 80
//           ? "correct"
//           : phonemeScore >= 60
//           ? "nearly"
//           : "incorrect"
//       );
//       setIsChecked(true);
//       setTotalCount((prev) => prev + 1);

//       if (phonemeScore >= 80) {
//         setCorrectCount((prev) => prev + 1);
//       }

//       await apiUpdateLessonProgressByLessonId(lessonId, {
//         userId: userData?._id,
//         score: Math.round(phonemeScore),
//         isCompleted: false,
//       });
//     } catch (error) {
//       console.error("Error sending audio to Python server:", error);
//     }
//   };

//   const handleStartListening = async () => {
//     if (
//       !isSpeakingLesson &&
//       browserSupportsSpeechRecognition &&
//       isMicrophoneAvailable &&
//       !listening
//     ) {
//       resetTranscript();
//       setIsChecked(false);
//       setIsCorrect(null);
//       setPhonemeScore(0);
//       await startMediaRecorder();
//       SpeechRecognition.startListening({
//         continuous: false,
//         language: "en-US",
//       });
//       mediaRecorderRef.current?.start();
//       setTimeout(() => {
//         mediaRecorderRef.current?.stop();
//         SpeechRecognition.stopListening();
//       }, 3000); // Ghi âm trong 3 giây
//     }
//   };

//   useEffect(() => {
//     if (!isSpeakingLesson && !listening && mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//     }
//   }, [listening, isSpeakingLesson]);

//   const handleCheck = () => {
//     if (isSpeakingLesson && selectedOption) {
//       const evenIndex = currentPairIndex * 2;
//       const correctVocab = vocabulary[evenIndex];
//       const isCorrectAnswer =
//         selectedOption._id === correctVocab._id && selectedOption.isCorrect;
//       setIsCorrect(isCorrectAnswer ? "correct" : "incorrect");
//       setIsChecked(true);
//       setTotalCount((prev) => prev + 1);
//       if (isCorrectAnswer) {
//         setCorrectCount((prev) => prev + 1);
//       }
//     }
//   };

//   const handleNext = async () => {
//     const maxPairs = Math.ceil(vocabulary.length / 2);
//     if (currentPairIndex < maxPairs - 1) {
//       setCurrentPairIndex(currentPairIndex + 1);
//       setSelectedOption(null);
//       setIsCorrect(null);
//       setIsChecked(false);
//       setPhonemeScore(0);
//       resetTranscript();
//     } else {
//       setIsCompleted(true);
//     }
//   };

//   const handleRetry = () => {
//     setSelectedOption(null);
//     setIsCorrect(null);
//     setIsChecked(false);
//     setPhonemeScore(0);
//     resetTranscript();
//     if (isSpeakingLesson) {
//       const evenIndex = currentPairIndex * 2;
//       setShuffledOptions(shuffleOptions(evenIndex));
//     }
//   };

//   const handleRetryLesson = () => {
//     setIsCompleted(false);
//     setCurrentPairIndex(0);
//     setSelectedOption(null);
//     setIsCorrect(null);
//     setIsChecked(false);
//     setPhonemeScore(0);
//     resetTranscript();
//     if (isSpeakingLesson) {
//       setShuffledOptions(shuffleOptions(0));
//     }
//     setCorrectCount(0);
//     setTotalCount(0);
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   if (vocabulary.length === 0) {
//     return (
//       <div className="text-center mt-20 text-lg text-gray-500">
//         Đang tải dữ liệu...
//       </div>
//     );
//   }

//   if (!browserSupportsSpeechRecognition || !isMicrophoneAvailable) {
//     return (
//       <div className="text-center mt-20 text-lg text-red-500">
//         Trình duyệt của bạn không hỗ trợ hoặc microphone không khả dụng để nhận
//         diện giọng nói. Vui lòng kiểm tra cài đặt.
//       </div>
//     );
//   }

//   const baseIndex = currentPairIndex * 2;
//   const currentVocab = vocabulary[baseIndex];

//   if (isCompleted) {
//     const totalVocabs = Math.ceil(vocabulary.length / 2);
//     const score = (correctCount / totalVocabs) * 100;
//     try {
//       apiUpdateLessonProgressByLessonId(lessonId, {
//         userId: userData?._id,
//         score: Math.round(score),
//         isCompleted: true,
//       });
//     } catch (error) {
//       console.error("Error updating lesson progress:", error);
//     }

//     return (
//       <div className="w-full h-full p-4 flex flex-col items-center justify-center">
//         {score >= 60 ? (
//           <>
//             <h2 className="text-3xl font-bold text-green-600">Hoàn thành!</h2>
//             <p className="text-lg mt-4">
//               Bạn đã hoàn thành tất cả từ vựng trong bài học với{" "}
//               {Math.round(score)}% đúng.
//             </p>
//             <button
//               onClick={handleBack}
//               className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
//             >
//               Quay về trang chủ
//             </button>
//           </>
//         ) : (
//           <>
//             <h2 className="text-3xl font-bold text-red-600">
//               Bài tập chưa hoàn thành
//             </h2>
//             <p className="text-lg mt-4">
//               Bạn chỉ đạt {Math.round(score)}% đúng. Điểm tối thiểu để hoàn
//               thành là 60%.
//             </p>
//             <div className="flex items-center justify-center gap-4">
//               <button
//                 onClick={handleBack}
//                 className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
//               >
//                 Quay về trang chủ
//               </button>
//               <button
//                 onClick={handleRetryLesson}
//                 className="mt-6 px-4 py-2 bg-yellow-500 text-white rounded-lg"
//               >
//                 Làm lại bài tập
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full flex justify-center items-start p-6 bg-gray-100">
//       <div className="w-full max-w-3xl space-y-6">
//         <div className="flex justify-between items-center">
//           <button
//             onClick={handleBack}
//             className="text-gray-600 hover:text-black text-2xl font-bold"
//           >
//             ✕
//           </button>
//           <div className="flex gap-2">
//             <button className="px-4 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">
//               Regular
//             </button>
//             <button className="px-4 py-1 bg-green-500 text-white rounded-full hover:bg-green-600">
//               Advanced
//             </button>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => handlePlayAudio(currentVocab.audioUrl)}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow"
//           >
//             <FaVolumeUp />
//             Nghe
//           </button>
//           <p className="text-lg text-gray-700">
//             {isSpeakingLesson
//               ? "Nghe và chọn từ khớp với âm thanh."
//               : "Nghe và nói từ hiển thị."}
//           </p>
//         </div>

//         <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-full max-w-3xl text-center space-y-2">
//           <h2 className="text-3xl font-bold text-gray-800">
//             {currentVocab.word}
//           </h2>
//           <p className="text-blue-600 text-xl">
//             {currentVocab.phonetic || "N/A"}
//           </p>
//         </div>

//         {!isSpeakingLesson && !isChecked && (
//           <div className="w-full max-w-3xl flex justify-center">
//             <button
//               onClick={handleStartListening}
//               className={`flex items-center gap-2 px-6 py-3 rounded-full shadow ${
//                 listening
//                   ? "bg-red-600 hover:bg-red-700"
//                   : "bg-blue-600 hover:bg-blue-700"
//               } text-white`}
//             >
//               <FaMicrophone />
//               {listening ? "Đang nghe..." : "Nói"}
//             </button>
//           </div>
//         )}

//         {isChecked && !isSpeakingLesson && (
//           <div className="w-full max-w-3xl flex flex-col items-center gap-4">
//             <div className="flex items-center gap-4">
//               <span className="text-4xl">😊</span>
//               <div>
//                 <p className="text-xl font-semibold text-gray-800">
//                   {phonemeScore >= 80
//                     ? "Excellent!"
//                     : phonemeScore >= 60
//                     ? "Good!"
//                     : "Try Again!"}
//                 </p>
//                 <p className="text-lg text-gray-600">
//                   You sound {Math.max(0, Math.round(phonemeScore))}% like a
//                   native speaker!
//                 </p>
//               </div>
//               <div className="relative w-16 h-16">
//                 <svg className="w-full h-full" viewBox="0 0 36 36">
//                   <path
//                     className="text-gray-200"
//                     d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="text-green-500"
//                     d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                     strokeDasharray={`${phonemeScore}, 100`}
//                   />
//                 </svg>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-lg font-semibold text-gray-800">
//                     {Math.round(phonemeScore)}%
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex gap-4">
//               <button
//                 onClick={handleRetry}
//                 className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
//               >
//                 Làm lại
//               </button>
//               <button
//                 onClick={handleNext}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
//               >
//                 Tiếp tục
//               </button>
//             </div>
//           </div>
//         )}

//         {isSpeakingLesson && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
//             {shuffledOptions.map((option) => {
//               const isSelected = selectedOption?._id === option._id;
//               const correct = option.isCorrect;

//               let styles = "border-gray-300 bg-white";
//               if (isChecked && isSelected) {
//                 styles = correct
//                   ? "border-green-500 bg-green-100"
//                   : "border-red-500 bg-red-100";
//               } else if (isSelected) {
//                 styles = "border-blue-500 bg-blue-50";
//               }

//               return (
//                 <button
//                   key={option._id}
//                   onClick={() => {
//                     handlePlayAudio(option.audioUrl);
//                     setSelectedOption(option);
//                     setIsChecked(false);
//                   }}
//                   disabled={isChecked}
//                   className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition ${styles} hover:bg-gray-100`}
//                 >
//                   <FaVolumeUp />
//                   <span className="font-medium">Phát âm</span>
//                 </button>
//               );
//             })}
//           </div>
//         )}

//         {isSpeakingLesson && !isChecked && (
//           <div className="w-full max-w-3xl flex justify-center">
//             <button
//               onClick={handleCheck}
//               disabled={!selectedOption}
//               className={`px-6 py-2 rounded-full font-medium ${
//                 !selectedOption
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//             >
//               Kiểm tra
//             </button>
//           </div>
//         )}

//         {isSpeakingLesson && isChecked && (
//           <div className="w-full max-w-3xl flex flex-col items-center gap-3">
//             <p
//               className={`text-lg font-semibold ${
//                 isCorrect === "correct" ? "text-green-600" : "text-red-600"
//               }`}
//             >
//               {isCorrect === "correct" ? "🎯 Chính xác!" : "❌ Sai rồi!"}
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={handleRetry}
//                 className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
//               >
//                 Làm lại
//               </button>
//               <button
//                 onClick={handleNext}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
//               >
//                 Tiếp tục
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="w-full max-w-3xl flex justify-center">
//           <button
//             onClick={() => setShowExtraInfo(!showExtraInfo)}
//             className="text-blue-600 hover:underline"
//           >
//             {showExtraInfo ? "Ẩn thông tin bổ sung" : "Thông tin bổ sung"}
//           </button>
//         </div>

//         {showExtraInfo && (
//           <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-full max-w-3xl text-center space-y-2">
//             <p className="text-gray-700">{currentVocab.meaning}</p>
//             <p className="italic text-gray-500">
//               {currentVocab.exampleSentence}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Vocabulary;
