# Activar cuentas y sincronizacion

La app ya incluye el cliente de sincronizacion. Falta crear un proyecto de Supabase y configurar sus dos valores publicos. El `publishable key` se puede incluir en una app web: la proteccion real de los datos depende de las politicas RLS de abajo, no de ocultar esa clave.

## 1. Crear el proyecto

1. Crea un proyecto en [Supabase](https://supabase.com/dashboard).
2. En **Authentication > URL Configuration**, anade `https://raul-s-c.github.io/nihongo-benkyo/` a las Redirect URLs.
3. En **Project Settings > API**, copia la Project URL y la Publishable key.
4. Sustituye los dos textos vacios de `cloud-config.js` por esos valores y publica el cambio. No uses nunca una `service_role` key en la app.

## 2. Crear la tabla segura

Abre el SQL Editor del proyecto y ejecuta una sola vez:

```sql
create table if not exists public.user_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_states enable row level security;

create policy "Users read their own state"
on public.user_states for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users create their own state"
on public.user_states for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users update their own state"
on public.user_states for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
```

## 3. Primer uso sin perder progreso

En el movil donde ya existe tu perfil, abre Ajustes, crea la cuenta con email y contrasena y confirma el email si Supabase lo solicita. La primera sesion sube ese estado local. Despues, en el ordenador, inicia sesion con la misma cuenta: se descarga el perfil remoto y cada cambio posterior se sincroniza automaticamente.

## Limites deliberados

- La clave read-only de Renshuu no se sincroniza. Debe configurarse en cada dispositivo.
- Durante este MVP, iniciar sesion en una cuenta existente toma su copia remota como referencia. No combina de forma automatica dos historiales independientes que se hayan creado antes de vincularlos.
- Sin conexion, la app conserva el progreso local e intenta enviarlo en el siguiente cambio con sesion iniciada.
