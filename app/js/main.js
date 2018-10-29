
(($, sr) => {

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  const debounce = (func, threshold, execAsap) => {
    let timeout

    return function debounced () {
      const obj =    this
      const args =   arguments
      function delayed () {
        if (!execAsap) {
          func.apply(obj, args)
        }

        timeout = null
      }

      if (timeout) {
        clearTimeout(timeout)
      } else if (execAsap) {
        func.apply(obj, args)
      }

      timeout = setTimeout(delayed, threshold || 100)
    }
  }
  // smartresize
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr) }

})(jQuery,'smartresize')

// ================================================================================== //

  // # Document on Ready
  // # Document on Resize
  // # Document on Scroll
  // # Document on Load

  // # Old browser notification
  // # Anchor scroll
  // # Phone masked input
  // # Ajax form send
  // # Basic Elements

// ================================================================================== //


const GRVE = GRVE || {};


(($ => {
  // # Document on Ready
  // ============================================================================= //
  GRVE.documentReady = {
    init() {
      GRVE.outlineJS.init()
      GRVE.dayTrips.init()
      GRVE.pageSettings.init()
      GRVE.basicElements.init()
    }
  }

  // # Document on Resize
  // ============================================================================= //
  GRVE.documentResize = {
    init() {

    }
  }

  // # Document on Scroll
  // ============================================================================= //
  GRVE.documentScroll = {
    init() {

    }
  }

  // # Document on Load
  // ============================================================================= //
  GRVE.documentLoad = {
    init() {

      GRVE.dayTrips.scroll()
    }
  }

  // # Remove outline on focus
  // ============================================================================= //
  GRVE.outlineJS = {
    init() {
      const self =           this

      this.styleElement =    document.createElement('STYLE'),
      this.domEvents =       'addEventListener' in document

      document.getElementsByTagName('HEAD')[0].appendChild(this.styleElement)

      // Using mousedown instead of mouseover, so that previously focused elements don't lose focus ring on mouse move
      this.eventListner('mousedown', () => {
        self.setCss(':focus{outline:0 !important}')
      })

      this.eventListner('keydown', () => {
        self.setCss('')
      })
    },
    setCss(css_text) {
      // Handle setting of <style> element contents in IE8
      !!this.styleElement.styleSheet ? this.styleElement.styleSheet.cssText = css_text : this.styleElement.innerHTML = css_text
    },
    eventListner(type, callback) {
      // Basic cross-browser event handling
      if (this.domEvents) {
        document.addEventListener(type, callback)
      } else {
        document.attachEvent(`on${type}`, callback)
      }
    }
  }


  // # Check window size in range
  // ============================================================================= //
  GRVE.isWindowSize = {
    init(min = undefined, max = undefined) {
      let media

      if (min !== undefined && max !== undefined) {
        media = matchMedia(`only screen and (min-width: ${min}px) and (max-width: ${max}px)`)
      } else if (min !== undefined && max === undefined) {
        media = matchMedia(`only screen and (min-width: ${min}px)`)
      } else if (min === undefined && max !== undefined) {
        media = matchMedia(`only screen and (max-width: ${max}px)`)
      } else {
        return true
      }

      return media.matches

    }
  }

  // # Day Trips
  // ============================================================================= //
  GRVE.dayTrips = {
    init() {
      this.sort()
    },
    scroll() {
      const $slider =      $('.my-trips-list')
      const $cards =       $('.trips-for-day')
      const windowHeight = $(window).height()

      if(GRVE.isWindowSize.init(0, 680)) return false

      $slider.owlCarousel({
          autoWidth: true
      })

      $cards.each((i, item) => {
          const $this =         $(item)
          const cardHeight =    $this.outerHeight()
          const cardOffsetTop = $this.offset().top
          const maxHeight =     windowHeight - cardOffsetTop
          const cardStyles =    {
            'height':   maxHeight,
            'overflow': 'visible'
          }

          const mCustomScrollbarOptions = {
            setTop: 0,
            setHeight: maxHeight,
            advanced: { 
              updateOnContentResize: true,
            }
          }

          if(cardHeight > maxHeight) {
            //$this.css(cardStyles)

            setTimeout(() => {
              $this.mCustomScrollbar(mCustomScrollbarOptions)
            }, 50) // WTF??? How it works?
          }
      })
    },
    sort() {
      const $controls =                   $(".trips-sort")
      const $tabs =                       $("#trip-list")
      const controlsActiveClassName =     'trips-sort--active'
      const tabsItemsActiveClassName =    'my-trips-list--active'


      $controls.on("click", function(e) {
        const $this =          $(this)
        const target =         '#' + $this.data('tab')
        const $tabsItem =      $(target)
        const isOpenControl =  $this.is(`.${controlsActiveClassName}`)

        e.preventDefault()

        if (isOpenControl) return

        $this
          .addClass(controlsActiveClassName)
          .siblings()
          .removeClass(controlsActiveClassName)



        $.ajax({
            url: '/my-trips-orders',
            type: 'get',
            data: {'type': $($this).data('type')},
            beforeSend() {
              $tabs.addClass('loading')
            }
        }).done((data) => {
          tabsSwitchItems(data)
        }).fail(() => {
            console.log("error")
        })

        tabsSwitchItems = (data) => {
          $tabs
            .animate({'opacity':'0', 'top':'50px'}, 1000, function() {
              $tabs.html(data)
              GRVE.dayTrips.scroll()
              $tabs.animate({'opacity':'1', 'top':'0'}, 1000)

            })
        }
      })
    },
    


  }


  // # Page Settings
  // ============================================================================= //
  GRVE.pageSettings = {
    init() {
      this.svgPolifill()
      this.dropdown()
      this.fancybox()
      this.radiogroup()
    },
    svgPolifill() {
      svg4everybody()
    },
    dropdown() {
      const $dropdown = $("[data-dropdown]")
      const $control =  $("[data-dropdown-control]")

      $dropdown.on("click", $control, function() {
        const $this =     $(this)
        const target =    $this.data("dropdown-target")
        const $content =  $(target)
        const $links =    $content.find("a")




        e.preventDefault()
      })
    },
    fancybox() {
      const $control = $("[data-fancybox]")

      $control.fancybox({
        smallBtn: false,
        infobar : false,
        buttons : false
      })
    },
    radiogroup() {
      const $control =        $("[data-radiogroup]")
      const activeClassName = "form__btn"

      $control.on("click", function(e) {
        const $this =    $(this)
        const isActive = $this.is(`:not(.${activeClassName})`)

        console.log(isActive)

        if (isActive) return false

        $this
          .removeClass(activeClassName)
          .parent()
          .siblings()
          .find("[data-radiogroup]")
          .addClass(activeClassName)

        e.preventDefault()
      })
    }
  }


  // # Basic Elements
  // ============================================================================= //
  GRVE.basicElements = {
    init() {

    },
    wowjs() {
      var wow = new WOW({
        boxClass:     'js-wow',      // animated element css class (default is wow)
        animateClass: 'animated', // animation css class (default is animated)
        offset:       0,          // distance to the element when triggering the animation (default is 0)
        mobile:       false       // trigger animations on mobile devices (true is default)
      })
      wow.init()
    },
    countdown() {
      $('[data-countdown]').each(function() {
        const $this =                $(this)
        const finalDate =            $this.data('countdown')
        const delimeter =            (!!$this.data('countdown-delimeter') == true)  ? ':' : null
        const hoursCount =           $this.data('countdown-hours')
        const countdownFormat =      $this.data('countdown-format').split('|')
        let countdownItems =         ''
        let text =                   ''


        $.each( countdownFormat, (index, value) => {
          switch (value) {
            case 'w':
              text = "Недель"
              break
            case 'D':
            case 'd':
            case 'n':
              text = "Дней"
              break
            case 'H':
              text = "Часов"
              break
            case 'M':
              text = "Минут"
              break
            case 'S':
              text = "Секунд"
              break
            default:
              text = ''
          }
         
          countdownItems += '<div class="timer__item">'
          countdownItems += `<div class="timer__time">%${value}</div>`
          countdownItems += `<div class="timer__text">${text}</div>`
          countdownItems += '</div>'

          if (index === countdownFormat.length - 1) {
            return
          }

          if (delimeter) {
            countdownItems += '<div class="timer__item">'
            countdownItems += `<div class="timer__time">${delimeter}</div>`
            countdownItems += '</div>'
          }

        })

        $this.countdown(finalDate, function(event) {
          if (hoursCount) {
            const hours = event.offset.totalDays * 24 + event.offset.hours
            countdownItems = countdownItems.replace("%H", hours)
          }

          $(this).html(event.strftime( countdownItems ))
        })
      })
    },
  }


  $(document).ready(() => { GRVE.documentReady.init() })
  $(window).smartresize(() => { GRVE.documentResize.init() })
  $(window).on('load', () => { GRVE.documentLoad.init() })
  $(window).on('scroll', () => { GRVE.documentScroll.init() })
}))(jQuery)
