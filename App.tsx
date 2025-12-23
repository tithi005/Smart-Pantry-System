import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ScanLine, 
  LineChart, 
  Database, 
  Menu, 
  Bell, 
  Package,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { StatsCard } from './components/StatsCard';
import { InventoryChart } from './components/InventoryChart';
import { InventoryUpload } from './components/InventoryUpload';
import { DevSpecs } from './components/DevSpecs';
import { ViewState, InventoryItem } from './types';

// Mock Initial Data
const INITIAL_DATA: InventoryItem[] = [
  { id: '1', name: 'Canned Beans', count: 45, category: 'Canned Goods', lastUpdated: '2h ago', daysUntilEmpty: 12, status: 'Good' },
  { id: '2', name: 'Rice Bags (5lb)', count: 8, category: 'Grains', lastUpdated: '4h ago', daysUntilEmpty: 3, status: 'Low' },
  { id: '3', name: 'Pasta Sauce', count: 2, category: 'Sauces', lastUpdated: '1h ago', daysUntilEmpty: 1, status: 'Critical' },
  { id: '4', name: 'Mac & Cheese', count: 30, category: 'Boxed Meals', lastUpdated: '3h ago', daysUntilEmpty: 15, status: 'Good' },
  { id: '5', name: 'Peanut Butter', count: 12, category: 'Proteins', lastUpdated: '5h ago', daysUntilEmpty: 8, status: 'Good' },
  { id: '6', name: 'Cereal Boxes', count: 5, category: 'Breakfast', lastUpdated: '30m ago', daysUntilEmpty: 2, status: 'Low' },
];

function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_DATA);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Aggregate Stats
  const totalItems = inventory.reduce((acc, item) => acc + item.count, 0);
  const lowStockCount = inventory.filter(i => i.status === 'Low').length;
  const criticalStockCount = inventory.filter(i => i.status === 'Critical').length;

  const handleUpdateInventory = (newItems: InventoryItem[]) => {
    // In a real app, this would merge with existing data. 
    // Here we just prepend or replace for demo visibility.
    setInventory(prev => [...newItems, ...prev.slice(newItems.length)]);
    setView(ViewState.DASHBOARD);
  };

  const SidebarItem = ({ icon: Icon, label, targetView }: { icon: any, label: string, targetView: ViewState }) => (
    <button
      onClick={() => {
        setView(targetView);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        view === targetView 
          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${view === targetView ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex h-screen">
        
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 w-64 bg-[#0f172a]/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Package className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Smart Pantry</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">AI SECURITY SYSTEM</p>
              </div>
            </div>

            <nav className="space-y-2">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" targetView={ViewState.DASHBOARD} />
              <SidebarItem icon={ScanLine} label="Stock Update (AI)" targetView={ViewState.SCAN} />
              <SidebarItem icon={LineChart} label="Analytics" targetView={ViewState.ANALYTICS} />
              <SidebarItem icon={Database} label="Developer Specs" targetView={ViewState.DOCS} />
            </nav>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="glass-panel p-4 rounded-xl border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Low Stock Alert</span>
              </div>
              <p className="text-xs text-slate-400">2 items are expected to run out within 24 hours.</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto">
          {/* Header */}
          <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-sm sticky top-0 z-40">
            <button 
              className="lg:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-semibold text-white">
              {view === ViewState.DASHBOARD && 'Overview'}
              {view === ViewState.SCAN && 'AI Stock Analysis'}
              {view === ViewState.ANALYTICS && 'Consumption Analytics'}
              {view === ViewState.DOCS && 'Technical Documentation'}
            </h2>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0f172a]" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 border-2 border-[#0f172a] shadow-lg" />
            </div>
          </header>

          {/* View Content */}
          <div className="p-8 max-w-7xl mx-auto w-full">
            
            {view === ViewState.DASHBOARD && (
              <div className="space-y-8 animate-fade-in">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard 
                    title="Total Items" 
                    value={totalItems} 
                    icon={<Package className="w-6 h-6" />} 
                    subtitle="+12% from last week"
                  />
                  <StatsCard 
                    title="Low Stock" 
                    value={lowStockCount} 
                    color="amber"
                    icon={<AlertCircle className="w-6 h-6" />} 
                    subtitle="Restock recommended"
                  />
                  <StatsCard 
                    title="Critical" 
                    value={criticalStockCount} 
                    color="rose"
                    icon={<TrendingDown className="w-6 h-6" />} 
                    subtitle="Immediate action needed"
                  />
                  <StatsCard 
                    title="Active Students" 
                    value="1,284" 
                    color="emerald"
                    icon={<LineChart className="w-6 h-6" />} 
                    subtitle="Daily usage metric"
                  />
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Inventory List */}
                  <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">Real-Time Inventory</h3>
                      <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Export Report</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-white/5">
                            <th className="pb-4 font-medium">Item Name</th>
                            <th className="pb-4 font-medium">Category</th>
                            <th className="pb-4 font-medium text-right">Quantity</th>
                            <th className="pb-4 font-medium text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {inventory.map((item) => (
                            <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                              <td className="py-4 text-slate-200 font-medium">{item.name}</td>
                              <td className="py-4 text-slate-400 text-sm">{item.category}</td>
                              <td className="py-4 text-slate-200 font-mono text-right">{item.count}</td>
                              <td className="py-4 text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                  item.status === 'Good' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  item.status === 'Low' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Visualization */}
                  <div className="glass-panel rounded-2xl p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-6">Stock Distribution</h3>
                    <div className="flex-1 min-h-[250px]">
                      <InventoryChart data={inventory} />
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <h4 className="text-sm font-medium text-slate-400 mb-4">AI Prediction</h4>
                      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <p className="text-sm text-indigo-200">
                          <span className="font-bold">Recommendation:</span> Reorder Pasta Sauce and Rice before Friday based on current consumption velocity.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {view === ViewState.SCAN && (
              <div className="max-w-4xl mx-auto animate-fade-in">
                <InventoryUpload onUpdateInventory={handleUpdateInventory} />
              </div>
            )}

            {view === ViewState.ANALYTICS && (
              <div className="glass-panel rounded-2xl p-8 animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
                 <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                    <LineChart className="w-10 h-10 text-slate-500" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Predictive Analytics</h2>
                 <p className="text-slate-400 max-w-lg mx-auto">
                   Our LSTM models are currently processing historical consumption data to generate "Days Until Empty" forecasts.
                 </p>
                 <button onClick={() => setView(ViewState.DOCS)} className="mt-8 text-indigo-400 hover:text-white transition-colors">
                   View Data Schema
                 </button>
              </div>
            )}

            {view === ViewState.DOCS && (
              <DevSpecs />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
