import { $ } from "./dom.js";

export function tab(name){
  ["dashboard","commitments","savings","expenses","accounts","profile","settings","reports"].forEach(x=>{
    const el=$(x+"Tab");
    if(!el)return;
    el.classList.toggle("hidden",x!==name);
    if(x===name){
      el.classList.remove("tab-section");
      void el.offsetWidth;
      el.classList.add("tab-section");
    }
  });
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
  window.scrollTo({top:0,behavior:"smooth"});
}

export function authPanel(name){
  ["welcomePanel","loginPanel","signupPanel","forgotPanel","resetPanel"].forEach(id=>$(id)?.classList.toggle("hidden",id!==name));
  ["authMsg","signupMsg","forgotMsg","resetMsg"].forEach(id=>{if($(id))$(id).classList.add("hidden")});
}
