"use strict";

window.__insp = window.__insp || [];
__insp.push(['wid', 930668447]);
(function() {
	function __ldinsp(){var insp = document.createElement('script'); insp.type = 'text/javascript'; insp.async = true; insp.id = "inspsync"; insp.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js'; var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(insp, x); }
		if (window.attachEvent){
			window.attachEvent('onload', __ldinsp);
		}else{
			window.addEventListener('load', __ldinsp, false);
	}

	// MS Add-in's
	// User ID
	console.log(location.hostname);
	switch(location.host) {
		case "127.0.0.1" : 
			// ID IP Address
			__insp.push(['identify', "Development"]);
			// Tag User Session
			__insp.push(['tagSession', {user: "Ryan Watkins", server: "localhost"}]);
			break;
		default :
			// Don't identify; this will show the IP address by default
			break;
	}
})();