import $ from 'cheerio';

class JSON2HTMLConvertor {
    constructor (){
    }

    /**
     * Check for a nested object key.
     * @param obj.
     * @param return true if key exists
     */
    checkNested(obj /*, level1, level2, ... levelN*/) {
        var args = Array.prototype.slice.call(arguments, 1);

        for (var i = 0; i < args.length; i++) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
    }

    /**
     * Replace charachters with the equivalent html5 entity
     * @param a string of text
     * @returns a text with the characters escaped
     */
    encodeEntities(text) {
        return $('<div />').text(text).html();
    }

    getFilename(str){
        return str.substr(0, str.lastIndexOf('.'));
    }

    getFilenameFromURL(path) {
        return path.substring(path.length, path.lastIndexOf('/')+1);
    }

    /**
     * @return Current Date/Time in the format DD-MM-YYYY HHhMMmSSs.
     */
    getSimpleDate() {
        var today = new Date();
        return this.zeroFill(today.getDate()) + "-" +
            this.zeroFill(today.getMonth() + 1) + "-" +
            this.zeroFill(today.getFullYear()) + " " +
            this.zeroFill(today.getHours()) + "h" +
            this.zeroFill(today.getMinutes()) + "m" +
            this.zeroFill(today.getSeconds()) + "s";
    }

