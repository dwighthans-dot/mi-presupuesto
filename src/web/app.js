import { supabase, APP_URL, RECOVERY_REDIRECT } from "../services/supabase.js";
import { $ } from "../ui/dom.js";
import { createAccountsUI } from "../ui/accounts.js";
import { createProfileUI } from "../ui/profile.js";
import { createAuthUI } from "../ui/auth.js";
import { bindAppEvents } from "../ui/events.js";
import { tab, authPanel } from "../ui/navigation.js";
import { renderDashboard } from "../ui/renderDashboard.js";
import { renderCommitments, renderExpenses, renderIncomeUI, renderReports } from "../ui/renderBudget.js";
import { createInitialState, normalizeState, loadLocalState, saveLocalState } from "../core/state.js";






let state=createInitialState(),session=null;

function localSave(){saveLocalState(session?.user?.id,state)}
function localLoad(){const x=loadLocalState(session?.user?.id);if(x)state=x}
async function cloudLoad(){const {data,error}=await supabase.from("budget_data").select("data").eq("user_id",session.user.id).maybeSingle();if(error){console.error(error);return}if(data?.data)state=normalizeState(data.data);else await cloudSave();localSave()}
async function cloudSave(){const {error}=await supabase.from("budget_data").upsert({user_id:session.user.id,data:state,updated_at:new Date().toISOString()});if(error)console.error("Cloud save",error);localSave()}

function render(){renderDashboard(state);renderCommitments(state,render,cloudSave);renderExpenses(state,render,cloudSave);accountsUI.renderAccounts();profileUI.renderProfile();renderIncomeUI(state,render,cloudSave);renderReports(state);}
function isRecoveryFlow(){return location.search.includes("reset=1")||location.hash.includes("type=recovery")||location.hash.includes("access_token=")&&location.hash.includes("type=recovery")}
async function refresh(s){session=s;const recovery=isRecoveryFlow();if(s && !recovery){localLoad();await cloudLoad();$("authView").classList.add("hidden");$("appView").classList.remove("hidden");$("nav").classList.remove("hidden");$("appHeader").classList.remove("hidden");render();tab("dashboard")}else{$("authView").classList.remove("hidden");$("appView").classList.add("hidden");$("nav").classList.add("hidden");$("appHeader").classList.add("hidden");authPanel(recovery?"resetPanel":"welcomePanel")}}
const accountsUI=createAccountsUI({getState:()=>state,render,cloudSave});
const profileUI=createProfileUI({getState:()=>state,getSession:()=>session,render,cloudSave,tab});
createAuthUI({supabase,APP_URL,RECOVERY_REDIRECT,authPanel,refresh,isRecoveryFlow,setSession:s=>{session=s}});
bindAppEvents({getState:()=>state,render,cloudSave,renderReports:()=>renderReports(state),supabase,onLogout:()=>location.reload()});
supabase.auth.onAuthStateChange((event,s)=>{if(event==="PASSWORD_RECOVERY"){session=s;authPanel("resetPanel");$("appHeader").classList.add("hidden");$("nav").classList.add("hidden");$("appView").classList.add("hidden");$("authView").classList.remove("hidden")}setTimeout(()=>refresh(s),0)});
const {data:{session:s0}}=await supabase.auth.getSession();
if(isRecoveryFlow()){$('appHeader').classList.add('hidden');$('nav').classList.add('hidden');$('appView').classList.add('hidden');$('authView').classList.remove('hidden');authPanel('resetPanel')}else{if(s0)await supabase.auth.signOut({scope:'local'});session=null;await refresh(null)}
