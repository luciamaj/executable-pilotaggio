const { exec } = require('pkg')
exec([ process.argv[2]]).then(function() {
    console.log('Done!')
}).catch(function(error) {
    console.error(error)
})