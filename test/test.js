'use strict';

var $ = require('cheerio');
var SurveyConvertor = require('../dist/build');
var assert = require('assert');


describe('surveyConvertor#fieldToJSON', function() {
    var convertor;
    beforeEach(function() {
        convertor = new SurveyConvertor();
    });

    it('checkforTextConversion', function() {
      var field = `
      <fieldset class="fieldcontain fieldcontain-text" id="fieldcontain-text-1">
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

        assert.deepEqual(convertor.fieldToJSON("text", $field), result);
    });

    it('checkforTextareaConversion', function(){
        var field = `
        <fieldset class="fieldcontain fieldcontain-textarea" id="fieldcontain-textarea-1">
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

        assert.deepEqual(convertor.fieldToJSON("textarea", $field), result);
    });

    it('checkforTextareaConversion', function(){
        var field = `
        <fieldset class="fieldcontain fieldcontain-textarea" id="fieldcontain-textarea-1">
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

        console.log(convertor.fieldToJSON("textarea", $field));
        assert.deepEqual(convertor.fieldToJSON("textarea", $field), result);
    });
});
