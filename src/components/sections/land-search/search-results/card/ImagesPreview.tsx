import { useState } from "react";

import type { Swiper as TSwiper } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, A11y, Thumbs } from "swiper/modules";
import "swiper/css";
import "../../../../ui/buttons/ButtonClickAnimation.sass";
// import "swiper/css/free-mode";
// import "swiper/css/navigation";
// import "swiper/css/thumbs";
// import "swiper/css/a11y";

import type { ImageAsset } from "../../../../../model/Land";
import { generateImageSrc } from "../../../../../scripts/imageSrcHelper";

interface Props {
  images: ImageAsset[];
}

const ImagesPreview: React.FC<Props> = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<TSwiper | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="group h-full flex flex-col gap-1 select-none">
      <Swiper
        className="w-full  rounded-lg overflow-hidden swiper-slide-main relative "
        modules={[FreeMode, Navigation, A11y, Thumbs]}
        slidesPerView={1}
        centeredSlides={true}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        freeMode={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        thumbs={{ swiper: thumbsSwiper }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className="">
            <img
              className="w-full h-full object-cover"
              src={generateImageSrc(img.url)}
              alt={img.title}
              loading="lazy"
            />
          </SwiperSlide>
        ))}

        <div className="absolute top-0 left-1  h-full  z-10 flex flex-column items-center cursor-default opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
          <button
            className=" button-click-animation swiper-button cursor-pointer swiper-button-prev bg-[--color-secondary-lighter] p-2.5 rounded-full hidden md:block tabbable z-10  opacity-50 hover:opacity-100 disabled:opacity-20"
            disabled={activeIndex === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="4"
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              ></path>
            </svg>
          </button>
        </div>

        <div className="absolute top-0 right-1  h-full  z-10 flex flex-column items-center cursor-default opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
          <button
            className=" button-click-animation swiper-button cursor-pointer swiper-button-next bg-[--color-secondary-lighter] p-2.5 rounded-full hidden md:block  tabbable z-10  opacity-50 hover:opacity-100 disabled:opacity-20"
            disabled={activeIndex === images.length - 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="4"
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              ></path>
            </svg>
          </button>
        </div>
      </Swiper>
      <Swiper
        className="w-full h-12 flex-grow-0 flex-shrink-0 swiper-slide-thumbs mb-1"
        modules={[FreeMode, Navigation, Thumbs]}
        watchSlidesProgress={true}
        onSwiper={setThumbsSwiper}
        slidesPerView={4}
        spaceBetween={0}
        centeredSlides={true}
        centerInsufficientSlides={true}
        centeredSlidesBounds={true}
        // breakpoints={{
        //   "@0.00": {
        //     slidesPerView: 1,
        //     spaceBetween: 10,
        //   },
        //   "@0.75": {
        //     slidesPerView: 2,
        //     spaceBetween: 20,
        //   },
        //   "@1.00": {
        //     slidesPerView: 3,
        //     spaceBetween: 40,
        //   },
        //   "@1.50": {
        //     slidesPerView: 4,
        //     spaceBetween: 50,
        //   },
        // }}
        // breakpoints={{
        //   640: {
        //     slidesPerView: 2,
        //     spaceBetween: 20,
        //   },
        //   768: {
        //     slidesPerView: 4,
        //     spaceBetween: 40,
        //   },
        //   1024: {
        //     slidesPerView: 5,
        //     spaceBetween: 50,
        //   },
        // }}
      >
        {images.map((img, index) => (
          <SwiperSlide
            key={index}
            className={`cursor-pointer rounded-lg overflow-hidden p-[.1rem] border-[.15rem] ${
              activeIndex === index
                ? "opacity-1  border-[--color-secondary]"
                : "opacity-90 border border-transparent hover:opacity-100"
            }`}
          >
            <img
              className="w-full h-full object-cover rounded-md"
              src={generateImageSrc(img.url, 100, 70)}
              alt={img.title}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImagesPreview;
