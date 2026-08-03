# Datos y privacidad del MVP

Nihongo Benkyo es actualmente una aplicacion estatica. Los perfiles, respuestas, historial, ajustes y clave read-only de Renshuu se almacenan en el navegador que uses, mediante almacenamiento local.

## Que sale del dispositivo

Solo se consulta el perfil read-only de Renshuu cuando pulsas **Actualizar** y has configurado una clave. Cuando la sincronizacion Supabase esta configurada y has iniciado sesion, se almacena una copia de progreso, planes y ajustes asociada a tu cuenta. La clave read-only de Renshuu se excluye siempre de esa copia.

## Copias y borrado

En Ajustes puedes exportar el perfil activo a un archivo JSON privado e importarlo en otro navegador. Eliminar un perfil borra sus datos locales de ese navegador y no afecta al perfil de Renshuu.

## Limites actuales

La sincronizacion requiere que el proyecto Supabase se configure siguiendo `docs/SUPABASE_SETUP.md`. No se sincroniza la clave read-only de Renshuu ni existe aun evaluacion semantica remota. Para una version comercial se necesitara consentimiento explicito, gestion de secretos en servidor, politicas de conservacion y una opcion de borrado de cuenta.
