import { Message } from './HomeComponents/Message'
import { FileUpload } from './FileUpload'

export const ChatArea = ({ pdfUploaded, messages, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-4">
      {!pdfUploaded ? (
        <FileUpload onFileUpload={onFileUpload} />
      ) : (
        <>
          {messages.map((message, index) => (
            <Message 
              key={index}
              text={message.text}
              sender={message.sender}
              timestamp={message.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}