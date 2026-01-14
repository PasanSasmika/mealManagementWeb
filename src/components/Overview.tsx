const Overview = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
    {['Total Meals', 'Active Employees', 'Canteen Revenue'].map((card) => (
      <div key={card} className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
        <p className="text-emerald-500 text-xs lg:text-sm font-bold uppercase tracking-wider">{card}</p>
        <h3 className="text-2xl lg:text-3xl font-black text-emerald-900 mt-2">1,240</h3>
      </div>
    ))}
  </div>
);
export default Overview;