/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */


if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.5
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.5'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.5'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.5'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.5'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.5'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.5'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.5
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.5'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.5
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.5'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.5
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.5'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.5'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
this.constants = {
  abandonConfirmText: 'Are you sure you want to abandon this drain?',
  iconBase: 'http://localhost:3000/images/markers/',
  adoptedMarkerImage: 'http://localhost:3000/assets/markers/adopted-cc57683645f07dd0281f551e1d9e1f1392a9b9f328a9332c1a183b6dc79087a4.png',
  adoptedByYouImage: 'http://localhost:3000/assets/markers/adoptedbyyou-22f473aad2a56b61351c32506974a13e6d927729087bc02d1091c99c9c2774b3.png',
  toSewerMarkerImage: 'http://localhost:3000/assets/markers/tosewer-27420d5c9cfc805d92400bf365839581bd5fe4ce5b2e175341d8ad9652b0578b.png',
  toBayOceanMarkerImage: 'http://localhost:3000/assets/markers/tobay-b29068151a3648f6ec1cb10a9d91ac411d87f58e8f71232265a6698e2ad3257c.png',
  markerShadowImage: 'http://localhost:3000/assets/markers/shadow-c92ff27d07461ca4a8c886de00d6c5fb5ba85ce563073df53721b71ca7babe79.png'
}
;
// require constants

var constants = window.constants

$( document ).ready(function() {
if (WURFL.is_mobile === true && WURFL.form_factor === "Smartphone") {
    var DeviceName = WURFL.complete_device_name;
    if (DeviceName.includes('Apple')) {
        $("#vbworks").attr("href", "https://itunes.apple.com/us/app/vb-works/id895997360?mt=8")
    }
    else
    {
        $("#vbworks").attr("href", "https://play.google.com/store/apps/details?id=com.seeclickfix.vbworks.app")
    }
}
});

