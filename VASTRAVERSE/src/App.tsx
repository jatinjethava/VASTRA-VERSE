import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router'
import { Toaster } from "sonner";
import './App.css'
import { UserLayout } from './Layouts/UserLayout'
import { Home } from './Pages/Home'
import { Login } from './Components/Login';
import { SignUp } from './Components/Signup';
import { Men } from './Pages/Men/Men';
import { Women } from './Pages/Women/Women';
import { Kids } from './Pages/Kids/Kids';
import { MoreDetails } from './Components/MoreDetail';
import { Blogs } from './Pages/Blogs';
import { Cart } from './Pages/cart';
import { Checkout } from './Pages/Checkout';
import { OrderList } from './Pages/orderList';
import { ShowOrder } from './Components/ShowOrder';
import { Wishlist } from './Pages/Wishlist';
import { AddBlog } from './Components/AddBlog';
import { Profile } from './Pages/Profile';
import { Notification } from './Components/Notification';
import { MyReview } from './Pages/Review';
import { initGA, trackPageView } from './Utils/analytics';
import { SaveForLater } from './Pages/SaveForLater';
import { Security } from './Pages/Security/Security';
import { HelpCenter } from './Pages/HelpCenter';
import { Wallet } from './Pages/Wallet';
import { Analytics } from "@vercel/analytics/react"

function App() {

    const { pathname } = useLocation();
    const location = useLocation();

    useEffect(() => {
        initGA();
    }, []);

    useEffect(() => {
        trackPageView(
            location.pathname + location.search
        );
    }, [location]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [pathname]);


    return (
        <>
            <Toaster position="top-right" richColors className='z-99999' />
            <Analytics />
            <Routes>
                <Route path='/' element={<UserLayout />}>
                    <Route index element={<Home />} />
                    <Route path='men' element={<Men />} />
                    <Route path='women' element={<Women />} />
                    <Route path='kids' element={<Kids />} />
                    <Route path="more-details" element={<MoreDetails />} />
                    <Route path='blogs' element={<Blogs />} />
                    <Route path='blogs/write' element={<AddBlog />} />
                    <Route path='cart' element={<Cart />} />
                    <Route path='checkout' element={<Checkout />} />
                    <Route path='order-list' element={<OrderList />} />
                    <Route path='order-list/order-details/:orderNumber' element={<ShowOrder />} />
                    <Route path='wishlist' element={<Wishlist />} />
                    <Route path='profile' element={<Profile />} />
                    <Route path='notification' element={<Notification />} />
                    <Route path='my-reviews' element={<MyReview />} />
                    <Route path='save-for-later' element={<SaveForLater />} />
                    <Route path='security' element={<Security />} />
                    <Route path='help-center' element={<HelpCenter />} />
                    <Route path='wallet' element={<Wallet />} />
                </Route>

                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
            </Routes>
        </>
    )
}

export default App
