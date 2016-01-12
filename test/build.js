'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require('cheerio');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Convertor {
    constructor() {
        this.form = {};
    }

    /**
     * Replace charachters with the equivalent html5 entity
     * @param a string of text
     * @returns a text with the characters escaped
     */
    encodeEntities(text) {
        return (0, _jquery2.default)('<div />').text(text).html();
    }

    /**
     * convert JSON to html
     * @param form a JSON representing the form
     */
    JSONtoHTML(form) {
        var self = this;
        if (form) {
            this.form = form;
        }
        var html = [];
        //add title
        this.form.title = this.form.title.replace('"', '&quot;');
        html.push('<form data-title=\"' + this.form.title + '\" data-ajax=\"false\" novalidate>\n');

        //add geometry
        html.push('<div class="fieldcontain fieldcontain-geometryType"' + ' id="fieldcontain-geometryType" data-cobweb-type="geometryType">\n');
        html.push('<input type="hidden" data-record-geometry="' + this.form.geoms.join(",") + '" value="' + this.form.geoms.join(",") + '">\n');
        html.push('</div>\n');

        this.form = this.form || [];
        this.form.fields.forEach(function (value) {
            var key = value.id;
            var properties = value.properties;
            var splits = key.split("-");
            var type = splits[1];
            var n = splits[2];

            var required = "";
            if (value.required) {
                required = 'required="required"';
            }
            var persistent = "";
            if (value.persistent) {
                persistent = 'data-persistent="on"';
            }
            var visibility = "";
            if (properties.visibility) {
                visibility = 'data-visibility="' + properties.visibility.id.replace("fieldcontain-", "") + ' ' + properties.visibility.rule + ' \'' + properties.visibility.answer + '\'"';
            }

            value.label = self.encodeEntities(value.label);
            switch (type) {
                case 'text':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '" ' + persistent + ' ' + visibility + '>\n');
                    html.push('<label for="form-' + type + '-' + n + '">' + value.label + '</label>\n');
                    html.push('<input name="form-' + type + '-' + n + '" id="form-' + type + '-' + n + '" type="text" ' + required + ' placeholder="' + properties.placeholder + '" maxlength="' + properties["max-chars"] + '" value="' + properties.prefix + '">\n');
                    html.push('</div>\n');
                    break;
                case 'textarea':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '" ' + persistent + ' ' + visibility + '>\n');
                    html.push('<label for="form-' + type + '-' + n + '">' + value.label + '</label>\n');
                    html.push('<textarea name="form-' + type + '-' + n + '" id="form-' + type + '-' + n + '" ' + required + ' placeholder="' + properties.placeholder + '"></textarea>\n');
                    html.push('</div>\n');
                    break;
                case 'range':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '" ' + persistent + ' ' + visibility + '>\n');
                    html.push('<label for="form-' + type + '-' + n + '">' + value.label + '</label>\n');
                    html.push('<input name="form-' + type + '-' + n + '" id="form-' + type + '-' + n + '" type="range" ' + required + ' placeholder="' + properties.placeholder + '" step="' + properties.step + '" min="' + properties.min + '" max="' + properties.max + '">\n');
                    html.push('</div>\n');
                    break;
                case 'checkbox':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '" ' + persistent + ' ' + visibility + '>\n');
                    html.push('<fieldset>\n<legend>' + value.label + '</legend>\n');
                    properties.options.forEach(function (v, k) {
                        if (typeof v === "object") {
                            html.push('<label for="' + key + '-' + k + '">\n');
                            html.push('<div class="ui-grid-a grids">\n');
                            html.push('<div class="ui-block-a"><p>' + v[0] + '</p></div>\n');
                            html.push('<div class="ui-block-b"><img src="' + utils.getFilenameFromURL(v[1]) + '"></div>\n');
                            html.push('</label>');
                            html.push('<input name="' + key + '-' + k + '" id="' + key + '-' + k + '" value="' + v[0] + '" type="' + type + '" ' + required + '>\n');
                        } else {
                            html.push('<label for="' + key + '-' + k + '">' + v + '</label>\n');
                            html.push('<input name="' + key + '-' + k + '" id="' + key + '-' + k + '" value="' + v + '" type="' + type + '" ' + required + '>\n');
                        }
                    });
                    if (value.other === true) {
                        html.push('<label for="' + key + '-' + properties.options.length + '" class="other">' + i18n.t('checkbox.other') + '</label>\n');
                        html.push('<input name="' + key + '" id="' + key + '-' + properties.options.length + '" value="other"' + ' class="other" type="' + type + '" ' + required + '>\n');
                    }
                    html.push('</fieldset>\n</div>\n');
                    break;
                case 'radio':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '" ' + persistent + ' ' + visibility + '>\n');
                    html.push('<fieldset>\n<legend>' + value.label + '</legend>\n');
                    properties.options.forEach(function (v, k) {
                        if (typeof v === "object") {
                            html.push('<label for="' + key + '-' + k + '">\n');
                            html.push('<div class="ui-grid-a grids">\n');
                            html.push('<div class="ui-block-a"><p>' + v[0] + '</p></div>\n');
                            html.push('<div class="ui-block-b"><img src="' + utils.getFilenameFromURL(v[1]) + '"></div>\n');
                            html.push('</label>');
                            html.push('<input name="' + key + '" id="' + key + '-' + k + '" value="' + v[0] + '" type="' + type + '" ' + required + '>\n');
                        } else {
                            html.push('<label for="' + key + '-' + k + '">' + v + '</label>\n');
                            html.push('<input name="' + key + '" id="' + key + '-' + k + '" value="' + v + '" type="' + type + '" ' + required + '>\n');
                        }
                    });
                    if (value.other === true) {
                        html.push('<label for="' + key + '-' + properties.options.length + '" class="other">' + i18n.t('radio.other') + '</label>\n');
                        html.push('<input name="' + key + '" id="' + key + '-' + properties.options.length + '" value="other" class="other" type="' + type + '" ' + required + '>\n');
                    }
                    html.push('</fieldset>\n</div>\n');
                    break;
                case 'select':
                    html.push('<div class="fieldcontain" id="' + key + '"' + ' data-fieldtrip-type="' + type + '" ' + persistent + ' ' + visibility + '>\n');
                    html.push('<fieldset>\n<legend>' + value.label + '</legend>\n');
                    if (required !== "") {
                        html.push('<select name="' + key + '" required="required">\n');
                        html.push('<option value=""></option>\n');
                    } else {
                        html.push('<select id="' + key + '">\n');
                    }
                    properties.options.forEach(function (v, k) {
                        html.push('<option value="' + v + '">' + v + '</option>\n');
                    });
                    html.push('</select>\n</fieldset>\n</div>\n');
                    break;
                case 'dtree':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '" ' + visibility + '>\n');
                    html.push('<fieldset>\n<label for="fieldcontain-' + type + '-' + n + '">' + value.label + '</label>\n');
                    html.push('<div class="button-wrapper button-dtree"></div>\n');
                    html.push('</fieldset>\n');
                    html.push('<input type="hidden" data-dtree="' + properties.filename + '" value="' + properties.filename + '">\n');
                    html.push('</div>\n');
                    break;
                case 'multiimage':
                case 'image':
                    var cl = "camera";
                    if (properties["multi-image"] === true) {
                        type = 'multiimage';
                    }
                    if (properties.los === true) {
                        cl = "camera-va";
                    }
                    html.push('<div class="fieldcontain" id="fieldcontain-' + type + '-1" data-fieldtrip-type="' + cl + '" ' + visibility + '>\n');
                    html.push('<div class="button-wrapper button-' + cl + '">\n');
                    html.push('<input name="form-image-1" id="form-image-1"' + ' type="file" accept="image/png" capture="' + cl + '" ' + required + ' class="' + cl + '">\n');
                    html.push('<label for="form-image-1">' + value.label + '</label>\n');
                    if (properties.blur) {
                        html.push('<div style="display:none;" id="blur-threshold" value="' + properties.blur + '"></div>');
                    }
                    html.push('</div>\n</div>\n');
                    break;
                case 'audio':
                    html.push('<div class="fieldcontain" id="fieldcontain-audio-1" data-fieldtrip-type="microphone" ' + visibility + '>\n');
                    html.push('<div class="button-wrapper button-microphone">\n');
                    html.push('<input name="form-audio-1" id="form-audio-1" type="file" accept="audio/*" capture="microphone" ' + required + ' class="microphone">\n');
                    html.push('<label for="form-audio-1">' + value.label + '</label>\n');
                    html.push('</div>\n</div>\n');
                    break;
                case 'gps':

                    break;
                case 'warning':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '">\n');
                    html.push('<label for="form-' + type + '-' + n + '">' + value.label + '</label>\n');
                    html.push('<textarea name="form-' + type + '-' + n + '" id="form-' + type + '-' + n + '" ' + required + ' placeholder="' + properties.placeholder + '"></textarea>\n');
                    html.push('</div>\n');
                    break;
                case 'section':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '">\n');
                    html.push('<h3>' + value.label + '</h3>\n');
                    html.push('</div>\n');
                    break;
            }
        });
        html.push('<div id="save-cancel-editor-buttons" class="fieldcontain ui-grid-a">\n');
        html.push('<div class="ui-block-a">\n');
        html.push('<input type="submit" name="record" value="Save">\n');
        html.push('</div>\n');
        html.push('<div class="ui-block-b">\n');
        html.push('<input type="button" name="cancel" value="Cancel">\n');
        html.push('</div>\n');
        html.push('</div>\n');
        html.push('</form>');

        return html;
    }
}

exports.default = Convertor;

//# sourceMappingURL=build.js.map