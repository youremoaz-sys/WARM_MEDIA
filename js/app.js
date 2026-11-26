const $=s=>document.querySelector(s),R=document.documentElement;
const SUPABASE_URL="https://jntlxhkftcdbepkfppdi.supabase.co",SUPABASE_KEY="sb_publishable_KIyYdrrserJ07BVMm8BDhw_Phb-X7No";
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
let currentUser=null,currentProfile=null,currentAdmin=null,activeArticleId=null,newsStats={},categoryNames=[],publicAdmins=[],newsSearch="",newsCategory="";
const U={ar:{account:"الحساب",signIn:"تسجيل الدخول",signUp:"إنشاء حساب",signOut:"تسجيل الخروج",profile:"الملف الشخصي",email:"البريد الإلكتروني",password:"كلمة المرور",confirm:"تأكيد كلمة المرور",name:"الاسم",avatar:"الصورة الشخصية",forgot:"استعادة كلمة المرور",newPassword:"كلمة المرور الجديدة",save:"حفظ",close:"إغلاق",authRequired:"سجّل الدخول للتفاعل مع الأخبار.",authError:"تعذر إكمال العملية.",registered:"تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيده.",resetSent:"تم إرسال رابط الاستعادة إلى بريدك.",profileSaved:"تم تحديث الملف الشخصي.",commentArticle:"اختر الخبر للتعليق",likes:"إعجاب",comments:"تعليق",source:"المصدر",search:"ابحث في الأخبار",allCategories:"كل التصنيفات",uploadError:"الملف غير مدعوم أو حجمه أكبر من 100MB.",admin:"Admin",edit:"تعديل",delete:"حذف",cancel:"إلغاء"},en:{account:"Account",signIn:"Sign in",signUp:"Create account",signOut:"Sign out",profile:"Profile",email:"Email",password:"Password",confirm:"Confirm password",name:"Name",avatar:"Profile photo",forgot:"Reset password",newPassword:"New password",save:"Save",close:"Close",authRequired:"Sign in to interact with news.",authError:"Could not complete the request.",registered:"Account created. Check your email to confirm it.",resetSent:"Password reset email sent.",profileSaved:"Profile updated.",commentArticle:"Choose an article to comment on",likes:"Like",comments:"Comment",source:"Source",search:"Search news",allCategories:"All categories",admin:"Admin",edit:"Edit",delete:"Delete",cancel:"Cancel",uploadError:"Unsupported file or size exceeds 100MB."}};
const UX=()=>U[st.lang]||U.ar;
const T={ar:{brk:"عاجل",h1:"العالم كما يحدث، في مكان واحد",sub:"آخر الأخبار والتحليلات من WARM MEDIA.",cta:"أحدث الأخبار",latest:"أحدث الأخبار",world:"الأخبار العالمية",cm:"التعليقات",send:"نشر",ph:"اكتب تعليقك…",ft:"© 2026 WARM MEDIA. جميع الحقوق محفوظة.",set:"الإعدادات",c1:"اللون الأساسي",c2:"اللون الثانوي",d3:"الكرة الأرضية ثلاثية الأبعاد",fx:"المؤثرات البصرية",reset:"إعادة الضبط",read:"اقرأ الخبر",reply:"رد",del:"حذف",like:"إعجاب",pin:"مميز",now:"الآن",views:"مشاهدة",nav:["الرئيسية","عاجل","عالمي","محلي","تقنية","اقتصاد","رياضة","تحليلات"],
th:{red:"أسود وأحمر",gold:"أسود وذهبي",blue:"أسود وأزرق",purple:"بنفسجي داكن",light:"الوضع الفاتح"},saved:"تم الحفظ",noNews:"لا توجد أخبار منشورة بعد.",noCm:"لا توجد تعليقات بعد.",cats:["عالمي","محلي","تقنية","اقتصاد","رياضة","تحليلات"]},
en:{brk:"BREAKING",h1:"The world as it happens, in one place",sub:"The latest news and analysis from WARM MEDIA.",cta:"Latest news",latest:"Latest news",world:"World news",cm:"Comments",send:"Post",ph:"Write your comment…",ft:"© 2026 WARM MEDIA. All rights reserved.",set:"Settings",c1:"Primary color",c2:"Secondary color",d3:"3D globe",fx:"Visual effects",reset:"Reset",read:"Read story",reply:"Reply",del:"Delete",like:"Like",pin:"Featured",now:"Just now",views:"views",nav:["Home","Breaking","World","Local","Tech","Economy","Sports","Analysis"],
th:{red:"Black & Red",gold:"Black & Gold",blue:"Black & Blue",purple:"Dark Purple",light:"Light Mode"},saved:"Saved",noNews:"No articles published yet.",noCm:"No comments yet.",cats:["World","Local","Tech","Economy","Sports","Analysis"]}};
const TH={red:["#ff2a2a","#7a0b12"],gold:["#f5b82e","#6b4a05"],blue:["#2a8bff","#0b2f6e"],purple:["#a24bff","#3b0b7a"],light:["#e0182d","#7a0b12"]};
const hues={red:"#2a0508",gold:"#241a05",blue:"#05142a",purple:"#16052a",light:"#ece3e4"};
let st={lang:"ar",theme:"red",p:TH.red[0],s:TH.red[1],d3:true,fx:true};
try{Object.assign(st,JSON.parse(localStorage.getItem("wm")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("wm",JSON.stringify(st))}catch(e){}};
const L=()=>T[st.lang];
const hex2rgb=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16)).join(",");
function paint(){
 R.style.setProperty("--p",st.p);R.style.setProperty("--s",st.s);R.style.setProperty("--glow","rgba("+hex2rgb(st.p)+",.45)");
 R.style.setProperty("--bg2",hues[st.theme]||hues.red);
 R.dataset.theme=st.theme==="light"?"light":"dark";
 $("#p1").value=st.p;$("#p2").value=st.s;$("#t3").checked=st.d3;$("#tf").checked=st.fx;
 R.style.setProperty("--fx",st.fx?1:0);
 $("#globe").style.display=st.d3?"block":"none";
}
function text(){
 const l=L();R.lang=st.lang;R.dir=st.lang==="ar"?"rtl":"ltr";$("#lang").textContent=st.lang==="ar"?"EN":"ع";
 $("#news-search").placeholder=UX().search;
 $("#news-category").innerHTML=`<option value="">${UX().allCategories}</option>`+categoryNames.map((name,i)=>name?`<option value="${i}">${esc(name)}</option>`:"").join("");
 $("#news-category").value=newsCategory;
 $("#news-search").value=newsSearch;
 document.querySelectorAll("[data-t]").forEach(e=>e.textContent=l[e.dataset.t]);
 document.querySelectorAll("[data-ph]").forEach(e=>e.placeholder=l[e.dataset.ph]);
 const ids=["top","latest","world","latest","latest","latest","latest","comments"];
 $("#nav").innerHTML=l.nav.map((n,i)=>`<a href="#${ids[i]}">${n}</a>`).join("");
 $("#account").textContent=currentUser?"●":"♙";
 const ic=p=>`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
 $("#bnav").innerHTML=`<i class="pill"></i><a href="#top" aria-label="${l.nav[0]}">${ic('<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>')}</a><a href="#latest" aria-label="${l.latest}">${ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/>')}</a><a href="#world" aria-label="${l.world}">${ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>')}</a><a href="#comments" aria-label="${l.cm}">${ic('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>')}</a><button id="bset" aria-label="${l.set}">${ic('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>')}</button>`;
 $("#bset").onclick=()=>{$("#panel").classList.add("open");mv(4)};
 spy();
 $("#ths").innerHTML=Object.keys(TH).map(k=>`<button data-k="${k}" class="${k===st.theme?"on":""}">${l.th[k]}</button>`).join("");
 const card=a=>`<article class="card" data-id="${esc(a.id)}"><div class="img" style="${a.img?`background:url('${esc(a.img)}') center/cover`:"background:linear-gradient(135deg,var(--s),#0a0a0e 75%)"}">${a.br?`<span class="tag-b">${l.brk}</span>`:""}</div><div class="bd"><span class="cat">${esc(categoryNames[a.cat]||l.cats[a.cat]||"")}</span><h3>${esc(a.title)}</h3><div class="meta">${a.au?`<span>${esc(a.au)} ${a.admin?`<span class="verified">✓</span> <b>${UX().admin}</b>`:""}</span>`:""}${a.source?`<span>${esc(a.source)}</span>`:""}<span>${new Date(a.ts).toLocaleDateString(st.lang==="ar"?"ar":"en",{dateStyle:"medium"})}</span><span>${a.views||0} ${l.views}</span></div><div class="act"><button data-like="${esc(a.id)}">♥ ${newsStats[a.id]?.like_count||0}</button><button data-comments="${esc(a.id)}">◌ ${newsStats[a.id]?.comment_count||0}</button></div><span class="more">${l.read}</span></div></article>`;
 const S=[...A].sort((x,y)=>y.ts-x.ts).filter(a=>(!newsSearch||`${a.title} ${a.body} ${a.source}`.toLowerCase().includes(newsSearch.toLowerCase()))&&(!newsCategory||String(a.cat)===newsCategory)),Wd=S.filter(a=>a.cat===0),B=S.filter(a=>a.br);
 $("#g1").innerHTML=S.map(card).join("")||`<p class="empty">${l.noNews}</p>`;
 $("#g2").innerHTML=Wd.map(card).join("");$("#world").hidden=!Wd.length;
 $("#ticker").hidden=!B.length;$("#tk").textContent=B.map(a=>a.title).join("   •   ");
 tilt();renderC();
}
$("#news-search").oninput=e=>{newsSearch=e.target.value;text()};
$("#news-category").onchange=e=>{newsCategory=e.target.value;text()};
$("#comment-article").onchange=e=>{activeArticleId=e.target.value||null;loadComments()};
function tilt(){document.querySelectorAll(".card").forEach(c=>{
 c.onpointermove=e=>{if(!st.fx||e.pointerType==="touch")return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`rotateY(${x*10}deg) rotateX(${-y*10}deg) translateZ(8px)`};
 c.onpointerleave=()=>c.style.transform=""})}
