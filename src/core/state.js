import { DEFAULT } from "../services/supabase.js";

export function createInitialState(){
  return structuredClone(DEFAULT);
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
