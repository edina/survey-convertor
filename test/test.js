'use strict';

var $ = require('cheerio');
var Convertor = require('./build').default;
var assert = require('assert');
var fs = require('fs');


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
