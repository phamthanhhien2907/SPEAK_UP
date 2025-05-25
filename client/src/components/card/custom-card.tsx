import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

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
  return (
    <Card
      sx={{
        display: "flex",
        width: "100%",
        maxWidth: "700px",
        height: data === "card" && "350px",
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
          flexDirection: data === "card" && "column",
          flex: 1,
        }}
      >
        {data === "explore" ? (
          <CardMedia
            component="img"
            sx={{
              width: 50,
              height: 50,
              objectFit: "cover",
              marginLeft: 1,
            }}
            image={thumbnail}
            alt="thumbnail"
          />
        ) : data === "card" ? (
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              marginLeft: 1,
            }}
            image={thumbnail}
            alt="thumbnail"
          />
        ) : null}
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
            fontWeight={data === "lesson" ? 600 : 500}
            component="div"
            variant="h5"
            sx={{
              fontSize: data === "explore" && 20,
            }}
          >
            {title}
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
          {data === "card" && (
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
                {totalLesson}
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
      {data !== "explore" && data !== "card" && (
        <CardMedia
          component="img"
          sx={{
            width: data === "lesson" ? 160 : data === "explore" ? 50 : 100,
            height: data === "lesson" ? "auto" : data === "explore" ? 50 : 100,
            borderRadius: data === "lesson" ? 0 : "50%",
            objectFit: "cover",
            marginRight: data === "lesson" || data === "explore" ? 0 : 2,
          }}
          image={thumbnail}
          alt="thumbnail"
        />
      )}
      {data === "explore" && (
        <IconButton
          sx={{
            background: "linear-gradient(to right, #667eea, #764ba2);",
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
  );
};

export default CustomCard;
