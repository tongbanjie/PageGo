const path = require('path'),
  fs = require('fs');

module.exports = {
  getPages: function(originPath){
    let paths = [];
      /* the rule of create html
        1. sub files direct under the "pages" folder
        2. folders contain index file
      */
      /* 生成静态页面的规则
        1. pages文件夹的直接子文件，并以文件名命名
        2. pages文件夹下的包含index文件的子文件夹，并以子文件夹命名
      */
    function getDir(frompath, parentDir, isRoot){
      const dir = fs.readdirSync(frompath, {withFileTypes: true});
      dir.map((dirpath)=>{
        // 如果是文件夹，继续递归
        if (fs.statSync(path.resolve(frompath, dirpath)).isDirectory()) {
          getDir(path.resolve(frompath, dirpath), parentDir + (parentDir ? '/' : '') + dirpath);
        // 根目录下的ts,tsx,jsx文件都默认作为页面
        } else if (isRoot && /\.ts$|\.tsx$|\.jsx$/.test(dirpath)) {
          paths.push(dirpath.split('.')[0]);
        // 非根目录下的index文件以其父文件夹作为页面
        } else if (/^index\./.test(dirpath.toLowerCase()) && /\.ts$|\.tsx$|\.jsx$/.test(dirpath)){
          paths.push(parentDir);
        }
      });
    }
    getDir(originPath, '', true);
    return paths;
  }
}