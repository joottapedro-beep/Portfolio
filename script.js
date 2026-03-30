const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} });
},{threshold:0.08});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

function toggleProject(id){
  const p=document.getElementById(id);
  const open=p.classList.contains('open');
  document.querySelectorAll('.proj-panel').forEach(x=>x.classList.remove('open'));
  if(!open) p.classList.add('open');
}

const galleries={
  acores:{title:"Açores",sub:"2025 · Paisagem",photos:["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1400&q=90","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=90","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1400&q=90","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=90","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=90"]},
  caramulo:{title:"Caramulo",sub:"2025 · Automóveis",photos:["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=90","https://images.unsplash.com/photo-1469285994282-454ceb49e63c?w=1400&q=90","https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1400&q=90","https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1400&q=90"]},
  anadia:{title:"Anadia",sub:"2025 · Desporto",photos:["https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1400&q=90","https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=90","https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1400&q=90","https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1400&q=90"]},
  malta:{title:"Malta",sub:"2025 · Viagens",photos:["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=90","https://images.unsplash.com/photo-1555993539-1732b0258235?w=1400&q=90","https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1400&q=90","https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=1400&q=90"]},
  suecia:{title:"Suécia",sub:"2026 · Viagens",photos:["https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1400&q=90","https://images.unsplash.com/photo-1516108317508-6788f6a160e4?w=1400&q=90","https://images.unsplash.com/photo-1531436107035-30bb9e62e3e6?w=1400&q=90","https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400&q=90"]},
  noruega:{title:"Noruega",sub:"2026 · Viagens",photos:["https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1400&q=90","https://images.unsplash.com/photo-1520769945061-0a448c463865?w=1400&q=90","https://images.unsplash.com/photo-1504197885937-0b0f35462380?w=1400&q=90","https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400&q=90"]}
};
let cur=null,idx=0;
function openGallery(key){cur=galleries[key];idx=0;document.getElementById('galTitle').textContent=cur.title;document.getElementById('galSub').textContent=cur.sub;render();document.getElementById('galleryOverlay').classList.add('open');document.body.style.overflow='hidden';}
function closeGallery(){document.getElementById('galleryOverlay').classList.remove('open');document.body.style.overflow='';}
function render(){const img=document.getElementById('galImg');img.style.opacity=0;img.src=cur.photos[idx];img.onload=()=>img.style.opacity=1;document.getElementById('galCounter').textContent=(idx+1)+' de '+cur.photos.length;const th=document.getElementById('galThumbs');th.innerHTML='';cur.photos.forEach((src,i)=>{const t=document.createElement('img');t.src=src;t.className='g-thumb'+(i===idx?' active':'');t.onclick=()=>{idx=i;render();};th.appendChild(t);});}
function changePhoto(d){idx=(idx+d+cur.photos.length)%cur.photos.length;render();}
document.addEventListener('keydown',e=>{if(!document.getElementById('galleryOverlay').classList.contains('open'))return;if(e.key==='ArrowRight')changePhoto(1);if(e.key==='ArrowLeft')changePhoto(-1);if(e.key==='Escape')closeGallery();});

function openCV(){
  document.getElementById('cvOverlay').style.transform='translateX(0)';
  document.body.style.overflow='hidden';
}
function closeCV(){
  document.getElementById('cvOverlay').style.transform='translateX(100%)';
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){
  if(e.key==='Escape') closeCV();
});
