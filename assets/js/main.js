/*
	Solid State by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
		breakpoints({
			xlarge:	'(max-width: 1680px)',
			large:	'(max-width: 1280px)',
			medium:	'(max-width: 980px)',
			small:	'(max-width: 736px)',
			xsmall:	'(max-width: 480px)'
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Header.
	
	if ($banner.length > 0 && $header.hasClass('alt')) {

		$window.on('resize', function() { 
			$window.trigger('scroll'); 
		});
	
		$banner.scrollex({
			bottom: $header.outerHeight(),
			terminate: function() { 
				$header.removeClass('alt'); 
				$('#logo-image').addClass('hidden'); // Hide the image initially
			},
			enter: function() { 
				$header.addClass('alt'); 
				$('#logo-image').addClass('hidden'); // Keep the image hidden when entering
			},
			leave: function() { 
				$header.removeClass('alt'); 
				$('#logo-image').removeClass('hidden'); // Show the image when scrolling past the banner
			}
		});
	}
	

	// Menu.

	// toggle.js

	$(document).ready(function() {
		$('#menu-toggle').click(function() {
			$('body').toggleClass('is-menu-visible');
		});

		$('.close').click(function() {
			$('body').removeClass('is-menu-visible');
		});
	});

	var $menu = $('#menu');

	$menu._locked = false;

	$menu._lock = function() {

		if ($menu._locked)
			return false;

		$menu._locked = true;

		window.setTimeout(function() {
			$menu._locked = false;
		}, 350);

		return true;

	};

	$menu._show = function() {

		if ($menu._lock())
			$('body').addClass('is-menu-visible');

	};

	$menu._hide = function() {

		if ($menu._lock())
			$('body').removeClass('is-menu-visible');

	};

	$menu._toggle = function() {

		if ($menu._lock())
			$('body').toggleClass('is-menu-visible');

	};

	$menu
		.appendTo($('body'))
		.on('click', function(event) {

			event.stopPropagation();

			// Hide.
			$menu._hide();

		})
		.find('.inner')
		.on('click', '.close', function(event) {

			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			// Hide.
			$menu._hide();

		})
		.on('click', function(event) {
			event.stopPropagation();
		})
		.on('click', 'a', function(event) {

			var href = $(this).attr('href');

			event.preventDefault();
			event.stopPropagation();

			// Hide.
			$menu._hide();

			// Redirect.
			window.setTimeout(function() {
				window.location.href = href;
			}, 350);

		});

	$('body')
		.on('click', 'a[href="#menu"]', function(event) {

			event.stopPropagation();
			event.preventDefault();

			// Toggle.
			$menu._toggle();

		})
		.on('keydown', function(event) {

			// Hide on escape.
			if (event.keyCode == 27)
				$menu._hide();

		});


//Carousel

const wiperTrack = document.querySelector(".wiper-track");
const wipes = Array.from(wiperTrack.children);
const wipePrevBtn = document.querySelector(".wiper-button__right");
const wipeNextBtn = document.querySelector(".wiper-button__left");

const updateDimensions = () => {
  const wipeWidth = wipes[0].getBoundingClientRect().width;
  const wrapperWidth = document.querySelector(".wiper-wrapper").getBoundingClientRect().width;
  return { wipeWidth, wrapperWidth };
};

//NOTE: We do not want to hide the arrows if we are scrolling
/*
const arrowsBehaviour = (wipePrevBtn, wipeNextBtn, index) => {
  if (index === 0) {
    wipePrevBtn.classList.add("is-hidden");
    wipeNextBtn.classList.remove("is-hidden");
  } else if (index === wipes.length - 1) {
    wipePrevBtn.classList.remove("is-hidden");
    wipeNextBtn.classList.add("is-hidden");
  } else {
    wipePrevBtn.classList.remove("is-hidden");
    wipeNextBtn.classList.remove("is-hidden");
  }
};
*/

