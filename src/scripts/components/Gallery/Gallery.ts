/**
 * Gallery — switches the active main-image slide when a thumbnail is
 * clicked, and implements a simple cursor-following zoom on the main image
 * (transform-origin follows the pointer, scale toggled via a CSS class).
 */

function bindThumbnails(gallery: HTMLElement): void {
  const slides = Array.from(gallery.querySelectorAll<HTMLElement>('[data-nova-gallery-slide]'));
  const thumbs = Array.from(gallery.querySelectorAll<HTMLElement>('[data-nova-gallery-thumb]'));

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const index = Number(thumb.dataset['novaGalleryThumb']);

      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      thumbs.forEach((otherThumb) => otherThumb.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });
  });
}

function bindZoom(gallery: HTMLElement): void {
  gallery.querySelectorAll<HTMLImageElement>('[data-nova-zoom]').forEach((image) => {
    image.addEventListener('mousemove', (event) => {
      const rect = image.getBoundingClientRect();
      const originX = ((event.clientX - rect.left) / rect.width) * 100;
      const originY = ((event.clientY - rect.top) / rect.height) * 100;
      image.style.transformOrigin = `${originX}% ${originY}%`;
    });

    image.addEventListener('click', () => image.classList.toggle('is-zoomed'));
    image.addEventListener('mouseleave', () => image.classList.remove('is-zoomed'));
  });
}

export function initGallery(): void {
  const gallery = document.querySelector<HTMLElement>('[data-nova-gallery]');

  if (!gallery) {
    return;
  }

  bindThumbnails(gallery);
  bindZoom(gallery);
}
