import { Box, Button, Center, GridItem, Heading, Image, Input, Radio, RadioGroup, SimpleGrid, Spinner, Stack, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


import NavBar from "./NavBar";
import Cart from "./Cart";
import createHiddenInput from "../utils";

import { useAppContext } from "../App";

function Purchase () {
    const {purchaseItems, setPurchaseItems, setShowing, setCartBtnShow, cartItems, setCartItems, loading, setLoading} = useAppContext();
    
    const [selectedVal, setSelectedVal] = useState("");
    const [storeAddress, setStoreAddress] = useState("");

    const location = useLocation(); //用於獲取當前路由的位置信息，包括 URL 路徑、查詢參數
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
        
        const storedPurchasedItemData = JSON.parse(localStorage.getItem("storedPurchasedItemData"));
        
        if (storedPurchasedItemData) {
            setPurchaseItems(storedPurchasedItemData);
            
        }

        const storedRadioValue = localStorage.getItem("selectedRadioVal");
        if (storedRadioValue) {
            setSelectedVal(storedRadioValue);
        }
        
        
        setShowing(false);
        setCartBtnShow(false);

        if ((new URLSearchParams(location.search).get("address"))) {
            const address = new URLSearchParams(location.search).get("address");
            setStoreAddress(address);
            const storedCartData = JSON.parse(localStorage.getItem("storeCartData"));
            if (storedCartData) {
                setCartItems(storedCartData);
            }

        }
        
      }, []);
    
    // useEffect(() => {
    //     const sum = purchaseItems.reduce( (acc, item) =>  acc + Number(item.totalPrice), 0).toFixed(2);
    //     setTotalPrice(sum);
    // }, [purchaseItems]);

    // useEffect(() => {
    //     const params = new URLSearchParams(location.search); //使用 new URLSearchParams()可以解析URL或特定字串，location.search則是代表當前URL的查詢參數
    //     const address = params.get("address"); // 獲取 URL 中的地址參數
    //     if (address) {
    //         setStoreAddress(address); // 更新 storeAddress 狀態
    //         setCartItems(cartItems);  //debug: 由於異步處理，cartItems未及時更新時會造成cartItems與purchaseItem兩個Array內容完全依樣，造成後續handleCheckOut的處理會不正常清除購物車的內容
    //     }
    // }, []);


    const totalPrice = useMemo(() => {
        const sum = purchaseItems.reduce( (acc, item) =>  acc + Number(item.totalPrice), 0).toFixed(2);
        return sum;
    }, [purchaseItems])

    const handleSelectedVal = (value) => {
        setSelectedVal(value);
        setStoreAddress("");
        localStorage.setItem("selectedRadioVal", value);
    }


    const handleAdrBtn = (e) => {
        let LogisticsSubType;
        if (selectedVal === "7-11") {
            LogisticsSubType = "UNIMARTC2C";
        }
        else if (selectedVal === "Famimart") {
            LogisticsSubType = "FAMIC2C";
        }
        
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://logistics-stage.ecpay.com.tw/Express/map";
        //測試用帳戶
        createHiddenInput(form, "MerchantID", "2000933");   
        createHiddenInput(form, "LogisticsType", "CVS");
        createHiddenInput(form, "LogisticsSubType", LogisticsSubType);
        createHiddenInput(form, "IsCollection", "Y");
        // createHiddenInput(form, "ServerReplyURL", "https://sever-0smf.onrender.com/reply");
        createHiddenInput(form, "ServerReplyURL", "https://news-weather-app-4.onrender.com/fakestore/reply");
        document.body.appendChild(form);
        form.submit();   
            
    };
     
    const handleCheckOut = () => {
        if (!storeAddress) {
            alert("Please select an address to complete the order");
            return;
        }

        const restItems = cartItems.filter(cartItem => 
            !purchaseItems.some(purchaseItem => purchaseItem.title === cartItem.title)
        );

        console.log(restItems);
        console.log(cartItems);
        console.log(purchaseItems);
        setCartItems(restItems);
        localStorage.setItem("storedCartData", JSON.stringify(restItems));
        localStorage.removeItem("selectedRadioVal");
        alert("Checkout Complete!");
        navigate("/");
    }

    return (
        <Box>
            <NavBar />
            {loading ?
                <Center>
                    <Spinner />
                </Center>
                :
                <Box>
                    <Box w={{ base: "90%", md: "70%", xl: "45%" }} mx="auto" my={6} p={2} backgroundColor="white" borderWidth={1} borderRadius={10}>
                        <Heading size="lg" m={2}>Purchased Item</Heading>
                        <Box as="hr" w="95%" mx="auto" />
                        {
                            purchaseItems.map(item => (
                                <SimpleGrid columns={5} my={5} p={2}>
                                    <GridItem>
                                        <Image src={item.image} w={{ base: "45px", md: "80px" }} mx="auto" />
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                        <Text noOfLines={3}>{item.title}</Text>
                                    </GridItem>
                                    <GridItem mx="auto">
                                        <Heading size="md">x{item.quantity}</Heading>
                                    </GridItem>
                                    <GridItem mx="auto">
                                        <Heading size="md">${item.totalPrice}</Heading>
                                    </GridItem>
                                </SimpleGrid>
                            ))
                        }
                        <Box as="hr" w="95%" mx="auto" />
                        <Box textAlign="right" mr={{ base: 0, md: 6 }}>
                            <Heading size="md">
                                Total: ${totalPrice}
                            </Heading>
                        </Box>
                    </Box>
                    <Box w={{ base: "90%", md: "70%", xl: "45%" }} mx="auto" my={6} p={2} backgroundColor="white" borderWidth={1} borderRadius={10}>
                        <Heading size="lg" m={2}>Cash on Delivery</Heading>
                        <Box as="hr" w="95%" mx="auto" />
                        <RadioGroup ml={{ base: 4, md: 20 }} my={4} onChange={handleSelectedVal} value={selectedVal}>
                            <Heading size="md">Pick up at:</Heading>
                            <Stack direction="column">
                                <Radio name="shipping-method" value="7-11" ml={5}>7-Eleven</Radio>
                                <Radio name="shipping-method" value="Famimart" ml={5}>FamilyMart</Radio>
                                <Box display="flex" w={{ base: "100%", md: "90%", lg: "70%" }}>
                                    <Input type="text" id="addressInput" value={storeAddress} readOnly /><Button id="FamiAdrBtn" onClick={handleAdrBtn} fontSize={{ base: "12px", md: "16px" }}>Select Address</Button>
                                </Box>
                            </Stack>
                        </RadioGroup>
                    </Box>
                    <Box w={{ base: "90%", md: "70%", xl: "45%" }} mx="auto" my={6} p={2} backgroundColor="white" borderWidth={1} borderRadius={10}>
                        <Heading size="lg" m={2}>Notes</Heading>
                        <Textarea w="90%" ml={4} mb={2} placeholder="Do you have any requirements?"></Textarea>
                    </Box>
                    <Box w={{ base: "80%", md: "70%", xl: "45%" }} mx="auto" my={6} p={2} textAlign="right">
                        <Button backgroundColor="#ffa500" onClick={handleCheckOut}>Checkout</Button>
                    </Box>
                </Box>
            }
        </Box>
    );
};

export default Purchase;