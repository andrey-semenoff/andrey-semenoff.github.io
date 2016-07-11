'use strict';

$(function () {

  // adaptive height of header
  if($('.header').length > 0) {
    var new_height = $(window).height();

    $('.header').css({
      height: new_height
    });
  }

  // Переход по якорю на другой странице
  if(window.location.hash !== '' && window.location.hash !== '#') {
    $('html, body').animate({
      scrollTop: $( window.location.hash ).offset().top + 40
    }, 1000);
  }

  // Запуск прелоадера
  Preloader();

  // Активация параллакса
  Parallaxer.init();

  // Запуск слайдера
  ProjectSlider.init();

  // Плавная прокрутка по якорям
  SmoothScroll.init();

  // Инициализация блога
  if($('.blog__chapters').length > 0) {
    Blog.init();
  }

  // Инициализация формы обратной связи
  if($('.contact-form').length > 0) {
    ContactForm.init()
  }

  // Инициализация флип-блока авторизации
  if($('.login-box').length > 0) {
   FlipBox.init()
  }
  
  // Инициализация скриптов админки
  if( $('.admin-page') ) {
    AdminSkills.init();
  }
  
});



/** =======================
* ----- Admin skills --------
* ====================== */

var AdminSkills = (function() {
  
  function init() {
    setEvents();
  }

  function setEvents() {
    $('.admin-skill-group__title, .admin-skill-group__label').on('click', function (e) {
      var contextmenu = $('.context-menu'),
          $this = $(e.target);

      if( !contextmenu.hasClass('context-menu_hidden') ) {

        contextmenu.addClass('context-menu_hidden');

        setTimeout(function () {
          contextmenu.css({
            top: $this.offset().top,
            left: $this.offset().left - contextmenu.outerWidth()
          })
        }, 500);

        setTimeout(function () {
            contextmenu.removeClass('context-menu_hidden')
        }, 1000)

      } else {
        contextmenu.css({
          top: $this.offset().top,
          left: $this.offset().left - contextmenu.outerWidth()
        });

        setTimeout(function () {
          contextmenu.removeClass('context-menu_hidden')
        }, 1000)
      }


    })
  }
  
  return {
    init: init
  }
}());
/** =======================
* ----- Blog script --------
* ====================== */

