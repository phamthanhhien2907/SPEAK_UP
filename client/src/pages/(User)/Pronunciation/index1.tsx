import { useState, useRef } from "react";

function Pronunciation() {
  const [conversations, setConversations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log("Dữ liệu âm thanh nhận được:", event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log("Ghi âm đã dừng, xử lý dữ liệu...");
        if (audioChunksRef.current.length === 0) {
          setConversations((prev) => [
            ...prev,
            "Không có dữ liệu âm thanh để gửi.",
          ]);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(",")[1];
          if (!base64Audio) {
            setConversations((prev) => [
              ...prev,
              "Không thể chuyển đổi dữ liệu âm thanh.",
            ]);
            return;
          }
          await handleSendRequest(base64Audio);
        };

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error("Lỗi MediaRecorder:", event);
        setConversations((prev) => [...prev, "Lỗi ghi âm, vui lòng thử lại."]);
        setRecording(false);
      };

      mediaRecorderRef.current.start();
      console.log("Bắt đầu ghi âm...");
      setRecording(true);
    } catch (err) {
      console.error("Lỗi bắt đầu ghi âm:", err);
      setConversations((prev) => [
        ...prev,
        "Không thể truy cập micro, kiểm tra quyền.",
      ]);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      console.log("Dừng ghi âm...");
      mediaRecorderRef.current.stop();
      setRecording(false);
    } else {
      console.log("Không có ghi âm để dừng.");
    }
  };

  const handleSendRequest = async (base64Audio: string) => {
    setLoading(true);
    try {
      console.log("Gửi yêu cầu API...");
      const res = await fetch("http://localhost:8000/transcribe-and-respond/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio_data: base64Audio }),
      });

      if (!res.ok) throw new Error(`Yêu cầu thất bại với mã ${res.status}`);

      const data = await res.json();
      console.log("Phản hồi từ API:", data);
      const newConversation = `🧑 Bạn: ${data.user_text}\n🤖 AI: ${data.ai_response}`;
      setConversations((prev) => [...prev, newConversation]);

      // Phát âm thanh và kiểm tra
      const audio = new Audio(`http://localhost:8000${data.audio_url}`);
      audio.onended = () => {
        console.log("Âm thanh đã phát xong.");
        setConversations((prev) => [...prev, "Âm thanh đã phát thành công."]);
      };
      audio.onerror = (err) => {
        console.error("Lỗi phát âm thanh:", err);
        setConversations((prev) => [
          ...prev,
          "Lỗi phát âm thanh, kiểm tra lại.",
        ]);
      };
      audio.play().catch((err) => {
        console.error("Lỗi khi phát âm thanh:", err);
        setConversations((prev) => [
          ...prev,
          "Lỗi phát âm thanh, kiểm tra lại.",
        ]);
      });
    } catch (err) {
      console.error("Lỗi gửi yêu cầu:", err);
      setConversations((prev) => [...prev, "Có lỗi khi gửi yêu cầu API."]);
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
          onClick={startRecording}
          disabled={recording || loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {recording ? "Đang ghi âm..." : "Bắt đầu ghi âm"}
        </button>
        <button
          onClick={stopRecording}
          disabled={!recording || loading}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-red-300"
        >
          Dừng ghi âm
        </button>
      </div>
      <div
        className="h-full bg-white p-4 rounded shadow-md overflow-y-auto"
        style={{ maxHeight: "60vh" }}
      >
        {conversations.map((conv, index) => (
          <p key={index} className="mb-2">
            {conv}
          </p>
        ))}
      </div>
      {loading && (
        <p className="mt-2 text-center text-gray-600">Đang xử lý...</p>
      )}
    </div>
  );
}

export default Pronunciation;
