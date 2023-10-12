const defaultOptions = {
  videoAttributes: { controls: "", playsinline: "", preload: "auto" },
  autoplay: true,

  // prevent drag/swipe gesture over the bottom part of video
  // set to 0 to disable
  preventDragOffset: 40,
};

/**
 * Check if slide has video content
 *
 * @param {Slide|Content} content Slide or Content object
 * @returns Boolean
 */
function isVideoContent(content) {
  return content && content.data && content.data.type === "video";
}

class VideoContentSetup {
  constructor(lightbox, options) {
    this.options = options;

    this.initLightboxEvents(lightbox);
    lightbox.on("init", () => {
      this.initPswpEvents(lightbox.pswp);
    });
  }

  initLightboxEvents(lightbox) {
    lightbox.on("contentLoad", this.onContentLoad.bind(this));
    lightbox.on("contentDestroy", this.onContentDestroy.bind(this));
    lightbox.on("contentActivate", this.onContentActivate.bind(this));
    lightbox.on("contentDeactivate", this.onContentDeactivate.bind(this));
    lightbox.on("contentAppend", this.onContentAppend.bind(this));
    lightbox.on("contentResize", this.onContentResize.bind(this));

    lightbox.addFilter(
      "isKeepingPlaceholder",
      this.isKeepingPlaceholder.bind(this)
    );
    lightbox.addFilter("isContentZoomable", this.isContentZoomable.bind(this));
    lightbox.addFilter(
      "useContentPlaceholder",
      this.useContentPlaceholder.bind(this)
    );

    lightbox.addFilter("domItemData", (itemData, element, linkEl) => {
      if (itemData.type === "video" && linkEl) {
        if (linkEl.dataset.pswpVideoSources) {
          itemData.videoSources = JSON.parse(pswpVideoSources);
        } else if (linkEl.dataset.pswpVideoSrc) {
          itemData.videoSrc = linkEl.dataset.pswpVideoSrc;
        } else {
          itemData.videoSrc = linkEl.href;
        }
      }
      return itemData;
    });
  }

  initPswpEvents(pswp) {
    // Prevent draggin when pointer is in bottom part of the video
    // todo: add option for this
    pswp.on("pointerDown", (e) => {
      const slide = pswp.currSlide;
      if (isVideoContent(slide) && this.options.preventDragOffset) {
        const origEvent = e.originalEvent;
        if (origEvent.type === "pointerdown") {
          const videoHeight = Math.ceil(slide.height * slide.currZoomLevel);
          const verticalEnding = videoHeight + slide.bounds.center.y;
          const pointerYPos = origEvent.pageY - pswp.offset.y;
          if (
            pointerYPos > verticalEnding - this.options.preventDragOffset &&
            pointerYPos < verticalEnding
          ) {
            e.preventDefault();
          }
        }
      }
    });

    // do not append video on nearby slides
    pswp.on("appendHeavy", (e) => {
      if (isVideoContent(e.slide) && !e.slide.isActive) {
        e.preventDefault();
      }
    });

    pswp.on("close", () => {
      if (isVideoContent(pswp.currSlide.content)) {
        // Switch from zoom to fade closing transition,
        // as zoom transition is choppy for videos
        if (
          !pswp.options.showHideAnimationType ||
          pswp.options.showHideAnimationType === "zoom"
        ) {
          pswp.options.showHideAnimationType = "fade";
        }

        // pause video when closing
        this.pauseVideo(pswp.currSlide.content);
      }
    });
  }

  onContentDestroy({ content }) {
    if (isVideoContent(content)) {
      if (content._videoPosterImg) {
        content._videoPosterImg.onload = content._videoPosterImg.onerror = null;
        content._videoPosterImg = null;
      }
    }
  }

