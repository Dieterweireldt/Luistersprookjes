const searchButton = document.querySelector(".search");
const zoekContainer = document.getElementById("zoekContainer");
const bibliotheekContainer = document.getElementById("container");
const searchInput = document.getElementById("searchInput");
const icon = searchButton.querySelector("i");

zoekContainer.style.display = "none";
bibliotheekContainer.style.display = "flex";

searchButton.addEventListener("click", () => {
  // Reset the animation cycle before starting a new one
  icon.classList.remove("icon-slide-down", "icon-active");

  // Slide the current icon up and make it disappear
  icon.classList.add("icon-slide-up");

  setTimeout(() => {
    // Toggle the icon and container visibility
    if (zoekContainer.style.display === "none") {
      icon.classList.remove("fa-magnifying-glass");
      icon.classList.add("fa-xmark");

      zoekContainer.style.display = "grid";
      bibliotheekContainer.style.display = "none";
    } else {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-magnifying-glass");

      zoekContainer.style.display = "none";
      bibliotheekContainer.style.display = "flex";
    }

    icon.style.opacity = "0";
    // Remove slide-up and add slide-down for the new icon
    icon.classList.remove("icon-slide-up");
    icon.classList.add("icon-slide-down");

    // After the slide-down animation completes, reset back to active state
    setTimeout(() => {
      icon.classList.remove("icon-slide-down");
      icon.classList.add("icon-active");
      icon.style.opacity = "";
    }, 300); // Match with the slide-down animation time
  }, 300); // Match with the slide-up animation time
});

searchInput.addEventListener("input", function () {
  const searchTerm = this.value.toLocaleLowerCase();
  console.log(searchTerm);
  fetch(`/zoek?query=${encodeURIComponent(searchTerm)}`)
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("hoofdstukContainer");
      container.innerHTML = "";

      data.hoofdstukken.forEach((hoofdstuk) => {
        const div = document.createElement("div");
        const nrLink = document.createElement("a");
        const link = document.createElement("a");

        nrLink.href = `/boek?boekName=${encodeURIComponent(
          hoofdstuk.boekNaam
        )}&index=0`;

        link.href = `/boek?boekName=${encodeURIComponent(
          hoofdstuk.boekNaam
        )}&index=${hoofdstuk.pagNr}`;
        
        link.innerText = hoofdstuk.naam;
        nrLink.innerText = hoofdstuk.boekNr;

        nrLink.classList.add("sqButton");
        link.classList.add("rectButton");

        div.appendChild(nrLink);
        div.appendChild(link);

        container.appendChild(div);
      });
    })
    .catch((error) => console.error("Error fetching search results:", error));
});
