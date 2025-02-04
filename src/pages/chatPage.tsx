import React from 'react'
import ChatSidebar from '../components/chatSidebar'
import ChatWindow from '../components/ChatWindow/chatWindow'
import '../styles/chatPage.css'

const ChatPage: React.FC = () => {
    return (
        <div className="chat-page">
            <ChatSidebar />
            <div className="chat-main">
                <ChatWindow />
            </div>
        </div>
    )
}

export default ChatPage