var Blog = (function () {

  var blogChapters = $('.blog__chapters'),
      additionHeight = 120,
      minWidth = 480;

  function init() {
    var scroll_point = $('.blog__articles').offset().top;
    var fixed_flag = false;

    $(window).on('scroll', function () {
      var body_scrollTop = $('body').scrollTop();

      if( body_scrollTop >= scroll_point) {
        if(!fixed_flag) {
          fixed_flag = true;

          blogChapters.addClass('blog__chapters_fixed');
        }

        $('.blog__article').each(function (i, item) {
          if( body_scrollTop + additionHeight >= $(item).offset().top &&
              body_scrollTop + additionHeight <= $(item).offset().top + $(item).height() ) {

            var activeId = $(item).attr("id");

            $('.chapters__item').removeClass('chapters__item_active');
            $('.chapters__link[href="#'+activeId+'"]').parent().addClass('chapters__item_active');

            return false;
          }
        })

      } else {
        fixed_flag = false;

        if($(window).width() > minWidth) {
          blogChapters.removeClass('blog__chapters_fixed');
          $(this).data('swiped', false);
        }
      }
    });
    
    $(window).on('resize', function () {
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
  
  return {
    init: init
  }
}());



/** =======================
* ----- Contact form --------
* ====================== */

var ContactForm = (function () {

  var form = $('.contact-form');
  
  function init() {
    form.on('submit', function (e) {
          e.preventDefault();
          sendMail( form );
        })
        .on('reset', function () {
          var $this = $(this);
  
          $this.find('input[type=text], textarea').each(function () {
            $(this).removeClass('contact-form__input_success contact-form__input_error');
          });
  
          $this.find('.contact-form__input-note').remove();
        })
        .on('keypress', form.find('input[type=text], textarea'), function (e) {
          $(e.target).removeClass('contact-form__input_success contact-form__input_error')
              .next('.contact-form__input-note').remove();
        });
  }
  
  // Отправка сообщения
  function sendMail( form ) {
    var formData = new FormData(form[0]);

    if (validate()) {
      // if( true ) {     // раскомментировать для проверки валидации на php - Valitron
      $.ajax({
            method: "POST",
            url: "php/sendmail.php",
            data: formData,
            processData: false,
            contentType: false
          })
          .done(function (msg) {
            msg = JSON.parse(msg);
            open_sendMsgBox(msg);
          });
    }
  }

  // Валидация введенных пользователем данных
  function validate() {

    var isValid = true,
        regexp = {
          'name': /^[a-zа-я]{2,}$/i,
          'email': /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
          'text': /^(.){5,}$/i
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

  // Добавление сообщения об ошибке валидации на стороне js
  function addNote($this, msg) {

    var noteTop = $this.offset().top + $this.outerHeight() - $this.parent('form').offset().top,
        noteLeft = $this.offset().left - $this.parent('form').offset().left;

    $('<div class="contact-form__input-note" style="left: '+ noteLeft +'px; top: '+ noteTop +'px;">'+ msg +'</div>').insertAfter($this);
  }

  // Открытие окна с сообщением о результате отправки сообщения
  function open_sendMsgBox(msg) {
    var text = $('.contact-form__sendMsg-text'),
        box = $('.contact-form__sendMsg-box'),
        form = $('.contact-form'),
        showTime = 3000;

    if( msg.info ) {
      msg.text += "<br>";

      for(var input in msg.info.error) {
        msg.text += input + ":<br>";
        msg.info.error[input].forEach(function(item) {
          msg.text += item + "; ";
        });
        msg.text += "<br>";
      }
    }

    showTime = showTime + msg.text.length * 20;

    text.html(msg.text);

    box.addClass('contact-form__sendMsg-box_'+msg.type).fadeIn(function () {

      text.removeClass('contact-form__sendMsg-text_hidden');

      if( !msg.info ) {
        form[0].reset();

        setTimeout(function () {
          text.addClass('contact-form__sendMsg-text_hidden');
        }, showTime);

        // После его успешного выполнения - сообщение скрывается
        box.delay(showTime + 1000).fadeOut(function () {
          $(this).removeClass('contact-form__sendMsg-box_'+msg.type).hide()
        });
      }
    });

    // Закрытие окна с сообщением о результате отправки сообщения
    $('.contact-form__close-sendMsg-box-btn').on('click', function (e) {
      e.preventDefault();
      text.addClass('contact-form__sendMsg-text_hidden');
      box.fadeOut(function () {
        $(this).removeClass('contact-form__sendMsg-box_'+msg.type).hide()
      });
    })
  }
  
  
  return {
    init: init
  }
}());
/** =======================
* ----- FlipBox --------
* ====================== */

var FlipBox = (function() {

  function init() {
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
        $('.login-box').removeClass('login-box_flipped');
        $('.avatar-box_welcome').removeClass('avatar-box_flipped');
        $('#header__login-btn').fadeIn()
      }
    });
  }

  return {
    init: init
  }
}());

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
* ----- Overlay-menu ------
* ====================== */

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

/** =======================
* ----- Parallaxer -------
* ====================== */

; var Parallaxer = (function() {
  
  // Объявление переменных по-умолчанию
  var defaults = {
        paralaxedClass: 'parallaxed'
      },
      paralaxedClass;
  
  // ----------------------------
  // Инициализация модуля
  // ----------------------------
  function init(params) {
    _setVars(params);
    
    if($('.'+ paralaxedClass).length > 0) {
      _addListeners();
    }
  }

  // -----------------------------
  // Установка значений переменных
  // -----------------------------
  function _setVars(params) {
    if( params !== undefined ) {
      for ( var prop in defaults ) {
        if( params.hasOwnProperty(prop) ) {
          defaults[prop] = params[prop];
        }
      }
    }
    
    paralaxedClass = defaults.paralaxedClass;
  }

  // -----------------
  // Установка событий
  // -----------------
  function _addListeners() {
    $(window).on('scroll', function () {
      var winHeight = $(window).height(),
          winBottom = $(window).scrollTop() + winHeight;

      $('.'+ paralaxedClass).each(function () {
        if( winBottom > $(this).offset().top - $(this).height()/2 ) {
          var $this = $(this);

          if( $this.hasClass('skill') && $this.hasClass('parallaxed_hide') ) {
            Skills.init({$this: $this});
          }
          
          $this.removeClass('parallaxed_hide');
        }
      })
    })
  }

  // Public-методы
  return {
    init: init
  }
})();

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
/** =============================
* ----- Skills animation --------
* ============================ */


var Skills = (function () {

  var defaults = {
        $this: false,
        svgClass: 'skill-diagram__svg',
        attrDataName: 'lvl',
        ringClass: 'skill-diagram__ring'
      },
      $this,
      svgClass,
      attrDataName,
      ringClass,
      svg;

  // Применение пользовательских настроек
  var init = function ( params ) {
    if( params !== undefined ) {
      if( !params.hasOwnProperty('$this') ) {
        return console.error('Не передан обязательный параметр $(this) в метод init()');
      } else {
        for ( var prop in defaults ) {
          if( params.hasOwnProperty(prop) ) {
            defaults[prop] = params[prop];
          }
        }
      }
    }

    $this = defaults.$this;
    svgClass = defaults.svgClass;
    attrDataName = defaults.attrDataName;
    ringClass = defaults.ringClass;

    svg = $this.find('.' + svgClass);

    animate();
  };

  var animate = function () {
    svg.each(function () {
      var lvl = $(this).data(attrDataName),                        // уровень навыка
          radius = ($(this).children('.' + ringClass).attr('r')),  // радиус окружности
          circleLength = 3.14 * 2 * radius,                        // длина окружности
          arcLength = circleLength - lvl/100 * circleLength;       // длина закрашенного сектора

      $(this).children('.' + ringClass).css({
        "stroke-dasharray": circleLength,
        "stroke-dashoffset": arcLength,
        "stroke-opacity": lvl/100
      });
    })
  };

  return {
    init: init
  };
}());

/** ==========================================
 * ------------- Project Slider  ------------
 * ======================================== */

var ProjectSlider = (function () {

  // Список кастомных настроек слайдера - при инициализации слайдера - классы можно переопределить
  var defaults = {
        slider: 'slider',                                                 // имя класса слайдера
        previewListClass: 'slider-preview__list',                         // имя класса списка слайдов
        previewItemsClass: 'slider-preview__item',                        // имя класса элемента списка слайдов
        previewPhotoClass: 'slider-preview__photo',                       // имя класса фото слайда
        previewItemsClassActive: 'slider-preview__item_active',           // имя класса активного слайда
        buttonClass: 'slider__button',                                    // имя класса кнопок
        buttonDownClass: 'slider__button_down',                           // имя класса кнопки ВНИЗ
        buttonUpClass: 'slider__button_up',                               // имя класса кнопки ВВЕРХ
        buttonListItems: 'slider-button__list',                           // имя класса списка картинок КНОПКИ
        buttonItems: 'slider-button__item',                               // имя класса элементов списка картинок КНОПКИ
        buttonImgActive: 'slider-button__item_active',                    // имя класса активного элемента списка картинок КНОПКИ
        buttonImgs: 'slider-button__img',                                 // имя класса картинок КНОПКИ
        descTitleClass: 'slider-description .title-content',              // имя класса заголовка описания слайда
        descSkillsClass: 'slider-description .current-skills',            // имя класса блока скилов
        descButtonClass: 'slider-description .slider-description__btn',   // имя класса кнопки перехода по url
        ajaxUrl: 'json/works.json',                                       // url ajax-запроса к БД
        path_to_imgs: 'img/projects/',                                    // путь к картинкам для слайдера
        firstSlideNum: 0                                                  // порядковый номер первого слайда
      },

      // Объявление переменных, значения которых может поменять разработчик
      slider,
      previewListClass,
      previewItemsClass,
      previewPhotoClass,
      previewItemsClassActive,
      buttonClass,
      buttonDownClass,
      buttonUpClass,
      buttonListItems,
      buttonItems,
      buttonImgActive,
      buttonImgs,
      descTitleClass,
      descSkillsClass,
      descButtonClass,
      ajaxUrl,
      path_to_imgs,
      currentNum,

      // Служебные переменные для скрипта
      def,                              // deffered object - для ожидания загрузки данных для слайдера с БД
      previews,                         // набор слайдов
      imagesCount,                      // кол-во слайдов
      lastItem,                         // номер последнего слайда
      downCurr,                         // предыдущий номер на кнопке DOWN в момент переключения слайда
      upCurr,                           // следующий номер на кнопке UP в момент переключения слайда
      itemsDown,                        // кратинки кнопки ВНИЗ
      itemsUp,                          // кратинки кнопки ВВЕРХ
      sliderDesc = [];                  // массив данных, полученных из БД

  // Публичная функция запуска слайдера, которая может принимать объект с настройками слайдера
  var init = function (params) {

    // Установка переменных
    _setVars(params);

    if($('.'+ slider).length > 0) {
      // Ждем загрузки данных с БД
      def = $.Deferred(function () {

        // Загрузка данных с БД
        _loadData();

      }).done(function () {

        // После успешной загрузки данных
        // Подготовка слайдера к работе
        _prepareSlider();

        // Навешивание слушателей событий
        _addListeners();

        // Запуск слайдера
        _runSlider();

      })
    }

  };
  
  // ------------------------------
  // Установка значений переменных
  // ------------------------------
  function _setVars(params) {
    // Если разработчик передал объект со своими настройками
    if( params !== undefined ) {
      // Перебираем свойства объекта с настройками по умолчанию
      for ( var prop in defaults ) {
        // Если переданное разработчиком свойство есть в значениях по умолчанию
        if( params.hasOwnProperty(prop) ) {
          // Перезаписываем значение по умолчанию
          defaults[prop] = params[prop];
        }
      }
    }

    // Запись значений в переменные с учетом пользовательских значений
    slider = defaults.slider;
    previewListClass = defaults.previewListClass;
    previewItemsClass = defaults.previewItemsClass;
    previewPhotoClass = defaults.previewPhotoClass;
    previewItemsClassActive = defaults.previewItemsClassActive;
    buttonClass = defaults.buttonClass;
    buttonDownClass = defaults.buttonDownClass;
    buttonUpClass = defaults.buttonUpClass;
    buttonListItems = defaults.buttonListItems;
    buttonItems = defaults.buttonItems;
    buttonImgActive = defaults.buttonImgActive;
    buttonImgs = defaults.buttonImgs;
    descTitleClass = defaults.descTitleClass;
    descSkillsClass = defaults.descSkillsClass;
    descButtonClass = defaults.descButtonClass;
    ajaxUrl = defaults.ajaxUrl;
    path_to_imgs = defaults.path_to_imgs;
    currentNum = defaults.firstSlideNum;
  }

  // ---------------------------------
  // Загрузка данных о слайдах из json
  // ---------------------------------
  function _loadData() {
    // Загружаем данные с json или сервера
    $.ajax(ajaxUrl).done(function (data) {
      sliderDesc = data;
      def.resolve();
    });
  }

  // -----------------------------
  // Подготовка слайдера
  // -----------------------------
  function _prepareSlider() {

    // Перебор полученного из БД массива с данными для слайдера
    sliderDesc.forEach(function(info) {
      // Динамически создаем список картинок для preview
      $('.'+ previewListClass).append('<li class="'+ previewItemsClass +'"><img class="'+ previewPhotoClass +'" src="'+ path_to_imgs + info.image +'" alt=""></li>')

      // Динамически создаем список картинок для кнопок слайдера
      $('.'+ buttonListItems).append('<li class="'+ buttonItems +'"><img class="'+ buttonImgs +'" src="'+ path_to_imgs + info.image +'" alt=""></li>')
    });

    previews = $('.'+ previewItemsClass);                         // набор слайдов
    imagesCount = previews.length;                                // кол-во слайдов
    lastItem = imagesCount - 1;                                   // номер последнего слайда
    itemsDown = $('.'+ buttonDownClass).find('.'+ buttonItems);   // кратинки кнопки ВНИЗ
    itemsUp = $('.'+ buttonUpClass).find('.'+ buttonItems);       // кратинки кнопки ВВЕРХ

    // Если заданный разработчиком номер первого слайда больше максимального, то берется последний
    if(currentNum > lastItem) {
      currentNum = lastItem;
    } else if(currentNum < 0) {
      currentNum = 0;
    }

    // Активация первого слайда в окне просмотра
    previews.eq(currentNum).addClass(previewItemsClassActive);

  }

  // -----------------------------
  // Установка событий слайдера
  // -----------------------------
  function _addListeners() {
    // Обработка события нажатие на кнопку смены слайдов
    $('.'+ buttonClass).click(function (e) {
      e.preventDefault();

      // Отображение след/пред слайда в зависимоти от нажатой кнопки
      if ( $(this).hasClass(buttonUpClass) ) {
        previews.eq(currentNum).removeClass(previewItemsClassActive);
        previews.eq(upCurr).addClass(previewItemsClassActive);
        currentNum = upCurr;
      } else {
        previews.eq(currentNum).removeClass(previewItemsClassActive);
        previews.eq(downCurr).addClass(previewItemsClassActive);
        currentNum = downCurr;
      }

      var currentDown = itemsDown.eq(downCurr),     // Видимый блок с картинкой на кнопке ВНИЗ
          currentUp = itemsUp.eq(upCurr);           // Видимый блок с картинкой на кнопке ВВЕРХ

      // Перемещение вниз блока с картинкой на кнопке ВНИЗ
      currentDown.css({
        top: parseInt($(this).css('top')) + $(this).height()
      }).removeClass(buttonImgActive);

      // Перемещение вверх блока с картинкой на кнопке ВВЕРХ
      currentUp.css({
        top: parseInt($(this).css('top')) - $(this).height()
      }).removeClass(buttonImgActive);

      // После окончания анимации сброс инлайнового стиля
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

      // Запуск слайдера по нажатию на кнопку
      _runSlider();

    });
  }

  // ----------------
  // Запуск слайдера
  // ----------------
  function _runSlider() {
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

    // Смена текстовых блоков слайдера
    $('.'+ descTitleClass).text(sliderDesc[currentNum].title);
    $('.'+ descSkillsClass).text(sliderDesc[currentNum].skills.join(", "));
    $('.'+ descButtonClass).attr('href', sliderDesc[currentNum].url);

    // Запуск анимации букв в блоке описания слайдера
    _animateDescription();

    // Отображаем новые картинки кнопок
    itemsDown.eq(downCurr).addClass(buttonImgActive);
    itemsUp.eq(upCurr).addClass(buttonImgActive);
  }

  // -------------------------
  // Анимация букв в слайдере
  // -------------------------

  function _animateDescription() {
    // Анимируем все тестовые блоки с классом "transformed"
    var transformed = $('.transformed');

    transformed.each(function () {
      var title = $(this),                // текстовый блок
          text = title.text().trim(),     // текст блока
          textLength = text.length,       // кол-во символов в тексте блока
          timerSpeed = 1500/textLength,   // скорость анимации - чем длинее текст, тем, быстрее анимация
          words = text.split(' '),        // разбиваем текст блока на массив слов
          newContent = '',                // новый контент для текстового блока
          timer,                          // переменная таймера
          letters,                        // набор блоков содержащих отдельные буквы
          index = 0;                      // порядковый номер набора с буквой

      // Очищаем текстовый блок
      title.html('');

      // Перебор массива слов в блоке
      words.forEach(function (word) {
        var symbols = word.split(''),     // разбиваем слово на массив букв
            contentWord = '';             // новый контент блока со словом

        // Формируем блок со словом
        contentWord += '<div class="title-word">';

        //Каждая буква в отдельном span
        symbols.forEach(function (symbol) {
          contentWord += '<span class="title-symbol title-symbol_hidden">'+ symbol+ '</span>';
        });

        // Добавляем между словами пробел
        contentWord += '</div><span> </span>';

        // Добавляем полученный блок со словом в строку
        newContent += contentWord;
      });

      // После генерации новго контента - вставляем его в родительский блок
      title.append(newContent);

      // Берем набор всех букв текста
      letters = $('.title-symbol');

      // По таймеру работаем с каждой буквой
      timer = setInterval(function () {
        letters.eq(index).removeClass('title-symbol_hidden');
        index++;

        // Когда дошли до конца набора букв - отключаем таймер
        if(index > letters.length) {
          clearInterval(timer);
        }
      }, timerSpeed);
    });

  }

  // Public-методы слайдера
  return {
    init: init
  }
}());
/** =======================
* ----- SmoothScroll --------
* ====================== */

var SmoothScroll = (function() {
  
  function init() {
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
  }
  
  return {
    init: init
  }
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJtb2R1bGVzL2FkbWluLXNraWxscy5qcyIsIm1vZHVsZXMvYmxvZy5qcyIsIm1vZHVsZXMvY29udGFjdEZvcm0uanMiLCJtb2R1bGVzL2ZsaXBCb3guanMiLCJtb2R1bGVzL2dvb2dsZS1tYXBzLmpzIiwibW9kdWxlcy9vdmVybGF5LW1lbnUuanMiLCJtb2R1bGVzL3BhcmFsbGF4ZXIuanMiLCJtb2R1bGVzL3ByZWxvYWRlci5qcyIsIm1vZHVsZXMvc2tpbGxzLmpzIiwibW9kdWxlcy9zbGlkZXIuanMiLCJtb2R1bGVzL3Ntb290aFNjcm9sbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbiQoZnVuY3Rpb24gKCkge1xuXG4gIC8vIGFkYXB0aXZlIGhlaWdodCBvZiBoZWFkZXJcbiAgaWYoJCgnLmhlYWRlcicpLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgbmV3X2hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcblxuICAgICQoJy5oZWFkZXInKS5jc3Moe1xuICAgICAgaGVpZ2h0OiBuZXdfaGVpZ2h0XG4gICAgfSk7XG4gIH1cblxuICAvLyDQn9C10YDQtdGF0L7QtCDQv9C+INGP0LrQvtGA0Y4g0L3QsCDQtNGA0YPQs9C+0Lkg0YHRgtGA0LDQvdC40YbQtVxuICBpZih3aW5kb3cubG9jYXRpb24uaGFzaCAhPT0gJycgJiYgd2luZG93LmxvY2F0aW9uLmhhc2ggIT09ICcjJykge1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogJCggd2luZG93LmxvY2F0aW9uLmhhc2ggKS5vZmZzZXQoKS50b3AgKyA0MFxuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgLy8g0JfQsNC/0YPRgdC6INC/0YDQtdC70L7QsNC00LXRgNCwXG4gIFByZWxvYWRlcigpO1xuXG4gIC8vINCQ0LrRgtC40LLQsNGG0LjRjyDQv9Cw0YDQsNC70LvQsNC60YHQsFxuICBQYXJhbGxheGVyLmluaXQoKTtcblxuICAvLyDQl9Cw0L/Rg9GB0Log0YHQu9Cw0LnQtNC10YDQsFxuICBQcm9qZWN0U2xpZGVyLmluaXQoKTtcblxuICAvLyDQn9C70LDQstC90LDRjyDQv9GA0L7QutGA0YPRgtC60LAg0L/QviDRj9C60L7RgNGP0LxcbiAgU21vb3RoU2Nyb2xsLmluaXQoKTtcblxuICAvLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQsdC70L7Qs9CwXG4gIGlmKCQoJy5ibG9nX19jaGFwdGVycycpLmxlbmd0aCA+IDApIHtcbiAgICBCbG9nLmluaXQoKTtcbiAgfVxuXG4gIC8vINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGE0L7RgNC80Ysg0L7QsdGA0LDRgtC90L7QuSDRgdCy0Y/Qt9C4XG4gIGlmKCQoJy5jb250YWN0LWZvcm0nKS5sZW5ndGggPiAwKSB7XG4gICAgQ29udGFjdEZvcm0uaW5pdCgpXG4gIH1cblxuICAvLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRhNC70LjQvy3QsdC70L7QutCwINCw0LLRgtC+0YDQuNC30LDRhtC40LhcbiAgaWYoJCgnLmxvZ2luLWJveCcpLmxlbmd0aCA+IDApIHtcbiAgIEZsaXBCb3guaW5pdCgpXG4gIH1cbiAgXG4gIC8vINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0LrRgNC40L/RgtC+0LIg0LDQtNC80LjQvdC60LhcbiAgaWYoICQoJy5hZG1pbi1wYWdlJykgKSB7XG4gICAgQWRtaW5Ta2lsbHMuaW5pdCgpO1xuICB9XG4gIFxufSk7XG5cblxuIiwiLyoqID09PT09PT09PT09PT09PT09PT09PT09XG4qIC0tLS0tIEFkbWluIHNraWxscyAtLS0tLS0tLVxuKiA9PT09PT09PT09PT09PT09PT09PT09ICovXG5cbnZhciBBZG1pblNraWxscyA9IChmdW5jdGlvbigpIHtcbiAgXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgc2V0RXZlbnRzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudHMoKSB7XG4gICAgJCgnLmFkbWluLXNraWxsLWdyb3VwX190aXRsZSwgLmFkbWluLXNraWxsLWdyb3VwX19sYWJlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgY29udGV4dG1lbnUgPSAkKCcuY29udGV4dC1tZW51JyksXG4gICAgICAgICAgJHRoaXMgPSAkKGUudGFyZ2V0KTtcblxuICAgICAgaWYoICFjb250ZXh0bWVudS5oYXNDbGFzcygnY29udGV4dC1tZW51X2hpZGRlbicpICkge1xuXG4gICAgICAgIGNvbnRleHRtZW51LmFkZENsYXNzKCdjb250ZXh0LW1lbnVfaGlkZGVuJyk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29udGV4dG1lbnUuY3NzKHtcbiAgICAgICAgICAgIHRvcDogJHRoaXMub2Zmc2V0KCkudG9wLFxuICAgICAgICAgICAgbGVmdDogJHRoaXMub2Zmc2V0KCkubGVmdCAtIGNvbnRleHRtZW51Lm91dGVyV2lkdGgoKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0sIDUwMCk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb250ZXh0bWVudS5yZW1vdmVDbGFzcygnY29udGV4dC1tZW51X2hpZGRlbicpXG4gICAgICAgIH0sIDEwMDApXG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRleHRtZW51LmNzcyh7XG4gICAgICAgICAgdG9wOiAkdGhpcy5vZmZzZXQoKS50b3AsXG4gICAgICAgICAgbGVmdDogJHRoaXMub2Zmc2V0KCkubGVmdCAtIGNvbnRleHRtZW51Lm91dGVyV2lkdGgoKVxuICAgICAgICB9KTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb250ZXh0bWVudS5yZW1vdmVDbGFzcygnY29udGV4dC1tZW51X2hpZGRlbicpXG4gICAgICAgIH0sIDEwMDApXG4gICAgICB9XG5cblxuICAgIH0pXG4gIH1cbiAgXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9XG59KCkpOyIsIi8qKiA9PT09PT09PT09PT09PT09PT09PT09PVxuKiAtLS0tLSBCbG9nIHNjcmlwdCAtLS0tLS0tLVxuKiA9PT09PT09PT09PT09PT09PT09PT09ICovXG5cbnZhciBCbG9nID0gKGZ1bmN0aW9uICgpIHtcblxuICB2YXIgYmxvZ0NoYXB0ZXJzID0gJCgnLmJsb2dfX2NoYXB0ZXJzJyksXG4gICAgICBhZGRpdGlvbkhlaWdodCA9IDEyMCxcbiAgICAgIG1pbldpZHRoID0gNDgwO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIHNjcm9sbF9wb2ludCA9ICQoJy5ibG9nX19hcnRpY2xlcycpLm9mZnNldCgpLnRvcDtcbiAgICB2YXIgZml4ZWRfZmxhZyA9IGZhbHNlO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYm9keV9zY3JvbGxUb3AgPSAkKCdib2R5Jykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgIGlmKCBib2R5X3Njcm9sbFRvcCA+PSBzY3JvbGxfcG9pbnQpIHtcbiAgICAgICAgaWYoIWZpeGVkX2ZsYWcpIHtcbiAgICAgICAgICBmaXhlZF9mbGFnID0gdHJ1ZTtcblxuICAgICAgICAgIGJsb2dDaGFwdGVycy5hZGRDbGFzcygnYmxvZ19fY2hhcHRlcnNfZml4ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5ibG9nX19hcnRpY2xlJykuZWFjaChmdW5jdGlvbiAoaSwgaXRlbSkge1xuICAgICAgICAgIGlmKCBib2R5X3Njcm9sbFRvcCArIGFkZGl0aW9uSGVpZ2h0ID49ICQoaXRlbSkub2Zmc2V0KCkudG9wICYmXG4gICAgICAgICAgICAgIGJvZHlfc2Nyb2xsVG9wICsgYWRkaXRpb25IZWlnaHQgPD0gJChpdGVtKS5vZmZzZXQoKS50b3AgKyAkKGl0ZW0pLmhlaWdodCgpICkge1xuXG4gICAgICAgICAgICB2YXIgYWN0aXZlSWQgPSAkKGl0ZW0pLmF0dHIoXCJpZFwiKTtcblxuICAgICAgICAgICAgJCgnLmNoYXB0ZXJzX19pdGVtJykucmVtb3ZlQ2xhc3MoJ2NoYXB0ZXJzX19pdGVtX2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmNoYXB0ZXJzX19saW5rW2hyZWY9XCIjJythY3RpdmVJZCsnXCJdJykucGFyZW50KCkuYWRkQ2xhc3MoJ2NoYXB0ZXJzX19pdGVtX2FjdGl2ZScpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXhlZF9mbGFnID0gZmFsc2U7XG5cbiAgICAgICAgaWYoJCh3aW5kb3cpLndpZHRoKCkgPiBtaW5XaWR0aCkge1xuICAgICAgICAgIGJsb2dDaGFwdGVycy5yZW1vdmVDbGFzcygnYmxvZ19fY2hhcHRlcnNfZml4ZWQnKTtcbiAgICAgICAgICAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgYmxvZ0NoYXB0ZXJzLmRhdGEoJ3N3aXBlZCcsIGZhbHNlKTtcbiAgICAgIGJsb2dDaGFwdGVycy5yZW1vdmVDbGFzcygnYmxvZ19fY2hhcHRlcnNfc2hvd2VkJyk7XG4gICAgfSk7XG5cbiAgICAkKCcuYmxvZ19fY2hhcHRlcnMsIC5jaGFwdGVyc19fbGluaycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmKCAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcpID09IGZhbHNlICkge1xuICAgICAgICAkKHRoaXMpLmRhdGEoJ3N3aXBlZCcsIHRydWUpO1xuICAgICAgICBibG9nQ2hhcHRlcnMuYWRkQ2xhc3MoJ2Jsb2dfX2NoYXB0ZXJzX3Nob3dlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCh0aGlzKS5kYXRhKCdzd2lwZWQnLCBmYWxzZSk7XG4gICAgICAgIGJsb2dDaGFwdGVycy5yZW1vdmVDbGFzcygnYmxvZ19fY2hhcHRlcnNfc2hvd2VkJyk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBcbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH1cbn0oKSk7XG5cblxuIiwiLyoqID09PT09PT09PT09PT09PT09PT09PT09XG4qIC0tLS0tIENvbnRhY3QgZm9ybSAtLS0tLS0tLVxuKiA9PT09PT09PT09PT09PT09PT09PT09ICovXG5cbnZhciBDb250YWN0Rm9ybSA9IChmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGZvcm0gPSAkKCcuY29udGFjdC1mb3JtJyk7XG4gIFxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGZvcm0ub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHNlbmRNYWlsKCBmb3JtICk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbigncmVzZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgXG4gICAgICAgICAgJHRoaXMuZmluZCgnaW5wdXRbdHlwZT10ZXh0XSwgdGV4dGFyZWEnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2NvbnRhY3QtZm9ybV9faW5wdXRfc3VjY2VzcyBjb250YWN0LWZvcm1fX2lucHV0X2Vycm9yJyk7XG4gICAgICAgICAgfSk7XG4gIFxuICAgICAgICAgICR0aGlzLmZpbmQoJy5jb250YWN0LWZvcm1fX2lucHV0LW5vdGUnKS5yZW1vdmUoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdrZXlwcmVzcycsIGZvcm0uZmluZCgnaW5wdXRbdHlwZT10ZXh0XSwgdGV4dGFyZWEnKSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnY29udGFjdC1mb3JtX19pbnB1dF9zdWNjZXNzIGNvbnRhY3QtZm9ybV9faW5wdXRfZXJyb3InKVxuICAgICAgICAgICAgICAubmV4dCgnLmNvbnRhY3QtZm9ybV9faW5wdXQtbm90ZScpLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgfVxuICBcbiAgLy8g0J7RgtC/0YDQsNCy0LrQsCDRgdC+0L7QsdGJ0LXQvdC40Y9cbiAgZnVuY3Rpb24gc2VuZE1haWwoIGZvcm0gKSB7XG4gICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm1bMF0pO1xuXG4gICAgaWYgKHZhbGlkYXRlKCkpIHtcbiAgICAgIC8vIGlmKCB0cnVlICkgeyAgICAgLy8g0YDQsNGB0LrQvtC80LzQtdC90YLQuNGA0L7QstCw0YLRjCDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQstCw0LvQuNC00LDRhtC40Lgg0L3QsCBwaHAgLSBWYWxpdHJvblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICB1cmw6IFwicGhwL3NlbmRtYWlsLnBocFwiLFxuICAgICAgICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2VcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgIG1zZyA9IEpTT04ucGFyc2UobXNnKTtcbiAgICAgICAgICAgIG9wZW5fc2VuZE1zZ0JveChtc2cpO1xuICAgICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vINCS0LDQu9C40LTQsNGG0LjRjyDQstCy0LXQtNC10L3QvdGL0YUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10Lwg0LTQsNC90L3Ri9GFXG4gIGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xuXG4gICAgdmFyIGlzVmFsaWQgPSB0cnVlLFxuICAgICAgICByZWdleHAgPSB7XG4gICAgICAgICAgJ25hbWUnOiAvXlthLXrQsC3Rj117Mix9JC9pLFxuICAgICAgICAgICdlbWFpbCc6IC9eWy1hLXowLTl+ISQlXiYqXz0rfXtcXCc/XSsoXFwuWy1hLXowLTl+ISQlXiYqXz0rfXtcXCc/XSspKkAoW2EtejAtOV9dWy1hLXowLTlfXSooXFwuWy1hLXowLTlfXSspKlxcLihhZXJvfGFycGF8Yml6fGNvbXxjb29wfGVkdXxnb3Z8aW5mb3xpbnR8bWlsfG11c2V1bXxuYW1lfG5ldHxvcmd8cHJvfHRyYXZlbHxtb2JpfFthLXpdW2Etel0pfChbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9KSkoOlswLTldezEsNX0pPyQvaSxcbiAgICAgICAgICAndGV4dCc6IC9eKC4pezUsfSQvaVxuICAgICAgICB9LFxuICAgICAgICBub3RlID0ge1xuICAgICAgICAgICduYW1lJzogXCLQktCw0YjQtSDQuNC80Y8g0LTQvtC70LbQvdC+INGB0L7RgdGC0L7Rj9GC0Ywg0LzQuNC90LjQvNGD0Lwg0LjQtyAyINCx0YPQutCyIVwiLFxuICAgICAgICAgICdlbWFpbCc6IFwi0JLQsNGIIEVtYWlsINC00L7Qu9C20LXQvSDQsdGL0YLRjCDQvdCw0YHRgtC+0Y/RidC40Lwg0LDQtNGA0LXRgdC+0Lwg0Y3Quy4g0L/QvtGH0YLRiyFcIixcbiAgICAgICAgICAndGV4dCc6IFwi0JLQsNGI0LUg0YHQvtC+0LHRidC10L3QuNC1INC00L7Qu9C20L3QviDRgdC+0YHRgtC+0Y/RgtGMINC80LjQvdC40LzRg9C8INC40LcgNSDQsdGD0LrQsiFcIixcbiAgICAgICAgICAnZW1wdHknOiBcItCX0LDQv9C+0LvQvdC40YLQtSDQv9C+0LbQsNC70YPQudGB0YLQsCDRjdGC0L4g0L/QvtC70LUhXCJcbiAgICAgICAgfTtcblxuXG4gICAgZm9ybS5maW5kKCdpbnB1dFt0eXBlPXRleHRdLCB0ZXh0YXJlYScpLmVhY2goZnVuY3Rpb24gKCkge1xuXG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgIHZhbHVlID0gJHRoaXMudmFsKCksXG4gICAgICAgICAgcmVnZXhwVHlwZSA9ICR0aGlzLmRhdGEoJ3JlZ2V4cHR5cGUnKTtcblxuICAgICAgJHRoaXMubmV4dCgnLmNvbnRhY3QtZm9ybV9faW5wdXQtbm90ZScpLnJlbW92ZSgpO1xuXG4gICAgICBpZigkdGhpcy52YWwoKSA9PSAnJykge1xuICAgICAgICBhZGROb3RlKCR0aGlzLCBub3RlLmVtcHR5KTtcbiAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoJ2NvbnRhY3QtZm9ybV9faW5wdXRfc3VjY2VzcycpO1xuICAgICAgICAkdGhpcy5hZGRDbGFzcygnY29udGFjdC1mb3JtX19pbnB1dF9lcnJvcicpO1xuICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZighdmFsdWUubWF0Y2gocmVnZXhwW3JlZ2V4cFR5cGVdKSkge1xuICAgICAgICAgIGFkZE5vdGUoJHRoaXMsIG5vdGVbcmVnZXhwVHlwZV0pO1xuICAgICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKCdjb250YWN0LWZvcm1fX2lucHV0X3N1Y2Nlc3MnKTtcbiAgICAgICAgICAkdGhpcy5hZGRDbGFzcygnY29udGFjdC1mb3JtX19pbnB1dF9lcnJvcicpO1xuICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkdGhpcy5yZW1vdmVDbGFzcygnY29udGFjdC1mb3JtX19pbnB1dF9lcnJvcicpO1xuICAgICAgICAgICR0aGlzLmFkZENsYXNzKCdjb250YWN0LWZvcm1fX2lucHV0X3N1Y2Nlc3MnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpc1ZhbGlkO1xuICB9XG5cbiAgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0YHQvtC+0LHRidC10L3QuNGPINC+0LEg0L7RiNC40LHQutC1INCy0LDQu9C40LTQsNGG0LjQuCDQvdCwINGB0YLQvtGA0L7QvdC1IGpzXG4gIGZ1bmN0aW9uIGFkZE5vdGUoJHRoaXMsIG1zZykge1xuXG4gICAgdmFyIG5vdGVUb3AgPSAkdGhpcy5vZmZzZXQoKS50b3AgKyAkdGhpcy5vdXRlckhlaWdodCgpIC0gJHRoaXMucGFyZW50KCdmb3JtJykub2Zmc2V0KCkudG9wLFxuICAgICAgICBub3RlTGVmdCA9ICR0aGlzLm9mZnNldCgpLmxlZnQgLSAkdGhpcy5wYXJlbnQoJ2Zvcm0nKS5vZmZzZXQoKS5sZWZ0O1xuXG4gICAgJCgnPGRpdiBjbGFzcz1cImNvbnRhY3QtZm9ybV9faW5wdXQtbm90ZVwiIHN0eWxlPVwibGVmdDogJysgbm90ZUxlZnQgKydweDsgdG9wOiAnKyBub3RlVG9wICsncHg7XCI+JysgbXNnICsnPC9kaXY+JykuaW5zZXJ0QWZ0ZXIoJHRoaXMpO1xuICB9XG5cbiAgLy8g0J7RgtC60YDRi9GC0LjQtSDQvtC60L3QsCDRgSDRgdC+0L7QsdGJ0LXQvdC40LXQvCDQviDRgNC10LfRg9C70YzRgtCw0YLQtSDQvtGC0L/RgNCw0LLQutC4INGB0L7QvtCx0YnQtdC90LjRj1xuICBmdW5jdGlvbiBvcGVuX3NlbmRNc2dCb3gobXNnKSB7XG4gICAgdmFyIHRleHQgPSAkKCcuY29udGFjdC1mb3JtX19zZW5kTXNnLXRleHQnKSxcbiAgICAgICAgYm94ID0gJCgnLmNvbnRhY3QtZm9ybV9fc2VuZE1zZy1ib3gnKSxcbiAgICAgICAgZm9ybSA9ICQoJy5jb250YWN0LWZvcm0nKSxcbiAgICAgICAgc2hvd1RpbWUgPSAzMDAwO1xuXG4gICAgaWYoIG1zZy5pbmZvICkge1xuICAgICAgbXNnLnRleHQgKz0gXCI8YnI+XCI7XG5cbiAgICAgIGZvcih2YXIgaW5wdXQgaW4gbXNnLmluZm8uZXJyb3IpIHtcbiAgICAgICAgbXNnLnRleHQgKz0gaW5wdXQgKyBcIjo8YnI+XCI7XG4gICAgICAgIG1zZy5pbmZvLmVycm9yW2lucHV0XS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICBtc2cudGV4dCArPSBpdGVtICsgXCI7IFwiO1xuICAgICAgICB9KTtcbiAgICAgICAgbXNnLnRleHQgKz0gXCI8YnI+XCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2hvd1RpbWUgPSBzaG93VGltZSArIG1zZy50ZXh0Lmxlbmd0aCAqIDIwO1xuXG4gICAgdGV4dC5odG1sKG1zZy50ZXh0KTtcblxuICAgIGJveC5hZGRDbGFzcygnY29udGFjdC1mb3JtX19zZW5kTXNnLWJveF8nK21zZy50eXBlKS5mYWRlSW4oZnVuY3Rpb24gKCkge1xuXG4gICAgICB0ZXh0LnJlbW92ZUNsYXNzKCdjb250YWN0LWZvcm1fX3NlbmRNc2ctdGV4dF9oaWRkZW4nKTtcblxuICAgICAgaWYoICFtc2cuaW5mbyApIHtcbiAgICAgICAgZm9ybVswXS5yZXNldCgpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRleHQuYWRkQ2xhc3MoJ2NvbnRhY3QtZm9ybV9fc2VuZE1zZy10ZXh0X2hpZGRlbicpO1xuICAgICAgICB9LCBzaG93VGltZSk7XG5cbiAgICAgICAgLy8g0J/QvtGB0LvQtSDQtdCz0L4g0YPRgdC/0LXRiNC90L7Qs9C+INCy0YvQv9C+0LvQvdC10L3QuNGPIC0g0YHQvtC+0LHRidC10L3QuNC1INGB0LrRgNGL0LLQsNC10YLRgdGPXG4gICAgICAgIGJveC5kZWxheShzaG93VGltZSArIDEwMDApLmZhZGVPdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2NvbnRhY3QtZm9ybV9fc2VuZE1zZy1ib3hfJyttc2cudHlwZSkuaGlkZSgpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0JfQsNC60YDRi9GC0LjQtSDQvtC60L3QsCDRgSDRgdC+0L7QsdGJ0LXQvdC40LXQvCDQviDRgNC10LfRg9C70YzRgtCw0YLQtSDQvtGC0L/RgNCw0LLQutC4INGB0L7QvtCx0YnQtdC90LjRj1xuICAgICQoJy5jb250YWN0LWZvcm1fX2Nsb3NlLXNlbmRNc2ctYm94LWJ0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0ZXh0LmFkZENsYXNzKCdjb250YWN0LWZvcm1fX3NlbmRNc2ctdGV4dF9oaWRkZW4nKTtcbiAgICAgIGJveC5mYWRlT3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnY29udGFjdC1mb3JtX19zZW5kTXNnLWJveF8nK21zZy50eXBlKS5oaWRlKClcbiAgICAgIH0pO1xuICAgIH0pXG4gIH1cbiAgXG4gIFxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXRcbiAgfVxufSgpKTsiLCIvKiogPT09PT09PT09PT09PT09PT09PT09PT1cbiogLS0tLS0gRmxpcEJveCAtLS0tLS0tLVxuKiA9PT09PT09PT09PT09PT09PT09PT09ICovXG5cbnZhciBGbGlwQm94ID0gKGZ1bmN0aW9uKCkge1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgJCgnI2hlYWRlcl9fbG9naW4tYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAkKCcubG9naW4tYm94JykuYWRkQ2xhc3MoJ2xvZ2luLWJveF9mbGlwcGVkJyk7XG4gICAgICAkKCcuYXZhdGFyLWJveF93ZWxjb21lJykuYWRkQ2xhc3MoJ2F2YXRhci1ib3hfZmxpcHBlZCcpO1xuICAgICAgJCgnLmxvZ2luLWZvcm1fX2lucHV0W25hbWU9bG9naW5dJykuZm9jdXMoKVxuICAgICAgJCh0aGlzKS5mYWRlT3V0KClcbiAgICB9KTtcblxuICAgIC8vIGZsaXAtYmFjayBsb2dpbiBib3hcbiAgICAkKCcubG9naW4tZm9ybV9fbGJsJykua2V5dXAoZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmICggZS5rZXlDb2RlID09IDMyIHx8IGUua2V5Q29kZSA9PSAxMyApIHtcbiAgICAgICAgJCh0aGlzKS5jbGljaygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCgnYm9keSwgI2xvZ2luLW5hdl9faG9tZScpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiggJChlLnRhcmdldCkucGFyZW50cygnLmZsaXAtY29udGFpbmVyJykubGVuZ3RoID09IDAgfHwgJChlLnRhcmdldCkuYXR0cignaWQnKSA9PT0gJ2xvZ2luLW5hdl9faG9tZScpIHtcbiAgICAgICAgJCgnLmxvZ2luLWJveCcpLnJlbW92ZUNsYXNzKCdsb2dpbi1ib3hfZmxpcHBlZCcpO1xuICAgICAgICAkKCcuYXZhdGFyLWJveF93ZWxjb21lJykucmVtb3ZlQ2xhc3MoJ2F2YXRhci1ib3hfZmxpcHBlZCcpO1xuICAgICAgICAkKCcjaGVhZGVyX19sb2dpbi1idG4nKS5mYWRlSW4oKVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH1cbn0oKSk7IiwiXG4vKiogPT09PT09PT09PT09PT09PT09PT09PT09PVxuICogLS0tLS0gR29vZ2xlIG1hcHMgLS0tLS0tLS1cbiAqID09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmZ1bmN0aW9uIGluaXRNYXAoKSB7XG5cbiAgaWYoJCgnI21hcC1ib3gnKS5sZW5ndGggPT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBDcmVhdGUgYW4gYXJyYXkgb2Ygc3R5bGVzLlxuICB2YXIgc3R5bGVzID0gW3tcImZlYXR1cmVUeXBlXCI6XCJhZG1pbmlzdHJhdGl2ZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0LmZpbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiM0NDQ0NDRcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjZjJmMmYyXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInBvaVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJzYXR1cmF0aW9uXCI6LTEwMH0se1wibGlnaHRuZXNzXCI6NDV9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuaGlnaHdheVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJzaW1wbGlmaWVkXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuYXJ0ZXJpYWxcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMuaWNvblwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwidHJhbnNpdFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwid2F0ZXJcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiNlN2E3MzFcIn0se1widmlzaWJpbGl0eVwiOlwib25cIn1dfV1cblxuICAvLyBDcmVhdGUgYSBuZXcgU3R5bGVkTWFwVHlwZSBvYmplY3QsIHBhc3NpbmcgaXQgdGhlIGFycmF5IG9mIHN0eWxlcyxcbiAgLy8gYXMgd2VsbCBhcyB0aGUgbmFtZSB0byBiZSBkaXNwbGF5ZWQgb24gdGhlIG1hcCB0eXBlIGNvbnRyb2wuXG4gIHZhciBzdHlsZWRNYXAgPSBuZXcgZ29vZ2xlLm1hcHMuU3R5bGVkTWFwVHlwZShzdHlsZXMsXG4gICAgICB7bmFtZTogXCJTdHlsZWQgTWFwXCJ9KTtcblxuICAvLyBDcmVhdGUgYSBtYXAgb2JqZWN0LCBhbmQgaW5jbHVkZSB0aGUgTWFwVHlwZUlkIHRvIGFkZFxuICAvLyB0byB0aGUgbWFwIHR5cGUgY29udHJvbC5cbiAgdmFyIG1hcE9wdGlvbnMgPSB7XG4gICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgIHpvb206IDExLFxuICAgIGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyg0Ni41MSwgMzAuNzQ3MTk4NSksXG4gICAgbWFwVHlwZUNvbnRyb2xPcHRpb25zOiB7XG4gICAgICBtYXBUeXBlSWRzOiBbZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsICdtYXBfc3R5bGUnXVxuICAgIH1cbiAgfTtcbiAgdmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1ib3gnKSxcbiAgICAgIG1hcE9wdGlvbnMpO1xuXG4gIC8vQXNzb2NpYXRlIHRoZSBzdHlsZWQgbWFwIHdpdGggdGhlIE1hcFR5cGVJZCBhbmQgc2V0IGl0IHRvIGRpc3BsYXkuXG4gIG1hcC5tYXBUeXBlcy5zZXQoJ21hcF9zdHlsZScsIHN0eWxlZE1hcCk7XG4gIG1hcC5zZXRNYXBUeXBlSWQoJ21hcF9zdHlsZScpO1xuXG4gIHZhciBpbWFnZSA9IHtcbiAgICB1cmw6IFwiLi4vaW1nL21hcF9tYXJrZXIuc3ZnXCIsXG4gICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoNTAsIDcxLjQ2KVxuICB9O1xuXG4gIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICBwb3NpdGlvbjoge2xhdDogNDYuNDMyMjkzOSwgbG5nOiAzMC43MjcxOTg1fSxcbiAgICBpY29uOiBpbWFnZVxuICB9KTtcblxuICAvLyBUbyBhZGQgdGhlIG1hcmtlciB0byB0aGUgbWFwLCBjYWxsIHNldE1hcCgpO1xuICBtYXJrZXIuc2V0TWFwKG1hcCk7XG59XG5cbiIsIi8qKiA9PT09PT09PT09PT09PT09PT09PT09PVxuKiAtLS0tLSBPdmVybGF5LW1lbnUgLS0tLS0tXG4qID09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuJCgnI29wZW4tb3ZlcmxheS1tZW51JykuY2xpY2soZnVuY3Rpb24gKCkge1xuICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICBpZiggJHRoaXMuZGF0YSgnYWN0aW9uJykgPT0gJ29wZW4nICkge1xuXG4gICAgLy8gb3BlbiBvdmVybGF5IG1lbnVcbiAgICAkdGhpcy5kYXRhKCdhY3Rpb24nLCAnY2xvc2UnKTtcblxuICAgICQoJy5oYW1idXJnZXInKS5hZGRDbGFzcygnaGFtYnVyZ2VyX2Nsb3NlJyk7XG5cbiAgICAkKCcub3ZlcmxheS1tZW51JykuY3NzKHtcbiAgICAgIGRpc3BsYXk6IFwiYmxvY2tcIlxuICAgIH0pO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcub3ZlcmxheV9faGFsZicpLmFkZENsYXNzKCdvdmVybGF5X19oYWxmX3Nob3dlZCcpO1xuICAgICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICAgIH0pXG4gICAgfSwgMTApXG5cbiAgICAkKCcub3ZlcmxheV9faGFsZicpLm9uKCd0cmFuc2l0aW9uZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgJCgnLm92ZXJsYXktbWVudScpLmFkZENsYXNzKCdvdmVybGF5LW1lbnVfc2hvd2VkJyk7XG5cbiAgICAgIHZhciB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoICQoJy5vdmVybGF5LW1lbnVfX2l0ZW0nKS5lcShpKS5sZW5ndGggKSB7XG4gICAgICAgICAgJCgnLm92ZXJsYXktbWVudV9faXRlbScpLmVxKGkpLmFkZENsYXNzKCdvdmVybGF5LW1lbnVfX2l0ZW1fc2hvd2VkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgfSwgMjUwKTtcbiAgICB9KVxuXG4gICAgLy9ibG9jayBzY3JvbGwgbG9ja1xuICAgICQoJ2JvZHknKS5jc3MoeyBwb3NpdGlvbjogJ2ZpeGVkJyB9KVxuXG4gIH0gZWxzZSB7XG5cbiAgICAvL2Nsb3NlIG92ZXJsYXkgbWVudVxuICAgICR0aGlzLmRhdGEoJ2FjdGlvbicsICdvcGVuJyk7XG5cbiAgICAkKCcuaGFtYnVyZ2VyJykucmVtb3ZlQ2xhc3MoJ2hhbWJ1cmdlcl9jbG9zZScpO1xuXG4gICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICBvcGFjaXR5OiAwXG4gICAgfSk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcub3ZlcmxheV9faGFsZicpLnJlbW92ZUNsYXNzKCdvdmVybGF5X19oYWxmX3Nob3dlZCcpO1xuICAgICAgJCgnLm92ZXJsYXktbWVudScpLmNzcyh7XG4gICAgICAgIGRpc3BsYXk6IFwibm9uZVwiXG4gICAgICB9KVxuICAgIH0sIDUwMClcblxuICAgICQoJy5vdmVybGF5LW1lbnUnKS5yZW1vdmVDbGFzcygnb3ZlcmxheS1tZW51X3Nob3dlZCcpO1xuICAgICQoJy5vdmVybGF5LW1lbnVfX2l0ZW0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ292ZXJsYXktbWVudV9faXRlbV9zaG93ZWQnKVxuICAgIH0pXG5cbiAgICAvL2Jsb2NrIHNjcm9sbCB1bmxvY2tcbiAgICAkKCdib2R5JykuY3NzKHsgcG9zaXRpb246ICcnIH0pXG5cbiAgfVxufSk7XG4iLCIvKiogPT09PT09PT09PT09PT09PT09PT09PT1cbiogLS0tLS0gUGFyYWxsYXhlciAtLS0tLS0tXG4qID09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuOyB2YXIgUGFyYWxsYXhlciA9IChmdW5jdGlvbigpIHtcbiAgXG4gIC8vINCe0LHRitGP0LLQu9C10L3QuNC1INC/0LXRgNC10LzQtdC90L3Ri9GFINC/0L4t0YPQvNC+0LvRh9Cw0L3QuNGOXG4gIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgcGFyYWxheGVkQ2xhc3M6ICdwYXJhbGxheGVkJ1xuICAgICAgfSxcbiAgICAgIHBhcmFsYXhlZENsYXNzO1xuICBcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQvNC+0LTRg9C70Y9cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBmdW5jdGlvbiBpbml0KHBhcmFtcykge1xuICAgIF9zZXRWYXJzKHBhcmFtcyk7XG4gICAgXG4gICAgaWYoJCgnLicrIHBhcmFsYXhlZENsYXNzKS5sZW5ndGggPiAwKSB7XG4gICAgICBfYWRkTGlzdGVuZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINC30L3QsNGH0LXQvdC40Lkg0L/QtdGA0LXQvNC10L3QvdGL0YVcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZnVuY3Rpb24gX3NldFZhcnMocGFyYW1zKSB7XG4gICAgaWYoIHBhcmFtcyAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgZm9yICggdmFyIHByb3AgaW4gZGVmYXVsdHMgKSB7XG4gICAgICAgIGlmKCBwYXJhbXMuaGFzT3duUHJvcGVydHkocHJvcCkgKSB7XG4gICAgICAgICAgZGVmYXVsdHNbcHJvcF0gPSBwYXJhbXNbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcGFyYWxheGVkQ2xhc3MgPSBkZWZhdWx0cy5wYXJhbGF4ZWRDbGFzcztcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDRgdC+0LHRi9GC0LjQuVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuICBmdW5jdGlvbiBfYWRkTGlzdGVuZXJzKCkge1xuICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHdpbkhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKSxcbiAgICAgICAgICB3aW5Cb3R0b20gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyB3aW5IZWlnaHQ7XG5cbiAgICAgICQoJy4nKyBwYXJhbGF4ZWRDbGFzcykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmKCB3aW5Cb3R0b20gPiAkKHRoaXMpLm9mZnNldCgpLnRvcCAtICQodGhpcykuaGVpZ2h0KCkvMiApIHtcbiAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgaWYoICR0aGlzLmhhc0NsYXNzKCdza2lsbCcpICYmICR0aGlzLmhhc0NsYXNzKCdwYXJhbGxheGVkX2hpZGUnKSApIHtcbiAgICAgICAgICAgIFNraWxscy5pbml0KHskdGhpczogJHRoaXN9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoJ3BhcmFsbGF4ZWRfaGlkZScpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvLyBQdWJsaWMt0LzQtdGC0L7QtNGLXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9XG59KSgpOyIsIlxuLyoqID09PT09PT09PT09PT09PT09PT09PT09XG4gKiAtLS0tLSBQcmVsb2FkZXIgLS0tLS0tLS1cbiAqID09PT09PT09PT09PT09PT09PT09PT0gKi9cbjsgZnVuY3Rpb24gUHJlbG9hZGVyKCkge1xuXG4gIHZhclxuICAgICAgd3JhcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmVsb2FkZXInKSxcbiAgICAgIGNvdW50ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlbG9hZGVyLWNvdW50ZXInKSxcbiAgICAgIHRpY2sgPSAwLFxuICAgICAgdGltZXIsXG4gICAgICBpc1RpbWVyUnVuID0gZmFsc2UsXG4gICAgICBvbmVQaWMgPSAwLFxuICAgICAgbG9hZGVkQW1vdW50ID0gMCxcbiAgICAgIGltZ3MgPSBbXTtcblxuICAkKCcud3JhcHBlciAqLCAuZm9vdGVyIConKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICBzcmMgPSAkdGhpcy5hdHRyKCdzcmMnKSxcbiAgICAgICAgYmcgPSAkKHRoaXMpLmNzcygnYmFja2dyb3VuZC1pbWFnZScpO1xuXG4gICAgaWYoc3JjICE9PSB1bmRlZmluZWQgJiYgIXNyYy5tYXRjaCgnLmpzJCcpICYmICFzcmMubWF0Y2goJ15odHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20nKSkge1xuICAgICAgaW1ncy5wdXNoKHNyYylcbiAgICB9IGVsc2UgaWYoYmcgIT09ICdub25lJyAmJiAhYmcubWF0Y2goJ15saW5lYXInKSApIHtcbiAgICAgIGJnID0gYmcucmVwbGFjZSgndXJsKFwiJywnJykucmVwbGFjZSgnXCIpJywnJyk7XG4gICAgICBpbWdzLnB1c2goYmcpXG4gICAgfVxuICB9KTtcbi8vIGNvbnNvbGUubG9nKGltZ3MpO1xuXG4gIG9uZVBpYyA9IE1hdGguY2VpbCggMSAvIGltZ3MubGVuZ3RoICogMTAwICk7XG4gIHRpY2sgPSBvbmVQaWM7XG5cbiAgaW1ncy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpKSB7XG4gICAgdmFyIGltZyA9ICQoJzxpbWc+Jywge1xuICAgICAgYXR0cjoge1xuICAgICAgICBzcmM6IGl0ZW1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbWcub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4vLyBjb25zb2xlLmxvZyhpbWcraSsnIC0gbG9hZGVkIScpO1xuICAgICAgbG9hZGVkQW1vdW50ICs9IG9uZVBpYztcbiAgICAgIGlmKCFpc1RpbWVyUnVuKSB7XG4gICAgICAgIGlzVGltZXJSdW4gPSB0cnVlO1xuICAgICAgICBnb1RpbWVyKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgZnVuY3Rpb24gZ29UaW1lcigpIHtcbiAgICB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgdGljayArPSBNYXRoLmNlaWwobG9hZGVkQW1vdW50Lyh0aWNrKSk7XG4vLy8vIERFTEVURSEhISEhISEhISEhISEhXG4gICAgICB0aWNrID0gMTAwXG4gICAgICBpZih0aWNrID49IDEwMCkge1xuICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgaXNUaW1lclJ1biA9IGZhbHNlO1xuICAgICAgICB0aWNrID0gMTAwO1xuICAgICAgICB3cmFwLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3cmFwLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAkKCcuZmxpcC1jb250YWluZXInKS5hZGRDbGFzcygnZmxpcC1jb250YWluZXJfYW5pbWF0ZWQnKTtcbiAgICAgICAgfSwgNTAwKVxuICAgICAgfSBlbHNlIGlmKHRpY2sgPj0gbG9hZGVkQW1vdW50ICYmIHRpY2sgPCAxMDApIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgIGlzVGltZXJSdW4gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY291bnRlci5pbm5lckhUTUwgPSB0aWNrXG4gICAgfSwgMTAwKTtcbiAgfVxuXG59IiwiLyoqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4qIC0tLS0tIFNraWxscyBhbmltYXRpb24gLS0tLS0tLS1cbiogPT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbnZhciBTa2lsbHMgPSAoZnVuY3Rpb24gKCkge1xuXG4gIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgJHRoaXM6IGZhbHNlLFxuICAgICAgICBzdmdDbGFzczogJ3NraWxsLWRpYWdyYW1fX3N2ZycsXG4gICAgICAgIGF0dHJEYXRhTmFtZTogJ2x2bCcsXG4gICAgICAgIHJpbmdDbGFzczogJ3NraWxsLWRpYWdyYW1fX3JpbmcnXG4gICAgICB9LFxuICAgICAgJHRoaXMsXG4gICAgICBzdmdDbGFzcyxcbiAgICAgIGF0dHJEYXRhTmFtZSxcbiAgICAgIHJpbmdDbGFzcyxcbiAgICAgIHN2ZztcblxuICAvLyDQn9GA0LjQvNC10L3QtdC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjRhSDQvdCw0YHRgtGA0L7QtdC6XG4gIHZhciBpbml0ID0gZnVuY3Rpb24gKCBwYXJhbXMgKSB7XG4gICAgaWYoIHBhcmFtcyAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgaWYoICFwYXJhbXMuaGFzT3duUHJvcGVydHkoJyR0aGlzJykgKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCfQndC1INC/0LXRgNC10LTQsNC9INC+0LHRj9C30LDRgtC10LvRjNC90YvQuSDQv9Cw0YDQsNC80LXRgtGAICQodGhpcykg0LIg0LzQtdGC0L7QtCBpbml0KCknKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoIHZhciBwcm9wIGluIGRlZmF1bHRzICkge1xuICAgICAgICAgIGlmKCBwYXJhbXMuaGFzT3duUHJvcGVydHkocHJvcCkgKSB7XG4gICAgICAgICAgICBkZWZhdWx0c1twcm9wXSA9IHBhcmFtc1twcm9wXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAkdGhpcyA9IGRlZmF1bHRzLiR0aGlzO1xuICAgIHN2Z0NsYXNzID0gZGVmYXVsdHMuc3ZnQ2xhc3M7XG4gICAgYXR0ckRhdGFOYW1lID0gZGVmYXVsdHMuYXR0ckRhdGFOYW1lO1xuICAgIHJpbmdDbGFzcyA9IGRlZmF1bHRzLnJpbmdDbGFzcztcblxuICAgIHN2ZyA9ICR0aGlzLmZpbmQoJy4nICsgc3ZnQ2xhc3MpO1xuXG4gICAgYW5pbWF0ZSgpO1xuICB9O1xuXG4gIHZhciBhbmltYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHN2Zy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBsdmwgPSAkKHRoaXMpLmRhdGEoYXR0ckRhdGFOYW1lKSwgICAgICAgICAgICAgICAgICAgICAgICAvLyDRg9GA0L7QstC10L3RjCDQvdCw0LLRi9C60LBcbiAgICAgICAgICByYWRpdXMgPSAoJCh0aGlzKS5jaGlsZHJlbignLicgKyByaW5nQ2xhc3MpLmF0dHIoJ3InKSksICAvLyDRgNCw0LTQuNGD0YEg0L7QutGA0YPQttC90L7RgdGC0LhcbiAgICAgICAgICBjaXJjbGVMZW5ndGggPSAzLjE0ICogMiAqIHJhZGl1cywgICAgICAgICAgICAgICAgICAgICAgICAvLyDQtNC70LjQvdCwINC+0LrRgNGD0LbQvdC+0YHRgtC4XG4gICAgICAgICAgYXJjTGVuZ3RoID0gY2lyY2xlTGVuZ3RoIC0gbHZsLzEwMCAqIGNpcmNsZUxlbmd0aDsgICAgICAgLy8g0LTQu9C40L3QsCDQt9Cw0LrRgNCw0YjQtdC90L3QvtCz0L4g0YHQtdC60YLQvtGA0LBcblxuICAgICAgJCh0aGlzKS5jaGlsZHJlbignLicgKyByaW5nQ2xhc3MpLmNzcyh7XG4gICAgICAgIFwic3Ryb2tlLWRhc2hhcnJheVwiOiBjaXJjbGVMZW5ndGgsXG4gICAgICAgIFwic3Ryb2tlLWRhc2hvZmZzZXRcIjogYXJjTGVuZ3RoLFxuICAgICAgICBcInN0cm9rZS1vcGFjaXR5XCI6IGx2bC8xMDBcbiAgICAgIH0pO1xuICAgIH0pXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH07XG59KCkpO1xuIiwiLyoqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogLS0tLS0tLS0tLS0tLSBQcm9qZWN0IFNsaWRlciAgLS0tLS0tLS0tLS0tXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbnZhciBQcm9qZWN0U2xpZGVyID0gKGZ1bmN0aW9uICgpIHtcblxuICAvLyDQodC/0LjRgdC+0Log0LrQsNGB0YLQvtC80L3Ri9GFINC90LDRgdGC0YDQvtC10Log0YHQu9Cw0LnQtNC10YDQsCAtINC/0YDQuCDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDRgdC70LDQudC00LXRgNCwIC0g0LrQu9Cw0YHRgdGLINC80L7QttC90L4g0L/QtdGA0LXQvtC/0YDQtdC00LXQu9C40YLRjFxuICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIHNsaWRlcjogJ3NsaWRlcicsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC40LzRjyDQutC70LDRgdGB0LAg0YHQu9Cw0LnQtNC10YDQsFxuICAgICAgICBwcmV2aWV3TGlzdENsYXNzOiAnc2xpZGVyLXByZXZpZXdfX2xpc3QnLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINGB0L/QuNGB0LrQsCDRgdC70LDQudC00L7QslxuICAgICAgICBwcmV2aWV3SXRlbXNDbGFzczogJ3NsaWRlci1wcmV2aWV3X19pdGVtJywgICAgICAgICAgICAgICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINGN0LvQtdC80LXQvdGC0LAg0YHQv9C40YHQutCwINGB0LvQsNC50LTQvtCyXG4gICAgICAgIHByZXZpZXdQaG90b0NsYXNzOiAnc2xpZGVyLXByZXZpZXdfX3Bob3RvJywgICAgICAgICAgICAgICAgICAgICAgIC8vINC40LzRjyDQutC70LDRgdGB0LAg0YTQvtGC0L4g0YHQu9Cw0LnQtNCwXG4gICAgICAgIHByZXZpZXdJdGVtc0NsYXNzQWN0aXZlOiAnc2xpZGVyLXByZXZpZXdfX2l0ZW1fYWN0aXZlJywgICAgICAgICAgIC8vINC40LzRjyDQutC70LDRgdGB0LAg0LDQutGC0LjQstC90L7Qs9C+INGB0LvQsNC50LTQsFxuICAgICAgICBidXR0b25DbGFzczogJ3NsaWRlcl9fYnV0dG9uJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINC60L3QvtC/0L7QulxuICAgICAgICBidXR0b25Eb3duQ2xhc3M6ICdzbGlkZXJfX2J1dHRvbl9kb3duJywgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINC60L3QvtC/0LrQuCDQktCd0JjQl1xuICAgICAgICBidXR0b25VcENsYXNzOiAnc2xpZGVyX19idXR0b25fdXAnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINC60L3QvtC/0LrQuCDQktCS0JXQoNClXG4gICAgICAgIGJ1dHRvbkxpc3RJdGVtczogJ3NsaWRlci1idXR0b25fX2xpc3QnLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC40LzRjyDQutC70LDRgdGB0LAg0YHQv9C40YHQutCwINC60LDRgNGC0LjQvdC+0Log0JrQndCe0J/QmtCYXG4gICAgICAgIGJ1dHRvbkl0ZW1zOiAnc2xpZGVyLWJ1dHRvbl9faXRlbScsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC40LzRjyDQutC70LDRgdGB0LAg0Y3Qu9C10LzQtdC90YLQvtCyINGB0L/QuNGB0LrQsCDQutCw0YDRgtC40L3QvtC6INCa0J3QntCf0JrQmFxuICAgICAgICBidXR0b25JbWdBY3RpdmU6ICdzbGlkZXItYnV0dG9uX19pdGVtX2FjdGl2ZScsICAgICAgICAgICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINCw0LrRgtC40LLQvdC+0LPQviDRjdC70LXQvNC10L3RgtCwINGB0L/QuNGB0LrQsCDQutCw0YDRgtC40L3QvtC6INCa0J3QntCf0JrQmFxuICAgICAgICBidXR0b25JbWdzOiAnc2xpZGVyLWJ1dHRvbl9faW1nJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQuNC80Y8g0LrQu9Cw0YHRgdCwINC60LDRgNGC0LjQvdC+0Log0JrQndCe0J/QmtCYXG4gICAgICAgIGRlc2NUaXRsZUNsYXNzOiAnc2xpZGVyLWRlc2NyaXB0aW9uIC50aXRsZS1jb250ZW50JywgICAgICAgICAgICAgIC8vINC40LzRjyDQutC70LDRgdGB0LAg0LfQsNCz0L7Qu9C+0LLQutCwINC+0L/QuNGB0LDQvdC40Y8g0YHQu9Cw0LnQtNCwXG4gICAgICAgIGRlc2NTa2lsbHNDbGFzczogJ3NsaWRlci1kZXNjcmlwdGlvbiAuY3VycmVudC1za2lsbHMnLCAgICAgICAgICAgIC8vINC40LzRjyDQutC70LDRgdGB0LAg0LHQu9C+0LrQsCDRgdC60LjQu9C+0LJcbiAgICAgICAgZGVzY0J1dHRvbkNsYXNzOiAnc2xpZGVyLWRlc2NyaXB0aW9uIC5zbGlkZXItZGVzY3JpcHRpb25fX2J0bicsICAgLy8g0LjQvNGPINC60LvQsNGB0YHQsCDQutC90L7Qv9C60Lgg0L/QtdGA0LXRhdC+0LTQsCDQv9C+IHVybFxuICAgICAgICBhamF4VXJsOiAnanNvbi93b3Jrcy5qc29uJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cmwgYWpheC3Qt9Cw0L/RgNC+0YHQsCDQuiDQkdCUXG4gICAgICAgIHBhdGhfdG9faW1nczogJ2ltZy9wcm9qZWN0cy8nLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC/0YPRgtGMINC6INC60LDRgNGC0LjQvdC60LDQvCDQtNC70Y8g0YHQu9Cw0LnQtNC10YDQsFxuICAgICAgICBmaXJzdFNsaWRlTnVtOiAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQv9C+0YDRj9C00LrQvtCy0YvQuSDQvdC+0LzQtdGAINC/0LXRgNCy0L7Qs9C+INGB0LvQsNC50LTQsFxuICAgICAgfSxcblxuICAgICAgLy8g0J7QsdGK0Y/QstC70LXQvdC40LUg0L/QtdGA0LXQvNC10L3QvdGL0YUsINC30L3QsNGH0LXQvdC40Y8g0LrQvtGC0L7RgNGL0YUg0LzQvtC20LXRgiDQv9C+0LzQtdC90Y/RgtGMINGA0LDQt9GA0LDQsdC+0YLRh9C40LpcbiAgICAgIHNsaWRlcixcbiAgICAgIHByZXZpZXdMaXN0Q2xhc3MsXG4gICAgICBwcmV2aWV3SXRlbXNDbGFzcyxcbiAgICAgIHByZXZpZXdQaG90b0NsYXNzLFxuICAgICAgcHJldmlld0l0ZW1zQ2xhc3NBY3RpdmUsXG4gICAgICBidXR0b25DbGFzcyxcbiAgICAgIGJ1dHRvbkRvd25DbGFzcyxcbiAgICAgIGJ1dHRvblVwQ2xhc3MsXG4gICAgICBidXR0b25MaXN0SXRlbXMsXG4gICAgICBidXR0b25JdGVtcyxcbiAgICAgIGJ1dHRvbkltZ0FjdGl2ZSxcbiAgICAgIGJ1dHRvbkltZ3MsXG4gICAgICBkZXNjVGl0bGVDbGFzcyxcbiAgICAgIGRlc2NTa2lsbHNDbGFzcyxcbiAgICAgIGRlc2NCdXR0b25DbGFzcyxcbiAgICAgIGFqYXhVcmwsXG4gICAgICBwYXRoX3RvX2ltZ3MsXG4gICAgICBjdXJyZW50TnVtLFxuXG4gICAgICAvLyDQodC70YPQttC10LHQvdGL0LUg0L/QtdGA0LXQvNC10L3QvdGL0LUg0LTQu9GPINGB0LrRgNC40L/RgtCwXG4gICAgICBkZWYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGVmZmVyZWQgb2JqZWN0IC0g0LTQu9GPINC+0LbQuNC00LDQvdC40Y8g0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUg0LTQu9GPINGB0LvQsNC50LTQtdGA0LAg0YEg0JHQlFxuICAgICAgcHJldmlld3MsICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC90LDQsdC+0YAg0YHQu9Cw0LnQtNC+0LJcbiAgICAgIGltYWdlc0NvdW50LCAgICAgICAgICAgICAgICAgICAgICAvLyDQutC+0Lst0LLQviDRgdC70LDQudC00L7QslxuICAgICAgbGFzdEl0ZW0sICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC90L7QvNC10YAg0L/QvtGB0LvQtdC00L3QtdCz0L4g0YHQu9Cw0LnQtNCwXG4gICAgICBkb3duQ3VyciwgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L/RgNC10LTRi9C00YPRidC40Lkg0L3QvtC80LXRgCDQvdCwINC60L3QvtC/0LrQtSBET1dOINCyINC80L7QvNC10L3RgiDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0YHQu9Cw0LnQtNCwXG4gICAgICB1cEN1cnIsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0YHQu9C10LTRg9GO0YnQuNC5INC90L7QvNC10YAg0L3QsCDQutC90L7Qv9C60LUgVVAg0LIg0LzQvtC80LXQvdGCINC/0LXRgNC10LrQu9GO0YfQtdC90LjRjyDRgdC70LDQudC00LBcbiAgICAgIGl0ZW1zRG93biwgICAgICAgICAgICAgICAgICAgICAgICAvLyDQutGA0LDRgtC40L3QutC4INC60L3QvtC/0LrQuCDQktCd0JjQl1xuICAgICAgaXRlbXNVcCwgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC60YDQsNGC0LjQvdC60Lgg0LrQvdC+0L/QutC4INCS0JLQldCg0KVcbiAgICAgIHNsaWRlckRlc2MgPSBbXTsgICAgICAgICAgICAgICAgICAvLyDQvNCw0YHRgdC40LIg0LTQsNC90L3Ri9GFLCDQv9C+0LvRg9GH0LXQvdC90YvRhSDQuNC3INCR0JRcblxuICAvLyDQn9GD0LHQu9C40YfQvdCw0Y8g0YTRg9C90LrRhtC40Y8g0LfQsNC/0YPRgdC60LAg0YHQu9Cw0LnQtNC10YDQsCwg0LrQvtGC0L7RgNCw0Y8g0LzQvtC20LXRgiDQv9GA0LjQvdC40LzQsNGC0Ywg0L7QsdGK0LXQutGCINGBINC90LDRgdGC0YDQvtC50LrQsNC80Lgg0YHQu9Cw0LnQtNC10YDQsFxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcblxuICAgIC8vINCj0YHRgtCw0L3QvtCy0LrQsCDQv9C10YDQtdC80LXQvdC90YvRhVxuICAgIF9zZXRWYXJzKHBhcmFtcyk7XG5cbiAgICBpZigkKCcuJysgc2xpZGVyKS5sZW5ndGggPiAwKSB7XG4gICAgICAvLyDQltC00LXQvCDQt9Cw0LPRgNGD0LfQutC4INC00LDQvdC90YvRhSDRgSDQkdCUXG4gICAgICBkZWYgPSAkLkRlZmVycmVkKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyDQl9Cw0LPRgNGD0LfQutCwINC00LDQvdC90YvRhSDRgSDQkdCUXG4gICAgICAgIF9sb2FkRGF0YSgpO1xuXG4gICAgICB9KS5kb25lKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyDQn9C+0YHQu9C1INGD0YHQv9C10YjQvdC+0Lkg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YVcbiAgICAgICAgLy8g0J/QvtC00LPQvtGC0L7QstC60LAg0YHQu9Cw0LnQtNC10YDQsCDQuiDRgNCw0LHQvtGC0LVcbiAgICAgICAgX3ByZXBhcmVTbGlkZXIoKTtcblxuICAgICAgICAvLyDQndCw0LLQtdGI0LjQstCw0L3QuNC1INGB0LvRg9GI0LDRgtC10LvQtdC5INGB0L7QsdGL0YLQuNC5XG4gICAgICAgIF9hZGRMaXN0ZW5lcnMoKTtcblxuICAgICAgICAvLyDQl9Cw0L/Rg9GB0Log0YHQu9Cw0LnQtNC10YDQsFxuICAgICAgICBfcnVuU2xpZGVyKCk7XG5cbiAgICAgIH0pXG4gICAgfVxuXG4gIH07XG4gIFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINC30L3QsNGH0LXQvdC40Lkg0L/QtdGA0LXQvNC10L3QvdGL0YVcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGZ1bmN0aW9uIF9zZXRWYXJzKHBhcmFtcykge1xuICAgIC8vINCV0YHQu9C4INGA0LDQt9GA0LDQsdC+0YLRh9C40Log0L/QtdGA0LXQtNCw0Lsg0L7QsdGK0LXQutGCINGB0L4g0YHQstC+0LjQvNC4INC90LDRgdGC0YDQvtC50LrQsNC80LhcbiAgICBpZiggcGFyYW1zICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAvLyDQn9C10YDQtdCx0LjRgNCw0LXQvCDRgdCy0L7QudGB0YLQstCwINC+0LHRitC10LrRgtCwINGBINC90LDRgdGC0YDQvtC50LrQsNC80Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cbiAgICAgIGZvciAoIHZhciBwcm9wIGluIGRlZmF1bHRzICkge1xuICAgICAgICAvLyDQldGB0LvQuCDQv9C10YDQtdC00LDQvdC90L7QtSDRgNCw0LfRgNCw0LHQvtGC0YfQuNC60L7QvCDRgdCy0L7QudGB0YLQstC+INC10YHRgtGMINCyINC30L3QsNGH0LXQvdC40Y/RhSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxuICAgICAgICBpZiggcGFyYW1zLmhhc093blByb3BlcnR5KHByb3ApICkge1xuICAgICAgICAgIC8vINCf0LXRgNC10LfQsNC/0LjRgdGL0LLQsNC10Lwg0LfQvdCw0YfQtdC90LjQtSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxuICAgICAgICAgIGRlZmF1bHRzW3Byb3BdID0gcGFyYW1zW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g0JfQsNC/0LjRgdGMINC30L3QsNGH0LXQvdC40Lkg0LIg0L/QtdGA0LXQvNC10L3QvdGL0LUg0YEg0YPRh9C10YLQvtC8INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNGFINC30L3QsNGH0LXQvdC40LlcbiAgICBzbGlkZXIgPSBkZWZhdWx0cy5zbGlkZXI7XG4gICAgcHJldmlld0xpc3RDbGFzcyA9IGRlZmF1bHRzLnByZXZpZXdMaXN0Q2xhc3M7XG4gICAgcHJldmlld0l0ZW1zQ2xhc3MgPSBkZWZhdWx0cy5wcmV2aWV3SXRlbXNDbGFzcztcbiAgICBwcmV2aWV3UGhvdG9DbGFzcyA9IGRlZmF1bHRzLnByZXZpZXdQaG90b0NsYXNzO1xuICAgIHByZXZpZXdJdGVtc0NsYXNzQWN0aXZlID0gZGVmYXVsdHMucHJldmlld0l0ZW1zQ2xhc3NBY3RpdmU7XG4gICAgYnV0dG9uQ2xhc3MgPSBkZWZhdWx0cy5idXR0b25DbGFzcztcbiAgICBidXR0b25Eb3duQ2xhc3MgPSBkZWZhdWx0cy5idXR0b25Eb3duQ2xhc3M7XG4gICAgYnV0dG9uVXBDbGFzcyA9IGRlZmF1bHRzLmJ1dHRvblVwQ2xhc3M7XG4gICAgYnV0dG9uTGlzdEl0ZW1zID0gZGVmYXVsdHMuYnV0dG9uTGlzdEl0ZW1zO1xuICAgIGJ1dHRvbkl0ZW1zID0gZGVmYXVsdHMuYnV0dG9uSXRlbXM7XG4gICAgYnV0dG9uSW1nQWN0aXZlID0gZGVmYXVsdHMuYnV0dG9uSW1nQWN0aXZlO1xuICAgIGJ1dHRvbkltZ3MgPSBkZWZhdWx0cy5idXR0b25JbWdzO1xuICAgIGRlc2NUaXRsZUNsYXNzID0gZGVmYXVsdHMuZGVzY1RpdGxlQ2xhc3M7XG4gICAgZGVzY1NraWxsc0NsYXNzID0gZGVmYXVsdHMuZGVzY1NraWxsc0NsYXNzO1xuICAgIGRlc2NCdXR0b25DbGFzcyA9IGRlZmF1bHRzLmRlc2NCdXR0b25DbGFzcztcbiAgICBhamF4VXJsID0gZGVmYXVsdHMuYWpheFVybDtcbiAgICBwYXRoX3RvX2ltZ3MgPSBkZWZhdWx0cy5wYXRoX3RvX2ltZ3M7XG4gICAgY3VycmVudE51bSA9IGRlZmF1bHRzLmZpcnN0U2xpZGVOdW07XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8g0JfQsNCz0YDRg9C30LrQsCDQtNCw0L3QvdGL0YUg0L4g0YHQu9Cw0LnQtNCw0YUg0LjQtyBqc29uXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBmdW5jdGlvbiBfbG9hZERhdGEoKSB7XG4gICAgLy8g0JfQsNCz0YDRg9C20LDQtdC8INC00LDQvdC90YvQtSDRgSBqc29uINC40LvQuCDRgdC10YDQstC10YDQsFxuICAgICQuYWpheChhamF4VXJsKS5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBzbGlkZXJEZXNjID0gZGF0YTtcbiAgICAgIGRlZi5yZXNvbHZlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyDQn9C+0LTQs9C+0YLQvtCy0LrQsCDRgdC70LDQudC00LXRgNCwXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGZ1bmN0aW9uIF9wcmVwYXJlU2xpZGVyKCkge1xuXG4gICAgLy8g0J/QtdGA0LXQsdC+0YAg0L/QvtC70YPRh9C10L3QvdC+0LPQviDQuNC3INCR0JQg0LzQsNGB0YHQuNCy0LAg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINGB0LvQsNC50LTQtdGA0LBcbiAgICBzbGlkZXJEZXNjLmZvckVhY2goZnVuY3Rpb24oaW5mbykge1xuICAgICAgLy8g0JTQuNC90LDQvNC40YfQtdGB0LrQuCDRgdC+0LfQtNCw0LXQvCDRgdC/0LjRgdC+0Log0LrQsNGA0YLQuNC90L7QuiDQtNC70Y8gcHJldmlld1xuICAgICAgJCgnLicrIHByZXZpZXdMaXN0Q2xhc3MpLmFwcGVuZCgnPGxpIGNsYXNzPVwiJysgcHJldmlld0l0ZW1zQ2xhc3MgKydcIj48aW1nIGNsYXNzPVwiJysgcHJldmlld1Bob3RvQ2xhc3MgKydcIiBzcmM9XCInKyBwYXRoX3RvX2ltZ3MgKyBpbmZvLmltYWdlICsnXCIgYWx0PVwiXCI+PC9saT4nKVxuXG4gICAgICAvLyDQlNC40L3QsNC80LjRh9C10YHQutC4INGB0L7Qt9C00LDQtdC8INGB0L/QuNGB0L7QuiDQutCw0YDRgtC40L3QvtC6INC00LvRjyDQutC90L7Qv9C+0Log0YHQu9Cw0LnQtNC10YDQsFxuICAgICAgJCgnLicrIGJ1dHRvbkxpc3RJdGVtcykuYXBwZW5kKCc8bGkgY2xhc3M9XCInKyBidXR0b25JdGVtcyArJ1wiPjxpbWcgY2xhc3M9XCInKyBidXR0b25JbWdzICsnXCIgc3JjPVwiJysgcGF0aF90b19pbWdzICsgaW5mby5pbWFnZSArJ1wiIGFsdD1cIlwiPjwvbGk+JylcbiAgICB9KTtcblxuICAgIHByZXZpZXdzID0gJCgnLicrIHByZXZpZXdJdGVtc0NsYXNzKTsgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L3QsNCx0L7RgCDRgdC70LDQudC00L7QslxuICAgIGltYWdlc0NvdW50ID0gcHJldmlld3MubGVuZ3RoOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0LrQvtC7LdCy0L4g0YHQu9Cw0LnQtNC+0LJcbiAgICBsYXN0SXRlbSA9IGltYWdlc0NvdW50IC0gMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC90L7QvNC10YAg0L/QvtGB0LvQtdC00L3QtdCz0L4g0YHQu9Cw0LnQtNCwXG4gICAgaXRlbXNEb3duID0gJCgnLicrIGJ1dHRvbkRvd25DbGFzcykuZmluZCgnLicrIGJ1dHRvbkl0ZW1zKTsgICAvLyDQutGA0LDRgtC40L3QutC4INC60L3QvtC/0LrQuCDQktCd0JjQl1xuICAgIGl0ZW1zVXAgPSAkKCcuJysgYnV0dG9uVXBDbGFzcykuZmluZCgnLicrIGJ1dHRvbkl0ZW1zKTsgICAgICAgLy8g0LrRgNCw0YLQuNC90LrQuCDQutC90L7Qv9C60Lgg0JLQktCV0KDQpVxuXG4gICAgLy8g0JXRgdC70Lgg0LfQsNC00LDQvdC90YvQuSDRgNCw0LfRgNCw0LHQvtGC0YfQuNC60L7QvCDQvdC+0LzQtdGAINC/0LXRgNCy0L7Qs9C+INGB0LvQsNC50LTQsCDQsdC+0LvRjNGI0LUg0LzQsNC60YHQuNC80LDQu9GM0L3QvtCz0L4sINGC0L4g0LHQtdGA0LXRgtGB0Y8g0L/QvtGB0LvQtdC00L3QuNC5XG4gICAgaWYoY3VycmVudE51bSA+IGxhc3RJdGVtKSB7XG4gICAgICBjdXJyZW50TnVtID0gbGFzdEl0ZW07XG4gICAgfSBlbHNlIGlmKGN1cnJlbnROdW0gPCAwKSB7XG4gICAgICBjdXJyZW50TnVtID0gMDtcbiAgICB9XG5cbiAgICAvLyDQkNC60YLQuNCy0LDRhtC40Y8g0L/QtdGA0LLQvtCz0L4g0YHQu9Cw0LnQtNCwINCyINC+0LrQvdC1INC/0YDQvtGB0LzQvtGC0YDQsFxuICAgIHByZXZpZXdzLmVxKGN1cnJlbnROdW0pLmFkZENsYXNzKHByZXZpZXdJdGVtc0NsYXNzQWN0aXZlKTtcblxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8g0KPRgdGC0LDQvdC+0LLQutCwINGB0L7QsdGL0YLQuNC5INGB0LvQsNC50LTQtdGA0LBcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZnVuY3Rpb24gX2FkZExpc3RlbmVycygpIHtcbiAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YHQvtCx0YvRgtC40Y8g0L3QsNC20LDRgtC40LUg0L3QsCDQutC90L7Qv9C60YMg0YHQvNC10L3RiyDRgdC70LDQudC00L7QslxuICAgICQoJy4nKyBidXR0b25DbGFzcykuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgLy8g0J7RgtC+0LHRgNCw0LbQtdC90LjQtSDRgdC70LXQtC/Qv9GA0LXQtCDRgdC70LDQudC00LAg0LIg0LfQsNCy0LjRgdC40LzQvtGC0Lgg0L7RgiDQvdCw0LbQsNGC0L7QuSDQutC90L7Qv9C60LhcbiAgICAgIGlmICggJCh0aGlzKS5oYXNDbGFzcyhidXR0b25VcENsYXNzKSApIHtcbiAgICAgICAgcHJldmlld3MuZXEoY3VycmVudE51bSkucmVtb3ZlQ2xhc3MocHJldmlld0l0ZW1zQ2xhc3NBY3RpdmUpO1xuICAgICAgICBwcmV2aWV3cy5lcSh1cEN1cnIpLmFkZENsYXNzKHByZXZpZXdJdGVtc0NsYXNzQWN0aXZlKTtcbiAgICAgICAgY3VycmVudE51bSA9IHVwQ3VycjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXZpZXdzLmVxKGN1cnJlbnROdW0pLnJlbW92ZUNsYXNzKHByZXZpZXdJdGVtc0NsYXNzQWN0aXZlKTtcbiAgICAgICAgcHJldmlld3MuZXEoZG93bkN1cnIpLmFkZENsYXNzKHByZXZpZXdJdGVtc0NsYXNzQWN0aXZlKTtcbiAgICAgICAgY3VycmVudE51bSA9IGRvd25DdXJyO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudERvd24gPSBpdGVtc0Rvd24uZXEoZG93bkN1cnIpLCAgICAgLy8g0JLQuNC00LjQvNGL0Lkg0LHQu9C+0Log0YEg0LrQsNGA0YLQuNC90LrQvtC5INC90LAg0LrQvdC+0L/QutC1INCS0J3QmNCXXG4gICAgICAgICAgY3VycmVudFVwID0gaXRlbXNVcC5lcSh1cEN1cnIpOyAgICAgICAgICAgLy8g0JLQuNC00LjQvNGL0Lkg0LHQu9C+0Log0YEg0LrQsNGA0YLQuNC90LrQvtC5INC90LAg0LrQvdC+0L/QutC1INCS0JLQldCg0KVcblxuICAgICAgLy8g0J/QtdGA0LXQvNC10YnQtdC90LjQtSDQstC90LjQtyDQsdC70L7QutCwINGBINC60LDRgNGC0LjQvdC60L7QuSDQvdCwINC60L3QvtC/0LrQtSDQktCd0JjQl1xuICAgICAgY3VycmVudERvd24uY3NzKHtcbiAgICAgICAgdG9wOiBwYXJzZUludCgkKHRoaXMpLmNzcygndG9wJykpICsgJCh0aGlzKS5oZWlnaHQoKVxuICAgICAgfSkucmVtb3ZlQ2xhc3MoYnV0dG9uSW1nQWN0aXZlKTtcblxuICAgICAgLy8g0J/QtdGA0LXQvNC10YnQtdC90LjQtSDQstCy0LXRgNGFINCx0LvQvtC60LAg0YEg0LrQsNGA0YLQuNC90LrQvtC5INC90LAg0LrQvdC+0L/QutC1INCS0JLQldCg0KVcbiAgICAgIGN1cnJlbnRVcC5jc3Moe1xuICAgICAgICB0b3A6IHBhcnNlSW50KCQodGhpcykuY3NzKCd0b3AnKSkgLSAkKHRoaXMpLmhlaWdodCgpXG4gICAgICB9KS5yZW1vdmVDbGFzcyhidXR0b25JbWdBY3RpdmUpO1xuXG4gICAgICAvLyDQn9C+0YHQu9C1INC+0LrQvtC90YfQsNC90LjRjyDQsNC90LjQvNCw0YbQuNC4INGB0LHRgNC+0YEg0LjQvdC70LDQudC90L7QstC+0LPQviDRgdGC0LjQu9GPXG4gICAgICBjdXJyZW50VXAub24oJ3RyYW5zaXRpb25lbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuY3NzKHtcbiAgICAgICAgICB0b3A6ICcnXG4gICAgICAgIH0pXG4gICAgICB9KTtcblxuICAgICAgY3VycmVudERvd24ub24oJ3RyYW5zaXRpb25lbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuY3NzKHtcbiAgICAgICAgICB0b3A6ICcnXG4gICAgICAgIH0pXG4gICAgICB9KTtcblxuICAgICAgLy8g0JfQsNC/0YPRgdC6INGB0LvQsNC50LTQtdGA0LAg0L/QviDQvdCw0LbQsNGC0LjRjiDQvdCwINC60L3QvtC/0LrRg1xuICAgICAgX3J1blNsaWRlcigpO1xuXG4gICAgfSk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG4gIC8vINCX0LDQv9GD0YHQuiDRgdC70LDQudC00LXRgNCwXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cbiAgZnVuY3Rpb24gX3J1blNsaWRlcigpIHtcbiAgICAvLyDQntC/0YDQtdC00LXQu9GP0LXQvCDQvdC+0LLRi9C1INC60LDRgNGC0LjQvdC60Lgg0LTQu9GPINC60L3QvtC/0L7QulxuICAgIGlmIChjdXJyZW50TnVtID09IDApIHtcbiAgICAgIGRvd25DdXJyID0gbGFzdEl0ZW07XG4gICAgfSBlbHNlIGlmIChjdXJyZW50TnVtIC0gMSA9PSAwKSB7XG4gICAgICBkb3duQ3VyciA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvd25DdXJyID0gY3VycmVudE51bSAtIDE7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnROdW0gPT0gbGFzdEl0ZW0pIHtcbiAgICAgIHVwQ3VyciA9IDA7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50TnVtICsgMSA9PSBsYXN0SXRlbSkge1xuICAgICAgdXBDdXJyID0gbGFzdEl0ZW07XG4gICAgfSBlbHNlIHtcbiAgICAgIHVwQ3VyciA9IGN1cnJlbnROdW0gKyAxO1xuICAgIH1cblxuICAgIC8vINCh0LzQtdC90LAg0YLQtdC60YHRgtC+0LLRi9GFINCx0LvQvtC60L7QsiDRgdC70LDQudC00LXRgNCwXG4gICAgJCgnLicrIGRlc2NUaXRsZUNsYXNzKS50ZXh0KHNsaWRlckRlc2NbY3VycmVudE51bV0udGl0bGUpO1xuICAgICQoJy4nKyBkZXNjU2tpbGxzQ2xhc3MpLnRleHQoc2xpZGVyRGVzY1tjdXJyZW50TnVtXS5za2lsbHMuam9pbihcIiwgXCIpKTtcbiAgICAkKCcuJysgZGVzY0J1dHRvbkNsYXNzKS5hdHRyKCdocmVmJywgc2xpZGVyRGVzY1tjdXJyZW50TnVtXS51cmwpO1xuXG4gICAgLy8g0JfQsNC/0YPRgdC6INCw0L3QuNC80LDRhtC40Lgg0LHRg9C60LIg0LIg0LHQu9C+0LrQtSDQvtC/0LjRgdCw0L3QuNGPINGB0LvQsNC50LTQtdGA0LBcbiAgICBfYW5pbWF0ZURlc2NyaXB0aW9uKCk7XG5cbiAgICAvLyDQntGC0L7QsdGA0LDQttCw0LXQvCDQvdC+0LLRi9C1INC60LDRgNGC0LjQvdC60Lgg0LrQvdC+0L/QvtC6XG4gICAgaXRlbXNEb3duLmVxKGRvd25DdXJyKS5hZGRDbGFzcyhidXR0b25JbWdBY3RpdmUpO1xuICAgIGl0ZW1zVXAuZXEodXBDdXJyKS5hZGRDbGFzcyhidXR0b25JbWdBY3RpdmUpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyDQkNC90LjQvNCw0YbQuNGPINCx0YPQutCyINCyINGB0LvQsNC50LTQtdGA0LVcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGZ1bmN0aW9uIF9hbmltYXRlRGVzY3JpcHRpb24oKSB7XG4gICAgLy8g0JDQvdC40LzQuNGA0YPQtdC8INCy0YHQtSDRgtC10YHRgtC+0LLRi9C1INCx0LvQvtC60Lgg0YEg0LrQu9Cw0YHRgdC+0LwgXCJ0cmFuc2Zvcm1lZFwiXG4gICAgdmFyIHRyYW5zZm9ybWVkID0gJCgnLnRyYW5zZm9ybWVkJyk7XG5cbiAgICB0cmFuc2Zvcm1lZC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0aXRsZSA9ICQodGhpcyksICAgICAgICAgICAgICAgIC8vINGC0LXQutGB0YLQvtCy0YvQuSDQsdC70L7QulxuICAgICAgICAgIHRleHQgPSB0aXRsZS50ZXh0KCkudHJpbSgpLCAgICAgLy8g0YLQtdC60YHRgiDQsdC70L7QutCwXG4gICAgICAgICAgdGV4dExlbmd0aCA9IHRleHQubGVuZ3RoLCAgICAgICAvLyDQutC+0Lst0LLQviDRgdC40LzQstC+0LvQvtCyINCyINGC0LXQutGB0YLQtSDQsdC70L7QutCwXG4gICAgICAgICAgdGltZXJTcGVlZCA9IDE1MDAvdGV4dExlbmd0aCwgICAvLyDRgdC60L7RgNC+0YHRgtGMINCw0L3QuNC80LDRhtC40LggLSDRh9C10Lwg0LTQu9C40L3QtdC1INGC0LXQutGB0YIsINGC0LXQvCwg0LHRi9GB0YLRgNC10LUg0LDQvdC40LzQsNGG0LjRj1xuICAgICAgICAgIHdvcmRzID0gdGV4dC5zcGxpdCgnICcpLCAgICAgICAgLy8g0YDQsNC30LHQuNCy0LDQtdC8INGC0LXQutGB0YIg0LHQu9C+0LrQsCDQvdCwINC80LDRgdGB0LjQsiDRgdC70L7QslxuICAgICAgICAgIG5ld0NvbnRlbnQgPSAnJywgICAgICAgICAgICAgICAgLy8g0L3QvtCy0YvQuSDQutC+0L3RgtC10L3RgiDQtNC70Y8g0YLQtdC60YHRgtC+0LLQvtCz0L4g0LHQu9C+0LrQsFxuICAgICAgICAgIHRpbWVyLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0L/QtdGA0LXQvNC10L3QvdCw0Y8g0YLQsNC50LzQtdGA0LBcbiAgICAgICAgICBsZXR0ZXJzLCAgICAgICAgICAgICAgICAgICAgICAgIC8vINC90LDQsdC+0YAg0LHQu9C+0LrQvtCyINGB0L7QtNC10YDQttCw0YnQuNGFINC+0YLQtNC10LvRjNC90YvQtSDQsdGD0LrQstGLXG4gICAgICAgICAgaW5kZXggPSAwOyAgICAgICAgICAgICAgICAgICAgICAvLyDQv9C+0YDRj9C00LrQvtCy0YvQuSDQvdC+0LzQtdGAINC90LDQsdC+0YDQsCDRgSDQsdGD0LrQstC+0LlcblxuICAgICAgLy8g0J7Rh9C40YnQsNC10Lwg0YLQtdC60YHRgtC+0LLRi9C5INCx0LvQvtC6XG4gICAgICB0aXRsZS5odG1sKCcnKTtcblxuICAgICAgLy8g0J/QtdGA0LXQsdC+0YAg0LzQsNGB0YHQuNCy0LAg0YHQu9C+0LIg0LIg0LHQu9C+0LrQtVxuICAgICAgd29yZHMuZm9yRWFjaChmdW5jdGlvbiAod29yZCkge1xuICAgICAgICB2YXIgc3ltYm9scyA9IHdvcmQuc3BsaXQoJycpLCAgICAgLy8g0YDQsNC30LHQuNCy0LDQtdC8INGB0LvQvtCy0L4g0L3QsCDQvNCw0YHRgdC40LIg0LHRg9C60LJcbiAgICAgICAgICAgIGNvbnRlbnRXb3JkID0gJyc7ICAgICAgICAgICAgIC8vINC90L7QstGL0Lkg0LrQvtC90YLQtdC90YIg0LHQu9C+0LrQsCDRgdC+INGB0LvQvtCy0L7QvFxuXG4gICAgICAgIC8vINCk0L7RgNC80LjRgNGD0LXQvCDQsdC70L7QuiDRgdC+INGB0LvQvtCy0L7QvFxuICAgICAgICBjb250ZW50V29yZCArPSAnPGRpdiBjbGFzcz1cInRpdGxlLXdvcmRcIj4nO1xuXG4gICAgICAgIC8v0JrQsNC20LTQsNGPINCx0YPQutCy0LAg0LIg0L7RgtC00LXQu9GM0L3QvtC8IHNwYW5cbiAgICAgICAgc3ltYm9scy5mb3JFYWNoKGZ1bmN0aW9uIChzeW1ib2wpIHtcbiAgICAgICAgICBjb250ZW50V29yZCArPSAnPHNwYW4gY2xhc3M9XCJ0aXRsZS1zeW1ib2wgdGl0bGUtc3ltYm9sX2hpZGRlblwiPicrIHN5bWJvbCsgJzwvc3Bhbj4nO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0LzQtdC20LTRgyDRgdC70L7QstCw0LzQuCDQv9GA0L7QsdC10LtcbiAgICAgICAgY29udGVudFdvcmQgKz0gJzwvZGl2PjxzcGFuPiA8L3NwYW4+JztcblxuICAgICAgICAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0L/QvtC70YPRh9C10L3QvdGL0Lkg0LHQu9C+0Log0YHQviDRgdC70L7QstC+0Lwg0LIg0YHRgtGA0L7QutGDXG4gICAgICAgIG5ld0NvbnRlbnQgKz0gY29udGVudFdvcmQ7XG4gICAgICB9KTtcblxuICAgICAgLy8g0J/QvtGB0LvQtSDQs9C10L3QtdGA0LDRhtC40Lgg0L3QvtCy0LPQviDQutC+0L3RgtC10L3RgtCwIC0g0LLRgdGC0LDQstC70Y/QtdC8INC10LPQviDQsiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0LHQu9C+0LpcbiAgICAgIHRpdGxlLmFwcGVuZChuZXdDb250ZW50KTtcblxuICAgICAgLy8g0JHQtdGA0LXQvCDQvdCw0LHQvtGAINCy0YHQtdGFINCx0YPQutCyINGC0LXQutGB0YLQsFxuICAgICAgbGV0dGVycyA9ICQoJy50aXRsZS1zeW1ib2wnKTtcblxuICAgICAgLy8g0J/QviDRgtCw0LnQvNC10YDRgyDRgNCw0LHQvtGC0LDQtdC8INGBINC60LDQttC00L7QuSDQsdGD0LrQstC+0LlcbiAgICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXR0ZXJzLmVxKGluZGV4KS5yZW1vdmVDbGFzcygndGl0bGUtc3ltYm9sX2hpZGRlbicpO1xuICAgICAgICBpbmRleCsrO1xuXG4gICAgICAgIC8vINCa0L7Qs9C00LAg0LTQvtGI0LvQuCDQtNC+INC60L7QvdGG0LAg0L3QsNCx0L7RgNCwINCx0YPQutCyIC0g0L7RgtC60LvRjtGH0LDQtdC8INGC0LDQudC80LXRgFxuICAgICAgICBpZihpbmRleCA+IGxldHRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgIH1cbiAgICAgIH0sIHRpbWVyU3BlZWQpO1xuICAgIH0pO1xuXG4gIH1cblxuICAvLyBQdWJsaWMt0LzQtdGC0L7QtNGLINGB0LvQsNC50LTQtdGA0LBcbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH1cbn0oKSk7IiwiLyoqID09PT09PT09PT09PT09PT09PT09PT09XG4qIC0tLS0tIFNtb290aFNjcm9sbCAtLS0tLS0tLVxuKiA9PT09PT09PT09PT09PT09PT09PT09ICovXG5cbnZhciBTbW9vdGhTY3JvbGwgPSAoZnVuY3Rpb24oKSB7XG4gIFxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgICQoJyNhcnJvdy1kb3duLCAjYXJyb3ctdXAsIC5jaGFwdGVyc19fbGluaycpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgIHNjcm9sbFRvcDogJCggJC5hdHRyKHRoaXMsICdocmVmJykgKS5vZmZzZXQoKS50b3BcbiAgICAgIH0sIDEwMDApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgJCgnLmNoYXB0ZXJzX19saW5rJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgc2Nyb2xsVG9wOiAkKCAkLmF0dHIodGhpcywgJ2hyZWYnKSApLm9mZnNldCgpLnRvcFxuICAgICAgfSwgMTAwMCk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuICBcbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH1cbn0oKSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
