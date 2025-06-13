import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, ChevronDown, ChevronsUp } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const API_BASE_URL = import.meta.env.VITE_BASE_URL_CHATBOT;
const CHAT_STORAGE_KEY = 'pelukdiriChatHistory';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState(() => {
        try {
            const stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [
                { sender: 'bot', text: 'Halo! Saya asisten virtual PelukDiri. Ada yang bisa saya bantu?' }
            ];
        } catch {
            return [{ sender: 'bot', text: 'Halo! Saya asisten virtual PelukDiri. Ada yang bisa saya bantu?' }];
        }
    });

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [typingText, setTypingText] = useState('');
    const messagesEndRef = useRef(null);
    const messagesRef = useRef(messages);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        try {
            sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error("Error saving history:", error);
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen, isMinimized, typingText]);

    const toggleChatOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setIsMinimized(false);
    };

    const toggleMinimize = () => setIsMinimized(!isMinimized);

    const handleInputChange = (e) => setInputValue(e.target.value);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const newMessage = { sender: 'user', text: inputValue };
        const historyToSend = messagesRef.current.map(msg => ({ sender: msg.sender, text: msg.text }));

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/generate`, {
                user_input: newMessage.text,
                history: historyToSend
            });

            const fullReply = response.data.response || 'Maaf, tidak ada jawaban.';
            setTypingText('');
            let currentText = '';

            for (let i = 0; i < fullReply.length; i++) {
                await new Promise(res => setTimeout(res, 15));
                currentText += fullReply[i];
                setTypingText(currentText);
            }

            setMessages(prev => [...prev, { sender: 'bot', text: fullReply }]);
            setTypingText('');
        } catch (error) {
            console.error("API error:", error);
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: 'Maaf, terjadi kesalahan pada sistem kami. Silakan coba lagi nanti.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={toggleChatOpen}
                    className="fixed bottom-6 right-6 bg-[#5C8374] hover:bg-[#1B4242] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#9EC8B9] focus:ring-offset-2 z-50"
                    aria-label="Buka Chatbot"
                >
                    <MessageSquare size={28} />
                </button>
            )}

            {isOpen && (
                <div
                    className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 bg-[#f8fafc] w-full sm:w-96 shadow-xl flex flex-col z-50 border border-gray-300 sm:rounded-lg transition-all duration-300 ease-in-out ${isMinimized ? 'h-16 sm:h-16 overflow-hidden' : 'h-full sm:h-[75vh] sm:max-h-[600px]'
                        }`}
                >
                    <div className="bg-[#1B4242] text-[#9EC8B9] p-3 flex justify-between items-center sm:rounded-t-lg cursor-pointer" onClick={isMinimized ? toggleMinimize : undefined}>
                        <div className="flex items-center space-x-3">
                            <Bot size={22} />
                            <h3 className="font-medium text-md">PelukDiri Assistant</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={toggleMinimize}
                                className="text-[#9EC8B9] hover:text-white focus:outline-none p-1.5 rounded-full hover:bg-[#092635] transition-colors"
                                aria-label={isMinimized ? "Maksimalkan Chat" : "Minimalkan Chat"}
                            >
                                {isMinimized ? <ChevronsUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            <button
                                onClick={toggleChatOpen}
                                className="text-[#9EC8B9] hover:text-white focus:outline-none p-1.5 rounded-full hover:bg-[#092635] transition-colors"
                                aria-label="Tutup Chatbot"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-3">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${msg.sender === 'user'
                                            ? 'bg-[#5C8374] text-white rounded-br-none prose-invert'
                                            : 'bg-[#9EC8B9] text-[#092635] rounded-bl-none border border-[#9EC8B9]'
                                            } prose prose-sm max-w-none`}>
                                            {msg.sender === 'bot' ? (
                                                <ReactMarkdown
                                                    children={msg.text}
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeRaw]}
                                                />
                                            ) : (
                                                msg.text.split('\n').map((line, i, arr) => (
                                                    <React.Fragment key={i}>
                                                        {line}
                                                        {i < arr.length - 1 && <br />}
                                                    </React.Fragment>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {typingText && (
                                    <div className="flex justify-start">
                                        <div className="bg-[#9EC8B9] text-[#092635] p-3 rounded-lg rounded-bl-none shadow-sm text-sm max-w-[85%]">
                                            <ReactMarkdown
                                                children={typingText}
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeRaw]}
                                            />
                                        </div>
                                    </div>
                                )}

                                {isLoading && !typingText && (
                                    <div className="flex justify-start">
                                        <div className="bg-[#9EC8B9] text-[#092635] p-3 rounded-lg rounded-bl-none border border-[#9EC8B9] shadow-sm text-sm max-w-[85%] inline-flex items-center space-x-1">
                                            <em className="italic">mengetik</em>
                                            <div className="flex space-x-1">
                                                <span className="text-xl font-bold animate-bounce [animation-delay:0s]">.</span>
                                                <span className="text-xl font-bold animate-bounce [animation-delay:0.2s]">.</span>
                                                <span className="text-xl font-bold animate-bounce [animation-delay:0.4s]">.</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-[#f8fafc] sm:rounded-b-lg">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        placeholder={isLoading ? "Memproses..." : "Ketik pesan Anda di sini..."}
                                        className="flex-grow p-3 border border-[#5C8374] rounded-md focus:ring-2 focus:ring-[#9EC8B9] focus:border-[#9EC8B9] outline-none transition-shadow text-sm text-[#092635] placeholder-[#5C8374] bg-white"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#5C8374] hover:bg-[#1B4242] text-white p-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#9EC8B9] focus:ring-offset-1"
                                        disabled={isLoading || inputValue.trim() === ''}
                                        aria-label="Kirim Pesan"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Chatbot;