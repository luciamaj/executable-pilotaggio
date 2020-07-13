
'use strict';
//PER COMPILARE: node js2exe.js "interfaccia.js"

const program = require('commander');
const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const git = simpleGit();
const fs = require('fs');
const { exec } = require('child_process');
var objfile = require('objfile');

const receiver = () => {
    inquirer.prompt([{type: 'confirm', name: 'git', message: 'scaricare server base da git? (y/n)'}]).then(answers => 
        {
            if(answers.git == true) {
                console.log('dowloading...'); 
                downloadRepo();
            } else if (answers.git == 'n' || answers.git == 'no') {
                console.log('arrivederci!');
                return;
            } else {
                console.log('rispondere con y/n');
            }
        }
    ) 
}

function downloadRepo() {
    git.clone('https://github.com/luciamaj/monitoraggio-periferica.git', function() {
        console.log('dowload repo terminato');
        writeIni();    
    });
}

const writeIni = () => {
    inquirer.prompt(prompts).then(answers => { 
        let name = ['info', 'name', ''];
        let centrale = ['connection', 'centrale', ''];
        let io = ['connection', 'io', ''];
        let path = ['git', 'path', ''];
        let baseUrl = ['app', 'baseUrl', ''];
        let backupAppUrl = ['app', 'backupAppUrl', ''];

        let values = [name, centrale, io, path, baseUrl, backupAppUrl];

        name[2] = answers.name;
        centrale[2] = answers.centrale;
        io[2] = answers.port;
        path[2] = answers.path;
        baseUrl[2] = answers.baseUrl;
        backupAppUrl[2] = answers.backupAppUrl;

        fs.writeFile('monitoraggio-periferica/config.ini', '# ini periferica' , function() {
            var myFile = objfile('monitoraggio-periferica/config2.ini');

            for(let value of values) {
                myFile.set(value[0], value[1], value[2], function (err) {
                    if (err) {
                      console.error(err);
                    } else {
                      //console.log('Value set');
                    }
                });
            }
        });
    }); 
}

function validate(input) {
    var done = this.async();
    setTimeout(function() {
        if (typeof input !== 'number') {
          // Pass the return value in the done callback
          done('You need to provide a number');
          return;
        }
        // Pass the return value in the done callback
        done(null, true);
    }, 3000);
} 

let prompts;

prompts = [
    {type: 'input', name: 'name', message: "nome della macchina (es: pc-totem1)", validate: 
    function (input) {
            var done = this.async();

            if (input == '') {
                done('Il campo non può essere vuoto');
                return;
            }
            done(null, true);
        }
    },
    {type: 'input', name: 'centrale', message: "url del server di monitoraggio centrale (es: http://marcegaglia-desk.eadev.it:3030)", validate: 
    function (input) {
            var done = this.async();

            if (input == '') {
                done('Il campo non può essere vuoto');
                return;
            }
            done(null, true);
        }
    },
    {type: 'input', name: 'port', message: "porta del server locale (es: 4000)", validate: 
    function (input) {
            var done = this.async();

            if (input == '') {
                done('Il campo non può essere vuoto');
                return;
            }
            done(null, true);
        }},
    {type: 'input', name: 'path', message: "path dell'applicazione (es: C:\\xampp562\\htdocs\\azienda)", validate: 
    function (input) {
            var done = this.async();

            if (input == '') {
                done('Il campo non può essere vuoto');
                return;
            }
            done(null, true);
        }},
    {type: 'input', name: 'baseUrl', message: "URL dell'applicazione (es: http://localhost/azienda/)", validate: 
    function (input) {
            var done = this.async();

            if (input == '') {
                done('Il campo non può essere vuoto');
                return;
            }
            done(null, true);
        }},
    {type: 'input', name: 'backupAppUrl', message: "App di base (es: totem_default)", validate: 
    function (input) {
            var done = this.async();

            if (input == '') {
                done('Il campo non può essere vuoto');
                return;
            }
            done(null, true);
        }
    },
]

program
  .alias('0.0.1')
  .description('Download from git...')

program
  .description('Contact management system')
  .action(receiver);


program.parse(process.argv);