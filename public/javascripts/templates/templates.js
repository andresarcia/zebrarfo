this["Zebra"] = this["Zebra"] || {};
this["Zebra"]["tmpl"] = this["Zebra"]["tmpl"] || {};

this["Zebra"]["tmpl"]["charts"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<ol class=\"breadcrumb\">\n	<li><a href=\"#places\">Places</a></li>\n	<li><a href=\"#places/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n	<li class=\"active\">Charts</li>\n</ol>\n<ul class=\"nav nav-tabs\" role=\"tablist\" id=\"charts-tabs\">\n	<li class=\"active\"><a href=\"#occupation-tab\" role=\"tab\" data-toggle=\"tab\">Occupation</a></li>\n	<li><a href=\"#heatmap-tab\" role=\"tab\" data-toggle=\"tab\">Heatmap</a></li>\n	<li><a href=\"#white-spaces-tab\" role=\"tab\" data-toggle=\"tab\">White Spaces</a></li>\n</ul>\n<div class=\"tab-content\">\n	<div class=\"tab-pane fade in active\" id=\"occupation-tab\"></div>\n	<div class=\"tab-pane fade\" id=\"heatmap-tab\"></div>\n	<div class=\"tab-pane fade\" id=\"white-spaces-tab\"></div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["edit_coordinates"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"row\">\n	<div id=\"su-list-coord-to-edit\" class=\"col-md-3\"></div>\n  	<div class=\"col-md-9\">\n  		<div id=\"su-edit-place-controls\" class=\"col-xs-12 col-sm-12 col-md-12\">\n  			<div class=\"btn-group\">\n				<button type=\"button\" class=\"btn action-btn su-delete-coord\" disabled>\n					<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n				</button>\n			</div>\n			<div class=\"btn-group\">\n				<button type=\"button\" class=\"btn select-btn su-select-first-coord\">\n					first\n				</button>\n				<button type=\"button\" class=\"btn select-btn su-select-last-coord\">\n					last\n				</button>\n\n				<button type=\"button\" class=\"btn action-btn su-select-left-plus-coord\" disabled>\n					<span class=\"glyphicon glyphicon-plus-sign\" aria-hidden=\"true\"></span>\n				</button>\n				<input type=\"input\" class=\"action-btn\" id=\"su-select-window-left-input\" value=\"5\" size=\"3\" maxlength=\"3\" disabled/>\n				<button type=\"button\" class=\"btn 2-action-btn su-select-left-minus-coord\" disabled>\n					<span class=\"glyphicon glyphicon-minus-sign\" aria-hidden=\"true\"></span>\n				</button>\n\n				<button type=\"button\" class=\"btn action-btn su-select-zoom-out-coord\" disabled>\n					<span class=\"glyphicon glyphicon-zoom-out\" aria-hidden=\"true\"></span>\n				</button>\n				<button type=\"button\" class=\"btn action-btn su-select-zoom-to-fit-coord\" disabled>\n					<span class=\"glyphicon glyphicon-zoom-in\" aria-hidden=\"true\"></span>\n				</button>\n\n				<button type=\"button\" class=\"btn 2-action-btn su-select-right-minus-coord\" disabled>\n					<span class=\"glyphicon glyphicon-minus-sign\" aria-hidden=\"true\"></span>\n				</button>\n				<input type=\"input\" class=\"2-action-btn\" id=\"su-select-window-right-input\" value=\"5\" size=\"3\" maxlength=\"3\" disabled/>\n				<button type=\"button\" class=\"btn action-btn su-select-right-plus-coord\" disabled>\n					<span class=\"glyphicon glyphicon-plus-sign\" aria-hidden=\"true\"></span>\n				</button>\n\n				<button type=\"button\" class=\"btn action-btn su-deselect-coord\">\n					deselect\n				</button>\n			</div>\n		</div>\n  		<div class=\"col-xs-11 col-sm-11 col-md-11\">\n			<div id=\"map_canvas_coordinates\" style=\"height:450px;\"></div>\n		</div>\n		<div class=\"col-xs-1 col-sm-1 col-md-1\" id=\"markers-slider-edit-place\">\n			<div class=\"markers-slider\" style=\"height:450px;\"></div>\n		</div>\n		<div class=\"col-md-11 col-md-offset-0\">\n			<br>\n			<div class=\"col-md-3\">\n				<select class=\"form-control\" id=\"spread-distance-unit-slider\">\n					<option value=\"m\">Meters - m</option>\n					<option value=\"km\">Kilometers - km</option>\n				</select>\n			</div>\n			<div class=\"col-md-9\">\n				<div class=\"spread-distance-slider\"></div>\n			</div>\n		</div>\n  	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["edit_outliers"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "				<tr>\n					<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.power : stack1), depth0))
    + "</td>\n					<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.frequency : stack1), depth0))
    + "</td>\n					<td>\n						<button class=\"btn btn-danger btn-xs btn-delete-outlier\">\n							<span class=\"glyphicon glyphicon-trash\"></span>\n						</button>\n					</td>\n				</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<br>\n<div class=\"row\">\n	<div class=\"col-md-12 text-center\">\n		<table class=\"table table-striped table-hover table-condensed table-bordered\">\n			<thead>\n			    <tr>\n			        <th class=\"text-center\">Power (dBm)</th>\n			        <th class=\"text-center\">Occurrence frequency</th>\n			        <th class=\"text-center\">Remove</th>\n			    </tr>\n		    </thead>\n		    <tbody>\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</tbody>\n		</table>\n	</div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["edit_place"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<ol class=\"breadcrumb\">\n	<li><a href=\"#places\">Places</a></li>\n	<li><a href=\"#places/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n	<li class=\"active\">Edit place</li>\n</ol>\n<ul class=\"nav nav-tabs\" role=\"tablist\" id=\"edit-tabs\">\n	<li class=\"active\"><a href=\"#edit-coord-tab\" role=\"tab\" data-toggle=\"tab\">Coordinates</a></li>\n	<li><a href=\"#edit-outliers-tab\" role=\"tab\" data-toggle=\"tab\">Outliers</a></li>\n</ul>\n<div class=\"tab-content\">\n	<div class=\"tab-pane fade in active\" id=\"edit-coord-tab\"></div>\n	<div class=\"tab-pane fade\" id=\"edit-outliers-tab\"></div>\n</div>";
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

