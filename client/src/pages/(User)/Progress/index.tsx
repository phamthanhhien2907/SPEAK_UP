import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Paper, Typography, Button, LinearProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}));

const Progress = () => {
  const [chartData] = useState({
    labels: [
      "Apr 8",
      "Apr 9",
      "Apr 10",
      "Apr 11",
      "Apr 12",
      "Apr 13",
      "Apr 14",
    ],
    datasets: [
      {
        label: "Practice Time (min)",
        data: [0, 5, 10, 15, 20, 25, 30],
        fill: true,
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 35,
        ticks: { stepSize: 5, color: "#6B7280" },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
      x: {
        ticks: { color: "#6B7280" },
        grid: { display: false },
      },
    },
  };

  const [calendarDate, setCalendarDate] = useState(new Date(2025, 4, 19));

  // Handle onChange with proper typing for react-calendar
  const handleCalendarChange = (value: Date | Date[] | null) => {
    if (value instanceof Date) {
      setCalendarDate(value);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b w-full from-blue-50 to-gray-50 min-h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800 text-center">Tiến độ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Daily Feedback */}
        <div className="flex flex-col py-8">
          <CustomPaper className="!bg-yellow-300 flex justify-between items-center">
            <div>
              <Typography variant="h6" component="h2" sx={{ color: "black" }}>
                Daily Feedback
              </Typography>
              <Typography variant="body2" sx={{ color: "black", opacity: 0.8 }}>
                See your daily practice feedbacks here
              </Typography>
            </div>
            <Typography variant="h4" sx={{ color: "black" }}>
              →
            </Typography>
          </CustomPaper>
          <CustomPaper className="flex flex-col items-center text-center">
            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
              Practice score
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Your daily practice score chart.
            </Typography>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-4">
              🔍
            </div>
            <Typography variant="body2" color="text.secondary">
              No data, please try again later.
            </Typography>
          </CustomPaper>
        </div>

        {/* Overall Practice Time */}
        <CustomPaper>
          <Typography
            variant="h6"
            component="h3"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Overall practice time
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Aggregated amount of your practice time.
          </Typography>
          <div className="flex gap-2 mb-4">
            <Button
              variant="contained"
              size="small"
              sx={{
                borderRadius: 16,
                px: 4,
                textAlign: "center",
                fontSize: 10,
                pt: 1,
                backgroundColor: "#3B82F6",
                "&:hover": { backgroundColor: "#2563EB" },
              }}
            >
              7 days
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 16,
                color: "#3B82F6",
                px: 4,
                textAlign: "center",
                fontSize: 10,
                pt: 1,
                borderColor: "#3B82F6",
                "&:hover": { borderColor: "#2563EB", color: "#2563EB" },
              }}
            >
              28 days
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 16,
                color: "#3B82F6",
                px: 4,
                textAlign: "center",
                fontSize: 10,
                pt: 1,
                borderColor: "#3B82F6",
                "&:hover": { borderColor: "#2563EB", color: "#2563EB" },
              }}
            >
              All time
            </Button>
          </div>
          <div style={{ height: 180 }}>
            <Line data={chartData} options={chartOptions} />
          </div>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Last 7 days: 8 Apr - 14 Apr
          </Typography>
        </CustomPaper>

        {/* Level Progress */}
        <CustomPaper className="!bg-blue-600 !text-white">
          <Typography
            variant="caption"
            sx={{ mb: 1, color: "white", fontSize: "12px" }}
          >
            Level 3
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2, color: "white", opacity: 0.8, fontSize: "14px" }}
          >
            Minutes left till the next level
          </Typography>
          <div className="flex items-center gap-2">
            <Typography
              variant="caption"
              sx={{ color: "white", fontSize: "12px" }}
            >
              3
            </Typography>
            <LinearProgress
              variant="determinate"
              value={75}
              sx={{
                height: 8,
                borderRadius: 4,
                flex: 1,
                bgcolor: "rgba(255, 255, 255, 0.3)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "white",
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "white", fontSize: "12px" }}
            >
              4
            </Typography>
          </div>
        </CustomPaper>

        {/* Current Streak */}
        <CustomPaper>
          <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
            Current streak
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Practice at least 3 minutes a day to complete a session.
          </Typography>
          <div className="flex justify-between items-center">
            <Typography color="text.primary">Ongoing streak:</Typography>
            <Typography className="!text-base" color="primary" variant="h6">
              0 days
            </Typography>
          </div>
          <div className="flex justify-between items-center mt-2">
            <Typography color="text.primary">Longest streak:</Typography>
            <Typography className="!text-base" color="primary" variant="h6">
              1 days
            </Typography>
          </div>
        </CustomPaper>

        {/* Stats */}
        <CustomPaper>
          <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
            Stats
          </Typography>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <span className="text-2xl">📘</span>
              <div>
                <Typography variant="body1">27 minutes</Typography>
                <Typography variant="caption" color="text.secondary">
                  Total learning time
                </Typography>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <Typography variant="body1">14 minutes</Typography>
                <Typography variant="caption" color="text.secondary">
                  Average practice time
                </Typography>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <Typography variant="body1">2 days studied</Typography>
            </li>
          </ul>
        </CustomPaper>

        {/* Streak Calendar */}
        <CustomPaper className="col-span-1 md:col-span-1">
          <Typography
            variant="h6"
            component="h3"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Streak calendar
          </Typography>
          <Calendar
            onChange={handleCalendarChange}
            value={calendarDate}
            formatShortWeekday={(locale, date) =>
              ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][date.getDay()]
            }
            tileClassName={({ date }) =>
              date.getDate() === 19 &&
              date.getMonth() === 4 &&
              date.getFullYear() === 2025
                ? "highlight"
                : null
            }
            showNeighboringMonth={false}
            minDetail="month"
            maxDetail="month"
            navigationLabel={({ date }) =>
              `${date.toLocaleString("default", {
                month: "long",
              })} ${date.getFullYear()}`
            }
            className="custom-calendar"
          />
        </CustomPaper>
      </div>
    </div>
  );
};

// Add custom CSS for the calendar
const styles = `
  .custom-calendar {
    width: 100%;
    border: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  .custom-calendar .react-calendar__month-view__days {
    padding: 10px 0;
  }
  .custom-calendar .react-calendar__month-view__weekdays__weekday {
    color: #6B7280;
    font-weight: 500;
    padding: 5px 0;
  }
  .custom-calendar .react-calendar__tile {
    height : 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s ease;
    margin: 0 auto;
  }
  .custom-calendar .react-calendar__tile:enabled:hover,
  .custom-calendar .react-calendar__tile:enabled:focus {
    // background-color: rgba(0, 0, 0, 0.05);
  }
  .custom-calendar .highlight {
    background-color: #3B82F6;
    color: white;
  }
  .custom-calendar .highlight:hover {
    background-color: #2563EB;
  }
  .custom-calendar .react-calendar__navigation {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  .custom-calendar .react-calendar__navigation__label {
    font-size: 14px;
    color: #6B7280;
    font-weight: 500;
  }
  .custom-calendar .react-calendar__navigation__arrow {
    font-size: 20px;
    color: #3B82F6;
    padding: 0 10px;
  }
`;

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(styles);
document.adoptedStyleSheets = [styleSheet];

export default Progress;
