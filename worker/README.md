# Nihongo Benkyo OAuth Worker

Este Worker intercambia el codigo OAuth de GitHub sin exponer el Client Secret en la PWA.

## Despliegue

1. Copia `worker/.secrets.local.example.json` como `worker/.secrets.local.json` y completa el token de Cloudflare y el Client Secret de la OAuth App de GitHub. Este archivo esta excluido de Git.
2. Desde `worker`, ejecuta `powershell.exe -ExecutionPolicy Bypass -File .\\deploy.ps1`.
3. Configura la Authorization callback URL de la OAuth App a `https://nihongo-benkyo-auth.raul-nihongo.workers.dev/auth/callback`.

La URL publica del Worker es `https://nihongo-benkyo-auth.raul-nihongo.workers.dev`. La PWA la tiene integrada como configuracion publica; el Client Secret solo existe como secreto de Cloudflare.

El Worker no almacena datos de aprendizaje: solo intercambia el codigo OAuth por un token limitado al alcance `gist`.
