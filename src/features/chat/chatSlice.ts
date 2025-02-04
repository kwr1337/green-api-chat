import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../store'

interface ChatMessage {
    id: string
    text: string
    sender: 'me' | 'other'
    timestamp: number
}

interface Chat {
    phoneNumber: string
    messages: ChatMessage[]
}

interface ChatState {
    chatList: Chat[]
    currentChat: string | null
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}

const initialState: ChatState = {
    chatList: [],
    currentChat: null,
    status: 'idle',
    error: null
}

export const sendMessageThunk = createAsyncThunk<
    { phoneNumber: string; message: ChatMessage },
    { text: string },
    { state: RootState }
>(
    'chat/sendMessage',
    async ({ text }, { getState, rejectWithValue }) => {
        try {
            const { auth, chat } = getState()
            const { idInstance, apiTokenInstance } = auth
            const { currentChat, chatList } = chat
            if (!currentChat) throw new Error('Нет текущего чата для отправки сообщения')

            const url = `https://api.green-api.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`

            const response = await axios.post(url, {
                chatId: `${currentChat}@c.us`,
                message: text
            })

            const message: ChatMessage = {
                id: response.data?.idMessage || Date.now().toString(),
                text,
                sender: 'me',
                timestamp: Date.now()
            }

            return {
                phoneNumber: currentChat,
                message
            }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const receiveMessageThunk = createAsyncThunk<
    { phoneNumber: string; message: ChatMessage } | null,
    void,
    { state: RootState }
>(
    'chat/receiveMessage',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()
            const { idInstance, apiTokenInstance } = auth

            const receiveUrl = `https://api.green-api.com/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`
            const response = await axios.get(receiveUrl)
            if (!response.data) {
                return null
            }

            const { receiptId, body: receipt } = response.data

            if (receiptId) {
                const deleteUrl = `https://api.green-api.com/waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${receiptId}`
                await axios.delete(deleteUrl)
            }

            const senderFull = receipt?.senderData?.sender
            if (!senderFull) {
                return null
            }
            const phoneNumber = senderFull.replace('@c.us', '')

            const text = receipt?.messageData?.textMessageData?.textMessage
            if (!text) {
                return null
            }

            const incomingMessage: ChatMessage = {
                id: receipt?.msgId || Date.now().toString(),
                text,
                sender: 'other',
                timestamp: Date.now()
            }

            return {
                phoneNumber,
                message: incomingMessage
            }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addChat: (state, action: PayloadAction<string>) => {
            const phoneNumber = action.payload.trim()
            if (!phoneNumber) return
            // Проверяем, нет ли уже такого чата
            const existing = state.chatList.find((c) => c.phoneNumber === phoneNumber)
            if (!existing) {
                state.chatList.push({
                    phoneNumber,
                    messages: []
                })
            }
            state.currentChat = phoneNumber
        },
        setCurrentChat: (state, action: PayloadAction<string>) => {
            state.currentChat = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessageThunk.fulfilled, (state, action) => {
                const { phoneNumber, message } = action.payload
                const chat = state.chatList.find((c) => c.phoneNumber === phoneNumber)
                if (chat) {
                    chat.messages.push(message)
                }
                state.status = 'idle'
            })
            .addCase(sendMessageThunk.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(sendMessageThunk.rejected, (state, action) => {
                state.status = 'failed'
                state.error = String(action.payload) || 'Ошибка при отправке сообщения'
            })
            .addCase(receiveMessageThunk.fulfilled, (state, action) => {
                if (!action.payload) {
                    return
                }
                const { phoneNumber, message } = action.payload
                let chat = state.chatList.find((c) => c.phoneNumber === phoneNumber)
                if (!chat) {
                    chat = { phoneNumber, messages: [] }
                    state.chatList.push(chat)
                }
                const exists = chat.messages.some((m) => m.id === message.id)
                if (!exists) {
                    chat.messages.push(message)
                }
            })
    }
})

export const { addChat, setCurrentChat } = chatSlice.actions
export default chatSlice.reducer