(()=>{
  'use strict';
  const KEY='scwwLanguageV1';
  const button=document.getElementById('languageSwitch');
  if(!button||typeof renderLanguage!=='function')return;

  try{
    const saved=localStorage.getItem(KEY);
    if(saved==='en'||saved==='fr'){
      language=saved;
      renderLanguage();
    }
  }catch{}

  button.addEventListener('click',()=>{
    try{localStorage.setItem(KEY,language)}catch{}
  });
})();
