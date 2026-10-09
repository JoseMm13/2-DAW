"use strict";

let form = document.getElementById("form1");
let imgPreview = document.getElementById("imgPreview");
let tBody = document.querySelector("tbody");

form.addEventListener("submit", e => {
    e.preventDefault();

    let tdImg = document.createElement("td");
    let img = document.createElement("img");
    img.src = imgPreview.src;
    tdImg.append(img);

    let tdName = document.createElement("td");
    tdName.append(form.name.value);

    let tdHobbies = document.createElement("td");
    tdHobbies.append(Array.from(form.hobbies).filter(i => i.checked).map(i => i.value).toString());

    let tdFood = document.createElement("td");
    tdFood.append(form.food.value);

    let tdLang = document.createElement("td");
    tdLang.append(form.language.value);
    
    let tr = document.createElement("tr");
    tr.append(tdImg, tdName, tdHobbies, tdFood, tdLang);
    tBody.append(tr);

    form.reset();
    imgPreview.src = "";
});

form.photo.addEventListener("change", e => {
    let file = form.photo.files[0];
    
    if(file && file.type.startsWith("image")) {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.addEventListener("load", e => {
            imgPreview.src = reader.result;
        });
    }
});

