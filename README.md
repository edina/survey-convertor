[![Build Status](https://api.travis-ci.org/edina/survey-convertor.png?branch=master)](https://travis-ci.org/edina/survey-convertor)

survey-convertor
===========
ES6 lib for converting survey from html to json format and vice versa.
For this reason you'll need to install babel and use the babel-node for running it.


### Installation

```
npm install -g jspm
npm install
npm install babel
jspm install
```

### Tests

```
npm run test
```

### Command listener

For checking the conversion options you can run help:
```
babel-node lib/convert.js --help
```

For converting an html file to json file:
```
babel-node lib/convert.js --path=<path>/editor.edtr --conversion=html2json --output=xxx.json
```

For converting a folder full of html files to json files:
```
babel-node lib/convert.js --path=<folder> --conversion=html2json
```
