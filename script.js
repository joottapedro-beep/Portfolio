const galleries = {
  acores: {
    title: "Açores",
    sub: "2025 · Landscapes",
    coverAlt: "Landscape from the Azores",
    photos: [
      "fotos-web/personal/acores/IMG_2211.jpg",
      "fotos-web/personal/acores/IMG_1109.jpg",
      "fotos-web/personal/acores/IMG_1252.jpg",
      "fotos-web/personal/acores/IMG_1748.jpg"
    ]
  },
  caramulo: {
    title: "Caramulo",
    sub: "2025 · Cars",
    coverAlt: "Car photography at Caramulo",
    photos: [
      "fotos-web/work/caramulo/IMG_4634%20(1).jpg",
      "fotos-web/work/caramulo/IMG_4650.jpg",
      "fotos-web/work/caramulo/IMG_4803.jpg",
      "fotos-web/work/caramulo/IMG_4806.jpg",
      "fotos-web/work/caramulo/IMG_4828.jpg",
      "fotos-web/work/caramulo/IMG_4840.jpg",
      "fotos-web/work/caramulo/IMG_4853.jpg",
      "fotos-web/work/caramulo/IMG_4860.jpg",
      "fotos-web/work/caramulo/IMG_4869%20(1).jpg"
    ]
  },
  anadia: {
    title: "Anadia",
    sub: "2025 · Sports",
    coverAlt: "Sports photography from Anadia",
    photos: [
      "fotos-web/work/anadia/IMG_3171.jpg"
    ]
  },
  malta: {
    title: "Malta",
    sub: "2025 · Travel",
    coverAlt: "Travel portrait in Malta",
    photos: [
      "fotos-web/personal/malta/IMG_5990.jpg",
      "fotos-web/personal/malta/IMG_5927.jpg"
    ]
  },
  suecia: {
    title: "Sweden",
    sub: "2026 · Travel",
    coverAlt: "Travel photography in Sweden",
    photos: [
      "fotos-web/personal/sweden/IMG_8248.jpg",
      "fotos-web/personal/sweden/ft2.jpg"
    ]
  },
  noruega: {
    title: "Norway",
    sub: "2026 · Travel",
    coverAlt: "Travel photography in Norway",
    photos: [
      "fotos-web/personal/norway/IMG_8775.jpg",
      "fotos-web/personal/norway/IMG_0115.jpg",
      "fotos-web/personal/norway/ft3.jpg"
    ]
  }
};

let currentGallery = null;
let currentIndex = 0;
let galleryRenderToken = 0;
let lastGalleryTouchEnd = 0;

const overlayState = {
  gallery: false,
  cv: false
};

const galleryOverlay = document.getElementById("galleryOverlay");
const cvOverlay = document.getElementById("cvOverlay");
const galleryImage = document.getElementById("galImg");
const galleryTitle = document.getElementById("galTitle");
const gallerySubtitle = document.getElementById("galSub");
const galleryCounter = document.getElementById("galCounter");
const galleryThumbs = document.getElementById("galThumbs");
const galleryStage = document.querySelector(".gal-stage");
const viewportMeta = document.getElementById("viewportMeta");
const defaultViewportContent = viewportMeta ? viewportMeta.getAttribute("content") : "";

function syncBodyScroll() {
  const anyOverlayOpen = Object.values(overlayState).some(Boolean);
  document.body.classList.toggle("overlay-open", anyOverlayOpen);
}

function setOverlayState(name, isOpen) {
  overlayState[name] = isOpen;
  syncBodyScroll();
}

function lockGalleryViewport(isLocked) {
  if (!viewportMeta) {
    return;
  }

  viewportMeta.setAttribute(
    "content",
    isLocked
      ? "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      : defaultViewportContent
  );
}

function preventGalleryDoubleTapZoom(event) {
  if (!overlayState.gallery) {
    return;
  }

  const now = Date.now();

  if (now - lastGalleryTouchEnd < 450) {
    event.preventDefault();
  }

  lastGalleryTouchEnd = now;
}

function setupRevealObserver() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupPhotoFilters() {
  const filterButtons = document.querySelectorAll("[data-photo-filter]");
  const photoCards = document.querySelectorAll("[data-photo-group]");
  const photoCurtain = document.querySelector("[data-photo-curtain]");

  function loadCardImage(card) {
    const image = card.querySelector("img[data-src]");

    if (!image) {
      return;
    }

    image.src = image.dataset.src;
    image.removeAttribute("data-src");
  }

  function showGroup(group) {
    if (photoCurtain) {
      photoCurtain.hidden = false;
      requestAnimationFrame(() => {
        photoCurtain.classList.add("open");
      });
    }

    filterButtons.forEach((button) => {
      const isActive = button.dataset.photoFilter === group;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    photoCards.forEach((card) => {
      const shouldShow = card.dataset.photoGroup === group;
      card.hidden = !shouldShow;

      if (shouldShow) {
        loadCardImage(card);
      }
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showGroup(button.dataset.photoFilter);
    });
  });
}

function toggleProject(targetId) {
  const panels = document.querySelectorAll(".proj-panel");
  const buttons = document.querySelectorAll("[data-project-target]");
  const targetPanel = document.getElementById(targetId);
  const targetButton = document.querySelector(`[data-project-target="${targetId}"]`);
  const shouldOpen = targetPanel && targetPanel.hidden;

  panels.forEach((panel) => {
    panel.hidden = true;
    panel.classList.remove("open");
  });

  buttons.forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });

  if (shouldOpen && targetPanel && targetButton) {
    targetPanel.hidden = false;
    targetPanel.classList.add("open");
    targetButton.setAttribute("aria-expanded", "true");
  }
}

