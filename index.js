const Koa = require("koa");
const Redis = require("ioredis");

const app = new Koa();
const db = new Redis();

app.use(async ctx => {
	if(ctx.request.url != "/") {
		return;
	}

	ctx.set("Access-Control-Allow-Origin", "*");

	const { remoteAddress } = ctx.request.socket;
	const { referer } = ctx.request.headers;
	const userAgent = ctx.request.headers["user-agent"];

	await db.sadd(`log:urls`, referer);

	await db.lpush(`log:url:${referer}`, JSON.stringify({
		remoteAddress, userAgent
	}));

	ctx.body = "ok";
});

app.listen(5000);
