import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaPaperPlane,
    FaEllipsisV, FaUser, FaUsers, FaBars
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// URL dasar untuk API autentikasi dan server Socket.IO
const API_BASE_URL = import.meta.env.VITE_BASE_URL_AUTH;
const API_SOCKET = import.meta.env.VITE_BASE_URL_SOCKET;

const GroupCircle = () => {
    const navigate = useNavigate();

    const {
        currentUserToken,
        currentUsername,
        currentUserId,
        isLoading, // Ini dari AuthContext, mungkin bisa diintegrasikan
        logout,
        apiCall,
        showModal
    } = useAuth();

    const [socket, setSocket] = useState(null);
    const [myGroups, setMyGroups] = useState([]);
    const [activeView, setActiveView] = useState('groupView');
    const [isAuthInitiallyChecked, setIsAuthInitiallyChecked] = useState(false);

    const [groupName, setGroupName] = useState('');
    const [chatGroupId, setChatGroupId] = useState('');
    const [groupChatTitle, setGroupChatTitle] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [chatMessageInput, setChatMessageInput] = useState('');

    const [showCustomModal, setShowCustomModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('success');
    const [onConfirmModal, setOnConfirmModal] = useState(null);
    const [onCancelModal, setOnCancelModal] = useState(null);

    const [showEditGroupModal, setShowEditGroupModal] = useState(false);
    const [editGroupId, setEditGroupId] = useState('');
    const [editGroupName, setEditGroupName] = useState('');

    const [showManageMembersModal, setShowManageMembersModal] = useState(false);
    const [manageMembersModalTitle, setManageMembersModalTitle] = useState('');
    const [addMemberModalUsername, setAddMemberModalUsername] = useState('');
    const [currentGroupMembers, setCurrentGroupMembers] = useState([]);

    const [showChatOptionsModal, setShowChatOptionsModal] = useState(false);

    // STATE BARU UNTUK ANIMASI LOADING
    const [showLoadingOverlay, setShowLoadingOverlay] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    // STATE BARU UNTUK SEARCH
    const [searchTerm, setSearchTerm] = useState('');

    const chatMessagesContainerRef = useRef(null);
    const activeViewRef = useRef(activeView);
    const chatGroupIdRef = useRef(chatGroupId);

    useEffect(() => {
        activeViewRef.current = activeView;
    }, [activeView]);

    useEffect(() => {
        chatGroupIdRef.current = chatGroupId;
    }, [chatGroupId]);

    useEffect(() => {
        console.log('activeView changed to:', activeView);
    }, [activeView]);

    const displayMessage = useCallback((title, message, type = 'success') => {
        setModalTitle(title);
        setModalMessage(message);
        setModalType(type);
        setOnConfirmModal(null);
        setOnCancelModal(null);
        setShowCustomModal(true);
    }, []);

    const showConfirmationModal = useCallback((title, message, onConfirm, onCancel = () => { }) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalType('confirmation');
        setOnConfirmModal(() => onConfirm);
        setOnCancelModal(() => onCancel);
        setShowCustomModal(true);
    }, []);

    const showView = useCallback((view) => {
        console.log(`[showView] Attempting to set activeView from ${activeViewRef.current} to:`, view);
        setActiveView(view);
    }, []);

    const fetchMyGroups = useCallback(async () => {
        if (!currentUserToken) return;
        try {
            const data = await apiCall('/groups/my-groups');
            if (data && data.groups) {
                setMyGroups(data.groups);
                if (socket && socket.connected) {
                    console.log('[fetchMyGroups] Joining group rooms:', data.groups.map(g => g._id));
                    socket.emit('joinGroupRooms', data.groups.map(g => g._id));
                }
            }
        } catch (error) {
            console.error("[fetchMyGroups] Failed to fetch my groups:", error);
            setMyGroups([]);
        } finally {
            // SET isLoaded KE TRUE SETELAH DATA GROUP DI-FETCH
            setIsLoaded(true);
        }
    }, [currentUserToken, apiCall, socket]);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        const name = groupName.trim();
        if (!name) {
            showModal('Peringatan', 'Nama grup tidak boleh kosong.', 'error');
            return;
        }
        try {
            await apiCall('/groups', 'POST', { name });
            showModal('Sukses', 'Grup berhasil dibuat!');
            setGroupName('');
            fetchMyGroups();
        } catch (error) {
            console.error("[handleCreateGroup] Error creating group:", error);
        }
    };

    const openGroupChat = useCallback(async (groupId, groupName) => {
        showView('groupChatView');
        setGroupChatTitle(`Chat Grup: ${groupName}`);
        setChatGroupId(groupId);
        setChatMessages([]);

        try {
            const messages = await apiCall(`/groups/${groupId}/messages`);
            console.log("[openGroupChat] Fetched messages:", messages);
            setChatMessages(messages);
        } catch (error) {
            console.error("[openGroupChat] Failed to fetch group messages:", error);
        }
    }, [apiCall, showView]);

    const handleEditGroup = (groupId, currentName) => {
        setEditGroupId(groupId);
        setEditGroupName(currentName);
        setShowEditGroupModal(true);
    };

    const handleUpdateGroup = async (e) => {
        e.preventDefault();
        const newName = editGroupName.trim();
        if (!newName) {
            showModal('Peringatan', 'Nama grup tidak boleh kosong.', 'error');
            return;
        }
        try {
            await apiCall(`/groups/${editGroupId}`, 'PUT', { name: newName });
            showModal('Sukses', 'Nama grup berhasil diubah.');
            setShowEditGroupModal(false);
            fetchMyGroups();
            if (chatGroupId === editGroupId) {
                setGroupChatTitle(`Chat Grup: ${newName}`);
            }
        } catch (error) {
            console.error("[handleUpdateGroup] Error updating group:", error);
        }
    };

    const handleDeleteGroup = (groupId, groupName) => {
        const message = `<p>Apakah Anda yakin ingin menghapus grup <strong>${groupName}</strong>? Semua riwayat chat akan hilang dan tindakan ini tidak dapat diurungkan.</p>`;
        showConfirmationModal('Konfirmasi Hapus Grup', message, async () => {
            try {
                await apiCall(`/groups/${groupId}`, 'DELETE');
                showModal('Sukses', 'Grup berhasil dihapus.');
                fetchMyGroups();
                if (chatGroupId === groupId) {
                    showView('groupView');
                    setChatGroupId('');
                    setGroupChatTitle('');
                    setChatMessages([]);
                }
            } catch (error) {
                console.error("[handleDeleteGroup] Error deleting group:", error);
            }
        });
    };

    const handleLeaveGroup = (groupId, groupName) => {
        const message = `<p>Apakah Anda yakin ingin keluar dari grup <strong>${groupName}</strong>?</p>`;
        showConfirmationModal('Konfirmasi Keluar Grup', message, async () => {
            try {
                await apiCall(`/groups/${groupId}/leave`, 'POST');
                showModal('Sukses', 'Anda telah keluar dari grup.');
                fetchMyGroups();
                if (chatGroupId === groupId) {
                    showView('groupView');
                    setChatGroupId('');
                    setChatGroupTitle('');
                    setChatMessages([]);
                }
            }
            catch (error) {
                console.error("[handleLeaveGroup] Error leaving group:", error);
            }
        });
    };

    const renderMemberList = (group) => {
        const currentGroupData = myGroups.find(g => g._id === group._id);
        const creatorId = currentGroupData ? currentGroupData.creator._id : null;

        return (
            <ul className="border border-[#5C8374] rounded-md divide-y divide-[#9EC8B9]">
                {group.members.map(member => (
                    <li key={member._id} className="flex justify-between items-center py-2 px-3">
                        <span>
                            <FaUser className="mr-2 inline-block text-[#092635]" />
                            {member.username} {member._id === creatorId ? <span className="bg-[#1B4242] text-white text-xs font-semibold px-2 py-1 rounded-full ml-2">Creator</span> : ''}
                        </span>
                        {currentGroupData && currentGroupData.creator._id === currentUserId && member._id !== currentUserId && (
                            <button
                                type="button"
                                className="text-red-500 hover:text-red-700 text-sm px-3 py-1 border border-red-500 rounded-md hover:bg-red-50 transition duration-200"
                                onClick={() => handleRemoveMember(group._id, member._id, member.username)}
                            >
                                Keluarkan
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    const openManageMembersModal = (groupId) => {
        const group = myGroups.find(g => g._id === groupId);
        if (!group) return;
        setManageMembersModalTitle(`Kelola Anggota: ${group.name}`);
        setCurrentGroupMembers(group.members);
        setEditGroupId(groupId);
        setShowManageMembersModal(true);
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        const groupId = editGroupId;
        const username = addMemberModalUsername.trim();
        if (!groupId || !username) {
            showModal('Peringatan', 'Username atau ID grup tidak boleh kosong.', 'error');
            return;
        }
        try {
            setShowManageMembersModal(false);
            await apiCall(`/groups/${groupId}/members`, 'POST', { username });
            showModal('Sukses', `Anggota ${username} berhasil ditambahkan!`);
            await fetchMyGroups();
            setTimeout(() => {
                const updatedGroup = myGroups.find(g => g._id === groupId);
                if (updatedGroup) {
                    openManageMembersModal(groupId);
                }
            }, 500);
        } catch (error) {
            setTimeout(() => setShowManageMembersModal(true), 500);
            console.error("[handleAddMember] Error adding member:", error);
        } finally {
            setAddMemberModalUsername('');
        }
    };

    const handleRemoveMember = (groupId, memberId, memberName) => {
        const message = `<p>Apakah Anda yakin ingin mengeluarkan <strong>${memberName}</strong> dari grup?</p>`;
        setShowManageMembersModal(false);

        showConfirmationModal('Konfirmasi Keluarkan Anggota', message,
            async () => {
                try {
                    await apiCall(`/groups/${groupId}/members/${memberId}`, 'DELETE');
                    showModal('Sukses', `${memberName} berhasil dikeluarkan.`);
                    await fetchMyGroups();
                    setTimeout(() => openManageMembersModal(groupId), 500);
                } catch (error) {
                    setTimeout(() => openManageMembersModal(groupId), 500);
                    console.error("[handleRemoveMember] Error removing member:", error);
                }
            },
            () => {
                setTimeout(() => setShowManageMembersModal(true), 500);
            }
        );
    };

    const handleSendGroupMessage = (e) => {
        e.preventDefault();
        const text = chatMessageInput.trim();
        if (!text || !chatGroupId || !socket) return;

        const messageData = {
            groupId: chatGroupId,
            sender: currentUserId,
            username: currentUsername,
            text: text,
            createdAt: new Date().toISOString()
        };

        socket.emit('sendGroupMessage', messageData);
        console.log("[handleSendGroupMessage] Sent message:", messageData);

        // Hapus penambahan lokal untuk menghindari duplikasi
        // setChatMessages((prevMessages) => [...prevMessages, messageData]);
        setChatMessageInput('');
    };

    const connectSocket = useCallback(() => {
        if (socket || !currentUserId) return;

        const newSocket = io(API_SOCKET);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('[Socket.IO] Connected to Socket.IO server with id:', newSocket.id);
            newSocket.emit('registerUser', currentUserId);
            if (myGroups.length > 0) {
                console.log('[Socket.IO] Joining group rooms on connect:', myGroups.map(g => g._id));
                newSocket.emit('joinGroupRooms', myGroups.map(g => g._id));
            }
        });

        newSocket.on('newGroupMessage', (message) => {
            console.log('[Socket.IO] Received new message:', message);
            console.log(`[Socket.IO - New Message Check] activeViewRef.current: ${activeViewRef.current}, chatGroupIdRef.current: ${chatGroupIdRef.current}, message.groupId: ${message.groupId}`);

            if (activeViewRef.current === 'groupChatView' && chatGroupIdRef.current === message.groupId) {
                console.log('[Socket.IO - New Message Check] Conditions met, adding message to state.');
                setChatMessages((prevMessages) => [...prevMessages, message]);
            } else {
                console.log('[Socket.IO - New Message Check] Conditions NOT met, message not added to state. Current activeView:', activeViewRef.current, 'Current chatGroupId:', chatGroupIdRef.current);
            }

            if (message.isSupportAlert && message.sender !== currentUserId) {
                let messageText = `Halo, temanmu <b>${message.fromUser}</b> di grup ini sepertinya ${message.reasonForAlert}. Mungkin kamu bisa menyapanya?`;
                let actionButton = null;
                if (message.supportUrl) {
                    actionButton = {
                        text: `Sapa ${message.fromUser} di WhatsApp`,
                        url: message.supportUrl,
                        className: 'bg-[#25D366] hover:bg-[#1DA851] text-white flex items-center justify-center', // Contoh warna WhatsApp
                        icon: "lucide-whatsapp"
                    };
                }
                showModal('Butuh Dukungan Teman', messageText, false, actionButton);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('[Socket.IO] Disconnected from Socket.IO server');
            setSocket(null);
        });

        return () => {
            console.log('[Socket.IO] Cleaning up socket listeners.');
            newSocket.off('connect');
            newSocket.off('newGroupMessage');
            newSocket.off('disconnect');
            newSocket.disconnect();
        };
    }, [socket, currentUserId, myGroups, showModal]);

    useEffect(() => {
        if (chatMessagesContainerRef.current) {
            chatMessagesContainerRef.current.scrollTop = chatMessagesContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const updateUIForAuthState = useCallback(() => {
        const isLoggedIn = !!currentUserToken;
        console.log(`[updateUIForAuthState] User is logged in: ${isLoggedIn}`);
        if (isLoggedIn) {
            if (!isAuthInitiallyChecked) {
                setActiveView('groupView');
                setIsAuthInitiallyChecked(true);
            }
            connectSocket();
            fetchMyGroups();
        } else {
            navigate('/login');
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
             // SET isLoaded KE TRUE MESKIPUN REDIRECT KE LOGIN
             setIsLoaded(true);
        }
    }, [currentUserToken, socket, connectSocket, fetchMyGroups, navigate, isAuthInitiallyChecked]);

    useEffect(() => {
        updateUIForAuthState();
    }, [currentUserToken, updateUIForAuthState]);

    // EFek untuk menghilangkan overlay loading setelah isLoaded menjadi true
    useEffect(() => {
        if (isLoaded) {
            const timer = setTimeout(() => {
                setShowLoadingOverlay(false);
            }, 500); // Durasi fade-out animasi

            return () => clearTimeout(timer);
        }
    }, [isLoaded]);


    const handleShowGroupView = () => {
        showView('groupView');
    };

    const openChatOptionsModal = () => {
        setShowChatOptionsModal(true);
    };

    // Filtered groups for search functionality
    const filteredGroups = myGroups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const customScrollbarStyles = `
        .my-groups-scroll-area::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        .my-groups-scroll-area::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }

        .my-groups-scroll-area::-webkit-scrollbar-thumb {
            background: #5C8374;
            border-radius: 10px;
        }

        .my-groups-scroll-area::-webkit-scrollbar-thumb:hover {
            background: #1B4242;
        }

        .my-groups-scroll-area {
            scrollbar-width: thin;
            scrollbar-color: #5C8374 #f1f1f1;
        }

        /* CSS untuk Animasi Loading */
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #092635; /* Warna background overlay */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.5s ease-out; /* Durasi transisi fade out */
        }

        .loading-overlay.hidden {
            opacity: 0;
            pointer-events: none; /* Agar tidak menghalangi interaksi setelah fade out */
        }

        .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #9EC8B9; /* Warna spinner */
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    return (
        <div className="min-h-screen mt-15 bg-[#092635] p-4 font-sans antialiased flex justify-center items-center">
            <style>{customScrollbarStyles}</style>

            {/* OVERLAY LOADING */}
            {showLoadingOverlay && (
                <div className={`loading-overlay ${isLoaded ? 'hidden' : ''}`}>
                    <div className="spinner"></div>
                </div>
            )}

            {currentUserToken ? (
                <div className="flex bg-white rounded-lg shadow-xl w-full max-w-[1200px] h-[90vh] overflow-hidden">
                    {/* Sidebar Daftar Grup - Terlihat di desktop, tersembunyi di mobile kecuali activeView adalah 'groupView' */}
                    <div
                        className={`
                            w-64 bg-[#1B4242] text-white p-4 flex-col flex-shrink-0
                            ${activeView === 'groupView' ? 'flex w-full md:w-64' : 'hidden md:flex'}
                        `}
                    >
                        <div className="flex items-center mb-6">
                            {/* Avatar placeholder atau gambar profil */}
                            <div className="ml-2">
                                <h3 className="text-lg font-semibold text-[#9EC8B9]">{currentUsername}</h3>
                                <p className="text-xs text-[#5C8374]">online</p>
                            </div>
                        </div>
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full p-2 rounded-md bg-[#092635] text-white placeholder-[#9EC8B9] border border-[#5C8374] focus:outline-none focus:border-[#9EC8B9]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex-grow overflow-y-auto pr-2 my-groups-scroll-area">
                            <h4 className="text-md font-semibold mb-3 text-[#9EC8B9]">My Groups</h4>
                            {filteredGroups.length > 0 ? (
                                filteredGroups.map(group => (
                                    <div
                                        key={group._id}
                                        className="mb-3 p-3 rounded-lg cursor-pointer hover:bg-[#1B4242] transition duration-200"
                                        onClick={() => openGroupChat(group._id, group.name)}
                                    >
                                        <h5 className="font-semibold text-white">{group.name}</h5>
                                        <p className="text-xs text-[#5C8374]">{group.members.length} members</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[#5C8374]">No groups found.</p>
                            )}
                        </div>
                        {/* Form untuk membuat grup baru - pindah ke sidebar */}
                        <div className="mt-auto pt-4 border-t border-[#5C8374] border-opacity-50">
                            <h4 className="text-md font-semibold mb-3 text-[#9EC8B9]">Create New Group</h4>
                            <form onSubmit={handleCreateGroup}>
                                <div className="flex">
                                    <input
                                        type="text"
                                        id="groupName"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        className="flex-grow px-3 py-2 w-10 border border-[#5C8374] rounded-l-md text-sm bg-[#092635] text-white placeholder-[#9EC8B9] focus:outline-none focus:ring-2 focus:ring-[#9EC8B9]"
                                        placeholder="New Group Name"
                                        required
                                    />
                                    <button type="submit" className="bg-[#5C8374] text-white px-4 py-2 rounded-r-md hover:bg-[#9EC8B9] hover:text-[#092635] transition duration-200 focus:outline-none">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Main Content Area (Group Management / Chat) */}
                    <div
                        className={`
                            flex-grow flex flex-col bg-white
                            ${activeView === 'groupChatView' ? 'flex w-full' : 'hidden md:flex w-full'}
                            ${activeView === 'groupView' && 'hidden md:flex'}
                        `}
                    >
                        {/* Header untuk Chat View (Mobile Only) */}
                        {activeView === 'groupChatView' && (
                            <div className="md:hidden flex justify-between items-center bg-[#1B4242] text-white p-4 flex-shrink-0">
                                <button onClick={handleShowGroupView} className="text-[#9EC8B9] hover:text-white">
                                    <FaArrowLeft className="inline-block mr-2" /> Back
                                </button>
                                <h3 className="text-lg font-bold truncate max-w-[70%]">{groupChatTitle}</h3>
                                <button onClick={openChatOptionsModal} className="text-[#9EC8B9] hover:text-white">
                                    <FaEllipsisV />
                                </button>
                            </div>
                        )}

                        {/* Tampilan Manajemen Grup */}
                        {activeView === 'groupView' && (
                            <div id="groupView" className="flex-grow p-4 md:p-8">
                                <h3 className="text-2xl font-bold mb-4 text-[#092635] hidden md:block">Group Chat</h3>
                                <div className="flex mb-4 border-b border-[#5C8374]">
                                    <button className="px-4 py-2 text-[#092635] border-b-2 border-[#092635] font-semibold">My Groups</button>
                                </div>

                                <h4 className="text-lg font-semibold mb-3 text-[#092635]">Manage Existing Groups</h4>
                                <div id="groupList" className="mb-4 space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 my-groups-scroll-area">
                                    {myGroups.length > 0 ? (
                                        myGroups.map(group => {
                                            const membersListHtml = group.members.map(m =>
                                                m.username === currentUsername ? `<span class="font-bold">${m.username} (You)</span>` : m.username
                                            ).join(', ');

                                            return (
                                                <div className="bg-[#9EC8B9] rounded-lg shadow-sm mb-3 transition transform hover:scale-[1.01] hover:shadow-md" key={group._id}>
                                                    <div className="p-4 flex justify-between items-center">
                                                        <div className="cursor-pointer flex-grow" onClick={() => openGroupChat(group._id, group.name)}>
                                                            <h5 className="text-lg font-semibold mb-1 text-[#092635]">{group.name}</h5>
                                                            <h6 className="text-sm text-[#1B4242] mb-2">Created by: {group.creator.username}</h6>
                                                            <p className="text-sm text-[#092635] mb-0" dangerouslySetInnerHTML={{ __html: `Members: ${membersListHtml}` }}></p>
                                                        </div>
                                                        <div className="relative">
                                                            <DropdownMenu
                                                                trigger={<button className="bg-transparent border-0 text-[#092635] hover:text-[#1B4242] p-1 focus:outline-none"><FaEllipsisV /></button>}
                                                                options={
                                                                    group.creator._id === currentUserId ? [
                                                                        { label: 'Edit Group', onClick: () => handleEditGroup(group._id, group.name) },
                                                                        { label: 'Manage Members', onClick: () => openManageMembersModal(group._id) },
                                                                        { type: 'divider' },
                                                                        { label: 'Delete Group', onClick: () => handleDeleteGroup(group._id, group.name), className: 'text-red-500 hover:bg-red-50' }
                                                                    ] : [
                                                                        { label: 'Leave Group', onClick: () => handleLeaveGroup(group._id, group.name), className: 'text-red-500 hover:bg-red-50' }
                                                                    ]
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-[#5C8374]">You haven't joined any groups yet.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tampilan Chat Grup */}
                        {activeView === 'groupChatView' && (
                            <div id="groupChatView" className="flex-grow flex flex-col p-4">
                                {/* Header Chat Grup (Desktop Only) */}
                                <div className="hidden md:flex justify-between items-center mb-4 pb-2 border-b border-[#5C8374]">
                                    <h3 className="text-2xl font-bold text-[#092635]">{groupChatTitle}</h3>
                                    <button
                                        type="button"
                                        className="border border-[#5C8374] text-[#092635] px-3 py-1 rounded-md hover:bg-[#9EC8B9] transition duration-200 focus:outline-none"
                                        onClick={() => showView('groupView')}
                                    >
                                        <FaArrowLeft className="mr-1 inline-block" /> Back to Groups
                                    </button>
                                </div>
                                {/* Container Pesan Chat */}
                                <div
                                    ref={chatMessagesContainerRef}
                                    id="chatMessagesContainer"
                                    className="flex-grow overflow-y-auto border border-[#5C8374] p-3 rounded-lg bg-[#F3F4F6] flex flex-col space-y-2 mb-3 max-h-[calc(100vh-250px)] md:max-h-[calc(90vh-150px)]"
                                >
                                    {chatMessages.length > 0 ? (
                                        chatMessages.map((message, index) => {
                                            const isSystemMessage = message.username === 'Sistem';
                                            if (isSystemMessage && message.sender === currentUserId) return null;

                                            const messageType = isSystemMessage ? 'system' : (message.sender === currentUserId ? 'sent' : 'received');

                                            const dateObj = new Date(message.createdAt);
                                            const sentAt = !isNaN(dateObj.getTime()) ? dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';

                                            return (
                                                <div
                                                    key={index}
                                                    className={`max-w-[80%] p-2 rounded-xl text-sm break-words ${messageType === 'sent'
                                                            ? 'bg-[#9EC8B9] ml-auto self-end rounded-br-md text-[#092635]'
                                                            : messageType === 'received'
                                                                ? 'bg-white border border-[#5C8374] mr-auto self-start rounded-bl-md'
                                                                : 'bg-yellow-50 text-yellow-800 border border-yellow-200 self-center text-center italic text-xs max-w-[95%] w-auto'
                                                        }`}
                                                >
                                                    {isSystemMessage ? (
                                                        <div className="text-sm">{message.text}</div>
                                                    ) : (
                                                        <>
                                                            {messageType === 'received' && <div className="font-semibold text-xs mb-0.5 text-[#1B4242]">{message.username}</div>}
                                                            <div className="text-sm">{message.text}</div>
                                                            <div className="text-xs text-[#5C8374] mt-1 text-right">{sentAt}</div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-center text-[#5C8374]">No messages in this group yet.</p>
                                    )}
                                </div>
                                {/* Form Input Pesan */}
                                <form onSubmit={handleSendGroupMessage}>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="chatMessageInput"
                                            value={chatMessageInput}
                                            onChange={(e) => setChatMessageInput(e.target.value)}
                                            className="flex-grow px-3 py-2 border border-[#5C8374] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#1B4242]"
                                            placeholder="Type a message..."
                                            required
                                            autoComplete="off"
                                        />
                                        <button type="submit" className="bg-[#1B4242] text-white px-4 py-2 rounded-r-md hover:bg-[#092635] transition duration-200 focus:outline-none"><FaPaperPlane /></button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center text-[#092635] text-xl font-semibold">
                    Loading or redirecting to login...
                </div>
            )}

            {/* Modal Kustom (Notifikasi/Konfirmasi) - Tidak berubah, umumnya responsif */}
            {showCustomModal && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4"
                    style={{ backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="border-b border-[#E5E7EB] pb-3 p-6 flex justify-between items-center">
                            <h3 className={`text-xl font-bold ${modalType === 'error' ? 'text-red-600' : 'text-[#092635]'}`}>{modalTitle}</h3>
                            <button className="text-[#5C8374] hover:text-[#092635] focus:outline-none text-2xl" onClick={() => { setShowCustomModal(false); if (modalType === 'confirmation' && onCancelModal) onCancelModal(); }}>&times;</button>
                        </div>
                        <div className="py-4 px-6">
                            <div className="text-[#092635]" dangerouslySetInnerHTML={{ __html: modalMessage }}></div>
                        </div>
                        <div className="border-t border-[#E5E7EB] pt-3 px-6 pb-6 flex justify-end gap-2">
                            {modalType === 'confirmation' ? (
                                <>
                                    <button type="button" className="border border-[#5C8374] text-[#092635] px-4 py-2 rounded-md hover:bg-[#F3F4F6] transition duration-200 focus:outline-none" onClick={() => { setShowCustomModal(false); if (onConfirmModal) onConfirmModal(); }}>Cancel</button>
                                    <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 focus:outline-none" onClick={() => { setShowCustomModal(false); if (onConfirmModal) onConfirmModal(); }}>Yes, Continue</button>
                                </>
                            ) : (
                                <button type="button" className="w-full bg-[#1B4242] text-white font-semibold py-2 rounded-md hover:bg-[#092635] transition duration-200 focus:outline-none" onClick={() => setShowCustomModal(false)}>Close</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Grup - Tidak berubah, umumnya responsif */}
            {showEditGroupModal && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4"
                    style={{ backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="border-b border-[#E5E7EB] pb-3 p-6 flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-[#092635]">Edit Group Name</h3>
                            <button className="text-[#5C8374] hover:text-[#092635] focus:outline-none text-2xl" onClick={() => setShowEditGroupModal(false)}>&times;</button>
                        </div>
                        <div className="py-4 px-6">
                            <form onSubmit={handleUpdateGroup}>
                                <div className="mb-3">
                                    <label htmlFor="editGroupNameInput" className="text-sm font-medium block text-[#092635]">New Group Name</label>
                                    <input type="text" id="editGroupNameInput" value={editGroupName} onChange={(e) => setEditGroupName(e.target.value)} required className="w-full px-3 py-2 border border-[#5C8374] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4242]" />
                                </div>
                                <button type="submit" className="w-full bg-[#1B4242] text-white font-semibold py-2 rounded-md hover:bg-[#092635] transition duration-200 focus:outline-none">Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showManageMembersModal && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4"
                    style={{ backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                        <div className="border-b border-[#E5E7EB] pb-3 p-6 flex justify-between items-center flex-shrink-0">
                            <h3 className="text-xl font-semibold text-[#092635]">{manageMembersModalTitle}</h3>
                            <button className="text-[#5C8374] hover:text-[#092635] focus:outline-none text-2xl" onClick={() => setShowManageMembersModal(false)}>&times;</button>
                        </div>
                        <div className="py-4 px-6 flex-grow overflow-y-auto">
                            <form onSubmit={handleAddMember} className="mb-4">
                                <h6 className="text-lg font-semibold mb-2 text-[#092635]">Add Member</h6>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={addMemberModalUsername}
                                        onChange={(e) => setAddMemberModalUsername(e.target.value)}
                                        className="flex-grow px-3 py-2 border border-[#5C8374] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#1B4242]"
                                        placeholder="Member Username"
                                        required
                                    />
                                    <button type="submit" className="bg-[#1B4242] text-white px-4 py-2 rounded-r-md hover:bg-[#092635] transition duration-200 focus:outline-none">Add</button>
                                </div>
                            </form>
                            <h6 className="text-lg font-semibold mb-2 text-[#092635]">Member List</h6>
                            {currentGroupMembers.length > 0 ? (
                                renderMemberList({ _id: editGroupId, members: currentGroupMembers, creator: { _id: myGroups.find(g => g._id === editGroupId)?.creator._id } })
                            ) : (
                                <p className="text-[#5C8374]">No members in this group.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Opsi Chat (Khusus Mobile) */}
            {showChatOptionsModal && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4"
                    style={{ backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="border-b border-[#E5E7EB] pb-3 p-6 flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-[#092635]">Group Options</h3>
                            <button className="text-[#5C8374] hover:text-[#092635] focus:outline-none text-2xl" onClick={() => setShowChatOptionsModal(false)}>&times;</button>
                        </div>
                        <div className="py-4 px-6">
                            {(() => {
                                const currentGroup = myGroups.find(g => g._id === chatGroupId);
                                if (!currentGroup) return <p className="text-[#5C8374]">Group details not found.</p>;

                                return (
                                    <div className="space-y-2">
                                        {currentGroup.creator._id === currentUserId ? (
                                            <>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-[#092635] hover:bg-[#F3F4F6] rounded-md transition duration-200"
                                                    onClick={() => {
                                                        setShowChatOptionsModal(false);
                                                        handleEditGroup(currentGroup._id, currentGroup.name);
                                                    }}
                                                >
                                                    Edit Group Name
                                                </button>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-[#092635] hover:bg-[#F3F4F6] rounded-md transition duration-200"
                                                    onClick={() => {
                                                        setShowChatOptionsModal(false);
                                                        openManageMembersModal(currentGroup._id);
                                                    }}
                                                >
                                                    Manage Members
                                                </button>
                                                <div className="border-t border-[#E5E7EB] my-2"></div>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-md transition duration-200"
                                                    onClick={() => {
                                                        setShowChatOptionsModal(false);
                                                        handleDeleteGroup(currentGroup._id, currentGroup.name);
                                                    }}
                                                >
                                                    Delete Group
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-md transition duration-200"
                                                onClick={() => {
                                                    setShowChatOptionsModal(false);
                                                    handleLeaveGroup(currentGroup._id, currentGroup.name);
                                                }}
                                            >
                                                Leave Group
                                            </button>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Komponen Dropdown Menu yang dapat digunakan kembali
import ReactDOM from 'react-dom';

const DropdownMenu = ({ trigger, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = useCallback((event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            !triggerRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right - 192 + window.scrollX, // 192px = width of dropdown (w-48)
            });
        }
    }, [isOpen]);

    return (
        <>
            {React.cloneElement(trigger, {
                onClick: toggleDropdown,
                ref: triggerRef,
            })}
            {isOpen &&
                ReactDOM.createPortal(
                    <ul
                        ref={dropdownRef}
                        className="absolute w-48 bg-white shadow-lg rounded-md border border-[#E5E7EB] py-1 z-[9999] max-h-60 overflow-y-auto"
                        style={{
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            position: 'absolute',
                        }}
                    >
                        {options.map((option, index) =>
                            option.type === 'divider' ? (
                                <li key={index} className="border-t border-[#E5E7EB] my-1"></li>
                            ) : (
                                <li key={index}>
                                    <button
                                        type="button"
                                        className={`block w-full text-left px-4 py-2 text-[#092635] hover:bg-[#F3F4F6] focus:outline-none ${option.className || ''}`}
                                        onClick={() => {
                                            option.onClick();
                                            setIsOpen(false);
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            )
                        )}
                    </ul>,
                    document.body
                )}
        </>
    );
}

export default GroupCircle;
