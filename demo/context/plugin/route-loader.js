module.exports = function (source) {

  function getRootPath(rootPath) {
    return rootPath.endsWith('/') ? rootPath : (rootPath + '/')
  }
  
  function getPathMap(pagesPath, rootPath) {
    return pagesPath.map((pagepath)=>{
       return `
                "${pagepath.toLowerCase()}": function(){
                  return import(/* webpackChunkName: "${pagepath.replace(/\//g, "-")}" */"${rootPath + pagepath}").then(_ => {
                    return _.default;
                  })
                },
              `
    })
  }

  return this.query.test.test(this.resourcePath)
         ? `export default {\n${getPathMap(this.query.pagesPath, getRootPath(this.query.pageRootPathRelativeToRouteFile)).join('')}}\n`
         : source

};
