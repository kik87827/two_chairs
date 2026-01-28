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

  totalMenu();
  topgoLayer();

  function totalMenu() {
    let touchstart = "ontouchstart" in window;
    let front_body = document.querySelector(".front_body");
    let btn_header_menu = document.querySelector(".btn_header_menu");
    let total_info_wrap = document.querySelector(".total_info_wrap");
    let btn_total_close = document.querySelector(".btn_total_close");

    window.addEventListener("resize", () => {
      if (window.innerWidth <= 760) {
        if (total_info_wrap?.classList.contains("active")) {
          front_body.classList.add("touchDis");
        } else {
          front_body.classList.remove("touchDis");
        }
      } else {
        front_body.classList.remove("touchDis");
      }
    });
    btn_header_menu?.addEventListener("click", (e) => {
      e.preventDefault();
      if (total_info_wrap) {
        total_info_wrap.classList.toggle("active");
      }
      if (window.innerWidth <= 760) {
        front_body.classList.add("touchDis");
      }
    });
    document.addEventListener("click", (e) => {
      let etarget = e.target;
      if (!etarget.classList.contains("btn_header_menu") && !etarget.closest(".btn_header_menu") && !etarget.closest(".total_info_wrap")) {
        total_info_wrap.classList.remove("active");
        front_body.classList.remove("touchDis");
      }
    });
    btn_total_close?.addEventListener("click", (e) => {
      e.preventDefault();
      if (total_info_wrap) {
        total_info_wrap.classList.remove("active");
      }
      if (window.innerWidth <= 760) {
        front_body.classList.remove("touchDis");
      }
    });
  }

  function topgoLayer() {
    const btn_topgo_wrap = document.querySelector(".btn_topgo_wrap");
    const mb_bottom_layer = document.querySelector(".mb_bottom_layer");

    if (!btn_topgo_wrap || !mb_bottom_layer) return;

    // 🔹 check_topgo 동적 생성
    let check_topgo = btn_topgo_wrap.previousElementSibling;

    if (!check_topgo || !check_topgo.classList.contains("check_topgo")) {
      check_topgo = document.createElement("div");
      check_topgo.className = "check_topgo";
      btn_topgo_wrap.parentNode.insertBefore(check_topgo, btn_topgo_wrap);
    }

    function setBottom() {
      if (window.innerWidth > window.innerHeight) {
        resetBottom();
        return;
      }
      btn_topgo_wrap.style.bottom = mb_bottom_layer.getBoundingClientRect().height + "px";
    }

    function resetBottom() {
      btn_topgo_wrap.style.bottom = "";
    }

    // 🔍 sticky 상태 감시
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // ✅ sticky 상태
          btn_topgo_wrap.classList.add("is-stuck");
          setBottom();
        } else {
          // ❌ 일반 상태
          btn_topgo_wrap.classList.remove("is-stuck");
          resetBottom();
        }
      },
      { threshold: 0 },
    );

    observer.observe(check_topgo);

    // 🔁 sticky 상태일 때만 resize 반영
    window.addEventListener("resize", () => {
      if (btn_topgo_wrap.classList.contains("is-stuck")) {
        setBottom();
      }
    });
  }
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
  /* initMenuAction();
  anchor_menu[0].classList.add("first"); */
  // 화면 로딩 시 마지막 탭 이동 필요 시 주석 해제
  // anchor_menu[anchor_menu.length-1].classList.add("last");

  window.addEventListener("resize", () => {
    if (getWindowWid !== window.innerWidth) {
      getPosValue = getLayerPos();
      getPosHeight = getHeight();
      getPosArrayValue = getPosArray();
      // initMenuAction();
    }
    getWindowWid = window.innerWidth;
  });

  scrollAction();

  /* window.addEventListener("touchstart", () => {
    calculFunc();
    btnClickIs = false;
  }); */

  window.addEventListener("mousewheel", () => {
    /* const y = window.scrollY;
    if (y === lastY) return;
    lastY = y; */
    calculFunc();
    btnClickIs = false;
  });

  window.addEventListener("mousedown", () => {
    calculFunc();
    // btnClickIs = false;
  });
  let ticking = false;
  window.addEventListener("scroll", () => {
    /* const y = window.scrollY;
    if (y === lastY) return;
    lastY = y; */
    calculFunc();
    scrollAction();
    /* console.log("hor scroll global"); */
    /* if (!ticking) {
      requestAnimationFrame(() => {
        // 실제 작업
        menuHorFunc();

        ticking = false;
      });
      ticking = true;
    } */
  });
  /* anchor_menu_list_wrap.addEventListener("scroll", (e) => {
    const left = e.target.scrollLeft;
    console.log("hor scroll left:", left);
  }); */
  /* window.addEventListener("scrollend", () => {
    scrollEndAction();

    // anchor_menu_list_wrap.scrollLeft = active_anchor_menu
    // menuHorFunc();
  }); */

  window.addEventListener("touchmove", () => {
    calculFunc();
    scrollAction();
  });

  /* prose_total?.addEventListener("click", (e) => {
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
  }); */

  /* anchor_menu.forEach((item) => {
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
  }); */

  /* function menuHorFunc() {
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
  } */

  /*  function initMenuAction() {
    anchor_global_container.style.removeProperty("height");
    anchor_global_container.style.minHeight = anchor_menu_list.getBoundingClientRect().height + "px";
  } */
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
    if (getPosValue < window.scrollY) {
      /* if (!btnClickIs) {
        prose_total.classList.remove("active");
      } */
      anchor_menu_list_wrap.classList.add("fixed");
    } else {
      if (!btnClickIs) {
        //prose_total.classList.add("active");
        //anchor_menu_list_wrap.scrollLeft = 0;
        /*  if (activeItem) {
          activeItem.classList.remove("active");
        } */
      }
      anchor_menu_list_wrap.classList.remove("fixed");
      /*  */
      //prose_total.classList.add("active");
    }
    /* if (!btnClickIs) {
      anchor_menu.forEach((item, index) => {
        if (getPosArrayValue[index] - getPosHeight - header_wrapHeight <= window.scrollY) {
          activeTab(item);
        }
      });
      // endScroll();
    } */
  }

  /* function endScroll() {
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
  } */

  /* function scrollEndAction() {
    if (!!anchor_menu) {
      anchor_menu.forEach((item) => {
        item.classList.remove("click_active");
      });
    }
  } */

  /* function activeTab(target) {
    if (activeItem) {
      activeItem.classList.remove("active");
    }
    target.classList.add("active");
    // anchor_menu_list_wrap.scrollLeft = anchor_menu_list;
    /* setTimeout(() => {
      anchor_menu_list_wrap.scrollLeft = target.offsetLeft + target.getBoundingClientRect().width;
    }, 100);
    activeItem = target;
  } */
}

