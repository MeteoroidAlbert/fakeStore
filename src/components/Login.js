import { Box, Button, Center, FormControl, FormLabel, Heading, Input, Spinner, Text } from "@chakra-ui/react";
import NavBar from "./NavBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../App";

function Login() {
    const {setToken, setCartItems, username, setUsername, password, setPassword, error, setError, loading, setLoading} = useAppContext();
    
    useEffect(() => {
        setError("");
        setUsername("");
        setPassword("");
    },[])

    const navigate = useNavigate();


    const handleLogin = () => {
        setLoading(true);
        setError("");
        setUsername("");
        setPassword("");
        axios({
            method: "post",
            // url: 'https://sever-0smf.onrender.com/login',
            url: "https://news-weather-app-4.onrender.com/fakestore/login",
            data: {
                username: username,
                password: password
            }
        }).then( res => {
            setLoading(false);
            setToken(res.data?.token);
            localStorage.setItem("userToken", res.data?.token);
            localStorage.removeItem("storedCartData");
            localStorage.removeItem("storedPurchasedItemData");
            setCartItems([]);
            alert("Login successfully")
            navigate("/");
        }).catch( err => {
            setLoading(false);
            console.log(err.response);
            setError(err.response.data?.message);
        })
    }



    return (
        <Box>
            <NavBar />
            <Box height="82vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Box mt={8} w={{ base: "80%", md: "320px" }} p={4} borderWidth={1} backgroundColor="white" borderRadius={10}>
                    <FormControl>
                        <Center my={2}>
                            <Heading>Store App</Heading>
                        </Center>
                        <FormLabel htmlFor="username">Username:</FormLabel>
                        <Input
                            id="login-username"
                            value={username}
                            type="text"
                            onChange={e => {
                                setUsername(e.target.value);
                            }} />
                        <FormLabel mt={2} htmlFor="password">Password:</FormLabel>
                        <Input
                            id="login-password"
                            value={password}
                            type="password"
                            onChange={e => {
                                setPassword(e.target.value);
                            }} />
                    </FormControl>
                    {error &&
                        <Center>
                            <Text mt={4} color="red">{error}</Text>
                        </Center>}
                    {loading &&
                        <Center>
                            <Spinner mt={2}/>
                        </Center>
                    }
                    <Button
                        w="100%"
                        mt={6}
                        onClick={handleLogin}>Login</Button>
                    <Center mt={4} mb={-1}>
                        <Text>No account? <Link to={"/register"}><Box as="span" style={{ color: "blue" }}>Get one here!</Box></Link></Text>
                    </Center>
                </Box>
            </Box>

        </Box>
    );
}

export default Login;