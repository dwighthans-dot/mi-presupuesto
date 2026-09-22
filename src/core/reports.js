import { monthKey, monthLabel, totals } from "./calculations.js";

export function reportData(state,k){
  const h=state.monthHistory.find(x=>x.month===k);
  if(k===monthKey()){
    const t=totals(state);
    return {month:k,income:t.i,commit:t.c,saving:t.s,expense:t.e,available:t.a};
  }
  return h||{month:k,income:0,commit:0,saving:0,expense:0,available:0};
}

export function closeCurrentMonth(state){
  const k=monthKey(),t=totals(state);
  const snap={month:k,income:t.i,commit:t.c,saving:t.s,expense:t.e,available:t.a,closedAt:new Date().toISOString()};
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
