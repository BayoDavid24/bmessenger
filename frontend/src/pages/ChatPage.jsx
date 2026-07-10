import toast from "react-hot-toast";


function ChatPage(){
    return <div>Chat Page

        <button onClick={() => toast.error("Message sent!")}>Send Message</button>
    </div>;
}
export default ChatPage;