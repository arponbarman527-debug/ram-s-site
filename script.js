document.querySelectorAll('.menu-toggle').forEach(button=>{
  button.addEventListener('click',()=>{
    const nav=document.querySelector('.nav');
    const open=nav.classList.toggle('open');
    button.setAttribute('aria-expanded',String(open));
  });
});
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
