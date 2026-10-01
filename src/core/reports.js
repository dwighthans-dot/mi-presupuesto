import { monthKey, monthLabel, totals } from "./calculations.js";

function currentSnapshot(state,k=monthKey()){
  const t=totals(state);
  return {
    month:k,
    income:t.i,
    commit:t.c,
    saving:t.s,
    expense:t.e,
    available:t.a,
    incomeMode:state.incomeMode,
    commitments:state.commitments.map(x=>({name:x.name,amount:Number(x.amount||0)})),
    expenses:state.expenses.map(x=>({name:x.name,amount:Number(x.amount||0),date:x.date||""})),
    incomeEntries:state.incomeEntries.filter(x=>String(x.date||"").slice(0,7)===k).map(x=>({...x})),
    closedAt:null
  };
}

export function reportData(state,k){
  if(k===monthKey())return currentSnapshot(state,k);
  return state.monthHistory.find(x=>x.month===k)||{
    month:k,income:0,commit:0,saving:0,expense:0,available:0,
    incomeMode:"monthly",commitments:[],expenses:[],incomeEntries:[],closedAt:null
  };
}

export function closeCurrentMonth(state){
  const k=monthKey(),snap=currentSnapshot(state,k);
  snap.closedAt=new Date().toISOString();
  const i=state.monthHistory.findIndex(h=>h.month===k);
  if(i>=0)state.monthHistory[i]=snap;
  else state.monthHistory.push(snap);
  return snap;
}

export function pctChange(a,b){
  if(!Number(b))return "—";
  const p=((Number(a)-Number(b))/Math.abs(Number(b)))*100;
  return (p>=0?"+":"")+p.toFixed(1)+"%";
}

export function reportMonths(state){
  return [...new Set([monthKey(),...state.monthHistory.map(x=>x.month)])].sort().reverse();
}

export { monthLabel };
