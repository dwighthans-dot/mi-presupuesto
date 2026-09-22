export const $=id=>document.getElementById(id);

export function showMsg(id,textValue,error=false){
  const el=$(id);
  if(!el)return;
  el.textContent=textValue;
  el.classList.remove("hidden");
  el.classList.toggle("error",error);
}
