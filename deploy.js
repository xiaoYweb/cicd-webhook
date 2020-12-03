const { spawn } = require('child_process')
const sendMail = require('./sendMail')

function deploy(payload) {
  if (!payload) return
  const { repository, pusher } = payload;
  const { name: projectName } = repository
  const { name: deployName, email } = pusher
  console.log('payload -->> ', payload)
  console.log('sh path --> ', `./${projectName}.sh`)

  const child = spawn('sh', [`./${projectName}.sh`])

  // 输出日志
  const buffer = []
  child.stdout.on('data', (fragment) => {
    buffer.push(fragment)
  })
  child.stdout.on('end', (fragment) => {
    const logs = buffer.concat(fragment).toString()
    console.log('logs -->', logs)

    return
    const { pusher, head_commit } = payload
    const html = `
  <div>前端 部署成功</div>
  <h3>部署日期: ${new Date}</h3>
  <h3>部署人  : ${deployName}</h3>
  <h3>部署日志: ${logs.replace('\r\n', '<br />')}</h3>
  `
    sendMail(html)
  })
}

module.exports = deploy;

