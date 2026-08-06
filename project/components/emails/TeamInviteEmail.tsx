import type * as React from "react";

interface TeamInviteEmailProps {
  teamName?: string;
  inviterName: string;
  acceptLink: string;
}

export const TeamInviteEmail: React.FC<TeamInviteEmailProps> = ({
  teamName = "our team",
  inviterName,
  acceptLink,
}) => (
  <div style={{ fontFamily: "sans-serif", padding: "24px", color: "#333" }}>
    <h2>You&apos;ve been invited to join {teamName}!</h2>
    <p>
      <strong>{inviterName}</strong> has invited you to collaborate on their team.
    </p>
    <div style={{ marginTop: "24px" }}>
      <a
        href={acceptLink}
        style={{
          backgroundColor: "#0070f3",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        Respond to Invitation
      </a>
    </div>
  </div>
);