this["Zebra"] = this["Zebra"] || {};
this["Zebra"]["tmpl"] = this["Zebra"]["tmpl"] || {};

this["Zebra"]["tmpl"]["charts"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "    <li><a href=\"#places/shared/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n";
},"3":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "    <li><a href=\"#places/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<ol class=\"breadcrumb\">\n	<li><a href=\"#\">Places</a></li>\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.shared : stack1), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers.unless.call(depth0, ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.shared : stack1), {"name":"unless","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	<li class=\"active\">Charts</li>\n</ol>\n<ul class=\"nav nav-tabs\" role=\"tablist\" id=\"charts-tabs\">\n	<li class=\"active\"><a href=\"#occupation-tab\" role=\"tab\" data-toggle=\"tab\">Occupation</a></li>\n	<li><a href=\"#heatmap-tab\" role=\"tab\" data-toggle=\"tab\">Heatmap</a></li>\n	<li><a href=\"#white-spaces-tab\" role=\"tab\" data-toggle=\"tab\">White Spaces</a></li>\n</ul>\n<div class=\"tab-content\">\n	<div class=\"tab-pane fade in active\" id=\"occupation-tab\"></div>\n	<div class=\"tab-pane fade\" id=\"heatmap-tab\"></div>\n	<div class=\"tab-pane fade\" id=\"white-spaces-tab\"></div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["contact"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"contact-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <h1 class=\"modal-title text-skinny\">GET IN TOUCH </h1>\n        <h1 class=\"modal-title text-skinny\">WITH US </h1>\n      </div>\n      <div class=\"modal-body\">\n        <div id=\"contact-info\">\n          <section class=\"contact-card\">\n            <span class=\"ws-dark-gray\"><b>Freddy Rondón</b></span><br>\n            <span class=\"ws-gray\">Developer</span><br>\n            <a class=\"ws-blue\" href=\"mailto:ifreddyrondon@gmail.com\">ifreddyrondon@gmail.com</a>\n          </section>\n          <section class=\"contact-card\">\n            <span class=\"ws-dark-gray\"><b>Andrés Arcia</b></span><br>\n            <span class=\"ws-gray\">Developer</span><br>\n            <a class=\"ws-blue\" href=\"mailto:andres.arcia@cl.cam.ac.uk\">andres.arcia@cl.cam.ac.uk</a>\n          </section>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["edit_coordinates"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"row\">\n	<div id=\"su-list-coord-to-edit\" class=\"col-md-3\"></div>\n	<div class=\"col-md-9\">\n		<div id=\"ed-coord-controls\" class=\"col-xs-12 col-sm-12 col-md-12\">\n			<div class=\"btn-group\">\n				<button type=\"button\" class=\"btn action-btn\" id=\"ed-coord-delete\" disabled>\n					<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n				</button>\n			</div>\n			<div class=\"btn-group\">\n				<button type=\"button\" class=\"btn select-btn\" id=\"ed-coord-select-first-coord\">\n					first\n				</button>\n				<button type=\"button\" class=\"btn select-btn\" id=\"ed-coord-select-last-coord\">\n					last\n				</button>\n\n				<button type=\"button\" class=\"btn action-btn\" id=\"ed-coord-select-left-plus-coord\" disabled>\n					<span class=\"glyphicon glyphicon-plus-sign\" aria-hidden=\"true\"></span>\n				</button>\n				<input type=\"input\" class=\"action-btn\" id=\"ed-coord-window-left-input\" value=\"5\" size=\"3\" maxlength=\"3\" disabled/>\n				<button type=\"button\" class=\"btn 2-action-btn\" id=\"ed-coord-select-left-minus-coord\" disabled>\n					<span class=\"glyphicon glyphicon-minus-sign\" aria-hidden=\"true\"></span>\n				</button>\n\n				<button type=\"button\" class=\"btn action-btn\" id=\"ed-coord-select-zoom-out-coord\" disabled>\n					<span class=\"glyphicon glyphicon-zoom-out\" aria-hidden=\"true\"></span>\n				</button>\n				<button type=\"button\" class=\"btn action-btn\" id=\"ed-coord-select-zoom-to-fit-coord\" disabled>\n					<span class=\"glyphicon glyphicon-zoom-in\" aria-hidden=\"true\"></span>\n				</button>\n\n				<button type=\"button\" class=\"btn 2-action-btn\" id=\"ed-coord-select-right-minus-coord\" disabled>\n					<span class=\"glyphicon glyphicon-minus-sign\" aria-hidden=\"true\"></span>\n				</button>\n				<input type=\"input\" class=\"2-action-btn\" id=\"ed-coord-window-right-input\" value=\"5\" size=\"3\" maxlength=\"3\" disabled/>\n				<button type=\"button\" class=\"btn action-btn\" id=\"ed-coord-select-right-plus-coord\" disabled>\n					<span class=\"glyphicon glyphicon-plus-sign\" aria-hidden=\"true\"></span>\n				</button>\n\n				<button type=\"button\" class=\"btn action-btn\" id=\"ed-coord-deselect\">\n					deselect\n				</button>\n			</div>\n		</div>\n  		<div class=\"col-xs-11 col-sm-11 col-md-11\">\n			<div id=\"ed-coord-canvas\"></div>\n		</div>\n		<div class=\"col-xs-1 col-sm-1 col-md-1\">\n			<div id=\"ed-coord-markers-slider\" style=\"height:450px;\"></div>\n		</div>\n		<div class=\"col-md-11 col-md-offset-0\">\n			<div class=\"col-md-12 col-sm-12 col-xs-12\">\n				<div id=\"ed-coord-spreader-chart\" style=\"height:90px;width:100%;\"></div> \n			</div>\n			<div class=\"col-md-3 col-sm-3\">\n				<select class=\"form-control\" id=\"ed-coord-spreader-unit\">\n					<option value=\"m\">Meters - m</option>\n					<option value=\"km\">Kilometers - km</option>\n				</select>\n				<br>\n				<br>\n			</div>\n			<div class=\"col-md-9 col-sm-9\">\n				<div id=\"ed-coord-spreader-slider\"></div>\n			</div>\n		</div>\n  	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["edit_coordinates_list"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hidden : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	<h2><small>Edit list</small></h2>\n\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"each","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.create : depth0), {"name":"if","hash":{},"fn":this.program(16, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n";
  stack1 = helpers.unless.call(depth0, ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.shared : stack1), {"name":"unless","hash":{},"fn":this.program(18, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<br>\n		<div class=\"ws-blue pull-right\">\n			<small>Hidden restore stack</small>\n			<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(((helper = (helper = helpers.hiddenNumber || (depth0 != null ? depth0.hiddenNumber : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"hiddenNumber","hash":{},"data":data}) : helper)))
    + "</small></span>\n		</div>\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, buffer = "		<a href=\"javascript:void(0)\" class=\"ed-coord-to-edit\">\n			<span href=\"javascript:void(0)\" class=\"pull-right ws-red ed-coord-remove-from-list\">\n				<small>remove from list</small>\n			</span> \n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.from : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.from : depth0), {"name":"unless","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</a>\n";
},"5":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "				<div class=\"ws-blue\">\n					<small>From</small>\n					<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.from : depth0)) != null ? stack1.index : stack1), depth0))
    + "</small></span>\n				</div>\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.from : depth0)) != null ? stack1.lat : stack1), {"name":"if","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "				\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.to : depth0), {"name":"if","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.to : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"6":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "					<div class=\"ws-gray\">\n						<small>\n							&nbsp<b>lat</b>: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.from : depth0)) != null ? stack1.lat : stack1), depth0))
    + " \n							<br>\n							&nbsp<b>lng</b>: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.from : depth0)) != null ? stack1.lng : stack1), depth0))
    + "\n						</small>\n					</div>\n";
},"8":function(depth0,helpers,partials,data) {
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing, buffer = "					<div class=\"ws-blue\">\n						<small>To</small>\n						<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.to : depth0)) != null ? stack1.index : stack1), depth0))
    + "</small></span>\n					</div>\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.to : depth0)) != null ? stack1.lat : stack1), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n					<div class=\"ws-blue\">\n						<small>Distance</small>\n						<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(((helper = (helper = helpers.distance || (depth0 != null ? depth0.distance : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"distance","hash":{},"data":data}) : helper)))
    + " km</small></span>\n					</div>\n";
},"9":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "						<div class=\"ws-gray\">\n							<small>\n								<b>lat</b>: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.to : depth0)) != null ? stack1.lat : stack1), depth0))
    + " \n								<br>\n								<b>lng</b>: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.to : depth0)) != null ? stack1.lng : stack1), depth0))
    + "\n							</small>\n						</div>\n";
},"11":function(depth0,helpers,partials,data) {
  return "					<small>You can select two markers for make a range</small>\n";
  },"13":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.values : depth0), {"name":"if","hash":{},"fn":this.program(14, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"14":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "					<div class=\"ws-blue\">\n						<small>Distance</small>\n						<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(((helper = (helper = helpers.distance || (depth0 != null ? depth0.distance : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"distance","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.unit || (depth0 != null ? depth0.unit : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"unit","hash":{},"data":data}) : helper)))
    + "</small></span>\n					</div>\n					<div class=\"ws-blue\">\n						<small>Count</small>\n						<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(((helper = (helper = helpers.count || (depth0 != null ? depth0.count : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"count","hash":{},"data":data}) : helper)))
    + "</small></span>\n					</div>\n";
},"16":function(depth0,helpers,partials,data) {
  return "		<a href=\"javascript:void(0)\" class=\"ws-dark-gray\" id=\"ed-coord-new-edition\">\n			<h3>Click <small>to create a new edition range</small></h3>\n		</a>\n";
  },"18":function(depth0,helpers,partials,data) {
  return "    <button type=\"button\" class=\"btn btn-default btn-sm btn-block save-btn\" id=\"ed-coord-save\">Save</button>\n	<button type=\"button\" class=\"btn btn-default btn-sm btn-block save-btn\" id=\"ed-coord-save-as\">Save as</button>\n";
  },"20":function(depth0,helpers,partials,data) {
  return "	<div class=\"page-header\">\n		<h1>Click <small>on any marker or drag slider to start editing</small></h1>\n	</div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"unless","hash":{},"fn":this.program(20, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});

this["Zebra"]["tmpl"]["edit_outliers"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "			        <th class=\"text-center\">Remove</th>\n";
  },"3":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "				<tr>\n					<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.power : stack1), depth0))
    + "</td>\n					<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.frequency : stack1), depth0))
    + "</td>\n";
  stack1 = helpers.unless.call(depth0, (depths[1] != null ? depths[1].shared : depths[1]), {"name":"unless","hash":{},"fn":this.program(4, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "				</tr>\n";
},"4":function(depth0,helpers,partials,data) {
  return "					<td>\n						<button class=\"btn btn-danger btn-xs btn-delete-outlier\">\n							<span class=\"glyphicon glyphicon-trash\"></span>\n						</button>\n					</td>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "<br>\n<div class=\"row\">\n	<div class=\"col-md-12 text-center\">\n		<table class=\"table table-striped table-hover table-condensed table-bordered\">\n			<thead>\n			    <tr>\n			        <th class=\"text-center\">Power (dBm)</th>\n			        <th class=\"text-center\">Occurrence frequency</th>\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.shared : depth0), {"name":"unless","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "			    </tr>\n		    </thead>\n		    <tbody>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.outliers : depth0), {"name":"each","hash":{},"fn":this.program(3, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</tbody>\n		</table>\n	</div>\n</div>";
},"useData":true,"useDepths":true});

this["Zebra"]["tmpl"]["edit_place"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "    <li><a href=\"#places/shared/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n";
},"3":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "    <li><a href=\"#places/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<ol class=\"breadcrumb\">\n	<li><a href=\"#\">Places</a></li>\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.shared : stack1), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers.unless.call(depth0, ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.shared : stack1), {"name":"unless","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	<li class=\"active\">Edit place</li>\n</ol>\n<ul class=\"nav nav-tabs\" role=\"tablist\" id=\"edit-tabs\">\n	<li class=\"active\"><a href=\"#edit-coord-tab\" role=\"tab\" data-toggle=\"tab\">Coordinates</a></li>\n	<li><a href=\"#edit-outliers-tab\" role=\"tab\" data-toggle=\"tab\">Outliers</a></li>\n</ul>\n<div class=\"tab-content\">\n	<div class=\"tab-pane fade in active\" id=\"edit-coord-tab\"></div>\n	<div class=\"tab-pane fade\" id=\"edit-outliers-tab\"></div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["error"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "				  		<li><h4><em>"
    + escapeExpression(lambda(depth0, depth0))
    + "</em></h4></li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"ws-error\">\n	<div class=\"ws-error-message\">\n		<div class=\"ws-error-glyphicon pull-left\">\n			<span class=\"glyphicon glyphicon-2x glyphicon-warning-sign\"></span>\n		</div>\n		<ul class=\"list-inline\">\n		  	<li><h3>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h3></li>\n		  	<li>\n		  		<ul class=\"list-unstyled\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.message : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "				</ul>\n		  	</li>\n		</ul>\n		<button id=\"error-button\" type=\"button\" class=\"btn ws-error-button btn-lg\">Got it</button>\n	</div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["glass_pane"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<a class=\"glass-icon\" style=\"font-size: "
    + escapeExpression(((helper = (helper = helpers.fontSize || (depth0 != null ? depth0.fontSize : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fontSize","hash":{},"data":data}) : helper)))
    + "\">\n			<span class=\"glyphicon "
    + escapeExpression(((helper = (helper = helpers.icon || (depth0 != null ? depth0.icon : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"icon","hash":{},"data":data}) : helper)))
    + "\"></span>\n		</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"glass-pane\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.icon : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"useData":true});

this["Zebra"]["tmpl"]["heatmap"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "			<div class=\"form-group\">\n				<label for=\"h-frequency-bands\">Frequency bands</label>\n				<input class=\"form-control\" id=\"h-frequency-bands\" type=\"hidden\" />\n			</div>\n";
  },"3":function(depth0,helpers,partials,data) {
  return "				<label for=\"h-channel-width\">Channel width</label>\n				<input class=\"form-control\" id=\"h-channel-width\" type=\"hidden\" />\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<br>\n<div class=\"row\">\n	<div class=\"col-md-3 settings\">\n		<h4>Data Settings</h4>\n		<div class=\"form-group\">\n			<label for=\"h-function-operate\">Pick a function to operate on the data</label>\n			<select class=\"form-control\" id=\"h-function-operate\">\n				<option></option>\n				<option value=\"avg\" selected>Average</option>\n				<option value=\"max\">Maximum</option>\n				<option value=\"min\">Minimum</option>\n			</select>\n		</div>\n		<div class=\"form-group\">\n			<label for=\"h-max-intensity-slider\">Suggested referential Maximum</label>\n			<div id=\"h-max-intensity-slider\"></div>\n		</div>\n		<div class=\"form-group\">\n			<label for=\"h-select-frequency-by\">Select frequency by</label>\n			<br />\n			<label class=\"radio-inline\">\n				<input type=\"radio\" name=\"h-select-frequency-by\" value=\"range\" checked> Range\n			</label>\n			<label class=\"radio-inline\">\n				<input type=\"radio\" name=\"h-select-frequency-by\" value=\"channels\"> Channels\n			</label>\n		</div>\n		<h4>Heatmap Settings</h4>\n		<div class=\"form-group\">\n			<label for=\"h-opacity-slider\">Opacity</label>\n			<div id=\"h-opacity-slider\"></div>\n		</div>\n		<div class=\"form-group\">\n			<label for=\"h-radius-slider\">Radius</label>\n			<div id=\"h-radius-slider\"></div>\n		</div>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.bands : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "		<br />\n		<div class=\"form-group h-channels-settings\">\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.frequenciesChannelWidth : stack1), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</div>\n	</div>\n	<div class=\"col-md-9\">\n		<div class=\"col-xs-11 col-sm-11 col-md-11\">\n			<div id=\"h-canvas\"></div>\n		</div>\n		<div class=\"col-xs-1 col-sm-1 col-md-1\">\n			<div id=\"h-markers-slider\" class=\"h-controllers\" style=\"height:400px;\"></div>\n		</div>\n\n		<div class=\"col-md-11 col-md-offset-0 h-controllers\">\n			<div class=\"col-md-12 h-range-slider-settings\">\n				<div id=\"h-range-slider\"></div>\n			</div>\n			<div class=\"col-md-12 h-channels-settings\">\n				<label for=\"h-select-channels\">Please select the channels to observe</label>\n				<input class=\"form-control\" id=\"h-select-channels\" type=\"hidden\" />\n			</div>\n\n			<div class=\"h-spreader-container\">\n				<h5 class=\"col-md-12\">Please select the unit and distance between each point</h5>\n				<div class=\"col-md-3\">\n					<label for=\"h-spreader-unit\">Unit</label>\n					<select class=\"form-control\" id=\"h-spreader-unit\">\n						<option value=\"m\">Meters - m</option>\n						<option value=\"km\">Kilometers - km</option>\n					</select>\n				</div>\n				<div class=\"col-md-9\">\n					<label for=\"h-spreader-slider\">Distance</label>\n					<div id=\"h-spreader-slider\"></div>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["login"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"scene\">\n  <div class=\"mask\"></div>\n  <div class=\"content\">\n    <div class=\"form layer\">\n      <div class=\"logo\"></div>\n      <h1>ZEBRA RFO</h1>\n      <h6>RADIO FREQUENCY OBSERVER</h6>\n      <form id=\"login-form\">\n        <input type=\"email\" class=\"\" id=\"login-email\" placeholder=\"Email\">\n        <input type=\"password\" class=\"\" id=\"login-password\" placeholder=\"Password\">\n        <button type=\"submit\" id=\"login-submit\">\n          <span class=\"glyphicon glyphicon-arrow-right\"></span>\n        </button>\n        <div class=\"checkbox\">\n          <label>\n            <input type=\"checkbox\"> Keep me signed in\n          </label>\n        </div>\n      </form>\n      <br>\n      <hr>\n      <h5 id=\"login-new-account\" class=\"text-skinny text-center\">Don't have an account in zebra? <a href=\"javascript:void(0)\"><b>Create it now</b></a></h5>\n      <br>\n      <div class=\"login-footer\">\n        <div class=\"logo-left\">\n          <a href=\"http://www.cl.cam.ac.uk/~as2330/n4d/\" target=\"_blank\">\n            <img src=\"/images/cambridge.png\">\n          </a>\n        </div>\n        <div class=\"logo-center\">\n          <a href=\"http://wireless.ictp.it\" target=\"_blank\">\n            <img src=\"/images/ictp.png\">\n          </a>\n        </div>\n        <div class=\"logo-right\">\n          <a href=\"http://rife-project.eu\" target=\"_blank\">\n            <img src=\"/images/rife.png\">\n          </a>\n        </div>\n      </div>\n    </div>\n    <div class=\"background layer\" data-depth=\"0.5\"></div>\n  </div>\n</div>\n<footer class=\"about-footer\">\n  <p class=\"contact-info\">\n    <a id=\"get-in-touch\" href=\"javascript:void(0)\">GET IN TOUCH</a>\n  </p>\n</footer>";
  },"useData":true});

this["Zebra"]["tmpl"]["main"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"navbar\"></div>\n<div id=\"z-modal\"></div>\n<div id=\"main-menu\" class=\"col-xs-12 col-sm-3 col-md-2\"></div>\n<div class=\"col-xs-12 col-sm-9 col-md-10 ws-modal\">\n	<div id=\"waiting\"></div>\n	<div id=\"error\"></div>\n	<div id=\"ws-containter\"></div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["main_login"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"z-modal\"></div>\n<div id=\"waiting\"></div>\n<div id=\"login-container\"></div>";
  },"useData":true});

