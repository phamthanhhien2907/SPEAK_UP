import { JSX, useState } from "react";

// Cấu hình API base URL
const API_BASE_URL = "http://localhost:8000";

// Khởi tạo SpeechRecognition (tương thích với trình duyệt)
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
function Pronunciation() {
  const [conversations, setConversations] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");

  // Kiểm tra trình duyệt hỗ trợ SpeechRecognition
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = "en-US"; // Ngôn ngữ nhận diện (có thể đổi thành "vi-VN" nếu cần)
    recognition.interimResults = false; // Không nhận kết quả tạm thời
    recognition.maxAlternatives = 1; // Chỉ lấy kết quả tốt nhất
  }

  const startRecognition = () => {
    if (!recognition) {
      setConversations((prev) => [
        ...prev,
        <p key={prev.length}>Trình duyệt không hỗ trợ nhận diện giọng nói.</p>,
      ]);
      return;
    }

    setRecording(true);
    setRecognizedText("");
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Văn bản nhận diện:", transcript);
      setRecognizedText(transcript);
      setRecording(false);
      handleSendRequest(transcript); // Gửi văn bản lên server
    };

    recognition.onerror = (event) => {
      console.error("Lỗi nhận diện giọng nói:", event.error);
      setConversations((prev) => [
        ...prev,
        <p key={prev.length}>Lỗi nhận diện giọng nói: {event.error}</p>,
      ]);
      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
    };
  };

  const stopRecognition = () => {
    if (recognition && recording) {
      recognition.stop();
      setRecording(false);
    }
  };

  const handleSendRequest = async (text: string) => {
    setLoading(true);
    try {
      console.log("Gửi văn bản lên server:", text);
      const res = await fetch(`${API_BASE_URL}/text-and-respond/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_text: text }),
      });

      if (!res.ok) throw new Error(`Yêu cầu thất bại với mã ${res.status}`);

      const data = await res.json();
      console.log("Phản hồi từ API:", data);
      const newConversation = (
        <p key={conversations.length}>
          🧑 Bạn: {data.user_text}
          <br />
          🤖 AI: {data.ai_response}
        </p>
      );
      setConversations((prev) => [...prev, newConversation]);

      // Phát âm thanh nếu có audio_url
      if (data.audio_url) {
        setAudioLoading(true);
        const audio = new Audio(`${API_BASE_URL}${data.audio_url}`);
        audio.onloadeddata = () => {
          console.log("Âm thanh đã tải thành công.");
          setAudioLoading(false);
        };
        audio.onended = () => {
          setConversations((prev) => [
            ...prev,
            <p key={prev.length}>Âm thanh đã phát thành công.</p>,
          ]);
        };
        audio.onerror = (event: any) => {
          console.error("Lỗi phát âm thanh:", event);
          setConversations((prev) => [
            ...prev,
            <p key={prev.length}>
              Lỗi phát âm thanh: {event.message || "Không xác định"}
            </p>,
          ]);
          setAudioLoading(false);
        };
        audio.play().catch((err) => {
          console.error("Lỗi khi phát âm thanh:", err);
          setConversations((prev) => [
            ...prev,
            <p key={prev.length}>Lỗi phát âm thanh: {err.message}</p>,
          ]);
          setAudioLoading(false);
        });
      }
    } catch (err: any) {
      console.error("Lỗi gửi yêu cầu:", err);
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
        Gọi trợ lý học tiếng Anh
      </h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={startRecognition}
          disabled={recording || loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {recording ? "Đang nhận diện..." : "Bắt đầu nhận diện"}
        </button>
        <button
          onClick={stopRecognition}
          disabled={!recording || loading}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-red-300"
        >
          Dừng nhận diện
        </button>
      </div>
      <div className="mb-4">
        <p className="text-gray-700">
          Văn bản nhận diện: {recognizedText || "Chưa có dữ liệu"}
        </p>
      </div>
      <div
        className="h-full bg-white p-4 rounded shadow-md overflow-y-auto"
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
