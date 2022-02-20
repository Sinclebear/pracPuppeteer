// puppeteer을 가져온다.
const puppeteer = require('puppeteer');

const cralwer = async() => {
    // 브라우저를 실행한다.
    // 옵션으로 headless모드를 끌 수 있다.
    try {
        const browser = await puppeteer.launch({
            headless: false
        });

    // 새로운 페이지를 연다.
    const page = await browser.newPage();
    // 페이지의 크기를 설정한다.
    await page.setViewport({
        width: 1650,
        height: 800
    });
    await page.goto('https://www.airbnb.co.kr/rooms/34043729?category_tag=Tag%3A789&adults=1&children=0&infants=0&check_in=2022-05-21&check_out=2022-05-28&federated_search_id=3bfb4c81-6f76-4f3d-87ce-233f8af13b5f&source_impression_id=p3_1645359387_GgDVUVUH%2BJC%2BK6wC');
    // await page.goto('https://www.airbnb.co.kr/rooms/46893420?category_tag=Tag%3A789&adults=1&children=0&infants=0&check_in=2022-04-22&check_out=2022-04-29&federated_search_id=8eceb5c5-c29f-484c-9410-e410c419619d&source_impression_id=p3_1645379938_rAtsyTJd1o61XCIL');
    await page.waitForTimeout(3000);

    // 제목
    let title = await page.$eval(
        "#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._b8stb0 > span > h1", element => {
            return element.textContent;
        });
    console.log(title);
    // 평점 rateAvg
    let rateAvg = await page.$eval(
        "#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._1qdp1ym > div._544wcx > span:nth-child(1) > span._17p6nbba"
        , element => {
            return element.textContent;
        });
    console.log(rateAvg)
    // 후기 개수 comment_count
    let comment_count = await page.$eval(
        "#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._1qdp1ym > div._544wcx > span:nth-child(1) > span._s65ijh7 > button"
        , element => {
            return element.textContent;
        });
    console.log(comment_count);
    // 지역 address. "슈퍼호스트" 인 경우에만 정상적으로 긁어옴. 아닌 경우 span:nth-child(5) 가 아닌 (3) 임. 아이고
    let address = await page.$eval(
        "#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._1qdp1ym > div._544wcx > span:nth-child(5)"
        , element => {
            return element.textContent;
        });
    console.log(address)
    // let image_url1 = await page.$eval(
    //     "#FMP-target".getAttribute('src')
    // )
    
    let image_url1 = await page.evaluate(element=> {
        let src = document.querySelector("#FMP-target").getAttribute('src')
        return src;
    });
    console.log(image_url1)

    let image_url2 = await page.evaluate(element=> {
        let src = document.querySelector("#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > div > div > div > div > div > div > div._168ht2w > div > div._178t1g5 > div > div._1l7oqbd > div > div > a > div > picture > img")
                        .getAttribute('src');
        return src;
    });
    console.log(image_url2)
    
    let image_url3 = await page.evaluate(element=> {
        let src = document.querySelector("#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > div > div > div > div > div > div > div._168ht2w > div > div._178t1g5 > div > div._924zz4g > div > div > a > div > picture > img")
                        .getAttribute('src');
        return src;
    });
    console.log(image_url3)

    let image_url4 = await page.evaluate(element=> {
        let src = document.querySelector("#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > div > div > div > div > div > div > div._168ht2w > div > div._1827gf2 > div > div._1l7oqbd > div > div > a > div > picture > img")
                        .getAttribute('src');
        return src;
    });
    console.log(image_url4)

    let image_url5 = await page.evaluate(element=> {
        let src = document.querySelector("#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > div > div > div > div > div > div > div._168ht2w > div > div._1827gf2 > div > div._924zz4g > div > div > a > div > picture > img")
                        .getAttribute('src');
        return src;
    });
    console.log(image_url5)
    
    

    // let data = await page.$(
    //     "#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._b8stb0 > span > h1"
    // )
    // console.log(data);
    // let evalData = await page.evaluate(element => {
    //     return element.textContent;
    // }, data);
    // console.log(evalData);
    
    await page.waitForTimeout(5000);
    browser.close();

    } catch (e) {
        console.error(e);
    }
}

cralwer();