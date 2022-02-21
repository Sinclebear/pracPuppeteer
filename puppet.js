// puppeteer을 가져온다.
const puppeteer = require('puppeteer');
const url = require('url');

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
    let urlString = 'https://www.airbnb.co.kr/rooms/34043729?category_tag=Tag%3A789&adults=1&children=0&infants=0&check_in=2022-05-21&check_out=2022-05-28&federated_search_id=3bfb4c81-6f76-4f3d-87ce-233f8af13b5f&source_impression_id=p3_1645359387_GgDVUVUH%2BJC%2BK6wC'
    let urlObject = url.parse(urlString, true);
    let category = '';
    let raw_check_in_date = urlObject.query.check_in.split('-');
    let raw_check_out_date = urlObject.query.check_out.split('-')
    let check_in_date = raw_check_in_date[1] + "월 " + raw_check_in_date[2] + "일 ~ "
    let check_out_date = raw_check_out_date[2] + "일"
    let availableDate = check_in_date + check_out_date;
    console.log(availableDate)
    if (urlObject.query.category_tag === 'Tag:8186'){
        category = "초소형 주택"
    } else if (urlObject.query.category_tag === 'Tag:789') {
        category = "해변 근처"
    } else if (urlObject.query.category_tag === 'Tag:677') {
        category = "멋진 수영장"
    } else if (urlObject.query.category_tag === 'Tag:8175') {
        category = "농장"
    } else if (urlObject.query.category_tag === 'Tag:5348') {
        category = "통나무집"
    }
    console.log(category)
    // console.log(urlObject.query.category_tag)
    // console.log(urlObject.query.check_in)
    // console.log(urlObject.query.check_out)
    // 안됨 : 슈퍼호스트 아님 'https://www.airbnb.co.kr/rooms/46893420?category_tag=Tag%3A789&adults=1&children=0&infants=0&check_in=2022-04-22&check_out=2022-04-29&federated_search_id=8eceb5c5-c29f-484c-9410-e410c419619d&source_impression_id=p3_1645379938_rAtsyTJd1o61XCIL'
    await page.goto(urlString);
    
    
    await page.waitForTimeout(3000);

    // 숙소 이름
    let home_name = await page.$eval(
        "#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._b8stb0 > span > h1", element => {
            return element.textContent;
        });
    console.log(home_name);

    // 숙소 호스팅 유저 이름
    let raw_host_name = await page.$eval(
        "#site-content > div > div:nth-child(1) > div:nth-child(6) > div > div > div > div:nth-child(2) > section > div.c6y5den.dir.dir-ltr > div.tehcqxo.dir.dir-ltr > h2", element => {
            return element.textContent;
        });
    let host_name = raw_host_name.split("호스트: ")[1].split("님")[0]
    console.log(host_name)

    // 평점 rateAvg
    let raw_rateAvg = await page.$eval(
        "#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._1qdp1ym > div._544wcx > span:nth-child(1) > span._17p6nbba"
        , element => {
            return element.textContent;
        });
    let rateAvg = raw_rateAvg.split(" ·")[0];
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
    
    let introduce = await page.$eval(
        "#site-content > div:nth-child(4) > div > div > div:nth-child(1)", element => {
            return element.textContent;
        })
    console.log(introduce)
    
    let raw_price = await page.$eval(
        "#site-content > div > div:nth-child(1) > div:nth-child(3) > div > div._1s21a6e2 > div > div > div:nth-child(1) > div > div > div > div > div > div > div._wgmchy > div._c7v1se > div:nth-child(1) > div > div > div > span._tyxjp1", element => {
            return element.textContent;
        })
    
    let price = raw_price.split("₩")[1].split(",")[0] + raw_price.split("₩")[1].split(",")[1]
    parseInt(price);
    console.log(price)
    // console.log(typeof(price)) // string
    // console.log(typeof(parseInt(price))) // number

    /* 편의시설. 크롤링이 잘 안됩니다. 일단 카테고리별로 찍어서 10개 비슷한 것 추려서 넣음 
    console.log("테스트 시작")
    let conveniences_data = [];
    let conveniences_num = await page.$$eval(
        "#site-content > div:nth-child(6) > div > div:nth-child(2) > section > div._1byskwn", (elements) => elements.length);
    
    console.log(conveniences_num);
    let convenience = ''; // 더미
    for (let index = 0; index < conveniences_num; index++){
        convenience = await page.$eval(
            "#site-content > div:nth-child(6) > div > div:nth-child(2) > section > div._1byskwn > div:nth-child(" + (index + 1) + " )", element => {
                return element.textContent;
            })
        conveniences_data.push(convenience);
    }
    console.log(conveniences_data)
    */

    // let conveniences = await page.$$eval(
    //     "#site-content > div:nth-child(6) > div > div:nth-child(2) > section > div._1byskwn", elements => {
    //         return elements.map(element => element.textContent)
    //     })

    // let conveniences = await page.${}

    
    // console.log(conveniences)
    

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