$(function() {
  var initialLocation;
  var center = new google.maps.LatLng(36.751607,-76.0593627);
  var browserSupportFlag =  new Boolean();
  var errorClass = 'has-error';
  var current_user_id = $('#current_user_id').val() ? $('#current_user_id').val() : '';
  var mapOptions = {
    center: center,
    disableDoubleClickZoom: false,
    keyboardShortcuts: false,
    mapTypeControl: true,
    maxZoom: 25,
    minZoom: 3,
    panControl: false,
    rotateControl: false,
    scaleControl: false,
    streetViewControl: true,
    zoom: 17,
    zoomControl: true,
    styles: [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]
  };
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  /* Start Google Geolocation Services
  // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      //console.log(position.coords.latitude + " - " + position.coords.longitude);
      map.setCenter(initialLocation);
      map.setZoom(17);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }

  function handleNoGeolocation(errorFlag) {
    map.setCenter(center);
  }
  End Google Geolocation Services */
  var iconBase = constants.iconBase;
  var size = new google.maps.Size(27.0, 38.0);
  var origin = new google.maps.Point(0, 0);
  var anchor = new google.maps.Point(13.0, 18.0);
  var adoptedMarker = new google.maps.MarkerImage(constants.adoptedMarkerImage,
    size,
    origin,
    anchor
  );
  var adoptedByYouMarker = new google.maps.MarkerImage(constants.adoptedByYouImage,
    size,
    origin,
    anchor
  );
  var toSewerMarker = new google.maps.MarkerImage(constants.toSewerMarkerImage,
    size,
    origin,
    anchor
  );
  /*    
  var toBayOceanMarker = new google.maps.MarkerImage(constants.toBayOceanMarkerImage,
    size,
    origin,
    anchor
  );
  */
  var markerShadowImage = new google.maps.MarkerImage(constants.markerShadowImage,
    new google.maps.Size(46.0, 37.0),
    origin,
    anchor
  );

  var legend = document.getElementById('legend');

  var legendItems = document.createElement('div');
  legendItems.className = "legend-items";

  var icons = {
    available: {
      name: 'Available Drains',
      title:  'Sewer',
      icon: constants.toSewerMarkerImage
    },
    /*
    availableBay: {
      name: 'Drains to Ocean/Bay',
      title: 'Sewer to ocean/bay',
      icon: constants.toBayOceanMarkerImage
    },
    */
    adopted: {
      name: 'Adopted',
      title:  'Adopted by other',
      icon: constants.adoptedMarkerImage
    },
    adopted_by_you: {
      name: 'Adopted by you',
      title:  'Adopted by you',
      icon: constants.adoptedByYouImage
    }
  };

  for (var key in icons) {
    var type = icons[key];
    var name = type.name;
    var icon = type.icon;
    var title = type.title;
    var div = document.createElement('div');
    div.innerHTML = '<img src="' + icon + '" alt="' + title + ' icon" title="' + title + '"> ' + name;
    legendItems.appendChild(div);
  }

  legend.appendChild(legendItems);

  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(legend);

  $('#toggleLegend').click(function(){
    $('#legend .legend-items').slideToggle(function(){
      var text = $('#legend .show-hide a').html().trim();
      $('#legend .show-hide a').html( text == 'Hide' ? 'Show' : 'Hide');
    });
  });

  var activeThingId;
  var activeMarker;
  var activeInfoWindow;
  var isWindowOpen = false;
  var thingIds = [];
  var adoptedThings = [];
  function addMarker(thingId, point, type, user_id) {
    if(type === 'adopted') {
      var image = adoptedMarker;
    } else if(type === 'adoptedbyyou') {
      var image = adoptedByYouMarker;
    } else if(type === 'tosewer') {
      var image = toSewerMarker;
    } else if(type === 'tobayocean') {
      var image = toBayOceanMarker;
    }
    var marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      icon: image,
      map: map,
      position: point,
      shadow: markerShadowImage
    });
    google.maps.event.addListener(marker, 'click', function() {
      console.log(marker);
      if(activeInfoWindow) {
        activeInfoWindow.close();
      }
      var infoWindow = new google.maps.InfoWindow({
        maxWidth: 210
      });
      google.maps.event.addListener(infoWindow, 'closeclick', function() {
        isWindowOpen = false;
      });
      activeInfoWindow = infoWindow;
      activeThingId = thingId;
      activeMarker = marker;
      $.ajax({
        type: 'GET',
        url: '/info_window',
        data: {
          'thing_id': thingId
        },
        success: function(data) {
          // Prevent race condition, which could lead to multiple windows being open at the same time.
          if(infoWindow === activeInfoWindow) {
            infoWindow.setContent(data);
            infoWindow.open(map, marker);
            isWindowOpen = true;
          }
        }
      });
    });
    thingIds.push(thingId);
    if (type === 'adopted' || type === 'adoptedbyyou') {
      adoptedThings.push([user_id, marker]);
    }
  }
  function addMarkersAround(lat, lng) {
    var current_user_id = $('#current_user_id').val() ? $('#current_user_id').val() : '';
    var submitButton = $("#address_form input[type='submit']");
    $.ajax({
      type: 'GET',
      url: '/things.json',
      data: {
        'utf8': '✓',
        'lat': lat,
        'lng': lng,
        'limit': $('#address_form input[name="limit"]').val()
      },
      error: function(jqXHR) {
        $(submitButton).attr("disabled", false);
      },
      success: function(data) {
        $(submitButton).attr("disabled", false);
        if(data.errors) {
          $('#address').parent().addClass(errorClass);
          $('#address').focus();
        } else {
          $('#address').parent().removeClass(errorClass);
          var i = -1;
          $(data).each(function(index, thing) {
            if($.inArray(thing.id, thingIds) === -1) {
              i += 1;
            } else {
              // continue
              return true;
            }
            setTimeout(function() {
              var point = new google.maps.LatLng(thing.lat, thing.lng);
              var type = 'tosewer'
              if(thing.system_use_code == 'MS4') {
                type = 'tobayocean';
              }
              if(thing.user_id) {
                type  = 'adopted';
              }
              if(thing.user_id == current_user_id){
                type = 'adoptedbyyou'
              }
              addMarker(thing.id, point, type, thing.user_id);
            }, i * 100);
          });
        }
      }
    });
  }
  function flipMarkers() {
    for (var key in adoptedThings) {
      if(adoptedThings[key][0] == current_user_id) {
        adoptedThings[key][1].setIcon(adoptedByYouMarker);
      } else {
        adoptedThings[key][1].setIcon(adoptedMarker);
      }
    }
  }
  function showFlash(type, message) {
    $('#content').prepend(
        $('<div></div>').addClass('alert fade in alert-' + type).data('alert', '').append(
          $('<a></a>').addClass('close').attr('data-dismiss', 'alert').text('×')).append(
          $('<p></p>').text(message)
          ));
  }
  function zoomTo(lat, lng, zoomLevel) {
    if (typeof zoomLevel === 'undefined') { zoomLevel = 18; }
    addMarkersAround(lat, lng);
    map.setCenter(new google.maps.LatLng(lat, lng));
    map.setZoom(zoomLevel);
  }
  google.maps.event.addListener(map, 'idle', function() {
    var center = map.getCenter();
    addMarkersAround(center.lat(), center.lng());
  });

  $('body').on('submit', '#password_edit_form', function() {
    var submitButton = $("#password_edit_form input[type='submit']");
    $(submitButton).attr("disabled", true);
    if($('#user_password').val() === '') {
      $(submitButton).attr("disabled", false);
      $('#user_password').parent().addClass(errorClass);
      $('#user_password').next(".help-block").html('You must enter a value');
      $('#user_password').focus();
    } else {
      $.ajax({
        type: 'PUT',
        url: '/users/password.json',
        data: {
          'utf8': '✓',
          'authenticity_token': $('#password_edit_form input[name="authenticity_token"]').val(),
          'user': {
            'reset_password_token': $('#user_reset_password_token').val(),
            'password': $('#user_password').val()
          }
        },
        error: function(jqXHR) {
          var response = $.parseJSON(jqXHR.responseText);
          $(submitButton).attr("disabled", false);
          if(response.errors.user_password) {
            $('#user_password').parent().addClass(errorClass);
            $('#user_password').next(".help-block").html(response.errors.user_password);
            $('#user_password').focus();
          }
          if(response.errors.reset_password_token) {
            $('#user_reset_password_token').parent().addClass(errorClass);
            $('#user_reset_password_token').next(".help-block").html('Password reset link ' + response.errors.reset_password_token);
            $('#user_reset_password_token').focus();
          }
        },
        success: function(data) {
          $('.container-fluid').addClass('signed-in');
          $('.sidebar').removeClass('sidebar-full');
          $.ajax({
            type: 'GET',
            url: '/sidebar/search',
            success: function(data) {
              $('#content').html(data);
              current_user_id = $('#current_user_id').val();
              flipMarkers();
            }
          });
        }
      });
    }
    return false;
  });

  $('body').on('submit', '#address_form', function() {
    var submitButton = $("#address_form input[type='submit']");
    $(submitButton).attr("disabled", true);
    if($('#address').val() === '') {
      $(submitButton).attr("disabled", false);
      $('#address').parent().addClass(errorClass);
      $('#address').next(".help-block").html('You must enter a value');
      $('#address').focus();
    } else {
      $.ajax({
        type: 'GET',
        url: '/address.json',
        data: {
          'utf8': '✓',
          'city_state': $('#city_state').val(),
          'address': $('#address').val()
        },
        error: function(jqXHR) {
          var response = $.parseJSON(jqXHR.responseText);
          $(submitButton).attr("disabled", false);
          $('#address').parent().addClass(errorClass);
          $('#address').next(".help-block").html(response.error);
          $('#address').focus();
        },
        success: function(data) {
          $(submitButton).attr("disabled", false);
          if(data.errors) {
            $('#address').parent().addClass(errorClass);
            $('#address').next(".help-block").html('');
            $('#address').focus();
          } else {
            $('#address').parent().removeClass(errorClass);
            $('#address').next(".help-block").html('');
            zoomTo(data[0], data[1]);
          }
        }
      });
    }
    return false;
  });
    
  $('body').on('click', '.thing-link', function() {
    zoomTo($(this).data('lat'), $(this).data('lng'), 20);
  });

  // Focus on the first non-empty text input or password field
  function setComboFormFocus() {
    $('#combo-form input[type="email"], #combo-form input[type="text"]:visible, #combo-form input[type="password"]:visible, #combo-form input[type="submit"]:visible, #combo-form input[type="tel"]:visible, #combo-form button:visible').each(function(index) {
      if($(this).val() === "" || $(this).attr('type') === 'submit' || this.tagName.toLowerCase() === 'button') {
        $(this).focus();
        return false;
      }
    });
  }

  $('.sidebar').on('click', '#combo-form input[type="radio"]', function() {
    var radioInput = $(this);
    if('new' === radioInput.val()) {
      $('#combo-form').data('state', 'user_sign_up');
      $('#user_forgot_password_fields').slideUp();
      $('#user_sign_in_fields').slideUp();
      $('#user_sign_up_fields').slideDown(function() {
        setComboFormFocus();
      });
    } else if('existing' === radioInput.val()) {
      $('#user_sign_up_fields').slideUp();
      $('#user_sign_in_fields').slideDown(function() {
        $('#combo-form').data('state', 'user_sign_in');
        setComboFormFocus();
        $('#user_forgot_password_link').click(function() {
          $('#combo-form').data('state', 'user_forgot_password');
          $('#user_sign_in_fields').slideUp();
          $('#user_forgot_password_fields').slideDown(function() {
            setComboFormFocus();
            $('#user_remembered_password_link').click(function() {
              $('#combo-form').data('state', 'user_sign_in');
              $('#user_forgot_password_fields').slideUp();
              $('#user_sign_in_fields').slideDown(function() {
                setComboFormFocus();
              });
            });
          });
        });
      });
    }
  });
  $('.sidebar').on('submit','#combo-form', function() {
    var submitButton = $("#combo-form input[type='submit']");
    $(submitButton).attr("disabled", true);
    var errors = []
    if(!/[\w\.%\+]+@[\w]+\.+[\w]{2,}/.test($('#user_email').val())) {
      errors.push($('#user_email'));
      $('#user_email').parent().addClass(errorClass);
    } else {
      $('#user_email').parent().removeClass(errorClass);
    }
    if(!$(this).data('state') || $(this).data('state') === 'user_sign_up') {
      if($('#user_first_name').val() === '') {
        errors.push($('#user_first_name'));
        $('#user_first_name').parent().addClass(errorClass);
      } else {
        $('#user_first_name').parent().removeClass(errorClass);
      }
      if($('#user_last_name').val() === '') {
        errors.push($('#user_last_name'));
        $('#user_last_name').parent().addClass(errorClass);
      } else {
        $('#user_last_name').parent().removeClass(errorClass);
      }
      /*    
      Jason Added Start 11/1/2017
      */        
      if(!$('input[type=checkbox]').prop('checked')) {
        errors.push($('#tos_confirm'));
        $('#tos_confirm').parent().addClass(errorClass);
        $('#tos').modal('show'); //Open tos modal
      } else {
        $('#tos_confirm').parent().removeClass(errorClass);
      }
      /*    
      Jason Added End 11/1/2017
      */        
        
      if($('#user_password_confirmation').val().length < 6 || $('#user_password_confirmation').val().length > 20) {
        errors.push($('#user_password_confirmation'));
        $('#user_password_confirmation').parent().addClass(errorClass);
      } else {
        $('#user_password_confirmation').parent().removeClass(errorClass);
      }
      if(errors.length > 0) {
        $(submitButton).attr("disabled", false);
        errors[0].focus();
      } else {
        $.ajax({
          type: 'POST',
          url: '/users.json',
          data: {
            'utf8': '✓',
            'authenticity_token': $('#combo-form input[name="authenticity_token"]').val(),
            'user': {
              'email': $('#user_email').val(),
              'first_name': $('#user_first_name').val(),
              'last_name': $('#user_last_name').val(),
              'organization': $('#user_organization').val(),
              'voice_number': $('#user_voice_number').val(),
              'sms_number': $('#user_sms_number').val(),
              'password': $('#user_password_confirmation').val(),
              'password_confirmation': $('#user_password_confirmation').val()
            }
          },
          error: function(jqXHR) {
            var data = $.parseJSON(jqXHR.responseText);
            $(submitButton).attr("disabled", false);
            if(data.errors.email) {
              errors.push($('#user_email'));
              $('#user_email').parent().addClass(errorClass);
            }
            if(data.errors.first_name) {
              errors.push($('#user_first_name'));
              $('#user_first_name').parent().addClass(errorClass);
            }
            if(data.errors.last_name) {
              errors.push($('#user_last_name'));
              $('#user_last_name').parent().addClass(errorClass);
            }
            if(data.errors.organization) {
              errors.push($('#user_organization'));
              $('#user_organization').parent().addClass(errorClass);
            }
            if(data.errors.voice_number) {
              errors.push($('#user_voice_number'));
              $('#user_voice_number').parent().addClass(errorClass);
            }
            if(data.errors.sms_number) {
              errors.push($('#user_sms_number'));
              $('#user_sms_number').parent().addClass(errorClass);
            }
            if(data.errors.password) {
              errors.push($('#user_password_confirmation'));
              $('#user_password_confirmation').parent().addClass(errorClass);
            }
            errors[0].focus();
          },
          success: function(data) {
            $.ajax({
              type: 'GET',
              url: '/sidebar/search',
              success: function(data) {
                $('.sidebar').addClass('signed-in');
                $('.sidebar').removeClass('sidebar-full');
                $('#content').html(data);
              }
            });
          }
        });
      }
    } else if($(this).data('state') === 'user_sign_in') {
      if($('#user_password').val().length < 6 || $('#user_password').val().length > 20) {
        errors.push($('#user_password'));
        $('#user_password').parent().addClass(errorClass);
      } else {
        $('#user_password').parent().removeClass(errorClass);
      }
      if(errors.length > 0) {
        $(submitButton).attr("disabled", false);
        errors[0].focus();
      } else {
        $.ajax({
          type: 'POST',
          url: '/users/sign_in.json',
          data: {
            'utf8': '✓',
            'authenticity_token': $('#combo-form input[name="authenticity_token"]').val(),
            'user': {
              'email': $('#user_email').val(),
              'password': $('#user_password').val(),
              'remember_me': $('#user_remember_me').prop("checked") ? 1 : 0
            }
          },
          error: function(jqXHR) {
            var response = $.parseJSON(jqXHR.responseText)
            $(submitButton).attr("disabled", false);
            $('#user_password').parent().addClass(errorClass);
            $('#user_password').next(".help-block").html(response.error);
            $('#user_password').focus();
          },
          success: function(data) {
            $('.container-fluid').addClass('signed-in');
            $('.sidebar').removeClass('sidebar-full');
            $.ajax({
              type: 'GET',
              url: '/sidebar/search',
              success: function(data) {
                $('#content').html(data);
                current_user_id = $('#current_user_id').val();
                flipMarkers();
              }
            });
          }
        });
      }
    } else if($(this).data('state') === 'user_forgot_password') {
      if(errors.length > 0) {
        $(submitButton).attr("disabled", false);
        errors[0].focus();
      } else {
        $.ajax({
          type: 'POST',
          url: '/users/password.json',
          data: {
            'utf8': '✓',
            'authenticity_token': $('#combo-form input[name="authenticity_token"]').val(),
            'user': {
              'email': $('#user_email').val()
            }
          },
          error: function(jqXHR) {
            $(submitButton).attr("disabled", false);
            $('#user_email').parent().addClass(errorClass);
            $('#user_email').focus();
          },
          success: function() {
            showFlash('info', 'Password reset sent');
            $(submitButton).attr("disabled", false);
          }
        });
      }
    }
    return false;
  });
  $('#map').on('submit', '#adoption_form', function() {
    var submitButton = $("#adoption_form input[type='submit']");
    $(submitButton).attr("disabled", true);
    $.ajax({
      type: 'POST',
      url: '/things.json',
      data: {
        '_method': 'patch',
        'id': $('#thing_id').val(),
        'utf8': '✓',
        'authenticity_token': $('#adoption_form input[name="authenticity_token"]').val(),
        'thing': {
          'user_id': $('#thing_user_id').val(),
          'name': $('#thing_name').val()
        }
      },
      error: function(jqXHR) {
        $(submitButton).attr("disabled", false);
      },
      success: function(data) {
        $.ajax({
          type: 'GET',
          url: '/info_window',
          data: {
            'thing_id': activeThingId
          },
          success: function(data) {
            activeInfoWindow.close();
            activeInfoWindow.setContent(data);
            activeInfoWindow.open(map, activeMarker);
            activeMarker.setIcon(adoptedByYouMarker);
            activeMarker.setAnimation(google.maps.Animation.BOUNCE);
          }
        });
      }
    });
    return false;
  });
  $('#map').on('submit', '#abandon_form', function() {
    var answer = window.confirm(constants.abandonConfirmText)
    if(answer) {
      var submitButton = $("#abandon_form input[type='submit']");
      $(submitButton).attr("disabled", true);
      $.ajax({
        type: 'POST',
        url: '/things.json',
        data: {
          '_method': 'patch',
          'id': $('#thing_id').val(),
          'utf8': '✓',
          'authenticity_token': $('#abandon_form input[name="authenticity_token"]').val(),
          'thing': {
            'user_id': $('#thing_user_id').val(),
            'name': $('#thing_name').val()
          }
        },
        error: function(jqXHR) {
          $(submitButton).attr("disabled", false);
        },
        success: function(data) {
          $.ajax({
            type: 'GET',
            url: '/info_window',
            data: {
              'thing_id': activeThingId
            },
            success: function(data) {
              activeInfoWindow.close();
              activeInfoWindow.setContent(data);
              activeInfoWindow.open(map, activeMarker);
              activeMarker.setIcon(toSewerMarker);
              activeMarker.setAnimation(null);
            }
          });
        }
      });
    }
    return false;
  });
  $('.sidebar').on('click','#edit_profile_link', function() {
    var link = $(this);
    $(link).addClass('disabled');
    $.ajax({
      type: 'GET',
      url: '/users/edit',
      error: function(jqXHR) {
        $(link).removeClass('disabled');
      },
      success: function(data) {
        $('#content').html(data);
      }
    });
    return false;
  });
  $('.sidebar').on('submit','#edit_form', function() {
    var submitButton = $("#edit_form input[type='submit']");
    $(submitButton).attr("disabled", true);
    var errors = []
    if(!/[\w\.%\+\]+@[\w\]+\.+[\w]{2,}/.test($('#user_email').val())) {
      errors.push($('#user_email'));
      $('#user_email').parent().addClass(errorClass);
    } else {
      $('#user_email').parent().removeClass(errorClass);
    }
    if($('#user_first_name').val() === '') {
      errors.push($('#user_first_name'));
      $('#user_first_name').parent().addClass(errorClass);
    } else {
      $('#user_first_name').parent().removeClass(errorClass);
    }
    if($('#user_zip').val() != '' && !/^\d{5}(-\d{4})?$/.test($('#user_zip').val())) {
      errors.push($('#user_zip'));
      $('#user_zip').parent().addClass(errorClass);
    } else {
      $('#user_zip').parent().removeClass(errorClass);
    }
    if($('#user_password').val() && ($('#user_password').val().length < 6 || $('#user_password').val().length > 20)) {
      errors.push($('#user_password'));
      $('#user_password').parent().addClass(errorClass);
    } else {
      $('#user_password').parent().removeClass(errorClass);
    }
    if($('#user_current_password').val().length < 6 || $('#user_current_password').val().length > 20) {
      errors.push($('#user_current_password'));
      $('#user_current_password').parent().addClass(errorClass);
    } else {
      $('#user_current_password').parent().removeClass(errorClass);
    }
    if(errors.length > 0) {
      $(submitButton).attr("disabled", false);
      errors[0].focus();
    } else {
      $.ajax({
        type: 'POST',
        url: '/users.json',
        data: {
          '_method': 'patch',
          'id': $('#id').val(),
          'thing_id': activeThingId,
          'utf8': '✓',
          'authenticity_token': $('#edit_form input[name="authenticity_token"]').val(),
          'user': {
            'email': $('#user_email').val(),
            'first_name': $('#user_first_name').val(),
            'last_name': $('#user_last_name').val(),
            'organization': $('#user_organization').val(),
            'voice_number': $('#user_voice_number').val(),
            'sms_number': $('#user_sms_number').val(),
            'address_1': $('#user_address_1').val(),
            'address_2': $('#user_address_2').val(),
            'city': $('#user_city').val(),
            'state': $('#user_state').val(),
            'zip': $('#user_zip').val(),
            'password': $('#user_password').val(),
            'password_confirmation': $('#user_password').val(),
            'current_password': $('#user_current_password').val()
          }
        },
        error: function(jqXHR) {
          var data = $.parseJSON(jqXHR.responseText);
          $(submitButton).attr("disabled", false);
          if(data.errors.email) {
            errors.push($('#user_email'));
            $('#user_email').parent().addClass(errorClass);
          }
          if(data.errors.first_name) {
            errors.push($('#user_first_name'));
            $('#user_first_name').parent().addClass(errorClass);
          }
          if(data.errors.last_name) {
            errors.push($('#user_last_name'));
            $('#user_last_name').parent().addClass(errorClass);
          }
          if(data.errors.organization) {
            errors.push($('#user_organization'));
            $('#user_organization').parent().addClass(errorClass);
          }
          if(data.errors.voice_number) {
            errors.push($('#user_voice_number'));
            $('#user_voice_number').parent().addClass(errorClass);
          }
          if(data.errors.sms_number) {
            errors.push($('#user_sms_number'));
            $('#user_sms_number').parent().addClass(errorClass);
          }
          if(data.errors.address_1) {
            errors.push($('#user_address_1'));
            $('#user_address_1').parent().addClass(errorClass);
          }
          if(data.errors.address_2) {
            errors.push($('#user_address_2'));
            $('#user_address_2').parent().addClass(errorClass);
          }
          if(data.errors.city) {
            errors.push($('#user_city'));
            $('#user_city').parent().addClass(errorClass);
          }
          if(data.errors.state) {
            errors.push($('#user_state'));
            $('#user_state').parent().addClass(errorClass);
          }
          if(data.errors.zip) {
            errors.push($('#user_zip'));
            $('#user_zip').parent().addClass(errorClass);
          }
          if(data.errors.password) {
            errors.push($('#user_password'));
            $('#user_password').parent().addClass(errorClass);
          }
          if(data.errors.current_password) {
            errors.push($('#user_current_password'));
            $('#user_current_password').parent().addClass(errorClass);
          }
          errors[0].focus();
        },
        success: function(data) {
          $('#content').html(data);
        }
      });
    }
    return false;
  });
  $('.sidebar').on('click','#sign_out_link', function() {
    var link = $(this);
    $(link).addClass('disabled');
    $.ajax({
      type: 'DELETE',
      url: '/users/sign_out.json',
      error: function(jqXHR) {
        $(link).removeClass('disabled');
      },
      success: function(data) {
        current_user_id = '';
        flipMarkers();
        $.ajax({
          type: 'GET',
          url: '/sidebar/combo_form',
          success: function(data) {
            $('.sidebar').removeClass('sidebar-full');
            $('.container-fluid').removeClass('signed-in');
            $('#content').html(data);
          }
        });
      }
    });
    return false;
  });
  $('.sidebar').on('submit','#sign_out_form', function() {
    var submitButton = $("#sign_out_form input[type='submit']");
    $(submitButton).attr("disabled", true);
    $.ajax({
      type: 'GET',
      url: '/users/sign_in',
      error: function(jqXHR) {
        $(submitButton).attr("disabled", false);
      },
      success: function(data) {
        activeInfoWindow.close();
        activeInfoWindow.setContent(data);
        activeInfoWindow.open(map, activeMarker);
      }
    });
    return false;
  });
  $('.sidebar').on('click','.link', function() {
    var link = $(this);
    $(link).addClass('disabled');
    $.ajax({
      type: 'GET',
      url: link.attr('href'),
      error: function(jqXHR) {
        $(link).removeClass('disabled');
      },
      success: function(data) {
        console.log(data);
        $('#content').html(data);
      }
    });
    return false;
  });
  $('#reminder_form').on('submit', function() {
    var submitButton = $("#reminder_form input[type='submit']");
    $(submitButton).attr("disabled", true);
    $.ajax({
      type: 'POST',
      url: '/reminders.json',
      data: {
        'utf8': '✓',
        'authenticity_token': $('#reminder_form input[name="authenticity_token"]').val(),
        'reminder': {
          'to_user_id': $('#reminder_to_user_id').val(),
          'thing_id': activeThingId
        }
      },
      error: function(jqXHR) {
        $(submitButton).attr("disabled", false);
      },
      success: function(data) {
        $.ajax({
          type: 'GET',
          url: '/info_window',
          data: {
            'thing_id': activeThingId
          },
          success: function(data) {
            activeInfoWindow.close();
            activeInfoWindow.setContent(data);
            activeInfoWindow.open(map, activeMarker);
          }
        });
      }
    });
    return false;
  });
  $('.alert-message').alert();
});
(function(){var t=this;(function(){(function(){var t=[].slice;this.LocalTime={config:{},run:function(){return this.getController().processElements()},process:function(){var e,n,r,a;for(n=1<=arguments.length?t.call(arguments,0):[],r=0,a=n.length;r<a;r++)e=n[r],this.getController().processElement(e);return n.length},getController:function(){return null!=this.controller?this.controller:this.controller=new e.Controller}}}).call(this)}).call(t);var e=t.LocalTime;(function(){(function(){e.config.i18n={en:{date:{dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbrDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbrMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],yesterday:"yesterday",today:"today",tomorrow:"tomorrow",on:"on {date}",formats:{"default":"%b %e, %Y",thisYear:"%b %e"}},time:{am:"am",pm:"pm",singular:"a {time}",singularAn:"an {time}",elapsed:"{time} ago",second:"second",seconds:"seconds",minute:"minute",minutes:"minutes",hour:"hour",hours:"hours",formats:{"default":"%l:%M%P"}},datetime:{at:"{date} at {time}",formats:{"default":"%B %e, %Y at %l:%M%P %Z"}}}}}).call(this),function(){e.config.locale="en",e.config.defaultLocale="en"}.call(this),function(){e.config.timerInterval=6e4}.call(this),function(){var t,n,r;r=!isNaN(Date.parse("2011-01-01T12:00:00-05:00")),e.parseDate=function(t){return t=t.toString(),r||(t=n(t)),new Date(Date.parse(t))},t=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|[-+]?[\d:]+)$/,n=function(e){var n,r,a,i,o,s,u,c,l;if(a=e.match(t))return a[0],c=a[1],o=a[2],n=a[3],r=a[4],i=a[5],u=a[6],l=a[7],"Z"!==l&&(s=l.replace(":","")),c+"/"+o+"/"+n+" "+r+":"+i+":"+u+" GMT"+[s]}}.call(this),function(){e.elementMatchesSelector=function(){var t,e,n,r,a,i;return t=document.documentElement,e=null!=(n=null!=(r=null!=(a=null!=(i=t.matches)?i:t.matchesSelector)?a:t.webkitMatchesSelector)?r:t.mozMatchesSelector)?n:t.msMatchesSelector,function(t,n){if((null!=t?t.nodeType:void 0)===Node.ELEMENT_NODE)return e.call(t,n)}}()}.call(this),function(){var t,n,r;t=e.config,r=t.i18n,e.getI18nValue=function(a,i){var o,s;return null==a&&(a=""),o=(null!=i?i:{locale:t.locale}).locale,s=n(r[o],a),null!=s?s:o!==t.defaultLocale?e.getI18nValue(a,{locale:t.defaultLocale}):void 0},e.translate=function(t,n,r){var a,i,o;null==n&&(n={}),o=e.getI18nValue(t,r);for(a in n)i=n[a],o=o.replace("{"+a+"}",i);return o},n=function(t,e){var n,r,a,i,o;for(o=t,i=e.split("."),n=0,a=i.length;n<a;n++){if(r=i[n],null==o[r])return null;o=o[r]}return o}}.call(this),function(){var t,n,r,a,i;t=e.getI18nValue,i=e.translate,e.strftime=a=function(e,o){var s,u,c,l,d,h,f;return u=e.getDay(),s=e.getDate(),d=e.getMonth(),f=e.getFullYear(),c=e.getHours(),l=e.getMinutes(),h=e.getSeconds(),o.replace(/%([%aAbBcdeHIlmMpPSwyYZ])/g,function(o){switch(o[0],o[1]){case"%":return"%";case"a":return t("date.abbrDayNames")[u];case"A":return t("date.dayNames")[u];case"b":return t("date.abbrMonthNames")[d];case"B":return t("date.monthNames")[d];case"c":return e.toString();case"d":return n(s);case"e":return s;case"H":return n(c);case"I":return n(a(e,"%l"));case"l":return 0===c||12===c?12:(c+12)%12;case"m":return n(d+1);case"M":return n(l);case"p":return i("time."+(c>11?"pm":"am")).toUpperCase();case"P":return i("time."+(c>11?"pm":"am"));case"S":return n(h);case"w":return u;case"y":return n(f%100);case"Y":return f;case"Z":return r(e)}})},n=function(t){return("0"+t).slice(-2)},r=function(t){var e,n,r,a,i;return i=t.toString(),(e=null!=(n=i.match(/\(([\w\s]+)\)$/))?n[1]:void 0)?/\s/.test(e)?e.match(/\b(\w)/g).join(""):e:(e=null!=(r=i.match(/(\w{3,4})\s\d{4}$/))?r[1]:void 0)?e:(e=null!=(a=i.match(/(UTC[\+\-]\d+)/))?a[1]:void 0)?e:""}}.call(this),function(){e.CalendarDate=function(){function t(t,e,n){this.date=new Date(Date.UTC(t,e-1)),this.date.setUTCDate(n),this.year=this.date.getUTCFullYear(),this.month=this.date.getUTCMonth()+1,this.day=this.date.getUTCDate(),this.value=this.date.getTime()}return t.fromDate=function(t){return new this(t.getFullYear(),t.getMonth()+1,t.getDate())},t.today=function(){return this.fromDate(new Date)},t.prototype.equals=function(t){return(null!=t?t.value:void 0)===this.value},t.prototype.is=function(t){return this.equals(t)},t.prototype.isToday=function(){return this.is(this.constructor.today())},t.prototype.occursOnSameYearAs=function(t){return this.year===(null!=t?t.year:void 0)},t.prototype.occursThisYear=function(){return this.occursOnSameYearAs(this.constructor.today())},t.prototype.daysSince=function(t){if(t)return(this.date-t.date)/864e5},t.prototype.daysPassed=function(){return this.constructor.today().daysSince(this)},t}()}.call(this),function(){var t,n,r;n=e.strftime,r=e.translate,t=e.getI18nValue,e.RelativeTime=function(){function a(t){this.date=t,this.calendarDate=e.CalendarDate.fromDate(this.date)}return a.prototype.toString=function(){var t,e;return(e=this.toTimeElapsedString())?r("time.elapsed",{time:e}):(t=this.toWeekdayString())?(e=this.toTimeString(),r("datetime.at",{date:t,time:e})):r("date.on",{date:this.toDateString()})},a.prototype.toTimeOrDateString=function(){return this.calendarDate.isToday()?this.toTimeString():this.toDateString()},a.prototype.toTimeElapsedString=function(){var t,e,n,a,i;return n=(new Date).getTime()-this.date.getTime(),a=Math.round(n/1e3),e=Math.round(a/60),t=Math.round(e/60),n<0?null:a<10?(i=r("time.second"),r("time.singular",{time:i})):a<45?a+" "+r("time.seconds"):a<90?(i=r("time.minute"),r("time.singular",{time:i})):e<45?e+" "+r("time.minutes"):e<90?(i=r("time.hour"),r("time.singularAn",{time:i})):t<24?t+" "+r("time.hours"):""},a.prototype.toWeekdayString=function(){switch(this.calendarDate.daysPassed()){case 0:return r("date.today");case 1:return r("date.yesterday");case-1:return r("date.tomorrow");case 2:case 3:case 4:case 5:case 6:return n(this.date,"%A");default:return""}},a.prototype.toDateString=function(){var e;return e=t(this.calendarDate.occursThisYear()?"date.formats.thisYear":"date.formats.default"),n(this.date,e)},a.prototype.toTimeString=function(){return n(this.date,t("time.formats.default"))},a}()}.call(this),function(){var t,n=function(t,e){return function(){return t.apply(e,arguments)}};t=e.elementMatchesSelector,e.PageObserver=function(){function e(t,e){this.selector=t,this.callback=e,this.processInsertion=n(this.processInsertion,this),this.processMutations=n(this.processMutations,this)}return e.prototype.start=function(){if(!this.started)return this.observeWithMutationObserver()||this.observeWithMutationEvent(),this.started=!0},e.prototype.observeWithMutationObserver=function(){var t;if("undefined"!=typeof MutationObserver&&null!==MutationObserver)return t=new MutationObserver(this.processMutations),t.observe(document.documentElement,{childList:!0,subtree:!0}),!0},e.prototype.observeWithMutationEvent=function(){return addEventListener("DOMNodeInserted",this.processInsertion,!1),!0},e.prototype.findSignificantElements=function(e){var n;return n=[],(null!=e?e.nodeType:void 0)===Node.ELEMENT_NODE&&(t(e,this.selector)&&n.push(e),n.push.apply(n,e.querySelectorAll(this.selector))),n},e.prototype.processMutations=function(t){var e,n,r,a,i,o,s,u;for(e=[],n=0,a=t.length;n<a;n++)switch(o=t[n],o.type){case"childList":for(u=o.addedNodes,r=0,i=u.length;r<i;r++)s=u[r],e.push.apply(e,this.findSignificantElements(s))}return this.notify(e)},e.prototype.processInsertion=function(t){var e;return e=this.findSignificantElements(t.target),this.notify(e)},e.prototype.notify=function(t){if(null!=t?t.length:void 0)return"function"==typeof this.callback?this.callback(t):void 0},e}()}.call(this),function(){var t,n,r,a,i=function(t,e){return function(){return t.apply(e,arguments)}};r=e.parseDate,a=e.strftime,n=e.getI18nValue,t=e.config,e.Controller=function(){function o(){this.processElements=i(this.processElements,this),this.pageObserver=new e.PageObserver(s,this.processElements)}var s,u,c;return s="time[data-local]:not([data-localized])",o.prototype.start=function(){if(!this.started)return this.processElements(),this.startTimer(),this.pageObserver.start(),this.started=!0},o.prototype.startTimer=function(){var e;if(e=t.timerInterval)return null!=this.timer?this.timer:this.timer=setInterval(this.processElements,e)},o.prototype.processElements=function(t){var e,n,r;for(null==t&&(t=document.querySelectorAll(s)),n=0,r=t.length;n<r;n++)e=t[n],this.processElement(e);return t.length},o.prototype.processElement=function(t){var e,i,o,s,l;if(e=t.getAttribute("datetime"),i=t.getAttribute("data-format"),o=t.getAttribute("data-local"),s=r(e),!isNaN(s))return t.hasAttribute("title")||(l=a(s,n("datetime.formats.default")),t.setAttribute("title",l)),t.textContent=function(){switch(o){case"time":return u(t),a(s,i);case"date":return u(t),c(s).toDateString();case"time-ago":return c(s).toString();case"time-or-date":return c(s).toTimeOrDateString();case"weekday":return c(s).toWeekdayString();case"weekday-or-date":return c(s).toWeekdayString()||c(s).toDateString()}}()},u=function(t){return t.setAttribute("data-localized","")},c=function(t){return new e.RelativeTime(t)},o}()}.call(this),function(){var t,n,r,a;a=!1,t=function(){return document.attachEvent?"complete"===document.readyState:"loading"!==document.readyState},n=function(t){var e;return null!=(e="function"==typeof requestAnimationFrame?requestAnimationFrame(t):void 0)?e:setTimeout(t,17)},r=function(){var t;return t=e.getController(),t.start()},e.start=function(){if(!a)return a=!0,"undefined"!=typeof MutationObserver&&null!==MutationObserver||t()?r():n(r)},window.LocalTime===e&&e.start()}.call(this)}).call(this),"object"==typeof module&&module.exports?module.exports=e:"function"==typeof define&&define.amd&&define(e)}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//


;