this["Zebra"]["tmpl"]["heatmap"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<br>\n<div class=\"row\">\n	<div class=\"col-md-3 heatmap-settings\">\n		<h4>Data Settings</h4>\n		<div class=\"form-group\">\n			<label for=\"select-function-operate\">Pick a function to operate on the data</label>\n			<select class=\"form-control\" id=\"select-function-operate\">\n				<option></option>\n				<option value=\"avg\" selected>Average</option>\n				<option value=\"max\">Maximum</option>\n				<option value=\"min\">Minimum</option>\n			</select>\n		</div>\n		<div class=\"form-group\">\n			<label for=\"max-intensity-slider\">Suggested referential Maximum</label>\n			<div class=\"max-intensity-slider\"></div>\n		</div>\n		<div class=\"form-group\">\n			<label for=\"select-change-data-by\">Change data by</label>\n			<br />\n			<label class=\"radio-inline\">\n				<input type=\"radio\" name=\"select-change-data-by\" value=\"frequency\" checked> Frequency\n			</label>\n			<label class=\"radio-inline\">\n				<input type=\"radio\" name=\"select-change-data-by\" value=\"channels\"> Channels\n				</label>\n		</div>\n		<h4>Heatmap Settings</h4>\n		<div class=\"form-group\">\n			<label for=\"opacity-slider\">Opacity</label>\n			<div class=\"opacity-slider\"></div>\n		</div>\n		<div class=\"form-group\">\n			<label for=\"radius-slider\">Radius</label>\n			<div class=\"radius-slider\"></div>\n		</div>\n		<br />\n		<div class=\"form-group heatmap-select-channels\">\n			<label for=\"allocation-channel\">Channel width</label>\n			<input class=\"form-control\" id=\"allocation-channel\" type=\"hidden\" />\n		</div>\n	</div>\n	<div class=\"col-md-9\">\n		<div class=\"col-xs-11 col-sm-11 col-md-11\">\n			<div id=\"map_canvas_heatmap\" style=\"width:100%; height:400px;\"></div>\n		</div>\n		<div class=\"col-xs-1 col-sm-1 col-md-1\">\n			<div class=\"markers-slider\" style=\"height:400px;\"></div>\n		</div>\n\n		<div class=\"col-md-11 col-md-offset-0 heatmap-controllers-container\">\n			<div class=\"col-md-12 heatmap-slider-container\">\n				<div class=\"slider\"></div>\n				<div class=\"slider-value\"></div>\n			</div>\n			<div class=\"col-md-12 heatmap-select-channels\">\n				<label for=\"select-channels\">Please select the channels to observe</label>\n				<input class=\"form-control\" id=\"select-channels\" type=\"hidden\" />\n			</div>\n		\n			<div class=\"heatmap-select-spread-distance\">\n				<h5 class=\"col-md-12\">Please select the unit and distance between each point</h5>\n				<div class=\"col-md-3\">\n					<label for=\"upload-measures-unit\">Unit</label>\n					<select class=\"form-control\" id=\"spread-distance-unit-slider\">\n						<option value=\"m\">Meters - m</option>\n						<option value=\"km\">Kilometers - km</option>\n					</select>\n				</div>\n				<div class=\"col-md-9\">\n					<label for=\"spread-distance-slider\">Distance</label>\n					<div class=\"spread-distance-slider\"></div>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["login"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"scene\">\n  <div class=\"mask\"></div>\n  <div class=\"content\">\n    <div class=\"form layer\">\n      <div class=\"logo\"></div>\n      <h1>ZEBRA RFO</h1>\n      <h6>RADIO FREQUENCY OBSERVER</h6>\n      <form id=\"login-form\">\n        <input type=\"email\" class=\"\" id=\"login-email\" placeholder=\"Email\">\n        <input type=\"password\" class=\"\" id=\"login-password\" placeholder=\"Password\">\n        <button type=\"submit\" id=\"login-submit\" disabled>\n          <span class=\"glyphicon glyphicon-arrow-right\"></span>\n        </button>\n        <div class=\"checkbox\">\n          <label>\n            <input type=\"checkbox\"> Keep me signed in\n          </label>\n        </div>\n      </form>\n      <br>\n      <hr>\n      <h5 id=\"login-new-account\" class=\"text-skinny text-center\">Don't have an account in zebra? <a href=\"javascript:void(0)\"><b>Create it now</b></a></h5>\n    </div>\n    <div class=\"background layer\" data-depth=\"0.5\"></div>\n  </div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["main"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"navbar\"></div>\n<div id=\"z-modal\"></div>\n<div id=\"main-menu\" class=\"col-xs-12 col-sm-3 col-md-2\"></div>\n<div class=\"col-xs-12 col-sm-9 col-md-10 ws-modal\">\n	<div id=\"waiting\"></div>\n	<div id=\"error\"></div>\n	<div id=\"ws-containter\"></div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["main_login"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"z-modal\"></div>\n<div id=\"waiting\"></div>\n<div id=\"login-container\"></div>";
  },"useData":true});

