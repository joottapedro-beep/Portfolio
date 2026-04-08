const galleries = {
  acores: {
    title: "Açores",
    sub: "2025 · Landscapes",
    coverAlt: "Landscape from the Azores",
    photos: [
      "fotos/acores/IMG_2211.JPG",
      "fotos/acores/IMG_1109.JPG",
      "fotos/acores/IMG_1252.JPG",
      "fotos/acores/IMG_1748.JPG"
    ]
  },
  caramulo: {
    title: "Caramulo",
    sub: "2025 · Cars",
    coverAlt: "Car photography at Caramulo",
    photos: [
      "fotos/caramulo/IMG_4634%20(1).JPG",
      "fotos/caramulo/IMG_4650.JPG",
      "fotos/caramulo/IMG_4803.JPG",
      "fotos/caramulo/IMG_4806.JPG",
      "fotos/caramulo/IMG_4828.JPG",
      "fotos/caramulo/IMG_4840.JPG",
      "fotos/caramulo/IMG_4853.JPG",
      "fotos/caramulo/IMG_4860.JPG",
      "fotos/caramulo/IMG_4869%20(1).JPG"
    ]
  },
  anadia: {
    title: "Anadia",
    sub: "2025 · Sports",
    coverAlt: "Sports photography from Anadia",
    photos: [
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1400&q=90",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=90",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1400&q=90",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1400&q=90"
    ]
  },
  malta: {
    title: "Malta",
    sub: "2025 · Travel",
    coverAlt: "Travel portrait in Malta",
    photos: [
      "fotos/malta/IMG_5990.jpeg",
      "fotos/malta/IMG_5927.JPG"
    ]
  },
  suecia: {
    title: "Sweden",
    sub: "2026 · Travel",
    coverAlt: "Travel photography in Sweden",
    photos: [
      "fotos/sweden/IMG_2712.jpeg",
      "fotos/sweden/IMG_8248.jpeg",
      "fotos/sweden/ft2.png"
    ]
  },
  noruega: {
    title: "Norway",
    sub: "2026 · Travel",
    coverAlt: "Travel photography in Norway",
    photos: [
      "fotos/norway/IMG_8775.jpeg",
      "fotos/norway/IMG_0115.jpeg",
      "fotos/norway/ft3.png"
    ]
  }
};

let currentGallery = null;
let currentIndex = 0;

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

function syncBodyScroll() {
  const anyOverlayOpen = Object.values(overlayState).some(Boolean);
  document.body.classList.toggle("overlay-open", anyOverlayOpen);
}

function setOverlayState(name, isOpen) {
  overlayState[name] = isOpen;
  syncBodyScroll();
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

function renderGallery() {
  if (!currentGallery) {
    return;
  }

  const activeImageSrc = currentGallery.photos[currentIndex];

  galleryTitle.textContent = currentGallery.title;
  gallerySubtitle.textContent = currentGallery.sub;
  galleryImage.style.opacity = "0";
  galleryImage.src = activeImageSrc;
  galleryImage.alt = `${currentGallery.coverAlt} (${currentIndex + 1}/${currentGallery.photos.length})`;
  galleryImage.onload = () => {
    galleryImage.style.opacity = "1";
  };
  galleryCounter.textContent = `${currentIndex + 1} de ${currentGallery.photos.length}`;
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
    thumbImage.src = src;
    thumbImage.alt = "";
    thumbImage.loading = "lazy";

    thumbButton.appendChild(thumbImage);
    thumbButton.addEventListener("click", () => {
      currentIndex = index;
      renderGallery();
    });

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
  setOverlayState("gallery", true);
}

function closeGallery() {
  galleryOverlay.classList.remove("open");
  galleryOverlay.setAttribute("aria-hidden", "true");
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
    button.addEventListener("click", closeGallery);
  });

  document.querySelectorAll("[data-close-cv]").forEach((button) => {
    button.addEventListener("click", closeCV);
  });

  document.querySelectorAll("[data-gallery-step]").forEach((button) => {
    button.addEventListener("click", () => {
      changePhoto(Number(button.dataset.galleryStep));
    });
  });

  galleryOverlay.addEventListener("click", (event) => {
    if (event.target === galleryOverlay) {
      closeGallery();
    }
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