/* Authenticated, article-specific comments are loaded from Supabase. */
let C=[],replyTo=null;
async function loadComments(){
 if(!activeArticleId){C=[];renderC();return}
 const {data,error}=await sb.from("wm_news_comments").select("id,article_id,author_id,content,parent_id,created_at").eq("article_id",activeArticleId).order("created_at");
 if(error){toast(error.message);return}
 const ids=[...new Set((data||[]).map(c=>c.author_id))];
 const [profiles,admins,likes,likeStats]=ids.length?await Promise.all([
  sb.from("wm_profiles").select("user_id,display_name,avatar_path").in("user_id",ids),
  sb.from("wm_admins").select("user_id,display_name,avatar_path").in("user_id",ids),
  sb.from("wm_comment_likes").select("comment_id").in("comment_id",(data||[]).map(c=>c.id)),
  sb.from("wm_comment_stats").select("comment_id,like_count").in("comment_id",(data||[]).map(c=>c.id))
 ]):[{data:[]},{data:[]},{data:[]},{data:[]}];
 if(profiles.error||admins.error||likes.error||likeStats.error){toast((profiles.error||admins.error||likes.error||likeStats.error).message);return}
 C=(data||[]).map(c=>({...c,profile:(profiles.data||[]).find(p=>p.user_id===c.author_id),admin:(admins.data||[]).find(a=>a.user_id===c.author_id),like_count:(likeStats.data||[]).find(x=>x.comment_id===c.id)?.like_count||0,liked:(likes.data||[]).some(x=>x.comment_id===c.id)}));
 renderC();
}
function avatarUrl(path){return path?sb.storage.from("wm-media").getPublicUrl(path).data.publicUrl:""}
function renderC(){
 const l=L(),u=UX(),f=ts=>new Date(ts).toLocaleString(st.lang==="ar"?"ar":"en",{dateStyle:"medium",timeStyle:"short"});
 const one=c=>{const name=c.admin?.display_name||c.profile?.display_name||"User",avatar=c.admin?.avatar_path||c.profile?.avatar_path,src=avatarUrl(avatar);
 return `<div class="cm ${c.is_featured?"pin":""} ${c.parent_id?"rep":""}"><div class="av">${src?`<img src="${esc(src)}" alt="" loading="lazy">`:esc(name.charAt(0).toUpperCase())}</div><div class="b"><div class="h"><b>${esc(name)}</b> ${c.admin?`<span class="verified">✓</span> <b>${u.admin}</b>`:""} ${c.is_featured?"★ "+l.pin:""}<br>${f(c.created_at)}</div><div>${esc(c.content)}</div><div class="act"><button data-comment-like="${esc(c.id)}">♥ ${c.like_count}${c.liked?" ✓":""}</button>${!c.parent_id?`<button data-reply-comment="${esc(c.id)}">${l.reply}</button>`:""}${currentUser&&c.author_id===currentUser.id?`<button data-edit-comment="${esc(c.id)}">${u.edit}</button>`:""}${currentUser&&(c.author_id===currentUser.id||currentAdmin)?`<button data-delete-comment="${esc(c.id)}">${u.delete}</button>`:""}${currentAdmin?`<button data-pin-comment="${esc(c.id)}">${c.is_featured?"★":"☆"} ${l.pin}</button>`:""}</div></div></div>`};
 const roots=C.filter(c=>!c.parent_id).sort((a,b)=>Number(b.is_featured)-Number(a.is_featured)||new Date(b.created_at)-new Date(a.created_at));
 $("#cl").innerHTML=roots.map(c=>one(c)+C.filter(r=>r.parent_id===c.id).map(one).join("")).join("")||`<p class="empty">${l.noCm}</p>`;
}
async function postComment(){
 const value=$("#ci").value.trim();if(!value)return;
 if(!currentUser){openAuth("signin");toast(UX().authRequired);return}
 if(!activeArticleId){toast(UX().commentArticle);return}
 const {error}=await sb.from("wm_news_comments").insert({article_id:activeArticleId,author_id:currentUser.id,content:value,parent_id:replyTo});
 if(error){toast(error.message);return}
 $("#ci").value="";replyTo=null;await loadComments();await loadNews();
}
$("#cs").onclick=postComment;
$("#ci").onkeydown=e=>{if(e.key==="Enter")postComment()};
$("#cl").onclick=async e=>{const b=e.target.closest("button");if(!b)return;const edit=b.dataset.editComment,del=b.dataset.deleteComment,reply=b.dataset.replyComment,like=b.dataset.commentLike,pin=b.dataset.pinComment;
 if(!currentUser){openAuth("signin");return}
 if(reply){replyTo=reply;$("#ci").focus();toast(L().reply);return}
 if(like){const exists=C.find(x=>x.id===like)?.liked;const result=exists?await sb.from("wm_comment_likes").delete().eq("comment_id",like).eq("user_id",currentUser.id):await sb.from("wm_comment_likes").insert({comment_id:like,user_id:currentUser.id});if(result.error)toast(result.error.message);else await loadComments();return}
 if(pin&&currentAdmin){const c=C.find(x=>x.id===pin);const {error}=await sb.from("wm_news_comments").update({is_featured:!c.is_featured}).eq("id",pin);if(error)toast(error.message);else await loadComments();return}
 if(edit){const c=C.find(x=>x.id===edit);if(!c||c.author_id!==currentUser.id){toast("You can only edit your own comment.");return}const value=prompt(UX().edit,c.content);if(value===null)return;const {error}=await sb.from("wm_news_comments").update({content:value.trim()}).eq("id",edit).eq("author_id",currentUser.id);if(error)toast(error.message);else await loadComments()}
 if(del){const c=C.find(x=>x.id===del);if(!c||c.author_id!==currentUser.id&&!currentAdmin){toast("You cannot delete this comment.");return}if(!confirm(UX().delete+"?"))return;const {error}=await sb.from("wm_news_comments").delete().eq("id",del);if(error)toast(error.message);else{await loadComments();await loadNews()}}
};
/* Supabase Auth and the shared account/profile dialog. */
document.body.insertAdjacentHTML("beforeend",`<div id="wm-auth" hidden><div class="wm-dialog"><button class="ib wm-close" aria-label="${UX().close}">✕</button><div class="logo"><span class="w">W</span><span class="nm">ARM<small>MEDIA</small></span><img class="hm" src="hm-logo.svg" alt="WARM MEDIA"></div><div id="wm-auth-content"></div></div></div>`);
const authBox=$("#wm-auth"),authContent=$("#wm-auth-content");
function openAuth(mode="signin"){
 authBox.hidden=false;
 if(mode==="newpassword"){
  authContent.innerHTML=`<h2>${UX().newPassword}</h2><form id="wm-new-password-form"><label>${UX().newPassword}<input name="password" type="password" required minlength="8" autocomplete="new-password"></label><label>${UX().confirm}<input name="confirm" type="password" required minlength="8" autocomplete="new-password"></label><button class="btn" type="submit">${UX().save}</button></form>`;
  return;
 }
 if(mode==="profile"&&currentUser){
  const image=avatarUrl(currentProfile?.avatar_path);
  authContent.innerHTML=`<h2>${UX().profile}</h2><p>${esc(currentUser.email||currentUser.phone||"")}</p><p>${esc(currentProfile?.display_name||"")}</p><p>${new Date(currentUser.created_at).toLocaleDateString(st.lang==="ar"?"ar":"en")}</p><label>${UX().name}<input id="wm-profile-name" maxlength="80" value="${esc(currentProfile?.display_name||"")}"></label><label>${UX().avatar}<input id="wm-avatar" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label>${image?`<img class="wm-avatar-preview" src="${esc(image)}" alt="">`:""}<button class="btn" id="wm-profile-save">${UX().save}</button><button class="btn ghost" id="wm-signout">${UX().signOut}</button>`;
  return;
 }
 const signup=mode==="signup",reset=mode==="reset";
 authContent.innerHTML=`<h2>${reset?UX().forgot:signup?UX().signUp:UX().signIn}</h2><form id="wm-auth-form">${signup?`<label>${UX().name}<input name="name" required minlength="1" maxlength="80" autocomplete="name"></label>`:""}<label>${UX().email}<input name="email" type="email" required autocomplete="email"></label>${reset?"":`<label>${UX().password}<input name="password" type="password" required minlength="8" autocomplete="${signup?"new-password":"current-password"}"></label>`}${signup?`<label>${UX().confirm}<input name="confirm" type="password" required minlength="8" autocomplete="new-password"></label>`:""}<button class="btn" type="submit">${reset?UX().forgot:signup?UX().signUp:UX().signIn}</button></form><div class="wm-auth-links">${!reset?`<button data-auth-mode="${signup?"signin":"signup"}">${signup?UX().signIn:UX().signUp}</button>`:""}${!signup?`<button data-auth-mode="${reset?"signin":"reset"}">${reset?UX().signIn:UX().forgot}</button>`:""}</div>`;
}
async function syncAccount(session){
 currentUser=session?.user||null;currentProfile=null;currentAdmin=null;
 if(currentUser){
  const [p,a]=await Promise.all([
   sb.from("wm_profiles").select("display_name,avatar_path,created_at").eq("user_id",currentUser.id).maybeSingle(),
   sb.from("wm_admins").select("user_id,display_name,avatar_path").eq("user_id",currentUser.id).maybeSingle()
  ]);
  if(p.error||a.error)toast((p.error||a.error).message);
  currentProfile=p.data;currentAdmin=a.data;
 }
 text();renderC();
}
document.addEventListener("click",async e=>{
 const mode=e.target.closest("[data-auth-mode]")?.dataset.authMode;
 if(mode){openAuth(mode);return}
 if(e.target.closest("#account")){openAuth(currentUser?"profile":"signin");return}
 if(e.target.closest(".wm-close")||e.target===authBox){authBox.hidden=true;return}
 if(e.target.closest("#wm-signout")){const {error}=await sb.auth.signOut();if(error)toast(error.message);else{authBox.hidden=true;await syncAccount(null)}return}
 if(e.target.closest("#wm-profile-save")){
  const display_name=$("#wm-profile-name").value.trim();if(!display_name){toast(UX().authError);return}
  const previousAvatar=currentProfile?.avatar_path||null;let avatar_path=previousAvatar;const file=$("#wm-avatar").files[0];
  if(file){if(!/^image\/(jpeg|png|webp|gif)$/.test(file.type)||file.size>5*1024*1024){toast(UX().uploadError);return}
   const extension={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif"}[file.type];
   avatar_path=`avatars/${currentUser.id}/${crypto.randomUUID()}.${extension}`;
   const {error}=await sb.storage.from("wm-media").upload(avatar_path,file,{contentType:file.type,upsert:false});if(error){toast(error.message);return}}
  const {error}=await sb.from("wm_profiles").update({display_name,avatar_path}).eq("user_id",currentUser.id);
  if(error){let message=error.message;if(file&&avatar_path!==previousAvatar){const cleanup=await sb.storage.from("wm-media").remove([avatar_path]);if(cleanup.error)message+=` (${cleanup.error.message})`}toast(message);return}
  if(previousAvatar&&previousAvatar!==avatar_path){const removed=await sb.storage.from("wm-media").remove([previousAvatar]);if(removed.error)toast(removed.error.message)}
  currentProfile={...currentProfile,display_name,avatar_path};toast(UX().profileSaved);openAuth("profile");text();return;
 }
 const like=e.target.closest("[data-like]");if(like){e.preventDefault();e.stopPropagation();toggleLike(like.dataset.like);return}
 const comments=e.target.closest("[data-comments]");if(comments){e.preventDefault();e.stopPropagation();activeArticleId=comments.dataset.comments;const select=$("#comment-article");if(select)select.value=activeArticleId;loadComments();$("#comments").scrollIntoView({behavior:"smooth"});return}
});
authBox.addEventListener("submit",async e=>{
 if(e.target.id==="wm-new-password-form"){
  e.preventDefault();const form=new FormData(e.target),password=String(form.get("password")||""),confirmPassword=String(form.get("confirm")||"");
  if(password.length<8||password!==confirmPassword){toast(UX().authError);return}
  const {error}=await sb.auth.updateUser({password});if(error)toast(error.message);else{authBox.hidden=true;toast(UX().saved)}
  return;
 }
 if(e.target.id!=="wm-auth-form")return;e.preventDefault();const form=new FormData(e.target),email=String(form.get("email")||"").trim(),password=String(form.get("password")||"");
 let result;
 if(e.target.querySelector('[name="confirm"]')){
  const name=String(form.get("name")||"").trim(),confirmPassword=String(form.get("confirm")||"");
  if(!name||password.length<8||password!==confirmPassword){toast(UX().authError);return}
  result=await sb.auth.signUp({email,password,options:{data:{display_name:name},emailRedirectTo:location.origin+location.pathname}});
  if(!result.error){authBox.hidden=true;toast(UX().registered);if(result.data.session)await syncAccount(result.data.session);return}
 }else if(!e.target.querySelector('[name="password"]')){
  result=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
  if(!result.error){authBox.hidden=true;toast(UX().resetSent);return}
 }else{
  result=await sb.auth.signInWithPassword({email,password});
  if(!result.error){authBox.hidden=true;await syncAccount(result.data.session);return}
 }
 toast(result.error.message||UX().authError);
});
sb.auth.onAuthStateChange((event,session)=>setTimeout(()=>{syncAccount(session);if(event==="PASSWORD_RECOVERY")openAuth("newpassword")},0));
authBox.addEventListener("change",()=>{const input=$("#wm-avatar"),file=input?.files[0];if(!file)return;if(!/^image\/(jpeg|png|webp|gif)$/.test(file.type)||file.size>5*1024*1024){toast(UX().uploadError);input.value="";return}const img=$(".wm-avatar-preview");if(img)img.src=URL.createObjectURL(file)});
/* settings */
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),1400)};
$("#gear").onclick=()=>$("#panel").classList.add("open");$("#x").onclick=()=>$("#panel").classList.remove("open");
$("#lang").onclick=()=>{st.lang=st.lang==="ar"?"en":"ar";save();text()};
$("#ths").onclick=e=>{const k=e.target.dataset.k;if(!k)return;st.theme=k;st.p=TH[k][0];st.s=TH[k][1];save();paint();text();buildMap()};
$("#p1").oninput=e=>{st.p=e.target.value;save();paint()};$("#p2").oninput=e=>{st.s=e.target.value;save();paint()};
$("#t3").onchange=e=>{st.d3=e.target.checked;save();paint()};$("#tf").onchange=e=>{st.fx=e.target.checked;save();paint()};
$("#rs").onclick=()=>{st={lang:st.lang,theme:"red",p:TH.red[0],s:TH.red[1],d3:true,fx:true};save();paint();text();toast(L().saved)};
/* globe: orthographic projection, graticule + news hubs + moving arcs */
const cv=$("#globe"),g=cv.getContext("2d");let W,H,rot=0;
const hubs=[[40.7,-74],[51.5,-.1],[25.2,55.3],[35.7,139.7],[-33.9,151.2],[30,31.2],[-23.5,-46.6],[28.6,77.2],[55.7,37.6],[1.35,103.8]];
const arcs=[[0,1],[1,2],[2,3],[3,4],[5,1],[0,6],[7,9],[8,1]];
function rs(){const d=Math.min(devicePixelRatio||1,innerWidth<700?1.5:2);W=cv.width=innerWidth*d;H=cv.height=innerHeight*d}
addEventListener("resize",rs);rs();
function pr(lat,lon,r,cx,cy){const la=lat*Math.PI/180,lo=lon*Math.PI/180+rot,x=Math.cos(la)*Math.sin(lo),y=Math.sin(la),z=Math.cos(la)*Math.cos(lo);return{x:cx+x*r,y:cy-y*r,z}}
function draw(){
 if(st.d3){const r=Math.min(W,H)*(W<H?.46:.42),cx=W*(W<H?.5:(R.dir==="rtl"?.3:.7)),cy=H*(W<H?.3:.45),col=getComputedStyle(R).getPropertyValue("--p").trim()||"#ff2a2a";
 g.clearRect(0,0,W,H);
 const gr=g.createRadialGradient(cx,cy,r*.2,cx,cy,r*1.15);gr.addColorStop(0,"rgba(0,0,0,0)");gr.addColorStop(.85,"rgba(0,0,0,0)");gr.addColorStop(1,col+"55");g.fillStyle=gr;g.beginPath();g.arc(cx,cy,r*1.15,0,7);g.fill();
 g.strokeStyle=col+"40";g.lineWidth=1;g.beginPath();g.arc(cx,cy,r,0,7);g.stroke();
 g.strokeStyle=col+"33";
 for(let la=-60;la<=60;la+=30){g.beginPath();let f=1;for(let lo=-180;lo<=180;lo+=6){const p=pr(la,lo,r,cx,cy);if(p.z<0){f=1;continue}f?g.moveTo(p.x,p.y):g.lineTo(p.x,p.y);f=0}g.stroke()}
 for(let lo=-180;lo<180;lo+=30){g.beginPath();let f=1;for(let la=-90;la<=90;la+=6){const p=pr(la,lo,r,cx,cy);if(p.z<0){f=1;continue}f?g.moveTo(p.x,p.y):g.lineTo(p.x,p.y);f=0}g.stroke()}
 if(st.fx){const t=Date.now()/1500;arcs.forEach(([a,b],i)=>{const A=hubs[a],B=hubs[b];g.strokeStyle=col+"aa";g.beginPath();let f=1,k=(t+i*.3)%1;for(let u=0;u<=1;u+=.04){if(u>k||u<k-.35)continue;const la=A[0]+(B[0]-A[0])*u,lo=A[1]+(B[1]-A[1])*u,p=pr(la,lo,r*(1+.12*Math.sin(Math.PI*u)),cx,cy);if(p.z<0){f=1;continue}f?g.moveTo(p.x,p.y):g.lineTo(p.x,p.y);f=0}g.stroke()})}
 hubs.forEach((h,i)=>{const p=pr(h[0],h[1],r,cx,cy);if(p.z<0)return;const s=3+(st.fx?Math.sin(Date.now()/400+i)*1.2:0);g.fillStyle=col;g.shadowColor=col;g.shadowBlur=14;g.beginPath();g.arc(p.x,p.y,s*devicePixelRatio/1.3,0,7);g.fill();g.shadowBlur=0});
 rot+=.0025}
 requestAnimationFrame(draw)}
