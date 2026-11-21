(()=>{'use strict';
const $=(q,base=document)=>base.querySelector(q), $$=(q,base=document)=>Array.from(base.querySelectorAll(q));
// Mobile menu
const menuBtn=$('#menuOpen'),menu=$('#navMenu');
if(menuBtn&&menu){
 const toggle=(open)=>{menu.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'بستن منو':'باز کردن منو');};
 menuBtn.addEventListener('click',()=>toggle(!menu.classList.contains('open')));
 $$('#navMenu a').forEach(a=>a.addEventListener('click',()=>toggle(false)));
 document.addEventListener('keydown',ev=>{if(ev.key==='Escape')toggle(false)});
 document.addEventListener('click',ev=>{if(!menu.contains(ev.target)&&!menuBtn.contains(ev.target))toggle(false)});
}
// Featured-project carousel (RTL aware)
const track=$('#featureTrack');
if(track){$$('[data-carousel-dir]').forEach(btn=>btn.addEventListener('click',()=>{
 const step=Math.max(210,Math.round(track.clientWidth*.55));
 track.scrollBy({left:btn.dataset.carouselDir==='next'?-step:step,behavior:'smooth'});
}));}
// Portfolio filtering and category jump links
const cards=$$('[data-kind]'),filters=$$('[data-filter]');
function setFilter(kind){if(!cards.length)return;
 cards.forEach(card=>{card.hidden=kind!=='all'&&card.dataset.kind!==kind});
 filters.forEach(f=>{const on=f.dataset.filter===kind;f.classList.toggle('active',on);f.setAttribute('aria-pressed',String(on))});
}
filters.forEach(f=>f.addEventListener('click',()=>setFilter(f.dataset.filter)));
$$('[data-quick-filter]').forEach(link=>link.addEventListener('click',()=>setFilter(link.dataset.quickFilter)));
// Search dialog with index of real pages, not a fake server search
const dialog=$('#searchDialog'), open=$('#searchOpen'),close=$('#searchClose'),input=$('#siteSearch'),results=$('#searchResults'),dataNode=$('#searchData');
if(dialog&&open&&close&&input&&results&&dataNode){
 let items=[];try{items=JSON.parse(dataNode.textContent)}catch{}
 const render=()=>{const q=input.value.trim().toLocaleLowerCase('fa-IR');results.replaceChildren();
  const matches=items.filter(it=>(it.title+' '+it.group).toLocaleLowerCase('fa-IR').includes(q)).slice(0,9);
  if(!matches.length){const p=document.createElement('p');p.textContent='موردی پیدا نشد.';results.append(p);return}
  for(const it of matches){const a=document.createElement('a');a.href=it.href;
   const img=document.createElement('img');img.src=it.img;img.alt='';img.loading='lazy';
   const div=document.createElement('div'),b=document.createElement('b'),sm=document.createElement('small');b.textContent=it.title;sm.textContent=it.group;div.append(b,sm);a.append(img,div);results.append(a);
  }
 };
 open.addEventListener('click',()=>{if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');render();input.focus()});
 close.addEventListener('click',()=>dialog.close?dialog.close():dialog.removeAttribute('open'));
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 input.addEventListener('input',render);
}
// Inquiry form deliberately does not send personal data anywhere
const form=$('#requestForm'),status=$('#formStatus'),manual=$('#manualCopy');
if(form&&status&&manual){form.addEventListener('submit',async e=>{e.preventDefault();
 const fd=new FormData(form), name=String(fd.get('name')||'').trim(),kind=String(fd.get('type')||'').trim(),desc=String(fd.get('desc')||'').trim();
 if(!name||!kind||!desc){status.textContent='لطفاً تمام موارد لازم را وارد کنید.';return}
 const message=`درخواست سفارش ووتال\nنام: ${name}\nنوع محصول: ${kind}\nتوضیحات: ${desc}`;
 manual.value=message;
 try{
  if(!navigator.clipboard||!window.isSecureContext)throw new Error('not secure');
  await navigator.clipboard.writeText(message);status.textContent='متن درخواست کپی شد. می‌توانید آن را از راه ارتباطی رسمی ووتال ارسال کنید.';manual.classList.remove('show');
 }catch{status.textContent='کپی خودکار ممکن نشد؛ متن زیر را انتخاب و کپی کنید.';manual.classList.add('show');manual.focus();manual.select()}
});}
})();

// V11.1 -- keep the navigation visible and indicate document reading position.
(()=>{'use strict';
 const nav=document.querySelector('.nav-wrap');
 const progress=document.querySelector('.scroll-progress');
 if(!nav || !progress) return;
 let pending=false;
 function update(){
  pending=false;
  const doc=document.documentElement;
  const max=Math.max(0,doc.scrollHeight-doc.clientHeight);
  const y=Math.max(0,window.scrollY || doc.scrollTop || 0);
  const ratio=max>0? Math.min(1,y/max):1;
  const percentage=Math.round(ratio*100);
  progress.style.setProperty('--page-progress',(ratio*100).toFixed(2)+'%');
  progress.setAttribute('aria-valuenow',String(percentage));
  nav.classList.toggle('is-scrolled',y>24);
 }
 function schedule(){if(!pending){pending=true;window.requestAnimationFrame(update);}}
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('load',schedule);
 document.addEventListener('DOMContentLoaded',schedule);
 update();
})();
