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
import { apiUpdateLessonProgressByLessonId } from "@/services/lesson-progress.services";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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
  const [wordScores, setWordScores] = useState<{ [key: number]: number }>({});
  const [isChecked, setIsChecked] = useState(false);
  const [totalscore, setTotalscore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
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
  console.log(totalCount);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRecordedRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext>(new AudioContext());
  const soundFileGoodRef = useRef<AudioBuffer | null>(null);
  const soundFileOkayRef = useRef<AudioBuffer | null>(null);
  const soundFileBadRef = useRef<AudioBuffer | null>(null);
  const voiceSynthRefRef = useRef<SpeechSynthesisVoice | null>(null);
  const languageFoundRef = useRef(false);
  const { userData } = useSelector((state: RootState) => state.user);

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
  const getCorrectLetterCount = (lettersCorrect: string) => {
    let correctLetterCount = 0;
    for (
      let letter_idx = 0;
      letter_idx < lettersCorrect?.length;
      letter_idx++
    ) {
      if (lettersCorrect[letter_idx] === "1") {
        correctLetterCount++;
      }
    }
    return correctLetterCount;
  };

  const currentVocab = vocabulary[currentIndex];
  const lettersCorrect = lettersOfWordAreCorrect[0];
  const cleanWord = currentVocab?.word?.replace("?", "") || "";

  // Split into words and calculate length without spaces for score
  const wordLength = cleanWord
    .split(" ")
    .reduce((sum, word) => sum + word.length, 0);
  const totalCountIsCorrect = getCorrectLetterCount(lettersCorrect);
  console.log(totalCountIsCorrect);

  const score =
    totalCountIsCorrect > 0 ? (totalCountIsCorrect / wordLength) * 100 : 0;
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
    setIsChecked(false);
    resetTranscript();
    unblockUI();
  }, [
    vocabulary,
    currentIndex,
    isPronouncingExampleSentence,
    unblockUI,
    resetTranscript,
  ]);
  const totalScoreFinal = (totalscore / (vocabulary?.length * 100)) * 100;
  console.log(lessonId);
  // Handle next item
  const handleNext = useCallback(async () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
      if (userData?._id && lessonId) {
        await apiUpdateLessonProgressByLessonId(lessonId, {
          userId: userData._id,
          score: Math.round(totalScoreFinal),
          isCompleted: true,
        });
      }
    }
    setIsRecording(false);
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
        .replace(/\s\s+/g, " "); // Ensure full phrase is preserved
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
            text: text, // Pass the full phrase
            language: AILanguage,
            input_type: "topic",
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
      console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
      setIsChecked(true);

      // Use the full IPA transcript for analysis
      const lettersCorrect = data.is_letter_correct_all_words;
      const correctLetterCount = getCorrectLetterCount(lettersCorrect);
      const wordScore =
        correctLetterCount > 0
          ? (correctLetterCount / text.split(" ").join("").length) * 100 // Adjust length calculation
          : 0;
      if (wordScore > 70) {
        setTotalCount((prev) => prev + 1);
        setCorrectCount((prev) => prev + 1);
      }

      // Store full phrase data
      setLettersOfWordAreCorrect([lettersCorrect]); // Wrap in array for consistency
      playFeedbackAudio(wordScore);
      setRecordedIpaScript(`/ ${data.ipa_transcript} /`);
      setPronunciationAccuracy(`${data.pronunciation_accuracy}%`);
      setRealTranscriptsIpa([data.real_transcripts_ipa]); // Single entry for full phrase
      setMatchedTranscriptsIpa([data.matched_transcripts_ipa]); // Single entry for full phrase
      setStartTime(data.start_time.split(" "));
      setEndTime(data.end_time.split(" "));
      setWordCategories(data.pair_accuracy_category.split(" "));
      setCurrentSoundRecorded(true);
      setWordScores((prev) => ({
        ...prev,
        [currentIndex]: wordScore,
      }));
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
  useEffect(() => {
    const total = Object.values(wordScores).reduce(
      (sum, score) => sum + score,
      0
    );
    setTotalscore(total);
  }, [wordScores]);
  // Change language
  const changeLanguage = useCallback((language: string) => {
    setAILanguage(language);
    const voices = window.speechSynthesis.getVoices();
    let languageIdentifier: string;
    let languageName: string;

    switch (language) {
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

    const word = currentTextToPronounce; // Use the full phrase
    const lettersCorrect = lettersOfWordAreCorrect[0]; // Use the first entry
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
          onClick={() => playCurrentWordPart(0)}
          className="whitespace-nowrap cursor-pointer hover:underline"
        >
          {coloredLetters}
        </a>
      </h2>
    );
  }, [
    vocabulary,
    currentIndex,
    lettersOfWordAreCorrect,
    currentTextToPronounce,
    playCurrentWordPart,
  ]);
  // Handle retry
  const handleRetry = useCallback(() => {
    setIsChecked(false);
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
    setIsRecording(false);
  }, [resetTranscript]);

  // Handle retry lesson
  const handleRetryLesson = useCallback(() => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setIsChecked(false);
    setCorrectCount(0);
    setTotalCount(0);
    setTotalscore(0);
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
    const totalScoreFinal = (totalscore / (vocabulary?.length * 100)) * 100;
    return (
      <div className="w-full h-full p-4 flex flex-col items-center justify-center">
        {score >= 60 ? (
          <>
            <h2 className="text-3xl font-bold text-green-600">Hoàn thành!</h2>
            <p className="text-lg mt-4">
              Bạn đã hoàn thành tất cả từ vựng trong bài học với{" "}
              {Math.round(totalScoreFinal)}% đúng.
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
              Bạn chỉ đạt {Math.round(totalScoreFinal)}% đúng. Điểm tối thiểu để
              hoàn thành là 60%.
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
  console.log(totalscore);
  return (
    <div className="w-full h-full flex justify-center items-start p-6 bg-gray-100">
      <div className="w-full max-w-5xl space-y-6 flex items-center flex-col">
        <div className="flex justify-end items-center w-full">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-black text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="text-center mt-20 text-lg text-red-500">{error}</div>
        )}
        <div className="flex items-center gap-3 w-full justify-around">
          <div className="flex items-center gap-4">
            <button
              onClick={playAudio}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow"
              disabled={loading || !currentTextToPronounce || isUiBlocked}
            >
              <FaVolumeUp />
              Nghe
            </button>
            <p className="text-lg text-gray-700">Nghe và nói từ hiển thị.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-1 bg-green-500 text-white rounded-xl hover:bg-green-600">
              {currentIndex + 1}/{vocabulary?.length} Bài học
            </button>
          </div>
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
                isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
              disabled={loading || !currentTextToPronounce || isUiBlocked}
            >
              <FaMicrophone />
              {isRecording ? "Đang nghe..." : "Nói"}
            </button>
          </div>
        )}

        {isChecked && (
          <div className="w-full max-w-3xl flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">
                {score > 60 ? "😊" : score >= 40 ? "😐" : "😞"}
              </span>
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {score > 60
                    ? "Excellent!"
                    : score >= 40
                    ? "Good!"
                    : "Try Again!"}
                </p>
                <p className="text-lg text-gray-600">
                  You sound {Math.max(0, Math.round(score))}% like a native
                  speaker!
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
                    strokeDasharray={`${score}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {Math.round(score)}%
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
              {score >= 70 && (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  Tiếp tục
                </button>
              )}
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
            <p className="text-gray-700">{currentMeaning}</p>
            <p className="italic text-gray-500">{currentExampleSentence}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicExercise;
