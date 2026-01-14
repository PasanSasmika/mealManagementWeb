import React, { useState } from 'react';
import { loginUser } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, Smartphone, LogIn, Loader2 } from 'lucide-react'; // Using lucide-react for web

const Login = () => {
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !mobile) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(username, mobile);
      
      // ROLE CHECK: Only allow MANAGER on Web
      if (data.user.role === 'MANAGER') {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userFirstName', data.user.firstName);
        
        navigate('/home');
      } else {
        // If they are CANTEEN or EMPLOYEE, deny access to Web
        alert("Access Denied: Only Managers can log in to the Web Portal.");
      }
    } catch (err: any) {
      alert("Login failed: Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
      <div className="bg-white p-8 rounded-[35px] shadow-xl shadow-emerald-100 w-full max-w-md border border-emerald-100">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-100 p-4 rounded-full mb-4">
            <UserCircle2 size={48} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-emerald-900 text-center">
            Manager Portal
          </h2>
          <p className="text-emerald-600 text-sm mt-1">Please sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="text-emerald-800 font-bold text-xs ml-1 mb-2 block">
              Username / පරිශීලක නාමය
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <UserCircle2 size={18} className="text-emerald-500" />
              </span>
              <input 
                type="text" 
                placeholder="Enter Username"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
          </div>

          {/* Mobile Field */}
          <div>
            <label className="text-emerald-800 font-bold text-xs ml-1 mb-2 block">
              Mobile Number / ජංගම අංකය
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Smartphone size={18} className="text-emerald-500" />
              </span>
              <input 
                type="text" 
                placeholder="07X XXXXXXX"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                onChange={(e) => setMobile(e.target.value)}
                value={mobile}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Login / ඇතුළු වන්න</span>
                <LogIn size={20} />
              </>
            )}
          </button>
        </form>

        <p className="text-emerald-600/50 text-center mt-8 text-[10px] font-medium uppercase tracking-widest">
          Meal Management System V1.0
        </p>
      </div>
    </div>
  );
};

export default Login;