import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdowm from 'react-markdown' 
import Prism from 'prismjs'


const Message = ({messages})=> {

  useEffect(()=>{
    Prism.highlightAll()
  },[messages.content])

  return (
    <div>
      { messages.role === "user" ? (
        <div className='flex items-center justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 p-2 px-4 bg-[#FFFDF1] border border-[#FF9644]/50 dark:bg-[#FF9644]/20 rounded-md max-w-2xl text-[#562F00] dark:text-[#FFFDF1]'>
          <p className='text-sm'>{messages.content}</p>
          <span className='text-xs text-[#562F00]/60 dark:text-[#FFCE99]/70'>{moment(messages.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} className='w-8 rounded-full' alt="" />
        </div>
      ): (
        <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-[#FFCE99]/20 dark:bg-[#562F00]/50 border border-[#FFCE99] dark:border-[#FF9644]/30 rounded-md my-4'>
            {messages.isImage ? (
              <img className='w-full max-w-md mt-2 rounded-md' src={messages.content} alt="" />
            ):(
              <div className='text-sm text-[#562F00] dark:text-[#FFFDF1] reset-tw'>
               <Markdowm>{messages.content}</Markdowm> 
              </div>
            )}
            <span className='text-xs text-[#562F00]/60 dark:text-[#FFCE99]/70'>{moment(messages.timestamp).fromNow()}</span>
        </div>
      )}
    </div>
  )
}

export default Message