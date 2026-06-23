import { BottomGrid, ClientActivity } from "../components";
import StatsCards from "../components/Statscards";

const Dashboard = () => {
    return (
        <div className="p-4 sm:p-6 space-y-6">

            <StatsCards />

            <ClientActivity />

            <BottomGrid />

        </div>
    );
};

export default Dashboard;