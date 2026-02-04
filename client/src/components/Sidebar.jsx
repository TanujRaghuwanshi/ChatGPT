import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from 'moment'
import toast from "react-hot-toast";

function Sidebar ({isMenuOpen, setIsMenuOpen}){
  const { chats, setSelectChat, theme, setTheme, user, navigate, createNewChat, axios, setChats, fetchUserChats, setToken, token } = useAppContext();
  const [search, setSearch] = useState("");

  const logout = () =>{
    localStorage.removeItem('token')
    setToken(null)
    toast.success('Logged out successfully')
  }

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation()
      const confirm = window.confirm('Are you sure you want to delete this chat?')
      if (!confirm) return 

      const {data} = await axios.post('/api/chat/delete', {chatId}, {headers: {Authorization: token}})
      if (data.success) {
        setChats( prev => prev.filter(chat => chat._id !== chatId))
        await fetchUserChats()
        toast.success(data.messages)
      }
        
    } catch (error) {
      toast.error(error.messages)
    }
  }
  return (
    <div className={`flex flex-col h-screen min-w-72 p-5 bg-[#FFFDF1] dark:bg-[#562F00]/60 backdrop-blur-md border-r border-[#FFCE99]/50 dark:border-[#FFCE99]/10 transition-all duration-500 max-md:absolute left-0 z-1 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
      <img onClick={()=>{navigate('/')}}
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt=""
        className="w-full max-w-48 cursor-pointer"
      />

      <button onClick={createNewChat} className="flex justify-center items-center w-full py-2 mt-10 text-[#562F00] dark:text-[#FFFDF1] bg-gradient-to-r from-[#FF9644] to-[#FFCE99] text-sm rounded-md cursor-pointer hover:scale-105 transition-all shadow-md hover:shadow-[#FF9644]/30">
        <span className="mr-2 text-xl">+</span> New Chat
      </button>

      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-[#FFCE99]/20 rounded-md">
      <img src={assets.search_icon} className="w-4 not-dark:invert " alt="" />
      <input onChange={(e)=> setSearch(e.target.value)} value={search} type="text" placeholder="Search conversations" className="text-xs placeholder:text-[#562F00]/50 dark:placeholder:text-[#FFFDF1]/50 outline-none bg-transparent dark:text-[#FFFDF1]" />
      </div>

    {chats.length>0 && <p className="mt-4 text-sm text-[#562F00]/70 dark:text-[#FFFDF1]/70">Recent Chats</p>}
      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
        {
            chats.filter((chats)=> chats.messages[0] ? chats.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chats.name.toLowerCase().includes(search.toLowerCase())).map((chats)=>(
                <div onClick={()=> {navigate('/'); setSelectChat(chats); setIsMenuOpen(false)}} key={chats.id} className="p-2 px-4 dark:bg-[#FF9644]/5 hover:dark:bg-[#FF9644]/10 border border-gray-300 dark:border-[#FF9644]/10 rounded-md cursor-pointer flex justify-between group transition-colors">
                    <div>
                        <p className="truncate w-full text-[#562F00] dark:text-[#FFFDF1]">
                            {chats.messages.length>0 ? chats.messages[0].content.slice(0,32) : chats.name}
                        </p>
                        <p className="text-xs text-[#562F00]/60 dark:text-[#FFCE99]/70">
                            {moment(chats.updatedAt).fromNow()}
                        </p>
                    </div>
                    <img src={assets.bin_icon} className="hidden group-hover:block w-4 cursor-pointer not-dark:invert opacity-70 hover:opacity-100" alt="" 
                    onClick={e=> toast.promise(deleteChat(e, chats._id), {loading: 'deleting...'})} />

                </div>
            ))
        }
      </div>

      <div onClick={()=>{navigate('/community'); setIsMenuOpen(false)}} className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-[#FFCE99]/20 rounded-md cursor-pointer hover:scale-103 transition-all text-[#562F00] dark:text-[#FFFDF1]">
        <img src={assets.gallery_icon} className="w-4.5 not-dark:invert" alt="" />
        <div className="flex flex-col text-sm">
            <p>Community Images</p>
        </div>
      </div>


      <div onClick={()=>{navigate('/credits'); setIsMenuOpen(false)}} className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-[#FFCE99]/20 rounded-md cursor-pointer hover:scale-103 transition-all text-[#562F00] dark:text-[#FFFDF1]">
        <img src={assets.diamond_icon} className="w-4.5 dark:invert " alt="" />
        <div className="flex flex-col text-sm">
            <p>Credits : {user?.credits}</p>
            <p className="text-xs text-[#562F00]/60 dark:text-[#FFCE99]/60">Purchase credits to use quickgpt</p>
        </div>
      </div>


      <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-[#FFCE99]/20 rounded-md text-[#562F00] dark:text-[#FFFDF1]">
        <div className="flex items-center gap-2 text-sm">
            <img src={assets.theme_icon} className="w-4 not-dark:invert" alt="" />
            <p>Dark Mode</p>
        </div>
        <label className="relative inline-flex cursor-pointer">
            <input onChange={()=> setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox" className="sr-only peer" checked={theme === 'dark'} />
            <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-[#FF9644] transition-all">

            </div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>


      <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-[#FFCE99]/20 rounded-md cursor-pointer group">
        <img src={assets.user_icon} className="w-7 rounded-full" alt="" />
        <p className="flex-1 text-sm dark:text-[#FFFDF1] truncate">{user ? user.name : 'Login your account'}</p>
        {user && <img onClick={logout} className="h-5 cursor-pointer hidden not-dark:invert group-hover:block" src={assets.logout_icon}/>}
      </div>

        <img onClick={()=>{setIsMenuOpen(false)}} src={assets.close_icon} className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert" alt="" />

    </div>
  );
}

export default Sidebar;
