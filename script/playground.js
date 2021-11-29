const http = require('http');
const fs = require('fs')
const path = require('path')
const url = require('url')
const open = require('open');
const template = require('art-template')
const serveHandler = require('serve-handler')
const server = http.createServer()
const rootPath = path.join(__dirname, '../')
const argv = require('yargs').argv
let injectJsUrls = []

if (argv._ && argv._.length) {
  injectJsUrls = argv._.slice()
  console.log('injectJsUrls', injectJsUrls)
}

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
          const cssPath = 'http://172.23.165.179:5002/index-browser.css'
          const jsPath = 'http://172.23.165.179:5002/index-browser.js'
          fs.readFile(filePath, function(err, data) {
            if (err) {
              console.log(err);
            }
            let htmlstr = template.render(data.toString(), {
              cssPath,
              jsPath,
              injectJsUrls
            })
            res.end(htmlstr)
          })
        }
      }
    })
  })

  server.listen(5002, () => {
    console.log('Dev Server Running at http://localhost:5002');
    open('http://localhost:5002/playground');
  })

}

run()
