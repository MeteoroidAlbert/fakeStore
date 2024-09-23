import { Box, Image } from "@chakra-ui/react";
import { useEffect } from "react";

function Slide () {
    useEffect(() => {                                                                           //debug: 解決頁面重新渲染後，每次都要自己手動切換圖片一輪後才能觸發自動輪播的問題(初始化問題?)
        const carouselElement = document.querySelector('#carouselExampleIndicators');   
        if (carouselElement && window.bootstrap) {                                              //藉由CDN引入的bootstrap無法直接使用名為bootstrap的變數，而是改調用window物件下的bootstrap屬性，該屬性下則含有bootstrap庫，包含所有bootstap元件
          const carousel = new window.bootstrap.Carousel(carouselElement, {                     //創建(初始化)一個carousel輪播元件，第一個參數: 要實現輪播功能的DOM元素；第二個參數: 輪播的設定
            interval: 5000, // 自動輪播間隔(ms)
            wrap: true // 循環播放與否
          });
        }
      }, []);
    
    
    return (
        <Box as="div" id="carouselExampleIndicators" className="carousel slide mt-4 mx-auto" data-bs-ride="carousel" w={{base: "100%", md: "70%"}}>
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <Box as="div" className="carousel-inner" borderRadius={5}>
                <div className="carousel-item active">
                    <Image src={`${process.env.PUBLIC_URL}/images/Example1.jpg`} className="d-block w-100" alt="Example1" />
                </div>
                <div className="carousel-item">
                    <Image src={`${process.env.PUBLIC_URL}/images/Example2.jpg`} className="d-block w-100" alt="Example2" />
                </div>
                <div className="carousel-item">
                    <Image src={`${process.env.PUBLIC_URL}/images/Example3.jpg`} className="d-block w-100" alt="Example3" />
                </div>
            </Box>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </Box>
    );
}

export default Slide;