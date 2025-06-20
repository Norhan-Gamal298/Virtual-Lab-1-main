import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { FaDownload } from "react-icons/fa";
import { Menu, MenuItem, IconButton, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const downloadReport = async (format) => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:8080/api/report/users?format=${format}`;

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`Failed to download: ${response.status}`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `users-report.${format}`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
    } catch (err) {
        console.error('Download error:', err);
        // Add user notification here if needed
    }
};

// Light theme configuration
const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#6366f1",
            light: "#818cf8",
            dark: "#4f46e5"
        },
        secondary: {
            main: "#f59e0b",
            light: "#fbbf24",
            dark: "#d97706"
        },
        background: {
            default: "#f8fafc",
            paper: "#ffffff"
        },
        text: {
            primary: "#1e293b",
            secondary: "#64748b"
        },
        divider: "#e2e8f0",
        success: {
            main: "#10b981",
            light: "#34d399",
            dark: "#059669"
        },
        error: {
            main: "#ef4444",
            light: "#f87171",
            dark: "#dc2626"
        }
    },
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    boxShadow: 'none',
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#ffffff",
                        borderBottom: "1px solid #e2e8f0",
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: '#1e293b'
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: 600,
                    },
                    "& .MuiDataGrid-footerContainer": {
                        backgroundColor: "#f8fafc",
                        borderTop: "1px solid #e2e8f0",
                    },
                    "& .MuiDataGrid-row": {
                        transition: 'all 0.2s ease',
                        "&:hover": {
                            backgroundColor: "#f1f5f9",
                            transform: 'translateY(-1px)',
                        },
                    },
                    "& .MuiDataGrid-cell": {
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: '0.875rem',
                        padding: '12px 16px',
                    },
                    "& .MuiCheckbox-root": {
                        color: "#6366f1",
                        "&.Mui-checked": {
                            color: "#6366f1",
                        }
                    },
                    "& .MuiDataGrid-selectedRowCount": {
                        color: "#64748b",
                    },
                    "& .MuiDataGrid-row.Mui-selected": {
                        backgroundColor: 'rgba(99, 102, 241, 0.08)',
                        '&:hover': {
                            backgroundColor: 'rgba(99, 102, 241, 0.12)',
                        },
                    },
                },
            },
        },
    },
});

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const { type } = useParams();
    const { token, user } = useSelector(state => state.auth);

    // Menu state for role actions
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const open = Boolean(anchorEl);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            renderCell: (params) => (
                <span className="font-mono text-slate-600 text-sm px-2 py-1 rounded">
                    #{params.value.slice(-6)}
                </span>
            )
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 280,
            renderCell: (params) => (
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow">
                        {params.value?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-800 font-medium">{params.value}</span>
                </div>
            )
        },
        {
            field: 'firstName',
            headerName: 'First Name',
            width: 160,
            renderCell: (params) => (
                <span className="text-slate-800 font-medium">{params.value}</span>
            )
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            width: 160,
            renderCell: (params) => (
                <span className="text-slate-800 font-medium">{params.value}</span>
            )
        },
        {
            field: 'role',
            headerName: 'Role',
            width: 120,
            renderCell: (params) => (
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${params.value === 'admin'
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200 shadow'
                    : params.value === 'root'
                        ? 'bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-800 border border-purple-200 shadow'
                        : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 shadow'
                    }`}>
                    {params.value?.charAt(0).toUpperCase() + params.value?.slice(1)}
                </div>
            )
        },
        {
            field: 'isBlocked',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${params.value
                    ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200 shadow'
                    : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200 shadow'
                    }`}>
                    {params.value ? 'Blocked' : 'Active'}
                </div>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => {
                const isCurrentUser = params.row.id === user?.id;
                const isRootUser = params.row.role === 'root';

                return (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleBlockUser(params.row.id)}
                            disabled={actionLoading === params.row.id || isRootUser || isCurrentUser}
                            className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow ${params.row.isBlocked
                                ? 'bg-gradient-to-r from-emerald-100 to-green-100 hover:from-emerald-200 hover:to-green-200 text-emerald-800 border border-emerald-200'
                                : 'bg-gradient-to-r from-red-100 to-rose-100 hover:from-red-200 hover:to-rose-200 text-red-800 border border-red-200'
                                }`}
                        >
                            {actionLoading === params.row.id ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                                params.row.isBlocked ? 'Unblock' : 'Block'
                            )}
                        </button>

                        {/* Role management menu (only for root admin) */}
                        {user?.role === 'root' && !isRootUser && !isCurrentUser && (
                            <>
                                <IconButton
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={(e) => {
                                        setSelectedUser(params.row);
                                        setAnchorEl(e.currentTarget);
                                    }}
                                    disabled={actionLoading === params.row.id}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </>
                        )}
                    </div>
                );
            }
        }
    ];

    const handleBlockUser = async (userId) => {
        setActionLoading(userId);
        try {
            const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/block`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to block/unblock user');
            }

            const updatedUser = await response.json();
            setUsers(users.map(user =>
                user.id === userId ? { ...user, isBlocked: updatedUser.isBlocked } : user
            ));
        } catch (error) {
            console.error('Error:', error);
            alert(`Operation failed: ${error.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleChangeRole = async (newRole) => {
        if (!selectedUser) return;

        setActionLoading(selectedUser.id);
        try {
            const response = await fetch(`http://localhost:8080/api/admin/users/${selectedUser.id}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ role: newRole })
            });

            // First check if response is OK
            if (!response.ok) {
                // Try to get error message from response
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(errorText || 'Failed to update role');
            }

            // If OK, parse as JSON
            const result = await response.json();

            setUsers(users.map(u =>
                u.id === selectedUser.id ? { ...u, role: newRole } : u
            ));

            handleCloseMenu();
            alert(`User role updated to ${newRole}`);
        } catch (error) {
            console.error('Error changing role:', error);
            alert(error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedUser(null);
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
                const authToken = token;

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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-500 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-semibold text-slate-800 mb-2">Loading Users</p>
                        <p className="text-slate-500">Please wait while we fetch the data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-white">
                <div className="bg-red-50 border border-red-200 rounded-3xl p-10 max-w-md mx-auto text-center shadow-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-red-600 mb-3">Oops! Something went wrong</h3>
                    <p className="text-red-500 leading-relaxed">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="min-h-screen p-6 ">
                <div className="max-w-7xl mx-auto">
                    {/* Enhanced Header Section */}
                    <div className="mb-10">
                        <div className='flex items-center justify-between'>
                            <div className="flex items-center space-x-4 mb-8">
                                {type === 'admins' ? (
                                    <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl border border-amber-200 shadow-lg">
                                        <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl border border-blue-200 shadow-lg">
                                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                )}
                                <div>
                                    <div>
                                        <h1 className="text-4xl font-bold bg-clip-text mb-2">
                                            {type === 'admins' ? 'Administrators' : 'Students'} Management
                                        </h1>
                                        <p className="text-lg">
                                            Manage {type === 'admins' ? 'administrator' : 'student'} accounts and permissions
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mb-6">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => downloadReport('pdf')}
                                        className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 font-medium"
                                    >
                                        <FaDownload className="text-gray-600" size={14} />
                                        Export PDF
                                    </button>
                                    <button
                                        onClick={() => downloadReport('xlsx')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 font-medium"
                                    >
                                        <FaDownload size={14} />
                                        Export Excel
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Users</p>
                                        <p className="text-3xl font-bold text-slate-800 mt-2">{users.length}</p>
                                        <p className="text-indigo-600 text-sm mt-1">Active accounts</p>
                                    </div>
                                    <div className="p-3 bg-indigo-100 rounded-xl">
                                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Active</p>
                                        <p className="text-3xl font-bold text-slate-800 mt-2">{users.filter(u => !u.isBlocked).length}</p>
                                        <p className="text-emerald-600 text-sm mt-1">Unblocked users</p>
                                    </div>
                                    <div className="p-3 bg-emerald-100 rounded-xl">
                                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border border-red-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Blocked</p>
                                        <p className="text-3xl font-bold text-slate-800 mt-2">{users.filter(u => u.isBlocked).length}</p>
                                        <p className="text-red-600 text-sm mt-1">Restricted access</p>
                                    </div>
                                    <div className="p-3 bg-red-100 rounded-xl">
                                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {users.length === 0 && !loading && !error && (
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-8 text-center shadow-lg">
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-amber-700 mb-2">No Users Found</h3>
                                <p className="text-amber-600">
                                    No {type === 'admins' ? 'administrators' : 'students'} found in the system.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Data Grid */}
                    {users.length > 0 && (
                        <div className="h-[calc(100vh-400px)] min-h-[600px]">
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
                                pageSizeOptions={[5, 10, 15, 25, 50]}
                                checkboxSelection
                                disableRowSelectionOnClick
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Role Management Menu */}
            <Menu
                id="role-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                PaperProps={{
                    style: {
                        width: '200px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                }}
            >
                <MenuItem
                    onClick={() => handleChangeRole('admin')}
                    disabled={selectedUser?.role === 'admin' || actionLoading === selectedUser?.id}
                >
                    <div className="flex items-center gap-2 w-full">
                        {selectedUser?.role === 'admin' && (
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        )}
                        <span>Make Admin</span>
                    </div>
                </MenuItem>
                <MenuItem
                    onClick={() => handleChangeRole('user')}
                    disabled={selectedUser?.role === 'user' || actionLoading === selectedUser?.id}
                >
                    <div className="flex items-center gap-2 w-full">
                        {selectedUser?.role === 'user' && (
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        )}
                        <span>Make Regular User</span>
                    </div>
                </MenuItem>
            </Menu>
        </ThemeProvider>
    );
}