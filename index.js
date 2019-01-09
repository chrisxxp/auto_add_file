const fs = require('fs');
const path = require("path");
const nunjucks = require('nunjucks');
nunjucks.configure('./views', { autoescape: true });

const fileConfig = [
    {
        targetFile: './html/',
        suffix: '.html',
        template: 'template.html'
    },
    {
        targetFile: './css/',
        suffix: '.css'
    },
    {
        targetFile: './scss/',
        suffix: '.scss',
        template: 'template.txt'
    },
    {
        targetFile: './js/',
        suffix: '.js',
        template: 'template.js'
    }
]


let addDir = './'; // 目录位置  注意最后 带 /  当前目录 写 ./
const addFileName = 'my_new_file'; // 目标前缀文件  无需添加后缀名



function mkdirs(dirname, callback) {
    fs.access(dirname, function (err) {
        if (!err) {
            // 存在          
            callback && callback();
        } else {
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            })
        }
    })
}

function getDirIndex(dir) {
    if(dir == './') {        
        return '../'
    }
    let dirArr = dir.split('/');
    let result = '';
    for(let i=0;i<dirArr.length;i++) {
        result += '../'
    }
    return result
}

fileConfig.forEach(item => {
    addDir = (addDir == './') ? '' : addDir;
    let abDir = item.targetFile + (addDir == './' ?'' : addDir);
    mkdirs(abDir, function (err) {
        if (err) {
            return console.error(err);
        }
        let abPath = abDir + addFileName + item.suffix;
        fs.access(abPath, function (err) {
            if (!err) {
                // 存在          
                console.log('目标文件已存在：' + abPath);
            } else {
                fs.open(abPath, 'a', function (err, fd) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('创建文件成功： ' + abPath);
                    if(item.template) {
                        console.log('存在模板:' + abPath); 
                        let result = nunjucks.render(item.template, {
                            path: getDirIndex(addDir),
                            fileName: addDir + addFileName
                        });
                        fs.writeFile(abPath, result,  function(err) {
                            if (err) {
                                return console.error(err);
                            }
                            console.log("数据写入成功！" + abPath);
                         })
                    }
                })
            }
        })
    })
})
