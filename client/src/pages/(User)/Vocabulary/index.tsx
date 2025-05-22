import { apiGetVocabularyByLessonId } from "@/services/vocabulary.services";
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FaVolumeUp, FaMicrophone } from "react-icons/fa";
import { apiUpdateLessonProgressByLessonId } from "@/services/lesson-progress.services";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";

// Levenshtein distance for approximate matching
const levenshteinDistance = (a, b) => {
  const matrix = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
};

// Normalize phonemes to handle common variations
const normalizePhoneme = (phoneme) => {
  const phonemeMap = {
    // Vowels (Short and Long)
    æ: "a", // /æ/ as in "cat" (American English)
    ɑ: "a", // /ɑ/ as in "father" (American English)
    ɒ: "o", // /ɒ/ as in "hot" (British English)
    ɔ: "o", // /ɔ/ as in "caught" (American English)
    ɔː: "o", // /ɔː/ as in "thought" (British English)
    ɛ: "e", // /ɛ/ as in "bet"
    e: "e", // /e/ as in some dialects (less common)
    ɪ: "i", // /ɪ/ as in "bit"
    i: "i", // /i/ as in "see" (long /iː/)
    ɪ̈: "i", // Centralized /ɪ/ (dialectal)
    ʊ: "u", // /ʊ/ as in "put"
    u: "u", // /u/ as in "food" (long /uː/)
    ʌ: "u", // /ʌ/ as in "cup" (American English)
    ə: "u", // /ə/ as in "about" (schwa)
    ɜː: "u", // /ɜː/ as in "bird" (British English, rhotic)
    ɝ: "u", // /ɝ/ as in "bird" (American English, rhotic)
    ɚ: "u", // /ɚ/ as in "butter" (American English, rhotic)

    // Diphthongs
    aɪ: "ai", // /aɪ/ as in "ride"
    eɪ: "ei", // /eɪ/ as in "day"
    oɪ: "oi", // /oɪ/ as in "boy"
    aʊ: "au", // /aʊ/ as in "out"
    oʊ: "ou", // /oʊ/ as in "go" (American English)
    ʊə: "ua", // /ʊə/ as in "poor" (British English)

    // Consonants
    p: "p", // /p/ as in "pin"
    b: "b", // /b/ as in "bin"
    t: "t", // /t/ as in "tin"
    d: "d", // /d/ as in "din"
    k: "k", // /k/ as in "cat"
    ɡ: "g", // /ɡ/ as in "go"
    f: "f", // /f/ as in "fan"
    v: "v", // /v/ as in "van"
    θ: "th", // /θ/ as in "think" (voiceless th)
    ð: "dh", // /ð/ as in "this" (voiced th)
    s: "s", // /s/ as in "see"
    z: "z", // /z/ as in "zoo"
    ʃ: "sh", // /ʃ/ as in "shoe"
    ʒ: "zh", // /ʒ/ as in "measure"
    h: "h", // /h/ as in "hat"
    m: "m", // /m/ as in "man"
    n: "n", // /n/ as in "no"
    ŋ: "ng", // /ŋ/ as in "sing"
    l: "l", // /l/ as in "love"
    r: "r", // /r/ as in "red"
    j: "y", // /j/ as in "yes"
    w: "w", // /w/ as in "we"
    tʃ: "ch", // /tʃ/ as in "church"
    dʒ: "j", // /dʒ/ as in "judge"

    // Diacritics and Modifiers (now quoted)
    "˘": "", // Remove short marker
    ː̃: "", // Remove nasalized length marker
    "̃": "", // Remove nasalization marker
    ʰ: "", // Remove aspiration marker
    ʷ: "", // Remove labialization marker
    ˠ: "", // Remove velarization marker

    // Rare or Dialectal Variants
    ɐ: "a", // /ɐ/ as in some Australian English vowels
    ʉ: "u", // /ʉ/ as in some non-rhotic accents
    ɘ: "e", // /ɘ/ as in centralized mid vowel
    ɤ: "o", // /ɤ/ as in some dialects
    ʏ: "i", // /ʏ/ as in some European English dialects
  };
  return phonemeMap[phoneme] || phoneme; // Return original phoneme if no mapping exists
};

