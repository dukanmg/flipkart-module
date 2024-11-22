const { chromium } = require('playwright');



// Scrape Flipkart product details
async function getFlipkartProductDetails(page, url,platform) {
    try {
        await page.goto(url);

        const priceSelector = "#container > div > div._39kFie.N3De93.JxFEK3._48O0EI > div.DOjaWF.YJG4Cf > div.DOjaWF.gdgoEp.col-8-12 > div:nth-child(2) > div";
        const offerSelector = "#container > div > div._39kFie.N3De93.JxFEK3._48O0EI > div.DOjaWF.YJG4Cf > div.DOjaWF.gdgoEp.col-8-12 > div:nth-child(3)";

        await page.waitForSelector(priceSelector, { timeout: 60000 });
        const price = (await page.$eval(priceSelector, el => el.innerText)).trim() || "Price not available";
        
        await page.waitForSelector(priceSelector, { timeout: 60000 });
        const offer = (await page.$eval(offerSelector, el => el.innerText)).trim() || "Offer not available";

        return { url, platform, price, offer };
    } catch (error) {
        return { url, error: `Flipkart Scraping Error: ${error.message}` };
    }
}

// Scrape product details based on platform
async function scrapeProduct(browser, url, platform) {
    const page = await browser.newPage();
    let result;
    result = await getFlipkartProductDetails(page, url,platform);

    await page.close();
    return [result];
}

// Scrape all products concurrently
async function scrapeAllProducts(url,platform) {
    const browser = await chromium.launch({ headless: true, args: ['--disable-gpu','--disable-blink-features=AutomationControlled'] });
    
    const tasks = await scrapeProduct(browser, url, platform)
    const results = await Promise.all(tasks);
    
    await browser.close();
    return results;
}

// API endpoint
module.exports.flipkartlivedatabyurl=async(req,res)=>{
    let url = req.body.url;
    let platform = "Flipkart"

    if (!url) 
    {
        return res.status(400).json({ error: "Collection is required and must be a valid object" });
    }
    try
    {
        
        let result = await scrapeAllProducts(url,platform)
        if(result)
        {
            console.log("Flipkart extracted data result: ",result)
            return res.status(200).json({
                status:"success",
                statusCode:200,
                message:"Flipkart data got the extracted",
                data:result
            })
        }
        else        
        {
            return res.status(200).json({
                status:"error",
                statusCode:400,
                message:"Flipkart data not extracted",
                data:[]
            })
        }
    }
    catch(error)
    {
        console.log("Flipkart scrapper --> flipkartlivedatabyurl()  error : ",error)
    }
}
