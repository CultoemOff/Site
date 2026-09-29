import asyncio, sys
from playwright.async_api import async_playwright
from PIL import Image
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name,w,h in [("fd",1440,900),("fm",390,844)]:
            pg = await b.new_page(viewport={"width":w,"height":h})
            errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type=="error" and errs.append(m.text))
            await pg.goto("http://localhost:4173/index.html"); await pg.wait_for_timeout(800)
            H = await pg.evaluate("document.body.scrollHeight")
            y=0
            while y < H:
                await pg.evaluate(f"window.scrollTo(0,{y})"); await pg.wait_for_timeout(250); y+=h//2
            await pg.wait_for_timeout(1200)
            await pg.evaluate("window.scrollTo(0,0)"); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f"/home/claude/ref/{name}.png", full_page=True)
            print(name, H, errs)
        await b.close()
asyncio.run(main())
