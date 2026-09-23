import { $ , showMsg } from "./dom.js";
import { tab } from "./navigation.js";
import { addIncomeEntry } from "../core/income.js";
import { addCommitment } from "../core/commitments.js";
import { addExpense } from "../core/expenses.js";
import { setSavingGoal } from "../core/savings.js";
import { closeCurrentMonth } from "../core/reports.js";

export function bindAppEvents({getState,render,cloudSave,renderReports,supabase,onLogout}){
  const state=()=>getState();

  $("logoutBtn").onclick=async()=>{
    await supabase.auth.signOut();
    if(onLogout) onLogout();
    else location.reload();
  };

  $("addCommit").onclick=async()=>{
    const n=$("cName").value.trim(),a=Number($("cAmount").value);
    if(!n||a<=0)return;
    addCommitment(state(),n,a);
    $("cName").value="";$("cAmount").value="";
    render();await cloudSave();
  };

  $("addExpense").onclick=async()=>{
    const n=$("eName").value.trim(),a=Number($("eAmount").value);
    if(!n||a<=0)return;
    addExpense(state(),n,a);
    $("eName").value="";$("eAmount").value="";
    render();await cloudSave();
  };

  $("saveGoal").onclick=async()=>{
    setSavingGoal(state(),$("savingGoal").value);
    render();await cloudSave();
  };

  document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=async()=>{
    state().incomeMode=b.dataset.mode;
    render();await cloudSave();
  });

  $("addIncomeEntry").onclick=async()=>{
    const amount=Number($("incomeAmount").value);
    const date=$("incomeDate").value||new Date().toISOString().slice(0,10);
    const concept=$("incomeConcept").value.trim()||"Ingreso";
    if(amount<=0)return;
    addIncomeEntry(state(),{amount,date,concept,mode:state().incomeMode});
    $("incomeAmount").value="";$("incomeConcept").value="";
    render();await cloudSave();
  };

  $("saveSettings").onclick=async()=>{
    state().income=Math.max(0,Number($("incomeInput").value)||0);
    setSavingGoal(state(),$("savingGoalInput").value);
    render();
    showMsg("settingsMsg","Cambios guardados correctamente.");
    await cloudSave();
  };

  $("closeMonth").onclick=async()=>{
    closeCurrentMonth(state());
    render();
    showMsg("settingsMsg","Cierre del mes guardado en Reportes.");
    await cloudSave();
  };

  $("reportMonth").onchange=()=>renderReports();
  document.querySelectorAll("nav button,[data-tab]").forEach(b=>b.onclick=()=>tab(b.dataset.tab));
}
