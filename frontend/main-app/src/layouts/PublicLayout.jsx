
import { Navbar, Footer } from "../modules/public/components"
import { Outlet } from "react-router-dom";

function PublicLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}

export default PublicLayout;