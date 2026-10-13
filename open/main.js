const shutterPanels = document.querySelectorAll(".page-shutter__panel");
const loadingDuration = 3000;
const shutterDuration = 800;

if (shutterPanels.length !== 2) {
  throw new Error("The page shutter requires two panels");
}

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.body.classList.add("is-closing");

    window.setTimeout(() => {
      window.location.replace("../main/");
    }, shutterDuration);
  }, loadingDuration);
});
