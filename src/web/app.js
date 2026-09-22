import { supabase, APP_URL, RECOVERY_REDIRECT } from "../services/supabase.js";
import { $ , showMsg } from "../ui/dom.js";
import { tab, authPanel } from "../ui/navigation.js";
import { renderDashboard } from "../ui/renderDashboard.js";
import { renderCommitments, renderExpenses, renderIncomeUI, renderReports } from "../ui/renderBudget.js";
import { CARD_CATALOG, detectCard, cardPath } from "../services/cards.js";
import { createInitialState, normalizeState, loadLocalState, saveLocalState } from "../core/state.js";
import { money, esc } from "../core/calculations.js";
import { accountIcon } from "../core/accounts.js";
import { addIncomeEntry, removeIncomeEntry } from "../core/income.js";
import { addCommitment, toggleCommitmentPaid, removeCommitment } from "../core/commitments.js";
import { addExpense, toggleExpensePaid, removeExpense } from "../core/expenses.js";
import { setSavingGoal } from "../core/savings.js";
import { closeCurrentMonth } from "../core/reports.js";

let state=createInitialState(),session=null;

function localSave(){saveLocalState(session?.user?.id,state)}
function localLoad(){const x=loadLocalState(session?.user?.id);if(x)state=x}
async function cloudLoad(){const {data,error}=await supabase.from("budget_data").select("data").eq("user_id",session.user.id).maybeSingle();if(error){console.error(error);return}if(data?.data)state=normalizeState(data.data);else await cloudSave();localSave()}
async function cloudSave(){const {error}=await supabase.from("budget_data").upsert({user_id:session.user.id,data:state,updated_at:new Date().toISOString()});if(error)console.error("Cloud save",error);localSave()}

function render(){renderDashboard(state);renderCommitments(state,render,cloudSave);renderExpenses(state,render,cloudSave);accountsUI.renderAccounts();profileUI.renderProfile();renderIncomeUI(state,render,cloudSave);renderReports(state);}
function isRecoveryFlow(){return location.search.includes("reset=1")||location.hash.includes("type=recovery")||location.hash.includes("access_token=")&&location.hash.includes("type=recovery")}
async function refresh(s){session=s;const recovery=isRecoveryFlow();if(s && !recovery){localLoad();await cloudLoad();$("authView").classList.add("hidden");$("appView").classList.remove("hidden");$("nav").classList.remove("hidden");$("appHeader").classList.remove("hidden");render();tab("dashboard")}else{$("authView").classList.remove("hidden");$("appView").classList.add("hidden");$("nav").classList.add("hidden");$("appHeader").classList.add("hidden");authPanel(recovery?"resetPanel":"welcomePanel")}}
$("logoutBtn").onclick=async()=>{await supabase.auth.signOut();location.reload()};
const accountsUI=createAccountsUI({state,render,cloudSave});
const profileUI=createProfileUI({state,getSession:()=>session,render,cloudSave,tab});
createAuthUI({supabase,APP_URL,RECOVERY_REDIRECT,authPanel,refresh,isRecoveryFlow,setSession:s=>{session=s}});
$("addCommit").onclick=async()=>{const n=$("cName").value.trim(),a=Number($("cAmount").value);if(!n||a<=0)return;addCommitment(state,n,a);$("cName").value="";$("cAmount").value="";render();await cloudSave()};$("addExpense").onclick=async()=>{const n=$("eName").value.trim(),a=Number($("eAmount").value);if(!n||a<=0)return;addExpense(state,n,a);$("eName").value="";$("eAmount").value="";render();await cloudSave()};$("saveGoal").onclick=async()=>{setSavingGoal(state,$("savingGoal").value);render();await cloudSave()};document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=async()=>{state.incomeMode=b.dataset.mode;render();await cloudSave()});$("addIncomeEntry").onclick=async()=>{const amount=Number($("incomeAmount").value),date=$("incomeDate").value||new Date().toISOString().slice(0,10),concept=$("incomeConcept").value.trim()||"Ingreso";if(amount<=0)return;addIncomeEntry(state,{amount,date,concept,mode:state.incomeMode});$("incomeAmount").value="";$("incomeConcept").value="";render();await cloudSave()};$("saveSettings").onclick=async()=>{state.income=Math.max(0,Number($("incomeInput").value)||0);setSavingGoal(state,$("savingGoalInput").value);render();showMsg("settingsMsg","Cambios guardados correctamente.");await cloudSave()};$("closeMonth").onclick=async()=>{closeCurrentMonth(state);render();showMsg("settingsMsg","Cierre del mes guardado en Reportes.");await cloudSave()};$("reportMonth").onchange=()=>renderReports();
document.querySelectorAll("nav button,[data-tab]").forEach(b=>b.onclick=()=>tab(b.dataset.tab));
supabase.auth.onAuthStateChange((event,s)=>{if(event==="PASSWORD_RECOVERY"){session=s;authPanel("resetPanel");$("appHeader").classList.add("hidden");$("nav").classList.add("hidden");$("appView").classList.add("hidden");$("authView").classList.remove("hidden")}setTimeout(()=>refresh(s),0)});document.querySelectorAll('#email,#password').forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('loginBtn').click()}}));
const {data:{session:s0}}=await supabase.auth.getSession();
if(isRecoveryFlow()){$('appHeader').classList.add('hidden');$('nav').classList.add('hidden');$('appView').classList.add('hidden');$('authView').classList.remove('hidden');authPanel('resetPanel')}else{if(s0)await supabase.auth.signOut({scope:'local'});session=null;await refresh(null)}
