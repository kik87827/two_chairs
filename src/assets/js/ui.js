window.addEventListener("DOMContentLoaded", () => {
  uiBase.init();
});
window.addEventListener("load", () => {
  layoutCommon();
});

const uiBase = {
  init() {
    // 현재 객체 내의 모든 메서드 순회
    for (const key in this) {
      if (typeof this[key] === "function" && key !== "init") {
        this[key]();
      }
    }
  },
  commonInit() {
    let touchstart = "ontouchstart" in window;
    let userAgent = navigator.userAgent.toLowerCase();
    if (touchstart) {
      browserAdd("touchmode");
    }
    if (userAgent.indexOf("samsung") > -1) {
      browserAdd("samsung");
    }

    if (navigator.platform.indexOf("Win") > -1 || navigator.platform.indexOf("win") > -1) {
      browserAdd("window");
    }

    // 251012 추가
    function isKakaoWebBrowser() {
      const ua = navigator.userAgent.toLowerCase();
      return ua.includes("kakaotalk") || ua.includes("kakaobrowser");
    }
    if (isKakaoWebBrowser()) {
      browserAdd("kakao");
    }

    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
      // iPad or iPhone
      browserAdd("ios");
    }

    function browserAdd(opt) {
      document.querySelector("html").classList.add(opt);
    }
  },
  setVhProperty() {
    setProperty();
    window.addEventListener("resize", () => {
      setProperty();
    });
    function setProperty() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
  },
};


function layoutCommon() {
  
  let windowWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth !== windowWidth) {
      if (window.innerWidth > 1023) {
      } else {
      }
    }
    windowWidth = window.innerWidth;
  });

  window.addEventListener("scroll", () => {
  });
}
