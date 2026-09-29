import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for n,w,h in [("cine_d",1440,900),("cine_m",390,844)]:
            pg = await b.new_page(viewport={"width":w,"height":h})
            await pg.goto("http://localhost:4173/index.html"); await pg.wait_for_timeout(500)
            await pg.evaluate("document.getElementById('bastidores').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(2500)
            await pg.screenshot(path=f"/home/claude/ref/{n}.png")
        await b.close()
asyncio.run(main())
