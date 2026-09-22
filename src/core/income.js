import { incomeForMonth, monthKey } from "./calculations.js";

export function currentMonthIncome(state){
  return incomeForMonth(state,monthKey());
}

export function addIncomeEntry(state,{amount,date,concept,mode}){
  const value=Number(amount||0);
  if(value<=0)return false;
  state.incomeEntries.push({
    id:crypto.randomUUID(),
    amount:value,
    date:date||new Date().toISOString().slice(0,10),
    concept:concept||"Ingreso",
    mode:mode||state.incomeMode
  });
  return true;
}

export function removeIncomeEntry(state,id){
  state.incomeEntries=state.incomeEntries.filter(x=>x.id!==id);
}
