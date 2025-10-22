const ytInput = document.getElementById('ytUrl');
const ytBtn = document.getElementById('loadYt');
const loadLocalBtn = document.getElementById('loadLocal');
const ytIframe = document.getElementById('ytIframe');
const localVideo = document.getElementById('localVideo');
const videoTitle = document.getElementById('videoTitle');
const videoDesc = document.getElementById('videoDesc');
const videosList = document.getElementById('videosList');

// --- YouTube ---
function youtubeIdFromUrl(url){
  if(!url) return null;
  try{
    const u = new URL(url.startsWith('http') ? url : 'https://' + url);
    if(u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if(u.hostname.includes('youtube.com')){
      if(u.searchParams.get('v')) return u.searchParams.get('v');
    }
  }catch(e){}
  const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return m ? m[1] : null;
}

function showYT(id){
  localVideo.style.display='none';
  localVideo.pause();
  ytIframe.style.display='block';
  ytIframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1';
  videoTitle.textContent = 'YouTube — ' + id;
  videoDesc.textContent = '';
}

ytBtn.addEventListener('click', ()=>{
  const id = youtubeIdFromUrl(ytInput.value.trim());
  if(!id){ alert('URL inválida'); return; }
  showYT(id);
});

ytInput.addEventListener('keydown', e=>{ if(e.key==='Enter') ytBtn.click() });

// --- Local videos ---
function showLocal(src, name){
  ytIframe.style.display='none';
  ytIframe.src = '';
  localVideo.style.display='block';
  localVideo.src = src;
  localVideo.play().catch(()=>{});
  videoTitle.textContent = name;
  videoDesc.textContent = src;
}

loadLocalBtn.addEventListener('click', ()=>{
  const first = videosList.querySelector('.video-item');
  if(first) first.click();
  else alert('No hay videos listados.');
});

// --- Cargar videos desde videos.json ---
async function loadVideos(){
  try{
    const r = await fetch('videos.json');
    if(r.ok){
      const arr = await r.json();
      renderList(arr);
    } else {
      videosList.innerHTML = '<div class="small">No se pudo cargar videos.json</div>';
    }
  }catch(e){
    videosList.innerHTML = '<div class="small">Error al cargar videos.json</div>';
  }
}

function renderList(arr){
  if(!Array.isArray(arr) || arr.length===0){
    videosList.innerHTML = '<div class="small">No hay videos listados</div>';
    return;
  }
  videosList.innerHTML = '';
  arr.forEach(name=>{
    const item = document.createElement('div');
    item.className='video-item';
    item.innerHTML = `<div class="thumb">VID</div><div><div class="title">${name}</div><div class="small">${name}</div></div>`;
    item.addEventListener('click', ()=> showLocal(name, name));
    videosList.appendChild(item);
  });
}

// inicial
loadVideos();
