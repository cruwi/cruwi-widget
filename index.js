(() => {
  
  console.log('Cruwi Script Init');

  // Obtenemos el merchant name y la API KEY
  const currentScriptProcessed = document.currentScript;
  const merchantNameFromScript = new URLSearchParams(new URL(currentScriptProcessed.getAttribute('src')).search).get('merchantName');
  const merchantApiKeyFromScript = new URLSearchParams(new URL(currentScriptProcessed.getAttribute('src')).search).get('apiKey');
  const widgetTypeFromScript = new URLSearchParams(new URL(currentScriptProcessed.getAttribute('src')).search).get('widgetType');

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

  let merchantNameFromUrl = getDomain(location.host);

  // Comprobamos si hay widget y qué tipo de widget se solicita
  const widgetElement = document.querySelector('[data-cruwi-widget-type]');

  if(widgetElement) {
    const widgetType = widgetElement.dataset.cruwiWidgetType;
    if(widgetType === 'pdp') {
      alert('es pdp');
    } else if(widgetType === 'section') {
      alert('es section');
    } else if(widgetType === 'checkout') {
      alert('es checkout');
    } else {
      console.error('This type does not exists');
    }
  } else {
    console.error('There is no widget to show');
  }

})();