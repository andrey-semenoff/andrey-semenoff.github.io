'use strict';

(function($) {
  
  // Запуск слайдера
  ProjectSlider();
  
  // Запуск прелоадера
  Preloader();

  // Активация параллакса
  Parallaxer();

  // adaptive height of header
  if($('.header').length > 0) {
    // var min_height = 650;
    var new_height = $(window).height();

    // if ($(window).height() > min_height) {
    //   new_height = $(window).height()
    // } else {
    //   new_height = min_height;
    // }

    $('.header').css({
      height: new_height
    });
  }

  // flip login box
  $('#header__login-btn').on('click', function (e) {
    e.stopPropagation();
    $('.login-box').addClass('login-box_flipped');
    $('.avatar-box_welcome').addClass('avatar-box_flipped');
    $('.login-form__input[name=login]').focus()
    $(this).fadeOut()
  });

  // flip-back login box
  $('.login-form__lbl').keyup(function (e) {
    if ( e.keyCode == 32 || e.keyCode == 13 ) {
      $(this).click();
    }
  });

  $('body, #login-nav__home').click(function (e) {
    if( $(e.target).parents('.flip-container').length == 0 || $(e.target).attr('id') === 'login-nav__home') {
      // $('.flipper').removeClass('flipped');
      $('.login-box').removeClass('login-box_flipped');
      $('.avatar-box_welcome').removeClass('avatar-box_flipped');
      $('#header__login-btn').fadeIn()
    }
  });

  // smooth scroll
  $('#arrow-down, #arrow-up, .chapters__link').click(function(){
    $('html, body').animate({
      scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 1000);
    return false;
  });

  $('.chapters__link').on('click', function(){
    $('html, body').animate({
      scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 1000);

    return false;
  });

  // Переход по якорю на другой странице
  if(window.location.hash !== '' && window.location.hash !== '#') {
    $('html, body').animate({
      scrollTop: $( window.location.hash ).offset().top + 40
    }, 1000);
  }

  // Overlay-menu
  $('#open-overlay-menu').click(function () {
    var $this = $(this);
    if( $this.data('action') == 'open' ) {

      // open overlay menu
      $this.data('action', 'close');

      $('.hamburger').addClass('hamburger_close');

      $('.overlay-menu').css({
        display: "block"
      });

      setTimeout(function () {
        $('.overlay__half').addClass('overlay__half_showed');
        $('.overlay-menu').css({
          opacity: 1
        })
      }, 10)

      $('.overlay__half').on('transitionend', function () {
        var i = 0;
        $('.overlay-menu').addClass('overlay-menu_showed');

        var timer = setInterval(function () {
          if( $('.overlay-menu__item').eq(i).length ) {
            $('.overlay-menu__item').eq(i).addClass('overlay-menu__item_showed');
          } else {
            clearInterval(timer);
          }
          i++;
        }, 250);
      })

      //block scroll lock
      $('body').css({ position: 'fixed' })

    } else {

      //close overlay menu
      $this.data('action', 'open');

      $('.hamburger').removeClass('hamburger_close');

      $('.overlay-menu').css({
          opacity: 0
      });
      setTimeout(function () {
        $('.overlay__half').removeClass('overlay__half_showed');
        $('.overlay-menu').css({
          display: "none"
        })
      }, 500)

      $('.overlay-menu').removeClass('overlay-menu_showed');
      $('.overlay-menu__item').each(function () {
        $(this).removeClass('overlay-menu__item_showed')
      })

      //block scroll unlock
      $('body').css({ position: '' })

    }
  });


  // fixed blog chapters
  if($('.blog__chapters').length > 0) {
    var scroll_point = $('.blog__articles').offset().top - 70;
    var fixed_flag = false;

    $(window).on('scroll', function (e) {
      var body_scrollTop = $('body').scrollTop();

      if( body_scrollTop >= scroll_point) {

        if(!fixed_flag) {
          fixed_flag = true;

          $('.blog__chapters').addClass('blog__chapters_fixed');
        }

        $('.blog__article').each(function (i, item) {
          if( body_scrollTop + 120 >= $(item).offset().top &&
              body_scrollTop + 120 <= $(item).offset().top + $(item).height() ) {

            var activeId = $(item).attr("id");

            $('.chapters__item').removeClass('chapters__item_active');
            $('.chapters__link[href="#'+activeId+'"]').parent().addClass('chapters__item_active');

            return false;
          }
        })

      } else {
        fixed_flag = false;

        if($(window).width() > 480) {
          $('.blog__chapters').removeClass('blog__chapters_fixed');
          $(this).data('swiped', false);
        }
      }
    });

    var blogChapters = $('.blog__chapters');

    $(window).on('resize', function (e) {
      blogChapters.data('swiped', false);
      blogChapters.removeClass('blog__chapters_showed');
    });

    $('.blog__chapters, .chapters__link').click(function () {
      if( $(this).data('swiped') == false ) {
        $(this).data('swiped', true);
        blogChapters.addClass('blog__chapters_showed');
      } else {
        $(this).data('swiped', false);
        blogChapters.removeClass('blog__chapters_showed');
      }
    })
  }

  

  // send mail & reset form
  $('.contact-form').on('submit', function (e) {
    e.preventDefault();
    sendMail($(this));
  })
  .on('reset', function () {
    var $this = $(this);

    $this.find('input[type=text], textarea').each(function () {
      $(this).removeClass('contact-form__input_success contact-form__input_error');
    });

    $this.find('.contact-form__input-note').remove();
  });


})(jQuery);






/** =========================
 * ----- Google maps --------
 * ======================= */

function initMap() {

  if($('#map-box').length == 0) { return false; }

  // Create an array of styles.
  var styles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#e7a731"},{"visibility":"on"}]}]

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles,
      {name: "Styled Map"});

  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  var mapOptions = {
    scrollwheel: false,
    zoom: 11,
    center: new google.maps.LatLng(46.51, 30.7471985),
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  };
  var map = new google.maps.Map(document.getElementById('map-box'),
      mapOptions);

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  var image = {
    url: "../img/map_marker.svg",
    scaledSize: new google.maps.Size(50, 71.46)
  };

  var marker = new google.maps.Marker({
    position: {lat: 46.4322939, lng: 30.7271985},
    icon: image
  });

  // To add the marker to the map, call setMap();
  marker.setMap(map);
}


/** =======================
* ----- my Parallax --------
* ====================== */

; function Parallaxer() {
  var paralaxed = $('.parallaxed');
  
  if(paralaxed.length > 0) {

    $(window).on('scroll', function () {
      var winHeight = $(window).height(),
          winBottom = $(window).scrollTop() + winHeight;

      paralaxed.each(function () {
        if( winBottom > $(this).offset().top - $(this).height()/2 ) {
          var $this = $(this);

          // skills colorify
          if($this.hasClass('skill') && $this.hasClass('parallaxed_moved') ) {

              var svg = $this.find('.skill-diagram__svg');
            svg.each(function () {
              var lvl = $(this).data('lvl');
              var arcLength = 282.6 - lvl/100 * 282.6;

              $(this).children('.skill-diagram__ring').css({
                "stroke-dashoffset": arcLength,
                "stroke-opacity": lvl/100
              });
            })
          }

          $this.removeClass('parallaxed_moved');

        }
      })
    })
  }
}

/** =======================
 * ----- Preloader --------
 * ====================== */
; function Preloader() {

  var
      wrap = document.getElementById('preloader'),
      counter = document.getElementById('preloader-counter'),
      tick = 0,
      timer,
      isTimerRun = false,
      onePic = 0,
      loadedAmount = 0,
      imgs = [];

  $('.wrapper *, .footer *').each(function () {
    var $this = $(this),
        src = $this.attr('src'),
        bg = $(this).css('background-image');

    if(src !== undefined && !src.match('.js$') && !src.match('^https://maps.googleapis.com')) {
      imgs.push(src)
    } else if(bg !== 'none' && !bg.match('^linear') ) {
      bg = bg.replace('url("','').replace('")','');
      imgs.push(bg)
    }
  });
// console.log(imgs);

  onePic = Math.ceil( 1 / imgs.length * 100 );
  tick = onePic;

  imgs.forEach(function (item, i) {
    var img = $('<img>', {
      attr: {
        src: item
      }
    });
    img.on('load', function () {
// console.log(img+i+' - loaded!');
      loadedAmount += onePic;
      if(!isTimerRun) {
        isTimerRun = true;
        goTimer();
      }
    });

  });

  function goTimer() {
    timer = setInterval(function() {
      tick += Math.ceil(loadedAmount/(tick));
//// DELETE!!!!!!!!!!!!!!
      tick = 100
      if(tick >= 100) {
        clearInterval(timer);
        isTimerRun = false;
        tick = 100;
        wrap.style.opacity = 0;
        setTimeout(function () {
          wrap.style.display = "none";
          $('.flip-container').addClass('flip-container_animated');
        }, 500)
      } else if(tick >= loadedAmount && tick < 100) {
        clearInterval(timer);
        isTimerRun = false;
      }

      counter.innerHTML = tick
    }, 100);
  }

}
/** =======================
* ----- Send mail --------
* ====================== */
; function sendMail( form ) {
  var formData = new FormData(form[0]);

  if( validate() ) {
    $.ajax({
          method: "POST",
          url: "sendmail.php",
          data: formData,
          processData: false,
          contentType: false
        })
        .done(function( msg ) {
          // msg = JSON.parse(msg);
          console.log( msg );
        });
  } else {
    console.log('Некорректные данные!');
  }

  function validate() {

    var isValid = true,
        regexp = {
          'name': /[a-zа-я]{2,}/i,
          'email': /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
          'text': /[a-zA-Zа-яА-Я0-9]{5,}/i
        },
        note = {
          'name': "Ваше имя должно состоять минимум из 2 букв!",
          'email': "Ваш Email должен быть настоящим адресом эл. почты!",
          'text': "Ваше сообщение должно состоять минимум из 5 букв!",
          'empty': "Заполните пожалуйста это поле!"
        };


    form.find('input[type=text], textarea').each(function () {

      var $this = $(this),
          value = $this.val(),
          regexpType = $this.data('regexptype');

      $this.next('.contact-form__input-note').remove();

      if($this.val() == '') {
        addNote($this, note.empty);
        $this.removeClass('contact-form__input_success');
        $this.addClass('contact-form__input_error');
        isValid = false;
      } else {
        if(!value.match(regexp[regexpType])) {
          addNote($this, note[regexpType]);
          $this.removeClass('contact-form__input_success');
          $this.addClass('contact-form__input_error');
          isValid = false;
        } else {
          $this.removeClass('contact-form__input_error');
          $this.addClass('contact-form__input_success');
        }
      }
    });
    return isValid;
  }

  function addNote($this, msg) {

    var noteTop = $this.offset().top + $this.outerHeight() - $this.parent('form').offset().top,
        noteLeft = $this.offset().left - $this.parent('form').offset().left;

    $('<div class="contact-form__input-note" style="left: '+ noteLeft +'px; top: '+ noteTop +'px;">'+ msg +'</div>').insertAfter($this);
  }


}

/** ==========================================
 * ------------- Project Slider  ------------
 * ======================================== */

; function ProjectSlider( params ) {

   var defaults = {                                       // натсройки слайдера
      firstSlideNum: 0,                                   // порядковый номер первого слайда
      sliderItems: '.slider-preview__item',               // имя класса слайдов
      sliderItemActive: 'slider-preview__item_active',    // имя класса активного слайда
      sliderButtonDown: '.slider__button_down',           // имя класса кнопки ВНИЗ
      sliderButtonUp: '.slider__button_up',               // имя класса кнопки ВВЕРХ
      sliderButtonImgs: '.slider-button__item',           // имя класса активного элемента списка картинок КНОПКИ
      sliderButtonImgActive: 'slider-button__item_active' // имя класса активного элемента списка картинок КНОПКИ
    };

    var currentNum = defaults.firstSlideNum,
        sliderItems = defaults.sliderItems,
        sliderItemActive = defaults.sliderItemActive,
        sliderButtonDown = defaults.sliderButtonDown,
        sliderButtonUp = defaults.sliderButtonUp,
        sliderButtonImgs = defaults.sliderButtonImgs,
        sliderButtonImgActive = defaults.sliderButtonImgActive,

        previews = $(sliderItems),                              // набор слайдов
        imagesCount = previews.length,                          // кол-во слайдов
        lastItem = imagesCount - 1,                             // номер последнего слайда
        downCurr,                                               // предыдущий номер на кнопке DOWN в момент перключения слайда
        upCurr,                                                 // следующий номер на кнопке UP в момент перключения слайда
        itemsDown = $(sliderButtonDown).find(sliderButtonImgs), // кратинки кнопки ВНИЗ
        itemsUp = $(sliderButtonUp).find(sliderButtonImgs),     // кратинки кнопки ВВЕРХ
        sliderDesc = [];


    $.ajax('json/works.json').done(function (data) {
      setup(data)
    });


    // ------------- Нажатие на кнопку прокрутки слайдов --------------

    $('.slider__button').click(function (e) {
      e.preventDefault();

      // Отображение след/пред слайда в зависимоти от нажатой кнопки
      if ( $(this).hasClass('slider__button_up') ) {
        previews.eq(currentNum).removeClass(sliderItemActive);
        previews.eq(upCurr).addClass(sliderItemActive);
        currentNum = upCurr;
      } else {
        previews.eq(currentNum).removeClass(sliderItemActive);
        previews.eq(downCurr).addClass(sliderItemActive);
        currentNum = downCurr;
      }


      var currentDown = itemsDown.eq(downCurr),
          currentUp = itemsUp.eq(upCurr);

      // Анимация катринок на кнопках - подъем вверх
      currentDown.css({
        top: parseInt($(this).css('top')) + $(this).height()
      }).removeClass(sliderButtonImgActive);

      currentUp.css({
        top: parseInt($(this).css('top')) - $(this).height()
      }).removeClass(sliderButtonImgActive);

      // После окончания анимации сброс
      currentUp.on('transitionend', function () {
        $(this).css({
          top: ''
        })
      });

      currentDown.on('transitionend', function () {
        $(this).css({
          top: ''
        })
      });

      run();

    });

    function setup(data) {
      sliderDesc = data;

        $('.slider-preview__photo').each(function (i) {
          $(this).attr('src', 'img/projects/' + sliderDesc[i].image)
        });

        $('.slider__button').each(function() {
          $(this).find('.slider-button__img').each(function (i) {
            $(this).attr('src', 'img/projects/' + sliderDesc[i].image)
          });
        });

        previews.eq(currentNum).addClass(sliderItemActive); // активация первого слайда в окне просмотра

        run();
    }

    function run() {
      // Определяем новые картинки для кнопок
      if (currentNum == 0) {
        downCurr = lastItem;
      } else if (currentNum - 1 == 0) {
        downCurr = 0;
      } else {
        downCurr = currentNum - 1;
      }

      if (currentNum == lastItem) {
        upCurr = 0;
      } else if (currentNum + 1 == lastItem) {
        upCurr = lastItem;
      } else {
        upCurr = currentNum + 1;
      }

      $('.slider-description .title-content').text(sliderDesc[currentNum].title)
      $('.slider-description .current-skills').text(sliderDesc[currentNum].skills.join(", "))
      $('.slider-description .slider-description__btn').attr('href', sliderDesc[currentNum].url)

      // Отображаем новые картинки кнопок
      itemsDown.eq(downCurr).addClass(sliderButtonImgActive);
      itemsUp.eq(upCurr).addClass(sliderButtonImgActive);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJtb2R1bGVzL2dvb2dsZS1tYXBzLmpzIiwibW9kdWxlcy9teS1wYXJhbGxheC5qcyIsIm1vZHVsZXMvcHJlbG9hZGVyLmpzIiwibW9kdWxlcy9zZW5kbWFpbC5qcyIsIm1vZHVsZXMvc2xpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbigkKSB7XG4gIFxuICAvLyDQl9Cw0L/Rg9GB0Log0YHQu9Cw0LnQtNC10YDQsFxuICBQcm9qZWN0U2xpZGVyKCk7XG4gIFxuICAvLyDQl9Cw0L/Rg9GB0Log0L/RgNC10LvQvtCw0LTQtdGA0LBcbiAgUHJlbG9hZGVyKCk7XG5cbiAgLy8g0JDQutGC0LjQstCw0YbQuNGPINC/0LDRgNCw0LvQu9Cw0LrRgdCwXG4gIFBhcmFsbGF4ZXIoKTtcblxuICAvLyBhZGFwdGl2ZSBoZWlnaHQgb2YgaGVhZGVyXG4gIGlmKCQoJy5oZWFkZXInKS5sZW5ndGggPiAwKSB7XG4gICAgLy8gdmFyIG1pbl9oZWlnaHQgPSA2NTA7XG4gICAgdmFyIG5ld19oZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG5cbiAgICAvLyBpZiAoJCh3aW5kb3cpLmhlaWdodCgpID4gbWluX2hlaWdodCkge1xuICAgIC8vICAgbmV3X2hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKVxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICBuZXdfaGVpZ2h0ID0gbWluX2hlaWdodDtcbiAgICAvLyB9XG5cbiAgICAkKCcuaGVhZGVyJykuY3NzKHtcbiAgICAgIGhlaWdodDogbmV3X2hlaWdodFxuICAgIH0pO1xuICB9XG5cbiAgLy8gZmxpcCBsb2dpbiBib3hcbiAgJCgnI2hlYWRlcl9fbG9naW4tYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICQoJy5sb2dpbi1ib3gnKS5hZGRDbGFzcygnbG9naW4tYm94X2ZsaXBwZWQnKTtcbiAgICAkKCcuYXZhdGFyLWJveF93ZWxjb21lJykuYWRkQ2xhc3MoJ2F2YXRhci1ib3hfZmxpcHBlZCcpO1xuICAgICQoJy5sb2dpbi1mb3JtX19pbnB1dFtuYW1lPWxvZ2luXScpLmZvY3VzKClcbiAgICAkKHRoaXMpLmZhZGVPdXQoKVxuICB9KTtcblxuICAvLyBmbGlwLWJhY2sgbG9naW4gYm94XG4gICQoJy5sb2dpbi1mb3JtX19sYmwnKS5rZXl1cChmdW5jdGlvbiAoZSkge1xuICAgIGlmICggZS5rZXlDb2RlID09IDMyIHx8IGUua2V5Q29kZSA9PSAxMyApIHtcbiAgICAgICQodGhpcykuY2xpY2soKTtcbiAgICB9XG4gIH0pO1xuXG4gICQoJ2JvZHksICNsb2dpbi1uYXZfX2hvbWUnKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgIGlmKCAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuZmxpcC1jb250YWluZXInKS5sZW5ndGggPT0gMCB8fCAkKGUudGFyZ2V0KS5hdHRyKCdpZCcpID09PSAnbG9naW4tbmF2X19ob21lJykge1xuICAgICAgLy8gJCgnLmZsaXBwZXInKS5yZW1vdmVDbGFzcygnZmxpcHBlZCcpO1xuICAgICAgJCgnLmxvZ2luLWJveCcpLnJlbW92ZUNsYXNzKCdsb2dpbi1ib3hfZmxpcHBlZCcpO1xuICAgICAgJCgnLmF2YXRhci1ib3hfd2VsY29tZScpLnJlbW92ZUNsYXNzKCdhdmF0YXItYm94X2ZsaXBwZWQnKTtcbiAgICAgICQoJyNoZWFkZXJfX2xvZ2luLWJ0bicpLmZhZGVJbigpXG4gICAgfVxuICB9KTtcblxuICAvLyBzbW9vdGggc2Nyb2xsXG4gICQoJyNhcnJvdy1kb3duLCAjYXJyb3ctdXAsIC5jaGFwdGVyc19fbGluaycpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgc2Nyb2xsVG9wOiAkKCAkLmF0dHIodGhpcywgJ2hyZWYnKSApLm9mZnNldCgpLnRvcFxuICAgIH0sIDEwMDApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgJCgnLmNoYXB0ZXJzX19saW5rJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxUb3A6ICQoICQuYXR0cih0aGlzLCAnaHJlZicpICkub2Zmc2V0KCkudG9wXG4gICAgfSwgMTAwMCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIC8vINCf0LXRgNC10YXQvtC0INC/0L4g0Y/QutC+0YDRjiDQvdCwINC00YDRg9Cz0L7QuSDRgdGC0YDQsNC90LjRhtC1XG4gIGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoICE9PSAnJyAmJiB3aW5kb3cubG9jYXRpb24uaGFzaCAhPT0gJyMnKSB7XG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgc2Nyb2xsVG9wOiAkKCB3aW5kb3cubG9jYXRpb24uaGFzaCApLm9mZnNldCgpLnRvcCArIDQwXG4gICAgfSwgMTAwMCk7XG4gIH1cblxuICAvLyBPdmVybGF5LW1lbnVcbiAgJCgnI29wZW4tb3ZlcmxheS1tZW51JykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgaWYoICR0aGlzLmRhdGEoJ2FjdGlvbicpID09ICdvcGVuJyApIHtcblxuICAgICAgLy8gb3BlbiBvdmVybGF5IG1lbnVcbiAgICAgICR0aGlzLmRhdGEoJ2FjdGlvbicsICdjbG9zZScpO1xuXG4gICAgICAkKCcuaGFtYnVyZ2VyJykuYWRkQ2xhc3MoJ2hhbWJ1cmdlcl9jbG9zZScpO1xuXG4gICAgICAkKCcub3ZlcmxheS1tZW51JykuY3NzKHtcbiAgICAgICAgZGlzcGxheTogXCJibG9ja1wiXG4gICAgICB9KTtcblxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5vdmVybGF5X19oYWxmJykuYWRkQ2xhc3MoJ292ZXJsYXlfX2hhbGZfc2hvd2VkJyk7XG4gICAgICAgICQoJy5vdmVybGF5LW1lbnUnKS5jc3Moe1xuICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgfSlcbiAgICAgIH0sIDEwKVxuXG4gICAgICAkKCcub3ZlcmxheV9faGFsZicpLm9uKCd0cmFuc2l0aW9uZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICQoJy5vdmVybGF5LW1lbnUnKS5hZGRDbGFzcygnb3ZlcmxheS1tZW51X3Nob3dlZCcpO1xuXG4gICAgICAgIHZhciB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiggJCgnLm92ZXJsYXktbWVudV9faXRlbScpLmVxKGkpLmxlbmd0aCApIHtcbiAgICAgICAgICAgICQoJy5vdmVybGF5LW1lbnVfX2l0ZW0nKS5lcShpKS5hZGRDbGFzcygnb3ZlcmxheS1tZW51X19pdGVtX3Nob3dlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9LCAyNTApO1xuICAgICAgfSlcblxuICAgICAgLy9ibG9jayBzY3JvbGwgbG9ja1xuICAgICAgJCgnYm9keScpLmNzcyh7IHBvc2l0aW9uOiAnZml4ZWQnIH0pXG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAvL2Nsb3NlIG92ZXJsYXkgbWVudVxuICAgICAgJHRoaXMuZGF0YSgnYWN0aW9uJywgJ29wZW4nKTtcblxuICAgICAgJCgnLmhhbWJ1cmdlcicpLnJlbW92ZUNsYXNzKCdoYW1idXJnZXJfY2xvc2UnKTtcblxuICAgICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgfSk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnLm92ZXJsYXlfX2hhbGYnKS5yZW1vdmVDbGFzcygnb3ZlcmxheV9faGFsZl9zaG93ZWQnKTtcbiAgICAgICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICAgICAgZGlzcGxheTogXCJub25lXCJcbiAgICAgICAgfSlcbiAgICAgIH0sIDUwMClcblxuICAgICAgJCgnLm92ZXJsYXktbWVudScpLnJlbW92ZUNsYXNzKCdvdmVybGF5LW1lbnVfc2hvd2VkJyk7XG4gICAgICAkKCcub3ZlcmxheS1tZW51X19pdGVtJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ292ZXJsYXktbWVudV9faXRlbV9zaG93ZWQnKVxuICAgICAgfSlcblxuICAgICAgLy9ibG9jayBzY3JvbGwgdW5sb2NrXG4gICAgICAkKCdib2R5JykuY3NzKHsgcG9zaXRpb246ICcnIH0pXG5cbiAgICB9XG4gIH0pO1xuXG5cbiAgLy8gZml4ZWQgYmxvZyBjaGFwdGVyc1xuICBpZigkKCcuYmxvZ19fY2hhcHRlcnMnKS5sZW5ndGggPiAwKSB7XG4gICAgdmFyIHNjcm9sbF9wb2ludCA9ICQoJy5ibG9nX19hcnRpY2xlcycpLm9mZnNldCgpLnRvcCAtIDcwO1xuICAgIHZhciBmaXhlZF9mbGFnID0gZmFsc2U7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgYm9keV9zY3JvbGxUb3AgPSAkKCdib2R5Jykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgIGlmKCBib2R5X3Njcm9sbFRvcCA+PSBzY3JvbGxfcG9pbnQpIHtcblxuICAgICAgICBpZighZml4ZWRfZmxhZykge1xuICAgICAgICAgIGZpeGVkX2ZsYWcgPSB0cnVlO1xuXG4gICAgICAgICAgJCgnLmJsb2dfX2NoYXB0ZXJzJykuYWRkQ2xhc3MoJ2Jsb2dfX2NoYXB0ZXJzX2ZpeGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuYmxvZ19fYXJ0aWNsZScpLmVhY2goZnVuY3Rpb24gKGksIGl0ZW0pIHtcbiAgICAgICAgICBpZiggYm9keV9zY3JvbGxUb3AgKyAxMjAgPj0gJChpdGVtKS5vZmZzZXQoKS50b3AgJiZcbiAgICAgICAgICAgICAgYm9keV9zY3JvbGxUb3AgKyAxMjAgPD0gJChpdGVtKS5vZmZzZXQoKS50b3AgKyAkKGl0ZW0pLmhlaWdodCgpICkge1xuXG4gICAgICAgICAgICB2YXIgYWN0aXZlSWQgPSAkKGl0ZW0pLmF0dHIoXCJpZFwiKTtcblxuICAgICAgICAgICAgJCgnLmNoYXB0ZXJzX19pdGVtJykucmVtb3ZlQ2xhc3MoJ2NoYXB0ZXJzX19pdGVtX2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmNoYXB0ZXJzX19saW5rW2hyZWY9XCIjJythY3RpdmVJZCsnXCJdJykucGFyZW50KCkuYWRkQ2xhc3MoJ2NoYXB0ZXJzX19pdGVtX2FjdGl2ZScpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXhlZF9mbGFnID0gZmFsc2U7XG5cbiAgICAgICAgaWYoJCh3aW5kb3cpLndpZHRoKCkgPiA0ODApIHtcbiAgICAgICAgICAkKCcuYmxvZ19fY2hhcHRlcnMnKS5yZW1vdmVDbGFzcygnYmxvZ19fY2hhcHRlcnNfZml4ZWQnKTtcbiAgICAgICAgICAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGJsb2dDaGFwdGVycyA9ICQoJy5ibG9nX19jaGFwdGVycycpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgYmxvZ0NoYXB0ZXJzLmRhdGEoJ3N3aXBlZCcsIGZhbHNlKTtcbiAgICAgIGJsb2dDaGFwdGVycy5yZW1vdmVDbGFzcygnYmxvZ19fY2hhcHRlcnNfc2hvd2VkJyk7XG4gICAgfSk7XG5cbiAgICAkKCcuYmxvZ19fY2hhcHRlcnMsIC5jaGFwdGVyc19fbGluaycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmKCAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcpID09IGZhbHNlICkge1xuICAgICAgICAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcsIHRydWUpO1xuICAgICAgICBibG9nQ2hhcHRlcnMuYWRkQ2xhc3MoJ2Jsb2dfX2NoYXB0ZXJzX3Nob3dlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCh0aGlzKS5kYXRhKCdzd2lwZWQnLCBmYWxzZSk7XG4gICAgICAgIGJsb2dDaGFwdGVycy5yZW1vdmVDbGFzcygnYmxvZ19fY2hhcHRlcnNfc2hvd2VkJyk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIFxuXG4gIC8vIHNlbmQgbWFpbCAmIHJlc2V0IGZvcm1cbiAgJCgnLmNvbnRhY3QtZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBzZW5kTWFpbCgkKHRoaXMpKTtcbiAgfSlcbiAgLm9uKCdyZXNldCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgJHRoaXMuZmluZCgnaW5wdXRbdHlwZT10ZXh0XSwgdGV4dGFyZWEnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2NvbnRhY3QtZm9ybV9faW5wdXRfc3VjY2VzcyBjb250YWN0LWZvcm1fX2lucHV0X2Vycm9yJyk7XG4gICAgfSk7XG5cbiAgICAkdGhpcy5maW5kKCcuY29udGFjdC1mb3JtX19pbnB1dC1ub3RlJykucmVtb3ZlKCk7XG4gIH0pO1xuXG5cbn0pKGpRdWVyeSk7XG5cblxuXG5cbiIsIlxuLyoqID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIC0tLS0tIEdvb2dsZSBtYXBzIC0tLS0tLS0tXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5mdW5jdGlvbiBpbml0TWFwKCkge1xuXG4gIGlmKCQoJyNtYXAtYm94JykubGVuZ3RoID09IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gQ3JlYXRlIGFuIGFycmF5IG9mIHN0eWxlcy5cbiAgdmFyIHN0eWxlcyA9IFt7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dC5maWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjNDQ0NDQ0XCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiI2YyZjJmMlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJwb2lcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wic2F0dXJhdGlvblwiOi0xMDB9LHtcImxpZ2h0bmVzc1wiOjQ1fV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmhpZ2h3YXlcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwic2ltcGxpZmllZFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmFydGVyaWFsXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLmljb25cIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInRyYW5zaXRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcIndhdGVyXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjZTdhNzMxXCJ9LHtcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX1dXG5cbiAgLy8gQ3JlYXRlIGEgbmV3IFN0eWxlZE1hcFR5cGUgb2JqZWN0LCBwYXNzaW5nIGl0IHRoZSBhcnJheSBvZiBzdHlsZXMsXG4gIC8vIGFzIHdlbGwgYXMgdGhlIG5hbWUgdG8gYmUgZGlzcGxheWVkIG9uIHRoZSBtYXAgdHlwZSBjb250cm9sLlxuICB2YXIgc3R5bGVkTWFwID0gbmV3IGdvb2dsZS5tYXBzLlN0eWxlZE1hcFR5cGUoc3R5bGVzLFxuICAgICAge25hbWU6IFwiU3R5bGVkIE1hcFwifSk7XG5cbiAgLy8gQ3JlYXRlIGEgbWFwIG9iamVjdCwgYW5kIGluY2x1ZGUgdGhlIE1hcFR5cGVJZCB0byBhZGRcbiAgLy8gdG8gdGhlIG1hcCB0eXBlIGNvbnRyb2wuXG4gIHZhciBtYXBPcHRpb25zID0ge1xuICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICB6b29tOiAxMSxcbiAgICBjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNDYuNTEsIDMwLjc0NzE5ODUpLFxuICAgIG1hcFR5cGVDb250cm9sT3B0aW9uczoge1xuICAgICAgbWFwVHlwZUlkczogW2dvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLCAnbWFwX3N0eWxlJ11cbiAgICB9XG4gIH07XG4gIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtYm94JyksXG4gICAgICBtYXBPcHRpb25zKTtcblxuICAvL0Fzc29jaWF0ZSB0aGUgc3R5bGVkIG1hcCB3aXRoIHRoZSBNYXBUeXBlSWQgYW5kIHNldCBpdCB0byBkaXNwbGF5LlxuICBtYXAubWFwVHlwZXMuc2V0KCdtYXBfc3R5bGUnLCBzdHlsZWRNYXApO1xuICBtYXAuc2V0TWFwVHlwZUlkKCdtYXBfc3R5bGUnKTtcblxuICB2YXIgaW1hZ2UgPSB7XG4gICAgdXJsOiBcIi4uL2ltZy9tYXBfbWFya2VyLnN2Z1wiLFxuICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDUwLCA3MS40NilcbiAgfTtcblxuICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgcG9zaXRpb246IHtsYXQ6IDQ2LjQzMjI5MzksIGxuZzogMzAuNzI3MTk4NX0sXG4gICAgaWNvbjogaW1hZ2VcbiAgfSk7XG5cbiAgLy8gVG8gYWRkIHRoZSBtYXJrZXIgdG8gdGhlIG1hcCwgY2FsbCBzZXRNYXAoKTtcbiAgbWFya2VyLnNldE1hcChtYXApO1xufVxuXG4iLCIvKiogPT09PT09PT09PT09PT09PT09PT09PT1cbiogLS0tLS0gbXkgUGFyYWxsYXggLS0tLS0tLS1cbiogPT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG47IGZ1bmN0aW9uIFBhcmFsbGF4ZXIoKSB7XG4gIHZhciBwYXJhbGF4ZWQgPSAkKCcucGFyYWxsYXhlZCcpO1xuICBcbiAgaWYocGFyYWxheGVkLmxlbmd0aCA+IDApIHtcblxuICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHdpbkhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKSxcbiAgICAgICAgICB3aW5Cb3R0b20gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyB3aW5IZWlnaHQ7XG5cbiAgICAgIHBhcmFsYXhlZC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoIHdpbkJvdHRvbSA+ICQodGhpcykub2Zmc2V0KCkudG9wIC0gJCh0aGlzKS5oZWlnaHQoKS8yICkge1xuICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAvLyBza2lsbHMgY29sb3JpZnlcbiAgICAgICAgICBpZigkdGhpcy5oYXNDbGFzcygnc2tpbGwnKSAmJiAkdGhpcy5oYXNDbGFzcygncGFyYWxsYXhlZF9tb3ZlZCcpICkge1xuXG4gICAgICAgICAgICAgIHZhciBzdmcgPSAkdGhpcy5maW5kKCcuc2tpbGwtZGlhZ3JhbV9fc3ZnJyk7XG4gICAgICAgICAgICBzdmcuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBsdmwgPSAkKHRoaXMpLmRhdGEoJ2x2bCcpO1xuICAgICAgICAgICAgICB2YXIgYXJjTGVuZ3RoID0gMjgyLjYgLSBsdmwvMTAwICogMjgyLjY7XG5cbiAgICAgICAgICAgICAgJCh0aGlzKS5jaGlsZHJlbignLnNraWxsLWRpYWdyYW1fX3JpbmcnKS5jc3Moe1xuICAgICAgICAgICAgICAgIFwic3Ryb2tlLWRhc2hvZmZzZXRcIjogYXJjTGVuZ3RoLFxuICAgICAgICAgICAgICAgIFwic3Ryb2tlLW9wYWNpdHlcIjogbHZsLzEwMFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoJ3BhcmFsbGF4ZWRfbW92ZWQnKTtcblxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn0iLCJcbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PVxuICogLS0tLS0gUHJlbG9hZGVyIC0tLS0tLS0tXG4gKiA9PT09PT09PT09PT09PT09PT09PT09ICovXG47IGZ1bmN0aW9uIFByZWxvYWRlcigpIHtcblxuICB2YXJcbiAgICAgIHdyYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlbG9hZGVyJyksXG4gICAgICBjb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZWxvYWRlci1jb3VudGVyJyksXG4gICAgICB0aWNrID0gMCxcbiAgICAgIHRpbWVyLFxuICAgICAgaXNUaW1lclJ1biA9IGZhbHNlLFxuICAgICAgb25lUGljID0gMCxcbiAgICAgIGxvYWRlZEFtb3VudCA9IDAsXG4gICAgICBpbWdzID0gW107XG5cbiAgJCgnLndyYXBwZXIgKiwgLmZvb3RlciAqJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgc3JjID0gJHRoaXMuYXR0cignc3JjJyksXG4gICAgICAgIGJnID0gJCh0aGlzKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKTtcblxuICAgIGlmKHNyYyAhPT0gdW5kZWZpbmVkICYmICFzcmMubWF0Y2goJy5qcyQnKSAmJiAhc3JjLm1hdGNoKCdeaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tJykpIHtcbiAgICAgIGltZ3MucHVzaChzcmMpXG4gICAgfSBlbHNlIGlmKGJnICE9PSAnbm9uZScgJiYgIWJnLm1hdGNoKCdebGluZWFyJykgKSB7XG4gICAgICBiZyA9IGJnLnJlcGxhY2UoJ3VybChcIicsJycpLnJlcGxhY2UoJ1wiKScsJycpO1xuICAgICAgaW1ncy5wdXNoKGJnKVxuICAgIH1cbiAgfSk7XG4vLyBjb25zb2xlLmxvZyhpbWdzKTtcblxuICBvbmVQaWMgPSBNYXRoLmNlaWwoIDEgLyBpbWdzLmxlbmd0aCAqIDEwMCApO1xuICB0aWNrID0gb25lUGljO1xuXG4gIGltZ3MuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgIHZhciBpbWcgPSAkKCc8aW1nPicsIHtcbiAgICAgIGF0dHI6IHtcbiAgICAgICAgc3JjOiBpdGVtXG4gICAgICB9XG4gICAgfSk7XG4gICAgaW1nLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuLy8gY29uc29sZS5sb2coaW1nK2krJyAtIGxvYWRlZCEnKTtcbiAgICAgIGxvYWRlZEFtb3VudCArPSBvbmVQaWM7XG4gICAgICBpZighaXNUaW1lclJ1bikge1xuICAgICAgICBpc1RpbWVyUnVuID0gdHJ1ZTtcbiAgICAgICAgZ29UaW1lcigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGdvVGltZXIoKSB7XG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIHRpY2sgKz0gTWF0aC5jZWlsKGxvYWRlZEFtb3VudC8odGljaykpO1xuLy8vLyBERUxFVEUhISEhISEhISEhISEhIVxuICAgICAgdGljayA9IDEwMFxuICAgICAgaWYodGljayA+PSAxMDApIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgIGlzVGltZXJSdW4gPSBmYWxzZTtcbiAgICAgICAgdGljayA9IDEwMDtcbiAgICAgICAgd3JhcC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgd3JhcC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgJCgnLmZsaXAtY29udGFpbmVyJykuYWRkQ2xhc3MoJ2ZsaXAtY29udGFpbmVyX2FuaW1hdGVkJyk7XG4gICAgICAgIH0sIDUwMClcbiAgICAgIH0gZWxzZSBpZih0aWNrID49IGxvYWRlZEFtb3VudCAmJiB0aWNrIDwgMTAwKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICBpc1RpbWVyUnVuID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvdW50ZXIuaW5uZXJIVE1MID0gdGlja1xuICAgIH0sIDEwMCk7XG4gIH1cblxufSIsIi8qKiA9PT09PT09PT09PT09PT09PT09PT09PVxuKiAtLS0tLSBTZW5kIG1haWwgLS0tLS0tLS1cbiogPT09PT09PT09PT09PT09PT09PT09PSAqL1xuOyBmdW5jdGlvbiBzZW5kTWFpbCggZm9ybSApIHtcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm1bMF0pO1xuXG4gIGlmKCB2YWxpZGF0ZSgpICkge1xuICAgICQuYWpheCh7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICB1cmw6IFwic2VuZG1haWwucGhwXCIsXG4gICAgICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgICAuZG9uZShmdW5jdGlvbiggbXNnICkge1xuICAgICAgICAgIC8vIG1zZyA9IEpTT04ucGFyc2UobXNnKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyggbXNnICk7XG4gICAgICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKCfQndC10LrQvtGA0YDQtdC60YLQvdGL0LUg0LTQsNC90L3Ri9C1IScpO1xuICB9XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGUoKSB7XG5cbiAgICB2YXIgaXNWYWxpZCA9IHRydWUsXG4gICAgICAgIHJlZ2V4cCA9IHtcbiAgICAgICAgICAnbmFtZSc6IC9bYS160LAt0Y9dezIsfS9pLFxuICAgICAgICAgICdlbWFpbCc6IC9eWy1hLXowLTl+ISQlXiYqXz0rfXtcXCc/XSsoXFwuWy1hLXowLTl+ISQlXiYqXz0rfXtcXCc/XSspKkAoW2EtejAtOV9dWy1hLXowLTlfXSooXFwuWy1hLXowLTlfXSspKlxcLihhZXJvfGFycGF8Yml6fGNvbXxjb29wfGVkdXxnb3Z8aW5mb3xpbnR8bWlsfG11c2V1bXxuYW1lfG5ldHxvcmd8cHJvfHRyYXZlbHxtb2JpfFthLXpdW2Etel0pfChbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9KSkoOlswLTldezEsNX0pPyQvaSxcbiAgICAgICAgICAndGV4dCc6IC9bYS16QS1a0LAt0Y/QkC3QrzAtOV17NSx9L2lcbiAgICAgICAgfSxcbiAgICAgICAgbm90ZSA9IHtcbiAgICAgICAgICAnbmFtZSc6IFwi0JLQsNGI0LUg0LjQvNGPINC00L7Qu9C20L3QviDRgdC+0YHRgtC+0Y/RgtGMINC80LjQvdC40LzRg9C8INC40LcgMiDQsdGD0LrQsiFcIixcbiAgICAgICAgICAnZW1haWwnOiBcItCS0LDRiCBFbWFpbCDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0L3QsNGB0YLQvtGP0YnQuNC8INCw0LTRgNC10YHQvtC8INGN0LsuINC/0L7Rh9GC0YshXCIsXG4gICAgICAgICAgJ3RleHQnOiBcItCS0LDRiNC1INGB0L7QvtCx0YnQtdC90LjQtSDQtNC+0LvQttC90L4g0YHQvtGB0YLQvtGP0YLRjCDQvNC40L3QuNC80YPQvCDQuNC3IDUg0LHRg9C60LIhXCIsXG4gICAgICAgICAgJ2VtcHR5JzogXCLQl9Cw0L/QvtC70L3QuNGC0LUg0L/QvtC20LDQu9GD0LnRgdGC0LAg0Y3RgtC+INC/0L7Qu9C1IVwiXG4gICAgICAgIH07XG5cblxuICAgIGZvcm0uZmluZCgnaW5wdXRbdHlwZT10ZXh0XSwgdGV4dGFyZWEnKS5lYWNoKGZ1bmN0aW9uICgpIHtcblxuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICB2YWx1ZSA9ICR0aGlzLnZhbCgpLFxuICAgICAgICAgIHJlZ2V4cFR5cGUgPSAkdGhpcy5kYXRhKCdyZWdleHB0eXBlJyk7XG5cbiAgICAgICR0aGlzLm5leHQoJy5jb250YWN0LWZvcm1fX2lucHV0LW5vdGUnKS5yZW1vdmUoKTtcblxuICAgICAgaWYoJHRoaXMudmFsKCkgPT0gJycpIHtcbiAgICAgICAgYWRkTm90ZSgkdGhpcywgbm90ZS5lbXB0eSk7XG4gICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKCdjb250YWN0LWZvcm1fX2lucHV0X3N1Y2Nlc3MnKTtcbiAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2NvbnRhY3QtZm9ybV9faW5wdXRfZXJyb3InKTtcbiAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoIXZhbHVlLm1hdGNoKHJlZ2V4cFtyZWdleHBUeXBlXSkpIHtcbiAgICAgICAgICBhZGROb3RlKCR0aGlzLCBub3RlW3JlZ2V4cFR5cGVdKTtcbiAgICAgICAgICAkdGhpcy5yZW1vdmVDbGFzcygnY29udGFjdC1mb3JtX19pbnB1dF9zdWNjZXNzJyk7XG4gICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2NvbnRhY3QtZm9ybV9faW5wdXRfZXJyb3InKTtcbiAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoJ2NvbnRhY3QtZm9ybV9faW5wdXRfZXJyb3InKTtcbiAgICAgICAgICAkdGhpcy5hZGRDbGFzcygnY29udGFjdC1mb3JtX19pbnB1dF9zdWNjZXNzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaXNWYWxpZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZE5vdGUoJHRoaXMsIG1zZykge1xuXG4gICAgdmFyIG5vdGVUb3AgPSAkdGhpcy5vZmZzZXQoKS50b3AgKyAkdGhpcy5vdXRlckhlaWdodCgpIC0gJHRoaXMucGFyZW50KCdmb3JtJykub2Zmc2V0KCkudG9wLFxuICAgICAgICBub3RlTGVmdCA9ICR0aGlzLm9mZnNldCgpLmxlZnQgLSAkdGhpcy5wYXJlbnQoJ2Zvcm0nKS5vZmZzZXQoKS5sZWZ0O1xuXG4gICAgJCgnPGRpdiBjbGFzcz1cImNvbnRhY3QtZm9ybV9faW5wdXQtbm90ZVwiIHN0eWxlPVwibGVmdDogJysgbm90ZUxlZnQgKydweDsgdG9wOiAnKyBub3RlVG9wICsncHg7XCI+JysgbXNnICsnPC9kaXY+JykuaW5zZXJ0QWZ0ZXIoJHRoaXMpO1xuICB9XG5cblxufSIsIlxuLyoqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogLS0tLS0tLS0tLS0tLSBQcm9qZWN0IFNsaWRlciAgLS0tLS0tLS0tLS0tXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbjsgZnVuY3Rpb24gUHJvamVjdFNsaWRlciggcGFyYW1zICkge1xuXG4gICB2YXIgZGVmYXVsdHMgPSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3QsNGC0YHRgNC+0LnQutC4INGB0LvQsNC50LTQtdGA0LBcbiAgICAgIGZpcnN0U2xpZGVOdW06IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQv9C+0YDRj9C00LrQvtCy0YvQuSDQvdC+0LzQtdGAINC/0LXRgNCy0L7Qs9C+INGB0LvQsNC50LTQsFxuICAgICAgc2xpZGVySXRlbXM6ICcuc2xpZGVyLXByZXZpZXdfX2l0ZW0nLCAgICAgICAgICAgICAgIC8vINC40LzRjyDQutC70LDRgdGB0LAg0YHQu9Cw0LnQtNC+0LJcbiAgICAgIHNsaWRlckl0ZW1BY3RpdmU6ICdzbGlkZXItcHJldmlld19faXRlbV9hY3RpdmUnLCAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINCw0LrRgtC40LLQvdC+0LPQviDRgdC70LDQudC00LBcbiAgICAgIHNsaWRlckJ1dHRvbkRvd246ICcuc2xpZGVyX19idXR0b25fZG93bicsICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINC60L3QvtC/0LrQuCDQktCd0JjQl1xuICAgICAgc2xpZGVyQnV0dG9uVXA6ICcuc2xpZGVyX19idXR0b25fdXAnLCAgICAgICAgICAgICAgIC8vINC40LzRjyDQutC70LDRgdGB0LAg0LrQvdC+0L/QutC4INCS0JLQldCg0KVcbiAgICAgIHNsaWRlckJ1dHRvbkltZ3M6ICcuc2xpZGVyLWJ1dHRvbl9faXRlbScsICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINCw0LrRgtC40LLQvdC+0LPQviDRjdC70LXQvNC10L3RgtCwINGB0L/QuNGB0LrQsCDQutCw0YDRgtC40L3QvtC6INCa0J3QntCf0JrQmFxuICAgICAgc2xpZGVyQnV0dG9uSW1nQWN0aXZlOiAnc2xpZGVyLWJ1dHRvbl9faXRlbV9hY3RpdmUnIC8vINC40LzRjyDQutC70LDRgdGB0LAg0LDQutGC0LjQstC90L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0YHQv9C40YHQutCwINC60LDRgNGC0LjQvdC+0Log0JrQndCe0J/QmtCYXG4gICAgfTtcblxuICAgIHZhciBjdXJyZW50TnVtID0gZGVmYXVsdHMuZmlyc3RTbGlkZU51bSxcbiAgICAgICAgc2xpZGVySXRlbXMgPSBkZWZhdWx0cy5zbGlkZXJJdGVtcyxcbiAgICAgICAgc2xpZGVySXRlbUFjdGl2ZSA9IGRlZmF1bHRzLnNsaWRlckl0ZW1BY3RpdmUsXG4gICAgICAgIHNsaWRlckJ1dHRvbkRvd24gPSBkZWZhdWx0cy5zbGlkZXJCdXR0b25Eb3duLFxuICAgICAgICBzbGlkZXJCdXR0b25VcCA9IGRlZmF1bHRzLnNsaWRlckJ1dHRvblVwLFxuICAgICAgICBzbGlkZXJCdXR0b25JbWdzID0gZGVmYXVsdHMuc2xpZGVyQnV0dG9uSW1ncyxcbiAgICAgICAgc2xpZGVyQnV0dG9uSW1nQWN0aXZlID0gZGVmYXVsdHMuc2xpZGVyQnV0dG9uSW1nQWN0aXZlLFxuXG4gICAgICAgIHByZXZpZXdzID0gJChzbGlkZXJJdGVtcyksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3QsNCx0L7RgCDRgdC70LDQudC00L7QslxuICAgICAgICBpbWFnZXNDb3VudCA9IHByZXZpZXdzLmxlbmd0aCwgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC60L7Quy3QstC+INGB0LvQsNC50LTQvtCyXG4gICAgICAgIGxhc3RJdGVtID0gaW1hZ2VzQ291bnQgLSAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3QvtC80LXRgCDQv9C+0YHQu9C10LTQvdC10LPQviDRgdC70LDQudC00LBcbiAgICAgICAgZG93bkN1cnIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQv9GA0LXQtNGL0LTRg9GJ0LjQuSDQvdC+0LzQtdGAINC90LAg0LrQvdC+0L/QutC1IERPV04g0LIg0LzQvtC80LXQvdGCINC/0LXRgNC60LvRjtGH0LXQvdC40Y8g0YHQu9Cw0LnQtNCwXG4gICAgICAgIHVwQ3VyciwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0YHQu9C10LTRg9GO0YnQuNC5INC90L7QvNC10YAg0L3QsCDQutC90L7Qv9C60LUgVVAg0LIg0LzQvtC80LXQvdGCINC/0LXRgNC60LvRjtGH0LXQvdC40Y8g0YHQu9Cw0LnQtNCwXG4gICAgICAgIGl0ZW1zRG93biA9ICQoc2xpZGVyQnV0dG9uRG93bikuZmluZChzbGlkZXJCdXR0b25JbWdzKSwgLy8g0LrRgNCw0YLQuNC90LrQuCDQutC90L7Qv9C60Lgg0JLQndCY0JdcbiAgICAgICAgaXRlbXNVcCA9ICQoc2xpZGVyQnV0dG9uVXApLmZpbmQoc2xpZGVyQnV0dG9uSW1ncyksICAgICAvLyDQutGA0LDRgtC40L3QutC4INC60L3QvtC/0LrQuCDQktCS0JXQoNClXG4gICAgICAgIHNsaWRlckRlc2MgPSBbXTtcblxuXG4gICAgJC5hamF4KCdqc29uL3dvcmtzLmpzb24nKS5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBzZXR1cChkYXRhKVxuICAgIH0pO1xuXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tINCd0LDQttCw0YLQuNC1INC90LAg0LrQvdC+0L/QutGDINC/0YDQvtC60YDRg9GC0LrQuCDRgdC70LDQudC00L7QsiAtLS0tLS0tLS0tLS0tLVxuXG4gICAgJCgnLnNsaWRlcl9fYnV0dG9uJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgLy8g0J7RgtC+0LHRgNCw0LbQtdC90LjQtSDRgdC70LXQtC/Qv9GA0LXQtCDRgdC70LDQudC00LAg0LIg0LfQsNCy0LjRgdC40LzQvtGC0Lgg0L7RgiDQvdCw0LbQsNGC0L7QuSDQutC90L7Qv9C60LhcbiAgICAgIGlmICggJCh0aGlzKS5oYXNDbGFzcygnc2xpZGVyX19idXR0b25fdXAnKSApIHtcbiAgICAgICAgcHJldmlld3MuZXEoY3VycmVudE51bSkucmVtb3ZlQ2xhc3Moc2xpZGVySXRlbUFjdGl2ZSk7XG4gICAgICAgIHByZXZpZXdzLmVxKHVwQ3VycikuYWRkQ2xhc3Moc2xpZGVySXRlbUFjdGl2ZSk7XG4gICAgICAgIGN1cnJlbnROdW0gPSB1cEN1cnI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2aWV3cy5lcShjdXJyZW50TnVtKS5yZW1vdmVDbGFzcyhzbGlkZXJJdGVtQWN0aXZlKTtcbiAgICAgICAgcHJldmlld3MuZXEoZG93bkN1cnIpLmFkZENsYXNzKHNsaWRlckl0ZW1BY3RpdmUpO1xuICAgICAgICBjdXJyZW50TnVtID0gZG93bkN1cnI7XG4gICAgICB9XG5cblxuICAgICAgdmFyIGN1cnJlbnREb3duID0gaXRlbXNEb3duLmVxKGRvd25DdXJyKSxcbiAgICAgICAgICBjdXJyZW50VXAgPSBpdGVtc1VwLmVxKHVwQ3Vycik7XG5cbiAgICAgIC8vINCQ0L3QuNC80LDRhtC40Y8g0LrQsNGC0YDQuNC90L7QuiDQvdCwINC60L3QvtC/0LrQsNGFIC0g0L/QvtC00YrQtdC8INCy0LLQtdGA0YVcbiAgICAgIGN1cnJlbnREb3duLmNzcyh7XG4gICAgICAgIHRvcDogcGFyc2VJbnQoJCh0aGlzKS5jc3MoJ3RvcCcpKSArICQodGhpcykuaGVpZ2h0KClcbiAgICAgIH0pLnJlbW92ZUNsYXNzKHNsaWRlckJ1dHRvbkltZ0FjdGl2ZSk7XG5cbiAgICAgIGN1cnJlbnRVcC5jc3Moe1xuICAgICAgICB0b3A6IHBhcnNlSW50KCQodGhpcykuY3NzKCd0b3AnKSkgLSAkKHRoaXMpLmhlaWdodCgpXG4gICAgICB9KS5yZW1vdmVDbGFzcyhzbGlkZXJCdXR0b25JbWdBY3RpdmUpO1xuXG4gICAgICAvLyDQn9C+0YHQu9C1INC+0LrQvtC90YfQsNC90LjRjyDQsNC90LjQvNCw0YbQuNC4INGB0LHRgNC+0YFcbiAgICAgIGN1cnJlbnRVcC5vbigndHJhbnNpdGlvbmVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5jc3Moe1xuICAgICAgICAgIHRvcDogJydcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuXG4gICAgICBjdXJyZW50RG93bi5vbigndHJhbnNpdGlvbmVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5jc3Moe1xuICAgICAgICAgIHRvcDogJydcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuXG4gICAgICBydW4oKTtcblxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gc2V0dXAoZGF0YSkge1xuICAgICAgc2xpZGVyRGVzYyA9IGRhdGE7XG5cbiAgICAgICAgJCgnLnNsaWRlci1wcmV2aWV3X19waG90bycpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3NyYycsICdpbWcvcHJvamVjdHMvJyArIHNsaWRlckRlc2NbaV0uaW1hZ2UpXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5zbGlkZXJfX2J1dHRvbicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCh0aGlzKS5maW5kKCcuc2xpZGVyLWJ1dHRvbl9faW1nJykuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdzcmMnLCAnaW1nL3Byb2plY3RzLycgKyBzbGlkZXJEZXNjW2ldLmltYWdlKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBwcmV2aWV3cy5lcShjdXJyZW50TnVtKS5hZGRDbGFzcyhzbGlkZXJJdGVtQWN0aXZlKTsgLy8g0LDQutGC0LjQstCw0YbQuNGPINC/0LXRgNCy0L7Qs9C+INGB0LvQsNC50LTQsCDQsiDQvtC60L3QtSDQv9GA0L7RgdC80L7RgtGA0LBcblxuICAgICAgICBydW4oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW4oKSB7XG4gICAgICAvLyDQntC/0YDQtdC00LXQu9GP0LXQvCDQvdC+0LLRi9C1INC60LDRgNGC0LjQvdC60Lgg0LTQu9GPINC60L3QvtC/0L7QulxuICAgICAgaWYgKGN1cnJlbnROdW0gPT0gMCkge1xuICAgICAgICBkb3duQ3VyciA9IGxhc3RJdGVtO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50TnVtIC0gMSA9PSAwKSB7XG4gICAgICAgIGRvd25DdXJyID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvd25DdXJyID0gY3VycmVudE51bSAtIDE7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50TnVtID09IGxhc3RJdGVtKSB7XG4gICAgICAgIHVwQ3VyciA9IDA7XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnROdW0gKyAxID09IGxhc3RJdGVtKSB7XG4gICAgICAgIHVwQ3VyciA9IGxhc3RJdGVtO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXBDdXJyID0gY3VycmVudE51bSArIDE7XG4gICAgICB9XG5cbiAgICAgICQoJy5zbGlkZXItZGVzY3JpcHRpb24gLnRpdGxlLWNvbnRlbnQnKS50ZXh0KHNsaWRlckRlc2NbY3VycmVudE51bV0udGl0bGUpXG4gICAgICAkKCcuc2xpZGVyLWRlc2NyaXB0aW9uIC5jdXJyZW50LXNraWxscycpLnRleHQoc2xpZGVyRGVzY1tjdXJyZW50TnVtXS5za2lsbHMuam9pbihcIiwgXCIpKVxuICAgICAgJCgnLnNsaWRlci1kZXNjcmlwdGlvbiAuc2xpZGVyLWRlc2NyaXB0aW9uX19idG4nKS5hdHRyKCdocmVmJywgc2xpZGVyRGVzY1tjdXJyZW50TnVtXS51cmwpXG5cbiAgICAgIC8vINCe0YLQvtCx0YDQsNC20LDQtdC8INC90L7QstGL0LUg0LrQsNGA0YLQuNC90LrQuCDQutC90L7Qv9C+0LpcbiAgICAgIGl0ZW1zRG93bi5lcShkb3duQ3VycikuYWRkQ2xhc3Moc2xpZGVyQnV0dG9uSW1nQWN0aXZlKTtcbiAgICAgIGl0ZW1zVXAuZXEodXBDdXJyKS5hZGRDbGFzcyhzbGlkZXJCdXR0b25JbWdBY3RpdmUpO1xuICAgIH1cbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
