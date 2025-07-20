import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addTenantRecentMessage,
  getTenantChats,
  markChatAsRead,
} from "../../features/tenantUser/tenantUserSlice";
import { PageLoading, ChatUsers, ChatMessages } from "../../components";
import { socket } from "../../socket";
import { SocketContext } from "../../utils/SocketContext";

const TenantChat = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { chats, isLoading } = useSelector((state) => state.tenantUser);
  const { user } = useSelector((state) => state.auth);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentSelectedChatIndex, setCurrentChatIndex] = useState(null);

  const { socketMessage } = useContext(SocketContext);

  useEffect(() => {
    dispatch(getTenantChats());
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
        addTenantRecentMessage({
          chatId: socketMessage?.from,
          message: socketMessage?.message,
          sender: socketMessage?.from,
        })
      );
    }
  }, [socketMessage]);

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
      <div className="flex justify-center items-center min-h-screen bg-[#f4f7fa]">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8">
          <div className="bg-[#223981] rounded-t-2xl px-8 py-4">
            <h3 className="font-heading font-bold text-white text-2xl">Chat</h3>
          </div>
          <div className="flex flex-col items-center justify-center h-96">
            <h3 className="font-robotoNormal text-gray-400 text-xl text-center">
              No chat available. Add a contact to start chatting.
            </h3>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f4f7fa]">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-0">
        <div className="bg-[#223981] rounded-t-2xl px-8 py-4">
          <h3 className="font-heading font-bold text-white text-2xl">Chat</h3>
        </div>
        <div className="flex flex-row gap-0 p-6" style={{ minHeight: 500 }}>
          {/* Chat List */}
          <div className="bg-[#f7f9fc] rounded-xl shadow-sm p-4 w-1/3 min-w-[220px] max-w-xs flex flex-col gap-3 h-[420px] overflow-y-auto border border-[#e3e8f0]">
            {chats?.map((chat) => (
              <div
                key={chat?._id}
                onClick={() => handleCurrentChatChange(chat)}
                className={`cursor-pointer transition-all duration-150 ${
                  currentSelectedChatIndex === chat?._id
                    ? "bg-[#e3e8f0] border border-[#bfc8e0]"
                    : "bg-white border border-[#e3e8f0] hover:bg-[#f0f4fa]"
                } rounded-lg px-3 py-2 flex items-center`}
              >
                <ChatUsers chat={chat} currentUser={user} />
              </div>
            ))}
          </div>
          {/* Chat Messages or Empty State */}
          <div className="flex-1 flex items-center justify-center bg-[#f7f9fc] rounded-xl ml-6 h-[420px]">
            {currentChat === null ? (
              <p className="font-display text-2xl text-gray-400 text-center">
                Click on a chat to start messaging
              </p>
            ) : (
              <ChatMessages
                chat={currentChat}
                currentUser={user}
                fromTenant
                handleCurrentChatChange={handleCurrentChatChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantChat;
