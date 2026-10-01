import { DEFAULT } from "../services/supabase.js";
import { monthKey } from "./calculations.js";

export function createInitialState(){
  return structuredClone(DEFAULT);
}

function snapshotForMonth(state,k){
  const mode=state.incomeMode||"monthly";
  const income=mode==="monthly"
    ? Number(state.income||0)
    : state.incomeEntries
        .filter(x=>String(x.date||"").slice(0,7)===k&&(!x.mode||x.mode===mode))
        .reduce((a,x)=>a+Number(x.amount||0),0);
  const commitments=state.commitments.map(x=>({name:x.name,amount:Number(x.amount||0)}));
  const expenses=state.expenses.map(x=>({name:x.name,amount:Number(x.amount||0),date:x.date||""}));
  const commit=commitments.reduce((a,x)=>a+x.amount,0);
  const expense=expenses.reduce((a,x)=>a+x.amount,0);
  const saving=Number(state.savingGoal||0);
  return {
    month:k,
    income,
    commit,
    saving,
    expense,
    available:income-commit-saving-expense,
    incomeMode:mode,
    commitments,
    expenses,
    incomeEntries:state.incomeEntries.filter(x=>String(x.date||"").slice(0,7)===k).map(x=>({...x})),
    closedAt:new Date().toISOString()
  };
}

export function ensureCurrentMonth(state){
  const k=monthKey();
  if(!state.activeMonth){
    state.activeMonth=k;
    return false;
  }
  if(state.activeMonth===k)return false;

  const old=state.activeMonth;
  const snapshot=snapshotForMonth(state,old);
  const idx=state.monthHistory.findIndex(x=>x.month===old);
  if(idx>=0)state.monthHistory[idx]=snapshot;
  else state.monthHistory.push(snapshot);

  state.activeMonth=k;
  state.income=0;
  state.savingGoal=0;
  state.commitments=[];
  state.expenses=[];
  state.incomeEntries=[];
  state.incomeMode="monthly";
  return true;
}

export function normalizeState(x){
  const z={...createInitialState(),...(x||{})};
  z.profile={...DEFAULT.profile,...(x?.profile||{})};
  z.accounts=Array.isArray(x?.accounts)?x.accounts:[];
  z.commitments=Array.isArray(x?.commitments)?x.commitments:[];
  z.expenses=Array.isArray(x?.expenses)?x.expenses:[];
  z.incomeEntries=Array.isArray(x?.incomeEntries)?x.incomeEntries:[];
  z.monthHistory=Array.isArray(x?.monthHistory)?x.monthHistory:[];
  z.incomeMode=x?.incomeMode||"monthly";
  z.activeMonth=x?.activeMonth||"";
  ensureCurrentMonth(z);
  return z;
}

export function storageKey(userId){
  return "mi_presupuesto_v6_"+(userId||"anon");
}

export function loadLocalState(userId){
  try{
    const raw=localStorage.getItem(storageKey(userId));
    return raw?normalizeState(JSON.parse(raw)):null;
  }catch{
    return null;
  }
}

export function saveLocalState(userId,state){
  localStorage.setItem(storageKey(userId),JSON.stringify(state));
}
