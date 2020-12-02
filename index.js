const http = require('http')

const server = http.createServer((req, res) => {
  const { url, } = req;
  if (url === '/api/users') {
    res.end(JSON.stringify(users))
  } else {
    res.end('Not Found')
  }
})

const port = 4000;
server.listen(port, () => {
  console.log(`node server is listening port ${port}`)
})
