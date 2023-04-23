const loader = document.querySelector(".loader");
const selectedImage = document.getElementById("selectedImage");
const selectedImageBox = document.querySelector(".selectedImageBox");
const toastBox = document.querySelector(".toast-box");


// Toggle element ==> (show/hide)
const toggleElement = () => {
  // style.display = 'none';
}

const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if(selectedImage.src.includes('null')){
    alert("Please choose an image!")
    return;
  }
  const formData = new FormData(form);
  // Hide selected image and display loader
  selectedImage.style.display = 'none';
  loader.style.display = 'block'
  
  const response = await fetch("/removebg", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  // alert(JSON.stringify(data,null,3))
  if(data.image){
    selectedImage.style.display = 'block';
    loader.style.display = 'none'
    var img = document.getElementById("selectedImage");
    img.src = "data:image/jpeg;base64," + data.image;
    img.id = "myImage";
  }
  else{
    selectedImage.style.display = 'block';
    loader.style.display = 'none'
    toastBox.style.left = 0
  }
});

function downloadImage() {
  if(selectedImage.src.includes('null')){
    alert("Please choose an image and click on continue");
    return;
  }
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
      const info = `
        Name: ${file.name} ,
        Type: ${file.type} ,
        Size: ${file.size} bytes ,
        Dimensions: ${img.width} x ${img.height}`;
      displaySelectedImage(img.src);
      selectedImageBox.style.display = 'block'
      infoDiv.textContent = info;
    });
  });

  reader.readAsDataURL(file);
});

// Display selected Image
function displaySelectedImage(src) {
  var fileInput = document.getElementById("image-upload");
  var selectedImage = document.getElementById("selectedImage");
  selectedImage.style.display = "block";
  selectedImage.src = URL.createObjectURL(fileInput.files[0]);
}
