'use strict';

var $ = require('cheerio');
var Convertor = require('./build').default;
var assert = require('assert');
var fs = require('fs');

describe('surveyConvertor#fieldToJSON', function() {
    var convertor;
    beforeEach(function() {
        convertor = new Convertor();
    });

    it('checkforTextConversion', function() {
      var field = `
      <fieldset class="fieldcontain fieldcontain-text" id="fieldcontain-text-1" data-type="text">
        <legend>Text field</legend>
        <label for="label">Field label</label>
        <input type="text" name="label" value="This is a label">
        <input type="checkbox" name="required" checked="checked">Required
        <label for="prefix">Prefix</label>
        <input type="text" name="prefix" placeholder="Set a prefix" value="">
        <input type="checkbox" name="persistent">Persistent
        <label for="placeholder">Default text</label>
        <input type="text" name="placeholder" placeholder="Place default text here (if any)" value="">
        <label for="max-chars">Max characters</label>
        <input type="number" name="max-chars" value="10">
      </fieldset>`;
        var $field = $(field);
        var result = {
          label: 'This is a label',
          prefix: '',
          placeholder: '',
          required: true,
          persistent: false,
          'max-chars': 10
        }

        var id, type;
        $field.filter('.fieldcontain').each(function(index, element){
          id = $(element).attr("id");
          type = $(element).data("type");
        });
        assert.deepEqual(convertor.fieldToJSON(id, type, $field), result);
    });

    it('checkforTextareaConversion', function(){
        var field = `
        <fieldset class="fieldcontain fieldcontain-textarea" id="fieldcontain-textarea-1" data-type="textarea">
          <legend>Textarea field</legend>
          <label for="label">Field label</label>
          <input type="text" name="label" value="This is a label">
          <input type="checkbox" name="required">Required
          <label for="placeholder">Default text</label>
          <input type="text" name="placeholder" placeholder="Place default text here (if any)" value="">
          <input type="checkbox" name="persistent">Persistent
          <div class="fieldButtons"><button type="button" class="btn btn-default remove-field" aria-label="Remove field"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button><div class="btn btn-default sortit" aria-label="Sort field"><span class="glyphicon glyphicon-sort" aria-hidden="true"></span></div></div><div class="dropdown">
        </fieldset>`;
        var $field = $(field);
        var result = {
            label: 'This is a label',
            placeholder: '',
            required: false,
            persistent: false
        };

        var id, type;
        $field.filter('.fieldcontain').each(function(index, element){
          id = $(element).attr("id");
          type = $(element).data("type");
        });
        assert.deepEqual(convertor.fieldToJSON(id, type, $field), result);
    });

    it('checkforRangeConversion', function(){
        var field = `
          <fieldset class="fieldcontain fieldcontain-range" id="fieldcontain-range-1" data-type="range">
            <legend>Range field</legend>
            <label for="label">Field label</label>
            <input type="text" name="label" value="This is a label">
            <input type="checkbox" name="required">Required <br>
            <input type="checkbox" name="persistent">Persistent
            <label for="step">Step</label>
            <input type="number" name="step" value="1">
            <label for="min">Min value</label>
            <input type="number" name="min" value="0">
            <label for="max">Max value</label>
            <input type="number" name="max" value="10">
            <div class="fieldButtons"><button type="button" class="btn btn-default remove-field" aria-label="Remove field"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button><div class="btn btn-default sortit" aria-label="Sort field"><span class="glyphicon glyphicon-sort" aria-hidden="true"></span></div></div><div class="dropdown">
          </fieldset>`;
        var $field = $(field);
        var result = {
            label: 'This is a label',
            placeholder: undefined,
            required: false,
            persistent: false,
            step: '1',
            min: '0',
            max: '10'
        };

        var id, type;
        $field.filter('.fieldcontain').each(function(index, element){
          id = $(element).attr("id");
          type = $(element).data("type");
        });
        assert.deepEqual(convertor.fieldToJSON(id, type, $field), result);
    });

    it('checkforCheckboxConversion', function(){
        var field = `
          <fieldset class="fieldcontain fieldcontain-checkbox" id="fieldcontain-checkbox-1" data-type="checkbox">
            <legend>Checkbox field</legend>
            <label for="label">Field label</label>
            <input type="text" name="label" value="This is a label"><br>
            <input type="checkbox" name="required">Required<br>
            <input type="checkbox" name="persistent">Persistent<br>
            <input type="checkbox" name="other">Allow Other
            <div class="checkboxes">
              <div class="form-inline">
                <input type="text" value="checkbox" name="fieldcontain-checkbox-1" id="fieldcontain-checkbox-1-1" class="checkbox">
                <button type="file" class="btn btn-default btn-sm upload-image" aria-label="Upload checkbox">
                  <span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>
                </button>
                <button type="button" class="btn btn-default btn-sm remove-checkbox" aria-label="Remove checkbox">
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button><input type="file" class="image-upload" id="upload-checkbox-1" style="display: none;">
              </div>
              <div class="form-inline">
                <input type="text" value="checkbox" name="fieldcontain-checkbox-1" id="fieldcontain-checkbox-1-2" class="checkbox">
                <button type="file" class="btn btn-default btn-sm upload-image" aria-label="Upload checkbox">
                  <span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>
                </button><button type="button" class="btn btn-default btn-sm remove-checkbox" aria-label="Remove checkbox">
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
                <input type="file" class="image-upload" id="upload-checkbox-1" style="display: none;">
              </div>
            </div>
            <div class="fieldButtons">
              <button type="button" class="btn btn-default remove-field" aria-label="Remove field">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              </button>
              <div class="btn btn-default sortit" aria-label="Sort field">
                <span class="glyphicon glyphicon-sort" aria-hidden="true"></span>
              </div>
            </div>
          </fieldset>`;
        var $field = $(field);
        var result = {
          label: 'This is a label',
          required: false,
          persistent: false,
          other: false,
          checkboxes: [ 'checkbox', 'checkbox' ]
        };

        var id, type;
        $field.filter('.fieldcontain').each(function(index, element){
          id = $(element).attr("id");
          type = $(element).data("type");
        });
        assert.deepEqual(convertor.fieldToJSON(id, type, $field), result);
    });

    it('checkforRadioConversion', function(){
        var field = `
          <fieldset class="fieldcontain fieldcontain-radio" id="fieldcontain-radio-1" data-type="radio">
            <legend>Radio field</legend>
            <label for="label">Field label</label>
            <input type="text" name="label" value="This is a label"> <br>
            <input type="checkbox" name="required">Required <br>
            <input type="checkbox" name="persistent">Persistent <br>
            <input type="checkbox" name="other">Allow Other
            <div class="radios">
              <div class="form-inline">
                <input type="text" value="Radio" name="fieldcontain-radio-1" id="fieldcontain-radio-1-1" class="radio">
                <button type="file" class="btn btn-default btn-sm upload-image" aria-label="Upload radio">
                  <span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>
                </button>
                <button type="button" class="btn btn-default btn-sm remove-radio" aria-label="Remove radio">
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
                <input type="file" class="image-upload" id="upload-radio-1" style="display: none;">
              </div>
              <div class="form-inline">
                <input type="text" value="Radio" name="fieldcontain-radio-1" id="fieldcontain-radio-1-2" class="radio">
                <button type="file" class="btn btn-default btn-sm upload-image" aria-label="Upload radio">
                  <span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>
                </button>
                <button type="button" class="btn btn-default btn-sm remove-radio" aria-label="Remove radio">#
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
                <input type="file" class="image-upload" id="upload-radio-1" style="display: none;">
              </div>
              <div class="form-inline">
                <input type="text" value="Radio" name="fieldcontain-radio-1" id="fieldcontain-radio-1-3" class="radio">
                <button type="file" class="btn btn-default btn-sm upload-image" aria-label="Upload radio">
                  <span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>
                </button>
                <button type="button" class="btn btn-default btn-sm remove-radio" aria-label="Remove radio">
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
                <input type="file" class="image-upload" id="upload-radio-1" style="display: none;">
              </div>
            </div>
          </fieldset>`;
        var $field = $(field);
        var result = {
          label: 'This is a label',
          required: false,
          persistent: false,
          other: false,
          radios: [ 'Radio', 'Radio', 'Radio' ]
        };

        var id, type;
        $field.filter('.fieldcontain').each(function(index, element){
          id = $(element).attr("id");
          type = $(element).data("type");
        });
        assert.deepEqual(convertor.fieldToJSON(id, type, $field), result);
    });

    it('checkforSelectConversion', function(){
        var field = `
          <fieldset class="fieldcontain fieldcontain-select" id="fieldcontain-select-1" data-type="select">
            <legend>Select field</legend>
            <label for="label">Field label</label>
            <input type="text" name="label" value="This is a label"> <br>
            <input type="checkbox" name="required">Required <br>
            <input type="checkbox" name="persistent">Persistent
            <div class="options">
              <div class="form-inline">
                <input type="text" value="option" name="fieldcontain-select-1" id="fieldcontain-select-1-1" class="select">
                <button type="button" class="btn btn-default btn-sm remove-select" aria-label="Remove select">
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
                <input type="file" class="image-upload" id="upload-select-1" style="display: none;">
              </div>
              <div class="form-inline">
                <input type="text" value="option" name="fieldcontain-select-1" id="fieldcontain-select-1-2" class="select">
                <button type="button" class="btn btn-default btn-sm remove-select" aria-label="Remove select">
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
                <input type="file" class="image-upload" id="upload-select-1" style="display: none;">
              </div>
            </div>
          </fieldset>`;
        var $field = $(field);
        var result = {
          label: 'This is a label',
          required: false,
          persistent: false,
          options: [ 'option', 'option' ]
        };

        var id, type;
        $field.filter('.fieldcontain').each(function(index, element){
          id = $(element).attr("id");
          type = $(element).data("type");
        });
        assert.deepEqual(convertor.fieldToJSON(id, type, $field), result);
    });

    it('checkforImageConversion', function(){
        var field = `
          <fieldset class="fieldcontain fieldcontain-image" id="fieldcontain-image-1" data-type="image">
            <legend>Image field</legend>
            <label for="label">Field label</label>
            <input type="text" name="label" value="This is a label">
            <input type="checkbox" name="required">Required
            <div class="form-inline">
              <input type="checkbox" name="multi-image">Multiple images
            </div>
            <div class="form-inline">
              <input type="checkbox" name="los">Line of Sight
            </div>
            <div class="form-inline">
              <label for="blur">Blur Threshold</label>
              <input type="number" name="blur" min="0" max="200" value="0">
            </div>
          </fieldset>`;
        var $field = $(field);
        var result = {
          label: 'This is a label',
          required: false,
          'multi-image': false,
          los: false,
          blur: '0'
        };

        var id, type;
        $field.filter('.fieldcontain').each(function(index, element){
          id = $(element).attr("id");
          type = $(element).data("type");
        });
        assert.deepEqual(convertor.fieldToJSON(id, type, $field), result);
    });

    it('checkforAudioConversion', function(){
        var field = `
          <fieldset class="fieldcontain fieldcontain-audio" id="fieldcontain-audio-1" data-type="audio">
            <legend>Audio field</legend>
            <label for="label">Field label</label>
            <input type="text" name="label" value="This is a label">
            <input type="checkbox" name="required" checked="checked">Required
          </fieldset>`;
        var $field = $(field);
        var result = {
          label: 'This is a label',
          required: true
        };

        var id, type;
        $field.filter('.fieldcontain').each(function(index, element){
          id = $(element).attr("id");
          type = $(element).data("type");
        });
        assert.deepEqual(convertor.fieldToJSON(id, type, $field), result);
    });

    it('checkforWarningConversion', function(){
        var field = `
          <fieldset class="fieldcontain fieldcontain-warning" id="fieldcontain-warning-1" data-type="warning">
            <legend>Warning</legend>
            <label for="label">Field label</label>
            <input type="text" name="label" value="This is a label">
            <label for="message">warning.-label</label>
            <textarea placeholder="Warning message goes here">sdasfsdfdsfdsfds</textarea>
          </fieldset>`;
        var $field = $(field);
        var result = {
          label: 'This is a label',
          placeholder: 'sdasfsdfdsfdsfds'
        };

        var id, type;
        $field.filter('.fieldcontain').each(function(index, element){
          id = $(element).attr("id");
          type = $(element).data("type");
        });
        assert.deepEqual(convertor.fieldToJSON(id, type, $field), result);
    });
});

describe('surveyConvertor#HTMLtoJSON', function() {
    var convertor;
    beforeEach(function() {
        convertor = new Convertor();
    });

    var editor = fs.readFileSync('test/test.edtr').toString('utf8');
    var expected = fs.readFileSync('test/test.json').toString('utf8');

    it('check .edtr to JSON conversion', function(){
        assert.deepEqual(
            convertor.HTMLtoJSON(editor), JSON.parse(expected));
    });
});


describe('surveyConvertor#JSONtoHTML', function() {
    var convertor;
    beforeEach(function() {
        convertor = new Convertor();
    });

    var editor = fs.readFileSync('test/test.edtr').toString('utf8');
    var jsonText = fs.readFileSync('test/test.json').toString('utf8');

    it('test JSON to .edtr conversion', function(){
        var htmlLines = convertor.JSONtoHTML(JSON.parse(jsonText));
        assert.equal(
	    $('<html>' + htmlLines.join('') + '</html>').html(),
	    $('<html>' + editor + '</html>').html()
	);
    });
});
