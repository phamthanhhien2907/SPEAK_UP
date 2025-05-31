import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
interface Props {
  title?: string;
  description?: string;
  thumbnail?: string;
  data: string;
  category?: string;
  totalLesson?: string;
  progressText?: string;
}

const CustomCard = ({
  title,
  description,
  thumbnail,
  data,
  category,
  totalLesson,
  progressText,
}: Props) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [pulsing, setPulsing] = useState(true);

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true, // Only trigger the animation once
    threshold: 0.1, // Trigger when 10% of the card is in view
  });

  useEffect(() => {
    if (inView) {
      controls.start("show");
    }
  }, [controls, inView]);

  const item = {
    hidden: {
      opacity: 0,
      y: 50,
      transition: { ease: [0.78, 0.14, 0.15, 0.86] },
    },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: [0.78, 0.14, 0.15, 0.86], duration: 0.6 },
    },
  };

  const imageLoaded = () => {
    setImageLoading(false);
    setTimeout(() => setPulsing(false), 600);
  };

  const result =
    data === "topic" || data === "topicCard"
      ? `${totalLesson} Bài học`
      : totalLesson;

  return (
    <motion.div
      ref={ref}
      variants={item}
      initial="hidden"
      animate={controls}
      style={{ width: "100%" }}
    >
      <Card
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "700px",
          height:
            data === "card" || data === "topic"
              ? "350px"
              : data === "topicCard"
              ? "350px"
              : undefined,
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
            alignItems:
              data === "topic" || data === "topicCard" ? "" : "center",
            justifyContent:
              data === "topic" || data === "topicCard" ? "" : "center",
            flexDirection:
              data === "card" || data === "topic" || data === "topicCard"
                ? "column"
                : "row",
            flex: 1,
            position: "relative",
          }}
          className={`${pulsing ? "pulse" : ""} loadable`}
        >
          {data === "explore" ? (
            <>
              {imageLoading && (
                <div
                  className="placeholder"
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#e0e0e0",
                    borderRadius: "1.25rem",
                    position: "absolute",
                    marginLeft: 4,
                  }}
                />
              )}
              <motion.img
                initial={{ height: "16rem", opacity: 0 }}
                animate={{
                  height: imageLoading ? "16rem" : "auto",
                  opacity: imageLoading ? 0 : 1,
                }}
                transition={{
                  height: { delay: 0, duration: 0.4 },
                  opacity: { delay: 0.5, duration: 0.4 },
                }}
                onLoad={imageLoaded}
                onError={imageLoaded}
                className="w-50 h-50 object-cover ml-1"
                src={thumbnail}
                alt="thumbnail"
              />
            </>
          ) : data === "card" || data === "topic" || data === "topicCard" ? (
            <>
              {imageLoading && (
                <div
                  className="placeholder"
                  style={{
                    width: "100%",
                    height: 200,
                    backgroundColor: "#e0e0e0",
                    borderRadius: "0",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              )}
              <motion.img
                initial={{ height: 200, opacity: 0 }}
                animate={{
                  height: imageLoading ? 200 : 200,
                  opacity: imageLoading ? 0 : 1,
                }}
                transition={{
                  height: { delay: 0, duration: 0.4 },
                  opacity: { delay: 0.5, duration: 0.4 },
                }}
                onLoad={imageLoaded}
                onError={imageLoaded}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  marginLeft: 4,
                }}
                src={thumbnail}
                alt="thumbnail"
              />
            </>
          ) : null}
          <CardContent
            sx={{
              flex: "1 0 auto",
              px: 4,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            <Typography
              fontWeight={data === "lesson" ? 600 : 500}
              component="div"
              variant="h5"
              sx={{
                fontSize: data === "explore" && 20,
                lineClamp: 1,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-word",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="subtitle2"
              component="div"
              sx={{
                color: "text.secondary",
                lineClamp: 1,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-word",
                fontSize: data === "explore" && 12,
              }}
            >
              {description}
            </Typography>
            <Typography
              variant="subtitle2"
              component="div"
              sx={{
                color: "text.secondary",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-word",
                fontSize: 12,
              }}
            >
              {progressText}
            </Typography>
            {(data === "card" || data === "topic" || data === "topicCard") && (
              <div className="flex items-center justify-between w-full">
                <Typography
                  variant="subtitle2"
                  component="div"
                  sx={{
                    color: "text.secondary",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordBreak: "break-word",
                    fontSize: 12,
                  }}
                >
                  {result}
                </Typography>
                <Button variant="contained" className="w-32 h-8">
                  Read More
                </Button>
              </div>
            )}
            {data === "lesson" && (
              <Button
                variant="contained"
                style={{
                  width: "auto",
                  height: 25,
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                {category}
              </Button>
            )}
          </CardContent>
        </Box>
        {data !== "explore" &&
          data !== "card" &&
          data !== "topic" &&
          data !== "topicCard" && (
            <>
              {imageLoading && (
                <div
                  className="placeholder"
                  style={{
                    width: data === "lesson" ? 160 : 100,
                    height: data === "lesson" ? "auto" : 100,
                    backgroundColor: "#e0e0e0",
                    borderRadius: data === "lesson" ? 0 : "50%",
                    position: "absolute",
                    right: data === "lesson" ? 0 : 8,
                  }}
                />
              )}
              <motion.img
                initial={{ opacity: 0 }}
                animate={{
                  opacity: imageLoading ? 0 : 1,
                }}
                transition={{
                  opacity: { delay: 0.5, duration: 0.4 },
                }}
                onLoad={imageLoaded}
                onError={imageLoaded}
                style={{
                  width: data === "lesson" ? 160 : 100,
                  height: data === "lesson" ? "auto" : 100,
                  borderRadius: data === "lesson" ? 0 : "50%",
                  objectFit: "cover",
                  marginRight: data === "lesson" ? 0 : 2,
                }}
                src={thumbnail}
                alt="thumbnail"
              />
            </>
          )}
        {data === "explore" && (
          <IconButton
            sx={{
              background: "linear-gradient(to right, #667eea, #764ba2)",
              color: "white",
              width: 30,
              height: 30,
            }}
            className="translate-y-10 translate-x-[-12px]"
          >
            <PlayArrowIcon />
          </IconButton>
        )}
      </Card>
    </motion.div>
  );
};

export default CustomCard;
