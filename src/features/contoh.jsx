import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { Users, MessageSquare, Settings, Trash2, X, Send, Plus, MoreVertical, ArrowLeft, LogOut, UserPlus, UserX } from 'lucide-react';

// --- Konfigurasi Awal ---
// Ganti dengan URL backend Anda yang sebenarnya
const API_BASE_URL = 'https://mentalmate-backend.azurewebsites.net/api';
const SOCKET_URL = 'https://mentalmate-backend.azurewebsites.net';

// --- Komponen Anak untuk UI yang Lebih Bersih ---

// Komponen Modal generik
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md m-4 animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Komponen untuk setiap pesan di chat
const ChatMessage = ({ msg, currentUserId }) => {
    const isSent = msg.sender === currentUserId;
    const isSystem = msg.username === 'Sistem';
    const sentAt = new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    if (isSystem) {
        return (
            <div className="py-2 text-center">
                <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">{msg.text}</span>
            </div>
        );
    }

    return (
        <div className={`flex items-end gap-2 my-2 ${isSent ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-md break-words ${isSent ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                {!isSent && <p className="text-xs font-bold text-indigo-500 mb-1">{msg.username}</p>}
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${isSent ? 'text-blue-200' : 'text-gray-500'} text-right`}>{sentAt}</p>
            </div>
        </div>
    );
};


// --- Komponen Utama: Grup ---

