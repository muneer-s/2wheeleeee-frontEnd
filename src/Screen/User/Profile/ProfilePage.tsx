import Header from "../../../Components/User/Header/Header"
import UserProfile from "../../../Components/User/Profile/UserProfile"


interface ProfilePageProps {
  socket: any;
}


const ProfilePage: React.FC<ProfilePageProps> = ({ socket }) => {
  return (
    <>
      <Header />
      <UserProfile socket={socket} />
    </>
  )
}

export default ProfilePage