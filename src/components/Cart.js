import { Box, Button, Center, GridItem, Heading, Image, Input, SimpleGrid, Slide, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../App";

function Cart () {
    const {cartItems, setCartItems, showing, setShowing, setPurchaseItems} = useAppContext();
    
    const navigate = useNavigate();

    useEffect(() => {
        const storedCartData = JSON.parse(localStorage.getItem("storedCartData"));
        // console.log('Loaded cartItems from localStorage', storedCartData);
        if (storedCartData) {
            setCartItems(storedCartData);
        }
    },[])

    const totalPrice = useMemo(() => {
        const sum = cartItems.reduce( (acc, item) =>  acc + item.price * item.quantity, 0).toFixed(2);
        return sum;
    }, [cartItems])



    const handleCardClick = (item) => {
        localStorage.setItem("productData", JSON.stringify({...item}));
        window.open(`#/product/${item.id}`, "_blank");
    }

    const handleQuantity = (id, delta) => {
        const updatedCartItmes = cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return {...item, quantity: newQuantity, totalPrice: (newQuantity * item.price).toFixed(2)}
            }
            else{
                return item;
            }
        });
        setCartItems(updatedCartItmes);
        //console.log(cartItems);
    }


    const handleCloseCart = () => {
        setShowing(false);
    }

    const handleDelItem = (id) => {
        const filterCartItems = cartItems.filter(item => item.id !== id);
        setCartItems(filterCartItems);
        localStorage.setItem("storedCartData", JSON.stringify(filterCartItems));
    };

    const handlePurchase = () => {
        localStorage.setItem("storedPurchasedItemData", JSON.stringify(cartItems));
        setPurchaseItems(cartItems);
        //console.log(Array.isArray(cartItems));
        navigate("/purchase");
        localStorage.removeItem("selectedRadioVal");
    }


    return (
        <Slide direction='right' in={showing} style={{ zIndex: 100, pointerEvents: 'none' }}
            transition={{ exit: { duration: 1 }, enter: { duration: 0.5 } }} >
            <Box className="cart-container" h="100vh" w={{ base: "100%", lg: "50%", xl: "35%" }} backgroundColor="#778899" position="fixed" top="0" right="0" pointerEvents="all">
                <Box display="flex" justifyContent="space-between" alignItems="center" h="10%">
                    <Heading p={2} pl={4} color="white" size={{base:"20px", sm: "xl"}}>Shopping cart {cartItems.length === 0 ? "" : `(${cartItems.length})`}</Heading>
                    <Button  mr={4} onClick={handleCloseCart}>Close</Button>
                </Box>
                <Box h="80%" overflowY="auto">
                    {cartItems.length === 0 ?
                        <Box display="flex" justifyContent="center" alignItems="center" h="80vh">
                            <Heading>It's empty.</Heading>
                        </Box>
                        :
                        <Box p={1}>
                            <Box>
                                {cartItems.map(item => (
                                    <Box>
                                        <SimpleGrid id={`cart-${item.id}`} columns={10} mt={4} mx={2} py={2}  borderRadius={10} backgroundColor="#b0c4de">
                                            <GridItem colSpan={2}>
                                                <Image src={item.image} w={{base: 10, md: 20}} ml={4} borderRadius={5}/>
                                            </GridItem>
                                            <GridItem colSpan={5}>
                                                <Text fontSize={20} cursor="pointer" _hover={{ color: "white" }} noOfLines={2}
                                                    onClick={() => handleCardClick(item)}>{item.title}</Text>
                                                <Box display="flex">
                                                    <Button size="xs"><i className="fa fa-minus"
                                                        onClick={() => handleQuantity(item.id, -1)}></i></Button>
                                                    <Input mx={1} w={8} type="number" size="xs"
                                                        backgroundColor="white" borderRadius={5} textAlign="center"
                                                        value={item.quantity} readOnly
                                                    />
                                                    <Button size="xs"><i className="fa fa-plus"
                                                        onClick={() => handleQuantity(item.id, +1)}></i></Button>
                                                </Box>
                                            </GridItem>
                                            <GridItem colSpan={2}>
                                                <Heading as="h6" size="md" mt={.8} ml={4}>${Number(item.totalPrice).toFixed(2)}</Heading>
                                            </GridItem>
                                            <GridItem mx="auto">
                                                    <Box as="i" className="fa fa-trash-can trashCan" mt={2}
                                                        onClick={() => handleDelItem(item.id)}
                                                        cursor="pointer"
                                                    ></Box>
                                            </GridItem>
                                        </SimpleGrid>
                                    </Box>
                                ))}
                            </Box>

                        </Box>
                    }
                </Box>
                {cartItems.length === 0 ?
                ""
                :
                <Box p={4} w="100%" display="flex" justifyContent="space-between" alignItems="center">
                    <Button size="lg" backgroundColor="#ffa500" onClick={handlePurchase}>Purchase</Button>
                    <Heading mr={2} color="white" size={{base:"md", md: "xl"}}>
                        Total: ${totalPrice}
                    </Heading>
                </Box>
                }
            </Box>
        </Slide>
    );
};

export default Cart;