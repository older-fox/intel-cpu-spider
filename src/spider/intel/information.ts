import puppeteer from 'puppeteer'
import { Sema } from 'async-sema'
import Table from "cli-table3"


import {updateCpuInfo} from "../../database/intel/spider/update";
const browser = await puppeteer.launch({
    headless:"new"
})
export const scanIntelChip = async ()=>{
    const limiter = new Sema(3,{capacity:100})
    for (let i = 30797; i < 1000000; i++) {
        await limiter.acquire()
        runTask(i).then(()=>{
            limiter.release()
        })
    }
}


const runTask = async (i:number) => {
    try {
        const page = await browser.newPage()
        await page.goto(`https://www.intel.com/content/www/us/en/products/sku/${i}.html?`)
        if (page.url() !== "https://www.intel.com/content/www/us/en/products/overview.html"){
            console.log(`[${i}] Good id, Checking product category of [${await page.title()}]`)
            const title = await page.title()
            const table = new Table({
                head: ['key', 'info']
                , colWidths: [50, 50]
            })
            if (title.includes('Processor')){
                const text = await page.$eval('#processors-specifications > ul > li:nth-child(2) > a', el => el.textContent?.trim())
                if (text ==='CPU Specifications' || text === 'Performance Specifications'){
                    const name =  await page.$eval('#primary-content > div.upepagehero > div.sku-marquee-1_0_0.upeSkuMarquee.component.intel-ws.link-default.has-breadcrumb.has-gallery.blade.theme-dark-default.color-block.theme-classic-blue > div > div > div > div.flex-inner.flex-block-main > div > div.product-spec-block.hidden-mobile > div > h2', el => el.textContent?.trim())
                    console.log(`Check passed, category name [${text.trim()}], reading information.`)
                    const data = await page.evaluate(() => {
                        return {
                            feature: Array.from(document.querySelectorAll('div.col-xs-6.col-lg-6.tech-label')).map(a => a.textContent?.replace(/\n/g, '').trim()),
                            info: Array.from(document.querySelectorAll('div.col-xs-6.col-lg-6.tech-data')).map(a => a.textContent?.replace(/\n/g, '').trim())
                        }
                    })
                    //build json
                    const sheet = new Map()
                    sheet.set('title',title)
                    sheet.set('essentials.name',name)
                    for (let j = 0; j < data.feature.length; j++) {
                        switch (data.feature[j]) {
                            case 'Product Collection':
                                sheet.set('essentials.manufacturer',"intel")
                                sheet.set('essentials.collection',data.info[j])
                                break
                            case 'Code Name':
                                sheet.set('essentials.codeName',data.info[j])
                                break
                            case 'Vertical Segment':
                                sheet.set('essentials.verticalSegment',data.info[j])
                                break
                            case 'Processor Number':
                                sheet.set('essentials.processorNumber',data.info[j])
                                break
                            case 'Lithography':
                                sheet.set('essentials.lithography',data.info[j])
                                break
                            case 'Recommended Customer Price':
                                const priceList = data.info[j]?.replace('$','').split(' - ') as string[]
                                if (priceList.length == 2){
                                    sheet.set('essentials.recommendedCustomerPrice.min',priceList[0])
                                    sheet.set('essentials.recommendedCustomerPrice.max',priceList[1])
                                }
                                if (priceList.length == 1){
                                    sheet.set('essentials.recommendedCustomerPrice.min',priceList[0])
                                    sheet.set('essentials.recommendedCustomerPrice.max',priceList[0])
                                }
                                break
                            case 'useConditions':
                                const list = data.info[j]?.split('/') as string[]
                                sheet.set('essentials.useConditions',list)
                                break
                            case 'Total Cores':
                                sheet.set('specifications.cores.total',data.info[j])
                                break
                            case '# of Performance-cores':
                                sheet.set('specifications.cores.performance',data.info[j])
                                break
                            case '# of Efficient-cores':
                                sheet.set('specifications.cores.efficient',data.info[j])
                                break
                            case 'Total Threads':
                                sheet.set('specifications.threads',data.info[j])
                                break
                            case 'Max Turbo Frequency':
                                sheet.set('specifications.frequency.maxTurbo.single',data.info[j])
                                break
                            case 'Performance-core Max Turbo Frequency':
                                sheet.set('specifications.frequency.maxTurbo.performanceCore',data.info[j])
                                break
                            case 'Efficient-core Max Turbo Frequency':
                                sheet.set('specifications.frequency.maxTurbo.efficientCore',data.info[j])
                                break
                            case 'Processor Base Frequency':
                                sheet.set('specifications.frequency.base.single',data.info[j])
                                break
                            case 'Cache':
                                sheet.set('specifications.cache.L3',data.info[j])
                                break
                            case 'Total L2 Cache':
                                sheet.set('specifications.cache.L2',data.info[j])
                                break
                            case 'TDP':
                                sheet.set('specifications.tdp',data.info[j])
                                break
                            case 'Bus Speed':
                                sheet.set('specifications.busSpeed',data.info[j])
                                break
                            case 'Maximum Turbo Power':
                                sheet.set('specifications.power.max',data.info[j]?.replace(/[^\d\.]/g, ''))
                                break
                            case 'Processor Base Power':
                                sheet.set('specifications.power.min',data.info[j]?.replace(/[^\d\.]/g, ''))
                                break
                            case 'Marketing Status':
                                sheet.set('marketing.status',data.info[j])
                                break
                            case 'Launch Date':
                                sheet.set('marketing.date',data.info[j])
                                break
                            case 'Embedded Options Available':
                                const available = data.info[j] === "Yes"
                                sheet.set('marketing.embeddedOptionsAvailable',available)
                                break
                            case 'Max Memory Size (dependent on memory type)':
                                sheet.set('memory.maxSize',data.info[j])
                                break
                            case 'Memory Types':
                                sheet.set('memory.support.ddr3',data.info[j]?.toLowerCase().includes('ddr3'))
                                sheet.set('memory.support.ddr4',data.info[j]?.toLowerCase().includes('ddr4'))
                                sheet.set('memory.support.ddr5',data.info[j]?.toLowerCase().includes('ddr5'))
                                sheet.set('memory.support.lpddr3',data.info[j]?.toLowerCase().includes('lpddr3'))
                                sheet.set('memory.support.lpddr4',data.info[j]?.toLowerCase().includes('lpddr4'))
                                sheet.set('memory.support.lpddr5',data.info[j]?.toLowerCase().includes('lpddr5'))
                                sheet.set('memory.support.rawText',data.info[j])
                                break
                            case 'Max # of Memory Channels':
                                sheet.set('memory.maxChannels',data.info[j]?.replace(/[^\d\.]/g, ''))
                                break
                            case 'Max Memory Bandwidth':
                                sheet.set('memory.maxBandwidth',data.info[j])
                                break
                            case 'ECC Memory Supported   ‡':
                                sheet.set('memory.eccSupport',data.info[j] === "Yes")
                                break
                            case 'Processor Graphics ‡':
                                sheet.set('graphics.name',data.info[j])
                                break
                            case 'Graphics Max Dynamic Frequency':
                                sheet.set('graphics.frequency.maxDynamicFrequency',data.info[j])
                                break
                            case 'Multi-Format Codec Engines':
                                sheet.set('graphics.videoEncode.encoders',data.info[j])
                                break
                            case 'Intel® Quick Sync Video':
                                sheet.set('graphics.videoEncode.qsv',data.info[j] === "Yes")
                                break
                            case 'Graphics Base Frequency':
                                sheet.set('graphics.frequency.base',data.info[j])
                                break
                            case 'Graphics Output':
                                sheet.set('graphics.output',data.info[j])
                                break
                            case 'Execution Units':
                                sheet.set('graphics.executionUnits',data.info[j])
                                break
                            case 'Max Resolution (HDMI)‡':
                                sheet.set('graphics.maxResolution.hdmi',data.info[j])
                                break
                            case 'Max Resolution (DP)‡':
                                sheet.set('graphics.maxResolution.dp',data.info[j])
                                break
                            case 'Max Resolution (eDP - Integrated Flat Panel)‡':
                                sheet.set('graphics.maxResolution.eDP',data.info[j])
                                break
                            case 'Max Resolution (VGA)‡':
                                sheet.set('graphics.maxResolution.vga',data.info[j])
                                break
                            case 'DirectX* Support':
                                sheet.set('graphics.directX',data.info[j])
                                break
                            case 'OpenGL* Support':
                                sheet.set('graphics.OpenGL',data.info[j])
                                break
                            case 'OpenCL* Support':
                                sheet.set('graphics.OpenCL',data.info[j])
                                break
                            case 'Intel® Thunderbolt™ 4':
                                sheet.set('expansion.thunderbolt.4',data.info[j] === "Yes")
                                break
                            case 'Intel® Thunderbolt™ 3':
                                sheet.set('expansion.thunderbolt.3',data.info[j] === "Yes")
                                break
                            case 'Microprocessor PCIe Revision':
                                sheet.set('expansion.pcie.revision.cpu',data.info[j])
                                break
                            case 'Chipset / PCH PCIe Revision':
                                sheet.set('expansion.pcie.revision.chipset',data.info[j])
                                break
                            case 'PCI Express Revision':
                                sheet.set('expansion.pcie.revision.chipset',data.info[j])
                                sheet.set('expansion.pcie.revision.cpu',data.info[j])
                                break
                            case 'Max # of PCI Express Lanes':
                                sheet.set('expansion.pcie.lanes',data.info[j])
                                break
                            case 'PCI Express Configurations ‡':
                                sheet.set('expansion.pcie.configuration',data.info[j])
                                break
                            case 'Sockets Supported':
                                sheet.set('package.socket',data.info[j])
                                break
                            case 'Max CPU Configuration':
                                sheet.set('package.maxCpuSupported',data.info[j])
                                break
                            case 'Package Size':
                                sheet.set('package.size',data.info[j])
                                break
                            case 'Intel® Threat Detection Technology (TDT)':
                                sheet.set('advancedTechnologies.tdt',data.info[j]==="Yes")
                                break
                            case 'Intel® Standard Manageability (ISM) ‡':
                                sheet.set('advancedTechnologies.ism',data.info[j]==="Yes")
                                break
                            case 'Intel® Control-Flow Enforcement Technology':
                                sheet.set('advancedTechnologies.cet',data.info[j]==="Yes")
                                break
                            case 'Intel® Virtualization Technology (VT-x) ‡':
                                sheet.set('advancedTechnologies.VTx',data.info[j]==="Yes")
                                break
                            case 'Intel® Virtualization Technology for Directed I/O (VT-d) ‡':
                                sheet.set('advancedTechnologies.VTd',data.info[j]==="Yes")
                                break
                            case 'Intel® VT-x with Extended Page Tables (EPT) ‡':
                                sheet.set('advancedTechnologies.ept',data.info[j]==="Yes")
                                break
                            default:
                                //console.log(data.feature[j])
                                break
                        }
                    }

                    for (let [key, value] of sheet) {
                        table.push([key, value]);
                    }
                    console.log(table.toString())
                    const infos = Object.fromEntries(sheet)
                    await updateCpuInfo(i,infos)
                    await page.close()
                }else{
                    console.log(`Check failed, bad product category [${text}]`)
                }
            }else{
                console.log(`[${i}]Check failed, bad product page of [${await page.title()}]`)
                await page.close()
            }
        }else{
            console.log(`[${i}]Bad id, ${await page.title()}`)
            await page.close()
        }

    }catch (e:any) {
        console.log(e.message)
    }

}
