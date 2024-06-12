import {
  setInner,
  show,
  hide,
  getValue,
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
  setInner("isi", besar);
  postFile(target_url, "imageInput", "image", renderToHtml);
}

function renderToHtml(result) {
  console.log(result);
  setInner("isi", result.content);
  show("inputfile");
}
