import BottomGrid from "../components/BottomGrid";
import ClientActivity from "../components/ClientActivity";
import StatsCards from "../components/Statscards";


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