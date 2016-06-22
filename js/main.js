
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
        if($(window).width() > 480) {
          $('.blog__chapters').removeClass('blog__chapters_fixed');
          $(this).data('swiped', false);
        }
      }
    });

    $(window).on('resize', function (e) {
      $('.blog__chapters').data('swiped', false);
      $('.blog__chapters').removeClass('blog__chapters_showed');
    })

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdvb2dsZS1tYXBzLmpzIiwibWFpbi5qcyIsInByZWxvYWRlci5qcyIsInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiAtLS0tLSBHb29nbGUgbWFwcyAtLS0tLS0tLVxuICogPT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuZnVuY3Rpb24gaW5pdE1hcCgpIHtcblxuICBpZigkKCcjbWFwLWJveCcpLmxlbmd0aCA9PSAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIENyZWF0ZSBhbiBhcnJheSBvZiBzdHlsZXMuXG4gIHZhciBzdHlsZXMgPSBbe1wiZmVhdHVyZVR5cGVcIjpcImFkbWluaXN0cmF0aXZlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHQuZmlsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzQ0NDQ0NFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiNmMmYyZjJcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicG9pXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInNhdHVyYXRpb25cIjotMTAwfSx7XCJsaWdodG5lc3NcIjo0NX1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZC5oaWdod2F5XCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcInNpbXBsaWZpZWRcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZC5hcnRlcmlhbFwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy5pY29uXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJ0cmFuc2l0XCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJ3YXRlclwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiI2U3YTczMVwifSx7XCJ2aXNpYmlsaXR5XCI6XCJvblwifV19XVxuXG4gIC8vIENyZWF0ZSBhIG5ldyBTdHlsZWRNYXBUeXBlIG9iamVjdCwgcGFzc2luZyBpdCB0aGUgYXJyYXkgb2Ygc3R5bGVzLFxuICAvLyBhcyB3ZWxsIGFzIHRoZSBuYW1lIHRvIGJlIGRpc3BsYXllZCBvbiB0aGUgbWFwIHR5cGUgY29udHJvbC5cbiAgdmFyIHN0eWxlZE1hcCA9IG5ldyBnb29nbGUubWFwcy5TdHlsZWRNYXBUeXBlKHN0eWxlcyxcbiAgICAgIHtuYW1lOiBcIlN0eWxlZCBNYXBcIn0pO1xuXG4gIC8vIENyZWF0ZSBhIG1hcCBvYmplY3QsIGFuZCBpbmNsdWRlIHRoZSBNYXBUeXBlSWQgdG8gYWRkXG4gIC8vIHRvIHRoZSBtYXAgdHlwZSBjb250cm9sLlxuICB2YXIgbWFwT3B0aW9ucyA9IHtcbiAgICBzY3JvbGx3aGVlbDogZmFsc2UsXG4gICAgem9vbTogMTEsXG4gICAgY2VudGVyOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDQ2LjUwLDMwLjc0NzE5ODUpLFxuICAgIG1hcFR5cGVDb250cm9sT3B0aW9uczoge1xuICAgICAgbWFwVHlwZUlkczogW2dvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLCAnbWFwX3N0eWxlJ11cbiAgICB9XG4gIH07XG4gIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtYm94JyksXG4gICAgICBtYXBPcHRpb25zKTtcblxuICAvL0Fzc29jaWF0ZSB0aGUgc3R5bGVkIG1hcCB3aXRoIHRoZSBNYXBUeXBlSWQgYW5kIHNldCBpdCB0byBkaXNwbGF5LlxuICBtYXAubWFwVHlwZXMuc2V0KCdtYXBfc3R5bGUnLCBzdHlsZWRNYXApO1xuICBtYXAuc2V0TWFwVHlwZUlkKCdtYXBfc3R5bGUnKTtcblxuICB2YXIgaW1hZ2UgPSB7XG4gICAgdXJsOiBcIi4uL2ltZy9tYXBfbWFya2VyLnN2Z1wiLFxuICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDUwLCA3MS40NilcbiAgfTtcblxuICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgcG9zaXRpb246IHtsYXQ6IDQ2LjQzMjI5MzksIGxuZzogMzAuNzI3MTk4NX0sXG4gICAgaWNvbjogaW1hZ2VcbiAgfSk7XG5cbiAgLy8gVG8gYWRkIHRoZSBtYXJrZXIgdG8gdGhlIG1hcCwgY2FsbCBzZXRNYXAoKTtcbiAgbWFya2VyLnNldE1hcChtYXApO1xufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbigkKSB7XG5cbiAgLy8gYWRhcHRpdmUgaGVpZ2h0IG9mIGhlYWRlclxuICBpZigkKCcuaGVhZGVyJykubGVuZ3RoID4gMCkge1xuICAgIHZhciBtaW5faGVpZ2h0ID0gNjUwO1xuICAgIHZhciBuZXdfaGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuXG4gICAgaWYgKCQod2luZG93KS5oZWlnaHQoKSA+IG1pbl9oZWlnaHQpIHtcbiAgICAgIG5ld19oZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KClcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3X2hlaWdodCA9IG1pbl9oZWlnaHQ7XG4gICAgfVxuXG4gICAgJCgnLmhlYWRlcicpLmNzcyh7XG4gICAgICBoZWlnaHQ6IG5ld19oZWlnaHRcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGZsaXAgbG9naW4gYm94XG4gICQoJyNoZWFkZXJfX2xvZ2luLWJ0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAvLyAkKCcuZmxpcHBlcicpLmFkZENsYXNzKCdmbGlwcGVkJyk7XG4gICAgJCgnLmxvZ2luLWJveCcpLmFkZENsYXNzKCdsb2dpbi1ib3hfZmxpcHBlZCcpO1xuICAgICQoJy53ZWxjb21lLWJveCcpLmFkZENsYXNzKCd3ZWxjb21lLWJveF9mbGlwcGVkJyk7XG4gICAgJCgnLmxvZ2luLWZvcm1fX2lucHV0W25hbWU9bG9naW5dJykuZm9jdXMoKVxuICAgICQodGhpcykuZmFkZU91dCgpXG4gIH0pO1xuXG4gIC8vIGZsaXAtYmFjayBsb2dpbiBib3hcbiAgJCgnLmxvZ2luLWZvcm1fX2xibCcpLmtleXVwKGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKCBlLmtleUNvZGUgPT0gMzIgfHwgZS5rZXlDb2RlID09IDEzICkge1xuICAgICAgJCh0aGlzKS5jbGljaygpO1xuICAgIH1cbiAgfSk7XG5cbiAgJCgnYm9keSwgI2xvZ2luLW5hdl9faG9tZScpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgaWYoICQoZS50YXJnZXQpLnBhcmVudHMoJy5mbGlwLWNvbnRhaW5lcicpLmxlbmd0aCA9PSAwIHx8ICQoZS50YXJnZXQpLmF0dHIoJ2lkJykgPT09ICdsb2dpbi1uYXZfX2hvbWUnKSB7XG4gICAgICAkKCcuZmxpcHBlcicpLnJlbW92ZUNsYXNzKCdmbGlwcGVkJyk7XG4gICAgICAkKCcubG9naW4tYm94JykucmVtb3ZlQ2xhc3MoJ2xvZ2luLWJveF9mbGlwcGVkJyk7XG4gICAgICAkKCcud2VsY29tZS1ib3gnKS5yZW1vdmVDbGFzcygnd2VsY29tZS1ib3hfZmxpcHBlZCcpO1xuICAgICAgJCgnI2hlYWRlcl9fbG9naW4tYnRuJykuZmFkZUluKClcbiAgICB9XG4gIH0pO1xuXG4gIC8vIHNtb290aCBzY3JvbGxcbiAgJCgnI2Fycm93LWRvd24sICNhcnJvdy11cCwgLmNoYXB0ZXJzX19saW5rJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxUb3A6ICQoICQuYXR0cih0aGlzLCAnaHJlZicpICkub2Zmc2V0KCkudG9wXG4gICAgfSwgMTAwMCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcblxuICAkKCcuY2hhcHRlcnNfX2xpbmsnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogJCggJC5hdHRyKHRoaXMsICdocmVmJykgKS5vZmZzZXQoKS50b3BcbiAgICB9LCAxMDAwKTtcbiAgICAoICQoJy5ibG9nX19jaGFwdGVycycpLmxlbmd0aCAmJiAkKCcuYmxvZ19fY2hhcHRlcnMnKS5jbGljaygpIClcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIC8vINCf0LXRgNC10YXQvtC0INC/0L4g0Y/QutC+0YDRjiDQvdCwINC00YDRg9Cz0L7QuSDRgdGC0YDQsNC90LjRhtC1XG4gIGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoICE9PSAnJykge1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogJCggd2luZG93LmxvY2F0aW9uLmhhc2ggKS5vZmZzZXQoKS50b3AgKyA0MFxuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgLy8gb3BlbiBvdmVybGF5IG1lbnVcbiAgJCgnI29wZW4tb3ZlcmxheS1tZW51JykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICQoJy5vdmVybGF5LW1lbnUnKS5jc3Moe1xuICAgICAgZGlzcGxheTogXCJibG9ja1wiXG4gICAgfSk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcub3ZlcmxheS1tZW51JykuY3NzKHtcbiAgICAgICAgb3BhY2l0eTogMVxuICAgICAgfSlcbiAgICB9LCAxMClcbiAgfSk7XG5cbiAgLy9jbG9zZSBvdmVybGF5IG1lbnVcbiAgJCgnI292ZXJsYXktY2xvc2UnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICAgIG9wYWNpdHk6IDBcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJy5vdmVybGF5LW1lbnUnKS5jc3Moe1xuICAgICAgICBkaXNwbGF5OiBcIm5vbmVcIlxuICAgICAgfSlcbiAgICB9LCA1MDApXG4gIH0pO1xuXG4gIC8vIGZpeGVkIGJsb2cgY2hhcHRlcnNcbiAgaWYoJCgnLmJsb2dfX2NoYXB0ZXJzJykubGVuZ3RoID4gMCkge1xuICAgIHZhciBzY3JvbGxfcG9pbnQgPSAkKCcuYmxvZ19fY2hhcHRlcnMnKS5vZmZzZXQoKS50b3AgLSA3MDtcbiAgICB2YXIgZml4ZWRfZmxhZyA9IGZhbHNlO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIGJvZHlfc2Nyb2xsVG9wID0gJCgnYm9keScpLnNjcm9sbFRvcCgpO1xuXG4gICAgICBpZiggYm9keV9zY3JvbGxUb3AgPj0gc2Nyb2xsX3BvaW50KSB7XG5cbiAgICAgICAgaWYoIWZpeGVkX2ZsYWcpIHtcbiAgICAgICAgICBmaXhlZF9mbGFnID0gdHJ1ZTtcblxuICAgICAgICAgICQoJy5ibG9nX19jaGFwdGVycycpLmFkZENsYXNzKCdibG9nX19jaGFwdGVyc19maXhlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnLmJsb2dfX2FydGljbGUnKS5lYWNoKGZ1bmN0aW9uIChpLCBpdGVtKSB7XG5cbiAgICAgICAgICBpZiggYm9keV9zY3JvbGxUb3AgPj0gJChpdGVtKS5vZmZzZXQoKS50b3AgLSAzNSAmJlxuICAgICAgICAgICAgICBib2R5X3Njcm9sbFRvcCA8PSAkKGl0ZW0pLm9mZnNldCgpLnRvcCArICQoaXRlbSkuaGVpZ2h0KCkgKyAzNSkge1xuXG4gICAgICAgICAgICB2YXIgYWN0aXZlSWQgPSAkKGl0ZW0pLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgICAgICQoJy5jaGFwdGVyc19faXRlbScpLnJlbW92ZUNsYXNzKCdjaGFwdGVyc19faXRlbV9hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5jaGFwdGVyc19fbGlua1tocmVmPVwiIycrYWN0aXZlSWQrJ1wiXScpLnBhcmVudCgpLmFkZENsYXNzKCdjaGFwdGVyc19faXRlbV9hY3RpdmUnKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZml4ZWRfZmxhZyA9IGZhbHNlO1xuICAgICAgICBpZigkKHdpbmRvdykud2lkdGgoKSA+IDQ4MCkge1xuICAgICAgICAgICQoJy5ibG9nX19jaGFwdGVycycpLnJlbW92ZUNsYXNzKCdibG9nX19jaGFwdGVyc19maXhlZCcpO1xuICAgICAgICAgICQodGhpcykuZGF0YSgnc3dpcGVkJywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKCcuYmxvZ19fY2hhcHRlcnMnKS5kYXRhKCdzd2lwZWQnLCBmYWxzZSk7XG4gICAgICAkKCcuYmxvZ19fY2hhcHRlcnMnKS5yZW1vdmVDbGFzcygnYmxvZ19fY2hhcHRlcnNfc2hvd2VkJyk7XG4gICAgfSlcblxuICAgICQoJy5ibG9nX19jaGFwdGVycycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmKCAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcpID09IGZhbHNlICkge1xuICAgICAgICAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcsIHRydWUpO1xuICAgICAgICAkKCcuYmxvZ19fY2hhcHRlcnMnKS5hZGRDbGFzcygnYmxvZ19fY2hhcHRlcnNfc2hvd2VkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcsIGZhbHNlKTtcbiAgICAgICAgJCgnLmJsb2dfX2NoYXB0ZXJzJykucmVtb3ZlQ2xhc3MoJ2Jsb2dfX2NoYXB0ZXJzX3Nob3dlZCcpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBza2lsbHMgY29sb3JpZnlcbiAgaWYoJCgnLnNraWxsJykubGVuZ3RoID4gMCkge1xuICAgICQuZWFjaCgkKCcuc2tpbGwtZGlhZ3JhbV9fc3ZnJyksIGZ1bmN0aW9uIChpLCBpdGVtKSB7XG4gICAgICB2YXIgbHZsID0gJChpdGVtKS5kYXRhKCdsdmwnKTtcbiAgICAgIHZhciBhcmNMZW5ndGggPSBsdmwvMTAwICogMjgyLjY7XG5cbiAgICAgICQodGhpcykuY2hpbGRyZW4oJy5za2lsbC1kaWFncmFtX19yaW5nJykuY3NzKHtcbiAgICAgICAgXCJzdHJva2UtZGFzaGFycmF5XCI6IGFyY0xlbmd0aCArIFwiIDI4Mi42XCIsXG4gICAgICAgIFwic3Ryb2tlLW9wYWNpdHlcIjogbHZsLzEwMFxuICAgICAgfSlcbiAgICAgIFxuICAgIH0pXG4gIH1cbiAgXG5cbn0pKGpRdWVyeSk7XG5cblxuXG5cbiIsIlxuLyoqID09PT09PT09PT09PT09PT09PT09PT09XG4gKiAtLS0tLSBQcmVsb2FkZXIgLS0tLS0tLS1cbiAqID09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuOyB2YXIgUHJlbG9hZGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHdyYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlbG9hZGVyJyk7XG4gIHZhciBjb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZWxvYWRlci1jb3VudGVyJyk7XG4gIHZhciB0aWNrID0gMDtcbiAgdmFyIHNwZWVkID0gMTtcbiAgdmFyIHRpbWVyO1xuXG4gIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgdGljayArPSBzcGVlZDtcblxuICAgIGlmKHRpY2sgPj0gMTAwKSB7XG4gICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgIHRpY2sgPSAxMDA7XG4gICAgfVxuXG4gICAgY291bnRlci5pbm5lckhUTUwgPSB0aWNrXG4gIH0sIDEwMCk7XG5cbiAgd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHNwZWVkID0gMTA7XG4gICAgY291bnRlci5pbm5lckhUTUwgPSBcIjEwMFwiO1xuICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgIHdyYXAuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB3cmFwLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9LCA1MDApXG4gIH07XG59KSgpOyIsIlxuLyoqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogLS0tLS0gTW9kdWxlIC0gU2xpZGVyIGZvciBwcm9qZWN0cyAtLS0tLS0tLVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG47IHZhciBzbGlkZXJQb3J0Zm9saW8gPSAoZnVuY3Rpb24gKCkge1xuXG4gICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBzbGlkZXJJdGVtczogJy5zbGlkZXItcGhvdG9fX2l0ZW0nLFxuICAgICAgZmlyc3RTbGlkZU51bTogMVxuICAgIH07XG5cbiAgICB2YXIgY3VycmVudE51bSA9IGRlZmF1bHRzLmZpcnN0U2xpZGVOdW0sXG4gICAgICAgIHByZXZOdW0sICAgIC8vINC/0YDQtdC00YvQtNGD0YnQuNC5INC90L7QvNC10YAg0L3QsCDQutC90L7Qv9C60LUgRE9XTiDQsiDQvNC+0LzQtdC90YIg0L/QtdGA0LrQu9GO0YfQtdC90LjRjyDRgdC70LDQudC00LBcbiAgICAgICAgbmV4dE51bSwgICAgLy8g0YHQu9C10LTRg9GO0YnQuNC5INC90L7QvNC10YAg0L3QsCDQutC90L7Qv9C60LUgVVAg0LIg0LzQvtC80LXQvdGCINC/0LXRgNC60LvRjtGH0LXQvdC40Y8g0YHQu9Cw0LnQtNCwXG4gICAgICAgIG5ld051bSwgICAgIC8vINC90L7QstGL0Lkg0L3QvtC80LXRgCAtINC/0L7RgdC70LUg0YHQvNC10L3RiyDRgdC70LDQudC00LBcbiAgICAgICAgbmV3UHJldk51bSwgLy8g0L3QvtCy0YvQuSDQvdC+0LzQtdGAINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0YHQu9Cw0LnQtNCwIC0g0L/QvtGB0LvQtSDRgdC80LXQvdGLINGB0LvQsNC50LTQsFxuICAgICAgICBuZXdOZXh0TnVtLCAvLyDQvdC+0LLRi9C5INC90L7QvNC10YAg0YHQu9C10LTRg9GO0YnQtdCz0L4g0YHQu9Cw0LnQtNCwIC0g0L/QvtGB0LvQtSDRgdC80LXQvdGLINGB0LvQsNC50LTQsFxuICAgICAgICBpbWFnZXNDb3VudCA9ICQoZGVmYXVsdHMuc2xpZGVySXRlbXMpLmxlbmd0aDtcblxuICAgIGlmKGN1cnJlbnROdW0gPCBpbWFnZXNDb3VudCAmJiBjdXJyZW50TnVtID4gMSkge1xuICAgICAgcHJldk51bSA9IGN1cnJlbnROdW0gLSAxO1xuICAgICAgbmV4dE51bSA9IGN1cnJlbnROdW0gKyAxO1xuICAgIH0gZWxzZSBpZihjdXJyZW50TnVtID09IGltYWdlc0NvdW50KSB7XG4gICAgICBwcmV2TnVtID0gY3VycmVudE51bSAtIDE7XG4gICAgICBuZXh0TnVtID0gMTtcbiAgICB9IGVsc2UgaWYoY3VycmVudE51bSA9PSAxKSB7XG4gICAgICBwcmV2TnVtID0gaW1hZ2VzQ291bnQ7XG4gICAgICBuZXh0TnVtID0gY3VycmVudE51bSArIDE7XG4gICAgfVxuXG5cbiAgICAkKCcuc2xpZGVyLW5hdl9fYnV0dG9uJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY3VycmVudE51bSA9ICQoJy5zbGlkZXItcGhvdG9fX2l0ZW1fYWN0aXZlJykuZGF0YSgnbnVtJyk7XG5cbiAgICAgIGlmKGN1cnJlbnROdW0gPCBpbWFnZXNDb3VudCAmJiBjdXJyZW50TnVtID4gMSkge1xuICAgICAgICBwcmV2TnVtID0gY3VycmVudE51bSAtIDE7XG4gICAgICAgIG5leHROdW0gPSBjdXJyZW50TnVtICsgMTtcbiAgICAgIH0gZWxzZSBpZihjdXJyZW50TnVtID09IGltYWdlc0NvdW50KSB7XG4gICAgICAgIHByZXZOdW0gPSBjdXJyZW50TnVtIC0gMTtcbiAgICAgICAgbmV4dE51bSA9IDE7XG4gICAgICB9IGVsc2UgaWYoY3VycmVudE51bSA9PSAxKSB7XG4gICAgICAgIHByZXZOdW0gPSBpbWFnZXNDb3VudDtcbiAgICAgICAgbmV4dE51bSA9IGN1cnJlbnROdW0gKyAxO1xuICAgICAgfVxuXG4gICAgICBpZiggJCh0aGlzKS5kYXRhKCdhcnJvdycpID09ICd1cCcgKSB7XG4gICAgICAgIGlmKHBhcnNlSW50KGN1cnJlbnROdW0pIDwgaW1hZ2VzQ291bnQpIHtcbiAgICAgICAgICBuZXdOdW0gPSBjdXJyZW50TnVtICsgMTtcbiAgICAgICAgfSBlbHNlIGlmKHBhcnNlSW50KGN1cnJlbnROdW0pID09IGltYWdlc0NvdW50KSB7XG4gICAgICAgICAgbmV3TnVtID0gMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYocGFyc2VJbnQoY3VycmVudE51bSkgPT0gMSkge1xuICAgICAgICAgIG5ld051bSA9IGltYWdlc0NvdW50O1xuICAgICAgICB9IGVsc2UgaWYocGFyc2VJbnQoY3VycmVudE51bSkgPD0gaW1hZ2VzQ291bnQpIHtcbiAgICAgICAgICBuZXdOdW0gPSBjdXJyZW50TnVtIC0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZihuZXdOdW0gPCBpbWFnZXNDb3VudCAmJiBuZXdOdW0gPiAxKSB7XG4gICAgICAgIG5ld1ByZXZOdW0gPSBuZXdOdW0gLSAxO1xuICAgICAgICBuZXdOZXh0TnVtID0gbmV3TnVtICsgMTtcbiAgICAgIH0gZWxzZSBpZihuZXdOdW0gPT0gaW1hZ2VzQ291bnQpIHtcbiAgICAgICAgbmV3UHJldk51bSA9IG5ld051bSAtIDE7XG4gICAgICAgIG5ld05leHROdW0gPSAxO1xuICAgICAgfSBlbHNlIGlmKG5ld051bSA9PSAxKSB7XG4gICAgICAgIG5ld1ByZXZOdW0gPSBpbWFnZXNDb3VudDtcbiAgICAgICAgbmV3TmV4dE51bSA9IG5ld051bSArIDE7XG4gICAgICB9XG5cbiAgICAgICQoJy5zbGlkZXItcGhvdG9fX2l0ZW1bZGF0YS1udW09XCInK2N1cnJlbnROdW0rJ1wiXScpLnJlbW92ZUNsYXNzKCdzbGlkZXItcGhvdG9fX2l0ZW1fYWN0aXZlJyk7XG4gICAgICAkKCcuc2xpZGVyLXBob3RvX19pdGVtW2RhdGEtbnVtPVwiJytuZXdOdW0rJ1wiXScpLmFkZENsYXNzKCdzbGlkZXItcGhvdG9fX2l0ZW1fYWN0aXZlJylcblxuICAgICAgJCgnLnNsaWRlci1uYXZfX2J1dHRvbltkYXRhLWFycm93PVwidXBcIl0gLnNsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1bZGF0YS1udW09XCInK25leHROdW0rJ1wiXScpLnJlbW92ZUNsYXNzKCdzbGlkZXItYnV0dG9uLXBob3RvX19pdGVtX2FjdGl2ZScpO1xuICAgICAgJCgnLnNsaWRlci1uYXZfX2J1dHRvbltkYXRhLWFycm93PVwidXBcIl0gLnNsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1bZGF0YS1udW09XCInK25ld05leHROdW0rJ1wiXScpLmFkZENsYXNzKCdzbGlkZXItYnV0dG9uLXBob3RvX19pdGVtX2FjdGl2ZScpO1xuXG4gICAgICAkKCcuc2xpZGVyLW5hdl9fYnV0dG9uW2RhdGEtYXJyb3c9XCJkb3duXCJdIC5zbGlkZXItYnV0dG9uLXBob3RvX19pdGVtW2RhdGEtbnVtPVwiJytwcmV2TnVtKydcIl0nKS5yZW1vdmVDbGFzcygnc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbV9hY3RpdmUnKVxuICAgICAgJCgnLnNsaWRlci1uYXZfX2J1dHRvbltkYXRhLWFycm93PVwiZG93blwiXSAuc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbVtkYXRhLW51bT1cIicrbmV3UHJldk51bSsnXCJdJykuYWRkQ2xhc3MoJ3NsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1fYWN0aXZlJylcblxuICAgIH0pO1xuXG4gICAgJCgnLnNsaWRlci1waG90b19faXRlbVtkYXRhLW51bT1cIicrcHJldk51bSsnXCJdJykucmVtb3ZlQ2xhc3MoJ3NsaWRlci1waG90b19faXRlbV9hY3RpdmUnKTtcbiAgICAkKCcuc2xpZGVyLXBob3RvX19pdGVtW2RhdGEtbnVtPVwiJytjdXJyZW50TnVtKydcIl0nKS5hZGRDbGFzcygnc2xpZGVyLXBob3RvX19pdGVtX2FjdGl2ZScpXG5cbiAgICAkKCcuc2xpZGVyLW5hdl9fYnV0dG9uW2RhdGEtYXJyb3c9XCJ1cFwiXSAuc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbVtkYXRhLW51bT1cIicrY3VycmVudE51bSsnXCJdJykucmVtb3ZlQ2xhc3MoJ3NsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1fYWN0aXZlJyk7XG4gICAgJCgnLnNsaWRlci1uYXZfX2J1dHRvbltkYXRhLWFycm93PVwidXBcIl0gLnNsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1bZGF0YS1udW09XCInK25leHROdW0rJ1wiXScpLmFkZENsYXNzKCdzbGlkZXItYnV0dG9uLXBob3RvX19pdGVtX2FjdGl2ZScpO1xuXG4gICAgJCgnLnNsaWRlci1uYXZfX2J1dHRvbltkYXRhLWFycm93PVwiZG93blwiXSAuc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbVtkYXRhLW51bT1cIicrY3VycmVudE51bSsnXCJdJykucmVtb3ZlQ2xhc3MoJ3NsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1fYWN0aXZlJylcbiAgICAkKCcuc2xpZGVyLW5hdl9fYnV0dG9uW2RhdGEtYXJyb3c9XCJkb3duXCJdIC5zbGlkZXItYnV0dG9uLXBob3RvX19pdGVtW2RhdGEtbnVtPVwiJytwcmV2TnVtKydcIl0nKS5hZGRDbGFzcygnc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbV9hY3RpdmUnKVxuXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