let A=[];
async function loadNews(){
 const [articles,categories,stats,admins]=await Promise.all([
  sb.from("wm_news_articles").select("*").eq("status","published").order("published_at",{ascending:false,nullsFirst:false}).order("created_at",{ascending:false}),
  sb.from("wm_categories").select("id,name_ar,name_en").order("position"),
  sb.from("wm_news_stats").select("id,comment_count,like_count"),
  sb.from("wm_admins").select("user_id,display_name,avatar_path")
 ]);
 const failure=articles.error||categories.error||stats.error||admins.error;if(failure){toast(failure.message);return}
 publicAdmins=admins.data||[];
 categoryNames=[];(categories.data||[]).forEach(c=>categoryNames[c.id-1]=st.lang==="ar"?c.name_ar:c.name_en);
 newsStats=Object.fromEntries((stats.data||[]).map(s=>[s.id,s]));
 A=(articles.data||[]).map(a=>({...a,cat:a.category_id-1,au:a.author_name,admin:publicAdmins.find(x=>x.user_id===a.author_id),br:a.is_breaking,ts:Date.parse(a.published_at||a.created_at),views:a.view_count,img:a.image_path?avatarUrl(a.image_path):"",extraImages:(a.extra_images||[]).map(avatarUrl),videos:(a.video_paths||[]).map(avatarUrl)}));
 if(!activeArticleId||!A.some(a=>a.id===activeArticleId))activeArticleId=A[0]?.id||null;
 const selector=$("#comment-article");if(selector){selector.innerHTML=`<option value="">${UX().commentArticle}</option>`+A.map(a=>`<option value="${esc(a.id)}" ${a.id===activeArticleId?"selected":""}>${esc(a.title)}</option>`).join("");selector.value=activeArticleId||""}
 text();await loadComments();
}
async function toggleLike(id){
 if(!currentUser){openAuth("signin");toast(UX().authRequired);return}
 const {data:existing,error:readError}=await sb.from("wm_news_likes").select("article_id").eq("article_id",id).eq("user_id",currentUser.id).maybeSingle();
 if(readError){toast(readError.message);return}
 const result=existing?await sb.from("wm_news_likes").delete().eq("article_id",id).eq("user_id",currentUser.id):await sb.from("wm_news_likes").insert({article_id:id,user_id:currentUser.id});
 if(result.error){toast(result.error.message);return}
 await loadNews();
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function mv(i){const b=$("#bnav"),it=[...b.querySelectorAll("a,button")],t=it[i],p=b.querySelector(".pill");if(!t||!p||!t.offsetWidth)return;it.forEach(x=>x.classList.toggle("on",x===t));p.style.width=t.offsetWidth+"px";p.style.transform=`translateX(${t.offsetLeft}px)`}
function spy(){if($("#panel").classList.contains("open"))return;let k=0;["top","latest","world","comments"].forEach((id,i)=>{const e=document.getElementById(id);if(e&&!e.hidden&&e.getBoundingClientRect().top<innerHeight*.45)k=i});mv(k)}
addEventListener("scroll",spy,{passive:true});addEventListener("resize",spy);$("#x").addEventListener("click",spy);
/* reader */
document.addEventListener("click",e=>{const c=e.target.closest(".card[data-id]");if(!c||e.target.closest(".act button"))return;const a=A.find(x=>x.id===c.dataset.id),l=L();if(!a)return;activeArticleId=a.id;const selector=$("#comment-article");if(selector)selector.value=a.id;loadComments();sb.rpc("wm_increment_view",{article:a.id}).then(({error})=>{if(error)toast(error.message);else{a.views=(a.views||0)+1;text()}});$("#reader").innerHTML=`<div class="rd"><button class="ib" id="rx" style="position:absolute;top:12px;inset-inline-end:12px;z-index:2">✕</button>${a.img?`<div class="rimg" style="background:url('${esc(a.img)}') center/cover"></div>`:""}<div class="rt"><span class="cat">${esc(categoryNames[a.cat]||l.cats[a.cat])}</span>${a.br?` <span class="tag-b">${l.brk}</span>`:""}<div class="rh">${esc(a.title)}</div><div class="meta">${esc(a.au||"")} ${a.admin?`<span class="verified">✓</span> <b>${UX().admin}</b>`:""}${a.source?` · ${esc(a.source)}`:""} ${new Date(a.ts).toLocaleString(st.lang==="ar"?"ar":"en",{dateStyle:"medium",timeStyle:"short"})} · ${a.views||0} ${l.views}</div><div class="rb">${esc(a.body||"")}</div>${a.extraImages?.map(src=>`<div class="rimg" style="background:url('${esc(src)}') center/cover"></div>`).join("")||""}${a.videos?.map(src=>`<video class="news-video" controls preload="metadata" src="${esc(src)}"></video>`).join("")||""}<div class="act"><button data-like="${esc(a.id)}">♥ ${newsStats[a.id]?.like_count||0}</button><button onclick="document.getElementById('comments').scrollIntoView({behavior:'smooth'})">◌ ${newsStats[a.id]?.comment_count||0}</button></div></div></div>`;$("#reader").hidden=false});
$("#reader").onclick=e=>{if(e.target.id==="reader"||e.target.closest("#rx"))$("#reader").hidden=true};
addEventListener("keydown",e=>{if(e.key==="Escape")$("#reader").hidden=true});
/* admin lives in admin.html */
if(location.hash==="#admin")location.replace("admin.html");

/* dotted world map for the glass bar */
const LAND=[
[[-168,66],[-162,70],[-140,70],[-125,70],[-95,72],[-82,68],[-65,62],[-56,52],[-66,45],[-70,42],[-76,35],[-81,31],[-80,25],[-83,29],[-90,29],[-97,26],[-98,19],[-92,18],[-87,21],[-83,10],[-79,8],[-86,12],[-92,15],[-105,20],[-110,24],[-115,30],[-110,23],[-118,34],[-124,40],[-124,48],[-135,58],[-150,60],[-165,60]],
[[-55,60],[-45,60],[-20,70],[-20,82],[-60,82],[-70,76]],
[[-80,10],[-72,12],[-62,10],[-50,0],[-35,-6],[-40,-22],[-48,-28],[-58,-38],[-65,-42],[-68,-52],[-72,-52],[-75,-45],[-72,-30],[-70,-18],[-76,-14],[-81,-5]],
[[-10,36],[-9,43],[-2,44],[-4,48],[2,51],[8,54],[10,57],[5,60],[12,66],[20,70],[30,70],[40,66],[30,60],[28,55],[38,50],[40,45],[28,41],[24,38],[16,40],[12,44],[8,44],[3,43],[-6,36]],
[[-17,21],[-10,30],[-6,36],[10,37],[20,32],[32,31],[35,28],[43,12],[51,12],[40,-3],[40,-15],[35,-25],[27,-34],[18,-34],[12,-18],[9,-1],[9,4],[-8,4],[-17,14]],
[[28,41],[36,37],[43,37],[48,30],[57,25],[67,25],[72,20],[77,8],[80,14],[88,22],[92,22],[98,16],[100,2],[105,10],[110,20],[122,30],[122,40],[130,42],[140,46],[142,52],[155,52],[160,60],[180,66],[170,70],[140,72],[110,77],[80,73],[60,70],[40,66],[40,45]],
[[35,30],[43,30],[48,30],[56,24],[59,22],[52,16],[43,12],[35,28]],
[[130,31],[135,34],[141,36],[142,42],[145,44],[141,45],[139,38],[132,34]],
[[114,-22],[122,-18],[130,-12],[137,-12],[142,-11],[146,-19],[153,-26],[150,-37],[141,-38],[131,-31],[115,-34]],
[[95,5],[106,-6],[104,-6],[95,2]],[[109,2],[117,7],[119,0],[116,-4],[110,-3]],[[106,-6],[114,-8],[114,-7],[106,-5]],
[[-5,50],[1,51],[-2,58],[-6,57]],[[44,-25],[50,-15],[49,-12],[44,-17]],[[167,-46],[174,-41],[178,-38],[172,-35],[168,-44]]
];
const inPoly=(x,y,p)=>{let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c};
function buildMap(){
 const BH=58,LAT0=72,LAT1=-48,k=4,h=BH*k,w=Math.round(h*360/(LAT0-LAT1)),c=document.createElement("canvas");c.width=w;c.height=h;
 const x=c.getContext("2d"),step=12;x.fillStyle=st.theme==="light"?"#3a1218":"#ffffff";
 for(let py=step/2;py<h;py+=step){const lat=LAT0-py/h*(LAT0-LAT1);
  for(let px=step/2;px<w;px+=step){const lon=px/w*360-180;
   if(LAND.some(p=>inPoly(lon,lat,p))){x.globalAlpha=.9;x.beginPath();x.arc(px,py,2.6,0,7);x.fill()}}}
 R.style.setProperty("--map",`url(${c.toDataURL("image/png")})`);R.style.setProperty("--mapw",(BH*w/h)+"px")}
paint();text();buildMap();draw();
sb.auth.getSession().then(({data,error})=>{if(error){toast(error.message);return}syncAccount(data.session);loadNews()});
addEventListener("load",()=>setTimeout(()=>$("#loader").classList.add("off"),1200));
setTimeout(()=>$("#loader").classList.add("off"),2500);
