import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import auth from "@/assets/user/icon-auth.jpeg";
import { apiGetLessonById } from "@/services/lesson.services";
import { Lesson } from "@/types/lesson";
import { MdKeyboardArrowLeft, MdMicNone } from "react-icons/md";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { FaPaperPlane, FaTrash, FaLightbulb } from "react-icons/fa";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/use-dispatch";
import { logout } from "@/stores/actions/authAction";

interface Language {
  name: string;
  speechLang: string;
  flag: string;
}

const LANGUAGE_MAP: Record<string, Language> = {
  en: {
    name: "English",
    speechLang: "en-US",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  vi: {
    name: "Vietnamese",
    speechLang: "vi-VN",
    flag: "https://flagcdn.com/w40/vn.png",
  },
  ja: {
    name: "Japanese",
    speechLang: "ja-JP",
    flag: "https://flagcdn.com/w40/jp.png",
  },
  ko: {
    name: "Korean",
    speechLang: "ko-KR",
    flag: "https://flagcdn.com/w40/kr.png",
  },
  zh: {
    name: "Chinese",
    speechLang: "zh-CN",
    flag: "https://flagcdn.com/w40/cn.png",
  },
  af: {
    name: "Afrikaans",
    speechLang: "af-ZA",
    flag: "https://flagcdn.com/w40/za.png",
  },
};

interface Conversation {
  userText: string;
  aiResponse: string;
  audioUrl?: string;
  isLoading?: boolean;
  isAudioLoading?: boolean;
  suggestion?: string;
}

interface ApiResponse {
  user_text: string;
  ai_response: string;
  audio_url?: string;
  error?: string;
  suggestion?: string;
  hint?: string;
}

interface SuggestResponse {
  ai_response: string;
  suggested_response: string;
  language: string;
}

const API_BASE_URL = "http://localhost:3000";

const ROLE_GENDER_MAP: Record<string, "male" | "female"> = {
  "Taxi driver": "male",
  "Hotel manager": "female",
  Cashier: "female",
  "Store employee": "male",
  Waiter: "male",
  Barista: "female",
  "Bank employee": "female",
  "Real estate agent": "female",
  "Gym employee": "male",
  "Your co-worker": "female",
  "Salon manager": "female",
  "Dry cleaner clerk": "male",
  "Post office clerk": "male",
  "Travel agent": "female",
  Repairman: "male",
  Consultant: "male",
  "Airline representative": "male",
  Veterinarian: "female",
  Roommate: "female",
  "Best friend": "female",
  Neighbor: "female",
  "New employee": "male",
  "Your partner": "female",
  "Intriguing Stranger": "female",
  "Company owner": "female",
  "HR person": "male",
  Vendor: "female",
  Mechanic: "male",
  "Tech support representative": "male",
  Customer: "male",
  "HR manager": "female",
};

const Speech: React.FC = () => {
  const [lessonData, setLessonData] = useState<Lesson | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [translatedTexts, setTranslatedTexts] = useState<{
    [index: number]: string;
  }>({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translationLanguage, setTranslationLanguage] = useState("vi");
  const [drawerMode, setDrawerMode] = useState<"settings" | "translation">(
    "settings"
  );
  const [currentUserText, setCurrentUserText] = useState("");
  const [voiceGender, setVoiceGender] = useState<"male" | "female">("female");
  const [isInputMode, setIsInputMode] = useState(false);
  const [waveformHeights, setWaveformHeights] = useState<number[]>([]);

  const { lessonId } = useParams<{ lessonId: string }>();
  const { userData } = useSelector((state: RootState) => state.user);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const conversationRef = useRef<HTMLDivElement>(null);
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const isInitialSpeakDone = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  console.log(conversations);
  const getLessonById = async (lessonId: string): Promise<void> => {
    const response = await apiGetLessonById(lessonId);
    if (response?.data?.success) {
      setLessonData(response?.data?.rs);
      const gender = ROLE_GENDER_MAP[response?.data?.rs.name] || "female";
      setVoiceGender(gender);
    }
  };

  useEffect(() => {
    if (lessonId) getLessonById(lessonId);
  }, [lessonId]);

  useEffect(() => {
    if (
      lessonData?.title &&
      conversations.length === 0 &&
      !isInitialSpeakDone.current
    ) {
      const initialGreeting = `${
        lessonData?.content
          ? lessonData?.content
          : "Learn common phrases used in conversations"
      } \n Hello! How can I help you today?`;
      setConversations((prev) => [
        ...prev,
        { userText: "", aiResponse: initialGreeting, audioUrl: undefined },
      ]);
      speakText(initialGreeting, selectedLanguage, voiceGender);
      isInitialSpeakDone.current = true;
    }
  }, [
    lessonData,
    conversations.length,
    isInitialSpeakDone,
    selectedLanguage,
    voiceGender,
  ]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      audioRefs.current.forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
      audioRefs.current = [];
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
    };
  }, []);

  const getVoiceByGender = (gender: "male" | "female", language: string) => {
    const voices = window.speechSynthesis.getVoices();
    const langVoices = voices.filter((v) =>
      v.lang.startsWith(language.split("-")[0])
    );
    if (langVoices.length === 0) {
      console.warn("No voices available for language:", language);
      return null;
    }
    if (gender === "male") {
      return (
        langVoices.find((v) =>
          ["david", "mark"].some((name) => v.name.toLowerCase().includes(name))
        ) || langVoices[0]
      );
    } else {
      return (
        langVoices.find((v) =>
          ["zira", "female"].some((name) => v.name.toLowerCase().includes(name))
        ) || langVoices[0]
      );
    }
  };

  const speakText = (
    text: string,
    language: string,
    gender: "male" | "female"
  ) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoiceByGender(gender, language);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversations]);

  const NUMBER_OF_BARS = 1000;
  const MIN_HEIGHT = 2;
  const MAX_HEIGHT = 120;

  const initializeWaveform = () => {
    const initialHeights = Array(NUMBER_OF_BARS).fill(MIN_HEIGHT);
    setWaveformHeights(initialHeights);
  };

  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateWaveform = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        const normalizedAmplitude =
          (average / 255) * (MAX_HEIGHT - MIN_HEIGHT) + MIN_HEIGHT;

        setWaveformHeights((prev) =>
          prev.map(() => Math.max(normalizedAmplitude, MIN_HEIGHT))
        );

        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };

      updateWaveform();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setWaveformHeights(Array(NUMBER_OF_BARS).fill(MIN_HEIGHT));
  };

  useEffect(() => {
    initializeWaveform();
  }, []);

  useEffect(() => {
    if (listening) {
      startAudioAnalysis();
    } else {
      stopAudioAnalysis();
    }
  }, [listening]);

  const startRecognition = (): void => {
    if (!browserSupportsSpeechRecognition) {
      setConversations((prev) => [
        ...prev,
        {
          userText: "",
          aiResponse: "Trình duyệt không hỗ trợ nhận diện giọng nói.",
        },
      ]);
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({
      language: LANGUAGE_MAP[selectedLanguage].speechLang,
      continuous: false,
    });
  };

  const stopRecognition = (): void => {
    SpeechRecognition.stopListening();
  };

  const handleSend = () => {
    stopRecognition();
    resetTranscript();
    const newTranscript = transcript.trim();
    let textToSend = "";

    if (newTranscript) {
      textToSend = newTranscript;
    } else if (currentUserText) {
      textToSend = currentUserText;
    }

    if (textToSend) {
      setConversations((prev) => [
        ...prev,
        { userText: textToSend, aiResponse: "", isLoading: true },
      ]);
      handleSendRequest(textToSend);
    }
    setCurrentUserText("");
    setIsInputMode(false);
  };

  const handleClear = () => {
    setCurrentUserText("");
    setIsInputMode(false);
    stopRecognition();
  };

  const translateText = async (text: string, targetLang: string) => {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|${targetLang}`
    );
    const data = await res.json();
    return data?.responseData?.translatedText || "";
  };

  const handleSendRequest = async (text: string): Promise<void> => {
    try {
      const res = await fetch(`${API_BASE_URL}/text-and-respond/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_text: text,
          topic: lessonData?.title,
          language: selectedLanguage,
          role: lessonData?.name || "conversational partner",
          chat_mode: "topic_based",
        }),
      });

      if (!res.ok) {
        const data: ApiResponse = await res.json();
        setConversations((prev) => {
          const lastIndex = prev.length - 1;
          return prev.map((conv, index) =>
            index === lastIndex
              ? {
                  ...conv,
                  aiResponse:
                    data.ai_response || data.error || "Something went wrong",
                  audioUrl: data.audio_url,
                  isLoading: false,
                  isAudioLoading: !!data.audio_url,
                  suggestion: data.hint, // Add hint to suggestion if available
                }
              : conv
          );
        });
        return; // Stop further processing on error
      }

      const data: ApiResponse = await res.json();
      setConversations((prev) => {
        const lastIndex = prev.length - 1;
        return prev.map((conv, index) =>
          index === lastIndex
            ? {
                ...conv,
                aiResponse: data.ai_response,
                audioUrl: data.audio_url,
                isLoading: false,
                isAudioLoading: !!data.audio_url,
              }
            : conv
        );
      });

      if (data.audio_url) {
        const audio = new Audio(`${API_BASE_URL}${data.audio_url}`);
        audioRefs.current.push(audio);
        audio.onloadeddata = () => {
          setConversations((prev) => {
            const lastIndex = prev.length - 1;
            return prev.map((conv, index) =>
              index === lastIndex ? { ...conv, isAudioLoading: false } : conv
            );
          });
          audio.play().catch((err) =>
            setConversations((prev) => [
              ...prev,
              {
                userText: "",
                aiResponse: `Lỗi phát âm thanh: ${err.message}`,
              },
            ])
          );
        };
      }
    } catch (err: any) {
      setConversations((prev) => {
        const lastIndex = prev.length - 1;
        return prev.map((conv, index) =>
          index === lastIndex
            ? {
                ...conv,
                aiResponse: `No network connection, please check again!`,
                isLoading: false,
              }
            : conv
        );
      });
    }
  };

  const handleSuggestResponse = async () => {
    const lastConversation = conversations[conversations.length - 1];
    const aiResponse = lastConversation?.aiResponse || "";
    const role = lessonData?.name || "conversational partner";
    try {
      const res = await fetch(`${API_BASE_URL}/suggest-response/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ai_response: aiResponse,
          topic: lessonData?.title || "",
          language: selectedLanguage,
          role: role,
          suggest_for: "user",
          chat_mode: "topic_based",
        }),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data: SuggestResponse = await res.json();
      setConversations((prev) => [
        ...prev,
        {
          userText: "",
          aiResponse: `Gợi ý: ${data.suggested_response}`,
          isLoading: false,
        },
      ]);
    } catch (err: any) {
      setConversations((prev) => [
        ...prev,
        {
          userText: "",
          aiResponse: `No network connection, please check again!`,
          isLoading: false,
        },
      ]);
    }
  };

  return (
    <div
      className={
        showSidebar
          ? "flex flex-col h-screen bg-gray-50 px-8 py-6 relative"
          : "flex flex-col h-screen bg-gray-50 px-8 py-6 relative w-full"
      }
    >
      <div
        className={
          showSidebar
            ? "flex items-center justify-between mb-6"
            : "flex items-center justify-between mb-6"
        }
      >
        <div className="flex items-center space-x-4">
          <MdKeyboardArrowLeft
            size={28}
            className="text-gray-700 cursor-pointer hover:text-gray-900"
            onClick={() => history.back()}
          />
          <h6 className="text-2xl font-bold text-gray-800">
            {lessonData?.title || "Chat Lesson"}
          </h6>
        </div>
        <button
          onClick={() => {
            setShowSidebar(true);
            setDrawerMode("settings");
          }}
          data-testid="settings-button"
          className="text-gray-600 hover:text-gray-800"
        >
          <FiSettings size={24} />
        </button>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden pb-20">
        <div
          ref={conversationRef}
          className="flex-1 flex flex-col gap-4 overflow-y-auto pr-16"
        >
          {conversations.map((conv, index) => (
            <div key={index} className="flex flex-col gap-2">
              {conv.userText && (
                <div className="flex justify-end gap-3">
                  <div className="bg-blue-100 px-4 py-3 rounded-xl shadow-lg max-w-md">
                    <p className="text-gray-800 text-xl font-medium font-iBMPlexSans">
                      {conv.userText}
                    </p>
                  </div>
                  <img
                    src={userData?.avatar ? userData?.avatar : auth}
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                    alt="User"
                  />
                </div>
              )}
              {(conv.aiResponse || conv.isLoading || conv.isAudioLoading) && (
                <div className="flex gap-3 items-start">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <img
                      src={lessonData?.aiImg}
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                      alt="Assistant"
                    />
                    <span className="text-sm font-bold font-spaceGrotesk">
                      {lessonData?.name}
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 px-4 py-3 rounded-xl shadow-md max-w-xl">
                    {conv.isLoading ? (
                      <p className="text-gray-600 text-lg font-medium font-iBMPlexSans">
                        Đang suy nghĩ...
                      </p>
                    ) : conv.isAudioLoading ? (
                      <p className="text-gray-600 text-lg font-medium font-iBMPlexSans">
                        Đang tải âm thanh...
                      </p>
                    ) : (
                      <>
                        <p className="text-gray-900 text-lg font-medium font-iBMPlexSans">
                          {conv.aiResponse}
                        </p>
                        {conv.suggestion && (
                          <p className="text-blue-600 text-sm mt-1">
                            Suggestion: {conv.suggestion}
                          </p>
                        )}
                        <div className="mt-2 flex gap-3 text-sm text-blue-600">
                          <button
                            className="hover:underline"
                            onClick={() => {
                              if (conv.audioUrl) {
                                const audio = new Audio(
                                  `${API_BASE_URL}${conv.audioUrl}`
                                );
                                audioRefs.current.push(audio);
                                audio.play().catch((err) => {
                                  console.error(
                                    "Audio playback failed:",
                                    err.message
                                  );
                                });
                              } else if (index === 0) {
                                const initialGreeting = `${
                                  lessonData?.content
                                    ? lessonData?.content
                                    : "Learn common phrases used in conversations"
                                } \n Hello! How can I help you today?`;
                                speakText(
                                  initialGreeting,
                                  selectedLanguage,
                                  voiceGender
                                );
                              }
                            }}
                          >
                            🔁 Repeat
                          </button>
                          <button
                            className="hover:underline"
                            onClick={async () => {
                              setTranslatedTexts({});
                              setShowSidebar(true);
                              setDrawerMode("translation");
                              const translation = await translateText(
                                conv.aiResponse,
                                translationLanguage
                              );
                              setTranslatedTexts((prev) => ({
                                ...prev,
                                [index]: translation,
                              }));
                            }}
                          >
                            🌐 Translate
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-8 right-8">
        {!isInputMode ? (
          <div className="flex items-center bg-white border border-gray-200 rounded-full p-2 shadow-lg">
            <input
              type="text"
              name="chat"
              value={currentUserText}
              onChange={(e) => setCurrentUserText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                  setCurrentUserText("");
                }
              }}
              placeholder="Aa"
              className="flex-1 px-4 py-2 outline-none"
            />
            <button
              className="text-blue-500 p-2 hover:text-blue-700 rounded-full"
              onClick={() => {
                setIsInputMode(true);
                startRecognition();
              }}
            >
              <MdMicNone size={24} />
            </button>
            {conversations[1]?.userText && (
              <button
                className="text-blue-500 p-2 hover:text-blue-700 rounded-full"
                onClick={handleSuggestResponse}
              >
                <FaLightbulb size={24} />
              </button>
            )}

            <button
              className="text-blue-500 p-2 hover:text-blue-700 rounded-full"
              onClick={handleSend}
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center bg-blue-600 rounded-full p-2 shadow-lg">
            <button
              className="text-white p-2 hover:bg-blue-700 rounded-full"
              onClick={handleClear}
            >
              <FaTrash size={20} />
            </button>
            <div className="flex h-10 w-full flex-row items-center justify-end gap-1 overflow-hidden">
              {waveformHeights.map((height, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 transition-transform duration-500 ease-out"
                  style={{
                    height: `${height}px`,
                    width: "2px",
                    backgroundColor: "white",
                  }}
                />
              ))}
            </div>
            <button
              className="text-white p-2 hover:bg-blue-700 rounded-full"
              onClick={() => {
                handleSend();
                handleClear();
              }}
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
        )}
        {isInputMode && (
          <button
            className="text-center w-full text-gray-500 hover:text-gray-700 text-sm mt-2"
            onClick={() => setIsInputMode(false)}
          >
            Skip
          </button>
        )}
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        } rounded-l-2xl border-l`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">
            {drawerMode === "settings" ? "Settings" : "Translation"}
          </h3>
          <button
            onClick={() => setShowSidebar(false)}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ✕
          </button>
        </div>
        <div className="p-6 space-y-6">
          {drawerMode === "settings" ? (
            <>
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Choose speech language
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {Object.entries(LANGUAGE_MAP).map(([code, { name }]) => (
                    <option key={code} value={code} className="py-1">
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Choose translation language
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={translationLanguage}
                  onChange={(e) => setTranslationLanguage(e.target.value)}
                >
                  {Object.entries(LANGUAGE_MAP).map(([code, { name }]) => (
                    <option key={code} value={code} className="py-1">
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <hr className="border-t border-gray-200" />
              <div>
                <button
                  className="w-full flex items-center justify-center gap-2 text-red-700 font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-2 hover:bg-red-100 transition"
                  onClick={() => {
                    dispatch(logout());
                    navigate("/clean");
                  }}
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className="mb-4"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {translatedTexts[-1] && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm text-gray-600">English</p>
                    <p className="text-gray-900 text-base mt-1">
                      {lessonData?.content}
                    </p>
                    <p className="font-medium text-sm text-gray-600 mt-2">
                      {LANGUAGE_MAP[translationLanguage].name}
                    </p>
                    <p className="text-blue-600 text-base mt-1">
                      {translatedTexts[-1]}
                    </p>
                  </div>
                )}
                {Object.entries(translatedTexts)
                  .filter(([key]) => key !== "-1")
                  .map(([key, translated]) => (
                    <div key={key} className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-sm text-gray-600">
                        English
                      </p>
                      <p className="text-gray-900 text-base mt-1">
                        {conversations[Number(key)]?.aiResponse}
                      </p>
                      <p className="font-medium text-sm text-gray-600 mt-2">
                        {LANGUAGE_MAP[translationLanguage].name}
                      </p>
                      <p className="text-blue-600 text-base mt-1">
                        {translated}
                      </p>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => setTranslatedTexts({})}
                className="w-full text-center text-red-600 hover:text-red-800 text-sm"
              >
                Clear All Translations
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Speech;
