window.prompt = function(){
  alert('Prompt is not supported!');
  console.error('Prompt is not supported!');
  return '';
};