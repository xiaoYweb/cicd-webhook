const http = require('http')
const crypto = require('crypto')
const { spawn } = require('child_process')
const sendMail = require('./sendMail')

const server = http.createServer((req, res) => {
  const { url, method, headers } = req;
  if (method === 'POST' && url === '/webhook') {
    const buffer = [];
    req.on('data', (fragment) => {
      buffer.push(fragment)
    })
    req.on('end', (fragment) => {
      const body = buffer.concat(fragment)
      const event = headers['x-github-event']
      const signature = headers['x-hub-signature']
      if (sign(body) !== signature) {
        res.end('Not Allowed')
        return
      }
    })
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true }))
    if (event === 'push') {
      const payload = JSON.parse(body);
      const child = spawn('sh', [`./${payload.repository.name}.sh`])
      const buffer = []
      child.stdio.on('data', (fragment) => {
        buffer.push(fragment)
      })
      child.stdio.on('end', (fragment) => {
        const logs = buffer.concat(fragment).toString()
        console.log('logs -->', logs)
        const { pusher, head_commit} && = payload
        const html = `
        <div>前端 部署成功</div>
        <h3>部署日期: ${new Date}</h3>
        <h3>部署人  : ${}</h3>
        <h3>部署日志: ${logs.replace('\r\n', '<br />')}</h3>
        `
        sendMail(html)
      })

    }
  } else {
    res.end('Not Found')
  }
})

const port = 4000;
server.listen(port, () => {
  console.log(`node server is listening port ${port}`)
})

function sign(data) {
  const secret = 'aliyun';
  return `sha1${crypto.createHmac('sha1', secret).update(data).digest('hex')}`
}
