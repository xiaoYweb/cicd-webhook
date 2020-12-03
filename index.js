const http = require('http')
const crypto = require('crypto')
const { spawn } = require('child_process')
const sendMail = require('./sendMail')
const port = 4000;
const secretKey = 'aliyun';

const server = http.createServer((req, res) => {
  const { url, method, headers } = req;
  const event = headers['x-github-event']
  const signature = headers['x-hub-signature']
  if (method === 'POST' && url === '/webhook') {
    const buffer = [];
    req.on('data', (fragment) => {
      buffer.push(fragment)
    })
    req.on('end', (fragment) => {
      const body = buffer.concat(fragment)
      console.log('isSame key', sign(body) !== signature)
      if (sign(body) !== signature) {
        res.end('Not Allowed')
        return
      }
    })
    // 通知 github 成功接收
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true }))

    // 开启子进程 执行 .sh 脚本 开始 cicd 
    if (event === 'push') {
      const payload = JSON.parse(body);
      console.log('sh path --> ', `./${payload.repository.name}.sh`)
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
  } else {
    res.end('Not Found')
  }
})



server.listen(port, () => {
  console.log(`node server is listening port ${port}`)
})

function sign(data) {
  return `sha1${crypto.createHmac('sha1', secretKey).update(data).digest('hex')}`;
}
