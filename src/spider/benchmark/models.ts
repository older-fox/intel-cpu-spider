//This file is for getting all the models list
import puppeteer from 'puppeteer'

export const getHighEndModelList = async ()=>{
    const browser = await puppeteer.launch({
        headless:false
    })
    const page = await browser.newPage()
    await page.setViewport({
        width:1600,
        height:900
    })
    await page.goto('https://www.cpubenchmark.net/high_end_cpus.html')
    await page.waitForSelector('#mark > div > div.chart_body > ul')
    const res = await page.$$eval('#mark > div > div.chart_body > ul li', liList => {
        const result = [];
        for (const li of liList) {
            const name = li.querySelector('.prdname')?.textContent;
            if (name) {
                const model = name.match(/^([^@]+)/)
                if (model) {
                    result.push(model[1].trim())
                }
            }
        }
        return result;
    })
    await browser.close()
    return res
}