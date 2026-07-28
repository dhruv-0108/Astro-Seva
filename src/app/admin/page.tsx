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

import { KundliViewModal } from '../../components/KundliViewModal';

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
  const [selectedClient, setSelectedClient] = useState<ClientSubmission | null>(null);


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
      setLoginError('ગુરુજી, લોગઇન અસફળ રહ્યું. ઇમેઇલ અથવા પાસવર્ડ ફરીથી તપાસો.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // Mark payment as paid
  const handleApprove = async (id: string) => {
    try {
      const docRef = doc(db, 'submissions', id);
      await updateDoc(docRef, { paymentStatus: 'paid' });
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  // Delete record (e.g. manual delete)
  const handleDelete = async (id: string) => {
    if (window.confirm('શું તમે ખરેખર આ રેકોર્ડ કાઢી નાખવા માંગો છો?')) {
      try {
        await deleteDoc(doc(db, 'submissions', id));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  // WhatsApp sharing logic
  const handleWhatsAppShare = (client: ClientSubmission) => {
    const pdfUrl = `${window.location.origin}/api/pdf?id=${client.id}`;
    const message = `હરિ ઓમ, ${client.name}.\nગુરુજી દ્વારા તમારી કુંડળી તૈયાર છે.\nપીડીએફ ડાઉનલોડ કરવા માટે નીચેની લિંક પર ક્લિક કરો:\n${pdfUrl}`;
    
    // Clean phone number (remove spaces, plus, etc.)
    const cleanPhone = client.phone.replace(/[^\d+]/g, '');
    const waUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(
      cleanPhone
    )}&text=${encodeURIComponent(message)}`;
    
    window.open(waUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-[#fdfbf7]">
        <div className="text-xl font-bold text-[#FF9933]">લોડ થઈ રહ્યું છે (Loading)...</div>
      </div>
    );
  }

  // Render Login Card if not authenticated
  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-[#fdfbf7] p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white border border-[#e8e2d5] rounded-xl p-6 shadow-sm w-full max-w-sm flex flex-col gap-5"
        >
          <div className="text-center mb-2">
            <span className="text-4xl">🪐</span>
            <h1 className="text-2xl font-bold text-[#cc6600] mt-2">ગુરુજી લોગઇન</h1>
            <p className="text-gray-400 text-xs mt-1">Astro-Seva Guruji Panel</p>
          </div>

          {loginError && (
            <div className="bg-[#fff0e0] border border-[#FF9933] text-[#cc6600] rounded-lg p-3 text-xs leading-relaxed">
              {loginError}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700">ઇમેઇલ (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guruji@astro.com"
              className="border border-[#e8e2d5] rounded-lg p-3 outline-none focus:border-[#FF9933] w-full text-base"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700">પાસવર્ડ (Password)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-[#e8e2d5] rounded-lg p-3 outline-none focus:border-[#FF9933] w-full text-base"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="bg-[#FF9933] text-white font-bold py-3.5 px-6 rounded-lg hover:bg-[#cc6600] transition-colors w-full cursor-pointer disabled:opacity-50"
          >
            {isLoggingIn ? 'પ્રવેશ કરી રહ્યા છીએ...' : 'પ્રવેશ કરો (Login)'}
          </button>
        </form>
      </div>
    );
  }

  // Render Dashboard if authenticated
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#fdfbf7]">
      {/* Saffron Admin Header */}
      <header className="w-full bg-[#cc6600] text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-bold tracking-wide">🪐 ગુરુજી ડેશબોર્ડ (Guruji Panel)</h1>
        <button
          onClick={handleLogout}
          className="border border-white bg-transparent hover:bg-white hover:text-[#cc6600] transition-colors py-1 px-3 rounded-full text-xs font-bold cursor-pointer"
        >
          Log Out
        </button>
      </header>

      {/* Main Panel Content */}
      <main className="w-full max-w-4xl mx-auto flex flex-col flex-1 py-6 px-0 md:px-4">
        <div className="bg-white border-y md:border border-[#e8e2d5] md:rounded-xl shadow-sm w-full overflow-hidden">
          
          <div className="p-4 border-b border-[#e8e2d5] bg-gray-50 flex justify-between items-center">
            <h2 className="text-md font-bold text-gray-700">
              યજમાનોની યાદી (Requests: {submissions.length})
            </h2>
            <span className="text-xs text-gray-400">સ્વયં-સફાઈ ચક્ર: ૩૦ દિવસ (30-day TTL)</span>
          </div>

          {submissions.length === 0 ? (
            <div className="py-16 text-center text-gray-400 font-medium">
              કોઈ વિનંતી હજી આવી નથી. (No requests yet).
            </div>
          ) : (
            <div className="responsive-table-container">
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>યજમાન (Client Details)</th>
                    <th>જન્મ વિગતો (Birth Details)</th>
                    <th className="text-center">સ્થિતિ (Payment)</th>
                    <th className="text-center">ક્રિયાઓ (Actions)</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((client) => {
                    const dob = new Date(client.birthDetails.date);
                    const formattedDob = dob.toLocaleDateString('gu-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });
                    
                    return (
                      <tr key={client.id} className="hover:bg-gray-50">
                        {/* Client details */}
                        <td>
                          <div className="font-bold text-base text-gray-900">{client.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{client.phone}</div>
                          <div className="text-[10px] text-gray-400 mt-1">
                            આવેલ: {new Date(client.createdAt?.seconds * 1000).toLocaleString('gu-IN')}
                          </div>
                        </td>

                        {/* Birth Details */}
                        <td className="text-sm">
                          <div>📅 {formattedDob}</div>
                          <div className="mt-1">⏰ {client.birthDetails.time} (IST {client.birthDetails.tzOffset})</div>
                          <div className="mt-1 font-medium text-xs text-gray-500">
                            📍 {client.birthDetails.place.split(',').slice(0, 2).join(',')}
                          </div>
                        </td>

                        {/* Payment status */}
                        <td className="text-center">
                          <span
                            className={`inline-block text-xs font-bold px-2.5 py-1.5 rounded-full ${
                              client.paymentStatus === 'paid'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {client.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="flex flex-col md:flex-row gap-2 justify-center items-stretch md:items-center px-2">
                            {client.paymentStatus === 'pending' && (
                              <button
                                onClick={() => handleApprove(client.id)}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer"
                              >
                                ✔️ Approve
                              </button>
                            )}

                            {client.paymentStatus === 'paid' && (
                              <>
                                <button
                                  onClick={() => setSelectedClient(client)}
                                  className="bg-[#cc6600] hover:bg-[#a65300] text-white font-bold py-2 px-3.5 rounded-lg text-xs text-center transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1"
                                >
                                  <span>🔮 View Kundli</span>
                                </button>

                                <button
                                  onClick={() => handleWhatsAppShare(client)}
                                  className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer"
                                >
                                  💬 WhatsApp
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleDelete(client.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold py-1.5 px-2.5 rounded-lg text-xs transition-all cursor-pointer"
                            >
                              Delete
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Interactive Web Kundli Modal */}
      {selectedClient && (
        <KundliViewModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
}

