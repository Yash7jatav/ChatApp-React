import './App.css';
import List from './components/list/List';
import Chat from './components/chat/Chat';
import Detail from './components/detail/Detail';
import Login from './components/login/Login';
import Notifiction from './components/notification/Notification';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './library/firebase';
import { useUserStore } from './library/userStore';
import { useChatStore } from './library/chatStore';

function App() {

  const {currentUser, isLoading, fetchUserInfo} = useUserStore()

  const{chatId} = useChatStore();

  useEffect(() => {

    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid)
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  console.log(currentUser);

  if(isLoading) return <div className='loading'>Loading...</div>;

  return (
    <div className='chatContainer'>
      {
        currentUser ? (
        <>
          <List/>
          {chatId && <Chat/>}
          {chatId && <Detail/>}
        </>
        ) : (
          <Login/>
        )}
        <Notifiction/>
    </div>
  );
};

export default App
