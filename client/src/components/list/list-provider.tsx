import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SchoolIcon from "@mui/icons-material/School";
import Mic from "@mui/icons-material/Mic";
import ChatIcon from "@mui/icons-material/Chat";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const items = [
  {
    text: "Luyện tập bài học hằng ngày",
    icon: <SchoolIcon sx={{ color: "#FFC107" }} />, // vàng đậm
    bgColor: "#FFF3CD",
  },
  {
    text: "Cải thiện phát âm",
    icon: <Mic sx={{ color: "#0288D1" }} />, // xanh dương
    bgColor: "#E0F7FA",
  },
  {
    text: "Học theo chủ đề",
    icon: <ChatIcon sx={{ color: "#7E57C2" }} />, // tím
    bgColor: "#EDE7F6",
  },
  {
    text: "Nhận được chứng chỉ",
    icon: <EmojiEventsIcon sx={{ color: "#E91E63" }} />, // hồng
    bgColor: "#FCE4EC",
  },
];

export default function ListProvider() {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "transparent" }}>
      {items.map((item, index) => (
        <ListItem
          key={index}
          sx={{
            borderRadius: 2,
            backgroundColor: item.bgColor,
            mb: 1,
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: "white",
                color: "black",
                width: 32,
                height: 32,
              }}
              variant="rounded"
            >
              {item.icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{ fontSize: 15, fontWeight: 600 }}
            sx={{ mr: 4 }}
          />
          <IconButton
            edge="end"
            sx={{
              background: "linear-gradient(to right, #f857a6, #ff5858)",
              color: "white",
              width: 32,
              height: 32,
              ml: 1,
            }}
          >
            <PlayArrowIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}
