this["Zebra"] = this["Zebra"] || {};
this["Zebra"]["tmpl"] = this["Zebra"]["tmpl"] || {};

this["Zebra"]["tmpl"]["charts"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<ol class=\"breadcrumb\">\n	<li><a href=\"#places\">Places</a></li>\n	<li><a href=\"#places/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n	<li class=\"active\">Charts</li>\n</ol>\n<ul class=\"nav nav-tabs\" role=\"tablist\" id=\"charts-tabs\">\n	<li class=\"active\"><a href=\"#occupation-tab\" role=\"tab\" data-toggle=\"tab\">Occupation</a></li>\n	<li><a href=\"#heatmap-tab\" role=\"tab\" data-toggle=\"tab\">Heatmap</a></li>\n</ul>\n<div class=\"tab-content\">\n	<div class=\"tab-pane fade in active\" id=\"occupation-tab\"></div>\n	<div class=\"tab-pane fade\" id=\"heatmap-tab\"></div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["edit_coordinates"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"row\">\n	<div id=\"su-list-coord-to-edit\" class=\"col-md-3\"></div>\n  	<div class=\"col-md-9\">\n  		<div id=\"su-edit-place-controls\" class=\"col-xs-12 col-sm-12 col-md-12\">\n  			<div class=\"btn-group\">\n				<button type=\"button\" class=\"btn action-btn su-delete-coord\" aria-label=\"Left Align\" disabled>\n						<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n				</button>\n			</div>\n			<div class=\"btn-group\">\n				<button type=\"button\" class=\"btn select-btn su-select-first-coord\" aria-label=\"Left Align\">\n						first\n				</button>\n				<button type=\"button\" class=\"btn select-btn su-select-last-coord\" aria-label=\"Left Align\">\n						last\n				</button>\n			</div>\n		</div>\n  		<div class=\"col-xs-11 col-sm-11 col-md-11\">\n			<div id=\"map_canvas_coordinates\" style=\"height:450px;\"></div>\n		</div>\n		<div class=\"col-xs-1 col-sm-1 col-md-1\" id=\"markers-slider-edit-place\">\n			<div class=\"markers-slider\" style=\"height:450px;\"></div>\n		</div>\n  	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["edit_place"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<ol class=\"breadcrumb\">\n	<li><a href=\"#places\">Places</a></li>\n	<li><a href=\"#places/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n	<li class=\"active\">Edit place</li>\n</ol>\n<ul class=\"nav nav-tabs\" role=\"tablist\" id=\"edit-tabs\">\n	<li class=\"active\"><a href=\"#edit-coord-tab\" role=\"tab\" data-toggle=\"tab\">Coordinates</a></li>\n	<li><a href=\"#edit-outlayer-tab\" role=\"tab\" data-toggle=\"tab\">Outlayers</a></li>\n</ul>\n<div class=\"tab-content\">\n	<div class=\"tab-pane fade in active\" id=\"edit-coord-tab\"></div>\n	<div class=\"tab-pane fade\" id=\"edit-outlayer-tab\"></div>\n</div>";
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
  return "<br>\n<div class=\"row\">\n	<div class=\"col-md-3 heatmap-settings\">\n		<h4>Data Settings</h4>\n		<div class=\"form-group\">\n			<label for=\"select-function-operate\">Pick a function to operate on the data</label>\n			<select class=\"form-control\" id=\"select-function-operate\">\n				<option></option>\n				<option value=\"avg\" selected>Average</option>\n				<option value=\"max\">Maximum</option>\n				<option value=\"min\">Minimum</option>\n			</select>\n		</div>\n		<div class=\"form-group\">\n			<label for=\"max-intensity-slider\">Suggested referential Maximum</label>\n			<div class=\"max-intensity-slider\"></div>\n		</div>\n		<div class=\"form-group\">\n			<label for=\"select-change-data-by\">Change data by</label>\n			<br />\n			<label class=\"radio-inline\">\n				<input type=\"radio\" name=\"select-change-data-by\" value=\"frequency\" checked> Frequency\n			</label>\n			<label class=\"radio-inline\">\n				<input type=\"radio\" name=\"select-change-data-by\" value=\"channels\"> Channels\n				</label>\n		</div>\n		<h4>Heatmap Settings</h4>\n		<div class=\"form-group\">\n			<label for=\"opacity-slider\">Opacity</label>\n			<div class=\"opacity-slider\"></div>\n		</div>\n		<div class=\"form-group\">\n			<label for=\"radius-slider\">Radius</label>\n			<div class=\"radius-slider\"></div>\n		</div>\n		<br />\n		<div class=\"form-group heatmap-select-channels\">\n			<label for=\"allocation-channel\">Allocation channel</label>\n			<select class=\"form-control\" id=\"allocation-channel\">\n				<option value=\"0\">American 6Mhz</option>\n				<option value=\"1\">European 8Mhz</option>\n			</select>\n		</div>\n	</div>\n	<div class=\"col-md-9\">\n		<div class=\"col-xs-11 col-sm-11 col-md-11\">\n			<div id=\"map_canvas_heatmap\" style=\"width:100%; height:400px;\"></div>\n		</div>\n		<div class=\"col-xs-1 col-sm-1 col-md-1\">\n			<div class=\"markers-slider\" style=\"height:400px;\"></div>\n		</div>\n\n		<div class=\"col-md-12 heatmap-slider-container\">\n			<div class=\"slider\"></div>\n			<div class=\"slider-value\"></div>\n		</div>\n		<div class=\"col-md-12 heatmap-select-channels\">\n			<label for=\"select-channels\">Please select the channels to observe</label>\n			<input class=\"form-control\" id=\"select-channels\" type=\"hidden\" />\n		</div>\n		\n		<div class=\"col-md-12 heatmap-select-spread-distance\">\n			<label for=\"spread-distance-slider\">Please select the distance between each point</label>\n			<div class=\"spread-distance-slider\"></div>\n		</div>\n	</div>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["modal_parsing_measures"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"modal fade\" id=\"modal-parsing-measures-modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n	<div class=\"modal-dialog\">\n	   	<div class=\"modal-content\">\n	      	<div class=\"modal-body\">\n	        	<div class=\"progress\">\n						<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 0%;\">\n						0%\n						</div>\n				</div>\n\n				<div class=\"list-group\">\n					<a href=\"#\" class=\"list-group-item active\">\n						<span class=\"badge\">0/"
    + escapeExpression(((helper = (helper = helpers.numFiles || (depth0 != null ? depth0.numFiles : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"numFiles","hash":{},"data":data}) : helper)))
    + "</span>\n					    Files processed\n					</a>\n				  	<a href=\"#\" class=\"list-group-item\">\n				    	<h4 class=\"list-group-item-heading\">Measures data</h4>\n				    	<table id=\"ws-modal-parsing-measures-data-table\" class=\"table table-hover\">\n						  	<tr>\n						  		<td>Name</td><td id=\"ws-modal-parsing-measures-data-table-name\"></td>\n						  	</tr>\n						  	<tr>\n						  		<td>Total number of samples</td><td id=\"ws-modal-parsing-measures-data-table-numberCoordinates\"></td>\n						  	</tr>\n						  	<tr>\n						  		<td>Total number of frequencies</td><td id=\"ws-modal-parsing-measures-data-table-numberPowerFrequency\"></td>\n						  	</tr>\n						  	<tr>\n						  		<td>Frequencies bandwidth</td><td id=\"ws-modal-parsing-measures-data-table-frequenciesBandwidth\"></td>\n						  	</tr>\n						  	<tr>\n						  		<td>Minimum power</td><td id=\"ws-modal-parsing-measures-data-table-powerMin\"></td>\n						  	</tr>\n						  	<tr>\n						  		<td>Maximum power</td><td id=\"ws-modal-parsing-measures-data-table-powerMax\"></td>\n						  	</tr>\n						</table>\n				  	</a>\n				  	<a href=\"#\" class=\"list-group-item\">Uploading data\n				  		<span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate pull-right\"></span>\n				  	</a>\n				  	<a href=\"#\" class=\"list-group-item\">Processing in server\n				  		<span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate pull-right\"></span>\n				  	</a>\n				</div>\n\n\n	      	</div>\n	      	<div class=\"modal-footer\">\n	        	<button id=\"ws-modal-parsing-measures-button\" type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Cancel upload</button>\n	      	</div>\n	    </div>\n	</div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["occupation"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"row\">\n	<div class=\"col-md-12 slider-container occupation-settings\">\n		<h5>Allocation channel</h5>\n		<select class=\"form-control\" id=\"allocation-channel\">\n			<option value=\"0\">American 6Mhz</option>\n			<option value=\"1\">European 8Mhz</option>\n		</select>\n		<h5>Threshold</h5>\n		<div class=\"slider\"></div>\n	</div>\n	<div id=\"chart_canvas_occupation\" class=\"col-md-12\">\n		<div class=\"chart_power_frequency\" style=\"height:420px;width:95%;\"></div> \n		<div class=\"chart_tooltip\">\n			<p style=\"margin:0\">default</p>\n		</div>\n	</div>\n	<div class=\"col-md-12 occupation-settings\">\n		<div class=\"col-md-8\">\n			<input class=\"form-control\" id=\"select-channels\" type=\"hidden\" />\n		</div>\n		<div class=\"col-md-4\">\n			<button type=\"button\" class=\"btn btn-primary btn-block build-heatmap-btn-container\">Build heatmap</button>\n		</div>\n	</div>\n</div>";
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
    + "</td>\n				  	</tr>\n				  	<tr>\n				  		<td>Frequencies bandwidth</td>\n				  		<td>["
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

this["Zebra"]["tmpl"]["single_place"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<ol class=\"breadcrumb\">\n		<li><a href=\"#places\">Places</a></li>\n		<li class=\"active\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</li>\n</ol>\n\n<div class=\"row\">\n	<div class=\"col-md-4\">\n		<div class=\"panel panel-default su-sample-info\">\n			<div class=\"panel-body\">\n				<a href=\"#places/"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.id : stack1), depth0))
    + "/upload\" class=\"pull-right ws-blue\">\n					<small>upload more samples</small>\n				</a>\n				<br>\n				<a href=\"javascript:void(0)\" class=\"pull-right delete-link-place ws-red\">\n					<small>delete</small>\n				</a> \n				<h2 class=\"col-md-12\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h2>\n		  		<table class=\"table table-striped\">\n			    	<tr>\n				  		<td>Total number of samples</td>\n				  		<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.numberCoordinates : stack1), depth0))
    + "</td>\n				  	</tr>\n				  	<tr>\n				  		<td>Total distance</td>\n				  		<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.totalDistance : stack1), depth0))
    + " <small><b>km</b></small></td>\n				  	</tr>\n				  	<tr>\n				  		<td>Total number of frequencies</td>\n				  		<td>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.numberPowerFrequency : stack1), depth0))
    + "</td>\n				  	</tr>\n				  	<tr>\n				  		<td>Frequencies bandwidth</td>\n				  		<td>["
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
    + " <small><b>dBm</b></small></td>\n				  	</tr>\n				  	<tr>\n				  		<td colspan=\"2\">Allocation channel</td>\n				  	</tr>\n				  	<tr>\n				  		<td colspan=\"2\">\n				  			<select class=\"form-control\" id=\"allocation-channel\">\n								<option value=\"0\">American 6Mhz</option>\n								<option value=\"1\">European 8Mhz</option>\n							</select>\n				  		</td>\n				  	</tr>\n			  	</table>\n			  	<button id=\"su-edit-place\" class=\"btn btn-success btn-xs btn-block btn-without-corners\" type=\"button\">\n					Edit place\n				</button>\n			</div>\n			<div class=\"panel-footer\">\n				<h5 class=\"pull-right\"><small>last update <b>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.friendlyDate : stack1), depth0))
    + "</b></small></h5> \n				<br>\n			</div>\n		</div>\n  	</div>\n	  	\n  	<div class=\"col-md-8\">\n  		<div id=\"su-coord-markers-map\" style=\"height:450px;\"></div>\n  		<div id=\"su-selected-coordinate-map\">\n			<div class=\"page-header\" style=\"text-align:center\">\n					<h1>Click <small>on any marker will get info of the sample</small></h1>\n			</div>\n		</div>\n  	</div>\n</div>";
},"useData":true});

