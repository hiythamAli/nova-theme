/**
 * Hero — drives the slide/dot/arrow state for [data-nova-hero]. Autoplay
 * is skipped entirely under prefers-reduced-motion rather than just sped
 * up, since motion-sensitive users shouldn't get an unrequested moving
 * carousel. Autoplay on/off and speed come from theme.settings via the
 * data-autoplay/data-autoplay-speed attributes set in nova-hero-banner.twig.
 */

const DEFAULT_AUTOPLAY_INTERVAL_MS = 6000;

interface SlideNavigator {
  goToSlide: (index: number) => void;
  getCurrentIndex: () => number;
}

function createSlideNavigator(slides: HTMLElement[], dots: HTMLElement[]): SlideNavigator {
  let currentIndex = 0;

  function goToSlide(index: number): void {
    const nextIndex = (index + slides.length) % slides.length;
    slides[currentIndex]?.classList.remove('is-active');
    dots[currentIndex]?.classList.remove('is-active');
    slides[nextIndex]?.classList.add('is-active');
    dots[nextIndex]?.classList.add('is-active');
    currentIndex = nextIndex;
  }

  return { goToSlide, getCurrentIndex: () => currentIndex };
}

function createAutoplay(
  navigator: SlideNavigator,
  intervalMs: number,
): { start: () => void; stop: () => void } {
  let timer: number | undefined;

  function start(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }
    timer = window.setInterval(() => {
      navigator.goToSlide(navigator.getCurrentIndex() + 1);
    }, intervalMs);
  }

  return { start, stop: () => window.clearInterval(timer) };
}

function bindControls(hero: HTMLElement, navigator: SlideNavigator, dots: HTMLElement[]): void {
  const prevButton = hero.querySelector<HTMLButtonElement>('.nova-hero__arrow--prev');
  const nextButton = hero.querySelector<HTMLButtonElement>('.nova-hero__arrow--next');

  prevButton?.addEventListener('click', () => navigator.goToSlide(navigator.getCurrentIndex() - 1));
  nextButton?.addEventListener('click', () => navigator.goToSlide(navigator.getCurrentIndex() + 1));
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => navigator.goToSlide(index));
  });
}

function initHero(hero: HTMLElement): void {
  const slides = Array.from(hero.querySelectorAll<HTMLElement>('.nova-hero__slide'));
  const dots = Array.from(hero.querySelectorAll<HTMLElement>('.nova-hero__dot'));

  if (slides.length <= 1) {
    return;
  }

  const navigator = createSlideNavigator(slides, dots);
  const isAutoplayEnabled = hero.dataset['autoplay'] !== 'false';
  const autoplaySpeed = Number(hero.dataset['autoplaySpeed']) || DEFAULT_AUTOPLAY_INTERVAL_MS;
  const autoplay = createAutoplay(navigator, autoplaySpeed);

  bindControls(hero, navigator, dots);

  if (isAutoplayEnabled) {
    hero.addEventListener('mouseenter', autoplay.stop);
    hero.addEventListener('mouseleave', autoplay.start);
    autoplay.start();
  }
}

export function initHeroes(): void {
  document.querySelectorAll<HTMLElement>('[data-nova-hero]').forEach(initHero);
}
