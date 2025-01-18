import { useEffect, useState } from 'react';
import { getAllUsers, logout } from '../../../api/admin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminLogout } from '../../../app/slice/AuthSlice';
import { useDispatch } from 'react-redux';



interface User {
  isBlocked: boolean;
  isUser: boolean;
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  profile_picture: string | null;
}

const AdminAllusers = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<{ isBlocked?: boolean; isUser?: boolean }>({});
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const navigate = useNavigate()
  const dispatch = useDispatch();


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);





  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          search: debouncedSearch,
          ...(filter.isBlocked !== undefined ? { isBlocked: filter.isBlocked.toString() } : {}),
          ...(filter.isUser !== undefined ? { isUser: filter.isUser.toString() } : {}),
        });

        const response = await getAllUsers(`?${queryParams.toString()}`);
        console.log(222, response);


        if (response && response.data.success) {
          console.log('----------------------');
          
          setUserList(response.data.usersList);
          setTotalPages(response.data.totalPages);
        } else {
          console.log("*************************");
          
          await logout()
          dispatch(adminLogout());

        }
      } catch (error: any) {
        // toast.error(error.response.message)
        toast.error('Error fetching users...')
        console.error('Error fetching users:', error);

      }
    };

    fetchUsers();
  }, [page, debouncedSearch, filter]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (key: 'isBlocked' | 'isUser', value: string) => {
    setFilter((prev) => {
      const newFilter = { ...prev };
      if (value === 'all') {
        delete newFilter[key];
      } else {
        newFilter[key] = value === 'true';
      }
      return newFilter;
    });
    setPage(1);
  };

  const handleViewUser = (id: string) => {
    navigate(`/usersinglepage/${id}`)
  }



  return (
    <div style={{ padding: '20px', background: 'linear-gradient(to bottom, white, skyblue)', minHeight: '100vh', }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>All Users</h2>


      {/* Search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
          marginTop: '20px',
          background: 'linear-gradient(to bottom, white, white)',
        }}
      >

        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={handleSearch}
          style={{
            padding: '12px 15px',
            marginBottom: '20px',
            marginTop: '20px',
            width: '50%',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            outline: 'none',
            transition: 'all 0.3s ease-in-out',
            fontSize: '16px',


          }}
          onFocus={(e) => (e.target.style.border = '1px solid #4CAF50')}
          onBlur={(e) => (e.target.style.border = '1px solid #ddd')}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
          marginTop: '20px',
          background: '#d4f1f9',
        }}
      >
        {/* Filters */}
        <div style={{ marginBottom: '20px', marginTop: '20px' }}>

          <label>
            Blocked :
            <select
              style={{ marginLeft: 5 }}
              value={filter.isBlocked === undefined ? '' : filter.isBlocked.toString()}
              onChange={(e) => handleFilterChange('isBlocked', e.target.value)}
            >
              <option value="all">All</option>
              <option value="true">Blocked</option>
              <option value="false">Not Blocked</option>
            </select>
          </label>



          <label style={{ marginLeft: '30px' }}>
            Verified :
            <select
              style={{ marginLeft: 5 }}
              value={filter.isUser === undefined ? '' : filter.isUser.toString()}
              onChange={(e) => handleFilterChange('isUser', e.target.value)}
            >
              <option value="all">All</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>

          </label>
        </div>
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(to bottom, white, skyblue)',
      }}>
        <thead>
          <tr style={{ backgroundColor: '#2196F3', color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Profile Picture</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Date of Birth</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Blocked / Not</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>IsUser / Not</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {userList.length > 0 ? (
            userList.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>
                  <img
                    src={user.profile_picture || 'No DP'}
                    alt={user.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                </td>
                <td style={{ padding: '10px', color: 'black' }}>{user.name}</td>
                <td style={{ padding: '10px', color: 'black' }}>{user.email}</td>

                <td style={{ padding: '10px', color: 'black' }}>
                  {new Date(user.dateOfBirth).toLocaleDateString()}
                </td>

                <td style={{ padding: '10px', color: user.isBlocked ? 'red' : 'green', fontWeight: 'bold' }}>{user.isBlocked ? "Blocked" : "Not Blocked"}</td>

                <td style={{ padding: '10px', color: user.isUser ? 'greenyellow' : 'rose' }}>{user.isUser ? "Verified" : "Not verify"}</td>

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

      {/* Pagination */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          style={{
            marginLeft: '10px',
            color: 'blue',
            backgroundColor: '#d3d3d3',
            marginRight: '5px',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 15px',
            fontSize: '16px',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s, transform 0.2s',
          }}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          style={{
            marginLeft: '10px',
            color: 'blue',
            backgroundColor: '#d3d3d3',
            marginRight: '5px',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 15px',
            fontSize: '16px',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s, transform 0.2s',

          }}
        >
          Next
        </button>
      </div>


    </div>
  );
};

export default AdminAllusers;
