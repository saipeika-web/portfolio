const siteTitle = 'Точка Портфолио (ИП Сайпеева)';
const main = document.querySelector('#main');
const speech = document.querySelector('#speech');
const dialogue = document.querySelector('.dialogue-frame');
const avatar = dialogue.querySelector('.dialogue-avatar');
const dialogueActions = document.querySelector('#dialogue-actions');
const lightbox = document.querySelector('#lightbox');
const asset = (name) => 'assets/' + name + '.webp';
const telegramLink = '<a class="button primary" href="https://t.me/saipei" target="_blank" rel="noopener noreferrer">Написать Айсылу <span aria-hidden="true">↗</span></a>';
const shelfLink = '<a class="button secondary" href="#shelf"><span aria-hidden="true">←</span> На витрину</a>';
const finishLink = '<a class="button primary" href="#contact">Завершить экскурсию <span aria-hidden="true">→</span></a>';
const storageKey = 'tochka-portfolio-viewed-v1';
const visited = readVisited();
let firstRender = true;

function readVisited() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return new Set(projects.filter(({ id }) => saved.includes(id)).map(({ id }) => id));
  } catch {
    return new Set();
  }
}

function recordVisit(id) {
  if (visited.has(id)) return;
  visited.add(id);
  try {
    localStorage.setItem(storageKey, JSON.stringify([...visited]));
  } catch {
    // Navigation remains available when the browser blocks storage.
  }
}

function setDialogue(line, pose, actions = '') {
  speech.textContent = line;
  avatar.className = 'dialogue-avatar pose-' + pose;
  dialogueActions.innerHTML = actions;
  dialogueActions.hidden = !actions;
  dialogue.hidden = false;
}

function sprite(pose, description) {
  return `<div class="scene-character sprite pose-${pose}" role="img" aria-label="${description}"></div>`;
}

function facade(isFinal = false) {
  return `
    <figure class="scene-art facade${isFinal ? ' facade-farewell' : ''}">
      <picture>
        <source media="(max-width: 620px)" srcset="assets/facade-small.webp">
        <img src="assets/facade.webp" alt="Фиолетовый магазинчик с полосатой маркизой и подсвеченными витринами" fetchpriority="high">
      </picture>
      <div class="facade-name"><strong>Точка Портфолио</strong><span>(ИП Сайпеева)</span></div>
      <div class="facade-board">Магазинчик<br>с креативными<br>проектами</div>
      <div class="facade-open">Открыто</div>
      ${isFinal ? sprite('farewell', 'Айсылу машет на прощание у входа в магазинчик') : ''}
    </figure>`;
}

function interior(pose, description) {
  return `<figure class="scene-art interior"><img src="assets/interior.webp" alt="">${sprite(pose, description)}</figure>`;
}

function showHome() {
  setDialogue(
    'Привет, команда Точка Банка! Меня зовут Айсылу, а это магазинчик с моими проектами. Можно их посмотреть, потрогать, расспросить у меня подробности.',
    'welcome',
    '<a class="button primary" href="#welcome">Зайти в магазинчик <span aria-hidden="true">↗</span></a>'
  );
  return `<section class="scene-page" aria-labelledby="heading"><h1 id="heading" class="visually-hidden" tabindex="-1">${siteTitle}</h1>${facade()}</section>`;
}

function showWelcome() {
  setDialogue(
    'Добро пожаловать! Меня зовут Айсылу, а это мое портфолио в виде магазинчика. Здесь можно поближе познакомиться со мной или сразу перейти к витрине и посмотреть проекты. С чего начнём?',
    'welcome',
    '<a class="button secondary" href="#about">Об ИП</a><a class="button primary" href="#shelf">Витрина с проектами <span aria-hidden="true">↗</span></a>'
  );
  return `<section class="scene-page" aria-labelledby="heading"><h1 id="heading" class="visually-hidden" tabindex="-1">Приветственный экран</h1>${interior('welcome', 'Айсылу встречает посетителей внутри магазинчика')}</section>`;
}

function showShelf() {
  setDialogue('На витрине шесть проектов. Выбирайте, какой хочется рассмотреть поближе.', 'present', visited.size === projects.length ? finishLink : '');
  return `
    <section class="shelf-page" aria-labelledby="heading">
      <h1 id="heading" tabindex="-1">Витрина с проектами</h1>
      <ul class="shelf-grid" aria-label="Шесть проектов">
        ${projects.map((project) => `
          <li>
            <a class="shelf-card" href="#case/${project.id}">
              <div class="shelf-art cover-${project.id}" aria-hidden="true"></div>
              <div class="shelf-caption">
                <div><p>${project.category}</p><h2>${project.title}</h2></div>
                <span class="shelf-arrow" aria-hidden="true">↗</span>
              </div>
            </a>
          </li>`).join('')}
      </ul>
    </section>`;
}