this["Zebra"]["tmpl"]["main_menu"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<ul class=\"list-group\">\n	<li>\n		<a href=\"#places\" class=\"active\">\n			<span class=\"glyphicon glyphicon-globe\"></span>\n			<span> Places</span>\n		</a>\n	</li>\n\n	<li>\n		<a href=\"#help\">\n			<span class=\"glyphicon glyphicon-question-sign\"></span>\n			<span> Help</span>\n		</a>\n	</li>\n</ul>";
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

this["Zebra"]["tmpl"]["modal_parsing_measures"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"modal fade\" id=\"modal-parsing-measures-modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n	<div class=\"modal-dialog\">\n	   	<div class=\"modal-content\">\n	      	<div class=\"modal-body\">\n	        	<div class=\"progress\">\n						<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 0%;\">\n						0%\n						</div>\n				</div>\n\n				<div class=\"list-group\">\n					<a href=\"#\" class=\"list-group-item active\">\n						<span class=\"badge\">0/"
    + escapeExpression(((helper = (helper = helpers.numFiles || (depth0 != null ? depth0.numFiles : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"numFiles","hash":{},"data":data}) : helper)))
    + "</span>\n					    Files processed\n					</a>\n				  	<a href=\"#\" class=\"list-group-item\">\n				    	<h4 id=\"ws-modal-parsing-measures-data-table-heading\" class=\"list-group-item-heading\">Measures data</h4>\n				    	<table id=\"ws-modal-parsing-measures-data-table\" class=\"table table-hover\">\n						  	<tr>\n						  		<td>Name</td><td id=\"ws-modal-parsing-measures-data-table-name\"></td>\n						  	</tr>\n						  	<tr>\n						  		<td>Total number of samples</td><td id=\"ws-modal-parsing-measures-data-table-numberCoordinates\"></td>\n						  	</tr>\n						  	<tr>\n						  		<td>Total number of frequencies</td><td id=\"ws-modal-parsing-measures-data-table-numberPowerFrequency\"></td>\n						  	</tr>\n						  	<tr>\n						  		<td>Range of frequencies</td><td id=\"ws-modal-parsing-measures-data-table-frequenciesBandwidth\"></td>\n						  	</tr>\n						</table>\n				  	</a>\n				  	<a href=\"#\" class=\"list-group-item\">Uploading data\n				  		<span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate pull-right\"></span>\n				  	</a>\n				  	<a href=\"#\" class=\"list-group-item\">Processing in server\n				  		<span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate pull-right\"></span>\n				  	</a>\n				</div>\n\n\n	      	</div>\n	      	<div class=\"modal-footer\">\n	        	<button id=\"ws-modal-parsing-measures-button\" type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Cancel upload</button>\n	      	</div>\n	    </div>\n	</div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["navbar"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n	<div class=\"container-fluid\">\n		<div class=\"navbar-header\" id=\"navbar-header\">\n			<button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#navbar-menu\">\n				<span class=\"glyphicon glyphicon-user\"></span>\n				<b class=\"caret\"></b>\n			</button>\n			<div class=\"navbar-brand\">\n				<div class=\"logo\"></div>\n				<h1>ZEBRA RFO</h1>\n				<h6>RADIO FREQUENCY OBSERVER</h6>\n			</div>\n		</div>\n\n		<div class=\"collapse navbar-collapse\" id=\"navbar-menu\">\n			<ul class=\"nav navbar-nav navbar-right\">\n				<li class=\"dropdown\">\n					<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n						<span class=\"glyphicon glyphicon-user\"></span>\n						<b class=\"caret\"></b>\n					</a>\n					<ul class=\"dropdown-menu\" role=\"menu\">\n						<li><a href=\"#\">Profile</a></li>\n						<li><a href=\"#\">Account settings</a></li>\n						<li class=\"divider\"></li>\n						<li><a href=\"#logout\">Log Out</a></li>\n					</ul>\n				</li>\n			</ul>\n		</div>\n	</div>\n</nav>";
  },"useData":true});

