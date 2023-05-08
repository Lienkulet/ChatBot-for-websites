import { FC, HTMLAttributes } from 'react'

interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement> {
  // 1:56
}

const ChatMessages: FC<ChatMessagesProps> = ({className, ...props}) => {
  return <div {...props}>ChatMessages</div>
}

export default ChatMessages