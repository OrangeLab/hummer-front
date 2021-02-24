var fs = require('fs-extra');
var execa = require('execa');
var child_process = require('child_process')

let packageName = 'hummer-front'

var inquirer = require('inquirer');
let questionsOne = [{
  type: 'list',
  name: 'type',
  message: 'npm包版本变更级别为：',
  choices: [
    {name: 'patch(eg. 0.0.X)', value: 'patch'},
    {name: 'minor(eg. 0.X.0)', value: 'minor'},
    {name: 'major(eg. X.0.0)', value: 'major'},
    {name: 'prerelease(eg. 0.0.1-alpha.x)', value: 'prerelease'},
    {name: '无需变更(按照当前设定版本发布)', value: 'unwanted'},
  ]
}]

inquirer.prompt(questionsOne).then(answers => {
  var type = answers.type

  if (type === 'prerelease') {
    var packageJsonStr = fs.readFileSync('package.json','utf-8')
    var packageJsonObj = JSON.parse(packageJsonStr)
    if(packageJsonObj.version.indexOf('alpha') === -1) {
      execa.sync('npm', ['version', 'patch'])
      packageJsonStr = fs.readFileSync('package.json','utf-8')
      packageJsonObj = JSON.parse(packageJsonStr)
      packageJsonObj.version += '-alpha'
      packageJsonStr = JSON.stringify(packageJsonObj, null, '\t')
      var fd = fs.openSync('package.json','w')
      fs.writeSync(fd, packageJsonStr)
    }
  }

  if (type !== 'unwanted') {
    // 变更版本
    execa.sync('npm', ['version', type]);
  }

  try{
    // 切换npm源
    execa.sync('npm', ['config', 'set', 'registry', 'https://registry.npmjs.org/']);
    var { stderr } = child_process.spawnSync('npm', ['publish']);
    console.log('\x1B[46m%s\x1B[0m', stderr);
    console.log('\x1B[42m%s\x1B[0m', 'npm源发布成功');
  }catch(error){
    console.log('\x1B[31m%s\x1B[0m', error.message);
  }
})

