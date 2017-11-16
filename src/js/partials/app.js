(function ($) {
	// плагин для скрола
	var scroll = $('.js-scroll').onepage_scroll({
		sectionContainer: '.js-screen',
		easing: 'ease',
		animationTime: 1000,
		pagination: false,
		updateURL: false,
		beforeMove: function(index) {
			$('.js-navigation li').removeClass('is-active').eq(index-1).addClass('is-active');
		},
		afterMove: function(index) {},
		loop: false,
		keyboard: true,
		responsiveFallback: false,
		direction: 'vertical'
	});

	//$(scroll).disable();

	// навигация по слайдам
	$('.js-navigation a').click(function() {
		$(scroll).enable();

		var target = $(this).data('index'),
			index = $('.js-screen').index($('#' + target));
		$(scroll).moveTo(index + 1);

		$('.js-navigation li').removeClass('is-active');
		$(this).parent().addClass('is-active');
	});

	//закладка
	$('.js-tabs').lightTabs();

	//карта
	var map;
	(function initMap(map) {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 37.091142,
				lng: 27.327036
			},
			disableDefaultUI: true,
			disableDoubleClickZoom: true,
			zoom: 11,
			styles: [{
				featureType: 'all',
				elementType: 'all',
				stylers: [{saturation: -100}, {gamma: 0.5}]
			}, {
		        featureType: 'water',
		        stylers: [{visibility: 'on'}, {color: '#004872'}]
	    	}, {
				featureType: 'road.highway',
				elementType: 'geometry.stroke',
				stylers: [{color: '#1f2835'}]
            }, {
				featureType: 'road.highway',
				elementType: 'geometry.fill',
				stylers: [{color: '#f7bc20'}]
            }]
		});

		addMarker(map);

		function addMarker(map) {
			var marker = new google.maps.Marker({
				position: {
					lat: 37.100028,
					lng: 27.278131
				},
				icon: '../img/marker.png',
				map: map
			});
		}

		map.addListener('mouseover', function() {
			$(scroll).disable();
		});

		map.addListener('mouseout', function() {
			$(scroll).enable()
		});
	}(map));

	//не проигрывать по умолчанию
	var videoAutoplay = (function() {
		this.autoplay = false;

		return this;
	}());

	//слайдер
	$('[data-slick]').on('init', function(event, slick) {

		$.each(slick.$slides, function() {

			var video = $(this).find('video');
			if (video.length > 0) {

				video.after($('<i />', {class: 'b-slider__play js-slider__play'}));

				video.next('.js-slider__play').click(function() {
					videoAutoplay.autoplay = true;
					video.get(0).play();

					$('.js-slider__play').off('click');

					if ($('.js-slider__play').length > 0) {
						$('.js-slider__play').remove();
					}
				});
			}

			var targets = JSON.stringify($(this).data('zoom'));
			if (targets != undefined) {
				targets = JSON.parse(targets);

				//для позиционирования относительно центра слайда
				var viewWidth = $(this).width() - $('.js-sidebar').width(),
					viewHeight = $(this).height() - $('.js-screen__content').height(),
					center = {
						x: viewWidth / 2,
						y: viewHeight / 2
					};

				for (var i in targets) {
					var target = $('<div />', {class: 'b-slider__zoom'}), 
						position = targets[i];
					$(this).append(target),
					src = targets[i].src,
					slide = $(this);

					target.css({
						'left': center.x * (100 + position.x) / 100,
						'top': center.y * (100 + position.y) / 100
					});

					//обернули в замыкание, потому что цикл отработал и src отображается последний
					target.on('click', (function(src) {
						return function() {
							$.fancybox.open({
								src: src,
								opts: {
									afterClose: function() {
										return $(scroll).enable();
									},
									onComplete: function() {
										return $(scroll).disable();
									},
								}
							});
						}
					})(src));
				}
			}			
		});

	}).each(function() {

		$(this).slick($(this).data('slick'))

	}).on('afterChange', function(event, slick, index){
		
		var slide = slick.$slides[index];

		if (videoAutoplay.autoplay && $(slide).find('video').length > 0) {

			$.each($('video'), function() {
				this.pause();
				this.currentTime = 0;
			});

			$(slide).find('video').get(0).load();
		}

	});

	//загрузка
	window.bLazy = new Blazy({
		success: function(element) {

			//$(scroll).enable();

			//при интеграции добавить реакцию на куки

			var wow = new WOW().init();

			element.pause();
		}
	});

}(jQuery))