  onContentResize(e) {
    if (isVideoContent(e.content)) {
      e.preventDefault();

      const width = e.width;
      const height = e.height;
      const content = e.content;

      if (content.element) {
        content.element.style.width = width + "px";
        content.element.style.height = height + "px";
      }

      if (content.slide && content.slide.placeholder) {
        // override placeholder size, so it more accurately matches the video
        const placeholderElStyle = content.slide.placeholder.element.style;
        placeholderElStyle.transform = "none";
        placeholderElStyle.width = width + "px";
        placeholderElStyle.height = height + "px";
      }
    }
  }

  isKeepingPlaceholder(isZoomable, content) {
    // console.log(
    //   `isKeepingPlaceholder(${isZoomable}, ${
    //     isVideoContent(content) ? "video" : "-"
    //   }) `,
    //   content
    // );
    if (isVideoContent(content)) {
      return false;
    }
    return isZoomable;
  }

  isContentZoomable(isZoomable, content) {
    if (isVideoContent(content)) {
      return false;
    }
    return isZoomable;
  }

  onContentActivate({ content }) {
    // console.log("on content activate (content):", content);
    if (isVideoContent(content) && this.options.autoplay) {
      // Wait for opening animation to finish before playing video to prevent skipping frames
      // console.log(content);
      setTimeout(() => {
        // Make sure slide is still active when starting playing
        if (content.slide.isActive) this.playVideo(content);
      }, 600);
    }
  }

  onContentDeactivate({ content }) {
    if (isVideoContent(content)) {
      this.pauseVideo(content);
    }
  }

  onContentAppend(e) {
    if (isVideoContent(e.content)) {
      e.preventDefault();
      e.content.isAttached = true;
      e.content.appendImage();
    }
  }

  onContentLoad(e) {
    const content = e.content; // todo: videocontent

    if (!isVideoContent(e.content)) {
      return;
    }

    // stop default content load
    e.preventDefault();

    if (content.element) {
      return;
    }

    content.state = "loading";
    content.type = "video"; // TODO: move this to pswp core?

    content.element = document.createElement("video");

    if (this.options.videoAttributes) {
      for (let key in this.options.videoAttributes) {
        content.element.setAttribute(
          key,
          this.options.videoAttributes[key] || ""
        );
      }
    }

    content.element.setAttribute("poster", content.data.msrc);

    this.preloadVideoPoster(content, content.data.msrc);

    // content.element.style.position = "absolute";
    // content.element.style.left = 0;
    // content.element.style.top = 0;

    if (content.data.videoSources) {
      content.data.videoSources.forEach((source) => {
        let sourceEl = document.createElement("source");
        sourceEl.src = source.src;
        sourceEl.type = source.type;
        content.element.appendChild(sourceEl);
      });
    } else if (content.data.videoSrc) {
      // Force video preload
      // https://muffinman.io/blog/hack-for-ios-safari-to-display-html-video-thumbnail/
      // this.element.src = this.data.videoSrc + '#t=0.001';
      content.element.src = content.data.videoSrc;
    }
  }

  preloadVideoPoster(content, src) {
    if (!content._videoPosterImg && src) {
      content._videoPosterImg = new Image();
      content._videoPosterImg.src = src;
      if (content._videoPosterImg.complete) {
        content.onLoaded();
      } else {
        content._videoPosterImg.onload = content._videoPosterImg.onerror =
          () => {
            content.onLoaded();
          };
      }
    }
  }

  playVideo(content) {
    if (content.element) {
      content.element.play();
    }
  }

  pauseVideo(content) {
    if (content.element) {
      content.element.pause();
    }
  }

  useContentPlaceholder(usePlaceholder, content) {
    // console.log(
    //   `useContentPlaceholder(${usePlaceholder}, ${
    //     isVideoContent(content) ? "video" : "-"
    //   }) `,
    //   content,
    //   usePlaceholder
    // );
    if (isVideoContent(content)) {
      // return false;
      return true;
    }
    return usePlaceholder;
  }
}

class PhotoSwipeVideoPlugin {
  constructor(lightbox, options) {
    new VideoContentSetup(lightbox, {
      ...defaultOptions,
      ...options,
    });
  }
}

export { PhotoSwipeVideoPlugin as default };
