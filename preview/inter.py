import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width":1440,"height":900}, permissions=["clipboard-read","clipboard-write"])
        pg = await ctx.new_page()
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:4173/index.html"); await pg.wait_for_timeout(600)
        await pg.locator("#ecossistema").scroll_into_view_if_needed(); await pg.wait_for_timeout(1200)
        await pg.get_by_role("button", name="Iluminação").click(); await pg.wait_for_timeout(700)
        el = pg.locator(".eco__layout"); await el.screenshot(path="/home/claude/ref/eco_click.png")
        await pg.locator("#parceiros").scroll_into_view_if_needed(); await pg.wait_for_timeout(1200)
        await pg.get_by_role("button", name="Copiar cupom").click(); await pg.wait_for_timeout(300)
        clip = await pg.evaluate("navigator.clipboard.readText()")
        await pg.locator(".coupon").screenshot(path="/home/claude/ref/coupon.png")
        print("clipboard:", clip, errs)
        m = await b.new_page(viewport={"width":390,"height":844})
        await m.goto("http://localhost:4173/index.html"); await m.wait_for_timeout(500)
        await m.locator("#ecossistema").scroll_into_view_if_needed(); await m.wait_for_timeout(1500)
        await m.locator(".eco__map").screenshot(path="/home/claude/ref/eco_m.png")
        await b.close()
asyncio.run(main())
