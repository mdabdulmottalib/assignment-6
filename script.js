/**
 * API -> https://openapi.programming-hero.com/api/peddy/category/dog
 */

// Select all HTML elements
const itemList = document.getElementById("item-list");
const petsList = document.getElementById("pets-list");
const petImageList = document.getElementById("pet-image-list");
const sortByPriceBtn = document.getElementById("sort-by-price-btn");

// state management function
function useState(init) {
  let value = init;

  function getState() {
    return value;
  }

  function setState(newValue) {
    value = newValue;
    render();
  }

  return [getState, setState];
}

async function fetchAnyData(uri) {
  const resp = await fetch(uri);
  const data = await resp.json();
  return data;
}
const [itemIndex, setItemIndex] = useState(1);
const [exitPath, setExitPath] = useState("Cat");

let [sortPrice, setSortPrice] = useState(false);
sortByPriceBtn?.addEventListener("click", function () {
  setSortPrice(!sortPrice());
});

let loadingState = `<div class="flex justify-center items-center w-full col-span-4">
<p><img class="animate-spin w-12" src="https://cdn.hugeicons.com/icons/loading-03-solid-standard.svg"/></p>
</div>`;

async function render() {
  petsList.innerHTML = loadingState;
  const { categories } = await fetchAnyData(
    "https://openapi.programming-hero.com/api/peddy/categories"
  );

  try {
    const { pets } = await fetchAnyData(
      "https://openapi.programming-hero.com/api/peddy/pets"
    );

    itemList.innerHTML = categories.map(itemListing).join("");
    let filterData = pets.filter((item) => item.category === exitPath());
    if (sortPrice()) {
      filterData = filterData.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    if (filterData.length > 0) {
      petsList.innerHTML = filterData.slice(0, 3).map(petListing).join("");
      petImageList.innerHTML = pets.slice(0, 6).map(imageList).join("");
    } else {
      petsList.innerHTML = `
    <div class="bg-[#131313] bg-opacity-5 w-full col-span-4 h-[491px] rounded-2xl">
      <div class="flex items-center justify-center text-center flex-col h-full w-full">
        <div>
          <img src="images/error.webp"/>
        </div>

        <div class="mx-24 mt-5">
          <h2 class="font-bold text-3xl">No Information Available</h2>
          <p class="text-[#131313] text-opacity-70">It is a long established fact that a reader will be distracted by the readable content of a page when looking at 
its layout. The point of using Lorem Ipsum is that it has a.</p>
        </div>
      </div>
    </div>
    

    `;
    }
  } catch (err) {
    console.log(err);
  }
}

// Template for rendering each item
function itemListing(item) {
  return `
    <button onclick="indexFunc(${item?.id}, '${item?.category}')" class="${
    "flex items-center border-2 px-8 py-4 gap-3 " +
    (item?.id === itemIndex()
      ? "rounded-full border-[#0E7A81] bg-[#0E7A81] bg-opacity-10"
      : "rounded-xl")
  }">
        <h2 class="font-bold text-2xl order-2">${
          item?.category || "Unnamed"
        }</h2>
        <img class="order-1 w-9" src=${item?.category_icon || "#"} alt="${
    item?.category || "No name"
  }"/>
    </button>
  `;
}

function indexFunc(val, itemName) {
  setItemIndex(val);
  setExitPath(itemName);
}

function imageList(item, index) {
  return `
  <div>
    <img class="rounded-xl h-full w-full object-cover" src=${item?.image} alt=${item?.category}/>
  </div>
  `;
}

function petListing(item, index) {
  return `
  <div>
    <div class="p-4 border rounded-xl">
      <div>
        <img class="rounded-xl" src=${item?.image} alt=${item?.pet_name}/>
      </div>

      <div class="mt-3">
        <h2 class="font-bold text-xl">${item?.pet_name}</h2>
        <p class="text-[#131313] text-opacity-70">Breed: ${item?.breed}</p>
        <p class="text-[#131313] text-opacity-70">Birth: ${item?.date_of_birth}</p>
        <p class="text-[#131313] text-opacity-70">Gender: ${item?.gender}</p>
        <p class="text-[#131313] text-opacity-70">Price: ${item?.price}$</p>
      </div>

      <div class="my-3">
        <hr/>
      </div>

      <div class="flex w-full justify-between">
        <button class="border rounded-xl px-3 py-2">Like</button>
        <button class="border rounded-xl px-3 py-2 text-[#0E7A81] font-bold">Adopt</button>
        <button onclick="postPopup(${item?.petId})" class="border rounded-xl px-3 py-2 text-[#0E7A81] font-bold">Details</button>
      </div>
    </div>
  </div>
  `;
}

async function postPopup(id) {
  const data = await fetchAnyData(
    "https://openapi.programming-hero.com/api/peddy/pet/" + id // Use the passed id parameter
  );
  const fetchData = data.petData;

  const popupElement = popup(fetchData);
  document.body.appendChild(popupElement);
}

function popup(data) {
  let div = document.createElement("div");
  let stackture = `
  
  <div class="fixed inset-0 z-50 bg-[#131313] bg-opacity-60 flex items-center justify-center">
    <div class="w-[28rem] h-[37.5rem] bg-white rounded-xl p-5" >
      <div class="w-full">
        <div>
          <img class="w-full rounded-xl h-44 object-cover object-center" src=${data.image}/>
        </div>

        <div class="mt-3">
          <div>
            <h2 class="font-bold text-2xl">${data?.pet_name}</h2>
          </div>

          <div class="w-full grid grid-cols-2 gap-2">
            <div>
              <p>Breed: ${data?.breed}</p>
            </div>

            <div>
              <p>Birth: ${data?.date_of_birth}</p>
            </div>

            <div>
              <p>Gender: ${data?.gender}</p>
            </div>

            <div>
              <p>Price: ${data?.price}$</p>
            </div>

            <div>
              <p>Vaccinated status: ${data?.vaccinated_status}</p>
            </div>
          </div>

          <div class="my-3">
            <hr/>
          </div>

          <div>
            <h3 class="font-bold text-lg">Details Information</h3>
            <p class="mt-2">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
            </p>

            <ul class="list-disc">
              <li class="line-clamp-2">
                ${data?.pet_details}
              </li>
            </ul>
          </div>

          <div class="mt-5 w-full">
            <button onclick="closePopup(this)" class="bg-[#0E7A81] w-full text-center py-3 bg-opacity-10 text-[#0E7A81] rounded-xl border-[#0e7a81] font-bold">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  `;
  div.innerHTML = stackture;
  return div;
}

function closePopup(e) {
  const popupDiv = e.closest(".fixed");

  if (popupDiv) {
    document.body.removeChild(popupDiv.parentElement);
  }
}

render();
