'use strict';

(function($) {
  
  // Запуск слайдера
  ProjectSlider();
  
  // Запуск прелоадера
  Preloader();

  // adaptive height of header
  if($('.header').length > 0) {
    var min_height = 650;
    var new_height = $(window).height();

    if ($(window).height() > min_height) {
      new_height = $(window).height()
    } else {
      new_height = min_height;
    }

    $('.header').css({
      height: new_height
    });
  }

  // flip login box
  $('#header__login-btn').on('click', function (e) {
    e.stopPropagation();
    // $('.flipper').addClass('flipped');
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

  // skills colorify
  if($('.skill').length > 0) {
    $.each($('.skill-diagram__svg'), function (i, item) {
      var lvl = $(item).data('lvl');
      var arcLength = lvl/100 * 282.6;

      $(this).children('.skill-diagram__ring').css({
        "stroke-dasharray": arcLength + " 282.6",
        "stroke-opacity": lvl/100
      })
      
    })
  }


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
    center: new google.maps.LatLng(46.44, 30.7471985),
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
        }, 500)
      } else if(tick >= loadedAmount && tick < 100) {
        clearInterval(timer);
        isTimerRun = false;
      }

      counter.innerHTML = tick
    }, 100);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJtb2R1bGVzL2dvb2dsZS1tYXBzLmpzIiwibW9kdWxlcy9wcmVsb2FkZXIuanMiLCJtb2R1bGVzL3NsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbigkKSB7XG4gIFxuICAvLyDQl9Cw0L/Rg9GB0Log0YHQu9Cw0LnQtNC10YDQsFxuICBQcm9qZWN0U2xpZGVyKCk7XG4gIFxuICAvLyDQl9Cw0L/Rg9GB0Log0L/RgNC10LvQvtCw0LTQtdGA0LBcbiAgUHJlbG9hZGVyKCk7XG5cbiAgLy8gYWRhcHRpdmUgaGVpZ2h0IG9mIGhlYWRlclxuICBpZigkKCcuaGVhZGVyJykubGVuZ3RoID4gMCkge1xuICAgIHZhciBtaW5faGVpZ2h0ID0gNjUwO1xuICAgIHZhciBuZXdfaGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuXG4gICAgaWYgKCQod2luZG93KS5oZWlnaHQoKSA+IG1pbl9oZWlnaHQpIHtcbiAgICAgIG5ld19oZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KClcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3X2hlaWdodCA9IG1pbl9oZWlnaHQ7XG4gICAgfVxuXG4gICAgJCgnLmhlYWRlcicpLmNzcyh7XG4gICAgICBoZWlnaHQ6IG5ld19oZWlnaHRcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGZsaXAgbG9naW4gYm94XG4gICQoJyNoZWFkZXJfX2xvZ2luLWJ0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAvLyAkKCcuZmxpcHBlcicpLmFkZENsYXNzKCdmbGlwcGVkJyk7XG4gICAgJCgnLmxvZ2luLWJveCcpLmFkZENsYXNzKCdsb2dpbi1ib3hfZmxpcHBlZCcpO1xuICAgICQoJy5hdmF0YXItYm94X3dlbGNvbWUnKS5hZGRDbGFzcygnYXZhdGFyLWJveF9mbGlwcGVkJyk7XG4gICAgJCgnLmxvZ2luLWZvcm1fX2lucHV0W25hbWU9bG9naW5dJykuZm9jdXMoKVxuICAgICQodGhpcykuZmFkZU91dCgpXG4gIH0pO1xuXG4gIC8vIGZsaXAtYmFjayBsb2dpbiBib3hcbiAgJCgnLmxvZ2luLWZvcm1fX2xibCcpLmtleXVwKGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKCBlLmtleUNvZGUgPT0gMzIgfHwgZS5rZXlDb2RlID09IDEzICkge1xuICAgICAgJCh0aGlzKS5jbGljaygpO1xuICAgIH1cbiAgfSk7XG5cbiAgJCgnYm9keSwgI2xvZ2luLW5hdl9faG9tZScpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgaWYoICQoZS50YXJnZXQpLnBhcmVudHMoJy5mbGlwLWNvbnRhaW5lcicpLmxlbmd0aCA9PSAwIHx8ICQoZS50YXJnZXQpLmF0dHIoJ2lkJykgPT09ICdsb2dpbi1uYXZfX2hvbWUnKSB7XG4gICAgICAvLyAkKCcuZmxpcHBlcicpLnJlbW92ZUNsYXNzKCdmbGlwcGVkJyk7XG4gICAgICAkKCcubG9naW4tYm94JykucmVtb3ZlQ2xhc3MoJ2xvZ2luLWJveF9mbGlwcGVkJyk7XG4gICAgICAkKCcuYXZhdGFyLWJveF93ZWxjb21lJykucmVtb3ZlQ2xhc3MoJ2F2YXRhci1ib3hfZmxpcHBlZCcpO1xuICAgICAgJCgnI2hlYWRlcl9fbG9naW4tYnRuJykuZmFkZUluKClcbiAgICB9XG4gIH0pO1xuXG4gIC8vIHNtb290aCBzY3JvbGxcbiAgJCgnI2Fycm93LWRvd24sICNhcnJvdy11cCwgLmNoYXB0ZXJzX19saW5rJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxUb3A6ICQoICQuYXR0cih0aGlzLCAnaHJlZicpICkub2Zmc2V0KCkudG9wXG4gICAgfSwgMTAwMCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICAkKCcuY2hhcHRlcnNfX2xpbmsnKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogJCggJC5hdHRyKHRoaXMsICdocmVmJykgKS5vZmZzZXQoKS50b3BcbiAgICB9LCAxMDAwKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgLy8g0J/QtdGA0LXRhdC+0LQg0L/QviDRj9C60L7RgNGOINC90LAg0LTRgNGD0LPQvtC5INGB0YLRgNCw0L3QuNGG0LVcbiAgaWYod2luZG93LmxvY2F0aW9uLmhhc2ggIT09ICcnICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoICE9PSAnIycpIHtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxUb3A6ICQoIHdpbmRvdy5sb2NhdGlvbi5oYXNoICkub2Zmc2V0KCkudG9wICsgNDBcbiAgICB9LCAxMDAwKTtcbiAgfVxuXG4gIC8vIE92ZXJsYXktbWVudVxuICAkKCcjb3Blbi1vdmVybGF5LW1lbnUnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICBpZiggJHRoaXMuZGF0YSgnYWN0aW9uJykgPT0gJ29wZW4nICkge1xuXG4gICAgICAvLyBvcGVuIG92ZXJsYXkgbWVudVxuICAgICAgJHRoaXMuZGF0YSgnYWN0aW9uJywgJ2Nsb3NlJyk7XG5cbiAgICAgICQoJy5oYW1idXJnZXInKS5hZGRDbGFzcygnaGFtYnVyZ2VyX2Nsb3NlJyk7XG5cbiAgICAgICQoJy5vdmVybGF5LW1lbnUnKS5jc3Moe1xuICAgICAgICBkaXNwbGF5OiBcImJsb2NrXCJcbiAgICAgIH0pO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnLm92ZXJsYXlfX2hhbGYnKS5hZGRDbGFzcygnb3ZlcmxheV9faGFsZl9zaG93ZWQnKTtcbiAgICAgICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICB9KVxuICAgICAgfSwgMTApXG5cbiAgICAgICQoJy5vdmVybGF5X19oYWxmJykub24oJ3RyYW5zaXRpb25lbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgJCgnLm92ZXJsYXktbWVudScpLmFkZENsYXNzKCdvdmVybGF5LW1lbnVfc2hvd2VkJyk7XG5cbiAgICAgICAgdmFyIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmKCAkKCcub3ZlcmxheS1tZW51X19pdGVtJykuZXEoaSkubGVuZ3RoICkge1xuICAgICAgICAgICAgJCgnLm92ZXJsYXktbWVudV9faXRlbScpLmVxKGkpLmFkZENsYXNzKCdvdmVybGF5LW1lbnVfX2l0ZW1fc2hvd2VkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpKys7XG4gICAgICAgIH0sIDI1MCk7XG4gICAgICB9KVxuXG4gICAgfSBlbHNlIHtcblxuICAgICAgLy9jbG9zZSBvdmVybGF5IG1lbnVcbiAgICAgICR0aGlzLmRhdGEoJ2FjdGlvbicsICdvcGVuJyk7XG5cbiAgICAgICQoJy5oYW1idXJnZXInKS5yZW1vdmVDbGFzcygnaGFtYnVyZ2VyX2Nsb3NlJyk7XG5cbiAgICAgICQoJy5vdmVybGF5LW1lbnUnKS5jc3Moe1xuICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgIH0pO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5vdmVybGF5X19oYWxmJykucmVtb3ZlQ2xhc3MoJ292ZXJsYXlfX2hhbGZfc2hvd2VkJyk7XG4gICAgICAgICQoJy5vdmVybGF5LW1lbnUnKS5jc3Moe1xuICAgICAgICAgIGRpc3BsYXk6IFwibm9uZVwiXG4gICAgICAgIH0pXG4gICAgICB9LCA1MDApXG5cbiAgICAgICQoJy5vdmVybGF5LW1lbnUnKS5yZW1vdmVDbGFzcygnb3ZlcmxheS1tZW51X3Nob3dlZCcpO1xuICAgICAgJCgnLm92ZXJsYXktbWVudV9faXRlbScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvdmVybGF5LW1lbnVfX2l0ZW1fc2hvd2VkJylcbiAgICAgIH0pXG4gICAgICBcbiAgICB9XG4gIH0pO1xuXG5cbiAgLy8gZml4ZWQgYmxvZyBjaGFwdGVyc1xuICBpZigkKCcuYmxvZ19fY2hhcHRlcnMnKS5sZW5ndGggPiAwKSB7XG4gICAgdmFyIHNjcm9sbF9wb2ludCA9ICQoJy5ibG9nX19hcnRpY2xlcycpLm9mZnNldCgpLnRvcCAtIDcwO1xuICAgIHZhciBmaXhlZF9mbGFnID0gZmFsc2U7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgYm9keV9zY3JvbGxUb3AgPSAkKCdib2R5Jykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgIGlmKCBib2R5X3Njcm9sbFRvcCA+PSBzY3JvbGxfcG9pbnQpIHtcblxuICAgICAgICBpZighZml4ZWRfZmxhZykge1xuICAgICAgICAgIGZpeGVkX2ZsYWcgPSB0cnVlO1xuXG4gICAgICAgICAgJCgnLmJsb2dfX2NoYXB0ZXJzJykuYWRkQ2xhc3MoJ2Jsb2dfX2NoYXB0ZXJzX2ZpeGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuYmxvZ19fYXJ0aWNsZScpLmVhY2goZnVuY3Rpb24gKGksIGl0ZW0pIHtcbiAgICAgICAgICBpZiggYm9keV9zY3JvbGxUb3AgKyAxMjAgPj0gJChpdGVtKS5vZmZzZXQoKS50b3AgJiZcbiAgICAgICAgICAgICAgYm9keV9zY3JvbGxUb3AgKyAxMjAgPD0gJChpdGVtKS5vZmZzZXQoKS50b3AgKyAkKGl0ZW0pLmhlaWdodCgpICkge1xuXG4gICAgICAgICAgICB2YXIgYWN0aXZlSWQgPSAkKGl0ZW0pLmF0dHIoXCJpZFwiKTtcblxuICAgICAgICAgICAgJCgnLmNoYXB0ZXJzX19pdGVtJykucmVtb3ZlQ2xhc3MoJ2NoYXB0ZXJzX19pdGVtX2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmNoYXB0ZXJzX19saW5rW2hyZWY9XCIjJythY3RpdmVJZCsnXCJdJykucGFyZW50KCkuYWRkQ2xhc3MoJ2NoYXB0ZXJzX19pdGVtX2FjdGl2ZScpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXhlZF9mbGFnID0gZmFsc2U7XG5cbiAgICAgICAgaWYoJCh3aW5kb3cpLndpZHRoKCkgPiA0ODApIHtcbiAgICAgICAgICAkKCcuYmxvZ19fY2hhcHRlcnMnKS5yZW1vdmVDbGFzcygnYmxvZ19fY2hhcHRlcnNfZml4ZWQnKTtcbiAgICAgICAgICAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGJsb2dDaGFwdGVycyA9ICQoJy5ibG9nX19jaGFwdGVycycpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgYmxvZ0NoYXB0ZXJzLmRhdGEoJ3N3aXBlZCcsIGZhbHNlKTtcbiAgICAgIGJsb2dDaGFwdGVycy5yZW1vdmVDbGFzcygnYmxvZ19fY2hhcHRlcnNfc2hvd2VkJyk7XG4gICAgfSk7XG5cbiAgICAkKCcuYmxvZ19fY2hhcHRlcnMsIC5jaGFwdGVyc19fbGluaycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmKCAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcpID09IGZhbHNlICkge1xuICAgICAgICAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcsIHRydWUpO1xuICAgICAgICBibG9nQ2hhcHRlcnMuYWRkQ2xhc3MoJ2Jsb2dfX2NoYXB0ZXJzX3Nob3dlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCh0aGlzKS5kYXRhKCdzd2lwZWQnLCBmYWxzZSk7XG4gICAgICAgIGJsb2dDaGFwdGVycy5yZW1vdmVDbGFzcygnYmxvZ19fY2hhcHRlcnNfc2hvd2VkJyk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vIHNraWxscyBjb2xvcmlmeVxuICBpZigkKCcuc2tpbGwnKS5sZW5ndGggPiAwKSB7XG4gICAgJC5lYWNoKCQoJy5za2lsbC1kaWFncmFtX19zdmcnKSwgZnVuY3Rpb24gKGksIGl0ZW0pIHtcbiAgICAgIHZhciBsdmwgPSAkKGl0ZW0pLmRhdGEoJ2x2bCcpO1xuICAgICAgdmFyIGFyY0xlbmd0aCA9IGx2bC8xMDAgKiAyODIuNjtcblxuICAgICAgJCh0aGlzKS5jaGlsZHJlbignLnNraWxsLWRpYWdyYW1fX3JpbmcnKS5jc3Moe1xuICAgICAgICBcInN0cm9rZS1kYXNoYXJyYXlcIjogYXJjTGVuZ3RoICsgXCIgMjgyLjZcIixcbiAgICAgICAgXCJzdHJva2Utb3BhY2l0eVwiOiBsdmwvMTAwXG4gICAgICB9KVxuICAgICAgXG4gICAgfSlcbiAgfVxuXG5cbn0pKGpRdWVyeSk7XG5cblxuXG5cbiIsIlxuLyoqID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIC0tLS0tIEdvb2dsZSBtYXBzIC0tLS0tLS0tXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5mdW5jdGlvbiBpbml0TWFwKCkge1xuXG4gIGlmKCQoJyNtYXAtYm94JykubGVuZ3RoID09IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gQ3JlYXRlIGFuIGFycmF5IG9mIHN0eWxlcy5cbiAgdmFyIHN0eWxlcyA9IFt7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dC5maWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjNDQ0NDQ0XCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiI2YyZjJmMlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJwb2lcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wic2F0dXJhdGlvblwiOi0xMDB9LHtcImxpZ2h0bmVzc1wiOjQ1fV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmhpZ2h3YXlcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwic2ltcGxpZmllZFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmFydGVyaWFsXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLmljb25cIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInRyYW5zaXRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcIndhdGVyXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjZTdhNzMxXCJ9LHtcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX1dXG5cbiAgLy8gQ3JlYXRlIGEgbmV3IFN0eWxlZE1hcFR5cGUgb2JqZWN0LCBwYXNzaW5nIGl0IHRoZSBhcnJheSBvZiBzdHlsZXMsXG4gIC8vIGFzIHdlbGwgYXMgdGhlIG5hbWUgdG8gYmUgZGlzcGxheWVkIG9uIHRoZSBtYXAgdHlwZSBjb250cm9sLlxuICB2YXIgc3R5bGVkTWFwID0gbmV3IGdvb2dsZS5tYXBzLlN0eWxlZE1hcFR5cGUoc3R5bGVzLFxuICAgICAge25hbWU6IFwiU3R5bGVkIE1hcFwifSk7XG5cbiAgLy8gQ3JlYXRlIGEgbWFwIG9iamVjdCwgYW5kIGluY2x1ZGUgdGhlIE1hcFR5cGVJZCB0byBhZGRcbiAgLy8gdG8gdGhlIG1hcCB0eXBlIGNvbnRyb2wuXG4gIHZhciBtYXBPcHRpb25zID0ge1xuICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICB6b29tOiAxMSxcbiAgICBjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNDYuNDQsIDMwLjc0NzE5ODUpLFxuICAgIG1hcFR5cGVDb250cm9sT3B0aW9uczoge1xuICAgICAgbWFwVHlwZUlkczogW2dvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLCAnbWFwX3N0eWxlJ11cbiAgICB9XG4gIH07XG4gIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtYm94JyksXG4gICAgICBtYXBPcHRpb25zKTtcblxuICAvL0Fzc29jaWF0ZSB0aGUgc3R5bGVkIG1hcCB3aXRoIHRoZSBNYXBUeXBlSWQgYW5kIHNldCBpdCB0byBkaXNwbGF5LlxuICBtYXAubWFwVHlwZXMuc2V0KCdtYXBfc3R5bGUnLCBzdHlsZWRNYXApO1xuICBtYXAuc2V0TWFwVHlwZUlkKCdtYXBfc3R5bGUnKTtcblxuICB2YXIgaW1hZ2UgPSB7XG4gICAgdXJsOiBcIi4uL2ltZy9tYXBfbWFya2VyLnN2Z1wiLFxuICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDUwLCA3MS40NilcbiAgfTtcblxuICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgcG9zaXRpb246IHtsYXQ6IDQ2LjQzMjI5MzksIGxuZzogMzAuNzI3MTk4NX0sXG4gICAgaWNvbjogaW1hZ2VcbiAgfSk7XG5cbiAgLy8gVG8gYWRkIHRoZSBtYXJrZXIgdG8gdGhlIG1hcCwgY2FsbCBzZXRNYXAoKTtcbiAgbWFya2VyLnNldE1hcChtYXApO1xufVxuXG4iLCJcbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PVxuICogLS0tLS0gUHJlbG9hZGVyIC0tLS0tLS0tXG4gKiA9PT09PT09PT09PT09PT09PT09PT09ICovXG47IGZ1bmN0aW9uIFByZWxvYWRlcigpIHtcblxuICB2YXJcbiAgICAgIHdyYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlbG9hZGVyJyksXG4gICAgICBjb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZWxvYWRlci1jb3VudGVyJyksXG4gICAgICB0aWNrID0gMCxcbiAgICAgIHRpbWVyLFxuICAgICAgaXNUaW1lclJ1biA9IGZhbHNlLFxuICAgICAgb25lUGljID0gMCxcbiAgICAgIGxvYWRlZEFtb3VudCA9IDAsXG4gICAgICBpbWdzID0gW107XG5cbiAgJCgnLndyYXBwZXIgKiwgLmZvb3RlciAqJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgc3JjID0gJHRoaXMuYXR0cignc3JjJyksXG4gICAgICAgIGJnID0gJCh0aGlzKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKTtcblxuICAgIGlmKHNyYyAhPT0gdW5kZWZpbmVkICYmICFzcmMubWF0Y2goJy5qcyQnKSAmJiAhc3JjLm1hdGNoKCdeaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tJykpIHtcbiAgICAgIGltZ3MucHVzaChzcmMpXG4gICAgfSBlbHNlIGlmKGJnICE9PSAnbm9uZScgJiYgIWJnLm1hdGNoKCdebGluZWFyJykgKSB7XG4gICAgICBiZyA9IGJnLnJlcGxhY2UoJ3VybChcIicsJycpLnJlcGxhY2UoJ1wiKScsJycpO1xuICAgICAgaW1ncy5wdXNoKGJnKVxuICAgIH1cbiAgfSk7XG4vLyBjb25zb2xlLmxvZyhpbWdzKTtcblxuICBvbmVQaWMgPSBNYXRoLmNlaWwoIDEgLyBpbWdzLmxlbmd0aCAqIDEwMCApO1xuICB0aWNrID0gb25lUGljO1xuXG4gIGltZ3MuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgIHZhciBpbWcgPSAkKCc8aW1nPicsIHtcbiAgICAgIGF0dHI6IHtcbiAgICAgICAgc3JjOiBpdGVtXG4gICAgICB9XG4gICAgfSk7XG4gICAgaW1nLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuLy8gY29uc29sZS5sb2coaW1nK2krJyAtIGxvYWRlZCEnKTtcbiAgICAgIGxvYWRlZEFtb3VudCArPSBvbmVQaWM7XG4gICAgICBpZighaXNUaW1lclJ1bikge1xuICAgICAgICBpc1RpbWVyUnVuID0gdHJ1ZTtcbiAgICAgICAgZ29UaW1lcigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGdvVGltZXIoKSB7XG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIHRpY2sgKz0gTWF0aC5jZWlsKGxvYWRlZEFtb3VudC8odGljaykpO1xuLy8vLyBERUxFVEUhISEhISEhISEhISEhIVxuICAgICAgdGljayA9IDEwMFxuICAgICAgaWYodGljayA+PSAxMDApIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgIGlzVGltZXJSdW4gPSBmYWxzZTtcbiAgICAgICAgdGljayA9IDEwMDtcbiAgICAgICAgd3JhcC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgd3JhcC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH0sIDUwMClcbiAgICAgIH0gZWxzZSBpZih0aWNrID49IGxvYWRlZEFtb3VudCAmJiB0aWNrIDwgMTAwKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICBpc1RpbWVyUnVuID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvdW50ZXIuaW5uZXJIVE1MID0gdGlja1xuICAgIH0sIDEwMCk7XG4gIH1cblxufSIsIlxuLyoqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogLS0tLS0tLS0tLS0tLSBQcm9qZWN0IFNsaWRlciAgLS0tLS0tLS0tLS0tXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbjsgZnVuY3Rpb24gUHJvamVjdFNsaWRlciggcGFyYW1zICkge1xuXG4gICB2YXIgZGVmYXVsdHMgPSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3QsNGC0YHRgNC+0LnQutC4INGB0LvQsNC50LTQtdGA0LBcbiAgICAgIGZpcnN0U2xpZGVOdW06IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQv9C+0YDRj9C00LrQvtCy0YvQuSDQvdC+0LzQtdGAINC/0LXRgNCy0L7Qs9C+INGB0LvQsNC50LTQsFxuICAgICAgc2xpZGVySXRlbXM6ICcuc2xpZGVyLXByZXZpZXdfX2l0ZW0nLCAgICAgICAgICAgICAgIC8vINC40LzRjyDQutC70LDRgdGB0LAg0YHQu9Cw0LnQtNC+0LJcbiAgICAgIHNsaWRlckl0ZW1BY3RpdmU6ICdzbGlkZXItcHJldmlld19faXRlbV9hY3RpdmUnLCAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINCw0LrRgtC40LLQvdC+0LPQviDRgdC70LDQudC00LBcbiAgICAgIHNsaWRlckJ1dHRvbkRvd246ICcuc2xpZGVyX19idXR0b25fZG93bicsICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINC60L3QvtC/0LrQuCDQktCd0JjQl1xuICAgICAgc2xpZGVyQnV0dG9uVXA6ICcuc2xpZGVyX19idXR0b25fdXAnLCAgICAgICAgICAgICAgIC8vINC40LzRjyDQutC70LDRgdGB0LAg0LrQvdC+0L/QutC4INCS0JLQldCg0KVcbiAgICAgIHNsaWRlckJ1dHRvbkltZ3M6ICcuc2xpZGVyLWJ1dHRvbl9faXRlbScsICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINCw0LrRgtC40LLQvdC+0LPQviDRjdC70LXQvNC10L3RgtCwINGB0L/QuNGB0LrQsCDQutCw0YDRgtC40L3QvtC6INCa0J3QntCf0JrQmFxuICAgICAgc2xpZGVyQnV0dG9uSW1nQWN0aXZlOiAnc2xpZGVyLWJ1dHRvbl9faXRlbV9hY3RpdmUnIC8vINC40LzRjyDQutC70LDRgdGB0LAg0LDQutGC0LjQstC90L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0YHQv9C40YHQutCwINC60LDRgNGC0LjQvdC+0Log0JrQndCe0J/QmtCYXG4gICAgfTtcblxuICAgIHZhciBjdXJyZW50TnVtID0gZGVmYXVsdHMuZmlyc3RTbGlkZU51bSxcbiAgICAgICAgc2xpZGVySXRlbXMgPSBkZWZhdWx0cy5zbGlkZXJJdGVtcyxcbiAgICAgICAgc2xpZGVySXRlbUFjdGl2ZSA9IGRlZmF1bHRzLnNsaWRlckl0ZW1BY3RpdmUsXG4gICAgICAgIHNsaWRlckJ1dHRvbkRvd24gPSBkZWZhdWx0cy5zbGlkZXJCdXR0b25Eb3duLFxuICAgICAgICBzbGlkZXJCdXR0b25VcCA9IGRlZmF1bHRzLnNsaWRlckJ1dHRvblVwLFxuICAgICAgICBzbGlkZXJCdXR0b25JbWdzID0gZGVmYXVsdHMuc2xpZGVyQnV0dG9uSW1ncyxcbiAgICAgICAgc2xpZGVyQnV0dG9uSW1nQWN0aXZlID0gZGVmYXVsdHMuc2xpZGVyQnV0dG9uSW1nQWN0aXZlLFxuXG4gICAgICAgIHByZXZpZXdzID0gJChzbGlkZXJJdGVtcyksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3QsNCx0L7RgCDRgdC70LDQudC00L7QslxuICAgICAgICBpbWFnZXNDb3VudCA9IHByZXZpZXdzLmxlbmd0aCwgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC60L7Quy3QstC+INGB0LvQsNC50LTQvtCyXG4gICAgICAgIGxhc3RJdGVtID0gaW1hZ2VzQ291bnQgLSAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3QvtC80LXRgCDQv9C+0YHQu9C10LTQvdC10LPQviDRgdC70LDQudC00LBcbiAgICAgICAgZG93bkN1cnIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQv9GA0LXQtNGL0LTRg9GJ0LjQuSDQvdC+0LzQtdGAINC90LAg0LrQvdC+0L/QutC1IERPV04g0LIg0LzQvtC80LXQvdGCINC/0LXRgNC60LvRjtGH0LXQvdC40Y8g0YHQu9Cw0LnQtNCwXG4gICAgICAgIHVwQ3VyciwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0YHQu9C10LTRg9GO0YnQuNC5INC90L7QvNC10YAg0L3QsCDQutC90L7Qv9C60LUgVVAg0LIg0LzQvtC80LXQvdGCINC/0LXRgNC60LvRjtGH0LXQvdC40Y8g0YHQu9Cw0LnQtNCwXG4gICAgICAgIGl0ZW1zRG93biA9ICQoc2xpZGVyQnV0dG9uRG93bikuZmluZChzbGlkZXJCdXR0b25JbWdzKSwgLy8g0LrRgNCw0YLQuNC90LrQuCDQutC90L7Qv9C60Lgg0JLQndCY0JdcbiAgICAgICAgaXRlbXNVcCA9ICQoc2xpZGVyQnV0dG9uVXApLmZpbmQoc2xpZGVyQnV0dG9uSW1ncyksICAgICAvLyDQutGA0LDRgtC40L3QutC4INC60L3QvtC/0LrQuCDQktCS0JXQoNClXG4gICAgICAgIHNsaWRlckRlc2MgPSBbXTtcblxuXG4gICAgJC5hamF4KCdqc29uL3dvcmtzLmpzb24nKS5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBzZXR1cChkYXRhKVxuICAgIH0pO1xuXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tINCd0LDQttCw0YLQuNC1INC90LAg0LrQvdC+0L/QutGDINC/0YDQvtC60YDRg9GC0LrQuCDRgdC70LDQudC00L7QsiAtLS0tLS0tLS0tLS0tLVxuXG4gICAgJCgnLnNsaWRlcl9fYnV0dG9uJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgLy8g0J7RgtC+0LHRgNCw0LbQtdC90LjQtSDRgdC70LXQtC/Qv9GA0LXQtCDRgdC70LDQudC00LAg0LIg0LfQsNCy0LjRgdC40LzQvtGC0Lgg0L7RgiDQvdCw0LbQsNGC0L7QuSDQutC90L7Qv9C60LhcbiAgICAgIGlmICggJCh0aGlzKS5oYXNDbGFzcygnc2xpZGVyX19idXR0b25fdXAnKSApIHtcbiAgICAgICAgcHJldmlld3MuZXEoY3VycmVudE51bSkucmVtb3ZlQ2xhc3Moc2xpZGVySXRlbUFjdGl2ZSk7XG4gICAgICAgIHByZXZpZXdzLmVxKHVwQ3VycikuYWRkQ2xhc3Moc2xpZGVySXRlbUFjdGl2ZSk7XG4gICAgICAgIGN1cnJlbnROdW0gPSB1cEN1cnI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2aWV3cy5lcShjdXJyZW50TnVtKS5yZW1vdmVDbGFzcyhzbGlkZXJJdGVtQWN0aXZlKTtcbiAgICAgICAgcHJldmlld3MuZXEoZG93bkN1cnIpLmFkZENsYXNzKHNsaWRlckl0ZW1BY3RpdmUpO1xuICAgICAgICBjdXJyZW50TnVtID0gZG93bkN1cnI7XG4gICAgICB9XG5cblxuICAgICAgdmFyIGN1cnJlbnREb3duID0gaXRlbXNEb3duLmVxKGRvd25DdXJyKSxcbiAgICAgICAgICBjdXJyZW50VXAgPSBpdGVtc1VwLmVxKHVwQ3Vycik7XG5cbiAgICAgIC8vINCQ0L3QuNC80LDRhtC40Y8g0LrQsNGC0YDQuNC90L7QuiDQvdCwINC60L3QvtC/0LrQsNGFIC0g0L/QvtC00YrQtdC8INCy0LLQtdGA0YVcbiAgICAgIGN1cnJlbnREb3duLmNzcyh7XG4gICAgICAgIHRvcDogcGFyc2VJbnQoJCh0aGlzKS5jc3MoJ3RvcCcpKSArICQodGhpcykuaGVpZ2h0KClcbiAgICAgIH0pLnJlbW92ZUNsYXNzKHNsaWRlckJ1dHRvbkltZ0FjdGl2ZSk7XG5cbiAgICAgIGN1cnJlbnRVcC5jc3Moe1xuICAgICAgICB0b3A6IHBhcnNlSW50KCQodGhpcykuY3NzKCd0b3AnKSkgLSAkKHRoaXMpLmhlaWdodCgpXG4gICAgICB9KS5yZW1vdmVDbGFzcyhzbGlkZXJCdXR0b25JbWdBY3RpdmUpO1xuXG4gICAgICAvLyDQn9C+0YHQu9C1INC+0LrQvtC90YfQsNC90LjRjyDQsNC90LjQvNCw0YbQuNC4INGB0LHRgNC+0YFcbiAgICAgIGN1cnJlbnRVcC5vbigndHJhbnNpdGlvbmVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5jc3Moe1xuICAgICAgICAgIHRvcDogJydcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuXG4gICAgICBjdXJyZW50RG93bi5vbigndHJhbnNpdGlvbmVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5jc3Moe1xuICAgICAgICAgIHRvcDogJydcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuXG4gICAgICBydW4oKTtcblxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gc2V0dXAoZGF0YSkge1xuICAgICAgc2xpZGVyRGVzYyA9IGRhdGE7XG5cbiAgICAgICAgJCgnLnNsaWRlci1wcmV2aWV3X19waG90bycpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3NyYycsICdpbWcvcHJvamVjdHMvJyArIHNsaWRlckRlc2NbaV0uaW1hZ2UpXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5zbGlkZXJfX2J1dHRvbicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCh0aGlzKS5maW5kKCcuc2xpZGVyLWJ1dHRvbl9faW1nJykuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdzcmMnLCAnaW1nL3Byb2plY3RzLycgKyBzbGlkZXJEZXNjW2ldLmltYWdlKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBwcmV2aWV3cy5lcShjdXJyZW50TnVtKS5hZGRDbGFzcyhzbGlkZXJJdGVtQWN0aXZlKTsgLy8g0LDQutGC0LjQstCw0YbQuNGPINC/0LXRgNCy0L7Qs9C+INGB0LvQsNC50LTQsCDQsiDQvtC60L3QtSDQv9GA0L7RgdC80L7RgtGA0LBcblxuICAgICAgICBydW4oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW4oKSB7XG4gICAgICAvLyDQntC/0YDQtdC00LXQu9GP0LXQvCDQvdC+0LLRi9C1INC60LDRgNGC0LjQvdC60Lgg0LTQu9GPINC60L3QvtC/0L7QulxuICAgICAgaWYgKGN1cnJlbnROdW0gPT0gMCkge1xuICAgICAgICBkb3duQ3VyciA9IGxhc3RJdGVtO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50TnVtIC0gMSA9PSAwKSB7XG4gICAgICAgIGRvd25DdXJyID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvd25DdXJyID0gY3VycmVudE51bSAtIDE7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50TnVtID09IGxhc3RJdGVtKSB7XG4gICAgICAgIHVwQ3VyciA9IDA7XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnROdW0gKyAxID09IGxhc3RJdGVtKSB7XG4gICAgICAgIHVwQ3VyciA9IGxhc3RJdGVtO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXBDdXJyID0gY3VycmVudE51bSArIDE7XG4gICAgICB9XG5cbiAgICAgICQoJy5zbGlkZXItZGVzY3JpcHRpb24gLnRpdGxlLWNvbnRlbnQnKS50ZXh0KHNsaWRlckRlc2NbY3VycmVudE51bV0udGl0bGUpXG4gICAgICAkKCcuc2xpZGVyLWRlc2NyaXB0aW9uIC5jdXJyZW50LXNraWxscycpLnRleHQoc2xpZGVyRGVzY1tjdXJyZW50TnVtXS5za2lsbHMuam9pbihcIiwgXCIpKVxuICAgICAgJCgnLnNsaWRlci1kZXNjcmlwdGlvbiAuc2xpZGVyLWRlc2NyaXB0aW9uX19idG4nKS5hdHRyKCdocmVmJywgc2xpZGVyRGVzY1tjdXJyZW50TnVtXS51cmwpXG5cbiAgICAgIC8vINCe0YLQvtCx0YDQsNC20LDQtdC8INC90L7QstGL0LUg0LrQsNGA0YLQuNC90LrQuCDQutC90L7Qv9C+0LpcbiAgICAgIGl0ZW1zRG93bi5lcShkb3duQ3VycikuYWRkQ2xhc3Moc2xpZGVyQnV0dG9uSW1nQWN0aXZlKTtcbiAgICAgIGl0ZW1zVXAuZXEodXBDdXJyKS5hZGRDbGFzcyhzbGlkZXJCdXR0b25JbWdBY3RpdmUpO1xuICAgIH1cbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
