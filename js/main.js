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

  // send mail
  $('.contact-form').on('submit', function (e) {
    e.preventDefault();
    sendMail($(this));
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
/** =======================
* ----- Send mail --------
* ====================== */
; function sendMail( form ) {
  var formData = new FormData(form[0]);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJtb2R1bGVzL2dvb2dsZS1tYXBzLmpzIiwibW9kdWxlcy9wcmVsb2FkZXIuanMiLCJtb2R1bGVzL3NlbmRtYWlsLmpzIiwibW9kdWxlcy9zbGlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKCQpIHtcbiAgXG4gIC8vINCX0LDQv9GD0YHQuiDRgdC70LDQudC00LXRgNCwXG4gIFByb2plY3RTbGlkZXIoKTtcbiAgXG4gIC8vINCX0LDQv9GD0YHQuiDQv9GA0LXQu9C+0LDQtNC10YDQsFxuICBQcmVsb2FkZXIoKTtcblxuICAvLyBhZGFwdGl2ZSBoZWlnaHQgb2YgaGVhZGVyXG4gIGlmKCQoJy5oZWFkZXInKS5sZW5ndGggPiAwKSB7XG4gICAgdmFyIG1pbl9oZWlnaHQgPSA2NTA7XG4gICAgdmFyIG5ld19oZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG5cbiAgICBpZiAoJCh3aW5kb3cpLmhlaWdodCgpID4gbWluX2hlaWdodCkge1xuICAgICAgbmV3X2hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdfaGVpZ2h0ID0gbWluX2hlaWdodDtcbiAgICB9XG5cbiAgICAkKCcuaGVhZGVyJykuY3NzKHtcbiAgICAgIGhlaWdodDogbmV3X2hlaWdodFxuICAgIH0pO1xuICB9XG5cbiAgLy8gZmxpcCBsb2dpbiBib3hcbiAgJCgnI2hlYWRlcl9fbG9naW4tYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIC8vICQoJy5mbGlwcGVyJykuYWRkQ2xhc3MoJ2ZsaXBwZWQnKTtcbiAgICAkKCcubG9naW4tYm94JykuYWRkQ2xhc3MoJ2xvZ2luLWJveF9mbGlwcGVkJyk7XG4gICAgJCgnLmF2YXRhci1ib3hfd2VsY29tZScpLmFkZENsYXNzKCdhdmF0YXItYm94X2ZsaXBwZWQnKTtcbiAgICAkKCcubG9naW4tZm9ybV9faW5wdXRbbmFtZT1sb2dpbl0nKS5mb2N1cygpXG4gICAgJCh0aGlzKS5mYWRlT3V0KClcbiAgfSk7XG5cbiAgLy8gZmxpcC1iYWNrIGxvZ2luIGJveFxuICAkKCcubG9naW4tZm9ybV9fbGJsJykua2V5dXAoZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoIGUua2V5Q29kZSA9PSAzMiB8fCBlLmtleUNvZGUgPT0gMTMgKSB7XG4gICAgICAkKHRoaXMpLmNsaWNrKCk7XG4gICAgfVxuICB9KTtcblxuICAkKCdib2R5LCAjbG9naW4tbmF2X19ob21lJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICBpZiggJChlLnRhcmdldCkucGFyZW50cygnLmZsaXAtY29udGFpbmVyJykubGVuZ3RoID09IDAgfHwgJChlLnRhcmdldCkuYXR0cignaWQnKSA9PT0gJ2xvZ2luLW5hdl9faG9tZScpIHtcbiAgICAgIC8vICQoJy5mbGlwcGVyJykucmVtb3ZlQ2xhc3MoJ2ZsaXBwZWQnKTtcbiAgICAgICQoJy5sb2dpbi1ib3gnKS5yZW1vdmVDbGFzcygnbG9naW4tYm94X2ZsaXBwZWQnKTtcbiAgICAgICQoJy5hdmF0YXItYm94X3dlbGNvbWUnKS5yZW1vdmVDbGFzcygnYXZhdGFyLWJveF9mbGlwcGVkJyk7XG4gICAgICAkKCcjaGVhZGVyX19sb2dpbi1idG4nKS5mYWRlSW4oKVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gc21vb3RoIHNjcm9sbFxuICAkKCcjYXJyb3ctZG93biwgI2Fycm93LXVwLCAuY2hhcHRlcnNfX2xpbmsnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogJCggJC5hdHRyKHRoaXMsICdocmVmJykgKS5vZmZzZXQoKS50b3BcbiAgICB9LCAxMDAwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gICQoJy5jaGFwdGVyc19fbGluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgc2Nyb2xsVG9wOiAkKCAkLmF0dHIodGhpcywgJ2hyZWYnKSApLm9mZnNldCgpLnRvcFxuICAgIH0sIDEwMDApO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICAvLyDQn9C10YDQtdGF0L7QtCDQv9C+INGP0LrQvtGA0Y4g0L3QsCDQtNGA0YPQs9C+0Lkg0YHRgtGA0LDQvdC40YbQtVxuICBpZih3aW5kb3cubG9jYXRpb24uaGFzaCAhPT0gJycgJiYgd2luZG93LmxvY2F0aW9uLmhhc2ggIT09ICcjJykge1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogJCggd2luZG93LmxvY2F0aW9uLmhhc2ggKS5vZmZzZXQoKS50b3AgKyA0MFxuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgLy8gT3ZlcmxheS1tZW51XG4gICQoJyNvcGVuLW92ZXJsYXktbWVudScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgIGlmKCAkdGhpcy5kYXRhKCdhY3Rpb24nKSA9PSAnb3BlbicgKSB7XG5cbiAgICAgIC8vIG9wZW4gb3ZlcmxheSBtZW51XG4gICAgICAkdGhpcy5kYXRhKCdhY3Rpb24nLCAnY2xvc2UnKTtcblxuICAgICAgJCgnLmhhbWJ1cmdlcicpLmFkZENsYXNzKCdoYW1idXJnZXJfY2xvc2UnKTtcblxuICAgICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICAgIGRpc3BsYXk6IFwiYmxvY2tcIlxuICAgICAgfSk7XG5cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCcub3ZlcmxheV9faGFsZicpLmFkZENsYXNzKCdvdmVybGF5X19oYWxmX3Nob3dlZCcpO1xuICAgICAgICAkKCcub3ZlcmxheS1tZW51JykuY3NzKHtcbiAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgIH0pXG4gICAgICB9LCAxMClcblxuICAgICAgJCgnLm92ZXJsYXlfX2hhbGYnKS5vbigndHJhbnNpdGlvbmVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAkKCcub3ZlcmxheS1tZW51JykuYWRkQ2xhc3MoJ292ZXJsYXktbWVudV9zaG93ZWQnKTtcblxuICAgICAgICB2YXIgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYoICQoJy5vdmVybGF5LW1lbnVfX2l0ZW0nKS5lcShpKS5sZW5ndGggKSB7XG4gICAgICAgICAgICAkKCcub3ZlcmxheS1tZW51X19pdGVtJykuZXEoaSkuYWRkQ2xhc3MoJ292ZXJsYXktbWVudV9faXRlbV9zaG93ZWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGkrKztcbiAgICAgICAgfSwgMjUwKTtcbiAgICAgIH0pXG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAvL2Nsb3NlIG92ZXJsYXkgbWVudVxuICAgICAgJHRoaXMuZGF0YSgnYWN0aW9uJywgJ29wZW4nKTtcblxuICAgICAgJCgnLmhhbWJ1cmdlcicpLnJlbW92ZUNsYXNzKCdoYW1idXJnZXJfY2xvc2UnKTtcblxuICAgICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgfSk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnLm92ZXJsYXlfX2hhbGYnKS5yZW1vdmVDbGFzcygnb3ZlcmxheV9faGFsZl9zaG93ZWQnKTtcbiAgICAgICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICAgICAgZGlzcGxheTogXCJub25lXCJcbiAgICAgICAgfSlcbiAgICAgIH0sIDUwMClcblxuICAgICAgJCgnLm92ZXJsYXktbWVudScpLnJlbW92ZUNsYXNzKCdvdmVybGF5LW1lbnVfc2hvd2VkJyk7XG4gICAgICAkKCcub3ZlcmxheS1tZW51X19pdGVtJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ292ZXJsYXktbWVudV9faXRlbV9zaG93ZWQnKVxuICAgICAgfSlcbiAgICAgIFxuICAgIH1cbiAgfSk7XG5cblxuICAvLyBmaXhlZCBibG9nIGNoYXB0ZXJzXG4gIGlmKCQoJy5ibG9nX19jaGFwdGVycycpLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgc2Nyb2xsX3BvaW50ID0gJCgnLmJsb2dfX2FydGljbGVzJykub2Zmc2V0KCkudG9wIC0gNzA7XG4gICAgdmFyIGZpeGVkX2ZsYWcgPSBmYWxzZTtcblxuICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciBib2R5X3Njcm9sbFRvcCA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcblxuICAgICAgaWYoIGJvZHlfc2Nyb2xsVG9wID49IHNjcm9sbF9wb2ludCkge1xuXG4gICAgICAgIGlmKCFmaXhlZF9mbGFnKSB7XG4gICAgICAgICAgZml4ZWRfZmxhZyA9IHRydWU7XG5cbiAgICAgICAgICAkKCcuYmxvZ19fY2hhcHRlcnMnKS5hZGRDbGFzcygnYmxvZ19fY2hhcHRlcnNfZml4ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5ibG9nX19hcnRpY2xlJykuZWFjaChmdW5jdGlvbiAoaSwgaXRlbSkge1xuICAgICAgICAgIGlmKCBib2R5X3Njcm9sbFRvcCArIDEyMCA+PSAkKGl0ZW0pLm9mZnNldCgpLnRvcCAmJlxuICAgICAgICAgICAgICBib2R5X3Njcm9sbFRvcCArIDEyMCA8PSAkKGl0ZW0pLm9mZnNldCgpLnRvcCArICQoaXRlbSkuaGVpZ2h0KCkgKSB7XG5cbiAgICAgICAgICAgIHZhciBhY3RpdmVJZCA9ICQoaXRlbSkuYXR0cihcImlkXCIpO1xuXG4gICAgICAgICAgICAkKCcuY2hhcHRlcnNfX2l0ZW0nKS5yZW1vdmVDbGFzcygnY2hhcHRlcnNfX2l0ZW1fYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuY2hhcHRlcnNfX2xpbmtbaHJlZj1cIiMnK2FjdGl2ZUlkKydcIl0nKS5wYXJlbnQoKS5hZGRDbGFzcygnY2hhcHRlcnNfX2l0ZW1fYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpeGVkX2ZsYWcgPSBmYWxzZTtcblxuICAgICAgICBpZigkKHdpbmRvdykud2lkdGgoKSA+IDQ4MCkge1xuICAgICAgICAgICQoJy5ibG9nX19jaGFwdGVycycpLnJlbW92ZUNsYXNzKCdibG9nX19jaGFwdGVyc19maXhlZCcpO1xuICAgICAgICAgICQodGhpcykuZGF0YSgnc3dpcGVkJywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYmxvZ0NoYXB0ZXJzID0gJCgnLmJsb2dfX2NoYXB0ZXJzJyk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBibG9nQ2hhcHRlcnMuZGF0YSgnc3dpcGVkJywgZmFsc2UpO1xuICAgICAgYmxvZ0NoYXB0ZXJzLnJlbW92ZUNsYXNzKCdibG9nX19jaGFwdGVyc19zaG93ZWQnKTtcbiAgICB9KTtcblxuICAgICQoJy5ibG9nX19jaGFwdGVycywgLmNoYXB0ZXJzX19saW5rJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgaWYoICQodGhpcykuZGF0YSgnc3dpcGVkJykgPT0gZmFsc2UgKSB7XG4gICAgICAgICQodGhpcykuZGF0YSgnc3dpcGVkJywgdHJ1ZSk7XG4gICAgICAgIGJsb2dDaGFwdGVycy5hZGRDbGFzcygnYmxvZ19fY2hhcHRlcnNfc2hvd2VkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcsIGZhbHNlKTtcbiAgICAgICAgYmxvZ0NoYXB0ZXJzLnJlbW92ZUNsYXNzKCdibG9nX19jaGFwdGVyc19zaG93ZWQnKTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gc2tpbGxzIGNvbG9yaWZ5XG4gIGlmKCQoJy5za2lsbCcpLmxlbmd0aCA+IDApIHtcbiAgICAkLmVhY2goJCgnLnNraWxsLWRpYWdyYW1fX3N2ZycpLCBmdW5jdGlvbiAoaSwgaXRlbSkge1xuICAgICAgdmFyIGx2bCA9ICQoaXRlbSkuZGF0YSgnbHZsJyk7XG4gICAgICB2YXIgYXJjTGVuZ3RoID0gbHZsLzEwMCAqIDI4Mi42O1xuXG4gICAgICAkKHRoaXMpLmNoaWxkcmVuKCcuc2tpbGwtZGlhZ3JhbV9fcmluZycpLmNzcyh7XG4gICAgICAgIFwic3Ryb2tlLWRhc2hhcnJheVwiOiBhcmNMZW5ndGggKyBcIiAyODIuNlwiLFxuICAgICAgICBcInN0cm9rZS1vcGFjaXR5XCI6IGx2bC8xMDBcbiAgICAgIH0pXG4gICAgICBcbiAgICB9KVxuICB9XG5cbiAgLy8gc2VuZCBtYWlsXG4gICQoJy5jb250YWN0LWZvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgc2VuZE1haWwoJCh0aGlzKSk7XG4gIH0pO1xuXG5cbn0pKGpRdWVyeSk7XG5cblxuXG5cbiIsIlxuLyoqID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIC0tLS0tIEdvb2dsZSBtYXBzIC0tLS0tLS0tXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5mdW5jdGlvbiBpbml0TWFwKCkge1xuXG4gIGlmKCQoJyNtYXAtYm94JykubGVuZ3RoID09IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gQ3JlYXRlIGFuIGFycmF5IG9mIHN0eWxlcy5cbiAgdmFyIHN0eWxlcyA9IFt7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dC5maWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjNDQ0NDQ0XCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiI2YyZjJmMlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJwb2lcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wic2F0dXJhdGlvblwiOi0xMDB9LHtcImxpZ2h0bmVzc1wiOjQ1fV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmhpZ2h3YXlcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwic2ltcGxpZmllZFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmFydGVyaWFsXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLmljb25cIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInRyYW5zaXRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcIndhdGVyXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjZTdhNzMxXCJ9LHtcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX1dXG5cbiAgLy8gQ3JlYXRlIGEgbmV3IFN0eWxlZE1hcFR5cGUgb2JqZWN0LCBwYXNzaW5nIGl0IHRoZSBhcnJheSBvZiBzdHlsZXMsXG4gIC8vIGFzIHdlbGwgYXMgdGhlIG5hbWUgdG8gYmUgZGlzcGxheWVkIG9uIHRoZSBtYXAgdHlwZSBjb250cm9sLlxuICB2YXIgc3R5bGVkTWFwID0gbmV3IGdvb2dsZS5tYXBzLlN0eWxlZE1hcFR5cGUoc3R5bGVzLFxuICAgICAge25hbWU6IFwiU3R5bGVkIE1hcFwifSk7XG5cbiAgLy8gQ3JlYXRlIGEgbWFwIG9iamVjdCwgYW5kIGluY2x1ZGUgdGhlIE1hcFR5cGVJZCB0byBhZGRcbiAgLy8gdG8gdGhlIG1hcCB0eXBlIGNvbnRyb2wuXG4gIHZhciBtYXBPcHRpb25zID0ge1xuICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICB6b29tOiAxMSxcbiAgICBjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNDYuNDQsIDMwLjc0NzE5ODUpLFxuICAgIG1hcFR5cGVDb250cm9sT3B0aW9uczoge1xuICAgICAgbWFwVHlwZUlkczogW2dvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLCAnbWFwX3N0eWxlJ11cbiAgICB9XG4gIH07XG4gIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtYm94JyksXG4gICAgICBtYXBPcHRpb25zKTtcblxuICAvL0Fzc29jaWF0ZSB0aGUgc3R5bGVkIG1hcCB3aXRoIHRoZSBNYXBUeXBlSWQgYW5kIHNldCBpdCB0byBkaXNwbGF5LlxuICBtYXAubWFwVHlwZXMuc2V0KCdtYXBfc3R5bGUnLCBzdHlsZWRNYXApO1xuICBtYXAuc2V0TWFwVHlwZUlkKCdtYXBfc3R5bGUnKTtcblxuICB2YXIgaW1hZ2UgPSB7XG4gICAgdXJsOiBcIi4uL2ltZy9tYXBfbWFya2VyLnN2Z1wiLFxuICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDUwLCA3MS40NilcbiAgfTtcblxuICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgcG9zaXRpb246IHtsYXQ6IDQ2LjQzMjI5MzksIGxuZzogMzAuNzI3MTk4NX0sXG4gICAgaWNvbjogaW1hZ2VcbiAgfSk7XG5cbiAgLy8gVG8gYWRkIHRoZSBtYXJrZXIgdG8gdGhlIG1hcCwgY2FsbCBzZXRNYXAoKTtcbiAgbWFya2VyLnNldE1hcChtYXApO1xufVxuXG4iLCJcbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PVxuICogLS0tLS0gUHJlbG9hZGVyIC0tLS0tLS0tXG4gKiA9PT09PT09PT09PT09PT09PT09PT09ICovXG47IGZ1bmN0aW9uIFByZWxvYWRlcigpIHtcblxuICB2YXJcbiAgICAgIHdyYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlbG9hZGVyJyksXG4gICAgICBjb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZWxvYWRlci1jb3VudGVyJyksXG4gICAgICB0aWNrID0gMCxcbiAgICAgIHRpbWVyLFxuICAgICAgaXNUaW1lclJ1biA9IGZhbHNlLFxuICAgICAgb25lUGljID0gMCxcbiAgICAgIGxvYWRlZEFtb3VudCA9IDAsXG4gICAgICBpbWdzID0gW107XG5cbiAgJCgnLndyYXBwZXIgKiwgLmZvb3RlciAqJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgc3JjID0gJHRoaXMuYXR0cignc3JjJyksXG4gICAgICAgIGJnID0gJCh0aGlzKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKTtcblxuICAgIGlmKHNyYyAhPT0gdW5kZWZpbmVkICYmICFzcmMubWF0Y2goJy5qcyQnKSAmJiAhc3JjLm1hdGNoKCdeaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tJykpIHtcbiAgICAgIGltZ3MucHVzaChzcmMpXG4gICAgfSBlbHNlIGlmKGJnICE9PSAnbm9uZScgJiYgIWJnLm1hdGNoKCdebGluZWFyJykgKSB7XG4gICAgICBiZyA9IGJnLnJlcGxhY2UoJ3VybChcIicsJycpLnJlcGxhY2UoJ1wiKScsJycpO1xuICAgICAgaW1ncy5wdXNoKGJnKVxuICAgIH1cbiAgfSk7XG4vLyBjb25zb2xlLmxvZyhpbWdzKTtcblxuICBvbmVQaWMgPSBNYXRoLmNlaWwoIDEgLyBpbWdzLmxlbmd0aCAqIDEwMCApO1xuICB0aWNrID0gb25lUGljO1xuXG4gIGltZ3MuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgIHZhciBpbWcgPSAkKCc8aW1nPicsIHtcbiAgICAgIGF0dHI6IHtcbiAgICAgICAgc3JjOiBpdGVtXG4gICAgICB9XG4gICAgfSk7XG4gICAgaW1nLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuLy8gY29uc29sZS5sb2coaW1nK2krJyAtIGxvYWRlZCEnKTtcbiAgICAgIGxvYWRlZEFtb3VudCArPSBvbmVQaWM7XG4gICAgICBpZighaXNUaW1lclJ1bikge1xuICAgICAgICBpc1RpbWVyUnVuID0gdHJ1ZTtcbiAgICAgICAgZ29UaW1lcigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGdvVGltZXIoKSB7XG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIHRpY2sgKz0gTWF0aC5jZWlsKGxvYWRlZEFtb3VudC8odGljaykpO1xuLy8vLyBERUxFVEUhISEhISEhISEhISEhIVxuICAgICAgdGljayA9IDEwMFxuICAgICAgaWYodGljayA+PSAxMDApIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgIGlzVGltZXJSdW4gPSBmYWxzZTtcbiAgICAgICAgdGljayA9IDEwMDtcbiAgICAgICAgd3JhcC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgd3JhcC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH0sIDUwMClcbiAgICAgIH0gZWxzZSBpZih0aWNrID49IGxvYWRlZEFtb3VudCAmJiB0aWNrIDwgMTAwKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICBpc1RpbWVyUnVuID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvdW50ZXIuaW5uZXJIVE1MID0gdGlja1xuICAgIH0sIDEwMCk7XG4gIH1cblxufSIsIi8qKiA9PT09PT09PT09PT09PT09PT09PT09PVxuKiAtLS0tLSBTZW5kIG1haWwgLS0tLS0tLS1cbiogPT09PT09PT09PT09PT09PT09PT09PSAqL1xuOyBmdW5jdGlvbiBzZW5kTWFpbCggZm9ybSApIHtcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm1bMF0pO1xuXG4gICQuYWpheCh7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIHVybDogXCJzZW5kbWFpbC5waHBcIixcbiAgICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgICAgY29udGVudFR5cGU6IGZhbHNlXG4gICAgICB9KVxuICAgICAgLmRvbmUoZnVuY3Rpb24oIG1zZyApIHtcbiAgICAgICAgLy8gbXNnID0gSlNPTi5wYXJzZShtc2cpO1xuICAgICAgICBjb25zb2xlLmxvZyggbXNnICk7XG4gICAgICB9KTtcbn0iLCJcbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIC0tLS0tLS0tLS0tLS0gUHJvamVjdCBTbGlkZXIgIC0tLS0tLS0tLS0tLVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG47IGZ1bmN0aW9uIFByb2plY3RTbGlkZXIoIHBhcmFtcyApIHtcblxuICAgdmFyIGRlZmF1bHRzID0geyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC90LDRgtGB0YDQvtC50LrQuCDRgdC70LDQudC00LXRgNCwXG4gICAgICBmaXJzdFNsaWRlTnVtOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L/QvtGA0Y/QtNC60L7QstGL0Lkg0L3QvtC80LXRgCDQv9C10YDQstC+0LPQviDRgdC70LDQudC00LBcbiAgICAgIHNsaWRlckl0ZW1zOiAnLnNsaWRlci1wcmV2aWV3X19pdGVtJywgICAgICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINGB0LvQsNC50LTQvtCyXG4gICAgICBzbGlkZXJJdGVtQWN0aXZlOiAnc2xpZGVyLXByZXZpZXdfX2l0ZW1fYWN0aXZlJywgICAgLy8g0LjQvNGPINC60LvQsNGB0YHQsCDQsNC60YLQuNCy0L3QvtCz0L4g0YHQu9Cw0LnQtNCwXG4gICAgICBzbGlkZXJCdXR0b25Eb3duOiAnLnNsaWRlcl9fYnV0dG9uX2Rvd24nLCAgICAgICAgICAgLy8g0LjQvNGPINC60LvQsNGB0YHQsCDQutC90L7Qv9C60Lgg0JLQndCY0JdcbiAgICAgIHNsaWRlckJ1dHRvblVwOiAnLnNsaWRlcl9fYnV0dG9uX3VwJywgICAgICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINC60L3QvtC/0LrQuCDQktCS0JXQoNClXG4gICAgICBzbGlkZXJCdXR0b25JbWdzOiAnLnNsaWRlci1idXR0b25fX2l0ZW0nLCAgICAgICAgICAgLy8g0LjQvNGPINC60LvQsNGB0YHQsCDQsNC60YLQuNCy0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDRgdC/0LjRgdC60LAg0LrQsNGA0YLQuNC90L7QuiDQmtCd0J7Qn9Ca0JhcbiAgICAgIHNsaWRlckJ1dHRvbkltZ0FjdGl2ZTogJ3NsaWRlci1idXR0b25fX2l0ZW1fYWN0aXZlJyAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINCw0LrRgtC40LLQvdC+0LPQviDRjdC70LXQvNC10L3RgtCwINGB0L/QuNGB0LrQsCDQutCw0YDRgtC40L3QvtC6INCa0J3QntCf0JrQmFxuICAgIH07XG5cbiAgICB2YXIgY3VycmVudE51bSA9IGRlZmF1bHRzLmZpcnN0U2xpZGVOdW0sXG4gICAgICAgIHNsaWRlckl0ZW1zID0gZGVmYXVsdHMuc2xpZGVySXRlbXMsXG4gICAgICAgIHNsaWRlckl0ZW1BY3RpdmUgPSBkZWZhdWx0cy5zbGlkZXJJdGVtQWN0aXZlLFxuICAgICAgICBzbGlkZXJCdXR0b25Eb3duID0gZGVmYXVsdHMuc2xpZGVyQnV0dG9uRG93bixcbiAgICAgICAgc2xpZGVyQnV0dG9uVXAgPSBkZWZhdWx0cy5zbGlkZXJCdXR0b25VcCxcbiAgICAgICAgc2xpZGVyQnV0dG9uSW1ncyA9IGRlZmF1bHRzLnNsaWRlckJ1dHRvbkltZ3MsXG4gICAgICAgIHNsaWRlckJ1dHRvbkltZ0FjdGl2ZSA9IGRlZmF1bHRzLnNsaWRlckJ1dHRvbkltZ0FjdGl2ZSxcblxuICAgICAgICBwcmV2aWV3cyA9ICQoc2xpZGVySXRlbXMpLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC90LDQsdC+0YAg0YHQu9Cw0LnQtNC+0LJcbiAgICAgICAgaW1hZ2VzQ291bnQgPSBwcmV2aWV3cy5sZW5ndGgsICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQutC+0Lst0LLQviDRgdC70LDQudC00L7QslxuICAgICAgICBsYXN0SXRlbSA9IGltYWdlc0NvdW50IC0gMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC90L7QvNC10YAg0L/QvtGB0LvQtdC00L3QtdCz0L4g0YHQu9Cw0LnQtNCwXG4gICAgICAgIGRvd25DdXJyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L/RgNC10LTRi9C00YPRidC40Lkg0L3QvtC80LXRgCDQvdCwINC60L3QvtC/0LrQtSBET1dOINCyINC80L7QvNC10L3RgiDQv9C10YDQutC70Y7Rh9C10L3QuNGPINGB0LvQsNC50LTQsFxuICAgICAgICB1cEN1cnIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINGB0LvQtdC00YPRjtGJ0LjQuSDQvdC+0LzQtdGAINC90LAg0LrQvdC+0L/QutC1IFVQINCyINC80L7QvNC10L3RgiDQv9C10YDQutC70Y7Rh9C10L3QuNGPINGB0LvQsNC50LTQsFxuICAgICAgICBpdGVtc0Rvd24gPSAkKHNsaWRlckJ1dHRvbkRvd24pLmZpbmQoc2xpZGVyQnV0dG9uSW1ncyksIC8vINC60YDQsNGC0LjQvdC60Lgg0LrQvdC+0L/QutC4INCS0J3QmNCXXG4gICAgICAgIGl0ZW1zVXAgPSAkKHNsaWRlckJ1dHRvblVwKS5maW5kKHNsaWRlckJ1dHRvbkltZ3MpLCAgICAgLy8g0LrRgNCw0YLQuNC90LrQuCDQutC90L7Qv9C60Lgg0JLQktCV0KDQpVxuICAgICAgICBzbGlkZXJEZXNjID0gW107XG5cblxuICAgICQuYWpheCgnanNvbi93b3Jrcy5qc29uJykuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgc2V0dXAoZGF0YSlcbiAgICB9KTtcblxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLSDQndCw0LbQsNGC0LjQtSDQvdCwINC60L3QvtC/0LrRgyDQv9GA0L7QutGA0YPRgtC60Lgg0YHQu9Cw0LnQtNC+0LIgLS0tLS0tLS0tLS0tLS1cblxuICAgICQoJy5zbGlkZXJfX2J1dHRvbicpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIC8vINCe0YLQvtCx0YDQsNC20LXQvdC40LUg0YHQu9C10LQv0L/RgNC10LQg0YHQu9Cw0LnQtNCwINCyINC30LDQstC40YHQuNC80L7RgtC4INC+0YIg0L3QsNC20LDRgtC+0Lkg0LrQvdC+0L/QutC4XG4gICAgICBpZiAoICQodGhpcykuaGFzQ2xhc3MoJ3NsaWRlcl9fYnV0dG9uX3VwJykgKSB7XG4gICAgICAgIHByZXZpZXdzLmVxKGN1cnJlbnROdW0pLnJlbW92ZUNsYXNzKHNsaWRlckl0ZW1BY3RpdmUpO1xuICAgICAgICBwcmV2aWV3cy5lcSh1cEN1cnIpLmFkZENsYXNzKHNsaWRlckl0ZW1BY3RpdmUpO1xuICAgICAgICBjdXJyZW50TnVtID0gdXBDdXJyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldmlld3MuZXEoY3VycmVudE51bSkucmVtb3ZlQ2xhc3Moc2xpZGVySXRlbUFjdGl2ZSk7XG4gICAgICAgIHByZXZpZXdzLmVxKGRvd25DdXJyKS5hZGRDbGFzcyhzbGlkZXJJdGVtQWN0aXZlKTtcbiAgICAgICAgY3VycmVudE51bSA9IGRvd25DdXJyO1xuICAgICAgfVxuXG5cbiAgICAgIHZhciBjdXJyZW50RG93biA9IGl0ZW1zRG93bi5lcShkb3duQ3VyciksXG4gICAgICAgICAgY3VycmVudFVwID0gaXRlbXNVcC5lcSh1cEN1cnIpO1xuXG4gICAgICAvLyDQkNC90LjQvNCw0YbQuNGPINC60LDRgtGA0LjQvdC+0Log0L3QsCDQutC90L7Qv9C60LDRhSAtINC/0L7QtNGK0LXQvCDQstCy0LXRgNGFXG4gICAgICBjdXJyZW50RG93bi5jc3Moe1xuICAgICAgICB0b3A6IHBhcnNlSW50KCQodGhpcykuY3NzKCd0b3AnKSkgKyAkKHRoaXMpLmhlaWdodCgpXG4gICAgICB9KS5yZW1vdmVDbGFzcyhzbGlkZXJCdXR0b25JbWdBY3RpdmUpO1xuXG4gICAgICBjdXJyZW50VXAuY3NzKHtcbiAgICAgICAgdG9wOiBwYXJzZUludCgkKHRoaXMpLmNzcygndG9wJykpIC0gJCh0aGlzKS5oZWlnaHQoKVxuICAgICAgfSkucmVtb3ZlQ2xhc3Moc2xpZGVyQnV0dG9uSW1nQWN0aXZlKTtcblxuICAgICAgLy8g0J/QvtGB0LvQtSDQvtC60L7QvdGH0LDQvdC40Y8g0LDQvdC40LzQsNGG0LjQuCDRgdCx0YDQvtGBXG4gICAgICBjdXJyZW50VXAub24oJ3RyYW5zaXRpb25lbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuY3NzKHtcbiAgICAgICAgICB0b3A6ICcnXG4gICAgICAgIH0pXG4gICAgICB9KTtcblxuICAgICAgY3VycmVudERvd24ub24oJ3RyYW5zaXRpb25lbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuY3NzKHtcbiAgICAgICAgICB0b3A6ICcnXG4gICAgICAgIH0pXG4gICAgICB9KTtcblxuICAgICAgcnVuKCk7XG5cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHNldHVwKGRhdGEpIHtcbiAgICAgIHNsaWRlckRlc2MgPSBkYXRhO1xuXG4gICAgICAgICQoJy5zbGlkZXItcHJldmlld19fcGhvdG8nKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgJCh0aGlzKS5hdHRyKCdzcmMnLCAnaW1nL3Byb2plY3RzLycgKyBzbGlkZXJEZXNjW2ldLmltYWdlKVxuICAgICAgICB9KTtcblxuICAgICAgICAkKCcuc2xpZGVyX19idXR0b24nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQodGhpcykuZmluZCgnLnNsaWRlci1idXR0b25fX2ltZycpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICQodGhpcykuYXR0cignc3JjJywgJ2ltZy9wcm9qZWN0cy8nICsgc2xpZGVyRGVzY1tpXS5pbWFnZSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJldmlld3MuZXEoY3VycmVudE51bSkuYWRkQ2xhc3Moc2xpZGVySXRlbUFjdGl2ZSk7IC8vINCw0LrRgtC40LLQsNGG0LjRjyDQv9C10YDQstC+0LPQviDRgdC70LDQudC00LAg0LIg0L7QutC90LUg0L/RgNC+0YHQvNC+0YLRgNCwXG5cbiAgICAgICAgcnVuKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuKCkge1xuICAgICAgLy8g0J7Qv9GA0LXQtNC10LvRj9C10Lwg0L3QvtCy0YvQtSDQutCw0YDRgtC40L3QutC4INC00LvRjyDQutC90L7Qv9C+0LpcbiAgICAgIGlmIChjdXJyZW50TnVtID09IDApIHtcbiAgICAgICAgZG93bkN1cnIgPSBsYXN0SXRlbTtcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudE51bSAtIDEgPT0gMCkge1xuICAgICAgICBkb3duQ3VyciA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb3duQ3VyciA9IGN1cnJlbnROdW0gLSAxO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudE51bSA9PSBsYXN0SXRlbSkge1xuICAgICAgICB1cEN1cnIgPSAwO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50TnVtICsgMSA9PSBsYXN0SXRlbSkge1xuICAgICAgICB1cEN1cnIgPSBsYXN0SXRlbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVwQ3VyciA9IGN1cnJlbnROdW0gKyAxO1xuICAgICAgfVxuXG4gICAgICAkKCcuc2xpZGVyLWRlc2NyaXB0aW9uIC50aXRsZS1jb250ZW50JykudGV4dChzbGlkZXJEZXNjW2N1cnJlbnROdW1dLnRpdGxlKVxuICAgICAgJCgnLnNsaWRlci1kZXNjcmlwdGlvbiAuY3VycmVudC1za2lsbHMnKS50ZXh0KHNsaWRlckRlc2NbY3VycmVudE51bV0uc2tpbGxzLmpvaW4oXCIsIFwiKSlcbiAgICAgICQoJy5zbGlkZXItZGVzY3JpcHRpb24gLnNsaWRlci1kZXNjcmlwdGlvbl9fYnRuJykuYXR0cignaHJlZicsIHNsaWRlckRlc2NbY3VycmVudE51bV0udXJsKVxuXG4gICAgICAvLyDQntGC0L7QsdGA0LDQttCw0LXQvCDQvdC+0LLRi9C1INC60LDRgNGC0LjQvdC60Lgg0LrQvdC+0L/QvtC6XG4gICAgICBpdGVtc0Rvd24uZXEoZG93bkN1cnIpLmFkZENsYXNzKHNsaWRlckJ1dHRvbkltZ0FjdGl2ZSk7XG4gICAgICBpdGVtc1VwLmVxKHVwQ3VycikuYWRkQ2xhc3Moc2xpZGVyQnV0dG9uSW1nQWN0aXZlKTtcbiAgICB9XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