this["Zebra"]["tmpl"]["su_coordinate_resume"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<ul class=\"list-group\">\n	<li class=\"list-group-item\">\n		<table class=\"table table-condensed\">\n	   		<thead>\n      			<tr>\n        			<th>Latitude</th>\n         			<th>Longitude</th>\n      			</tr>\n   			</thead>\n		   	<tbody>\n		      	<tr>\n		      		<td>"
    + escapeExpression(((helper = (helper = helpers.latitude || (depth0 != null ? depth0.latitude : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"latitude","hash":{},"data":data}) : helper)))
    + "</td>\n		      		<td>"
    + escapeExpression(((helper = (helper = helpers.longitude || (depth0 != null ? depth0.longitude : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"longitude","hash":{},"data":data}) : helper)))
    + "</td>\n		      	</tr>\n		   	</tbody>\n		   	<thead>\n      			<tr>\n        			<th>Power</th>\n         			<th>Value</th>\n      			</tr>\n   			</thead>\n		   	<tbody>\n		      	<tr>\n		      		<td>Minimum</td><td>"
    + escapeExpression(((helper = (helper = helpers.powerMin || (depth0 != null ? depth0.powerMin : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"powerMin","hash":{},"data":data}) : helper)))
    + " <small>dBm</small></td>\n		      	</tr>\n		      	<tr>\n		      		<td>Maximum</td><td>"
    + escapeExpression(((helper = (helper = helpers.powerMax || (depth0 != null ? depth0.powerMax : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"powerMax","hash":{},"data":data}) : helper)))
    + " <small>dBm</small></td>\n		      	</tr>\n		      	<tr>\n		      		<td colspan=\"2\">\n		      			<h5><small>Created date <b>"
    + escapeExpression(((helper = (helper = helpers.createdDate || (depth0 != null ? depth0.createdDate : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"createdDate","hash":{},"data":data}) : helper)))
    + "</b></small></h5> \n		      		</td>\n		      	</tr>\n		   	</tbody>\n		</table>\n		<div class=\"chart_power_frequency\"></div>\n		<div class=\"chart_tooltip\">\n			<p style=\"margin:0\">default</p>\n		</div>\n	</li>\n</ul>";
},"useData":true});

