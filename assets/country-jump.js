(() => {
  // 获取cookie的值
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  // 判断用户国家
  function judgeCountry() {
    const userCountry = getCookie("cf_country");
    const currentHost = window.location.host;
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;
    const langPrefixReg = /^\/(de|es|it|fr)(\/|$)/i;
    const normalizedPath = currentPath.replace(langPrefixReg, '/');
    const userSearchParams = new URLSearchParams(currentSearch)
    if(userSearchParams.get("stop_redirect") === "true" || /\/(de|es|it|fr)\//.test(currentPath)) {
      setCookie('_geo_stop_redirect', 'TRUE', 1);
      return; 
    }

    const regionNames = new Intl.DisplayNames(
      ['en'],
      { type: 'region' }
    );

    // 定义国家和对应的站点
    const siteCountrys = {
      "US": ["US"],
      "CA": ["CA"],
      "AU": ["AU"],
      "JP": ["JP"],
      "UK": ["GB", "GG", "JE"],
      "EU": [
        "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI",
        "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT",
        "NL", "PL", "PT", "RO", "SE", "SI", "SK"
      ]
    };

    // 定义站点重定向
    const siteRedirects = {
      'US': 'blacklyte.com',
      'CA': 'blacklyte.ca',
      'UK': 'blacklyte.uk',
      'AU': 'blacklyte.au',
      'JP': 'blacklyte.jp',
      'EU': 'blacklyte.eu'
    };

    const currentSites = {
      'com': 'us',
      'sg': 'sg',
      'uk': 'uk',
      'au': 'au',
      'jp': 'jp',
      'eu': 'eu',
      'ca': 'ca'
    };

    const currentStores = {
      'com': 'United States',
      'sg': 'Singapore',
      'uk': 'United Kingdom',
      'au': 'Australia',
      'jp': 'Japan',
      'eu': 'Europe',
      'ca': 'Canada'
    };

    const currentSite = currentSites[currentHost.split(".")[1]]
    const currentStore = currentStores[currentHost.split(".")[1]]

    // 判断用户的国家
    let targetSite = '';

    // 查找用户的国家代码是否在对应的国家数组中
    for (const country in siteCountrys) {
      if (siteCountrys[country].includes(userCountry)) {
        targetSite = country;
        break;
      }
    }

    // 如果目标站点找到
    if (targetSite) {
      // 判断是否访问 .com，.com站点重定向
      if (currentHost.includes('.com')) {
        const redirectUrl = siteRedirects[targetSite];
        if (redirectUrl && currentHost !== redirectUrl) {
          const newUrl = `https://${redirectUrl}${currentPath}${currentSearch}${currentHash}`;
          window.location.href = newUrl;
        }
      } else {
        // 如果是其他站点，弹窗提示用户是否跳转
        if (currentHost !== siteRedirects[targetSite]) {
          if (getCookie('_geo_stop_redirect') === 'TRUE') return
          const redirectUrl = siteRedirects[targetSite];
          const modalHTML = `
    <div id="jumpModal">
      <style>
        .cozy-crd__modal {
          display: block;
          position: fixed;
          z-index: 2147483647;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.4);
          -webkit-overflow-scrolling: touch;
        }

        .cozy-crd__ContentWrapper {
          position: relative;
          margin: auto;
          border: 1px;
          border-style: solid;
          top: 20%;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
          background: rgb(255, 255, 255);
          border-color: rgb(136, 136, 136);
          border-width: 0px;
          border-radius: 10px;
          top: 5;
          width: 750px;
          padding: 40px 0;
        }

        .cozy-crd__animation_default {
          -webkit-animation-name: cz-animatetop1;
          -webkit-animation-duration: 0.4s;
          animation-name: cz-animatetop1;
          animation-duration: 0.4s;
          -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }

        @-webkit-keyframes cz-animatetop1 {
          from {
            -webkit-transform: scale(0.7);
            -moz-transform: scale(0.7);
            -ms-transform: scale(0.7);
            transform: scale(0.7);
            opacity: 0;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            transition: all 0.3s;
          }

          to {
            -webkit-transform: scale(1);
            -moz-transform: scale(1);
            -ms-transform: scale(1);
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes cz-animatetop1 {
          from {
            -webkit-transform: scale(0.7);
            -moz-transform: scale(0.7);
            -ms-transform: scale(0.7);
            transform: scale(0.7);
            opacity: 0;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            transition: all 0.3s;
          }

          to {
            -webkit-transform: scale(1);
            -moz-transform: scale(1);
            -ms-transform: scale(1);
            transform: scale(1);
            opacity: 1;
          }
        }

        .cozy-crd__dismiss {
          top: 0;
          right: 10px;
          position: absolute;
          cursor: pointer;
          padding: 20px;
        }

        .cozy-crd__dismiss_icon {
          width: 16px;
          height: 16px;
        }

        .cozy-crd__dismiss_icon_path {
          stroke: #000000;
          stroke-width: 2px;
        }

        .cozy-crd__modal-header {
          padding-bottom: 1.75rem;
        }

        .cozy-crd__modal-body {
          background: rgb(255, 255, 255);
          color: rgb(38, 38, 41);
          font-size: 20px;
          text-align: center;
          margin-bottom: 29px;
        }

        .cozy-crd__modal-body-text {
          line-height: 40px;
        }

        .cozy-crd__visitor_country_name {
          font-weight: bold;
          white-space: nowrap;
        }

        .country_icon_svg svg {
          width: 70px;
          height: 30px;
          fill: none;
        }

        .line_bottom {
          display: block;
          height: 1px;
          width: 100%;
          background-color: #cdcdcd;
          margin-top: 27px;
        }

        .cozy-crd__confirm-button {
          padding: 9px 18px;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          color: rgb(255, 255, 255);
          background: #262629;
          font-size: 16px;
          margin: 15px auto;
          margin-bottom: 0px;
          position: relative;
        }

        .cozy-crd__confirm-button::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, #fff3 49.9%, #fff0 50%) no-repeat 100%
            100%;
          background-size: 300% 100%;
          border-radius: 90px;
          transition: background-position 0.4s ease-out;
          left: 0;
          top: 0;
        }

        .cozy-crd__decline-button {
          padding: 9px 18px;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          color: rgb(118, 118, 127);
          background: rgb(255, 255, 255);
          font-size: 16px;
          margin: auto;
        }

        .cozy-crd__btn {
          border: 0px;
          border-radius: 25px;
          display: block;
          line-height: 32px;
          width: 60%;
        }

        .cozy-crd__confirm-button:hover {
          color: #fff;
        }

        .cozy-crd__confirm-button:hover:before {
          background-position: 0 100%;
        }

        .cozy-crd__decline-button:hover {
          color: #262629;
          text-decoration: underline;
        }

        .flag-icon {
          background-position: 50%;
          background-repeat: no-repeat;
          position: relative;
          display: inline-block;
          background-size: cover;
          width: 6em;
          line-height: 4em;
          border: 1px solid #a1a1aa;
        }

        .flag-icon:before {
          content: "\u00A0";
        }

        .flag-icon-eu {
          background-image: url(https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/eu.svg);
        }

        .flag-icon-us {
          background-image: url(https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/us.svg);
        }

        .flag-icon-uk {
          background-image: url(https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/gb.svg);
        }

        .flag-icon-ca {
          background-image: url(https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/ca.svg);
        }

        .flag-icon-au {
          background-image: url(https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/au.svg);
        }

        .flag-icon-jp {
          background-image: url(https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/jp.svg);
        }

        .flag-icon-sg {
          background-image: url(https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/sg.svg);
        }

        @media only screen and (max-width: 768px) {
          .cozy-crd__ContentWrapper {
            width: 35rem;
            padding: 4rem 2rem 3rem 2rem;
          }

          .cozy-crd__modal-body {
            font-size: 16px;
            margin-bottom: 1.75rem;
          }

          .cozy-crd__btn {
            width: 81%;
          }

          .current_view {
            margin-bottom: 6px;
          }
        }

        @media only screen and (max-width: 500px) {
          .cozy-crd__modal-body,
          .cozy-crd__confirm-button,
          .cozy-crd__decline-button,
          .cozy-crd__dropdown_label {
            font-size: 13px;
          }

          .cozy-crd__btn {
            width: 100%;
          }
        }

        @media (max-width: 767px) {
          .cozy-crd__dismiss {
            padding: 0;
            top: 10px;
            right: 15px;
          }

          .cozy-crd__dismiss_icon {
            width: 12px;
            height: 12px;
          }

          .cozy-crd__modal-body-text {
            font-size: 16px;
            line-height: 20px;
          }

          .country_icon_svg svg {
            width: 50px;
            height: 20px;
          }

          .line_bottom {
            margin-top: 14px;
          }

          .cozy-crd__btn {
            line-height: 16px;
            width: 90%;
            font-size: 16px;
          }

          .cozy-crd__confirm-button {
            font-size: 18px;
            line-height: 20px;
          }
        }
      </style>

      <div class="cozy-crd__modal">
        <div class="cozy-crd__ContentWrapper cozy-crd__animation_default">
          <span class="cozy-crd__dismiss CozyCloseCRModal">
            <svg aria-hidden="true" focusable="false" role="presentation" class="cozy-crd__dismiss_icon CozyCloseCRModal" viewBox="0 0 27 27">
              <g fill="none" class="CozyCloseCRModal" fill-rule="evenodd" stroke-linecap="square">
                <path class="cozy-crd__dismiss_icon_path CozyCloseCRModal" d="M.5.5l26 26M26.5.5l-26 26"></path>
              </g>
            </svg>
          </span>
          <div class="cozyCRModal-Content">
            <div class="cozy-crd__modal-header">
              <div class="cozy-crd__modal-header-text"></div>
            </div>
            <div class="cozy-crd__modal-body">
              <div class="cozy-crd__modal-body-text">
                You seem to be shopping from
                <span class="cozy-crd__visitor_country_name">${regionNames.of(userCountry)}</span>.
                <div class="flag-icon-list" style="margin: 20px auto">
                  <span class="flag-icon flag-icon-${currentSite}"></span>
                  <span class="country_icon_svg">
                    <svg width="70" height="30" viewBox="0 0 79 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 22.3281L75 22.3281" stroke="#757575" stroke-width="3"></path>
                      <path d="M55.4703 42.9418L75.9414 22.4707L55.4703 1.99956" stroke="#757575" stroke-width="3"></path>
                    </svg>
                  </span>
                  <span class="flag-icon flag-icon-${targetSite.toLowerCase()}"></span>
                </div>
                <div class="current_view">You're currently viewing our <b style="white-space: nowrap;">${currentStore} Store</b></div>
                To serve you better, would you like to shop in the
                <b>Blacklyte ${targetSite} Store </b>instead.
                <span class="line_bottom"></span>
              </div>
            </div>
            <div class="cozy-crd__modal-footer">
              <input type="hidden" value="false" id="cozyCRRememberMe" />
              <a id="cozy-crd__confirm-button" class="cozy-crd__btn cozy-crd__confirm-button CozyCloseCRModal" href="https://${redirectUrl}${currentPath}${currentSearch}${currentHash}">Continue to Blacklyte ${targetSite} Store</a>
              <div class="cozy-crd__btn cozy-crd__decline-button CozyCloseCRModal">
                No, please do not redirect me.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

          // 插入HTML到body中
          // document.addEventListener('DOMContentLoaded', function () {
          //   document.body.insertAdjacentHTML('beforeend', modalHTML);
          // })
          if (document.body) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            document.body.classList.add("compare-modals-show")
            addCloseEventListener();
            return;
          }

          const observer = new MutationObserver(() => {
            if (document.body) {
              observer.disconnect();
              document.body.insertAdjacentHTML('beforeend', modalHTML);
              document.body.classList.add("compare-modals-show")
              addCloseEventListener();
            }
          });

          observer.observe(document.documentElement, {
            childList: true,
            subtree: true
          });

          function addCloseEventListener() {
            const closeButtons = document.querySelectorAll('.CozyCloseCRModal');
            if (closeButtons.length) {
              closeButtons.forEach(btn => {
                btn.addEventListener('click', function () {
                  setCookie('_geo_stop_redirect', 'TRUE', 1);
                  const modal = document.getElementById('jumpModal');
                  if (modal) {
                    modal.remove();
                    document.body.classList.remove("compare-modals-show")
                  }
                });
              })
            }
          }
        }
      }
    }
  }

  // 执行判断
  judgeCountry();
})();