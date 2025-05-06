import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
interface Props {
  title?: string;
  description?: string;
  thumbnail?: string;
  id?: string;
  data: string;
}
const CustomCard = ({ title, description, thumbnail, id, data }: Props) => {
  const navigation = useNavigate();

  return (
    <Card
      onClick={() => navigation(`/speech/${id}`)}
      key={id}
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
            fontWeight={data === "lesson" ? 600 : 500}
            component="div"
            variant="h5"
          >
            {title}
          </Typography>
          <Typography
            variant="subtitle2"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            {description}
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{
          width: data === "lesson" ? 160 : 100,
          height: data === "lesson" ? "auto" : 100,
          borderRadius: data === "lesson" ? 0 : "50%", // Làm hình tròn
          objectFit: "cover", // Cắt ảnh vừa khung, không méo
          marginRight: data === "lesson" ? 0 : 2,
        }}
        image={thumbnail}
        alt="Live from space album cover"
      />
    </Card>
  );
};

export default CustomCard;
