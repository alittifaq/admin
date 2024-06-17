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
    let besar = getFileSize("imageInput");
    console.log(besar);
    postFile(target_url, "imageInput", "image", renderToHtml); // Tidak ada .catch di sini
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
  

