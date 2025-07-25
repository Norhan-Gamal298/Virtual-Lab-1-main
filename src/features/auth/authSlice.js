import { createSlice } from '@reduxjs/toolkit';

// Helper function to safely parse localStorage items
const getLocalStorageItem = (key) => {
    try {
        const item = localStorage.getItem(key);
        if (item === "undefined") {
            localStorage.removeItem(key);
            return null;
        }
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error parsing localStorage item "${key}":`, error);
        localStorage.removeItem(key);
        return null;
    }
};

const initialState = {
    user: getLocalStorageItem('user'),
    token: localStorage.getItem('token'),
    quizProgress: getLocalStorageItem('quizProgress') || {},
    chapterProgress: getLocalStorageItem('chapterProgress') || {},
    topicProgress: getLocalStorageItem('topicProgress') || {},
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = {
                id: action.payload.user.id,
                firstName: action.payload.user.firstName,
                lastName: action.payload.user.lastName,
                email: action.payload.user.email,
                role: action.payload.user.role,
                createdAt: action.payload.user.createdAt,
                hasProfileImage: action.payload.user.hasProfileImage || false,
                phoneNumber: action.payload.user.phoneNumber,
                gender: action.payload.user.gender,
                country: action.payload.user.country,
                dateOfBirth: action.payload.user.dateOfBirth,
                educationalLevel: action.payload.user.educationalLevel,
                fieldOfStudy: action.payload.user.fieldOfStudy,
                professionalStatus: action.payload.user.professionalStatus,
                emailNotifications: action.payload.user.emailNotifications,
                timeZone: action.payload.user.timeZone,
            };
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('token', action.payload.token);
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        // New action for updating profile image status
        updateProfileImageStatus: (state, action) => {
            if (state.user) {
                state.user.hasProfileImage = action.payload.hasProfileImage;
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
        updateQuizScore: (state, action) => {
            const { quizId, score } = action.payload;
            state.quizProgress = {
                ...state.quizProgress,
                [quizId]: score
            };
            localStorage.setItem('quizProgress', JSON.stringify(state.quizProgress));
        },
        updateChapterProgress: (state, action) => {
            const { chapterId, progress } = action.payload;
            state.chapterProgress = {
                ...state.chapterProgress,
                [chapterId]: progress
            };
            localStorage.setItem('chapterProgress', JSON.stringify(state.chapterProgress));
        },
        markTopicCompleted: (state, action) => {
            const { topicId } = action.payload;
            if (state.user) {
                state.topicProgress[topicId] = true;
                localStorage.setItem('topicProgress', JSON.stringify(state.topicProgress));
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.quizProgress = {};
            state.chapterProgress = {};
            state.topicProgress = {};
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('quizProgress');
            localStorage.removeItem('chapterProgress');
            localStorage.removeItem('topicProgress');
        },
    },
});

export const {
    setCredentials,
    logout,
    updateUser,
    updateProfileImageStatus,
    updateQuizScore,
    updateChapterProgress,
    markTopicCompleted,
} = authSlice.actions;

export default authSlice.reducer;