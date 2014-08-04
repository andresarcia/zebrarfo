/*
 * bootstrap-filestyle
 * doc: http://dev.tudosobreweb.com.br/bootstrap-filestyle/
 * github: https://github.com/markusslima/bootstrap-filestyle
 *
 * Copyright (c) 2014 Markus Vinicius da Silva Lima
 * Version 1.1.0
 * Licensed under the MIT license.
 */
(function ($) {
    "use strict";

    var Filestyle = function (element, options) {
        this.options = options;
        this.$elementFilestyle = [];
        this.$element = $(element);
    };

    Filestyle.prototype = {
        clear: function () {
            this.$element.val('');
            this.$elementFilestyle.find(':text').val('');
        },
        
        disabled: function (value) {
        	if (value === true) {
        		if (!this.options.disabled) {
	        		this.$element
		                .attr('disabled', 'true');
		            this.$elementFilestyle.find('label').attr('disabled', 'true');
		            this.options.disabled = true;
		        }
        	} else if (value === false) {
        		if (this.options.disabled) {
		            this.$element
		                .removeAttr('disabled');
		            this.$elementFilestyle.find('label').removeAttr('disabled');
		            this.options.disabled = false;
		        }
            } else {
                return this.options.disabled;
            }
        },

        primary: function(){
            this.$elementFilestyle.find('label').removeClass('label-success');
            this.$elementFilestyle.find('label').removeClass('label-danger');
            this.$elementFilestyle.find('label').addClass('label-primary');
            this.$elementFilestyle.find('label').css('border-color','#357EBD');
        },

        success: function(){
            this.$elementFilestyle.find('label').removeClass('label-danger');
            this.$elementFilestyle.find('label').removeClass('label-primary');
            this.$elementFilestyle.find('label').addClass('label-success');
            this.$elementFilestyle.find('label').css('border-color','#3C763D');
        },

        error: function(){
            this.$elementFilestyle.find('label').removeClass('label-success');
            this.$elementFilestyle.find('label').removeClass('label-primary');
            this.$elementFilestyle.find('label').addClass('label-danger');
            this.$elementFilestyle.find('label').css('border-color','#A94442');
        },

        htmlIcon: function () {
            if (this.options.icon) {
                return '<span class="glyphicon '+this.options.iconName+'"></span> ';
            } else {
                return '';
            }
        },

        htmlInput: function () {
            if (this.options.input) {
                return '<input type="text" class="form-control '+(this.options.size=='nr'?'':'input-'+this.options.size)+'" disabled> ';
            } else {
                return '';
            }
        },

        constructor: function () {
            var _self = this,
                html = '',
                id = this.$element.attr('id'),
                files = [],
                btn = '',
                $label,
                $labelFocusableContainer;

            if (id === '' || !id) {
                id = 'filestyle-'+$('.bootstrap-filestyle').length;
                this.$element.attr({'id': id});
            }
            
            btn = '<span class="group-span-filestyle '+(this.options.input ? 'input-group-btn' : '') +'">'+
            		  '<label for="'+id+'" class="btn '+this.options.buttonName+' '+(this.options.size=='nr'?'':'btn-'+this.options.size)+'" '+(this.options.disabled?'disabled="true"':'')+'>'+
                          this.htmlIcon()+this.options.buttonText+
                      '</label>'+
                  '</span>';

            html = this.options.buttonBefore ? btn+this.htmlInput() : this.htmlInput()+btn;

            this.$elementFilestyle = $('<div class="bootstrap-filestyle input-group">'+html+'</div>');

            $label = this.$elementFilestyle.find('label');
            $labelFocusableContainer = $label.parent();

            $labelFocusableContainer
                .attr('tabindex', "0")
                .keypress(function(e) {
                    if (e.keyCode === 13 || e.charCode === 32) {
                        $label.click();
                    }
                });

            // hidding input file and add filestyle
            this.$element
                .css({'position':'absolute','clip':'rect(0,0,0,0)'})
                .attr('tabindex', "-1")
                .after(this.$elementFilestyle);
                
            if (this.options.disabled) {
            	this.$element.attr('disabled', 'true');
            }

            // Getting input file value
            this.$element.change(function () {
                var content = '';
                if (this.files === undefined) {
                    files[0] = {'name': this.value};
                } else {
                    files = this.files;
                }

                for (var i = 0; i < files.length; i++) {
                    content += files[i].name.split("\\").pop() + ', ';
                }

                if (content !== '') {
                    _self.$elementFilestyle.find(':text').val(content.replace(/\, $/g, ''));
                } else {
                	_self.$elementFilestyle.find(':text').val('');
                }
                
                if (_self.options.input == false) {
                	if (_self.$elementFilestyle.find('.badge').length == 0) {
                		_self.$elementFilestyle.find('label').append(' <span class="badge">'+files.length+'</span>');
                	} else if (files.length == 0) {
                		_self.$elementFilestyle.find('.badge').remove();
                	} else {
                		_self.$elementFilestyle.find('.badge').html(files.length);
                	}
                } else {
                	_self.$elementFilestyle.find('.badge').remove();
                }
            });

            // Check if browser is Firefox
            if (window.navigator.userAgent.search(/firefox/i) > -1) {
                // Simulating choose file for firefox
                this.$elementFilestyle.find('label').click(function () {
                    _self.$element.click();
                    return false;
                });
            }
        }
    };

    var old = $.fn.filestyle;

    $.fn.filestyle = function (option, value) {
        var get = '',
            element = this.each(function () {
                if ($(this).attr('type') === 'file') {
                    var $this = $(this),
                        data = $this.data('filestyle'),
                        options = $.extend({}, $.fn.filestyle.defaults, option, typeof option === 'object' && option);

                    if (!data) {
                        $this.data('filestyle', (data = new Filestyle(this, options)));
                        data.constructor();
                    }

                    if (typeof option === 'string') {
                        get = data[option](value);
                    }
                }
            });

        if (typeof get !== undefined) {
            return get;
        } else {
            return element;
        }
    };

    $.fn.filestyle.defaults = {
        'buttonText': 'Choose files',
        'iconName': 'glyphicon-folder-open',
        'buttonName': 'btn-default',
        'size': 'nr',
        'input': true,
        'icon': true,
        'buttonBefore': false,
        'disabled': false
    };

    $.fn.filestyle.noConflict = function () {
        $.fn.filestyle = old;
        return this;
    };

    // Data attributes register
    $(function() {
        $('.filestyle').each(function () {
            var $this = $(this),
                options = {
                    
                    'input': $this.attr('data-input') === 'false' ? false : true,
                    'icon': $this.attr('data-icon') === 'false' ? false : true,
                    'buttonBefore': $this.attr('data-buttonBefore') === 'true' ? true : false,
                    'disabled': $this.attr('data-disabled') === 'true' ? true : false,
                    'size': $this.attr('data-size'),
                    'buttonText': $this.attr('data-buttonText'),
                    'buttonName': $this.attr('data-buttonName'),
                    'iconName': $this.attr('data-iconName')
                };
    
            $this.filestyle(options);
        });
    });
})(window.jQuery);
