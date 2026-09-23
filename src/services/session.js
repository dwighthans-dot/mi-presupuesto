import { $, showMsg } from "../ui/dom.js";
import { authPanel } from "../ui/navigation.js";

export function createSessionManager({supabase,isRecoveryFlow,onSession,refresh}){
  function setSession(session){
    if(onSession)onSession(session);
  }

  function handleAuthStateChange(event,session){
    setSession(session);
    if(event==="PASSWORD_RECOVERY"){
      authPanel("resetPanel");
      $("appHeader").classList.add("hidden");
      $("nav").classList.add("hidden");
      $("appView").classList.add("hidden");
      $("authView").classList.remove("hidden");
    }
    setTimeout(()=>refresh(session),0);
  }

  async function start(){
    supabase.auth.onAuthStateChange(handleAuthStateChange);
    const {data:{session}}=await supabase.auth.getSession();
    if(isRecoveryFlow()){
      $("appHeader").classList.add("hidden");
      $("nav").classList.add("hidden");
      $("appView").classList.add("hidden");
      $("authView").classList.remove("hidden");
      authPanel("resetPanel");
      return;
    }
    if(session)await supabase.auth.signOut({scope:"local"});
    setSession(null);
    await refresh(null);
  }

  return {start,setSession,handleAuthStateChange};
}
