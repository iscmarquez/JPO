let fs = require('fs');
let path = require('path');
console.log('Creating symlinks ....')

let projectModules = ['@db_integration'];
for(m of projectModules){
    if(fs.existsSync(path.resolve('node_modules/' + m + '@'))){
        console.log('Link to %s already created', m);
    }else{
        try{
            let modulePath = path.resolve('./' + m);
            console.log('Creating symlink for %s', m);
            fs.symlinkSync(modulePath, 'node_modules/' + m, 'junction');
        }catch(error){
            console.log('ERROR: Link to %s already created', m)
        }
    }
}
console.log('Done!')