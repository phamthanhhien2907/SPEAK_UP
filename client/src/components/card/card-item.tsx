import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useSelectedPageContext } from "@/hooks/use-context";
import SliderProvider from "../slider/slider-provider";
import ListProvider from "../list/list-provider";
import { apiGetAllLesson } from "@/services/lesson.services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function CardItem() {
  const [lessonData, setLessonData] = useState([]);
  const { selectedPage } = useSelectedPageContext();
  const navigation = useNavigate();
  const getAllLesson = async () => {
    const response = await apiGetAllLesson();
    if (response?.data?.success) {
      const lessonType = response?.data?.rs?.filter(
        (lesson) => lesson?.type === "listening"
      );
      setLessonData(lessonType);
    }
  };
  useEffect(() => {
    getAllLesson();
  }, []);
  const renderContent = () => {
    switch (selectedPage) {
      case "Trang chủ":
        return (
          <>
            {selectedPage === "Trang chủ" && (
              <>
                <section className="flex-1 overflow-auto bg-gray-50 scrollbar-hide">
                  <h6 className="text-2xl font-bold pt-8 justify-center flex items-center">
                    Các cuộc đàm thoại
                  </h6>
                  <Box
                    sx={{
                      // maxHeight: "80vh",
                      width: "100%",
                      maxWidth: "1200px",
                      padding: "16px",
                    }}
                  >
                    {lessonData?.map((lesson) => (
                      <Card
                        onClick={() => navigation(`/speech/${lesson?._id}`)}
                        key={lesson?._id}
                        sx={{
                          display: "flex",
                          maxWidth: "700px",
                          width: "100%",
                          margin: "16px auto",
                          boxShadow: 3,
                          borderRadius: "8px",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flex: 1,
                          }}
                        >
                          <CardContent
                            sx={{
                              flex: "1 0 auto",
                              px: 4,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1.5,
                              justifyContent: "center",
                              alignItems: "start",
                            }}
                          >
                            <Typography
                              fontWeight={600}
                              component="div"
                              variant="h5"
                            >
                              {lesson?.title}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              component="div"
                              sx={{ color: "text.secondary" }}
                            >
                              {lesson?.content}
                            </Typography>
                          </CardContent>
                        </Box>
                        <CardMedia
                          component="img"
                          sx={{
                            width: 160,
                            height: "auto",
                          }}
                          image={lesson?.thumbnail}
                          alt="Live from space album cover"
                        />
                      </Card>
                    ))}
                  </Box>
                </section>
                <section className="w-full md:w-[550px] pr-4 pt-4 bg-gray-100 flex items-center flex-col gap-4">
                  <h6 className="font-bold text-2xl">Trang chủ</h6>
                  <span className="font-semibold text-end w-full px-16 cursor-pointer">
                    Xem tất cả
                  </span>
                  <SliderProvider />
                  <div className="flex flex-col items-center justify-center gap-4">
                    <h6 className="font-bold text-xl">
                      Hôm nay, chúng ta nên làm gì?
                    </h6>
                    <ListProvider />
                  </div>
                </section>
              </>
            )}
          </>
        );
      case "Bài học":
        return (
          <div className="p-4 text-xl">
            Danh sách bài học sẽ hiển thị ở đây.
          </div>
        );
      case "Khám phá":
        return (
          <div className="p-4 text-xl">
            Tính năng khám phá đang được phát triển.
          </div>
        );
      case "Tiến độ":
        return (
          <div className="p-4 text-xl">
            Tính năng khám phá đang được phát triển.
          </div>
        );
      default:
        return (
          <div className="p-4 text-xl">
            Chọn một mục trong thanh điều hướng.
          </div>
        );
    }
  };
  return <>{renderContent()}</>;
}
