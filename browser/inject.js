window.prompt = function(){
  alert('Prompt is not supported!');
  console.error('Prompt is not supported!');
  return '';
};

document.addEventListener("DOMContentLoaded", function(){
  var ipc = require('ipc');
  var h5o = require("../outliner");
  var o = h5o(document.body).asHTML();
  console.log(o);
  ipc.sendToHost("outline", {outline: o });
});