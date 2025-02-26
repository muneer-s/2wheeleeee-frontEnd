import React, { useEffect, useState, useRef } from "react";
import { MessageCircle, Send, ArrowLeft } from "lucide-react";
import Api from "../../../service/axios";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../../../Apps/store";
// import defaultDp from '../../../Assets/defaultDP.png'
import Lottie from "react-lottie";
import animationData from '../../../Animation/Typing.json'
import { Dialog, DialogContent, Menu, MenuItem, IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

interface ChatWidgetProps {
  isChatOpen?: boolean;
  hostId?: string;
  onClose?: () => void;
  chatId?: string;
  socket: typeof Socket;
}

interface UserChatProps {
  _id: string;
  id?: string;
  email: string;
  name: string;
  profile_picture: string
  users: UserChatProps[];
}

interface Sender {
  _id: string;
}

interface MessageProps {
  content: string;
  sender: Sender;
  chat: any
}

interface ChatsProps {
  _id: string;
  email: string;
  name: string;
  profile_picture: string
  users: UserChatProps[];
}

interface activeUserProps {
  userId: string;
}

const MainChatUI: React.FC<ChatWidgetProps> = ({
  isChatOpen,
  hostId,
  onClose,
  chatId,
  socket,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserChatProps | null>(null);         // selected user for conversation.
  const [message, setMessage] = useState("");                                   //the message  typing
  const [userChatId, setUserChatId] = useState("");                               // chat ID of the selected conversation
  const [messages, setMessages] = useState<MessageProps[]>([]);                     // chat messages
  const [activeUsers, setActiveUsers] = useState<activeUserProps[]>([]);
  const [chats, setChats] = useState<ChatsProps[] | null>([]);                           //  list of  chats
  const [typing, setTyping] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [socketConnected, setSocketConnected] = useState<boolean>(false)
  const [notification, setNotification] = useState<any[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  const authState = useAppSelector((state) => state.auth);
  const userDetails = authState.user
  const userId = userDetails.userId

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  // star from here , set up 
  useEffect(() => {
    if (userId && isOpen) {
      socket.emit("setup", userId);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true))
      socket.on("stop typing", () => setIsTyping(false))
      socket.on("get-users", (users: React.SetStateAction<activeUserProps[]>) => {
        setActiveUsers(users);
      });
    } else {
      socket.emit("offline");
    }
  }, [isOpen, userId]);


  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage("");
      socket.emit("stop typing", userChatId)
      Api.post("/chat/sendmessage", {
        content: message,
        senderId: userId,
        chatId: userChatId,
      })
        .then((res: { data: MessageProps; }) => {
          if (res.data) {
            socket.emit("message", res.data); // send message with data
            setMessages([...messages, res.data]);
          }
        });
    }
  };

  useEffect(() => {
    if (isChatOpen) setIsOpen(isChatOpen);
    if (chatId) setUserChatId(chatId);
  }, [isChatOpen, userId, chatId]);


  //get chat api
  useEffect(() => {
    if (isOpen) {
      Api
        .get("/chat/getchat", {
          params: {
            userId,
          },
        })
        .then((res: { data: React.SetStateAction<ChatsProps[] | null>; }) => {
          console.log('get chat', res.data);

          if (res.data) {
            setChats(res.data);
          }
        });
    }
  }, [isOpen, userId]);


  useEffect(() => {
    if (hostId) {
      chats?.find((chat) => {
        const id = chat.users[0]._id.toString();
        if (id === hostId) {
          setSelectedUser(chat.users[0]);
        }
      });
    }
  }, [hostId, chats]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };

  // select user 
  const handleUserSelection = (chat: UserChatProps) => {
    setUserChatId(chat._id); // to
    setSelectedUser(chat.users[0]);
  };

  // fetch all messages of the selected user 
  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      const { data } = await Api.get("/chat/getallmessage", {
        params: {
          userChatId,
        },
      });

      setMessages(data);
      socket.emit("join chat", userChatId);
    } catch (error) {
      console.error("error while fetching message", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedUser]);


  useEffect(() => {
    // Instantly move to bottom on mount
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []); // Runs only on mount

  useEffect(() => {
    // Automatically scroll to the bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" }); // No smooth scrolling
    }
  }, [messages]);


  // message receiving from socket - (message)
  useEffect(() => {
    socket.on("message received", (message: MessageProps) => {
      console.log('///////////////-', message);

      if (userChatId !== message.chat._id) {
        if (message.sender._id !== userId) {

          if (!notification.includes(message)) {
            setNotification([message, ...notification])
          }
        }
      } else {
        setMessages([...messages, message]);
      }
    });
  });
  console.log('-----------------', notification);


  const typingHandler = (e: any) => {
    setMessage(e.target.value)
    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit("typing", userChatId)
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", userChatId)
        setTyping(false)
      }

    }, timerLength);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <Dialog open={isOpen} onClose={() => handleOpenChange(false)}>

        <DialogContent className="sm:max-w-xl p-0">
          <div className="flex h-[500px]">
            {!selectedUser ? (
              <div className="w-screen ">

                <div className="p-4 border-b bg-white flex justify-between items-center">
                  <h2 className="font-semibold">Connections</h2>

                  {/* Notification Bell Button */}

                  <IconButton onClick={handleClick}>
                    <Badge
                      badgeContent={notification.length}
                      color="error"
                      overlap="circular"
                    >
                      <NotificationsIcon className="text-gray-600" />
                    </Badge>
                  </IconButton>

                  {/* Notification Menu */}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                      sx: { mt: 1, borderRadius: 2, minWidth: 200 },
                    }}
                  >
                    {notification.length === 0 ? (
                      <MenuItem disabled>No New Messages</MenuItem>
                    ) : (
                      notification.map(notif => (
                        <MenuItem key={notif._id}
                          onClick={() => {
                            setUserChatId(notif.chat._id)
                            // setSelectedUser(notif.chat.users[0]);
                            setSelectedUser(notif.chat.users.find((user: any) => user._id !== userId)); // Select the other user
                            setNotification(notification.filter((n) => n !== notif))
                          }}
                        >
                          {/* {notif.chat.message ? `new message in ${notif.Chat}` : `New message from ${notif.sender.name}`} */}
                          {`New message from ${notif.sender.name}`}
                        </MenuItem>
                      ))
                    )}
                  </Menu>
                </div>

                <div className="overflow-y-auto h-[calc(100%-60px)]">
                  {chats && chats.length ? (
                    chats?.map((user) => (
                      <div
                        key={user.users[0]._id}
                        onClick={() => handleUserSelection(user)}
                        className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition-colors`}
                      >
                        <img
                          src={user?.users[0].profile_picture || ''}
                          alt="Profile"
                          className="w-10 h-10 rounded-full border"
                        />
                        <div
                          className={`w-2 h-2 rounded-full ${activeUsers.some(
                            (activeUser) =>
                              activeUser.userId === user.users[0]._id
                          )
                            ? "bg-green-500"
                            : "bg-gray-300"
                            }`}
                        />
                        <span className="truncate">{user?.users[0].name}</span>
                      </div>
                    ))) : <div className="flex items-center justify-center h-full">No Chats Yet!</div>}
                </div>
              </div>
            ) : (
              // Chat Section
              <div className="flex-1 flex flex-col w-screen">
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between bg-gray-400">
                  <div className="flex items-center space-x-2">
                    <ArrowLeft
                      className="cursor-pointer"
                      onClick={() => setSelectedUser(null)}
                    />
                    <img
                      src={selectedUser.profile_picture || ''}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border"
                    />
                    <div
                      className={`w-2 h-2 rounded-full ${activeUsers.some(
                        (user) => user.userId === selectedUser._id
                      )
                        ? "bg-green-500"
                        : "bg-gray-300"
                        }`}
                    />
                    <span className="font-semibold">{selectedUser.name}</span>
                  </div>
                </div>

                {/* Chat Messages */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                >
                  {messages?.length ? (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender._id === userId
                          ? "justify-end"
                          : "justify-start"
                          }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg shadow-sm ${msg.sender._id === userId
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                            }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center text-gray-400">
                      No messages yet. Say hi!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t bg-white">
                  {isTyping ? <div>
                    <Lottie
                      options={defaultOptions}
                      width={70}
                      style={{ marginBottom: 10, marginLeft: 0 }}
                    />
                  </div> : (
                    <></>
                  )}

                  <div className="flex items-center space-x-2">

                    <input
                      type="text"
                      value={message}
                      onChange={(e) => { setMessage(e.target.value); typingHandler(e); }}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className={`p-2 rounded-lg ${message.trim()
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MainChatUI;
