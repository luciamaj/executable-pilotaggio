
'use strict';
//PER COMPILARE: node js2exe.js "interfaccia.js"


// DECLARATIONS

const program = require('commander');
const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const git = simpleGit();
const fs = require('fs');
const { exec } = require('child_process');
var objfile = require('objfile');
const colors = require('colors');
const ora = require('ora');
inquirer.registerPrompt('suggest', require('inquirer-prompt-suggest'));

// PERCORSI STANDARD


const receiver = () => {
    inquirer.prompt([{type: 'confirm', name: 'git', message: 'scaricare server base da GIT?'}]).then(answers => 
        {
            if(answers.git == true) {
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
    const spinner = ora('Download della repositoty...').start();
    //process.chdir(__dirname);
    git.clone('https://github.com/luciamaj/monitoraggio-periferica.git', function() {
        spinner.succeed();
        writeIni();    
    });
}

const writeIni = () => {
    (async () => {
        const ans1 = await inquirer.prompt([
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
            {type: 'suggest', name: 'centrale', message: "url del server di monitoraggio centrale (es: http://marcegaglia-desk.eadev.it:3030)", suggestions: ['http://marcegaglia-desk.eadev.it:3030'], validate: 
            function (input) {
                    var done = this.async();
        
                    if (input == '') {
                        done('Il campo non può essere vuoto');
                        return;
                    }
                    done(null, true);
                }
            },
            {type: 'suggest', name: 'port', message: "porta del server locale (es: 4000)", suggestions: ['4000'], validate: 
            function (input) {
                    var done = this.async();
        
                    if (input == '') {
                        done('Il campo non può essere vuoto');
                        return;
                    }
                    done(null, true);
                }},
            {type: 'input', name: 'topic', message: "Topic di base della macchina (es: azienda)", validate: 
            function (input) {
                    var done = this.async();
        
                    if (input == '') {
                        done('Il campo non può essere vuoto');
                        return;
                    }
                    done(null, true);
            }}
        ]);
        const ans2 = await inquirer.prompt([
            {type: 'suggest', name: 'path', message: "path dell'applicazione (es: C:\\xampp562\\htdocs\\azienda)", suggestions: ['C:\\xampp562\\htdocs\\' + ans1.topic], validate: 
            function (input) {
                    var done = this.async();
        
                    if (input == '') {
                        done('Il campo non può essere vuoto');
                        return;
                    }
                    done(null, true);
                }},
            {type: 'input', name: 'baseUrl', message: "URL dell'applicazione (es: http://localhost/azienda/)", suggestions: ['http://localhost/' + ans1.topic], validate: 
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
        ]);
        return { ...ans1, ...ans2 };
      })()
    .then(answers => {
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
    })
    .catch(console.error);
}

program
  .alias('0.0.1')
  .description('Download from git...')

program
  .description('Contact management system')
  .action(receiver);


program.parse(process.argv);