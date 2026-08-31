
function toggleMenu(){
  const links=document.querySelector('.links');
  if(!links)return;
  const open=links.dataset.open==='1';
  links.dataset.open=open?'0':'1';
  links.style.display=open?'':'flex';
  links.style.flexDirection='column';
  links.style.position='absolute';
  links.style.top='68px'; links.style.right='18px';
  links.style.padding='18px'; links.style.background='#fff';
  links.style.border='1px solid #e7ebf2'; links.style.borderRadius='18px';
  links.style.boxShadow='0 20px 50px rgba(8,43,99,.15)';
}
document.querySelectorAll('.filter').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('.dest').forEach(card=>{
      card.style.display=(f==='all'||card.dataset.cat===f)?'block':'none';
    });
  });
});
const form=document.getElementById('contactForm');
if(form){
  const params=new URLSearchParams(location.search);
  const d=params.get('destination');
  if(d) document.getElementById('destination').value=d;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(form);
    const subject=encodeURIComponent('Demande de voyage — '+(data.get('destination')||'New Age Travel France'));
    const body=encodeURIComponent(
      'Nom : '+data.get('name')+'\nTéléphone : '+data.get('phone')+'\nEmail : '+data.get('email')+
      '\nDestination : '+data.get('destination')+'\nPériode : '+data.get('period')+'\n\nProjet :\n'+data.get('message')
    );
    const toast=document.getElementById('toast'); toast.style.display='block';
    setTimeout(()=>toast.style.display='none',5000);
    // Remplacez l'adresse ci-dessous par l'e-mail officiel de l'agence lorsqu'il est confirmé.
    window.location.href='mailto:?subject='+subject+'&body='+body;
  });
}
