
function MenuInitialize() {
	const toggle_icon = document.querySelector('.slideout-menu-toggle-icon span');
	const menu_list   = document.querySelector('.slideout-menu .main-body');

	if(this.isVisible == undefined)
	{
		this.isVisible = false
		menu_list.classList.remove('slideout-menu-visible');
		menu_list.classList.add('slideout-menu-hidden');
		menu_list.style.width = '0px';
	}

	menu_list.addEventListener('transitionend', (t) => {
		if(!this.isVisible)
			menu_list.style.width = '0px';
	});

	menu_list.addEventListener('transitionstart', (t) => {
		if(this.isVisible)
			menu_list.style.width = '100%';
	});

	toggle_icon.addEventListener('click', () => {
		if(this.isVisible) {
			menu_list.classList.remove('slideout-menu-visible');
			menu_list.classList.add('slideout-menu-hidden');
		}
		else {
			menu_list.classList.remove('slideout-menu-hidden');
			menu_list.classList.add('slideout-menu-visible');
		}

		this.isVisible = !this.isVisible;
	});

	document.querySelectorAll('.slideout-menu .main-body li').forEach((e) => {
		const ul = e.querySelector('ul')
		if(ul) {
			ul.style.maxHeight = 0+'px';
			e.addEventListener('mouseover', (k) => { ul.style.maxHeight = ul.scrollHeight+'px'})
			e.addEventListener('mouseout', (k) => { ul.style.maxHeight = 0+'px'})
		}
	})
}

window.addEventListener('load', () => {
	document.querySelector('.slideout-menu').style.display = "block";
	MenuInitialize()
})
