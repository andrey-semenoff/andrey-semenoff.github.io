
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
    center: new google.maps.LatLng(46.4722939,30.7471985),
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
    position: {lat: 46.4722939, lng: 30.7471985},
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
    $('.flipper').addClass('flipped');
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

          $('.blog__chapters').css({
            position: "fixed",
            top: "70px",
            left: 0
          })
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
        $('.blog__chapters').css({
          position: "static"
        })
      }
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdvb2dsZS1tYXBzLmpzIiwibWFpbi5qcyIsInByZWxvYWRlci5qcyIsInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKiogPT09PT09PT09PT09PT09PT09PT09PT09PVxuICogLS0tLS0gR29vZ2xlIG1hcHMgLS0tLS0tLS1cbiAqID09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmZ1bmN0aW9uIGluaXRNYXAoKSB7XG5cbiAgaWYoJCgnI21hcC1ib3gnKS5sZW5ndGggPT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBDcmVhdGUgYW4gYXJyYXkgb2Ygc3R5bGVzLlxuICB2YXIgc3R5bGVzID0gW3tcImZlYXR1cmVUeXBlXCI6XCJhZG1pbmlzdHJhdGl2ZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0LmZpbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiM0NDQ0NDRcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjZjJmMmYyXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInBvaVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJzYXR1cmF0aW9uXCI6LTEwMH0se1wibGlnaHRuZXNzXCI6NDV9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuaGlnaHdheVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJzaW1wbGlmaWVkXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuYXJ0ZXJpYWxcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMuaWNvblwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwidHJhbnNpdFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwid2F0ZXJcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiNlN2E3MzFcIn0se1widmlzaWJpbGl0eVwiOlwib25cIn1dfV1cblxuICAvLyBDcmVhdGUgYSBuZXcgU3R5bGVkTWFwVHlwZSBvYmplY3QsIHBhc3NpbmcgaXQgdGhlIGFycmF5IG9mIHN0eWxlcyxcbiAgLy8gYXMgd2VsbCBhcyB0aGUgbmFtZSB0byBiZSBkaXNwbGF5ZWQgb24gdGhlIG1hcCB0eXBlIGNvbnRyb2wuXG4gIHZhciBzdHlsZWRNYXAgPSBuZXcgZ29vZ2xlLm1hcHMuU3R5bGVkTWFwVHlwZShzdHlsZXMsXG4gICAgICB7bmFtZTogXCJTdHlsZWQgTWFwXCJ9KTtcblxuICAvLyBDcmVhdGUgYSBtYXAgb2JqZWN0LCBhbmQgaW5jbHVkZSB0aGUgTWFwVHlwZUlkIHRvIGFkZFxuICAvLyB0byB0aGUgbWFwIHR5cGUgY29udHJvbC5cbiAgdmFyIG1hcE9wdGlvbnMgPSB7XG4gICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgIHpvb206IDExLFxuICAgIGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyg0Ni40NzIyOTM5LDMwLjc0NzE5ODUpLFxuICAgIG1hcFR5cGVDb250cm9sT3B0aW9uczoge1xuICAgICAgbWFwVHlwZUlkczogW2dvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLCAnbWFwX3N0eWxlJ11cbiAgICB9XG4gIH07XG4gIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtYm94JyksXG4gICAgICBtYXBPcHRpb25zKTtcblxuICAvL0Fzc29jaWF0ZSB0aGUgc3R5bGVkIG1hcCB3aXRoIHRoZSBNYXBUeXBlSWQgYW5kIHNldCBpdCB0byBkaXNwbGF5LlxuICBtYXAubWFwVHlwZXMuc2V0KCdtYXBfc3R5bGUnLCBzdHlsZWRNYXApO1xuICBtYXAuc2V0TWFwVHlwZUlkKCdtYXBfc3R5bGUnKTtcblxuICB2YXIgaW1hZ2UgPSB7XG4gICAgdXJsOiBcIi4uL2ltZy9tYXBfbWFya2VyLnN2Z1wiLFxuICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDUwLCA3MS40NilcbiAgfTtcblxuICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgcG9zaXRpb246IHtsYXQ6IDQ2LjQ3MjI5MzksIGxuZzogMzAuNzQ3MTk4NX0sXG4gICAgaWNvbjogaW1hZ2VcbiAgfSk7XG5cbiAgLy8gVG8gYWRkIHRoZSBtYXJrZXIgdG8gdGhlIG1hcCwgY2FsbCBzZXRNYXAoKTtcbiAgbWFya2VyLnNldE1hcChtYXApO1xufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbigkKSB7XG5cbiAgLy8gYWRhcHRpdmUgaGVpZ2h0IG9mIGhlYWRlclxuICBpZigkKCcuaGVhZGVyJykubGVuZ3RoID4gMCkge1xuICAgIHZhciBtaW5faGVpZ2h0ID0gNjUwO1xuICAgIHZhciBuZXdfaGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuXG4gICAgaWYgKCQod2luZG93KS5oZWlnaHQoKSA+IG1pbl9oZWlnaHQpIHtcbiAgICAgIG5ld19oZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KClcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3X2hlaWdodCA9IG1pbl9oZWlnaHQ7XG4gICAgfVxuXG4gICAgJCgnLmhlYWRlcicpLmNzcyh7XG4gICAgICBoZWlnaHQ6IG5ld19oZWlnaHRcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGZsaXAgbG9naW4gYm94XG4gICQoJyNoZWFkZXJfX2xvZ2luLWJ0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAkKCcuZmxpcHBlcicpLmFkZENsYXNzKCdmbGlwcGVkJyk7XG4gICAgJCgnLmxvZ2luLWZvcm1fX2lucHV0W25hbWU9bG9naW5dJykuZm9jdXMoKVxuICAgICQodGhpcykuZmFkZU91dCgpXG4gIH0pO1xuXG4gIC8vIGZsaXAtYmFjayBsb2dpbiBib3hcbiAgJCgnLmxvZ2luLWZvcm1fX2xibCcpLmtleXVwKGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKCBlLmtleUNvZGUgPT0gMzIgfHwgZS5rZXlDb2RlID09IDEzICkge1xuICAgICAgJCh0aGlzKS5jbGljaygpO1xuICAgIH1cbiAgfSk7XG5cbiAgJCgnYm9keSwgI2xvZ2luLW5hdl9faG9tZScpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgaWYoICQoZS50YXJnZXQpLnBhcmVudHMoJy5mbGlwLWNvbnRhaW5lcicpLmxlbmd0aCA9PSAwIHx8ICQoZS50YXJnZXQpLmF0dHIoJ2lkJykgPT09ICdsb2dpbi1uYXZfX2hvbWUnKSB7XG4gICAgICAkKCcuZmxpcHBlcicpLnJlbW92ZUNsYXNzKCdmbGlwcGVkJyk7XG4gICAgICAkKCcjaGVhZGVyX19sb2dpbi1idG4nKS5mYWRlSW4oKVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gc21vb3RoIHNjcm9sbFxuICAkKCcjYXJyb3ctZG93biwgI2Fycm93LXVwLCAuY2hhcHRlcnNfX2xpbmsnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogJCggJC5hdHRyKHRoaXMsICdocmVmJykgKS5vZmZzZXQoKS50b3BcbiAgICB9LCAxMDAwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuXG4gIC8vIG9wZW4gb3ZlcmxheSBtZW51XG4gICQoJyNvcGVuLW92ZXJsYXktbWVudScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAkKCcub3ZlcmxheS1tZW51JykuY3NzKHtcbiAgICAgIGRpc3BsYXk6IFwiYmxvY2tcIlxuICAgIH0pO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICAgIH0pXG4gICAgfSwgMTApXG4gIH0pO1xuXG4gIC8vY2xvc2Ugb3ZlcmxheSBtZW51XG4gICQoJyNvdmVybGF5LWNsb3NlJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICQoJy5vdmVybGF5LW1lbnUnKS5jc3Moe1xuICAgICAgICBvcGFjaXR5OiAwXG4gICAgfSk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcub3ZlcmxheS1tZW51JykuY3NzKHtcbiAgICAgICAgZGlzcGxheTogXCJub25lXCJcbiAgICAgIH0pXG4gICAgfSwgNTAwKVxuICB9KTtcblxuICAvLyBmaXhlZCBibG9nIGNoYXB0ZXJzXG4gIGlmKCQoJy5ibG9nX19jaGFwdGVycycpLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgc2Nyb2xsX3BvaW50ID0gJCgnLmJsb2dfX2NoYXB0ZXJzJykub2Zmc2V0KCkudG9wIC0gNzA7XG4gICAgdmFyIGZpeGVkX2ZsYWcgPSBmYWxzZTtcblxuICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciBib2R5X3Njcm9sbFRvcCA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcblxuICAgICAgaWYoIGJvZHlfc2Nyb2xsVG9wID49IHNjcm9sbF9wb2ludCkge1xuXG4gICAgICAgIGlmKCFmaXhlZF9mbGFnKSB7XG4gICAgICAgICAgZml4ZWRfZmxhZyA9IHRydWU7XG5cbiAgICAgICAgICAkKCcuYmxvZ19fY2hhcHRlcnMnKS5jc3Moe1xuICAgICAgICAgICAgcG9zaXRpb246IFwiZml4ZWRcIixcbiAgICAgICAgICAgIHRvcDogXCI3MHB4XCIsXG4gICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5ibG9nX19hcnRpY2xlJykuZWFjaChmdW5jdGlvbiAoaSwgaXRlbSkge1xuXG4gICAgICAgICAgaWYoIGJvZHlfc2Nyb2xsVG9wID49ICQoaXRlbSkub2Zmc2V0KCkudG9wIC0gMzUgJiZcbiAgICAgICAgICAgICAgYm9keV9zY3JvbGxUb3AgPD0gJChpdGVtKS5vZmZzZXQoKS50b3AgKyAkKGl0ZW0pLmhlaWdodCgpICsgMzUpIHtcblxuICAgICAgICAgICAgdmFyIGFjdGl2ZUlkID0gJChpdGVtKS5hdHRyKFwiaWRcIik7XG4gICAgICAgICAgICAkKCcuY2hhcHRlcnNfX2l0ZW0nKS5yZW1vdmVDbGFzcygnY2hhcHRlcnNfX2l0ZW1fYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuY2hhcHRlcnNfX2xpbmtbaHJlZj1cIiMnK2FjdGl2ZUlkKydcIl0nKS5wYXJlbnQoKS5hZGRDbGFzcygnY2hhcHRlcnNfX2l0ZW1fYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpeGVkX2ZsYWcgPSBmYWxzZTtcbiAgICAgICAgJCgnLmJsb2dfX2NoYXB0ZXJzJykuY3NzKHtcbiAgICAgICAgICBwb3NpdGlvbjogXCJzdGF0aWNcIlxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gc2tpbGxzIGNvbG9yaWZ5XG4gIGlmKCQoJy5za2lsbCcpLmxlbmd0aCA+IDApIHtcbiAgICAkLmVhY2goJCgnLnNraWxsLWRpYWdyYW1fX3N2ZycpLCBmdW5jdGlvbiAoaSwgaXRlbSkge1xuICAgICAgdmFyIGx2bCA9ICQoaXRlbSkuZGF0YSgnbHZsJyk7XG4gICAgICB2YXIgYXJjTGVuZ3RoID0gbHZsLzEwMCAqIDI4Mi42O1xuXG4gICAgICAkKHRoaXMpLmNoaWxkcmVuKCcuc2tpbGwtZGlhZ3JhbV9fcmluZycpLmNzcyh7XG4gICAgICAgIFwic3Ryb2tlLWRhc2hhcnJheVwiOiBhcmNMZW5ndGggKyBcIiAyODIuNlwiLFxuICAgICAgICBcInN0cm9rZS1vcGFjaXR5XCI6IGx2bC8xMDBcbiAgICAgIH0pXG4gICAgICBcbiAgICB9KVxuICB9XG4gIFxuXG59KShqUXVlcnkpO1xuXG5cblxuXG4iLCJcbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PVxuICogLS0tLS0gUHJlbG9hZGVyIC0tLS0tLS0tXG4gKiA9PT09PT09PT09PT09PT09PT09PT09ICovXG5cbjsgdmFyIFByZWxvYWRlciA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciB3cmFwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZWxvYWRlcicpO1xuICB2YXIgY291bnRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmVsb2FkZXItY291bnRlcicpO1xuICB2YXIgdGljayA9IDA7XG4gIHZhciBzcGVlZCA9IDE7XG4gIHZhciB0aW1lcjtcblxuICB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgIHRpY2sgKz0gc3BlZWQ7XG5cbiAgICBpZih0aWNrID49IDEwMCkge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICB0aWNrID0gMTAwO1xuICAgIH1cblxuICAgIGNvdW50ZXIuaW5uZXJIVE1MID0gdGlja1xuICB9LCAxMDApO1xuXG4gIHdpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBzcGVlZCA9IDEwO1xuICAgIGNvdW50ZXIuaW5uZXJIVE1MID0gXCIxMDBcIjtcbiAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICB3cmFwLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd3JhcC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSwgNTAwKVxuICB9O1xufSkoKTsiLCJcbi8qKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIC0tLS0tIE1vZHVsZSAtIFNsaWRlciBmb3IgcHJvamVjdHMgLS0tLS0tLS1cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuOyB2YXIgc2xpZGVyUG9ydGZvbGlvID0gKGZ1bmN0aW9uICgpIHtcblxuICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgc2xpZGVySXRlbXM6ICcuc2xpZGVyLXBob3RvX19pdGVtJyxcbiAgICAgIGZpcnN0U2xpZGVOdW06IDFcbiAgICB9O1xuXG4gICAgdmFyIGN1cnJlbnROdW0gPSBkZWZhdWx0cy5maXJzdFNsaWRlTnVtLFxuICAgICAgICBwcmV2TnVtLCAgICAvLyDQv9GA0LXQtNGL0LTRg9GJ0LjQuSDQvdC+0LzQtdGAINC90LAg0LrQvdC+0L/QutC1IERPV04g0LIg0LzQvtC80LXQvdGCINC/0LXRgNC60LvRjtGH0LXQvdC40Y8g0YHQu9Cw0LnQtNCwXG4gICAgICAgIG5leHROdW0sICAgIC8vINGB0LvQtdC00YPRjtGJ0LjQuSDQvdC+0LzQtdGAINC90LAg0LrQvdC+0L/QutC1IFVQINCyINC80L7QvNC10L3RgiDQv9C10YDQutC70Y7Rh9C10L3QuNGPINGB0LvQsNC50LTQsFxuICAgICAgICBuZXdOdW0sICAgICAvLyDQvdC+0LLRi9C5INC90L7QvNC10YAgLSDQv9C+0YHQu9C1INGB0LzQtdC90Ysg0YHQu9Cw0LnQtNCwXG4gICAgICAgIG5ld1ByZXZOdW0sIC8vINC90L7QstGL0Lkg0L3QvtC80LXRgCDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INGB0LvQsNC50LTQsCAtINC/0L7RgdC70LUg0YHQvNC10L3RiyDRgdC70LDQudC00LBcbiAgICAgICAgbmV3TmV4dE51bSwgLy8g0L3QvtCy0YvQuSDQvdC+0LzQtdGAINGB0LvQtdC00YPRjtGJ0LXQs9C+INGB0LvQsNC50LTQsCAtINC/0L7RgdC70LUg0YHQvNC10L3RiyDRgdC70LDQudC00LBcbiAgICAgICAgaW1hZ2VzQ291bnQgPSAkKGRlZmF1bHRzLnNsaWRlckl0ZW1zKS5sZW5ndGg7XG5cbiAgICBpZihjdXJyZW50TnVtIDwgaW1hZ2VzQ291bnQgJiYgY3VycmVudE51bSA+IDEpIHtcbiAgICAgIHByZXZOdW0gPSBjdXJyZW50TnVtIC0gMTtcbiAgICAgIG5leHROdW0gPSBjdXJyZW50TnVtICsgMTtcbiAgICB9IGVsc2UgaWYoY3VycmVudE51bSA9PSBpbWFnZXNDb3VudCkge1xuICAgICAgcHJldk51bSA9IGN1cnJlbnROdW0gLSAxO1xuICAgICAgbmV4dE51bSA9IDE7XG4gICAgfSBlbHNlIGlmKGN1cnJlbnROdW0gPT0gMSkge1xuICAgICAgcHJldk51bSA9IGltYWdlc0NvdW50O1xuICAgICAgbmV4dE51bSA9IGN1cnJlbnROdW0gKyAxO1xuICAgIH1cblxuXG4gICAgJCgnLnNsaWRlci1uYXZfX2J1dHRvbicpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGN1cnJlbnROdW0gPSAkKCcuc2xpZGVyLXBob3RvX19pdGVtX2FjdGl2ZScpLmRhdGEoJ251bScpO1xuXG4gICAgICBpZihjdXJyZW50TnVtIDwgaW1hZ2VzQ291bnQgJiYgY3VycmVudE51bSA+IDEpIHtcbiAgICAgICAgcHJldk51bSA9IGN1cnJlbnROdW0gLSAxO1xuICAgICAgICBuZXh0TnVtID0gY3VycmVudE51bSArIDE7XG4gICAgICB9IGVsc2UgaWYoY3VycmVudE51bSA9PSBpbWFnZXNDb3VudCkge1xuICAgICAgICBwcmV2TnVtID0gY3VycmVudE51bSAtIDE7XG4gICAgICAgIG5leHROdW0gPSAxO1xuICAgICAgfSBlbHNlIGlmKGN1cnJlbnROdW0gPT0gMSkge1xuICAgICAgICBwcmV2TnVtID0gaW1hZ2VzQ291bnQ7XG4gICAgICAgIG5leHROdW0gPSBjdXJyZW50TnVtICsgMTtcbiAgICAgIH1cblxuICAgICAgaWYoICQodGhpcykuZGF0YSgnYXJyb3cnKSA9PSAndXAnICkge1xuICAgICAgICBpZihwYXJzZUludChjdXJyZW50TnVtKSA8IGltYWdlc0NvdW50KSB7XG4gICAgICAgICAgbmV3TnVtID0gY3VycmVudE51bSArIDE7XG4gICAgICAgIH0gZWxzZSBpZihwYXJzZUludChjdXJyZW50TnVtKSA9PSBpbWFnZXNDb3VudCkge1xuICAgICAgICAgIG5ld051bSA9IDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKHBhcnNlSW50KGN1cnJlbnROdW0pID09IDEpIHtcbiAgICAgICAgICBuZXdOdW0gPSBpbWFnZXNDb3VudDtcbiAgICAgICAgfSBlbHNlIGlmKHBhcnNlSW50KGN1cnJlbnROdW0pIDw9IGltYWdlc0NvdW50KSB7XG4gICAgICAgICAgbmV3TnVtID0gY3VycmVudE51bSAtIDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYobmV3TnVtIDwgaW1hZ2VzQ291bnQgJiYgbmV3TnVtID4gMSkge1xuICAgICAgICBuZXdQcmV2TnVtID0gbmV3TnVtIC0gMTtcbiAgICAgICAgbmV3TmV4dE51bSA9IG5ld051bSArIDE7XG4gICAgICB9IGVsc2UgaWYobmV3TnVtID09IGltYWdlc0NvdW50KSB7XG4gICAgICAgIG5ld1ByZXZOdW0gPSBuZXdOdW0gLSAxO1xuICAgICAgICBuZXdOZXh0TnVtID0gMTtcbiAgICAgIH0gZWxzZSBpZihuZXdOdW0gPT0gMSkge1xuICAgICAgICBuZXdQcmV2TnVtID0gaW1hZ2VzQ291bnQ7XG4gICAgICAgIG5ld05leHROdW0gPSBuZXdOdW0gKyAxO1xuICAgICAgfVxuXG4gICAgICAkKCcuc2xpZGVyLXBob3RvX19pdGVtW2RhdGEtbnVtPVwiJytjdXJyZW50TnVtKydcIl0nKS5yZW1vdmVDbGFzcygnc2xpZGVyLXBob3RvX19pdGVtX2FjdGl2ZScpO1xuICAgICAgJCgnLnNsaWRlci1waG90b19faXRlbVtkYXRhLW51bT1cIicrbmV3TnVtKydcIl0nKS5hZGRDbGFzcygnc2xpZGVyLXBob3RvX19pdGVtX2FjdGl2ZScpXG5cbiAgICAgICQoJy5zbGlkZXItbmF2X19idXR0b25bZGF0YS1hcnJvdz1cInVwXCJdIC5zbGlkZXItYnV0dG9uLXBob3RvX19pdGVtW2RhdGEtbnVtPVwiJytuZXh0TnVtKydcIl0nKS5yZW1vdmVDbGFzcygnc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbV9hY3RpdmUnKTtcbiAgICAgICQoJy5zbGlkZXItbmF2X19idXR0b25bZGF0YS1hcnJvdz1cInVwXCJdIC5zbGlkZXItYnV0dG9uLXBob3RvX19pdGVtW2RhdGEtbnVtPVwiJytuZXdOZXh0TnVtKydcIl0nKS5hZGRDbGFzcygnc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbV9hY3RpdmUnKTtcblxuICAgICAgJCgnLnNsaWRlci1uYXZfX2J1dHRvbltkYXRhLWFycm93PVwiZG93blwiXSAuc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbVtkYXRhLW51bT1cIicrcHJldk51bSsnXCJdJykucmVtb3ZlQ2xhc3MoJ3NsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1fYWN0aXZlJylcbiAgICAgICQoJy5zbGlkZXItbmF2X19idXR0b25bZGF0YS1hcnJvdz1cImRvd25cIl0gLnNsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1bZGF0YS1udW09XCInK25ld1ByZXZOdW0rJ1wiXScpLmFkZENsYXNzKCdzbGlkZXItYnV0dG9uLXBob3RvX19pdGVtX2FjdGl2ZScpXG5cbiAgICB9KTtcblxuICAgICQoJy5zbGlkZXItcGhvdG9fX2l0ZW1bZGF0YS1udW09XCInK3ByZXZOdW0rJ1wiXScpLnJlbW92ZUNsYXNzKCdzbGlkZXItcGhvdG9fX2l0ZW1fYWN0aXZlJyk7XG4gICAgJCgnLnNsaWRlci1waG90b19faXRlbVtkYXRhLW51bT1cIicrY3VycmVudE51bSsnXCJdJykuYWRkQ2xhc3MoJ3NsaWRlci1waG90b19faXRlbV9hY3RpdmUnKVxuXG4gICAgJCgnLnNsaWRlci1uYXZfX2J1dHRvbltkYXRhLWFycm93PVwidXBcIl0gLnNsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1bZGF0YS1udW09XCInK2N1cnJlbnROdW0rJ1wiXScpLnJlbW92ZUNsYXNzKCdzbGlkZXItYnV0dG9uLXBob3RvX19pdGVtX2FjdGl2ZScpO1xuICAgICQoJy5zbGlkZXItbmF2X19idXR0b25bZGF0YS1hcnJvdz1cInVwXCJdIC5zbGlkZXItYnV0dG9uLXBob3RvX19pdGVtW2RhdGEtbnVtPVwiJytuZXh0TnVtKydcIl0nKS5hZGRDbGFzcygnc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbV9hY3RpdmUnKTtcblxuICAgICQoJy5zbGlkZXItbmF2X19idXR0b25bZGF0YS1hcnJvdz1cImRvd25cIl0gLnNsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1bZGF0YS1udW09XCInK2N1cnJlbnROdW0rJ1wiXScpLnJlbW92ZUNsYXNzKCdzbGlkZXItYnV0dG9uLXBob3RvX19pdGVtX2FjdGl2ZScpXG4gICAgJCgnLnNsaWRlci1uYXZfX2J1dHRvbltkYXRhLWFycm93PVwiZG93blwiXSAuc2xpZGVyLWJ1dHRvbi1waG90b19faXRlbVtkYXRhLW51bT1cIicrcHJldk51bSsnXCJdJykuYWRkQ2xhc3MoJ3NsaWRlci1idXR0b24tcGhvdG9fX2l0ZW1fYWN0aXZlJylcblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
