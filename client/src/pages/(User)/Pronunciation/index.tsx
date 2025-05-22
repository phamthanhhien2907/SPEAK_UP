// import { JSX, useState } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";

// // Cấu hình API base URL
// const API_BASE_URL = "http://localhost:8000";

// function Pronunciation() {
//   const [conversations, setConversations] = useState<JSX.Element[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [audioLoading, setAudioLoading] = useState(false);
//   const [selectedTopic, setSelectedTopic] = useState<string>("Ordering Food"); // Giá trị mặc định là "Ordering Food"
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   const startRecognition = () => {
//     if (!browserSupportsSpeechRecognition) {
//       setConversations((prev) => [
//         ...prev,
//         <p key={prev.length}>Trình duyệt không hỗ trợ nhận diện giọng nói.</p>,
//       ]);
//       return;
//     }

//     resetTranscript();
//     SpeechRecognition.startListening({ language: "en-US", continuous: false });
//   };

//   const stopRecognition = () => {
//     SpeechRecognition.stopListening();
//     if (transcript) {
//       handleSendRequest(transcript);
//     }
//   };

//   const handleSendRequest = async (text: string) => {
//     setLoading(true);
//     try {
//       console.log("Gửi văn bản lên server:", text);
//       const res = await fetch(`${API_BASE_URL}/text-and-respond/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ user_text: text, topic: selectedTopic }),
//       });

//       if (!res.ok) throw new Error(`Yêu cầu thất bại với mã ${res.status}`);

//       const data = await res.json();
//       console.log("Phản hồi từ API:", data);
//       const newConversation = (
//         <p key={conversations.length}>
//           🧑 Bạn: {data.user_text}
//           <br />
//           🤖 AI: {data.ai_response}
//         </p>
//       );
//       setConversations((prev) => [...prev, newConversation]);

//       if (data.audio_url) {
//         setAudioLoading(true);
//         const audio = new Audio(`${API_BASE_URL}${data.audio_url}`);
//         audio.onloadeddata = () => {
//           console.log("Âm thanh đã tải thành công.");
//           setAudioLoading(false);
//         };
//         audio.onended = () => {
//           setConversations((prev) => [
//             ...prev,
//             <p key={prev.length}>Âm thanh đã phát thành công.</p>,
//           ]);
//         };
//         audio.onerror = (event: any) => {
//           console.error("Lỗi phát âm thanh:", event);
//           setConversations((prev) => [
//             ...prev,
//             <p key={prev.length}>
//               Lỗi phát âm thanh: {event.message || "Không xác định"}
//             </p>,
//           ]);
//           setAudioLoading(false);
//         };
//         audio.play().catch((err) => {
//           console.error("Lỗi khi phát âm thanh:", err);
//           setConversations((prev) => [
//             ...prev,
//             <p key={prev.length}>Lỗi phát âm thanh: {err.message}</p>,
//           ]);
//           setAudioLoading(false);
//         });
//       }
//     } catch (err: any) {
//       console.error("Lỗi gửi yêu cầu:", err);
//       setConversations((prev) => [
//         ...prev,
//         <p key={prev.length}>Có lỗi khi gửi yêu cầu API: {err.message}</p>,
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <h2 className="text-2xl font-bold mb-4 text-center">
//         Gọi trợ lý học tiếng Anh
//       </h2>

//       {/* Dropdown chọn chủ đề */}
//       <div className="mb-4">
//         <label htmlFor="topic" className="block text-lg mb-2">
//           Chọn chủ đề:
//         </label>
//         <select
//           id="topic"
//           className="p-2 border rounded"
//           value={selectedTopic}
//           onChange={(e) => setSelectedTopic(e.target.value)}
//         >
//           <option value="Ordering Food">Đặt món ăn</option>
//           <option value="Travelling">Du lịch</option>
//           <option value="Shopping">Mua sắm</option>
//           <option value="Daily Conversation">Giao tiếp hàng ngày</option>
//         </select>
//       </div>

//       <div className="flex space-x-4 mb-4">
//         <button
//           onClick={startRecognition}
//           disabled={listening || loading}
//           className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
//         >
//           {listening ? "Đang nhận diện..." : "Bắt đầu nhận diện"}
//         </button>
//         <button
//           onClick={stopRecognition}
//           disabled={!listening || loading}
//           className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-red-300"
//         >
//           Dừng nhận diện
//         </button>
//       </div>
//       <div className="mb-4">
//         <p className="text-gray-700">
//           Văn bản nhận diện: {transcript || "Chưa có dữ liệu"}
//         </p>
//       </div>
//       <div
//         className="h-full bg-white p-4 rounded shadow-md overflow-y-auto"
//         style={{ maxHeight: "60vh" }}
//       >
//         {conversations.map((conv, index) => (
//           <div key={index} className="mb-2">
//             {conv}
//           </div>
//         ))}
//       </div>
//       {loading && (
//         <p className="mt-2 text-center text-gray-600">Đang xử lý...</p>
//       )}
//       {audioLoading && (
//         <p className="mt-2 text-center text-gray-600">Đang tải âm thanh...</p>
//       )}
//     </div>
//   );
// }

// export default Pronunciation;

import { JSX, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

// Cấu hình API base URL
const API_BASE_URL = "http://localhost:8000";

// Danh sách ngôn ngữ hỗ trợ
const LANGUAGE_MAP = {
  en: { name: "English", speechLang: "en-US" },
  vi: { name: "Vietnamese", speechLang: "vi-VN" },
  ja: { name: "Japanese", speechLang: "ja-JP" },
  ko: { name: "Korean", speechLang: "ko-KR" },
  zh: { name: "Chinese", speechLang: "zh-CN" },
};

// Danh sách chủ đề
const TOPICS = [
  { value: "restaurant", label: "Restaurant" },
  { value: "market", label: "Market" },
  { value: "hospital", label: "Hospital" },
];

function Pronunciation() {
  const [conversations, setConversations] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("restaurant");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startRecognition = () => {
    if (!browserSupportsSpeechRecognition) {
      setConversations((prev) => [
        ...prev,
        <p key={prev.length}>Trình duyệt không hỗ trợ nhận diện giọng nói.</p>,
      ]);
      return;
    }

    resetTranscript();
    console.log(
      "Starting speech recognition with language:",
      LANGUAGE_MAP[selectedLanguage].speechLang
    );
    SpeechRecognition.startListening({
      language: LANGUAGE_MAP[selectedLanguage].speechLang,
      continuous: false,
    });
  };

  const stopRecognition = () => {
    SpeechRecognition.stopListening();
    console.log("Transcript:", transcript);
    if (transcript) {
      console.log("Calling handleSendRequest with:", transcript);
      handleSendRequest(transcript);
    } else {
      console.log("No transcript, skipping API call");
      setConversations((prev) => [
        ...prev,
        <p key={prev.length}>
          Không nhận diện được giọng nói, vui lòng thử lại.
        </p>,
      ]);
    }
  };

  const handleSendRequest = async (text: string) => {
    setLoading(true);
    try {
      console.log("Sending request to API:", {
        user_text: text,
        topic: selectedTopic,
        language: selectedLanguage,
      });
      const res = await fetch(`${API_BASE_URL}/text-and-respond/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_text: text,
          topic: selectedTopic,
          language: selectedLanguage,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Yêu cầu thất bại với mã ${res.status}: ${JSON.stringify(errorData)}`
        );
      }

      const data = await res.json();
      console.log("API response:", data);
      const newConversation = (
        <p key={conversations.length}>
          🧑 Bạn: {data.user_text}
          <br />
          🤖 Amma: {data.ai_response}
        </p>
      );
      setConversations((prev) => [...prev, newConversation]);

      if (data.audio_url) {
        setAudioLoading(true);
        const audio = new Audio(`${API_BASE_URL}${data.audio_url}`);
        audio.onloadeddata = () => {
          console.log("Audio loaded successfully.");
          setAudioLoading(false);
        };
        audio.onended = () => {
          setConversations((prev) => [
            ...prev,
            <p key={prev.length}>Âm thanh đã phát thành công.</p>,
          ]);
        };
        audio.onerror = (event: any) => {
          console.error("Audio playback error:", event);
          setConversations((prev) => [
            ...prev,
            <p key={prev.length}>
              Lỗi phát âm thanh: {event.message || "Không xác định"}
            </p>,
          ]);
          setAudioLoading(false);
        };
        audio.play().catch((err) => {
          console.error("Error playing audio:", err);
          setConversations((prev) => [
            ...prev,
            <p key={prev.length}>Lỗi phát âm thanh: {err.message}</p>,
          ]);
          setAudioLoading(false);
        });
      }
    } catch (err: any) {
      console.error("Error sending request:", err);
      setConversations((prev) => [
        ...prev,
        <p key={prev.length}>Có lỗi khi gửi yêu cầu API: {err.message}</p>,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Gọi trợ lý học ngôn ngữ - Amma
      </h2>

      {/* Dropdown chọn ngôn ngữ */}
      <div className="mb-4">
        <label htmlFor="language" className="block text-lg mb-2">
          Chọn ngôn ngữ:
        </label>
        <select
          id="language"
          className="p-2 border rounded w-full"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {Object.entries(LANGUAGE_MAP).map(([code, { name }]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown chọn chủ đề */}
      <div className="mb-4">
        <label htmlFor="topic" className="block text-lg mb-2">
          Chọn chủ đề:
        </label>
        <select
          id="topic"
          className="p-2 border rounded w-full"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          {TOPICS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={startRecognition}
          disabled={listening || loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {listening ? "Đang nhận diện..." : "Bắt đầu nhận diện"}
        </button>
        <button
          onClick={stopRecognition}
          disabled={!listening || loading}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-red-300"
        >
          Dừng nhận diện
        </button>
        <button
          onClick={() => handleSendRequest("Test API call")}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-green-300"
        >
          Thử API
        </button>
      </div>
      <div className="mb-4">
        <p className="text-gray-700">
          Văn bản nhận diện: {transcript || "Chưa có dữ liệu"}
        </p>
      </div>
      <div
        className="h-full bg-white p-4 pb-20 rounded shadow-md overflow-y-auto"
        style={{ maxHeight: "60vh" }}
      >
        {conversations.map((conv, index) => (
          <div key={index} className="mb-2">
            {conv}
          </div>
        ))}
      </div>
      {loading && (
        <p className="mt-2 text-center text-gray-600">Đang xử lý...</p>
      )}
      {audioLoading && (
        <p className="mt-2 text-center text-gray-600">Đang tải âm thanh...</p>
      )}
    </div>
  );
}

export default Pronunciation;
