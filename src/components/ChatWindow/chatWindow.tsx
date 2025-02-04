import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { sendMessageThunk, receiveMessageThunk } from '../../features/chat/chatSlice'
import '../../styles/chatWindow.css'

const ChatWindow: React.FC = () => {
    const dispatch = useAppDispatch()
    const { chatList, currentChat } = useAppSelector((state) => state.chat)
    const [text, setText] = useState('')

    const chat = chatList.find((c) => c.phoneNumber === currentChat)

    useEffect(() => {
        const intervalId = setInterval(() => {
            dispatch(receiveMessageThunk())
        }, 4000)
        return () => clearInterval(intervalId)
    }, [dispatch])

    const handleSend = () => {
        if (text.trim()) {
            dispatch(sendMessageThunk({ text }))
            setText('')
        }
    }

    if (!chat) {
        return (
            <div className="chat-window no-chat-selected">
                <p>Выберите чат слева</p>
            </div>
        )
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h3>Чат с {chat.phoneNumber}</h3>
            </div>

            <div className="chat-body">
                {chat.messages.map((msg) => {
                    const isMe = msg.sender === 'me'
                    const bubbleClass = isMe ? 'message-bubble me' : 'message-bubble other'
                    return (
                        <div key={msg.id} className={bubbleClass}>
                            {msg.text}
                        </div>
                    )
                })}
            </div>

            <div className="chat-footer">
                <input
                    type="text"
                    className="chat-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
                    placeholder="Напишите сообщение"
                />
                <button className="chat-send-btn" onClick={handleSend}>
                    Отправить
                </button>
            </div>
        </div>
    )
}

export default ChatWindow