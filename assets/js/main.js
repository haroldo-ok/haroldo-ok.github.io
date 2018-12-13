(function(){
   window.addEventListener('load', () => {
      let rx = /^\/[\w-]+\/?$/; 
      let links = [...document.getElementsByTagName('a')].filter(a => {
         return a.hostname === window.location.hostname && rx.test(a.pathname);
      });
      quicklink({urls:links});
   });
})();
