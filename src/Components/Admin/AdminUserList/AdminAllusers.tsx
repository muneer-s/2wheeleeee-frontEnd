import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../../Api/admin';
import { useNavigate } from 'react-router-dom';

// Define the structure of the user object
interface User {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  profile_picture: string | null;
}

const AdminAllusers = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const navigate =  useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();

        if (response && response.data) {
          console.log('USER LIST IN ADMIN SIDE', response.data.usersList);
          setUserList(response.data.usersList); // Store the users list in state
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);



  const handleViewUser = (id:string)=>{
    navigate(`/usersinglepage/${id}`)
  }



  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>All Users</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {userList.length > 0 ? (
          userList.map((user) => (
            
            <div
              key={user._id} // Use the unique _id from the backend
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                backgroundColor: 'yellow',
                borderRadius: '10px',
                padding: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img
                src={user.profile_picture || 'https://via.placeholder.com/100'} // Use profile picture or a placeholder
                alt={user.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{user.name}</h3>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#777' }}>
                  Email: {user.email}
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#777' }}>
                  Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}
                </p>
              </div>

              <div>
                <button onClick={()=>handleViewUser(user._id)}>view</button>
              </div>

            </div>




          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminAllusers;
