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
          <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl'>
          <p className='text-sm dark:text-primary'>{messages.content}</p>
          <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(messages.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} className='w-8 rounded-full' alt="" />

        </div>
      ): (
        <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md my-4'>
            {messages.isImage ? (
              <img className='w-full max-w-md mt-2 rounded-md' src={messages.content} alt="" />
            ):(
              <div className='text-sm dark:text-primary reset-tw'>
               <Markdowm>{messages.content}</Markdowm> 
              </div>
            )}
            <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(messages.timestamp).fromNow()}</span>
        </div>
      )}
    </div>
  )
}

export default Message