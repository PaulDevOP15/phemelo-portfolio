const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

if (menuButton && navigation) {
  const navigationLinks = navigation.querySelectorAll("a");

  const setNavigationOpen = (isOpen, restoreFocus = false) => {
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
    navigation.classList.toggle("is-open", isOpen);

    if (restoreFocus) {
      menuButton.focus();
    }
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setNavigationOpen(!isOpen);

    if (!isOpen && window.matchMedia("(max-width: 700px)").matches) {
      navigationLinks[0]?.focus();
    }
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => setNavigationOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      setNavigationOpen(false, true);
    }
  });

  document.body.classList.add("js-enabled");
}

const imageDialog = document.querySelector(".image-dialog");
const imageDialogImage = document.querySelector(".image-dialog__image");

if (
  imageDialog instanceof HTMLDialogElement &&
  typeof imageDialog.showModal === "function" &&
  imageDialogImage instanceof HTMLImageElement
) {
  const caption = imageDialog.querySelector(".image-dialog__caption");
  const figcaption = imageDialog.querySelector(".image-dialog__figcaption");
  const closeButton = imageDialog.querySelector(".image-dialog__close");
  const previousButton = imageDialog.querySelector(".image-dialog__previous");
  const nextButton = imageDialog.querySelector(".image-dialog__next");
  const position = imageDialog.querySelector(".image-dialog__position");
  let galleryLinks = [];
  let activeIndex = 0;

  const showImage = (index) => {
    activeIndex = (index + galleryLinks.length) % galleryLinks.length;
    const activeLink = galleryLinks[activeIndex];
    const activeImage = activeLink.querySelector("img");
    const imageCaption = activeLink.dataset.caption || activeImage.alt;

    imageDialogImage.src = activeLink.href;
    imageDialogImage.alt = activeImage.alt;
    caption.textContent = imageCaption;
    figcaption.textContent = imageCaption;
    position.textContent =
      galleryLinks.length > 1
        ? `${activeIndex + 1} / ${galleryLinks.length}`
        : "";
    previousButton.hidden = galleryLinks.length < 2;
    nextButton.hidden = galleryLinks.length < 2;
  };

  document.querySelectorAll(".image-viewer-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      const galleryName = link.dataset.gallery;
      galleryLinks = galleryName
        ? Array.from(
            document.querySelectorAll(
              `.image-viewer-link[data-gallery="${galleryName}"]`,
            ),
          )
        : [link];
      showImage(galleryLinks.indexOf(link));
      imageDialog.showModal();
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", () => imageDialog.close());
  previousButton.addEventListener("click", () => showImage(activeIndex - 1));
  nextButton.addEventListener("click", () => showImage(activeIndex + 1));

  imageDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      imageDialog.close();
      return;
    }

    if (galleryLinks.length < 2) {
      return;
    }

    if (event.key === "ArrowLeft") {
      showImage(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      showImage(activeIndex + 1);
    }
  });
}
