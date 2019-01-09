const fs = require('fs');
const path = require("path");
const nunjucks = require('nunjucks');
nunjucks.configure('./views', { autoescape: true });

const fileConfig = [
    {
        targetFile: './html/', // 个人需要是以html为一个根目录 下面还有css等
        suffix: '.html',  // 这个后缀名本来可以和addFileName 放到一起的，只是我懒得拆分就这样了哈
        template: 'template.html' // 如果有模板的话就添加 相对路径在views/木目录下面
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


let addDir = './'; // 项目位置  注意最后 带 /  当前目录 写 ./
const addFileName = 'hey'; // 目标前缀文件  无需添加后缀名

// 注意要先npm i 加载依赖包
// 如果没看懂 可以npm run add 试下，如果没错误的话就会在配置好的位置生成对应的文件了


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
