const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const response = await fetch("/removebg", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  //const img = new Image();
  //img.width="100%";
  //img.height="100%";
  //img.style.width = '100%';
  var img = document.getElementById("selectedImage");
  img.classList.add("img");
  img.src = "data:image/jpeg;base64," + data.image;
  img.id = "myImage";
  //document.querySelector('#image-container').appendChild(img);

  //document.querySelector('#image-container').innerHTML = JSON.stringify(data);
});

function downloadImage() {
  var img = document.getElementById("myImage");
  var url = img.src.replace(
    /^data:image\/[^;]/,
    "data:application/octet-stream"
  );
  var filename = "myimage.jpg";

  var link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}

const input = document.getElementById("image-upload");
const infoDiv = document.getElementById("image-info");

input.addEventListener("change", function () {
  const file = input.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", function () {
    const img = new Image();
    img.src = reader.result;

    img.addEventListener("load", function () {
      const info = `Name: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes, Dimensions: ${img.width} x ${img.height}`;
      displaySelectedImage();
      infoDiv.textContent = info;
    });
  });

  reader.readAsDataURL(file);
});

// Display selected Image
function displaySelectedImage() {
  var fileInput = document.getElementById("image-upload");
  var selectedImage = document.getElementById("selectedImage");
  selectedImage.style.display = "block";
  selectedImage.src = URL.createObjectURL(fileInput.files[0]);
}
