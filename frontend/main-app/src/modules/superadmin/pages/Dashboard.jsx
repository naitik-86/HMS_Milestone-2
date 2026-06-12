// import BottomGrid from "../components/BottomGrid";
// import ClientActivity from "../components/ClientActivity";
// import StatsCards from "../components/Statscards";

import { BottomGrid, ClientActivity, StatsCards } from "../components"


const Dashboard = () => {
    return (
        <div>
            <StatsCards />
            <ClientActivity />
            <BottomGrid />
        </div>
    );
};

export default Dashboard;