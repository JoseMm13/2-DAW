import { CategoriesService } from "./classes/categories.service.js";
import { ProductsService } from "./classes/products.service.js";

const newProductForm = document.getElementById("newProduct");
const imgPreview = document.getElementById("imgPreview");

const categoriesService = new CategoriesService();
const productsService = new ProductsService();

function loadImage(event) {
  const file = event.target.files[0];
  imgPreview.src = "";
  imgPreview.classList.add("d-none");

  if (file) {
    if (!file.type.startsWith("image")) {
      newProductForm.image.setCustomValidity("File must be an image");
    } else if (file.size > 200000) {
      newProductForm.image.setCustomValidity(
        "You can't add an image larger than 200KB",
      );
    } else {
      newProductForm.image.setCustomValidity("");

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        imgPreview.src = reader.result;
        imgPreview.classList.remove("d-none");
      });
    }
    newProductForm.image.reportValidity();
  }
}

async function sendForm(event) {
  event.preventDefault();

  if (!newProductForm.reportValidity()) return;
  const formData = new FormData(newProductForm);

  const product = {
    title: formData.get("title").trim(),
    description: formData.get("description").trim(),
    mainPhoto: imgPreview.src,
    price: +formData.get("price"),
    category: +formData.get("category"),
  };

  await productsService.post(product);
  location.assign('index.html');
}

newProductForm.image.addEventListener("change", loadImage);
newProductForm.addEventListener("submit", sendForm);

categoriesService.getAll().then(categories => categories.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.append(c.name);
    newProductForm.category.append(option);
}));
