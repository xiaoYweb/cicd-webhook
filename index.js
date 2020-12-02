const http = require('http')
const crypto = require('crypto')

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