export default function Grup() {
  // --- STATE MANAGEMENT ---
  const [currentUser, setCurrentUser] = useState({
    // Data ini idealnya datang dari context atau props setelah login
  });

  const [view, setView] = useState('list'); // 'list' atau 'chat'
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null); // { _id, name, members, creator }
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  
  // State untuk input form
  const [newGroupName, setNewGroupName] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [addMemberUsername, setAddMemberUsername] = useState('');
  
  // State untuk loading dan error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State untuk modal
  const [modal, setModal] = useState({
    type: null, // 'edit', 'delete', 'leave', 'manageMembers'
    data: null
  });

  const chatContainerRef = useRef(null);

  // --- FUNGSI API CALL ---
  const apiCall = useCallback(async (endpoint, method = 'GET', body = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`
      };
      const config = { method, headers };
      if (body) {
        config.body = JSON.stringify(body);
      }
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server');
      }
      return data;
    } catch (err) {
      setError(err.message);
      console.error("API Call Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser.token]);

  // --- EFFECTS ---

  // Inisialisasi koneksi Socket.IO
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket.IO terhubung dengan ID:', newSocket.id);
      if (currentUser.id) {
        newSocket.emit('registerUser', currentUser.id);
      }
    });

    newSocket.on('newGroupMessage', (newMessage) => {
      // Cek apakah pesan baru untuk grup yang sedang aktif
      if (newMessage.groupId === activeGroup?._id) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
      // Tambahkan notifikasi atau update UI lain di sini
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO terputus');
    });

    // Cleanup saat komponen unmount
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser.id, activeGroup?._id]);
  
  // Join room socket saat daftar grup berubah
  useEffect(() => {
    if (socket && groups.length > 0) {
      const groupIds = groups.map(g => g._id);
      socket.emit('joinGroupRooms', groupIds);
    }
  }, [socket, groups]);

  // Fetch daftar grup saat komponen pertama kali mount
  useEffect(() => {
    const fetchGroups = async () => {
      const data = await apiCall('/groups/my-groups');
      if (data && data.groups) {
        setGroups(data.groups);
      }
    };
    fetchGroups();
  }, [apiCall]);

  // Scroll ke pesan terakhir
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);


  // --- EVENT HANDLERS ---

  const handleOpenChat = async (group) => {
    setActiveGroup(group);
    setView('chat');
    setMessages([]); // Kosongkan pesan lama
    const data = await apiCall(`/groups/${group._id}/messages`);
    if (data) {
      setMessages(data);
    }
  };

  const handleBackToList = () => {
    setView('list');
    setActiveGroup(null);
    setMessages([]);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const data = await apiCall('/groups', 'POST', { name: newGroupName });
    if (data) {
      setGroups(prev => [...prev, data.group]); // Asumsi API mengembalikan grup yang baru dibuat
      setNewGroupName('');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !socket || !activeGroup) return;

    const messageData = {
      groupId: activeGroup._id,
      sender: currentUser.id,
      username: currentUser.username,
      text: chatMessage,
    };

    socket.emit('sendGroupMessage', messageData);
    // Optimistic UI update
    setMessages(prev => [...prev, { ...messageData, createdAt: new Date().toISOString() }]);
    setChatMessage('');
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    const newName = e.target.elements.groupName.value;
    if (!newName.trim() || !modal.data) return;
    
    const data = await apiCall(`/groups/${modal.data._id}`, 'PUT', { name: newName });
    if(data) {
        setGroups(groups.map(g => g._id === modal.data._id ? {...g, name: newName} : g));
        setModal({type: null, data: null});
    }
  };

  const confirmDeleteGroup = async () => {
    if (!modal.data) return;
    const data = await apiCall(`/groups/${modal.data._id}`, 'DELETE');
    if(data !== undefined) { // Check for successful (even if null) response
        setGroups(groups.filter(g => g._id !== modal.data._id));
        setModal({type: null, data: null});
    }
  };
  
  const confirmLeaveGroup = async () => {
    if (!modal.data) return;
    const data = await apiCall(`/groups/${modal.data._id}/leave`, 'POST');
    if(data !== undefined) {
        setGroups(groups.filter(g => g._id !== modal.data._id));
        setModal({type: null, data: null});
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!addMemberUsername.trim() || !modal.data) return;
    const data = await apiCall(`/groups/${modal.data._id}/members`, 'POST', { username: addMemberUsername });
    if(data && data.group) {
        setGroups(groups.map(g => g._id === data.group._id ? data.group : g));
        setModal(prev => ({...prev, data: data.group})); // Update data modal
        setAddMemberUsername('');
    }
  };

  const handleRemoveMember = async (memberId) => {
     if (!modal.data) return;
     const data = await apiCall(`/groups/${modal.data._id}/members/${memberId}`, 'DELETE');
     if(data && data.group) {
        setGroups(groups.map(g => g._id === data.group._id ? data.group : g));
        setModal(prev => ({...prev, data: data.group})); // Update data modal
     }
  };


  // --- RENDER FUNCTIONS ---
  
  const renderGroupList = () => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Grup Saya</h2>
        <form onSubmit={handleCreateGroup} className="flex gap-2 mb-6">
            <input 
                type="text" 
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Nama grup baru..." 
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-300" disabled={isLoading}>
                <Plus size={20} /> Buat
            </button>
        </form>

        <div className="space-y-3">
            {groups.length > 0 ? groups.map(group => {
                const isCreator = group.creator._id === currentUser.id;
                return (
                    <div key={group._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{group.name}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1"><Users size={14} /> {group.members.length} Anggota</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleOpenChat(group)} className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-200 transition text-sm flex items-center gap-2">
                                <MessageSquare size={16} /> Chat
                            </button>
                            <div className="relative group">
                                <button className="p-2 rounded-full hover:bg-gray-100">
                                    <MoreVertical size={20} className="text-gray-600" />
                                </button>
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                    {isCreator ? (
                                        <>
                                            <button onClick={() => setModal({ type: 'edit', data: group })} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Settings size={14} /> Edit Grup</button>
                                            <button onClick={() => setModal({ type: 'manageMembers', data: group })} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Users size={14} /> Kelola Anggota</button>
                                            <hr/>
                                            <button onClick={() => setModal({ type: 'delete', data: group })} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} /> Hapus Grup</button>
                                        </>
                                    ) : (
                                        <button onClick={() => setModal({ type: 'leave', data: group })} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><LogOut size={14}/> Keluar dari Grup</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }) : <p className="text-center text-gray-500 py-8">Anda belum bergabung dengan grup manapun.</p>}
        </div>
    </div>
  );

  const renderChatView = () => (
    <div className="flex flex-col h-full animate-fade-in">
        {/* Chat Header */}
        <div className="flex items-center p-4 border-b bg-white rounded-t-2xl">
            <button onClick={handleBackToList} className="p-2 rounded-full hover:bg-gray-100 transition mr-3">
                <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
                <h2 className="text-lg font-bold text-gray-900">{activeGroup?.name}</h2>
                <p className="text-sm text-gray-500">{activeGroup?.members.length} Anggota</p>
            </div>
        </div>

        {/* Messages Container */}
        <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
                <ChatMessage key={msg._id || index} msg={msg} currentUserId={currentUser.id} />
            ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t rounded-b-2xl">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ketik pesan..."
                    className="flex-grow p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    autoComplete="off"
                />
                <button type="submit" className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-transform hover:scale-110 disabled:bg-blue-300" disabled={isLoading}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    </div>
  );
  
  const renderModals = () => (
    <>
      {/* Modal Edit Grup */}
      <Modal isOpen={modal.type === 'edit'} onClose={() => setModal({type: null, data: null})} title="Edit Nama Grup">
        <form onSubmit={handleUpdateGroup}>
          <input
            name="groupName"
            type="text"
            defaultValue={modal.data?.name}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition mb-4"
            required
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModal({type: null, data: null})} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </Modal>

      {/* Modal Konfirmasi (Hapus/Keluar) */}
      <Modal 
        isOpen={modal.type === 'delete' || modal.type === 'leave'} 
        onClose={() => setModal({type: null, data: null})} 
        title={`Konfirmasi ${modal.type === 'delete' ? 'Hapus' : 'Keluar dari'} Grup`}
      >
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin {modal.type === 'delete' ? `menghapus grup "${modal.data?.name}"? Tindakan ini tidak dapat diurungkan.` : `keluar dari grup "${modal.data?.name}"?`}
        </p>
        <div className="flex justify-end gap-2">
            <button onClick={() => setModal({type: null, data: null})} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
            <button onClick={modal.type === 'delete' ? confirmDeleteGroup : confirmLeaveGroup} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Ya, Lanjutkan</button>
        </div>
      </Modal>

      {/* Modal Kelola Anggota */}
      <Modal isOpen={modal.type === 'manageMembers'} onClose={() => setModal({type: null, data: null})} title={`Kelola Anggota: ${modal.data?.name}`}>
        <div className="space-y-4">
            <form onSubmit={handleAddMember} className="flex gap-2">
                <input 
                    type="text"
                    value={addMemberUsername}
                    onChange={(e) => setAddMemberUsername(e.target.value)} 
                    placeholder="Username anggota baru"
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 flex items-center gap-1"><UserPlus size={16}/> Tambah</button>
            </form>
            <hr/>
            <h4 className="font-semibold text-gray-700">Daftar Anggota</h4>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
                {modal.data?.members.map(member => (
                    <li key={member._id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                       <span>{member.username} {member._id === modal.data?.creator._id && <span className="text-xs text-blue-600 bg-blue-100 font-semibold ml-2 px-2 py-0.5 rounded-full">Creator</span>}</span>
                       {member._id !== modal.data?.creator._id && (
                           <button onClick={() => handleRemoveMember(member._id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                                <UserX size={16} />
                           </button>
                       )}
                    </li>
                ))}
            </ul>
        </div>
      </Modal>
    </>
  );

  return (
    <div className="font-sans bg-gray-100 h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg h-full max-h-[90vh] flex flex-col">
            {view === 'list' ? (
                <div className="p-6 overflow-y-auto">{renderGroupList()}</div>
            ) : (
                renderChatView()
            )}
        </div>
        {renderModals()}
        {isLoading && <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">Loading...</div>}
        {error && <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">{error}</div>}
    </div>
  );
}
