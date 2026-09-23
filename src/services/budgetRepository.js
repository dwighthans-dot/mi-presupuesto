import { supabase } from "./supabase.js";
import { normalizeState } from "../core/state.js";

export function createBudgetRepository({getSession,getState,setState,localSave}){
  const sessionRef=()=>getSession();

  async function load(){
    const session=sessionRef();
    if(!session?.user?.id)return false;
    const {data,error}=await supabase
      .from("budget_data")
      .select("data")
      .eq("user_id",session.user.id)
      .maybeSingle();
    if(error){
      console.error(error);
      return false;
    }
    if(data?.data)setState(normalizeState(data.data));
    else await save();
    localSave();
    return true;
  }

  async function save(){
    const session=sessionRef();
    if(!session?.user?.id)return false;
    const {error}=await supabase
      .from("budget_data")
      .upsert({
        user_id:session.user.id,
        data:getState(),
        updated_at:new Date().toISOString()
      });
    if(error){
      console.error("Cloud save",error);
      localSave();
      return false;
    }
    localSave();
    return true;
  }

  return {load,save};
}
