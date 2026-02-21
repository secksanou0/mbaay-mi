document.addEventListener('DOMContentLoaded', ()=>{
  const abonnes = window.getAbonnes();
  document.getElementById('dash-abonnes').textContent = String(abonnes);
  const annonces = JSON.parse(localStorage.getItem('mbaay_annonces')||'[]');
  document.getElementById('dash-annonces').textContent = String(annonces.length||0);
  const messages = JSON.parse(localStorage.getItem('mbaay_messages')||'[]');
  document.getElementById('dash-messages').textContent = String(messages.length||0);

  const recent = JSON.parse(localStorage.getItem('mbaay_subscriptions')||'[]');
  const recentEl = document.getElementById('recent-subs');
  if(recentEl){
    recent.slice(0,8).forEach(r=>{
      const li = document.createElement('li');
      li.textContent = `${r.who||'anonyme'} — ${new Date(r.at).toLocaleString()}`;
      recentEl.appendChild(li);
    });
  }

  // simple simulated activity chart: create bars from last 5 days subscriptions
  const chart = document.getElementById('chart');
  if(chart){
    // compute counts per last 5 days
    const days = 5; const counts = Array(days).fill(0);
    const now = new Date();
    recent.forEach(r=>{
      const d = new Date(r.at);
      const diff = Math.floor((now - d)/(1000*60*60*24));
      if(diff>=0 && diff<days) counts[diff]++;
    });
    const max = Math.max(1, ...counts);
    for(let i=days-1;i>=0;i--){
      const bar = document.createElement('div');
      bar.className='bar';
      const h = Math.round((counts[i]/max)*140)+10;
      bar.style.height = h+'px';
      bar.title = `${counts[i]} abonnements il y a ${i}j`;
      chart.appendChild(bar);
    }
  }
});