// Parse IPA phonetic transcription into phonemes
const parseIPAPhonemes = (ipa) => {
  const cleaned = ipa.replace(/\/|\[|\]/g, "");
  // Updated regex to include all phonemes (consonants, vowels, diphthongs)
  const phonemes = cleaned
    .split(/(?=[pbtdkɡfvszʃʒhɒɔæʌɑɪʊuɛeɪoʊaʊaɪɝɚɜθðŋmnlrjwː])/)
    .filter(Boolean)
    .map(normalizePhoneme);
  return phonemes;
};

// Get phonemes from Dictionary API
const getPhonemesFromAPI = async (word) => {
  try {
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const dictData = response.data[0];
    const phonetic = dictData.phonetic || dictData.phonetics[0]?.text || word;
    const phonemes = parseIPAPhonemes(phonetic);
    return phonemes;
  } catch (error) {
    console.error(`Error fetching phonemes for ${word}:`, error);
    return word.toLowerCase().split(""); // Fallback to character split
  }
};

// Compare phonemes with approximate matching
const comparePhonemes = (expectedPhonemes, spokenPhonemes) => {
  const results = expectedPhonemes.map((phoneme, index) => {
    const spokenPhoneme =
      index < spokenPhonemes.length ? spokenPhonemes[index] : null;
    const distance = spokenPhoneme
      ? levenshteinDistance(phoneme, spokenPhoneme)
      : Infinity;
    const isCorrect = distance <= 2; // Increased threshold for more flexibility
    return {
      phoneme,
      letter: spokenPhoneme,
      isCorrect,
    };
  });
  return results;
};

// Map phonemes to word characters for display
const mapPhonemesToLetters = (word, phonemeResults) => {
  const letters = word.toLowerCase().split("");
  return letters.map((letter, index) => ({
    letter,
    isCorrect:
      index < phonemeResults.length ? phonemeResults[index].isCorrect : true,
  }));
};