function showAbout() {
  setDialogue(
    'Здесь короткая информация обо мне, но если хочется узнать чуть подробнее, можно напрямую написать мне сообщение в ТГ.',
    'profile',
    '<a class="button secondary" href="#shelf">Посмотреть витрину</a>' + telegramLink
  );
  return `
    <section class="about" aria-labelledby="heading">
      ${interior('profile', 'Айсылу с блокнотом')}
      <div class="profile">
        <p class="eyebrow">Об ИП</p>
        <h1 id="heading" tabindex="-1">Айсылу Сайпеева</h1>
        <p class="intro">Креатор / креативный продюсер</p>
        <div class="profile-details">
          <section>
            <h2>Опыт работы</h2>
            <dl>
              <div><dt>Золотые тигры</dt><dd><ul class="roles"><li>Креатор <span>04.2026 — н. в.</span></li></ul></dd></div>
              <div><dt>Фриланс</dt><dd><ul class="roles"><li>Креатор / креативный продюсер <span>02.2025 — н. в.</span></li></ul></dd></div>
              <div><dt>Самокат</dt><dd>
                <ul class="roles">
                  <li>Куратор креативных продюсеров <span>10.2024 — 01.2025</span></li>
                  <li>Старший креативный продюсер <span>07.2022 — 09.2024</span></li>
                  <li>Младший креативный продюсер <span>12.2021 — 06.2022</span></li>
                </ul>
              </dd></div>
            </dl>
          </section>
          <section>
            <h2>Дополнительное образование</h2>
            <dl>
              <div><dt>2026 — SOBA</dt><dd>«Суперстратег»</dd></div>
              <div><dt>2025 — MADS</dt><dd>«Концептуальное мышление» (победа в конкурсе выпускных работ)</dd></div>
              <div><dt>2023 — MADS</dt><dd>Weekend креативности</dd></div>
              <div><dt>2018 — ИКРА</dt><dd>Интенсив по сторителлингу</dd></div>
            </dl>
          </section>
        </div>
        <a class="text-link profile-handle" href="https://t.me/saipei" target="_blank" rel="noopener noreferrer">@saipei</a>
      </div>
    </section>`;
}

function showContact() {
  setDialogue(
    'Вот и закончилась экскурсия по магазину, а если хотите чтобы на витрине появился еще один, уже совместный проект, напишите мне сообщение.\n\nА пока прощаюсь с вами! До встречи!',
    'farewell',
    telegramLink
  );
  return `<section class="scene-page" aria-labelledby="heading"><h1 id="heading" class="visually-hidden" tabindex="-1">Финальный экран</h1>${facade(true)}</section>`;
}

function showGameNavigation(project) {
  if (project.category !== 'Геймификация') return '';
  const games = projects.filter((item) => item.category === project.category);
  const index = games.indexOf(project);
  const other = games[1 - index];
  const arrow = index === 0 ? '→' : '←';
  return `
    <nav class="game-nav" aria-label="Кейсы по геймификации">
      <span>${index + 1} из ${games.length}</span>
      <a class="text-link" href="#case/${other.id}"><span aria-hidden="true">${arrow}</span> ${other.title}</a>
    </nav>`;
}

function showCase(project) {
  setDialogue(project.line, project.pose, shelfLink + (visited.size === projects.length ? finishLink : ''));
  return `
    <article class="case-page" aria-labelledby="heading">
      <header class="case-heading">
        <p class="eyebrow">${project.category}</p>
        <h1 id="heading" tabindex="-1">${project.heading || project.title}</h1>
        ${project.description ? `<p class="case-description">${project.description}</p>` : ''}
        ${showGameNavigation(project)}
      </header>
      <div class="case-layout">
        <section class="gallery" aria-label="Материалы проекта">
          <figure>
            <button class="media-stage" type="button" aria-label="Увеличить изображение">
              <img src="${asset(project.photos[0][0])}" alt="${project.photos[0][1]}">
              <span class="enlarge" aria-hidden="true">↗</span>
            </button>
            <figcaption class="media-caption" aria-live="polite">${project.photos[0][1]}</figcaption>
          </figure>
          ${project.photos.length > 1 ? `
            <div class="thumbs" aria-label="Выбор изображения">
              ${project.photos.map(([name, label], i) => `
                <button type="button" aria-label="${label}" aria-pressed="${i === 0}" data-photo="${i}">
                  <img src="${asset(name)}" alt="" loading="lazy">
                </button>`).join('')}
            </div>` : ''}
        </section>
        <div class="case-details">
          ${project.lines ? project.lines.map(([label, line]) => `<section><h2>${label}</h2><p>${line}</p></section>`).join('') : ''}
          <section>
            <h2>Цель</h2>
            ${Array.isArray(project.goals) ? `<ul class="case-goals">${project.goals.map((goal) => `<li>${goal}</li>`).join('')}</ul>` : `<p>${project.goals}</p>`}
          </section>
          <section>
            <h2>${project.ideaTitle || 'Механика'}</h2>
            ${project.idea.map((paragraph) => `<p>${paragraph}</p>`).join('')}
            ${project.videos ? '<button class="text-link video-jump" type="button">Смотреть видео <span aria-hidden="true">↓</span></button>' : ''}
          </section>
          <section><h2>Моя роль</h2><p>${project.role}</p></section>
          ${project.results ? `
            <section class="result">
              <h2>Результаты</h2>
              <ul class="metrics">
                ${project.results.map(([value, label]) => `<li><strong>${value}</strong><span>${label}</span></li>`).join('')}
              </ul>
            </section>` : ''}
        </div>
      </div>
      ${project.videos ? showVideos(project.videos) : ''}
    </article>`;
}

