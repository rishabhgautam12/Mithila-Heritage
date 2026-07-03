import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Gallery from "./pages/Gallery";
import Restaurant from "./pages/Restaurant";
import Banquet from "./pages/Banquet";
import Conference from "./pages/Conference";
import Rooftop from "./pages/Rooftop";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Offers from "./pages/Offers";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Testimonials from "./pages/Testimonials";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:roomId" element={<RoomDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/banquet" element={<Banquet />} />
          <Route path="/conference" element={<Conference />} />
          <Route path="/rooftop" element={<Rooftop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/testimonials" element={<Testimonials />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}