this["Zebra"]["tmpl"]["navbar_mobil"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n	<div class=\"container-fluid\">\n		<div class=\"navbar-header\" id=\"navbar-header\">\n			<button type=\"button\" class=\"navbar-toggle\" id=\"toggle-main-menu\">\n				<span class=\"sr-only\">Toggle navigation</span>\n				<span class=\"icon-bar\"></span>\n				<span class=\"icon-bar\"></span>\n				<span class=\"icon-bar\"></span>\n			</button>\n			<button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#navbar-menu\">\n				<span class=\"glyphicon glyphicon-user\"></span>\n				<b class=\"caret\"></b>\n			</button>\n			<div class=\"navbar-brand\">\n				<div class=\"logo\"></div>\n				<h1>ZEBRA RFO</h1>\n				<h6>RADIO FREQUENCY OBSERVER</h6>\n			</div>\n		</div>\n\n		<div class=\"collapse navbar-collapse\" id=\"navbar-menu\">\n			<ul class=\"nav navbar-nav navbar-right\">\n				<li><a href=\"#\">Profile</a></li>\n				<li><a href=\"#\">Account settings</a></li>\n				<li class=\"divider\"></li>\n				<li><a href=\"#logout\">Log Out</a></li>\n			</ul>\n		</div>\n	</div>\n</nav>";
  },"useData":true});

this["Zebra"]["tmpl"]["occupation"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"row\">\n	<div class=\"col-md-12 slider-container occupation-settings\">\n		<h5>Channel width</h5>\n		<input class=\"form-control\" id=\"allocation-channel\" type=\"hidden\" />\n		<h5>Threshold</h5>\n		<div class=\"slider\"></div>\n	</div>\n	<div id=\"chart_canvas_occupation\" class=\"col-md-12\">\n		<div class=\"chart_power_frequency\" style=\"height:420px;width:95%;\"></div> \n		<div class=\"chart_tooltip\">\n			<p style=\"margin:0\">default</p>\n		</div>\n	</div>\n	<div class=\"col-md-12 occupation-settings\">\n		<div class=\"col-md-8\">\n			<input class=\"form-control\" id=\"select-channels\" type=\"hidden\" />\n		</div>\n		<div class=\"col-md-4\">\n			<button type=\"button\" class=\"btn btn-primary btn-block build-heatmap-btn-container\">Build heatmap</button>\n		</div>\n	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["password_requirements"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"tooltip\" role=\"tooltip\">\n	<div class=\"tooltip-arrow\"></div>\n	<div class=\"tooltip-inner-2\">\n		<b>Your password mush have:</b>\n		<div class=\"text-skinny\">\n			<ul>\n				<li>8 or more characters</li>\n				<li>At least one number</li>\n				<li>Upper and lowercase letters</li>\n			</ul>\n		</div>\n	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["places"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		<a href=\"#places/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" class=\"list-group-item\">\n		<div class=\"panel panel-default\">\n			<div class=\"panel-body\">\n				<h1 class=\"col-md-12\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h1>\n		  		<table class=\"table table-striped table-condensed\">\n			    	<tr>\n				  		<td>Total number of samples</td>\n				  		<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.numberCoordinates : stack1), depth0))
    + "</td>\n				  	</tr>\n				  	<tr>\n				  		<td>Total distance</td>\n				  		<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.totalDistance : stack1), depth0))
    + " <small><b>km</b></small></td>\n				  	</tr>\n				  	<tr>\n				  		<td>Total number of frequencies</td>\n				  		<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.numberPowerFrequency : stack1), depth0))
    + "</td>\n				  	</tr>\n				  	<tr>\n				  		<td>Range of frequencies</td>\n				  		<td>["
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.frequencyMin : stack1), depth0))
    + "-"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.frequencyMax : stack1), depth0))
    + "] <small><b>MHz</b></small></td>\n				  	</tr>\n				  	<tr>\n				  		<td>Minimum power</td>\n				  		<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.powerMin : stack1), depth0))
    + " <small><b>dBm</b></small></td>\n				  	</tr>\n				  	<tr>\n				  		<td>Maximum power</td>\n				  		<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.powerMax : stack1), depth0))
    + " <small><b>dBm</b></small></td>\n				  	</tr>\n				  	<tr>\n				  		<td>Average power</td>\n				  		<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.powerAvg : stack1), depth0))
    + " <small><b>dBm</b></small></td>\n				  	</tr>\n				  	<tr>\n				  		<td>Standard deviation of power</td>\n				  		<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.sdPowerAvg : stack1), depth0))
    + " <small><b>dBm</b></small></td>\n				  	</tr>\n				  	<tr>\n				  		<td>Average of Standard deviation power</td>\n				  		<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.avgPowerSD : stack1), depth0))
    + " <small><b>dBm</b></small></td>\n				  	</tr>\n			  	</table>\n			</div>\n			<div class=\"panel-footer\">\n					<h5 class=\"pull-right\"><small>last update <b>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.friendlyDate : stack1), depth0))
    + "</b></small></h5> \n					<br>\n				</div>\n		</div>\n		</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<ul id=\"su-places-container\" class=\"list-group\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul>";
},"useData":true});

