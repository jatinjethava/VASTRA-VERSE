import { Outlet } from "react-router"
import { Navbar } from "../Components/Navbar";
import { Footer } from "../Components/Footer";
import { Bots } from "../Pages/Bot/Bots";

export const UserLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
            <div>
                <Bots />
            </div>
        </>
    )
}