const Koa = require('koa');
const koaBody = require('koa-body');
const crypto = require('crypto')
const deploy = require('./deploy');
const app = new Koa();
const port = 4000;
const secretKey = 'aliyun';

app.use(koaBody());

app.use(async ctx => {
  const { path, request, headers, method } = ctx;
  const { body } = request;
  console.log('path, body', path, body)
  console.log('method', method)
  console.log('headers', headers)

  const event = headers['x-github-event']
  const signature = headers['x-hub-signature']

  console.log('isSame key', sign(body) === signature)

  if (body && sign(body) !== signature) {
    res.end('Not Allowed')
    return
  }
  if (method === 'POST' && path === '/webhook') {
    ctx.body = { ok: true }
    event === 'push' && deploy(body)
    return
  }
  ctx.body = 'Not Found';
});

app.listen(port, () => {
  console.log(`node server is listening port ${port}`)
})

function sign(data) {
  return `sha1${crypto.createHmac('sha1', secretKey).update(data).digest('hex')}`;
}