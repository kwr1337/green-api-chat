import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addChat, setCurrentChat } from '../features/chat/chatSlice'
import { logout } from '../features/auth/authSlice'
import '../styles/chatSidebar.css'

const ChatSidebar: React.FC = () => {
    const dispatch = useAppDispatch()
    const { chatList, currentChat } = useAppSelector((state) => state.chat)
    const [newPhone, setNewPhone] = useState('')

    const handleAddChat = () => {
        if (newPhone.trim()) {
            dispatch(addChat(newPhone))
            setNewPhone('')
        }
    }

    return (
        <div className="chat-sidebar">
            <div className="sidebar-header">
                <h3>Мои чаты</h3>
                <button className="logout-button" onClick={() => dispatch(logout())}>
                    Выйти
                </button>
            </div>
            <div className="create-chat">
                <input
                    type="text"
                    placeholder="Номер без +"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                />
                <button onClick={handleAddChat}>Создать</button>
            </div>
            <div className="chat-list">
                {chatList.map((c) => {
                    const isActive = c.phoneNumber === currentChat
                    return (
                        <div
                            key={c.phoneNumber}
                            className={`chat-list-item ${isActive ? 'active' : ''}`}
                            onClick={() => dispatch(setCurrentChat(c.phoneNumber))}
                        >
                            <div className="phone-number">{c.phoneNumber}</div>
                            {c.messages.length > 0 && (
                                <div className="last-message">
                                    {c.messages[c.messages.length - 1].text}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ChatSidebar