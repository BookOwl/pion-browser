window.prompt = function(){
  alert('Prompt is not supported!');
  console.error('Prompt is not supported!');
  return '';
};

document.addEventListener("DOMContentLoaded", function(){
  const {ipcRenderer} = require('electron');
  const h5o = require("../outliner");
  const outline = h5o(document.body).asHTML();
  console.log(outline);
  ipcRenderer.sendToHost("outline", {outline: outline });
});