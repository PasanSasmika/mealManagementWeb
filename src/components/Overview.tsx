import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ShoppingCart, CheckCircle, Clock, TrendingUp, Calendar, Users, UserCheck } from 'lucide-react';
import { getAnalytics } from '../api/authService';

const Overview = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const result = await getAnalytics();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const forecastChartData = data?.forecast.map((item: any) => ({
    name: item._id.date,
    total: item.totalBooked,
    type: item._id.type
  })) || [];

  const breakfastTotal = forecastChartData
    .filter((d: any) => d.type === 'BREAKFAST')
    .reduce((acc: number, curr: any) => acc + curr.total, 0);
    
  const lunchTotal = forecastChartData
    .filter((d: any) => d.type === 'LUNCH')
    .reduce((acc: number, curr: any) => acc + curr.total, 0);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">

      {/* --- Section 1: Today's Summary Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[30px] border border-emerald-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">User Participation</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-2xl font-black text-emerald-900">{data?.bookingUsersCount || 0}</h4>
            <span className="text-sm text-emerald-500 font-bold">/ {data?.totalUsers || 0} Users</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Employees with active bookings</p>
        </div>

        <StatCard 
          title="Total Bookings" 
          value={breakfastTotal + lunchTotal} 
          icon={<ShoppingCart size={24} />} 
          color="bg-emerald-50 text-emerald-600"
          subtitle="Total meals to prepare"
        />

        {/* <StatCard 
  title="Active Now" 
  value={data?.todayStats?.find((t: any) => t._id === 'ACTIVE')?.count || 0} 
  icon={<Clock size={24} />} 
  color="bg-amber-50 text-amber-600"
  subtitle="Waiting for acceptance"
/>

<StatCard 
  title="Issued Today" 
  value={data?.todayStats?.find((t: any) => t._id === 'ISSUED')?.count || 0} 
  icon={<CheckCircle size={24} />} 
  color="bg-blue-50 text-blue-600"
  subtitle="Successfully served"
/> */}
      </div>

      {/* --- Section 2: Goods Planning Chart --- */}
      <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-emerald-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black text-emerald-900">Provisioning Forecast</h3>
            <p className="text-sm text-emerald-500 font-medium">Daily meal counts to determine stock requirements</p>
          </div>
          <div className="hidden md:block p-3 bg-emerald-50 rounded-2xl text-emerald-600">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecastChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#059669', fontSize: 11, fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#059669', fontSize: 11, fontWeight: 600 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Bar name="Meals Booked" dataKey="total" radius={[10, 10, 0, 0]} barSize={35}>
                {forecastChartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.type === 'BREAKFAST' ? '#10b981' : '#059669'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Section 3: Monthly Goods Requirement Table --- */}
      <div className="bg-white rounded-[35px] shadow-sm border border-emerald-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-emerald-50 bg-emerald-50/30">
          <h3 className="font-black text-emerald-900">Inventory Planning Table</h3>
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mt-1">Estimates for next 30 days</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-emerald-50/50 text-emerald-700 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-8 py-5">Item / Category</th>
                <th className="px-8 py-5">Total Count</th>
                <th className="px-8 py-5">Planning Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              <ProvisionRow label="Monthly Breakfast Provision" count={breakfastTotal} />
              <ProvisionRow label="Monthly Lunch Provision" count={lunchTotal} />
              <ProvisionRow label="Total Goods Requirement" count={breakfastTotal + lunchTotal} isTotal />
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Section 4: User-Wise Booking Analytics (New) --- */}
      <div className="bg-white rounded-[35px] shadow-sm border border-emerald-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-emerald-50 bg-emerald-50/30 flex justify-between items-center">
          <div>
            <h3 className="font-black text-emerald-900 text-xl">User-Wise Detailed Schedule</h3>
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mt-1">Specific meal dates per employee</p>
          </div>
          <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
            <UserCheck size={24} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-emerald-50/50 text-emerald-700 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-8 py-5">Employee</th>
                <th className="px-8 py-5">Booked Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {data?.userWise?.length > 0 ? data.userWise.map((user: any) => (
                <tr key={user._id} className="hover:bg-emerald-50/10 transition-colors group">
                  <td className="px-8 py-6 align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                        {user.firstName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-emerald-900 leading-tight">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-emerald-500 mt-0.5">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      {user.bookings.map((b: any, idx: number) => (
                        <div 
                          key={idx} 
                          className={`flex flex-col px-3 py-2 rounded-xl border transition-all hover:scale-105 ${
                            b.type === 'BREAKFAST' 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                            : 'bg-blue-50 border-blue-100 text-blue-700'
                          }`}
                        >
                          <span className="text-[9px] font-black uppercase tracking-tighter">{b.type}</span>
                          <span className="text-xs font-bold leading-tight mt-0.5">{b.date}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} className="p-20 text-center text-emerald-300 font-medium">
                    No detailed user bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

// --- Sub-Components ---
const StatCard = ({ title, value, icon, color, subtitle }: any) => (
  <div className="bg-white p-6 rounded-[30px] border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{title}</p>
    <h4 className="text-2xl font-black text-emerald-900 mt-1">{value}</h4>
    <p className="text-[10px] text-slate-400 font-medium mt-1">{subtitle}</p>
  </div>
);

const ProvisionRow = ({ label, count, isTotal }: any) => (
  <tr className={`${isTotal ? 'bg-emerald-50/30' : ''} hover:bg-emerald-50/10 transition-colors`}>
    <td className={`px-8 py-5 ${isTotal ? 'font-black text-emerald-900' : 'font-semibold text-emerald-800'} text-sm`}>
      {label}
    </td>
    <td className="px-8 py-5 font-bold text-emerald-600 text-sm">
      {count} Meals
    </td>
    <td className="px-8 py-5">
      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter">
        READY FOR PROCUREMENT
      </span>
    </td>
  </tr>
);

export default Overview;