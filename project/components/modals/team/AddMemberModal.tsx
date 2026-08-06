"use client";

import { UserPlus } from "lucide-react";
import BaseModal from "@/components/layout/BaseModal";
import { useTeamStore } from "@/stores/team/useTeamStore";
import { useTeamManagement } from "@/hooks/team/useTeamManagement";

interface AddMemberProps {
  opened: boolean;
  onClose: () => void;
}

export default function AddMemberModal({ opened, onClose }: AddMemberProps) {
  const addPeopleContact = useTeamStore((s) => s.addPeopleContact);
  const setAddPeopleContact = useTeamStore((s) => s.setAddPeopleContact);
  const addPeopleNotes = useTeamStore((s) => s.addPeopleNotes);
  const setAddPeopleNotes = useTeamStore((s) => s.setAddPeopleNotes);
  const { handleSendInvites } = useTeamManagement();

  return (
    <BaseModal
      opened={opened}
      onClose={onClose}
      width={500}
      title={
        <div className="flex items-center gap-2">
          <UserPlus size={22} style={{ color: "#1e9b65" }} />
          <span>Add People</span>
        </div>
      }
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-platinum-300 dark:hover:bg-outer_space-400 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSendInvites}
            className="rounded-lg bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 transition"
          >
            Send Invites
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-outer_space-500 dark:text-platinum-300">
              Names or Emails
            </label>
            <input
              type="text"
              placeholder="name@srg.tech, Jane Doe..."
              value={addPeopleContact}
              onChange={(e) => setAddPeopleContact(e.target.value)}
              className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm dark:bg-outer_space-400 dark:border-payne's_gray-600 dark:text-platinum-100"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-outer_space-500 dark:text-platinum-300">
              Notes (Optional)
            </label>
            <textarea
              placeholder="Add optional assignment context..."
              value={addPeopleNotes}
              onChange={(e) => setAddPeopleNotes(e.target.value)}
              className="w-full mt-1 rounded-lg border border-french_gray-300 p-2 text-sm dark:bg-outer_space-400 dark:border-payne's_gray-600 dark:text-platinum-100"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}