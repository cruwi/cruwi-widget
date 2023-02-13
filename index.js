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

const CRUWI_BASE_API_URL = "https://app.cruwi.com";

// Main Script function
(() => {
  
  // Iniciamos el script
  colorLog('***** Cruwi Script Init *****', "warning");

  // Testeo en local o en la web de test de CRUWI
  let isLocalDevelopment = window.document.location.hostname === '127.0.0.1' || window.document.location.hostname === 'cruwishop.myshopify.com';

  // Detectamos lenguaje del usuario
  const preferredLanguage = window.navigator.language; // es-ES

  // Procesamos el script
  let currentScriptProcessed;
  if(isLocalDevelopment) {
    const testScript = document.createElement('script');
    testScript.setAttribute('src','https://unpkg.com/cruwi-widget?merchantName=Cruwishop&apiKey=1234567890&widgetType=pdp');
    currentScriptProcessed = testScript;
  } else {
    currentScriptProcessed = document.currentScript;
  }
  
  // Obtenemos los datos del merchant por la url del script
  const merchantNameFromScript = new URLSearchParams(new URL(currentScriptProcessed.getAttribute('src')).search).get('merchantName');
  const merchantApiKeyFromScript = new URLSearchParams(new URL(currentScriptProcessed.getAttribute('src')).search).get('apiKey');
  const widgetTypeFromScript = new URLSearchParams(new URL(currentScriptProcessed.getAttribute('src')).search).get('widgetType');

  colorLog(`Merchant: ${merchantNameFromScript}`, "success");
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
  let merchantNameFromUrl = getDomain(isLocalDevelopment ? 'cruwi.com' : window.location.host);
  colorLog(`Merchant Name from URL: ${merchantNameFromUrl}`, "success");

  // Obtenemos el documento completo (para montar HTML luego)
  const body = document.querySelector('body');

  // Comprobamos si hay widget y qué tipo de widget se solicita
  const widgetElement = document.querySelector('[data-cruwi-widget-type]');

  if(widgetElement) {

    // Cargamos amplitude
    loadAmplitudeSDK();

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
      console.error('This widget type is not valid');
    }

  } else {
    console.error('There is no CRUWI widget to display.');
  }

  // Función que carga el SDK de Amplitude
  function loadAmplitudeSDK() {
    let projectId = isLocalDevelopment ? '203521c0ed2ec0d7fbe8d1176f8c3503' : 'ae6db858c2fce34e9561b18032893b25';
    const scriptAmplitude = document.createElement('script');
    var scriptAmplitudeContent = document.createTextNode(`!function(){"use strict";!function(e,t){var r=e.amplitude||{_q:[],_iq:[]};if(r.invoked)e.console&&console.error&&console.error("Amplitude snippet has been loaded.");else{var n=function(e,t){e.prototype[t]=function(){return this._q.push({name:t,args:Array.prototype.slice.call(arguments,0)}),this}},s=function(e,t,r){return function(n){e._q.push({name:t,args:Array.prototype.slice.call(r,0),resolve:n})}},o=function(e,t,r){e[t]=function(){if(r)return{promise:new Promise(s(e,t,Array.prototype.slice.call(arguments)))}}},i=function(e){for(var t=0;t<g.length;t++)o(e,g[t],!1);for(var r=0;r<m.length;r++)o(e,m[r],!0)};r.invoked=!0;var u=t.createElement("script");u.type="text/javascript",u.integrity="sha384-GHWzi7MsT/TD3t0f+KUaVeuvPUsuVgdUKegrAWlzO4I83+klmUJna8WTuUunlsg6",u.crossOrigin="anonymous",u.async=!0,u.src="https://cdn.amplitude.com/libs/analytics-browser-1.6.6-min.js.gz",u.onload=function(){e.amplitude.runQueuedFunctions||console.log("[Amplitude] Error: could not load SDK")};var a=t.getElementsByTagName("script")[0];a.parentNode.insertBefore(u,a);for(var c=function(){return this._q=[],this},l=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove","getUserProperties"],p=0;p<l.length;p++)n(c,l[p]);r.Identify=c;for(var d=function(){return this._q=[],this},v=["getEventProperties","setProductId","setQuantity","setPrice","setRevenue","setRevenueType","setEventProperties"],f=0;f<v.length;f++)n(d,v[f]);r.Revenue=d;var g=["getDeviceId","setDeviceId","getSessionId","setSessionId","getUserId","setUserId","setOptOut","setTransport","reset"],m=["init","add","remove","track","logEvent","identify","groupIdentify","setGroup","revenue","flush"];i(r),r.createInstance=function(){var e=r._iq.push({_q:[]})-1;return i(r._iq[e]),r._iq[e]},e.amplitude=r}}(window,document)}(); amplitude.init("${projectId}"); `);
    scriptAmplitude.appendChild(scriptAmplitudeContent); 
    let head = document.getElementsByTagName('head')[0];
    head.appendChild(scriptAmplitude);
  }

  // Función que monta el PDP Widget
  function buildCruwiPDPWidget() {
    console.log('-- Building PDP Widget --');

    // Comprobamos que estilo quieren (2 estilos hay)
    const widgetTextStyle = widgetElement.dataset.cruwiWidgetStyle ?? '1';

    let widgetText = "Gana dinero recomendando nuestros productos";

    if(widgetTextStyle === '2') {
      widgetText = "Comparte con amig@s para que tod@s ganemos";
    }

    // Si el idioma no contiene 'es', ponemos en inglés
    if(preferredLanguage.indexOf('es') === -1) {
      widgetText = "Earn money by recommending our products";
    }

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
      <div class="cruwi-pdp-widget-button">+ Info</div>
    `;

    widgetElement.appendChild(cruwiPDPWidget);

    // Escuchamos el click
    cruwiPDPWidget.addEventListener('click', () => {

      window.amplitude && amplitude.track('pdp_widget_clicked', {
        merchantName: merchantNameFromScript,
      });

      let event = new CustomEvent("cruwiModalOpen", { bubbles: true });
      cruwiPDPWidget.dispatchEvent(event);
    });

    loadCruwiCustomFont();
    injectCruwiStyles();
  }

  // Función que monta la sección completa
  function buildCruwiSectionWidget() {
    console.log('-- Building Section Widget --');

    // Creamos el modal con un ID
    const sectionWidget = document.createElement('div');
    sectionWidget.classList.add('cruwi-section');
    sectionWidget.id = 'cruwiSection';
    sectionWidget.innerHTML = `
      <div class="cruwi-section-main">

        <h2 class="cruwi-section-title">¡Te devolvemos parte de tu compra cuando tus amigas compren en ${merchantNameFromScript} contigo!</h2>
      
        <div class="cruwi-section-card-container">
          <div class="cruwi-section-card">
            <div class="cruwi-section-card-bullet">1</div>
            <h2>Compra como siempre</h2>
            <p>Haz tu compra con normalidad, como lo haces siempre</p>
          </div>
          <div class="cruwi-section-card">
            <div class="cruwi-section-card-bullet">2</div>
            <h2>Invita a amigas</h2>
            <p>Una vez finalizada tu compra, recibirás un enlace a tu tienda personalizada para que invites a tus amigas</p>
          </div>
          <div class="cruwi-section-card">
            <div class="cruwi-section-card-bullet">3</div>
            <h2>Recupera tu dinero</h2>
            <p>Cada vez que una amiga compre te reembolsaremos una parte de tu compra en el método de pago que utilices</p>
          </div>
        </div>

        <h2 class="cruwi-section-poweredby">
          powered by <img width="40" src="https://uploads-ssl.webflow.com/62ea5c239bacb85550bf44ea/6328573bad60f760ac2b5fbb_CRUWI%20(3).svg" alt="Powered by CRUWI.COM" />
        </h2>

      </div>
    `

    // Añadimos la section completo al documento
    document.body.appendChild(sectionWidget);

    loadCruwiCustomFont();
    injectCruwiStyles();
  }

  // Función que monta el widget del checkout
  async function buildCruwiCheckoutWidget() {
    console.log('-- Building Checkout Widget --');

    // Comprobamos que exista el objeto Shopify
    if(!window.Shopify) return;

    // Get main data from shopify checkout
    let shopRawUrl = Shopify.shop;
    let orderId = Shopify.checkout.order_id;
    let discountCode = Shopify.checkout.discount ? Shopify.checkout.discount.code : '';
    let lineItems = Shopify.checkout.line_items;
    let isCruwiDiscount = Boolean(discountCode && discountCode.slice(0, 3) === 'CCB');
    let isCruwiPartnerDiscount = Boolean(discountCode && discountCode.slice(0, 3) === 'CCP');

    colorLog(`DISCOUNT: ${isCruwiDiscount}`, "info");
    colorLog(`DISCOUNT: ${isCruwiPartnerDiscount}`, "info");
    
    try {

      // Pedimos los datos de la tienda y de la campaña que tenga activa
      const { data: { brandName, isActive, logoUrl, merchantUrl, campaigns, checkoutWidgetTitle, checkoutWidgetText } } = await fetchGetMerchantAndCampaignData(shopRawUrl);

      // Comprobamos que está activo el merchant
      if(!isActive) return;

      // Comprobamos que haya campaña (por si hay algún error)
      if(campaigns.length <= 0) return;

      // Textos e idioma del widget
      let checkoutWidgetTitleText = checkoutWidgetTitle;
      let checkoutWidgetContentText = checkoutWidgetText;
      let checkoutWidgetRotatingText1 = "GANA DINERO";
      let checkoutWidgetButton = "ACCEDE A TU TIENDA";

      let isEnglish = false;
      if(preferredLanguage.indexOf('es') === -1) {
        isEnglish = true;
        checkoutWidgetTitleText = "Earn money sharing your purchase";
        checkoutWidgetContentText = `With your purchase you have unlocked your own ${merchantNameFromScript} store. Share it with friends so they can shop with a discount. For every purchase they make you will earn money directly to your account.`;
        checkoutWidgetRotatingText1 = "EARN MONEY";
        checkoutWidgetButton = "ACCESS YOUR STORE";
      }
      console.log({isEnglish});

      // Si son todos los productos, no buscamos matches
      let matchesFromLineItems = [];
      if(campaigns[0].criteria !== 'all') {

        // Comprobamos que el pedido tenga producto de la campaña activa (EL MATCH)
        // --> 1º sacar el array de ids de line items
        // --> 2º filtrar el array de objetos producto con el array de ids
        // --> 3º los productos comprados (line_items) llevan el id sin el prefijo.. lo añadimos para el match
        let lineItemsIds = lineItems.map(product => 'gid://shopify/Product/' + product.product_id);
        let matches = campaigns[0].products.filter(function (product) {
          return lineItemsIds.indexOf(product.id) >= 0; 
        });

        // Cogemos los line items que han tenido match (los datos son mejores para mostrar en la mini tienda)
        for (let i = 0; i < lineItems.length; i++) {
          const productItem = lineItems[i];
          const productItemId = productItem.product_id;
          for (let j = 0; j < matches.length; j++) {
            const matchItem = matches[j];
            if (Number(matchItem.id.replace('gid://shopify/Product/', '')) === productItemId) {
              matchesFromLineItems.push(productItem);
            }
          }
        }

        console.log('MATCHES: ', matches);
        console.log('FINAL MATCHES: ', matchesFromLineItems);

        // Comprobamos el nº de matches (si no hay matches, nada.. no es de la campaña)
        if(matches.length === 0) return;

      } else {
        matchesFromLineItems = lineItems;
        console.log('TODOS ENTRAN: ', matchesFromLineItems);
      }

      // Si es es un código de CRUWI (viene de mini tienda), mandamos evento a Amplitude
      if(isCruwiDiscount || isCruwiPartnerDiscount) {
        window.amplitude && amplitude.track('purchase_completed', {
          merchantName: merchantNameFromScript,
          cruwiCoupon: discountCode,
          purchasedItems: matchesFromLineItems.map(product => product.product_id),
          purchaseSize: matchesFromLineItems.length
        });
      }

      // Mandamos los datos del pedido y cliente actuales
      const { data: { shopData: { shortUrl, url } } } = await fetchPostClientData(Shopify.checkout, matchesFromLineItems, isCruwiDiscount, isCruwiPartnerDiscount, shopRawUrl, campaigns);

      // Creamos el Div principal del checkout (izquierda)
      const cruwiCheckoutMainWidget = document.createElement('div');
      cruwiCheckoutMainWidget.id = "cruwi-checkout-main-widget";
      cruwiCheckoutMainWidget.classList.add('cruwi-checkout-main-widget');

      cruwiCheckoutMainWidget.innerHTML = `
        <div class="cruwi-checkout-main-widget-content">
          <div class="marquee running js-marquee"> 
            <div class="marquee-inner"> 
              <span>${checkoutWidgetRotatingText1}</span> 
            </div>
          </div>
          <h5 class="cruwi-checkout-main-widget-content-title">
            ${checkoutWidgetTitleText}
          </h5>
          <p class="cruwi-checkout-main-widget-content-info">
            ${checkoutWidgetContentText}
          </p>
          <a id="cruwi-checkout-main-widget-button" target="_blank" href="${url}?o=t" class="cruwi-checkout-main-widget-content-button">
            ${checkoutWidgetButton}
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
      });

      const cruwiCheckoutMainWidgetButton = document.getElementById('cruwi-checkout-main-widget-button');

      // Click en el botón para enviar evento a Amplitude
      cruwiCheckoutMainWidgetButton.addEventListener('click', () => {
        window.amplitude && amplitude.track('checkout_widget_clicked', {
          merchantName: merchantNameFromScript,
        });
      });

      // Mandamos evento a Amplitude de widget cargado
      window.amplitude && amplitude.track('checkout_widget_viewed', {
        merchantName: merchantNameFromScript,
      });

    } catch (error) {
      console.log(error);
      return;
    }

  }

  // Función que monta el modal
  function buildCruwiModal() {

    // Comprobamos que estilo quieren (2 estilos hay)
    const widgetTextStyle = widgetElement.dataset.cruwiWidgetStyle ?? '1';

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

    // Textos para poner en el idioma del navegador del usuario
    let modalTitleText;
    let modalHowItWorksText;
    let modalFirstStepText;
    let modalSecondStepText;
    let modalThirdStepText;
    let modalAclarationText;

    if(preferredLanguage.indexOf('es') !== -1) {
      modalTitleText = "Gana dinero recomendando nuestros productos";
      modalHowItWorksText = "¿Cómo funciona?";
      modalFirstStepText = "Realiza una compra como siempre";
      modalSecondStepText = `Conseguirás un enlace a tu propia tienda de ${merchantNameFromScript} con descuentos exclusivos`;
      modalThirdStepText = "Compártelo y gana dinero* cada vez que alguien compre a través de tu enlace";
      modalAclarationText = "*El dinero lo recibirás automáticamente en el método de pago que utilices en tu compra";
    } else {
      modalTitleText = "Earn money by recommending our products";
      modalHowItWorksText = "How does it work?";
      modalFirstStepText = "Make a purchase as always";
      modalSecondStepText = `You will get a link to your own ${merchantNameFromScript} store with exclusive discounts`;
      modalThirdStepText = "Share it and earn money* every time someone buys through your link";
      modalAclarationText = "*You will automatically receive the money in the payment method you use for your purchase";
    }

    // TODO: mejorar las opciones
    cruwiModalBodyContent.innerHTML = `
      <div class="cruwi-modal-body-content-wrapper">

        <h4 class="cruwi-modal-body-content-title">
          ${modalTitleText}
        </h4>

        <div class="cruwi-modal-body-content-how">
          <span class="cruwi-modal-body-content-how-text">
            ${modalHowItWorksText}
          <span>
        </div>

        <div class="cruwi-modal-body-content-steps">

          <div class="cruwi-modal-body-content-step">
            <div class="cruwi-modal-body-content-step-icon">
              🛍️
            </div>
            <div class="cruwi-modal-body-content-step-text">
              ${modalFirstStepText}
            </div>
          </div>

          <div class="cruwi-modal-body-content-step">
            <div class="cruwi-modal-body-content-step-icon">
              📲
            </div>
            <div class="cruwi-modal-body-content-step-text">
              ${modalSecondStepText}
            </div>
          </div>

          <div class="cruwi-modal-body-content-step">
            <div class="cruwi-modal-body-content-step-icon">
              🤑
            </div>
            <div class="cruwi-modal-body-content-step-text">
              ${modalThirdStepText}
            </div>
          </div>

          <div class="cruwi-modal-body-content-disclaimer">
            ${modalAclarationText}
          </div>

        </div>

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
        margin: 10px 0;
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
        margin: 0 !important;
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
        width: 90%;
        height: 70%;
        background-color: white;
        box-shadow: 1px 1px 20px #0000001c;
        font-family: 'Poppins', sans-serif;
        z-index: 21474836;
        overflow: auto;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
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
        font-family: 'DM Sans', sans-serif !important;
      }

      #cruwiModal .cruwi-modal-body-content-title {
        margin: 0;
        padding: 0;
        font-size: 22px !important;
        text-align: center !important;
        line-height: 1.2 !important;
        font-family: 'DM Sans', sans-serif !important;
        color: black !important;
        letter-spacing: 0px !important;
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
        font-size: 14px !important;
        letter-spacing: 0px !important;
      }

      #cruwiModal .cruwi-modal-body-content-steps {
        margin: 0;
        padding: 0;
        margin-top: 5px;
      }

      #cruwiModal .cruwi-modal-body-content-step {
        display: flex;
        align-items: center;
        max-width: 400px;
        margin: 0 auto 15px auto;
      }

      #cruwiModal .cruwi-modal-body-content-step:first-child {
        margin: 0 auto 2px auto;
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

      #cruwiModal .cruwi-modal-body-content-disclaimer {
        margin: 20px auto 0 auto !important;
        max-width: 280px !important;
        text-align: center !important;
        font-size: 12px !important;
        color: black !important;
        line-height: normal !important;
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
        z-index: 2147483;
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
          width: 400px;
          height: 75%;
          border-radius: 8px;
        }

        #cruwiModal .cruwi-modal-header {
          padding: 15px 20px;
        }

        #cruwiModal .cruwi-modal-body-content-steps {
          margin-top: 0;
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

      #cruwiSection {
        background-color: white;
      }

      #cruwiSection .cruwi-section-main {
        padding: 50px 0;
        font-family: 'DM Sans', sans-serif !important;
      }

      #cruwiSection .cruwi-section-title {
        padding: 0;
        margin: 0;
        text-align: center;
        font-family: 'DM Sans', sans-serif !important;
        font-size: 20px !important;
        line-height: 1.3;
        max-width: 600px;
        margin: 0 auto;
      }

      #cruwiSection .cruwi-section-card-container {
        display: flex;
        flex-wrap: wrap;
        max-width: 1200px;
        justify-content: space-around;
        margin: 0 auto;
        margin-top: 30px;
        margin-bottom: 30px;
      }
      
      #cruwiSection .cruwi-section-card {
        width: 300px;
        max-width: 100%;
        margin: 20px 10px;
        box-shadow: 0 0px 2px 0 rgba(0, 0, 0, 0.2);
        transition: 0.3s;
        padding: 20px;
        border-radius: 8px;
        position: relative;
      }

      #cruwiSection .cruwi-section-card-bullet {
        position: absolute;
        top: -18px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 35px;
        height: 35px;
        background: black;
        border-radius: 50%;
        color: white;
        font-weight: bold;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      
      #cruwiSection .cruwi-section-card h2 {
        margin: 0;
        padding: 0;
        padding: 10px;
        text-align: center;
        font-family: 'DM Sans', sans-serif !important;
        font-size: 20px !important;
        color: black !important;
      }
      
      #cruwiSection .cruwi-section-card p {
        margin: 0;
        padding: 0;
        padding: 10px;
        text-align: center;
        max-width: 260px;
        margin: 0 auto;
        line-height: normal !important;
        color: black !important;
      }

      #cruwiSection .cruwi-section-poweredby {
        font-size: 12px;
        text-align: center;
      }

      @media only screen and (max-width: 768px) {

        #cruwiSection .cruwi-section-card {
          width: 100%;
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

    const resp = await fetch(`${CRUWI_BASE_API_URL}/v1/api/merchants/public/getMerchantAndCampaignData`, { 
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
  async function fetchPostClientData(checkoutData, productMatches, isCruwiDiscount, isCruwiPartnerDiscount, shopRawUrl, campaigns) {

    const dataToSend = {
      data: {
        checkout: checkoutData,
        productMatches,
        isCruwiDiscount,
        isCruwiPartnerDiscount,
        shopRawUrl,
        campaign: campaigns[0],
        preferredLanguage
      }
    }

    const resp = await fetch(`${CRUWI_BASE_API_URL}/v1/api/clients`, { 
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