import { isPaidThisMonth, monthKey } from "./calculations.js";

export function addCommitment(state,name,amount){
  const value=Number(amount||0);
  if(!name||value<=0)return false;
  state.commitments.push({name:name.trim(),amount:value,paid:false});
  return true;
}

export function toggleCommitmentPaid(state,index){
  const item=state.commitments[index];
  if(!item)return;
  item.paid=!item.paid;
  item.paidMonth=item.paid?monthKey():null;
}

export function removeCommitment(state,index){
  state.commitments.splice(index,1);
}

export { isPaidThisMonth };
