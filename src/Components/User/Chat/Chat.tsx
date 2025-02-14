import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAppSelector } from "../../../Apps/store";

const socket = io("http://localhost:3000"); // Change to your backend URL

const Chat = () => {
    const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    const authState = useAppSelector((state) => state.auth);
      const userDetails = authState.user
      const userId = userDetails.userId


       
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        // Listening for messages from the backend
        socket.on("message", (message : any) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("message");  //cleanup fn
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            const message = { user:userId, text: input };
            setMessages([...messages, message]);
            socket.emit("message", message); // Send message to backend
            setInput("");
        }
    };

    return (
        <div className="w-full h-full max-w-md mx-auto bg-black shadow-md rounded-lg overflow-hidden mt-5">
            
            <div className="bg-blue-600 text-white p-4 text-center font-semibold">
                Chat Room
            </div>

            <div className="h-80 p-4 overflow-y-auto space-y-2 bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 rounded-lg w-fit max-w-xs ${msg.user === "You" ? "ml-auto bg-blue-500 text-white" : "bg-gray-300"}`}>
                        <p className="text-sm">{msg.text}</p>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <div className="flex items-center p-3 border-t">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                />
                <button onClick={sendMessage} className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
