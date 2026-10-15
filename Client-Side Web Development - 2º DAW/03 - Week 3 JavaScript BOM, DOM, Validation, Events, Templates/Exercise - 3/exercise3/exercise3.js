"use strict";

const form = document.getElementById("newProduct");
const imageInput = document.getElementById("image");
const imgPreview = document.getElementById("imgPreview");
const productsContainer = document.getElementById("productsContainer");
const template = document.getElementById("productTemplate");

let imageBase64 = "";

function createProductCard(product) {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".card-img-top").src = product.image;
    clone.querySelector(".card-title").textContent = product.title;
    clone.querySelector(".card-text").textContent = product.description;
    clone.querySelector(".category").textContent = product.category;

    clone.querySelector(".price").textContent =
        new Intl.NumberFormat("en", {
            style: "currency",
            currency: "EUR"
        }).format(product.price);

    clone.querySelector(".btn-delete").addEventListener("click", function () {
        this.closest(".col").remove();
    });

    productsContainer.append(clone);
}

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) {
        imageInput.setCustomValidity("Select an image");
        imgPreview.classList.add("d-none");
        imgPreview.removeAttribute("src");
        return;
    }

    if (!file.type.startsWith("image")) {
        imageInput.setCustomValidity("The file must be an image");
        imageInput.reportValidity();
        imgPreview.classList.add("d-none");
        imgPreview.removeAttribute("src");
        return;
    }

    if (file.size > 200 * 1024) {
        imageInput.setCustomValidity("The image must be smaller than 200KB");
        imageInput.reportValidity();
        imgPreview.classList.add("d-none");
        imgPreview.removeAttribute("src");
        return;
    }

    imageInput.setCustomValidity("");

    const reader = new FileReader();

    reader.addEventListener("load", () => {
        imageBase64 = reader.result;

        imgPreview.classList.remove("d-none");
        imgPreview.src = imageBase64;
    });

    reader.readAsDataURL(file);
});

form.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: Number(document.getElementById("price").value),
        category: document.getElementById("category").selectedOptions[0].textContent,
        image: imageBase64
    };

    createProductCard(product);

    form.reset();

    imageBase64 = "";

    imgPreview.src = "";
    imgPreview.classList.add("d-none");

    form.classList.remove("was-validated");
});

document.querySelectorAll(".btn-delete").forEach(button => {
    button.addEventListener("click", function () {
        this.closest(".col").remove();
    });
});