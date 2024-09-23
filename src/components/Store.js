import { Box, Button, Center, GridItem, Heading, Image, Input, SimpleGrid, Spacer, Spinner, Tag } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import NavBar from './NavBar';
import Cart from './Cart';
import Slide from './Slide';
import {useAppContext} from '../App';



const StoreItem = ({id, title, price, image, category, description }) => {
    const { token, addToCart, cartItems } = useAppContext();
    const navigate = useNavigate();
    
    const handleCardClick = () => {
        localStorage.setItem("productData", JSON.stringify({id, title, price, image, category, description, quantity: 1}));
        window.open(`#/product/${id}`, "_blank");
    }
    
    const handleCartAdd = (e) => {
        e.stopPropagation();
        if (token) {
            if (cartItems.find(item => item.id === id)) {
                alert("It's already in the cart!")
            }
            else{
                addToCart({id, title, image, price, category, description, quantity: 1, totalPrice: price}); //每個被存入購物車的item可以解構賦值為title, image, price...
            }
            //console.log(cartItems);
        }
        else {
            navigate("/login");
        }
        
    }

    return (
        <Box className="productCard" p={4} borderRadius="lg" borderWidth="1px" cursor="pointer" backgroundColor="white"
             onClick={handleCardClick}>
            <Center>
                <Image src={image} w={24} />
            </Center>
            <Heading mt={4} noOfLines={2} size="sm" fontWeight="normal">{title}</Heading>
            <Tag mt={4} size={{base: "sm", lg: "md"}}>{category}</Tag><br />
            <Box display="flex" justifyContent="space-between">
                <Tag mt={4} size={{base: "md", md:"lg"}}>${price}</Tag>
                <Box as='i' className='fa fa-cart-shopping fa-lg cart' mt={{base: "7", md: "8"}} onClick={handleCartAdd}></Box>
            </Box>
        </Box>
    )
}

function Store() { 
    const { setCartBtnShow, loading, setLoading } = useAppContext();
    const [filteredItems, setFilteredItems] = useState([]);     //存取Search Box對應資料
    const [storeItem, setStoreItem] = useState([]);             //存取API獲取資料
    
    
    

    useEffect(() => {
        setCartBtnShow(true);
        axios.get('https://fakestoreapi.com/products')
            .then(({ data }) => {
                setLoading(false);
                setStoreItem(data);
                setFilteredItems(data);
            })
    }, [])


    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
            //console.log("Success");
        };
    }
   
    const handleSearch = () => {
        const searchBox = document.getElementById("searchBox");
        let searchItems = storeItem.filter(item => item.title.toLocaleLowerCase().includes(searchBox.value.toLocaleLowerCase()));
        setFilteredItems(searchItems); 
        searchBox.value="";
    }
    

    const handleFilter = (e) => {
        if ( e.target.value === "all" ) {
            setFilteredItems(storeItem);
        }
        else {
            let f = storeItem.filter(item => item.category.toLowerCase() === e.target.value.toLocaleLowerCase());
            setFilteredItems(f);
        }
    }
 
    return (
        <Box>
            <NavBar />
            <Box position="relative" backgroundColor="#f5f5f5">               
                <Cart />              
                <Box p={3} mx="auto">
                    {loading ?
                        (<Center mt={6}>
                            <Spinner />
                        </Center>)
                        :
                        (<Box mx="auto" w={{ base: "100%", md: "85%", lg: "75%" }}>
                            <Box display="flex" mt={6}>
                                <Input id="searchBox" type="text" onKeyDown={handleKeyDown} placeholder="Search" backgroundColor="white"/>
                                <Button onClick={handleSearch}>
                                    <Box as="i" className="fa fa-magnifying-glass"></Box>
                                </Button>
                            </Box>
                            <Slide/>
                            <Box mt={8} textAlign={{base:"left", md: "center"}}>
                                <Button mx="1" my="0.5" value="all" size="sm" onClick={handleFilter} backgroundColor="black" color="white">All</Button>
                                <Button mx="1" my="0.5" value="men's clothing" size="sm" onClick={handleFilter} backgroundColor="black" color="white">Men's clothing</Button>
                                <Button mx="1" my="0.5" value="women's clothing" size="sm" onClick={handleFilter} backgroundColor="black" color="white">Women's clothing</Button>
                                <Button mx="1" my="0.5" value="jewelery" size="sm" onClick={handleFilter} backgroundColor="black" color="white">Jewelery</Button>
                                <Button mx="1" my="0.5" value="electronics" size="sm" onClick={handleFilter} backgroundColor="black" color="white">Electronics</Button>
                            </Box>
                            <Box as="hr" w="100%" mx="auto" mt={6} mb={8}/>
                            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mt={4} p={2}>
                                {filteredItems.map(item => {
                                    return (
                                        <GridItem>
                                            <StoreItem {...item} />
                                        </GridItem>   //使用props spreading，將item物件內的屬性全部傳遞給子元件StoreItem
                                    )
                                })}
                            </SimpleGrid>
                            <Spacer my={20}/>
                        </Box>)
                    }
                </Box>
            </Box>
        </Box>
    );
}

export default Store;