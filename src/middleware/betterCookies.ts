import { createAuthMiddleware } from "better-auth/api";
 
const hook = createAuthMiddleware(async (ctx) => {
    ctx.setCookies("my-cookie", "value");
    await ctx.setSignedCookie("my-signed-cookie", "value", ctx.context.secret, {
        maxAge: 1000,
    });
 
    const cookie = ctx.getCookies("my-cookie");
    const signedCookie = await ctx.getSignedCookies("my-signed-cookie");
});