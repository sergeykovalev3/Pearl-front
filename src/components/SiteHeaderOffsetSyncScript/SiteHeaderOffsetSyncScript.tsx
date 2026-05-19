export function SiteHeaderOffsetSyncScript() {
  const code =
    '(function(){function s(){var e=document.querySelector("[data-site-header]");if(!e)return;var r=e.getBoundingClientRect(),t=getComputedStyle(e),n=parseFloat(t.marginBottom||t.marginBlockEnd||"0")||0,a=Math.max(0,Math.ceil(r.bottom+n)),b=document.body;if(!b)return;b.style.setProperty("--site-header-offset",a+"px")}s();})();';

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