this["Zebra"]["tmpl"]["main_menu"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<ul class=\"list-group\">\n	<li>\n		<a href=\"#\" class=\"active\">\n			<span class=\"glyphicon glyphicon-globe\"></span>\n			<span> Places</span>\n		</a>\n	</li>\n\n	<li>\n		<a href=\"#help\">\n			<span class=\"glyphicon glyphicon-question-sign\"></span>\n			<span> Help</span>\n		</a>\n	</li>\n</ul>";
  },"useData":true});

this["Zebra"]["tmpl"]["main_menu_sub_single_place"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<ul class=\"list-group\">\n	<li>\n		<a href=\"#places/"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n			<span class=\"glyphicon glyphicon-map-marker\"></span>\n			<span> Coordinates</span>\n		</a>\n	</li>\n	<li>\n		<a href=\"#places/"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "/edit?type=coordinates\">\n			<span class=\"glyphicon glyphicon-pencil\"></span>\n			<span> Edit place</span>\n		</a>\n	</li>\n	<li>\n		<a href=\"#places/"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "/charts?type=occupation\">\n			<span class=\"glyphicon glyphicon-stats\"></span>\n			<span> Occupation</span>\n		</a>\n	</li>\n</ul>";
},"useData":true});

this["Zebra"]["tmpl"]["main_menu_sub_upload"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<ul class=\"list-group\">\n	<li>\n		<a href=\"#places/upload\">\n			<span class=\"glyphicon glyphicon-floppy-open\"></span>\n			<span> Upload</span>\n		</a>\n	</li>\n</ul>";
  },"useData":true});

