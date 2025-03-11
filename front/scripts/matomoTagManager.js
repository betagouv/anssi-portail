if (localStorage.getItem('optOutMatomo') !== 'true') {
  const urlTagManager = document.getElementById('script-matomo-tag-manager').dataset.urlTagManagerMatomo;
  var _mtm = window._mtm = window._mtm || [];
  _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
  (function() {
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true;
    g.src=urlTagManager;
    s.parentNode.insertBefore(g,s);
  })();
}