function thumbFromPhoto(src) {
  return src.replace("fotos-web/", "fotos-thumb/").replace(/\.(jpeg|jpg|png)$/i, ".jpg");
}

function preloadPhoto(src) {
  const image = new Image();
  image.src = src;
}

function preloadNearbyPhotos() {
  if (!currentGallery || currentGallery.photos.length < 2) {
    return;
  }

  const previousIndex =
    (currentIndex - 1 + currentGallery.photos.length) % currentGallery.photos.length;
  const nextIndex = (currentIndex + 1) % currentGallery.photos.length;

  preloadPhoto(currentGallery.photos[previousIndex]);
  preloadPhoto(currentGallery.photos[nextIndex]);
}

function renderGallery() {
  if (!currentGallery) {
    return;
  }

  const activeImageSrc = currentGallery.photos[currentIndex];
  const renderToken = galleryRenderToken + 1;
  galleryRenderToken = renderToken;

  galleryTitle.textContent = currentGallery.title;
  gallerySubtitle.textContent = currentGallery.sub;
  galleryImage.alt = `${currentGallery.coverAlt} (${currentIndex + 1}/${currentGallery.photos.length})`;
  galleryCounter.textContent = `${currentIndex + 1} / ${currentGallery.photos.length}`;
  galleryStage.classList.add("loading");
  galleryImage.style.opacity = "0";

  const nextImage = new Image();
  nextImage.onload = () => {
    if (renderToken !== galleryRenderToken) {
      return;
    }

    galleryImage.src = activeImageSrc;
    galleryImage.style.opacity = "1";
    galleryStage.classList.remove("loading");
    preloadNearbyPhotos();
  };
  nextImage.onerror = () => {
    if (renderToken === galleryRenderToken) {
      galleryStage.classList.remove("loading");
    }
  };
  nextImage.src = activeImageSrc;

  galleryThumbs.innerHTML = "";

  currentGallery.photos.forEach((src, index) => {
    const thumbButton = document.createElement("button");
    thumbButton.type = "button";
    thumbButton.className = `g-thumb${index === currentIndex ? " active" : ""}`;
    thumbButton.setAttribute(
      "aria-label",
      `Open photo ${index + 1} from ${currentGallery.title}`
    );

    const thumbImage = document.createElement("img");
    thumbImage.src = thumbFromPhoto(src);
    thumbImage.alt = "";
    thumbImage.loading = "eager";
    thumbImage.decoding = "async";

    thumbButton.appendChild(thumbImage);
    thumbButton.addEventListener("click", (event) => {
      event.preventDefault();
      currentIndex = index;
      renderGallery();
    });
    thumbButton.addEventListener(
      "touchend",
      (event) => {
        event.preventDefault();
        currentIndex = index;
        renderGallery();
      },
      { passive: false }
    );

    galleryThumbs.appendChild(thumbButton);
  });
}

function openGallery(key) {
  if (!galleries[key]) {
    return;
  }

  currentGallery = galleries[key];
  currentIndex = 0;
  renderGallery();
  galleryOverlay.classList.add("open");
  galleryOverlay.setAttribute("aria-hidden", "false");
  lastGalleryTouchEnd = 0;
  lockGalleryViewport(true);
  setOverlayState("gallery", true);
}

function closeGallery() {
  galleryOverlay.classList.remove("open");
  galleryOverlay.setAttribute("aria-hidden", "true");
  lockGalleryViewport(false);
  setOverlayState("gallery", false);
}

function changePhoto(step) {
  if (!currentGallery) {
    return;
  }

  currentIndex =
    (currentIndex + step + currentGallery.photos.length) %
    currentGallery.photos.length;
  renderGallery();
}

function openCV() {
  cvOverlay.classList.add("open");
  cvOverlay.setAttribute("aria-hidden", "false");
  setOverlayState("cv", true);
}

function closeCV() {
  cvOverlay.classList.remove("open");
  cvOverlay.setAttribute("aria-hidden", "true");
  setOverlayState("cv", false);
}

document.addEventListener("DOMContentLoaded", () => {
  setupRevealObserver();
  setupPhotoFilters();

  document.querySelectorAll("[data-project-target]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleProject(button.dataset.projectTarget);
    });
  });

  document.querySelectorAll("[data-gallery]").forEach((button) => {
    button.addEventListener("click", () => {
      openGallery(button.dataset.gallery);
    });
  });

  document.querySelectorAll("[data-open-cv]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openCV();
    });
  });

  document.querySelectorAll("[data-close-gallery]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      closeGallery();
    });
    button.addEventListener(
      "touchend",
      (event) => {
        event.preventDefault();
        closeGallery();
      },
      { passive: false }
    );
  });

  document.querySelectorAll("[data-close-cv]").forEach((button) => {
    button.addEventListener("click", closeCV);
  });

  document.querySelectorAll("[data-gallery-step]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      changePhoto(Number(button.dataset.galleryStep));
    });

    button.addEventListener(
      "touchend",
      (event) => {
        event.preventDefault();
        changePhoto(Number(button.dataset.galleryStep));
      },
      { passive: false }
    );
  });

  galleryOverlay.addEventListener("click", (event) => {
    if (event.target === galleryOverlay) {
      closeGallery();
    }
  });

  galleryOverlay.addEventListener("dblclick", (event) => {
    event.preventDefault();
  });

  galleryOverlay.addEventListener("touchend", preventGalleryDoubleTapZoom, {
    capture: true,
    passive: false
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (overlayState.gallery) {
      closeGallery();
      return;
    }

    if (overlayState.cv) {
      closeCV();
    }
  }

  if (!overlayState.gallery) {
    return;
  }

  if (event.key === "ArrowRight") {
    changePhoto(1);
  }

  if (event.key === "ArrowLeft") {
    changePhoto(-1);
  }
});
