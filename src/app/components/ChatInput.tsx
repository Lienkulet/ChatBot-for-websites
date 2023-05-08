"use client"

import { cn } from '@/lib/utils'
import { FC, HTMLAttributes, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useMutation } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { Message } from '@/lib/validators/message'

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  
}

const ChatInput: FC<ChatInputProps> = ({className, ...props}) => {
        const [input, setInput] = useState<string>('');
  
        const {mutate: sendMessage, isLoading} = useMutation({
                mutationFn: async (message: Message) => {
                   const res = await fetch('/api/message', {
                           method: 'POST',
                           headers: { 
                                   'Content-Type': 'application/json'
                         },
                         body: JSON.stringify({messages: [message]})
                    })

                    return res.body;
                },
                onSuccess: async (stream) => {
                        if(!stream) throw new Error('No stream found')

                        const reader = stream.getReader();
                        const decoder = new TextDecoder();
                        let done = false;

                        while(!done){
                                const {value, done: doneReading} = await reader.read()
                                done = doneReading
                                const chunkValue = decoder.decode(value);
                                console.log(chunkValue);
                        }
                }
        });

        return <div {...props} className={cn('border-t border-zinc-300',
             className)}>
                <div className='relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none'>
                     <TextareaAutosize 
                        rows={2}
                        maxRows={4}
                        autoFocus
                        value={input}
                        onKeyDown={e => {
                                if(e.key === 'Enter' && !e.shiftKey){
                                        e.preventDefault();

                                        const message: Message = {
                                                id: nanoid(),
                                                isUserMessage: true,
                                                text: input
                                        }

                                        sendMessage(message);
                                }
                        }}
                        onChange={e => setInput(e.target.value)}
                        placeholder='Write a message...'
                        className='peer disabled:opacity-50 pr-14 resize-none block 
                            w-full border-0 bg-zinc-100 py-1.5 text-gray-900 f
                            ocus:ring-0 text-sm sm:leading-6'
                     />
                </div>
        </div>
}

export default ChatInput

// 1:29