import { $, esc } from "./dom.js";
import { money, monthKey, isPaidThisMonth, incomeForMonth } from "../core/calculations.js";
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
 if(entry){ $("incomeModeTitle").textContent=state.incomeMode==="daily"?"Ingresos diarios":"Ingresos quincenales"; $("incomeMonthTotal").textContent=money(incomeForMonth(state,monthKey())); $("incomeDate").value=$("incomeDate").value||new Date().toISOString().slice(0,10);
 const k=monthKey(); $("incomeEntries").innerHTML=state.incomeEntries.filter(x=>String(x.date||"").slice(0,7)===k).sort((a,b)=>String(b.date).localeCompare(String(a.date))).map((x,i)=>`<div class="item"><div class="row"><div><strong>${esc(x.concept||"Ingreso")}</strong><br><span class="muted" style="font-size:11px">${x.date}</span></div><div class="actions"><b class="positive">${money(x.amount)}</b><button class="btn danger" data-deli="${i}" data-id="${esc(x.id)}">Eliminar</button></div></div></div>`).join("")||'<p class="muted">Aún no hay ingresos registrados este mes.</p>';
 document.querySelectorAll("[data-deli]").forEach(b=>b.onclick=async()=>{removeIncomeEntry(state,b.dataset.id);render();await cloudSave()});}
}
export function renderReports(state){
 const months=[...new Set([monthKey(),...state.monthHistory.map(x=>x.month)])].sort().reverse();
 $("reportMonth").innerHTML=months.map(k=>`<option value="${k}">${monthLabel(k)}</option>`).join("");
 if(!months.includes($("reportMonth").value))$("reportMonth").value=monthKey();
}