function comboUI() {
  const combo_target = document.querySelectorAll(".combo_target");
  const combo_option = document.querySelectorAll(".combo_option");
  const combo_select_wrap = document.querySelectorAll(".combo_select_wrap");

  if (combo_target.length) {
    combo_target.forEach((e_combo) => {
      e_combo.addEventListener("click", (e) => {
        e.preventDefault();
        let etarget = e.currentTarget;
        let eParent = etarget.closest(".combo_select_wrap");

        eParent.classList.toggle("active");
      });
    });
  }

  if (combo_option.length) {
    combo_option.forEach((e_option) => {
      e_option.addEventListener("click", (e) => {
        e.preventDefault();
        let etarget = e.currentTarget;
        let eParent = etarget.closest(".combo_select_wrap");
        let eCombo = eParent.querySelector(".combo_target .text_node");

        eCombo.textContent = etarget.textContent;
        eParent.classList.remove("active");
      });
    });
  }

  document.addEventListener("click", (e) => {
    let etarget = e.target;
    if (!etarget.closest(".combo_select_wrap")) {
      combo_select_wrap.forEach((cswrap) => {
        cswrap.classList.remove("active");
      });
    }
  });
}

function datePicker() {
  $(function () {
    $(".form_input.calendar,.range_input").datepicker({
      dateFormat: "yy.mm.dd", // 날짜 형식
      /* showButtonPanel: true, // 오늘/완료 버튼 표시
      showMonthAfterYear: true, */
      changeMonth: true, // 월 선택 드롭다운
      changeYear: true, // 년 선택 드롭다운
      yearRange: "1950:2100", // 선택 가능한 년 범위 (필요에 따라 조정)
      //yearSuffix: "년",
      closeText: "닫기",
      prevText: "이전달",
      nextText: "다음달",
      currentText: "오늘",
      monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
      monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
      dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
      dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
      dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
      showOtherMonths: true, // 👉 이전/다음 달 날짜도 달력에 표시
      selectOtherMonths: true, // 👉 이전/다음 달 날짜도 선택 가능
      onSelect: function (dateText, inst) {
        const $input = inst.input; // 현재 선택된 input
        if ($input.attr("id") === "wiEdate") {
          const wiEdateType = document.getElementsByName("wiEdateType");
          for (let i = 0; i < wiEdateType.length; i++) {
            wiEdateType[i].checked = false;
          }
        }
      },
      beforeShow: function (input) {
        setTimeout(() => {
          input.blur(); // 달력 열릴 때 포커스 제거
        }, 0);
      },
      onClose: function () {
        document.activeElement.blur(); // 달력 조작 후에도 포커스 제거
      },
    });
  });
}

