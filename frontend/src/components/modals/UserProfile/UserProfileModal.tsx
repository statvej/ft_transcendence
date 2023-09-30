import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { UserProfileDTO } from "user-dto";
import "src/styles/modals.css";
import { getAvatar } from "src/ApiCalls/userActions";
import { authContentHeader } from "src/ApiCalls/headers";

function UserProfileModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserProfileDTO | null>(null);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  async function fetchData() {
    if (modalIsOpen) {
      try {
        const url = process.env.REACT_APP_BACKEND_URL + "/user/profile?id=1";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response);
        const data = await response.json();
        setUserData(data);
        const thisId = 1;
        await getAvatar(thisId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [modalIsOpen]);

  function handleAvatarChange() {
    console.log("kundeling");
  }

  async function handleNameChange() {
    try {
      const thisId = 1;
      const newName = prompt("Enter a new name:");

      if (newName === null || newName.trim() === "") {
        return;
      }
      const data = {
        id: thisId,
        newName: newName,
      };
      await fetch(process.env.REACT_APP_BACKEND_URL + "/user/change_name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <button onClick={openModal}>My Profile</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="My Profile Modal"
        className="modal"
		overlayClassName="modal-overlay"
      >
        {userData ? (
          <div>
            <h2 className="modal-h2">
              {userData.name}
              <button className="button-edit" onClick={handleNameChange}>
                ✎
              </button>
            </h2>
            <p className="modal-p">
              {userData.avatarURL ? (
                <img src={userData.avatarURL} className="img-avatar" alt="User Avatar" />
              ) : (
                <p>No profile picture available</p>
              )}
            </p>
            <table className="modals-table">
              <thead className="modals-table">
                <tr>
                  <th className="modals-table">mmr</th>
                  <th className="modals-table">rank</th>
                  <th className="modals-table">matches</th>
                  <th className="modals-table">win rate</th>
                </tr>
              </thead>
              <tbody>
                <td className="modals-table">{userData.mmr}</td>
                <td className="modals-table">{userData.rank}</td>
                <td className="modals-table">{userData.matches}</td>
                <td className="modals-table">{userData.winrate}</td>
              </tbody>
            </table>
            <br></br>

            <button className="button-big" onClick={handleAvatarChange}>
              Change Avatar
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="button-big"
            />
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
        <button onClick={closeModal} className="button-close">
          ❌
        </button>
      </Modal>
    </div>
  );
}

export default UserProfileModal;
