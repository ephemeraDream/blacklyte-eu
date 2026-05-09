(function ($) {
  function checkVisibleElements(callback) {
    waitForElement('.product_info_new_left', (target) => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            window.requestAnimationFrame(callback);
          }
        },
        {
          root: null,
          threshold: 0.01,
          rootMargin: '500px',
        }
      );

      observer.observe(target);
    });
  }
  let hasInitializedSwiper = false;
  if (!hasInitializedSwiper) {
    hasInitializedSwiper = true;
    checkVisibleElements(() => {
      //slick
      initImgObjectFit()
      initSlick()
      bindSlickEvents();
      if (document.querySelector(".product_info_new .product_info_new_left_imgthumb_body .slick-track")) {
        blockTransform(document.querySelector(".product_info_new .product_info_new_left_imgthumb_body .slick-track"))
      }
    });
  }
  function blockTransform(el) {
    const style = el.style;
    let _transform = style.transform;

    Object.defineProperty(style, "transform", {
      get() {
        return _transform;
      },
      set(v) {
        // console.warn("阻止 transform 修改：", v);

        const list = el.closest('.slick-list');
        const track = el;
        const slides = track.children;

        if (!list || !slides.length) return;

        const wrapperWidth = list.clientWidth;
        const lastSlide = slides[slides.length - 1];
        const lastSlideWidth = lastSlide.offsetWidth + parseFloat(getComputedStyle(lastSlide).marginRight);
        const totalItems = slides.length;
        const contentWidth = lastSlideWidth * totalItems;
        let maxOffset = contentWidth - wrapperWidth;
        if (maxOffset < 0) maxOffset = 0;

        function clampTranslate() {
          if (!v || v === 'none') return;

          let currentX = null;

          let matchMatrix = v.match(/matrix\(1,\s*0,\s*0,\s*1,\s*(-?\d+)/);
          let match3d = v.match(/translate3d\(\s*(-?\d+)px/);

          if (matchMatrix) {
            currentX = parseInt(matchMatrix[1], 10);
          } else if (match3d) {
            currentX = parseInt(match3d[1], 10);
          } else {
            return;
          }

          if (currentX < -maxOffset) {
            // console.warn("进行 transform 修改：", `translate3d(${-maxOffset}px, 0, 0)`);
            _transform = `translate3d(${-maxOffset}px, 0, 0)`;
          } else {
            _transform = v;
          }

          // 🔥 关键：写回 DOM，让 slick-track 生效
          style.setProperty("transform", _transform);
        }

        clampTranslate();
      }
    });
  }
  function initSlick() {
    if (window.innerWidth <= 1200 || show_pc_thumb) {
      if (!$(".product_info_new .product_info_new_left_imgmain_body").hasClass('slick-initialized')) {
        $(".product_info_new .product_info_new_left_imgmain_body").slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          waitForAnimate: false,
          infinite: false,
          asNavFor: '.product_info_new .product_info_new_left_imgthumb_body'
        });
      }

      if (!$('.product_info_new .product_info_new_left_imgthumb_body').hasClass('slick-initialized')) {
        $('.product_info_new .product_info_new_left_imgthumb_body').slick({
          variableWidth: true,
          slidesToScroll: 1,
          asNavFor: '.product_info_new .product_info_new_left_imgmain_body',
          focusOnSelect: true,
          waitForAnimate: false,
          infinite: false,
          arrows: false
        });
      }
    } else {
      if ($(".product_info_new .product_info_new_left_imgmain_body").hasClass('slick-initialized')) {
        $(".product_info_new .product_info_new_left_imgmain_body").slick('unslick');
      }

      if ($('.product_info_new .product_info_new_left_imgthumb_body').hasClass('slick-initialized')) {
        $('.product_info_new .product_info_new_left_imgthumb_body').slick('unslick');
      }
    }
  }
  // 调整图片显示方式
  function adjustImageFit(img) {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    if (aspectRatio > 1) {
      img.style.objectFit = 'cover';
    } else {
      img.style.objectFit = 'contain';
    }
  }
  function initImgObjectFit() {
    document.querySelectorAll(".product_info_new_left_imgmain_item img").forEach(img => {
      if (img.complete) {
        adjustImageFit(img);
      } else {
        img.onload = () => adjustImageFit(img);
      }
    })

    document.querySelectorAll(".product_info_new_left_imgthumb_item img").forEach(img => {
      if (img.complete) {
        adjustImageFit(img);
      } else {
        img.onload = () => adjustImageFit(img);
      }
    })

    $('.product_info_new .product_info_new_left_imgthumb_body').on('afterChange', function (event, slick, current) {
      const currentSlide = current ?? slick.currentSlide;
      const lastSlide = slick.slideCount - 1;

      if (currentSlide > 0) {
        $('.product_info_new .product_info_new_left_imgthumb_prev').removeClass('hidden');
      } else {
        $('.product_info_new .product_info_new_left_imgthumb_prev').addClass('hidden');
      }

      if (currentSlide >= lastSlide) {
        $('.product_info_new .product_info_new_left_imgthumb_next').addClass('hidden');
      } else {
        $('.product_info_new .product_info_new_left_imgthumb_next').removeClass('hidden');
      }
    });
  }
  function bindSlickEvents() {
    if (show_spin) {
      $(document)
        .off('click.spin')
        .on('click.spin', '.product_info_new .product_info_new_left_imgthumb_body .slick-slide', function () {
          document.querySelector(".product_info_new .product_info_new_left_spin").classList.add("hidden");
          document.querySelector(".product_info_new .product_info_new_left_spin_icon").classList.remove("hidden");
        });

      $(document)
        .off('click.spinIcon')
        .on('click.spinIcon', '.product_info_new .product_info_new_left_spin_icon', function () {
          document.querySelector(".product_info_new .product_info_new_left_spin").classList.remove("hidden");
          document.querySelector(".product_info_new .product_info_new_left_spin_icon").classList.add("hidden");
        });
    }

    $(document)
      .off('click.slickPrevMain')
      .on('click.slickPrevMain', ".product_info_new .product_info_new_left_imgmain_prev", function () {
        $(".product_info_new .product_info_new_left_imgmain_body").slick("slickPrev");
      });

    $(document)
      .off('click.slickNextMain')
      .on('click.slickNextMain', ".product_info_new .product_info_new_left_imgmain_next", function () {
        $(".product_info_new .product_info_new_left_imgmain_body").slick("slickNext");
      });

    $(document)
      .off('click.slickPrevThumb')
      .on('click.slickPrevThumb', ".product_info_new .product_info_new_left_imgthumb_prev", function () {
        $(".product_info_new .product_info_new_left_imgthumb_body").slick("slickPrev");
      });

    $(document)
      .off('click.slickNextThumb')
      .on('click.slickNextThumb', ".product_info_new .product_info_new_left_imgthumb_next", function () {
        $(".product_info_new .product_info_new_left_imgthumb_body").slick("slickNext");
      });
  }
  // 等待元素dom加载
  function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        callback(element);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }


  $(function () {
    // 导航栏处理
    const top_bar = document.querySelectorAll(".shopify-section.shopify-section-group-header-group")
    top_bar.forEach(el => {
      el.style.setProperty("position", "relative", "important");
      el.style.setProperty("top", "0", "important");
    });

    initLiquidEdition()
    function initLiquidEdition() {
      if (product_type === "chairs" && product.title.indexOf('Athena Pro Team Liquid Edition') > -1) {
        const currentColor = variant.options[1];
        ["white", "blue"].forEach(color => {
          document.querySelectorAll(`[id^="liquid_${color}_"]`).forEach(el => {
            if (color === currentColor.toLowerCase()) {
              el.style.display = 'block';
            } else { el.style.display = 'none'; }
          });
        })
      }
    }

    let resizeTimer;
    $(window).on('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initSlick, 200);
      if (document.querySelector(".product_info_new_right_select_contain_spec[data-type='Color'] .product_info_new_right_select_itembox")) {
        if (window.innerWidth <= 500) {
          document.querySelector(".product_info_new_right_select_contain_spec[data-type='Color'] .product_info_new_right_select_itembox").style.display = "none"
        } else {
          document.querySelector(".product_info_new_right_select_contain_spec[data-type='Color'] .product_info_new_right_select_itembox").style.display = "block"
        }
      }
    });

    //底部悬浮栏展示监测判断
    toggleBottomBar();
    function toggleBottomBar() {
      const targetSelector = ".product_info_new";
      const bottomBar = document.querySelector(".product_info_new_bottom_bar");

      if (!bottomBar) return;

      function initObserver(target, threshold) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                bottomBar.style.zIndex = -1;
                bottomBar.style.opacity = 0;
              } else {
                bottomBar.style.zIndex = 100;
                bottomBar.style.opacity = 1;
              }
            });
          },
          {
            root: null,
            threshold: threshold
          }
        );

        observer.observe(target);
      }

      waitForElement(targetSelector, (target) => {
        initObserver(target, 0.2)
      });
    }

    // option点击事件
    initOptionClick();
    function initOptionClick(optionList) {
      document.querySelectorAll(".product_info_new_right_select_contain").forEach((container) => {
        const type = container.getAttribute("data-type");
        if ((!optionList && type) || (optionList && optionList.includes(type))) {
          container.addEventListener("click", (event) => {
            const target = event.target.closest(".product_info_new_right_select_item");
            if (!target || target.classList.contains("product_info_new_right_select_item_active") || target.classList.contains("product_info_new_right_select_item_diasbled")) return;

            const items = container.querySelectorAll(".product_info_new_right_select_item");
            items.forEach((item) => item.classList.remove("product_info_new_right_select_item_active"));
            target.classList.add("product_info_new_right_select_item_active");

            if (type === "series") {
              const handle = target.getAttribute("data-handle");
              changeSeries(handle)
              return;
            }

            if (type === "Color" && product_type === "desk") {
              const selectSize = document.querySelector(`.product_info_new_right_select_contain[data-type='Size'] .product_info_new_right_select_item_active`).getAttribute("data-value")
              const selectColor = target.getAttribute("data-value");
              let variant = product.variants.find(item => item.option1 === selectColor && item.option2 === selectSize && item.available);
              if (!variant) {
                variant = product.variants.find(item => item.option1 === selectColor && item.available);
              }
              changeVariant(variant.id, type)
              return
            }

            // if (type === "Color" && product_type === "chairs" && window.innerWidth <= 1200) {
            //   window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            // }

            if (type === "Color" && product_type === "chairs" && product.title.indexOf('Athena Pro Team Liquid Edition') > -1) {
              const selectColor = target.getAttribute("data-color");
              ["white", "blue"].forEach(color => {
                document.querySelectorAll(`[id^="liquid_${color}_"]`).forEach(el => {
                  if (color === selectColor.toLowerCase()) {
                    el.style.display = 'block';
                  } else { el.style.display = 'none'; }
                });
              })
            }

            const variantId = target.getAttribute("data-id");
            changeVariant(variantId, type)
          });
        }
      });
    }

    // 变体切换
    function changeVariant(variantId, type) {
      fetch(location.pathname + `?variant=${variantId}`)
        .then((response) => response.text())
        .then((data) => {
          const parser = new DOMParser();
          const html = parser.parseFromString(data, "text/html");

          // slick模块
          changeVariantSwiper(html)
          // 多属性模块
          let optionList = [];
          if (type === "Material") {
            optionList.push("Color")
          }
          if (type === "Color") {
            optionList.push("Material")
            optionList.push("Size")
          }
          // if (type === "Size") {
          //   optionList.push("Color")
          //   optionList.push("Size")
          // }
          changeVariantOption(html, optionList)
          // addons模块
          changeVariantAddons(html)
          // 价格购买相关模块
          const quantity = document.querySelector(".product_info_new_right_buybox_quantity_input").value
          changeVariantBuyBox(html, quantity)
          // 埋点数据
          document.querySelector('#fb_act_data').innerHTML = html.querySelector('#fb_act_data').innerHTML;
          document.querySelector('#gtag_act_data').innerHTML = html.querySelector('#gtag_act_data').innerHTML;
          // 切换变体地址
          reExecuteScripts(document.querySelector(".product_info_new_right_extra_bottom"))
          reExecuteScripts(document.querySelector(".payway_modal"))
          const url = new URL(window.location.href);
          url.searchParams.set("variant", variantId);
          window.history.replaceState(null, "", url.toString());
        });
    }

    // 系列产品切换
    function changeSeries(handle) {
      const handleMap = {
        "blacklyte-kraken-pro-gaming-chair": ["schwarzer-kraken-pro-gaming-chair", "blacklyte-silla-de-juego-profesional-kraken", "blacklyte-kraken-pro-pro-gaming-chair", "blacklyte-chaise-de-jeu-kraken-pro"],
        "blacklyte-kraken-gaming-chair": ["schwarzer-kraken-gaming-stuhl", "blacklyte-silla-de-juego-kraken", "blacklyte-kraken-gaming-chair", "blacklyte-chaise-de-jeu-kraken"],
        "blacklyte-athena-pro-gaming-chair": ["schwarzer-athena-pro-gaming-chair", "blacklyte-silla-de-juego-de-athena-pro", "blacklyte-athena-pro-gaming-chair", "blacklyte-chaise-de-jeu-athena-pro"],
        "blacklyte-athena-gaming-chair": ["schwarzer-athena-gaming-chair", "blacklyte-silla-de-juego-de-athena", "blacklyte-athena-gaming-chair", "blacklyte-chaise-de-jeu-athena"],
      };
      const getEnglishHandle = (handle) => {
        for (let english in handleMap) {
          if (
            handleMap[english].some((c) => c === handle) ||
            english === handle
          ) {
            return english;
          }
        }
      }

      fetch(`/products/${window.location.host.indexOf(".eu") > -1 ? getEnglishHandle(handle) : handle}.js`)
        .then(response => response.json())
        .then(data => {
          let activeColor, activeMaterial
          if (product_type === "chairs") {
            if (document.querySelector(".product_info_new_right_select_contain[data-type='Color'] .product_info_new_right_select_item_active")) {
              activeColor = document.querySelector(".product_info_new_right_select_contain[data-type='Color'] .product_info_new_right_select_item_active").getAttribute("data-color")
              activeMaterial = document.querySelector(".product_info_new_right_select_contain[data-type='Color'] .product_info_new_right_select_item_active").getAttribute("data-material")
            }
          } else {
            activeColor = document.querySelector(".product_info_new_right_select_contain[data-type='Color'] .product_info_new_right_select_item_active").getAttribute("data-value")
            activeMaterial = document.querySelector(".product_info_new_right_select_contain[data-type='Material'] .product_info_new_right_select_item_active").getAttribute("data-value")
          }

          let showVariant = data.variants.find(item => item.option2 === activeColor && item.option1 === activeMaterial && item.available)
          if (!showVariant) {
            showVariant = data.variants.find(el => el.available)
            if (!showVariant) {
              showVariant = data.variants[0]
            }
          }

          if (showVariant) {
            fetch(`/products/${handle}?variant=${showVariant.id}`)
              .then((response) => response.text())
              .then((data) => {
                const parser = new DOMParser();
                const html = parser.parseFromString(data, "text/html");

                // swiper模块
                changeVariantSwiper(html)
                // 多属性模块
                const optionList = ["Material", "Size", "Color"];
                changeVariantOption(html, optionList)
                // addons模块
                changeVariantAddons(html)
                // 购买模块
                const quantity = document.querySelector(".product_info_new_right_buybox_quantity_input").value
                changeVariantBuyBox(html, quantity)
                // 埋点数据
                document.querySelector('#fb_act_data').innerHTML = html.querySelector('#fb_act_data').innerHTML;
                document.querySelector('#gtag_act_data').innerHTML = html.querySelector('#gtag_act_data').innerHTML;
                // compare、specs、faq模块
                if (showVariant.name.indexOf('Athena Pro Liquid Edition') == -1) {
                  changeSeriesSection(html)
                } else {
                  safeReplaceSections(html)
                }
                reExecuteScripts(document.querySelector(".product_info_new_right_extra_bottom"))
                reExecuteScripts(document.querySelector(".payway_modal"))
                // 切换变体地址
                const url = new URL(`${window.location.origin}/products/${handle}?variant=${showVariant.id}`);
                window.history.replaceState(null, "", url.toString());
              });
          }
        });
    }

    // slick替换
    function changeVariantSwiper(html) {
      const swiperContain = document.querySelector('.product_info_new_left');
      swiperContain.innerHTML = html.querySelector(".product_info_new_left").innerHTML;
      initImgObjectFit()
      initSlick()
      if (show_spin) {
        const images = document.querySelectorAll('.product-360-image');
        let currentIndex = 0;
        let imageCount = images.length;

        const handleMouseMove = (event) => {
          let mouseX = event.clientX || event.touches?.[0]?.clientX || 0;
          let viewerRect = viewer.getBoundingClientRect();
          let relativeX = mouseX - viewerRect.left;
          let newIndex = Math.floor((relativeX / viewerRect.width) * imageCount);

          newIndex = Math.max(0, Math.min(newIndex, imageCount - 1));

          if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            images.forEach((img, i) => {
              img.style.opacity = i === currentIndex ? '1' : '0';
            });
          }
        }

        const viewer = document.getElementById('product-360-viewer');
        viewer.addEventListener('mousemove', handleMouseMove);
        viewer.addEventListener('touchmove', handleMouseMove);
      }
    }

    // 多属性替换
    function changeVariantOption(html, optionList) {
      const parent = document.querySelector(".product_info_new_right");

      optionList.forEach(type => {
        let targetContainer, newTargetContainer
        if (type === "Color" && product_type === "chairs") {
          targetContainer = document.querySelector(
            `.product_info_new_right_select_contain[data-type="${type}"] .product_info_new_right_select_itembox .product_info_new_right_select_itembox_color`
          );
          newTargetContainer = html.querySelector(
            `.product_info_new_right_select_contain[data-type="${type}"] .product_info_new_right_select_itembox .product_info_new_right_select_itembox_color`
          );
        } else {
          targetContainer = document.querySelector(
            `.product_info_new_right_select_contain[data-type="${type}"] .product_info_new_right_select_itembox`
          );
          newTargetContainer = html.querySelector(
            `.product_info_new_right_select_contain[data-type="${type}"] .product_info_new_right_select_itembox`
          );
        }

        if (targetContainer) {
          // 已存在 → 替换子项
          const oldItems = targetContainer.querySelectorAll(
            ".product_info_new_right_select_item"
          );
          oldItems.forEach(item => item.remove());

          const newItems = newTargetContainer
            ? newTargetContainer.querySelectorAll(
              ".product_info_new_right_select_item"
            )
            : [];
          newItems.forEach(item => targetContainer.appendChild(item));

          if (newItems.length) {
            targetContainer.closest(".product_info_new_right_select_contain").classList.remove("hidden");
          } else {
            targetContainer.closest(".product_info_new_right_select_contain").classList.add("hidden");
          }
        } else {
          // 页面不存在 → 插入整个容器，按 html 中的顺序放置
          const newWrap = html.querySelector(
            `.product_info_new_right_select_contain[data-type="${type}"]`
          );
          if (newWrap && parent) {
            // 找到 html 里它的上一个兄弟
            let prev = newWrap.previousElementSibling;
            let inserted = false;
            while (prev) {
              const prevType = prev.getAttribute("data-type");
              if (
                prevType &&
                parent.querySelector(
                  `.product_info_new_right_select_contain[data-type="${prevType}"]`
                )
              ) {
                const prevInDoc = parent.querySelector(
                  `.product_info_new_right_select_contain[data-type="${prevType}"]`
                );
                prevInDoc.after(newWrap);
                inserted = true;
                break;
              }
              prev = prev.previousElementSibling;
            }
            // 如果没有上一个兄弟存在 → 插到最前面
            if (!inserted) parent.prepend(newWrap);
          }
        }
      });

      initOptionClick(optionList);

      if (product_type === "chairs" && window.innerWidth <= 1200) {
        document.querySelector(".product_info_new_right_select_choosedbox").innerHTML = html.querySelector(".product_info_new_right_select_choosedbox").innerHTML
      }
      if (product_type === "desk") {
        const productItems = document.querySelectorAll('.product_info_new_right_select_contain[data-type="Size"] .product_info_new_right_select_item');
        productItems.forEach((el) => {
          el.addEventListener('click', function () {
            const index = Array.from(productItems).indexOf(this);

            $(".specs_new_item_body_slick").slick('slickGoTo', index);
          });
        });
        const activeItem = document.querySelector('.product_info_new_right_select_contain[data-type="Size"] .product_info_new_right_select_item_active');
        const initialIndex = Array.from(productItems).indexOf(activeItem);
        $(".specs_new_item_body_slick").slick('slickGoTo', initialIndex);
      }
      if (document.querySelector(".product_info_new_right_size_switch")) {
        const type = document.querySelector(".product_info_new_right_size_switch_item.active").getAttribute("data-type")
        document.querySelectorAll(".product_info_new_right_select_contain[data-type='Size'] .product_info_new_right_select_item").forEach(el => {
          const info = type === "normal" ? el.getAttribute("data-size") : el.getAttribute("data-size-format")
          el.querySelector(".product_info_new_right_size_extra").innerHTML = info.replaceAll('/', '"')
        })
      }
    }

    // addons替换
    function changeVariantAddons(html) {
      const targetContainer = document.querySelector('.product_info_new_right_product_addons');
      if (targetContainer) {
        const targetElement = targetContainer.querySelector('.product_info_new_right_select_title');
        const oldItems = targetContainer.querySelectorAll('.product_info_new_right_product_addons_item_active');
        oldItems.forEach(item => item.remove());
        const newItems = html.querySelectorAll('.product_info_new_right_product_addons_item_active');
        [...newItems].reverse().forEach(item => {
          targetElement.insertAdjacentElement('afterend', item);
        });
      }
    }

    // compare、specs、faq模块
    function changeSeriesSection(html) {
      const mainContent = document.querySelector('#MainContent');
      if (!mainContent) return;

      const allOld = [...mainContent.querySelectorAll('.shopify-section')];

      const featureOld = mainContent.querySelector('#feature')?.closest('.shopify-section');
      const compareOld = mainContent.querySelector('#faq')?.closest('.shopify-section');

      if (!featureOld || !compareOld) return;

      const startIdx = allOld.indexOf(featureOld);
      const endIdx = allOld.indexOf(compareOld);

      if (startIdx < 0 || endIdx < 0 || endIdx <= startIdx) return;

      // ===============================
      // 获取 NEW HTML 中的对应区段
      // ===============================
      const newAll = [...html.querySelectorAll('#MainContent .shopify-section')];

      const featureNew = html.querySelector('#feature')?.closest('.shopify-section');
      const compareNew = html.querySelector('#faq')?.closest('.shopify-section');

      if (!featureNew || !compareNew) return;

      const newStartIdx = newAll.indexOf(featureNew);
      const newEndIdx = newAll.indexOf(compareNew);

      if (newStartIdx < 0 || newEndIdx < 0 || newEndIdx <= newStartIdx) return;

      // NEW sections（feature 与 compare 之间）
      const newMidSections = newAll.slice(newStartIdx, newEndIdx + 1);

      // OLD sections（需要被移除的）
      const oldMidSections = allOld.slice(startIdx, endIdx + 1);
      const insertAnchor = allOld[startIdx - 1] || featureOld.parentNode.firstChild;
      // --------------------------
      // Step 1: clone 新 sections 隐藏后准备插入
      // --------------------------
      const fragment = document.createDocumentFragment();

      newMidSections.forEach(sec => {
        const clone = sec.cloneNode(true);
        clone.style.visibility = 'hidden';
        clone.style.opacity = '0';
        fragment.appendChild(clone);
      });

      // --------------------------
      // Step 2: 删除旧 sections
      // --------------------------
      oldMidSections.forEach(el => el.remove());

      // --------------------------
      // Step 3: 插入新 sections（featureOld 后面）
      // --------------------------
      if (insertAnchor?.after) {
        insertAnchor.after(fragment);
      } else {
        mainContent.prepend(fragment);
      }

      // --------------------------
      // Step 4: 动画显示
      // --------------------------
      requestAnimationFrame(() => {
        const inserted = [...mainContent.querySelectorAll('.shopify-section')]
          .slice(startIdx, startIdx + newMidSections.length);

        inserted.forEach(el => {
          el.style.visibility = 'visible';
          el.style.transition = 'opacity 0.3s ease';
          requestAnimationFrame(() => {
            el.style.opacity = '1';
          });
          reExecuteScripts(el);
        });
      });
      // document.querySelector('#compare').innerHTML = html.querySelector('#compare').innerHTML;
      // document.querySelector('#specs').innerHTML = html.querySelector('#specs').innerHTML;
      // document.querySelector('#faq').innerHTML = html.querySelector('#faq').innerHTML;

      // const specsItems = document.querySelectorAll('.specs_new_item');
      // specsItems.forEach((item) => {
      //   const specsItem = item.querySelector('.specs_new_item_head');
      //   specsItem.addEventListener('click', function () {
      //     item.classList.toggle('active');
      //   });
      // });

      // document.querySelectorAll('#faq .card-header').forEach((headerButton) => {
      //   headerButton.addEventListener('click', (event) => {
      //     const btn = event.currentTarget
      //     const content = btn.nextElementSibling

      //     btn.classList.toggle('collapsed');

      //     if (content.style.maxHeight) {
      //       content.style.maxHeight = null;
      //     } else {
      //       content.style.maxHeight = content.scrollHeight + 'px';
      //     }
      //   });
      // });
    }

    function reExecuteScripts(container) {
      const scripts = container.querySelectorAll('script');

      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');

        // copy attributes
        [...oldScript.attributes].forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });

        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }

        oldScript.replaceWith(newScript);
      });
    }

    // 价格购买相关替换
    function changeVariantBuyBox(html, quantity) {
      document.querySelector(".product_info_new_right_buybox").innerHTML = html.querySelector(".product_info_new_right_buybox").innerHTML;
      document.querySelector(".product_info_new_product_title").innerHTML = html.querySelector(".product_info_new_product_title").innerHTML;
      document.querySelector(".product_info_new_right_extra_bottom").innerHTML = html.querySelector(".product_info_new_right_extra_bottom").innerHTML;
      document.querySelector(".product_info_new_right_total").innerHTML = html.querySelector(".product_info_new_right_total").innerHTML;
      document.querySelector(".product_info_new_right_contain_bottom .product_info_new_right_buybox_btns").innerHTML = html.querySelector(".product_info_new_right_contain_bottom .product_info_new_right_buybox_btns").innerHTML;
      // document.querySelector(".product_info_new_right_contain_bottom .product_infor_simplicity_right_buybox_price").innerHTML = html.querySelector(".product_info_new_right_contain_bottom .product_infor_simplicity_right_buybox_price").innerHTML;
      document.querySelector(".product_info_new_right_contain_top .product_infor_simplicity_right_buybox_price").innerHTML = html.querySelector(".product_info_new_right_contain_top .product_infor_simplicity_right_buybox_price").innerHTML;
      if (document.querySelector(".product_info_new_right_select_contain_spec[data-type=Color] .product_info_new_right_select_bottom_flex")) {
        document.querySelector(".product_info_new_right_select_contain_spec[data-type=Color] .product_info_new_right_select_bottom_flex").innerHTML = html.querySelector(".product_info_new_right_select_contain_spec[data-type=Color] .product_info_new_right_select_bottom_flex").innerHTML;
      }
      document.querySelector(".product_info_new_bottom_bar").innerHTML = html.querySelector(".product_info_new_bottom_bar").innerHTML;
      document.querySelector(".product_info_new_right_buybox_quantity_input").value = quantity;
      const newBuybox = initBuybox();
      newBuybox.quantityBindPrice(quantity)
    }

    function safeReplaceSections(html) {
      const mainContent = document.querySelector('#MainContent');
      if (!mainContent) return;

      const allOld = [...mainContent.querySelectorAll('.shopify-section')];

      const featureOld = mainContent.querySelector('#feature')?.closest('.shopify-section');
      const compareOld = mainContent.querySelector('#compare')?.closest('.shopify-section');

      if (!featureOld || !compareOld) return;

      const startIdx = allOld.indexOf(featureOld);
      const endIdx = allOld.indexOf(compareOld);

      if (startIdx < 0 || endIdx < 0 || endIdx <= startIdx) return;

      // ===============================
      // 获取 NEW HTML 中的对应区段
      // ===============================
      const newAll = [...html.querySelectorAll('#MainContent .shopify-section')];

      const featureNew = html.querySelector('#feature')?.closest('.shopify-section');
      const compareNew = html.querySelector('#compare')?.closest('.shopify-section');

      if (!featureNew || !compareNew) return;

      const newStartIdx = newAll.indexOf(featureNew);
      const newEndIdx = newAll.indexOf(compareNew);

      if (newStartIdx < 0 || newEndIdx < 0 || newEndIdx <= newStartIdx) return;

      // NEW sections（feature 与 compare 之间）
      const newMidSections = newAll.slice(newStartIdx + 1, newEndIdx);

      // OLD sections（需要被移除的）
      const oldMidSections = allOld.slice(startIdx + 1, endIdx);

      // --------------------------
      // Step 1: clone 新 sections 隐藏后准备插入
      // --------------------------
      const fragment = document.createDocumentFragment();

      newMidSections.forEach(sec => {
        const clone = sec.cloneNode(true);
        clone.style.visibility = 'hidden';
        clone.style.opacity = '0';
        fragment.appendChild(clone);
      });

      // --------------------------
      // Step 2: 删除旧 sections
      // --------------------------
      oldMidSections.forEach(el => el.remove());

      // --------------------------
      // Step 3: 插入新 sections（featureOld 后面）
      // --------------------------
      featureOld.after(fragment);

      // --------------------------
      // Step 4: 动画显示
      // --------------------------
      requestAnimationFrame(() => {
        const inserted = [...mainContent.querySelectorAll('.shopify-section')].slice(startIdx + 1, startIdx + 1 + newMidSections.length);

        inserted.forEach(el => {
          el.style.visibility = 'visible';
          el.style.transition = 'opacity 0.3s ease';
          requestAnimationFrame(() => {
            el.style.opacity = '1';
          });
        });
      });
    }

    // 数量切换&加购和购买
    initBuybox()
    function initBuybox() {
      // 数量切换
      const quantityInput = document.querySelector(".product_info_new_right_buybox_quantity_input")
      document.querySelectorAll(".product_info_new_right_buybox_quantity_btn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
          const type = btn.getAttribute("data-type");
          const quantity = Number(quantityInput.value)
          if (type === "minus" && quantity > 1) {
            quantityInput.value = quantity - 1
          }
          if (type === "plus" && quantity < 20) {
            quantityInput.value = quantity + 1
          }
          quantityBindPrice(quantityInput.value)
        });
      });
      if (quantityInput) {
        quantityInput.addEventListener("input", function (event) {
          let value = quantityInput.value.replace(/\D/g, ""); // 只保留数字
          if (value === "") {
            quantityInput.value = value;
            // quantityBindPrice(1)
            return;
          }

          value = Math.max(1, Math.min(20, parseInt(value, 10))); // 限制范围 1-10
          quantityInput.value = value;

          quantityBindPrice(value)
        });

        quantityInput.addEventListener('blur', function () {
          let value = quantityInput.value.replace(/\D/g, "");
          if (value == '') {
            quantityInput.value = 1;
            quantityBindPrice(1)
          }
        });
      }

      // 加购和购买
      document.querySelectorAll(".product_info_new_right_buybox_btns_btn").forEach((btn) => {
        btn.addEventListener("click", async (event) => {
          const type = btn.getAttribute("data-type");
          const cartIcon = document.querySelector(".header--cart .header__icon--cart");
          const goods_id = document.querySelector("input[name='goods_id']").value
          const cartFormData = { items: [{ id: goods_id, quantity: Number(quantityInput.value) }] };
          btn.classList.add("is_loading");
          if (type === "add_to_cart") {
            try {
              await fetch(window.Shopify.routes.root + "cart/add.js", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cartFormData),
              });

              Shopify.getCart((cartTotal) => {
                // document.body.classList.add("cart-sidebar-show");
                updateSidebarCart(cartTotal);
              });
            } finally {
              btn.classList.remove("is_loading");
              setTimeout(() => cartIcon?.click(), 0);
            }
          }
          if (type === "buy_it_now") {
            const fb_act_data = JSON.parse(document.getElementById('fb_act_data').textContent);
            fb_act_data.num_items = Number(quantityInput.value)
            fb_act_data.value = safeMul(Number(quantityInput.value), fb_act_data.value)
            fbq('track', 'AddToCart', fb_act_data);
            const gtag_act_data = JSON.parse(document.getElementById('gtag_act_data').textContent);
            gtag_act_data.items.quantity = Number(quantityInput.value)
            gtag_act_data.value = safeMul(Number(quantityInput.value), gtag_act_data.value)
            gtag_act_data.ecomm_totalvalue = gtag_act_data.value
            gtag("event", "add_to_cart", gtag_act_data)
            const API_VERSION = '2025-07';
            const GRAPHQL_URL = `/api/${API_VERSION}/graphql.json`;
            const STOREFRONT_TOKEN = '4335256c4579b074431a2f87c10d5e2c';

            async function buyNow(items) {
              const mutation = `
            mutation cartCreate($input: CartInput!) {
              cartCreate(input: $input) {
                cart {
                  id
                  checkoutUrl
                }
                userErrors {
                  field
                  message
                }
                warnings {
                  code
                  message
                }
              }
            }
          `;

              const variables = {
                input: {
                  lines: items.map(item => ({
                    quantity: item.quantity,
                    merchandiseId: `gid://shopify/ProductVariant/${item.id}`
                  })),
                  buyerIdentity: {
                    countryCode: "DE"
                  }
                }
              };

              const res = await fetch(GRAPHQL_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN
                },
                body: JSON.stringify({ query: mutation, variables })
              }).then(r => r.json());

              const errors = res.data.cartCreate.userErrors;
              if (errors && errors.length) {
                console.error('CartCreate Errors:', errors);
                return;
              }

              window.location.href = res.data.cartCreate.cart.checkoutUrl;
            }

            // 使用示例
            btn.classList.add("is_loading");
            buyNow(cartFormData.items).finally(() => {
              btn.classList.remove("is_loading");
            });
          }
        });
      });

      return {
        quantityBindPrice
      };
    }

    // 数量调整价格变化
    function quantityBindPrice(quantity) {
      if (!quantity) quantity = document.querySelector(".product_info_new_right_buybox_quantity_input").value
      const discountPriceNodeList = document.querySelectorAll(".product_infor_simplicity_right_buybox_price_info_discount[need-change='true']");
      const savePriceNodeList = document.querySelectorAll(".product_infor_simplicity_right_buybox_price_info_save[need-change='true']");
      const opNodeList = document.querySelectorAll(".product_infor_simplicity_right_buybox_price_info_op[need-change='true']");
      const mowithNodeList = document.querySelectorAll(".product_infor_simplicity_right_buybox_price_afterpay_mowith");
      const sixMowithNodeList = document.querySelectorAll(".product_infor_simplicity_right_buybox_price_afterpay_sixmowith");

      const discountPrice = parseLocalizedNumber(discountPriceNodeList[discountPriceNodeList.length - 1].getAttribute("data-value"));
      const updateDiscountPrice = safeMul(discountPrice, Number(quantity))

      discountPriceNodeList.forEach(el => el.innerHTML = currency_symbol + updateDiscountPrice)
      document.querySelector(".product_info_new_right_total_num").innerHTML = currency_symbol + updateDiscountPrice
      mowithNodeList.forEach(el => el.innerHTML = currency_symbol + (updateDiscountPrice / 24).toFixed(2))
      sixMowithNodeList.forEach(el => el.innerHTML = currency_symbol + (updateDiscountPrice / 3).toFixed(2))

      if (savePriceNodeList.length > 0) {
        const savePrice = parseLocalizedNumber(savePriceNodeList[savePriceNodeList.length - 1].getAttribute("data-value"));
        const updateSavePrice = savePrice * Number(quantity)
        savePriceNodeList.forEach(el => el.innerHTML = "Save " + currency_symbol + updateSavePrice)
        opNodeList.forEach(el => el.innerHTML = currency_symbol + safeAdd(updateDiscountPrice, updateSavePrice))
      }
    }

    // 价格格式化
    function parseLocalizedNumber(str) {
      if (typeof str !== 'string') return NaN;
      const hasComma = str.includes(',');
      const hasDot = str.includes('.');

      // 如果两者都有，判断哪个是小数点
      if (hasComma && hasDot) {
        if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
          // ',' 是小数点，'.' 是千位分隔符（欧洲风格）
          return parseFloat(str.replace(/\./g, '').replace(',', '.'));
        } else {
          // '.' 是小数点，',' 是千位分隔符（美式风格）
          return parseFloat(str.replace(/,/g, ''));
        }
      }

      // 仅有 ','，可能是小数或千分位，默认 ',' 为小数点
      if (hasComma) return parseFloat(str.replace(',', '.'));

      // 仅有 '.'，默认 '.' 是小数点
      return parseFloat(str);
    }

    function getDecimalLength(num) {
      const str = num.toString();
      if (str.includes('e-')) {
        // 处理科学计数法，例如 1e-7
        const [base, exp] = str.split('e-');
        return Number(exp);
      }
      const parts = str.split('.');
      return parts[1] ? parts[1].length : 0;
    }

    function toInteger(num) {
      const decimalLength = getDecimalLength(num);
      const scale = Math.pow(10, decimalLength);
      return {
        integer: Math.round(num * scale),
        scale
      };
    }

    function safeAdd(a, b) {
      const len = Math.max(getDecimalLength(a), getDecimalLength(b));
      const scale = Math.pow(10, len);
      return (Math.round(a * scale) + Math.round(b * scale)) / scale;
    }

    function safeSub(a, b) {
      const len = Math.max(getDecimalLength(a), getDecimalLength(b));
      const scale = Math.pow(10, len);
      return (Math.round(a * scale) - Math.round(b * scale)) / scale;
    }

    function safeMul(a, b) {
      const { integer: intA, scale: scaleA } = toInteger(a);
      const { integer: intB, scale: scaleB } = toInteger(b);
      return (intA * intB) / (scaleA * scaleB);
    }

    function safeDiv(a, b) {
      const { integer: intA, scale: scaleA } = toInteger(a);
      const { integer: intB, scale: scaleB } = toInteger(b);
      return (intA / intB) * (scaleB / scaleA);
    }

    // 可选加购商品
    initSelectAddson()
    function initSelectAddson() {
      const selectAddsonItems = document.querySelectorAll(".product_info_new_right_product_addons_item:not(.product_info_new_right_product_addons_item_active)")
      if (selectAddsonItems.length) {
        selectAddsonItems.forEach(item => {
          const btn = item.querySelector(".product_info_new_right_product_addons_item_btn")
          btn.addEventListener("click", async (event) => {
            event.stopPropagation();
            const goods_id = item.getAttribute("data-id")
            const cartIcon = document.querySelector(".header--cart .header__icon--cart");
            const cartFormData = { items: [{ id: goods_id, quantity: 1 }] };
            btn.classList.add("is_loading");
            try {
              await fetch(window.Shopify.routes.root + "cart/add.js", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cartFormData),
              })
              refreshCartItems()
              Shopify.getCart((cartTotal) => {
                document.body.classList.add("cart-sidebar-show");
                updateSidebarCart(cartTotal);
              });
            } finally {
              btn.classList.remove("is_loading");
              // setTimeout(() => cartIcon?.click(), 0);
              if (window.innerWidth <= 1200) {
                btn.innerHTML = "Add Success"
                btn.classList.add("is_active");

                setTimeout(() => {
                  btn.innerHTML = "Add to cart"
                  btn.classList.remove("is_active");
                }, 2000)
              } else {
                $('.header-nav-cart').css({
                  'opacity': '1',
                  'max-height': '630px',
                  "position": "fixed",
                  "top": window.scrollY > 100 ? "0" : "100px"
                });

                setTimeout(() => {
                  $('.header-nav-cart').css({
                    'opacity': '0',
                    'max-height': '0',
                    "position": "absolute",
                    "top": "60px"
                  });
                }, 3000)
              }
            }
          })
        })
      }
    }

    // 猜你喜欢
    initYouMightAlsoLike()
    function initYouMightAlsoLike() {
      const select_products = document.querySelectorAll('.product_info_new_right_product_recommended .product_info_new_right_product_addons_item');
      select_products.forEach((select_product) => {
        const data = JSON.parse(
          select_product.querySelector('.product_info_new_right_product_addons_item_data').textContent
        );
        const option_selects = select_product.querySelectorAll('.product_info_new_right_select_line_contain');
        option_selects.forEach((option_select, i) => {
          const index = option_select.getAttribute('data-index');
          const select = option_select.querySelector('.product_info_new_right_select_option');
          const other_options = Array.from(option_selects).filter((_, j) => j !== i);
          select.addEventListener('click', (e) => {
            e.stopPropagation();
          });
          select.addEventListener('change', (e) => {
            const value = e.target.value;
            const initialVariants = data.filter(
              (item) => item.variant[`option${index}`] == value && item.variant.available
            );
            let matchedVariants = [...initialVariants];
            if (matchedVariants.length > 1 && other_options.length) {
              other_options.forEach((other_option) => {
                const other_index = other_option.getAttribute('data-index');
                const other_value = other_option.querySelector('.product_info_new_right_select_option').value;

                if (other_value) {
                  matchedVariants = matchedVariants.filter((item) => item.variant[`option${other_index}`] == other_value);
                }
              });

              if (matchedVariants.length === 0) {
                matchedVariants = initialVariants;
              }
            }
            const matchedVariant = matchedVariants[0];
            if (matchedVariant) {
              select_product.querySelector('.product_info_new_right_product_addons_item_img').src =
                matchedVariant.show_img;
              select_product.setAttribute('data-id', matchedVariant.variant.id);
              other_options.forEach((item) => {
                const item_index = item.getAttribute('data-index');
                const item_select = item.querySelector('.product_info_new_right_select_option');

                const newValue = matchedVariant.variant[`option${item_index}`];
                if (item_select.value !== newValue) {
                  item_select.value = newValue;
                }
              });
              const discount_price = select_product.querySelector('.product_info_new_right_product_addons_item_price_dp');
              const origin_price = select_product.querySelector('.product_info_new_right_product_addons_item_price_op');
              origin_price.innerHTML = moneyWithoutTrailingZeros(matchedVariant.variant.price, matchedVariant.symbol);
              origin_price.setAttribute('data-value', (matchedVariant.variant.price / 100).toFixed(2));
              if (matchedVariant.discount) {
                discount_price.classList.add('show');
                const discountPrice = origin_price.getAttribute('data-value') * 100 - matchedVariant.discount;
                console.log(discountPrice);
                discount_price.innerHTML = moneyWithoutTrailingZeros(discountPrice, matchedVariant.symbol);
                discount_price.setAttribute('data-value', (matchedVariant.discount / 100).toFixed(2));
              } else {
                discount_price.classList.remove('show');
              }
            }
          });
        });
      });
    }
    initAddonsItemModal()
    function initAddonsItemModal() {
      const select_products = document.querySelectorAll(
        '.product_info_new_right_product_recommended .product_info_new_right_product_addons_item'
      );

      select_products.forEach((select_product) => {
        const modal = select_product.querySelector('.addons_item_modal');
        if (!modal) return;
        select_product.addEventListener('click', (e) => {
          moveModalToBody(modal);
          modal.style.display = 'block';
          document.body.classList.add('compare-modals-show');
          initAddonsModalSlick(modal);
          bindAddonsModalSlickEvents(modal);
        });
        const closeBtn = modal.querySelector('#close_addons_item_modal');
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          modal.style.display = 'none';
          document.body.classList.remove('compare-modals-show');
        });
        modal.addEventListener('click', (e) => {
          e.stopPropagation();
          if (e.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('compare-modals-show');
          }
        });
      });

      function moveModalToBody(modal) {
        if (modal && modal.parentNode !== document.body) {
          document.body.appendChild(modal);
        }
      }
    }
    function initAddonsModalSlick(modal) {
      const $main = $(modal).find('.addons_item_imgmain_body');
      const $thumb = $(modal).find('.addons_item_imgthumb_body');

      if (!$main.length || !$thumb.length) return;

      if (!$main.hasClass('slick-initialized')) {
        $main.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          waitForAnimate: false,
          infinite: false,
          asNavFor: $thumb,
        });
      }

      if (!$thumb.hasClass('slick-initialized')) {
        $thumb.slick({
          variableWidth: true,
          slidesToScroll: 1,
          asNavFor: $main,
          focusOnSelect: true,
          waitForAnimate: false,
          infinite: false,
          arrows: false,
        });
      }
    }
    function bindAddonsModalSlickEvents(modal) {
      const $main = $(modal).find('.addons_item_imgmain_body');
      const $thumb = $(modal).find('.addons_item_imgthumb_body');

      $(modal)
        .off('click.slickPrevMain')
        .on('click.slickPrevMain', ".addons_item_imgmain_prev", function () {
          $main.slick("slickPrev");
        });

      $(modal)
        .off('click.slickNextMain')
        .on('click.slickNextMain', ".addons_item_imgmain_next", function () {
          $main.slick("slickNext");
        });

      $(modal)
        .off('click.slickPrevThumb')
        .on('click.slickPrevThumb', ".addons_item_imgthumb_prev", function () {
          $thumb.slick("slickPrev");
        });

      $(modal)
        .off('click.slickNextThumb')
        .on('click.slickNextThumb', ".addons_item_imgthumb_next", function () {
          $thumb.slick("slickNext");
        });

      $main.on('afterChange', function (event, slick, current) {
        const currentSlide = current ?? slick.currentSlide;
        const lastSlide = slick.slideCount - 1;

        if (currentSlide > 0) {
          $(modal).find('.addons_item_imgmain_prev').removeClass('hidden');
        } else {
          $(modal).find('.addons_item_imgmain_prev').addClass('hidden');
        }

        if (currentSlide >= lastSlide) {
          $(modal).find('.addons_item_imgmain_next').addClass('hidden');
        } else {
          $(modal).find('.addons_item_imgmain_next').removeClass('hidden');
        }
      });

      $thumb.on('afterChange', function (event, slick, current) {
        const currentSlide = current ?? slick.currentSlide;
        const lastSlide = slick.slideCount - 1;

        if (currentSlide > 0) {
          $(modal).find('.addons_item_imgthumb_prev').removeClass('hidden');
        } else {
          $(modal).find$('.addons_item_imgthumb_prev').addClass('hidden');
        }

        if (currentSlide >= lastSlide) {
          $(modal).find('.addons_item_imgthumb_next').addClass('hidden');
        } else {
          $(modal).find('.addons_item_imgthumb_next').removeClass('hidden');
        }
      });

      if (modal.querySelector(".addons_item_imgthumb_body .slick-track")) {
        blockTransform(modal.querySelector(".addons_item_imgthumb_body .slick-track"))
      }
    }

    // cm in 切换展示
    initSizeFormatSwitch()
    function initSizeFormatSwitch() {
      document.querySelectorAll(".product_info_new_right_size_switch_item").forEach(item => {
        item.addEventListener("click", () => {
          document.querySelector(".product_info_new_right_size_switch_item.active").classList.remove("active")
          item.classList.add("active")
          const type = item.getAttribute("data-type")
          document.querySelectorAll(".product_info_new_right_select_contain[data-type='Size'] .product_info_new_right_select_item").forEach(el => {
            const info = type === "normal" ? el.getAttribute("data-size") : el.getAttribute("data-size-format")
            el.querySelector(".product_info_new_right_size_extra").innerHTML = info.replaceAll('/', '"')
          })
        })
      })
    }

    // 椅子移动端颜色选择弹窗
    initChairColorSelectMobile()
    function initChairColorSelectMobile() {
      if (product_type === "chairs" && document.querySelector(".product_info_new_right_select_choosedbox")) {
        document.querySelector(".product_info_new_right_select_choosedbox").addEventListener("click", () => {
          if (window.innerWidth <= 1200) {
            document.body.classList.add("compare-modals-show");
            document.querySelector(".product_info_new_bottom_bar").style.zIndex = 99
            document.querySelector(".product_info_new_right_select_itembox_mask").style.display = "block"
            document.querySelector(".product_info_new_right_select_contain_spec[data-type='Color'] .product_info_new_right_select_itembox").style.display = "block"
            document.querySelector("#conversation-badge").style.display = "none"
          }
        })

        function closeChoosedbox() {
          document.body.classList.remove("compare-modals-show");
          document.querySelector(".product_info_new_right_select_itembox_mask").style.display = "none"
          document.querySelector(".product_info_new_right_select_contain_spec[data-type='Color'] .product_info_new_right_select_itembox").style.display = "none"
          document.querySelector("#conversation-badge").style.display = "flex"
          document.querySelector(".product_info_new_bottom_bar").style.zIndex = 100
        }

        document.querySelector(".product_info_new_right_select_itembox_mask").addEventListener("click", () => {
          closeChoosedbox()
        })

        document.querySelector(".product_info_new_right_select_contain_spec[data-type='Color'] .product_info_new_right_select_itembox .product_info_new_right_select_title svg").addEventListener("click", () => {
          closeChoosedbox()
        })

        // document.querySelectorAll(".product_info_new_right_select_contain_spec[data-type='Color'] .product_info_new_right_select_itembox .product_info_new_right_select_item").forEach(item => {
        //   item.addEventListener("click", () => {
        //     if (window.innerWidth <= 500) {
        //       const color = item.getAttribute("data-color")
        //       const material = item.getAttribute("data-material")
        //       document.querySelector(".product_info_new .product_info_new_right_select_contain_spec[data-type='Color'] .product_info_new_right_select_bottom_option").innerHTML = `${material} | ${color}`
        //       // closeChoosedbox()
        //     }
        //   })
        // })

        document.querySelector(".product_info_new_right_select_contain_spec[data-type='Color'] .product_info_new_right_select_bottom_btn").addEventListener("click", () => {
          closeChoosedbox()
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        })
      }
    }

    // 更新侧边栏购物车
    function updateSidebarCart(cart) {
      if (cart && Object.keys(cart).length > 0) {
        const cartDropdown = document.querySelector(
          "#halo-cart-sidebar .halo-sidebar-wrapper .previewCart-wrapper"
        );
        if (!cartDropdown) return;

        const cartLoading = document.createElement("div");
        cartLoading.classList.add("loading-overlay", "loading-overlay--custom");
        cartLoading.innerHTML = `
                <div class="loading-overlay__spinner">
                    <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                        <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
                    </svg>
                </div>
            `;

        cartDropdown.classList.add("is-loading");
        cartDropdown.prepend(cartLoading);

        fetch(window.routes.root + "/cart?view=ajax_side_cart", {
          cache: "no-store",
        })
          .then((response) => response.text())
          .then((data) => {
            cartDropdown.classList.remove("is-loading");
            cartDropdown.innerHTML = data;
          })
          .catch((error) => {
            console.error("Cart update error:", error);
          })
          .finally(() => {
            document
              .querySelectorAll("[data-cart-count]")
              .forEach((el) => (el.textContent = cart.item_count));

            document.querySelectorAll("[data-cart-text]").forEach((el) => {
              el.textContent =
                cart.item_count === 1
                  ? window.cartStrings.item
                  : window.cartStrings.items;
            });

            document.dispatchEvent(
              new CustomEvent("cart-update", { detail: cart })
            );

            if (document.body.classList.contains("cursor-fixed__show")) {
              window.sharedFunctionsAnimation.onEnterButton();
              window.sharedFunctionsAnimation.onLeaveButton();
            }
          });
      }
    }

    if (!variant.available) {
      if (product_type === "chair") {
        const available_ariant = product.variants.find(item => item.available)
        changeVariant(available_ariant.id, "Color")
      } else if (product_type === "desk") {
        const available_ariant = product.variants.find(item => item.available && item.option1 === variant.option1)
        changeVariant(available_ariant.id, "Color")
      }
    }

    function moneyWithoutTrailingZeros(cents, currencySymbol = '$') {
      const amount = cents / 100;
      const formatted = amount.toFixed(2);
      const final = formatted.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
      return `${currencySymbol}${final}`;
    }

    // 刷新购物车
    function refreshCartItems() {
      const sectionId = $('.header-nav-cart').data('section')
      $.ajax({
        type: "GET",
        url: `/cart?section_id=${sectionId}`,
        cache: false,
        success: function (data) {
          // 解析返回的 section HTML
          let response = $(data);

          // 提取新的商品列表块
          let newCartContent = response.find('.cart_doesnot_empty_cont').html();
          if ($('.cart_doesnot_empty_cont').length) {
            $('.cart_doesnot_empty_cont').html(newCartContent);
          } else {
            newCartContent = response.find('.cart-container').html();
            $(".cart-container.cart-container-empty").html(newCartContent);
            $(".cart-container.cart-container-empty").removeClass("cart-container-empty");
          }

          // 刷新底部按钮和小计
          let newCartBottom = response.find('.cart_bottom_btns').html();
          $('.cart_bottom_btns').html(newCartBottom);

          // 检查是否已变为空购物车
          if (response.find('.cart_doesnot_empty').length === 0) {
            $('.cart_doesnot_empty').remove();
            $('.cart-container').addClass('cart-container-empty');
            $('.cart-container').append(response.find('.empty_cart'));
          }

          // 取消 loading
          $('.cart-container').removeClass('is-loading');
        },
        error: function () { },
        complete: function () {
          $('[data-cart-count]').each(function () {
            const $el = $(this);
            // 只保留数字并解析，避免空格或其他字符干扰
            const current = parseInt($el.text().replace(/\D/g, ''), 10) || 0;
            $el.text(current + 1);
          });
        }
      })
    }
  });
})(jQuery);