const Vocabulary = () => {
  const [vocabulary, setVocabulary] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [phonemeFeedback, setPhonemeFeedback] = useState([]);
  const [phonemeScore, setPhonemeScore] = useState(0);
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const { lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const lesson = location.state?.lesson;
  const lessonIndex = location.state?.lessonIndex;
  console.log("Phoneme Feedback:", phonemeFeedback);
  const { userData } = useSelector((state: RootState) => state.user);
  const isSpeakingLesson = lessonIndex % 2 === 0;
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();
  const previousTranscript = useRef("");

  const getVocabularyByLessonId = async (lessonId) => {
    try {
      const response = await apiGetVocabularyByLessonId(lessonId);
      if (response?.data && !isSpeakingLesson) {
        const updatedVocabulary = await Promise.all(
          response.data.map(async (item) => {
            try {
              const dictResponse = await axios.get(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${item.word}`
              );
              const dictData = dictResponse.data[0];
              const phonetic =
                dictData.phonetic ||
                dictData.phonetics[0]?.text ||
                item.phonetic;
              const audioUrl =
                dictData.phonetics.find((p) => p.audio)?.audio || item.audioUrl;
              const phonemes = await getPhonemesFromAPI(item.word);
              return {
                ...item,
                phonetic,
                audioUrl,
                phonemes,
              };
            } catch (error) {
              console.error(
                `Error fetching dictionary data for ${item.word}:`,
                error
              );
              return {
                ...item,
                phonemes: item.word.toLowerCase().split(""),
              };
            }
          })
        );
        setVocabulary(updatedVocabulary);
      } else {
        setVocabulary(response.data);
      }
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    }
  };

  const shuffleOptions = useCallback(
    (currentIdx) => {
      const options = [];
      const correctIdx = currentIdx % 2 === 0 ? currentIdx : currentIdx - 1;
      const wrongIdx = correctIdx + 1;

      const correctVocab = vocabulary[correctIdx];
      const wrongVocab = vocabulary[wrongIdx];

      options.push({ ...correctVocab, isCorrect: true });
      options.push({ ...wrongVocab, isCorrect: false });

      return options.sort(() => 0.5 - Math.random());
    },
    [vocabulary]
  );

  useEffect(() => {
    getVocabularyByLessonId(lessonId);
  }, [lessonId]);

  useEffect(() => {
    if (vocabulary.length > 0 && isSpeakingLesson) {
      const evenIndex = currentPairIndex * 2;
      setShuffledOptions(shuffleOptions(evenIndex));
    }
  }, [vocabulary, currentPairIndex, isSpeakingLesson, shuffleOptions]);

  const handlePlayAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  const handleStartListening = () => {
    if (
      !isSpeakingLesson &&
      browserSupportsSpeechRecognition &&
      isMicrophoneAvailable &&
      !listening
    ) {
      resetTranscript();
      setIsChecked(false);
      setIsCorrect(null);
      setPhonemeFeedback([]);
      setPhonemeScore(0);
      SpeechRecognition.startListening({
        continuous: false,
        language: "en-US",
      });
    }
  };

  const evaluateSpeech = async () => {
    const baseIndex = currentPairIndex * 2;
    const currentVocab = vocabulary[baseIndex];
    const spokenWord = transcript.toLowerCase().trim();

    const expectedPhonemes =
      currentVocab.phonemes || (await getPhonemesFromAPI(currentVocab.word));
    const spokenPhonemes = await getPhonemesFromAPI(spokenWord);

    console.log("Expected Phonemes:", expectedPhonemes); // Debug
    console.log("Spoken Phonemes:", spokenPhonemes); // Debug

    const phonemeResults = comparePhonemes(expectedPhonemes, spokenPhonemes);
    const letterFeedback = mapPhonemesToLetters(
      currentVocab.word,
      phonemeResults
    );
    setPhonemeFeedback(letterFeedback);

    const correctPhonemes = phonemeResults.filter((r) => r.isCorrect).length;
    const phonemeScore = (correctPhonemes / phonemeResults.length) * 100 || 0;
    setPhonemeScore(phonemeScore);

    setIsCorrect(
      phonemeScore >= 80
        ? "correct"
        : phonemeScore >= 60
        ? "nearly"
        : "incorrect"
    );
    setIsChecked(true);
    setTotalCount((prev) => prev + 1);

    if (phonemeScore >= 80) {
      setCorrectCount((prev) => prev + 1);
    }

    try {
      await apiUpdateLessonProgressByLessonId(lessonId, {
        userId: userData?._id,
        score: Math.round(phonemeScore),
        isCompleted: false,
      });
    } catch (error) {
      console.error("Error updating lesson progress:", error);
    }
  };

  useEffect(() => {
    if (
      !isSpeakingLesson &&
      listening &&
      transcript !== previousTranscript.current
    ) {
      const words = transcript.trim().split(/\s+/);
      if (words.length === 1 && transcript.trim().length > 0) {
        SpeechRecognition.stopListening();
        evaluateSpeech();
      }
      previousTranscript.current = transcript;
    }
  }, [transcript, listening, isSpeakingLesson]);

  const handleCheck = () => {
    if (isSpeakingLesson && selectedOption) {
      const evenIndex = currentPairIndex * 2;
      const correctVocab = vocabulary[evenIndex];
      const isCorrectAnswer =
        selectedOption._id === correctVocab._id && selectedOption.isCorrect;
      setIsCorrect(isCorrectAnswer ? "correct" : "incorrect");
      setIsChecked(true);
      setTotalCount((prev) => prev + 1);
      if (isCorrectAnswer) {
        setCorrectCount((prev) => prev + 1);
      }
    }
  };

  const handleNext = async () => {
    const maxPairs = Math.ceil(vocabulary.length / 2);
    if (currentPairIndex < maxPairs - 1) {
      setCurrentPairIndex(currentPairIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setIsChecked(false);
      setPhonemeFeedback([]);
      setPhonemeScore(0);
      resetTranscript();
    } else {
      setIsCompleted(true);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setIsChecked(false);
    setPhonemeFeedback([]);
    setPhonemeScore(0);
    resetTranscript();
    if (isSpeakingLesson) {
      const evenIndex = currentPairIndex * 2;
      setShuffledOptions(shuffleOptions(evenIndex));
    }
  };

  const handleRetryLesson = () => {
    setIsCompleted(false);
    setCurrentPairIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setIsChecked(false);
    setPhonemeFeedback([]);
    setPhonemeScore(0);
    resetTranscript();
    if (isSpeakingLesson) {
      setShuffledOptions(shuffleOptions(0));
    }
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

  const baseIndex = currentPairIndex * 2;
  const currentVocab = vocabulary[baseIndex];

  if (isCompleted) {
    const totalVocabs = Math.ceil(vocabulary.length / 2);
    const score = (correctCount / totalVocabs) * 100;
    try {
      apiUpdateLessonProgressByLessonId(lessonId, {
        userId: userData?._id,
        score: Math.round(score),
        isCompleted: true,
      });
    } catch (error) {
      console.error("Error updating lesson progress:", error);
    }

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
          <p className="text-lg text-gray-700">
            {isSpeakingLesson
              ? "Nghe và chọn từ khớp với âm thanh."
              : "Nghe và nói từ hiển thị."}
          </p>
        </div>

        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-full max-w-3xl text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">
            {phonemeFeedback.length > 0
              ? phonemeFeedback.map((item, index) => (
                  <span
                    key={index}
                    style={{
                      textDecoration: !item.isCorrect
                        ? "underline red"
                        : "none",
                    }}
                  >
                    {item.letter}
                  </span>
                ))
              : currentVocab.word}
          </h2>
          <p className="text-blue-600 text-xl">
            {currentVocab.phonetic || "N/A"}
          </p>
        </div>

        {!isSpeakingLesson && !isChecked && (
          <div className="w-full max-w-3xl flex justify-center">
            <button
              onClick={handleStartListening}
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

        {isChecked && !isSpeakingLesson && (
          <div className="w-full max-w-3xl flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">😊</span>
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {phonemeScore >= 80
                    ? "Excellent!"
                    : phonemeScore >= 60
                    ? "Good!"
                    : "Try Again!"}
                </p>
                <p className="text-lg text-gray-600">
                  You sound {Math.round(phonemeScore)}% like a native speaker!
                </p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="text-green-500"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
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

        {isSpeakingLesson && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
            {shuffledOptions.map((option) => {
              const isSelected = selectedOption?._id === option._id;
              const correct = option.isCorrect;

              let styles = "border-gray-300 bg-white";
              if (isChecked && isSelected) {
                styles = correct
                  ? "border-green-500 bg-green-100"
                  : "border-red-500 bg-red-100";
              } else if (isSelected) {
                styles = "border-blue-500 bg-blue-50";
              }

              return (
                <button
                  key={option._id}
                  onClick={() => {
                    handlePlayAudio(option.audioUrl);
                    setSelectedOption(option);
                    setIsChecked(false);
                  }}
                  disabled={isChecked}
                  className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition ${styles} hover:bg-gray-100`}
                >
                  <FaVolumeUp />
                  <span className="font-medium">Phát âm</span>
                </button>
              );
            })}
          </div>
        )}

        {isSpeakingLesson && !isChecked && (
          <div className="w-full max-w-3xl flex justify-center">
            <button
              onClick={handleCheck}
              disabled={!selectedOption}
              className={`px-6 py-2 rounded-full font-medium ${
                !selectedOption
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Kiểm tra
            </button>
          </div>
        )}

        {isSpeakingLesson && isChecked && (
          <div className="w-full max-w-3xl flex flex-col items-center gap-3">
            <p
              className={`text-lg font-semibold ${
                isCorrect === "correct" ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect === "correct" ? "🎯 Chính xác!" : "❌ Sai rồi!"}
            </p>
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
