require("dotenv").config();
const { default: mongoose } = require("mongoose");
const puppeteer = require('puppeteer');
const url = require('url');
const connect = require("./models");
const Homes = require("./models/homeSchema");

connect();

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

const crawler = async() => {
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
        width: 1920,
        height: 1080
    });
    // console.log(urlElement)

    // URL에 plus 가 들어가면 div 2개씩 밀려서 host name 가져올때 깨짐. 에어비앤비 플러스?

    /**
     *  초소형 주택
     *  Base URL : https://www.airbnb.co.kr/s/homes?search_mode=flex_destinations_search&date_picker_type=flexible_dates&tab_id=home_tab&refinement_paths%5B%5D=%2Fhomes&flexible_trip_lengths%5B%5D=seven_days_starting_long_weekend&location_search=MIN_MAP_BOUNDS&category_tag=Tag%3A8186&superhost=true&ne_lat=56.842052203795284&ne_lng=36.22297938432226&sw_lat=6.040578930343457&sw_lng=-127.51725499067777&zoom=4&search_by_map=true&search_type=user_map_move
     *  슈퍼호스트 필터 on 
     **/
    const urllist = [
        'https://www.airbnb.co.kr/rooms/45861225?category_tag=Tag%3A8186&adults=1&children=0&infants=0&check_in=2022-05-20&check_out=2022-05-27&federated_search_id=9bc50d6a-424d-4de1-b9bd-155dc80757ee&source_impression_id=p3_1645424377_yyDRZZ6c7kBCGfDX',
        'https://www.airbnb.co.kr/rooms/38209667?category_tag=Tag%3A8186&adults=1&children=0&infants=0&check_in=2022-08-14&check_out=2022-08-21&federated_search_id=9bc50d6a-424d-4de1-b9bd-155dc80757ee&source_impression_id=p3_1645424381_zpTopfFaG4zvBBcx',
        'https://www.airbnb.co.kr/rooms/43910434?category_tag=Tag%3A8186&adults=1&children=0&infants=0&check_in=2022-09-25&check_out=2022-10-02&federated_search_id=9bc50d6a-424d-4de1-b9bd-155dc80757ee&source_impression_id=p3_1645424382_ytATv7Q6I40uM%2BU2',
        'https://www.airbnb.co.kr/rooms/36629243?category_tag=Tag%3A8186&adults=1&children=0&infants=0&check_in=2022-05-02&check_out=2022-05-09&federated_search_id=9bc50d6a-424d-4de1-b9bd-155dc80757ee&source_impression_id=p3_1645424383_%2BGoSBHBsxWebabhR',
        'https://www.airbnb.co.kr/rooms/47074929?category_tag=Tag%3A8186&adults=1&children=0&infants=0&check_in=2022-05-29&check_out=2022-06-05&federated_search_id=9bc50d6a-424d-4de1-b9bd-155dc80757ee&source_impression_id=p3_1645424384_FQwv%2BvXFy324ZwmI',
        'https://www.airbnb.co.kr/rooms/43620123?category_tag=Tag%3A8186&adults=1&children=0&infants=0&check_in=2022-03-13&check_out=2022-03-20&federated_search_id=9bc50d6a-424d-4de1-b9bd-155dc80757ee&source_impression_id=p3_1645424385_TuWOGy6oNJ51QU8S',
        'https://www.airbnb.co.kr/rooms/47291538?category_tag=Tag%3A8186&adults=1&children=0&infants=0&check_in=2022-03-28&check_out=2022-04-04&federated_search_id=9bc50d6a-424d-4de1-b9bd-155dc80757ee&source_impression_id=p3_1645424386_SrBCs239vZL7bFee',
        'https://www.airbnb.co.kr/rooms/48249966?category_tag=Tag%3A8186&adults=1&children=0&infants=0&check_in=2022-03-27&check_out=2022-04-03&federated_search_id=9bc50d6a-424d-4de1-b9bd-155dc80757ee&source_impression_id=p3_1645424386_Kjs2lqnxa24vJxai',
        'https://www.airbnb.co.kr/rooms/41130790?category_tag=Tag%3A8186&adults=1&children=0&infants=0&check_in=2022-08-01&check_out=2022-08-08&federated_search_id=9bc50d6a-424d-4de1-b9bd-155dc80757ee&source_impression_id=p3_1645424386_fJIQcHTcjtxqUS8J',
        'https://www.airbnb.co.kr/rooms/43170457?category_tag=Tag%3A8186&adults=1&children=0&infants=0&check_in=2022-03-11&check_out=2022-03-18&federated_search_id=b4b1c2bd-89bd-4c37-b7fd-0d97da435224&source_impression_id=p3_1645424656_r5L7L9VE40qH3ZLL'
    ]
    
    

    
    for (const urlString of urllist) {
        // let urlString = 'https://www.airbnb.co.kr/rooms/34043729?category_tag=Tag%3A789&adults=1&children=0&infants=0&check_in=2022-05-21&check_out=2022-05-28&federated_search_id=3bfb4c81-6f76-4f3d-87ce-233f8af13b5f&source_impression_id=p3_1645359387_GgDVUVUH%2BJC%2BK6wC'
        let urlObject = url.parse(urlString, true);
        let category = '';
        let convenience = new Array();
        let raw_check_in_date = urlObject.query.check_in.split('-');
        let raw_check_out_date = urlObject.query.check_out.split('-')
        let check_in_date = raw_check_in_date[1] + "월 " + raw_check_in_date[2] + "일 ~ "
        let check_out_date = raw_check_out_date[2] + "일"
        let availableDate = check_in_date + check_out_date;
        console.log(availableDate)
        if (urlObject.query.category_tag === 'Tag:8186'){
            category = "초소형 주택"
            convenience = ['온수', '여분의 베개와 담요', 'TV', '유아용 식탁의자', '반려 동물 입실 가능', '주방', '기본 조리 도구', '식기류', '단층 주택', '자전거']
        } else if (urlObject.query.category_tag === 'Tag:789') {
            category = "해변 근처"
            convenience = ['해변과 인접 - 해변', '주방', '무선 인터넷', '건물 내 무료 주차', '헤어드라이어', '의류 보관 공간: 벽장', '도서 및 읽을 거리', '커피메이커: 네스프레소', '야외 식사 공간', '소형 냉장고']
        } else if (urlObject.query.category_tag === 'Tag:677') {
            category = "멋진 수영장"
            convenience = ['수영장', '에어컨', '파티오 또는 발코니', '야외 샤워 시설', '유아용 식탁 의자', '무선 인터넷', '식기류', '커피메이커', '전용 야외 주방', '해수욕 필수품']
        } else if (urlObject.query.category_tag === 'Tag:8175') {
            category = "농장"
            convenience = ['자쿠지', '온수', '뒷마당', '주방', '무선 인터넷', 'TV', '건물 내 무료 주차', '건조기', '기본 조리도구', '파티오 또는 발코니']
        } else if (urlObject.query.category_tag === 'Tag:5348') {
            category = "통나무집"
            convenience = ['정원 전망', '산 전망', '주방', '무선 인터넷', '건물 내 무료 주차', '세탁기', '도서 및 읽을거리', '어린이용 책과 장난감', '바비큐 도구', '야외 식사 공간']
        }
        console.log(category)
        console.log(convenience)
        // console.log(urlObject.query.category_tag)
        // console.log(urlObject.query.check_in)
        // console.log(urlObject.query.check_out)
        // 안됨 : 슈퍼호스트 아님 'https://www.airbnb.co.kr/rooms/46893420?category_tag=Tag%3A789&adults=1&children=0&infants=0&check_in=2022-04-22&check_out=2022-04-29&federated_search_id=8eceb5c5-c29f-484c-9410-e410c419619d&source_impression_id=p3_1645379938_rAtsyTJd1o61XCIL'
        await page.goto(urlString);
        // page.goto(urlString);
            
        await page.waitForTimeout(10000);
        // page.waitForTimeout(10000);
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        // page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        await page.waitForTimeout(2000);
        // page.waitForTimeout(2000);

        // 숙소 이름
        let home_name = await page.$eval(
        // let home_name = page.$eval(
            "#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._b8stb0 > span > h1", element => {
                return element.textContent;
            });
        console.log(home_name);

        // 숙소 호스팅 유저 이름
        let raw_host_name = await page.$eval(
        // let raw_host_name = page.$eval(
            "#site-content > div > div:nth-child(1) > div:nth-child(6) > div > div > div > div:nth-child(2) > section > div.c6y5den.dir.dir-ltr > div.tehcqxo.dir.dir-ltr > h2", element => {
                return element.textContent;
            });
        let host_name = raw_host_name.split("호스트: ")[1].split("님")[0]
        console.log(host_name)

        // 평점 rateAvg
        // let raw_rateAvg = page.$eval(
        let raw_rateAvg = await page.$eval(
            "#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._1qdp1ym > div._544wcx > span:nth-child(1) > span._17p6nbba"
            , element => {
                return element.textContent;
            });
        let rateAvg = raw_rateAvg.split(" ·")[0];
        console.log(rateAvg)

        // 후기 개수 comment_count
        // let comment_count = page.$eval(
        let raw_comment_count = await page.$eval(
            "#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._1qdp1ym > div._544wcx > span:nth-child(1) > span._s65ijh7 > button"
            , element => {
                return element.textContent;
            });
        let comment_count = raw_comment_count.split('후기 ')[1].split("개")[0]


        // 지역 address. "슈퍼호스트" 인 경우에만 정상적으로 긁어옴. 아닌 경우 span:nth-child(5) 가 아닌 (3) 임. 아이고
        // let address = page.$eval(
        let address = await page.$eval(
            "#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._1qdp1ym > div._544wcx > span:nth-child(5)"
            , element => {
                return element.textContent;
            });
        console.log(address)
        // let image_url1 = await page.$eval(
        //     "#FMP-target".getAttribute('src')
        // )
        
        // let image_url1 = await page.evaluate(element=> {
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

        const image_url = [image_url1, image_url2, image_url3, image_url4, image_url5]
        console.log(typeof(image_url))
        
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
        let distance = getRandomInt(1,10000); // 거리는 1~9999 사이의 임의의 정수
        
        await page.waitForTimeout(3000);
        const homeInfo = {
            "home_name": home_name,
            "host_name": host_name,
            "category": category,
            "rateAvg": rateAvg,
            "comment_count":parseInt(comment_count),
            "address": address,
            "image_url": image_url,
            "introduce": introduce,
            "price": parseInt(price),
            "convenience": convenience,
            "distance": distance,
            "availableDate": availableDate
        }
        await Homes.create(homeInfo);
        // console.log(homeInfo);
        await page.waitForTimeout(3000);
    }
    await browser.close();
    mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

// const urllist = [
//     'https://www.airbnb.co.kr/rooms/48143423?category_tag=Tag%3A5348&adults=1&children=0&infants=0&check_in=2022-04-04&check_out=2022-04-11&federated_search_id=6078d6b1-48bb-48c4-83d8-f565172c46bd&source_impression_id=p3_1645419286_hj0Kyvvv14sSWkiw',
//     'https://www.airbnb.co.kr/rooms/14623508?category_tag=Tag%3A5348&adults=1&children=0&infants=0&check_in=2022-03-11&check_out=2022-03-18&federated_search_id=39cec061-61f5-4634-99fb-ff717acd1001&source_impression_id=p3_1645419296_UXGouoyvSY%2Bj5Q97'
// ]
// urllist.forEach(url => crawler(url)); // 실행 문제있음
crawler();