    /**
     * convert JSON to html
     * @param form a JSON representing the form
     */
    JSONtoHTML (jsonStr, fileName) {
        var self = this;
        var form = JSON.parse(jsonStr);
        //add title
        form.title = form.title.replace('"', '&quot;');
        var html = '<form data-title=\"'+
            form.title+'\" data-ajax=\"false\" novalidate>\n';

        //add geometry
        html += '<div class="fieldcontain fieldcontain-geometryType"'+
          ' id="fieldcontain-geometryType" data-cobweb-type="geometryType">\n';
        html += '<input type="hidden" data-record-geometry="'+
            form.geoms.join(",")+'" value="'+form.geoms.join(",")+'">\n';
        html += '</div>\n';

        var titleField;
        if(self.checkNested(form, 'recordLayout', 'headers')){
            // if header array is defined use first element as record title field
            titleField = form.recordLayout.headers[0];
        }

        form = form || [];
        form.fields.forEach(function(value) {
            var key = value.id;
            var properties = value.properties;
            var type = value.type;

            var required = "";
            if(value.required) {
                required = 'required="required"';
            }
            var persistent = "";
            if(value.persistent) {
                persistent = 'data-persistent="on"';
            }
            var visibility = "";
            if(properties.visibility) {
                visibility = 'data-visibility="fieldcontain-'+
                  properties.visibility.id.replace("fieldcontain-", "")+
                  ' '+properties.visibility.operator+' \''+properties.visibility.answer+'\'"';
            }

            value.label = self.encodeEntities(value.label);
            switch (type) {
                case 'text':
                    html += '<div class="fieldcontain" id="fieldcontain-'+key+
                      '" data-fieldtrip-type="'+type+'" '+persistent+' '+
                      visibility+'>\n';
                    html += '<label for="form-'+key+'">'+
                        value.label+'</label>\n';
                    var inputValue = "";
                    if(properties.prefix) {
                        inputValue = properties.prefix + " (" + self.getSimpleDate() + ")";
                    }
                    html += '<input name="form-'+key+'" id="form-'+key+
                              '" type="text" '+required+' placeholder="'+properties.placeholder+
                              '" maxlength="'+properties["max-chars"]+'" value="'+inputValue+'"';

                    if (key === titleField){
                        html += ' data-title="true"';
                    }

                    html+='>\n</div>\n';
                    break;
                case 'textarea':
                    html+='<div class="fieldcontain" id="fieldcontain-'+key+
                        '" data-fieldtrip-type="'+type+'" '+persistent+' '+
                        visibility+'>\n';
                    html+='<label for="form-'+key+'">'+
                        value.label+'</label>\n';
                    html+='<textarea name="form-'+key+'" id="form-'+key+
                              '" '+required+' placeholder="'+properties.placeholder+
                              '"></textarea>\n';
                    html+='</div>\n';
                    break;
                case 'range':
                    html+='<div class="fieldcontain" id="fieldcontain-'+key+
                        '" data-fieldtrip-type="'+type+'" '+persistent+' '+
                        visibility+'>\n';
                    html+='<label for="form-'+key+'">'+
                        (value.label)+'</label>\n';
                    html+='<input name="form-'+key+'" id="form-'+key+
                              '" type="range" '+required+' placeholder="'+properties.placeholder+
                              '" step="'+properties.step+'" min="'+properties.min+'" max="'+properties.max+'">\n';
                    html+='</div>\n';
                    break;
                case 'checkbox':
                    html+='<div class="fieldcontain" id="fieldcontain-'+key+
                        '" data-fieldtrip-type="'+type+'" '+persistent+' '+
                        visibility+'>\n';
                    html+='<fieldset>\n<legend>'+value.label+'</legend>\n';
                    properties.options.forEach(function(v, k) {
                        if("image" in v) {
                            html+='<label for="'+key+'-'+k+'">\n';
                            html+='<div class="ui-grid-a grids">\n';
                            html+='<div class="ui-block-a"><p>'+v.value+'</p></div>\n';
                            html+='<div class="ui-block-b"><img src="'+
                                self.getFilenameFromURL(v.image.src)+'"></div></div>\n';
                            html+='</label>';
                            html+='<input name="'+key+'-'+k+'" id="'+key+
                                  '-'+k+'" value="'+v.value+'" type="'+type+'" '+
                                  required+'>\n';
                        }
                        else {
                            html+='<label for="'+key+'-'+k+'">'+v.value+'</label>\n';
                            html+='<input name="'+key+'-'+k+'" id="'+
                                key+'-'+k+'" value="'+v.value+'" type="'+type+'" '+
                                required+'>\n';
                        }
                    });
                    if (value.properties.other === true) {
                        html+='<label for="'+key+'-'+properties.options.length+
                            '" class="other">' +$.i18n.t('checkbox.other')+
                            '</label>\n';
                        html+='<input name="'+key+'" id="'+key+'-'+
                            properties.options.length+'" value="other"'+
                            ' class="other" type="'+type+'" '+required+'>\n';
                    }
                    html+='</fieldset>\n</div>\n';
                    break;
                case 'radio':
                    html+='<div class="fieldcontain" id="fieldcontain-'+key+
                        '" data-fieldtrip-type="'+type+'" '+persistent+' '+
                        visibility+'>\n';
                    html+='<fieldset>\n<legend>'+value.label+'</legend>\n';
                    properties.options.forEach(function(v, k) {
                        if("image" in v){
                            html+='<label for="'+key+'-'+k+'">\n';
                            html+='<div class="ui-grid-a grids">\n';
                            html+='<div class="ui-block-a"><p>'+v.value+'</p></div>\n';
                            html+='<div class="ui-block-b"><img src="'+
                                self.getFilenameFromURL(v.image.src)+'"></div></div>\n';
                            html+='</label>';
                            html+='<input name="'+key+'" id="'+key+'-'+k+
                                '" value="'+v.value+'" type="'+
                                type+'" '+required+'>\n';
                        }
                        else {
                            html+='<label for="'+key+'-'+k+'">'+v.value+'</label>\n';
                            html+='<input name="'+key+'" id="'+key+'-'+
                                k+'" value="'+v.value+'" type="'+type+'" '+required+'>\n';
                        }
                    });
                    if (value.properties.other === true) {
                        html+='<label for="'+key+'-'+
                            properties.options.length+'" class="other">' +
                            $.i18n.t('radio.other')  + '</label>\n';
                        html+='<input name="'+key+'" id="'+key+'-'+
                            properties.options.length+'" value="other" class="other" type="'+
                            type+'" '+required+'>\n';
                    }
                    html+='</fieldset>\n</div>\n';
                    break;
                case 'select':
                    html+='<div class="fieldcontain" id="fieldcontain-'+key+'"'+
                        ' data-fieldtrip-type="'+type+'" '+persistent+' '+
                        visibility+'>\n';
                    html+='<fieldset>\n<legend>'+value.label+'</legend>\n';
                    if(required !== ""){
                        html+='<select name="form-'+key+'" required="required">\n';
                        html+='<option value=""></option>\n';
                    }
                    else{
                        html+='<select name="form-'+key+'">\n';
                    }
                    properties.options.forEach(function(v, k) {
                        html+='<option value="'+v.value+'">'+v.value+'</option>\n';
                    });
                    html+='</select>\n</fieldset>\n</div>\n';
                    break;
                case 'dtree':
                    html+='<div class="fieldcontain" id="fieldcontain-'+
                        key+'" data-fieldtrip-type="'+type+'" '+visibility+'>\n';
                    html+='<fieldset>\n<label for="form-'+
                        key+'">'+value.label+'</label>\n';
                    html+='<div class="button-wrapper button-dtree"></div>\n';
                    html+='</fieldset>\n';
                    let path = self.getFilename(fileName);
                    let dataDtree = properties.filename;
                    if(path) {
                        dataDtree = path + '/' + dataDtree;
                    }
                    html+='<input type="hidden" name="form-'+key+'" data-dtree="'+
                        dataDtree+
                        '" value="'+properties.filename+'">\n';
                    html+='</div>\n';
                    break;
                case 'multiimage':
                case 'image':
                    var cl = "camera";
                    if(properties["multi-image"] === true){
                        key = key.replace("image", "multiimage");
                    }
                    if(properties.los === true){
                        cl = "camera-va";
                    }
                    html+='<div class="fieldcontain" id="fieldcontain-'+key+'"'+
                         ' data-fieldtrip-type="'+cl+'" '+visibility+'>\n';
                    html+='<div class="button-wrapper button-'+cl+'">\n';
                    html+='<input name="form-image-1" id="form-image-1"'+
                        ' type="file" accept="image/png" capture="'+cl+'" '+
                        required+' class="'+cl+'">\n';
                    html+='<label for="form-image-1">'+value.label+'</label>\n';
                    if (properties.blur) {
                        html+='<div style="display:none;" id="blur-threshold" value="' + properties.blur + '"></div>';
                    }
                    html+='</div>\n</div>\n';
                    break;
                case 'audio':
                    html+='<div class="fieldcontain" id="fieldcontain-'+key+'" data-fieldtrip-type="microphone" '+visibility+'>\n';
                    html+='<div class="button-wrapper button-microphone">\n';
                    html+='<input name="form-audio-1" id="form-audio-1" type="file" accept="audio/*" capture="microphone" '+required+' class="microphone">\n';
                    html+='<label for="form-audio-1">'+value.label+'</label>\n';
                    html+='</div>\n</div>\n';
                    break;
                case 'gps':

                    break;
                case 'warning':
                    html+='<div class="fieldcontain" id="fieldcontain-'+key+'" data-fieldtrip-type="'+type+'">\n';
                    html+='<label for="form-'+key+'">'+value.label+'</label>\n';
                    html+='<textarea name="form-'+key+'" id="form-'+key+
                              '" '+required+' placeholder="'+properties.placeholder+
                              '"></textarea>\n';
                    html+='</div>\n';
                    break;
                case 'section':
                    html+='<div class="fieldcontain" id="fieldcontain-'+key+'" data-fieldtrip-type="'+type+'">\n';
                    html+='<h3>'+value.label+'</h3>\n';
                    html+='</div>\n';
                    break;
            }
        });
        html += '<div id="save-cancel-editor-buttons" class="fieldcontain ui-grid-a">\n';
        html += '<div class="ui-block-a">\n';
        html += '<input type="submit" name="record" value="Save">\n';
        html += '</div>\n';
        html += '<div class="ui-block-b">\n';
        html += '<input type="button" name="cancel" value="Cancel">\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</form>\n';

        return html;
    }

    /**
     * Prepend number with zeros.
     * @param number Number to fill.
     * @width The number of zeros to fill (default 2).
     */
    zeroFill(number, width) {
        if(width === undefined){
            width = 2;
        }

        width -= number.toString().length;
        if(width > 0){
            return new Array(width + (/\./.test( number ) ? 2 : 1) ).join('0') + number;
        }

        return number + ""; // always return a string
    }

}

export default JSON2HTMLConvertor;
