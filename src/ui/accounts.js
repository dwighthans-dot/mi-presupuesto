import { $, } from "./dom.js";
import { CARD_CATALOG, detectCard, cardPath } from "../services/cards.js";
import { accountIcon } from "../core/accounts.js";
import { money, esc } from "../core/calculations.js";

export function createAccountsUI({state,render,cloudSave}){
  let editingAccountIndex=-1;

  function updateCardPreview(){
    const c=detectCard($("aInstitution").value,$("aName").value,$("aCardType").value),box=$("cardPreview");
    if(!c){box.classList.add("hidden");return}
    $("cardPreviewImg").src=cardPath(c);
    $("cardPreviewTitle").textContent=c.label;
    $("cardPreviewText").textContent="Imagen asignada automáticamente según el banco y tipo.";
    box.classList.remove("hidden");
  }

  function resetAccountForm(){
    editingAccountIndex=-1;
    $("accountFormTitle").textContent="Nueva cuenta";
    $("aType").value="bank";
    $("aName").value="";
    $("aInstitution").value="";
    $("aCardType").value="auto";
    $("aBalance").value="";
    $("cardPreview").classList.add("hidden");
  }

  function openAccountForm(i=-1){
    editingAccountIndex=i;
    if(i>=0){
      const a=state.accounts[i]||{};
      $("accountFormTitle").textContent="Editar cuenta";
      $("aType").value=a.type||"bank";
      $("aName").value=a.name||"";
      $("aInstitution").value=a.institution||"";
      $("aCardType").value=a.cardType||"auto";
      $("aBalance").value=Number(a.balance||0);
      updateCardPreview();
    }else{
      resetAccountForm();
      updateCardPreview();
    }
    $("accountForm").classList.remove("hidden");
  }

  function renderAccounts(){
    const make=a=>{
      const card=a.cardId?CARD_CATALOG.find(c=>c.id===a.cardId):detectCard(a.institution,a.name,a.cardType||"auto");
      const visual=card?'<div class="accountVisual"><img src="'+cardPath(card)+'" alt="'+esc(card.label)+'"></div>':'<div class="accountIcon">'+accountIcon(a.type)+'</div>';
      const label=card?card.label:(a.type==="paypal"?"PayPal":a.type==="bank"?"Cuenta bancaria":a.type==="cash"?"Efectivo":"Otra cuenta");
      return '<div class="item"><div class="account">'+visual+'<div class="accountMeta"><strong>'+esc(a.name)+'</strong><small>'+esc(label)+'</small></div><div style="text-align:right"><div class="amount">'+money(a.balance)+'</div><div class="actions" style="justify-content:flex-end;margin-top:5px"><button class="btn light" data-edita="'+state.accounts.indexOf(a)+'">Editar</button><button class="btn danger" data-dela="'+state.accounts.indexOf(a)+'">Eliminar</button></div></div></div></div>';
    };
    $("accountsList").innerHTML=state.accounts.map(make).join("")||'<p class="muted">Aún no has agregado cuentas.</p>';
    $("accountsPreview").innerHTML=state.accounts.slice(0,3).map(a=>{
      const card=a.cardId?CARD_CATALOG.find(c=>c.id===a.cardId):detectCard(a.institution,a.name,a.cardType||"auto");
      return '<div class="item"><div class="account">'+(card?'<div class="accountVisual"><img src="'+cardPath(card)+'" alt="'+esc(card.label)+'"></div>':'<div class="accountIcon">'+accountIcon(a.type)+'</div>')+'<div class="accountMeta"><strong>'+esc(a.name)+'</strong><small>'+money(a.balance)+'</small></div></div></div>';
    }).join("")||'<p class="muted">Agrega tu banco o PayPal.</p>';
    document.querySelectorAll("[data-edita]").forEach(b=>b.onclick=()=>openAccountForm(+b.dataset.edita));
    document.querySelectorAll("[data-dela]").forEach(b=>b.onclick=async()=>{state.accounts.splice(+b.dataset.dela,1);render();await cloudSave()});
  }

  $("profileQuick").onclick=()=>window.__mesadaTab?.("profile");
  $("addAccountBtn").onclick=()=>openAccountForm();
  $("cancelAccount").onclick=()=>{$("accountForm").classList.add("hidden");resetAccountForm()};
  $("aType").onchange=()=>{if($("aType").value==="paypal"){$("aInstitution").value="PayPal";$("aCardType").value="auto"}updateCardPreview()};
  $("aInstitution").oninput=updateCardPreview;
  $("aName").oninput=updateCardPreview;
  $("aCardType").onchange=updateCardPreview;
  $("saveAccount").onclick=async()=>{
    const n=$("aName").value.trim(),bal=Number($("aBalance").value),type=$("aType").value,institution=$("aInstitution").value.trim(),cardType=$("aCardType").value,card=detectCard(institution,n,cardType);
    if(!n)return;
    if(editingAccountIndex>=0){
      const current=state.accounts[editingAccountIndex]||{};
      state.accounts[editingAccountIndex]={...current,type,name:n,balance:bal||0,institution,cardType,cardId:card?.id||null};
    }else state.accounts.push({type,name:n,balance:bal||0,institution,cardType,cardId:card?.id||null});
    $("accountForm").classList.add("hidden");
    resetAccountForm();
    render();
    await cloudSave();
  };

  return {renderAccounts,openAccountForm,resetAccountForm};
}
