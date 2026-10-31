
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const book = document.getElementById("book");
  const openButton = document.getElementById("openBook");
  const closeButton = document.getElementById("closeBook");

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxNumber = document.getElementById("lightboxNumber");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxClose = document.getElementById("lightboxClose");
  const previousButton = document.getElementById("previousPhoto");
  const nextButton = document.getElementById("nextPhoto");

  const toast = document.getElementById("toast");
  const surpriseButton = document.getElementById("surpriseButton");

  document.getElementById("year").textContent =
    new Date().getFullYear();

  const photos = [
    { src: "../Resources/1.jpg", title: "A little moment" },
    { src: "../Resources/2.jpg", title: "Somewhere in time" },
    { src: "../Resources/3.jpg", title: "The little things" },
    { src: "../Resources/4.jpg", title: "A page of its own" },
    { src: "../Resources/5.jpg", title: "Collected moments" },
    { src: "../Resources/6.jpg", title: "Just being here" },
    { src: "../Resources/7.jpg", title: "Another little story" },
    { src: "../Resources/8.jpg", title: "And the story goes on" }
  ];

  const cards = document.querySelectorAll(".photo-card");
  let currentPhoto = 0;
  let toastTimer;

  // OPEN THE ENVELOPE
  openButton.addEventListener("click", () => {
    if (intro.classList.contains("opening")) return;

    intro.classList.add("opening");
    openButton.disabled = true;

    setTimeout(() => {
      intro.style.display = "none";
      book.classList.add("visible");
      book.setAttribute("aria-hidden", "false");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          book.classList.add("entered");
        });
      });

      window.scrollTo(0, 0);
    }, 850);
  });

  // RETURN TO THE COVER
  closeButton.addEventListener("click", () => {
    book.classList.remove("entered");
    book.setAttribute("aria-hidden", "true");

    setTimeout(() => {
      book.classList.remove("visible");
      intro.style.display = "flex";
      intro.classList.remove("opening");
      openButton.disabled = false;
      window.scrollTo(0, 0);
    }, 500);
  });

  // OPEN PHOTO
  function openPhoto(index) {
    currentPhoto = (index + photos.length) % photos.length;

    const photo = photos[currentPhoto];

    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.title;
    lightboxTitle.textContent = photo.title;

    lightboxNumber.textContent =
      String(currentPhoto + 1).padStart(2, "0") +
      " / " +
      String(photos.length).padStart(2, "0");

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  // CLOSE PHOTO
  function closePhoto() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  function showNextPhoto() {
    openPhoto(currentPhoto + 1);
  }

  function showPreviousPhoto() {
    openPhoto(currentPhoto - 1);
  }

  // PHOTO CARD INTERACTIONS
  cards.forEach(card => {
    card.addEventListener("click", () => {
      openPhoto(Number(card.dataset.photo));
    });

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPhoto(Number(card.dataset.photo));
      }
    });
  });

  lightboxClose.addEventListener("click", closePhoto);
  nextButton.addEventListener("click", showNextPhoto);
  previousButton.addEventListener("click", showPreviousPhoto);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closePhoto();
    }
  });

  // KEYBOARD NAVIGATION
  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") closePhoto();
    if (event.key === "ArrowRight") showNextPhoto();
    if (event.key === "ArrowLeft") showPreviousPhoto();
  });

  // MOBILE PHOTO SWIPING
  let touchStartX = 0;

  lightbox.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", event => {
    const touchEndX = event.changedTouches[0].screenX;
    const difference = touchEndX - touchStartX;

    if (Math.abs(difference) < 55) return;

    if (difference < 0) {
      showNextPhoto();
    } else {
      showPreviousPhoto();
    }
  }, { passive: true });

  // SURPRISE MESSAGES
  const surprises = [
    "Reminder: you're allowed to enjoy the little things. ♡",
    "A tiny message from the universe: keep going. ✦",
    "Plot twist: the best moments are still ahead.",
    "You found a little piece of magic. ✿",
    "Don't forget to make more memories!",
    "This corner of the internet is yours. ♡",
    "Somewhere, someone is having a lovely day. Maybe it's you."
  ];

  function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }

  surpriseButton.addEventListener("click", () => {
    const message =
      surprises[Math.floor(Math.random() * surprises.length)];

    showToast(message);

    surpriseButton.animate(
      [
        { transform: "rotate(10deg) scale(1)" },
        { transform: "rotate(-15deg) scale(1.2)" },
        { transform: "rotate(10deg) scale(1)" }
      ],
      {
        duration: 450,
        easing: "ease-out"
      }
    );
  });

  // 3D MOUSE FOLLOW EFFECT
  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (canHover) {
    cards.forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 9;
        const rotateX = (0.5 - y / rect.height) * 9;

        card.style.setProperty(
          "transform",
          `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.04)`,
          "important"
        );
      });

      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("transform");
      });
    });
  }

  // DRAGGABLE PAPER NOTES AND STICKER
  const movableItems = document.querySelectorAll(
    ".paper-note, .surprise-sticker"
  );

  movableItems.forEach(item => {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let originalX = 0;
    let originalY = 0;

    item.style.touchAction = "none";

    item.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;

      dragging = true;
      item.setPointerCapture(event.pointerId);

      const rect = item.getBoundingClientRect();

      startX = event.clientX;
      startY = event.clientY;

      originalX = rect.left;
      originalY = rect.top;

      item.style.position = "fixed";
      item.style.left = `${originalX}px`;
      item.style.top = `${originalY}px`;
      item.style.right = "auto";
      item.style.bottom = "auto";
      item.style.margin = "0";
      item.style.zIndex = "30";
      item.style.transform = "rotate(0deg)";
    });

    item.addEventListener("pointermove", event => {
      if (!dragging) return;

      const newX = originalX + event.clientX - startX;
      const newY = originalY + event.clientY - startY;

      item.style.left = `${newX}px`;
      item.style.top = `${newY}px`;
    });

    function stopDragging() {
      dragging = false;
    }

    item.addEventListener("pointerup", stopDragging);
    item.addEventListener("pointercancel", stopDragging);
  });

});