function showVideos(videos) {
  return `
    <section id="case-videos" class="case-videos" aria-labelledby="video-heading">
      <h2 id="video-heading" tabindex="-1">Видео проекта</h2>
      <ul class="video-list">
        ${videos.map(({ file, label, poster }) => `
          <li><figure>
            <video controls playsinline preload="none" aria-label="${label}" poster="assets/video/${poster}.webp" src="assets/video/${file}.mp4"></video>
            <figcaption>${label}</figcaption>
          </figure></li>`).join('')}
      </ul>
    </section>`;
}

function wireGallery(project) {
  const gallery = main.querySelector('.gallery');
  const stage = gallery.querySelector('.media-stage');
  const stageImage = stage.querySelector('img');
  const caption = gallery.querySelector('.media-caption');
  const thumbs = [...gallery.querySelectorAll('[data-photo]')];
  let selected = 0;

  function select(index) {
    const [name, label] = project.photos[index];
    selected = index;
    stageImage.src = asset(name);
    stageImage.alt = label;
    caption.textContent = label;
    thumbs.forEach((thumb, i) => thumb.setAttribute('aria-pressed', i === selected));
  }

  thumbs.forEach((thumb) => thumb.addEventListener('click', () => select(Number(thumb.dataset.photo))));
  gallery.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || thumbs.length < 2) return;
    event.preventDefault();
    const next = (selected + (event.key === 'ArrowRight' ? 1 : -1) + thumbs.length) % thumbs.length;
    select(next);
    if (event.target.matches('[data-photo]')) thumbs[next].focus();
  });

  stage.addEventListener('click', () => {
    const [name, label] = project.photos[selected];
    const image = lightbox.querySelector('img');
    image.src = asset(name);
    image.alt = label;
    lightbox.querySelector('p').textContent = label;
    lightbox.showModal();
  });

  const videoJump = main.querySelector('.video-jump');
  if (videoJump) {
    videoJump.addEventListener('click', () => {
      const heading = main.querySelector('#video-heading');
      heading.focus({ preventScroll: true });
      heading.scrollIntoView();
    });
    const players = [...main.querySelectorAll('video')];
    players.forEach((player) => player.addEventListener('play', () => {
      players.filter((other) => other !== player).forEach((other) => other.pause());
    }));
  }
}

const pages = { home: showHome, welcome: showWelcome, shelf: showShelf, about: showAbout, contact: showContact };

function render() {
  const hash = location.hash.slice(1);
  if (hash === 'main') return;
  if (lightbox.open) lightbox.close();
  const project = hash.startsWith('case/') ? projects.find((item) => item.id === hash.slice(5)) : undefined;
  let page = project || hash === 'route' ? 'shelf' : Object.hasOwn(pages, hash) ? hash : 'home';
  if (page === 'contact' && visited.size !== projects.length) {
    page = 'shelf';
    history.replaceState(null, '', '#shelf');
  }
  if (project) recordVisit(project.id);

  main.innerHTML = project ? showCase(project) : pages[page]();
  main.className = 'main view-' + (project ? 'case' : page);
  if (project) wireGallery(project);
  document.querySelectorAll('[data-page]').forEach((link) => {
    if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const heading = main.querySelector('h1');
  document.title = page === 'home' ? siteTitle : heading.textContent + ' · ИП Сайпеева';
  if (!firstRender) {
    heading.focus({ preventScroll: true });
    main.scrollTop = 0;
  }
  firstRender = false;
}

document.querySelector('.skip').addEventListener('click', (event) => {
  event.preventDefault();
  main.focus();
  main.scrollIntoView();
});
lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
window.addEventListener('hashchange', render);
render();
