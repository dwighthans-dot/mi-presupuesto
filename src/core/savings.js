export function setSavingGoal(state,amount){
  state.savingGoal=Math.max(0,Number(amount||0));
  return state.savingGoal;
}
