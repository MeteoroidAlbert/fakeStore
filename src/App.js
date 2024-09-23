import Store from "./components/Store";   //將Store component從Store.js中引入此檔案
import Product from "./components/Product";
import Login from "./components/Login";
import Register from "./components/Register";
import Purchase from "./components/Purchase";

import { useState, useEffect, createContext, useContext } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Route,
  Routes
} from "react-router-dom";
import { Box } from "@chakra-ui/react";


const AppContext = createContext();

const AppProvider = ({children}) => {
  
  const [token, setToken] =useState("");                         //處理登入token
  const [username, setUsername] = useState("");                  //處理username
  const [password, setPassword] = useState("");                  //處理password
  const [error, setError] = useState("");                        //處理登入、註冊時，伺服器的報錯回應
  const [showing, setShowing] = useState(false);                 //處理購物車顯示
  const [cartBtnShow, setCartBtnShow] = useState(true);
  const [cartItems, setCartItems] = useState(() => {             //處理購物車內容
    const storedCartData = localStorage.getItem("storedCartData");
    return storedCartData ? JSON.parse(storedCartData) : [];    //debug: 寫成如此是因為，避免後續useEffect()的依賴項為cartItems時，若此useState的initialState是[]會造成cartItem在重新整理頁面後變成空的，那麼原來存儲於localStorage資料會丟失。
  });
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [loading, setLoading] = useState(true);               //處理網頁Loading spinner顯示

  //登入相關
  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    if (storedToken) {
      setToken(storedToken);
    }
  },[])


  //購物車相關
  useEffect(() => {
    if (cartItems.length === 0) {
        localStorage.removeItem("storedCartData");
    } else {
        localStorage.setItem("storedCartData", JSON.stringify(cartItems));
    }
}, [cartItems]);

  const addToCart = (item) => {                             //將被點擊的商品存入cartItems Array;
    setCartItems(preItems => [...preItems, item]);
  };

  

  return (
    <AppContext.Provider value={  {token, setToken, 
                                   username, setUsername, password, setPassword, error, setError,  
                                   showing, setShowing, cartBtnShow, setCartBtnShow, 
                                   cartItems, setCartItems, addToCart,
                                   purchaseItems, setPurchaseItems, 
                                   loading, setLoading} }
    >
      {children}
    </AppContext.Provider>
  );

}

const useAppContext = () => {
  return useContext(AppContext);
}




function App() {

  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<Product />} />   {/* /:id 用以動態捕捉id，其中 ":" + (自定義項目名稱) 表示要動態捕捉某項目，再藉由<Link>完善實際捕捉對象*/}
          <Route path="/purchase" element={<Purchase />} />
          <Route path="*" element={<Box>404 Not Found</Box>}></Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
export {useAppContext};