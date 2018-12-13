(function(){
   window.addEventListener('load', () => {
      let links = [...document.getElementsByTagName('a')].filter(a => {
         return a.hostname === window.location.hostname;
      });
      quicklink({urls:links});
   });
})();