this["Zebra"]["tmpl"]["register"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"modal fade\" id=\"reg-modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <h1 class=\"modal-title text-skinny\">Create your Zebra account</h1>\n      </div>\n      <div class=\"modal-body\">\n        <form id=\"reg-form\">\n          <p class=\"text-center text-skinny\">\n            One account is all you need to access all Zebra RFO services.\n            <br>\n            Already have a Zebra account? \n            <a href=\"javascript:void(0)\" data-dismiss=\"modal\">Sign in</a>\n          </p>\n          <br>\n          <div class=\"form-group\">\n            <input type=\"email\" class=\"form-control\" id=\"reg-email\" placeholder=\"name@example.com\">\n          </div>\n          <br>\n          <div class=\"form-group\">\n            <input type=\"password\" class=\"form-control\" id=\"reg-password\" placeholder=\"password\">\n          </div>\n          <div class=\"form-group\">\n            <input type=\"password\" class=\"form-control\" id=\"reg-repeat-password\" placeholder=\"repeat password\">\n          </div>\n          <hr>\n          <div class=\"checkbox\">\n            <label>\n              <input type=\"checkbox\" id=\"reg-subscribed\" checked> Zebra RFO News and Announcements\n              <br>\n              <small class=\"ws-gray\">Keep me up to date with Zebra RFO news and the lastest information on products and services.</small>\n            </label>\n          </div>\n        </form>\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\n        <span class=\"divider-vertical\"></span>\n        <button type=\"button\" id=\"reg-submit\" class=\"btn btn-primary\" disabled>Continue</button>\n      </div>\n    </div>\n  </div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["single_place"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "						<tr>\n							<td colspan=\"2\">\n								<label for=\"frequency-bands\">Frequency bands</label>\n								<input class=\"form-control\" id=\"frequency-bands\" type=\"hidden\" />\n							</td>\n						</tr>\n";
  },"3":function(depth0,helpers,partials,data) {
  return "						<tr>\n							<td colspan=\"2\">\n								<label for=\"allocation-channel\">Channel width</label>\n								<input class=\"form-control\" id=\"allocation-channel\" type=\"hidden\" />\n							</td>\n						</tr>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "<ol class=\"breadcrumb\">\n	<li><a href=\"#places\">Places</a></li>\n	<li class=\"active\">"
    + escapeExpression(lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</li>\n</ol>\n\n<div class=\"row\">\n	<div class=\"col-md-4\">\n		<div class=\"panel panel-default su-place-info\">\n			<div class=\"panel-body\">\n				<div class=\"su-place-info-links\">\n					<a href=\"#places/"
    + escapeExpression(lambda((depth0 != null ? depth0.id : depth0), depth0))
    + "/upload\" class=\"pull-right ws-blue\">\n						<small>upload more samples</small>\n					</a>\n					<br>\n					<a href=\"javascript:void(0)\" id=\"download-link-place\" class=\"pull-right ws-blue\">\n						<small>download place</small>\n					</a>\n					<br>\n					<a href=\"javascript:void(0)\" id=\"delete-link-place\" class=\"pull-right ws-red\">\n						<small>delete</small>\n					</a>\n				</div>\n				<br>\n				<br>\n				<h2 class=\"col-md-12\">"
    + escapeExpression(lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</h2>\n				<table class=\"table table-striped\">\n					<tr>\n						<td>Total number of samples</td>\n						<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.numberCoordinates : depth0), depth0))
    + "</td>\n					</tr>\n					<tr>\n						<td>Total distance</td>\n						<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.totalDistance : depth0), depth0))
    + " <small><b>km</b></small></td>\n					</tr>\n					<tr>\n						<td>Total number of frequencies</td>\n						<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.numberPowerFrequency : depth0), depth0))
    + "</td>\n					</tr>\n					<tr>\n						<td>Range of frequencies</td>\n						<td>["
    + escapeExpression(lambda((depth0 != null ? depth0.frequencyMin : depth0), depth0))
    + "-"
    + escapeExpression(lambda((depth0 != null ? depth0.frequencyMax : depth0), depth0))
    + "] <small><b>MHz</b></small></td>\n					</tr>\n					<tr>\n						<td>Minimum power</td>\n						<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.powerMin : depth0), depth0))
    + " <small><b>dBm</b></small></td>\n					</tr>\n					<tr>\n						<td>Maximum power</td>\n						<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.powerMax : depth0), depth0))
    + " <small><b>dBm</b></small></td>\n					</tr>\n					<tr>\n						<td>Average power</td>\n						<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.powerAvg : depth0), depth0))
    + " <small><b>dBm</b></small></td>\n					</tr>\n					<tr>\n						<td>Standard deviation of power</td>\n						<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.sdPowerAvg : depth0), depth0))
    + " <small><b>dBm</b></small></td>\n					</tr>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.frequenciesBands : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.frequenciesChannelWidth : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "				</table>\n\n				<button id=\"su-edit-place\" class=\"btn btn-success btn-xs btn-block btn-without-corners\" type=\"button\">\n					Edit place\n				</button>\n			</div>\n			<div class=\"panel-footer\">\n				<h5 class=\"pull-right\"><small>last update <b>"
    + escapeExpression(lambda((depth0 != null ? depth0.friendlyDate : depth0), depth0))
    + "</b></small></h5> \n				<br>\n			</div>\n		</div>\n	</div>\n\n	<div class=\"col-md-8\">\n		<div id=\"su-coord-markers-map\" style=\"height:450px;\"></div>\n		<div id=\"su-selected-coordinate-map\">\n			<div class=\"page-header\" style=\"text-align:center\">\n					<h1>Click <small>on any marker will get info of the sample</small></h1>\n			</div>\n		</div>\n	</div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["su_coordinate_resume"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<ul class=\"list-group\">\n	<li class=\"list-group-item\">\n		<table class=\"table table-condensed\">\n			<thead>\n				<tr>\n					<th>Latitude</th>\n					<th>Longitude</th>\n				</tr>\n			</thead>\n			<tbody>\n				<tr>\n					<td>"
    + escapeExpression(((helper = (helper = helpers.latitude || (depth0 != null ? depth0.latitude : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"latitude","hash":{},"data":data}) : helper)))
    + "</td>\n					<td>"
    + escapeExpression(((helper = (helper = helpers.longitude || (depth0 != null ? depth0.longitude : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"longitude","hash":{},"data":data}) : helper)))
    + "</td>\n				</tr>\n			</tbody>\n			<thead>\n				<tr>\n					<th>Power</th>\n					<th>Value</th>\n				</tr>\n			</thead>\n			<tbody>\n				<tr>\n					<td>Minimum</td><td>"
    + escapeExpression(((helper = (helper = helpers.powerMin || (depth0 != null ? depth0.powerMin : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"powerMin","hash":{},"data":data}) : helper)))
    + " <small>dBm</small></td>\n				</tr>\n				<tr>\n					<td>Maximum</td><td>"
    + escapeExpression(((helper = (helper = helpers.powerMax || (depth0 != null ? depth0.powerMax : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"powerMax","hash":{},"data":data}) : helper)))
    + " <small>dBm</small></td>\n				</tr>\n				<tr>\n					<td colspan=\"2\">\n						<h5><small>Created date <b>"
    + escapeExpression(((helper = (helper = helpers.createdDate || (depth0 != null ? depth0.createdDate : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"createdDate","hash":{},"data":data}) : helper)))
    + "</b></small></h5> \n					</td>\n				</tr>\n			</tbody>\n		</table>\n		<div class=\"chart_power_frequency\"></div>\n		<div class=\"chart_tooltip\">\n			<p style=\"margin:0\">default</p>\n		</div>\n	</li>\n</ul>";
},"useData":true});

