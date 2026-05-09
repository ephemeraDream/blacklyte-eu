(function ($) {
  (() => {
    var $body = $('body'), $doc = $(document), $win = $(window);
    initMultiTab()
    if (window.innerWidth < 1025) {
      menuSidebarMobile();
    }
    let checkMenuMobile;
    window.innerWidth > 1024 ? checkMenuMobile = true : checkMenuMobile = false;
    $win.on('resize', () => {
      if (window.innerWidth > 1024) {
          document.body.classList.remove('menu_open')
      } else if (checkMenuMobile) {
          checkMenuMobile = false;
          menuSidebarMobile()
          initMultiTab()
          initMultiTabMobile()
      }
    });

    function initMultiTab() {
      let designMode, showMenu, check = true;
      document.body.matches('.shopify-design-mode') ? designMode = true : designMode = false;
      document.body.matches('.menu_open') ? showMenu = true : showMenu = false;

      const loadMenuDefault = () => {
        if (check) {
          check = false;
          initMobileMenuDefault(url)
        }
      }

      const loadMenuTab = () => {
        if (check) {
          check = false;
          initMultiTabMobile()
        }
      }

      if ($('[data-menu-tab]').length > 0) {

        var active = $('[data-menu-tab] li.is-active').data('load-page'),
          url = window.routes.root + `/search?type=product&q=${active}&view=ajax_mega_menu`;

        if ($body.hasClass('template-index')) {
          if ($win.width() < 1025) {
            if (window.mobile_menu == 'default') {
              window.addEventListener('load', () => {
                if (designMode || showMenu) {
                  loadMenuDefault();
                }
                else {
                  document.body.addEventListener('click', () => {
                    loadMenuDefault();
                  }, false)
                }
              }, false)
            } else {
              window.addEventListener('load', () => {
                if (designMode || showMenu) {
                  loadMenuTab();
                }
                else {
                  document.body.addEventListener('click', () => {
                    loadMenuTab();
                  }, false)
                }
              }, false)
            }
          }
        } else {
          if ($win.width() < 1025) {
            if (window.mobile_menu == 'default') {
              window.addEventListener('load', () => {
                if (designMode || showMenu) {
                  loadMenuDefault();
                }
                else {
                  document.body.addEventListener('click', () => {
                    loadMenuDefault();
                  }, false)
                }
              }, false)
            } else {
              window.addEventListener('load', () => {
                if (designMode || showMenu) {
                  loadMenuTab();
                }
                else {
                  document.body.addEventListener('click', () => {
                    loadMenuTab();
                  }, false)
                }
              }, false)
            }
          }
        }
      } else {
        var url = window.routes.root + '/search?view=ajax_mega_menu';

        if ($win.width() < 1025) {
          if (window.mobile_menu == "default") {
            if (designMode || showMenu) {
              loadMenuDefault();
            }
            else {
              document.body.addEventListener("click", () => {
                loadMenuDefault();
              }, false)
            }
          } else {
            window.addEventListener("load", () => {
              if (designMode || showMenu) {
                loadMenuTab();
              }
              else {
                document.body.addEventListener("click", () => {
                  loadMenuTab();
                }, false)
              }
            }, false)
          }
        }
      }
    }

    function initMobileMenuDefault(url) {
      const menuMobile = $('[data-navigation-mobile]');

      const nav = $('#NavgationMenuMobile[data-navigation-menu-mobile]');
      const style = nav.attr('style') != undefined ? nav.attr('style') : nav.closest('#NavgationMenuMobile').attr('style');

      let navHtml = nav.html() != undefined ? nav.html() : '';


      // 单独处理第一个chairs
      if (navHtml) {
        const tempDiv = $('<div>').append(navHtml);
        const secondLi = tempDiv.find('li:nth-child(1)');
        const allLi = tempDiv.find('li')
        allLi.each(function (index) {
          const li = $(this)
          if (index == 1) {
            li.attr('data-mobile-menu-level2-chairs', '');
          } else if (index == 2) {
            li.attr('data-mobile-menu-level2-desk', '');
          } else if (index == 3) {
            li.attr('data-mobile-menu-level2-accessory', '')
          } else if (index == 4) {
            li.attr('data-mobile-menu-level2-newarrival', '')
          } else if (index == 7) {
            // li.attr('data-mobile-menu-level2-support', '')
            li.attr('data-mobile-menu-level2-discover', '')
          }

          // else if(index == 7){
          //     li.attr('data-mobile-menu-level2-discover', '')
          // }

        })
        navHtml = tempDiv.html();
      }

      menuMobile.append(`
              <nav class="header__inline-menu" data-navigation role="navigation" style="${style != undefined ? style : ''}">
                ${navHtml}
              </nav>
            `);

      const topLanCur = $('.top-language-currency');
      const lanCurMobile = $('#navigation-mobile .nav-currency-language');

      if (lanCurMobile.text().trim() == '' && topLanCur.length > 0) lanCurMobile.append(`<div class="top-language-currency">${topLanCur.html()}</div>`)

      // Menu Mobile Tab on Header Vertical
      const menuVertical = document.querySelector('.header-nav-vertical-menu .vertical-menu .header__menu-vertical')

      if (menuVertical) {
        document.querySelector('.halo-sidebar.halo-sidebar_menu').classList.add('has-menu-vertical')

        const menuVerticalTitle = document.querySelector('.header-nav-vertical-menu .vertical-menu .categories-title__button .title').innerHTML
        const navMobile = document.querySelector('.site-nav-mobile.nav')
        const navMobileTitle = navMobile.querySelector('.menu-heading-mobile')
        const span = document.createElement('span')
        span.classList.add('title')
        span.innerHTML = menuVerticalTitle;

        navMobileTitle.appendChild(span);
        navMobile.appendChild(menuVertical);

        const menuVerticalNav = document.querySelector('.site-nav-mobile.nav .header__menu-vertical')
        menuVerticalNav.classList.add('header__inline-menu')

        const tabTitle = document.querySelectorAll('.site-nav-mobile.nav .menu-heading-mobile .title')
        const mobileMenu = document.querySelectorAll('.site-nav-mobile.nav .header__inline-menu')
        tabTitle[0].classList.add('is-active')
        mobileMenu[0].classList.add('is-active')

        tabTitle.forEach((item, index) => {
          item.addEventListener('click', () => {
            tabTitle.forEach(e => e.classList.remove('is-active'))
            item.classList.add('is-active')
            mobileMenu.forEach(e => e.classList.remove('is-active'))
            mobileMenu[index].classList.add('is-active')
          })
        })
      }
    }

    function initMultiTabMobile() {
      if ($win.width() < 1025) {
        if (window.mobile_menu == 'custom') {
          var chk = true,
            menuElement = $('[data-section-type="menu"]'),
            menuMobile = $('[data-navigation-mobile]'),
            menuTabMobile = $('[data-navigation-tab-mobile]');

          const loadMenu = () => {
            if (chk) {
              chk = false;
              const content = document.createElement('div');
              const tab = document.createElement('ul');

              Object.assign(tab, {
                className: 'menu-tab list-unstyled'
              });

              tab.setAttribute('role', 'menu');

              menuElement.each((index, element) => {
                var currentMenu = element.querySelector('template').content.firstElementChild.cloneNode(true);

                if (index == 0) {
                  currentMenu.classList.add('is-visible');
                } else {
                  currentMenu.classList.add('is-hidden');
                }

                content.appendChild(currentMenu);
              });

              content.querySelectorAll('[id^="MenuMobileListSection-"]').forEach((element, index) => {
                var tabTitle = element.dataset.heading,
                  tabId = element.getAttribute('id'),
                  tabElement = document.createElement('li');

                Object.assign(tabElement, {
                  className: 'item'
                });

                tabElement.setAttribute('role', 'menuitem');

                if (index == 0) {
                  tabElement.classList.add('is-active');
                }

                tabElement.innerHTML = `<a class="link" href="#" data-mobile-menu-tab data-target="${tabId}">${tabTitle}</a>`;


                tab.appendChild(tabElement);
              });

              $('.list-menu-loading').remove();
              menuTabMobile.html(tab);
              menuMobile.html(content.innerHTML);
            }

          }

          if ($('.header-nav-plain .header-language_currency').length > 0) {
            const topLanCur = $('.top-language-currency');
            const lanCurMobile = $('#navigation-mobile .nav-currency-language');
            if (lanCurMobile.text().trim() == '' && topLanCur.length > 0) lanCurMobile.append(`<div class="top-language-currency">${topLanCur.html()}</div>`)
          }

          if (document.body.matches('.menu_open')) {
            loadMenu();
          }

          document.body.addEventListener('click', () => {
            loadMenu();
          }, false);
        }
      }
    }

    function menuSidebarMobile() {
      var buttonIconOpen = $('.mobileMenu-toggle'),
        buttonClose = $('.halo-sidebar-close, .background-overlay');

      const menuSidebarMobileOpen = () => {

        $body.addClass('menu_open');
        $('.list-menu-loading').remove();
        if (window.mobile_menu == 'default') {
          if (!$('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').length) {
            $('.header .header__inline-menu').appendTo('#navigation-mobile .site-nav-mobile.nav');
          }
        }
        if (!$('#navigation-mobile .site-nav-mobile.nav-account .free-shipping-text').length) {
          $('.header-top--wrapper .header-top--right .free-shipping-text').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
        }
        if (!$('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').length) {
          $('.header-top--wrapper .header-top--right .customer-service-text').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
        }
        if (!$('#navigation-mobile .site-nav-mobile.nav-account .header__location').length) {
          $('.header-top--wrapper .header-top--right .header__location').appendTo('#navigation-mobile .site-nav-mobile.nav-account .wrapper-links');
        }
        if (!$('#navigation-mobile .top-language-currency').length) {
          if ($('.header').hasClass('header-03')) {
            $('.header .header-bottom-right .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
          } else if ($('.header').hasClass('header-05')) {
            $('.header .header-top--left .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
          } else {
            $('.header .header-language_currency .top-language-currency').appendTo('#navigation-mobile .site-nav-mobile.nav-currency-language');
          }
        }
      }

      if (document.body.matches('.menu_open')) {
        menuSidebarMobileOpen();
      }

      buttonIconOpen.off('click.toggleCurrencyLanguage').on('click.toggleCurrencyLanguage', (event) => {
        event.preventDefault();
        menuSidebarMobileOpen();
      });

      buttonClose.off('click.toggleCloseCurrencyLanguage').on('click.toggleCloseCurrencyLanguage', () => {
        $body.removeClass('menu_open');
        $('#navigation-mobile').off('transitionend.toggleCloseMenu').on('transitionend.toggleCloseMenu', () => {
          if (!$body.hasClass('menu_open')) {

            if (!$('.header .header__inline-menu').length) {
              if ($('.header').hasClass('header-03') || $('.header').hasClass('header-04') || $('.header').hasClass('header-07') || $('.header').hasClass('header-08')) {
                $('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').appendTo('.header .header-bottom--wrapper .header-bottom-left');
              } else {
                $('#navigation-mobile .site-nav-mobile.nav .header__inline-menu').appendTo('.header .header-bottom--wrapper');
              }
            }
            if (!$('.header-top--wrapper .header-top--right .free-shipping-text').length) {
              if (!$('.header-04').hasClass('style_2')) {
                $('#navigation-mobile .site-nav-mobile.nav-account .free-shipping-text').insertBefore('.header-top--wrapper .header-top--right .header__group');
              }
            }
            if (!$('.header-top--wrapper .header-top--right .header__location').length) {
              $('#navigation-mobile .site-nav-mobile.nav-account .header__location').insertBefore('.header-top--wrapper .header-top--right .header__group');
            }
            if (!$('.header-top--wrapper .header-top--right .customer-service-text').length) {
              if ($('.header').hasClass('header-03')) {
                $('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').insertBefore('.header-top--wrapper .header-top--right .header__group .header__icon--wishlist');
              } else {
                $('#navigation-mobile .site-nav-mobile.nav-account .customer-service-text').insertBefore('.header-top--wrapper .header-top--right .top-language-currency');
              }
            }
            if (!$('.header-language_currency .top-language-currency').length) {
              if ($('.header').hasClass('header-03')) {
                $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-bottom--wrapper .header-bottom-right .header-language_currency');
              } else if ($('.header').hasClass('header-04')) {
                $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-bottom--wrapper .header-bottom-right .header-language_currency');
              } else if ($('.header').hasClass('header-05')) {
                $('#navigation-mobile .site-nav-mobile .top-language-currency').appendTo('.header .header-top--wrapper .header-top--left .header-language_currency');
              } else {
                $('#navigation-mobile .site-nav-mobile .top-language-currency').insertBefore('.header .header-language_currency .header__search');
              }
            }
          }
        })

      });

      $doc.on('click', '.halo-sidebar-close', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $body.removeClass('menu_open');
      })

      // 点击移动端的chairs menu
      $doc.on('click', '[data-mobile-menu-level2-chairs]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.chairs-mobile-cont').addClass('chairs-mobile-cont-active')
        $body.addClass('menu_open_mb')
        $('.halo-sidebar_menu .halo-sidebar-wrapper').animate({ scrollTop: 0 }, 200);
      })

      // 点击移动端的desk menu
      $doc.on('click', '[data-mobile-menu-level2-desk]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.desk-mobile-cont').addClass('desk-mobile-cont-active')
        $body.addClass('menu_open_mb')
        $('.halo-sidebar_menu .halo-sidebar-wrapper').animate({ scrollTop: 0 }, 200);
      })
      // 点击移动端的lighting
      // $doc.on('click', '[data-mobile-menu-level2-lighting]', function(e) {
      //     $('.light-mobile-cont').addClass('light-mobile-cont-active')
      //     $body.addClass('menu_open_mb')
      // })
      // 点击移动端的accessory
      $doc.on('click', '[data-mobile-menu-level2-accessory]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.accessory-mobile-cont').addClass('accessory-mobile-cont-active')
        $body.addClass('menu_open_mb')
        $('.halo-sidebar_menu .halo-sidebar-wrapper').animate({ scrollTop: 0 }, 200);
      })
      // 点击移动端的new arrival
      $doc.on('click', '[data-mobile-menu-level2-newarrival]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.newarrival-mobile-cont').addClass('newarrival-mobile-cont-active')
        $body.addClass('menu_open_mb')
        $('.halo-sidebar_menu .halo-sidebar-wrapper').animate({ scrollTop: 0 }, 200);
      })
      // 点击移动端的support
      $doc.on('click', '[data-mobile-menu-level2-support]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.newsupport-mobile-cont').addClass('newsupport-mobile-cont-active')
        $body.addClass('menu_open_mb')
        $('.halo-sidebar_menu .halo-sidebar-wrapper').animate({ scrollTop: 0 }, 200);
      })
      // 点击移动端的discover
      $doc.on('click', '[data-mobile-menu-level2-discover]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.discover-mobile-cont').addClass('discover-mobile-cont-active')
        $body.addClass('menu_open_mb')
        $('.halo-sidebar_menu .halo-sidebar-wrapper').animate({ scrollTop: 0 }, 200);
      })
    }
  })()
})(jQuery);