this["Zebra"]["tmpl"]["map_modal"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"modal fade\" id=\"map-modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-body\"></div>\n    </div>\n  </div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["map_over_options"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"map-component-over\">\n	<div class=\"col-md-12\">\n		<a href=\"javascript:void(0)\" class=\"map-component-config\">\n			<span class=\"glyphicon glyphicon-cog\"></span>\n		</a>\n		<a href=\"javascript:void(0)\" class=\"pull-right map-component-resize-full\">\n			<span class=\"glyphicon glyphicon-resize-full\"></span>\n		</a>\n		<a href=\"javascript:void(0)\" class=\"pull-right map-component-resize-small\">\n			<span class=\"glyphicon glyphicon-resize-small\"></span>\n		</a>\n	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["modal_parsing_measures"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"modal fade\" id=\"u-modal-parsing\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n	<div class=\"modal-dialog\">\n		<div class=\"modal-content\">\n			<div class=\"modal-body\">\n				<div class=\"progress\">\n						<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 0%;\">\n						0%\n						</div>\n				</div>\n\n				<div class=\"list-group\">\n					<a href=\"#\" class=\"list-group-item active\">\n						<span class=\"badge\">0/"
    + escapeExpression(((helper = (helper = helpers.numFiles || (depth0 != null ? depth0.numFiles : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"numFiles","hash":{},"data":data}) : helper)))
    + "</span>\n						Files processed\n					</a>\n					<a href=\"#\" class=\"list-group-item\">\n						<h4 id=\"u-modal-parsing-table-heading\" class=\"list-group-item-heading\">Measures data</h4>\n						<table id=\"u-modal-parsing-table\" class=\"table table-hover\">\n							<tr>\n								<td>Name</td><td></td>\n							</tr>\n							<tr>\n								<td>Total number of samples</td><td></td>\n							</tr>\n							<tr>\n								<td>Total number of frequencies</td><td></td>\n							</tr>\n							<tr>\n								<td>Range of frequencies</td><td></td>\n							</tr>\n						</table>\n					</a>\n					<a href=\"#\" class=\"list-group-item\">Uploading data\n						<span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate pull-right\"></span>\n					</a>\n					<a href=\"#\" class=\"list-group-item\">Processing in server\n						<span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate pull-right\"></span>\n					</a>\n				</div>\n\n\n			</div>\n			<div class=\"modal-footer\">\n				<button id=\"u-modal-parsing-cancel-btn\" type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Cancel upload</button>\n			</div>\n		</div>\n	</div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["navbar"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n	<div class=\"container-fluid\">\n		<div class=\"navbar-header\" id=\"navbar-header\">\n			<button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#navbar-menu\">\n				<span class=\"glyphicon glyphicon-user\"></span>\n				<b class=\"caret\"></b>\n			</button>\n			<a href=\"#\" class=\"navbar-brand\">\n				<div class=\"logo\"></div>\n				<h1>ZEBRA RFO</h1>\n				<h6>RADIO FREQUENCY OBSERVER</h6>\n			</a>\n		</div>\n\n		<div class=\"collapse navbar-collapse\" id=\"navbar-menu\">\n			<ul class=\"nav navbar-nav navbar-right\">\n				<li class=\"dropdown\">\n					<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n						<span class=\"username\">"
    + escapeExpression(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"email","hash":{},"data":data}) : helper)))
    + "</span>\n						<span class=\"glyphicon glyphicon-user\"></span>\n						<b class=\"caret\"></b>\n					</a>\n					<ul class=\"dropdown-menu\" role=\"menu\">\n						<li><a href=\"#\">Profile</a></li>\n						<li><a href=\"#\">Account settings</a></li>\n						<li class=\"divider\"></li>\n						<li><a href=\"#logout\">Log Out</a></li>\n					</ul>\n				</li>\n			</ul>\n		</div>\n	</div>\n</nav>";
},"useData":true});

