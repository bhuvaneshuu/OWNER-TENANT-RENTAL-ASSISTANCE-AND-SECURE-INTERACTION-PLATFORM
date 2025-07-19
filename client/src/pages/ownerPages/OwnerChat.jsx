import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getOwnerChats,
  addOwnerRecentMessage,
  markChatAsRead
} from "../../features/ownerUser/ownerUserSlice";
import { PageLoading, ChatUsers, ChatMessages } from "../../components";
import { socket } from "../../socket";
import { SocketContext } from "../../utils/SocketContext";

const OwnerChat = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isLoading, chats } = useSelector((state) => state.ownerUser);
  const { user } = useSelector((state) => state.auth);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentSelectedChatIndex, setCurrentChatIndex] = useState(null);

  const { socketMessage } = useContext(SocketContext);

  useEffect(() => {
    dispatch(getOwnerChats());
  }, [dispatch]);

  // set the current chat to location state if it exists
  useEffect(() => {
    if (location?.state) {
      // If state is a chat object (has _id), use it directly
      if (location.state._id) {
        setCurrentChat(location.state);
        setCurrentChatIndex(location.state._id);
        socket?.emit("markAsRead", {
          receiverID: user?._id,
          senderId: location.state._id,
        });
        dispatch(markChatAsRead({ chatId: location.state._id }));
      } else {
        handleCurrentChatChange(location.state);
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (socketMessage) {
      dispatch(
        addOwnerRecentMessage({
          chatId: socketMessage?.from,
          message: socketMessage?.message,
          sender: socketMessage?.from,
        })
      );
    }
  }, [socketMessage, dispatch]);

  const handleCurrentChatChange = (chat) => {
    socket?.emit("markAsRead", {
      receiverID: user?._id,
      senderId: chat?._id,
    });
    setCurrentChat(chat);
    setCurrentChatIndex(chat?._id);
    dispatch(markChatAsRead({ chatId: chat?._id }));
  };

  if (isLoading) {
    return <PageLoading />;
  }
  if (chats?.length === 0) {
    return (
      <div className="mt-12">
        <h3 className="font-robotoNormal text-center">
          No chat available. Add a contact to start chatting.
        </h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-slate-100 py-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 px-0 py-0 flex flex-col">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 rounded-t-2xl bg-[#223981]">
          <h3 className="text-2xl font-extrabold text-white tracking-wide">Chat</h3>
        </div>
        <div className="flex flex-row gap-0 md:gap-4 p-4" style={{ minHeight: 500 }}>
          {/* Chat user list */}
          <div className="flex flex-col gap-2 w-1/3 min-w-[220px] max-w-xs bg-slate-50 rounded-xl p-2 shadow-md overflow-y-auto">
            {chats?.map((chat) => (
              <div
                key={chat?._id}
                onClick={() => handleCurrentChatChange(chat)}
                className={`transition-all duration-150 rounded-lg cursor-pointer ${currentSelectedChatIndex === chat?._id ? 'bg-[#223981] text-white shadow-lg' : 'hover:bg-slate-200'}`}
                style={{ border: currentSelectedChatIndex === chat?._id ? '2px solid #223981' : '2px solid transparent' }}
              >
                <ChatUsers chat={chat} currentUser={user} />
              </div>
            ))}
          </div>
          {/* Chat messages area */}
          <div className="flex-1 flex flex-col justify-between bg-slate-50 rounded-xl shadow-md p-4 ml-0 md:ml-4">
            {currentChat === null ? (
              <div className="flex justify-center items-center h-64 w-full">
                <p className="font-display text-base md:text-xl lg:text-2xl text-center text-gray-400">
                  Click on a chat to start messaging
                </p>
              </div>
            ) : (
              <ChatMessages
                chat={currentChat}
                currentUser={user}
                handleCurrentChatChange={handleCurrentChatChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerChat;
