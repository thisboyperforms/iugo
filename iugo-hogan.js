// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name default.js
// @language ECMASCRIPT5
// ==/ClosureCompiler==

/**
 * Author Chris Scott <chris.scott@factmint.com>
 * Delivered with and licensed under the MIT licence
 */
// This initializer compiles innerHTML (mustache templates) with Hogan
$iugo['initializers'].push(function(view, store) {

	var templateNodes = view.querySelectorAll('script[data-bindto][type="text/x-mustache-template"]');
	
	for (var templateNumber = 0; templateNumber < templateNodes.length; templateNumber++) {
		var template = templateNodes[templateNumber];
		
		var key = template.getAttribute('data-bindto');
		if (! key) {
			throw 'BINDING ERROR: "data-bindto" must be set to a key';
		}
		
		if (! store[key]) {
			store[key] = [];
		}
		
		store[key].push({
			injectAt: templateNumber,
			template: Hogan.compile(template.innerHTML)
		});
		
		template.outerHTML = "<!--IUGOSTART" + templateNumber + "--><!--IUGOEND" + templateNumber + "-->";
	}
});
// This VC renders Hogan templates
$iugo['defaultViewcontrollers'].push(function(property, value, view, store) {
	var partials = store[property];
	
	if (partials) {
		for (var partialNumber = 0; partialNumber < partials.length; partialNumber++) {
			var partial = partials[partialNumber];
			
			var startInject = "<!--IUGOSTART" + partial.injectAt + "-->";
			var endInject = "<!--IUGOEND" + partial.injectAt + "-->";
			var r = new RegExp(startInject + "[\\s\\S]*" + endInject);
			var n = startInject + partial.template.render(value) + endInject;
			view.innerHTML = view.innerHTML.replace(r, n);
		}
	}
});
