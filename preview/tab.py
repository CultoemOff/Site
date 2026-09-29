import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width":768,"height":1024})
        await pg.goto("http://localhost:4173/index.html"); await pg.wait_for_timeout(600)
        H = await pg.evaluate("document.body.scrollHeight"); y=0
        while y<H:
            await pg.evaluate(f"scrollTo(0,{y})"); await pg.wait_for_timeout(200); y+=500
        await pg.wait_for_timeout(1200); await pg.evaluate("scrollTo(0,0)")
        await pg.screenshot(path="/home/claude/ref/tab.png", full_page=True)
        await b.close()
asyncio.run(main())
