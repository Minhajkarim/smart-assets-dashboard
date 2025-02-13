import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Home, Settings, Users, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 7000 },
  { name: "May", sales: 6000 },
];

export default function AdminDashboards() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} className="h-full shadow-lg">
        <Menu>
          <MenuItem icon={<Home size={20} />}>
            Dashboard
          </MenuItem>
          <MenuItem icon={<Users size={20} />}>
            Users
          </MenuItem>
          <MenuItem icon={<Settings size={20} />}>
            Settings
          </MenuItem>
          <MenuItem icon={<LogOut size={20} />}>
            Logout
          </MenuItem>
        </Menu>
        <Button className="m-4" onClick={() => setCollapsed(!collapsed)}>
          Toggle Sidebar
        </Button>
      </Sidebar>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-3xl font-bold">1,250</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">Active Sessions</h2>
              <p className="text-3xl font-bold">320</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">Revenue</h2>
              <p className="text-3xl font-bold">$12,500</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Chart */}
        <div className="mt-6 bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
