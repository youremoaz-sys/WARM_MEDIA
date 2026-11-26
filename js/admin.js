const $=s=>document.querySelector(s),R=document.documentElement;
const SUPABASE_URL="https://jntlxhkftcdbepkfppdi.supabase.co",SUPABASE_KEY="sb_publishable_KIyYdrrserJ07BVMm8BDhw_Phb-X7No";
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const T={ar:{login:"دخول لوحة الإدارة",email:"البريد الإلكتروني",password:"كلمة المرور",enter:"دخول",bad:"هذا الحساب لا يملك صلاحية الإدارة.",art:"الأخبار",cm:"إدارة التعليقات",users:"المستخدمون",cats:"التصنيفات",new:"خبر جديد",edit:"تعديل",title:"عنوان الخبر",au:"اسم الكاتب",body:"نص الخبر",img:"الصورة الرئيسية",br:"خبر عاجل",save:"حفظ الخبر",draft:"حفظ كمسودة",source:"المصدر أو الجهة المرسلة",extras:"صور إضافية",videos:"فيديوهات",need:"اكتب عنوان الخبر ونصه",exit:"العودة للموقع",noNews:"لا توجد أخبار.",noCm:"لا توجد تعليقات.",del:"حذف",saved:"تم الحفظ",out:"خروج",nA:"الأخبار",nB:"المستخدمون",nC:"التعليقات",views:"المشاهدات",sure:"متأكد من الحذف؟",catsList:["عالمي","محلي","تقنية","اقتصاد","رياضة","تحليلات"],panel:"لوحة الإدارة",publish:"نشر",name:"اسم التصنيف",add:"إضافة",draftLabel:"مسودة",published:"منشور",media:"صورة أو فيديو غير مدعوم أو تجاوز حجم 100MB.",unauth:"سجّل الدخول بحساب مسؤول مُعتمد.",admin:"Admin",verified:"موثّق",category:"التصنيف",status:"الحالة"},
en:{login:"Admin sign in",email:"Email",password:"Password",enter:"Sign in",bad:"This account is not an administrator.",art:"Articles",cm:"Comments",users:"Users",cats:"Categories",new:"New article",edit:"Edit",title:"Headline",au:"Author name",body:"Article text",img:"Cover image",br:"Breaking news",save:"Publish article",draft:"Save draft",source:"Source or submitting organization",extras:"Additional images",videos:"Videos",need:"Enter a headline and article text",exit:"Back to site",noNews:"No articles.",noCm:"No comments.",del:"Delete",saved:"Saved",out:"Sign out",nA:"Articles",nB:"Users",nC:"Comments",views:"Views",sure:"Delete this item?",catsList:["World","Local","Tech","Economy","Sports","Analysis"],panel:"Admin panel",publish:"Publish",name:"Category name",add:"Add",draftLabel:"Draft",published:"Published",media:"Unsupported file or size exceeds 100MB.",unauth:"Sign in with an approved administrator account.",admin:"Admin",verified:"Verified",category:"Category",status:"Status"}};
let lang="ar",tab="news",adminUser=null,profile=null,editing=null,articles=[],comments=[],users=[],categories=[],busy=false;
try{lang=JSON.parse(localStorage.getItem("wm")||"{}").lang||"ar"}catch(e){}
const L=()=>T[lang],esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),1800)};
const logo='<a class="logo" href="index.html"><span class="w">W</span><span class="nm">ARM<small>MEDIA</small></span><img class="hm" src="hm-logo.svg" alt="WARM MEDIA"></a>';
const pubUrl=path=>path?sb.storage.from("wm-media").getPublicUrl(path).data.publicUrl:"";
function paint(){R.lang=lang;R.dir=lang==="ar"?"rtl":"ltr";try{const st=JSON.parse(localStorage.getItem("wm")||"{}");R.style.setProperty("--p",st.p||"#ff2a2a");R.style.setProperty("--s",st.s||"#7a0b12");R.dataset.theme=st.theme==="light"?"light":"dark"}catch(e){}}
function gate(message=""){
 paint();$("#ad").innerHTML=`<div class="gate">${logo}<h2 style="margin:6px 0 0">${L().login}</h2>${message?`<p>${esc(message)}</p>`:""}<form id="login-form"><input name="email" type="email" placeholder="${L().email}" autocomplete="username" required><input name="password" type="password" placeholder="${L().password}" autocomplete="current-password" required><button class="btn" type="submit">${L().enter}</button></form><a href="index.html" style="color:var(--p);font-size:.9rem">${L().exit}</a></div>`;
}
async function checkAdmin(session){
 adminUser=session?.user||null;profile=null;
 if(!adminUser){gate();return}
 const [adminResult,profileResult]=await Promise.all([
  sb.from("wm_admins").select("user_id,display_name,avatar_path").eq("user_id",adminUser.id).maybeSingle(),
  sb.from("wm_profiles").select("display_name,avatar_path").eq("user_id",adminUser.id).maybeSingle()
 ]);
 if(adminResult.error||profileResult.error){toast((adminResult.error||profileResult.error).message);gate();return}
 if(!adminResult.data){gate(L().bad);return}
 profile={...adminResult.data,avatar_path:adminResult.data.avatar_path||profileResult.data?.avatar_path||null};await refreshData();render();
}
async function refreshData(){
 const [news,cm,usersResult,catsResult]=await Promise.all([
  sb.from("wm_news_articles").select("*").order("created_at",{ascending:false}),
  sb.from("wm_news_comments").select("id,article_id,author_id,content,is_featured,created_at").order("created_at",{ascending:false}),
  sb.rpc("wm_admin_list_users"),
  sb.from("wm_categories").select("id,name_ar,name_en,position").order("position")
 ]);
 const fail=news.error||cm.error||usersResult.error||catsResult.error;if(fail){toast(fail.message);return}
 articles=news.data||[];comments=cm.data||[];users=usersResult.data||[];categories=catsResult.data||[];
}
function render(){
 paint();const l=L(),name=profile?.display_name||adminUser.email||"Admin";
 const stats=`<div class="stats"><div class="stat"><b>${articles.length}</b><span>${l.nA}</span></div><div class="stat"><b>${users.length}</b><span>${l.nB}</span></div><div class="stat"><b>${comments.length}</b><span>${l.nC}</span></div><div class="stat"><b>${articles.reduce((n,a)=>n+Number(a.view_count||0),0)}</b><span>${l.views}</span></div></div>`;
 const head=`<div class="top">${logo}<div class="acts">${profile?.avatar_path?`<img class="admin-avatar" src="${esc(pubUrl(profile.avatar_path))}" alt="">`:""}<span>${esc(name)} <span class="verified">✓</span> <b>${l.admin}</b></span><button class="ib" id="lang">${lang==="ar"?"EN":"ع"}</button><a class="btn ghost" href="index.html">${l.exit}</a><button class="btn" id="logout">${l.out}</button></div></div>${stats}<div class="tabs">${[["news",l.art],["comments",l.cm],["users",l.users],["categories",l.cats]].map(([k,v])=>`<button data-tab="${k}" class="${tab===k?"on":""}">${v}</button>`).join("")}</div>`;
 let body="";
 if(tab==="news")body=newsTab();
 if(tab==="comments")body=commentsTab();
 if(tab==="users")body=usersTab();
 if(tab==="categories")body=categoriesTab();
 $("#ad").innerHTML=head+body;
}
function newsTab(){
 const l=L(),f=editing||{},extraImages=f.extra_images||[],videoPaths=f.video_paths||[];
 const options=categories.map(c=>`<option value="${c.id}" ${f.category_id===c.id?"selected":""}>${esc(lang==="ar"?c.name_ar:c.name_en)}</option>`).join("");
 return `<form class="fm" id="news-form"><input name="title" maxlength="240" required placeholder="${l.title}" value="${esc(f.title||"")}"><select name="category_id" required>${options}</select><input name="author_name" maxlength="120" placeholder="${l.au}" value="${esc(f.author_name||"")}"><input name="source" maxlength="240" placeholder="${l.source}" value="${esc(f.source||"")}"><textarea name="body" rows="7" required placeholder="${l.body}">${esc(f.body||"")}</textarea><label>${l.img}<input name="cover" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif"></label>${f.image_path?`<div class="rimg" style="background:url('${esc(pubUrl(f.image_path))}') center/cover"></div><button type="button" data-remove-cover="1">${l.del} ${l.img}</button>`:""}<label>${l.extras}<input name="extras" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple></label>${extraImages.map(path=>`<div class="li"><a target="_blank" rel="noopener" href="${esc(pubUrl(path))}">${esc(path.split("/").pop())}</a><button type="button" data-remove-media="extra" data-path="${encodeURIComponent(path)}">${l.del}</button></div>`).join("")}<label>${l.videos}<input name="videos" type="file" accept="video/mp4,video/webm,video/quicktime" multiple></label>${videoPaths.map(path=>`<div class="li"><a target="_blank" rel="noopener" href="${esc(pubUrl(path))}">${esc(path.split("/").pop())}</a><button type="button" data-remove-media="video" data-path="${encodeURIComponent(path)}">${l.del}</button></div>`).join("")}<label><input name="is_breaking" type="checkbox" ${f.is_breaking?"checked":""}> ${l.br}</label><div class="acts"><button class="btn" type="submit" data-status="published">${l.save}</button><button class="btn ghost" type="submit" data-status="draft">${l.draft}</button>${editing?`<button class="btn ghost" type="button" id="new-news">${l.new}</button>`:""}</div></form>${articles.map(a=>`<div class="li"><span>${esc(a.title)} <small>· ${a.status==="draft"?l.draftLabel:l.published}</small></span><span><button data-edit="${a.id}">${l.edit}</button>${a.status==="draft"?`<button data-publish="${a.id}">${l.publish}</button>`:""}<button data-delete-news="${a.id}">${l.del}</button></span></div>`).join("")||`<p class="empty">${l.noNews}</p>`}`;
}
function commentsTab(){
 const l=L();return comments.map(c=>{const a=articles.find(x=>x.id===c.article_id),u=users.find(x=>x.user_id===c.author_id);return `<div class="li"><span><b>${esc(u?.display_name||"User")}</b>: ${esc(c.content)}<small> · ${esc(a?.title||"")}</small></span><span><button data-pin-comment="${c.id}">${c.is_featured?"★":"☆"} ${l.verified}</button><button data-delete-comment="${c.id}">${l.del}</button></span></div>`}).join("")||`<p class="empty">${l.noCm}</p>`;
}
function usersTab(){
 const l=L();return users.map(u=>`<div class="li"><span><b>${esc(u.display_name||"User")}</b> ${u.is_admin?`<span class="verified">✓</span> <b>${l.admin}</b>`:""}<br><small>${esc(u.email||u.phone||"")} · ${new Date(u.created_at).toLocaleDateString(lang==="ar"?"ar":"en")}</small></span></div>`).join("")||`<p class="empty">${l.nB}</p>`;
}
function categoriesTab(){
 const l=L();return `<form class="fm" id="category-form"><input name="name_ar" maxlength="80" placeholder="${l.name} (عربي)" required><input name="name_en" maxlength="80" placeholder="${l.name} (English)" required><button class="btn">${l.add}</button></form>`+categories.map(c=>`<div class="li"><span>${esc(c.name_ar)} · ${esc(c.name_en)}</span><button data-delete-category="${c.id}">${l.del}</button></div>`).join("");
}
async function upload(file,path){
 const allowed=file.type.startsWith("image/")?/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type):/^video\/(mp4|webm|quicktime)$/.test(file.type);
 if(!allowed||file.size>100*1024*1024)throw new Error(L().media);
 const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_"),full=`news/${path}/${crypto.randomUUID()}-${safeName}`;
 const {error}=await sb.storage.from("wm-media").upload(full,file,{contentType:file.type,upsert:false});
 if(error)throw error;return full;
}
async function saveNews(form,status){
 if(busy)return;busy=true;const values=new FormData(form),title=String(values.get("title")||"").trim(),body=String(values.get("body")||"").trim();
 if(!title||!body){busy=false;toast(L().need);return}
 const staged=[];
 try{
  const old=editing||{},uploadStaged=async(file,folder)=>{const path=await upload(file,folder);staged.push(path);return path},cover=values.get("cover"),image_path=cover?.size?await uploadStaged(cover,"covers"):old.image_path||null;
  const extraFiles=Array.from(form.elements.extras.files),videoFiles=Array.from(form.elements.videos.files);
  const extra_images=[...(old.extra_images||[]),...await Promise.all(extraFiles.map(f=>uploadStaged(f,"images")))];
  const video_paths=[...(old.video_paths||[]),...await Promise.all(videoFiles.map(f=>uploadStaged(f,"videos")))];
  const record={title,body,category_id:Number(values.get("category_id")),author_id:adminUser.id,author_name:String(values.get("author_name")||"").trim()||profile.display_name,source:String(values.get("source")||"").trim(),image_path,extra_images,video_paths,is_breaking:values.get("is_breaking")==="on",status,published_at:status==="published"?(old.published_at||new Date().toISOString()):null};
  const result=editing?await sb.from("wm_news_articles").update(record).eq("id",editing.id):await sb.from("wm_news_articles").insert(record);
  if(result.error)throw result.error;
  staged.length=0;let message=L().saved;
  if(old.image_path&&old.image_path!==image_path){const removed=await sb.storage.from("wm-media").remove([old.image_path]);if(removed.error)message+=` (${removed.error.message})`}
  editing=null;await refreshData();render();toast(message);
 }catch(error){let message=error.message||L().media;if(staged.length){const cleanup=await sb.storage.from("wm-media").remove(staged);if(cleanup.error)message+=` (${cleanup.error.message})`}toast(message)}finally{busy=false}
}
$("#ad").addEventListener("submit",async e=>{
 if(e.target.id==="login-form"){e.preventDefault();const fd=new FormData(e.target),{data,error}=await sb.auth.signInWithPassword({email:String(fd.get("email")).trim(),password:String(fd.get("password"))});if(error){toast(error.message);return}await checkAdmin(data.session);return}
 if(e.target.id==="news-form"){e.preventDefault();await saveNews(e.target,e.submitter?.dataset.status||"published");return}
 if(e.target.id==="category-form"){e.preventDefault();const fd=new FormData(e.target),{error}=await sb.from("wm_categories").insert({name_ar:String(fd.get("name_ar")).trim(),name_en:String(fd.get("name_en")).trim(),position:categories.length+1});if(error)toast(error.message);else{await refreshData();render()}}
});
$("#ad").addEventListener("click",async e=>{
 const b=e.target.closest("button");if(!b)return;
 if(b.id==="lang"){lang=lang==="ar"?"en":"ar";try{const st=JSON.parse(localStorage.getItem("wm")||"{}");st.lang=lang;localStorage.setItem("wm",JSON.stringify(st))}catch{}render();return}
 if(b.id==="logout"){const {error}=await sb.auth.signOut();if(error)toast(error.message);else{adminUser=null;gate()}return}
 if(b.id==="new-news"){editing=null;render();return}
 if(b.dataset.tab){tab=b.dataset.tab;editing=null;await refreshData();render();return}
 if(b.dataset.edit){editing=articles.find(a=>a.id===b.dataset.edit);tab="news";render();scrollTo(0,0);return}
 if(b.dataset.deleteNews){if(!confirm(L().sure))return;const article=articles.find(a=>a.id===b.dataset.deleteNews);const {error}=await sb.from("wm_news_articles").delete().eq("id",b.dataset.deleteNews);if(error)toast(error.message);else{const paths=[article?.image_path,...(article?.extra_images||[]),...(article?.video_paths||[])].filter(Boolean);if(paths.length){const removed=await sb.storage.from("wm-media").remove(paths);if(removed.error)toast(removed.error.message)}await refreshData();render()}return}
 if(b.dataset.removeCover&&editing){const path=editing.image_path,{error}=await sb.from("wm_news_articles").update({image_path:null}).eq("id",editing.id);if(error){toast(error.message);return}const removed=await sb.storage.from("wm-media").remove([path]);if(removed.error)toast(removed.error.message);editing={...editing,image_path:null};await refreshData();render();return}
 if(b.dataset.removeMedia&&editing){const path=decodeURIComponent(b.dataset.path),key=b.dataset.removeMedia==="extra"?"extra_images":"video_paths",next=(editing[key]||[]).filter(x=>x!==path);const {error}=await sb.from("wm_news_articles").update({[key]:next}).eq("id",editing.id);if(error){toast(error.message);return}const removed=await sb.storage.from("wm-media").remove([path]);if(removed.error)toast(removed.error.message);editing={...editing,[key]:next};await refreshData();render();return}
 if(b.dataset.publish){const {error}=await sb.from("wm_news_articles").update({status:"published",published_at:new Date().toISOString()}).eq("id",b.dataset.publish);if(error)toast(error.message);else{await refreshData();render()}return}
 if(b.dataset.deleteComment){if(!confirm(L().sure))return;const {error}=await sb.from("wm_news_comments").delete().eq("id",b.dataset.deleteComment);if(error)toast(error.message);else{await refreshData();render()}return}
 if(b.dataset.pinComment){const comment=comments.find(c=>c.id===b.dataset.pinComment);const {error}=await sb.from("wm_news_comments").update({is_featured:!comment.is_featured}).eq("id",comment.id);if(error)toast(error.message);else{await refreshData();render()}return}
 if(b.dataset.deleteCategory){if(!confirm(L().sure))return;const {error}=await sb.from("wm_categories").delete().eq("id",b.dataset.deleteCategory);if(error)toast(error.message);else{await refreshData();render()}return}
});
sb.auth.onAuthStateChange((_event,session)=>setTimeout(()=>checkAdmin(session),0));
sb.auth.getSession().then(({data,error})=>{if(error){toast(error.message);gate()}else if(data.session)checkAdmin(data.session);else gate()});
