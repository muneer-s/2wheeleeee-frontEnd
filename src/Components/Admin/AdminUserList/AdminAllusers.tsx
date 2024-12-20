import { useEffect, useState } from 'react';
import { getAllUsers } from '../../../Api/admin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
          //console.log('USER LIST IN ADMIN SIDE', response.data.usersList);
          setUserList(response.data.usersList);
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        toast.error("Error In Fetching users ")
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
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>All Users</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Profile Picture</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Date of Birth</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 ? (
            userList.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>
                  <img
                    src={user.profile_picture || 'https://via.placeholder.com/50'}
                    alt={user.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                </td>
                <td style={{ padding: '10px', color: '#333' }}>{user.name}</td>
                <td style={{ padding: '10px', color: '#555' }}>{user.email}</td>
                <td style={{ padding: '10px', color: '#555' }}>
                  {new Date(user.dateOfBirth).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleViewUser(user._id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAllusers;