this["Zebra"]["tmpl"]["navbar_mobil"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n	<div class=\"container-fluid\">\n		<div class=\"navbar-header\" id=\"navbar-header\">\n			<button type=\"button\" class=\"navbar-toggle\" id=\"toggle-main-menu\">\n				<span class=\"sr-only\">Toggle navigation</span>\n				<span class=\"icon-bar\"></span>\n				<span class=\"icon-bar\"></span>\n				<span class=\"icon-bar\"></span>\n			</button>\n			<button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#navbar-menu\">\n				<span class=\"glyphicon glyphicon-user\"></span>\n				<b class=\"caret\"></b>\n			</button>\n			<a href=\"#\" class=\"navbar-brand\">\n				<div class=\"logo\"></div>\n				<h1>ZEBRA RFO</h1>\n				<h6>RADIO FREQUENCY OBSERVER</h6>\n			</a>\n		</div>\n\n		<div class=\"collapse navbar-collapse\" id=\"navbar-menu\">\n			<ul class=\"nav navbar-nav navbar-right\">\n				<li><a href=\"#\">Profile</a></li>\n				<li><a href=\"#\">Account settings</a></li>\n				<li class=\"divider\"></li>\n				<li><a href=\"#logout\">Log Out</a></li>\n			</ul>\n		</div>\n	</div>\n</nav>";
  },"useData":true});

