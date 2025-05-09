import { apiGetVocabularyByLessonId } from "@/services/vocabulary.services";
import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FaVolumeUp } from "react-icons/fa";
import { apiUpdateLessonProgressByLessonId } from "@/services/lesson-progress.services";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const Vocabulary = () => {
  const [vocabulary, setVocabulary] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const lesson = location.state;
  const { userData } = useSelector((state: RootState) => state.user);

  // Lấy danh sách từ vựng
  const getVocabularyByLessonId = async (lessonId) => {
    try {
      const response = await apiGetVocabularyByLessonId(lessonId);
      console.log(response?.data);
      if (response?.data) {
        const updatedVocabulary = response.data.map((item, index) => ({
          ...item,
          isCorrect: index % 2 === 0,
        }));
        setVocabulary(updatedVocabulary);
      }
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    }
  };

  // Xáo trộn các lựa chọn âm thanh
  const shuffleOptions = (currentVocab, currentIdx) => {
    const options = [];
    const correctIdx = currentIdx % 2 === 0 ? currentIdx : currentIdx - 1;
    const wrongIdx = correctIdx + 1;

    const correctVocab = vocabulary[correctIdx];
    const wrongVocab = vocabulary[wrongIdx];

    options.push(correctVocab);
    options.push(wrongVocab);

    return options.sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    if (vocabulary.length > 0) {
      setShuffledOptions(
        shuffleOptions(vocabulary[currentIndex], currentIndex)
      );
    }
  }, [vocabulary, currentIndex]);

  useEffect(() => {
    getVocabularyByLessonId(lessonId);
  }, [lessonId]);

  // Xử lý chọn đáp án
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsChecked(false);
  };

  // Xử lý phát âm thanh
  const handlePlayAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  // Xử lý nút "Kiểm tra"
  const handleCheck = () => {
    if (selectedOption) {
      const correctVocab = vocabulary[currentIndex];
      const isCorrectAnswer =
        selectedOption._id === correctVocab._id && correctVocab.isCorrect;
      setIsCorrect(isCorrectAnswer);
      setIsChecked(true);

      setTotalCount((prev) => prev + 1);
      if (isCorrectAnswer) {
        setCorrectCount((prev) => prev + 1);
      }
    }
  };

  // Xử lý nút "Tiếp tục"
  const handleNext = async () => {
    if (currentIndex < vocabulary.length - 2) {
      setCurrentIndex(currentIndex + 2);
      setSelectedOption(null);
      setIsCorrect(null);
      setIsChecked(false);
    } else {
      setIsCompleted(true);
    }
  };

  // Xử lý nút "Làm lại"
  const handleRetry = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setIsChecked(false);
    setShuffledOptions(shuffleOptions(vocabulary[currentIndex], currentIndex));
    setCorrectCount(0);
    setTotalCount(0);
  };

  // Xử lý nút "Làm lại bài tập" khi điểm < 60%
  const handleRetryLesson = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setIsChecked(false);
    setCorrectCount(0);
    setTotalCount(0);
    setShuffledOptions(shuffleOptions(vocabulary[0], 0));
  };

  // Xử lý quay lại
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

  if (isCompleted) {
    const totalCorrectVocabs = vocabulary.filter((v) => v.isCorrect).length;
    const score = (correctCount / totalCorrectVocabs) * 100;
    // Gọi API nếu điểm >= 60%
    if (score >= 60) {
      try {
        apiUpdateLessonProgressByLessonId(lessonId, {
          userId: userData?._id,
          score: Math.round(score),
          isCompleted: true,
        });
      } catch (error) {
        console.error("Error updating lesson progress:", error);
      }
    }

    return (
      <div className="w-full h-full p-4 flex flex-col items-center justify-center">
        {score >= 60 ? (
          <>
            <h2 className="text-3xl font-bold text-green-600">Hoàn thành!</h2>
            <p className="text-lg mt-4">
              Bạn đã hoàn thành tất cả từ vựng trong bài học với
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

  const currentVocab = vocabulary[currentIndex];

  return (
    <div className="w-full h-full flex justify-center items-start p-6 bg-gray-50">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex items-center gap-3">
          <MdKeyboardArrowLeft
            size={36}
            className="text-gray-600 hover:text-black cursor-pointer transition"
            onClick={handleBack}
          />
          <h6 className="text-2xl font-semibold text-gray-800">
            {lesson?.title}
          </h6>
        </div>

        {/* Mô tả hướng dẫn */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePlayAudio(currentVocab.audioUrl)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
          >
            <FaVolumeUp />
            Nghe
          </button>
          <p className="text-lg text-gray-700">Chọn âm thanh khớp với câu.</p>
        </div>

        {/* Card từ vựng */}
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-full max-w-3xl text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">
            {currentVocab.word}
          </h2>
          <p className="text-blue-600 text-xl">
            {currentVocab.phonetic || "N/A"}
          </p>
          <p className="text-gray-700">{currentVocab.meaning}</p>
          <p className="italic text-gray-500">{currentVocab.exampleSentence}</p>
        </div>

        {/* Danh sách đáp án */}
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
                  handleOptionClick(option);
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

        {/* Phản hồi & nút kiểm tra/tiếp tục */}
        <div className="w-full max-w-3xl flex flex-col items-center gap-3 mt-6">
          {isChecked && (
            <p
              className={`text-lg font-semibold ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect ? "🎯 Chính xác!" : "❌ Sai rồi!"}
            </p>
          )}
          <div className="flex gap-4">
            {!isChecked ? (
              <button
                onClick={handleCheck}
                disabled={!selectedOption}
                className={`px-6 py-2 rounded-lg font-medium ${
                  selectedOption
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Kiểm tra
              </button>
            ) : (
              <>
                {!isCorrect && (
                  <button
                    onClick={handleRetry}
                    className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Làm lại
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tiếp tục
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vocabulary;
