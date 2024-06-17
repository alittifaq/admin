import {
  setInner,
  show,
  hide,
  getValue,
  setValue,
  getFileSize,
} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.0.6/croot.js";
import { postFile } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.2/croot.js";

window.uploadImage = uploadImage;

const target_url =
  "https://asia-southeast2-blkkalittifaq-426014.cloudfunctions.net/blkkalittifaq/upload/img";

function uploadImage() {
  if (!getValue("imageInput")) {
    alert("Please select an image file");
    return;
  }
  hide("inputfile");
  let fileInput = document.getElementById("imageInput").files[0];
  let formData = new FormData();
  formData.append("image", fileInput);

  fetch(target_url, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      renderToHtml(data);
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
      // Handle error here
    });
}

function renderToHtml(result) {
  if (result && result.response) {
    setValue("foto", "https://cdn.blkkalittifaq.id/" + result.response);
  } else {
    console.error("Invalid or empty response:", result);
    // Handle the error or provide fallback behavior
  }
  show("inputfile");
}
