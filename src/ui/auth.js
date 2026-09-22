import { $, showMsg } from "./dom.js";

export function createAuthUI({supabase,APP_URL,RECOVERY_REDIRECT,authPanel,refresh,isRecoveryFlow,setSession}){
  $("goLogin").onclick=()=>authPanel("loginPanel");
  $("goSignup").onclick=()=>authPanel("signupPanel");
  $("goSignup2").onclick=()=>authPanel("signupPanel");
  $("goLogin2").onclick=()=>authPanel("loginPanel");
  $("forgotBtn").onclick=()=>{$("forgotEmail").value=$("email").value.trim();authPanel("forgotPanel")};
  $("backLogin").onclick=()=>authPanel("loginPanel");

  $("loginBtn").onclick=async()=>{
    showMsg("authMsg","",false);$("authMsg").classList.add("hidden");
    const email=$("email").value.trim(),password=$("password").value;
    if(!email||!password)return showMsg("authMsg","Escribe tu correo y contraseña.",true);
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error)showMsg("authMsg","No se pudo iniciar sesión. Revisa el correo y la contraseña.",true);
    else await refresh(data.session);
  };

  $("signupBtn").onclick=async()=>{
    showMsg("signupMsg","",false);$("signupMsg").classList.add("hidden");
    const email=$("signupEmail").value.trim(),password=$("signupPassword").value,password2=$("signupPassword2").value;
    if(!email||password.length<6)return showMsg("signupMsg","Usa un correo válido y una contraseña de al menos 6 caracteres.",true);
    if(password!==password2)return showMsg("signupMsg","Las contraseñas no coinciden.",true);
    const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:APP_URL}});
    if(error)return showMsg("signupMsg","No se pudo crear la cuenta: "+error.message,true);
    if(data.session)await refresh(data.session);
    else showMsg("signupMsg","Cuenta creada. Revisa tu correo para confirmar la cuenta y luego inicia sesión.");
  };

  $("sendReset").onclick=async()=>{
    const email=$("forgotEmail").value.trim();
    if(!email)return showMsg("forgotMsg","Escribe tu correo electrónico.",true);
    const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:RECOVERY_REDIRECT});
    if(error)showMsg("forgotMsg","No se pudo enviar el enlace: "+(error.message||"error desconocido"),true);
    else showMsg("forgotMsg","Enlace enviado. Revisa tu correo y también la carpeta de spam.");
  };

  $("updatePassword").onclick=async()=>{
    const p=$("newPassword").value,p2=$("newPassword2").value;
    if(p.length<6)return showMsg("resetMsg","La contraseña debe tener al menos 6 caracteres.",true);
    if(p!==p2)return showMsg("resetMsg","Las contraseñas no coinciden.",true);
    const {error}=await supabase.auth.updateUser({password:p});
    if(error)showMsg("resetMsg","No se pudo actualizar la contraseña. Es posible que el enlace haya expirado; solicita uno nuevo.",true);
    else{
      showMsg("resetMsg","Contraseña actualizada correctamente. Ahora inicia sesión con tu nueva contraseña.");
      setTimeout(async()=>{
        history.replaceState({},document.title,APP_URL);
        await supabase.auth.signOut();
        setSession(null);
        authPanel("loginPanel");
      },900);
    }
  };

  document.querySelectorAll("#email,#password").forEach(el=>el.addEventListener("keydown",e=>{
    if(e.key==="Enter"){e.preventDefault();$("loginBtn").click()}
  }));
}
