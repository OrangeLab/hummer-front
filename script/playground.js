const http = require('http');
const fs = require('fs')
const path = require('path')
const url = require('url')
const open = require('open');
const template = require('art-template')
const serveHandler = require('serve-handler')
const server = http.createServer()
const rootPath = path.join(__dirname, '../')

function run() {

  server.on('request', async function(req, res) {
    await serveHandler(req, res, {
      "public": path.join(rootPath, 'dist')
    }, {
      sendError(absolutePath, response, acceptsJSON, root, handlers, config, error) {

        const urlObj = url.parse(req.url, true)
        const pathName = urlObj.pathname
        if (pathName === '/playground') {
          const filePath = path.join(rootPath, 'pages/index.html')
          const cssPath = 'http://localhost:5001/index-browser.css'
          const jsPath = 'http://localhost:5001/index-browser.js'
          fs.readFile(filePath, function(err, data) {
            if (err) { }
            let htmlstr = template.render(data.toString(), {
              // Todo: 获取命令行参数
              cssPath,
              jsPath
            })
            res.end(htmlstr)
          })
        }
      }
    })
  })

  server.listen(5001, () => {
    console.log('Dev Server Running at http://localhost:5001');
    open('http://localhost:5001/playground');
  })
  
}

run()
