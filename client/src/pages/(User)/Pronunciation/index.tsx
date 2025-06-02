import * as React from "react";

interface Sample {
  id: string;
  word: string;
  ipa: string;
  language: string;
  mode: string;
  text?: string;
}

interface AccuracyResponse {
  accuracy: number;
  ipa_accuracy: { [key: string]: number };
}

const WordPronunciationTrainer: React.FC = () => {
  const [sample, setSample] = React.useState<Sample | null>(null);
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [accuracy, setAccuracy] = React.useState<number | null>(null);
  const [totalScore, setTotalScore] = React.useState<number>(0);
  const [mediaRecorder, setMediaRecorder] =
    React.useState<MediaRecorder | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const recordedChunksRef = React.useRef<Blob[]>([]);
  const sampleRef = React.useRef<Sample | null>(null);

  const API_KEY = "rll5QsTiv83nti99BW6uCmvs9BDVxSB39SVFceYb";

  const fetchSample = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/getSample", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({ language: "en", mode: "word_pronunciation" }),
      });

      if (!response.ok) throw new Error("Failed to fetch sample");
      const data: Sample = await response.json();
      setSample(data);
      sampleRef.current = data;
      console.log("Sample fetched successfully:", data);
      setAccuracy(null);
      setErrorMessage(null);
      recordedChunksRef.current = [];
    } catch (error) {
      console.error("Fetch sample error:", error);
      setErrorMessage("Failed to fetch sample: " + error.message);
    }
  };

  const startMediaDevice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      console.log("MediaRecorder initialized:", recorder);

      recorder.ondataavailable = (event) => {
        console.log("Data available event:", event.data.size);
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        console.log(
          "Recorder stopped, recordedChunks:",
          recordedChunksRef.current
        );
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        console.log("Blob created:", blob);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(",")[1];
          console.log("Base64Audio:", base64Audio);
          console.log("Sample from ref:", sampleRef.current);
          console.log(
            "Request body:",
            JSON.stringify({
              recorded_audio: base64Audio,
              sample_id: sampleRef.current.id,
            })
          );
          if (base64Audio && sampleRef.current) {
            try {
              const response = await fetch(
                "http://127.0.0.1:3000/GetAccuracyFromRecordedAudio",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": API_KEY,
                  },
                  body: JSON.stringify({
                    recorded_audio: base64Audio,
                    sample_id: sampleRef.current.id,
                  }),
                }
              );

              const responseText = await response.text();
              console.log("Raw response:", responseText);
              const data = JSON.parse(responseText);
              console.log("Parsed response data:", data);

              if (data.error) {
                throw new Error(data.error);
              }

              setAccuracy(data.accuracy);
              setTotalScore((prev) => prev + Math.round(data.accuracy));
              setErrorMessage(null);
            } catch (error) {
              console.error("Accuracy fetch error:", error);
              setErrorMessage("Failed to get accuracy: " + error.message);
            }
          } else {
            console.warn(
              "Skipping accuracy fetch: base64Audio or sample is missing"
            );
            setErrorMessage("Recording failed: Missing audio or sample data");
          }
        };
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          setErrorMessage("Failed to read audio data: " + error);
        };
      };
    } catch (error) {
      console.error("Media device error:", error);
      setErrorMessage(
        "Microphone access denied. Please allow microphone permissions in Chrome."
      );
    }
  };

  const toggleRecording = () => {
    if (!mediaRecorder) {
      console.warn("MediaRecorder not initialized");
      setErrorMessage("Recording failed: MediaRecorder not initialized");
      return;
    }

    if (isRecording) {
      console.log("Stopping recording");
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      console.log("Starting recording");
      recordedChunksRef.current = [];
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const playSample = () => {
    if (sample && sample.word) {
      const utterance = new SpeechSynthesisUtterance(sample.word);
      utterance.lang = "en";
      speechSynthesis.speak(utterance);
    }
  };

  const handleHomeClick = () => {
    setTotalScore(0);
    setErrorMessage(null);
    window.location.reload();
  };

  React.useEffect(() => {
    fetchSample();
    startMediaDevice();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Word Pronunciation Trainer
        </h1>
        <div className="flex items-center space-x-4">
          <p className="text-lg text-gray-700">Total Score: {totalScore}</p>
          <span
            className="material-icons text-4xl cursor-pointer"
            onClick={handleHomeClick}
          >
            home
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-2xl text-blue-600">
          {sample ? sample.word : "Loading..."}
        </p>
        <p className="text-lg text-gray-500">
          {sample ? `IPA: /${sample.ipa}/` : "Loading..."}
        </p>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={playSample}
          disabled={!sample}
          className="p-4 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <span className="material-icons">play_arrow</span>
        </button>
        <button
          onClick={toggleRecording}
          disabled={!sample || !mediaRecorder}
          className={`p-4 rounded-full shadow text-white ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          <span className="material-icons">{isRecording ? "stop" : "mic"}</span>
        </button>
        <button
          onClick={fetchSample}
          className="p-4 bg-gray-500 text-white rounded-full shadow hover:bg-gray-600"
        >
          <span className="material-icons">arrow_forward</span>
        </button>
      </div>

      {accuracy !== null && accuracy !== undefined && (
        <p className="text-xl text-center text-gray-700">
          Pronunciation Accuracy: {accuracy.toFixed(1)}%
        </p>
      )}

      {errorMessage && (
        <p className="text-xl text-center text-red-600">
          Error: {errorMessage}
        </p>
      )}

      <div className="mt-6 flex justify-end space-x-4">
        <a
          href="https://github.com/Thiagohgl/ai-pronunciation-trainer"
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-8 h-8 fill-current text-gray-700 hover:text-gray-900"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/thiagohgl/" target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-8 h-8 fill-current text-gray-700 hover:text-gray-900"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
      </div>

      <p className="text-sm text-gray-500 text-right mt-2">By Thiago Lobato.</p>
    </div>
  );
};

export default WordPronunciationTrainer;