this["Zebra"]["tmpl"]["occupation"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "				<div class=\"form-group\">\n					<label for=\"o-frequency-bands\" class=\"col-sm-2 control-label\">Frequency bands</label>\n					<div class=\"col-sm-10\">\n						<input class=\"form-control\" id=\"o-frequency-bands\" type=\"hidden\" />\n					</div>\n				</div>\n";
  },"3":function(depth0,helpers,partials,data) {
  return "				<div class=\"form-group\">\n					<label for=\"o-channel-width\" class=\"col-sm-2 control-label\">Channel width</label>\n					<div class=\"col-sm-10\">\n						<input class=\"form-control\" id=\"o-channel-width\" type=\"hidden\" />\n					</div>\n				</div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"row\">\n	<div class=\"col-md-12 o-settings\">\n		<form class=\"form-horizontal\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.bands : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.frequenciesChannelWidth : stack1), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			<div class=\"form-group\">\n				<label for=\"o-threshold-slider\" class=\"col-sm-2 control-label\">Threshold</label>\n				<div class=\"col-sm-10\">\n					<div id=\"o-threshold-slider\"></div>\n				</div>\n			</div>\n		</form>\n	</div>\n	<div id=\"o-chart\" class=\"col-md-12\">\n		<div class=\"captures-chart\" style=\"height:420px;width:95%;\"></div> \n		<div class=\"high-chart-tooltip\">\n			<p style=\"margin:0\">default</p>\n		</div>\n	</div>\n	<div class=\"col-md-12 o-settings\">\n		<div class=\"form-group input-group\">\n			<input class=\"form-control\" id=\"o-select-channels\" type=\"hidden\" />\n			<div class=\"input-group-btn\">\n				<button type=\"button\" class=\"btn btn-primary\" id=\"o-heatmap-btn\">Build heatmap</button>\n			</div>\n		</div>\n	</div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["password_requirements"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"tooltip\" role=\"tooltip\">\n	<div class=\"tooltip-arrow\"></div>\n	<div class=\"tooltip-inner-2\">\n		<b>Your password mush have:</b>\n		<div class=\"text-skinny\">\n			<ul>\n				<li>8 or more characters</li>\n				<li>At least one number</li>\n				<li>Upper and lowercase letters</li>\n			</ul>\n		</div>\n	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["place"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "					<a href=\"#places/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.id : stack1), depth0))
    + "/upload\" class=\"pull-right ws-blue\">\n						<small>upload more samples</small>\n					</a>\n					<br>\n";
},"3":function(depth0,helpers,partials,data) {
  return "					<br>\n					<a href=\"javascript:void(0)\" id=\"p-delete\" class=\"pull-right ws-red\">\n						<small>delete</small>\n					</a>\n";
  },"5":function(depth0,helpers,partials,data) {
  return "						<tr>\n							<td colspan=\"2\">\n								<label for=\"p-frequency-bands\">Frequency bands</label>\n								<input class=\"form-control\" id=\"p-frequency-bands\" type=\"hidden\" />\n							</td>\n						</tr>\n";
  },"7":function(depth0,helpers,partials,data) {
  return "						<tr>\n							<td colspan=\"2\">\n								<label for=\"p-channel-width\">Channel width</label>\n								<input class=\"form-control\" id=\"p-channel-width\" type=\"hidden\" />\n							</td>\n						</tr>\n";
  },"9":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "				<div class=\"pull-left\">\n	                <b>by</b> "
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.User : stack1)) != null ? stack1.email : stack1), depth0))
    + "\n	            </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "<ol class=\"breadcrumb\">\n	<li><a href=\"#\">Places</a></li>\n	<li class=\"active\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.name : stack1), depth0))
    + "</li>\n</ol>\n\n<div class=\"row\">\n	<div class=\"col-md-4\">\n		<div class=\"panel panel-default\" id=\"place-info\">\n			<div class=\"panel-body\">\n				<div class=\"links\">\n";
  stack1 = helpers.unless.call(depth0, ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.isShared : stack1), {"name":"unless","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "					<a href=\"javascript:void(0)\" id=\"p-download\" class=\"pull-right ws-blue\">\n						<small>download place</small>\n					</a>\n";
  stack1 = helpers.unless.call(depth0, ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.isShared : stack1), {"name":"unless","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "				</div>\n				<h3 class=\"col-md-12 name\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h3>\n				<table class=\"table table-striped\">\n					<tr>\n						<td>Total number of samples</td>\n						<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.numberCoordinates : stack1), depth0))
    + "</td>\n					</tr>\n					<tr>\n						<td>Total distance</td>\n						<td>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.distance : stack1)) != null ? stack1.total : stack1), depth0))
    + " <small><b>km</b></small></td>\n					</tr>\n					<tr>\n						<td>Total number of frequencies</td>\n						<td>"
    + escapeExpression(lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.frequencies : stack1)) != null ? stack1.values : stack1)) != null ? stack1.length : stack1), depth0))
    + "</td>\n					</tr>\n					<tr>\n						<td>Range of frequencies</td>\n						<td>["
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.frequencies : stack1)) != null ? stack1.min : stack1), depth0))
    + "-"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.frequencies : stack1)) != null ? stack1.max : stack1), depth0))
    + "] <small><b>MHz</b></small></td>\n					</tr>\n					<tr>\n						<td>Minimum power</td>\n						<td>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.power : stack1)) != null ? stack1.min : stack1), depth0))
    + " <small><b>dBm</b></small></td>\n					</tr>\n					<tr>\n						<td>Maximum power</td>\n						<td>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.power : stack1)) != null ? stack1.max : stack1), depth0))
    + " <small><b>dBm</b></small></td>\n					</tr>\n					<tr>\n						<td>Average power</td>\n						<td>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.power : stack1)) != null ? stack1.avg : stack1), depth0))
    + " <small><b>dBm</b></small></td>\n					</tr>\n					<tr>\n						<td>Standard deviation of power</td>\n						<td>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.power : stack1)) != null ? stack1.sd : stack1), depth0))
    + " <small><b>dBm</b></small></td>\n					</tr>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.bands : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.frequenciesChannelWidth : stack1), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "				</table>\n\n				<button id=\"p-edit\" class=\"btn btn-success btn-xs btn-block btn-without-corners\" type=\"button\">\n					Edit place\n				</button>\n			</div>\n			<div class=\"panel-footer\">\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.isShared : stack1), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	            <div class=\"pull-right\">\n	                <span class=\"glyphicon glyphicon-time\"></span>\n	                "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.friendlyDate : stack1), depth0))
    + "\n	            </div>\n	            <br>\n			</div>\n		</div>\n	</div>\n\n	<div class=\"col-md-8\">\n		<div id=\"p-map\"></div>\n		<div id=\"p-selected-coord\">\n			<div class=\"page-header\" style=\"text-align:center\">\n					<h1>Click <small>on any marker will get info of the sample</small></h1>\n			</div>\n		</div>\n	</div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["place_coordinate_resume"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<ul class=\"list-group\">\n	<li class=\"list-group-item\">\n		<table class=\"table table-condensed\">\n			<thead>\n				<tr>\n					<th>Latitude</th>\n					<th>Longitude</th>\n				</tr>\n			</thead>\n			<tbody>\n				<tr>\n					<td>"
    + escapeExpression(((helper = (helper = helpers.lat || (depth0 != null ? depth0.lat : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"lat","hash":{},"data":data}) : helper)))
    + "</td>\n					<td>"
    + escapeExpression(((helper = (helper = helpers.lng || (depth0 != null ? depth0.lng : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"lng","hash":{},"data":data}) : helper)))
    + "</td>\n				</tr>\n			</tbody>\n			<thead>\n				<tr>\n					<th>Power</th>\n					<th>Value</th>\n				</tr>\n			</thead>\n			<tbody>\n				<tr>\n					<td>Minimum</td><td>"
    + escapeExpression(((helper = (helper = helpers.powerMin || (depth0 != null ? depth0.powerMin : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"powerMin","hash":{},"data":data}) : helper)))
    + " <small>dBm</small></td>\n				</tr>\n				<tr>\n					<td>Maximum</td><td>"
    + escapeExpression(((helper = (helper = helpers.powerMax || (depth0 != null ? depth0.powerMax : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"powerMax","hash":{},"data":data}) : helper)))
    + " <small>dBm</small></td>\n				</tr>\n				<tr>\n					<td colspan=\"2\">\n						<h5><small>Created date <b>"
    + escapeExpression(((helper = (helper = helpers.createdDate || (depth0 != null ? depth0.createdDate : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"createdDate","hash":{},"data":data}) : helper)))
    + "</b></small></h5> \n					</td>\n				</tr>\n			</tbody>\n		</table>\n		<div class=\"captures-chart\"></div>\n		<div class=\"high-chart-tooltip\">\n			<p style=\"margin:0\">default</p>\n		</div>\n	</li>\n</ul>";
},"useData":true});

this["Zebra"]["tmpl"]["places"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div role=\"tabpanel\">\n\n  <ul class=\"nav nav-tabs\" role=\"tablist\" id=\"places-tabs\">\n    <li role=\"presentation\" class=\"active\">\n      <a href=\"#me-tab\" aria-controls=\"panel-1\" role=\"tab\" data-toggle=\"tab\">My Places</a>\n    </li>\n    <li role=\"presentation\">\n      <a href=\"#shared-tab\" aria-controls=\"panel-1\" role=\"tab\" data-toggle=\"tab\">Shared Places</a>\n    </li>\n  </ul>\n \n  <div class=\"tab-content tab-content-places\">\n    <div role=\"tabpanel\" class=\"tab-pane active\" id=\"me-tab\"></div>\n    <div role=\"tabpanel\" class=\"tab-pane active\" id=\"shared-tab\"></div>\n  </div><!--End tab-content  -->\n\n</div><!--End tabpanel  -->";
  },"useData":true});

