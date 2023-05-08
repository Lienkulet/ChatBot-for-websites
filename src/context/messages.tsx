import { Message } from "@/lib/validators/message";
import { nanoid } from "nanoid";
import { ReactNode, createContext, useState } from "react";
import { text } from "stream/consumers";

export const MessagesContext = createContext<{
    messages: Message[]
    isMessageUpdating: boolean
    addMessage: (messages: Message) => void
    removeMessage: (_id: string) => void
    updateMessage: (_id: string, updateFN: (prevText: string) => string) => void
    setIsMessageUpdating: (isUpdating: boolean) => void
}>({
    messages: [],
    isMessageUpdating: false,
    addMessage: () => {},
    removeMessage: () => {},
    updateMessage: () => {},
    setIsMessageUpdating: () => {}
});

export function MessagesProvide({children}: {children: ReactNode}){
    const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: nanoid(),
            isUserMessage: false,
            text: 'Hello, how can I help you?',
        }
    ])
    
   const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message])
   }
   
   const removeMessage = (id: string) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id))
   }

   const updateMessage = (id: string, updateFn:(prevText: string) => string ) => {
    setMessages((prevMessages) => prevMessages.map(message => {
        if(message.id === id){
            return {...message, text: updateFn(message.text)}
        }

        return message
    })
    )
   }

    return <MessagesContext.Provider 
    value={{
        messages, 
        addMessage,
        removeMessage,
        updateMessage,
        isMessageUpdating,
        setIsMessageUpdating,
    }}>
        {children}
    </MessagesContext.Provider>
}