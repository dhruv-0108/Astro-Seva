'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase/config';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  Button,
  Card,
  Input,
  Badge,
  ErrorBanner,
} from '../../components/ui/DesignSystem';
import {
  Sparkles,
  LogOut,
  ExternalLink,
  MessageSquare,
  Trash2,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Phone,
  User as UserIcon,
  Lock,
  ListFilter,
  Check,
  Hourglass,
} from 'lucide-react';

interface ClientSubmission {
  id: string;
  name: string;
  phone: string;
  serviceSelected?: {
    id: string;
    title: string;
    price: number;
  };
  birthDetails: {
    date: string;
    time: string;
    place: string;
    lat: number;
    lng: number;
    tzOffset: number;
  };
  paymentStatus: 'pending' | 'paid';
  createdAt: any;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [submissions, setSubmissions] = useState<ClientSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch submissions from Firestore (Real-time listener)
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ClientSubmission[] = [];
      snapshot.forEach((docSnap) => {
        list.push({
          id: docSnap.id,
          ...docSnap.data(),
        } as ClientSubmission);
      });
      setSubmissions(list);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      setLoginError('Login failed. Please check your email and password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleApprove = async (id: string) => {
    try {
      const docRef = doc(db, 'submissions', id);
      await updateDoc(docRef, { paymentStatus: 'paid' });
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission record?')) {
      try {
        await deleteDoc(doc(db, 'submissions', id));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleWhatsAppShare = (client: ClientSubmission) => {
    const liveOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://astro-seva-mocha.vercel.app';
    const kundliUrl = `${liveOrigin}/kundli/${client.id}`;
    const message = `Hari Om, ${client.name}.\nYour Kundli report prepared by Guruji is ready.\nClick here to view your complete Kundli:\n${kundliUrl}`;
    
    const cleanPhone = client.phone.replace(/[^\d+]/g, '');
    const waUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(cleanPhone)}&text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF9F5] text-stone-900 gap-3">
        <Sparkles className="w-8 h-8 text-[#B45309] animate-spin" />
        <div className="text-sm font-bold text-stone-700">Loading Guruji Portal...</div>
      </div>
    );
  }

