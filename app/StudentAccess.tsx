"use client";
import { useEffect, useState } from "react";
import { request } from "./client-api";
export default function StudentAccess({children}:{children:React.ReactNode}) {
  const [state,setState]=useState<"loading"|"guest"|"ready">("loading");
  const [register,setRegister]=useState(false);const [error,setError]=useState("");const [busy,setBusy]=useState(false);
  useEffect(()=>{request("me").then(()=>setState("ready")).catch(()=>setState("guest"));},[]);
  async function login(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();setBusy(true);setError("");
    const data=Object.fromEntries(new FormData(e.currentTarget));
    try{await request("auth/"+(register?"register":"login"),{method:"POST",body:JSON.stringify(data)});setState("ready");}catch(e){setError((e as Error).message);}finally{setBusy(false);}
  }
  if(state==="loading")return <p>جارٍ التحقق من الجلسة…</p>;
  if(state==="ready")return <><button className="secondary-button" onClick={async()=>{try{await request("auth/logout",{method:"POST"});setState("guest");}catch(e){setError((e as Error).message);}}}>تسجيل الخروج</button>{error&&<p role="alert">{error}</p>}{children}</>;
  return <form className="application-form" onSubmit={login}><h2>{register?"حساب طالب جديد":"تسجيل الدخول"}</h2>{register&&<label>الاسم<input name="name" required autoComplete="name"/></label>}<label>البريد الإلكتروني<input name="email" type="email" required autoComplete="email"/></label><label>كلمة المرور<input name="password" type="password" minLength={register?8:1} required autoComplete={register?"new-password":"current-password"}/></label>{error&&<p role="alert">{error}</p>}<button className="primary-button" disabled={busy}>{busy?"جارٍ التنفيذ…":register?"إنشاء الحساب":"دخول"}</button><button type="button" className="secondary-button" onClick={()=>{setRegister(!register);setError("");}}>{register?"لدي حساب":"إنشاء حساب"}</button></form>;
}
