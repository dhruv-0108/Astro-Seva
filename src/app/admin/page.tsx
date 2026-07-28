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
import { Sparkles, LogOut, ExternalLink, MessageSquare, Trash2, CheckCircle2, Clock, Calendar, MapPin, Phone } from 'lucide-react';

interface ClientSubmission {
  id: string;
  name: string;
  phone: string;
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfbf7] text-[#cc6600] gap-3">
        <Sparkles className="w-10 h-10 animate-spin" />
        <div className="text-lg font-bold">Loading Guruji Dashboard...</div>
      </div>
    );
  }

  // Render Login Card if not authenticated
  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-[#fdfbf7] p-4 sm:p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white border border-[#e8e2d5] rounded-2xl p-8 shadow-md w-full max-w-md flex flex-col gap-6"
        >
          <div className="text-center">
            <span className="text-5xl">🪐</span>
            <h1 className="text-2xl font-bold text-[#cc6600] mt-3">Guruji Portal Login</h1>
            <p className="text-gray-400 text-xs mt-1">Astro-Seva Administration Panel</p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-xs font-semibold">
              {loginError}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guruji@astro.com"
              className="border border-[#e8e2d5] rounded-xl p-3.5 outline-none focus:border-[#cc6600] focus:ring-2 focus:ring-amber-200 w-full text-base transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-[#e8e2d5] rounded-xl p-3.5 outline-none focus:border-[#cc6600] focus:ring-2 focus:ring-amber-200 w-full text-base transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="bg-[#cc6600] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#a65300] transition-all w-full cursor-pointer disabled:opacity-50 shadow-md text-base mt-2"
          >
            {isLoggingIn ? 'Logging in...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    );
  }

  const paidCount = submissions.filter((s) => s.paymentStatus === 'paid').length;
  const pendingCount = submissions.filter((s) => s.paymentStatus === 'pending').length;

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#fdfbf7] text-gray-900">
      {/* Saffron Admin Header */}
      <header className="w-full bg-[#cc6600] text-white py-4 px-6 md:px-10 flex justify-between items-center shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🪐</span>
          <div>
            <h1 className="text-lg font-bold tracking-wide">Guruji Dashboard</h1>
            <p className="text-[11px] text-amber-100 font-medium">Astro-Seva Portal Management</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="border border-white/40 bg-white/10 hover:bg-white hover:text-[#cc6600] transition-all py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </header>

      {/* Main Panel Content */}
      <main className="w-full max-w-6xl mx-auto flex flex-col flex-1 py-8 px-4 sm:px-6 md:px-8 space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#e8e2d5] rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Total Submissions</span>
              <span className="text-2xl font-extrabold text-gray-900 mt-1 block">{submissions.length}</span>
            </div>
            <span className="p-3 bg-amber-50 text-[#cc6600] rounded-xl text-xl">📋</span>
          </div>

          <div className="bg-white border border-[#e8e2d5] rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Paid / Approved</span>
              <span className="text-2xl font-extrabold text-green-600 mt-1 block">{paidCount}</span>
            </div>
            <span className="p-3 bg-green-50 text-green-600 rounded-xl text-xl">✅</span>
          </div>

          <div className="bg-white border border-[#e8e2d5] rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Pending Approval</span>
              <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{pendingCount}</span>
            </div>
            <span className="p-3 bg-amber-50 text-amber-600 rounded-xl text-xl">⏳</span>
          </div>
        </div>

        {/* Submissions Container */}
        <div className="bg-white border border-[#e8e2d5] rounded-2xl shadow-sm overflow-hidden">
          
          <div className="p-5 border-b border-[#e8e2d5] bg-[#fff7ed] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Client Submissions & Requests
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Real-time submissions from Astro-Seva website</p>
            </div>
            <span className="text-xs text-gray-400 font-semibold bg-white border border-[#e8e2d5] px-3 py-1.5 rounded-xl self-start sm:self-auto">
              Auto TTL: 30 Days
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-medium space-y-2">
              <span className="text-4xl block">📭</span>
              <p className="text-base">No client submissions found yet.</p>
            </div>
          ) : (
            <div>
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Client Info</th>
                      <th className="p-4">Birth Details</th>
                      <th className="p-4 text-center">Payment Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {submissions.map((client) => (
                      <tr key={client.id} className="hover:bg-amber-50/30 transition-colors">
                        {/* Client Info */}
                        <td className="p-4">
                          <div className="font-bold text-base text-gray-900">{client.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-mono">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{client.phone}</span>
                          </div>
                        </td>

                        {/* Birth Details */}
                        <td className="p-4 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-800">
                            <Calendar className="w-3.5 h-3.5 text-[#cc6600]" />
                            <span className="font-bold">{client.birthDetails.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Clock className="w-3.5 h-3.5 text-[#cc6600]" />
                            <span>{client.birthDetails.time} (IST +{client.birthDetails.tzOffset})</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <MapPin className="w-3.5 h-3.5 text-[#cc6600]" />
                            <span className="truncate max-w-[200px]" title={client.birthDetails.place}>
                              {client.birthDetails.place}
                            </span>
                          </div>
                        </td>

                        {/* Payment Status */}
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${
                              client.paymentStatus === 'paid'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {client.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {client.paymentStatus === 'pending' && (
                              <button
                                onClick={() => handleApprove(client.id)}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            )}

                            {client.paymentStatus === 'paid' && (
                              <>
                                <a
                                  href={`/kundli/${client.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-[#cc6600] hover:bg-[#a65300] text-white font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>View Kundli</span>
                                </a>

                                <button
                                  onClick={() => handleWhatsAppShare(client)}
                                  className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleDelete(client.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl text-xs transition-all cursor-pointer"
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
              <div className="block md:hidden divide-y divide-gray-100">
                {submissions.map((client) => (
                  <div key={client.id} className="p-4 sm:p-5 space-y-3.5 hover:bg-amber-50/20">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base text-gray-900 truncate">{client.name}</h3>
                        <p className="text-xs font-mono text-gray-500 flex items-center gap-1.5 mt-1">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{client.phone}</span>
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                          client.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {client.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>

                    <div className="bg-amber-50/60 rounded-xl p-3 space-y-1.5 text-xs text-gray-700 border border-amber-100/80">
                      <div className="flex flex-wrap items-center gap-2 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#cc6600] shrink-0" />
                          <span className="font-bold">{client.birthDetails.date}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#cc6600] shrink-0" />
                          <span>{client.birthDetails.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-[#cc6600] shrink-0" />
                        <span className="truncate" title={client.birthDetails.place}>{client.birthDetails.place}</span>
                      </div>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {client.paymentStatus === 'pending' && (
                        <button
                          onClick={() => handleApprove(client.id)}
                          className="flex-1 bg-green-600 active:bg-green-700 text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm min-w-[140px]"
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span className="truncate">Approve Payment</span>
                        </button>
                      )}

                      {client.paymentStatus === 'paid' && (
                        <>
                          <a
                            href={`/kundli/${client.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-[#cc6600] active:bg-[#a65300] text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm text-center min-w-[120px]"
                          >
                            <ExternalLink className="w-4 h-4 shrink-0" />
                            <span className="truncate">View Kundli</span>
                          </a>

                          <button
                            onClick={() => handleWhatsAppShare(client)}
                            className="flex-1 bg-[#25D366] active:bg-[#128C7E] text-white font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm min-w-[110px]"
                          >
                            <MessageSquare className="w-4 h-4 shrink-0" />
                            <span className="truncate">WhatsApp</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDelete(client.id)}
                        className="bg-red-50 text-red-600 font-bold p-3 rounded-xl text-xs flex items-center justify-center shrink-0 border border-red-100"
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
        </div>
      </main>
    </div>
  );
}
