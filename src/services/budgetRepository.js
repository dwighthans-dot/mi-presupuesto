import { supabase } from "./supabase.js";
import { normalizeState } from "../core/state.js";

export function createBudgetRepository({getSession,getState,setState,localSave}){
  const sessionRef=()=>getSession();
  let saveQueue=Promise.resolve();

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
    saveQueue=saveQueue.then(async()=>{
      const session=sessionRef();
      if(!session?.user?.id)return false;

      // Guardamos localmente antes de la petición para no perder cambios
      // si el dispositivo entra en modo offline o la petición falla.
      localSave();

      const {error}=await supabase
        .from("budget_data")
        .upsert({
          user_id:session.user.id,
          data:getState(),
          updated_at:new Date().toISOString()
        });

      if(error){
        console.error("Cloud save",error);
        return false;
      }
      localSave();
      return true;
    }).catch(error=>{
      console.error("Cloud save queue",error);
      localSave();
      return false;
    });

    return saveQueue;
  }

  return {load,save};
}
