
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
    center: new google.maps.LatLng(46.50,30.7471985),
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


'use strict';

(function($) {

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
    $('.welcome-box').addClass('welcome-box_flipped');
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
      $('.flipper').removeClass('flipped');
      $('.login-box').removeClass('login-box_flipped');
      $('.welcome-box').removeClass('welcome-box_flipped');
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

  $('.chapters__link').click(function(){
    $('html, body').animate({
      scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 1000);
    ( $('.blog__chapters').length && $('.blog__chapters').click() )
    return false;
  });

  // Переход по якорю на другой странице
  if(window.location.hash !== '') {
    $('html, body').animate({
      scrollTop: $( window.location.hash ).offset().top + 40
    }, 1000);
  }

  // open overlay menu
  $('#open-overlay-menu').click(function () {
    $('.overlay-menu').css({
      display: "block"
    });
    setTimeout(function () {
      $('.overlay-menu').css({
        opacity: 1
      })
    }, 10)
  });

  //close overlay menu
  $('#overlay-close').click(function () {
    $('.overlay-menu').css({
        opacity: 0
    });
    setTimeout(function () {
      $('.overlay-menu').css({
        display: "none"
      })
    }, 500)
  });

  // fixed blog chapters
  if($('.blog__chapters').length > 0) {
    var scroll_point = $('.blog__chapters').offset().top - 70;
    var fixed_flag = false;

    $(window).on('scroll', function (e) {
      var body_scrollTop = $('body').scrollTop();

      if( body_scrollTop >= scroll_point) {

        if(!fixed_flag) {
          fixed_flag = true;

          $('.blog__chapters').addClass('blog__chapters_fixed');
        }

        $('.blog__article').each(function (i, item) {

          if( body_scrollTop >= $(item).offset().top - 35 &&
              body_scrollTop <= $(item).offset().top + $(item).height() + 35) {

            var activeId = $(item).attr("id");
            $('.chapters__item').removeClass('chapters__item_active');
            $('.chapters__link[href="#'+activeId+'"]').parent().addClass('chapters__item_active');

            return false;
          }
        })

      } else {
        fixed_flag = false;
        if( $(window).width() > 992 ) {
          $('.blog__chapters').removeClass('blog__chapters_fixed');
          $(this).data('swiped', false);
        }
      }
    });

    $('.blog__chapters').click(function () {
      if( $(this).data('swiped') == false ) {
        $(this).data('swiped', true);
        $('.blog__chapters').addClass('blog__chapters_showed');
      } else {
        $(this).data('swiped', false);
        $('.blog__chapters').removeClass('blog__chapters_showed');
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






/** =======================
 * ----- Preloader --------
 * ====================== */

; var Preloader = (function () {
  var wrap = document.getElementById('preloader');
  var counter = document.getElementById('preloader-counter');
  var tick = 0;
  var speed = 1;
  var timer;

  timer = setInterval(function() {
    tick += speed;

    if(tick >= 100) {
      clearInterval(timer);
      tick = 100;
    }

    counter.innerHTML = tick
  }, 100);

  window.onload = function() {
    speed = 10;
    counter.innerHTML = "100";
    clearInterval(timer);
    wrap.style.opacity = 0;
    setTimeout(function () {
      wrap.style.display = "none";
    }, 500)
  };
})();

/** ==========================================
 * ----- Module - Slider for projects --------
 * ======================================== */

; var sliderPortfolio = (function () {

   var defaults = {
      sliderItems: '.slider-photo__item',
      firstSlideNum: 1
    };

    var currentNum = defaults.firstSlideNum,
        prevNum,    // предыдущий номер на кнопке DOWN в момент перключения слайда
        nextNum,    // следующий номер на кнопке UP в момент перключения слайда
        newNum,     // новый номер - после смены слайда
        newPrevNum, // новый номер предыдущего слайда - после смены слайда
        newNextNum, // новый номер следующего слайда - после смены слайда
        imagesCount = $(defaults.sliderItems).length;

    if(currentNum < imagesCount && currentNum > 1) {
      prevNum = currentNum - 1;
      nextNum = currentNum + 1;
    } else if(currentNum == imagesCount) {
      prevNum = currentNum - 1;
      nextNum = 1;
    } else if(currentNum == 1) {
      prevNum = imagesCount;
      nextNum = currentNum + 1;
    }


    $('.slider-nav__button').click(function (e) {
      e.preventDefault();

      currentNum = $('.slider-photo__item_active').data('num');

      if(currentNum < imagesCount && currentNum > 1) {
        prevNum = currentNum - 1;
        nextNum = currentNum + 1;
      } else if(currentNum == imagesCount) {
        prevNum = currentNum - 1;
        nextNum = 1;
      } else if(currentNum == 1) {
        prevNum = imagesCount;
        nextNum = currentNum + 1;
      }

      if( $(this).data('arrow') == 'up' ) {
        if(parseInt(currentNum) < imagesCount) {
          newNum = currentNum + 1;
        } else if(parseInt(currentNum) == imagesCount) {
          newNum = 1;
        }
      } else {
        if(parseInt(currentNum) == 1) {
          newNum = imagesCount;
        } else if(parseInt(currentNum) <= imagesCount) {
          newNum = currentNum - 1;
        }
      }

      if(newNum < imagesCount && newNum > 1) {
        newPrevNum = newNum - 1;
        newNextNum = newNum + 1;
      } else if(newNum == imagesCount) {
        newPrevNum = newNum - 1;
        newNextNum = 1;
      } else if(newNum == 1) {
        newPrevNum = imagesCount;
        newNextNum = newNum + 1;
      }

      $('.slider-photo__item[data-num="'+currentNum+'"]').removeClass('slider-photo__item_active');
      $('.slider-photo__item[data-num="'+newNum+'"]').addClass('slider-photo__item_active')

      $('.slider-nav__button[data-arrow="up"] .slider-button-photo__item[data-num="'+nextNum+'"]').removeClass('slider-button-photo__item_active');
      $('.slider-nav__button[data-arrow="up"] .slider-button-photo__item[data-num="'+newNextNum+'"]').addClass('slider-button-photo__item_active');

      $('.slider-nav__button[data-arrow="down"] .slider-button-photo__item[data-num="'+prevNum+'"]').removeClass('slider-button-photo__item_active')
      $('.slider-nav__button[data-arrow="down"] .slider-button-photo__item[data-num="'+newPrevNum+'"]').addClass('slider-button-photo__item_active')

    });

    $('.slider-photo__item[data-num="'+prevNum+'"]').removeClass('slider-photo__item_active');
    $('.slider-photo__item[data-num="'+currentNum+'"]').addClass('slider-photo__item_active')

    $('.slider-nav__button[data-arrow="up"] .slider-button-photo__item[data-num="'+currentNum+'"]').removeClass('slider-button-photo__item_active');
    $('.slider-nav__button[data-arrow="up"] .slider-button-photo__item[data-num="'+nextNum+'"]').addClass('slider-button-photo__item_active');

    $('.slider-nav__button[data-arrow="down"] .slider-button-photo__item[data-num="'+currentNum+'"]').removeClass('slider-button-photo__item_active')
    $('.slider-nav__button[data-arrow="down"] .slider-button-photo__item[data-num="'+prevNum+'"]').addClass('slider-button-photo__item_active')

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdvb2dsZS1tYXBzLmpzIiwibWFpbi5qcyIsInByZWxvYWRlci5qcyIsInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIC0tLS0tIEdvb2dsZSBtYXBzIC0tLS0tLS0tXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5mdW5jdGlvbiBpbml0TWFwKCkge1xuXG4gIGlmKCQoJyNtYXAtYm94JykubGVuZ3RoID09IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gQ3JlYXRlIGFuIGFycmF5IG9mIHN0eWxlcy5cbiAgdmFyIHN0eWxlcyA9IFt7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dC5maWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjNDQ0NDQ0XCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiI2YyZjJmMlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJwb2lcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wic2F0dXJhdGlvblwiOi0xMDB9LHtcImxpZ2h0bmVzc1wiOjQ1fV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmhpZ2h3YXlcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwic2ltcGxpZmllZFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmFydGVyaWFsXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLmljb25cIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInRyYW5zaXRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcIndhdGVyXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjZTdhNzMxXCJ9LHtcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX1dXG5cbiAgLy8gQ3JlYXRlIGEgbmV3IFN0eWxlZE1hcFR5cGUgb2JqZWN0LCBwYXNzaW5nIGl0IHRoZSBhcnJheSBvZiBzdHlsZXMsXG4gIC8vIGFzIHdlbGwgYXMgdGhlIG5hbWUgdG8gYmUgZGlzcGxheWVkIG9uIHRoZSBtYXAgdHlwZSBjb250cm9sLlxuICB2YXIgc3R5bGVkTWFwID0gbmV3IGdvb2dsZS5tYXBzLlN0eWxlZE1hcFR5cGUoc3R5bGVzLFxuICAgICAge25hbWU6IFwiU3R5bGVkIE1hcFwifSk7XG5cbiAgLy8gQ3JlYXRlIGEgbWFwIG9iamVjdCwgYW5kIGluY2x1ZGUgdGhlIE1hcFR5cGVJZCB0byBhZGRcbiAgLy8gdG8gdGhlIG1hcCB0eXBlIGNvbnRyb2wuXG4gIHZhciBtYXBPcHRpb25zID0ge1xuICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICB6b29tOiAxMSxcbiAgICBjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNDYuNTAsMzAuNzQ3MTk4NSksXG4gICAgbWFwVHlwZUNvbnRyb2xPcHRpb25zOiB7XG4gICAgICBtYXBUeXBlSWRzOiBbZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsICdtYXBfc3R5bGUnXVxuICAgIH1cbiAgfTtcbiAgdmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1ib3gnKSxcbiAgICAgIG1hcE9wdGlvbnMpO1xuXG4gIC8vQXNzb2NpYXRlIHRoZSBzdHlsZWQgbWFwIHdpdGggdGhlIE1hcFR5cGVJZCBhbmQgc2V0IGl0IHRvIGRpc3BsYXkuXG4gIG1hcC5tYXBUeXBlcy5zZXQoJ21hcF9zdHlsZScsIHN0eWxlZE1hcCk7XG4gIG1hcC5zZXRNYXBUeXBlSWQoJ21hcF9zdHlsZScpO1xuXG4gIHZhciBpbWFnZSA9IHtcbiAgICB1cmw6IFwiLi4vaW1nL21hcF9tYXJrZXIuc3ZnXCIsXG4gICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoNTAsIDcxLjQ2KVxuICB9O1xuXG4gIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICBwb3NpdGlvbjoge2xhdDogNDYuNDMyMjkzOSwgbG5nOiAzMC43MjcxOTg1fSxcbiAgICBpY29uOiBpbWFnZVxuICB9KTtcblxuICAvLyBUbyBhZGQgdGhlIG1hcmtlciB0byB0aGUgbWFwLCBjYWxsIHNldE1hcCgpO1xuICBtYXJrZXIuc2V0TWFwKG1hcCk7XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKCQpIHtcblxuICAvLyBhZGFwdGl2ZSBoZWlnaHQgb2YgaGVhZGVyXG4gIGlmKCQoJy5oZWFkZXInKS5sZW5ndGggPiAwKSB7XG4gICAgdmFyIG1pbl9oZWlnaHQgPSA2NTA7XG4gICAgdmFyIG5ld19oZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XG5cbiAgICBpZiAoJCh3aW5kb3cpLmhlaWdodCgpID4gbWluX2hlaWdodCkge1xuICAgICAgbmV3X2hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdfaGVpZ2h0ID0gbWluX2hlaWdodDtcbiAgICB9XG5cbiAgICAkKCcuaGVhZGVyJykuY3NzKHtcbiAgICAgIGhlaWdodDogbmV3X2hlaWdodFxuICAgIH0pO1xuICB9XG5cbiAgLy8gZmxpcCBsb2dpbiBib3hcbiAgJCgnI2hlYWRlcl9fbG9naW4tYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIC8vICQoJy5mbGlwcGVyJykuYWRkQ2xhc3MoJ2ZsaXBwZWQnKTtcbiAgICAkKCcubG9naW4tYm94JykuYWRkQ2xhc3MoJ2xvZ2luLWJveF9mbGlwcGVkJyk7XG4gICAgJCgnLndlbGNvbWUtYm94JykuYWRkQ2xhc3MoJ3dlbGNvbWUtYm94X2ZsaXBwZWQnKTtcbiAgICAkKCcubG9naW4tZm9ybV9faW5wdXRbbmFtZT1sb2dpbl0nKS5mb2N1cygpXG4gICAgJCh0aGlzKS5mYWRlT3V0KClcbiAgfSk7XG5cbiAgLy8gZmxpcC1iYWNrIGxvZ2luIGJveFxuICAkKCcubG9naW4tZm9ybV9fbGJsJykua2V5dXAoZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoIGUua2V5Q29kZSA9PSAzMiB8fCBlLmtleUNvZGUgPT0gMTMgKSB7XG4gICAgICAkKHRoaXMpLmNsaWNrKCk7XG4gICAgfVxuICB9KTtcblxuICAkKCdib2R5LCAjbG9naW4tbmF2X19ob21lJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICBpZiggJChlLnRhcmdldCkucGFyZW50cygnLmZsaXAtY29udGFpbmVyJykubGVuZ3RoID09IDAgfHwgJChlLnRhcmdldCkuYXR0cignaWQnKSA9PT0gJ2xvZ2luLW5hdl9faG9tZScpIHtcbiAgICAgICQoJy5mbGlwcGVyJykucmVtb3ZlQ2xhc3MoJ2ZsaXBwZWQnKTtcbiAgICAgICQoJy5sb2dpbi1ib3gnKS5yZW1vdmVDbGFzcygnbG9naW4tYm94X2ZsaXBwZWQnKTtcbiAgICAgICQoJy53ZWxjb21lLWJveCcpLnJlbW92ZUNsYXNzKCd3ZWxjb21lLWJveF9mbGlwcGVkJyk7XG4gICAgICAkKCcjaGVhZGVyX19sb2dpbi1idG4nKS5mYWRlSW4oKVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gc21vb3RoIHNjcm9sbFxuICAkKCcjYXJyb3ctZG93biwgI2Fycm93LXVwLCAuY2hhcHRlcnNfX2xpbmsnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogJCggJC5hdHRyKHRoaXMsICdocmVmJykgKS5vZmZzZXQoKS50b3BcbiAgICB9LCAxMDAwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gICQoJy5jaGFwdGVyc19fbGluaycpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgc2Nyb2xsVG9wOiAkKCAkLmF0dHIodGhpcywgJ2hyZWYnKSApLm9mZnNldCgpLnRvcFxuICAgIH0sIDEwMDApO1xuICAgICggJCgnLmJsb2dfX2NoYXB0ZXJzJykubGVuZ3RoICYmICQoJy5ibG9nX19jaGFwdGVycycpLmNsaWNrKCkgKVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgLy8g0J/QtdGA0LXRhdC+0LQg0L/QviDRj9C60L7RgNGOINC90LAg0LTRgNGD0LPQvtC5INGB0YLRgNCw0L3QuNGG0LVcbiAgaWYod2luZG93LmxvY2F0aW9uLmhhc2ggIT09ICcnKSB7XG4gICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgc2Nyb2xsVG9wOiAkKCB3aW5kb3cubG9jYXRpb24uaGFzaCApLm9mZnNldCgpLnRvcCArIDQwXG4gICAgfSwgMTAwMCk7XG4gIH1cblxuICAvLyBvcGVuIG92ZXJsYXkgbWVudVxuICAkKCcjb3Blbi1vdmVybGF5LW1lbnUnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICBkaXNwbGF5OiBcImJsb2NrXCJcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJy5vdmVybGF5LW1lbnUnKS5jc3Moe1xuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9KVxuICAgIH0sIDEwKVxuICB9KTtcblxuICAvL2Nsb3NlIG92ZXJsYXkgbWVudVxuICAkKCcjb3ZlcmxheS1jbG9zZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAkKCcub3ZlcmxheS1tZW51JykuY3NzKHtcbiAgICAgICAgb3BhY2l0eTogMFxuICAgIH0pO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICAgIGRpc3BsYXk6IFwibm9uZVwiXG4gICAgICB9KVxuICAgIH0sIDUwMClcbiAgfSk7XG5cbiAgLy8gZml4ZWQgYmxvZyBjaGFwdGVyc1xuICBpZigkKCcuYmxvZ19fY2hhcHRlcnMnKS5sZW5ndGggPiAwKSB7XG4gICAgdmFyIHNjcm9sbF9wb2ludCA9ICQoJy5ibG9nX19jaGFwdGVycycpLm9mZnNldCgpLnRvcCAtIDcwO1xuICAgIHZhciBmaXhlZF9mbGFnID0gZmFsc2U7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgYm9keV9zY3JvbGxUb3AgPSAkKCdib2R5Jykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgIGlmKCBib2R5X3Njcm9sbFRvcCA+PSBzY3JvbGxfcG9pbnQpIHtcblxuICAgICAgICBpZighZml4ZWRfZmxhZykge1xuICAgICAgICAgIGZpeGVkX2ZsYWcgPSB0cnVlO1xuXG4gICAgICAgICAgJCgnLmJsb2dfX2NoYXB0ZXJzJykuYWRkQ2xhc3MoJ2Jsb2dfX2NoYXB0ZXJzX2ZpeGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuYmxvZ19fYXJ0aWNsZScpLmVhY2goZnVuY3Rpb24gKGksIGl0ZW0pIHtcblxuICAgICAgICAgIGlmKCBib2R5X3Njcm9sbFRvcCA+PSAkKGl0ZW0pLm9mZnNldCgpLnRvcCAtIDM1ICYmXG4gICAgICAgICAgICAgIGJvZHlfc2Nyb2xsVG9wIDw9ICQoaXRlbSkub2Zmc2V0KCkudG9wICsgJChpdGVtKS5oZWlnaHQoKSArIDM1KSB7XG5cbiAgICAgICAgICAgIHZhciBhY3RpdmVJZCA9ICQoaXRlbSkuYXR0cihcImlkXCIpO1xuICAgICAgICAgICAgJCgnLmNoYXB0ZXJzX19pdGVtJykucmVtb3ZlQ2xhc3MoJ2NoYXB0ZXJzX19pdGVtX2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmNoYXB0ZXJzX19saW5rW2hyZWY9XCIjJythY3RpdmVJZCsnXCJdJykucGFyZW50KCkuYWRkQ2xhc3MoJ2NoYXB0ZXJzX19pdGVtX2FjdGl2ZScpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXhlZF9mbGFnID0gZmFsc2U7XG4gICAgICAgIGlmKCAkKHdpbmRvdykud2lkdGgoKSA+IDk5MiApIHtcbiAgICAgICAgICAkKCcuYmxvZ19fY2hhcHRlcnMnKS5yZW1vdmVDbGFzcygnYmxvZ19fY2hhcHRlcnNfZml4ZWQnKTtcbiAgICAgICAgICAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCgnLmJsb2dfX2NoYXB0ZXJzJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgaWYoICQodGhpcykuZGF0YSgnc3dpcGVkJykgPT0gZmFsc2UgKSB7XG4gICAgICAgICQodGhpcykuZGF0YSgnc3dpcGVkJywgdHJ1ZSk7XG4gICAgICAgICQoJy5ibG9nX19jaGFwdGVycycpLmFkZENsYXNzKCdibG9nX19jaGFwdGVyc19zaG93ZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcykuZGF0YSgnc3dpcGVkJywgZmFsc2UpO1xuICAgICAgICAkKCcuYmxvZ19fY2hhcHRlcnMnKS5yZW1vdmVDbGFzcygnYmxvZ19fY2hhcHRlcnNfc2hvd2VkJyk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vIHNraWxscyBjb2xvcmlmeVxuICBpZigkKCcuc2tpbGwnKS5sZW5ndGggPiAwKSB7XG4gICAgJC5lYWNoKCQoJy5za2lsbC1kaWFncmFtX19zdmcnKSwgZnVuY3Rpb24gKGksIGl0ZW0pIHtcbiAgICAgIHZhciBsdmwgPSAkKGl0ZW0pLmRhdGEoJ2x2bCcpO1xuICAgICAgdmFyIGFyY0xlbmd0aCA9IGx2bC8xMDAgKiAyODIuNjtcblxuICAgICAgJCh0aGlzKS5jaGlsZHJlbignLnNraWxsLWRpYWdyYW1fX3JpbmcnKS5jc3Moe1xuICAgICAgICBcInN0cm9rZS1kYXNoYXJyYXlcIjogYXJjTGVuZ3RoICsgXCIgMjgyLjZcIixcbiAgICAgICAgXCJzdHJva2Utb3BhY2l0eVwiOiBsdmwvMTAwXG4gICAgICB9KVxuICAgICAgXG4gICAgfSlcbiAgfVxuICBcblxufSkoalF1ZXJ5KTtcblxuXG5cblxuIiwiXG4vKiogPT09PT09PT09PT09PT09PT09PT09PT1cbiAqIC0tLS0tIFByZWxvYWRlciAtLS0tLS0tLVxuICogPT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG47IHZhciBQcmVsb2FkZXIgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgd3JhcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmVsb2FkZXInKTtcbiAgdmFyIGNvdW50ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlbG9hZGVyLWNvdW50ZXInKTtcbiAgdmFyIHRpY2sgPSAwO1xuICB2YXIgc3BlZWQgPSAxO1xuICB2YXIgdGltZXI7XG5cbiAgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICB0aWNrICs9IHNwZWVkO1xuXG4gICAgaWYodGljayA+PSAxMDApIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgdGljayA9IDEwMDtcbiAgICB9XG5cbiAgICBjb3VudGVyLmlubmVySFRNTCA9IHRpY2tcbiAgfSwgMTAwKTtcblxuICB3aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgc3BlZWQgPSAxMDtcbiAgICBjb3VudGVyLmlubmVySFRNTCA9IFwiMTAwXCI7XG4gICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgd3JhcC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHdyYXAuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH0sIDUwMClcbiAgfTtcbn0pKCk7IiwiXG4vKiogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiAtLS0tLSBNb2R1bGUgLSBTbGlkZXIgZm9yIHByb2plY3RzIC0tLS0tLS0tXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbjsgdmFyIHNsaWRlclBvcnRmb2xpbyA9IChmdW5jdGlvbiAoKSB7XG5cbiAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHNsaWRlckl0ZW1zOiAnLnNsaWRlci1waG90b19faXRlbScsXG4gICAgICBmaXJzdFNsaWRlTnVtOiAxXG4gICAgfTtcblxuICAgIHZhciBjdXJyZW50TnVtID0gZGVmYXVsdHMuZmlyc3RTbGlkZU51bSxcbiAgICAgICAgcHJldk51bSwgICAgLy8g0L/RgNC10LTRi9C00YPRidC40Lkg0L3QvtC80LXRgCDQvdCwINC60L3QvtC/0LrQtSBET1dOINCyINC80L7QvNC10L3RgiDQv9C10YDQutC70Y7Rh9C10L3QuNGPINGB0LvQsNC50LTQsFxuICAgICAgICBuZXh0TnVtLCAgICAvLyDRgdC70LXQtNGD0Y7RidC40Lkg0L3QvtC80LXRgCDQvdCwINC60L3QvtC/0LrQtSBVUCDQsiDQvNC+0LzQtdC90YIg0L/QtdGA0LrQu9GO0YfQtdC90LjRjyDRgdC70LDQudC00LBcbiAgICAgICAgbmV3TnVtLCAgICAgLy8g0L3QvtCy0YvQuSDQvdC+0LzQtdGAIC0g0L/QvtGB0LvQtSDRgdC80LXQvdGLINGB0LvQsNC50LTQsFxuICAgICAgICBuZXdQcmV2TnVtLCAvLyDQvdC+0LLRi9C5INC90L7QvNC10YAg0L/RgNC10LTRi9C00YPRidC10LPQviDRgdC70LDQudC00LAgLSDQv9C+0YHQu9C1INGB0LzQtdC90Ysg0YHQu9Cw0LnQtNCwXG4gICAgICAgIG5ld05leHROdW0sIC8vINC90L7QstGL0Lkg0L3QvtC80LXRgCDRgdC70LXQtNGD0Y7RidC10LPQviDRgdC70LDQudC00LAgLSDQv9C+0YHQu9C1INGB0LzQtdC90Ysg0YHQu9Cw0LnQtNCwXG4gICAgICAgIGltYWdlc0NvdW50ID0gJChkZWZhdWx0cy5zbGlkZXJJdGVtcykubGVuZ3RoO1xuXG4gICAgaWYoY3VycmVudE51bSA8IGltYWdlc0NvdW50ICYmIGN1cnJlbnROdW0gPiAxKSB7XG4gICAgICBwcmV2TnVtID0gY3VycmVudE51bSAtIDE7XG4gICAgICBuZXh0TnVtID0gY3VycmVudE51bSArIDE7XG4gICAgfSBlbHNlIGlmKGN1cnJlbnROdW0gPT0gaW1hZ2VzQ291bnQpIHtcbiAgICAgIHByZXZOdW0gPSBjdXJyZW50TnVtIC0gMTtcbiAgICAgIG5leHROdW0gPSAxO1xuICAgIH0gZWxzZSBpZihjdXJyZW50TnVtID09IDEpIHtcbiAgICAgIHByZXZOdW0gPSBpbWFnZXNDb3VudDtcbiAgICAgIG5leHROdW0gPSBjdXJyZW50TnVtICsgMTtcbiAgICB9XG5cblxuICAgICQoJy5zbGlkZXItbmF2X19idXR0b24nKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBjdXJyZW50TnVtID0gJCgnLnNsaWRlci1waG90b19faXRlbV9hY3RpdmUnKS5kYXRhKCdudW0nKTtcblxuICAgICAgaWYoY3VycmVudE51bSA8IGltYWdlc0NvdW50ICYmIGN1cnJlbnROdW0gPiAxKSB7XG4gICAgICAgIHByZXZOdW0gPSBjdXJyZW50TnVtIC0gMTtcbiAgICAgICAgbmV4dE51bSA9IGN1cnJlbnROdW0gKyAxO1xuICAgICAgfSBlbHNlIGlmKGN1cnJlbnROdW0gPT0gaW1hZ2VzQ291bnQpIHtcbiAgICAgICAgcHJldk51bSA9IGN1cnJlbnROdW0gLSAxO1xuICAgICAgICBuZXh0TnVtID0gMTtcbiAgICAgIH0gZWxzZSBpZihjdXJyZW50TnVtID09IDEpIHtcbiAgICAgICAgcHJldk51bSA9IGltYWdlc0NvdW50O1xuICAgICAgICBuZXh0TnVtID0gY3VycmVudE51bSArIDE7XG4gICAgICB9XG5cbiAgICAgIGlmKCAkKHRoaXMpLmRhdGEoJ2Fycm93JykgPT0gJ3VwJyApIHtcbiAgICAgICAgaWYocGFyc2VJbnQoY3VycmVudE51bSkgPCBpbWFnZXNDb3VudCkge1xuICAgICAgICAgIG5ld051bSA9IGN1cnJlbnROdW0gKyAxO1xuICAgICAgICB9IGVsc2UgaWYocGFyc2VJbnQoY3VycmVudE51bSkgPT0gaW1hZ2VzQ291bnQpIHtcbiAgICAgICAgICBuZXdOdW0gPSAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZihwYXJzZUludChjdXJyZW50TnVtKSA9PSAxKSB7XG4gICAgICAgICAgbmV3TnVtID0gaW1hZ2VzQ291bnQ7XG4gICAgICAgIH0gZWxzZSBpZihwYXJzZUludChjdXJyZW50TnVtKSA8PSBpbWFnZXNDb3VudCkge1xuICAgICAgICAgIG5ld051bSA9IGN1cnJlbnROdW0gLSAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKG5ld051bSA8IGltYWdlc0NvdW50ICYmIG5ld051bSA+IDEpIHtcbiAgICAgICAgbmV3UHJldk51bSA9IG5ld051bSAtIDE7XG4gICAgICAgIG5ld05leHROdW0gPSBuZXdOdW0gKyAxO1xuICAgICAgfSBlbHNlIGlmKG5ld051bSA9PSBpbWFnZXNDb3VudCkge1xuICAgICAgICBuZXdQcmV2TnVtID0gbmV3TnVtIC0gMTtcbiAgICAgICAgbmV3TmV4dE51bSA9IDE7XG4gICAgICB9IGVsc2UgaWYobmV3TnVtID09IDEpIHtcbiAgICAgICAgbmV3UHJldk51bSA9IGltYWdlc0NvdW50O1xuICAgICAgICBuZXdOZXh0TnVtID0gbmV3TnVtICsgMTtcbiAgICAgIH1cblxuICAgICAgJCgnLnNsaWRlci1waG90b19faXRlbVtkYXRhLW51bT1cIicrY3VycmVudE51bSsnXCJdJykucmVtb3ZlQ2xhc3MoJ3NsaWRlci1waG90b19faXRlbV9hY3RpdmUnKTtcbiAgICAgICQoJy5zbGlkZXItcGhvdG9fX2l0ZW1bZGF0YS1udW09XCInK25ld051bSsnXCJdJykuYWRkQ2xhc3MoJ3NsaWRlci1waG90b19faXRlbV9hY3RpdmUnKVxuXG4gICAgICAkKCcuc2xpZGVyLW5hdl9fYnV0dG9uW2RhdGEtYXJyb3c9XCJ1cFwiXSAuc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbVtkYXRhLW51bT1cIicrbmV4dE51bSsnXCJdJykucmVtb3ZlQ2xhc3MoJ3NsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1fYWN0aXZlJyk7XG4gICAgICAkKCcuc2xpZGVyLW5hdl9fYnV0dG9uW2RhdGEtYXJyb3c9XCJ1cFwiXSAuc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbVtkYXRhLW51bT1cIicrbmV3TmV4dE51bSsnXCJdJykuYWRkQ2xhc3MoJ3NsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1fYWN0aXZlJyk7XG5cbiAgICAgICQoJy5zbGlkZXItbmF2X19idXR0b25bZGF0YS1hcnJvdz1cImRvd25cIl0gLnNsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1bZGF0YS1udW09XCInK3ByZXZOdW0rJ1wiXScpLnJlbW92ZUNsYXNzKCdzbGlkZXItYnV0dG9uLXBob3RvX19pdGVtX2FjdGl2ZScpXG4gICAgICAkKCcuc2xpZGVyLW5hdl9fYnV0dG9uW2RhdGEtYXJyb3c9XCJkb3duXCJdIC5zbGlkZXItYnV0dG9uLXBob3RvX19pdGVtW2RhdGEtbnVtPVwiJytuZXdQcmV2TnVtKydcIl0nKS5hZGRDbGFzcygnc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbV9hY3RpdmUnKVxuXG4gICAgfSk7XG5cbiAgICAkKCcuc2xpZGVyLXBob3RvX19pdGVtW2RhdGEtbnVtPVwiJytwcmV2TnVtKydcIl0nKS5yZW1vdmVDbGFzcygnc2xpZGVyLXBob3RvX19pdGVtX2FjdGl2ZScpO1xuICAgICQoJy5zbGlkZXItcGhvdG9fX2l0ZW1bZGF0YS1udW09XCInK2N1cnJlbnROdW0rJ1wiXScpLmFkZENsYXNzKCdzbGlkZXItcGhvdG9fX2l0ZW1fYWN0aXZlJylcblxuICAgICQoJy5zbGlkZXItbmF2X19idXR0b25bZGF0YS1hcnJvdz1cInVwXCJdIC5zbGlkZXItYnV0dG9uLXBob3RvX19pdGVtW2RhdGEtbnVtPVwiJytjdXJyZW50TnVtKydcIl0nKS5yZW1vdmVDbGFzcygnc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbV9hY3RpdmUnKTtcbiAgICAkKCcuc2xpZGVyLW5hdl9fYnV0dG9uW2RhdGEtYXJyb3c9XCJ1cFwiXSAuc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbVtkYXRhLW51bT1cIicrbmV4dE51bSsnXCJdJykuYWRkQ2xhc3MoJ3NsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1fYWN0aXZlJyk7XG5cbiAgICAkKCcuc2xpZGVyLW5hdl9fYnV0dG9uW2RhdGEtYXJyb3c9XCJkb3duXCJdIC5zbGlkZXItYnV0dG9uLXBob3RvX19pdGVtW2RhdGEtbnVtPVwiJytjdXJyZW50TnVtKydcIl0nKS5yZW1vdmVDbGFzcygnc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbV9hY3RpdmUnKVxuICAgICQoJy5zbGlkZXItbmF2X19idXR0b25bZGF0YS1hcnJvdz1cImRvd25cIl0gLnNsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1bZGF0YS1udW09XCInK3ByZXZOdW0rJ1wiXScpLmFkZENsYXNzKCdzbGlkZXItYnV0dG9uLXBob3RvX19pdGVtX2FjdGl2ZScpXG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
