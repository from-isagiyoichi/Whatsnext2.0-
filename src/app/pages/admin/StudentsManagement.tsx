import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  ArrowLeft, 
  Search, 
  UserPlus, 
  Edit2, 
  Trash2,
  Mail,
  GraduationCap,
  Calendar,
  Shield,
  Key,
  Eye,
  EyeOff,
  Phone,
  MessageCircle,
  X,
  CheckCircle
} from "lucide-react";
import { AdminService, Student } from "../../services/adminService";
import { toast } from "sonner";

export function StudentsManagement() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("All");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    branch: "",
    year: "",
    admissionNumber: "",
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    const data = await AdminService.getAllStudents();
    setStudents(data);
    setIsLoading(false);
  };
  
  // Get unique branches from students
  const branches = ["All", ...Array.from(new Set(students.map(s => s.branch)))].sort();
  
  // Get branch statistics
  const getBranchStats = () => {
    const stats: { [key: string]: number } = {};
    students.forEach(student => {
      stats[student.branch] = (stats[student.branch] || 0) + 1;
    });
    return stats;
  };
  
  const branchStats = getBranchStats();

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await AdminService.addStudent(formData);
    
    if (result.success) {
      toast.success("Student added successfully");
      setShowAddModal(false);
      resetForm();
      loadStudents();
    } else {
      toast.error(result.error || "Failed to add student");
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    // Create an update payload, stripping empty password to avoid overwriting
    const updateData = { ...formData };
    if (!updateData.password) {
      delete (updateData as any).password;
    }
    
    const result = await AdminService.updateStudent(editingStudent.email, updateData);
    
    if (result.success) {
      toast.success("Student updated successfully");
      setEditingStudent(null);
      resetForm();
      loadStudents();
    } else {
      toast.error(result.error || "Failed to update student");
    }
  };

  const handleDeleteStudent = async (email: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    
    const result = await AdminService.deleteStudent(email);
    
    if (result.success) {
      toast.success("Student deleted successfully");
      loadStudents();
    } else {
      toast.error(result.error || "Failed to delete student");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      branch: "",
      year: "",
      admissionNumber: "",
    });
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      password: "", // Don't populate password for security
      phone: student.phone,
      branch: student.branch,
      year: student.year,
      admissionNumber: student.admissionNumber,
    });
  };
  
  const testStudentLogin = (student: Student) => {
    // Test if this student can login
    const studentsData = localStorage.getItem("studentsData");
    if (studentsData) {
      const students = JSON.parse(studentsData);
      const found = students.find((s: Student) => 
        s.email.toLowerCase() === student.email.toLowerCase() && 
        s.password === student.password
      );
      if (found) {
        toast.success(`✅ ${student.name} can login successfully!`, {
          description: `Email: ${student.email}`
        });
      } else {
        toast.error(`❌ Login credentials not found in system!`, {
          description: "Student may need to be re-added"
        });
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBranch = selectedBranch === "All" || student.branch === selectedBranch;
    
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="min-h-screen bg-black pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-yellow-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-red-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-white/10">
        <div className="flex items-center gap-4 p-4 max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-xl font-bold tracking-wide">Students Management</h1>
            <p className="text-white/60 text-xs">
              {isLoading ? "Loading..." : `${students.length} student${students.length !== 1 ? 's' : ''} registered`}
            </p>
          </div>
          <button
            onClick={() => setShowContactModal(true)}
            className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95 text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Admin
          </button>
          <button
            onClick={() => {
              setShowAddModal(true);
              setEditingStudent(null);
              resetForm();
            }}
            className="bg-yellow-500 text-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-all active:scale-95 text-sm font-medium shadow-lg shadow-yellow-500/20"
          >
            <UserPlus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Info Banner */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-green-400 text-xs font-medium">
            Live Sync Active - Changes reflect instantly in Student Portal
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or admission number..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
          />
        </div>

        {/* Branch Tabs */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-2">
          <div className="flex flex-wrap gap-2">
            {branches.map(branch => {
              const count = branch === "All" ? students.length : branchStats[branch] || 0;
              const isSelected = selectedBranch === branch;
              
              return (
                <button
                  key={branch}
                  onClick={() => setSelectedBranch(branch)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {branch}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isSelected ? "bg-black/20 text-black" : "bg-white/10 text-white/40"
                    }`}>
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Results Summary */}
        {!isLoading && filteredStudents.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <p className="text-white/60">
              Showing <span className="text-white font-medium">{filteredStudents.length}</span> student{filteredStudents.length !== 1 ? 's' : ''} 
              {selectedBranch !== "All" && <span> in <span className="text-yellow-500 font-medium">{selectedBranch}</span></span>}
            </p>
          </div>
        )}

        {/* Students List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            <p className="text-white/60 text-sm mt-4">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <Shield className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-sm">
              {searchQuery ? "No students found matching your search" : "No students added yet"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredStudents.map((student) => (
              <div
                key={student.email}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-2">{student.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-white/60">
                        <Mail className="w-4 h-4 text-yellow-500" />
                        <span>{student.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-white/60">
                        <GraduationCap className="w-4 h-4 text-yellow-500" />
                        <span>{student.branch} - Year {student.year}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-white/60">
                        <Calendar className="w-4 h-4 text-yellow-500" />
                        <span>Admission: {student.admissionNumber}</span>
                      </div>

                      <div className="flex items-center gap-2 text-white/60">
                        <Key className="w-4 h-4 text-yellow-500" />
                        <span className="font-mono bg-black/50 px-2 py-0.5 rounded text-xs">
                          {showPasswords[student.email] ? student.password : "••••••••"}
                        </span>
                        <button
                          onClick={() => setShowPasswords({ ...showPasswords, [student.email]: !showPasswords[student.email] })}
                          className="ml-2"
                        >
                          {showPasswords[student.email] ? <EyeOff className="w-4 h-4 text-yellow-500" /> : <Eye className="w-4 h-4 text-yellow-500" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Test Login Button */}
                    <button
                      onClick={() => testStudentLogin(student)}
                      className="mt-3 bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-green-500/30 transition-all text-xs font-medium"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Test Login Credentials
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(student)}
                      className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-yellow-500/20 hover:border-yellow-500/30 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-yellow-500" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteStudent(student.email)}
                      className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Student Modal */}
      {(showAddModal || editingStudent) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-white text-xl font-bold mb-6">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h2>
            
            <form onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent} className="space-y-4">
              <div>
                <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                  placeholder="john.cs21@mbcet.ac.in"
                  required
                  disabled={!!editingStudent}
                />
              </div>

              <div>
                <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block">Password</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                  placeholder={editingStudent ? "Leave blank to keep unchanged" : "Enter initial password"}
                  required={!editingStudent}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block">Branch</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                    placeholder="CSE"
                    required
                  />
                </div>

                <div>
                  <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="text-white/60 text-xs font-medium ml-1 mb-1.5 block">Admission Number</label>
                <input
                  type="text"
                  value={formData.admissionNumber}
                  onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-sm"
                  placeholder="MBCET2021001"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStudent(null);
                    resetForm();
                  }}
                  className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl hover:bg-white/10 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 text-black py-3 rounded-xl hover:bg-yellow-400 transition-colors font-bold shadow-lg shadow-yellow-500/20"
                >
                  {editingStudent ? "Update" : "Add"} Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Contact Admin Modal */}
      {showContactModal && (() => {
        // Load admin contact info from settings
        const stored = localStorage.getItem("adminContactInfo");
        const contactInfo = stored ? JSON.parse(stored) : {
          email: "Adminmbcet@mbcet.ac.in",
          phone: "+91 1234 567 890",
          whatsapp: "+911234567890"
        };
        
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full relative">
              <button
                type="button"
                className="absolute top-4 right-4 w-8 h-8 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                onClick={() => setShowContactModal(false)}
              >
                <X className="w-4 h-4 text-white" />
              </button>
              
              <h2 className="text-white text-xl font-bold mb-2">Contact Admin</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Need assistance? Reach out to the admin team for support.
              </p>
              
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/40 text-xs">Email</p>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-white text-sm font-medium hover:text-yellow-500 transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/40 text-xs">Phone</p>
                    <a 
                      href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                      className="text-white text-sm font-medium hover:text-yellow-500 transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/40 text-xs">WhatsApp Support</p>
                    <a 
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/[\s+]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-sm font-medium hover:text-yellow-500 transition-colors"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all active:scale-95 mt-6"
              >
                Got it
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}