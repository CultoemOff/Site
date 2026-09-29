import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width":1440,"height":810})
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:4173/index.html"); await pg.wait_for_timeout(800)
        await pg.add_style_tag(content=".hero__content,.hero__shade,.nav{display:none!important}")
        for name,(x,y) in [("left",(250,520)),("right",(1250,420))]:
            for i in range(40):
                await pg.mouse.move(x+i%3, y); await pg.wait_for_timeout(50)
            await pg.wait_for_timeout(1800)
            await pg.screenshot(path=f"/home/claude/ref/m_{name}.png")
        print(errs)
        await b.close()
asyncio.run(main())
