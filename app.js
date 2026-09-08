/* ==========================================================
   C172S Checklist Trainer
   Boşluk doldurma formatı — çoktan seçmeli yok.
   ========================================================== */
(function () {
  'use strict';

  /* ---------------- sabitler ---------------- */
  var DEADLINE = new Date(2026, 8, 10, 14, 30, 0, 0); // 10 Eylül 2026 14:30
  var PKEY = 'c172s_progress_v1';
  var EKEY = 'c172s_exam_v1';
  var MODEKEY = 'c172s_mode_v1';
  var CHUNK = 8;               // uzun checklistler bu boyda bölümlere ayrılır
  var EXAM_MINUTES = 20;
  var EXAM_MIX = { emergency: 3, normal: 3, speed: 8 };
  var WEAK_LIMIT = 0.34; // wrong/seen bu oranın üstündeyse zayıf

  /* ---------------- depolama ---------------- */
  function loadJSON(k, fb) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }
    catch (e) { return fb; }
  }
  function saveJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function delKey(k) { try { localStorage.removeItem(k); } catch (e) {} }

  var progress = loadJSON(PKEY, {});
  var studyMode = loadJSON(MODEKEY, 'order'); // 'order' | 'action' | 'write'

  function stat(uid) {
    var s = progress[uid];
    return { seen: (s && s.seen) || 0, wrong: (s && s.wrong) || 0 };
  }
  function record(uid, ok) {
    var s = stat(uid);
    s.seen += 1;
    if (!ok) s.wrong += 1;
    progress[uid] = s;
    saveJSON(PKEY, progress);
  }
  function weakness(uid) {
    var s = stat(uid);
    if (s.seen === 0) return 0.55;          // hiç çalışılmamış: orta-yüksek öncelik
    return s.wrong / s.seen;
  }
  // "Zayıf" = gerçekten hata yapılmış madde (hiç çalışılmamış olan zayıf sayılmaz)
  function isWeak(uid) {
    var s = stat(uid);
    return s.seen > 0 && (s.wrong / s.seen) >= WEAK_LIMIT;
  }
  // Seçim ağırlığı: zayıf 2 kat, hiç çalışılmamış hafif öncelikli, öğrenilmiş normal
  function weightOf(uid) {
    if (isWeak(uid)) return 2;
    return stat(uid).seen === 0 ? 1.4 : 1;
  }

  /* ---------------- veri ---------------- */
  function slug(s) {
    return s.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 52);
  }

  var ITEMS = [];
  EMERGENCY.forEach(function (e) {
    ITEMS.push({
      uid: 'em:' + e.id, cat: 'emergency',
      title: e.title,
      tag: CATEGORY_LABELS[e.category] || e.category,
      steps: e.steps.map(function (s) { return { t: s.t, m: !!s.m }; })
    });
  });
  NORMAL.forEach(function (n) {
    ITEMS.push({
      uid: 'nm:' + n.id, cat: 'normal',
      title: n.title, tag: 'Normal Prosedür',
      steps: n.items.map(function (t) { return { t: t, m: false }; })
    });
  });
  SPEEDS.forEach(function (s) {
    ITEMS.push({
      uid: 'sp:' + slug(s.q), cat: 'speed',
      title: s.q, tag: 'Hız & Limit', value: s.a
    });
  });

  var BY_UID = {};
  ITEMS.forEach(function (it) { BY_UID[it.uid] = it; });
  function pool(cat) { return ITEMS.filter(function (i) { return i.cat === cat; }); }

  var CAT_NAME = { emergency: 'Emergency', normal: 'Normal', speed: 'Hız & Limit' };

  /* ---------------- yardımcılar ---------------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------------- görünüm yönetimi ---------------- */
  var VIEWS = ['home', 'study', 'deck', 'exam'];
  var current = 'home';

  function showView(name) {
    VIEWS.forEach(function (v) {
      var el = $('view-' + v);
      if (el) el.hidden = (v !== name);
    });
    current = name;
    var navKey = (name === 'deck') ? 'study' : name;
    Array.prototype.forEach.call(document.querySelectorAll('.sk'), function (b) {
      b.classList.toggle('active', b.dataset.goto === navKey);
    });
    window.scrollTo(0, 0);
  }

  function go(name) {
    if (name === 'home') renderHome();
    if (name === 'study') renderStudy();
    if (name === 'exam') { if (!examState) resetExamView(); }
    showView(name);
  }

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-goto]');
    if (b) go(b.dataset.goto);
  });

  /* ---------------- saat & geri sayım ---------------- */
  function tickClock() {
    var now = new Date();
    var z = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    $('hdrClock').textContent =
      pad(now.getHours()) + ':' + pad(now.getMinutes()) + ' · ' +
      pad(z.getHours()) + ':' + pad(z.getMinutes()) + 'Z';

    var diff = DEADLINE - now;
    if (diff <= 0) {
      ['cdD', 'cdH', 'cdM', 'cdS'].forEach(function (id) {
        $(id).textContent = '00';
        $(id).classList.add('cd-over');
      });
      var d = document.querySelector('.cd-date');
      if (d) d.textContent = 'Sınav zamanı geldi — bol şans!';
      return;
    }
    var s = Math.floor(diff / 1000);
    $('cdD').textContent = pad(Math.floor(s / 86400));
    $('cdH').textContent = pad(Math.floor(s % 86400 / 3600));
    $('cdM').textContent = pad(Math.floor(s % 3600 / 60));
    $('cdS').textContent = pad(s % 60);
  }

  /* ---------------- ANA SAYFA ---------------- */
  function renderHome() {
    var row = $('statRow');
    row.innerHTML = '';
    ['emergency', 'normal', 'speed'].forEach(function (cat) {
      var p = pool(cat);
      var done = p.filter(function (i) { return stat(i.uid).seen > 0; }).length;
      var weak = p.filter(function (i) { return isWeak(i.uid); }).length;
      var pct = p.length ? Math.round(done / p.length * 100) : 0;
      var d = document.createElement('div');
      d.className = 'tile';
      d.innerHTML =
        '<div class="tile-t">' + esc(CAT_NAME[cat]) + '</div>' +
        '<div class="tile-v">' + done + '<small>/' + p.length + '</small></div>' +
        '<div class="tile-b"><span style="width:' + pct + '%"></span></div>' +
        '<div class="tile-w' + (weak ? '' : ' ok') + '">' +
          (weak ? weak + ' zayıf madde' : 'zayıf yok') + '</div>';
      row.appendChild(d);
    });
  }

  $('btnReset').addEventListener('click', function () {
    if (!confirm('Tüm ilerleme (doğru/yanlış sayaçları) silinsin mi?')) return;
    progress = {};
    saveJSON(PKEY, progress);
    delKey(EKEY);
    renderHome();
    alert('İlerleme sıfırlandı.');
  });

  /* ---------------- CEVAP ANAHTARI ---------------- */
  function keyHTML(item) {
    if (item.cat === 'speed') {
      return '<div class="key"><div class="key-h">Cevap Anahtarı · POH</div>' +
        '<div class="key-single">' + esc(item.value) + '</div></div>';
    }
    var lis = item.steps.map(function (s) {
      return '<li class="' + (s.m ? 'mem' : '') + '">' + esc(s.t) + '</li>';
    }).join('');
    var memCount = item.steps.filter(function (s) { return s.m; }).length;
    return '<div class="key">' +
      '<div class="key-h">Cevap Anahtarı · POH' +
      (memCount ? ' · ' + memCount + ' memory item' : '') + '</div>' +
      '<ol class="steps">' + lis + '</ol></div>';
  }

  function promptHTML(item, hint) {
    if (hint === undefined) {
      if (item.cat === 'emergency') hint = 'Prosedürün tüm adımlarını sırasıyla yaz. Memory item’ları atlama.';
      else if (item.cat === 'normal') hint = 'Checklist maddelerini sırasıyla yaz.';
      else hint = 'Değeri yaz — sadece sayı da yeter (örn. 105).';
    }
    return '<div class="drill-q">' + esc(item.title) + '</div>' +
           (hint ? '<p class="drill-hint">' + hint + '</p>' : '');
  }

  // "Throttle Control - IDLE (pull full out)" → {label, action}; ayraç yoksa null
  function splitStep(t) {
    var i = t.indexOf(' - ');
    if (i === -1) return null;
    return { label: t.slice(0, i), action: t.slice(i + 3) };
  }

  /* ---------- 1) YAZMA ---------- */
  function buildWriteDrill(item, onMark) {
    var wrap = document.createElement('div');
    var isSpeed = item.cat === 'speed';
    var numeric = isSpeed && /^[0-9]/.test(item.value);
    wrap.innerHTML =
      promptHTML(item) +
      (isSpeed
        ? '<input class="ans" type="text" inputmode="' + (numeric ? 'decimal' : 'text') + '" ' +
          'autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" ' +
          'placeholder="Cevabını yaz…">'
        : '<textarea class="ans" spellcheck="false" autocapitalize="none" placeholder="Hatırladığın adımları buraya yaz…"></textarea>') +
      '<button class="btn btn-primary btn-block js-reveal">CEVABI GÖR</button>' +
      '<div class="js-key"></div>';

    var revealBtn = wrap.querySelector('.js-reveal');
    var keyHost = wrap.querySelector('.js-key');

    revealBtn.addEventListener('click', function () {
      revealBtn.remove();
      keyHost.innerHTML = keyHTML(item) +
        '<div class="mark-row">' +
          '<button class="btn btn-ok js-ok">DOĞRUYDU</button>' +
          '<button class="btn btn-danger js-bad">HATA VARDI</button>' +
        '</div>' +
        '<div class="selfnote">Kendin karar ver — kelime kelime aynı olmak zorunda değil, anlam ve sıra önemli.</div>';
      keyHost.querySelector('.js-ok').addEventListener('click', function () {
        record(item.uid, true); if (onMark) onMark(true);
      });
      keyHost.querySelector('.js-bad').addEventListener('click', function () {
        record(item.uid, false); if (onMark) onMark(false);
      });
      keyHost.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    return wrap;
  }

  /* ---------- 2) YERLEŞTİRME (sırala / aksiyon) ---------- */
  function buildPlaceDrill(item, kind, onMark) {
    var el = document.createElement('div');

    var rows = item.steps.map(function (s, i) {
      var sp = splitStep(s.t);
      return { i: i, text: s.t, mem: s.m, label: sp && sp.label, action: sp && sp.action };
    });

    // uzun checklistleri bölümlere ayır — telefonda 32 kutucuk taşınmaz
    var chunks = [], cur = [], n = 0;
    rows.forEach(function (r) {
      var counts = (kind === 'order') || !!r.action;
      if (kind === 'action' && !r.action && !cur.length) { cur.push(r); return; }
      cur.push(r);
      if (counts) { n++; if (n === CHUNK) { chunks.push(cur); cur = []; n = 0; } }
    });
    if (cur.length) {
      var hasSlot = cur.some(function (r) { return kind === 'order' || r.action; });
      if (!hasSlot && chunks.length) chunks[chunks.length - 1] = chunks[chunks.length - 1].concat(cur);
      else chunks.push(cur);
    }

    var ci = 0, totalSlots = 0, totalWrong = 0;
    paint();
    return el;

    function paint() {
      var chunk = chunks[ci];
      var slots = chunk.filter(function (r) { return kind === 'order' || r.action; });
      var placed = slots.map(function () { return null; });
      var bank = shuffle(slots.map(function (r, j) {
        return { text: kind === 'order' ? r.text : r.action, mem: r.mem, id: j + '_' + Math.random() };
      }));
      var checked = false;

      var hint = kind === 'order'
        ? 'Kutucuklara dokunup adımları doğru sıraya diz. Yerleştirdiğine tekrar dokunursan geri alırsın.'
        : 'Her satırın aksiyonunu havuzdan seçip yerine koy.';
      el.innerHTML =
        promptHTML(item, hint) +
        (chunks.length > 1
          ? '<div class="chunkhead">BÖLÜM ' + (ci + 1) + '/' + chunks.length +
            ' · ' + (chunk[0].i + 1) + '–' + (chunk[chunk.length - 1].i + 1) + '. adımlar</div>'
          : '') +
        '<div class="slotlist js-slots"></div>' +
        '<div class="bank-h">HAVUZ</div><div class="bank js-bank"></div>' +
        '<button class="btn btn-primary btn-block js-check" disabled>KONTROL ET</button>' +
        '<div class="js-after"></div>';

      var slotHost = el.querySelector('.js-slots');
      var bankHost = el.querySelector('.js-bank');
      var checkBtn = el.querySelector('.js-check');
      var after = el.querySelector('.js-after');

      draw();

      function draw() {
        // satırlar
        slotHost.innerHTML = '';
        var si = -1;
        chunk.forEach(function (r) {
          var isSlot = (kind === 'order') || !!r.action;
          if (!isSlot) {
            slotHost.insertAdjacentHTML('beforeend',
              '<div class="ctxrow"><span class="slot-num">' + pad(r.i + 1) + '</span>' +
              '<span>' + esc(r.text) + '</span></div>');
            return;
          }
          si++;
          var j = si;
          var p = placed[j];
          var cls = 'slot' + (p ? ' filled' : '');
          if (checked && p) {
            var expect = kind === 'order' ? r.text : r.action;
            cls += (p.text === expect) ? ' ok' : ' bad';
          }
          var inner = kind === 'action'
            ? '<span class="slot-label">' + esc(r.label) + '</span>' +
              '<span class="slot-val">' + (p ? esc(p.text) : '—') + '</span>'
            : '<span class="slot-val">' + (p ? esc(p.text) : '—') + '</span>';
          var wrongNote = '';
          if (checked && p && p.text !== (kind === 'order' ? r.text : r.action)) {
            wrongNote = '<div class="slot-fix">' + esc(kind === 'order' ? r.text : r.action) + '</div>';
          }
          var div = document.createElement('div');
          div.className = cls;
          div.innerHTML = '<span class="slot-num">' + pad(r.i + 1) + '</span>' +
            '<span class="slot-body">' + inner + wrongNote + '</span>';
          if (!checked) {
            div.addEventListener('click', function () {
              if (!placed[j]) return;
              bank.push(placed[j]);
              placed[j] = null;
              draw();
            });
          }
          slotHost.appendChild(div);
        });

        // havuz
        bankHost.innerHTML = '';
        if (checked) {
          bankHost.parentNode.querySelector('.bank-h').style.display = 'none';
        }
        bank.forEach(function (b, k) {
          var chip = document.createElement('button');
          chip.className = 'bankchip' + (b.mem && kind === 'order' ? ' memchip' : '');
          chip.textContent = b.text;
          chip.addEventListener('click', function () {
            var free = placed.indexOf(null);
            if (free === -1) return;
            placed[free] = b;
            bank.splice(k, 1);
            draw();
          });
          bankHost.appendChild(chip);
        });

        checkBtn.disabled = placed.indexOf(null) !== -1;
      }

      checkBtn.addEventListener('click', function () {
        checked = true;
        var wrong = 0;
        var si2 = -1;
        chunk.forEach(function (r) {
          if (!((kind === 'order') || r.action)) return;
          si2++;
          var expect = kind === 'order' ? r.text : r.action;
          if (!placed[si2] || placed[si2].text !== expect) wrong++;
        });
        totalSlots += slots.length;
        totalWrong += wrong;
        checkBtn.remove();
        draw();

        var last = (ci === chunks.length - 1);
        after.innerHTML =
          '<div class="chunkres ' + (wrong ? 'bad' : 'ok') + '">' +
            (wrong ? wrong + ' yanlış yerleştirme' : 'bölüm tam doğru') +
            ' · ' + (slots.length - wrong) + '/' + slots.length +
          '</div>' +
          (last
            ? keyHTML(item) +
              '<div class="chunkres ' + (totalWrong ? 'bad' : 'ok') + '">TOPLAM ' +
                (totalSlots - totalWrong) + '/' + totalSlots + '</div>' +
              '<div class="mark-row"><button class="btn btn-primary js-done" style="grid-column:1/-1">' +
                (totalWrong ? 'YANLIŞ OLARAK KAYDET' : 'DOĞRU OLARAK KAYDET') + '</button></div>'
            : '<button class="btn btn-primary btn-block js-next">SONRAKİ BÖLÜM ›</button>');

        if (last) {
          after.querySelector('.js-done').addEventListener('click', function () {
            var ok = totalWrong === 0;
            record(item.uid, ok);
            if (onMark) onMark(ok);
          });
        } else {
          after.querySelector('.js-next').addEventListener('click', function () {
            ci++; paint(); el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
        after.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }

  /* ---------- mod seçici + dağıtıcı ---------- */
  function buildDrill(item, onMark) {
    var wrap = document.createElement('div');
    if (item.cat === 'speed') { wrap.appendChild(buildWriteDrill(item, onMark)); return wrap; }

    var sel = document.createElement('div');
    sel.className = 'mode-seg';
    sel.innerHTML = [['order', 'SIRALA'], ['action', 'AKSİYON'], ['write', 'YAZ']]
      .map(function (m) { return '<button data-m="' + m[0] + '">' + m[1] + '</button>'; }).join('');
    var host = document.createElement('div');

    function paint() {
      Array.prototype.forEach.call(sel.children, function (b) {
        b.classList.toggle('active', b.dataset.m === studyMode);
      });
      host.innerHTML = '';
      host.appendChild(studyMode === 'write'
        ? buildWriteDrill(item, onMark)
        : buildPlaceDrill(item, studyMode, onMark));
    }
    Array.prototype.forEach.call(sel.children, function (b) {
      b.addEventListener('click', function () {
        studyMode = b.dataset.m;
        saveJSON(MODEKEY, studyMode);
        paint();
      });
    });

    wrap.appendChild(sel);
    wrap.appendChild(host);
    paint();
    return wrap;
  }

  /* ---------------- ÇALIŞMA MODU ---------------- */
  var studyCat = 'emergency';

  Array.prototype.forEach.call(document.querySelectorAll('#studyTabs .seg'), function (b) {
    b.addEventListener('click', function () {
      studyCat = b.dataset.cat;
      renderStudy();
    });
  });

  function sortedPool(cat) {
    return pool(cat).slice().sort(function (a, b) {
      var d = weakness(b.uid) - weakness(a.uid);
      if (Math.abs(d) > 0.0001) return d;
      var sa = stat(a.uid), sb = stat(b.uid);
      if (sa.seen !== sb.seen) return sa.seen - sb.seen;
      return a.title.localeCompare(b.title);
    });
  }

  function statChips(item) {
    var s = stat(item.uid);
    var html = '<span class="chip cat">' + esc(item.tag) + '</span>';
    if (item.cat !== 'speed') {
      var mem = item.steps.filter(function (x) { return x.m; }).length;
      html += '<span class="chip">' + item.steps.length + ' adım' +
              (mem ? ' · ' + mem + ' M' : '') + '</span>';
    }
    if (s.seen === 0) {
      html += '<span class="chip new">HİÇ ÇALIŞILMADI</span>';
    } else {
      var ok = s.seen - s.wrong;
      html += '<span class="chip ok">' + ok + ' ✓</span>';
      html += '<span class="chip ' + (s.wrong ? 'bad' : '') + '">' + s.wrong + ' ✗</span>';
      if (isWeak(item.uid)) html += '<span class="chip warnc">ZAYIF</span>';
    }
    return html;
  }

  function renderStudy() {
    Array.prototype.forEach.call(document.querySelectorAll('#studyTabs .seg'), function (b) {
      b.classList.toggle('active', b.dataset.cat === studyCat);
    });

    var head = $('studyHead');
    var notes = {
      emergency: 'POH Bölüm 3 acil durum prosedürleri. Maddeyi aç, SIRALA / AKSİYON / YAZ modundan birini seç.',
      normal: 'POH Bölüm 4 normal prosedürler. Maddeyi aç, SIRALA / AKSİYON / YAZ modundan birini seç.',
      speed: 'Hız, ağırlık ve motor limitleri. Zayıf olanlar üstte ve karışık destede 2 kat sık çıkar.'
    };
    head.innerHTML = '<div class="head-note"><p>' + notes[studyCat] + '</p>' +
      (studyCat === 'speed'
        ? '<button class="btn btn-primary btn-sm" id="deckStart">KARIŞIK DESTE</button>'
        : '') + '</div>';
    if (studyCat === 'speed') $('deckStart').addEventListener('click', startDeck);

    var list = $('studyList');
    list.innerHTML = '';
    sortedPool(studyCat).forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'card' + (isWeak(item.uid) ? ' weak' : '');
      card.innerHTML =
        '<div class="card-head">' +
          '<div class="card-main">' +
            '<div class="card-title eng">' + esc(item.title) + '</div>' +
            '<div class="card-meta">' + statChips(item) + '</div>' +
          '</div>' +
          '<div class="card-caret">›</div>' +
        '</div>' +
        '<div class="card-body" hidden></div>';

      var head2 = card.querySelector('.card-head');
      var body = card.querySelector('.card-body');

      head2.addEventListener('click', function () {
        if (card.classList.contains('open')) {
          card.classList.remove('open'); body.hidden = true; body.innerHTML = '';
          return;
        }
        Array.prototype.forEach.call(list.querySelectorAll('.card.open'), function (c) {
          c.classList.remove('open');
          var b = c.querySelector('.card-body');
          b.hidden = true; b.innerHTML = '';
        });
        card.classList.add('open');
        body.hidden = false;
        body.innerHTML = '';
        body.appendChild(buildDrill(item, function () {
          card.querySelector('.card-meta').innerHTML = statChips(item);
          card.classList.toggle('weak', isWeak(item.uid));
          setTimeout(function () {
            card.classList.remove('open');
            body.hidden = true; body.innerHTML = '';
            head2.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 260);
        }));
      });

      list.appendChild(card);
    });
  }

  /* ---------------- KARIŞIK DESTE ---------------- */
  var deck = null;

  function startDeck() {
    var cards = [];
    pool('speed').forEach(function (it) {
      cards.push(it);
      if (isWeak(it.uid)) cards.push(it); // zayıf olan destede 2 kat
    });
    deck = { cards: shuffle(cards), i: 0, ok: 0, bad: 0 };
    showView('deck');
    renderDeck();
  }

  function renderDeck() {
    var host = $('deckHost');
    host.innerHTML = '';
    $('deckScore').textContent = deck.ok + ' ✓ / ' + deck.bad + ' ✗';

    if (deck.i >= deck.cards.length) {
      $('deckPos').textContent = deck.cards.length + '/' + deck.cards.length;
      $('deckBar').style.width = '100%';
      var total = deck.ok + deck.bad;
      host.innerHTML =
        '<div class="panel deck-done">' +
          '<h3>DESTE BİTTİ</h3>' +
          '<div class="score-big">' + deck.ok + '<small>/' + total + '</small></div>' +
          '<div class="score-sub">doğru işaretlenen</div>' +
          '<button class="btn btn-primary btn-block" id="deckAgain">YENİ DESTE</button>' +
          '<button class="btn btn-ghost btn-block" data-goto="study">LİSTEYE DÖN</button>' +
        '</div>';
      $('deckAgain').addEventListener('click', startDeck);
      return;
    }

    var item = deck.cards[deck.i];
    $('deckPos').textContent = (deck.i + 1) + '/' + deck.cards.length;
    $('deckBar').style.width = (deck.i / deck.cards.length * 100) + '%';

    var panel = document.createElement('div');
    panel.className = 'panel';
    panel.appendChild(buildDrill(item, function (ok) {
      if (ok) deck.ok++; else deck.bad++;
      deck.i++;
      renderDeck();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }));
    host.appendChild(panel);
  }

  $('deckExit').addEventListener('click', function () { go('study'); });

  /* ---------------- SINAV MODU ---------------- */
  var examState = null;
  var examTimer = null;
  var examMarks = null;

  function pickWeighted(list, n) {
    var arr = list.slice(), out = [];
    while (out.length < n && arr.length) {
      var w = arr.map(function (it) { return weightOf(it.uid); });
      var tot = w.reduce(function (a, b) { return a + b; }, 0);
      var r = Math.random() * tot, i = 0;
      while (i < w.length - 1 && r >= w[i]) { r -= w[i]; i++; }
      out.push(arr.splice(i, 1)[0]);
    }
    return out;
  }

  function resetExamView() {
    $('examIntro').hidden = false;
    $('examRun').hidden = true;
    $('examResult').hidden = true;
    $('examResult').innerHTML = '';
  }

  $('examStart').addEventListener('click', function () {
    var qs = [];
    Object.keys(EXAM_MIX).forEach(function (cat) {
      pickWeighted(pool(cat), EXAM_MIX[cat]).forEach(function (it) { qs.push(it.uid); });
    });
    shuffle(qs);
    examState = {
      qs: qs, answers: {}, idx: 0,
      endsAt: Date.now() + EXAM_MINUTES * 60000
    };
    saveJSON(EKEY, examState);
    enterExamRun();
  });

  function enterExamRun() {
    $('examIntro').hidden = true;
    $('examResult').hidden = true;
    $('examResult').innerHTML = '';
    $('examRun').hidden = false;
    showView('exam');
    renderExamQ();
    startExamTimer();
  }

  function startExamTimer() {
    stopExamTimer();
    examTimer = setInterval(function () {
      var left = Math.max(0, examState.endsAt - Date.now());
      var s = Math.floor(left / 1000);
      var t = $('examTimer');
      t.textContent = pad(Math.floor(s / 60)) + ':' + pad(s % 60);
      t.className = 'exam-timer' + (s <= 60 ? ' crit' : (s <= 300 ? ' warn' : ''));
      if (left <= 0) { stopExamTimer(); finishExam(true); }
    }, 250);
  }
  function stopExamTimer() { if (examTimer) { clearInterval(examTimer); examTimer = null; } }

  function renderExamQ() {
    var uid = examState.qs[examState.idx];
    var item = BY_UID[uid];
    $('examPos').textContent = (examState.idx + 1) + ' / ' + examState.qs.length;
    $('examBar').style.width = ((examState.idx + 1) / examState.qs.length * 100) + '%';

    var host = $('examHost');
    host.innerHTML = '';
    var panel = document.createElement('div');
    panel.className = 'panel';
    var isSpeed = item.cat === 'speed';
    panel.innerHTML =
      '<div class="panel-label"><i></i>' + esc(CAT_NAME[item.cat]) + ' · SORU ' + (examState.idx + 1) + '</div>' +
      promptHTML(item) +
      (isSpeed
        ? '<input class="ans" type="text" inputmode="' + (/^[0-9]/.test(item.value) ? 'decimal' : 'text') + '" ' +
          'autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" placeholder="Cevabını yaz…">'
        : '<textarea class="ans" spellcheck="false" autocapitalize="none" placeholder="Hatırladığın adımları buraya yaz…"></textarea>');
    host.appendChild(panel);

    var field = panel.querySelector('.ans');
    field.value = examState.answers[uid] || '';
    field.addEventListener('input', function () {
      examState.answers[uid] = field.value;
      saveJSON(EKEY, examState);
      renderExamDots();
    });

    $('examPrev').disabled = examState.idx === 0;
    $('examNext').textContent = (examState.idx === examState.qs.length - 1) ? 'SON SORU' : 'SONRAKİ ›';
    $('examNext').disabled = examState.idx === examState.qs.length - 1;
    renderExamDots();
  }

  function renderExamDots() {
    var row = $('examDots');
    row.innerHTML = '';
    examState.qs.forEach(function (uid, i) {
      var b = document.createElement('button');
      b.className = 'dot' +
        ((examState.answers[uid] || '').trim() ? ' filled' : '') +
        (i === examState.idx ? ' cur' : '');
      b.textContent = i + 1;
      b.addEventListener('click', function () { examState.idx = i; renderExamQ(); window.scrollTo(0, 0); });
      row.appendChild(b);
    });
  }

  $('examPrev').addEventListener('click', function () {
    if (examState.idx > 0) { examState.idx--; renderExamQ(); window.scrollTo(0, 0); }
  });
  $('examNext').addEventListener('click', function () {
    if (examState.idx < examState.qs.length - 1) { examState.idx++; renderExamQ(); window.scrollTo(0, 0); }
  });
  $('examFinish').addEventListener('click', function () {
    if (confirm('Sınavı bitirip cevap anahtarını görmek istiyor musun?')) finishExam(false);
  });

  function finishExam(timeout) {
    stopExamTimer();
    examMarks = {};
    $('examRun').hidden = true;
    $('examResult').hidden = false;
    renderExamResult(timeout);
    showView('exam');
  }

  function renderExamResult(timeout) {
    var host = $('examResult');
    var total = examState.qs.length;
    var marked = Object.keys(examMarks).length;
    var okCount = examState.qs.filter(function (u) { return examMarks[u] === true; }).length;

    var cats = { emergency: [0, 0], normal: [0, 0], speed: [0, 0] };
    examState.qs.forEach(function (u) {
      var c = BY_UID[u].cat;
      cats[c][1]++;
      if (examMarks[u] === true) cats[c][0]++;
    });

    var html = '';
    if (timeout) html += '<div class="warnline">Süre doldu — sınav otomatik olarak kapandı.</div>';
    html +=
      '<div class="panel score-panel">' +
        '<div class="panel-label" style="justify-content:center"><i></i>SONUÇ</div>' +
        '<div class="score-big">' + okCount + '<small>/' + total + '</small></div>' +
        '<div class="score-sub">' + (marked < total
            ? (total - marked) + ' soru henüz işaretlenmedi'
            : 'tüm sorular işaretlendi') + '</div>' +
        '<div class="score-cats">' +
          ['emergency', 'normal', 'speed'].map(function (c) {
            return '<div class="score-cat"><span>' + esc(CAT_NAME[c]) + '</span><b>' +
              cats[c][0] + '/' + cats[c][1] + '</b></div>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="panel-label sec"><i></i>CEVAPLARIN &amp; ANAHTAR</div>' +
      '<div class="list" id="resList"></div>' +
      '<div id="saveZone"></div>';
    host.innerHTML = html;

    var list = $('resList');
    examState.qs.forEach(function (uid, i) {
      var item = BY_UID[uid];
      var mine = (examState.answers[uid] || '').trim();
      var card = document.createElement('div');
      card.className = 'panel res-card' +
        (examMarks[uid] === true ? ' marked-ok' : (examMarks[uid] === false ? ' marked-bad' : ''));
      card.innerHTML =
        '<div class="panel-label"><i></i>SORU ' + (i + 1) + ' · ' + esc(CAT_NAME[item.cat]) + '</div>' +
        '<div class="drill-q">' + esc(item.title) + '</div>' +
        '<div class="res-lbl">Senin cevabın</div>' +
        '<div class="res-yours' + (mine ? '' : ' empty') + '">' + (mine ? esc(mine) : 'boş bırakıldı') + '</div>' +
        keyHTML(item) +
        '<div class="mark-row">' +
          '<button class="btn btn-ok js-ok' + (examMarks[uid] === true ? ' sel-ok' : '') + '">DOĞRU</button>' +
          '<button class="btn btn-danger js-bad' + (examMarks[uid] === false ? ' sel-bad' : '') + '">YANLIŞ</button>' +
        '</div>';
      card.querySelector('.js-ok').addEventListener('click', function () { mark(uid, true); });
      card.querySelector('.js-bad').addEventListener('click', function () { mark(uid, false); });
      list.appendChild(card);
    });

    var zone = $('saveZone');
    zone.innerHTML =
      (marked < total ? '<div class="warnline">İşaretlenmeyen sorular kaydederken <b>yanlış</b> sayılır.</div>' : '') +
      '<button class="btn btn-primary btn-block" id="examSave">SONUÇLARI KAYDET VE BİTİR</button>' +
      '<button class="btn btn-ghost btn-block" id="examAgain">YENİ SINAV</button>';
    $('examSave').addEventListener('click', saveExam);
    $('examAgain').addEventListener('click', function () {
      if (!confirm('Bu sınavın sonuçları kaydedilmeden yeni sınav başlar. Devam?')) return;
      delKey(EKEY); examState = null; examMarks = null;
      resetExamView(); showView('exam');
    });

    function mark(uid, ok) {
      examMarks[uid] = ok;
      var y = window.scrollY;
      renderExamResult(timeout);
      window.scrollTo(0, y);
    }
  }

  function saveExam() {
    examState.qs.forEach(function (uid) {
      record(uid, examMarks[uid] === true);
    });
    delKey(EKEY);
    examState = null; examMarks = null;
    resetExamView();
    renderHome();
    showView('home');
    alert('Sonuçlar kaydedildi. Yanlışların çalışma listelerinde üste taşındı.');
  }

  /* ---------------- açılış ---------------- */
  function boot() {
    renderHome();
    tickClock();
    setInterval(tickClock, 1000);
    resetExamView();

    // yarım kalmış sınav var mı?
    var saved = loadJSON(EKEY, null);
    if (saved && saved.qs && saved.qs.length) {
      var valid = saved.qs.every(function (u) { return BY_UID[u]; });
      if (!valid) { delKey(EKEY); }
      else if (saved.endsAt > Date.now()) {
        examState = saved;
        if (confirm('Yarım kalmış bir sınav var. Kaldığın yerden devam edilsin mi?')) {
          enterExamRun();
          return;
        }
        delKey(EKEY); examState = null;
      } else {
        examState = saved;
        finishExam(true);
        return;
      }
    }
    showView('home');
  }

  boot();

  /* ---------------- service worker ---------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
