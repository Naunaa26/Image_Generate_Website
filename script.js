const imagePrompt = document.getElementById("image-prompt");
const imageQuantity = document.getElementById("img-quantity");
const titlename = document.getElementById("title");

const API_KEY = "orodQzDYeJZVxgSJ1NmMTa2LamdBcVV9QcWejFVpvyQ";

const imgresult = document.getElementById("img-results");

// Form
const formImgGenerator = document.getElementById("form-img-generator");

// Pagination elements
const paginationContainer = document.getElementById("pagination-container");
const paginationNumbers = document.getElementById("pagination-numbers");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let currentPage = 1;
let totalPages = 1;

// Function to fetch API
const generateImg = async (page = 1) => {
  try {
    imgresult.innerHTML = Array.from({ length: imageQuantity.value }, () => 
      `
      <div class="flex justify-center">
        <img src='./loader.svg' alt='loading image'/>
      </div>
      `
    ).join("");

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${imagePrompt.value}&page=${page}&per_page=${imageQuantity.value}&client_id=${API_KEY}`
    );

    const data = await response.json();

    totalPages = data.total_pages;

    titlename.innerHTML = `<h2 class="capitalize">hasil pencarian dari <span class="bg-blue-500 p-1 text-white rounded-2xl">${imagePrompt.value}</span></h2>`;

    const imgHasil = data.results.map((image) => `
      <div class="masonry-item card relative">
        <img src="${image.urls.regular}" alt="${image.alt_description}" class="w-full h-auto">
        <div class="bottom-1 absolute flex w-full justify-between px-2 py-1">
          <h2 class="bg-white p-1 rounded-lg text-xs">${image.user.name}</h2>
          <a href=${image.links.download}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="bg-white mt-1 rounded-full">
              <path fill="currentColor"
                d="m12 15.577l-3.538-3.539l.707-.719L11.5 13.65V5h1v8.65l2.33-2.33l.708.718L12 15.577ZM6.615 19q-.69 0-1.152-.462Q5 18.075 5 17.385v-2.423h1v2.423q0 .23.192.423q.193.192.423.192h10.77q.23 0 .423-.192q.192-.193.192-.423v-2.423h1v2.423q0 .69-.462 1.152q-.463.463-1.153.463H6.615Z"/>
            </svg>
          </a>
        </div>
      </div>
    `).join("");

    setTimeout(() => {
      imgresult.innerHTML = imgHasil;
      setupPagination();
      paginationContainer.hidden = false; 
    }, 1500);

  } catch (error) {
    console.log(error);
  }
};

// Setup Pagination
const setupPagination = () => {
  paginationNumbers.innerHTML = '';

  const maxVisiblePages = 3;
  let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.add('px-4', 'py-2', 'border', 'border-gray-300', 'text-gray-500', 'hover:bg-gray-50', 'mx-1');
    if (i === currentPage) {
      btn.classList.add('bg-blue-500', 'text-white');
    }
    btn.addEventListener('click', () => {
      currentPage = i;
      generateImg(currentPage);
    });
    paginationNumbers.appendChild(btn);
  }

  if (startPage > 1) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.classList.add('px-2', 'py-2');
    paginationNumbers.insertBefore(dots, paginationNumbers.firstChild);
  }

  if (endPage < totalPages) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.classList.add('px-2', 'py-2');
    paginationNumbers.appendChild(dots);
  }


  prevBtn.hidden = currentPage === totalPages || totalPages === 1;
  nextBtn.hidden = currentPage === totalPages || totalPages === 1;
};

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    generateImg(currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    generateImg(currentPage);
  }
});

formImgGenerator.addEventListener("submit", function (e) {
  e.preventDefault();
  if (imagePrompt.value.length < 3) {
    alert("Pencarian gagal / Tidak Berhasil");
    return;
  }
  currentPage = 1;
  generateImg(currentPage);
  paginationContainer.hidden = true; 
});
