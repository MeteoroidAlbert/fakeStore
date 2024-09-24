import { Box, Button, Center, Grid, GridItem, Heading, HStack, Image, Input, SimpleGrid, Spinner, Stack, Tag, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "./NavBar";
import Cart from "./Cart";
import { useAppContext } from "../App";


function Product() {
    const { token, cartItems, addToCart, setCartBtnShow, loading, setLoading } = useAppContext();

    const [state, setState] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);

        setCartBtnShow(true);
        setState(JSON.parse(localStorage.getItem("productData")));
        
    }, [])


    useEffect(() => {
        localStorage.setItem("storedPurchasedItemData", JSON.stringify([{ ...state }]));
        
    },[state])

    // useEffect(() => {
    //     console.log(state);
    // },[state]);

    if (!state) {                   //debug: 當直接使用/id網址而非透過商店點擊商品時，state可能並未接收到從Store傳遞的任何資料，因此應該重新導向到home page
        window.location = "#/";
    }

    const handleCartAdd = (id) => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (cartItems.find(item => item.id === id)) {
            alert("It's already in the cart!")
        }
        else {
            addToCart({ ...state }); //每個被存入購物車的item可以解構賦值為title, image, price...
        }

        // console.log(cartItems);
    }


    const handleBuyNow = (id) => {
        if (!token) {
            navigate("/login");
            return;
        }
        
        if (cartItems.some(item => item.id === id)) {
            navigate("/purchase");
        }
        else {
            addToCart({ ...state });
            navigate("/purchase");
        }
        
    }


    const handleQuantity = (delta) => {

        const newQuantity = Math.max(1, state.quantity + delta);
        setState({ ...state, quantity: newQuantity, totalPrice: Number(newQuantity * state.price).toFixed(2) });

    }

    return (
        <Box>
            <NavBar />
            {loading ?
                <Center>
                    <Spinner />
                </Center>
                :
                <Box position="ralative">
                    <Cart />
                    <Box w={{ base: "100%", md: "90%", lg: "70%", xl: "60%" }} mx="auto" p={{base: 3, md: 4}} display="flex" alignItems="center">

                        <Box backgroundColor="white" borderRadius={10} p={2}>
                            <SimpleGrid spacing={6} columns={{ base: 1, md: 5 }}>   {/*{ base: 1, md: 5 }表示colums在斷點為xs、sm時為1，md時為5*/}
                                <GridItem colSpan={2} my="auto">
                                    <Center>
                                        <Image w={48} src={state.image} />
                                    </Center>
                                </GridItem>
                                <GridItem colSpan={3}>
                                    <Stack spacing={4}>
                                        <Box>
                                            <Heading as="h1" size={{base: "lg", md: "xl"}}>{state.title}</Heading>
                                            <Tag mt={2}>{state.category}</Tag>
                                            <Heading as="h2" size={{base: "md", md: "lg"}} mt={6} >Price: ${state.price}</Heading>
                                        </Box>
                                        <Box display="flex">
                                            <Button size="xs"><i className="fa fa-minus"
                                                onClick={() => handleQuantity(-1)}></i></Button>
                                            <Input mx={1} w={8} type="number" size="xs"
                                                backgroundColor="white" borderRadius={5} textAlign="center"
                                                value={state.quantity} readOnly
                                            />
                                            <Button size="xs"><i className="fa fa-plus"
                                                onClick={() => handleQuantity(+1)}></i></Button>
                                        </Box>
                                        <HStack>
                                            <Button w="xs" size="sm" colorScheme="cyan" onClick={() => { handleBuyNow(state.id) }}>Buy Now</Button>
                                            <Button w="xs" size="sm" onClick={() => { handleCartAdd(state.id) }}>Add To Cart</Button>
                                        </HStack>
                                        <Text mt={4} textAlign="justify">{state.description}</Text>

                                    </Stack>
                                </GridItem>
                            </SimpleGrid>
                        </Box>
                    </Box>
                </Box>
            }
        </Box>
    );
}

export default Product;