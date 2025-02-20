// import React, { useEffect, useState, useRef } from "react";
// import { MessageCircle, Send, ArrowLeft } from "lucide-react";
// import Api from "../../../service/axios";
// import { Socket } from "socket.io-client";
// import { useAppSelector } from "../../../Apps/store";
// import { Dialog, DialogContent } from "@mui/material";



// interface ChatWidgetProps {
//   isChatOpen?: boolean;
//   hostId?: string;
//   onClose?: () => void;
//   chatId?: string;
//   socket:typeof  Socket;
// }

// interface UserChatProps {
//   _id: string;
//   id?: string;
//   email: string;
//   name: string;
//   users: UserChatProps[];
// }

// interface Sender {
//   _id: string;
// }

// interface MessageProps {
//   content: string;
//   sender: Sender;
// }

// interface ChatsProps {
//   _id: string;
//   email: string;
//   name: string;
//   users: UserChatProps[];
// }

// interface activeUserProps {
//   userId: string;
// }

// const ChatWidget1: React.FC<ChatWidgetProps> = ({
//   isChatOpen,
//   hostId,
//   onClose,
//   chatId,
//   socket,
// }) => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [selectedUser, setSelectedUser] = useState<UserChatProps | null>(null);
//   const [message, setMessage] = useState("");
//   const [userChatId, setUserChatId] = useState("");
//   const [messages, setMessages] = useState<MessageProps[]>([]);
//   const [activeUsers, setActiveUsers] = useState<activeUserProps[]>([]);
//   const [chats, setChats] = useState<ChatsProps[] | null>([]);

// const authState = useAppSelector((state) => state.auth);
//       const userDetails = authState.user
//       const userId = userDetails.userId

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       setMessage("");
//       Api.post("/chat/sendmessage", {
//           content: message,
//           senderId: userId,
//           chatId: userChatId,
//         })
//         .then((res: { data: MessageProps; }) => {
//           if (res.data) {
//             socket.emit("message", res.data);
//             setMessages([...messages, res.data]);
//           }
//         });
//     }
//   };
  

//   useEffect(() => {
//     if (userId && isOpen) {
//       socket.emit("setup", userId);
//       socket.on("connection", () => {});

//       socket.on("get-users", (users: React.SetStateAction<activeUserProps[]>) => {
//         setActiveUsers(users);
//       });
//     } else {
//       socket.emit("offline");
//     }
//   }, [isOpen, userId]);

//   useEffect(() => {
//     if (isChatOpen) setIsOpen(isChatOpen);
//     if (chatId) setUserChatId(chatId);
//   }, [isChatOpen, userId, chatId]);


//   //get chat api
//   useEffect(() => {
//     if (isOpen) {
//       Api
//         .get("/chat/getchat", {
//           params: {
//             userId,
//           },
//         })
//         .then((res: { data: React.SetStateAction<ChatsProps[] | null>; }) => {
//             console.log('get chat',res.data);
            
//           if (res.data) {
//             setChats(res.data);
//           }
//         });
//     }
//   }, [isOpen, userId]);


 

//   useEffect(() => {
//     if (hostId) {
//       chats?.find((chat) => {
//         const id = chat.users[0]._id.toString();
//         if (id === hostId) {
//           setSelectedUser(chat.users[0]);
//         }
//       });
//     }
//   }, [hostId, chats]);

//   const handleOpenChange = (open: boolean) => {
//     setIsOpen(open);
//     if (!open && onClose) {
//       onClose();
//     }
//     // onClose();
//   };

//   const handleUserSelection = (chat: UserChatProps) => {
//     setUserChatId(chat._id);
//     setSelectedUser(chat.users[0]);
//   };

//   const fetchMessages = async () => {
//     if (!selectedUser) return;

//     try {
//       const { data } = await Api.get("/chat/getallmessage", {
//         params: {
//           userChatId,
//         },
//       });

//       setMessages(data);
//       socket.emit("join chat", userChatId);
//     } catch (error) {
//       console.error("error while fetching message", error);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, [selectedUser]);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   useEffect(() => {
//     socket.on("message received", (message: MessageProps) => {
//       setMessages([...messages, message]);
//     });
//   });

//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
//       >
//         <MessageCircle className="w-6 h-6" />
//       </button>

//       <Dialog open={isOpen} onClose={() => handleOpenChange(false)}>

//         <DialogContent className="sm:max-w-xl p-0">
//           <div className="flex h-[500px]">
//             {!selectedUser ? (
//               <div className="w-full">
//                 <div className="p-4 border-b bg-white">
//                   <h2 className="font-semibold">Connections</h2>
//                 </div>
//                 <div className="overflow-y-auto h-[calc(100%-60px)]">
//                   {chats && chats.length ? (chats?.map((user) => (
//                     <div
//                       key={user.users[0]._id}
//                       onClick={() => handleUserSelection(user)}
//                       className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition-colors`}
//                     >
//                       <div
//                         className={`w-2 h-2 rounded-full ${
//                           activeUsers.some(
//                             (activeUser) =>
//                               activeUser.userId === user.users[0]._id
//                           )
//                             ? "bg-green-500"
//                             : "bg-gray-300"
//                         }`}
//                       />
//                       <span className="truncate">{user?.users[0].name}</span>
//                     </div>
//                   ))):<div className="flex items-center justify-center h-full">No Chats Yet!</div>}
//                 </div>
//               </div>
//             ) : (
//               // Chat Section
//               <div className="flex-1 flex flex-col">
//                 {/* Chat Header */}
//                 <div className="p-4 border-b flex items-center justify-between bg-white">
//                   <div className="flex items-center space-x-2">
//                     <ArrowLeft
//                       className="cursor-pointer"
//                       onClick={() => setSelectedUser(null)}
//                     />
//                     <div
//                       className={`w-2 h-2 rounded-full ${
//                         activeUsers.some(
//                           (user) => user.userId === selectedUser._id
//                         )
//                           ? "bg-green-500"
//                           : "bg-gray-300"
//                       }`}
//                     />
//                     <span className="font-semibold">{selectedUser.name}</span>
//                   </div>
//                 </div>

//                 {/* Chat Messages */}
//                 <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//                   {messages?.length ? (
//                     messages.map((msg, idx) => (
//                       <div
//                         key={idx}
//                         className={`flex ${
//                           msg.sender._id === userId
//                             ? "justify-end"
//                             : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
//                             msg.sender._id === userId
//                               ? "bg-blue-500 text-white"
//                               : "bg-gray-200"
//                           }`}
//                         >
//                           {msg.content}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="flex items-center justify-center text-gray-400">
//                       No messages yet. Say hi!
//                     </div>
//                   )}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 {/* Chat Input */}
//                 <div className="p-4 border-t bg-white">
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="text"
//                       value={message}
//                       onChange={(e) => setMessage(e.target.value)}
//                       placeholder="Type a message..."
//                       className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                       onClick={handleSendMessage}
//                       disabled={!message.trim()}
//                       className={`p-2 rounded-lg ${
//                         message.trim()
//                           ? "bg-blue-500 text-white hover:bg-blue-600"
//                           : "bg-gray-300 text-gray-600 cursor-not-allowed"
//                       }`}
//                     >
//                       <Send className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default ChatWidget1;
