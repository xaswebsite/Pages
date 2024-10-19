function hideLoader() {
	document.querySelector('#universe').addEventListener('transitionend', () => {
		document.querySelector('#universe').remove();
	})
	document.querySelector('#universe').style.opacity = "0";
}
window.addEventListener('load', hideLoader);
