import { $ } from "./dom.js";

export function createProfileUI({getState,getSession,render,cloudSave,tab}){
  const stateRef=()=>getState();
  function renderProfile(){
    const p=stateRef().profile||{};
    $("pName").value=p.name||"";
    $("pPhone").value=p.phone||"";
    $("pCity").value=p.city||"";
    $("pNote").value=p.note||"";
    $("profileEmail").textContent=getSession()?.user?.email||"";
    const img=$("profileImg"),top=$("topAvatar");
    if(p.photo){
      img.src=p.photo;top.src=p.photo;
      img.classList.remove("hidden");top.classList.remove("hidden");
    }else{
      img.removeAttribute("src");top.removeAttribute("src");
      img.classList.remove("hidden");top.classList.remove("hidden");
    }
    $("topName").textContent=p.name||"Mi perfil";
  }

  $("profileQuick").onclick=()=>tab("profile");
  $("saveProfile").onclick=async()=>{
    stateRef().profile={...stateRef().profile,name:$("pName").value.trim(),phone:$("pPhone").value.trim(),city:$("pCity").value.trim(),note:$("pNote").value.trim()};
    render();
    await cloudSave();
    alert("Perfil guardado correctamente.");
  };
  $("photoInput").onchange=e=>{
    const f=e.target.files?.[0];if(!f)return;
    const r=new FileReader();
    r.onload=()=>{
      const im=new Image();
      im.onload=()=>{
        const c=document.createElement("canvas"),max=420,scale=Math.min(1,max/Math.max(im.width,im.height));
        c.width=Math.round(im.width*scale);c.height=Math.round(im.height*scale);
        c.getContext("2d").drawImage(im,0,0,c.width,c.height);
        stateRef().profile.photo=c.toDataURL("image/jpeg",.78);
        render();cloudSave();
      };
      im.src=r.result;
    };
    r.readAsDataURL(f);
  };
  return {renderProfile};
}
