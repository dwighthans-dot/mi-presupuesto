export const money=n=>"RD$"+Number(n||0).toLocaleString("es-DO",{minimumFractionDigits:2,maximumFractionDigits:2});

export const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));

export function monthKey(d=new Date()){
  const x=new Date(d);
  return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0");
}

export function monthLabel(k){
  const [y,m]=k.split("-").map(Number);
  const d=new Date(y,m-1,1);
  return d.toLocaleDateString("es-DO",{month:"long",year:"numeric"}).replace(/^./,c=>c.toUpperCase());
}

export function incomeForMonth(state,k){
  if(state.incomeMode==="monthly"){
    return monthKey()===k
      ? Number(state.income||0)
      : Number((state.monthHistory.find(h=>h.month===k)?.income)||0);
  }
  return state.incomeEntries
    .filter(x=>String(x.date||"").slice(0,7)===k&&(!x.mode||x.mode===state.incomeMode))
    .reduce((a,x)=>a+Number(x.amount||0),0);
}

export function currentIncome(state){
  return state.incomeMode==="monthly"
    ? Number(state.income||0)
    : incomeForMonth(state,monthKey());
}

export function isPaidThisMonth(x){
  return !!x.paid&&(!x.paidMonth||x.paidMonth===monthKey());
}

export function totals(state){
  const usePaid=state.incomeMode!=="monthly";
  const c=state.commitments.reduce((a,x)=>a+(usePaid&&isPaidThisMonth(x)?0:Number(x.amount||0)),0);
  const e=state.expenses.reduce((a,x)=>a+(usePaid&&isPaidThisMonth(x)?0:Number(x.amount||0)),0);
  const s=Number(state.savingGoal||0);
  const i=currentIncome(state);
  return {c,e,s,i,a:i-c-s-e};
}