this["Zebra"]["tmpl"]["su_list_coord_to_edit"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hidden : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	<h2><small>Edit list</small></h2>\n\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"each","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.create : depth0), {"name":"if","hash":{},"fn":this.program(12, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n	<button type=\"button\" class=\"btn btn-default btn-sm btn-block save-btn su-save-save\">Save</button>\n	<button type=\"button\" class=\"btn btn-default btn-sm btn-block save-btn su-save-save-as\">Save as</button>\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<div class=\"ws-blue pull-right\">\n				<small>Hidden restore stack</small>\n				<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(((helper = (helper = helpers.hiddenNumber || (depth0 != null ? depth0.hiddenNumber : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"hiddenNumber","hash":{},"data":data}) : helper)))
    + "</small></span>\n			</div>\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "		<a href=\"javascript:void(0)\" class=\"su-coord-to-edit\">\n			<span href=\"javascript:void(0)\" class=\"pull-right ws-red su-edit-remove-from-list\">\n					<small>remove from list</small>\n				</span> \n			<div class=\"ws-blue\">\n					<small>From</small>\n					<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.from : depth0)) != null ? stack1.index : stack1), depth0))
    + "</small></span>\n				</div>\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.from : depth0)) != null ? stack1.latitude : stack1), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "			\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.to : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.to : depth0), {"name":"unless","hash":{},"fn":this.program(10, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</a>\n";
},"5":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "					<div class=\"ws-gray\"><small><b>lat</b>: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.from : depth0)) != null ? stack1.latitude : stack1), depth0))
    + " <b>lng</b>: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.from : depth0)) != null ? stack1.longitude : stack1), depth0))
    + "</small></div>\n";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing, buffer = "				<div class=\"ws-blue\">\n						<small>To</small>\n						<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.to : depth0)) != null ? stack1.index : stack1), depth0))
    + "</small></span>\n					</div>\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.to : depth0)) != null ? stack1.latitude : stack1), {"name":"if","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n					<div class=\"ws-blue\">\n						<small>Distance</small>\n						<span class=\"ws-dark-gray\"><small>"
    + escapeExpression(((helper = (helper = helpers.distance || (depth0 != null ? depth0.distance : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"distance","hash":{},"data":data}) : helper)))
    + " Km</small></span>\n					</div>\n";
},"8":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "						<div class=\"ws-gray\"><small><b>lat</b>: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.to : depth0)) != null ? stack1.latitude : stack1), depth0))
    + " <b>lng</b>: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.to : depth0)) != null ? stack1.longitude : stack1), depth0))
    + "</small></div>\n";
},"10":function(depth0,helpers,partials,data) {
  return "					<small>You can select two markers for make a range</small>\n";
  },"12":function(depth0,helpers,partials,data) {
  return "		<a href=\"javascript:void(0)\" class=\"su-create-new-edition-range ws-dark-gray\">\n			<h3>Click <small>to create a new edition range</small></h3>\n		</a>\n";
  },"14":function(depth0,helpers,partials,data) {
  return "	<div class=\"page-header\">\n		<h1>Click <small>on any marker or drag slider to start editing</small></h1>\n	</div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"unless","hash":{},"fn":this.program(14, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});

this["Zebra"]["tmpl"]["upload_measures"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "				<li><a class=\"item-zone-name\" href=\"#upload\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n";
},"3":function(depth0,helpers,partials,data) {
  return "					<li class=\"divider\"></li>\n					<li><a href=\"#\">You have not uploaded any place</a></li>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<form>\n	<div class=\"input-group form-group has-feedback\">\n      	<div class=\"input-group-btn\">\n        	<button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">Pick a zone <span class=\"caret\"></span></button>\n        	<ul class=\"dropdown-menu\" role=\"menu\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.models : depth0), {"name":"unless","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "        	</ul>\n      	</div>\n		<label class=\"control-label sr-only\" for=\"inputSuccess5\">Hidden label</label>\n		<input id='upload-measures-name' type=\"text\" class=\"form-control\" placeholder=\"or type one\">	\n		<span class=\"feedback-icon-container glyphicon form-control-feedback\"></span>\n		<div class=\"input-group-btn\">\n			<button type=\"button\" class=\"btn btn-warning upload-measures-info-help\">help\n        		<span class=\"glyphicon glyphicon-info-sign\"></span>\n        	</button>\n		</div>\n    </div>\n\n	<div class=\"ws-dragandrophandler\">\n		<h1>Drag files here</h1>\n		<div>Or, if you prefer...</div>\n		<br />\n		<input id='upload-measures-file' type=\"file\" multiple='multiple' name='data'>\n	</div>\n	\n	<div class=\"form-group has-feedback\">\n		<label for=\"upload-measures-unit\">Please select the unit for frequency</label>\n		<select class=\"form-control\" id=\"upload-measures-unit\">\n			<option></option>\n			<option value=\"Hz\">Hertz - Hz</option>\n			<option value=\"kHz\">Kilohertz - kHz</option>\n			<option value=\"MHz\">Megahertz - MHz</option>\n			<option value=\"GHz\">Gigahertz - GHz</option>\n		</select>\n	</div>\n\n	<div class=\"form-group has-feedback\">\n		<label for=\"upload-gps-position-function\">Please select the function for calculating representative samples of a common GPS position</label>\n		<select class=\"form-control\" id=\"upload-gps-position-function\">\n			<option value=\"avg\">Average</option>\n			<option value=\"max\">Maximum</option>\n			<option value=\"min\">Minimum</option>\n			<option value=\"first\">First</option>\n			<option value=\"last\">Last</option>\n		</select>\n	</div>\n\n	<ul id=\"upload-measures-files-info\" class=\"list-group\">\n		<div class=\"well well-sm\">\n			Files to upload \n			<span class=\"badge\">0</span>\n			<hr>\n			Weight of files to upload \n			<span class=\"badge\">0 Bytes</span>\n		</div>\n	</ul>\n\n	<button id='upload-measures-button-delete' type=\"button\" class=\"btn btn-warning btn-sm pull-left\">Delete selected files</button>\n	<button id='upload-measures-button' type=\"button\" class=\"btn btn-primary btn-lg pull-right\">Synchronize</button>\n</form>";
},"useData":true});

