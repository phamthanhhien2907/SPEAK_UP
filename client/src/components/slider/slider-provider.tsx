import { Swiper, SwiperSlide } from "swiper/react";
import "@/index.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  EffectCoverflow,
  Autoplay,
  Mousewheel,
  Keyboard,
  Navigation,
  Pagination,
} from "swiper/modules";

export default function SliderProvider() {
  return (
    <div className="w-[80%] min-h-[250px]">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        navigation={true}
        modules={[
          EffectCoverflow,
          Autoplay,
          Mousewheel,
          Keyboard,
          Navigation,
          Pagination,
        ]}
        className="w-full h-full"
      >
        <SwiperSlide className="!flex !items-center !justify-evenly px-16 bg-red-500 rounded-3xl w-full h-full">
          <div className="rounded-full w-20 h-20 bg-red-700 flex items-center justify-center">
            <span className="font-extrabold text-white">IELTS</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center text-white font-medium">
            <span>Phát âm </span>
            <span>bởi nguyentanquang</span>
            <span>32 từ vựng</span>
          </div>
        </SwiperSlide>
        <SwiperSlide className="!flex !items-center !justify-evenly px-16 bg-red-500 rounded-3xl w-full h-full">
          <div className="rounded-full w-20 h-20 bg-red-700 flex items-center justify-center">
            <span className="font-extrabold text-white">IELTS</span>
          </div>
          <div className="flex flex-col items-center text-lg justify-center text-center text-white font-medium">
            <span>Phát âm </span>
            <span>bởi nguyentanquang</span>
            <span>32 từ vựng</span>
          </div>
        </SwiperSlide>
        <SwiperSlide className="!flex !items-center !justify-evenly px-16 bg-red-500 rounded-3xl w-full h-full">
          <div className="rounded-full w-20 h-20 bg-red-700 flex items-center justify-center">
            <span className="font-extrabold text-white">IELTS</span>
          </div>
          <div className="flex flex-col items-center text-lg justify-center text-center text-white font-medium">
            <span>Phát âm </span>
            <span>bởi nguyentanquang</span>
            <span>32 từ vựng</span>
          </div>
        </SwiperSlide>
        <SwiperSlide className="!flex !items-center !justify-evenly px-16 bg-red-500 rounded-3xl w-full h-full">
          <div className="rounded-full w-20 h-20 bg-red-700 flex items-center justify-center">
            <span className="font-extrabold text-white">IELTS</span>
          </div>
          <div className="flex flex-col items-center text-lg justify-center text-center text-white font-medium">
            <span>Phát âm </span>
            <span>bởi nguyentanquang</span>
            <span>32 từ vựng</span>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
