const execa = require('execa');

let packageName = 'hummer-front'

try{
  execa.sync(
    'rollup',
    [
      '-c',
      '-w',
      '--environment',
      [
        `TARGET:${packageName}`
      ]
        .filter(Boolean)
        .join(',')
    ],
    {
      stdio: 'inherit'
    }
  )
}catch(error){
  console.log(error.message);
}
