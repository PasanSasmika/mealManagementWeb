import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Overview from '../components/Overview';
import Employees from '../components/Employees';

const Home = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'employees':
        return <Employees />;
      default:
        return (
          <div className="bg-white p-10 rounded-3xl text-center border border-emerald-100">
            <h2 className="text-emerald-800 font-bold text-xl">Coming Soon</h2>
            <p className="text-emerald-500">The {activeTab} section is under development.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Home;