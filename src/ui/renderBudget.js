import { $ } from "./dom.js";
import { esc } from "../core/calculations.js";
import { money, monthKey, monthLabel, isPaidThisMonth, incomeForMonth } from "../core/calculations.js";
import { reportData, pctChange } from "../core/reports.js";
import { toggleCommitmentPaid, removeCommitment } from "../core/commitments.js";
import { toggleExpensePaid, removeExpense } from "../core/expenses.js";
import { removeIncomeEntry } from "../core/income.js";

export function renderCommitments(state,render,cloudSave){
 const dailyMode=state.incomeMode!=="monthly";
 $("commitments").innerHTML=state.commitments.map((x,i)=>{const paidNow=dailyMode&&isPaidThisMonth(x);return `<div class="item ${paidNow?"paid":""}"><div class="row"><div><strong>${esc(x.name)}</strong><br><span class="amount">${money(x.amount)}</span></div><div class="actions"><button class="btn ${paidNow?"light":"ok"}" data-pay="${i}">${paidNow?"Pagado":"Marcar pagado"}</button><button class="btn danger" data-delc="${i}">Eliminar</button></div></div></div>`}).join("")||'<p class="muted">No hay compromisos.</p>';
 document.querySelectorAll("[data-pay]").forEach(b=>b.onclick=async()=>{toggleCommitmentPaid(state,+b.dataset.pay);render();await cloudSave()});
 document.querySelectorAll("[data-delc]").forEach(b=>b.onclick=async()=>{removeCommitment(state,+b.dataset.delc);render();await cloudSave()});
}

export function renderExpenses(state,render,cloudSave){
 const dailyMode=state.incomeMode!=="monthly";
 $("expenses").innerHTML=state.expenses.map((x,i)=>`<div class="item ${x.paid?"paid":""}"><div class="row"><div><strong>${esc(x.name)}</strong><br><span class="amount">${money(x.amount)}</span>${x.date?`<br><span class="muted" style="font-size:11px">${x.date}</span>`:""}</div><div class="actions">${dailyMode?`<button class="btn ${x.paid?"light":"ok"}" data-paye="${i}">${x.paid?"Pagado":"Marcar pagado"}</button>`:""}<button class="btn danger" data-dele="${i}">Eliminar</button></div></div></div>`).join("")||'<p class="muted">No hay gastos registrados.</p>';
 document.querySelectorAll("[data-paye]").forEach(b=>b.onclick=async()=>{toggleExpensePaid(state,+b.dataset.paye);render();await cloudSave()});
 document.querySelectorAll("[data-dele]").forEach(b=>b.onclick=async()=>{removeExpense(state,+b.dataset.dele);render();await cloudSave()});
}

export function renderIncomeUI(state,render,cloudSave){
 document.querySelectorAll("[data-mode]").forEach(b=>b.classList.toggle("active",b.dataset.mode===state.incomeMode));
 const entry=state.incomeMode!=="monthly"; $("monthlyIncomeBox").classList.toggle("hidden",entry); $("entryIncomeBox").classList.toggle("hidden",!entry);
 if(entry){
  $("incomeModeTitle").textContent=state.incomeMode==="daily"?"Ingresos diarios":"Ingresos quincenales";
  $("incomeMonthTotal").textContent=money(incomeForMonth(state,monthKey()));
  $("incomeDate").value=$("incomeDate").value||new Date().toISOString().slice(0,10);
  const k=monthKey();
  $("incomeEntries").innerHTML=state.incomeEntries.filter(x=>String(x.date||"").slice(0,7)===k).sort((a,b)=>String(b.date).localeCompare(String(a.date))).map((x)=>`<div class="item"><div class="row"><div><strong>${esc(x.concept||"Ingreso")}</strong><br><span class="muted" style="font-size:11px">${x.date}</span></div><div class="actions"><b class="positive">${money(x.amount)}</b><button class="btn danger" data-deli="1" data-id="${esc(x.id)}">Eliminar</button></div></div></div>`).join("")||'<p class="muted">Aún no hay ingresos registrados este mes.</p>';
  document.querySelectorAll("[data-deli]").forEach(b=>b.onclick=async()=>{removeIncomeEntry(state,b.dataset.id);render();await cloudSave()});
 }
}

