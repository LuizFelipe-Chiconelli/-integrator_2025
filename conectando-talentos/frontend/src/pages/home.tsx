import Banner from "../components/sections/home/banner"
import Presentation from "../components/sections/home/presentation"
import FeaturedJobOffers from "../components/sections/home/featuredjoboffers"

export default function Home() {
    return (
        <main>
            <Banner />
            <Presentation />
            <FeaturedJobOffers />
        </main>
    )
}