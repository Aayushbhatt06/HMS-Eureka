import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/slices/authSlice';
import { apiFetch, getErrorMessage } from '../utils/api';
import { 
  LogOut, 
  User as UserIcon, 
  Shield, 
  Activity, 
  HeartPulse, 
  FileText, 
  BedDouble, 
  Users,
  Plus,
  RefreshCw,
  CreditCard,
  Search,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';

// Seeded Medicines matching backend
const SEEDED_MEDICINES = [
  { id: 1, name: 'Paracetamol', manufacturer: 'GSK', price: 10.0 },
  { id: 2, name: 'Ibuprofen', manufacturer: 'Pfizer', price: 15.0 },
  { id: 3, name: 'Amoxicillin', manufacturer: 'Abbott', price: 50.0 },
  { id: 4, name: 'Metformin', manufacturer: 'Sandoz', price: 20.0 },
  { id: 5, name: 'Lipitor', manufacturer: 'Pfizer', price: 120.0 }
];

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('overview');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newVal = !prev;
      localStorage.setItem('sidebarCollapsed', String(newVal));
      return newVal;
    });
  };

  // Apply theme class to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
    setMobileMenuOpen(false);
    if (user?.role === 'DOCTOR') {
      setSelectedPatient(null);
    } else if (user?.role === 'NURSE') {
      setSelectedNurseAdmission(null);
    }
  };

  const getRoleAccentColor = (role?: string) => {
    switch (role) {
      case 'PATIENT': return 'from-blue-600 to-indigo-600';
      case 'DOCTOR': return 'from-emerald-600 to-teal-600';
      case 'NURSE': return 'from-cyan-600 to-sky-600';
      case 'RECEPTIONIST': return 'from-violet-600 to-purple-600';
      case 'ADMIN': return 'from-rose-600 to-pink-600';
      default: return 'from-sky-600 to-indigo-600';
    }
  };

  const getRoleBadgeClasses = (role?: string) => {
    switch (role) {
      case 'PATIENT': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'DOCTOR': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'NURSE': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
      case 'RECEPTIONIST': return 'bg-violet-500/10 text-violet-400 border border-violet-500/20';
      case 'ADMIN': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const getSidebarLinks = () => {
    switch (user?.role) {
      case 'PATIENT':
        return [
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'profile', label: 'My Profile', icon: UserIcon },
          { id: 'admission', label: 'My Admission', icon: BedDouble },
          { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
        ];
      case 'DOCTOR':
        return [
          { id: 'overview', label: 'Ward Summary', icon: Activity },
          { id: 'assigned-patients', label: 'Assigned Patients', icon: Users },
        ];
      case 'NURSE':
        return [
          { id: 'overview', label: 'Nurse Registry', icon: Activity },
          { id: 'assigned-patients', label: 'Assigned Patients', icon: Users },
          { id: 'add-treatment', label: 'Log Treatment', icon: Plus },
          { id: 'lookup-treatments', label: 'Treatment Logs', icon: FileText },
        ];
      case 'RECEPTIONIST':
        return [
          { id: 'overview', label: 'Reception Desk', icon: Activity },
          { id: 'intake', label: 'Patient Intake', icon: Plus },
          { id: 'rooms-status', label: 'Rooms Status', icon: BedDouble },
          { id: 'patient-directory', label: 'Patient Directory', icon: Users },
        ];
      case 'ADMIN':
        return [
          { id: 'overview', label: 'System Overview', icon: Activity },
          { id: 'admissions-intake', label: 'Admissions Intake', icon: ClipboardList },
          { id: 'rooms-status', label: 'Rooms Occupancy', icon: BedDouble },
          { id: 'patient-directory', label: 'Patients Directory', icon: Users },
          { id: 'rooms-beds', label: 'Manage Wards', icon: Plus },
          { id: 'audit-logs', label: 'Audit Ops Logs', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const sidebarContent = (isCollapsed: boolean = false) => {
    const links = getSidebarLinks();
    const roleBadgeColor = getRoleBadgeClasses(user?.role);
    const accentGradient = getRoleAccentColor(user?.role);
    
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-850 text-left">
        {/* Branding header */}
        <div className={`flex items-center gap-2.5 py-5 border-b border-slate-800 ${isCollapsed ? 'justify-center px-4' : 'px-6'}`}>
          <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${accentGradient} text-white flex-shrink-0`}>
            <HeartPulse className="h-5 w-5 animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <span className="text-base font-extrabold tracking-tight text-white block">HMS Portal</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Clinical Workspace</span>
            </div>
          )}
        </div>

        {/* User profile card */}
        {isCollapsed ? (
          <div className="p-3 mx-2 my-4 rounded-xl bg-slate-800/40 border border-slate-800/50 flex flex-col items-center justify-center gap-1 group relative">
            <div className={`p-2 bg-gradient-to-tr ${accentGradient} text-white rounded-lg`}>
              <UserIcon className="h-4 w-4" />
            </div>
            {/* Hover tooltip for user info when collapsed */}
            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-950 text-white text-[10px] rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
              <span className="block font-bold">{user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}</span>
              <span className="block text-slate-400 font-mono">@{user?.username} ({user?.role})</span>
            </div>
          </div>
        ) : (
          <div className="p-4 mx-3 my-4 rounded-xl bg-slate-800/40 border border-slate-800/50 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-gradient-to-tr ${accentGradient} text-white rounded-lg`}>
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-white truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}
                </span>
                <span className="block text-[10px] text-slate-400 truncate">
                  {user?.email || 'HMS personnel'}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider ${roleBadgeColor}`}>
                {user?.role}
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">@{user?.username}</span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const IconComponent = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleTabChange(link.id)}
                className={`w-full flex items-center gap-3 text-xs font-bold rounded-xl transition-all duration-155 cursor-pointer relative group ${
                  isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'
                } ${
                  isActive 
                    ? `bg-gradient-to-r ${accentGradient} text-white shadow-md shadow-sky-950/20`
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
                title={isCollapsed ? link.label : undefined}
              >
                <IconComponent className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="animate-fade-in">{link.label}</span>}
                {isCollapsed && (
                  <span className="absolute left-full ml-2 px-3 py-1.5 bg-slate-950 text-white text-[10px] rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                    {link.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Panel (Theme Toggle and Logout) */}
        <div className={`p-4 border-t border-slate-800 space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          {/* Theme switcher inside sidebar */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`w-full flex items-center justify-between text-xs font-bold rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent transition duration-150 cursor-pointer relative group ${
              isCollapsed ? 'justify-center p-2.5' : 'px-4 py-2.5'
            }`}
          >
            {isCollapsed ? (
              <>
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="absolute left-full ml-2 px-3 py-1.5 bg-slate-950 text-white text-[10px] rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                  {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                  {theme.toUpperCase()}
                </span>
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/10 rounded-xl transition duration-150 cursor-pointer relative group ${
              isCollapsed ? 'justify-center p-2.5' : 'px-4 py-2.5 gap-3'
            }`}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
            {isCollapsed && (
              <span className="absolute left-full ml-2 px-3 py-1.5 bg-slate-950 text-white text-[10px] rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  // --- Dynamic States ---
  // Patients
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Rooms
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeAdmissions, setActiveAdmissions] = useState<any[]>([]);
  
  // Admissions
  const [activeAdmission, setActiveAdmission] = useState<any>(null);
  const [treatmentRecords, setTreatmentRecords] = useState<any[]>([]);
  const [activeAdmissionTreatments, setActiveAdmissionTreatments] = useState<any[]>([]);
  const [billDetails, setBillDetails] = useState<any>(null);

  // Patient Specific
  const [patientId, setPatientId] = useState<number | null>(null);
  const [patientAdmissions, setPatientAdmissions] = useState<any[]>([]);
  const [selectedAdmissionForBill, setSelectedAdmissionForBill] = useState<any>(null);

  // Mock Payment Sandbox States
  const [showMockPaymentModal, setShowMockPaymentModal] = useState(false);
  const [mockPaymentData, setMockPaymentData] = useState<any>(null);
  const [mockPaymentLoading, setMockPaymentLoading] = useState(false);

  // Doctor Specific
  const [assignedPatients, setAssignedPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  
  // Nurse Specific
  const [nursePatients, setNursePatients] = useState<any[]>([]);
  const [selectedNurseAdmission, setSelectedNurseAdmission] = useState<any>(null);
  const [nurseTreatmentForm, setNurseTreatmentForm] = useState({
    medicineId: '',
    description: ''
  });

  // Admin Audit Specific
  const [allAdmissions, setAllAdmissions] = useState<any[]>([]);
  const [auditFilter, setAuditFilter] = useState<'active' | 'discharged' | 'all'>('active');
  
  // Forms states
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: '',
    bloodGroup: 'A+',
    address: '',
    emergencyContact: '',
    specialization: '',
    qualifications: '',
    experienceYears: '',
    shiftTiming: '',
    department: '',
    counterNumber: ''
  });

  const [admitForm, setAdmitForm] = useState({
    patientId: '',
    roomType: 'GENERAL',
    reason: ''
  });

  const [treatmentForm, setTreatmentForm] = useState({
    admissionId: '',
    medicineId: '',
    description: ''
  });

  const [roomForm, setRoomForm] = useState({
    roomType: 'GENERAL',
    pricePerDay: '500',
    capacity: '4'
  });

  const [bedForm, setBedForm] = useState({
    roomId: ''
  });

  const [lookupAdmissionId, setLookupAdmissionId] = useState('');
  const [lookupTreatments, setLookupTreatments] = useState<any[]>([]);
  const [lookupBill, setLookupBill] = useState<any>(null);

  // Initialize and Fetch role-specific details
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!user) return;
    
    // Sync initial profile values
    setProfileForm(prev => ({
      ...prev,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || ''
    }));

    if (user.role === 'PATIENT') {
      fetchPatientProfile();
    } else if (user.role === 'DOCTOR') {
      fetchDoctorPatients();
    } else if (user.role === 'NURSE') {
      fetchNursePatients();
    } else if (user.role === 'RECEPTIONIST') {
      fetchRooms();
      fetchPatients();
      fetchActiveAdmissions();
      fetchAllAdmissions();
    } else if (user.role === 'ADMIN') {
      fetchRooms();
      fetchPatients();
      fetchActiveAdmissions();
      fetchAllAdmissions();
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Helper to load Razorpay
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // --- API Integrations ---

  // PATIENT API FETCHES
  const fetchPatientProfile = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/patients/my-profile');
      if (res.ok) {
        const data = await res.json();
        setPatientId(data.id);
        setProfileForm(prev => ({
          ...prev,
          dateOfBirth: data.dateOfBirth || '',
          bloodGroup: data.bloodGroup || 'A+',
          address: data.address || '',
          emergencyContact: data.emergencyContact || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || ''
        }));
        fetchPatientAdmissionsHistory(data.id);
      }
    } catch (err: any) {
      setErrorMsg('Failed to load patient profile details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientAdmissionsHistory = async (pId: number) => {
    try {
      const res = await apiFetch(`/admissions/patient/${pId}`);
      if (res.ok) {
        const data = await res.json();
        setPatientAdmissions(data);
        if (data.length > 0) {
          const sorted = [...data].sort((a: any, b: any) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime());
          const active = sorted.find((a: any) => !a.dischargeDate);
          if (active) {
            setActiveAdmission(active);
            fetchActiveAdmissionTreatments(active.id);
            fetchAdmissionTreatments(active.id);
            fetchAdmissionBill(active.id);
            setSelectedAdmissionForBill(active);
          } else {
            setActiveAdmission(null);
            fetchAdmissionTreatments(sorted[0].id);
            fetchAdmissionBill(sorted[0].id);
            setSelectedAdmissionForBill(sorted[0]);
          }
        } else {
          setActiveAdmission(null);
          setBillDetails(null);
          setTreatmentRecords([]);
          setActiveAdmissionTreatments([]);
          setSelectedAdmissionForBill(null);
        }
      }
    } catch (err) {
      console.log('Error fetching admissions history');
    }
  };

  const fetchActiveAdmissionTreatments = async (admissionId: number) => {
    try {
      const res = await apiFetch(`/treatments/admission/${admissionId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveAdmissionTreatments(data);
      }
    } catch (err) {
      console.log('Error fetching active treatments');
    }
  };

  const fetchPatientActiveAdmission = () => {
    if (patientId) {
      fetchPatientAdmissionsHistory(patientId);
    }
  };

  const fetchAdmissionTreatments = async (admissionId: number) => {
    try {
      const res = await apiFetch(`/treatments/admission/${admissionId}`);
      if (res.ok) {
        const data = await res.json();
        setTreatmentRecords(data);
      }
    } catch (err) {
      console.log('Error fetching treatments');
    }
  };

  const fetchAdmissionBill = async (admissionId: number) => {
    try {
      const res = await apiFetch(`/bill/${admissionId}`);
      if (res.ok) {
        const data = await res.json();
        setBillDetails(data);
      }
    } catch (err) {
      console.log('Error fetching bill details');
    }
  };

  // DOCTOR API FETCHES
  const fetchDoctorPatients = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/doctors/my-patients');
      if (res.ok) {
        const data = await res.json();
        setAssignedPatients(data);
      }
    } catch (err) {
      setErrorMsg('Failed to fetch assigned patients.');
    } finally {
      setLoading(false);
    }
  };

  const viewPatientAdmissions = async (patient: any) => {
    setSelectedPatient(patient);
    try {
      setLoading(true);
      const res = await apiFetch(`/admissions/patient/${patient.id}`);
      if (res.ok) {
        const data = await res.json();
        setPatientHistory(data);
      }
    } catch (err) {
      setErrorMsg('Failed to fetch patient history.');
    } finally {
      setLoading(false);
    }
  };

  const dischargePatient = async (admissionId: number) => {
    if (!confirm('Are you sure you want to discharge this patient?')) return;
    try {
      setLoading(true);
      const res = await apiFetch(`/admissions/discharge/${admissionId}`, {
        method: 'POST'
      });
      if (res.ok) {
        setSuccessMsg('Patient discharged successfully!');
        if (user?.role === 'DOCTOR') fetchDoctorPatients();
        if (user?.role === 'RECEPTIONIST' || user?.role === 'ADMIN') {
          fetchRooms();
          fetchActiveAdmissions();
        }
      } else {
        const txt = await res.text();
        setErrorMsg(getErrorMessage(txt) || 'Failed to discharge patient.');
      }
    } catch (err) {
      setErrorMsg('Server error during discharge.');
    } finally {
      setLoading(false);
    }
  };

  // RECEPTIONIST & ADMIN API FETCHES
  const fetchRooms = async () => {
    try {
      const res = await apiFetch('/rooms');
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      console.log('Error fetching rooms');
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await apiFetch('/patients');
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (err) {
      console.log('Error fetching patients list');
    }
  };

  const fetchActiveAdmissions = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/admissions/active');
      if (res.ok) {
        const data = await res.json();
        setActiveAdmissions(data);
      }
    } catch (err) {
      console.log('Error fetching active admissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchNursePatients = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/admissions/nurse/${user?.username}`);
      if (res.ok) {
        const data = await res.json();
        setNursePatients(data);
      }
    } catch (err) {
      setErrorMsg('Failed to fetch assigned patients.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAdmissions = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/admissions');
      if (res.ok) {
        const data = await res.json();
        setAllAdmissions(data);
      }
    } catch (err) {
      console.log('Error fetching all admissions');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAdmissions = () => {
    switch (auditFilter) {
      case 'active':
        return allAdmissions.filter(adm => !adm.dischargeDate);
      case 'discharged':
        return allAdmissions.filter(adm => adm.dischargeDate);
      case 'all':
      default:
        return allAdmissions;
    }
  };

  // Profile Update Submission
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      setLoading(true);
      const usernameToUpdate = user?.username;
      
      const payload: Record<string, any> = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phone: profileForm.phone,
      };

      if (user?.role === 'PATIENT') {
        payload.dateOfBirth = profileForm.dateOfBirth;
        payload.bloodGroup = profileForm.bloodGroup;
        payload.address = profileForm.address;
        payload.emergencyContact = profileForm.emergencyContact;
      } else if (user?.role === 'RECEPTIONIST') {
        payload.counterNumber = profileForm.counterNumber;
      }

      const res = await apiFetch(`/users/profile/${usernameToUpdate}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMsg('Registry profile updated successfully!');
        // Refresh local details
        if (user?.role === 'PATIENT') fetchPatientProfile();
      } else {
        const errTxt = await res.text();
        setErrorMsg(getErrorMessage(errTxt) || 'Failed to update registry details.');
      }
    } catch (err) {
      setErrorMsg('Server error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  // Admit patient form submit
  const handleAdmitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!admitForm.patientId.trim() || !admitForm.reason.trim()) {
      setErrorMsg('Please specify patient registry ID and admission reason.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch('/admissions', {
        method: 'POST',
        body: JSON.stringify({
          patientId: parseInt(admitForm.patientId),
          roomType: admitForm.roomType,
          reason: admitForm.reason
        })
      });

      if (res.ok) {
        setSuccessMsg('Patient admitted and bed allocated successfully!');
        setAdmitForm({ patientId: '', roomType: 'GENERAL', reason: '' });
        fetchRooms();
        fetchActiveAdmissions();
      } else {
        const txt = await res.text();
        setErrorMsg(getErrorMessage(txt) || 'Failed to admit patient. Verify patient exists and beds are available.');
      }
    } catch (err) {
      setErrorMsg('Server connection failure.');
    } finally {
      setLoading(false);
    }
  };

  // Add Treatment submit
  const handleTreatmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!treatmentForm.admissionId.trim() || !treatmentForm.description.trim()) {
      setErrorMsg('Please enter both Admission ID and treatment details.');
      return;
    }

    try {
      setLoading(true);
      const payload: Record<string, any> = {
        admissionId: parseInt(treatmentForm.admissionId),
        description: treatmentForm.description
      };
      if (treatmentForm.medicineId) {
        payload.medicineId = parseInt(treatmentForm.medicineId);
      }

      const res = await apiFetch('/treatments/add', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMsg('Treatment recorded successfully!');
        setTreatmentForm({ admissionId: '', medicineId: '', description: '' });
      } else {
        const txt = await res.text();
        setErrorMsg(getErrorMessage(txt) || 'Failed to add treatment record.');
      }
    } catch (err) {
      setErrorMsg('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleNurseTreatmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!selectedNurseAdmission) return;
    if (!nurseTreatmentForm.description.trim()) {
      setErrorMsg('Please enter treatment details.');
      return;
    }

    try {
      setLoading(true);
      const payload: Record<string, any> = {
        admissionId: selectedNurseAdmission.id,
        description: nurseTreatmentForm.description
      };
      if (nurseTreatmentForm.medicineId) {
        payload.medicineId = parseInt(nurseTreatmentForm.medicineId);
      }

      const res = await apiFetch('/treatments/add', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccessMsg('Treatment recorded successfully!');
        setNurseTreatmentForm({ medicineId: '', description: '' });
        fetchAdmissionTreatments(selectedNurseAdmission.id);
      } else {
        const txt = await res.text();
        setErrorMsg(getErrorMessage(txt) || 'Failed to add treatment.');
      }
    } catch (err) {
      setErrorMsg('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  // Add Room submit
  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      setLoading(true);
      const res = await apiFetch('/rooms/add', {
        method: 'POST',
        body: JSON.stringify({
          roomType: roomForm.roomType,
          pricePerDay: parseFloat(roomForm.pricePerDay),
          capacity: parseInt(roomForm.capacity)
        })
      });
      if (res.ok) {
        setSuccessMsg('New room and beds initialized successfully!');
        fetchRooms();
      } else {
        const txt = await res.text();
        setErrorMsg(getErrorMessage(txt) || 'Failed to initialize room.');
      }
    } catch (err) {
      setErrorMsg('Connection error.');
    } finally {
      setLoading(false);
    }
  };

  // Add Bed submit
  const handleBedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!bedForm.roomId) {
      setErrorMsg('Please select a room.');
      return;
    }
    try {
      setLoading(true);
      const res = await apiFetch(`/rooms/${bedForm.roomId}/beds/add`, {
        method: 'POST',
        body: JSON.stringify({ isOccupied: false })
      });
      if (res.ok) {
        setSuccessMsg('Extra bed added to room successfully!');
        fetchRooms();
      } else {
        const txt = await res.text();
        setErrorMsg(getErrorMessage(txt) || 'Failed to append bed to room.');
      }
    } catch (err) {
      setErrorMsg('Connection error.');
    } finally {
      setLoading(false);
    }
  };

  // Audit Logs Lookup
  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupAdmissionId.trim()) return;
    auditAdmission(parseInt(lookupAdmissionId));
  };

  const auditAdmission = async (admissionId: number) => {
    setErrorMsg('');
    setSuccessMsg('');
    setLookupTreatments([]);
    setLookupBill(null);
    setLookupAdmissionId(admissionId.toString());

    try {
      setLoading(true);
      const tRes = await apiFetch(`/treatments/admission/${admissionId}`);
      const bRes = await apiFetch(`/bill/${admissionId}`);

      if (tRes.ok) {
        const tData = await tRes.json();
        setLookupTreatments(tData);
      }
      if (bRes.ok) {
        const bData = await bRes.json();
        setLookupBill(bData);
      } else {
        setErrorMsg('Admission not found or does not have billing data yet.');
      }
    } catch (err) {
      setErrorMsg('Error retrieving audit logs.');
    } finally {
      setLoading(false);
    }
  };

  // Razorpay Payments integration
  const handlePayment = async () => {
    if (!selectedAdmissionForBill) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      setLoading(true);

      const res = await apiFetch(`/bill/pay/${selectedAdmissionForBill.id}`, {
        method: 'POST'
      });

      if (!res.ok) {
        const txt = await res.text();
        setErrorMsg(getErrorMessage(txt) || 'Failed to initiate online checkout order.');
        return;
      }

      const orderData = await res.json();

      // Intercept mock checkout mode to avoid standard checkout 401 exceptions from Razorpay servers
      if (
        !orderData.keyId || 
        orderData.keyId.includes('fallbackKey') || 
        (orderData.razorpayOrderId && orderData.razorpayOrderId.startsWith('order_mock_'))
      ) {
        setMockPaymentData(orderData);
        setShowMockPaymentModal(true);
        setLoading(false);
        return;
      }

      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        setErrorMsg('Razorpay SDK failed to load. Are you offline?');
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100, // paise
        currency: orderData.currency,
        name: 'HMS Portal Payments',
        description: `Admission Bill #${orderData.billId} - ${user?.firstName} ${user?.lastName}`,
        order_id: orderData.razorpayOrderId,
        handler: async (response: any) => {
          // Signature Verification callback
          try {
            const verifyRes = await apiFetch('/bill/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            if (verifyRes.ok) {
              setSuccessMsg('Payment processed and verified successfully!');
              if (patientId) fetchPatientAdmissionsHistory(patientId);
            } else {
              setErrorMsg('Payment verification signature check failed.');
            }
          } catch (err) {
            setErrorMsg('Verification callback connection error.');
          }
        },
        prefill: {
          name: `${user?.firstName || ''} ${user?.lastName || ''}`,
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#0284c7'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      setErrorMsg('Failed to process payment checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockPaymentVerify = async (simulateSuccess: boolean) => {
    if (!mockPaymentData) return;
    setErrorMsg('');
    setSuccessMsg('');
    setMockPaymentLoading(true);
    try {
      if (!simulateSuccess) {
        setErrorMsg('Simulated Sandbox Payment: Payment was declined/cancelled by the user.');
        setShowMockPaymentModal(false);
        return;
      }

      // Simulated transaction delay for premium feedback
      await new Promise(resolve => setTimeout(resolve, 1200));

      const verifyRes = await apiFetch('/bill/verify', {
        method: 'POST',
        body: JSON.stringify({
          razorpayOrderId: mockPaymentData.razorpayOrderId,
          razorpayPaymentId: 'pay_mock_' + Math.random().toString(36).substring(2, 9),
          razorpaySignature: 'mock_sig_verification_success'
        })
      });

      if (verifyRes.ok) {
        setSuccessMsg('Mock Payment authorized and verified successfully!');
        if (patientId) fetchPatientAdmissionsHistory(patientId);
      } else {
        const text = await verifyRes.text();
        setErrorMsg(getErrorMessage(text) || 'Mock payment verification failed.');
      }
    } catch (err) {
      setErrorMsg('Error verifying mock sandbox transaction.');
    } finally {
      setMockPaymentLoading(false);
      setShowMockPaymentModal(false);
    }
  };

  // Render Greetings and Badges
  const getGreeting = () => {
    if (!user) return 'Welcome to HMS';
    const name = user.firstName ? `${user.firstName} ${user.lastName}` : user.username;
    
    switch (user.role) {
      case 'DOCTOR':
        return `Welcome, Dr. ${user.lastName || name}`;
      case 'ADMIN':
        return `System Administrator Portal - ${name}`;
      case 'PATIENT':
        return `Hello, ${user.firstName || name}`;
      default:
        return `Welcome back, ${name}`;
    }
  };

  const renderRoleBadge = () => {
    if (!user) return null;
    const colors: Record<string, string> = {
      ADMIN: 'bg-rose-50 text-rose-700 border-rose-200',
      DOCTOR: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      NURSE: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      RECEPTIONIST: 'bg-amber-50 text-amber-700 border-amber-200',
      PATIENT: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    const colorClass = colors[user.role] || 'bg-slate-50 text-slate-700 border-slate-200';
    return (
      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${colorClass}`}>
        {user.role}
      </span>
    );
  };

  // --- Sub-Renderers for Tabbed Dashboards ---

  // 1. PATIENT DASHBOARD
  const renderPatientDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Navigation is managed by the Sidebar */}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-sky-600" />
                <span>My Active Admission</span>
              </h3>
              {activeAdmission ? (
                <div className="p-4 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 rounded-lg space-y-2 text-xs">
                  <div><span className="font-semibold text-slate-600 dark:text-slate-300">Bed Number:</span> {activeAdmission.bed?.bedNumber}</div>
                  <div><span className="font-semibold text-slate-600 dark:text-slate-300">Ward Room:</span> {activeAdmission.bed?.room?.roomNumber} ({activeAdmission.bed?.room?.roomType})</div>
                  <div><span className="font-semibold text-slate-600 dark:text-slate-300">Attending Doctor:</span> Dr. {activeAdmission.doctor?.lastName}</div>
                  <div><span className="font-semibold text-slate-600 dark:text-slate-300">Admission Reason:</span> {activeAdmission.reason}</div>
                  <div><span className="font-semibold text-slate-600 dark:text-slate-300">Date Admitted:</span> {new Date(activeAdmission.admissionDate).toLocaleString()}</div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">You are not currently admitted to a hospital ward.</p>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-sky-600" />
                <span>Bill Status</span>
              </h3>
              {billDetails ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2 text-xs">
                  <div><span className="font-semibold text-slate-600 dark:text-slate-300">Total Bill Amount:</span> ₹{billDetails.totalAmount}</div>
                  <div>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Status:</span>{' '}
                    <span className={`font-bold ${billDetails.status === 'PAID' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {billDetails.status}
                    </span>
                  </div>
                  {billDetails.status !== 'PAID' && (
                    <button 
                      onClick={() => setActiveTab('billing')}
                      className="btn-primary py-1.5 px-3 rounded text-[11px] font-bold mt-2"
                    >
                      Process Payment
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">No invoice is pending checkout.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Left Column: Profile form */}
            <form onSubmit={handleProfileUpdate} className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-sky-600" />
                <span>Update Medical Registry Profile</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">First Name</label>
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Last Name</label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={profileForm.dateOfBirth}
                    onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                    className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Blood Group</label>
                  <select
                    value={profileForm.bloodGroup}
                    onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                    className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Address</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg"
                  placeholder="Enter postal address"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Emergency Contact Number</label>
                <input
                  type="tel"
                  value={profileForm.emergencyContact}
                  onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg"
                  placeholder="Contact relative details"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-2 rounded-lg text-xs font-bold">
                {loading ? 'Saving details...' : 'Save Registry Profile'}
              </button>
            </form>

            {/* Right Column: Admission History */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-sky-600" />
                <span>My Patient Admission History</span>
              </h3>
              
              {patientAdmissions.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {patientAdmissions.map((adm) => {
                    const isDischarged = !!adm.dischargeDate;
                    return (
                      <div 
                        key={adm.id} 
                        className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3 bg-slate-50/50 dark:bg-slate-900/40 text-xs animate-fade-in"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-100">Admission #{adm.id}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Admitted: {new Date(adm.admissionDate).toLocaleString()}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            isDischarged ? 'bg-slate-100 text-slate-500' : 'bg-sky-50 text-sky-700 dark:text-sky-400 border border-sky-100'
                          }`}>
                            {isDischarged ? 'DISCHARGED' : 'ACTIVE'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                          <div>
                            <span className="text-slate-400 block">Ward Allocation</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              Room {adm.bed?.room?.roomNumber} - Bed {adm.bed?.bedNumber} ({adm.bed?.room?.roomType})
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Reason for Visit</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{adm.reason}</span>
                          </div>
                          <div className="mt-1">
                            <span className="text-slate-400 block">Attending Doctor</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              Dr. {adm.doctor?.firstName} {adm.doctor?.lastName}
                            </span>
                          </div>
                          <div className="mt-1">
                            <span className="text-slate-400 block">Assigned Nurse</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {adm.nurse ? `${adm.nurse.firstName} ${adm.nurse.lastName}` : 'Unassigned'}
                            </span>
                          </div>
                          {isDischarged && (
                            <div className="col-span-2 mt-1">
                              <span className="text-slate-400 block">Discharge Date</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {new Date(adm.dischargeDate).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                  No hospitalization record history found.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'admission' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-sky-600" />
                <span>My Hospitalization Record</span>
              </h3>
              <button onClick={fetchPatientActiveAdmission} className="text-slate-400 hover:text-slate-600">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {activeAdmission ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Admission ID</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">#{activeAdmission.id}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Room Allocation</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">Room {activeAdmission.bed?.room?.roomNumber} - Bed {activeAdmission.bed?.bedNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Doctor In-Charge</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">Dr. {activeAdmission.doctor?.firstName} {activeAdmission.doctor?.lastName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Status</span>
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-700 dark:text-sky-400 rounded-full font-bold">ADMITTED</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-sky-600" />
                    <span>Prescriptions & Treatments Log</span>
                  </h4>
                  {activeAdmissionTreatments.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                      <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                          <tr>
                            <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Time</th>
                            <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Administering Nurse</th>
                            <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Medicine Details</th>
                            <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Details / Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                          {activeAdmissionTreatments.map((t: any) => (
                            <tr key={t.id}>
                              <td className="px-4 py-2 text-slate-500 dark:text-slate-400 whitespace-nowrap">{new Date(t.timestamp).toLocaleString()}</td>
                              <td className="px-4 py-2 text-slate-700 dark:text-slate-200">Nurse {t.nurse?.firstName} {t.nurse?.lastName}</td>
                              <td className="px-4 py-2 text-sky-700 dark:text-sky-400 font-medium">
                                {t.medicine ? `${t.medicine.name} (${t.medicine.manufacturer})` : 'N/A'}
                              </td>
                              <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{t.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-center border border-dashed border-slate-200 dark:border-slate-700">No medical treatments have been logged yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">You are not currently admitted to a hospital ward.</p>
            )}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-xl space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-sky-600" />
              <span>Billing Summary & Online Payment</span>
            </h3>

            {patientAdmissions.length > 0 && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Hospitalization Visit</label>
                <select
                  value={selectedAdmissionForBill?.id || ''}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const selected = patientAdmissions.find((adm) => adm.id === selectedId);
                    if (selected) {
                      setSelectedAdmissionForBill(selected);
                      fetchAdmissionBill(selected.id);
                      fetchAdmissionTreatments(selected.id);
                    }
                  }}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800"
                >
                  {patientAdmissions.map((adm) => {
                    const dateStr = new Date(adm.admissionDate).toLocaleDateString();
                    const statusStr = adm.dischargeDate ? 'Discharged' : 'Active';
                    return (
                      <option key={adm.id} value={adm.id}>
                        Visit #{adm.id} ({dateStr}) - {statusStr} - {adm.reason}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {billDetails ? (
              <div className="space-y-4">
                <div className="space-y-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Patient:</span> <span className="font-bold">{billDetails.patientName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Room allocated:</span> <span className="font-bold">#{billDetails.roomNumber} ({billDetails.roomType})</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Duration of stay:</span> <span className="font-bold">{billDetails.daysStayed} days</span></div>
                  <hr className="border-slate-100 dark:border-slate-800 my-2" />
                  <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Room Charges:</span> <span className="font-bold">₹{billDetails.roomCharge}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Medicine Charges:</span> <span className="font-bold">₹{billDetails.medicineCharge}</span></div>
                  {billDetails.additionalCharge > 0 && (
                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Additional Charges:</span> <span className="font-bold">₹{billDetails.additionalCharge}</span></div>
                  )}
                  <hr className="border-slate-200 dark:border-slate-700 my-2" />
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-800 dark:text-slate-100">Total Amount:</span> 
                    <span className="text-sky-700 dark:text-sky-400">₹{billDetails.totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500 dark:text-slate-400">Payment Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      billDetails.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 dark:text-emerald-400 border border-emerald-200' : 'bg-rose-50 text-rose-700 dark:text-rose-400 border border-rose-200'
                    }`}>
                      {billDetails.status}
                    </span>
                  </div>
                </div>

                {/* Treatments Log for selected admission in billing */}
                <div className="space-y-2 pt-2">
                  <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Treatments Log for this Visit</span>
                  {treatmentRecords.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] max-h-40 overflow-y-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                          <tr>
                            <th className="px-3 py-1.5 font-bold text-slate-600 dark:text-slate-300">Medicine</th>
                            <th className="px-3 py-1.5 font-bold text-slate-600 dark:text-slate-300">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                          {treatmentRecords.map((t: any) => (
                            <tr key={t.id}>
                              <td className="px-3 py-1.5 text-sky-700 dark:text-sky-400 font-medium">
                                {t.medicine ? t.medicine.name : 'N/A'}
                              </td>
                              <td className="px-3 py-1.5 text-slate-600 dark:text-slate-300">{t.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded text-center border border-dashed border-slate-200 dark:border-slate-700">No treatments logged for this visit.</p>
                  )}
                </div>

                {billDetails.status !== 'PAID' ? (
                  <button 
                    onClick={handlePayment} 
                    disabled={loading}
                    className="btn-primary w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>{loading ? 'Redirecting to Razorpay...' : 'Pay Bill Securely'}</span>
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 rounded-lg text-xs text-center font-semibold">
                    This bill is already cleared. Thank you!
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">No active bill record was found.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  // 2. DOCTOR DASHBOARD
  const renderDoctorDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Navigation is managed by the Sidebar */}

        {activeTab === 'overview' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-sky-600" />
              <span>Assigned Ward Summary</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              You are currently registered as an active Attending Doctor in the HMS Registry. 
              Click the "Assigned Patients" tab to inspect admitted patients, view medical history log, and record discharges.
            </p>
          </div>
        )}

        {activeTab === 'assigned-patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide flex justify-between items-center">
                <span>Active Patients</span>
                <button onClick={fetchDoctorPatients} className="text-slate-400 hover:text-slate-600">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </h3>
              
              {assignedPatients.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[400px] overflow-y-auto">
                  {assignedPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => viewPatientAdmissions(p)}
                      className={`w-full text-left p-3 text-xs rounded-lg hover:bg-slate-50 transition duration-150 flex flex-col gap-1 border ${
                        selectedPatient?.id === p.id ? 'border-sky-200 bg-sky-50' : 'border-transparent'
                      }`}
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-100">{p.firstName} {p.lastName}</span>
                      <span className="text-[10px] text-slate-400">Username: @{p.username}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Blood Group: {p.bloodGroup || 'Unknown'}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">No admitted patients are currently assigned to you.</p>
              )}
            </div>

            <div className="lg:col-span-2 space-y-4">
              {selectedPatient ? (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                      <p className="text-[10px] text-slate-400">Demographic Profile Record</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div><span className="block text-[10px] text-slate-400">Date of Birth</span> {selectedPatient.dateOfBirth || 'N/A'}</div>
                    <div><span className="block text-[10px] text-slate-400">Blood Group</span> {selectedPatient.bloodGroup || 'N/A'}</div>
                    <div><span className="block text-[10px] text-slate-400">Contact Phone</span> {selectedPatient.phone || 'N/A'}</div>
                    <div className="col-span-2"><span className="block text-[10px] text-slate-400">Address</span> {selectedPatient.address || 'N/A'}</div>
                    <div><span className="block text-[10px] text-slate-400">Emergency Number</span> {selectedPatient.emergencyContact || 'N/A'}</div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Admission Log History</h4>
                    
                    {patientHistory.length > 0 ? (
                      <div className="space-y-4">
                        {patientHistory.map((adm) => {
                          const isDischarged = !!adm.dischargeDate;
                          return (
                            <div key={adm.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 bg-white dark:bg-slate-800">
                              <div className="flex justify-between items-center text-xs">
                                <div>
                                  <span className="font-bold text-slate-800 dark:text-slate-100">Admission #{adm.id}</span>
                                  <span className="text-[10px] text-slate-400 block">Admitted: {new Date(adm.admissionDate).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                    isDischarged ? 'bg-slate-100 text-slate-500' : 'bg-sky-50 text-sky-700 dark:text-sky-400 border border-sky-100'
                                  }`}>
                                    {isDischarged ? 'DISCHARGED' : 'ACTIVE'}
                                  </span>
                                  {!isDischarged && (
                                    <button
                                      onClick={() => dischargePatient(adm.id)}
                                      disabled={loading}
                                      className="px-2 py-1 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 text-rose-700 dark:text-rose-400 hover:bg-rose-100 border border-rose-100 rounded text-[10px] font-bold"
                                    >
                                      Discharge
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-xs text-slate-600 dark:text-slate-300">
                                <span className="font-bold">Reason:</span> {adm.reason}
                              </div>

                              <div className="bg-slate-50 dark:bg-slate-900 rounded p-2 text-xs">
                                <div className="font-semibold text-slate-700 dark:text-slate-200">Allocated bed: Room {adm.bed?.room?.roomNumber} - Bed {adm.bed?.bedNumber}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400">No hospitalization records found for this patient.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center py-12 text-xs text-slate-400">
                  Select a patient from the sidebar to inspect their profile records.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 3. NURSE DASHBOARD
  const renderNurseDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Navigation is managed by the Sidebar */}

        {activeTab === 'overview' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-sky-600" />
              <span>Nurse Registry Portal</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Authorized Nurse operations portal. Use the tabs above to view your assigned patients, record medicine administrations, or log clinical updates against active Patient Admissions.
            </p>
          </div>
        )}

        {activeTab === 'assigned-patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Left Column: Assigned Active Patient Admissions */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide flex justify-between items-center">
                <span>Active Patients</span>
                <button onClick={fetchNursePatients} className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </h3>
              
              {nursePatients.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[400px] overflow-y-auto pr-1">
                  {nursePatients.map((adm) => (
                    <button
                      key={adm.id}
                      onClick={() => {
                        setSelectedNurseAdmission(adm);
                        fetchAdmissionTreatments(adm.id);
                      }}
                      className={`w-full text-left p-3 text-xs rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition duration-150 flex flex-col gap-1 border ${
                        selectedNurseAdmission?.id === adm.id ? 'border-sky-200 bg-sky-50 dark:bg-sky-950/20 font-semibold' : 'border-transparent'
                      }`}
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {adm.patient?.firstName} {adm.patient?.lastName}
                      </span>
                      <span className="text-[10px] text-slate-400">Visit ID: #{adm.id} | @{adm.patient?.username}</span>
                      <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
                        Room {adm.bed?.room?.roomNumber} - Bed {adm.bed?.bedNumber} ({adm.bed?.room?.roomType})
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center bg-slate-50 dark:bg-slate-900 rounded-lg">
                  No active patients are currently assigned to you.
                </p>
              )}
            </div>

            {/* Right Column: Selected Patient admission profile & treatments log */}
            <div className="lg:col-span-2 space-y-4">
              {selectedNurseAdmission ? (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Admission Profile: {selectedNurseAdmission.patient?.firstName} {selectedNurseAdmission.patient?.lastName}
                    </h3>
                    <p className="text-[10px] text-slate-400">Currently admitted in Room {selectedNurseAdmission.bed?.room?.roomNumber}</p>
                  </div>

                  {/* Demographic & Ward Details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Date of Birth</span>
                      {selectedNurseAdmission.patient?.dateOfBirth || 'N/A'}
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Blood Group</span>
                      {selectedNurseAdmission.patient?.bloodGroup || 'N/A'}
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Contact Phone</span>
                      {selectedNurseAdmission.patient?.phone || 'N/A'}
                    </div>
                    <div className="col-span-2">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Reason for Admission</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedNurseAdmission.reason}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Attending Doctor</span>
                      Dr. {selectedNurseAdmission.doctor?.firstName} {selectedNurseAdmission.doctor?.lastName}
                    </div>
                  </div>

                  {/* Treatments logs for this patient */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-sky-600 animate-pulse" />
                      <span>Prescriptions & Treatments Log</span>
                    </h4>
                    {treatmentRecords.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] max-h-40 overflow-y-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-left">
                          <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr>
                              <th className="px-3 py-1.5 font-bold text-slate-600 dark:text-slate-300">Time</th>
                              <th className="px-3 py-1.5 font-bold text-slate-600 dark:text-slate-300">Nurse</th>
                              <th className="px-3 py-1.5 font-bold text-slate-600 dark:text-slate-300">Medicine</th>
                              <th className="px-3 py-1.5 font-bold text-slate-600 dark:text-slate-300">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                            {treatmentRecords.map((t: any) => (
                              <tr key={t.id}>
                                <td className="px-3 py-1.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                  {new Date(t.timestamp).toLocaleString()}
                                </td>
                                <td className="px-3 py-1.5 text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                  {t.nurse?.firstName} {t.nurse?.lastName}
                                </td>
                                <td className="px-3 py-1.5 text-sky-700 dark:text-sky-400 font-medium whitespace-nowrap">
                                  {t.medicine ? `${t.medicine.name} (${t.medicine.manufacturer})` : 'N/A'}
                                </td>
                                <td className="px-3 py-1.5 text-slate-600 dark:text-slate-300">{t.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded text-center border border-dashed border-slate-200 dark:border-slate-700">
                        No treatments logged for this visit yet.
                      </p>
                    )}
                  </div>

                  {/* Add treatment form for this admission */}
                  <form onSubmit={handleNurseTreatmentSubmit} className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                      Log New Clinical Update / Medicine
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Administer Medicine
                        </label>
                        <select
                          value={nurseTreatmentForm.medicineId}
                          onChange={(e) => setNurseTreatmentForm({ ...nurseTreatmentForm, medicineId: e.target.value })}
                          className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800"
                        >
                          <option value="">None / Treatment Only</option>
                          {SEEDED_MEDICINES.map((med) => (
                            <option key={med.id} value={med.id}>
                              {med.name} (Price: ₹{med.price}) - {med.manufacturer}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Treatment Details / Vitals notes
                        </label>
                        <input
                          type="text"
                          value={nurseTreatmentForm.description}
                          onChange={(e) => setNurseTreatmentForm({ ...nurseTreatmentForm, description: e.target.value })}
                          className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg"
                          placeholder="e.g. Regular dressing change, checking vitals..."
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary py-2 px-4 rounded-lg text-xs font-bold w-full md:w-auto">
                      {loading ? 'Recording...' : 'Add Treatment Entry'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center py-16 text-xs text-slate-400">
                  Select a patient from the left column to view details and record treatments.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'add-treatment' && (
          <form onSubmit={handleTreatmentSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-xl space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <Plus className="h-4 w-4 text-sky-600" />
              <span>Record Treatment / Medicine Entry</span>
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Select Patient Admission</label>
              <select
                value={treatmentForm.admissionId}
                onChange={(e) => setTreatmentForm({ ...treatmentForm, admissionId: e.target.value })}
                className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800"
                required
              >
                <option value="">-- Select Patient --</option>
                {nursePatients.map((adm) => (
                  <option key={adm.id} value={adm.id}>
                    #{adm.id} - {adm.patient?.firstName} {adm.patient?.lastName} (Room {adm.bed?.room?.roomNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Administered Medicine</label>
              <select
                value={treatmentForm.medicineId}
                onChange={(e) => setTreatmentForm({ ...treatmentForm, medicineId: e.target.value })}
                className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800"
              >
                <option value="">None / Treatment Only</option>
                {SEEDED_MEDICINES.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.name} (Price: ₹{med.price}) - {med.manufacturer}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Treatment Description</label>
              <textarea
                value={treatmentForm.description}
                onChange={(e) => setTreatmentForm({ ...treatmentForm, description: e.target.value })}
                className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-2 text-xs rounded-lg h-24"
                placeholder="Enter details of treatment or clinical metrics recorded..."
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2 rounded-lg text-xs font-bold">
              {loading ? 'Submitting...' : 'Record Clinical Entry'}
            </button>
          </form>
        )}

        {activeTab === 'lookup-treatments' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Lookup Treatments by Admission
            </h3>
            
            <div className="flex gap-2 max-w-md">
              <input
                type="number"
                value={lookupAdmissionId}
                onChange={(e) => setLookupAdmissionId(e.target.value)}
                className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 px-3 py-1.5 text-xs rounded-lg flex-1"
                placeholder="Enter Admission ID..."
              />
              <button 
                onClick={handleLookupSubmit}
                className="btn-primary px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>

            {lookupTreatments.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Timestamp</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Administered By</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Medicine</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                    {lookupTreatments.map((t: any) => (
                      <tr key={t.id}>
                        <td className="px-4 py-2 text-slate-500 dark:text-slate-400 whitespace-nowrap">{new Date(t.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-200">Nurse {t.nurse?.firstName} {t.nurse?.lastName}</td>
                        <td className="px-4 py-2 text-sky-700 dark:text-sky-400 font-medium">{t.medicine ? t.medicine.name : 'None'}</td>
                        <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{t.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              lookupAdmissionId && <p className="text-xs text-slate-500 dark:text-slate-400">No treatments found for this Admission ID.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  // 4. RECEPTIONIST DASHBOARD
  const renderReceptionistDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Navigation is managed by the Sidebar */}

        {activeTab === 'overview' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-600" />
              <span>Desk Receptionist Portal</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Manage patient admissions, lookup available ward beds, and search/update patient records.
            </p>
          </div>
        )}

        {activeTab === 'intake' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleAdmitSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Plus className="h-4 w-4 text-sky-600" />
                <span>Admit Patient</span>
              </h3>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Patient Registry ID</label>
                <input
                  type="number"
                  value={admitForm.patientId}
                  onChange={(e) => setAdmitForm({ ...admitForm, patientId: e.target.value })}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg"
                  placeholder="Enter Patient ID"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Requested Room Type</label>
                <select
                  value={admitForm.roomType}
                  onChange={(e) => setAdmitForm({ ...admitForm, roomType: e.target.value })}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800"
                >
                  <option value="GENERAL">General Ward</option>
                  <option value="ICU">ICU (Intensive Care Unit)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Admission Reason</label>
                <textarea
                  value={admitForm.reason}
                  onChange={(e) => setAdmitForm({ ...admitForm, reason: e.target.value })}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-2 text-xs rounded-lg h-20"
                  placeholder="Enter details..."
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-2 rounded-lg text-xs font-bold">
                {loading ? 'Allocating Room Bed...' : 'Admit Patient & Allocate Bed'}
              </button>
            </form>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Discharge Desk (Active Admissions)
                </h3>
                <button 
                  type="button" 
                  onClick={fetchActiveAdmissions} 
                  className="text-slate-400 hover:text-slate-600 transition"
                  title="Refresh Active Admissions"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
              
              {activeAdmissions.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800 max-h-[300px]">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900">
                      <tr>
                        <th className="px-3 py-2 font-bold text-slate-500 dark:text-slate-400">ID</th>
                        <th className="px-3 py-2 font-bold text-slate-500 dark:text-slate-400">Patient</th>
                        <th className="px-3 py-2 font-bold text-slate-500 dark:text-slate-400">Room / Bed</th>
                        <th className="px-3 py-2 font-bold text-slate-500 dark:text-slate-400">Admitted</th>
                        <th className="px-3 py-2 font-bold text-slate-500 dark:text-slate-400">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                      {activeAdmissions.map((adm) => (
                        <tr key={adm.id} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 font-bold text-slate-600 dark:text-slate-300">#{adm.id}</td>
                          <td className="px-3 py-2">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {adm.patient?.firstName} {adm.patient?.lastName}
                            </div>
                            <div className="text-[10px] text-slate-400">@{adm.patient?.username}</div>
                          </td>
                          <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                            <div>Room {adm.bed?.room?.roomNumber}</div>
                            <div className="text-[10px] font-medium text-slate-400">Bed {adm.bed?.bedNumber} ({adm.bed?.room?.roomType})</div>
                          </td>
                          <td className="px-3 py-2 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {new Date(adm.admissionDate).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <button
                              onClick={() => dischargePatient(adm.id)}
                              disabled={loading}
                              className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 text-rose-700 dark:text-rose-400 hover:bg-rose-100 border border-rose-100 rounded text-[10px] font-bold transition cursor-pointer"
                            >
                              Discharge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 dark:bg-slate-900 rounded-lg">No patients are currently admitted.</p>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Or Manual Discharge by Admission ID</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    id="dischargeAdmissionId"
                    className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 px-3 py-1.5 text-xs rounded-lg flex-1"
                    placeholder="Enter Admission ID..."
                  />
                  <button 
                    onClick={() => {
                      const el = document.getElementById('dischargeAdmissionId') as HTMLInputElement;
                      if (el && el.value) dischargePatient(parseInt(el.value));
                    }}
                    className="px-4 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 text-rose-700 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/40 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Discharge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rooms-status' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ward Occupancy Logs</h3>
              <button onClick={fetchRooms} className="text-slate-400 hover:text-slate-600">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((r) => {
                  const bedsList = r.beds || [];
                  const occupiedCount = bedsList.filter((b: any) => b.isOccupied).length;
                  return (
                    <div key={r.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-2 bg-slate-50 dark:bg-slate-900 text-xs">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>Room {r.roomNumber}</span>
                        <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] uppercase">{r.roomType}</span>
                      </div>
                      <div>Price: ₹{r.pricePerDay} / day</div>
                      <div>Beds Occupancy: <span className="font-bold">{occupiedCount} / {bedsList.length}</span></div>
                      
                      <div className="pt-2 flex flex-wrap gap-1">
                        {bedsList.map((b: any) => (
                          <span key={b.id} className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            b.isOccupied ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            Bed {b.bedNumber} {b.isOccupied ? '(Occupied)' : '(Available)'}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No rooms are configured in the system yet.</p>
            )}
          </div>
        )}

        {activeTab === 'patient-directory' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hospital Patient Directory</h3>
              <button onClick={fetchPatients} className="text-slate-400 hover:text-slate-600">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 px-3 py-1.5 text-xs rounded-lg flex-1"
                placeholder="Search patient by name or username..."
              />
            </div>

            {patients.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Patient ID</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Name</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Username</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Blood Group</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Phone</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Email</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                    {patients.filter(p => 
                      `${p.firstName} ${p.lastName} ${p.username}`.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((p: any) => (
                      <tr key={p.id}>
                        <td className="px-4 py-2 font-bold text-slate-700 dark:text-slate-200">#{p.id}</td>
                        <td className="px-4 py-2 text-slate-900 dark:text-white font-semibold">{p.firstName} {p.lastName}</td>
                        <td className="px-4 py-2 text-slate-500 dark:text-slate-400">@{p.username}</td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-200 font-medium">{p.bloodGroup || 'Not Specified'}</td>
                        <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{p.phone}</td>
                        <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{p.email}</td>
                        <td className="px-4 py-2 text-sky-600 font-medium">
                          <button 
                            onClick={async () => {
                              setSelectedPatient(p);
                              // Fetch admissions for receptionist overview
                              const res = await apiFetch(`/admissions/patient/${p.id}`);
                              if (res.ok) {
                                const adms = await res.json();
                                setPatientHistory(adms);
                              }
                            }}
                            className="hover:underline cursor-pointer"
                          >
                            View Admissions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">No patients registered in the directory.</p>
            )}

            {selectedPatient && (
              <div className="p-4 border border-sky-100 dark:border-sky-900/30 bg-sky-50/50 rounded-lg space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Admission History for {selectedPatient.firstName} {selectedPatient.lastName}</h4>
                {patientHistory.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {patientHistory.map(a => (
                      <div key={a.id} className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded flex justify-between items-center">
                        <div>
                          <span className="font-bold">Admission #{a.id}</span> - Reason: {a.reason}
                          <span className="block text-[10px] text-slate-400">Date: {new Date(a.admissionDate).toLocaleString()}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          a.dischargeDate ? 'bg-slate-100 text-slate-500' : 'bg-sky-50 text-sky-700 dark:text-sky-400 border border-sky-100'
                        }`}>
                          {a.dischargeDate ? 'DISCHARGED' : 'ACTIVE'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">This patient has no registered admissions.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // 5. ADMIN DASHBOARD
  const renderAdminDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Navigation is managed by the Sidebar */}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="h-4 w-4 text-sky-600" />
                <span>HMS System Administration Dashboard</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Full registry management system. Create hospital rooms, expand bed allocations, admit and discharge patients, and audit treatments/billing details.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xs space-y-1 shadow-sm">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Total Rooms</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{rooms.length}</span>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xs space-y-1 shadow-sm">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Total Beds</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {rooms.reduce((acc, r) => acc + (r.beds?.length || 0), 0)}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xs space-y-1 shadow-sm">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Occupancy Rate</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {rooms.reduce((acc, r) => acc + (r.beds?.length || 0), 0) > 0 
                    ? Math.round((rooms.reduce((acc, r) => acc + (r.beds?.filter((b: any) => b.isOccupied).length || 0), 0) / rooms.reduce((acc, r) => acc + (r.beds?.length || 0), 0)) * 100)
                    : 0}%
                </span>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xs space-y-1 shadow-sm">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Active Admissions</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{activeAdmissions.length}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admissions-intake' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleAdmitSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Plus className="h-4 w-4 text-sky-600" />
                <span>Admit Patient</span>
              </h3>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Patient Registry ID</label>
                <input
                  type="number"
                  value={admitForm.patientId}
                  onChange={(e) => setAdmitForm({ ...admitForm, patientId: e.target.value })}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg"
                  placeholder="Enter Patient ID"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Requested Room Type</label>
                <select
                  value={admitForm.roomType}
                  onChange={(e) => setAdmitForm({ ...admitForm, roomType: e.target.value })}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800"
                >
                  <option value="GENERAL">General Ward</option>
                  <option value="ICU">ICU (Intensive Care Unit)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Admission Reason</label>
                <textarea
                  value={admitForm.reason}
                  onChange={(e) => setAdmitForm({ ...admitForm, reason: e.target.value })}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-2 text-xs rounded-lg h-20"
                  placeholder="Enter details..."
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-2 rounded-lg text-xs font-bold">
                {loading ? 'Allocating Room Bed...' : 'Admit Patient & Allocate Bed'}
              </button>
            </form>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Discharge Desk (Active Admissions)
                </h3>
                <button 
                  type="button" 
                  onClick={fetchActiveAdmissions} 
                  className="text-slate-400 hover:text-slate-600 transition"
                  title="Refresh Active Admissions"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
              
              {activeAdmissions.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800 max-h-[300px]">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900">
                      <tr>
                        <th className="px-3 py-2 font-bold text-slate-500 dark:text-slate-400">ID</th>
                        <th className="px-3 py-2 font-bold text-slate-500 dark:text-slate-400">Patient</th>
                        <th className="px-3 py-2 font-bold text-slate-500 dark:text-slate-400">Room / Bed</th>
                        <th className="px-3 py-2 font-bold text-slate-500 dark:text-slate-400">Admitted</th>
                        <th className="px-3 py-2 font-bold text-slate-500 dark:text-slate-400">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                      {activeAdmissions.map((adm) => (
                        <tr key={adm.id} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 font-bold text-slate-600 dark:text-slate-300">#{adm.id}</td>
                          <td className="px-3 py-2">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {adm.patient?.firstName} {adm.patient?.lastName}
                            </div>
                            <div className="text-[10px] text-slate-400">@{adm.patient?.username}</div>
                          </td>
                          <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                            <div>Room {adm.bed?.room?.roomNumber}</div>
                            <div className="text-[10px] font-medium text-slate-400">Bed {adm.bed?.bedNumber} ({adm.bed?.room?.roomType})</div>
                          </td>
                          <td className="px-3 py-2 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {new Date(adm.admissionDate).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <button
                              onClick={() => dischargePatient(adm.id)}
                              disabled={loading}
                              className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 text-rose-700 dark:text-rose-400 hover:bg-rose-100 border border-rose-100 rounded text-[10px] font-bold transition cursor-pointer"
                            >
                              Discharge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 dark:bg-slate-900 rounded-lg">No patients are currently admitted.</p>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Or Manual Discharge by Admission ID</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    id="adminDischargeAdmissionId"
                    className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 px-3 py-1.5 text-xs rounded-lg flex-1"
                    placeholder="Enter Admission ID..."
                  />
                  <button 
                    onClick={() => {
                      const el = document.getElementById('adminDischargeAdmissionId') as HTMLInputElement;
                      if (el && el.value) dischargePatient(parseInt(el.value));
                    }}
                    className="px-4 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 text-rose-700 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/40 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Discharge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rooms-status' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ward Occupancy Logs</h3>
              <button onClick={fetchRooms} className="text-slate-400 hover:text-slate-600">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((r) => {
                  const bedsList = r.beds || [];
                  const occupiedCount = bedsList.filter((b: any) => b.isOccupied).length;
                  return (
                    <div key={r.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-2 bg-slate-50 dark:bg-slate-900 text-xs">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>Room {r.roomNumber}</span>
                        <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] uppercase">{r.roomType}</span>
                      </div>
                      <div>Price: ₹{r.pricePerDay} / day</div>
                      <div>Beds Occupancy: <span className="font-bold">{occupiedCount} / {bedsList.length}</span></div>
                      
                      <div className="pt-2 flex flex-wrap gap-1">
                        {bedsList.map((b: any) => (
                          <span key={b.id} className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            b.isOccupied ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            Bed {b.bedNumber} {b.isOccupied ? '(Occupied)' : '(Available)'}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No rooms are configured in the system yet.</p>
            )}
          </div>
        )}

        {activeTab === 'patient-directory' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hospital Patient Directory</h3>
              <button onClick={fetchPatients} className="text-slate-400 hover:text-slate-600">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 px-3 py-1.5 text-xs rounded-lg flex-1"
                placeholder="Search patient by name or username..."
              />
            </div>

            {patients.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Patient ID</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Name</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Username</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Blood Group</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Phone</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Email</th>
                      <th className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                    {patients.filter(p => 
                      `${p.firstName} ${p.lastName} ${p.username}`.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((p: any) => (
                      <tr key={p.id}>
                        <td className="px-4 py-2 font-bold text-slate-700 dark:text-slate-200">#{p.id}</td>
                        <td className="px-4 py-2 text-slate-900 dark:text-white font-semibold">{p.firstName} {p.lastName}</td>
                        <td className="px-4 py-2 text-slate-500 dark:text-slate-400">@{p.username}</td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-200 font-medium">{p.bloodGroup || 'Not Specified'}</td>
                        <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{p.phone}</td>
                        <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{p.email}</td>
                        <td className="px-4 py-2 text-sky-600 font-medium">
                          <button 
                            onClick={async () => {
                              setSelectedPatient(p);
                              const res = await apiFetch(`/admissions/patient/${p.id}`);
                              if (res.ok) {
                                const adms = await res.json();
                                setPatientHistory(adms);
                              }
                            }}
                            className="hover:underline cursor-pointer flex items-center animate-fade-in"
                          >
                            View Admissions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">No patients registered in the directory.</p>
            )}

            {selectedPatient && (
              <div className="p-4 border border-sky-100 dark:border-sky-900/30 bg-sky-50/50 rounded-lg space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Admission History for {selectedPatient.firstName} {selectedPatient.lastName}</h4>
                {patientHistory.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {patientHistory.map(a => (
                      <div key={a.id} className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded flex justify-between items-center">
                        <div>
                          <span className="font-bold">Admission #{a.id}</span> - Reason: {a.reason}
                          <span className="block text-[10px] text-slate-400">Date: {new Date(a.admissionDate).toLocaleString()}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          a.dischargeDate ? 'bg-slate-100 text-slate-500' : 'bg-sky-50 text-sky-700 dark:text-sky-400 border border-sky-100'
                        }`}>
                          {a.dischargeDate ? 'DISCHARGED' : 'ACTIVE'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">This patient has no registered admissions.</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'rooms-beds' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleRoomSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2">
                Add Hospital Room (Auto-creates beds)
              </h3>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Room Type</label>
                <select
                  value={roomForm.roomType}
                  onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800"
                >
                  <option value="GENERAL">General Ward</option>
                  <option value="ICU">ICU (Intensive Care Unit)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Price Per Day (INR)</label>
                <input
                  type="number"
                  value={roomForm.pricePerDay}
                  onChange={(e) => setRoomForm({ ...roomForm, pricePerDay: e.target.value })}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Bed Capacity</label>
                <input
                  type="number"
                  value={roomForm.capacity}
                  onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-2 rounded-lg text-xs font-bold">
                {loading ? 'Initializing...' : 'Add Room'}
              </button>
            </form>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
              <form onSubmit={handleBedSubmit} className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2">
                  Add Bed to Existing Room
                </h3>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Select Room Number</label>
                  <select
                    value={bedForm.roomId}
                    onChange={(e) => setBedForm({ roomId: e.target.value })}
                    className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800"
                    required
                  >
                    <option value="">-- Select Room --</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Room {r.roomNumber} ({r.roomType})
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-2 rounded-lg text-xs font-bold">
                  Add Extra Bed
                </button>
              </form>

              <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-700 rounded-lg text-xs space-y-1 mt-4">
                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Rooms Configuration Stats</span>
                <div>Total configured rooms: <span className="font-bold">{rooms.length}</span></div>
                <div>Total beds count: <span className="font-bold">{rooms.reduce((acc, r) => acc + (r.beds?.length || 0), 0)}</span></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit-logs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Left shortcut panel: Admissions lists */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide flex justify-between items-center">
                <span>Admission Registry Audit</span>
                <button onClick={fetchAllAdmissions} className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </h3>

              {/* Status Filters */}
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setAuditFilter('active')}
                  className={`flex-1 py-1 rounded-md font-bold transition cursor-pointer ${
                    auditFilter === 'active' 
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setAuditFilter('discharged')}
                  className={`flex-1 py-1 rounded-md font-bold transition cursor-pointer ${
                    auditFilter === 'discharged' 
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Discharged
                </button>
                <button
                  type="button"
                  onClick={() => setAuditFilter('all')}
                  className={`flex-1 py-1 rounded-md font-bold transition cursor-pointer ${
                    auditFilter === 'all' 
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  All
                </button>
              </div>

              {getFilteredAdmissions().length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[350px] overflow-y-auto pr-1">
                  {getFilteredAdmissions().map((adm) => (
                    <button
                      key={adm.id}
                      onClick={() => auditAdmission(adm.id)}
                      className={`w-full text-left p-3 text-xs rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition duration-150 flex flex-col gap-1 border ${
                        lookupAdmissionId === adm.id.toString() ? 'border-sky-200 bg-sky-50 dark:bg-sky-950/20 font-semibold' : 'border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-100">Admission #{adm.id}</span>
                        <span className={`text-[9px] px-1 font-bold rounded ${
                          adm.dischargeDate ? 'bg-slate-100 text-slate-500' : 'bg-sky-100 text-sky-700 dark:text-sky-400'
                        }`}>
                          {adm.dischargeDate ? 'Discharged' : 'Active'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Patient: {adm.patient?.firstName} {adm.patient?.lastName}</span>
                      <span className="text-[10px] text-slate-400">Room: {adm.bed?.room?.roomNumber} - Bed {adm.bed?.bedNumber}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  No admissions found matching filter.
                </p>
              )}
            </div>

            {/* Right Audit Details Panel */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Audit Check By Admission ID
              </h3>
              
              <form onSubmit={handleLookupSubmit} className="flex gap-2 max-w-md">
                <input
                  type="number"
                  value={lookupAdmissionId}
                  onChange={(e) => setLookupAdmissionId(e.target.value)}
                  className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 px-3 py-1.5 text-xs rounded-lg flex-1"
                  placeholder="Enter Admission ID..."
                  required
                />
                <button type="submit" className="btn-primary px-4 py-1.5 rounded-lg text-xs font-bold">
                  Audit Check
                </button>
              </form>

              {(lookupBill || lookupTreatments.length > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Billing details */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 text-xs bg-slate-50 dark:bg-slate-900">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-1 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-sky-600" />
                      <span>Invoice Audit Details</span>
                    </h4>
                    {lookupBill ? (
                      <div className="space-y-1.5">
                        <div><span className="text-slate-500 dark:text-slate-400 font-semibold">Patient:</span> {lookupBill.patientName}</div>
                        <div><span className="text-slate-500 dark:text-slate-400 font-semibold">Room allocated:</span> Room {lookupBill.roomNumber} ({lookupBill.roomType})</div>
                        <div><span className="text-slate-500 dark:text-slate-400 font-semibold">Duration stay:</span> {lookupBill.daysStayed} days</div>
                        <hr className="border-slate-200 dark:border-slate-700" />
                        <div><span className="text-slate-500 dark:text-slate-400 font-semibold">Room Charges:</span> ₹{lookupBill.roomCharge}</div>
                        <div><span className="text-slate-500 dark:text-slate-400 font-semibold">Medicine Charges:</span> ₹{lookupBill.medicineCharge}</div>
                        <hr className="border-slate-200 dark:border-slate-700" />
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-100">Total: ₹{lookupBill.totalAmount}</div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 font-semibold">Status:</span>{' '}
                          <span className={`font-bold ${lookupBill.status === 'PAID' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {lookupBill.status}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400">No invoice records generated yet.</p>
                    )}
                  </div>

                  {/* Treatment details */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 text-xs bg-white dark:bg-slate-800">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-sky-600" />
                      <span>Clinical Operations Log</span>
                    </h4>
                    {lookupTreatments.length > 0 ? (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {lookupTreatments.map((t: any) => (
                          <div key={t.id} className="border border-slate-100 dark:border-slate-800 rounded p-2 text-[11px] bg-slate-50 dark:bg-slate-900">
                            <div className="flex justify-between text-slate-400 font-semibold mb-1">
                              <span>Nurse {t.nurse?.lastName}</span>
                              <span>{new Date(t.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div><span className="font-semibold text-slate-600 dark:text-slate-300">Medicine:</span> {t.medicine ? t.medicine.name : 'None'}</div>
                            <div><span className="font-semibold text-slate-600 dark:text-slate-300">Log:</span> {t.description}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400">No treatment records logged.</p>
                    )}
                  </div>
                </div>
              ) : (
                lookupAdmissionId && <p className="text-xs text-slate-500 dark:text-slate-400">Search for an admission or select one from the list to audit.</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
      {/* Mobile Drawer Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/60 backdrop-blur-sm transition-all duration-300 text-left">
          <div className="relative w-64 h-full animate-slide-in-right">
            {sidebarContent(false)}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-[-48px] p-2 rounded-full bg-slate-900 text-white border border-slate-800 hover:bg-slate-800 focus:outline-none cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-grow" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* Desktop Sidebar (Fixed Left) */}
      <aside className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 left-0 z-40 h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'md:w-20' : 'md:w-64'
      }`}>
        {sidebarContent(sidebarCollapsed)}
      </aside>

      {/* Main Content Area */}
      <div className={`flex-grow flex flex-col min-h-screen transition-all duration-300 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 ${
        sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
      }`}>
        {/* Thin Header bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 w-full sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle (visible on mobile) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Desktop collapse toggle (visible on desktop) */}
            <button
              onClick={toggleSidebar}
              className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hidden md:inline-flex hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition duration-150"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white uppercase tracking-wider hidden sm:inline-block">
              {user?.role} Portal Workspace
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick theme toggle in header */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 transition duration-150 cursor-pointer"
              title="Toggle color theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700"></div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-none mb-0.5">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                  Role: {user?.role}
                </span>
              </div>
              <div className={`p-1.5 bg-gradient-to-tr ${getRoleAccentColor(user?.role)} text-white rounded-lg`}>
                <UserIcon className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-grow p-4 md:p-8 space-y-6 w-full max-w-full">
          {/* Welcome Section */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-2">
                  {renderRoleBadge()}
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white pt-1">
                  {getGreeting()}
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
                  Welcome to your secure HMS Workspace. Monitor clinical operations, manage active admissions records, process billing invoices, and log treatments.
                </p>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
                <div className={`p-2 bg-gradient-to-tr ${getRoleAccentColor(user?.role)} text-white rounded-lg`}>
                  <Shield className="h-5 w-5 animate-pulse" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-extrabold">Environment</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Secure Sandboxed</span>
                </div>
              </div>
            </div>
          </section>

          {/* Global Notifications */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in text-left">
              <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in text-left">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Render Dashboard based on user role */}
          <div className="animate-fade-in text-left">
            {user?.role === 'PATIENT' && renderPatientDashboard()}
            {user?.role === 'DOCTOR' && renderDoctorDashboard()}
            {user?.role === 'NURSE' && renderNurseDashboard()}
            {user?.role === 'RECEPTIONIST' && renderReceptionistDashboard()}
            {user?.role === 'ADMIN' && renderAdminDashboard()}
          </div>
        </main>
      </div>

      {/* Premium Mock Payment Gateway Modal */}
      {showMockPaymentModal && mockPaymentData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 scale-100 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 animate-pulse text-sky-200" />
                <span className="font-bold text-sm tracking-wide uppercase">HMS Secure Sandbox Pay</span>
              </div>
              <span className="text-[10px] bg-sky-500/30 text-sky-100 border border-sky-400/40 px-2 py-0.5 rounded-full font-semibold">
                Test Mode
              </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 flex-1 text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billing Summary</span>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-3.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-200 block text-xs">Admission Bill #{mockPaymentData.billId}</span>
                    <span className="text-[10px] text-slate-400 font-medium font-mono">Order: {mockPaymentData.razorpayOrderId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-semibold">Amount Due</span>
                    <span className="text-base font-extrabold text-sky-600">₹{mockPaymentData.amount}</span>
                  </div>
                </div>
              </div>

              {/* Simulated Card Detail Display */}
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-950 text-white rounded-xl p-4 shadow-md overflow-hidden flex flex-col justify-between h-36">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-sky-50/10 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">Hospital Secure Pay</span>
                    <span className="text-xs font-semibold text-sky-300">Sandbox Test Account</span>
                  </div>
                  <HeartPulse className="h-6 w-6 text-sky-500 opacity-80 animate-pulse" />
                </div>
                <div>
                  <span className="font-mono text-sm tracking-widest block font-bold">••••  ••••  ••••  4242</span>
                  <div className="flex justify-between items-end mt-2 text-[9px] text-slate-400 uppercase tracking-wider">
                    <div>
                      <span className="block text-[8px] text-slate-500 dark:text-slate-400 font-bold">Card Holder</span>
                      <span className="text-white font-medium">{user?.firstName ? `${user.firstName} ${user.lastName}` : 'HMS PATIENT'}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 dark:text-slate-400 font-bold">Expiry</span>
                      <span className="text-white font-medium">12 / 29</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* simulated options */}
              <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center font-medium bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-100 p-2.5 rounded-lg">
                ⚠️ This is a simulated checkout session because no live Razorpay credentials are configured. No real currency will be charged.
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
              {mockPaymentLoading ? (
                <div className="flex flex-col items-center justify-center py-2 gap-2">
                  <div className="w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 animate-pulse">Authorizing sandbox payment transaction...</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleMockPaymentVerify(true)}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Simulate Payment Success</span>
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMockPaymentVerify(false)}
                      className="flex-1 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 hover:bg-rose-100 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-bold text-[11px] rounded-lg transition duration-150 cursor-pointer"
                    >
                      Decline Payment
                    </button>
                    <button
                      onClick={() => { setShowMockPaymentModal(false); setErrorMsg('Payment session cancelled.'); }}
                      className="flex-1 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300 border border-slate-350 font-bold text-[11px] rounded-lg transition duration-150 cursor-pointer"
                    >
                      Cancel / Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
