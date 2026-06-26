import ReactGA from "react-ga4";

export const initGA = () => {
    ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID as string);
};

export const trackPageView = (path: string) => {
    ReactGA.send({
        hitType: "pageview",
        page: path,
    });
};