/* popup */
class DesignPopup {
  constructor(option) {
    // variable
    this.option = option;
    this.selector = document.querySelector(this.option.selector);
    this.touchstart = "ontouchstart" in window;
    if (!this.selector) {
      return;
    }

    this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
    this.domHtml = document.querySelector("html");
    this.domBody = document.querySelector("body");
    this.pagewrap = document.querySelector(".page_wrap");
    this.layer_wrap_parent = null;
    this.btn_closeTrigger = null;
    this.scrollValue = 0;

    // init
    const popupGroupCreate = document.createElement("div");
    popupGroupCreate.classList.add("layer_wrap_parent");
    if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
      this.pagewrap.append(popupGroupCreate);
    }
    this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");

    // event
    this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
    this.bg_design_popup = this.selector.querySelector(".bg_dim");
    let closeItemArray = [...this.btn_close];
    if (!!this.selector.querySelectorAll(".close_trigger")) {
      this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
      closeItemArray.push(...this.btn_closeTrigger);
    }
    if (closeItemArray.length) {
      closeItemArray.forEach((element) => {
        element.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            this.popupHide(this.selector);
          },
          false,
        );
      });
    }
  }
  dimCheck() {
    const popupActive = document.querySelectorAll(".popup_wrap.active");
    if (!!popupActive[0]) {
      popupActive[0].classList.add("active_first");
    }
    if (popupActive.length > 1) {
      this.layer_wrap_parent.classList.add("has_active_multi");
    } else {
      this.layer_wrap_parent.classList.remove("has_active_multi");
    }
  }
  popupShow(option) {
    let target = this.option.selector;
    let instance_option = option || {};
    this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
    if (this.selector == null) {
      return;
    }
    if (this.touchstart) {
      this.domHtml.classList.add("touchDis");
    }
    this.selector.classList.add("active");
    setTimeout(() => {
      this.selector.classList.add("motion_end");
      if ("openCallback" in instance_option) {
        instance_option.openCallback();
      }
    }, 30);
    if ("beforeCallback" in this.option) {
      this.option.beforeCallback();
    }
    if ("callback" in this.option) {
      this.option.callback();
    }
    this.layer_wrap_parent.append(this.selector);
    // popupEventFunc();
    this.dimCheck();
  }
  popupHide(option) {
    let target = this.option.selector;
    let instance_option = option || {};
    if (!!target) {
      this.selector.classList.remove("motion");
      if ("beforeClose" in this.option) {
        this.option.beforeClose();
      }
      if ("beforeClose" in instance_option) {
        instance_option.beforeClose();
      }
      //remove
      this.selector.classList.remove("motion_end");
      setTimeout(() => {
        this.selector.classList.remove("active");
        let closeTimer = 0;
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = 0;
        } else {
          if ("closeCallback" in this.option) {
            this.option.closeCallback();
          }
          closeTimer = setTimeout(() => {
            if ("closeCallback" in instance_option) {
              instance_option.closeCallback();
            }
          }, 30);
        }
      }, 400);
      this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
      this.dimCheck();

      if (this.design_popup_wrap_active.length == 1) {
        this.domHtml.classList.remove("touchDis");
      }
    }
  }
}

