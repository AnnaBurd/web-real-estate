import { useState } from "react";

import type { Swiper as TSwiper } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Thumbs } from "swiper/modules";
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
  url?: string;
}

const ImagesPreview: React.FC<Props> = ({ images, url }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<TSwiper | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="group mb-0.5 grid min-h-[18rem] select-none grid-cols-1 grid-rows-[75%_25%] items-stretch justify-items-stretch gap-0.5">
      <Swiper
        className="swiper-slide-main   relative  w-full overflow-hidden rounded-lg"
        modules={[Navigation, A11y, Thumbs]}
        slidesPerView={1}
        centeredSlides={true}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        freeMode={false}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        thumbs={{ swiper: thumbsSwiper }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className="relative">
            <img
              className=" h-full w-full object-cover"
              src={generateImageSrc(img.url)}
              alt={img.title}
              loading="lazy"
            />
            {url && <a className="absolute inset-0  md:hidden" href={url} />}
          </SwiperSlide>
        ))}

        <div className="flex-column absolute left-1  top-0  z-10 flex h-full cursor-default items-center opacity-0 transition-opacity delay-300 duration-300 group-hover:opacity-100">
          <button
            className=" button-click-animation swiper-button swiper-button-prev tabbable z-10 hidden cursor-pointer rounded-full bg-[--color-secondary-lighter] p-2.5 opacity-50  hover:opacity-100 disabled:opacity-20 md:block"
            disabled={activeIndex === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="4"
              stroke="currentColor"
              className="h-3 w-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              ></path>
            </svg>
          </button>
        </div>

        <div className="flex-column absolute right-1  top-0  z-10 flex h-full cursor-default items-center opacity-0 transition-opacity delay-300 duration-300 group-hover:opacity-100">
          <button
            className=" button-click-animation swiper-button swiper-button-next tabbable z-10 hidden cursor-pointer rounded-full bg-[--color-secondary-lighter]  p-2.5 opacity-50  hover:opacity-100 disabled:opacity-20 md:block"
            disabled={activeIndex === images.length - 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="4"
              stroke="currentColor"
              className="h-3 w-3"
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
        className="swiper-slide-thumbs h-full w-full "
        modules={[Navigation, Thumbs]}
        watchSlidesProgress={true}
        onSwiper={setThumbsSwiper}
        slidesPerView={4}
        spaceBetween={0}
        centeredSlides={true}
        centerInsufficientSlides={true}
        centeredSlidesBounds={true}
        // TODO: adjust breakpoints
        breakpoints={{
          0: {
            slidesPerView: 4,
          },
          450: {
            slidesPerView: 5,
          },
          477: {
            slidesPerView: 3,
          },
          700: {
            slidesPerView: 4,
          },
          950: {
            slidesPerView: 5,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide
            key={index}
            className={`box-border cursor-pointer overflow-hidden rounded-lg border-[.15rem] p-[.1rem] ${
              activeIndex === index
                ? "opacity-1  border-[--color-secondary]"
                : "border border-transparent opacity-90 hover:opacity-100"
            }`}
          >
            <img
              className="h-full w-full rounded-md object-cover"
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
