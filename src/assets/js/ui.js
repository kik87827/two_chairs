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

  window.addEventListener("scroll", () => {});

  let btn_topgo = document.querySelector(".btn_topgo");
  btn_topgo?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });
}

function stickyAnchorTab() {
  const anchor_global_container = document.querySelector(".anchor_global_container");
  const anchor_menu_list_wrap = document.querySelector(".anchor_menu_list_wrap");
  const anchor_cont = document.querySelectorAll(".anchor_cont");
  const anchor_menu_list = document.querySelector(".anchor_menu_list");
  const prose_total = document.querySelector(".prose_total");
  const header_wrap = document.querySelector(".header_wrap");
  const anchor_menu = document.querySelectorAll(".anchor_menu");
  let header_wrapHeight = !!header_wrap ? header_wrap.getBoundingClientRect().height : 0;
  let getPosValue = getLayerPos();
  let getPosHeight = getHeight();
  let getPosArrayValue = getPosArray();
  let getWindowWid = window.innerWidth;
  let activeItem = document.querySelector(".anchor_menu.active");
  let btnClickIs = false;
  let isEnd = false;

  if (!anchor_global_container) {
    return;
  }
  initMenuAction();
  anchor_menu[0].classList.add("first");
  // 화면 로딩 시 마지막 탭 이동 필요 시 주석 해제
  // anchor_menu[anchor_menu.length-1].classList.add("last");

  window.addEventListener("resize", () => {
    if (getWindowWid !== window.innerWidth) {
      getPosValue = getLayerPos();
      getPosHeight = getHeight();
      getPosArrayValue = getPosArray();
      initMenuAction();
    }
    getWindowWid = window.innerWidth;
  });

  scrollAction();

  window.addEventListener("touchstart", () => {
    calculFunc();
    btnClickIs = false;
  });

  window.addEventListener("mousewheel", () => {
    /* const y = window.scrollY;
    if (y === lastY) return;
    lastY = y; */
    calculFunc();
    btnClickIs = false;
  });

  window.addEventListener("mousedown", () => {
    calculFunc();
    btnClickIs = false;
  });
  let ticking = false;
  window.addEventListener("scroll", () => {
    /* const y = window.scrollY;
    if (y === lastY) return;
    lastY = y; */
    calculFunc();
    scrollAction();
    /* console.log("hor scroll global"); */
    if (!ticking) {
      requestAnimationFrame(() => {
        // 실제 작업
        menuHorFunc();

        ticking = false;
      });
      ticking = true;
    }
  });
  /* anchor_menu_list_wrap.addEventListener("scroll", (e) => {
    const left = e.target.scrollLeft;
    console.log("hor scroll left:", left);
  }); */
  window.addEventListener("scrollend", () => {
    scrollEndAction();

    // anchor_menu_list_wrap.scrollLeft = active_anchor_menu
    // menuHorFunc();
  });

  window.addEventListener("touchmove", () => {
    calculFunc();
    scrollAction();
  });

  prose_total?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    prose_total.classList.add("active");
    if (activeItem) {
      activeItem.classList.remove("active");
    }
    btnClickIs = true;
  });

  anchor_menu.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const thisTarget = e.currentTarget;
      const thisScrollPosTop = document.querySelector(thisTarget.getAttribute("href")).getBoundingClientRect().top - 20;
      const thisScrollPos = thisScrollPosTop + window.scrollY - getPosHeight - header_wrapHeight;
      prose_total.classList.remove("active");
      thisTarget.classList.add("click_active");
      activeTab(thisTarget);
      if (!!thisScrollPos) {
        window.scrollTo({
          top: thisScrollPos,
          left: 0,
          behavior: "smooth",
        });
      }
      btnClickIs = true;
    });
    if (item.classList.contains("last")) {
      item.click();
    }
  });

  function menuHorFunc() {
    const active_anchor_menu = document.querySelector(".anchor_menu.active");
    if (!!active_anchor_menu) {
      const active_anchor_li = active_anchor_menu?.closest("li");
      // console.log(active_anchor_li.offsetLeft + active_anchor_li.offsetWidth, window.innerWidth);
      // const li = activeAnchor.closest("li");
      if (active_anchor_li) {
        const liLeft = active_anchor_li.offsetLeft;
        const liRight = liLeft + active_anchor_li.offsetWidth;

        const viewLeft = anchor_menu_list_wrap.scrollLeft;
        const viewRight = viewLeft + anchor_menu_list_wrap.clientWidth;

        // ✅ active li가 화면(보이는 영역) 밖이면 true
        const isOutOfView = liLeft < viewLeft || liRight > viewRight;

        if (isOutOfView) {
          const targetLeft = liLeft - anchor_menu_list_wrap.clientWidth / 2 + active_anchor_li.offsetWidth / 2;

          anchor_menu_list_wrap.scrollTo({
            left: Math.max(0, targetLeft),
            behavior: "smooth",
          });
        }
      }
    }
  }

  function initMenuAction() {
    anchor_global_container.style.removeProperty("height");
    anchor_global_container.style.minHeight = anchor_menu_list.getBoundingClientRect().height + "px";
  }
  function calculFunc() {
    getPosValue = getLayerPos();
    getPosHeight = getHeight();
    getPosArrayValue = getPosArray();
  }

  function getLayerPos() {
    if (!anchor_global_container) {
      return;
    }
    let localTop = anchor_global_container.getBoundingClientRect().top;
    return localTop - anchor_global_container.getBoundingClientRect().height + window.scrollY;
  }

  function getPosArray() {
    if (!anchor_cont) {
      return;
    }
    let posArray = [];
    if (!!anchor_cont) {
      anchor_cont.forEach((item) => {
        let eachTop = item.getBoundingClientRect().top;
        posArray.push(eachTop + window.scrollY - getPosHeight - header_wrapHeight);
      });
    }
    return posArray;
  }

  function getHeight() {
    if (!anchor_menu_list_wrap) {
      return;
    }
    return anchor_menu_list_wrap.getBoundingClientRect().height;
  }

  function scrollAction() {
    if (getPosValue - header_wrapHeight < window.scrollY) {
      if (!btnClickIs) {
        prose_total.classList.remove("active");
      }
      anchor_menu_list_wrap.classList.add("fixed");
    } else {
      if (!btnClickIs) {
        prose_total.classList.add("active");
        anchor_menu_list_wrap.scrollLeft = 0;
        if (activeItem) {
          activeItem.classList.remove("active");
        }
      }
      anchor_menu_list_wrap.classList.remove("fixed");
      /*  */
      //prose_total.classList.add("active");
    }
    if (!btnClickIs) {
      anchor_menu.forEach((item, index) => {
        if (getPosArrayValue[index] - getPosHeight - header_wrapHeight <= window.scrollY) {
          activeTab(item);
        }
      });
      endScroll();
    }
  }

  function endScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    // 오차 보정 (iOS 대응 핵심)
    const offset = document.querySelector("html").classList.contains("ios") ? 2 : 0;

    if (!isEnd && scrollTop + windowHeight >= scrollHeight - offset) {
      activeTab(anchor_menu[anchor_menu.length - 1]);
      isEnd = true;
    }

    // 다시 위로 올라가면 재감지 가능
    if (scrollTop + windowHeight < scrollHeight - offset) {
      isEnd = false;
    }
  }

  function scrollEndAction() {
    if (!!anchor_menu) {
      anchor_menu.forEach((item) => {
        item.classList.remove("click_active");
      });
    }
  }

  function activeTab(target) {
    if (activeItem) {
      activeItem.classList.remove("active");
    }
    target.classList.add("active");
    // anchor_menu_list_wrap.scrollLeft = anchor_menu_list;
    /* setTimeout(() => {
      anchor_menu_list_wrap.scrollLeft = target.offsetLeft + target.getBoundingClientRect().width;
    }, 100); */
    activeItem = target;
  }
}
