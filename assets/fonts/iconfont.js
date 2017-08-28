;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-wujiaoxingman" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M957.29732 404.41368c-1.960655-6.033413-7.579629-10.116405-13.928221-10.116405L623.966583 394.297274 525.261537 90.523713c-1.958608-6.033413-7.585769-10.116405-13.928221-10.116405-6.341429 0-11.968589 4.082992-13.927197 10.116405l-98.697883 303.773562L79.304695 394.297274c-6.341429 0-11.968589 4.082992-13.928221 10.116405-1.958608 6.033413 0.186242 12.641925 5.319146 16.372899l258.399141 187.736778-98.697883 303.766398c-1.958608 6.033413 0.186242 12.639878 5.319146 16.371876 2.566452 1.866511 5.591345 2.796696 8.608052 2.796696s6.042623-0.930185 8.610098-2.796696l258.398118-187.742918 258.406305 187.742918c5.148253 3.733021 12.069897 3.733021 17.216103 0 5.134951-3.731998 7.278777-10.338463 5.320169-16.371876l-98.705046-303.766398L951.977151 420.786579C957.110055 417.054581 959.255928 410.447093 957.29732 404.41368z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-wujiaoxingkong" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M773.317099 934.972361c-4.456498 0-8.909927-1.37737-12.69309-4.124947L510.846222 749.377362l-249.768577 181.470051c-7.575536 5.494131-17.809621 5.494131-25.385157 0-7.562233-5.496178-10.732435-15.243169-7.843642-24.1357l95.407953-293.625434L73.48106 431.616228c-7.563256-5.496178-10.732435-15.244192-7.844665-24.134677 2.895957-8.897647 11.18269-14.921851 20.536732-14.921851l308.736597 0 95.401814-293.625434c2.895957-8.897647 11.181667-14.920828 20.534685-14.920828 9.356089 0 17.641799 6.022157 20.537755 14.920828l95.407953 293.625434L935.530574 392.559701c9.346879 0 17.639752 6.024204 20.535709 14.921851 2.880607 8.890484-0.280386 18.638499-7.844665 24.134677L698.438715 613.085256l95.415117 293.625434c2.880607 8.891508-0.282433 18.639522-7.843642 24.1357C782.230096 933.594991 777.772574 934.972361 773.317099 934.972361zM152.624585 435.743222l208.704322 151.633512c7.563256 5.497201 10.732435 15.245216 7.843642 24.136723l-79.720669 245.340731 208.704322-151.627373c7.574512-5.496178 17.806551-5.496178 25.385157 0l208.704322 151.627373-79.727833-245.340731c-2.882654-8.890484 0.279363-18.639522 7.841595-24.136723l208.725812-151.633512L611.10567 435.743222c-9.355065 0-17.640776-6.024204-20.536732-14.920828l-79.722716-245.349941-79.712483 245.349941c-2.89698 8.896624-11.183713 14.920828-20.535709 14.920828L152.624585 435.743222z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)