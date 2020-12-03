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
  console.log('path, body', path, typeof body, body)
  console.log('method', method)
  console.log('headers', headers)

  if (method !== 'POST' || path !== '/webhook') {
    ctx.body = 'Not Found';
    return
  }
  const event = headers['x-github-event']
  const signature = headers['x-hub-signature']

  const selfSignature = sign(JSON.stringify(body))
  console.log('isSame key', selfSignature === signature)

  // if (selfSignature !== signature) {
  //   ctx.body = 'Not Allowed';
  //   return
  // }
  ctx.body = { ok: true }

  const paylaod = selfParse(body.payload)

  event === 'push' && deploy(paylaod)
});

app.listen(port, () => {
  console.log(`node server is listening port ${port}`)
})

function sign(data) {
  return `sha1${crypto.createHmac('sha1', secretKey).update(data).digest('hex')}`;
}

function selfParse(params) {
  if (!params) return '';
  try {
    const res = JSON.parse(params)
    return res;
  } catch (err) {
    console.log('JSON.parse err -> ', err)
  }
  return params;
}