import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/ApiCalls/fetchers";

// DTO
import { UserProfileDTO } from "user-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";

interface selectUsersTableProps {
    setSelectedUsers: (users: number[]) => void;
}

function SelectUsersTable(props: selectUsersTableProps): React.JSX.Element {
    const [users, setUsers] = useState<UserProfileDTO[]>(null);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    // to do: update the backend when user auth is done to exclude the calling user
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/all_users";

    useEffect(() => {
        fetchGetSet<UserProfileDTO[]>(apiUrl, setUsers);
    });

    function handleUserSelection(userId: number) {
        const newSelectedUsers = updateSelectedUsers(selectedUsers, userId);
        setSelectedUsers(newSelectedUsers);
        props.setSelectedUsers(newSelectedUsers);
    }

    function updateSelectedUsers(prevSelectedUsers: number[], userId: number) {
        return prevSelectedUsers.includes(userId)
            ? prevSelectedUsers.filter((element) => element !== userId)
            : [...prevSelectedUsers, userId];
    }

    if (!users) return <div> Loading data...</div>;

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            selectedUsers.includes(user.id)
    );

    return (
        <div>
            <div className="chatSearchBox">
                <label htmlFor="search" className="h2Left">
                    Select Users
                </label>
                <input
                    className="textInput"
                    type="text"
                    id="search"
                    placeholder="🔎"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "100%" }}
                />
            </div>
            {filteredUsers.length === 0 ? (
                <p className="bigCenterEmoji">👻</p>
            ) : (
                <div className="chatUserListContainer">
                    <table className="chatUserTable">
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    onClick={() => handleUserSelection(user.id)}
                                >
                                    <td style={{ width: "30px", textAlign: "center" }}>
                                        {user.online ? "🟢" : "🔴"}
                                    </td>
                                    <td>{user.name}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            readOnly
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SelectUsersTable;