const wipeSlide = (activeSlide, nextSlide, targetIndex) => {
  const { wipeWidth, wrapperWidth } = updateDimensions();

  // Calculate the offset to center the slide
  const offset = (wrapperWidth - wipeWidth) / 2 - 50;

  // Calculate the new transform value
  const newTransform = -((wipeWidth + 48) * targetIndex - offset);

  // Apply the transform
  wiperTrack.style.transform = `translateX(${newTransform}px)`;

  // Update slide scales
  if (activeSlide) {
    activeSlide.classList.remove("active-swipe");
    activeSlide.style.transform = "scale(1)";
  }
  if (nextSlide) {
    nextSlide.classList.add("active-swipe");
    nextSlide.style.transform = "scale(1.1)";
  }
};

// Handle Next Button Click
wipeNextBtn.addEventListener("click", () => {
  const activeSlide = wiperTrack.querySelector(".active-swipe");
  const nextSlide = activeSlide.nextElementSibling;
  if (nextSlide) {
    const targetIndex = wipes.findIndex((slide) => slide === nextSlide);
    wipeSlide(activeSlide, nextSlide, targetIndex);
//    arrowsBehaviour(wipePrevBtn, wipeNextBtn, targetIndex);
  }
  else {
    wipeSlide(activeSlide, wipes[0], 0);
  }
});

// Handle Previous Button Click
wipePrevBtn.addEventListener("click", () => {
  const activeSlide = wiperTrack.querySelector(".active-swipe");
  const prevSlide = activeSlide.previousElementSibling;
  if (prevSlide) {
    const targetIndex = wipes.findIndex((slide) => slide === prevSlide);
    wipeSlide(activeSlide, prevSlide, targetIndex);
 //   arrowsBehaviour(wipePrevBtn, wipeNextBtn, targetIndex);
  }
  else {
    wipeSlide(activeSlide, wipes[wipes.length - 1], wipes.length - 1);
  }
});

// Initialize second slide as active and centered
const initializeCarousel = () => {
  const secondSlide = wipes[1]; // Select the second slide
  if (secondSlide) {
    secondSlide.classList.add("active-swipe");
    wipeSlide(null, secondSlide, 1); // Center the second slide
//    arrowsBehaviour(wipePrevBtn, wipeNextBtn, 1); // Update arrow visibility
  }
};

initializeCarousel();

// Update dimensions on resize
window.addEventListener('resize', () => {
  const activeSlide = wiperTrack.querySelector(".active-swipe");
  if (activeSlide) {
    const targetIndex = wipes.findIndex((slide) => slide === activeSlide);
    wipeSlide(activeSlide, activeSlide, targetIndex); // Re-center the active slide
  }
});



//calender
dycalendar.draw({

	target:'#dycalendar', 
 
	dayformat: 'full', 
 
	type: 'month', 
 
	monthformat: 'full', 
 
	highlighttoday: true, 
 
	prevnextbutton: 'show'
 
 })

// Calender Info

let cal = document.getElementById('dycalendar');
let activeCalInfo = null;

// FIXME: the toUpperCase is probably not doing anything but idk the spec.
cal.addEventListener('mouseover', (eve) => {
	if(eve.target.tagName.toUpperCase() == 'TD' && !isNaN(eve.target.textContent))
	{
		const month_year = document.getElementsByClassName('dycalendar-span-month-year')[0]
		const id = eve.target.textContent + '-' + month_year.textContent.replace(' ', '-');

		if(activeCalInfo)
			activeCalInfo.classList.add('is-hidden');

		let doc = document.getElementById(id);

		if(doc == null)
			doc = document.getElementById('no-event-scheduled');

		doc.classList.remove('is-hidden');

		activeCalInfo = doc
	}
})

cal.addEventListener('mouseout', (eve) => {
	if(activeCalInfo)
		activeCalInfo.classList.add('is-hidden');
})

function initCalInfo() {
	const calinfo = document.querySelector('.calendarinfo');
	Array.from(calinfo.children).forEach((e) => e.classList.add('is-hidden'))
}

initCalInfo()

})(jQuery);
