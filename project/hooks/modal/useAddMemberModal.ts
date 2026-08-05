import { useState } from "react";

export interface UseAddMemberModalParams {
	onClose: () => void;
}

export function useAddMemberModal({ onClose }: UseAddMemberModalParams) {
	const [contact, setContact] = useState("");
	const [notes, setNotes] = useState("");

	const handleSendInvites = () => {
		// Placeholder: In a real app, you would send invites here.
		console.log({ contact, notes });
		// Close the modal after sending.
		onClose();
	};

	return {
		contact,
		setContact,
		notes,
		setNotes,
		handleSendInvites,
	};
}
