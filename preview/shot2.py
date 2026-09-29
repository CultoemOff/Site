import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width":1440,"height":810})
        await pg.goto("http://localhost:4173/index.html"); await pg.wait_for_timeout(1200)
        await pg.add_style_tag(content=".hero__content,.hero__shade,.nav{display:none!important}")
        await pg.wait_for_timeout(300)
        await pg.screenshot(path="/home/claude/ref/stage_only.png")
        await b.close()
asyncio.run(main())