function designModal(option) {
  const modalGroupCreate = document.createElement("div");
  let domHtml = document.querySelector("html");
  let design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
  let modal_wrap_parent = null;
  let modal_item = null;
  let pagewrap = document.querySelector(".page_wrap");
  let showNum = 0;
  let okTextNode = option.okText ?? "확인";
  let cancelTextNode = option.cancelText ?? "취소";
  let closeBtnDisplay = option.closeDisplay ?? true;
  let submitBtnDisplay = option.submitDisplay ?? true;
  modalGroupCreate.classList.add("modal_wrap_parent");

  if (!modal_wrap_parent && !document.querySelector(".modal_wrap_parent")) {
    pagewrap.append(modalGroupCreate);
  } else {
    modalGroupCreate.remove();
  }
  modal_wrap_parent = document.querySelector(".modal_wrap_parent");

  let btnHTML = ``;

  if (option.modaltype === "confirm") {
    btnHTML = `
    <a href="javascript:;" class="btn_quad btn_modal_submit cancelcall"><span class="text_node">${cancelTextNode}</span></a>
    <a href="javascript:;" class="btn_quad btn_modal_submit primary okcall"><span class="text_node">${okTextNode}</span></a>
    `;
  } else {
    btnHTML = `
      <a href="javascript:;" class="btn_quad btn_modal_submit primary okcall"><span class="text_node">${okTextNode}</span></a>
    `;
  }

  let modal_template = `
    <div class="modal_wrap">
        <div class="bg_dim"></div>
        <div class="modal_box_tb">
            <div class="modal_box_td">
                <div class="modal_box_item">
                    <div class="modal_box_message_row">
                        <p class="modal_box_message">${option.message}</p>
                    </div>
                    <div class="btn_modal_submit_wrap btn_quad_wrap">
                        ${btnHTML}
                    </div>
                    <a href="javascript:;" class="btn_modal_close"></a>
                </div>
            </div>
        </div>
    </div>
  `;
  modal_wrap_parent.innerHTML = modal_template;
  modal_item = modal_wrap_parent.querySelector(".modal_wrap");
  modal_item.classList.add("active");
  if (showNum) {
    clearTimeout(showNum);
  }
  showNum = setTimeout(() => {
    modal_item.classList.add("motion_end");
    modal_item.addEventListener("transitionend", (e) => {
      if (e.currentTarget.classList.contains("motion_end")) {
        if (option.showCallback) {
          option.showCallback();
        }
      }
    });
  }, 10);

  let btn_modal_submit_wrap = modal_item.querySelector(".btn_modal_submit_wrap");
  let btn_modal_submit = modal_item.querySelectorAll(".btn_modal_submit");
  let btn_modal_close = modal_item.querySelectorAll(".btn_modal_close");
  if (!submitBtnDisplay) {
    modal_item.querySelector(".modal_box_item").classList.add("submit_not");
  }
  if (!!btn_modal_submit) {
    btn_modal_submit.forEach((item) => {
      let eventIs = false;

      if (!submitBtnDisplay) {
        item.remove();
        btn_modal_submit_wrap.remove();
      } else {
        if (eventIs) {
          item.removeEventListener("click");
        }
        item.addEventListener("click", (e) => {
          let thisTarget = e.currentTarget;
          closeAction();
          if (thisTarget.classList.contains("okcall")) {
            if (option.okcallback) {
              option.okcallback();
            }
          } else if (thisTarget.classList.contains("cancelcall")) {
            if (option.cancelcallback) {
              option.cancelcallback();
            }
          }
          eventIs = true;
        });
      }
    });
  }
  if (!closeBtnDisplay) {
    modal_item.querySelector(".modal_box_item").classList.add("close_not");
  }
  if (!!btn_modal_close) {
    btn_modal_close.forEach((item) => {
      let eventIs = false;
      if (!closeBtnDisplay) {
        item.remove();
      } else {
        if (eventIs) {
          item.removeEventListener("click");
        }
        item.addEventListener("click", (e) => {
          closeAction();
          eventIs = true;
        });
      }
    });
  }

  function closeAction() {
    let actionNum = 0;
    modal_item.classList.remove("motion_end");
    if (design_popup_wrap_active.length === 0) {
      domHtml.classList.remove("touchDis");
    }
    if (actionNum) {
      clearTimeout(actionNum);
    }
    actionNum = setTimeout(() => {
      modal_item.classList.remove("active");
      modal_item.remove();
    }, 500);
  }
}

function responsiveWidth() {
  action();
  $(window).on("resize", function () {
    action();
  });

  function action() {
    const datapc = $("[data-pcwid]");
    datapc.css("width", "");
    if ($(window).width() >= 1400) {
      datapc.each(function () {
        $(this).css("width", $(this).attr("data-pcwid"));
      });
    }
  }
}

function listKeyword(target) {
  const $target = $(target);
  const $data_toggle_item = $target.find(".data_toggle_item");
  const $data_keyword_cols = $target.find(".keyword_cols");

  action();
  $(window).on("resize", function () {
    action();
  });

  function action() {
    let maxArray = [];
    $data_keyword_cols.css("flex-basis", "");
    $data_toggle_item.each(function () {
      const $this = $(this);
      const $keyword_cols = $this.find(".keyword_cols");
      maxArray.push($this.find(".data_keyword").outerWidth(true));
    });
    $data_keyword_cols.css("flex-basis", Math.max.apply(null, maxArray));
  }
}

function tabUI() {
  const $mbselect_target = $(".mbselect_target");
  const $mbselect_option = $(".mbselect_option");
  $mbselect_target.on("click", function (e) {
    e.preventDefault();
    const $this = $(this);
    const $t_p = $this.closest(".mbselect_wrap");
    const $t_t = $t_p?.find(".mbselect_target");
    $t_p.toggleClass("active");
  });
  $mbselect_option.on("click", function (e) {
    e.preventDefault();
    const $this = $(this);
    const $t_p = $this.closest(".mbselect_wrap");
    const $t_t = $t_p?.find(".mbselect_target");
    $t_t.find(".text_node").text($this.text());
    $t_p.removeClass("active");
  });
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".mbselect_wrap").length) {
      $(".mbselect_wrap").removeClass("active");
    }
  });
}

/* 개발 함수 */
function showInputRequiredModal(message, okcallback = null) {
  const modalOption = {
    message,

    modaltype: "",

    okcallback() {
      if (typeof okcallback === "function") {
        okcallback(); // 외부 콜백 호출
      }
    },
  };

  designModal(modalOption);
}
