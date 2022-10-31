// Custom color logger
function colorLog(message, color) {
  color = color || "black";
  switch (color) {
    case "success":  
      color = "Green"; 
      break;
    case "info":     
      color = "DodgerBlue";  
      break;
    case "error":   
      color = "Red";     
      break;
    case "warning":  
      color = "Orange";   
      break;
    default: 
      color = color;
  }
  console.log("%c" + message, "color:" + color);
}

// Main Script function
(() => {
  
  // Iniciamos el script
  colorLog('***** Cruwi Script Init *****', "warning");

  // Testeo en local
  let isLocalDevelopment = window.document.location.hostname === '127.0.0.1';

  // Procesamos el script
  let currentScriptProcessed;
  if(isLocalDevelopment) {
    const testScript = document.createElement('script');
    testScript.setAttribute('src','https://unpkg.com/cruwi-widget@1.0.11/index.js?merchantName=matchaandco&apiKey=1234567890&widgetType=pdp');
    currentScriptProcessed = testScript;
  } else {
    currentScriptProcessed = document.currentScript;
  }
  
  // Obtenemos los datos del merchant por la url del script
  const merchantNameFromScript = new URLSearchParams(new URL(currentScriptProcessed.getAttribute('src')).search).get('merchantName');
  const merchantApiKeyFromScript = new URLSearchParams(new URL(currentScriptProcessed.getAttribute('src')).search).get('apiKey');
  const widgetTypeFromScript = new URLSearchParams(new URL(currentScriptProcessed.getAttribute('src')).search).get('widgetType');

  colorLog(`Merchant: ${merchantNameFromScript}`, "info");
  colorLog(`Api Key: ${merchantApiKeyFromScript}`, "success");
  colorLog(`Widget Type: ${widgetTypeFromScript}`, "success");

  // Comprobamos nombre del merchant según la url
  const TLDs = ["ac", "ad", "ae", "aero", "af", "ag", "ai", "al", "am", "an", "ao", "aq", "ar", "arpa", "as", "asia", "at", "au", "aw", "ax", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "biz", "bj", "bm", "bn", "bo", "br", "bs", "bt", "bv", "bw", "by", "bz", "ca", "cat", "cc", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "co", "com", "coop", "cr", "cu", "cv", "cx", "cy", "cz", "de", "dj", "dk", "dm", "do", "dz", "ec", "edu", "ee", "eg", "er", "es", "et", "eu", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gb", "gd", "ge", "gf", "gg", "gh", "gi", "gl", "gm", "gn", "gov", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr", "ht", "hu", "id", "ie", "il", "im", "in", "info", "int", "io", "iq", "ir", "is", "it", "je", "jm", "jo", "jobs", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mg", "mh", "mil", "mk", "ml", "mm", "mn", "mo", "mobi", "mp", "mq", "mr", "ms", "mt", "mu", "museum", "mv", "mw", "mx", "my", "mz", "na", "name", "nc", "ne", "net", "nf", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz", "om", "org", "pa", "pe", "pf", "pg", "ph", "pk", "pl", "pm", "pn", "pr", "pro", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "sh", "si", "sj", "sk", "sl", "sm", "sn", "so", "sr", "st", "su", "sv", "sy", "sz", "tc", "td", "tel", "tf", "tg", "th", "tj", "tk", "tl", "tm", "tn", "to", "tp", "tr", "travel", "tt", "tv", "tw", "tz", "ua", "ug", "uk", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "wf", "ws", "xxx", "ye", "yt", "za", "zm", "zw"].join();

  function getDomain(url){
    var parts = url.split('.');
    if (parts[0] === 'www' && parts[1] !== 'com'){
      parts.shift()
    }
    var ln = parts.length, i = ln, minLength = parts[parts.length-1].length, part
    while(part = parts[--i]){
      if (i === 0 || i < ln-2 || part.length < minLength || TLDs.indexOf(part) < 0){
        return part
      }
    }
  }

  // Obtenemos el nombre del merchant oficial
  let merchantNameFromUrl = getDomain(isLocalDevelopment ? 'matchaandco.com' : window.location.host);
  colorLog(`Merchant Name: ${merchantNameFromUrl}`, "success");

  // Obtenemos el documento completo (para montar HTML luego)
  const body = document.querySelector('body');

  // Comprobamos si hay widget y qué tipo de widget se solicita
  const widgetElement = document.querySelector('[data-cruwi-widget-type]');

  if(widgetElement) {

    // Obtenemos el tipo de widget que hay en la página
    const widgetType = widgetElement.dataset.cruwiWidgetType;

    // Según sea el tipo montamos
    if(widgetType === 'pdp') {
      buildCruwiModal();
      buildCruwiPDPWidget();
    } else if(widgetType === 'section') {
      buildCruwiSectionWidget();
    } else if(widgetType === 'checkout') {
      buildCruwiCheckoutWidget();
    } else {
      console.error('This widget type does not exists');
    }

  } else {
    console.error('There is no CRUWI widget to display.');
  }

  // Función que monta el PDP Widget
  function buildCruwiPDPWidget() {

    // Creamos el Div con el banner
    const cruwiPDPWidget = document.createElement('div');
    cruwiPDPWidget.classList.add('cruwi-pdp-widget');
    cruwiPDPWidget.innerHTML = `
      <div role="button" tabindex="0" style="display: flex; align-items: center">
        <svg height="26" width="20" viewBox="0 0 26 40">
          <path d="M9.87537 16.842V15.7233C9.49211 15.6721 9.10246 15.6401 8.70003 15.6401C3.90288 15.6338 0 19.5399 0 24.3475C0 27.2947 1.46917 29.9031 3.71764 31.4822C2.26763 29.9287 1.37974 27.8381 1.37974 25.5494C1.37974 20.8121 5.17403 16.9507 9.87537 16.842Z" fill="#25F4EE"></path>
          <path d="M10.0862 29.5259C12.2261 29.5259 13.9763 27.819 14.053 25.6965L14.0594 6.72822H17.5215C17.4512 6.33824 17.4129 5.93548 17.4129 5.52632H12.686L12.6796 24.4946C12.603 26.6171 10.8527 28.324 8.71286 28.324C8.04854 28.324 7.42255 28.1578 6.86682 27.8637C7.58224 28.8674 8.75758 29.5259 10.0862 29.5259Z" fill="#25F4EE"></path>
          <path d="M23.9923 13.166V12.1112C22.6701 12.1112 21.4436 11.7212 20.4088 11.0435C21.3286 12.0984 22.5742 12.8656 23.9923 13.166Z" fill="#25F4EE"></path>
          <path d="M20.4088 11.0435C19.3995 9.88639 18.7927 8.37762 18.7927 6.72821H17.528C17.8537 8.53106 18.9269 10.0782 20.4088 11.0435Z" fill="#FE2C55"></path>
          <path d="M8.70642 20.3646C6.51544 20.3646 4.73328 22.1483 4.73328 24.3411C4.73328 25.8691 5.602 27.1988 6.86676 27.8637C6.39408 27.2116 6.11302 26.4125 6.11302 25.543C6.11302 23.3502 7.89518 21.5665 10.0862 21.5665C10.495 21.5665 10.891 21.6368 11.2615 21.7519V16.9188C10.8782 16.8676 10.4886 16.8356 10.0862 16.8356C10.0159 16.8356 9.95202 16.842 9.88175 16.842V20.55C9.50488 20.4349 9.11523 20.3646 8.70642 20.3646Z" fill="#FE2C55"></path>
          <path d="M23.9921 13.166V16.842C21.5392 16.842 19.2652 16.0557 17.4127 14.7259V24.3475C17.4127 29.1487 13.5099 33.0613 8.70631 33.0613C6.85388 33.0613 5.12921 32.4731 3.71753 31.4822C5.30806 33.1891 7.57569 34.2632 10.0861 34.2632C14.8832 34.2632 18.7925 30.357 18.7925 25.5494V15.9278C20.6449 17.2576 22.9189 18.0439 25.3718 18.0439V13.3131C24.8927 13.3131 24.4328 13.2619 23.9921 13.166Z" fill="#FE2C55"></path>
          <path d="M17.4127 24.3475V14.7259C19.2652 16.0557 21.5392 16.842 23.9921 16.842V13.166C22.574 12.8656 21.3284 12.0984 20.4086 11.0435C18.9266 10.0782 17.8599 8.53106 17.5213 6.72821H14.0592L14.0528 25.6964C13.9762 27.8189 12.2259 29.5259 10.0861 29.5259C8.75742 29.5259 7.58847 28.8674 6.86028 27.8701C5.59551 27.1988 4.72679 25.8755 4.72679 24.3475C4.72679 22.1547 6.50895 20.371 8.69993 20.371C9.10874 20.371 9.50478 20.4413 9.87527 20.5564V16.8484C5.17393 16.9507 1.37964 20.8121 1.37964 25.5494C1.37964 27.8381 2.26753 29.9223 3.71753 31.4822C5.12921 32.4731 6.85389 33.0613 8.70632 33.0613C13.5035 33.0613 17.4127 29.1487 17.4127 24.3475Z" fill="#000"></path>
        </svg>
        <span style="margin-left: 3px">Post on TikTok, <b>get paid.</b><b style="font-size: 0.75em; margin-left: 3px"><u>Sign up</u></b></span>
      </div>
    `;

    widgetElement.appendChild(cruwiPDPWidget);

    // Escuchamos el click
    cruwiPDPWidget.addEventListener('click', () => {
      let event = new CustomEvent("cruwiModalOpen", { bubbles: true });
      cruwiPDPWidget.dispatchEvent(event);
    });

    loadCruwiCustomFont();
    injectCruwiStyles();
  }

  // Función que monta la sección completa
  function buildCruwiSectionWidget() {
    console.log('-- Building Section Widget --');
  }

  // Función que monta el widget del checkout
  function buildCruwiCheckoutWidget() {
    console.log('-- Building Checkout Widget --');
  }

  // Función que monta el modal
  function buildCruwiModal() {

    // Creamos el modal con un ID
    const cruwiModal = document.createElement('div');
    cruwiModal.classList.add('cruwi-modal');
    cruwiModal.id = 'cruwiModal';

    // Creamos el overlay de cruwi
    const cruwiModalOverlay = document.createElement('div');
    cruwiModalOverlay.id = 'cruwi-modal-overlay';

    // Creamos el header del modal
    const cruwiModalHeader = document.createElement('div');
    cruwiModalHeader.classList.add('cruwi-modal-header');

    // Añadimos al header del modal
    const cruwiModalTitleDiv = document.createElement('div');
    cruwiModalTitleDiv.classList.add('cruwi-modal-title');

    // Añadimos el logo de Cruwi al header
    const cruwiModalLogo = document.createElement('img');
    cruwiModalLogo.src = 'https://uploads-ssl.webflow.com/62ea5c239bacb85550bf44ea/6324b93495448d6d49194864_Frame%201%20(2).png';
    cruwiModalLogo.classList.add('cruwi-modal-logo');
    cruwiModalTitleDiv.appendChild(cruwiModalLogo);
    cruwiModalHeader.appendChild(cruwiModalTitleDiv);

    // Añadimos el icono de cerrar el modal
    const cruwiModalCloseButton = document.createElement('img');
    cruwiModalCloseButton.src = 'https://svgshare.com/i/iSG.svg';
    cruwiModalCloseButton.classList.add('cruwi-modal-close-button');
    cruwiModalTitleDiv.appendChild(cruwiModalCloseButton);

    // Metemos el header en el modal
    cruwiModal.appendChild(cruwiModalHeader);

    // Creamos el cuerpo del modal
    const cruwiModalBody = document.createElement('div');
    cruwiModalBody.classList.add('cruwi-modal-body');

    // Metemos el cuerpo en el modal
    cruwiModal.appendChild(cruwiModalBody);

    // Creamos el footer del modal
    const cruwiModalFooter = document.createElement('div');
    cruwiModalFooter.classList.add('cruwi-modal-footer');

    // Creamos el wrapper y el powered by y el logo de cruwi
    const cruwiModalFooterWrapper = document.createElement('div');
    cruwiModalFooterWrapper.classList.add('cruwi-modal-footer-wrapper');
    cruwiModalFooter.appendChild(cruwiModalFooterWrapper);

    const cruwiModalFooterWrapperText = document.createElement('div');
    cruwiModalFooterWrapperText.classList.add('cruwi-modal-footer-wrapper-text');
    cruwiModalFooterWrapperText.insertAdjacentText('beforeend', 'Powered by CRUWI');
    cruwiModalFooterWrapper.appendChild(cruwiModalFooterWrapperText);
    
    // Metemos el footer en el modal
    cruwiModal.appendChild(cruwiModalFooter);

    // Añadimos el modal completo al documento
    document.body.appendChild(cruwiModal);

    // Añadimos el overlay al documento también
    document.body.appendChild(cruwiModalOverlay);

    // Escuchamos el evento de abrir el modal
    document.addEventListener("cruwiModalOpen", function(event) {
      console.log('Modal opened');
      // Mostramos el modal
      cruwiModal.classList.add('cruwi-modal-active');
      // Mostramos el overlay
      cruwiModalOverlay.classList.add('cruwi-modal-overlay-active');
      // Prevenimos el scroll en el body de modal con una clase
      body.classList.add('cruwi-modal-body-overflow');
    });

    // Añadimos eventos de click a la capa de overlay para cerrar el modal
    cruwiModalOverlay.addEventListener('click', () => {
      console.log('Modal closed');
      // Cerramos el modal
      cruwiModal.classList.remove('cruwi-modal-active');
      cruwiModalOverlay.classList.remove('cruwi-modal-overlay-active');
      // Devolvemos el overflow de body al default
      body.classList.remove('cruwi-modal-body-overflow');
    });

    // Añadimos el evento de click al botón de cerrar
    cruwiModalCloseButton.addEventListener('click', () => {
      console.log('Modal closed');
      // Cerramos el modal
      cruwiModal.classList.remove('cruwi-modal-active');
      cruwiModalOverlay.classList.remove('cruwi-modal-overlay-active');
      // Devolvemos el overflow de body al default
      body.classList.remove('cruwi-modal-body-overflow');
    });

  }

  // Cargamos el font que necesitamos de Google Fonts
  function loadCruwiCustomFont() {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'http://fonts.cdnfonts.com/css/proxima-nova-2');
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  // Cargamos el CSS de Cruwi
  function injectCruwiStyles() {
    const cruwiStyleTag = document.createElement('style');
    document.head.append(cruwiStyleTag);
    cruwiStyleTag.innerHTML = `

      .cruwi-pdp-widget {
        background-color: white;
        color: #111;
        display: inline-block;
        font-family: 'Proxima Nova', sans-serif;
        box-shadow: rgb(0 0 0 / 2%) 0px 1px 3px 0px, rgb(27 31 35 / 15%) 0px 0px 0px 1px;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
      }

      .cruwi-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: 10ms ease-in-out;
        border-radius: 0px;
        width: 100%;
        max-width: 100%;
        background-color: white;
        box-shadow: 1px 1px 20px #0000001c;
        font-family: 'Poppins', sans-serif;
        z-index: 999999;
        min-height: 100%;
        overflow: auto;
        display: flex;
        flex-direction: column;
      }
      
      .cruwi-modal.cruwi-modal-active {
        transform: translate(-50%, -50%) scale(1);
      }

      .cruwi-modal-body-overflow {
        overflow: hidden;
      }
      
      .cruwi-modal-header {
        padding: 10px 15px;
        border-bottom: 1px solid #ebe5e5;
      }

      @media only screen and (min-width: 992px) {
        .cruwi-modal {
          width: 600px;
          max-width: 90%;
          min-height: 80vh;
          border-radius: 10px
        }

        .cruwi-modal-header {
          padding: 15px 20px;
        }
      }
      
      .cruwi-modal-title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        align-items: center;
      }

      .cruwi-modal-logo {
        width: 25px;
      }
      
      .cruwi-modal-close-button {
        cursor: pointer;
        border: none;
        width: 20px;
        height: 20px;
      }
      
      .cruwi-modal-body {
        padding: 10px 20px 10px 20px;
      }
      
      .cruwi-modal-footer {
        border-top: 1px solid #ebe5e5;
        padding: 3px;
        margin-top: auto;
      }

      .cruwi-modal-footer-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-family: 'Proxima Nova', sans-serif;
      }

      .cruwi-modal-footer-wrapper-text {
        font-size: 10px;
      }

      #cruwi-modal-overlay {
        position: fixed;
        opacity: 0;
        transition: 200ms ease-in-out;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .6);
        pointer-events: none;
        z-index: 999998;
      }
      
      #cruwi-modal-overlay.cruwi-modal-overlay-active {
        opacity: 1;
        pointer-events: all;
        display: block !important;
      }
    `
  }

})();