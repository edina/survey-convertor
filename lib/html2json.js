import $ from 'cheerio';

class HTML2JSONConvertor {
    constructor (){

    }

    HTMLtoJSON (html, title) {
        var $form = $(html);
        var form = {};
        var layout = null;
        var section = null;
        var recordLayout = null;
        var fieldsSelector;
        var ignoreFields;
        var self = this;

        if (title) {
            form.title = title;
        }
        else {
            form.title = $form.data('title') || '';
        }

        // Add Geometry
        form.geoms = ["point"];
        var geomValues = $form.data("record-geometry");
        if(geomValues){
            form.geoms = $form.data("record-geometry").split(",");
        }

        // Add fields
        form.fields = [];
        ignoreFields = [
            '.fieldcontain-geometryType',
            '#save-cancel-editor-buttons'
        ];
        fieldsSelector =
            '.fieldcontain' + ignoreFields
                .map(function(v){ return ':not(' + v + ')'; })
                .join('');

        $form.find(fieldsSelector).each(function(i, element){
            var $field = $(element);
            var $input;
            var required;
            var options;
            var fieldId;
            var type;
            var visibility;
            var field = null;

            var $fieldId = $field.attr("id").replace(/fieldcontain-|form-/g, "");
            var matched = /(.*?)-[0-9]+$/.exec($fieldId);

            if (matched === null) {
                console.log('warning: ' + $field.attr('id') + ' not supported');
                return;
            }
            var visibilityRule = $field.data("visibility");
            if (visibilityRule) {
                visibility = self.parseRule(visibilityRule);
            }

            //special case when multiimage
            fieldId = matched[0].replace("multiimage", "image");
            type = matched[1];
            switch (type) {
                case 'text':
                    $input = $field.find('input');

                    field = {
                        label:      $field.find('label').text(),
                        type:       type,
                        required:   $input.attr('required') !== undefined,
                        persistent: $field.data('persistent') === 'on',
                        properties: {
                            prefix:      $input.val(),
                            placeholder: $input.attr("placeholder"),
                            'max-chars': $input.attr("maxlength")
                        }
                    };
                    break;
                case 'textarea':
                    $input = $field.find('textarea');

                    field = {
                        label:      $field.find('label').text(),
                        type:       type,
                        required:   $input.attr('required') !== undefined,
                        persistent: $field.data('persistent') === 'on',
                        properties: {
                            placeholder: $input.attr("placeholder"),
                        }
                    };
                    break;
                case 'range':
                    $input = $field.find('input');

                    field = {
                        label:      $field.find('label').text(),
                        type:       type,
                        required:   $input.attr('required') !== undefined,
                        persistent: $field.data('persistent') === 'on',
                        properties: {
                            step: $input.attr('step'),
                            min:  $input.attr('min'),
                            max:  $input.attr('max')
                        }
                    };
                    break;
                case 'checkbox':
                    $input = $field.find('input[type="checkbox"]');

                    options = $input.map(function(i, element) {
                        var $checkbox = $(element);
                        var checkbox = {"value": $checkbox.val()};
                        var $img = $checkbox.prev().find('img');
                        if ($img.is('img')) {
                            checkbox.image = {
                                "src": $img.attr("src")
                            };
                        }

                        return checkbox;
                    });

                    required = $input.is(function() {
                        return $(this).attr('required') !== undefined;
                    });

                    field = {
                        label:      $field.find('legend').text(),
                        type:       type,
                        required:   required,
                        persistent: $field.data('persistent') === 'on',
                        properties: {
                            options: Array.prototype.slice.apply(options)
                        }
                    };
                    break;
                case 'radio':
                    $input = $field.find('input[type="radio"]');

                    options = $input.map(function(i, element) {
                        var $radio = $(element);

                        var $img = $radio.prev().find('img');
                        var radio = {"value": $radio.val()};
                        if ($img.is('img')) {
                            radio.image = {
                                "src": $img.attr("src")
                            };
                        }

                        return radio;
                    });

                    required = $input.is(function() {
                        return $(this).attr('required') !== undefined;
                    });

                    field = {
                        label:      $field.find('legend').text(),
                        type:       type,
                        required:   required,
                        persistent: $field.data('persistent') === 'on',
                        properties: {
                            options: Array.prototype.slice.apply(options)
                        }
                    };
                    break;
                case 'select':
                    $input = $field.find('select');

                    options = $input.find('option').map(function(i, element) {
                        return $(element).val();
                    });

                    field = {
                        label:      $field.find('legend').text(),
                        type:       type,
                        required:   $input.attr('required') !== undefined,
                        persistent: $field.data('persistent') === 'on',
                        properties: {
                            options: Array.prototype.slice.apply(options)
                        }
                    };
                    break;
                case 'dtree':
                    $input = $field.find('input[type="hidden"]');

                    field = {
                        label:      $field.find('label').text(),
                        type:       type,
                        required:   false,
                        persistent: $field.data('persistent') === 'on',
                        properties: {
                            filename: $input.data('dtree')
                        }
                    };
                    break;
                case 'image':
                    $input = $field.find('input');

                    field = {
                        label:      $field.find('label').text(),
                        type:       type,
                        required:   $input.attr("required") !== undefined,
                        persistent: false,
                        properties: {
                            los: $input.attr('class') === 'camera-va',
                            'multi-image': false

                        }
                    };
                    break;
                case 'multiimage':
                    $input = $field.find('input');

                    field = {
                        label:      $field.find('label').text(),
                        type:       "image",
                        required:   $input.attr('required') !== undefined,
                        persistent: false,
                        properties: {
                            los: $input.attr('class') === 'camera-va',
                            'multi-image': true
                        }
                    };
                    break;
                case 'audio':
                    $input = $field.find('input');

                    field = {
                        label:      $field.find('label').text(),
                        type:       type,
                        required:   $input.attr('required') !== undefined,
                        persistent: false,
                        properties: {
                        }
                    };
                    break;
                case 'gps':
                    $input = $field.find('input');

                    field = {
                        label:      $field.find('label').text(),
                        type:       type,
                        required:   $input.attr('required') !== undefined,
                        persistent: false,
                        properties: {
                            'gps-background':
                                    $input.find('input[name="gps-background"]')
                                        .is(':checked')
                        }
                    };
                    break;
                case 'warning':
                    $input = $field.find('textarea');

                    field = {
                        label:      $field.find('label').text(),
                        type:       type,
                        required:   $input.attr('required') !== undefined,
                        persistent: false,
                        properties: {
                            placeholder: $input.attr("placeholder")
                        }
                    };
                    break;
                case 'section':
                    // Not a field but included here for capturing the layout
                    layout = layout || { elements: [] };
                    if (section !== null) {
                        layout.elements.push(section);
                    }

                    section = {
                        id: fieldId,
                        type: type,
                        title: $field.find('h3').text(),
                        fields: []
                    };
                    break;
            }
            if (visibility) {
                field.properties.visibility = visibility;
            }

            if (field !== null) {
                field.id = fieldId;
                form.fields.push(field);

                if(section !== null) {
                    section.fields.push(fieldId);
                }
            }
        });

        // Just add the layout if we found some sections
        if (layout !== null) {
            form.layout = layout;
        }

        return form;
    }
}

export default HTML2JSONConvertor;
