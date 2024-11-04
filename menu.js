const cards = [
  {
    id: 1,
    name: "Iced Latte",
    src: "Iced_Latte.jpg",
  },
  {
    id: 2,
    name: "Iced Americano",
    src: "Iced-Americano-2.jpg",
  },

  {
    id: 3,
    name: "Iced Cappuccino",
    src: "Iced Cappuccino.webp",
  },

  {
    id: 4,
    name: "Iced Expresso",
    src: "Iced expresso.jpg",
  },
  {
    id: 5,
    name: "Iced Chocolate",
    src: "FI-iced-chocolate-almond-milk-shaken-espresso.webp",
  },
  {
    id: 6,
    name: "Iced Green Tea",
    src: "Iced-Matcha-Latte2.jpg",
  },

  {
    id: 7,
    name: "Iced Macchiatto",
    src: "258686-IcedCaramelMacchiato.jpg",
  },

  {
    id: 8,
    name: "Iced Mocha",
    src: "IcedMocha.webp",
  },
];

const cardContainer = document.getElementById("card-container");

let html = "";

cards.forEach((card) => {
  html += `<div class="card" style="width: 20rem" id="card-${card.id}">
        <img
          src="images/${card.src}"
          class="card-img-top"
          alt="..."
        />
        <div class="card-body">
          <h1 class="card-title fs-5">${card.name}</h1>
          <div class="d-flex justify-content-between align-items-center fs-5">
            <span>$1.5</span>
            <button class="btn btn-success">+</button>
          </div>
        </div>
      </div>`;
});

cardContainer.innerHTML = html;
