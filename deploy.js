const { spawn } = require('child_process')
const sendMail = require('./sendMail')

function deploy(payload) {
  console.log('payload -->> ', payload)
  console.log('sh path --> ', `./${payload.repository.name}.sh`)
  return
  const child = spawn('sh', [`./${payload.repository.name}.sh`])

  // 输出日志
  const buffer = []
  child.stdio.on('data', (fragment) => {
    buffer.push(fragment)
  })
  child.stdio.on('end', (fragment) => {
    const logs = buffer.concat(fragment).toString()
    console.log('logs -->', logs)

    return
    const { pusher, head_commit } = payload
    const html = `
  <div>前端 部署成功</div>
  <h3>部署日期: ${new Date}</h3>
  <h3>部署人  : xxx</h3>
  <h3>部署日志: ${logs.replace('\r\n', '<br />')}</h3>
  `
    sendMail(html)
  })
}

module.exports = deploy;

