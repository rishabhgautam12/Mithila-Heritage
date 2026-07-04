import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll position to the top whenever the route changes —
// React Router doesn't do this automatically like traditional
// multi-page sites, so without this, navigating to a new page
// keeps you at whatever scroll position you were at before.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}