import type * as React from "react";

interface InviteEmailProps {
	teamName?: string;
	inviterName: string;
	acceptLink: string;
	notes?: string | null;
}

export const InviteEmail: React.FC<InviteEmailProps> = ({
	teamName = "Projectnify",
	inviterName,
	acceptLink,
	notes,
}) => (
	<div style={{ fontFamily: "sans-serif", padding: "24px", color: "#333" }}>
		<h2>You&apos;ve been invited to join {teamName}!</h2>
		<p>
			<strong>{inviterName}</strong> has invited you to collaborate on their
			team.
		</p>

		{notes && (
			<div
				style={{
					margin: "16px 0",
					padding: "12px 16px",
					backgroundColor: "#f4f4f5",
					borderLeft: "4px solid #0070f3",
					borderRadius: "4px",
					color: "#555",
					fontSize: "14px",
					fontStyle: "italic",
				}}
			>
				&ldquo;{notes}&rdquo;
			</div>
		)}

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
				Accept Invitation
			</a>
		</div>
	</div>
);
