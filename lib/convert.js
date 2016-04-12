import * as fs from 'fs';
import program from 'commander';
import JSON2HTMLConvertor from './json2html';
import HTML2JSONConvertor from './html2json';

class Convertor {
    constructor (args){
        this.args = args;
    }

    convert() {
        let isFile = fs.lstatSync(this.args.path).isFile();
        let isDir = fs.lstatSync(this.args.path).isDirectory();
        if (isFile) {
            let file = fs.readFileSync(this.args.path, 'utf8');
            if (this.args.conversion === 'html2json') {
                let conv = new HTML2JSONConvertor();
                let json = conv.HTMLtoJSON(file);
                let output = this.args.output;
                fs.writeFile(output, JSON.stringify(json, null, 4), function(err){
                    if (err) {
                        throw err;
                    }
                    console.log("The file " + output + ' has been exported');
                });
            }
        }
        else if (isDir) {
            if(this.args.path.endsWith("data/") || this.args.path.endsWith("data")){
                let conv = new HTML2JSONConvertor();
                let path = this.args.path;
                let dirs = fs.readdirSync(this.args.path);
                dirs.forEach(function(dir, index){
                    dir = path+"/"+dir;
                    if(fs.lstatSync(dir).isDirectory()){
                        dir += "/editors";
                        let files = [];
                        try {
                            files = fs.readdirSync(dir);
                            files.forEach(function(file, index){
                                if (file.endsWith('.edtr')){
                                    let f = fs.readFileSync(dir+'/'+file, 'utf8');
                                    let json = conv.HTMLtoJSON(f);
                                    let filename = file.substr(0, file.lastIndexOf('.'));
                                    let output = dir+'/'+filename+'.json';
                                    fs.writeFile(output, JSON.stringify(json, null, 4), function(err){
                                        if (err) {
                                            throw err;
                                        }
                                        console.log("The file " + output + ' has been exported');
                                    });
                                }
                            });
                        }
                        catch(e){
                            console.warn("The path "+ dir +" doesn't exist");
                        }
                    }
                });
            }
            else {
                let files = fs.readdirSync(this.args.path);
                if (this.args.conversion === 'html2json') {
                    let path = this.args.path;
                    files.forEach(function(file, index){
                        if (file.endsWith('.edtr')){
                            let f = fs.readFileSync(path+file, 'utf8');
                            let json = conv.HTMLtoJSON(f);
                            let filename = file.substr(0, file.lastIndexOf('.'));
                            let output = path+filename+'.json';
                            fs.writeFile(output, JSON.stringify(json, null, 4), function(err){
                                if (err) {
                                    throw err;
                                }
                                console.log("The file " + output + ' has been exported');
                            });
                        }
                    });
                }
            }
        }
    }
}

export default Convertor;

if (require.main === module){

    program
        .version('0.0.1')
        .option('-p, --path [type]', 'Define the path of the input file/directory')
        .option('-o, --output [type]', 'Define the paht of the output file/directory, not needed when input is directory')
        .option('-c, --conversion [type]', 'Define the conversion [html2json, json2html]')
        .parse(process.argv);

    let convertor = new Convertor(program);
    convertor.convert();
}
