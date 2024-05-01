setTimeout(function() {
  fadeOutPreloader(document.getElementById('preloader'), 69);
}, 1500);

$(document).ready(function() {
  $(window).on('beforeunload', function() {
    window.scrollTo(0, 0);
  });

  /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
  particlesJS.load('landing', 'assets/particles.json', function() {});

  // Typing Text
  var element = document.getElementById('txt-rotate');
  var toRotate = element.getAttribute('data-rotate');
  var period = element.getAttribute('data-period');
  setTimeout(function() {
    new TxtRotate(element, JSON.parse(toRotate), period);
  }, 1500);

  // INJECT CSS
  var css = document.createElement('style');
  css.type = 'text/css';
  css.innerHTML = '#txt-rotate > .wrap { border-right: 0.08em solid #666 }';
  document.body.appendChild(css);

  // Initialize AOS
  AOS.init({
    disable: 'mobile',
    offset: 200,
    duration: 600,
    easing: 'ease-in-sine',
    delay: 100,
    once: true
  });

  randomizeOrder();
});

/* FUNCTIONS */
/* Preloader */

function fadeOutPreloader(element, duration) {
  opacity = 1;

  interval = setInterval(function() {
    if (opacity <= 0) {
      element.style.zIndex = 0;
      element.style.opacity = 0;
      element.style.filter = 'alpha(opacity = 0)';

      // Allow horizontal scroll
      document.documentElement.style.overflowY = 'auto';

      // Remove preloader div
      document.getElementById('preloader').remove();

      clearInterval(interval);
    } else {
      opacity -= 0.1;
      element.style.opacity = opacity;
      element.style.filter = 'alpha(opacity = ' + opacity * 100 + ')';
    }
  }, duration);
}

/* Typing Text */

var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }
  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 5;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

/* Word Cloud */

function randomizeOrder() {
  var parent = document.getElementById('skills');
  var divs = parent.getElementsByTagName('div');
  var frag = document.createDocumentFragment();

  // Randomize order of skills
  while (divs.length) {
    frag.appendChild(divs[Math.floor(Math.random() * divs.length)]);
  }
  parent.appendChild(frag);
}

/* For Loading Bitcoin Wallet Addresses */

var previousHref = null;
document.addEventListener('click', e => {
  const origin = e.target.closest('a');
  if (origin) previousHref = origin.href;
});
// code modified from https://stackoverflow.com/a/71608716/7312536
function showBitcoinSnackBar() {
  var sb = document.getElementById("bitcoin-snackbar");

  sb.className = "show";

  setTimeout(()=>{ sb.className = sb.className.replace("show", ""); }, 3000);
}
// code modified from https://gist.github.com/diachedelic/0d60233dab3dcae3215da8a4dfdcd434
function DeepLinker(options) {
  if (!options) {
    throw new Error('no options')
  }

  var hasFocus = true;
  var didHide = false;

  // window is blurred when dialogs are shown
  function onBlur() {
    hasFocus = false;
  };

  // document is hidden when native app is shown or browser is backgrounded
  function onVisibilityChange(e) {
    if (e.target.visibilityState === 'hidden') {
      didHide = true;
    }
  };

  // window is focused when dialogs are hidden, or browser comes into view
  function onFocus() {
    if (didHide) {
      if (options.onReturn) {
        options.onReturn();
      }

      didHide = false; // reset
    } else {
      // ignore duplicate focus event when returning from native app on
      // iOS Safari 13.3+
      if (!hasFocus && options.onFallback) {
        // wait for app switch transition to fully complete - only then is
        // 'visibilitychange' fired
        setTimeout(function() {
          // if browser was not hidden, the deep link failed
          if (!didHide) {
            options.onFallback();
          }
        }, 1000);
      }
    }

    hasFocus = true;
  };

  // add/remove event listeners
  // `mode` can be "add" or "remove"
  function bindEvents(mode) {
    [
      [window, 'blur', onBlur],
      [document, 'visibilitychange', onVisibilityChange],
      [window, 'focus', onFocus],
    ].forEach(function(conf) {
      conf[0][mode + 'EventListener'](conf[1], conf[2]);
    });
  }

  // add event listeners
  bindEvents('add');

  // expose public API
  this.destroy = bindEvents.bind(null, 'remove');
  this.openURL = function(url) {
    // it can take a while for the dialog to appear
    var dialogTimeout = 500;

    setTimeout(function() {
      if (hasFocus && options.onIgnored) {
        options.onIgnored();
      }
    }, dialogTimeout);

    window.location = url;
  };
}
var bitcoinWalletAddress = null;
var linker = new DeepLinker({
  onIgnored: function() {
    // if bitcoin address, and no bitcoin scheme handler, then instead copy to clipboard and notify user
    if (bitcoinWalletAddress && previousHref && previousHref.startsWith('javascript:bitcoin')) {
      navigator.clipboard.writeText(bitcoinWalletAddress).then(function() {
        /* clipboard successfully set */
        showBitcoinSnackBar();
      }, function() {
        /* clipboard write failed */
      });
    }
  }
});
function bitcoin(btc) {
    bitcoinWalletAddress = btc;
    linker.openURL('bitcoin:' + btc);
    // fix the auto scroll to the top when bitcoin scheme doesn't have handler
    window.location.replace('#bitcoin');
    // fix browser history/url in bar to revert changes
    window.history.replaceState({}, null, window.location.origin);
}