this["Zebra"]["tmpl"]["vertical_nav"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"ws-vertical-navbar\">\n	<ul class=\"list-group\">\n		<li class=\"list-group-item\">\n			<a href=\"#places\" class=\"parent item active\">\n				<span class=\"glyphicon glyphicon-globe\"></span>\n				<span> Places</span>\n			</a>\n\n			<ul class=\"list-group children\"></ul>\n		</li>\n\n		<li class=\"list-group-item\">\n			<a href=\"#hotspots\" class=\"parent item\">\n				<span class=\"glyphicon glyphicon-fire\"></span>\n				<span> Hotspots</span>\n			</a>\n\n			<ul class=\"list-group children\">\n				<li class=\"list-group-item\">\n  					<a href=\"#hotspots/upload\" class=\"child item\">\n						<span class=\"glyphicon glyphicon-floppy-open\"></span>\n						<span> Upload hotspot</span>\n					</a>\n  				</li>\n			</ul>\n		</li>\n	</ul>\n</div>";
  },"useData":true});

this["Zebra"]["tmpl"]["vertical_nav_sub_menu_single_place"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li class=\"list-group-item single-place-menu-item\">\n	<a href=\"#places/"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"child item\">\n		<span class=\"glyphicon glyphicon-map-marker\"></span>\n		<span> Coordinates</span>\n	</a>\n</li>\n<li class=\"list-group-item single-place-menu-item\">\n	<a href=\"#places/"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "/edit?type=coordinates\" class=\"child item\">\n		<span class=\"glyphicon glyphicon-pencil\"></span>\n		<span> Edit place</span>\n	</a>\n</li>\n<li class=\"list-group-item single-place-menu-item\">\n	<a href=\"#places/"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "/charts?type=occupation\" class=\"child item\">\n		<span class=\"glyphicon glyphicon-stats\"></span>\n		<span> Occupation</span>\n	</a>\n</li>";
},"useData":true});

this["Zebra"]["tmpl"]["vertical_nav_sub_menu_single_place_upload"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<li class=\"list-group-item upload-menu-item\">\n	<a href=\"#places/upload\" class=\"child item\">\n		<span class=\"glyphicon glyphicon-floppy-open\"></span>\n		<span> Upload place</span>\n	</a>\n</li>";
  },"useData":true});

this["Zebra"]["tmpl"]["waiting"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"ws-waiting\">\n	<div class=\"spinner-container\">\n  		<div class=\"rect1\"></div>\n  		<div class=\"rect2\"></div>\n  		<div class=\"rect3\"></div>\n  		<div class=\"rect4\"></div>\n  		<div class=\"rect5\"></div>\n	</div>\n</div>";
  },"useData":true});