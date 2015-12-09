'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Convertor {
    constructor() {
        this.form = {};
    }

    /**
     * go through the dom and find all the fieldcontains to get the equivalent
     * html and convert it to a json file
     */
    getForm(html) {
        var $html = (0, _jquery2.default)(html);
        var c = this;
        this.form = {};
        this.form.title = $html.filter(".fieldcontain-general").find('input[name="label"]').val();
        var geoms = [];
        $html.find('input[name="geometryType"]:checked').each(function () {
            geoms.push((0, _jquery2.default)(this).val());
        });
        this.form.geoms = geoms;
        $html.filter(".fieldcontain").each(function () {
            var $this = (0, _jquery2.default)(this);
            var id = $this.attr("id");
            var type = $this.data("type");
            if (id !== undefined) {
                this.form[id] = c.fieldToJSON(id, type, $this);
            }
        });
        return this.form;
    }

    /**
     * convert one field to a json element
     * @param {String} id the id of the fieldcontain
     * @param {String} type the type of the fieldcontain
     * @param {Object} the html object of the fieldcontain-general
     * @returns {Object} the json object of html field
     */
    fieldToJSON(id, type, html) {
        var field = {};
        var c = this;
        switch (type) {
            case 'text':
                field["label"] = html.find('input[name="label"]').val();
                field["prefix"] = html.find('input[name="prefix"]').val();
                field["placeholder"] = html.find('input[name="placeholder"]').val();
                field["required"] = html.find('input[name="required"]').is(':checked');
                field["persistent"] = html.find('input[name="persistent"]').is(':checked');
                field["max-chars"] = html.find('input[name="max-chars"]').val();
                break;
            case 'textarea':
                field["label"] = html.find('input[name="label"]').val();
                field["placeholder"] = html.find('input[name="placeholder"]').val();
                field["required"] = html.find('input[name="required"]').is(':checked');
                field["persistent"] = html.find('input[name="persistent"]').is(':checked');
                break;
            case 'range':
                field["label"] = html.find('input[name="label"]').val();
                field["placeholder"] = html.find('input[name="placeholder"]').val();
                field["required"] = html.find('input[name="required"]').is(':checked');
                field["persistent"] = html.find('input[name="persistent"]').is(':checked');
                field["step"] = html.find('input[name="step"]').val();
                field["min"] = html.find('input[name="min"]').val();
                field["max"] = html.find('input[name="max"]').val();
                break;
            case 'checkbox':
                field["label"] = html.find('input[name="label"]').val();
                field["required"] = html.find('input[name="required"]').is(':checked');
                field["persistent"] = html.find('input[name="persistent"]').is(':checked');
                field["other"] = html.find('input[name="other"]').is(':checked');
                var checkboxes = [];

                html.find('input[name="' + id + '"]').each(function (event) {
                    var $img = (0, _jquery2.default)(this).closest(".form-inline").find("img");
                    if ($img.length > 0) {
                        checkboxes.push([]);
                        var n = checkboxes.length - 1;
                        checkboxes[n].push((0, _jquery2.default)(this).val());
                        checkboxes[n].push(c.getFilenameFromURL($img.attr("src")));
                    } else {
                        checkboxes.push((0, _jquery2.default)(this).val());
                    }
                });
                field["checkboxes"] = checkboxes;
                break;
            case 'radio':
                field["label"] = html.find('input[name="label"]').val();
                field["required"] = html.find('input[name="required"]').is(':checked');
                field["persistent"] = html.find('input[name="persistent"]').is(':checked');
                field["other"] = html.find('input[name="other"]').is(':checked');
                var radios = [];

                //go through each radio element
                html.find('input[name="' + id + '"]').each(function (event) {
                    var $img = (0, _jquery2.default)(this).closest(".form-inline").find("img");
                    //if it has images next to them then save the image src as well
                    if ($img.length > 0) {
                        radios.push([]);
                        var n = radios.length - 1;
                        radios[n].push((0, _jquery2.default)(this).val());
                        radios[n].push(c.getFilenameFromURL($img.attr("src")));
                    } else {
                        radios.push((0, _jquery2.default)(this).val());
                    }
                });
                field["radios"] = radios;
                break;
            case 'select':
                field["label"] = html.find('input[name="label"]').val();
                field["required"] = html.find('input[name="required"]').is(':checked');
                field["persistent"] = html.find('input[name="persistent"]').is(':checked');
                var options = [];
                html.find('input[name="' + id + '"]').each(function (event) {
                    var $img = (0, _jquery2.default)(this).closest(".form-inline").find("img");
                    //if it has images next to them then save the image src as well
                    if ($img.length > 0) {
                        options.push([]);
                        var n = options.length - 1;
                        options[n].push((0, _jquery2.default)(this).val());
                        options[n].push(c.getFilenameFromURL($img.attr("src")));
                    } else {
                        options.push((0, _jquery2.default)(this).val());
                    }
                });
                field["options"] = options;
                break;
            case 'dtree':
                var $a = html.find('a');
                field["label"] = html.find('input[name="label"]').val();
                field["filename"] = $a.text();
                break;
            case 'image':
                field["label"] = html.find('input[name="label"]').val();
                field["required"] = html.find('input[name="required"]').is(':checked');
                field["multi-image"] = html.find('input[name="multi-image"]').is(':checked');
                field["los"] = html.find('input[name="los"]').is(':checked');
                field["blur"] = html.find('input[name="blur"]').val();
                break;
            case 'audio':
                field["label"] = html.find('input[name="label"]').val();
                field["required"] = html.find('input[name="required"]').is(':checked');
                break;
            case 'gps':
                field["label"] = html.find('input[name="label"]').val();
                field["required"] = html.find('input[name="required"]').is(':checked');
                field["gps-background"] = html.find('input[name="gps-background"]').is(':checked');
                break;
            case 'warning':
                field["label"] = html.find('input[name="label"]').val();
                field["placeholder"] = html.find('textarea').val();
                break;
            case 'section':
                field["label"] = html.find('input[name="label"]').val();
                break;
            case undefined:
                break;
        }
        return field;
    }

    /**
     * convert JSON to html
     * @param form the html content of the form
     */
    JSONtoHTML(form) {
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

        _jquery2.default.each(this.form, function (key, value) {
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
            if (value.visibility) {
                visibility = 'data-visibility="' + value.visibility.id.replace("fieldcontain-", "") + ' ' + value.visibility.rule + ' \'' + value.visibility.answer + '\'"';
            }
            switch (type) {
                case 'text':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '" ' + persistent + ' ' + visibility + '>\n');
                    html.push('<label for="form-' + type + '-' + n + '">' + value.label + '</label>\n');
                    html.push('<input name="form-' + type + '-' + n + '" id="form-' + type + '-' + n + '" type="text" ' + required + ' placeholder="' + value.placeholder + '" maxlength="' + value["max-chars"] + '" value="' + value.prefix + '">\n');
                    html.push('</div>\n');
                    break;
                case 'textarea':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '" ' + persistent + ' ' + visibility + '>\n');
                    html.push('<label for="form-' + type + '-' + n + '">' + value.label + '</label>\n');
                    html.push('<textarea name="form-' + type + '-' + n + '" id="form-' + type + '-' + n + '" ' + required + ' placeholder="' + value.placeholder + '"></textarea>\n');
                    html.push('</div>\n');
                    break;
                case 'range':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '" ' + persistent + ' ' + visibility + '>\n');
                    html.push('<label for="form-' + type + '-' + n + '">' + value.label + '</label>\n');
                    html.push('<input name="form-' + type + '-' + n + '" id="form-' + type + '-' + n + '" type="range" ' + required + ' placeholder="' + value.placeholder + '" step="' + value.step + '" min="' + value.min + '" max="' + value.max + '">\n');
                    html.push('</div>\n');
                    break;
                case 'checkbox':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '" ' + persistent + ' ' + visibility + '>\n');
                    html.push('<fieldset>\n<legend>' + value.label + '</legend>\n');
                    _jquery2.default.each(value.checkboxes, function (k, v) {
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
                        html.push('<label for="' + key + '-' + value.checkboxes.length + '" class="other">' + i18n.t('checkbox.other') + '</label>\n');
                        html.push('<input name="' + key + '" id="' + key + '-' + value.checkboxes.length + '" value="other"' + ' class="other" type="' + type + '" ' + required + '>\n');
                    }
                    html.push('</fieldset>\n</div>\n');
                    break;
                case 'radio':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '" ' + persistent + ' ' + visibility + '>\n');
                    html.push('<fieldset>\n<legend>' + value.label + '</legend>\n');
                    _jquery2.default.each(value.radios, function (k, v) {
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
                        html.push('<label for="' + key + '-' + value.radios.length + '" class="other">' + i18n.t('radio.other') + '</label>\n');
                        html.push('<input name="' + key + '" id="' + key + '-' + value.radios.length + '" value="other" class="other" type="' + type + '" ' + required + '>\n');
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
                    _jquery2.default.each(value.options, function (k, v) {
                        html.push('<option value="' + v + '">' + v + '</option>\n');
                    });
                    html.push('</select>\n</fieldset>\n</div>\n');
                    break;
                case 'dtree':
                    html.push('<div class="fieldcontain" id="' + key + '" data-fieldtrip-type="' + type + '" ' + visibility + '>\n');
                    html.push('<fieldset>\n<label for="fieldcontain-' + type + '-' + n + '">' + value.label + '</label>\n');
                    html.push('<div class="button-wrapper button-dtree"></div>\n');
                    html.push('</fieldset>\n');
                    html.push('<input type="hidden" data-dtree="' + value.filename + '" value="' + value.filename + '">\n');
                    html.push('</div>\n');
                    break;
                case 'image':
                    var cl = "camera";
                    if (value["multi-image"] === true) {
                        type = 'multiimage';
                    }
                    if (value.los === true) {
                        cl = "camera-va";
                    }
                    html.push('<div class="fieldcontain" id="fieldcontain-' + type + '-1" data-fieldtrip-type="' + cl + '" ' + visibility + '>\n');
                    html.push('<div class="button-wrapper button-' + cl + '">\n');
                    html.push('<input name="form-image-1" id="form-image-1"' + ' type="file" accept="image/png" capture="' + cl + '" ' + required + ' class="' + cl + '">\n');
                    html.push('<label for="form-image-1">' + value.label + '</label>\n');
                    html.push('<div style="display:none;" id="blur-threshold" value="' + value.blur + '"></div>');
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
                    html.push('<textarea name="form-' + type + '-' + n + '" id="form-' + type + '-' + n + '" ' + required + ' placeholder="' + value.placeholder + '"></textarea>\n');
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

    /**
     * convert fetched html to JSON
     * @param html the html code of the form
     * @param title the title of the form that comes from the url
     */
    HTMLtoJSON(html, title) {
        var $form = (0, _jquery2.default)(html);
        var form = {};
        form.title = title;
        form.geoms = ["point"];
        var geomValues = $form.data("record-geometry");
        if (geomValues) {
            form.geoms = $form.data("record-geometry").split(",");
        }
        $form.find(".fieldcontain").each(function () {
            var $this = (0, _jquery2.default)(this);
            var id = $this.attr("id");
            var type = $this.attr("id").split("-")[1];
            form[id] = {};
            switch (type) {
                case 'text':
                    form[id]["label"] = $this.find('label').text();
                    var $input = $this.find('input');
                    form[id]["prefix"] = $input.val();
                    form[id]["placeholder"] = $input.prop("placeholder");
                    form[id]["required"] = $input.prop("required");
                    form[id]["persistent"] = $this.data("persistent");
                    form[id]["max-chars"] = $input.prop("maxlength");
                    break;
                case 'textarea':
                    form[id]["label"] = $this.find('label').text();
                    var $input = $this.find('textarea');
                    form[id]["placeholder"] = $input.prop("placeholder");
                    form[id]["required"] = $input.prop("required");
                    form[id]["persistent"] = $this.data("persistent");
                    break;
                case 'range':
                    form[id]["label"] = $this.find('label').text();
                    var $input = $this.find('input');
                    form[id]["placeholder"] = $input.prop("placeholder");
                    form[id]["required"] = $input.prop("required");
                    form[id]["persistent"] = $this.data("persistent");
                    form[id]["step"] = $input.prop("step");
                    form[id]["min"] = $input.prop("min");
                    form[id]["max"] = $input.prop("max");
                    break;
                case 'checkbox':
                    form[id]["label"] = $this.find('legend').text();
                    form[id]["persistent"] = $this.data("persistent");
                    var checkboxes = [];
                    var required;
                    $this.find('input[type="checkbox"]').each(function () {
                        var ch;
                        var $img = (0, _jquery2.default)(this).prev().find('img');
                        if ($img.is('img')) {
                            ch = [];
                            ch.push((0, _jquery2.default)(this).val());
                            ch.push(pcapi.buildFSUrl('editors', $img.attr("src")));
                        } else {
                            ch = (0, _jquery2.default)(this).val();
                        }
                        checkboxes.push(ch);
                        required = (0, _jquery2.default)(this).attr("required");
                    });
                    form[id]["required"] = required;
                    form[id]["checkboxes"] = checkboxes;
                    break;
                case 'radio':
                    form[id]["label"] = $this.find('legend').text();
                    form[id]["persistent"] = $this.data("persistent");
                    var radios = [];
                    var required;
                    $this.find('input[name="' + id + '"]').each(function (event) {
                        var rd;
                        var $img = (0, _jquery2.default)(this).prev().find('img');
                        if ($img.is('img')) {
                            rd = [];
                            rd.push((0, _jquery2.default)(this).val());
                            rd.push(pcapi.buildFSUrl('editors', $img.attr("src")));
                        } else {
                            rd = (0, _jquery2.default)(this).val();
                        }
                        radios.push(rd);
                        required = (0, _jquery2.default)(this).attr("required");
                    });
                    form[id]["required"] = required;
                    form[id]["radios"] = radios;
                    break;
                case 'select':
                    form[id]["label"] = $this.find('legend').text();
                    form[id]["required"] = $this.find('select').prop("required");
                    var options = [];
                    $this.find('option').each(function (event) {
                        options.push((0, _jquery2.default)(this).val());
                    });
                    form[id]["options"] = options;
                    break;
                case 'dtree':
                    form[id]["label"] = $this.find('label').text();
                    form[id]["filename"] = $this.find('input[type="hidden"]').data('dtree');
                    break;
                case 'image':
                    form[id]["label"] = $this.find('label').text();
                    var $input = $this.find('input');
                    form[id]["required"] = $input.prop("required");
                    form[id]["multi-image"] = false;
                    form[id]["los"] = $input.attr('class') === 'camera-va';
                    break;
                case 'multiimage':
                    form[id]["label"] = $this.find('label').text();
                    var $input = $this.find('input');
                    form[id]["required"] = $input.prop("required");
                    form[id]["multi-image"] = true;
                    form[id]["los"] = $input.attr('class') === 'camera-va';
                    break;
                case 'audio':
                    form[id]["label"] = $this.find('label').text();
                    var $input = $this.find('input');
                    form[id]["required"] = $input.prop("required");
                    break;
                case 'gps':
                    form[id]["label"] = $this.find('label').text();
                    var $input = $this.find('input');
                    form[id]["required"] = $input.prop("required");
                    form[id]["gps-background"] = html.find('input[name="gps-background"]').is(':checked');
                    break;
                case 'warning':
                    form[id]["label"] = $this.find('label').text();
                    var $input = $this.find('textarea');
                    form[id]["placeholder"] = $input.prop("placeholder");
                    break;
                case 'section':
                    form[id]["label"] = $this.find('h3').text();
                    break;
                case undefined:
                    break;
            }
        });
        return form;
    }

    /**
    * get filename from url
    * @param {String} path url or string
    * @returns {String} filename
    */
    getFilenameFromURL(path) {
        return path.substring(path.length, path.lastIndexOf('/') + 1);
    }
}

exports.default = Convertor;