this["Zebra"]["tmpl"]["places_my"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "<!-- For each place -->\n    <div class=\"col-md-4 col-sm-6 item\"> <!-- Col container -->\n      <div class=\"panel panel-default panel-places\"><!-- Panel -->\n        <div class=\"panel-heading\"><!-- Heading -->\n          <div class=\"links\">\n            <a href=\"javascript:void(0)\" class=\"places-delete pull-left\" data-id=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" data-name=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">\n              <span class=\"glyphicon glyphicon-trash\"></span>\n            </a>\n\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.shared : stack1), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n";
  stack1 = helpers.unless.call(depth0, ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.shared : stack1), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "          </div> <!-- end links -->\n\n          <a href=\"#places/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">\n            <h4>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h4>\n          </a>\n        </div> <!-- End Panel Heading -->\n\n        <div class=\"panel-body\"><!-- Panel Body -->\n\n          <div class=\"tabbable-panel\"><!-- tabs de cards-->\n            <div class=\"tabbable-line\">\n              <ul class=\"nav nav-tabs \">\n                <li class=\"active\">\n                  <a href=\"#sumary_tab_shared_"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" data-toggle=\"tab\">Summary</a>\n                </li>\n                <li>\n                  <a href=\"#frequencies_tab_shared_"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" data-toggle=\"tab\">Frequencies</a>\n                </li>\n                <li>\n                  <a href=\"#power_tab_shared_"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" data-toggle=\"tab\">Power</a>\n                </li>\n              </ul>\n\n              <div class=\"tab-content\">\n                <div class=\"tab-pane active places-sumary\" id=\"sumary_tab_shared_"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">\n                  <div class=\"big-small col-md-6 col-sm-6 col-xs-6\">\n                    <h3>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.numberCoordinates : stack1), depth0))
    + "</h3>\n                    <h5><small>samples</small></h5>\n                  </div>\n                  <div class=\"big-small col-md-6 col-sm-6 col-xs-6\">\n                    <h3>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.distance : stack1)) != null ? stack1.total : stack1), depth0))
    + "</h3>\n                    <h6><small><b>km</b></small></h6>\n                    <h5><small>distance</small></h5>\n                  </div>\n                </div>\n\n                <div class=\"tab-pane places-frequencies\" id=\"frequencies_tab_shared_"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">\n                  <div class=\"big-small col-md-12 col-sm-12 col-xs-12\">\n                    <h4>"
    + escapeExpression(lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.frequencies : stack1)) != null ? stack1.values : stack1)) != null ? stack1.length : stack1), depth0))
    + "</h4>\n                    <h5><small>number of frequencies</small></h5>\n                  </div>\n                  <div class=\"big-small col-md-12 col-sm-12 col-xs-12\">\n                    <h4>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.frequencies : stack1)) != null ? stack1.min : stack1), depth0))
    + "-"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.frequencies : stack1)) != null ? stack1.max : stack1), depth0))
    + "</h4>\n                    <h6><small><b>MHz</b></small></h6>\n                    <h5><small>range</small></h5>\n                  </div>\n                </div>\n\n                <div class=\"tab-pane places-power\" id=\"power_tab_shared_"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">\n                  <div class=\"col-md-12 col-sm-12 col-xs-12\">\n                    <canvas class=\"power-canvas\" height=\"10\"></canvas>\n                  </div>\n                  <div class=\"big-small col-md-12 col-sm-12 col-xs-12\">\n                    <h5 class=\"pull-left\"><small>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.power : stack1)) != null ? stack1.min : stack1), depth0))
    + " dBm</small></h5>\n                    <h5 class=\"pull-right\"><small>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.power : stack1)) != null ? stack1.max : stack1), depth0))
    + " dBm</small></h5>\n                  </div>\n                </div>\n\n              </div>\n            </div>\n          </div> <!-- End tabs cards> -->\n\n        </div> <!-- End Panel Body> -->\n\n        <div class=\"panel-footer\"><!-- Panel Footer -->\n          <div class=\"pull-right\">\n            <span class=\"glyphicon glyphicon-time\"></span>\n            "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.friendlyDate : stack1), depth0))
    + "\n          </div>\n          <br>\n        </div> <!-- End Panel Footer -->\n\n      </div> <!-- End panel -->\n\n    </div> <!-- End Col container -->\n  ";
},"2":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "              <a href=\"javascript:void(0)\" class=\"places-share pull-right\" data-id=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" data-name=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">\n                <div class=\"share-message\">shared</div>\n                <span class=\"glyphicon glyphicon-share-alt\"></span>\n              </a>\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "              <a href=\"javascript:void(0)\" class=\"places-share not-shared pull-right\" data-id=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" data-name=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">\n                <div class=\"share-message\">not shared</div>\n                <span class=\"glyphicon glyphicon-share-alt\"></span>\n              </a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"row places-masonry-container\">\n\n  ";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " <!-- End Each -->\n \n</div><!--End masonry-container  -->";
},"useData":true});

this["Zebra"]["tmpl"]["places_shared"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<!-- For each place -->\n\n    <div class=\"col-md-4 col-sm-6 item\"> <!-- Col container -->\n      <div class=\"panel panel-default panel-places panel-places-shared\"><!-- Panel -->\n        <div class=\"panel-heading\"><!-- Heading -->\n          <a href=\"#places/shared/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">\n            <h4>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h4>\n          </a>\n        </div> <!-- End Panel Heading -->\n\n        <div class=\"panel-body\"><!-- Panel Body -->\n\n          <div class=\"tabbable-panel\"><!-- tabs de cards-->\n            <div class=\"tabbable-line\">\n              <ul class=\"nav nav-tabs \">\n                <li class=\"active\">\n                  <a href=\"#sumary_tab_"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" data-toggle=\"tab\">Summary</a>\n                </li>\n                <li>\n                  <a href=\"#frequencies_tab_"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" data-toggle=\"tab\">Frequencies</a>\n                </li>\n                <li>\n                  <a href=\"#power_tab_"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" data-toggle=\"tab\">Power</a>\n                </li>\n              </ul>\n\n              <div class=\"tab-content\">\n                <div class=\"tab-pane active places-sumary\" id=\"sumary_tab_"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">\n                  <div class=\"big-small col-md-6 col-sm-6 col-xs-6\">\n                    <h3>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.numberCoordinates : stack1), depth0))
    + "</h3>\n                    <h5><small>samples</small></h5>\n                  </div>\n                  <div class=\"big-small col-md-6 col-sm-6 col-xs-6\">\n                    <h3>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.distance : stack1)) != null ? stack1.total : stack1), depth0))
    + "</h3>\n                    <h6><small><b>km</b></small></h6>\n                    <h5><small>distance</small></h5>\n                  </div>\n                </div>\n\n                <div class=\"tab-pane places-frequencies\" id=\"frequencies_tab_"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">\n                  <div class=\"big-small col-md-12 col-sm-12 col-xs-12\">\n                    <h4>"
    + escapeExpression(lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.frequencies : stack1)) != null ? stack1.values : stack1)) != null ? stack1.length : stack1), depth0))
    + "</h4>\n                    <h5><small>number of frequencies</small></h5>\n                  </div>\n                  <div class=\"big-small col-md-12 col-sm-12 col-xs-12\">\n                    <h4>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.frequencies : stack1)) != null ? stack1.min : stack1), depth0))
    + "-"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.frequencies : stack1)) != null ? stack1.max : stack1), depth0))
    + "</h4>\n                    <h6><small><b>MHz</b></small></h6>\n                    <h5><small>range</small></h5>\n                  </div>\n                </div>\n\n                <div class=\"tab-pane places-power\" id=\"power_tab_"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">\n                  <div class=\"col-md-12 col-sm-12 col-xs-12\">\n                    <canvas class=\"power-canvas\" height=\"10\"></canvas>\n                  </div>\n                  <div class=\"big-small col-md-12 col-sm-12 col-xs-12\">\n                    <h5 class=\"pull-left\"><small>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.power : stack1)) != null ? stack1.min : stack1), depth0))
    + " dBm</small></h5>\n                    <h5 class=\"pull-right\"><small>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.power : stack1)) != null ? stack1.max : stack1), depth0))
    + " dBm</small></h5>\n                  </div>\n                </div>\n\n              </div>\n            </div>\n          </div> <!-- End tabs cards> -->\n\n        </div> <!-- End Panel Body> -->\n\n        <div class=\"panel-footer\"><!-- Panel Footer -->\n            <div class=\"pull-left\">\n                <b>by</b> "
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.User : stack1)) != null ? stack1.email : stack1), depth0))
    + "\n            </div>\n            <div class=\"pull-right\">\n                <span class=\"glyphicon glyphicon-time\"></span>\n                "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.friendlyDate : stack1), depth0))
    + "\n            </div>\n            <br>\n        </div> <!-- End Panel Footer -->\n\n      </div> <!-- End panel -->\n\n    </div> <!-- End Col container -->\n  ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"row masonry-container\">\n\n    ";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " <!-- End Each -->\n\n</div><!--End masonry-container  -->";
},"useData":true});

