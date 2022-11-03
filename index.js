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
    testScript.setAttribute('src','https://unpkg.com/cruwi-widget?merchantName=matchaandco&apiKey=1234567890&widgetType=checkout');
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

    let widgetText = "Comparte con amigos y consigue hasta 100% de cashback";

    // Vemos el tamaño de pantalla para algunos ajustes en el futuro
    let windowSize = window.screen.width;

    // Creamos el Div con el banner
    const cruwiPDPWidget = document.createElement('div');
    cruwiPDPWidget.id = "cruwi-pdp-widget";
    cruwiPDPWidget.classList.add('cruwi-pdp-widget');
    cruwiPDPWidget.innerHTML = `
      <div class="cruwi-pdp-widget-wrapper">
        <div class="cruwi-pdp-widget-logo-wrapper">
          <div class="cruwi-pdp-widget-logo">
            <img class="cruwi-pdp-widget-logo-img" src="https://uploads-ssl.webflow.com/62ea5c239bacb85550bf44ea/6328573bad60f760ac2b5fbb_CRUWI%20(3).svg" alt="CRUWI Logo Banner" >
          </div>
        </div>
        <div class="cruwi-pdp-widget-text">
          ${widgetText}
        </div>
      </div>
      <div class="cruwi-pdp-widget-button">Saber más</div>
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
  async function buildCruwiCheckoutWidget() {

    // Comprobamos que exista el objeto Shopify
    if(!window.Shopify) return;

    // Get main data from shopify checkout
    let shopRawUrl = Shopify.shop;
    let orderId = Shopify.checkout.order_id;
    let discountCode = Shopify.checkout.discount ? Shopify.checkout.discount.code : '';
    let lineItems = Shopify.checkout.line_items;
    let isCruwiDiscount = Boolean(discountCode && discountCode.slice(0, 3) === 'CCB');

    colorLog(`DISCOUNT: ${isCruwiDiscount}`, "info");
    
    try {

      // Pedimos los datos de la tienda y de la campaña que tenga activa
      const { data: { brandName, isActive, logoUrl, merchantUrl, campaigns } } = await fetchGetMerchantAndCampaignData(shopRawUrl);

      // Comprobamos que está activo el merchant
      if(!isActive) return;

      // Comprobamos que el pedido tenga producto de la campaña activa (EL MATCH)
      // --> 1º sacar el array de ids de line items
      // --> 2º filtrar el array de objetos producto con el array de ids
      // los productos comprados (line_items) llevan el id sin el prefijo.. lo metemos para el match
      let lineItemsIds = lineItems.map(product => 'gid://shopify/Product/' + product.product_id);
      let matches = campaigns[0].products.filter(function (product) {
        return lineItemsIds.indexOf(product.id) >= 0; 
      });

      console.log(matches);

      // Comprobamos el nº de matches (si no hay matches, nada.. no es de la campaña)
      if(matches.length === 0) return;

      // Mandamos los datos del pedido y cliente actuales
      const { data: { shopData: { shortUrl } } } = await fetchPostClientData(Shopify.checkout, matches, isCruwiDiscount, shopRawUrl);

      // Creamos el Div principal del checkout (izquierda)
      const cruwiCheckoutMainWidget = document.createElement('div');
      cruwiCheckoutMainWidget.id = "cruwi-checkout-main-widget";
      cruwiCheckoutMainWidget.classList.add('cruwi-checkout-main-widget');

      cruwiCheckoutMainWidget.innerHTML = `
        <div class="cruwi-checkout-main-widget-content">
          <div class="marquee running js-marquee"> 
            <div class="marquee-inner"> 
              <span>GANA CASHBACK</span> 
            </div>
          </div>
          <h5 class="cruwi-checkout-main-widget-content-title">
            Invita a amigos y consigue que tu pedido te salga gratis
          </h5>
          <p class="cruwi-checkout-main-widget-content-info">
            Con tu compra en <b>${brandName ? brandName : 'esta tienda'}</b> has desbloqueado una mini tienda 
            personalizada con descuentos que te permitirá ganar dinero cuando un amigo 
            compre a través de ella. ¡Podrás recuperar hasta el 100% del
            importe de tu compra!
          </p>
          <a target="_blank" href="${shortUrl}" class="cruwi-checkout-main-widget-content-button">
            ACCEDE A TU TIENDA
          </a>
        </div>
      `;

      widgetElement.appendChild(cruwiCheckoutMainWidget);

      loadCruwiCustomFont();
      injectCruwiStyles();

      // Marquee logic
      document.querySelectorAll('.js-marquee').forEach(function(e) {
        var letter = e.querySelector('span');
        for (counter = 1; counter <= 3; ++counter) {
          var clone = letter.cloneNode(true);
          letter.after(clone);
        }
      })

    } catch (error) {
      console.log(error);
      return;
    }

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

    // Creamos el contenido del cuerpo del modal
    const cruwiModalBodyContent = document.createElement('div');
    cruwiModalBodyContent.classList.add('cruwi-modal-body-content');
    cruwiModalBodyContent.innerHTML = `
      <div class="cruwi-modal-body-content-wrapper">
        <h4 class="cruwi-modal-body-content-title">Comparte con amigos y gana por recomendar</h4>
        <p class="cruwi-modal-body-content-info">
          Consigue hasta 100% en cashback y accede a descuentos 
          exclusivos cuando compartas y compres con amigos a 
          través de tu Cruwi
        </p>
        <div class="cruwi-modal-body-content-how">
          <span class="cruwi-modal-body-content-how-text">¿Cómo funciona?<span>
        </div>
        <div class="cruwi-modal-body-content-steps">

          <div class="cruwi-modal-body-content-step">
            <div class="cruwi-modal-body-content-step-icon">
              🛍️
            </div>
            <div class="cruwi-modal-body-content-step-text">
              Completa tu pedido como siempre para obtener un link a tu Cruwi Tienda personalizada.
            </div>
          </div>

          <div class="cruwi-modal-body-content-step">
            <div class="cruwi-modal-body-content-step-icon">
              📲
            </div>
            <div class="cruwi-modal-body-content-step-text">
              Comparte el link de tu Cruwi Tienda con tus amigos para que puedan comprar con descuentos exclusivos.
            </div>
          </div>

          <div class="cruwi-modal-body-content-step">
            <div class="cruwi-modal-body-content-step-icon">
              🤑
            </div>
            <div class="cruwi-modal-body-content-step-text">
              Obtén hasta un 100% en cashback (directo a tu cuenta) cuando tus amigos compren.
            </div>
          </div>

          <div class="cruwi-modal-body-content-step">
            <div class="cruwi-modal-body-content-step-icon">
              🤫
            </div>
            <div class="cruwi-modal-body-content-step-text">
              Cuando recibas el pedido, puedes compartir un video en TikTok y ganar 1€ en cashback por cada 1000 views.
            </div>
          </div>

        </div>
        <h4 class="cruwi-modal-body-content-subtitle">
          Cúrratelo para que tus amigos compren y no paréis de ganar
        </h4>
      </div>
    `;

    // Metemos el contenido en el cuerpo
    cruwiModalBody.appendChild(cruwiModalBodyContent);

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
    link.setAttribute('href', 'http://fonts.cdnfonts.com/css/dm-sans');
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  // Cargamos el CSS de Cruwi
  function injectCruwiStyles() {
    const cruwiStyleTag = document.createElement('style');
    document.head.append(cruwiStyleTag);
    cruwiStyleTag.innerHTML = `

      :root {
        --offset: 20vw;
        --move-initial: calc(-25% + var(--offset));
        --move-final: calc(-50% + var(--offset));
      }

      #cruwi-pdp-widget {
        position: relative !important;
        background-color: white;
        transition: 0.3s;
        color: #111 !important;
        display: inline-block;
        font-family: 'DM Sans', sans-serif !important;
        border: 1px solid #EBD0FF;
        border-radius: 8px;
        padding: 8px !important;
        cursor: pointer;
      }

      #cruwi-pdp-widget:hover {
        background-color: #EBD0FF;
      }

      #cruwi-pdp-widget .cruwi-pdp-widget-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      #cruwi-pdp-widget .cruwi-pdp-widget-button {
        position: absolute !important;
        bottom: 0;
        right: 0;
        font-size: 9px !important;
        font-weight: bold !important;
        letter-spacing: 0px !important;
        background: #eeeeee !important;
        padding: 2px 10px !important;
        border-top-left-radius: 8px !important;
        border-bottom-right-radius: 8px !important;
      }

      #cruwi-pdp-widget .cruwi-pdp-widget-wrapper .cruwi-pdp-widget-logo-wrapper {
        background-color: #EBD0FF;
        padding: 5px 12px;
        border-radius: 8px;
        margin-right: 10px;
      }

      #cruwi-pdp-widget .cruwi-pdp-widget-wrapper .cruwi-pdp-widget-logo-wrapper .cruwi-pdp-widget-logo {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 35px;
      }

      #cruwi-pdp-widget .cruwi-pdp-widget-wrapper .cruwi-pdp-widget-logo-wrapper .cruwi-pdp-widget-logo .cruwi-pdp-widget-logo-img {
        width: 80px !important;
        border-radius: 0px !important;
        margin-bottom: 0 !important;
        max-width: none !important;
      }

      #cruwi-pdp-widget .cruwi-pdp-widget-wrapper .cruwi-pdp-widget-text {
        font-size: 14px !important;
        max-width: 260px !important;
        letter-spacing: 0px !important;
        line-height: normal !important;
      }

      .cruwi-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: 10ms ease-in-out;
        border-radius: 0px;
        width: 100%;
        height: 100%;
        background-color: white;
        box-shadow: 1px 1px 20px #0000001c;
        font-family: 'Poppins', sans-serif;
        z-index: 999999;
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
      
      #cruwiModal .cruwi-modal-header {
        padding: 10px 15px;
        border-bottom: 1px solid #ebe5e5;
      }
      
      #cruwiModal .cruwi-modal-title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        align-items: center;
      }

      #cruwiModal .cruwi-modal-logo {
        width: 25px;
      }
      
      #cruwiModal .cruwi-modal-close-button {
        cursor: pointer;
        border: none;
        width: 20px;
        height: 20px;
      }
      
      #cruwiModal .cruwi-modal-body {
        padding: 24px;
        font-family: 'DM Sans', sans-serif;
      }

      #cruwiModal .cruwi-modal-body-content-title {
        margin: 0;
        padding: 0;
        font-size: 28px !important;
        text-align: center;
        line-height: 1.2 !important;
        font-family: 'DM Sans', sans-serif !important;
        color: black !important;
        letter-spacing: 0px !important;
      }

      #cruwiModal .cruwi-modal-body-content-info {
        margin: 0;
        padding: 0;
        margin-top: 15px;
        font-size: 16px !important;
        text-align: center;
        font-family: 'DM Sans', sans-serif !important;
        color: black !important;
        letter-spacing: 0px !important;
        line-height: 1.4 !important;
      }

      #cruwiModal .cruwi-modal-body-content-how {
        margin: 0;
        padding: 0;
        width: fit-content;
        border: 1px solid #EBD0FF;
        margin: 20px auto 0 auto;
        padding: 4px 16px;
        border-radius: 8px;
        background: #FFFFF2;
      }

      #cruwiModal .cruwi-modal-body-content-how-text {
        color: black !important;
        font-size: 16px !important;
        letter-spacing: 0px !important;
      }

      #cruwiModal .cruwi-modal-body-content-steps {
        margin: 0;
        padding: 0;
        margin-top: 15px;
      }

      #cruwiModal .cruwi-modal-body-content-step {
        display: flex;
        align-items: center;
        max-width: 400px;
        margin: 0 auto 15px auto;
      }

      #cruwiModal .cruwi-modal-body-content-step-icon {
        padding: 20px;
        font-size: 25px;
      }

      #cruwiModal .cruwi-modal-body-content-step-text {
        font-family: 'DM Sans', sans-serif;
        font-weight: 400;
        font-size: 16px !important;
        color: black !important;
        line-height: normal !important;
        letter-spacing: 0px !important;
      }

      #cruwiModal .cruwi-modal-body-content-subtitle {
        padding: 0;
        font-size: 22px;
        text-align: center;
        line-height: 1.2;
        max-width: 350px;
        margin: 30px auto 10px auto;
        font-family: 'DM Sans', sans-serif;
        color: black !important;
        letter-spacing: 0px !important;
      }
      
      #cruwiModal .cruwi-modal-footer {
        border-top: 1px solid #ebe5e5;
        padding: 3px;
        margin-top: auto;
      }

      #cruwiModal .cruwi-modal-footer-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-family: 'DM Sans', sans-serif;
      }

      #cruwiModal .cruwi-modal-footer-wrapper-text {
        font-size: 10px;
        font-family: 'DM Sans', sans-serif;
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

      @media only screen and (min-width: 762px) {
        #cruwiModal .cruwi-modal-body-content-title {
          font-size: 35px;
        }
        #cruwiModal {
          width: 500px;
          height: 80%;
          border-radius: 8px;
        }

        #cruwiModal .cruwi-modal-header {
          padding: 15px 20px;
        }
      }

      #cruwi-checkout-main-widget {
        border: 1px solid #d9d9d9;
        border-radius: 8px;
        border-top: 3px solid #000;
        margin-top: 40px;
      }

      #cruwi-checkout-main-widget .cruwi-checkout-main-widget-content {
        text-align: center;
      }

      #cruwi-checkout-main-widget .cruwi-checkout-main-widget-content-title {
        padding: 0;
        margin: 10px 0 0 0;
        font-family: 'DM Sans', sans-serif !important;
        font-size: 25px !important;
        text-align: center !important;
        line-height: 1.3 !important;
        font-weight: bold !important;
        color: black !important;
      }

      #cruwi-checkout-main-widget .cruwi-checkout-main-widget-content-info {
        padding: 0;
        padding: 0 16px;
        margin: 20px 0 0 0;
        font-family: 'DM Sans', sans-serif !important;
        font-size: 16px !important;
        line-height: 1.4 !important;
        text-align: center !important;
        color: black !important;
      }

      #cruwi-checkout-main-widget .cruwi-checkout-main-widget-content-button {
        padding: 0;
        margin: 20px auto;
        box-shadow: inset 0px -1px 0px 0px #571a57;
        background-color: #fffff2;
        border-radius: 8px;
        border: 2px solid #080008;
        display: inline-block;
        cursor: pointer;
        color: #000000;
        font-family: 'DM Sans', sans-serif !important;
        font-size: 16px !important;
        font-weight: bold !important;
        padding: 12px 40px;
        text-decoration: none;
      }

      .marquee {
        background: black;
        color: white;
        transition: all 0.5s;
        font-family: sans-serif;
        font-size: 16px;
        font-line-height: 60%;
        font-weight: bold;
        text-transform: uppercase;
        overflow: hidden;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }

      .marquee.running .marquee-inner {
        animation-play-state: running;
      }

      .marquee:hover .marquee-inner {
        animation-play-state: running;
      }

      .marquee span {
        padding: 0 6vw;
        white-space: nowrap;
      }
      
      .marquee-inner {
        width: fit-content;
        display: flex;
        position: relative;
        transform: translate3d(var(--move-initial), 0, 0);
        animation: marquee 3s linear infinite;
        animation-play-state: paused;
      }
      
      @keyframes marquee {
        0% {
          transform: translateX(var(--move-initial));
        }
        100% {
          transform: translateX(var(--move-final));
        }
      }

    `
  }

  // Trae la información del merchant y de la campaña actual activa
  async function fetchGetMerchantAndCampaignData(shop) {

    const data = {
      merchantUrl: shop,
      apyKey: merchantApiKeyFromScript
    }

    const resp = await fetch(`https://app.cruwi.com/v1/api/merchants/public/getMerchantAndCampaignData`, { 
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    });

    if (resp.status === 200) {
      const shopData = await resp.json();
      return shopData;

    } else {
      throw Error('No se pudo pedir los datos del merchant');
    }
  }

  // Envía los datos del cliente y el pedido y crea su mini tienda
  async function fetchPostClientData(checkoutData, productMatches, isCruwiDiscount, shopRawUrl) {

    const dataToSend = {
      data: {
        checkout: checkoutData,
        productMatches,
        isCruwiDiscount,
        shopRawUrl
      }
    }

    const resp = await fetch(`https://app.cruwi.com/v1/api/clients`, { 
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers:{
        'Content-Type': 'application/json'
      }
    });

    if (resp.status === 200) {
      const cruwiShopData = await resp.json();
      return cruwiShopData;

    } else {
      throw Error('No se pudo pedir los datos del merchant');
    }
  }

})();