window.NIHONGO_CONTENT = (() => {
  const t = (text, reading, meaning, note = "") => ({ text, reading, meaning, note });
  const e = (id, level, type, prompt, accepted, tags, help, explanation, keywords = [], target = "", audioText = "", matchMode = "all") => ({
    id, level, type, prompt, accepted, tags, help, explanation, keywords, target, audioText, matchMode
  });

  const rawDictionary = [
    t("私", "わたし", "yo"), t("今日", "きょう", "hoy"), t("明日", "あした", "mañana"), t("毎朝", "まいあさ", "cada mañana"),
    t("会社", "かいしゃ", "empresa"), t("会議", "かいぎ", "reunión"), t("資料", "しりょう", "documentación"), t("電話", "でんわ", "teléfono / llamar"),
    t("メール", "メール", "correo electrónico"), t("お客様", "おきゃくさま", "cliente (respetuoso)"), t("上司", "じょうし", "superior / jefe"), t("同僚", "どうりょう", "compañero"),
    t("駅", "えき", "estación"), t("図書館", "としょかん", "biblioteca"), t("家", "いえ", "casa"), t("学校", "がっこう", "escuela"),
    t("勉強", "べんきょう", "estudiar"), t("働く", "はたらく", "trabajar"), t("行く", "いく", "ir"), t("来る", "くる", "venir"),
    t("食べる", "たべる", "comer"), t("飲む", "のむ", "beber"), t("買う", "かう", "comprar"), t("見る", "みる", "ver"),
    t("話す", "はなす", "hablar"), t("聞く", "きく", "escuchar / preguntar"), t("読む", "よむ", "leer"), t("書く", "かく", "escribir"),
    t("できます", "できます", "puedo / es posible"), t("お願いします", "おねがいします", "por favor"), t("すみません", "すみません", "disculpa / perdón"),
    t("大丈夫", "だいじょうぶ", "bien / no hay problema"), t("時間", "じかん", "tiempo / hora"), t("前", "まえ", "antes / delante"),
    t("後", "あと", "después"), t("一緒に", "いっしょに", "juntos"), t("少し", "すこし", "un poco"), t("もう一度", "もういちど", "una vez más"),
    t("分かりません", "わかりません", "no entiendo"), t("予約", "よやく", "reserva / cita"), t("出張", "しゅっちょう", "viaje de trabajo"),
    t("締め切り", "しめきり", "fecha límite"), t("確認", "かくにん", "confirmación / comprobar"), t("は", "は", "tema de la frase", "Se lee wa como partícula."),
    t("が", "が", "sujeto / información nueva"), t("を", "を", "objeto directo"), t("に", "に", "destino, hora o receptor"),
    t("で", "で", "lugar donde ocurre una acción"), t("から", "から", "desde / porque"), t("まで", "まで", "hasta")
    ,
    e("kanji-n5", "N5", "Kanji", "Escribe la lectura de 人.", "ひと", ["kanji", "writing", "vocab"], [t("人", "ひと", "persona")], "Relaciona una forma basica con su lectura y significado.", [], "ひと|人", "", "any"),
    e("kanji-n4", "N4", "Kanji", "Escribe una palabra con 会 que signifique reunion.", "会議", ["kanji", "writing", "vocab"], [t("会議", "かいぎ", "reunion"), t("会", "かい", "reunirse")], "El kanji 会 aparece en palabras de encuentro y reunion.", [], "会議|かいぎ", "", "any"),
    e("kanji-n3", "N3", "Kanji", "Lee el termino 連絡.", "れんらく", ["kanji", "writing", "vocab", "work"], [t("連絡", "れんらく", "contacto"), t("連", "れん", "conectar")], "Reconoce compuestos frecuentes en comunicacion profesional.", [], "れんらく|連絡", "", "any"),
    e("kanji-n2", "N2", "Kanji", "Explica brevemente el significado de 優先事項.", "prioridades", ["kanji", "writing", "vocab", "work"], [t("優先事項", "ゆうせんじこう", "prioridades")], "Aprende el compuesto como una unidad util de trabajo.", ["prioridades"]),
    e("kanji-n1", "N1", "Kanji", "Lee y usa en una frase 改善.", "かいぜん", ["kanji", "writing", "vocab", "work"], [t("改善", "かいぜん", "mejora")], "A nivel N1 importa reconocer y producir vocabulario abstracto de uso real.", [], "かいぜん|改善", "", "any"),
    e("listen-n5", "N5", "Escucha", "Escucha la frase y traduce al espanol.", "Bebo cafe cada manana.", ["listening", "vocab", "reading"], [t("毎朝", "まいあさ", "cada manana"), t("飲みます", "のみます", "bebo")], "Escucha primero; puedes revelar el modelo despues de responder.", ["bebo", "cafe", "manana"], "毎朝コーヒーを飲みます。", "毎朝コーヒーを飲みます。"),
    e("listen-n4", "N4", "Escucha", "Escucha el aviso y resume la idea.", "La reunion empieza a las tres.", ["listening", "vocab", "work"], [t("会議", "かいぎ", "reunion"), t("始まります", "はじまります", "empieza")], "Entrena la escucha de una informacion concreta de trabajo.", ["reunion", "tres", "empieza"], "会議は三時から始まります。", "会議は三時から始まります。"),
    e("listen-n3", "N3", "Escucha", "Escucha el mensaje y explica por que hay retraso.", "El tren se ha retrasado, asi que llegare tarde.", ["listening", "grammar", "vocab"], [t("遅れる", "おくれる", "retrasarse"), t("到着", "とうちゃく", "llegada")], "Busca causa y consecuencia, no una traduccion palabra por palabra.", ["tren", "tarde", "retras"], "電車が遅れたので、到着が遅れます。", "電車が遅れたので、到着が遅れます。"),
    e("listen-n2", "N2", "Escucha", "Escucha la peticion y di que debe hacer el receptor.", "Debe revisar el contrato cuando tenga tiempo.", ["listening", "grammar", "vocab", "work"], [t("契約書", "けいやくしょ", "contrato"), t("確認", "かくにん", "revisar")], "El objetivo es extraer una accion solicitada en registro formal.", ["contrato", "revis"], "お時間のあるときに、契約書をご確認いただけますでしょうか。", "お時間のあるときに、契約書をご確認いただけますでしょうか。"),
    e("listen-n1", "N1", "Escucha", "Escucha el anuncio y resume el compromiso de la empresa.", "La empresa se compromete a mejorar el proceso para evitar que se repita.", ["listening", "grammar", "vocab", "work"], [t("再発防止", "さいはつぼうし", "prevencion de recurrencia"), t("改善", "かいぜん", "mejora")], "Escucha el significado global de una comunicacion corporativa formal.", ["mejor", "repi", "proceso"], "再発防止のため、手順の改善に努めてまいります。", "再発防止のため、手順の改善に努めてまいります。"),
  ];

  const dictionary = rawDictionary.filter((item) => !item.id);

  const exercises = [
    ...rawDictionary.filter((item) => item.id),
    e("n5-01", "N5", "Traduce JP → ES", "私は毎朝コーヒーを飲みます。", "Bebo café cada mañana.", ["vocab", "reading"], [t("毎朝", "まいあさ", "cada mañana"), t("飲みます", "のみます", "bebo")], "La frecuencia suele aparecer antes del verbo. La forma ます es educada.", ["bebo", "cafe", "manana"]),
    e("n5-02", "N5", "Traduce ES → JP", "Hoy estudio japonés en casa.", "今日は家で日本語を勉強します。", ["writing", "grammar", "particles"], [t("今日", "きょう", "hoy"), t("家", "いえ", "casa"), t("勉強します", "べんきょうします", "estudio")], "Usa で para el lugar en el que realizas la acción de estudiar.", [], "今日|家で|日本語|勉強します"),
    e("n5-03", "N5", "Partícula", "Completa: 図書館___日本語を勉強します。", "図書館で日本語を勉強します。", ["particles", "grammar"], [t("図書館", "としょかん", "biblioteca"), t("で", "で", "lugar de acción")], "で marca el escenario de una acción.", [], "で"),
    e("n5-04", "N5", "Respuesta", "¿Cómo dices de manera educada: 'No entiendo'?", "分かりません。", ["writing", "vocab"], [t("分かりません", "わかりません", "no entiendo")], "Una frase muy útil y natural cuando necesitas que repitan algo.", [], "分かりません|わかりません", "", "any"),
    e("n5-05", "N5", "Traduce JP → ES", "これは私のかばんです。", "Esta es mi bolsa.", ["vocab", "reading"], [t("これ", "これ", "esto"), t("かばん", "かばん", "bolsa")], "の une dos nombres: 私のかばん significa 'mi bolsa'.", ["esta", "bolsa"]),
    e("n5-06", "N5", "Traduce ES → JP", "El lunes voy a la biblioteca.", "月曜日に図書館へ行きます。", ["writing", "grammar", "particles"], [t("月曜日", "げつようび", "lunes"), t("図書館", "としょかん", "biblioteca"), t("行きます", "いきます", "voy")], "に puede marcar el momento; へ señala la dirección.", [], "月曜日|図書館|行きます"),
    e("n5-07", "N5", "Categoría", "Escribe tres bebidas en japonés.", "水、お茶、コーヒー", ["vocab", "writing"], [t("水", "みず", "agua"), t("お茶", "おちゃ", "té"), t("コーヒー", "コーヒー", "café")], "Para una categoría, escribe varios elementos separados por 、.", [], "水|お茶|コーヒー"),
    e("n5-08", "N5", "Descripción", "Describe una rutina: 'Me levanto a las siete y desayuno.'", "七時に起きて、朝ご飯を食べます。", ["writing", "grammar", "vocab"], [t("七時", "しちじ", "siete"), t("起きて", "おきて", "levantarse y..."), t("朝ご飯", "あさごはん", "desayuno")], "La forma て une acciones en orden.", [], "時|起き|食べます"),
    e("n5-09", "N5", "Pregunta", "日本語を勉強する理由は何ですか。", "日本で働きたいからです。", ["writing", "grammar", "work"], [t("理由", "りゆう", "motivo"), t("働きたい", "はたらきたい", "quiero trabajar"), t("から", "から", "porque")], "Responde con una razón usando からです.", [], "から"),
    e("n5-10", "N5", "Traduce JP → ES", "駅の前で友達に会います。", "Quedo con un amigo delante de la estación.", ["vocab", "reading", "particles"], [t("駅", "えき", "estación"), t("前", "まえ", "delante"), t("会います", "あいます", "quedo / me encuentro")], "に marca a la persona con quien te encuentras.", ["estacion", "amigo"]),
    e("n5-11", "N5", "Partícula", "Completa: 田中さん___メールを書きます。", "田中さんにメールを書きます。", ["particles", "work", "writing"], [t("メール", "メール", "correo"), t("に", "に", "receptor")], "に marca el destinatario de un correo.", [], "に"),
    e("n5-12", "N5", "Respuesta", "Pide que repitan algo: 'Por favor, otra vez.'", "もう一度お願いします。", ["writing", "vocab"], [t("もう一度", "もういちど", "una vez más"), t("お願いします", "おねがいします", "por favor")], "Es una petición breve, amable y frecuente.", [], "もう一度|お願いします"),
    e("n4-01", "N4", "Traduce ES → JP", "Mañana llamaré al cliente.", "明日、お客様に電話します。", ["writing", "grammar", "work", "particles"], [t("明日", "あした", "mañana"), t("お客様", "おきゃくさま", "cliente"), t("電話します", "でんわします", "llamaré")], "に indica el receptor. お客様 es más respetuoso que お客さん.", [], "明日|電話|ます"),
    e("n4-02", "N4", "Traduce JP → ES", "会議は三時から始まります。", "La reunión empieza a las tres.", ["vocab", "reading", "work"], [t("会議", "かいぎ", "reunión"), t("三時", "さんじ", "tres"), t("始まります", "はじまります", "empieza")], "から marca el punto de inicio en el tiempo.", ["reunion", "tres", "empieza"]),
    e("n4-03", "N4", "Partícula", "Completa: 来週、東京___出張します。", "来週、東京へ出張します。", ["particles", "work", "grammar"], [t("来週", "らいしゅう", "la semana que viene"), t("出張します", "しゅっちょうします", "viajo por trabajo")], "へ o に pueden marcar destino.", [], "へ|に", "", "any"),
    e("n4-04", "N4", "Pregunta", "上司に何を確認しますか。", "締め切りを確認します。", ["writing", "work", "grammar"], [t("上司", "じょうし", "jefe"), t("締め切り", "しめきり", "fecha límite"), t("確認します", "かくにんします", "confirmo")], "Cualquier cosa razonable que confirmarías con tu superior es válida.", [], "確認|ます"),
    e("n4-05", "N4", "Traduce ES → JP", "Después de la reunión enviaré los documentos.", "会議の後で資料を送ります。", ["writing", "work", "grammar", "particles"], [t("会議の後", "かいぎのあと", "después de la reunión"), t("資料", "しりょう", "documentos"), t("送ります", "おくります", "enviar")], "後で sitúa una acción posterior.", [], "会議|後|資料|送ります"),
    e("n4-06", "N4", "Traduce JP → ES", "少し遅れますが、先に始めてください。", "Llegaré un poco tarde, pero por favor empiecen antes.", ["reading", "work", "grammar"], [t("少し", "すこし", "un poco"), t("遅れます", "おくれます", "llego tarde"), t("先に", "さきに", "antes")], "が conecta dos ideas con contraste suave.", ["tarde", "empiecen"]),
    e("n4-07", "N4", "Descripción", "Escribe una frase para decir que puedes tener una reunión por la tarde.", "午後なら会議ができます。", ["writing", "work", "grammar"], [t("午後", "ごご", "por la tarde"), t("なら", "なら", "si es..."), t("できます", "できます", "puedo")], "なら presenta una condición útil al proponer horarios.", [], "できます"),
    e("n4-08", "N4", "Categoría", "Escribe cuatro palabras japonesas de oficina.", "会社、会議、資料、メール", ["vocab", "work", "writing"], [t("会社", "かいしゃ", "empresa"), t("会議", "かいぎ", "reunión"), t("資料", "しりょう", "documentación"), t("メール", "メール", "correo")], "Busca variedad: lugar, personas, documentos y acciones.", [], "会社|会議|資料|メール"),
    e("n4-09", "N4", "Respuesta", "Pide confirmación de una reserva: '¿La reserva está bien?'", "予約は大丈夫ですか。", ["writing", "vocab", "grammar"], [t("予約", "よやく", "reserva"), t("大丈夫", "だいじょうぶ", "bien / sin problema")], "大丈夫ですか es una pregunta amable para comprobar si todo está correcto.", [], "予約|大丈夫"),
    e("n4-10", "N4", "Traduce JP → ES", "この資料を読んでから、質問してください。", "Después de leer este documento, haz preguntas.", ["reading", "work", "grammar"], [t("資料", "しりょう", "documento"), t("読んでから", "よんでから", "después de leer"), t("質問", "しつもん", "pregunta")], "てから expresa que la segunda acción ocurre después de la primera.", ["documento", "preguntas"]),
    e("n4-11", "N4", "Partícula", "Completa: 九時___十時まで仕事をします。", "九時から十時まで仕事をします。", ["particles", "work", "grammar"], [t("から", "から", "desde"), t("まで", "まで", "hasta"), t("仕事", "しごと", "trabajo")], "から…まで marca un intervalo de tiempo.", [], "から|まで"),
    e("n4-12", "N4", "Pregunta", "週末は何をする予定ですか。", "友達と映画を見る予定です。", ["writing", "vocab", "grammar"], [t("週末", "しゅうまつ", "fin de semana"), t("予定", "よてい", "plan"), t("映画", "えいが", "película")], "予定です expresa un plan. Cambia el contenido por tu plan real.", [], "予定"),
    e("n4-13", "N4", "Traduce ES → JP", "¿Podemos hablar cinco minutos?", "五分だけ話せますか。", ["writing", "work", "grammar"], [t("五分", "ごふん", "cinco minutos"), t("だけ", "だけ", "solo"), t("話せますか", "はなせますか", "¿podemos hablar?")], "La forma potencial expresa posibilidad; だけ limita el tiempo.", [], "分|話せますか"),
    e("n4-14", "N4", "Traduce JP → ES", "もし分からなければ、私に聞いてください。", "Si no entiendes, pregúntame.", ["reading", "grammar", "work"], [t("もし", "もし", "si"), t("分からなければ", "わからなければ", "si no entiendes"), t("聞いてください", "きいてください", "pregunta, por favor")], "〜なければ crea una condición.", ["entiendes", "preguntame"]),
    e("n4-15", "N4", "Descripción", "Escribe: 'Estoy en la estación; llegaré en diez minutos.'", "駅にいます。十分後に着きます。", ["writing", "vocab", "grammar"], [t("駅", "えき", "estación"), t("十分後", "じゅっぷんご", "dentro de diez minutos"), t("着きます", "つきます", "llegaré")], "En mensajes reales, claridad vale más que una frase larga.", [], "駅|分|着きます"),
    e("n3-01", "N3", "Traduce ES → JP", "Aunque esté ocupado, responderé al correo hoy.", "忙しくても、今日メールに返事します。", ["writing", "grammar", "work"], [t("忙しくても", "いそがしくても", "aunque esté ocupado"), t("返事", "へんじ", "respuesta")], "ても expresa contraste aunque exista una dificultad.", [], "忙しくても|返事"),
    e("n3-02", "N3", "Partícula", "Completa: 会議の前___資料を確認しておいてください。", "会議の前に資料を確認しておいてください。", ["particles", "grammar", "work"], [t("確認しておく", "かくにんしておく", "comprobar con antelación")], "に fija el momento; ておく expresa preparación previa.", [], "に"),
    e("n3-03", "N3", "Pregunta", "Explica por qué llegaste tarde a una reunión.", "電車が遅れたので、少し遅れました。", ["writing", "grammar", "work"], [t("遅れたので", "おくれたので", "como se retrasó"), t("少し遅れました", "すこしおくれました", "llegué un poco tarde")], "ので da una razón explicativa y suave.", [], "ので|遅れ"),
    e("n3-04", "N3", "Traduce JP → ES", "この件については、後で改めてご連絡します。", "Sobre este asunto, me pondré en contacto de nuevo más tarde.", ["reading", "vocab", "work"], [t("この件", "このけん", "este asunto"), t("改めて", "あらためて", "de nuevo, formalmente")], "改めて se usa al retomar una comunicación formal.", ["asunto", "contacto", "tarde"]),
    e("n3-05", "N3", "Descripción", "Propón terminar una tarea antes del viernes.", "金曜日までにこの作業を終わらせたいです。", ["writing", "grammar", "work"], [t("金曜日までに", "きんようびまでに", "antes del viernes"), t("終わらせる", "おわらせる", "terminar algo")], "までに marca una fecha límite.", [], "までに|終わ"),
    e("n2-01", "N2", "Traduce ES → JP", "Le agradecería que revisara el contrato cuando tenga tiempo.", "お時間のあるときに、契約書をご確認いただけますでしょうか。", ["writing", "grammar", "work"], [t("契約書", "けいやくしょ", "contrato"), t("ご確認いただけますでしょうか", "ごかくにんいただけますでしょうか", "podría revisar, muy formal")], "Una petición profesional muy cortés.", [], "契約書|確認"),
    e("n2-02", "N2", "Traduce JP → ES", "予定が変更になり次第、お知らせいたします。", "Le avisaré en cuanto cambie el plan.", ["reading", "grammar", "work"], [t("変更になり次第", "へんこうになりしだい", "en cuanto haya un cambio")], "次第 indica una acción inmediata en registro formal.", ["cuanto", "cambie", "avisare"]),
    e("n2-03", "N2", "Pregunta", "Rechaza formalmente una propuesta por ahora.", "今回は見送らせていただきます。", ["writing", "grammar", "work"], [t("見送る", "みおくる", "dejar pasar, no aceptar")], "見送らせていただく suaviza un rechazo.", [], "見送"),
    e("n2-04", "N2", "Descripción", "Confirma que has entendido las prioridades del proyecto.", "プロジェクトの優先事項を承知しました。", ["writing", "vocab", "work"], [t("優先事項", "ゆうせんじこう", "prioridades"), t("承知しました", "しょうちしました", "he entendido, formal")], "承知しました confirma comprensión profesional.", [], "優先|承知"),
    e("n2-05", "N2", "Partícula", "Completa: ご依頼___対応いたします。", "ご依頼に対応いたします。", ["particles", "grammar", "work"], [t("ご依頼", "ごいらい", "solicitud"), t("対応する", "たいおうする", "atender")], "に marca el asunto al que se responde.", [], "に"),
    e("n1-01", "N1", "Traduce JP → ES", "本件につきましては、社内で検討した上で改めて回答いたします。", "Respecto a este asunto, lo estudiaremos internamente y responderemos de nuevo.", ["reading", "grammar", "work"], [t("検討した上で", "けんとうしたうえで", "después de estudiarlo"), t("回答いたします", "かいとういたします", "responderemos")], "上で enlaza una decisión posterior a una consideración previa.", ["asunto", "internamente", "responderemos"]),
    e("n1-02", "N1", "Traduce ES → JP", "Nos comprometemos a mejorar el proceso para evitar que vuelva a ocurrir.", "再発防止のため、手順の改善に努めてまいります。", ["writing", "grammar", "work"], [t("再発防止", "さいはつぼうし", "prevención de recurrencia"), t("改善に努める", "かいぜんにつとめる", "esforzarse por mejorar")], "努めてまいります comunica compromiso continuado.", [], "再発防止|改善"),
    e("n1-03", "N1", "Pregunta", "Explica formalmente que debes consultar antes de tomar una decisión.", "判断する前に、関係者に確認する必要があります。", ["writing", "grammar", "work"], [t("関係者", "かんけいしゃ", "personas implicadas"), t("必要があります", "ひつようがあります", "es necesario")], "必要がある expresa obligación de forma objetiva.", [], "前に|確認|必要"),
    e("n1-04", "N1", "Traduce JP → ES", "ご期待に沿えるよう、引き続き品質の向上に取り組んでまいります。", "Seguiremos trabajando para mejorar la calidad y responder a sus expectativas.", ["reading", "vocab", "work"], [t("ご期待に沿える", "ごきたいにそえる", "responder a expectativas"), t("品質の向上", "ひんしつのこうじょう", "mejora de calidad")], "沿う expresa responder a una expectativa.", ["expectativas", "calidad", "seguiremos"]),
    e("n1-05", "N1", "Descripción", "Pide disculpas formalmente por una respuesta tardía.", "ご連絡が遅くなり、誠に申し訳ございません。", ["writing", "grammar", "work"], [t("ご連絡が遅くなり", "ごれんらくがおそくなり", "al retrasarse mi respuesta"), t("誠に申し訳ございません", "まことにもうしわけございません", "lo siento mucho, muy formal")], "Una disculpa formal que asume responsabilidad.", [], "遅く|申し訳"),
    e("shop-n5", "N5", "Traduce ES -> JP", "Quiero comprar esta camisa.", "このシャツを買いたいです。", ["writing", "vocab"], [t("シャツ", "しゃつ", "camisa"), t("買いたい", "かいたい", "quiero comprar")], "たいです expresa un deseo de forma educada.", [], "買い|シャツ"),
    e("shop-n4", "N4", "Pregunta", "Pregunta educadamente si puedes pagar con tarjeta.", "カードで払えますか。", ["writing", "grammar", "vocab"], [t("カード", "かーど", "tarjeta"), t("払う", "はらう", "pagar")], "La forma potencial えます pregunta por una posibilidad.", [], "カード|払"),
    e("shop-n3", "N3", "Traduce JP -> ES", "サイズが合わなければ、交換していただけますか。", "Si la talla no me queda bien, ¿podría cambiarla?", ["reading", "grammar", "vocab"], [t("サイズ", "さいず", "talla"), t("交換", "こうかん", "cambio")], "なければ plantea una condicion; ていただけますか suaviza la peticion.", ["talla", "cambi"]),
    e("shop-n2", "N2", "Descripcion", "Pide que te avisen cuando el producto vuelva a estar disponible.", "商品が再入荷されたら、ご連絡いただけると幸いです。", ["writing", "grammar", "vocab"], [t("再入荷", "さいにゅうか", "reponer existencias"), t("幸い", "さいわい", "me alegraria")], "いただけると幸いです formula una peticion cortes sin imponer.", [], "再入荷|連絡"),
    e("shop-n1", "N1", "Respuesta", "Explica formalmente que deseas devolver un articulo defectuoso.", "不良品のため、返品の手続きをお願いできますでしょうか。", ["writing", "grammar", "vocab"], [t("不良品", "ふりょうひん", "producto defectuoso"), t("返品", "へんぴん", "devolucion")], "お願いできますでしょうか mantiene una peticion formal y clara.", [], "不良品|返品"),
    e("city-n5", "N5", "Pregunta", "Pregunta donde esta la estacion.", "駅はどこですか。", ["writing", "vocab"], [t("駅", "えき", "estacion"), t("どこ", "どこ", "donde")], "Una pregunta directa y util para orientarte.", [], "駅|どこ"),
    e("city-n4", "N4", "Traduce ES -> JP", "Toma este tren hasta Shinjuku.", "この電車で新宿まで行きます。", ["writing", "particles", "vocab"], [t("電車", "でんしゃ", "tren"), t("まで", "まで", "hasta")], "で marca el medio de transporte y まで el destino final.", [], "電車|新宿|まで"),
    e("city-n3", "N3", "Descripcion", "Explica que llegaras tarde porque el tren se ha parado.", "電車が止まっているので、到着が遅れそうです。", ["writing", "grammar", "vocab"], [t("到着", "とうちゃく", "llegada"), t("遅れそう", "おくれそう", "parece que llegare tarde")], "そうです comunica una prevision basada en la situacion.", [], "電車|遅"),
    e("city-n2", "N2", "Traduce JP -> ES", "迷っているようでしたら、お近くの駅員にお声がけください。", "Si parece que esta perdido, dirijase al personal de la estacion mas cercano.", ["reading", "grammar", "vocab"], [t("迷う", "まよう", "perderse"), t("駅員", "えきいん", "personal de estacion")], "ているようでしたら combina apariencia y condicion con cortesia.", ["perdido", "personal", "estacion"]),
    e("city-n1", "N1", "Respuesta", "Solicita formalmente indicaciones para llegar a la oficina municipal.", "市役所までの道順をご教示いただけますでしょうか。", ["writing", "grammar", "vocab"], [t("市役所", "しやくしょ", "ayuntamiento"), t("道順", "みちじゅん", "indicaciones")], "ご教示いただけますでしょうか es una solicitud respetuosa y precisa.", [], "市役所|道順"),
    e("social-n5", "N5", "Traduce ES -> JP", "El sabado quedo con un amigo.", "土曜日に友達と会います。", ["writing", "vocab", "particles"], [t("友達", "ともだち", "amigo"), t("会う", "あう", "quedar con alguien")], "と marca la persona con quien haces una actividad.", [], "友達|会"),
    e("social-n4", "N4", "Respuesta", "Invita a un amigo a ver una pelicula este fin de semana.", "今週末、一緒に映画を見に行きませんか。", ["writing", "grammar", "vocab"], [t("一緒に", "いっしょに", "juntos"), t("行きませんか", "いきませんか", "te apetece ir?")], "ませんか es una invitacion amable.", [], "映画|行"),
    e("social-n3", "N3", "Descripcion", "Dile a un amigo que no podras ir porque tienes otro compromiso.", "用事が入ってしまったので、今日は行けなくなりました。", ["writing", "grammar", "vocab"], [t("用事", "ようじ", "compromiso"), t("行けなくなる", "いけなくなる", "dejar de poder ir")], "てしまった expresa que algo surgio de forma no planeada.", [], "用事|行"),
    e("social-n2", "N2", "Pregunta", "Acepta una invitacion con entusiasmo pero de manera educada.", "ぜひ参加させていただきたいと思います。", ["writing", "grammar", "vocab"], [t("参加", "さんか", "participar"), t("ぜひ", "ぜひ", "sin falta")], "させていただく expresa aceptacion respetuosa.", [], "参加|ぜひ"),
    e("social-n1", "N1", "Traduce JP -> ES", "お招きいただいたにもかかわらず、当日は都合がつかず失礼いたしました。", "A pesar de su invitacion, ese dia no me fue posible asistir; le pido disculpas.", ["reading", "grammar", "vocab"], [t("にもかかわらず", "にもかかわらず", "a pesar de"), t("都合", "つごう", "conveniencia, disponibilidad")], "にもかかわらず introduce una concesion en registro formal.", ["a pesar", "invitacion", "disculpas"]),
  ];

  const themeByExercise = {
    "n5-01": "comida", "n5-02": "hogar-y-estudio", "n5-03": "hogar-y-estudio", "n5-04": "comunicacion", "n5-05": "compras", "n5-06": "ciudad-y-transporte", "n5-07": "comida", "n5-08": "vida-diaria", "n5-09": "trabajo", "n5-10": "amistades-y-ocio", "n5-11": "trabajo", "n5-12": "comunicacion",
    "n4-01": "trabajo", "n4-02": "trabajo", "n4-03": "ciudad-y-transporte", "n4-04": "trabajo", "n4-05": "trabajo", "n4-06": "trabajo", "n4-07": "trabajo", "n4-08": "trabajo", "n4-09": "compras", "n4-10": "trabajo", "n4-11": "trabajo", "n4-12": "amistades-y-ocio", "n4-13": "trabajo", "n4-14": "trabajo", "n4-15": "ciudad-y-transporte",
    "n3-01": "trabajo", "n3-02": "trabajo", "n3-03": "ciudad-y-transporte", "n3-04": "trabajo", "n3-05": "trabajo", "n2-01": "trabajo", "n2-02": "trabajo", "n2-03": "trabajo", "n2-04": "trabajo", "n2-05": "trabajo", "n1-01": "trabajo", "n1-02": "trabajo", "n1-03": "trabajo", "n1-04": "trabajo", "n1-05": "trabajo",
    "shop-n5": "compras", "shop-n4": "compras", "shop-n3": "compras", "shop-n2": "compras", "shop-n1": "compras", "city-n5": "ciudad-y-transporte", "city-n4": "ciudad-y-transporte", "city-n3": "ciudad-y-transporte", "city-n2": "ciudad-y-transporte", "city-n1": "ciudad-y-transporte", "social-n5": "amistades-y-ocio", "social-n4": "amistades-y-ocio", "social-n3": "amistades-y-ocio", "social-n2": "amistades-y-ocio", "social-n1": "amistades-y-ocio",
    "kanji-n5": "hogar-y-estudio", "kanji-n4": "hogar-y-estudio", "kanji-n3": "trabajo", "kanji-n2": "trabajo", "kanji-n1": "trabajo", "listen-n5": "vida-diaria", "listen-n4": "trabajo", "listen-n3": "ciudad-y-transporte", "listen-n2": "trabajo", "listen-n1": "trabajo"
  };
  const thematicExerciseIds = new Set(["shop-n5", "shop-n4", "shop-n3", "shop-n2", "shop-n1", "city-n5", "city-n4", "city-n3", "city-n2", "city-n1", "social-n5", "social-n4", "social-n3", "social-n2", "social-n1", "kanji-n5", "kanji-n4", "kanji-n3", "kanji-n2", "kanji-n1", "listen-n5", "listen-n4", "listen-n3", "listen-n2", "listen-n1"]);
  const enrichedExercises = exercises.map((exercise) => {
    const theme = themeByExercise[exercise.id] || "vida-diaria";
    return { ...exercise, theme, core: !thematicExerciseIds.has(exercise.id), help: exercise.help.map((term) => ({ ...term, theme, level: exercise.level })) };
  });
  const catalogTerms = [...new Map([...dictionary, ...enrichedExercises.flatMap((exercise) => exercise.help)].map((term) => [term.text, term])).values()];
  const catalog = catalogTerms.map((term) => {
    const uses = enrichedExercises.flatMap((exercise) => exercise.help.filter((item) => item.text === term.text));
    return {
      ...term,
      themes: [...new Set(uses.map((item) => item.theme))].length ? [...new Set(uses.map((item) => item.theme))] : ["vida-diaria"],
      jlptLevels: [...new Set(uses.map((item) => item.level))].length ? [...new Set(uses.map((item) => item.level))] : ["N5"]
    };
  });

  const contentErrors = [];
  const seenExerciseIds = new Set();
  const seenExerciseSignatures = new Set();
  exercises.forEach((exercise) => {
    if (seenExerciseIds.has(exercise.id)) contentErrors.push(`ID de ejercicio duplicado: ${exercise.id}`);
    seenExerciseIds.add(exercise.id);
    const signature = [exercise.level, exercise.type, exercise.prompt, exercise.target].join("|").toLowerCase();
    if (seenExerciseSignatures.has(signature)) contentErrors.push(`Ejercicio duplicado: ${exercise.id}`);
    seenExerciseSignatures.add(signature);
  });
  if (contentErrors.length) throw new Error(`Biblioteca de contenido invalida: ${contentErrors.join("; ")}`);

  return { dictionary: catalog, exercises: enrichedExercises };
})();
