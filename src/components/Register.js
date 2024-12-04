import { Box, Button, Center, FormControl, FormLabel, Heading, Input, Spinner, Text } from "@chakra-ui/react";
import NavBar from "./NavBar";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { nav } from "framer-motion/client";
import { useAppContext } from "../App";

function Register() {
    const {username, setUsername, password, setPassword, error, setError, loading, setLoading} = useAppContext();

    const navigate = useNavigate();


    const handleRegister = () => {
        setLoading(true);
        setError("");
        
        axios({
            method: "post",
            url: 'https://news-weather-app-4.onrender.com/fakestore/register',
            // url: "https://sever-0smf.onrender.com/register",
            data: {
                username: username,
                password: password
            }
        }).then( res => {
            //console.log(res.data?.message);
            setLoading(false);
            alert("User registered successfully");
            setUsername("");
            setPassword("");
            navigate("/login");
        }).catch( err => {
            //console.log(err.response);
            setLoading(false);
            setError(err.response.data?.message);
            setUsername("");
            setPassword("");
        })
    }



    return (
        <Box>
            <NavBar />
            <Box height="82vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Box mt={8} p={4} w={{ base: "98%", md: "400px" }} borderWidth={1} backgroundColor="white" borderRadius={10}>
                    <Text fontSize="35px">Register for Store App</Text>
                    <FormControl mt={6}>
                        <FormLabel htmlFor="username">Username:</FormLabel>
                        <Input
                            id="register-username"
                            value={username}
                            type="text"
                            placeholder="e.g, AlbertWang"
                            onChange={e => {
                                setUsername(e.target.value);
                            }} />
                        <FormLabel mt={2} htmlFor="password">Password:</FormLabel>
                        <Input
                            id="register-password"
                            value={password}
                            type="password"
                            placeholder="password"
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
                    <Center>
                        <Button
                            w="50%"
                            mt={6}
                            onClick={handleRegister}>Submit</Button>
                    </Center>
                </Box>
            </Box>

        </Box>
    );
}

export default Register;