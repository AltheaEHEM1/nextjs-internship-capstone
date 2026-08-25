import type * as React from "react";

interface InviteEmailProps {
	teamName?: string;
	inviterName: string;
	inviterEmail?: string;
	acceptLink: string;
	notes?: string | null;
}

export const InviteEmail: React.FC<InviteEmailProps> = ({
	teamName = "Projectnify",
	inviterName,
	inviterEmail,
	acceptLink,
	notes,
}) => (
	<div
		style={{
			backgroundColor: "#f9fafb",
			fontFamily:
				'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
			padding: "40px 20px",
			color: "#1f2937",
		}}
	>
		<div
			style={{
				maxWidth: "560px",
				margin: "0 auto",
				backgroundColor: "#ffffff",
				borderRadius: "8px",
				border: "1px solid #e5e7eb",
				padding: "40px",
			}}
		>
			{/* Heading */}
			<h2
				style={{
					fontSize: "22px",
					fontWeight: "bold",
					color: "#111827",
					margin: "0 0 16px 0",
				}}
			>
				You&apos;ve been invited to join {teamName}!
			</h2>

			{/* Body Copy */}
			<p
				style={{
					fontSize: "16px",
					lineHeight: "24px",
					color: "#4b5563",
					margin: "0 0 4px 0",
				}}
			>
				<strong>{inviterName}</strong> has invited you to collaborate on their
				team. Click the button below to accept and get started.
			</p>

			{/* Inviter Email */}
			{inviterEmail && (
				<p
					style={{
						fontSize: "14px",
						lineHeight: "20px",
						color: "#6b7280",
						margin: "0 0 20px 0",
					}}
				>
					Sent by{" "}
					<a
						href={`mailto:${inviterEmail}`}
						style={{ color: "#2563eb", textDecoration: "none" }}
					>
						{inviterEmail}
					</a>
				</p>
			)}

			{/* Optional Notes Box */}
			{notes && (
				<div
					style={{
						margin: "24px 0",
						padding: "16px",
						backgroundColor: "#f3f4f6",
						borderLeft: "4px solid #2563eb",
						borderRadius: "4px",
						color: "#374151",
						fontSize: "15px",
						fontStyle: "italic",
						lineHeight: "22px",
					}}
				>
					&ldquo;{notes}&rdquo;
				</div>
			)}

			{/* CTA Button */}
			<div style={{ margin: "32px 0 24px 0" }}>
				<a
					href={acceptLink}
					style={{
						backgroundColor: "#2563eb",
						color: "#ffffff",
						padding: "12px 28px",
						borderRadius: "6px",
						textDecoration: "none",
						fontWeight: "600",
						fontSize: "16px",
						display: "inline-block",
						textAlign: "center",
					}}
				>
					Accept Invitation
				</a>
			</div>

			{/* Footer Divider & Notice */}
			<hr
				style={{
					border: "none",
					borderTop: "1px solid #e5e7eb",
					margin: "32px 0 20px 0",
				}}
			/>
			<p
				style={{
					fontSize: "13px",
					color: "#9ca3af",
					lineHeight: "18px",
					margin: "0",
				}}
			>
				If you weren't expecting this invitation, you can safely ignore this
				email.
			</p>
		</div>
	</div>
);
