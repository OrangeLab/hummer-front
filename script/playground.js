const http = require('http');
const request = require('request');
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
let injectJsNames = []
if (argv._ && argv._.length) {
  injectJsUrls = argv._.slice()
  console.log('injectJsUrls', injectJsUrls)
  request(`${injectJsUrls[0]}/fileList`, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      injectJsNames = JSON.parse(body).data
      injectJsNames.forEach((item, index) => {
        injectJsNames[index] = item.split('.js')[0]
      });
    }
  });
}

function run() {
  server.on('request', async function (req, res) {
    await serveHandler(req, res, {
      "public": path.join(rootPath, 'dist'),
      "directoryListing": [
        "/favicon.ico"
      ]
    }, {
      sendError(absolutePath, response, acceptsJSON, root, handlers, config, error) {
        let defaultPathname
        const urlObj = url.parse(req.url, true)
        if(injectJsNames.indexOf('index')>=0){
          defaultPathname = '/index'
        } else {
          defaultPathname = `/${injectJsNames[0]}`
        }
        const pathName = urlObj.pathname==='/'?defaultPathname:urlObj.pathname
        let newInjectJsUrls = []
        newInjectJsUrls[0] = `${injectJsUrls[0]}${pathName}.js`
        const filePath = path.join(rootPath, 'pages/index.html')
        const cssPath = 'http://localhost:5002/index-browser.css'
        const jsPath = 'http://localhost:5002/index-browser.js'
        fs.readFile(filePath, function (err, data) {
          if (err) {
            console.log(err);
          }
          let htmlstr = template.render(data.toString(), {
            cssPath,
            jsPath,
            newInjectJsUrls
          })
          res.end(htmlstr)
        })
      }
    })
  })

  server.listen(5002, () => {
    console.log('Dev Server Running at http://localhost:5002');
    open('http://localhost:5002');
  })

}

run()