import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=swiftshader","--enable-unsafe-swiftshader"])
        for name,w,h,mouse in [("desk",1440,900,None),("desk_mouse",1440,900,(1100,620)),("mobile",390,844,None)]:
            pg = await b.new_page(viewport={"width":w,"height":h}, device_scale_factor=1)
            msgs=[]; pg.on("console", lambda m: msgs.append(m.text)); pg.on("pageerror", lambda e: msgs.append(str(e)))
            await pg.goto("http://localhost:4173/index.html"); await pg.wait_for_timeout(1500)
            if mouse:
                for i in range(30):
                    await pg.mouse.move(mouse[0]+i, mouse[1]); await pg.wait_for_timeout(60)
                await pg.wait_for_timeout(1500)
            await pg.screenshot(path=f"/home/claude/ref/{name}.png")
            if msgs: print(name, msgs)
        await b.close()
asyncio.run(main())
