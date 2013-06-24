(function (kendo) {
	kendo.forms = kendo.forms || {};
	
	function dateTimeUpgrade(index, val) {
		var input = $(val);

		input.kendoDateTimePicker({
			value: input.val().length > 0 ? new Date(input.val()) : null,
			min: input.attr('min') ? new Date(input.attr('min')) : new Date(1900, 0, 1),
			max: input.attr('max') ? new Date(input.attr('max')) : new Date(2099, 11, 31),
			// Step attribute is seconds, interval in minute
			interval: input.attr('step') ? Math.round(parseInt(input.attr('step'), 10)/60) : 30
		});
	}

	var typeUpgrades = [
		{ 
			type: 'color',
			upgrade: function(index, val) {
				$(val).kendoColorPicker({ palette: "basic" });
			}
		},
		{
			type: 'number',
			upgrade: function(index, val) {
				$(val).kendoNumericTextBox();
			}
		},
		{
			type: 'range',
			upgrade: function(index, val) {
				$(val).kendoSlider({
					showButtons: false,
					tickPlacement: 'none'
				});
			}
		},
		{
			type: 'file',
			upgrade: function(index, val) {
				$(val).kendoUpload();
			}
		},
		{
			type: 'datetime',
			upgrade: dateTimeUpgrade
		},
		{
			type: 'datetime-local',
			upgrade: dateTimeUpgrade
		}
	];

	kendo.forms.types = typeUpgrades;
} (kendo));;(function (kendo) {
	kendo.forms = kendo.forms || {};

	function detectFormTypeSupport(type) {
		var i = document.createElement("input");
		i.setAttribute("type", type);
		return i.type !== "text";
	}

	function detectDateTimeFields(type) {
		var dummyVal = ":(";

		var i = document.createElement("input");
		i.setAttribute("type", type);
		i.value = dummyVal; // Credit to Mike Taylor https://gist.github.com/miketaylr/310734
		return (i.value !== dummyVal);
	}

	var featureDetects = {
		color: detectFormTypeSupport("color"),
		number: detectFormTypeSupport("number"),
		range: detectFormTypeSupport("range"),
		file: detectFormTypeSupport("file"),
		datetime: detectDateTimeFields("datetime"),
		datetime_local: detectFormTypeSupport("datetime-local")
	};

	kendo.forms.features = featureDetects;
} (kendo));;(function($, kendo) {
	var ui = kendo.ui,
		Widget = ui.Widget,
		formWidget,
		typeUpgrades = kendo.forms.types;

	Form = Widget.extend({
		init: function(element, options) {
			var that = this;
			var form = $(element);
			var i, len;

			var upgradeFormType = function(type, callback) {
				// replace dash with underscore for features object lookup
				var modType = type.replace(/-/g,'_');

				if (!kendo.forms.features[modType] || that.options.alwaysUseWidgets) {
					form.find('input[type=' + type + ']').each(callback);	
				}
			};
			
			// base call to widget initialization
			Widget.fn.init.call(this, element, options);

			if (that.options.styleInputs) {
				form.find('input').each(function(index, val) {
					// Add the k-input class to each form element, which provides Kendo UI styling
					// to all elements, not just those the widget will transform.
					$(val).addClass('k-input');
				});
			}

			// Add basic support for form types defined in the typeUpgrades array
			for (i = 0, len = typeUpgrades.length; i < len; i++) {
				var typeObj = typeUpgrades[i];
				upgradeFormType(typeObj.type, typeObj.upgrade);
			}
		},

		options: {
			// the name is what it will appear in the kendo namespace (kendo.ui.Form).
			// The jQuery plugin would be jQuery.fn.kendoForm.
			name: "Form",
			alwaysUseWidgets: false,
			styleInputs: true
		}
	});

	ui.plugin(Form);
} (jQuery, kendo));