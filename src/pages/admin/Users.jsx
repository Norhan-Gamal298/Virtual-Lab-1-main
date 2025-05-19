import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";

// Create a dark theme for MUI components
const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { type } = useParams();
    const { token, user } = useSelector(state => state.auth);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, headerClassName: 'dark-header' },
        { field: 'email', headerName: 'Email', width: 200, headerClassName: 'dark-header' },
        { field: 'firstName', headerName: 'First Name', width: 150, headerClassName: 'dark-header' },
        { field: 'lastName', headerName: 'Last Name', width: 150, headerClassName: 'dark-header' },
        {
            field: 'role',
            headerName: 'Role',
            width: 120,
            headerClassName: 'dark-header',
            valueGetter: (params) => {
                const role = params.row?.role || 'user';
                return typeof role === 'string' ? role.toUpperCase() : 'UNKNOWN';
            }
        },
        /* {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            headerClassName: 'dark-header',
            renderCell: (params) => (
                <button
                    onClick={() => handleBlockUser(params.row.id)}
                    className={`px-2 py-1 rounded ${params.row.isBlocked
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                        } text-white transition-colors`}
                >
                    {params.row.isBlocked ? 'Unblock' : 'Block'}
                </button>
            )
        } */
    ];

    const handleBlockUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/block`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token || localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to block/unblock user');
            }

            const updatedUser = await response.json();
            setUsers(users.map(user =>
                user.id === userId ? { ...user, isBlocked: updatedUser.isBlocked } : user
            ));
        } catch (error) {
            console.error('Error blocking/unblocking user:', error);
            setError('Failed to block/unblock user');
        }
    };

    useEffect(() => {
        if (!token && !localStorage.getItem('token')) {
            setError('Not authenticated');
            setLoading(false);
            return;
        }

        if (type === 'admins' && user?.role !== 'root') {
            setError('Insufficient permissions to view admins');
            setLoading(false);
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const roleFilter = type === 'admins' ? 'admin' : 'user';
                const authToken = token || localStorage.getItem('token');

                const response = await fetch(`http://localhost:8080/api/admin/users?role=${roleFilter}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.error || 'Failed to fetch users');

                const usersWithId = Array.isArray(data) ? data.map(user => ({
                    ...user,
                    id: user._id,
                    role: user.role || 'user'
                })) : [];

                setUsers(usersWithId);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError(error.message || 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [type, user, token]);

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-gray-300">Loading users...</div>;
    }

    if (error) {
        return (
            <div className="text-red-400 bg-red-900 bg-opacity-30 p-4 rounded border border-red-700 max-w-md mx-auto mt-8">
                {error}
            </div>
        );
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="min-h-screen w-full py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">
                        {type === 'admins' ? 'Administrators' : 'Students'} Management
                    </h1>
                    {users.length === 0 && !loading && !error && (
                        <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 text-yellow-300 p-3 rounded mt-4 max-w-md">
                            No {type === 'admins' ? 'administrators' : 'students'} found.
                        </div>
                    )}
                </div>
                <div className="h-[calc(100vh-180px)] w-full">
                    <DataGrid
                        rows={users}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 15,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10, 15]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        sx={{
                            '& .dark-header': {
                                backgroundColor: '#1A1A1A',
                                color: '#FFFFFF',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #333',
                                color: '#E0E0E0',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#2A2A2A',
                            },
                            '& .MuiCheckbox-root': {
                                color: '#B0B0B0',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                backgroundColor: '#1A1A1A',
                                borderTop: '1px solid #333',
                            },
                            '& .MuiTablePagination-root': {
                                color: '#B0B0B0',
                            },
                            '& .MuiDataGrid-toolbarContainer': {
                                backgroundColor: '#1A1A1A',
                            },
                            backgroundColor: '#1E1E1E',
                            borderColor: '#333',
                        }}
                    />
                </div>
            </div>
        </ThemeProvider>
    );
}