function renderReportDetail(state){
 const months=[...new Set([monthKey(),...state.monthHistory.map(x=>x.month)])].sort().reverse();
 const select=$("reportMonth");
 if(!months.length)return;
 if(!months.includes(select.value))select.value=monthKey();
 const k=select.value;
 const data=reportData(state,k);
 const idx=months.indexOf(k);
 const previous=idx>=0&&idx<months.length-1?reportData(state,months[idx+1]):null;

 $("rIncome").textContent=money(data.income);
 $("rCommit").textContent=money(data.commit);
 $("rSaving").textContent=money(data.saving);
 $("rAvailable").textContent=money(data.available);

 const expenseStat=document.getElementById("rExpense");
 if(expenseStat)expenseStat.textContent=money(data.expense);

 const used=Math.max(0,Number(data.commit)+Number(data.saving)+Number(data.expense));
 const pct=data.income?Math.round(used/data.income*100):0;
 $("rHealth").textContent=data.available<0?"Presupuesto excedido":pct>80?"Uso elevado":"Controlado";

 const parts=[
  ["Compromisos",Number(data.commit)],
  ["Ahorro",Number(data.saving)],
  ["Gastos",Number(data.expense)],
  ["Disponible",Math.max(0,Number(data.available))]
 ];
 const max=Math.max(...parts.map(x=>x[1]),1);
 $("reportBars").innerHTML=parts.map(([label,value])=>`<div class="barbox"><div class="barvalue">${money(value).replace("RD$","")}</div><div class="bar" style="height:${Math.max(6,value/max*135)}px"></div><div class="barlabel">${label}</div></div>`).join("");

 $("reportComparison").innerHTML=previous?[
  ["Ingresos",data.income,previous.income],
  ["Compromisos",data.commit,previous.commit],
  ["Ahorro",data.saving,previous.saving],
  ["Gastos",data.expense,previous.expense],
  ["Disponible",data.available,previous.available]
 ].map(([label,a,b])=>`<div class="row" style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06)"><span>${label}</span><span><b>${money(a)}</b> <small class="muted">${pctChange(a,b)}</small></span></div>`).join("")
 :'<p class="muted">No hay un mes anterior guardado para comparar.</p>';

 const commits=data.commitments||[];
 const expenses=data.expenses||[];
 const incomes=data.incomeEntries||[];
 $("historyTable").innerHTML=`
  <div class="item"><strong>${monthLabel(k)}</strong><div class="muted" style="font-size:11px;margin-top:4px">Ingreso: ${money(data.income)} · Modo: ${data.incomeMode==="biweekly"?"Quincenal":data.incomeMode==="daily"?"Diario":"Mensual"}${data.closedAt?" · Cierre guardado":""}</div></div>
  <div class="reportDetailGrid">
   <div><h3>Compromisos</h3>${commits.length?commits.map(x=>`<div class="row reportLine"><span>${esc(x.name)}</span><b>${money(x.amount)}</b></div>`).join(""):'<p class="muted">Sin compromisos.</p>'}</div>
   <div><h3>Gastos</h3>${expenses.length?expenses.map(x=>`<div class="row reportLine"><span>${esc(x.name)}${x.date?`<small class="muted"> · ${esc(x.date)}</small>`:""}</span><b>${money(x.amount)}</b></div>`).join(""):'<p class="muted">Sin gastos.</p>'}</div>
  </div>
  <div style="margin-top:14px"><h3>Ingresos registrados</h3>${incomes.length?incomes.map(x=>`<div class="row reportLine"><span>${esc(x.concept||"Ingreso")} <small class="muted">${esc(x.date||"")}</small></span><b>${money(x.amount)}</b></div>`).join(""):'<p class="muted">Sin ingresos detallados.</p>'}</div>`;
}

export function renderReports(state){
 const months=[...new Set([monthKey(),...state.monthHistory.map(x=>x.month)])].sort().reverse();
 $("reportMonth").innerHTML=months.map(k=>`<option value="${k}">${monthLabel(k)}</option>`).join("");
 if(!months.includes($("reportMonth").value))$("reportMonth").value=monthKey();
 renderReportDetail(state);
}
