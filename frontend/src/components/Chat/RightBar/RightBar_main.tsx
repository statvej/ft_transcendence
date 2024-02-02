import React from "react";
import MemberList from "./MemberList";

// DTO
import { ChatInfoDTO, ChatUserDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";
import MemberInfo from "./MemberInfo";

interface rightBarProps {
    selectedChat: ChatInfoDTO | null;
    selectedMember: ChatUserDTO | null;
    setSelectedMember: React.Dispatch<React.SetStateAction<ChatUserDTO | null>>;
}

function RightBar(props: rightBarProps): React.JSX.Element {
    return (
        <div className="sideBar">
            {props.selectedChat && (
                <MemberList
                    selectedChat={props.selectedChat}
                    onSelectMember={props.setSelectedMember}
                />
            )}
            {props.selectedMember && <MemberInfo member={props.selectedMember} />}
        </div>
    );
}

export default RightBar;
