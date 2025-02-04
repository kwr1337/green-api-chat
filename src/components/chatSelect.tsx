import React, { useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { addChat } from '../features/chat/chatSlice' // <-- сменили импорт
import '../styles/chatSelect.css'

const ChatSelect: React.FC = () => {
    const dispatch = useAppDispatch()
    const [phone, setPhone] = useState('')

    const handleCreateChat = () => {
        if (phone.trim()) {
            dispatch(addChat(phone))
        }
    }

    return (
        <div className="chat-select-container">
            <h2>Контакты</h2>
            <div className="chat-select-form">
                <input
                    className="input-phone"
                    type="text"
                    placeholder="Номер (без +)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <button className="btn-create-chat" onClick={handleCreateChat}>
                    Создать чат
                </button>
            </div>
        </div>
    )
}

export default ChatSelect