this["Zebra"]["tmpl"]["su_list_coord_to_edit"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hidden : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	<h2><small>Edit list</small></h2>\n\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"each","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.create : depth0), {"name":"if","hash":{},"fn":this.program(16, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n	<button type=\"button\" class=\"btn btn-default btn-sm btn-block save-btn su-save-save\">Save</button>\n	<button type=\"button\" class=\"btn btn-default btn-sm btn-block save-btn su-save-save-as\">Save as</button>\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<br>\n		<div class=\"ws-blue pull-right\">\n			<small>Hidden restore stack</small>\n			<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(((helper = (helper = helpers.hiddenNumber || (depth0 != null ? depth0.hiddenNumber : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"hiddenNumber","hash":{},"data":data}) : helper)))
    + "</small></span>\n		</div>\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, buffer = "		<a href=\"javascript:void(0)\" class=\"su-coord-to-edit\">\n			<span href=\"javascript:void(0)\" class=\"pull-right ws-red su-edit-remove-from-list\">\n				<small>remove from list</small>\n			</span> \n";
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
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.from : depth0)) != null ? stack1.latitude : stack1), {"name":"if","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data});
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
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.from : depth0)) != null ? stack1.latitude : stack1), depth0))
    + " \n							<br>\n							&nbsp<b>lng</b>: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.from : depth0)) != null ? stack1.longitude : stack1), depth0))
    + "\n						</small>\n					</div>\n";
},"8":function(depth0,helpers,partials,data) {
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing, buffer = "					<div class=\"ws-blue\">\n						<small>To</small>\n						<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.to : depth0)) != null ? stack1.index : stack1), depth0))
    + "</small></span>\n					</div>\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.to : depth0)) != null ? stack1.latitude : stack1), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n					<div class=\"ws-blue\">\n						<small>Distance</small>\n						<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(((helper = (helper = helpers.distance || (depth0 != null ? depth0.distance : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"distance","hash":{},"data":data}) : helper)))
    + " km</small></span>\n					</div>\n";
},"9":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "						<div class=\"ws-gray\">\n							<small>\n								<b>lat</b>: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.to : depth0)) != null ? stack1.latitude : stack1), depth0))
    + " \n								<br>\n								<b>lng</b>: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.to : depth0)) != null ? stack1.longitude : stack1), depth0))
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
  return "		<a href=\"javascript:void(0)\" class=\"su-create-new-edition-range ws-dark-gray\">\n			<h3>Click <small>to create a new edition range</small></h3>\n		</a>\n";
  },"18":function(depth0,helpers,partials,data) {
  return "	<div class=\"page-header\">\n		<h1>Click <small>on any marker or drag slider to start editing</small></h1>\n	</div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"unless","hash":{},"fn":this.program(18, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});

this["Zebra"]["tmpl"]["upload_help_info"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<ul class=\"nav nav-tabs\" role=\"tablist\" id=\"help-tabs\">\n	<li role=\"presentation\" class=\"active\">\n		<a href=\"#help-files-format-tab\" role=\"tab\" data-toggle=\"tab\">Files Format</a>\n	</li>\n</ul>\n<div class=\"tab-content\">\n	<div role=\"tabpanel\" class=\"tab-pane fade in active\" id=\"help-files-format-tab\">\n		<br>\n		<p class=\"lead\">\n				<small>\n				A measurement campaign defines what we call a Place. This is regularly composed of many individual text files captured by a single device. We provide scripts that can process the data in the raw format (the one provided by the device alone) and convert it to Zebra RFO input format.\n			</small>\n		</p>\n		<h4>Zebra RFO uses data formatted as follows.</h4>\n		<div class=\"col-xs-6 col-sm-6 col-md-6\">\n			<h4>Json file</h4>\n			<p>\n				A structured json file contains a collection of pairs <b>property:value</b> in the following way\n			</p>\n			<div class='well well-sm'>\n				<small>\n					<code>\n						{\n						<br>\n						&emsp;&emsp;frequencies: {\n						<br>\n						&emsp;&emsp;&emsp;&emsp;values: [ fq_1, fq_2, ..., fq_n ]\n						<br>\n						&emsp;&emsp;},\n						<br>\n						&emsp;&emsp;coordinates: [\n						<br>\n						&emsp;&emsp;&emsp;&emsp;{\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lat: lat_1,\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lng: lng_1,\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;date: date of capture,\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cap: [ pw_1, pw_2, ..., pw_n ]\n						<br>\n						&emsp;&emsp;&emsp;&emsp;},\n						<br>\n						&emsp;&emsp;&emsp;&emsp;......\n						<br>\n						&emsp;&emsp;&emsp;&emsp;{\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lat: lat_n,\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lng: lng_n,\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;date: date of capture,\n						<br>\n						&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cap: [ pw_1, pw_2, ..., pw_n ]\n						<br>\n						&emsp;&emsp;&emsp;&emsp;}\n						<br>\n						&emsp;&emsp;]\n						<br>\n						}\n					</code>\n				</small>\n			</div>\n		</div>\n		<div class=\"col-xs-6 col-sm-6 col-md-6\">\n			<h4>Txt files</h4>\n			<p>\n				A single text file contains a location (LAT and LON) with a set of frequencies out of a bandwidth:\n			</p>\n			<div class='well well-sm'>\n				<code>\n					<small>\n						frequency_1 \\\\t power_1\n						<br>\n						frequency_2 \\\\t power_2\n						<br>\n						frequency_3 \\\\t power_3\n						<br>\n						frequency_4 \\\\t power_4\n						<br>\n						...\n						<br>\n						frequency_n \\\\t power_n\n						<br>\n						latitude\n						<br>\n						longitude\n						<br>\n						date of capture\n					</small>\n				</code>\n			</div>\n		</div>\n		<div class=\"col-xs-12 col-sm-12 col-md-12\">\n			<p class=\"lead\">\n				<small>\n					Please download the script according to your input device:</h4>\n				</small>\n			</p>\n			<h4>Android device</h4>\n			<p class=\"lead\">\n				<small>\n					If you are using the android application to capture the spectrum activity (with RFExplorer), you can download the following scripts in python (\n					<a href='javascript:void(0)' id='download-android-parser-json'>\n						android parser to json\n					</a>\n					or\n					<a href='javascript:void(0)' id='download-android-parser-txt'>\n						android parser to txt\n					</a>\n					), copy the script into the folder where your captured data is located. \n					<br>\n					<br>\n					Then run the script as follows:\n				</small>\n			</p>\n			<div class=\"col-xs-6 col-sm-6 col-md-6\">\n				<h4>Json</h4>\n				<div class='well well-sm'>\n					<code>\n						python android_parser_to_json.py\n					</code>\n				</div>\n				<p class=\"lead\">\n					<small>\n						As a result, the script generate a folder with one or more folders inside depending on the variation of a set of frequencies in the original files, these folders contain the parsed data in Zebra RFO format, ready to be uploaded (and consumed) by the system.\n						<br>\n						<br>\n						Then proceed as follows:\n					</small>\n				</p>\n				<ol>\n					<li>Name the zone</li>\n					<li>Select the parsed file (*.json) inside any folder</li>\n					<li>Click on Synchronise</li>\n				</ol>\n			</div>\n			<div class=\"col-xs-6 col-sm-6 col-md-6\">\n				<h4>Txt</h4>\n				<div class='well well-sm'>\n					<code>\n						python android_parser_to_txt.py\n					</code>\n				</div>\n				<p class=\"lead\">\n					<small>\n						As a result, the script generate a folder of parsed data in Zebra RFO format, ready to be uploaded (and consumed) by the system.\n						<br>\n						<br>\n						Then proceed as follows:\n					</small>\n				</p>\n				<ol>\n					<li>Name the zone</li>\n					<li>Select all the parsed files (*.txt) which are numbered from 1 to N</li>\n					<li>Click on Synchronise</li>\n				</ol>\n			</div>\n			<div class=\"col-xs-12 col-sm-12 col-md-12\">\n				<p class=\"lead text-center\">\n					<small>\n						Wait for the processing.\n						<br>\n						<br>\n						Now you can visualise your data…\n						<br>\n						<br>\n						<b>Enjoy!</b>\n					</small>\n				</p>\n			</div>\n		</div>\n	</div>\n</div>";
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
  return buffer + "			</ul>\n		</div>\n		<label class=\"control-label sr-only\" for=\"inputSuccess5\">Hidden label</label>\n		<input id='upload-measures-name' type=\"text\" class=\"form-control\" placeholder=\"or type one\">	\n		<span class=\"feedback-icon-container glyphicon form-control-feedback\"></span>\n		<div class=\"input-group-btn\">\n			<button type=\"button\" id=\"upload-measures-info-help\" class=\"btn btn-warning\">\n				help\n				<span class=\"glyphicon glyphicon-info-sign\"></span>\n			</button>\n		</div>\n	</div>\n\n	<div class=\"ws-dragandrophandler\">\n		<h1>Drag files here</h1>\n		<div>Or, if you prefer...</div>\n		<br />\n		<input id='upload-measures-file' type=\"file\" multiple='multiple' name='data'>\n	</div>\n	\n	<div class=\"form-group has-feedback\">\n		<label for=\"upload-measures-unit\">Please select the unit for frequency</label>\n		<select class=\"form-control\" id=\"upload-measures-unit\">\n			<option></option>\n			<option value=\"Hz\">Hertz - Hz</option>\n			<option value=\"kHz\">Kilohertz - kHz</option>\n			<option value=\"MHz\">Megahertz - MHz</option>\n			<option value=\"GHz\">Gigahertz - GHz</option>\n		</select>\n	</div>\n\n	<div class=\"form-group has-feedback\">\n		<label for=\"upload-gps-position-function\">Please select the function for calculating representative samples of a common GPS position</label>\n		<select class=\"form-control\" id=\"upload-gps-position-function\">\n			<option value=\"avg\">Average</option>\n			<option value=\"max\">Maximum</option>\n			<option value=\"min\">Minimum</option>\n			<option value=\"first\">First</option>\n			<option value=\"last\">Last</option>\n		</select>\n	</div>\n\n	<ul id=\"upload-measures-files-info\" class=\"list-group\">\n		<div class=\"well well-sm\">\n			Files to upload \n			<span class=\"badge\">0</span>\n			<hr>\n			Weight of files to upload \n			<span class=\"badge\">0 Bytes</span>\n		</div>\n	</ul>\n\n	<button id='upload-measures-button-delete' type=\"button\" class=\"btn btn-warning btn-sm pull-left\">Delete selected files</button>\n	<button id='upload-measures-button' type=\"button\" class=\"btn btn-primary btn-lg pull-right\">Synchronize</button>\n</form>";
},"useData":true});

this["Zebra"]["tmpl"]["waiting"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"ws-waiting\">\n	<div class=\"spinner-container\">\n		<div class=\"rect1\"></div>\n		<div class=\"rect2\"></div>\n		<div class=\"rect3\"></div>\n		<div class=\"rect4\"></div>\n		<div class=\"rect5\"></div>\n	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["waiting_login"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"login-waiting\">\n	<div class=\"spinner-container\">\n		<div class=\"rect1\"></div>\n		<div class=\"rect2\"></div>\n		<div class=\"rect3\"></div>\n		<div class=\"rect4\"></div>\n		<div class=\"rect5\"></div>\n	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["white_spaces"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"row\">\n	<div class=\"col-md-12\">\n		<br>\n		<div id=\"white-spaces-canvas\"></div>\n	</div>\n</div>";
  },"useData":true});