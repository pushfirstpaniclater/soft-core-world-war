(()=>{
  'use strict';
  const load=src=>new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;
    script.onload=resolve;
    script.onerror=reject;
    document.head.append(script);
  });

  load('assets/language-persistence.js')
    .catch(()=>{})
    .finally(()=>load('https://raw.githubusercontent.com/pushfirstpaniclater/soft-core-world-war/d16da789f1674c3bab9cb7fd3abffe6db4bbaff0/assets/radio.js'))
    .catch(()=>{});
})();
