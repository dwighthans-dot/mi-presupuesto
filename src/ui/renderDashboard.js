import { $, esc } from "./dom.js";
import { money, monthKey, monthLabel, totals } from "../core/calculations.js";
export function renderDashboard(state){
  const t=totals(state);
  $("income").textContent=money(t.i); $("commitTotal").textContent=money(t.c); $("savingTotal").textContent=money(t.s); $("expenseTotal").textContent=money(t.e); $("available").textContent=money(t.a);
  $("incomePill").textContent="Ingresos "+money(t.i); $("savingPill").textContent="Ahorro "+money(t.s);
  const days=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()-new Date().getDate()+1;
  $("dailySpend").textContent=`Límite orientativo: ${money(Math.max(0,t.a)/days)} por día hasta fin de mes.`;
  const used=Math.max(0,t.i-t.a),pct=Math.min(100,(used/Math.max(1,t.i))*100);
  $("usagePct").textContent=Math.round(pct)+"%"; $("usageBar").style.width=pct+"%";
  $("traffic").textContent=t.a<0?"🔴 Presupuesto excedido. Conviene ajustar gastos.":pct>80?"🟡 Vas justo. Vigila los gastos variables.":"🟢 Buen control. Mantén el ritmo.";
  $("incomeInput").value=Number(state.income||0); $("savingGoal").value=t.s; $("savingGoalInput").value=t.s;
  $("goalText").textContent=money(t.s); $("goalBar").style.width=(t.s?Math.min(100,(t.s/Math.max(1,t.i))*100):0)+"%";
  $("goalMsg").textContent=t.s?`Tu meta representa ${Math.round(t.s/Math.max(1,t.i)*100)}% de tus ingresos.`:"Define una meta para comenzar.";
  $("savingProgress").textContent=money(t.s); $("monthLabel").textContent=monthLabel(monthKey());
  renderChart(t);
}
export function renderChart(t){
  const vals=[t.i,t.c,t.s,t.e,Math.max(0,t.a)],labels=["Ingreso","Comprom.","Ahorro","Gastos","Libre"],max=Math.max(...vals,1);
  $("chart").innerHTML=vals.map((v,i)=>`<div class="barbox"><div class="barvalue">${money(v).replace("RD$","")}</div><div class="bar" style="height:${Math.max(4,v/max*135)}px"></div><div class="barlabel">${labels[i]}</div></div>`).join("");
}