  // Render Login Card if not authenticated
  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-[#FAF9F5] p-4 sm:p-6">
        <Card className="w-full max-w-md space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/60 border border-amber-200 flex items-center justify-center text-[#B45309] mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Guruji Portal Login</h2>
            <p className="text-stone-500 text-xs font-medium">Astro-Seva Administration Panel</p>
          </div>

          {loginError && <ErrorBanner message={loginError} />}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              icon={<UserIcon className="w-3.5 h-3.5 text-[#B45309]" />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guruji@astro.com"
              required
            />

            <Input
              label="Password"
              icon={<Lock className="w-3.5 h-3.5 text-[#B45309]" />}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              isLoading={isLoggingIn}
              fullWidth
              size="lg"
              className="mt-2"
            >
              Sign In to Dashboard
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const paidCount = submissions.filter((s) => s.paymentStatus === 'paid').length;
  const pendingCount = submissions.filter((s) => s.paymentStatus === 'pending').length;

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#FAF9F5] text-stone-900 font-sans">
      
      {/* Serene Admin Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-stone-200/60 py-4 px-6 sm:px-10 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-100/60 border border-amber-200 flex items-center justify-center text-[#B45309]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-stone-900">Guruji Dashboard</h1>
            <p className="text-xs text-stone-500 font-medium">Astro-Seva Management Panel</p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="w-3.5 h-3.5 text-stone-600" />
          <span>Log Out</span>
        </Button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl mx-auto flex flex-col flex-1 py-8 px-4 sm:px-6 md:px-8 space-y-8">
        
        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="flex items-center justify-between p-5">
            <div>
              <span className="text-stone-400 text-xs font-bold uppercase tracking-wider block">Total Submissions</span>
              <span className="text-2xl font-extrabold text-stone-900 mt-1 block">{submissions.length}</span>
            </div>
            <div className="p-3 bg-stone-100 text-stone-700 rounded-2xl">
              <ListFilter className="w-5 h-5" />
            </div>
          </Card>

          <Card className="flex items-center justify-between p-5">
            <div>
              <span className="text-stone-400 text-xs font-bold uppercase tracking-wider block">Paid / Approved</span>
              <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">{paidCount}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
              <Check className="w-5 h-5" />
            </div>
          </Card>

          <Card className="flex items-center justify-between p-5">
            <div>
              <span className="text-stone-400 text-xs font-bold uppercase tracking-wider block">Pending Approval</span>
              <span className="text-2xl font-extrabold text-[#B45309] mt-1 block">{pendingCount}</span>
            </div>
            <div className="p-3 bg-amber-50 text-[#B45309] rounded-2xl">
              <Hourglass className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Submissions Container */}
        <Card className="p-0 overflow-hidden">
          
          <div className="p-6 border-b border-stone-200/60 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Client Submissions & Requests
              </h2>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Real-time submissions from Astro-Seva website</p>
            </div>
            <Badge variant="stone">
              Auto TTL: 30 Days
            </Badge>
          </div>

          {submissions.length === 0 ? (
            <div className="py-20 text-center text-stone-400 space-y-2 font-medium">
              <ListFilter className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-sm">No client submissions found yet.</p>
            </div>
          ) : (
            <div>
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Client Info</th>
                      <th className="p-4">Birth Details</th>
                      <th className="p-4 text-center">Payment Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {submissions.map((client) => (
                      <tr key={client.id} className="hover:bg-amber-50/20 transition-colors">
                        {/* Client Info */}
                        <td className="p-4">
                          <div className="font-bold text-base text-stone-900">{client.name}</div>
                          <div className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-mono">
                            <Phone className="w-3.5 h-3.5 text-stone-400" />
                            <span>{client.phone}</span>
                          </div>
                          {client.serviceSelected && (
                            <div className="mt-1.5">
                              <Badge variant="amber">
                                {client.serviceSelected.title} (₹{client.serviceSelected.price})
                              </Badge>
                            </div>
                          )}
                        </td>

                        {/* Birth Details */}
                        <td className="p-4 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-stone-800">
                            <Calendar className="w-3.5 h-3.5 text-[#B45309]" />
                            <span className="font-bold">{client.birthDetails.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-600">
                            <Clock className="w-3.5 h-3.5 text-[#B45309]" />
                            <span>{client.birthDetails.time} (IST +{client.birthDetails.tzOffset})</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-500">
                            <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                            <span className="truncate max-w-[200px]" title={client.birthDetails.place}>
                              {client.birthDetails.place}
                            </span>
                          </div>
                        </td>

                        {/* Payment Status */}
                        <td className="p-4 text-center">
                          <Badge variant={client.paymentStatus === 'paid' ? 'green' : 'amber'}>
                            {client.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {client.paymentStatus === 'pending' && (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleApprove(client.id)}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </Button>
                            )}

                            {client.paymentStatus === 'paid' && (
                              <>
                                <a
                                  href={`/kundli/${client.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-2 px-3.5 rounded-2xl text-xs shadow-xs"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>View Kundli</span>
                                </a>

                                <button
                                  onClick={() => handleWhatsAppShare(client)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3.5 rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleDelete(client.id)}
                              className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl text-xs transition-all cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="block md:hidden divide-y divide-stone-100">
                {submissions.map((client) => (
                  <div key={client.id} className="p-5 space-y-3.5 hover:bg-amber-50/10">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base text-stone-900 truncate">{client.name}</h3>
                        <p className="text-xs font-mono text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">{client.phone}</span>
                        </p>
                        {client.serviceSelected && (
                          <div className="mt-1">
                            <Badge variant="amber">
                              {client.serviceSelected.title} (₹{client.serviceSelected.price})
                            </Badge>
                          </div>
                        )}
                      </div>

                      <Badge variant={client.paymentStatus === 'paid' ? 'green' : 'amber'} className="shrink-0">
                        {client.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-3.5 space-y-1.5 text-xs text-stone-700 border border-stone-200/60">
                      <div className="flex flex-wrap items-center gap-2 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                          <span className="font-bold">{client.birthDetails.date}</span>
                        </div>
                        <span className="text-stone-300">|</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                          <span>{client.birthDetails.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-600 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                        <span className="truncate" title={client.birthDetails.place}>{client.birthDetails.place}</span>
                      </div>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {client.paymentStatus === 'pending' && (
                        <Button
                          size="md"
                          fullWidth
                          onClick={() => handleApprove(client.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Approve Payment</span>
                        </Button>
                      )}

                      {client.paymentStatus === 'paid' && (
                        <>
                          <a
                            href={`/kundli/${client.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-[#B45309] text-white font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-xs text-center min-w-[120px]"
                          >
                            <ExternalLink className="w-4 h-4 shrink-0" />
                            <span className="truncate">View Kundli</span>
                          </a>

                          <button
                            onClick={() => handleWhatsAppShare(client)}
                            className="flex-1 bg-emerald-600 text-white font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-xs min-w-[110px]"
                          >
                            <MessageSquare className="w-4 h-4 shrink-0" />
                            <span className="truncate">WhatsApp</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDelete(client.id)}
                        className="bg-red-50 text-red-600 font-bold p-3 rounded-2xl text-xs flex items-center justify-center shrink-0 border border-red-100"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
