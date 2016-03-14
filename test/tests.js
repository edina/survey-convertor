import $ from 'cheerio';
import JSON2HTMLConvertor from '../lib/json2html';
import HTML2JSONConvertor from '../lib/html2json';
import chai from 'chai';
import * as fs from 'fs';
import System from 'systemjs';
import '../config.js';

var assert = chai.assert;
var editor = fs.readFileSync('test/test.edtr').toString('utf8');
var jsonText = fs.readFileSync('test/test.json').toString('utf8');

describe('HTML2JSONConvertor', function() {
    var convertor;

    beforeEach(function() {
        convertor = new HTML2JSONConvertor();
    });

    it('test html to JSON conversion', function(){
        let testJSON = JSON.parse(jsonText);
        let json = convertor.HTMLtoJSON(editor, testJSON.title);
        assert.deepEqual(json, testJSON, "The conversion is right");
    });
});


describe('surveyConvertor#JSONtoHTML', function() {
    var convertor;
    beforeEach(function() {
        convertor = new JSON2HTMLConvertor();
    });

    it('test JSON to .edtr conversion', function(){
        let html = convertor.JSONtoHTML(jsonText, 'test');
        html = html.replace(/5210 \(.*?\)/, '5210');
        assert.equal(
            $('<html>' + html + '</html>').html(),
            $('<html>' + editor + '</html>').html()
        );
    });
});
