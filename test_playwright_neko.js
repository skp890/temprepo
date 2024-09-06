const { chromium } = require("playwright");
const langList = require("./langList");

async function checkVariable(page, valueList) {
    let waitTimeMax = 60 * 1000; //60s
    let waitCnt = waitTimeMax / 100;
    let countTime = 0;
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            (async () => {
                // 获取全局变量的值
                const globalVariableValue = await page.evaluate(() => {
                    return window.Astarte?.StateManager?.m_currState;
                });
                // 检查变量的值
                if (valueList.indexOf(globalVariableValue) > -1 || countTime >= waitCnt) {
                    clearInterval(intervalId); // 清理定时器
                    resolve();
                }
                countTime++;
            })();
        }, 100);
    });
}

(async () => {
    const browser = await chromium.launch({
        headless: false,
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://aaa.xyz/");
    await page.getByRole("tab", { name: "lilili", exact: true }).click();

    await page.getByRole("textbox", { name: "userId" }).click();
    await page.getByRole("textbox", { name: "userId" }).fill("968515437181");
    await page.getByRole("textbox", { name: "buy amount" }).click();
    await page.getByRole("textbox", { name: "buy amount" }).fill("900000000");

    let lastLang = "英文";
    for (let i = 0; i < langList.length; ++i) {
        let ele = langList[i];
        const regex = new RegExp(`^${lastLang}$`);

        await page.getByLabel("lilili", { exact: true }).locator("div").filter({ hasText: regex }).nth(4).click();
        await page.getByRole("option", { name: ele.langName }).locator("span").click();

        const page1Promise = page.waitForEvent("popup");
        await page.getByLabel("lilili", { exact: true }).getByText("Neko Fortune").click();
        const page1 = await page1Promise;

        // await page.waitForFunction(() => {
        //     let state = window.Astarte?.StateManager?.m_currState;
        //     console.log("now state: " + state);
        //     return state == 0 || state == 1; //
        // });
        await checkVariable(page1, [0, 1]);

        await page.waitForTimeout(1000);

        await page1.locator("#GameCanvas").click({
            position: {
                x: 904,
                y: 656,
            },
        });

        await page.waitForTimeout(500);

        await page1.locator("#GameCanvas").click({
            position: {
                x: 633,
                y: 473,
            },
        });

        // await page.waitForFunction(() => {
        //     let state = window.Astarte.StateManager.m_currState;
        //     return state == 1005; //
        // });
        await checkVariable(page1, [1005]);

        await page1.locator("#GameCanvas").click({
            position: {
                x: 1112,
                y: 70,
            },
        });
        await page.waitForTimeout(500);

        await page1.locator("#GameCanvas").click({
            position: {
                x: 1112,
                y: 70,
            },
        });
        await page.waitForTimeout(500);

        await page1.locator("#GameCanvas").click({
            position: {
                x: 1106,
                y: 588,
            },
        });
        await page1.close();

        //设置需要点击的语言
        lastLang = ele.langName;
    }
})();