this["Zebra"]["tmpl"]["register"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"modal fade\" id=\"reg-modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <h1 class=\"modal-title text-skinny\">Create your Zebra account</h1>\n      </div>\n      <div class=\"modal-body\">\n        <form id=\"reg-form\">\n          <p class=\"text-center text-skinny\">\n            One account is all you need to access all Zebra RFO services.\n            <br>\n            Already have a Zebra account? \n            <a href=\"javascript:void(0)\" data-dismiss=\"modal\">Sign in</a>\n          </p>\n          <br>\n          <div class=\"form-group\">\n            <input type=\"email\" class=\"form-control\" id=\"reg-email\" placeholder=\"name@example.com\">\n          </div>\n          <br>\n          <div class=\"form-group\">\n            <input type=\"password\" class=\"form-control\" id=\"reg-password\" placeholder=\"password\">\n          </div>\n          <div class=\"form-group\">\n            <input type=\"password\" class=\"form-control\" id=\"reg-repeat-password\" placeholder=\"repeat password\">\n          </div>\n          <hr>\n          <div class=\"checkbox\">\n            <label>\n              <input type=\"checkbox\" id=\"reg-subscribed\" checked> Zebra RFO News and Announcements\n              <br>\n              <small class=\"ws-gray\">Keep me up to date with Zebra RFO news and the lastest information on products and services.</small>\n            </label>\n          </div>\n        </form>\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\n        <span class=\"divider-vertical\"></span>\n        <button type=\"button\" id=\"reg-submit\" class=\"btn btn-primary\" disabled>Continue</button>\n      </div>\n    </div>\n  </div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["upload_help_info"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<ul class=\"nav nav-tabs\" role=\"tablist\" id=\"h-tabs\">\n	<li role=\"presentation\" class=\"active\">\n		<a href=\"#h-files-format-tab\" role=\"tab\" data-toggle=\"tab\">Files Format</a>\n	</li>\n</ul>\n<div class=\"tab-content\">\n	<div role=\"tabpanel\" class=\"tab-pane fade in active\" id=\"h-files-format-tab\">\n		<br>\n		<p class=\"lead\">\n				<small>\n				A measurement campaign defines what we call a Place. This is regularly composed of many individual text files captured by a single device. We provide scripts that can process the data in the raw format (the one provided by the device alone) and convert it to Zebra RFO input format.\n			</small>\n		</p>\n		<h4>Zebra RFO uses data formatted as follows.</h4>\n		<div class=\"col-xs-6 col-sm-6 col-md-6\">\n			<h4>Json file</h4>\n			<p>\n				A structured json file contains a collection of pairs <b>property:value</b> in the following way\n			</p>\n			<div class='well well-sm'>\n				<small>\n					<code>\n						{\n						<br>\n						&emsp;&emsp;\"frequencies\": {\n						<br>\n						&emsp;&emsp;&emsp;&emsp;\"values\": [fq_1, fq_2, ..., fq_n]\n						<br>\n						&emsp;&emsp;},\n						<br>\n						&emsp;&emsp;\"coordinates\": [\n						<br>\n						&emsp;&emsp;&emsp;&emsp;{\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\"lat\": lat_1,\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\"lng\": lng_1,\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\"date\": \"date of capture\",\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\"cap\": [pw_1, pw_2, ..., pw_n]\n						<br>\n						&emsp;&emsp;&emsp;&emsp;},\n						<br>\n						&emsp;&emsp;&emsp;&emsp;......\n						<br>\n						&emsp;&emsp;&emsp;&emsp;{\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\"lat\": lat_n,\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\"lng\": lng_n,\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\"date\": \"date of capture\",\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\"cap\": [pw_1, pw_2, ..., pw_n]\n						<br>\n						&emsp;&emsp;&emsp;&emsp;}\n						<br>\n						&emsp;&emsp;]\n						<br>\n						}\n					</code>\n				</small>\n			</div>\n		</div>\n		<div class=\"col-xs-6 col-sm-6 col-md-6\">\n			<h4>Txt files</h4>\n			<p>\n				A single text file contains a location (LAT and LON) with a set of frequencies out of a bandwidth:\n			</p>\n			<div class='well well-sm'>\n				<code>\n					<small>\n						frequency_1\\\\tpower_1\n						<br>\n						frequency_2\\\\tpower_2\n						<br>\n						frequency_3\\\\tpower_3\n						<br>\n						frequency_4\\\\tpower_4\n						<br>\n						...\n						<br>\n						frequency_n\\\\tpower_n\n						<br>\n						latitude\n						<br>\n						longitude\n						<br>\n						date of capture\n					</small>\n				</code>\n			</div>\n		</div>\n		<div class=\"col-xs-12 col-sm-12 col-md-12\">\n			<p class=\"lead\">\n				<small>\n					Please download the script according to your input device:</h4>\n				</small>\n			</p>\n			<h4>Android device</h4>\n			<p class=\"lead\">\n				<small>\n					If you are using the android application to capture the spectrum activity (with RFExplorer), you can download the following scripts in python (\n					<a href='javascript:void(0)' id='h-files-format-download-android-parser-json'>\n						android parser to json\n					</a>\n					or\n					<a href='javascript:void(0)' id='h-files-format-download-android-parser-txt'>\n						android parser to txt\n					</a>\n					), copy the script into the folder where your captured data is located. \n					<br>\n					<br>\n					Then run the script as follows:\n				</small>\n			</p>\n			<div class=\"col-xs-6 col-sm-6 col-md-6\">\n				<h4>Json</h4>\n				<div class='well well-sm'>\n					<code>\n						python android_parser_to_json.py\n					</code>\n				</div>\n				<p class=\"lead\">\n					<small>\n						As a result, the script generate a folder with one or more folders inside depending on the variation of a set of frequencies in the original files, these folders contain the parsed data in Zebra RFO format, ready to be uploaded (and consumed) by the system.\n						<br>\n						<br>\n						Then proceed as follows:\n					</small>\n				</p>\n				<ol>\n					<li>Name the zone</li>\n					<li>Select the parsed file (*.json) inside any folder</li>\n					<li>Click on Synchronise</li>\n				</ol>\n			</div>\n			<div class=\"col-xs-6 col-sm-6 col-md-6\">\n				<h4>Txt</h4>\n				<div class='well well-sm'>\n					<code>\n						python android_parser_to_txt.py\n					</code>\n				</div>\n				<p class=\"lead\">\n					<small>\n						As a result, the script generate a folder of parsed data in Zebra RFO format, ready to be uploaded (and consumed) by the system.\n						<br>\n						<br>\n						Then proceed as follows:\n					</small>\n				</p>\n				<ol>\n					<li>Name the zone</li>\n					<li>Select all the parsed files (*.txt) which are numbered from 1 to N</li>\n					<li>Click on Synchronise</li>\n				</ol>\n			</div>\n			<div class=\"col-xs-12 col-sm-12 col-md-12\">\n				<p class=\"lead text-center\">\n					<small>\n						Wait for the processing.\n						<br>\n						<br>\n						Now you can visualise your data…\n						<br>\n						<br>\n						<b>Enjoy!</b>\n					</small>\n				</p>\n			</div>\n		</div>\n	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["upload_measures"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "				<li><a class=\"item-zone-name\" href=\"#upload\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n";
},"3":function(depth0,helpers,partials,data) {
  return "					<li class=\"divider\"></li>\n					<li><a href=\"#\">You have not uploaded any place</a></li>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<form>\n	<div class=\"input-group form-group has-feedback\">\n		<div class=\"input-group-btn\">\n			<button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">Pick a zone <span class=\"caret\"></span></button>\n			<ul class=\"dropdown-menu\" role=\"menu\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"unless","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</ul>\n		</div>\n		<label class=\"control-label sr-only\" for=\"inputSuccess5\">Hidden label</label>\n		<input id='u-measures-name' type=\"text\" class=\"form-control\" placeholder=\"or type one\">	\n		<span class=\"feedback-icon-container glyphicon form-control-feedback\"></span>\n		<div class=\"input-group-btn\">\n			<button type=\"button\" id=\"u-measures-info-help\" class=\"btn btn-warning\">\n				help\n				<span class=\"glyphicon glyphicon-info-sign\"></span>\n			</button>\n		</div>\n	</div>\n\n	<div class=\"u-dragandrophandler\">\n		<h1>Drag files here</h1>\n		<div>Or, if you prefer...</div>\n		<br />\n		<input id='u-measures-file' type=\"file\" multiple='multiple' name='data'>\n	</div>\n	\n	<div class=\"form-group has-feedback\">\n		<label for=\"u-measures-unit\">Please select the unit for frequency</label>\n		<select class=\"form-control\" id=\"u-measures-unit\">\n			<option></option>\n			<option value=\"Hz\">Hertz - Hz</option>\n			<option value=\"kHz\">Kilohertz - kHz</option>\n			<option value=\"MHz\">Megahertz - MHz</option>\n			<option value=\"GHz\">Gigahertz - GHz</option>\n		</select>\n	</div>\n\n	<div class=\"form-group has-feedback\">\n		<label for=\"u-gps-position-function\">Please select the function for calculating representative samples of a common GPS position</label>\n		<select class=\"form-control\" id=\"u-gps-position-function\">\n			<option value=\"avg\">Average</option>\n			<option value=\"max\">Maximum</option>\n			<option value=\"min\">Minimum</option>\n			<option value=\"first\">First</option>\n			<option value=\"last\">Last</option>\n			<option value=\"all\">All</option>\n		</select>\n	</div>\n\n	<ul id=\"u-measures-files-info\" class=\"list-group\">\n		<div class=\"well well-sm\">\n			Files to upload \n			<span class=\"badge\">0</span>\n			<hr>\n			Weight of files to upload \n			<span class=\"badge\">0 Bytes</span>\n		</div>\n	</ul>\n\n	<button id='u-measures-button-delete' type=\"button\" class=\"btn btn-warning btn-sm pull-left\">Delete selected files</button>\n	<button id='u-measures-button' type=\"button\" class=\"btn btn-primary btn-lg pull-right\">Synchronize</button>\n</form>";
},"useData":true});

