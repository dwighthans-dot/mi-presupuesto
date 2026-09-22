import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

export const SUPABASE_URL="https://coalxlyjswqilgqvcsqq.supabase.co";
export const SUPABASE_KEY="sb_publishable_dOpFLWsqOywPwq4Q2HUwFQ_ZIA5YPCe";
export const APP_URL="https://dwighthans-dot.github.io/mi-presupuesto/";
export const supabase=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:true,detectSessionInUrl:true}});
export const DEFAULT={income:0,savingGoal:0,commitments:[],expenses:[],accounts:[],profile:{name:"",phone:"",city:"",note:"",photo:""},incomeMode:"monthly",incomeEntries:[],monthHistory:[]};
export const RECOVERY_REDIRECT=APP_URL;