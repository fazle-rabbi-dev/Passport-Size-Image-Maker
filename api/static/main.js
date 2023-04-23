const loader = document.querySelector(".loader");
const selectedImage = document.getElementById("selectedImage");
const selectedImageBox = document.querySelector(".selectedImageBox");
const toastBox = document.querySelector(".toast-box");
// const toastName = document.querySelector(".toast-box > h2");
const toastMessage = document.querySelector(".toast-box p span");
const toastTypeIcon = document.querySelector(".toast-type-icon");
const closeIcon = document.querySelector(".close-icon");
const tickSymbol = 'mdi:tick-circle'
const exclamationSymbol = 'bi:exclamation-circle-fill'
const apiInput = document.querySelector(".api-input");

// Get api from localStorage
if(localStorage.getItem('api_key')){
  apiInput.value = localStorage.getItem('api_key')
}

const showToast = (type,name,msg,duration=8000) => {
  // Hide toast message
  toastBox.style.top = '-100vh';
  // Show toast message after 40 ms
  setTimeout(function() {
    // set content inside toast
    toastMessage.innerHTML = msg
    if(type == 'error'){
      toastTypeIcon.setAttribute('icon',exclamationSymbol)
      toastBox.style.borderBottom = '4px solid #f2088b;'
      toastTypeIcon.classList.add(`toast-type-icon-error`)
    }
    else if(type == 'success'){
      toastTypeIcon.setAttribute('icon',tickSymbol)
      toastBox.style.borderBottom = '4px solid #0bc394;'
      toastTypeIcon.classList.add(`toast-type-icon-success`)
    }
    // display toast
    toastBox.style.top = 0
    /*setTimeout(function() {
      toastBox.style.top = '-100vh'
    }, duration);*/
  }, 40);
}

closeIcon.addEventListener("click", function(el){
  toastBox.style.top = '-100vh';
});

const form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // If api_key found then store it in the localStorage
  if(apiInput.value != '' && apiInput.value.length != 24){
    showToast('error','','Invalid api! Using default api');
  }
  if(apiInput.value != '' && apiInput.value.length == 24){
    localStorage.setItem('api_key',apiInput.value)
  }
  
  if(selectedImage.src.includes('null')){
    showToast('error','','Please choose an image!')
    return;
  }
  const formData = new FormData(form);
  // Hide selected image and display loader
  selectedImage.style.display = 'none';
  loader.style.display = 'block'
  try {
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
    // When success = false
    else{
      selectedImage.style.display = 'block';
      loader.style.display = 'none'
      showToast('error','Error','Something went wrong.May be your api free request limitation exceeded! Try with different api');
    }
  } catch (e) {
    showToast('error','','Internet connection error!')
    selectedImage.style.display = 'block';
    loader.style.display = 'none'
  }
});

function downloadImage() {
  if(selectedImage.src.includes('null')){
    showToast('error','',"Please choose an image and click on continue!");
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
