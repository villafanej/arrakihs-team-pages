/*
 * Tells the WordPress page that embeds this table how tall it is, so
 * WordPress can size the frame to fit (it keeps it between 200 and 1000 px).
 * Same messages as WordPress's own embeds (wp-includes/js/wp-embed-template.js).
 */
(function () {
	'use strict';

	// Opened directly, not inside a frame: nothing to tell.
	if (window.self === window.top) {
		return;
	}

	// WordPress adds "#?secret=<letters/digits>" to the frame's address and
	// only listens to messages that carry the same secret.
	var match = window.location.hash.match(/secret=([A-Za-z0-9]+)/);
	if (!match) {
		return;
	}
	var secret = match[1];

	// Send this page's current height to the embedding page.
	function sendHeight() {
		var height = Math.ceil(document.body.getBoundingClientRect().height);
		window.parent.postMessage({ message: 'height', value: height, secret: secret }, '*');
	}

	// WordPress says "ready" once it is listening: answer with the height.
	window.addEventListener('message', function (e) {
		var data = e.data || {};
		if (data.secret === secret && data.message === 'ready') {
			sendHeight();
		}
	});

	// Send it now, once everything has loaded, and again whenever the size
	// changes (web font arriving, narrower screen wrapping rows).
	sendHeight();
	window.addEventListener('load', sendHeight);
	if (window.ResizeObserver) {
		new ResizeObserver(sendHeight).observe(document.body);
	}
})();