this["Zebra"]["tmpl"]["waiting"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"ws-waiting\">\n	<div class=\"spinner-container\">\n		<div class=\"rect1\"></div>\n		<div class=\"rect2\"></div>\n		<div class=\"rect3\"></div>\n		<div class=\"rect4\"></div>\n		<div class=\"rect5\"></div>\n	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["waiting_component"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"waiting-component\">\n	<div class=\"spinner-component\"></div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["waiting_login"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"login-waiting\">\n	<div class=\"spinner-container\">\n		<div class=\"rect1\"></div>\n		<div class=\"rect2\"></div>\n		<div class=\"rect3\"></div>\n		<div class=\"rect4\"></div>\n		<div class=\"rect5\"></div>\n	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["white_spaces"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "			<div class=\"form-group\">\n				<label for=\"ws-frequency-bands\">Frequency bands</label>\n				<input class=\"form-control\" id=\"ws-frequency-bands\" type=\"hidden\" />\n			</div>\n";
  },"3":function(depth0,helpers,partials,data) {
  return "				<label for=\"ws-channel-width\">Channel width</label>\n				<input class=\"form-control\" id=\"ws-channel-width\" type=\"hidden\" />\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<br>\n<div class=\"row\">\n	<div class=\"col-md-3 settings\">\n		<h4>Graph Settings</h4>\n		<div class=\"form-group\">\n			<label for=\"ws-graph-type\">Type</label>\n			<select class=\"form-control\" id=\"ws-graph-type\">\n				<option></option>\n				<option value=\"bar\" selected>Bar</option>\n				<option value=\"surface\">Surface</option>\n				<option value=\"grid\">Grid</option>\n				<option value=\"line\">Line</option>\n				<option value=\"dot-line\">Dot-Line</option>\n				<option value=\"dot\">Dot</option>\n			</select>\n		</div>\n		<div class=\"form-group\">\n			<label for=\"ws-quality-slider\">Quality</label>\n			<div id=\"ws-quality-slider\"></div>\n		</div>\n		<h4>Data Settings</h4>\n		<div class=\"form-group\">\n			<label for=\"ws-occupation-slider\">Occupation range</label>\n			<div id=\"ws-occupation-slider\"></div>\n		</div>\n		<div class=\"form-group\">\n			<label for=\"ws-threshold-slider\">Threshold range</label>\n			<div id=\"ws-threshold-slider\"></div>\n		</div>\n		<br>\n		<div class=\"form-group\">\n			<label for=\"ws-select-frequency-by\">Select frequency by</label>\n			<br />\n			<label class=\"radio-inline\">\n				<input type=\"radio\" name=\"ws-select-frequency-by\" value=\"range\" checked> Range\n			</label>\n			<label class=\"radio-inline\">\n				<input type=\"radio\" name=\"ws-select-frequency-by\" value=\"channels\"> Channels\n			</label>\n		</div>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.bands : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "		<div class=\"form-group ws-channels-settings\">\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.place : depth0)) != null ? stack1.frequenciesChannelWidth : stack1), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</div>\n	</div>\n	<div class=\"col-md-9\">\n		<div id=\"ws-canvas\" style=\"height:400px;\"></div>\n		<div class=\"col-md-12 ws-controllers\">\n			<br>\n			<div class=\"col-md-12 ws-range-slider-settings\">\n				<div id=\"ws-range-slider\"></div>\n			</div>\n			<div class=\"col-md-12 ws-channels-settings\">\n				<label for=\"ws-select-channels\">Please select the channels to observe</label>\n				<input class=\"form-control\" id=\"ws-select-channels\" type=\"hidden\" />\n			</div>\n		</div>\n	</div>\n\n</div>";
},"useData":true});