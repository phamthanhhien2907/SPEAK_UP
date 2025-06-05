import { useEffect, useState, useRef, useCallback, JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaVolumeUp, FaMicrophone } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { apiGetVocabularyByLessonId } from "@/services/vocabulary.services";
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
  __v: number;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa kiểu dữ liệu cho kết quả phân tích phát âm
interface PronunciationAnalysisResult {
  accuracy: number;
  ipa_accuracy: { [key: string]: number };
  ipa_transcript: string;
  pronunciation_accuracy: string;
  real_transcripts_ipa: string;
  matched_transcripts_ipa: string;
  is_letter_correct_all_words: string;
  pair_accuracy_category: string;
  start_time: string;
  end_time: string;
  error?: string;
}

const API_MAIN_PATH_STS = "http://127.0.0.1:3000";
const ST_SCORE_API_KEY = "rll5QsTiv83nti99BW6uCmvs9BDVxSB39SVFceYb";
const ACCURACY_COLORS = ["green", "orange", "red"];
const BAD_SCORE_THRESHOLD = 30;
const MEDIUM_SCORE_THRESHOLD = 70;

const mediaStreamConstraints = {
  audio: {
    channelCount: 1,
    sampleRate: 48000,
  },
};

const TopicExercise = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
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
  const [isRecording, setIsRecording] = useState(false);
  const [currentTextToPronounce, setCurrentTextToPronounce] =
    useState<string>("");
  const [currentDisplayWord, setCurrentDisplayWord] = useState<string>("");
  const [currentIpa, setCurrentIpa] = useState<string>("");
  const [currentMeaning, setCurrentMeaning] = useState<string>("");
  const [currentExampleSentence, setCurrentExampleSentence] =
    useState<string>("");
  const [pronunciationAccuracy, setPronunciationAccuracy] = useState<
    string | null
  >(null);
  const [recordedIpaScript, setRecordedIpaScript] = useState<string | null>(
    null
  );
  const [realTranscriptsIpa, setRealTranscriptsIpa] = useState<string[]>([]);
  const [matchedTranscriptsIpa, setMatchedTranscriptsIpa] = useState<string[]>(
    []
  );
  const [wordCategories, setWordCategories] = useState<string[]>([]);
  const [lettersOfWordAreCorrect, setLettersOfWordAreCorrect] = useState<
    string[]
  >([]);
  const [startTime, setStartTime] = useState<string[]>([]);
  const [endTime, setEndTime] = useState<string[]>([]);
  const [currentSoundRecorded, setCurrentSoundRecorded] = useState(false);
  const [AILanguage, setAILanguage] = useState("en");
  const [isPronouncingExampleSentence, setIsPronouncingExampleSentence] =
    useState(false);
  const [isUiBlocked, setIsUiBlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRecordedRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext>(new AudioContext());
  const soundFileGoodRef = useRef<AudioBuffer | null>(null);
  const soundFileOkayRef = useRef<AudioBuffer | null>(null);
  const soundFileBadRef = useRef<AudioBuffer | null>(null);
  const voiceSynthRefRef = useRef<SpeechSynthesisVoice | null>(null);
  const languageFoundRef = useRef(false);

  const {
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // UI Control Functions
  const blockUI = useCallback(() => setIsUiBlocked(true), []);
  const unblockUI = useCallback(() => setIsUiBlocked(false), []);
  const uiError = useCallback(
    (message: string | null = null) => {
      blockUI();
      setError(
        message ||
          "Server error. Please try again or check server logs for details."
      );
      setTimeout(unblockUI, 2000);
    },
    [blockUI, unblockUI]
  );
  const uiRecordingError = useCallback(() => {
    unblockUI();
    setError("Recording error, please try again or restart page.");
  }, [unblockUI]);

  // Cache sound files
  const cacheSoundFiles = useCallback(async () => {
    try {
      const fetchAndDecode = async (url: string) => {
        console.log(`Fetching audio file: ${url}`); // Debug
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return audioContextRef.current.decodeAudioData(arrayBuffer);
      };

      const soundFiles = [
        { ref: soundFileGoodRef, path: ASR_bad },
        { ref: soundFileOkayRef, path: ASR_okay },
        { ref: soundFileBadRef, path: ASR_good },
      ];

      for (const { ref, path } of soundFiles) {
        if (!ref.current) {
          try {
            ref.current = await fetchAndDecode(path);
          } catch (e) {
            console.error(`Failed to load ${path}:`, e);
          }
        }
      }
    } catch (e) {
      console.error("Failed to cache sound files:", e);
      uiError("Failed to load feedback sounds. Feedback audio may not play.");
    }
  }, [uiError]);

  // Fetch vocabulary
  const getTopicExercises = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGetVocabularyByLessonId(id);
      if (response?.data) {
        setVocabulary(response.data);
        setCurrentIndex(0);
        if (response.data.length > 0) {
          const firstItem = response.data[0];
          setCurrentDisplayWord(firstItem.word);
          setCurrentTextToPronounce(firstItem.word);
          setCurrentIpa(firstItem.phonetic);
          setCurrentMeaning(firstItem.meaning);
          setCurrentExampleSentence(firstItem.exampleSentence);
          setIsPronouncingExampleSentence(false);
        } else {
          setCurrentDisplayWord("No vocabulary found for this lesson.");
          setCurrentTextToPronounce("");
          setCurrentIpa("");
          setCurrentMeaning("");
          setCurrentExampleSentence("");
        }
      }
    } catch (err: any) {
      console.error("Error fetching topic exercises:", err);
      setError(`Failed to load vocabulary: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update current item display
  const updateCurrentItemDisplay = useCallback(() => {
    if (vocabulary.length === 0) return;
    const currentItem = vocabulary[currentIndex];

    setCurrentDisplayWord(currentItem.word);
    setCurrentIpa(currentItem.phonetic);
    setCurrentMeaning(currentItem.meaning);
    setCurrentExampleSentence(currentItem.exampleSentence);
    setCurrentTextToPronounce(
      isPronouncingExampleSentence
        ? currentItem.exampleSentence
        : currentItem.word
    );

    setPronunciationAccuracy(null);
    setRecordedIpaScript(null);
    setRealTranscriptsIpa([]);
    setMatchedTranscriptsIpa([]);
    setWordCategories([]);
    setLettersOfWordAreCorrect([]);
    setStartTime([]);
    setEndTime([]);
    setCurrentSoundRecorded(false);
    setIsCorrect(null);
    setIsChecked(false);
    setPhonemeScore(0);
    resetTranscript();
    unblockUI();
  }, [
    vocabulary,
    currentIndex,
    isPronouncingExampleSentence,
    unblockUI,
    resetTranscript,
  ]);

  // Handle next item
  const handleNext = useCallback(async () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  }, [currentIndex, vocabulary.length]);

  // Convert blob to base64
  const convertBlobToBase64 = useCallback(
    (blob: Blob): Promise<string | ArrayBuffer | null> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    []
  );

  // Play feedback audio
  const playFeedbackAudio = useCallback((score: number) => {
    let audioSrc;
    if (score < BAD_SCORE_THRESHOLD) {
      audioSrc = ASR_bad;
    } else if (score <= MEDIUM_SCORE_THRESHOLD) {
      audioSrc = ASR_okay;
    } else {
      audioSrc = ASR_good;
    }
    const audio = new Audio(audioSrc);
    audio
      .play()
      .catch((error) => console.error("Error playing feedback audio:", error));
  }, []);

  // Process recorded audio
  const processRecordedAudio = useCallback(async () => {
    blockUI();
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);
    audioRecordedRef.current = new Audio(audioUrl);
    const audioBase64 = await convertBlobToBase64(audioBlob);

    if (typeof audioBase64 !== "string" || audioBase64.length < 6) {
      uiRecordingError();
      return;
    }

    try {
      const text = currentTextToPronounce
        .replace(/<[^>]*>?/gm, "")
        .trim()
        .replace(/\s\s+/g, " ");
      if (!text) {
        uiError("No text provided for pronunciation analysis");
        return;
      }

      const response = await fetch(
        `${API_MAIN_PATH_STS}/GetAccuracyFromRecordedAudio`,
        {
          method: "POST",
          body: JSON.stringify({
            recorded_audio: audioBase64,
            text: text,
            language: AILanguage,
          }),
          headers: {
            "X-Api-Key": ST_SCORE_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: PronunciationAnalysisResult = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const score = parseFloat(data.pronunciation_accuracy);
      setPhonemeScore(score);
      setIsCorrect(
        score > 60 ? "correct" : score >= 40 ? "nearly" : "incorrect"
      );
      setIsChecked(true);
      setTotalCount((prev) => prev + 1);
      if (score > 60) {
        setCorrectCount((prev) => prev + 1);
      }

      playFeedbackAudio(score);

      setRecordedIpaScript(`/ ${data.ipa_transcript} /`);
      setPronunciationAccuracy(`${data.pronunciation_accuracy}%`);
      setRealTranscriptsIpa(data.real_transcripts_ipa.split(" "));
      setMatchedTranscriptsIpa(data.matched_transcripts_ipa.split(" "));
      setLettersOfWordAreCorrect(data.is_letter_correct_all_words.split(" "));
      setStartTime(data.start_time.split(" "));
      setEndTime(data.end_time.split(" "));
      setWordCategories(data.pair_accuracy_category.split(" "));
      setCurrentSoundRecorded(true);

      unblockUI();
    } catch (e: any) {
      console.error("Audio processing error:", e);
      uiError(`Failed to process audio: ${e.message}`);
    }
  }, [
    blockUI,
    unblockUI,
    convertBlobToBase64,
    currentTextToPronounce,
    AILanguage,
    uiError,
    uiRecordingError,
    playFeedbackAudio,
  ]);

  // Start recording
  const startMediaRecorder = useCallback(async () => {
    setIsRecording(true);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        mediaStreamConstraints
      );
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = processRecordedAudio;
      mediaRecorderRef.current.start();
      blockUI();
      SpeechRecognition.startListening({
        continuous: false,
        language: `${AILanguage}-US`,
      });
      setTimeout(() => {
        mediaRecorderRef.current?.stop();
        SpeechRecognition.stopListening();
      }, 3000);
    } catch (e: any) {
      console.error("Media device error on record:", e);
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
        uiError(
          "Microphone access denied. Please allow microphone permissions."
        );
      } else {
        uiError(`Failed to access media device: ${e.message}`);
      }
    }
  }, [blockUI, uiError, processRecordedAudio, AILanguage]);

  // Stop recording
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      SpeechRecognition.stopListening();
    }
  }, []);

  // Handle speak button
  const handleStartSpeaking = useCallback(() => {
    if (
      browserSupportsSpeechRecognition &&
      isMicrophoneAvailable &&
      !listening
    ) {
      resetTranscript();
      setIsChecked(false);
      setIsCorrect(null);
      setPhonemeScore(0);
      startMediaRecorder();
    }
  }, [
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    listening,
    resetTranscript,
    startMediaRecorder,
  ]);

  // Play reference audio
  const playAudio = useCallback(() => {
    blockUI();
    const textToSpeak = isPronouncingExampleSentence
      ? currentExampleSentence
      : currentDisplayWord;
    if (!textToSpeak) {
      unblockUI();
      console.warn("No text to speak.");
      return;
    }
    if (languageFoundRef.current && voiceSynthRefRef.current) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.voice = voiceSynthRefRef.current;
      utterance.rate = 0.7;
      utterance.onend = () => unblockUI();
      window.speechSynthesis.speak(utterance);
    } else {
      unblockUI();
      console.warn(
        "Native speech synthesis not available or language not found."
      );
    }
  }, [
    blockUI,
    unblockUI,
    isPronouncingExampleSentence,
    currentDisplayWord,
    currentExampleSentence,
  ]);

  // Play recorded audio
  const playRecording = useCallback(
    async (start: number | null = null, end: number | null = null) => {
      blockUI();
      if (!audioRecordedRef.current) {
        unblockUI();
        return;
      }
      audioRecordedRef.current.onended = () => {
        unblockUI();
        audioRecordedRef.current!.currentTime = 0;
      };
      if (start === null || end === null) {
        await audioRecordedRef.current.play();
      } else {
        audioRecordedRef.current.currentTime = start;
        await audioRecordedRef.current.play();
        const durationInMs = (end - start) * 1000;
        setTimeout(() => {
          audioRecordedRef.current?.pause();
          audioRecordedRef.current!.currentTime = 0;
          unblockUI();
        }, durationInMs);
      }
    },
    [blockUI, unblockUI]
  );

  // Play word part
  const playCurrentWordPart = useCallback(
    (wordIdx: number) => {
      const textToSpeak = isPronouncingExampleSentence
        ? currentExampleSentence
        : currentDisplayWord;
      if (!textToSpeak) return;
      const wordPart = textToSpeak.split(" ")[wordIdx];
      if (wordPart && languageFoundRef.current && voiceSynthRefRef.current) {
        blockUI();
        const utterance = new SpeechSynthesisUtterance(wordPart);
        utterance.voice = voiceSynthRefRef.current;
        utterance.rate = 0.7;
        utterance.onend = () => unblockUI();
        window.speechSynthesis.speak(utterance);
      } else {
        console.warn(
          "Could not play word part: Native speech synthesis not available."
        );
        unblockUI();
      }
    },
    [
      isPronouncingExampleSentence,
      currentExampleSentence,
      currentDisplayWord,
      blockUI,
      unblockUI,
    ]
  );

  const playRecordedWordPart = useCallback(
    (word_idx: number) => {
      if (startTime.length > word_idx && endTime.length > word_idx) {
        const wordStartTime = parseFloat(startTime[word_idx]);
        const wordEndTime = parseFloat(endTime[word_idx]);
        playRecording(wordStartTime, wordEndTime);
      }
    },
    [startTime, endTime, playRecording]
  );

  const playNativeAndRecordedWordPart = useCallback(
    (word_idx: number) => {
      const isNative = !isRecording; // Toggle between native and recorded
      if (isNative) {
        playCurrentWordPart(word_idx);
      } else {
        playRecordedWordPart(word_idx);
      }
    },
    [isRecording, playCurrentWordPart, playRecordedWordPart]
  );

  // Change language
  const changeLanguage = useCallback((language: string) => {
    setAILanguage(language);
    const voices = window.speechSynthesis.getVoices();
    let languageIdentifier: string;
    let languageName: string;

    switch (language) {
      case "de":
        languageIdentifier = "de";
        languageName = "Anna";
        break;
      case "en":
      default:
        languageIdentifier = "en";
        languageName = "Daniel";
        break;
    }

    languageFoundRef.current = false;
    for (const voice of voices) {
      if (
        voice.lang.startsWith(languageIdentifier) &&
        voice.name === languageName
      ) {
        voiceSynthRefRef.current = voice;
        languageFoundRef.current = true;
        break;
      }
    }
    if (!languageFoundRef.current) {
      for (const voice of voices) {
        if (voice.lang.startsWith(languageIdentifier)) {
          voiceSynthRefRef.current = voice;
          languageFoundRef.current = true;
          break;
        }
      }
    }
  }, []);

  // Render colored text
  const renderColoredText = useCallback(() => {
    const textToDisplay = isPronouncingExampleSentence
      ? currentExampleSentence
      : currentDisplayWord;
    if (!textToDisplay || !lettersOfWordAreCorrect.length) {
      return (
        <p className="text-3xl font-bold text-gray-800">{textToDisplay}</p>
      );
    }

    const textWords = textToDisplay.split(" ");
    const coloredWordsHtml: JSX.Element[] = [];

    for (let word_idx = 0; word_idx < textWords.length; word_idx++) {
      const wordTemp: JSX.Element[] = [];
      const word = textWords[word_idx];
      const lettersCorrect = lettersOfWordAreCorrect[word_idx];

      for (let letter_idx = 0; letter_idx < word.length; letter_idx++) {
        const letterIsCorrect = lettersCorrect?.[letter_idx] === "1";
        const colorClass = letterIsCorrect ? "text-green-600" : "text-red-600";
        wordTemp.push(
          <span key={`${word_idx}-${letter_idx}`} className={colorClass}>
            {word[letter_idx]}
          </span>
        );
      }
      coloredWordsHtml.push(
        <a
          key={`word-${word_idx}`}
          onClick={() => playNativeAndRecordedWordPart(word_idx)}
          className="whitespace-nowrap cursor-pointer hover:underline mx-0.5"
        >
          {wordTemp}
        </a>
      );
      coloredWordsHtml.push(<span key={`space-${word_idx}`}> </span>);
    }
    return (
      <p className="text-3xl font-bold text-gray-800">{coloredWordsHtml}</p>
    );
  }, [
    currentDisplayWord,
    currentExampleSentence,
    isPronouncingExampleSentence,
    lettersOfWordAreCorrect,
    playNativeAndRecordedWordPart,
  ]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setIsCorrect(null);
    setIsChecked(false);
    setPhonemeScore(0);
    setPronunciationAccuracy(null);
    setRecordedIpaScript(null);
    setRealTranscriptsIpa([]);
    setMatchedTranscriptsIpa([]);
    setWordCategories([]);
    setLettersOfWordAreCorrect([]);
    setStartTime([]);
    setEndTime([]);
    setCurrentSoundRecorded(false);
    resetTranscript();
  }, [resetTranscript]);

  // Handle retry lesson
  const handleRetryLesson = useCallback(() => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setIsCorrect(null);
    setIsChecked(false);
    setPhonemeScore(0);
    setCorrectCount(0);
    setTotalCount(0);
    resetTranscript();
  }, [resetTranscript]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Effects
  useEffect(() => {
    const initializeApp = async () => {
      await cacheSoundFiles();
      await getTopicExercises(lessonId);
      setAILanguage("en"); // Set language to English
      const voices = window.speechSynthesis.getVoices();
      for (const voice of voices) {
        if (voice.lang.startsWith("en") && voice.name === "Daniel") {
          voiceSynthRefRef.current = voice;
          languageFoundRef.current = true;
          break;
        }
      }
      if (!languageFoundRef.current) {
        for (const voice of voices) {
          if (voice.lang.startsWith("en")) {
            voiceSynthRefRef.current = voice;
            languageFoundRef.current = true;
            break;
          }
        }
      }
    };
    initializeApp();

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [cacheSoundFiles, getTopicExercises, lessonId]);

  useEffect(() => {
    updateCurrentItemDisplay();
  }, [currentIndex, isPronouncingExampleSentence, updateCurrentItemDisplay]);

  // Render
  if (loading) {
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-black text-2xl font-bold"
          >
            ✕
          </button>
          <div className="relative inline-block text-left">
            <div className="relative inline-block text-left">
              <span className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700">
                Language: <span className="font-semibold ml-1">English</span>
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 bg-red-100 border border-red-400 p-3 rounded-md">
            Error: {error}
          </p>
        )}

        {/* Score and Sample Info */}
        <div className="flex justify-between items-center bg-blue-100 p-4 rounded-lg shadow-sm">
          <span className="text-lg font-medium text-blue-800">
            Score: <span className="font-bold">{correctCount}</span> /{" "}
            <span className="text-gray-600">{totalCount} samples</span>
          </span>
          {pronunciationAccuracy && (
            <span
              className={`text-xl font-bold ${
                parseFloat(pronunciationAccuracy) < BAD_SCORE_THRESHOLD
                  ? "text-red-600"
                  : parseFloat(pronunciationAccuracy) < MEDIUM_SCORE_THRESHOLD
                  ? "text-orange-500"
                  : "text-green-600"
              }`}
            >
              {pronunciationAccuracy}
            </span>
          )}
        </div>

        {/* Pronunciation Mode Selection */}
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-full max-w-3xl space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">
            Choose what to pronounce:
          </h3>
          <div className="flex items-center space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="pronounceMode"
                checked={!isPronouncingExampleSentence}
                onChange={() => setIsPronouncingExampleSentence(false)}
                disabled={loading || isUiBlocked}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-base text-gray-800">
                Pronounce Word/Phrase:{" "}
                <strong className="text-blue-700">{currentDisplayWord}</strong>
              </span>
            </label>
            {/* <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="pronounceMode"
                checked={isPronouncingExampleSentence}
                onChange={() => setIsPronouncingExampleSentence(true)}
                disabled={loading || !currentExampleSentence || isUiBlocked}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-base text-gray-800">
                Pronounce Sentence:{" "}
                <strong className="text-blue-700">
                  {currentExampleSentence}
                </strong>
              </span>
            </label> */}
          </div>
        </div>

        {/* Text to Pronounce */}
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-full max-w-3xl text-center space-y-2">
          {renderColoredText()}
          {currentIpa && !isPronouncingExampleSentence && (
            <p className="text-blue-600 text-xl">/ {currentIpa} /</p>
          )}
        </div>

        {/* Action Buttons */}
        {!isChecked && (
          <div className="w-full max-w-3xl flex justify-center gap-4">
            <button
              onClick={playAudio}
              disabled={loading || !currentTextToPronounce || isUiBlocked}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow disabled:opacity-50"
            >
              <FaVolumeUp />
              Nghe
            </button>
            <button
              onClick={handleStartSpeaking}
              disabled={loading || !currentTextToPronounce || isUiBlocked}
              className={`flex items-center gap-2 px-6 py-3 rounded-full shadow ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white disabled:opacity-50`}
            >
              <FaMicrophone />
              {isRecording ? "Đang nghe..." : "Nói"}
            </button>
            <button
              onClick={() => playRecording()}
              disabled={!currentSoundRecorded || isUiBlocked}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"
            >
              <FaVolumeUp />
              Phát lại
            </button>
          </div>
        )}

        {/* Feedback Section */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Reference IPA:
                </h3>
                <p className="text-gray-600 text-lg font-mono">
                  {currentIpa && !isPronouncingExampleSentence
                    ? `/ ${currentIpa} /`
                    : "N/A"}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Spoken IPA:
                </h3>
                <p className="text-gray-600 text-lg font-mono">
                  {recordedIpaScript || "Record to see your IPA"}
                </p>
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

        {/* Extra Info */}
        <div className="w-full max-w-3xl flex justify-center">
          <button
            onClick={() => setShowExtraInfo(!showExtraInfo)}
            className="text-blue-600 hover:underline"
          >
            {showExtraInfo ? "Ẩn thông tin bổ sung" : "Thông tin bổ sung"}
          </button>
        </div>

        {showExtraInfo && (
          <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-full max-w-3xl space-y-2">
            <p className="text-gray-700">
              <strong>Meaning:</strong> {currentMeaning}
            </p>
            <p className="italic text-gray-500">
              <strong>Example Sentence:</strong> {currentExampleSentence}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicExercise;
