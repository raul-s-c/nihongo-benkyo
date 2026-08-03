const githubAuthorizeUrl = "https://github.com/login/oauth/authorize";
const githubTokenUrl = "https://github.com/login/oauth/access_token";

function html(body) {
  return new Response(`<!doctype html><meta charset="utf-8"><title>Nihongo Benkyo</title>${body}`, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}

function readCookie(request, name) {
  const entry = (request.headers.get("Cookie") || "").split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : "";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/health") return new Response("ok");

    if (url.pathname === "/auth/start") {
      const state = crypto.randomUUID();
      const callback = `${url.origin}/auth/callback`;
      const authorize = new URL(githubAuthorizeUrl);
      authorize.search = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: callback,
        scope: "gist",
        state
      });
      return new Response(null, {
        status: 302,
        headers: {
          Location: authorize.toString(),
          "Set-Cookie": `nihongo_oauth_state=${encodeURIComponent(state)}; HttpOnly; Secure; SameSite=Lax; Path=/auth; Max-Age=600`
        }
      });
    }

    if (url.pathname === "/auth/callback") {
      const state = url.searchParams.get("state") || "";
      if (!state || state !== readCookie(request, "nihongo_oauth_state")) {
        return html("<p>La autorizacion ha caducado. Cierra esta ventana y vuelve a intentarlo desde Nihongo Benkyo.</p>");
      }
      const code = url.searchParams.get("code");
      if (!code) return html("<p>GitHub no devolvio un codigo de autorizacion.</p>");
      const callback = `${url.origin}/auth/callback`;
      const tokenResponse = await fetch(githubTokenUrl, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: callback
        })
      });
      const token = await tokenResponse.json();
      if (!token.access_token) return html("<p>No se pudo completar la autorizacion. Cierra esta ventana e intentalo de nuevo.</p>");
      return html(`<script>window.opener?.postMessage({type:"nihongo-github-token",token:${JSON.stringify(token.access_token)}},${JSON.stringify(env.APP_ORIGIN)});window.close();</script><p>GitHub conectado. Puedes volver a Nihongo Benkyo.</p>`);
    }

    return new Response("Not found", { status: 404 });
  }
};
