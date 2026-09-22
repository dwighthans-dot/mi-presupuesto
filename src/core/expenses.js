import { monthKey } from "./calculations.js";

export function addExpense(state,name,amount,date=new Date().toISOString().slice(0,10)){
  const value=Number(amount||0);
  if(!name||value<=0)return false;
  state.expenses.push({name:name.trim(),amount:value,date});
  return true;
}

export function toggleExpensePaid(state,index){
  const item=state.expenses[index];
  if(!item)return;
  item.paid=!item.paid;
  item.paidMonth=item.paid?monthKey():null;
}

export function removeExpense(state,index){
  state.expenses.splice(index,1);
}
