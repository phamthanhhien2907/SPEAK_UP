import { useEffect, useState, useRef, JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaVolumeUp, FaMicrophone } from "react-icons/fa";
import { apiGetVocabularyByLessonId } from "@/services/vocabulary.services";
import { apiUpdateLessonProgressByLessonId } from "@/services/lesson-progress.services";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import ASR_bad from "@/assets/audio/ASR_bad.wav";
import ASR_good from "@/assets/audio/ASR_good.wav";
import ASR_okay from "@/assets/audio/ASR_okay.wav";

// Định nghĩa kiểu dữ liệu cho từ vựng
interface VocabularyItem {
  _id: string;
  lessonId: string;
  word: string;
  phonetic: string;
  meaning: string;
  exampleSentence: string;
  audioUrl?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Định nghĩa kiểu dữ liệu cho kết quả phân tích phát âm
interface PronunciationAnalysisResult {
  accuracy: number;
  is_letter_correct_all_words: string;
  ipa_transcript: string;
  pronunciation_accuracy: string;
  real_transcripts_ipa: string;
  matched_transcripts_ipa: string;
  pair_accuracy_category: string;
  start_time: string;
  end_time: string;
  error?: string;
}

const Vocabulary = () => {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<
    "correct" | "nearly" | "incorrect" | null
  >(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [phonemeScore, setPhonemeScore] = useState(0);
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lettersOfWordAreCorrect, setLettersOfWordAreCorrect] = useState<
    string[]
  >([]);
  const [voiceSynthRef, setVoiceSynthRef] =
    useState<SpeechSynthesisVoice | null>(null);

  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { userData } = useSelector((state: RootState) => state.user);
  const {
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Initialize speech synthesis voice for English
  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | null = null;
    for (const voice of voices) {
      if (voice.lang.startsWith("en") && voice.name.includes("Daniel")) {
        selectedVoice = voice;
        break;
      }
    }
    if (!selectedVoice) {
      for (const voice of voices) {
        if (voice.lang.startsWith("en")) {
          selectedVoice = voice;
          break;
        }
      }
    }
    setVoiceSynthRef(selectedVoice);
  }, []);

  const getVocabularyByLessonId = async (lessonId: string) => {
    try {
      const response = await apiGetVocabularyByLessonId(lessonId);
      if (response?.data) {
        setVocabulary(response.data);
      } else {
        setError("No vocabulary found for this lesson.");
      }
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
      setError("Failed to load vocabulary. Please try again.");
    }
  };

  useEffect(() => {
    if (lessonId) {
      getVocabularyByLessonId(lessonId);
    } else {
      setError("Invalid lesson ID.");
    }
  }, [lessonId]);

  const handlePlayAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  const playFeedbackAudio = (score: number) => {
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
      setError("Failed to access microphone. Please check permissions.");
    }
  };

  const convertAudioToBase64 = (audioBlob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result?.toString().split(",")[1];
        if (base64Audio) {
          resolve(base64Audio);
        } else {
          reject(new Error("Failed to convert audio to base64."));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const playWord = (word: string) => {
    if (voiceSynthRef) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.voice = voiceSynthRef;
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis voice not available.");
    }
  };

  const evaluateSpeechWithPython = async (base64Audio: string) => {
    const currentVocab = vocabulary[currentIndex];
    if (!currentVocab || !currentVocab.word) {
      setError("No valid vocabulary item to evaluate.");
      return;
    }

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
            base64Audio: base64Audio,
            text: currentVocab.word,
            language: "en",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: PronunciationAnalysisResult = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

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

      // Store letter correctness data
      setLettersOfWordAreCorrect(data.is_letter_correct_all_words.split(" "));

      playFeedbackAudio(phonemeScore);

      if (userData?._id && lessonId) {
        await apiUpdateLessonProgressByLessonId(lessonId, {
          userId: userData._id,
          score: Math.round(phonemeScore),
          isCompleted: false,
        });
      }
    } catch (error: any) {
      console.error("Error sending audio to Python server:", error);
      setError(
        `Failed to evaluate pronunciation: ${error.message || "Unknown error"}`
      );
    }
  };

  const handleStartSpeaking = async () => {
    if (!vocabulary[currentIndex]) {
      setError("No vocabulary item available to pronounce.");
      return;
    }
    if (
      browserSupportsSpeechRecognition &&
      isMicrophoneAvailable &&
      !listening
    ) {
      resetTranscript();
      setIsChecked(false);
      setIsCorrect(null);
      setPhonemeScore(0);
      setError(null);
      setLettersOfWordAreCorrect([]);
      await startMediaRecorder();
      mediaRecorderRef.current?.start();
      SpeechRecognition.startListening({
        continuous: false,
        language: "en-US",
      });
      setTimeout(() => {
        mediaRecorderRef.current?.stop();
        SpeechRecognition.stopListening();
      }, 3000); // Record for 3 seconds
    } else {
      setError("Microphone or speech recognition not available.");
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
      setError(null);
      setLettersOfWordAreCorrect([]);
      resetTranscript();
    } else {
      setIsCompleted(true);
      if (userData?._id && lessonId) {
        await apiUpdateLessonProgressByLessonId(lessonId, {
          userId: userData._id,
          score: Math.round(
            totalCount > 0 ? (correctCount / totalCount) * 100 : 0
          ),
          isCompleted: true,
        });
      }
    }
  };

  const handleRetry = () => {
    setIsCorrect(null);
    setIsChecked(false);
    setPhonemeScore(0);
    setError(null);
    setLettersOfWordAreCorrect([]);
    resetTranscript();
  };

  const handleRetryLesson = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setIsCorrect(null);
    setIsChecked(false);
    setPhonemeScore(0);
    setCorrectCount(0);
    setTotalCount(0);
    setError(null);
    setLettersOfWordAreCorrect([]);
    resetTranscript();
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Render colored text for word with correct/incorrect letters
  const renderColoredText = () => {
    const currentVocab = vocabulary[currentIndex];
    if (
      !currentVocab ||
      !currentVocab.word ||
      !lettersOfWordAreCorrect.length
    ) {
      return (
        <h2 className="text-3xl font-bold text-gray-800">
          {currentVocab.word}
        </h2>
      );
    }

    const word = currentVocab.word;
    const lettersCorrect = lettersOfWordAreCorrect[0]; // Single word, so take first element
    const coloredLetters: JSX.Element[] = [];

    for (let letter_idx = 0; letter_idx < word.length; letter_idx++) {
      const letterIsCorrect = lettersCorrect?.[letter_idx] === "1";
      const colorClass = letterIsCorrect ? "text-green-600" : "text-red-600";
      coloredLetters.push(
        <span key={`letter-${letter_idx}`} className={colorClass}>
          {word[letter_idx]}
        </span>
      );
    }

    return (
      <h2 className="text-3xl font-bold text-gray-800">
        <a
          onClick={() => playWord(word)}
          className="whitespace-nowrap cursor-pointer hover:underline"
        >
          {coloredLetters}
        </a>
      </h2>
    );
  };

  if (error) {
    return (
      <div className="text-center mt-20 text-lg text-red-500">{error}</div>
    );
  }

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
      <div className="w that-full h-full p-4 flex flex-col items-center justify-center">
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
            disabled={!currentVocab.audioUrl}
          >
            <FaVolumeUp />
            Nghe
          </button>
          <p className="text-lg text-gray-700">Nghe và nói từ hiển thị.</p>
        </div>

        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-full max-w-3xl text-center space-y-2">
          {renderColoredText()}
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
              disabled={listening}
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
