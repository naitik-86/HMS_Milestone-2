import { Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

import {
    Home,
    About,
    Contact,
    Login,
    Terms,
    Privacy,
    Cookies,
} from "../modules/public/pages";

const PublicRoutes = (
    <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/login" element={<Login />} />
    </Route>
);

export default PublicRoutes;