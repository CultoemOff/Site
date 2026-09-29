import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for w,h in [(360,740),(390,844),(768,1024),(1024,768),(1280,800),(1920,1080)]:
            pg = await b.new_page(viewport={"width":w,"height":h})
            await pg.goto("http://localhost:4173/index.html"); await pg.wait_for_timeout(800)
            r = await pg.evaluate("""() => { const W=document.documentElement.clientWidth; const bad=[];
              document.querySelectorAll('main *, footer *, header *').forEach(el=>{const r=el.getBoundingClientRect(); if(r.width>0 && (r.right>W+1) && !el.closest('.stage,.eco__svg,.hero,[aria-hidden=true]')) bad.push(el.className && el.className.baseVal===undefined ? el.className : el.tagName)});
              return {sw:document.documentElement.scrollWidth, W, bad:[...new Set(bad)].slice(0,8)} }""")
            print(w, r)
        await b.close()
asyncio.run(main())
