import { Box, Button, Circle, Heading, Hide, IconButton, Menu, MenuButton, MenuItem, MenuList, Show } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useAppContext } from "../App";


function NavBar () {
    const {token, setToken, setShowing, cartItems, cartBtnShow} = useAppContext();

    const handleLogout = () => {
        setToken("");
        alert("Logout successfully");
        localStorage.removeItem("userToken");
    };

    const handleOpenCart = () => {
        setShowing(true);
    }
    

    
    return (
        <Box p={2} display="flex" justifyContent="space-between" backgroundColor="black" position="sticky" top={0} zIndex={90}>
            <Link to={'/'}>
                <Heading  ml={4} color="white">Store App</Heading>
            </Link>
            <Show below="768px">
                <Menu>
                    <MenuButton
                        mt={1}
                        as={IconButton}
                        icon={<HamburgerIcon />}
                        variant='outline'
                        backgroundColor="white"
                    />
                    <MenuList>
                        {token ?
                            <Box>
                                {cartBtnShow ?
                                    <MenuItem>
                                        <Box mt={1} mr={2} onClick={handleOpenCart} position="relative">
                                            Cart<Box as="i" className="fa fa-cart-shopping" ml={1} mr={1}></Box>
                                            {cartItems.length === 0 ?
                                                ""
                                                :
                                                
                                                <Circle w={5} h={5} backgroundColor="red" color="white" display="inline-block" textAlign="center">
                                                    {cartItems.length}
                                                </Circle>
                                            }
                                        </Box>
                                    </MenuItem>
                                    :
                                    ""}
                                <MenuItem>
                                    <Link to={'/'}>
                                        <Box mt={1} mr={4} onClick={handleLogout}>Log Out<Box as="i" className="fa fa-right-from-bracket" ml={1}></Box></Box>
                                    </Link>
                                </MenuItem>
                            </Box>
                            :
                            <MenuItem>
                                <Link to={'/login'}>
                                    <Box mt={1} mr={4}>Log In<Box as="i" className="fa fa-right-to-bracket" ml={1}></Box></Box>
                                </Link>
                            </MenuItem>
                        }
                    </MenuList>
                </Menu>
            </Show>

            <Hide below="768px">
                {token ?
                    <Box>
                        {cartBtnShow ?
                            <Button mt={1} mr={2} onClick={handleOpenCart} position="relative">
                                Cart<Box as="i" className="fa fa-cart-shopping" ml={1}></Box>
                                {cartItems.length === 0 ?
                                    ""
                                    :
                                    <Circle w={5} h={5} backgroundColor="red" color="white" position="absolute" bottom={-1} right={-1}>
                                        {cartItems.length}
                                    </Circle>
                                }
                            </Button>
                            :
                            ""}
                        <Link to={'/'}>
                            <Button mt={1} mr={4} onClick={handleLogout}>Log Out<Box as="i" className="fa fa-right-from-bracket" ml={1}></Box></Button>
                        </Link>
                    </Box>
                    :
                    <Link to={'/login'}>
                        <Button mt={1} mr={4}>Log In<Box as="i" className="fa fa-right-to-bracket" ml={1}></Box></Button>
                    </Link>
                }
            </Hide>
        </Box>
    );
}

export default NavBar;