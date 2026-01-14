import React, { useState, useEffect, useRef } from 'react';
import { 
  UserPlus, FileUp, Trash2, Edit2, X, Loader2, 
  Search, UserCheck, FileSpreadsheet, AlertCircle 
} from 'lucide-react';
import { 
  getAllUsers, deleteUser, updateUser, 
  registerUser, uploadExcel 
} from '../api/authService';

const Employees = () => {
  // --- States ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    username: '',
    role: 'EMPLOYEE'
  });

  // --- Actions ---

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter((u: any) => u._id !== id));
      } catch (err) {
        alert("Delete failed. Please try again.");
      }
    }
  };

  const handleOpenEdit = (user: any) => {
    setEditingId(user._id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      username: user.username,
      role: user.role
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateUser(editingId, formData);
        alert("User updated successfully!");
      } else {
        await registerUser(formData);
        alert("User registered successfully!");
      }
      setShowModal(false);
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      alert("Operation failed. Username or Mobile may already exist.");
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await uploadExcel(file);
      alert(`Success! Imported ${response.count} users.`);
      setShowUploadModal(false);
      fetchUsers();
    } catch (err) {
      alert("Bulk upload failed. Ensure role names are valid and headers match.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredUsers = users.filter((u: any) => 
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Tool Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => { 
              setEditingId(null); 
              setFormData({firstName:'', lastName:'', mobileNumber:'', username:'', role:'EMPLOYEE'}); 
              setShowModal(true); 
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            <UserPlus size={18} /> Add User
          </button>
          
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-emerald-600 border border-emerald-100 px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
          >
            <FileUp size={18} /> Bulk Import
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or username..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition-all text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-emerald-100 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
            <p className="text-emerald-500 font-medium animate-pulse">Loading Employees...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-emerald-50/50 text-emerald-700 text-[11px] uppercase tracking-[0.1em] font-black border-b border-emerald-100">
                <tr>
                  <th className="px-8 py-5">Employee Details</th>
                  <th className="px-8 py-5">System Identity</th>
                  <th className="px-8 py-5">Access Level</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {filteredUsers.length > 0 ? filteredUsers.map((user: any) => (
                  <tr key={user._id} className="hover:bg-emerald-50/20 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                          {user.firstName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-emerald-900">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-emerald-500">{user.mobileNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-emerald-600 font-medium text-sm">
                      @{user.username}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wider ${
                        user.role === 'MANAGER' ? 'bg-purple-100 text-purple-600' : 
                        user.role === 'CANTEEN' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(user)} 
                          className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)} 
                          className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-emerald-400 font-medium">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add / Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                   <UserCheck size={24} />
                </div>
                <h3 className="text-2xl font-black text-emerald-900">
                  {editingId ? 'Update Profile' : 'New Employee'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-emerald-50 rounded-full text-emerald-400 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 ml-2 uppercase">First Name</label>
                  <input type="text" value={formData.firstName} className="w-full p-4 bg-slate-50 border border-emerald-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm" onChange={(e)=>setFormData({...formData, firstName: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-emerald-400 ml-2 uppercase">Last Name</label>
                  <input type="text" value={formData.lastName} className="w-full p-4 bg-slate-50 border border-emerald-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm" onChange={(e)=>setFormData({...formData, lastName: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-400 ml-2 uppercase">System Username</label>
                <input type="text" value={formData.username} className="w-full p-4 bg-slate-50 border border-emerald-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm" onChange={(e)=>setFormData({...formData, username: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-400 ml-2 uppercase">Mobile Number</label>
                <input type="text" value={formData.mobileNumber} className="w-full p-4 bg-slate-50 border border-emerald-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm" onChange={(e)=>setFormData({...formData, mobileNumber: e.target.value})} required />
              </div>
              
              <div className="pt-2">
                <label className="text-[10px] font-black text-emerald-400 uppercase ml-2 mb-2 block">System Permission</label>
                <select 
                  className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-2xl outline-none text-emerald-800 font-bold text-sm cursor-pointer" 
                  value={formData.role} 
                  onChange={(e)=>setFormData({...formData, role: e.target.value})}
                >
                  <option value="EMPLOYEE">Employee Access</option>
                  <option value="CANTEEN">Canteen Access</option>
                  <option value="MANAGER">Manager Access</option>
                </select>
              </div>

              <button className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all mt-6 active:scale-95">
                {editingId ? 'Save Changes' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bulk Excel Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                   <FileSpreadsheet size={24} />
                </div>
                <h3 className="text-2xl font-black text-emerald-900">Bulk Import</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-emerald-50 rounded-full text-emerald-400">
                <X size={24} />
              </button>
            </div>

            <div className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-[30px] p-8 text-center transition-all">
              {uploading ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <Loader2 className="animate-spin text-emerald-600" size={32} />
                  <p className="text-emerald-700 font-bold">Processing file...</p>
                </div>
              ) : (
                <>
                  <FileUp className="mx-auto text-emerald-300 mb-4" size={48} />
                  <p className="text-emerald-900 font-bold mb-1">Select Excel File</p>
                  <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-6">.xlsx, .xls, or .csv</p>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept=".xlsx, .xls, .csv" 
                    onChange={handleBulkUpload}
                  />
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-emerald-700 border border-emerald-200 px-6 py-3 rounded-2xl font-black text-xs hover:bg-emerald-100 transition-all active:scale-95 shadow-sm"
                  >
                    Browse Local Files
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={14} className="text-emerald-500" />
                  <p className="text-[10px] font-black text-emerald-600 uppercase">Excel Formatting Guide:</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    1. Use headers: <span className="text-emerald-600">firstName, lastName, mobileNumber, username, role</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    2. Role options: <span className="text-emerald-600">Employee, Canteen, Manager</span> (Any case works)
                  </p>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    3. Mobile: Format column as <span className="text-emerald-600">Text</span> to keep leading zeros.
                  </p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;